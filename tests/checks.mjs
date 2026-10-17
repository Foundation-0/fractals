// Checks the Witness Map model against published numbers. Run: npm test (or node tests/checks.mjs).
// Each check states the source, the published value, the model's value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const W = require('../witness-map/model.js');
const { C, ENVS, OBJECTS, rates, planckIntegral, BH_M, RS } = W;

let fails = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  published ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const obj = id => OBJECTS.find(o => o.id === id);

// 1. Joos & Zeh (1985) localisation rates for a grain of radius 1e-3 cm = 1e-5 m, long-wavelength limit.
//    Table values in cm^-2 s^-1: CMB 1e6, sunlight on Earth 1e21, air 1e37  ->  x1e4 for m^-2 s^-1.
const grain = { a: 1e-5, m: 1e-11, noGlow: true };
const lam = (env, i, dx) => rates(grain, { pops: [ENVS[env].pops[i]], Tamb: 0 }, dx, null).gamma / (dx * dx);
const JZ = 'Joos & Zeh 1985, table of localisation rates (a = 1e-3 cm)';
within('Big Bang afterglow, Lambda', lam('intergalactic', 0, 1e-7), 1e10, 3, JZ);
within('Sunlight at 1 AU, Lambda', lam('sunlit', 0, 1e-9), 1e25, 5, JZ);
within('Air at room temperature, Lambda', lam('air', 1, 1e-13), 1e41, 3, JZ);

// 2. Danielson, Satishchandran & Wald (2022), eqs. 16 and 20: worked examples with the Sun as a black hole at 1 AU.
const DSW = 'Danielson, Satishchandran & Wald 2022, arXiv:2205.06279';
const sunBH = { M: C.Msun, b: C.au };
const earthT = rates({ ...obj('earth'), dark: true }, ENVS.sunlit, 6.371e6, sunBH).tau;
within('Earth split by its own radius: decoherence time (s)', earthT, 1e-5, 3, DSW + ' eq. 20');
const elT = rates({ ...obj('electron'), dark: true }, ENVS.uhv, 1, sunBH).tau / 3.156e7;
within('Electron split by 1 m: decoherence time (years)', elT, 1e43, 3, DSW + ' eq. 16');

// 3. Hackermueller et al. (2004): heated C60 loses interference at a few thousand kelvin.
//    Model: about one informative photon per interferometer transit (~2 ms) between 2,000 and 3,500 K.
const perTransit = T => rates({ ...obj('c60'), T }, ENVS.uhv, 1e-6, null).gamma * 2e-3;
check('Buckyball heating onset', perTransit(2000) < 1 && perTransit(3500) > 1,
  `photons per 2 ms transit: ${fmt(perTransit(2000))} at 2,000 K, ${fmt(perTransit(3500))} at 3,500 K`,
  'Hackermueller et al., Nature 427, 711 (2004)');

// 4. Objects seen as waves in experiments land on the wave side at the gaps used (a few hundred nm).
const dx = 2.5e-7;
for (const o of OBJECTS.filter(o => o.seen)) {
  const r = rates(o, ENVS[o.home], dx, null);
  check(`${o.name} is on the wave side at 250 nm`, r.W < 1, `W = ${fmt(r.W)}`, o.seen);
}

// 5. Structural properties of the model.
check('Dark matter has no witnesses without a black hole', ['fdm', 'wimp'].every(id => rates(obj(id), ENVS.intergalactic, 1e-6, null).W === 0),
  'W = 0 for both dark matter particles', 'model');
check('Planck integral gives the CMB photon density', Math.abs(planckIntegral(2.725, 1, () => 1) / 4.11e8 - 1) < 0.02,
  `n = ${fmt(planckIntegral(2.725, 1, () => 1))} per m^3 (expected 4.11e8)`, 'standard value, 411 per cm^3');

// 6. Gravitational atom beside hydrogen (gravitational-atom/atom.js).
const GA = require('../gravitational-atom/atom.js');
function near(name, got, want, rel, src) {
  const ok = Math.abs(got / want - 1) <= rel;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${got.toPrecision(10)}  published ${want.toPrecision(10)}  (within ${rel})  ${src}`);
  if (!ok) fails++;
}
const H = GA.hydrogen();
near('Hydrogen ground-state binding, fixed proton (eV)', GA.binding(H, 1), 13.60569312299, 1e-8,
  'CODATA 2022 Rydberg energy (same formula, alpha^2 m_e c^2 / 2: checks the code and units)');
near('Bohr radius (m)', H.a0, 5.29177210544e-11, 1e-8, 'CODATA 2022');
near('Hydrogen ionization energy, proton allowed to recoil (eV)', GA.binding(GA.hydrogen({ recoil: true }), 1), 13.598434599702, 2e-5,
  'NIST Atomic Spectra Database. The 1.5e-4 eV left over is fine structure (alpha^4 mc^2/8 = 1.8e-4 eV) less QED shifts, beyond this model');
const BCP = 'Baumann, Chia & Porto 2019, arXiv:1804.03208';
const small = GA.grav(3, 1e-12, 0.99), big = GA.grav(5e6, 1e-17, 0.99);
check('alpha = G M mu / (hbar c) is about 0.02 for 3 Suns and 1e-12 eV', Math.round(small.alpha * 100) === 2,
  `alpha = ${small.alpha.toFixed(4)}`, BCP + ', eq. 2.6');
check('alpha is about 0.37 for 5 million Suns and 1e-17 eV', Math.round(big.alpha * 100) === 37,
  `alpha = ${big.alpha.toFixed(4)}`, BCP + ', sec. 4.3');
check('Gravitational waves from the cloud: 484 Hz for 1e-12 eV', Math.round(GA.gwFrequency(1e-12)) === 484,
  `f = ${GA.gwFrequency(1e-12).toFixed(1)} Hz`, BCP + ', eq. 4.1');
check('... and about 5 mHz for the 5 million Sun example', Math.round(GA.gwFrequency(1e-17) * 1e3) === 5,
  `f = ${(GA.gwFrequency(1e-17) * 1e3).toFixed(2)} mHz`, BCP + ', sec. 4.3');
check('At spin 0.8 the 211 level grows only for alpha below about 0.25', Math.round(GA.alphaMax(2, 1, 0.8) * 100) === 25,
  `alpha max = ${GA.alphaMax(2, 1, 0.8).toFixed(4)}`, BCP + ', sec. 2.2 (from Dolan 2007)');
const peakAt = (n, l) => { let best = 0, at = 0; for (let x = 0.001; x < 40; x += 0.001) { const v = x * x * GA.radial(n, l, x) ** 2; if (v > best) { best = v; at = x; } } return at; };
check('The cloud peaks at n^2 r_g / alpha^2 = n^2 a0', Math.abs(peakAt(2, 1) - 4) < 0.01 && Math.abs(peakAt(3, 2) - 9) < 0.01,
  `211 at ${peakAt(2, 1).toFixed(3)} a0, 322 at ${peakAt(3, 2).toFixed(3)} a0`, BCP + ', eq. 2.9');
const total = (n, l, m) => { let s = 0; const NR = 2000, NT = 200, R = 80;
  for (let i = 0; i < NR; i++) { const x = (i + 0.5) * R / NR; for (let j = 0; j < NT; j++) { const t = (j + 0.5) * Math.PI / NT;
    s += GA.density(n, l, m, x, t) * x * x * Math.sin(t) * (R / NR) * (Math.PI / NT) * 2 * Math.PI; } } return s; };
check('|psi|^2 adds up to one particle for 100, 211 and 322', [[1, 0, 0], [2, 1, 1], [3, 2, 2]].every(s => Math.abs(total(...s) - 1) < 1e-4),
  [[1, 0, 0], [2, 1, 1], [3, 2, 2]].map(s => s.join('') + ': ' + total(...s).toFixed(5)).join(', '), 'model');
const closed = x => [x * Math.exp(-x / 2) / (2 * Math.sqrt(6)), 4 * x * x * Math.exp(-x / 3) / (81 * Math.sqrt(30))];
check('General R_nl matches the textbook closed forms of R_21 and R_32', [0.5, 2, 7, 15].every(x => Math.abs(GA.radial(2, 1, x) / closed(x)[0] - 1) < 1e-12 && Math.abs(GA.radial(3, 2, x) / closed(x)[1] - 1) < 1e-12),
  'checked at r = 0.5, 2, 7 and 15 a0', 'Griffiths & Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), sec. 4.2');
const s211 = GA.spinAfter(2, 1, big.alpha);
check('Spin left after 211 stops growing sits exactly on its growth threshold', Math.abs(GA.horizon(s211).omega / GA.omegaRg(2, big.alpha) - 1) < 1e-12 && GA.grows(3, 2, big.alpha, s211),
  `spin 0.99 -> ${s211.toFixed(3)}; 322 can still grow there`, BCP + ', eqs. 2.1 and 2.2');
// Growth rates are leading order. They match Detweiler's small-alpha limit, chi alpha^9 / 48 (with BCP's factor-of-2
// correction), and are known to run slow near the fastest growth: these two checks pin down by how much.
check('211 growth rate at small alpha is chi alpha^9 / 48 (units of c/r_g)', Math.abs(GA.growthRate(2, 1, 1, 1e-3, 0.99) / (0.99 * 1e-27 / 48) - 1) < 0.01,
  `ratio ${(GA.growthRate(2, 1, 1, 1e-3, 0.99) / (0.99 * 1e-27 / 48)).toFixed(4)}`, BCP + ', eqs. 2.12-2.13 (Detweiler 1980, corrected)');
const yr = 3.15576e7, tau2p = 10 * GA.C.GMsun / GA.C.c ** 3 / GA.growthRate(2, 1, 1, 0.3, 0.9) / yr;
within('211 e-folding time, 10 Suns, alpha 0.3, spin 0.9 (years); leading order is slow here', tau2p, 1e-4, 5,
  'Arvanitaki, Baryakhtar & Huang 2015, Table I (more accurate semi-analytic rates)');
const peakRatio = 1.5e-7 / GA.growthRate(2, 1, 1, 0.42, 0.99);
check('At the numerical peak (alpha 0.42, spin 0.99) leading order is 10 to 30 times too slow', peakRatio > 10 && peakRatio < 30,
  `published 1.5e-7 c/r_g, leading order ${fmt(GA.growthRate(2, 1, 1, 0.42, 0.99))}: ${peakRatio.toFixed(1)}x too slow (the page says so)`, 'Dolan 2007, arXiv:0705.2880');
within('Bosons in a 10-Sun cloud that took 0.1 of the spin', GA.occupation(10, 0.1, 1), 1e76, 10,
  'Arvanitaki, Baryakhtar & Huang 2015, eq. 8 (they round 8e76 to ~1e76)');
const onLevel = [2, 3].every(n => [0.05, 0.5, 0.9].every(f => GA.contour(n, f).every(([x, z]) => {
  const v = GA.density(n, n - 1, n - 1, Math.hypot(x, z), Math.atan2(x, z)) / GA.density(n, n - 1, n - 1, n * (n - 1), Math.PI / 2);
  return Math.abs(v / f - 1) < 1e-9; })));
check('Drawn contour lines lie on their density level', onLevel, '211 and 322 at 5%, 50% and 90% of peak', 'model');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
