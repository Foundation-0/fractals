// Checks the gravitational atom in witness-map/model.js (gravAtom, used by notes/bh-lensing.md) against published
// numbers, and against the separate copy of the same algebra in gravitational-atom/atom.js.
// Run: npm test (or node tests/bh-lensing.mjs). Each check states the source, the published value, the model's
// value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const W = require('../witness-map/model.js');
const { C } = W;

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

// 1. Gravitational atom: a light boson around a spinning black hole (notes/bh-lensing.md).
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

// 2. The same algebra lives in gravitational-atom/atom.js (the second study's page). The two copies use slightly
//    different constants: G M_sun differs by 0.0252%, giving <0.03% differences in alpha, radius and speed.
//    The alpha^9 rate amplifies this to at most 0.198% for the cases below; allow 0.21%.
//    The dimensionless threshold uses identical constants, so only floating-point roundoff is allowed.
const GA = require('../gravitational-atom/atom.js');
const pts = [[3, 1e-12, 0.99], [10, 1e-12, 0.7], [5e6, 1e-17, 0.99], [1e8, 1e-19, 0.9]];
const pairs = pts.map(([m, mu, a]) => ({ m, mu, a, here: gravAtom(m * C.Msun, mu, a), there: GA.grav(m, mu, a) }));
const relA = Math.max(...pairs.map(p => Math.abs(p.here.alpha / p.there.alpha - 1)));
check('alpha agrees with gravitational-atom/atom.js', relA < 3e-4, `largest difference ${fmt(relA)} over ${pts.length} black holes`, 'cross-check');
// Locate the 211 radial-probability peak using the separate wavefunction implementation.
// This is r^2 |R_21|^2, not the spatial-density peak (which lies at 2 a0).
const radialProbability = x => x * x * GA.radial(2, 1, x) ** 2;
let lo = 0, hi = 12;
for (let i = 0; i < 80; i++) {
  const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3;
  if (radialProbability(a) < radialProbability(b)) lo = a; else hi = b;
}
const cloudPeak = (lo + hi) / 2;
// The virial theorem gives kinetic energy = binding energy, hence v = sqrt(2 E_binding / mu).
for (const [name, expected] of [
  ['rBohr', p => p.there.a0],
  ['rCloud', p => cloudPeak * p.there.a0],
  ['vBohr', p => Math.sqrt(2 * GA.binding(p.there, 2) * GA.C.e / (p.mu * GA.C.e / GA.C.c ** 2))],
]) {
  const rel = Math.max(...pairs.map(p => Math.abs(p.here[name] / expected(p) - 1)));
  check(`${name} agrees with gravitational-atom/atom.js`, rel < 3e-4,
    `largest difference ${fmt(rel)} over the same black holes`, 'cross-check');
}
const relR = Math.max(...pairs.map(p => {
  const there = GA.growthRate(2, 1, 1, p.there.alpha, p.a) * C.c / p.there.rg;
  return Math.abs(1 / p.here.tGrow / there - 1);
}));
check('211 growth rate agrees with gravitational-atom/atom.js', pairs.every(p => p.here.superradiant) && relR < 0.0021,
  `largest difference ${fmt(relR)} over the same black holes, all growing`, 'cross-check');
// Match alpha and r_g to remove the rounded-GM offset and test the rate algebra itself.
const relMatchedRate = Math.max(...pairs.map(p => Math.abs(
  (1 / p.here.tGrow) / (GA.growthRate(2, 1, 1, p.here.alpha, p.a) * GA.C.c / p.here.rg) - 1)));
check('211 growth rate agrees at matched alpha and r_g', relMatchedRate < 1e-12,
  `largest difference ${fmt(relMatchedRate)} over the same black holes`, 'cross-check');
const relT = Math.max(...[0.5, 0.8, 0.99].map(a => {
  const here = edge(x => gravAtom(M3, muFor(x, M3), a).superradiant, 0.01, 0.6);
  return Math.abs(here / GA.alphaMax(2, 1, a) - 1);
}));
check('Largest alpha that grows agrees with gravitational-atom/atom.js', relT < 1e-12, `largest difference ${fmt(relT)} at spins 0.5, 0.8 and 0.99`, 'cross-check');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
