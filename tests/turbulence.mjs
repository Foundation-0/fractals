// Checks the turbulence model against exact relations, published numbers and its own long run. Run: npm test.
// Each check states the source, the published or expected value, the model's value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const T = require('../turbulence/model.js');

let fails = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  expected ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function close(name, got, want, tol, src) {
  const ok = Math.abs(got - want) <= tol;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${got.toFixed(4)}  expected ${want.toFixed(4)}  (+- ${tol})  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const SAB = "Sabra model of L'vov et al., Phys. Rev. E 58, 1811 (1998)";

// 1. The shell model conserves what it cascades: with a + b + c = 0, energy and a helicity-like second invariant
//    (inviscid, unforced, 10 shells, t = 200, dt = 1e-3). The opposite sign convention for c does not conserve energy.
const good = T.conservation({ N: 10, dt: 1e-3, T: 200, qs: [-2] });
check('Energy and helicity conserved to integrator accuracy when a + b + c = 0 (a = 1, b = c = -1/2)',
  Math.abs(good.dE) < 1e-9 && Math.abs(good.dH[0]) < 1e-8, `max |dE|/E = ${fmt(good.dE)}, max |dH|/norm = ${fmt(good.dH[0])}`,
  SAB + ' (a + b + c = 0 as stated there, seen in search text; derivation in model.js)');
const bad = T.conservation({ N: 10, c: 0.5, dt: 1e-3, T: 200, stopAt: 0.5 });
check('With a + b - c = 0 instead (c = +1/2), energy is not conserved', bad.tStop !== null && bad.tStop < 5,
  `E changes by more than 50% by t = ${bad.tStop === null ? 'never' : bad.tStop.toFixed(2)}`, 'model');

// 2. The cascade: in a steady state the same energy flux passes through every shell between the forcing and the
//    dissipation, and a third-order correlator scales exactly as 1/k_n (the shell model's 4/5 law).
//    CI run: 18 shells, nu = 1e-6, force 0.005(1 + i) on shell 0, 4,800 time units (about 860 large-eddy times).
const res = T.simulate(T.RUNS.CI), a = T.analyse(res), av = a.av, eps = a.eps, k = res.model.k, P = a.plateau;
console.log(`      (CI run: ${res.steps} steps, eps = ${fmt(eps)}, Re = U L/nu = ${fmt(a.Re)}, k_eta = (eps/nu^3)^(1/4) at shell ${a.nEta.toFixed(2)})`);
close('Mean dissipation over mean injection', a.dis / eps, 1, 0.01, 'energy balance');
const shape = [0, 1, 2, 3, 4, 5, 6].map(n => av.Pi[n] / P);
check('The energy flux is the same through every shell from the forcing to n = 6, and equals the injection',
  Math.abs(P / eps - 1) <= 0.012 && shape.every(x => Math.abs(x - 1) <= 0.006),
  `plateau P/eps = ${(P / eps).toFixed(4)} (+- 0.012); Pi_n/P = ${shape.map(x => x.toFixed(4)).join(' ')} (+- 0.006)`, 'exact flux from the triads (model.js)');
const law = [1, 2, 3, 4, 5].map(n => [3 * k[n + 2] * av.Sig[n] / P, 1 - Math.pow(-0.5, n)]);
check("Shell-model 4/5 law: 3 k_n <Im u*_{n-1} u*_n u_{n+1}> = eps (1 - (-1/2)^n), helicity injected at eps on shell 0",
  law.every(([g, w]) => Math.abs(g - w) <= 0.005), law.map(([g, w]) => `${g.toFixed(4)}/${w.toFixed(4)}`).join(' ') + ' (model/exact, +- 0.005)',
  'derived from the model equation (model.js); the literature form was not seen');

// 3. But the statistics do not repeat exactly. Kolmogorov 1941 (K41) predicts structure-function exponents p/3; the
//    cascade is intermittent, so zeta_2 > 2/3 and zeta_6 < 2. Exponents from extended self-similarity of the
//    flux-based structure functions <|Pi_n/k_n|^(p/3)> over shells 3..8 (the plain <|u_n|^p> ripple from shell to shell).
const z = p => a.zeta.essF[p - 1], ze = p => a.err.essF[p - 1];
check('Anomalous scaling: zeta_2 above 2/3 and zeta_6 below 2, each by more than 5 batch-means errors',
  z(2) - 2 / 3 > 5 * ze(2) && 2 - z(6) > 5 * ze(6), `zeta_2 = ${z(2).toFixed(3)} +- ${ze(2).toFixed(4)}, zeta_6 = ${z(6).toFixed(3)} +- ${ze(6).toFixed(4)}`,
  'K41: Kolmogorov, Dokl. Akad. Nauk SSSR 30 (1941)');
const LONG = { 2: [0.719, 0.01], 4: [1.255, 0.015], 6: [1.716, 0.03] };
for (const p of [2, 4, 6]) close(`zeta_${p}, CI run against the long run`, z(p), LONG[p][0], LONG[p][1], 'this model, node turbulence/table.mjs (20,000 time units)');
const KUCHLER = [0.693, 0.003];
check('The shell model is more intermittent than measured turbulence: its zeta_2 - 2/3 exceeds the measured one by over 5 errors',
  z(2) - KUCHLER[0] > 5 * KUCHLER[1],
  `model ${(z(2) - 2 / 3).toFixed(3)}, measured ${(KUCHLER[0] - 2 / 3).toFixed(3)} +- ${KUCHLER[1]} (zeta_2 = 0.693 at R_lambda 2000-6000, after a decay correction); She-Leveque ${(T.sheLeveque(2) - 2 / 3).toFixed(3)}`,
  'Kuchler, Bodenschatz & Bewley, arXiv:2006.10993 (2020), as seen in search text; She & Leveque, PRL 72, 336 (1994)');

// 4. Where the cascade stops: K41 puts the end at k_eta = (eps/nu^3)^(1/4) up to an O(1) factor it does not predict.
check('The flux falls to half, and <|u_n|^2> to half its power law, within 1.5 shells (a factor 2.8) of k_eta',
  Math.abs(a.nd - a.nEta) <= 1.5 && Math.abs(a.ndSpec - a.nEta) <= 1.5,
  `flux half-point ${a.nd.toFixed(2)}, spectrum half-point ${a.ndSpec.toFixed(2)}, k_eta at ${a.nEta.toFixed(2)} (shells)`, 'K41 dissipation scale');

// 5. Real flows: the Kolmogorov scale eta = (nu^3/eps)^(1/4) for published dissipation rates.
const etaMm = (nu, e) => T.kolmogorov(nu, e).eta * 1e3;
const ocean = [1e-8, 1e-7].map(e => etaMm(T.NU.seawater, e)), air = [0.4, 0.05, 1e-7].map(e => etaMm(T.NU.air, e));
check('Upper-ocean mixed layer: eps 1e-8 to 1e-7 W/kg, as at one station, puts eta at 1.8 to 3.3 mm; 1 mm needs 1e-6',
  ocean[0] > 3 && ocean[0] < 3.5 && ocean[1] > 1.7 && ocean[1] < 2, `eta = ${ocean.map(x => x.toFixed(2)).join(' and ')} mm; 1e-6 W/kg gives ${etaMm(T.NU.seawater, 1e-6).toFixed(2)} mm`,
  'arithmetic; eps from Yang et al., Sensors 22, 1167 (2022), one 25-hour station, as seen in search text');
check('Air: eta from 0.3 mm (eps 0.4 m^2/s^3, a cold front) to 1.4 cm (1e-7, a quiet night)',
  air[0] > 0.28 && air[0] < 0.32 && air[2] > 13 && air[2] < 14.5, `eta = ${air.map(x => x.toFixed(2)).join(', ')} mm for eps = 0.4, 0.05, 1e-7`,
  'arithmetic; eps from Balsley, Tjernstrom & Svensson, AMS 18th Symp. Boundary Layers and Turbulence (2008), as seen in search text');

// 6. The solar wind is too dilute for viscosity: protons cross 0.2 to 1 AU between collisions, so the MHD cascade ends at
//    the ion scales instead, and a steeper kinetic one continues to the electrons. Typical wind at 1 AU: n = 5 cm^-3,
//    V = 400 km/s, B = 5 nT, T = 1e5 K (slow-wind protons are cooler, a few 1e4 K).
const W = T.WIND, di = T.inertialLength(W.n), rho = T.gyroradius(W.T, W.B, 2), col = T.protonCollisions(W), cool = T.protonCollisions({ ...W, T: 4e4 });
within('Proton inertial length c/omega_pi at n = 5 cm^-3 (km)', di / 1e3, 228 / Math.sqrt(5), 1.002, 'NRL Plasma Formulary, 228 km / sqrt(n per cm^3), as seen in search text');
check('Collisionless: the proton mean free path is over 10^5 inertial lengths, at 1e5 K and at 4e4 K', col.mfp / di > 1e5 && cool.mfp / di > 1e5,
  `mean free path ${(col.mfp / T.C.AU).toFixed(2)} AU at 1e5 K (collision time ${(col.tau / 86400).toFixed(0)} days), ${(cool.mfp / T.C.AU).toFixed(2)} AU at 4e4 K; ${fmt(cool.mfp / di)} d_i at least (ln Lambda = 25)`,
  'Braginskii, Rev. Plasma Phys. 1, 205 (1965), ion collision time');
const psi = T.parkerAngle(W.V), fdi = T.taylorFrequency(W.V, di, psi), frho = T.taylorFrequency(W.V, rho, psi);
check('The ion inertial length swept past at V sin(theta_BV), with the Parker-spiral angle, lands in the observed 0.4-0.5 Hz',
  fdi >= 0.4 && fdi <= 0.5,
  `V sin(${(psi * 180 / Math.PI).toFixed(0)} deg)/(2 pi d_i) = ${fdi.toFixed(3)} Hz (${T.taylorFrequency(W.V, di).toFixed(2)} Hz with no angle); gyroradius ${frho.toFixed(2)} Hz`,
  'Sahraoui et al., PRL 102, 231102 (2009): 0.4 Hz; Leamon et al., JGR 103, 4775 (1998): about 0.5 Hz on average; both as seen in search text');

// 7. Molecular clouds: the cascade is supersonic at large scales and stops being so at the sonic scale, where the
//    non-thermal velocity falls to the sound speed (0.19 km/s at 10 K). Larson's data reach about 0.1 pc; Solomon et
//    al.'s giant clouds are pc-sized and larger, so their sonic size is an extrapolation of over a decade. The two
//    differ by a factor of 3 through their size conventions.
const sL = T.sonicScale(T.LARSON81), sS = 2 * T.sonicScale(T.SOLOMON87);
check('Sonic sizes from Larson (maximum size, CO thermal width removed) and Solomon et al. (diameter) bracket the 0.10 pc filament width',
  sL < 0.1 && sS > 0.1, `Larson ${sL.toFixed(3)} pc, Solomon et al. ${sS.toFixed(3)} pc, filaments 0.10 +- 0.03 pc (FWHM); Larson's non-thermal Mach number ${T.machAt(T.LARSON81, 0.1).toFixed(1)} at 0.1 pc`,
  'Larson, MNRAS 194, 809 (1981); Solomon et al., ApJ 319, 730 (1987); Arzoumanian et al., A&A 529, L6 (2011); all as seen in search text');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
