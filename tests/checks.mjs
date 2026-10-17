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

// 6. Gravitational atom: a light boson around a spinning black hole (notes/bh-lensing.md).
const { gravAtom } = W;
const BCP = 'Baumann, Chia & Porto 2019, arXiv:1804.03208';
const YR = 3.156e7, AGE = 13.8e9 * YR, PC = C.kpc / 1e3;
const muFor = (alpha, M) => alpha * C.hbar * C.c / (C.G * M) * C.c * C.c / C.e; // boson mass (eV) giving this alpha
const edge = (ok, lo, hi) => { for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (ok(mid)) lo = mid; else hi = mid; } return lo; };
const M3 = 3 * C.Msun, M87 = 7.2e9 * C.Msun;
within('Fine-structure constant, 3 Msun and 1e-12 eV', gravAtom(M3, 1e-12, 0.9).alpha, 0.02, 1.2, BCP + ' eq. 2.6');
within('Cloud growth time at alpha = 0.005, 3 Msun, spin 0.99 (years)', gravAtom(M3, muFor(0.005, M3), 0.99).tGrow / YR, 13.8e9, 1.5,
  BCP + ' eq. 2.14: the smallest alpha that grows within the age of the universe');
within('Largest alpha that can grow, spin 0.8', edge(x => gravAtom(M3, muFor(x, M3), 0.8).superradiant, 0.1, 0.5), 0.25, 1.05, BCP + ', after eq. 2.14');
within('Heaviest boson M87* can grow (eV), spin 0.8, 7.2e9 Msun', 10 ** edge(x => gravAtom(M87, 10 ** x, 0.8).superradiant, -22, -19), 4.6e-21, 1.05,
  'Davoudiasl & Denton 2019, PRL 123, 021102, eq. 10 (1-sigma edge)');
const fdmClouds = [1e8, 1e9].map(m => gravAtom(m * C.Msun, 1e-22, 0.99));
check('1e-22 eV clouds around 1e8 and 1e9 Msun black holes are allowed but far too slow', fdmClouds.every(r => r.superradiant && r.tGrow > 1e15 * AGE),
  `growth times ${fdmClouds.map(r => fmt(r.tGrow / YR)).join(' and ')} years`, 'model');
const biggest = [1e8, 1e9].map(m => { const M = m * C.Msun;
  return gravAtom(M, 10 ** edge(x => gravAtom(M, 10 ** x, 0.99).tGrow > AGE, -26, Math.log10(muFor(0.2, M))), 0.99).rCloud; });
check('Any cloud that grows within the age of the universe around 1e8 to 1e9 Msun is under 1 pc', biggest.every(r => r < PC),
  `largest clouds ${biggest.map(r => (r / PC).toPrecision(2)).join(' and ')} pc`, 'model');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
