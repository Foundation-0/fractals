// Cloud edges: which dimension a perimeter-area relation measures, on Gaussian random surfaces.
// Usage: node turbulence/edges.mjs          (L = 2048, 32 fields per spectrum, up to 4 worker threads; about a minute)
//        node turbulence/edges.mjs quick    (L = 256, 12 fields per spectrum, one thread; about a second)
import { createRequire } from 'node:module';
import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import os from 'node:os';
const C = createRequire(import.meta.url)('./contours.js');

const SEED = 2026, BETAS = [2.4, 8 / 3, 2.8, 3, 3.4, 11 / 3], FALGARONE = [1.36, 0.02];
const job = ({ L, beta, pair, yardMax }, ws) => C.gaussianFields(L, beta, SEED, pair, ws).map(f => C.fieldRecord(f, L, { yardMax }));

if (!isMainThread) {
  const ws = {};
  parentPort.on('message', m => (m === 'done' ? process.exit(0) : parentPort.postMessage({ id: m.id, recs: job(m, ws) })));
} else {
  const quick = process.argv[2] === 'quick';
  const cfg = quick ? { L: 256, pairs: 6, yardMax: 8, workers: 1 } : { L: 2048, pairs: 16, yardMax: 32, workers: Math.min(4, os.availableParallelism ? os.availableParallelism() : os.cpus().length) };
  const jobs = [];
  for (const beta of BETAS) for (let pair = 0; pair < cfg.pairs; pair++) jobs.push({ L: cfg.L, beta, pair, yardMax: cfg.yardMax });
  const t0 = Date.now(), results = await run(jobs, cfg.workers);
  const f3 = x => x.toFixed(3), name = b => (Math.abs(b - 8 / 3) < 1e-9 ? '8/3' : Math.abs(b - 11 / 3) < 1e-9 ? '11/3' : String(b));
  const pm = r => `${f3(r.D)} +- ${f3(r.se)} +- ${f3(r.win)}`, sig = r => Math.hypot(r.se, r.win);
  console.log(`Gaussian random surfaces, power spectrum |k|^-beta, H = (beta - 2)/2: L = ${cfg.L}, ${2 * cfg.pairs} fields per spectrum ` +
    `(the same random numbers for each), contours at the mean level (${((Date.now() - t0) / 1e3).toFixed(1)} s, ${cfg.workers} thread${cfg.workers > 1 ? 's' : ''})`);
  console.log(`Loops fitted over R_g in [${C.loopWindows(cfg.L)[0]}] cells; errors: jackknife over fields, then half the spread over ${C.loopWindows(cfg.L).length} fit windows.\n`);
  const rows = BETAS.map(beta => { const recs = results.filter((_, i) => jobs[i].beta === beta).flat(); return { beta, th: C.theory(beta), e: C.estimate(recs, cfg.L, cfg.yardMax) }; });

  console.log('One loop: perimeter against size, P ~ R_g^D, and against area, P ~ A^(D/2); the median level; clouds counted with their holes');
  console.log('  beta     H   (3-H)/2   2-H        P ~ R_g^D                P ~ A^(D/2)        median level, P~R_g    clouds with holes');
  for (const { beta, th, e } of rows) {
    console.log(`  ${name(beta).padEnd(5)} ${f3(th.H)} ${f3(th.loop).padStart(8)} ${f3(th.set).padStart(6)}   ${pm(e.loops).padEnd(24)} ${pm(e.area).padEnd(24)} ${pm(e.median).padEnd(22)} ${pm(e.clouds)}`);
  }
  console.log('\nAll the contours at the level together: total length on every s-th grid point, l(s) ~ s^(1 - D)');
  console.log('  beta   yardstick D              2-H     H_eff (yardstick range)   2-H_eff');
  for (const { beta, th, e } of rows) console.log(`  ${name(beta).padEnd(5)}  ${pm(e.yard).padEnd(24)} ${f3(th.set)}  ${f3(e.HeffYard.D).padStart(10)}               ${f3(2 - e.HeffYard.D)}`);

  console.log('\nThe box makes the fields smoother than their spectrum says: H_eff, half the log slope of the structure function');
  console.log('<(f(x + r) - f(x))^2> over the loop range, is what the loops see. Loops against each formula, z = (D - formula) / sigma:');
  console.log('  beta   H_eff   (3-H_eff)/2   2-H_eff   z vs (3-H)/2   z vs 2-H   z vs (3-H_eff)/2   z vs 2-H_eff');
  for (const { beta, th, e } of rows) {
    const h = e.HeffLoop.D, z = x => ((e.loops.D - x) / sig(e.loops)).toFixed(1);
    console.log(`  ${name(beta).padEnd(5)}  ${f3(h)}  ${f3((3 - h) / 2).padStart(11)}  ${f3(2 - h).padStart(8)}  ${z(th.loop).padStart(13)}  ${z(th.set).padStart(9)}  ${z((3 - h) / 2).padStart(17)}  ${z(2 - h).padStart(13)}`);
  }
  const fit = C.wlsq(rows.map(r => r.e.HeffLoop.D), rows.map(r => r.e.loops.D), rows.map(r => sig(r.e.loops)));
  const off = rows.map(r => r.e.loops.D - (3 - r.e.HeffLoop.D) / 2), w = rows.map(r => 1 / sig(r.e.loops) ** 2);
  const meanOff = off.reduce((a, x, i) => a + x * w[i], 0) / w.reduce((a, x) => a + x, 0);
  console.log(`\nAcross the six spectra, D against H_eff: slope ${f3(fit.slope)} +- ${f3(fit.slopeErr)} (Kondev-Henley -1/2, Mandelbrot -1; ` +
    `${((fit.slope + 1) / fit.slopeErr).toFixed(1)} sigma from -1), chi^2 ${fit.chi2.toFixed(1)} for 4 degrees of freedom.`);
  console.log(`Loops sit ${meanOff >= 0 ? '+' : ''}${f3(meanOff)} above (3-H_eff)/2 on average (weighted).`);

  // Which spectrum gives Falgarone et al.'s 1.36 +- 0.02? The loop dimension falls with beta; interpolate linearly.
  const betaAt = D => { for (let i = 0; i + 1 < rows.length; i++) { const a = rows[i], b = rows[i + 1]; if ((a.e.loops.D - D) * (b.e.loops.D - D) <= 0) return a.beta + (D - a.e.loops.D) * (b.beta - a.beta) / (b.e.loops.D - a.e.loops.D); } return NaN; };
  const [D0, dD] = FALGARONE;
  console.log(`\nCloud edges, D = ${D0} +- ${dD} (Falgarone, Phillips & Walker 1991): on these surfaces that is beta ${f3(betaAt(D0 + dD))} to ${f3(betaAt(D0 - dD))} ` +
    `(${f3(betaAt(D0))} at ${D0}); (3-H)/2 alone would say ${f3(8 - 4 * D0)}, 2-H ${f3(6 - 2 * D0)}.`);
  const row = b => rows.find(r => Math.abs(r.beta - b) < 1e-9).e.loops.D;
  console.log(`Projected Kolmogorov density (beta 11/3): ${f3(row(11 / 3))}. A planar slice of it (beta 8/3): ${f3(row(8 / 3))}. CO maps (beta ~ 2.8): ${f3(row(2.8))}.`);
  console.log(`Per field: ${rows.map(r => `${name(r.beta)}: ${r.e.nLoops.toFixed(0)} loops, ${r.e.nWrap.toFixed(2)} around the torus`).join('; ')}.`);
}

async function run(jobs, nWorkers) {
  const out = new Array(jobs.length);
  if (nWorkers <= 1) { const ws = {}; jobs.forEach((j, i) => { out[i] = job(j, ws); }); return out; }
  await new Promise((resolve, reject) => {
    let next = 0, done = 0;
    const feed = w => { if (next < jobs.length) { const i = next++; w.postMessage({ id: i, ...jobs[i] }); } else w.postMessage('done'); };
    for (let k = 0; k < Math.min(nWorkers, jobs.length); k++) {
      const w = new Worker(new URL(import.meta.url));
      w.on('message', m => { out[m.id] = m.recs; if (++done === jobs.length) resolve(); feed(w); });
      w.on('error', reject);
      feed(w);
    }
  });
  return out;
}
