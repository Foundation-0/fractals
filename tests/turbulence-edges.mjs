// Checks the contour-loop machinery behind the cloud-edge question (turbulence/contours.js): the FFT, the random
// surfaces, the marching squares, and which dimension a perimeter-area fit measures. Run: npm test.
// Each check states the source, the expected value, the model's value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const C = require('../turbulence/contours.js');

let fails = 0;
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const e1 = x => x.toExponential(1), f3 = x => x.toFixed(3), near = (a, b, t) => Math.abs(a - b) <= t;
const SEED = 2026;

// 1. The pieces. FFT against the direct sum, Parseval and the round trip.
const rnd = C.gaussian(C.stream(SEED, 0, 1 << 20)), n1 = 64, xr = Float64Array.from({ length: n1 }, rnd), xi = Float64Array.from({ length: n1 }, rnd);
const yr = Float64Array.from(xr), yi = Float64Array.from(xi); C.fft(yr, yi, false);
let dft = 0;
for (let k = 0; k < n1; k++) {
  let sr = 0, si = 0;
  for (let t = 0; t < n1; t++) { const th = -2 * Math.PI * k * t / n1; sr += xr[t] * Math.cos(th) - xi[t] * Math.sin(th); si += xr[t] * Math.sin(th) + xi[t] * Math.cos(th); }
  dft = Math.max(dft, Math.abs(sr - yr[k]), Math.abs(si - yi[k]));
}
const L2 = 128, N2 = L2 * L2, zr = Float64Array.from({ length: N2 }, rnd), zi = Float64Array.from({ length: N2 }, rnd), wr = Float64Array.from(zr), wi = Float64Array.from(zi);
C.fft2(wr, wi, L2, false);
let ex = 0, eX = 0; for (let i = 0; i < N2; i++) { ex += zr[i] ** 2 + zi[i] ** 2; eX += wr[i] ** 2 + wi[i] ** 2; }
C.fft2(wr, wi, L2, true);
let trip = 0; for (let i = 0; i < N2; i++) trip = Math.max(trip, Math.abs(wr[i] - zr[i]), Math.abs(wi[i] - zi[i]));
check('FFT equals the direct DFT sum (N = 64); 2D FFT keeps Parseval and inverts itself (128 x 128)', dft < 1e-12 && Math.abs(ex - eX / N2) / ex < 1e-12 && trip < 1e-12,
  `DFT ${e1(dft)}, Parseval ${e1(Math.abs(ex - eX / N2) / ex)}, round trip ${e1(trip)} (each under 1e-12)`, 'definition of the DFT');

// The random numbers: each pair of fields takes its own consecutive block of the generator's cycle.
// That holds only if the normals use exactly two uniforms per pair, which is checked too.
const s0 = C.stream(7, 0, 4), s1 = C.stream(7, 1, 4), b0 = [...Array(5)].map(() => s0()), b1 = s1();
let threw = false; try { C.stream(7, 2, 2 ** 31); } catch (e) { threw = true; }
let draws = 0; const counted = C.stream(7, 0, 64), g10 = C.gaussian(() => (draws++, counted())); for (let i = 0; i < 10; i++) g10();
check('Random streams: block 1 starts where block 0 ends, overlapping blocks are refused, and 10 normals use 10 uniforms',
  b0[4] === b1 && threw && draws === 10, `5th draw of block 0 = 1st draw of block 1: ${b0[4] === b1}; overlapping request refused: ${threw}; uniforms for 10 normals: ${draws}`,
  'mulberry32 advances its state by a fixed odd step');

// The surfaces, against a naive synthesis: the same normals, the filter |k|^(-beta/2), an O(N^2) inverse DFT.
function naive(L, beta, pair) {
  const N = L * L, g = C.gaussian(C.stream(SEED, pair, 2 * N)), Wr = new Float64Array(N), Wi = new Float64Array(N), kof = i => (i <= L / 2 ? i : i - L);
  for (let v = 0; v < N; v++) { Wr[v] = g(); Wi[v] = g(); }
  for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) { const k = Math.hypot(kof(i), kof(j)), F = k ? Math.pow(k, -beta / 2) : 0; Wr[j * L + i] *= F; Wi[j * L + i] *= F; }
  const fr = new Float64Array(N), fi = new Float64Array(N);
  for (let y = 0; y < L; y++) for (let x = 0; x < L; x++) {
    let sr = 0, si = 0;
    for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) { const th = 2 * Math.PI * (i * x + j * y) / L, c = Math.cos(th), s = Math.sin(th); sr += Wr[j * L + i] * c - Wi[j * L + i] * s; si += Wr[j * L + i] * s + Wi[j * L + i] * c; }
    fr[y * L + x] = sr; fi[y * L + x] = si;
  }
  return [C.normalise(fr), C.normalise(fi)];
}
let synth = 0;
for (const [L, beta, pair] of [[16, 3, 0], [16, 2.4, 3]]) { const a = C.gaussianFields(L, beta, SEED, pair), b = naive(L, beta, pair); for (let k = 0; k < 2; k++) for (let i = 0; i < L * L; i++) synth = Math.max(synth, Math.abs(a[k][i] - b[k][i])); }
const slopes = [2.4, 3, 11 / 3].map(beta => C.gaussianFields(512, beta, SEED, 0).map(f => {
  const sp = C.radialSpectrum(f, 512), xs = [], ys = []; sp.k.forEach((k, i) => { if (k >= 2 && k <= 128) { xs.push(Math.log(k)); ys.push(Math.log(sp.P[i])); } }); return [beta, -C.lsq(xs, ys).slope];
})).flat();
check('Surfaces equal a naive synthesis (L = 16), and their power spectra recover beta (L = 512, 2 <= |k| <= 128)', synth < 1e-10 && slopes.every(([b, s]) => near(s, b, 0.06)),
  `largest difference ${e1(synth)} (under 1e-10); fitted beta ${slopes.map(([b, s]) => `${f3(s)} for ${f3(b)}`).join(', ')} (+- 0.06)`, 'construction');

// Marching squares on shapes with known answers.
const L3 = 128, r0 = 20.3, circle = (cx, cy) => { const f = new Float64Array(L3 * L3); for (let y = 0; y < L3; y++) for (let x = 0; x < L3; x++) { const dx = ((x - cx + L3 / 2) % L3 + L3) % L3 - L3 / 2, dy = ((y - cy + L3 / 2) % L3 + L3) % L3 - L3 / 2; f[y * L3 + x] = r0 - Math.hypot(dx, dy); } return f; };
const mid = C.contours(circle(63.4, 64.7), L3, 0), corner = C.contours(circle(0.4, 127.7), L3, 0);
check('A cone cut at r0 = 20.3: one loop with P = 2 pi r0, A = pi r0^2, R_g = r0; the same circle across both seams of the torus is identical',
  mid.P.length === 1 && near(mid.P[0] / (2 * Math.PI * r0), 1, 0.003) && near(mid.A[0] / (Math.PI * r0 * r0), 1, 0.003) && near(mid.Rg[0] / r0, 1, 0.003) &&
  corner.P.length === 1 && corner.nWrap === 0 && Math.abs(corner.P[0] - mid.P[0]) < 1e-6 && Math.abs(corner.A[0] - mid.A[0]) < 1e-3,
  `P/2pi r0 ${(mid.P[0] / (2 * Math.PI * r0)).toFixed(5)}, A/pi r0^2 ${(mid.A[0] / (Math.PI * r0 * r0)).toFixed(5)}, R_g/r0 ${(mid.Rg[0] / r0).toFixed(5)} (1 +- 0.003); across the seams P ${corner.P[0].toFixed(4)} vs ${mid.P[0].toFixed(4)}`, 'a circle');
const L4 = 64, band = new Float64Array(L4 * L4), diag = new Float64Array(L4 * L4);
for (let y = 0; y < L4; y++) for (let x = 0; x < L4; x++) { band[y * L4 + x] = Math.sin(2 * Math.PI * (y + 0.37) / L4) + 0.2 * Math.sin(2 * Math.PI * x / L4); diag[y * L4 + x] = Math.sin(2 * Math.PI * (x + y + 0.37) / L4); }
const cb = C.contours(band, L4, 0), cd = C.contours(diag, L4, 0);
check('Contours around the torus are found and dropped (bands, and diagonal lines)', cb.nWrap === 2 && cb.P.length === 0 && cd.nWrap === 2 && cd.P.length === 0 && near(cd.wrapLength, 2 * Math.SQRT2 * L4, 1e-6),
  `bands ${cb.nWrap} around, ${cb.P.length} closed; diagonals ${cd.nWrap} around, length ${cd.wrapLength.toFixed(4)} (2 sqrt2 L = ${(2 * Math.SQRT2 * L4).toFixed(4)})`, 'construction');
const sad = (hi, lo, bd) => { const L5 = 8, f = new Float64Array(L5 * L5).fill(lo); if (bd) { f[2 * L5 + 3] = hi; f[3 * L5 + 2] = hi; } else { f[2 * L5 + 2] = hi; f[3 * L5 + 3] = hi; } const c = C.contours(f, L5, 0); return { n: c.P.length, ok: near(C.aboveArea(f, L5, 0), c.A.reduce((a, x) => a + x, 0), 1e-12) }; };
const sd = [sad(3, -1, false), sad(1, -3, false), sad(3, -1, true), sad(1, -3, true)];
check('Saddle cells: two diagonal highs are joined when the cell average is above the level, split when below; areas agree cell by cell',
  sd[0].n === 1 && sd[1].n === 2 && sd[2].n === 1 && sd[3].n === 2 && sd.every(s => s.ok), `loops ${sd.map(s => s.n).join(', ')} (expected 1, 2, 1, 2)`, 'construction');

// Random surfaces: loop areas add up to the area above the level (contours() itself throws if a walk fails to close or
// reuses an edge); the loops do not change under a periodic shift, a quarter turn, or turning the surface upside down.
const rows = [];
for (const beta of [2.4, 3.4]) for (let p = 0; p < 3; p++) for (const f of C.gaussianFields(256, beta, SEED, p)) {
  const c = C.contours(f, 256, 0);
  if (c.nWrap) continue; // a contour around the torus has no inside, so its area is not defined
  const d = (C.aboveArea(f, 256, 0) - c.A.reduce((a, x) => a + x, 0)) / 65536;
  rows.push(Math.abs(d - Math.round(d)));
}
check("Green's theorem: on random surfaces without contours around the torus, loop areas add up to the area above the level",
  rows.length >= 6 && rows.every(d => d < 1e-9), `${rows.length} of 12 surfaces at L = 256 compared; largest mismatch ${e1(Math.max(...rows))} of L^2, modulo L^2 (under 1e-9)`, "Green's theorem");
const g = C.gaussianFields(256, 2.4, SEED, 9)[0], key = c => c.P.map((p, i) => [p, Math.abs(c.A[i])]).sort((a, b) => a[0] - b[0]);
const turn = new Float64Array(g.length), shift = new Float64Array(g.length);
for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { turn[x * 256 + (255 - y)] = g[y * 256 + x]; shift[((y + 77) & 255) * 256 + ((x + 31) & 255)] = g[y * 256 + x]; }
const base = key(C.contours(g, 256, 0)), others = [turn, shift, g.map(v => -v)].map(h => key(C.contours(h, 256, 0)));
const diff = Math.max(...others.map(o => o.length === base.length ? Math.max(...o.map((q, i) => Math.max(Math.abs(q[0] - base[i][0]), Math.abs(q[1] - base[i][1])))) : Infinity));
check('Loops unchanged by a periodic shift, a quarter turn and turning the surface upside down', diff < 1e-8, `${base.length} loops; largest change in P or A ${e1(diff)} (under 1e-8)`, 'symmetry');

// 2. Which dimension. Single loops have dimension (3 - H)/2 (Kondev & Henley); all the contours together, 2 - H
//    (Mandelbrot). L = 512, 16 surfaces for each of beta = 2.4 and 3. On a finite grid the roughness differs from
//    (beta - 2)/2, so H_eff, measured over the same range of sizes, is used for the comparison.
const est = beta => { const recs = []; for (let p = 0; p < 8; p++) for (const f of C.gaussianFields(512, beta, SEED, p)) recs.push(C.fieldRecord(f, 512, { yardMax: 16 })); return { th: C.theory(beta), e: C.estimate(recs, 512, 16) }; };
const lo = est(2.4), hi = est(3);
check('Loops sit nearer (3 - H)/2 and the whole level set nearer 2 - H, at beta = 2.4 and 3',
  [lo, hi].every(({ th, e }) => Math.abs(e.loops.D - th.loop) < Math.abs(e.loops.D - th.set) && Math.abs(e.yard.D - th.set) < Math.abs(e.yard.D - th.loop)),
  [lo, hi].map(({ th, e }) => `beta ${th.H * 2 + 2}: loops ${f3(e.loops.D)}, level set ${f3(e.yard.D)} against ${f3(th.loop)} and ${f3(th.set)}`).join('; '),
  'Kondev & Henley, Phys. Rev. Lett. 74, 4580 (1995); Mandelbrot');
// The loops sit about 0.04 above (3 - H_eff)/2 at larger grids (node turbulence/edges.mjs); on this grid the offset
// is tested against that value with its own jackknife error.
const offs = [lo, hi].map(({ th, e }) => {
  const v = e.loops.loo.map((d, i) => d - (3 - e.HeffLoop.loo[i]) / 2), n = v.length, m = v.reduce((a, x) => a + x, 0) / n;
  return { beta: th.H * 2 + 2, off: e.loops.D - (3 - e.HeffLoop.D) / 2, se: Math.sqrt((n - 1) / n * v.reduce((a, x) => a + (x - m) ** 2, 0)) };
});
check('Each loop dimension sits at (3 - H_eff)/2 plus the 0.04 offset found on larger grids, within 3 jackknife errors',
  offs.every(o => Math.abs(o.off - 0.04) < 3 * o.se),
  offs.map(o => `beta ${o.beta}: offset ${f3(o.off)} +- ${f3(o.se)}`).join('; ') + ' (this seed; a constant D fails)',
  'Kondev & Henley 1995 (their x_l = 1/2 is a conjecture, exact only at H = 0 and 1); the offset from edges.mjs at L = 1024 to 4096');
// Both spectra use the same random numbers, field by field, so the fall and the rise are differenced field by field
// inside a paired jackknife.
const pj = fn => { const n = lo.e.loops.loo.length, v = Array.from({ length: n }, (_, i) => fn(i)), m = v.reduce((a, x) => a + x, 0) / n; return Math.sqrt((n - 1) / n * v.reduce((a, x) => a + (x - m) ** 2, 0)); };
const dDi = i => lo.e.loops.loo[i] - hi.e.loops.loo[i], dHi = i => hi.e.HeffLoop.loo[i] - lo.e.HeffLoop.loo[i];
const dD = lo.e.loops.D - hi.e.loops.D, dH = hi.e.HeffLoop.D - lo.e.HeffLoop.D;
const seD = pj(dDi), seHalf = pj(i => dDi(i) - dHi(i) / 2), seAll = pj(i => dDi(i) - dHi(i));
check('From beta 2.4 to 3 the loop dimension falls, by half the rise in H_eff (single loops), not by all of it (the level set)',
  dD > 2 * seD && Math.abs(dD - dH / 2) < 2 * seHalf && Math.abs(dD - dH) > 3 * seAll,
  `fall ${f3(dD)} +- ${f3(seD)} (paired jackknife, over 2 errors); H_eff rises by ${f3(dH)}: fall minus half of it ${f3(dD - dH / 2)} +- ${f3(seHalf)} (within 2 errors), ` +
  `minus all of it ${f3(dD - dH)} +- ${f3(seAll)} (beyond 3; verified on this seed, about 80% of seeds clear it at this size)`, 'Kondev & Henley 1995');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
