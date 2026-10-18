// Checks the quantum paths model against published numbers and its own closed forms. Run: npm test.
// Each check states the source, the published or expected value, the model's value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const QP = require('../quantum-paths/paths.js');
const WM = require('../witness-map/model.js');
const { C, awLength, awLengthRelativistic, localDimension, dimensionFromS, brownianS } = QP;

let fails = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  expected ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
function crossing(f, lo, hi, level) { // where a falling f(x) crosses level, by bisection in log x
  for (let i = 0; i < 100; i++) { const mid = Math.sqrt(lo * hi); if (f(mid) > level) lo = mid; else hi = mid; }
  return Math.sqrt(lo * hi);
}

// 1. Abbott & Wise (1981): the recorded path has dimension 2 below hbar/p and 1 above it (3D, records far apart).
const AW = 'Abbott & Wise, Am. J. Phys. 49, 37 (1981)';
const m = C.me, p = 1e5 * C.me, T = 1, lb = C.hbar / p;
const L3 = dx => awLength(dx, { m, p, T });
within('Fine records: <l> dx m / (hbar T) tends to sqrt(2/pi)', L3(1e-4 * lb) * 1e-4 * lb * m / (C.hbar * T), Math.sqrt(2 / Math.PI), 1.001, 'closed form, 3D');
within('Coarse records: <l> tends to the classical length pT/m', L3(1e4 * lb), p * T / m, 1.001, 'closed form');
check('Dimension 2 well below hbar/p, 1 well above', Math.abs(localDimension(L3, 0.01 * lb) - 2) < 0.01 && Math.abs(localDimension(L3, 100 * lb) - 1) < 0.01,
  `D = ${localDimension(L3, 0.01 * lb).toFixed(3)} at 0.01 hbar/p, ${localDimension(L3, 100 * lb).toFixed(3)} at 100 hbar/p`, AW);
const x15 = crossing(dx => localDimension(L3, dx), 1e-3 * lb, 1e3 * lb, 1.5) / lb;
check('The crossover sits at the reduced de Broglie wavelength hbar/p, to a factor of 2', x15 > 0.5 && x15 < 2,
  `D = 1.5 at ${x15.toFixed(3)} hbar/p`, AW);

// 2. Relativity: below hbar/mc the speed limit caps the length, so the path is smooth again (one direction).
const pr = 1e-3 * C.me * C.c, lc = C.hbar / (C.me * C.c);
const Lr = dx => awLengthRelativistic(dx, { m: C.me, p: pr, T });
check('Smooth below the Compton wavelength, rough between, smooth above hbar/p (p = 0.001 mc)',
  localDimension(Lr, 1e-3 * lc) < 1.01 && localDimension(Lr, 10 * lc) > 1.98 && localDimension(Lr, 1e4 * lc) < 1.01,
  `D = ${localDimension(Lr, 1e-3 * lc).toFixed(3)}, ${localDimension(Lr, 10 * lc).toFixed(3)}, ${localDimension(Lr, 1e4 * lc).toFixed(3)} at 0.001, 10, 10^4 hbar/mc`, 'model');

// 3. Repeated records heat the particle: each kicks the momentum by ~hbar/(2 dx), and the kicks add up. For a
//    particle starting at rest with records many wave clocks apart, the recorded length is (1/N) sum sqrt(k) times
//    the single-interval formula, about (2/3) sqrt(N).
const rng = QP.mulberry32(2026), N = 400, dx = 1e-9, clocks = 10, R = 300;
let Lseq = 0; for (let r = 0; r < R; r++) Lseq += QP.sequential({ m, dx, clocks, N, rng }).L;
const single = awLength(dx, { m, p: 0, T: N * clocks * m * dx * dx / C.hbar, dim: 1 }); // far field, 1D
within('Repeated records: recorded length over the single-interval length, N = 400', Lseq / R / single, QP.heatingFactor(N), 1.05,
  'model (exact Gaussian updates, 300 seeded runs) against (1/N) sum sqrt(k)');

// 4. de Broglie wavelengths that set hbar/p for real particles.
within('C60 at 220 m/s: h/mv (m)', QP.deBroglie(720 * C.u, 220), 2.5e-12, 1.02, 'arithmetic; Arndt et al., Nature 401, 680 (1999) quote 2.5 pm');
within('Electron at 54 eV: de Broglie wavelength (m)', QP.deBroglie(C.me, Math.sqrt(2 * 54 * C.e / C.me)), 1.65e-10, 1.02, 'Davisson & Germer (1927), 1.65 Angstrom as usually quoted (2.15 Angstrom x sin 50 deg)');

// 5. A Brownian particle is smooth below its ballistic length. Li, Kheifets, Medellin & Raizen (Science 328, 1673
//    (2010)) held a 3 um silica bead in an optical trap in air: momentum relaxation 48.5 us at 99.8 kPa and 147.3 us
//    at 2.75 kPa (fits to the velocity autocorrelation), rms speed 0.42 mm/s. Model: Stokes drag with the Cunningham slip correction, using the mass the
//    measured speed implies (density ~1,600 kg/m^3; bulk silica's ~2,000 would give ~58 us).
const LI = 'Li et al., Science 328, 1673 (2010); Li & Raizen, Ann. Phys. 525, 281 (2013)';
const vrms = 0.4235e-3, Tb = 297, mb = C.kB * Tb / (vrms * vrms);
const taup = P => mb / QP.stokesCunningham({ r: 1.5e-6, eta: 1.81e-5, mfp: 68e-9 * 101.325e3 / P });
within('Bead in air at 99.8 kPa: momentum relaxation time (s)', taup(99.8e3), 48.5e-6, 1.1, LI);
within('Bead in air at 2.75 kPa: momentum relaxation time (s)', taup(2.75e3), 147.3e-6, 1.1, LI);
const bead = { sigmaV: vrms, taup: 48.5e-6 }, Sb = t => brownianS(t, bead);
check('A free bead with these numbers is smooth below its ballistic length (~20 nm) and rough above it',
  dimensionFromS(Sb, 1e-7) < 1.01 && dimensionFromS(Sb, 1e-1) > 1.99,
  `D = ${dimensionFromS(Sb, 1e-7).toFixed(3)} over ${(Math.sqrt(Sb(1e-7)) * 1e9).toFixed(2)} nm, ${dimensionFromS(Sb, 1e-1).toFixed(3)} over ${(Math.sqrt(Sb(1e-1)) * 1e6).toFixed(1)} um`,
  'model (free bead; the trapped bead is bounded above by its trap), tau_p from ' + LI);

// 6. Witness Map link. A surroundings that records at rate k dx^2 keeps the best estimate of the position uncertain
//    by about 0.6 dx*, dx* = (hbar/km)^(1/4) being the gap where W = 1.
const k = 1e20, mo = QP.monitored(k, C.me);
check('Continuously recorded particle: steady state is pure, and W = 1/8 at its width',
  Math.abs((mo.Vx * mo.Vp - mo.Cxp * mo.Cxp) / (C.hbar * C.hbar / 4) - 1) < 1e-9 && Math.abs(k * mo.Vx * C.me * mo.Vx / C.hbar - 1 / 8) < 1e-9,
  `Vx Vp - C^2 = ${((mo.Vx * mo.Vp - mo.Cxp * mo.Cxp) / (C.hbar * C.hbar / 4)).toFixed(6)} hbar^2/4; width ${(mo.sigma / mo.dxStar).toFixed(4)} dx*`,
  'model; convention of Jacobs & Steck, Contemp. Phys. 47, 279 (2006)');
// Fluctuation-dissipation: the localisation rate in a gas and the drag on a small sphere come from the same
// collisions, Lambda = M gamma kT / hbar^2 (gamma = drag / M), for specular reflection. For the virus in air
// (Kn ~ 1.4) it predicts dx*/lambda_bar = (tau_p / tau_th)^(1/4), tau_th = hbar/kT.
const air = { a: 5e-8, n: 2.5e25, mg: 28 * C.u, T: 300 };
within('Gas localisation rate equals drag x kT / hbar^2 (Schlosshauer 2019 eqs. 67-68 against Epstein 1924)',
  QP.gasLambda(air), QP.epsteinDrag(air) * C.kB * air.T / (C.hbar * C.hbar), 1.000001, 'Epstein, Phys. Rev. 23, 710 (1924), specular reflection');
const virus = WM.OBJECTS.find(o => o.id === 'virus'), vd = QP.drawnPath(WM, virus, WM.ENVS.air);
const fdt = Math.pow(virus.m / QP.epsteinDrag(air) / (C.hbar / (C.kB * 300)), 0.25);
within('Virus in air: Witness Map dx*/lambda_bar against fluctuation-dissipation', vd.ratio, fdt, 1.03,
  'Witness Map; agrees since the gas rate was corrected in #9 (before it, low by pi^(1/4))');
// Who records finer than hbar/p? Only witnesses that carry more momentum than the object.
const rows = WM.OBJECTS.map(o => ({ o, d: QP.drawnPath(WM, o, WM.ENVS[o.home]) })).filter(x => x.d);
const heavy = rows.filter(x => x.o.id !== 'electron'), least = heavy.reduce((a, b) => (a.d.ratio < b.d.ratio ? a : b));
check('Every other object on the map, at the temperature of its surroundings, is recorded more coarsely than hbar/p',
  heavy.every(x => x.d.ratio > 1), `${heavy.length} objects; smallest ratio ${least.d.ratio.toFixed(1)} (${least.o.name.toLowerCase()}, ${least.d.regime})`, 'Witness Map model');
const el = WM.OBJECTS.find(o => o.id === 'electron'), e300 = QP.drawnPath(WM, el, WM.ENVS.uhv), e1e4 = QP.drawnPath(WM, el, WM.ENVS.uhv, 1e4);
check('An object lighter than the molecules that hit it is recorded at its own hbar/|p|, whatever its temperature',
  [e300, e1e4].every(d => Math.abs(d.ratio * Math.sqrt(3) - 1) < 0.01),
  `electron in lab vacuum: resolution ${e300.ratio.toFixed(3)} and ${e1e4.ratio.toFixed(3)} of hbar/p per direction at 300 K and 10^4 K (1/sqrt 3 = 0.577)`, 'Witness Map model');
const rbCold = QP.drawnPath(WM, WM.OBJECTS.find(o => o.id === 'rb'), WM.ENVS.uhv, 1e-6);
check('A rubidium atom cooled to 1 uK in a room-temperature vacuum is recorded far finer than its hbar/p',
  rbCold.ratio < 1e-3, `resolution ${fmt(rbCold.resolution)} m against hbar/p ${fmt(rbCold.lambdaBar)} m (ratio ${fmt(rbCold.ratio)}), by leftover-gas hits`, 'Witness Map model');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
