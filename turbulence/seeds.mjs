// The spread over random seeds behind the README's seed figures: the test's run over 32 seeds (the 4/5 law's
// deviation and the exponents), and the viscosity scan over 8 seeds (the slope of the cascade's width against Re).
// Usage: node turbulence/seeds.mjs ci     (32 seeds of the test's run, about a minute)
//        node turbulence/seeds.mjs scan   (8 seeds of the four-viscosity scan, about 3 minutes)
//        node turbulence/seeds.mjs        (both)
import { createRequire } from 'node:module';
const T = createRequire(import.meta.url)('./model.js');
const mode = process.argv[2] || 'both', f3 = x => x.toFixed(3), f4 = x => x.toFixed(4);
const mean = v => v.reduce((a, x) => a + x, 0) / v.length, sd = v => Math.sqrt(v.reduce((a, x) => a + (x - mean(v)) ** 2, 0) / (v.length - 1));
const median = v => { const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

if (mode === 'ci' || mode === 'both') {
  const rows = [];
  for (let seed = 1; seed <= 32; seed++) {
    const res = T.simulate({ ...T.RUNS.CI, seed }), a = T.analyse(res), k = res.model.k, av = a.av;
    rows.push({ law: Math.max(...[1, 2, 3, 4, 5].map(n => Math.abs(3 * k[n + 2] * av.Sig[n] / a.plateau - (1 - Math.pow(-0.5, n))))),
      z2: a.zeta.essF[1], z4: a.zeta.essF[3], z6: a.zeta.essF[5], gap: a.nd - a.nEta });
  }
  const law = rows.map(r => r.law);
  console.log(`The test's run over 32 seeds: largest 4/5-law deviation in shells 1-5, median ${f4(median(law))}, maximum ${f4(Math.max(...law))}; ` +
    `${law.filter(x => x > 0.005).length} of 32 above 0.005, ${law.filter(x => x > 0.01).length} above 0.01.`);
  for (const k of ['z2', 'z4', 'z6']) console.log(`  zeta_${k[1]}: mean ${f4(mean(rows.map(r => r[k])))}, SD ${f4(sd(rows.map(r => r[k])))}`);
  console.log(`  flux half-point minus k_eta: ${f3(Math.min(...rows.map(r => r.gap)))} to ${f3(Math.max(...rows.map(r => r.gap)))} shells`);
}

if (mode === 'scan' || mode === 'both') {
  const cuts = { 'flux 75%': [], 'flux 50%': [], 'flux 25%': [], 'spectrum 50%': [], 'spectrum 25%': [] }, weighted = [];
  for (let seed = 1; seed <= 8; seed++) {
    const xs = [], ys = {}, nd = [], ne = [];
    for (const k of Object.keys(cuts)) ys[k] = [];
    for (const cfg of T.RUNS.SCAN) {
      const q = T.analyse(T.simulate({ ...cfg, seed })), dec = n => n * Math.log10(2);
      xs.push(Math.log10(q.Re)); nd.push(dec(q.nd)); ne.push(dec(q.ndErr));
      for (const f of [0.75, 0.5, 0.25]) ys[`flux ${f * 100}%`].push(dec(T.fluxCut(q.av, q.eps, f)));
      for (const f of [0.5, 0.25]) ys[`spectrum ${f * 100}%`].push(dec(T.spectralCut(q.av, q.n1, q.n2, f)));
    }
    for (const k of Object.keys(cuts)) cuts[k].push(T.linfit(xs, ys[k]).slope);
    const w = ne.map(e => 1 / (e * e)), W = mean(w) * w.length, mx = xs.reduce((a, x, i) => a + w[i] * x, 0) / W, my = nd.reduce((a, y, i) => a + w[i] * y, 0) / W;
    weighted.push(xs.reduce((a, x, i) => a + w[i] * (x - mx) * (nd[i] - my), 0) / xs.reduce((a, x, i) => a + w[i] * (x - mx) ** 2, 0));
  }
  console.log('\nThe viscosity scan (every viscosity at 8 blocks) over 8 seeds: width against log10 Re, by cut');
  for (const [k, v] of Object.entries(cuts)) console.log(`  ${k.padEnd(13)} ${v.map(f3).join(' ')}   mean ${f3(mean(v))}, SD ${f3(sd(v))}`);
  const all = Object.values(cuts).flat();
  console.log(`  all cuts and seeds: ${f3(Math.min(...all))} to ${f3(Math.max(...all))}; flux half-point weighted by its errors: mean ${f3(mean(weighted))}, SD ${f3(sd(weighted))}`);
  console.log('  (The spectrum cut at three quarters falls near the end of the fit range at nu = 1e-5 and is left out.)');
}
