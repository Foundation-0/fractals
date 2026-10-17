// Checks the Witness Map model against published numbers. Run: npm test (or node tests/checks.mjs).
// Each check states the source, the published value, the model's value and the tolerance.
// PASS: agreement within the tolerance. DIFF: a disagreement recorded in CORRECTIONS.md. A DIFF still passes, but only
// while the model's ratio to the published value stays inside the recorded range, so any change shows up here.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const W = require('../witness-map/model.js');
const { C, ENVS, OBJECTS, rates, planckIntegral, sigmaAbs, BH_M, RS } = W;

let fails = 0, diffs = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  published ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function differs(name, got, want, lo, hi, why, src) {
  const r = got / want, ok = got > 0 && r >= lo && r <= hi;
  console.log(`${ok ? 'DIFF' : 'FAIL'}  ${name}\n      model ${fmt(got)}  published ${fmt(want)}  (model/published ${r.toPrecision(2)}, recorded ${lo} to ${hi})  ${src}\n      ${why}`);
  if (ok) diffs++; else fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const obj = id => OBJECTS.find(o => o.id === id);
const zeta = s => { let z = 0; for (let n = 1; n <= 1e4; n++) z += Math.pow(n, -s); return z; };
const kth = T => C.kB * T / (C.hbar * C.c); // thermal wavenumber, m^-1

// 1. Localisation rate Lambda (m^-2 s^-1; decoherence rate = Lambda dx^2 for small gaps) against the closed-form limits
//    the model is built on. These test the code, so the tolerance is 2%. The grain is a pure scatterer with dielectric
//    factor 1, as in Joos & Zeh.
const bare = a => ({ a, m: 1, noGlow: true });
const lam = (a, pop, dx) => rates(bare(a), { pops: [pop], Tamb: 0 }, dx, null).gamma / (dx * dx);
const CMB = ENVS.intergalactic.pops[0], WALLS = ENVS.uhv.pops[0], SUN = ENVS.sunlit.pops[0], AIR = ENVS.air.pops[1];
const close = (name, got, want, src) => check(name, Math.abs(got / want - 1) < 0.02,
  `model ${fmt(got)}  formula ${fmt(want)}  (within 2%)`, src);
const rayleigh = (a, p) => p.dil * 40320 * 8 * zeta(9) * C.c * Math.pow(a, 6) / (9 * Math.PI) * Math.pow(kth(p.T), 9);
close('Small grain (a = 10 nm) in the Big Bang afterglow: Rayleigh limit', lam(1e-8, CMB, 1e-7), rayleigh(1e-8, CMB),
  'Lambda = 8! 8 zeta(9) c a^6 (kT/hbar c)^9 / (9 pi): Schlosshauer 2007, as in Romero-Isart 2011 (arXiv:1110.4495) eq. 28');
const opaque = (a, p) => p.dil * C.c * a * a / (3 * Math.PI) * 24 * zeta(5) * Math.pow(kth(p.T), 5);
close('Large grain (a = 1 mm) in sunlight: opaque-sphere limit', lam(1e-3, SUN, 1e-10), opaque(1e-3, SUN),
  'Schlosshauer 2019 (arXiv:1911.06282) eqs. 67-68 with isotropic scattering off pi a^2 (Tegmark 1993, arXiv:gr-qc/9310032)');
const gasLam = (a, p) => 8 / (3 * C.hbar * C.hbar) * p.n * Math.sqrt(2 * Math.PI * p.m) * a * a * Math.pow(C.kB * p.T, 1.5);
close('Grain (a = 10 um) in room air: gas limit', lam(1e-5, AIR, 1e-14), gasLam(1e-5, AIR),
  'Lambda = 8 n sqrt(2 pi m) a^2 (kT)^1.5 / (3 hbar^2): Schlosshauer 2007, as in arXiv:2110.14695 eq. B5 and arXiv:1110.4495 eq. 26');
// Emission by a small hot sphere. The model's absorption cross-section eps pi a^2 (ka) equals the small-sphere value
// 4 pi k a^3 Im[(e-1)/(e+2)] (Bohren & Huffman 1983, ch. 5) when Im[(e-1)/(e+2)] = eps / 4.
const hot = { a: 1e-9, m: 1, eps: 0.04, T: 1000, selfHeat: true };
const lamEmit = rates(hot, { pops: [], Tamb: 0 }, 1e-9, null).gamma / 1e-18;
close('Small hot sphere (1,000 K) glowing into the dark: emission limit', lamEmit,
  16 * Math.pow(Math.PI, 5) / 189 * C.c * Math.pow(hot.a, 3) * (hot.eps / 4) * Math.pow(kth(hot.T), 6),
  'Lambda_e = 16 pi^5 c a^3 Im[(e-1)/(e+2)] (kT/hbar c)^6 / 189: Romero-Isart 2011 (arXiv:1110.4495) eq. 29');

// 2. Joos & Zeh (1985) table of Lambda, in cm^-2 s^-1 (x 1e4 for m^-2 s^-1), as reproduced by Kiefer & Joos 1998
//    (arXiv:quant-ph/9803052), Joos 1999 (arXiv:quant-ph/9908008), Kiefer 1999 (arXiv:gr-qc/9906100) and Joos 2005
//    (arXiv:quant-ph/0512079); all four agree. The 1985 paper itself was not consulted. Entries are powers of ten, so the
//    tolerance is x5: half a decade of rounding (x3.2) times x1.5 for inputs the table does not state (temperature,
//    density, the grain's dielectric factor, set to 1 here).
const JZ = 'Joos & Zeh 1985 table';
const SIZES = [[1e-5, '1e-3 cm'], [1e-7, '1e-5 cm'], [1e-8, '1e-6 cm']];
const JZ_ROWS = [ // name, population, small gap, table exponents, recorded disagreements [lo, hi, why] per size
  ['Big Bang afterglow', CMB, 1e-7, [6, -6, -12], []],
  ['300 K photons', WALLS, 1e-9, [19, 12, 6], [[20, 45, 'A 10 um grain is not small next to 300 K wavelengths. The model equals the opaque-sphere limit here; 1e19 is not reproduced.']]],
  ['Sunlight on Earth', SUN, 1e-10, [21, 17, 13], []],
  ['Air molecules', AIR, 1e-14, [36, 32, 30], [0, 1, 2].map(() => [6, 12, 'The table sits 9x below the closed-form gas formula (check 1). Schlosshauer\'s own table (check 3) matches the formula.'])],
  ['Laboratory vacuum, at 10^6 per cm^3', { ...AIR, n: 1e12 }, 1e-14, [23, 19, 17], []],
];
for (const [name, pop, dx, exps, known] of JZ_ROWS) {
  SIZES.forEach(([a, size], i) => {
    const got = lam(a, pop, dx) * 1e-4, want = Math.pow(10, exps[i]), k = known[i];
    if (k) differs(`${name}, a = ${size}`, got, want, k[0], k[1], k[2], JZ);
    else within(`${name}, a = ${size}`, got, want, 5, JZ);
  });
}
differs('Laboratory vacuum at the labelled 10^3 per cm^3, a = 1e-3 cm', lam(1e-5, { ...AIR, n: 1e9 }, 1e-14) * 1e-4, 1e23, 0.002, 0.006,
  'The row matches 10^6 per cm^3 (above), as Joos 2005 labels it, not the 10^3 of the earlier copies. Tegmark 1993 also takes 10^6.', JZ);

// 3. Schlosshauer's decoherence times for a gap equal to the object's size, tau = 1 / (Lambda a^2) (his eq. 70), from
//    arXiv:1404.2635 Table I and Phys. Rep. 831, 1 (2019), arXiv:1911.06282 Table 1. Both refer to his 2007 book for the
//    calculation; the book was not consulted. Vacuum density assumed 10^3 per cm^3 (not stated). Tolerance x5 as above.
const SCH = 'Schlosshauer 2014/2019 timescale table';
const SCH_ROWS = [
  ['Big Bang afterglow', CMB, 1e-7, [0, 24], []],
  ['Photons at room temperature', WALLS, 1e-9, [-18, 6], [[2000, 5000, 'Close to the small-grain (Rayleigh) formula, 10^-18.6 s, which needs the grain small next to the wavelength. A 10 um grain is not.']]],
  ['Best laboratory vacuum', { ...AIR, n: 1e9 }, 1e-14, [-14, -2], []],
  ['Air at normal pressure', AIR, 1e-14, [-31, -19], []],
];
for (const [name, pop, dx, exps, known] of SCH_ROWS) {
  [[1e-5, 'dust grain'], [1e-8, 'large molecule']].forEach(([a, what], i) => {
    const got = 1 / (lam(a, pop, dx) * a * a), want = Math.pow(10, exps[i]), k = known[i];
    if (k) differs(`${name}, ${what}: time (s)`, got, want, k[0], k[1], k[2], SCH);
    else within(`${name}, ${what}: time (s)`, got, want, 5, SCH);
  });
}
// The gas times use eq. 70 at dx = a = 10 um, 10^5.6 gas wavelengths. There every collision is a full record and the
// rate saturates at the collision rate (Schlosshauer 2019, eq. 65). The model saturates.
const collisions = AIR.n * Math.sqrt(8 * C.kB * AIR.T / (Math.PI * AIR.m)) * Math.PI * Math.pow(1e-5 + C.rGas, 2);
const tauSat = 1 / rates(bare(1e-5), { pops: [AIR], Tamb: 0 }, 1e-5, null).gamma;
check('Dust grain in air, gap = its size: the rate saturates at the collision rate', Math.abs(tauSat * collisions - 1) < 0.01,
  `time ${fmt(tauSat)} s = 1/(collision rate); eq. 70 gives ${fmt(1 / (lam(1e-5, AIR, 1e-14) * 1e-10))} s`, 'Schlosshauer 2019, eq. 65');

// 4. Danielson, Satishchandran & Wald (2022), eqs. 16 and 20: worked examples with the Sun as a black hole at 1 AU.
const DSW = 'Danielson, Satishchandran & Wald 2022, arXiv:2205.06279';
const sunBH = { M: C.Msun, b: C.au };
const earthT = rates({ ...obj('earth'), dark: true }, ENVS.sunlit, 6.371e6, sunBH).tau;
within('Earth split by its own radius: decoherence time (s)', earthT, 1e-5, 3, DSW + ' eq. 20');
const elT = rates({ ...obj('electron'), dark: true }, ENVS.uhv, 1, sunBH).tau / 3.156e7;
within('Electron split by 1 m: decoherence time (years)', elT, 1e43, 3, DSW + ' eq. 16');

// 5. Heated C70 in the Vienna Talbot-Lau interferometer: Hackermueller et al., Nature 427, 711 (2004), arXiv:quant-ph/0402146
//    (H04) and Hornberger, Hackermueller & Arndt, Phys. Rev. A 71, 023601 (2005), arXiv:quant-ph/0412003 (H05).
//    Grating period d = 991 nm, gratings L = 0.38 m apart. Visibility V/V0 = exp(-int dt int dk R(k) [1 - sinc(k s(t))]) with
//    path separation s = d (L - |vt - L|) / L_T, L_T = d^2 / lambda_dB (H04 eq. 2). The model's fullerene (the C60 entry,
//    with its fitted eps) is given the mass of C70 and held at one temperature; the real beam has a spread and cools.
//    eps was fitted to this experiment, so the 190 m/s halving temperature is a calibration; the rest are tests.
const H04 = 'Hackermueller et al. 2004', H05 = 'Hornberger et al. 2005';
const c70 = { ...obj('c60'), m: 70 * 12.011 * C.amu };
const glow = (T, s) => rates({ ...c70, T }, { pops: [], Tamb: 0 }, s, null).gamma;
function visibility(T, v) {
  const L = 0.38, d = 991e-9, LT = d * d * c70.m * v / C.h, N = 100; let sum = 0;
  for (let i = 0; i < N; i++) { const z = 2 * L * (i + 0.5) / N; sum += glow(T, d * (L - Math.abs(z - L)) / LT); }
  return Math.exp(-sum / N * 2 * L / v);
}
function halfT(v) { let lo = 1000, hi = 5000; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (visibility(m, v) > 0.5) lo = m; else hi = m; } return lo; }
const photons = (T, t, kMin = 0) => planckIntegral(T, 1, k => (k > kMin ? C.c * sigmaAbs(c70, k) : 0)) * t;
const kGap = 1.6 * C.e / (C.hbar * C.c); // C70 has no transitions below 1.6 eV (H05)
const power = T => planckIntegral(T, 1, k => C.c * sigmaAbs(c70, k) * C.hbar * C.c * k) / C.e; // eV/s
const T190 = halfT(190), T100 = halfT(100);
check('Visibility halves at 190 m/s near the measured temperature', Math.abs(T190 - 2500) <= 300,
  `model ${T190.toFixed(0)} K; measured about 2,500 K mean temperature at the first grating (within 300 K: plot reading, beam spread, cooling)`, H05 + ' Fig. 9');
differs('Visibility halves at 100 m/s: temperature (K)', T100, 2450, 0.75, 0.88,
  'Model too cold by about 500 K. Most of it is the glow rising too slowly with temperature (power checks below): with C70\'s steepness (T^11) the model would halve near 2,240 K. Cooling in flight, ignored here, moves it by only 25 K.', H05 + ' Fig. 9');
const v1500 = visibility(1500, 190), v3000 = visibility(3000, 190);
check('Shape of the 190 m/s curve: visibility at 1,500 K and 3,000 K', Math.abs(v1500 - 0.89) <= 0.1 && Math.abs(v3000 - 0.145) <= 0.1,
  `model ${v1500.toFixed(2)} and ${v3000.toFixed(2)}; measured about 0.89 and 0.145 (within 0.1)`, H05 + ' Fig. 9');
const nHalf = photons(T190, 0.76 / 190);
check('Photons emitted while the visibility halves (190 m/s)', nHalf >= 1 && nHalf <= 2,
  `model ${nHalf.toFixed(2)} photons, of which ${photons(T190, 0.76 / 190, kGap).toFixed(2)} above 1.6 eV; published: between one and two visible photons`, H04 + ' Fig. 4');
within('Photons emitted in a 4 ms transit at 2,500 K', photons(2500, 4e-3), 3, 3, H04 + ' Fig. 3 ("three visible photons")');
differs('Of those, photons above 1.6 eV (all of C70\'s are)', photons(2500, 4e-3, kGap), 3, 0.02, 0.05,
  `The model has no electronic gap, so most of its glow is infrared (mean photon ${(power(2500) / photons(2500, 1)).toFixed(1)} eV), where C70 emits nothing.`, H04 + ' Fig. 3; ' + H05);
const phi = T => 6.3e-35 * Math.pow(T, 11); // H05: radiant flux of C70, 2,000-3,000 K
within('Emitted power at 2,000 K (eV/s)', power(2000), phi(2000), 2, H05 + ': 6.3e-35 (T/K)^11 eV/s');
differs('Emitted power at 3,000 K (eV/s)', power(3000), phi(3000), 0.04, 0.1,
  `The model's glow rises as T^${(Math.log(power(3000) / power(2000)) / Math.log(1.5)).toFixed(1)} between 2,000 and 3,000 K; C70's as T^11.`, H05);
differs('Absorption cross-section at 514 nm (m^2)', sigmaAbs(c70, 2 * Math.PI / 514e-9), 2e-21, 0.005, 0.012,
  'Measured C70: about 2e-17 cm^2 (fitted triplet value, close to the ground state). eps = 0.01 is a fit; the measured value needs eps of about 1.', H05 + ' Sec. V');

// 6. Objects seen as waves in experiments land on the wave side at the gaps used (a few hundred nm).
const dx = 2.5e-7;
for (const o of OBJECTS.filter(o => o.seen)) {
  const r = rates(o, ENVS[o.home], dx, null);
  check(`${o.name} is on the wave side at 250 nm`, r.W < 1, `W = ${fmt(r.W)}`, o.seen);
}

// 7. Structural properties of the model.
check('Dark matter has no witnesses without a black hole', ['fdm', 'wimp'].every(id => rates(obj(id), ENVS.intergalactic, 1e-6, null).W === 0),
  'W = 0 for both dark matter particles', 'model');
check('Planck integral gives the CMB photon density', Math.abs(planckIntegral(2.725, 1, () => 1) / 4.11e8 - 1) < 0.02,
  `n = ${fmt(planckIntegral(2.725, 1, () => 1))} per m^3 (expected 4.11e8)`, 'standard value, 411 per cm^3');

console.log(fails ? `\n${fails} check(s) failed` : `\nall checks pass (${diffs} recorded disagreements, see CORRECTIONS.md)`);
process.exit(fails ? 1 : 0);
