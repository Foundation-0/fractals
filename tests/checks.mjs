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

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
