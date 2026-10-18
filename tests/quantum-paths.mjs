// Checks the quantum paths model against published numbers and its own closed forms. Run: npm test.
// Each check states the source, the published or expected value, the model's value and the tolerance.
// PASS: agreement within the tolerance. DIFF: a disagreement recorded in CORRECTIONS.md. A DIFF still passes, but only
// while the model's ratio to the published value stays inside the recorded range, so any change shows up here.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const QP = require('../quantum-paths/paths.js');
const WM = require('../witness-map/model.js');
const { C, awLength, awLengthRelativistic, localDimension, dimensionFromS, brownianS } = QP;

let fails = 0, diffs = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  expected ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function differs(name, got, want, lo, hi, why, src) {
  const r = got / want, ok = got > 0 && r >= lo && r <= hi;
  console.log(`${ok ? 'DIFF' : 'FAIL'}  ${name}\n      model ${fmt(got)}  published ${fmt(want)}  (model/published ${r.toPrecision(3)}, recorded ${lo} to ${hi})  ${src}\n      ${why}`);
  if (ok) diffs++; else fails++;
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
  `local slope D = 1.5 at ${x15.toFixed(3)} hbar/p`, 'model (Abbott & Wise give the two limits and the scale hbar/p; D between them is not theirs)');

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
//    (2010)) held a silica bead (nominally 3 um; 2.79 um in their analysis) in an optical trap in air: momentum
//    relaxation 48.5 us at 99.8 kPa and 147.3 us at 2.75 kPa (fits to the velocity autocorrelation), rms speed
//    0.422 and 0.425 mm/s. Model: Stokes drag with the Cunningham slip correction, for the 2.79 um bead and the mass
//    the rms speed implies (Li et al. computed that mass from the bead's size and density, so it is not independent).
const LI = 'Li et al., Science 328, 1673 (2010); Li & Raizen, Ann. Phys. 525, 281 (2013)';
const vrms = 0.4235e-3, Tb = 297, mb = C.kB * Tb / (vrms * vrms);
const taup = P => mb / QP.stokesCunningham({ r: 1.395e-6, eta: 1.81e-5, mfp: 68e-9 * 101.325e3 / P });
within('Bead in air at 99.8 kPa: momentum relaxation time (s)', taup(99.8e3), 48.5e-6, 1.1, LI);
differs('Bead in air at 2.75 kPa: momentum relaxation time (s)', taup(2.75e3), 147.3e-6, 1.15, 1.22,
  `the slip correction overestimates the low-pressure time: the ratio of the two times, which does not depend on the mass, is ${(taup(2.75e3) / taup(99.8e3)).toFixed(2)} against ${(147.3 / 48.5).toFixed(2)} measured`, LI);
const bead = { sigmaV: vrms, taup: 48.5e-6 }, Sb = t => brownianS(t, bead);
check('A free bead with these numbers is smooth below its ballistic length (~20 nm) and rough above it',
  dimensionFromS(Sb, 1e-7) < 1.01 && dimensionFromS(Sb, 1e-1) > 1.99,
  `D = ${dimensionFromS(Sb, 1e-7).toFixed(3)} over ${(Math.sqrt(Sb(1e-7)) * 1e9).toFixed(2)} nm, ${dimensionFromS(Sb, 1e-1).toFixed(3)} over ${(Math.sqrt(Sb(1e-1)) * 1e6).toFixed(1)} um`,
  'model (free bead), tau_p from ' + LI);
// The bead they measured was trapped (eq. 1, w0 = 2 pi x 3064 Hz at 99.8 kPa and 3168 Hz at 2.75 kPa). Its trap holds
// it within about 22 nm rms, no more than its ballistic length, so its path never settles into D = 2.
const slopeD = (S, tau) => { const e = 1e-4, a = Math.log(S(tau * (1 + e)) / S(tau * (1 - e))) / Math.log((1 + e) / (1 - e)); return a > 0 ? 2 / a : NaN; };
function roughDecades(S) { // longest stretch of log10 tau over which the local D = 2 / (dln S / dln tau) is within 0.1 of 2
  let best = 0, run = 0; const step = 1e-3;
  for (let lt = -8; lt <= -2; lt += step) { if (Math.abs(slopeD(S, Math.pow(10, lt)) - 2) < 0.1) best = Math.max(best, run += step); else run = 0; }
  return best;
}
const trap = [[99.8, 0.422e-3, 48.5e-6, 3064], [2.75, 0.425e-3, 147.3e-6, 3168]].map(([P, sigmaV, tp, f]) => {
  const o = { sigmaV, taup: tp, w0: 2 * Math.PI * f };
  return { P, size: sigmaV / o.w0, ballistic: sigmaV * tp, rough: roughDecades(t => QP.trappedS(t, o)) };
});
const tFree = crossing(t => 2 - slopeD(Sb, t), 1e-6, 1, 0.1), xFree = Math.sqrt(Sb(tFree));
check('The trapped bead Li et al. measured has no rough stretch: D is within 0.1 of 2 for under 0.05 of a decade',
  trap.every(t => t.rough < 0.05) && xFree > 3 * Math.SQRT2 * trap[0].size,
  trap.map(t => `${t.P} kPa: trap ${(t.size * 1e9).toFixed(1)} nm rms, ballistic ${(t.ballistic * 1e9).toFixed(1)} nm, ${t.rough.toFixed(3)} decade`).join('; ') +
  `; a free bead reaches D = 1.9 only after ${(tFree * 1e6).toFixed(0)} us, ${(xFree * 1e9).toFixed(0)} nm rms`, 'model, with eq. (1) and the trap frequencies of ' + LI);

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

console.log(fails ? `\n${fails} check(s) failed` : `\nall checks pass (${diffs} recorded disagreement${diffs === 1 ? '' : 's'}, see CORRECTIONS.md)`);
process.exit(fails ? 1 : 0);
