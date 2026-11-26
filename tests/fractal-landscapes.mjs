// Checks for fractal-landscapes/model.js (PR #42, 1D midpoint-displacement landscapes).
// Run: node tests/fractal-landscapes.mjs   (also run by tests/run.mjs)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { generate, variogram, fitH, dyadicLags, estimateH, exactAlignedVariance } = require('../fractal-landscapes/model.js');
const { mulberry32 } = require('../turbulence/model.js');

let fails = 0;
function check(name, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}`);
  if (!ok) fails++;
}
const mean = v => v.reduce((a, b) => a + b, 0) / v.length;
const sd = v => { const m = mean(v); return Math.sqrt(v.reduce((s, x) => s + (x - m) * (x - m), 0) / (v.length - 1)); };
const seedStream = (seed, R) => { const rng = mulberry32(seed); return Array.from({ length: R }, () => Math.floor(rng() * 2 ** 32)); };

// --- validation and exact repeatability ---
{
  const bad = [[1, 0.5], [25, 0.5], [2.5, 0.5], ['8', 0.5], [2, 0], [2, 1], [2, NaN], [2, Infinity]];
  const threw = bad.every(([n, H]) => { try { generate(n, H); return false; } catch (e) { return e instanceof RangeError; } });
  let estThrew = false; try { estimateH([0, 0, 0, 0, 0]); } catch (e) { estThrew = e instanceof RangeError; }
  let fitThrew = false; try { fitH([{ lag: 1, v: 1 }]); } catch (e) { fitThrew = e instanceof RangeError; }
  const a = generate(8, 0.5, 42), b = generate(8, 0.5, 42);
  const same = a.length === 257 && a.every((v, i) => v === b[i]) && a[0] === 0;
  const vg = variogram(generate(4, 0.5, 1), [1, 2]);
  check('validation + exact repeatability', threw && estThrew && fitThrew && same && vg.length === 2 && vg.every(p => p.v > 0),
    `RangeError on bad (n,H): ${threw}; estimateH/fitH throw on too few lags/points: ${estThrew && fitThrew}; ` +
    `same seed gives identical y (len ${a.length}, y[0]=${a[0]}): ${same}; variogram ok: ${vg.length === 2 && vg.every(p => p.v > 0)}`);
}

// --- fitH regression on an exact power law, lags 1..64 dyadic ---
for (const H of [0.25, 0.5, 0.75]) {
  const pts = dyadicLags(64, 64).map(lag => ({ lag, v: 3.7 * Math.pow(lag, 2 * H) }));
  const est = fitH(pts);
  check(`fitH regression on v = 3.7 lag^(2H), H=${H}`, Math.abs(est - H) < 1e-12,
    `fitH over ${pts.length} points = ${est}, |err| = ${Math.abs(est - H).toExponential(2)}`);
}

// --- exact moments, deterministic ---
{
  const n = 8, N = 1 << n;
  for (const H of [0.25, 0.5, 0.75]) {
    let maxRel = 0;
    for (const l of dyadicLags(N, N / 2)) {
      const closed = (4 / 3) / (Math.pow(2, 2 - 2 * H) - 1) * (Math.pow(l / N, 2 * H) - Math.pow(l / N, 2));
      maxRel = Math.max(maxRel, Math.abs(exactAlignedVariance(n, H, l, { pinned: true }) - closed) / Math.abs(closed));
    }
    check(`exactAlignedVariance (pinned, n=8, H=${H}) vs closed form, lags 1..N/2`, maxRel < 1e-9,
      `max relative error over dyadic lags 1..${N / 2}: ${maxRel.toExponential(2)}`);
  }
  const lags = dyadicLags(N, N / 16);
  const est = fitH(lags.map(l => ({ lag: l, v: exactAlignedVariance(n, 0.5, l) })));
  check('free end H=0.5: fitH over exact aligned variances, lags 1..N/16', Math.abs(est - 0.5) < 1e-9,
    `fitH = ${est}, |err| = ${Math.abs(est - 0.5).toExponential(2)}`);
}

// --- generator vs exact moments, statistical (free end, n=8, R=400, one mulberry32(20261126) stream) ---
{
  const n = 8, N = 1 << n, R = 400, lags = [1, 4, 16];
  const seeds = seedStream(20261126, 3 * R);
  let si = 0, allOk = true; const lines = [];
  const mutLines = []; let mutRejected = true;
  for (const H of [0.25, 0.5, 0.75]) {
    const means = lags.map(() => []), sums = lags.map(() => []);
    for (let r = 0; r < R; r++) {
      const y = generate(n, H, seeds[si++]);
      for (let k = 0; k < lags.length; k++) {
        const lag = lags[k]; let s = 0, cnt = 0;
        for (let i = 0; i + lag <= N; i += lag) { const d = y[i + lag] - y[i]; s += d * d; cnt++; }
        means[k].push(s / cnt); sums[k].push(s); // mean over aligned pairs, and the sum-instead-of-mean mutant
      }
    }
    for (let k = 0; k < lags.length; k++) {
      const m = mean(means[k]), se = sd(means[k]) / Math.sqrt(R);
      const exact = exactAlignedVariance(n, H, lags[k]);
      const z = (m - exact) / se;
      lines.push(`lag ${lags[k]}: mean ${m.toFixed(6)} vs exact ${exact.toFixed(6)}, SE ${se.toFixed(6)}, z ${z.toFixed(2)}`);
      if (!(Math.abs(m - exact) < 4 * se)) allOk = false;
      const mm = mean(sums[k]);
      mutLines.push(`H=${H} lag ${lags[k]}: sum-mutant deviates ${(mm - exact).toFixed(3)} = ${((mm - exact) / se).toFixed(0)} SE`);
      if (!(Math.abs(mm - exact) >= 4 * se)) mutRejected = false;
    }
  }
  check('generator matches exact aligned variances (free end, n=8, R=400)', allOk, lines.join(' | '));
  check('sum-instead-of-mean mutant is rejected', mutRejected, mutLines.join(' | '));
}

// --- estimator calibration (free end, n=11, R=200 per H, seeds from one mulberry32(7) stream) ---
// CALIBRATED: 3000-run mean estimate per H from /workspace/cr-fractals-vibe/calib42.mjs
// (n=11, free end, seeds from one mulberry32(99) stream, H taken in the order 0.25, 0.5, 0.75).
const CALIBRATED = { 0.25: 0.29347881503407114, 0.5: 0.4969491171016194, 0.75: 0.7353644317462792 };
{
  const R = 200, n = 11;
  const seeds = seedStream(7, 3 * R);
  let si = 0;
  for (const H of [0.25, 0.5, 0.75]) {
    const ests = Array.from({ length: R }, () => estimateH(generate(n, H, seeds[si++])));
    const m = mean(ests), se = sd(ests) / Math.sqrt(R), bias = m - H;
    check(`calibration n=11 free end H=${H} (R=200)`, Math.abs(m - CALIBRATED[H]) < 4 * se,
      `mean ${m.toFixed(4)}, SE ${se.toFixed(4)}, bias ${bias.toFixed(4)}; CALIBRATED[H] ${CALIBRATED[H]}, ` +
      `|diff| ${Math.abs(m - CALIBRATED[H]).toFixed(4)} < 4 SE = ${(4 * se).toFixed(4)}`);
    console.log(`      2 - H_est (assumes D = 2 - H; not a measurement of D): ${(2 - m).toFixed(4)}`);
  }
}

// --- exact fBm control: Cholesky factorisation of the fBm covariance on t = 1..N (N=256), y[0]=0 ---
{
  const N = 256, R = 200;
  const rng = mulberry32(31337);
  for (const H of [0.25, 0.5, 0.75]) {
    const C = Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => {
      const s = i + 1, t = j + 1;
      return 0.5 * (Math.pow(s, 2 * H) + Math.pow(t, 2 * H) - Math.pow(Math.abs(s - t), 2 * H));
    }));
    const L = Array.from({ length: N }, () => new Float64Array(N)); // Cholesky: C = L L^T
    for (let i = 0; i < N; i++) for (let j = 0; j <= i; j++) {
      let s = C[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = j === i ? Math.sqrt(s) : s / L[j][j];
    }
    const biases = [];
    for (let r = 0; r < R; r++) {
      const z = new Float64Array(N); // gaussian draws from mulberry32 via Box-Muller
      for (let i = 0; i < N; i += 2) {
        const u1 = 1 - rng(), u2 = rng(), rad = Math.sqrt(-2 * Math.log(u1));
        z[i] = rad * Math.cos(2 * Math.PI * u2);
        if (i + 1 < N) z[i + 1] = rad * Math.sin(2 * Math.PI * u2);
      }
      const y = new Array(N + 1); y[0] = 0;
      for (let i = 0; i < N; i++) { let s = 0; for (let k = 0; k <= i; k++) s += L[i][k] * z[k]; y[i + 1] = s; }
      biases.push(estimateH(y) - H);
    }
    const mb = mean(biases), se = sd(biases) / Math.sqrt(R);
    check(`exact fBm control H=${H} (Cholesky, N=256, R=200)`, Number.isFinite(mb) && Math.abs(mb) < 0.05,
      `estimator mean bias on exact fBm: ${mb.toFixed(4)} (SE ${se.toFixed(4)})`);
  }
}

// --- pinned bridge, informational ---
{
  const R = 200, n = 11, H = 0.75;
  const ests = seedStream(555, R).map(s => estimateH(generate(n, H, s, { pinned: true })));
  const m = mean(ests);
  console.log(`INFO  pinned bridge n=11 H=0.75 (R=200): mean estimate ${m.toFixed(4)} (bias ${(m - H).toFixed(4)}, informational)`);
}

if (fails) { console.log(`\n${fails} check(s) failed`); process.exit(1); }
else console.log('\nall checks pass');
