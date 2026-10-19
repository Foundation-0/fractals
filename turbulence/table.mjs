// Prints where turbulence repeats itself and where it stops: the Kolmogorov scale in air and water, the Sabra cascade
// (flux, exact third-order law, scaling exponents, the dissipation cut against Reynolds number), the solar wind's ion
// scales and the molecular-cloud sonic scale.
// Usage: node turbulence/table.mjs          (about a minute: the long run and the viscosity scan)
//        node turbulence/table.mjs quick    (a few seconds: the CI run instead, no scan)
import { createRequire } from 'node:module';
const T = createRequire(import.meta.url)('./model.js');
const quick = process.argv[2] === 'quick';
const e2 = x => x.toExponential(2), f3 = x => x.toFixed(3);

console.log('Kolmogorov scale eta = (nu^3/eps)^(1/4)\n');
console.log('medium'.padEnd(10) + 'eps W/kg'.padStart(10) + 'eta mm'.padStart(9) + '   where');
for (const [med, eps, where] of [['air', 0.4, 'surface layer, cold front'], ['air', 0.05, 'surface layer before the front'], ['air', 3.4e-3, '(eta = 1 mm)'],
  ['air', 1e-7, 'quiet nocturnal boundary layer'], ['seawater', 1e-6, '(eta = 1 mm)'], ['seawater', 1e-7, 'upper mixed layer, by day'], ['seawater', 1e-8, 'upper mixed layer, quieter']]) {
  console.log(med.padEnd(10) + e2(eps).padStart(10) + (T.kolmogorov(T.NU[med], eps).eta * 1e3).toFixed(2).padStart(9) + '   ' + where);
}

console.log('\nHow many decades the repetition spans\n');
for (const [name, ratio] of [['Wind tunnel, R_lambda = 6000: L/eta (Pope\'s conventions)', T.outerOverEta(6000)],
  ['Atmospheric surface layer, R_lambda ~ 1e4: L/eta', T.outerOverEta(1e4)],
  ['Interstellar electron density, 2e6 to 1e13 m (measured)', 1e13 / 2e6], ['the same, extended to 1e17 m (Kolmogorov assumed)', 1e17 / 2e6]]) {
  console.log(`${name.padEnd(62)} ${Math.log10(ratio).toFixed(1)} decades`);
}

const R = quick ? T.RUNS.CI : T.RUNS.TABLE;
const t0 = Date.now(), res = T.simulate(R), a = T.analyse(res), av = a.av, k = res.model.k, c = res.config;
console.log(`\nSabra shell model (${quick ? 'CI' : 'long'} run): N = ${c.N} shells, nu = ${e2(c.nu)}, dt = ${c.dt}, force 0.005(1 + i) on shell 0, ` +
  `${c.nBlocks} blocks x ${c.blockTime} time units after ${c.transient} (${((Date.now() - t0) / 1e3).toFixed(1)} s)`);
console.log(`eps = ${e2(a.eps)} +- ${e2(a.epsErr)}, dissipation ${e2(a.dis)}, U = ${f3(a.U)}, large-eddy time L/U = ${(a.L / a.U).toFixed(1)}, ` +
  `Re = U L/nu = ${e2(a.Re)}, k_eta = (eps/nu^3)^(1/4) at shell ${a.nEta.toFixed(2)}\n`);
console.log('  n   Pi_n/eps   3 k_n Sigma_n/eps   exact 1 - (-1/2)^n   log2 <|u_n|^2>');
for (let n = 0; n < c.N - 1; n++) {
  console.log(String(n).padStart(3) + f3(av.Pi[n] / a.eps).padStart(11) + (3 * k[n + 2] * av.Sig[n] / a.eps).toFixed(4).padStart(20) +
    (1 - Math.pow(-0.5, n)).toFixed(4).padStart(21) + Math.log2(av.S[1][n]).toFixed(2).padStart(17));
}
console.log(`\nScaling exponents over shells ${a.n1}..${a.n2}: value +- batch-means error [half-range over fit ranges n1 +- 1, n2 +- 1]`);
console.log('u: plain <|u_n|^p>; F: flux-based <|Pi_n/k_n|^(p/3)>; essF: F against F_3 (extended self-similarity)\n');
console.log('  p' + ['u', 'F', 'essF'].map(s => s.padStart(26)).join('') + 'K41'.padStart(8) + 'She-Leveque'.padStart(13));
for (let p = 0; p < T.PMAX; p++) {
  console.log(String(p + 1).padStart(3) + T.KEYS.map(s => `${f3(a.zeta[s][p])} +- ${a.err[s][p].toFixed(4)} [${f3(a.spread[s][p])}]`.padStart(26)).join('') +
    f3(T.k41(p + 1)).padStart(8) + f3(T.sheLeveque(p + 1)).padStart(13));
}
console.log("L'vov et al. 1998, Table I (34 shells, forcing on shells 0-1): <|u|^q> zeta_2,4,6 = 0.720 +- 0.008, 1.256 +- 0.012, 1.706 +- 0.015;");
console.log('  flux-based, q = 2, 4, 5, 6, 7: 0.719, 1.249, 1.477, 1.691, 1.893 (as read from the paper in #34\'s review).');
console.log('Measured in a wind tunnel at R_lambda 2000-6000: zeta_2 = 0.693 +- 0.011 (Kuchler, Bodenschatz & Bewley 2020, arXiv:2006.10993v2;');
console.log('  the abstract still gives +- 0.003); the same group\'s later analysis gives 0.698 +- 0.011.');
console.log(`Velocity across a size l grows as l^(zeta_2/2): ${f3(a.zeta.essF[1] / 2)} here, 1/3 in K41, ${f3(T.sheLeveque(2) / 2)} for She-Leveque, 1/2 for shocks.`);
const fl = a.av.S[3].map((s4, n) => s4 / (a.av.S[1][n] * a.av.S[1][n])), hStar = (a.zeta.essF[3] - a.zeta.essF[1]) / 2;
console.log(`Flatness <|u|^4>/<|u|^2>^2 grows toward small scales as k^(2 zeta_2 - zeta_4) = k^${f3(2 * a.zeta.essF[1] - a.zeta.essF[3])}: ` +
  `${[2, 4, 6, 8, 10].map(n => `${fl[n].toFixed(2)} at shell ${n}`).join(', ')}.`);

if (!quick) {
  console.log('\nWhere the cascade stops, against Reynolds number (each run 8 blocks; the nu = 1e-7 row is the long run)\n');
  console.log('     nu   N         Re   n_eta   flux half-point   n_d - n_eta   spectrum half-point   width, decades   (3/4) log10 Re');
  const xs = [], cuts = { 'flux 75%': [], 'flux 50%': [], 'flux 25%': [], 'spectrum 50%': [], 'spectrum 25%': [] };
  const nds = [], ndErrs = [];
  for (const cfg of T.RUNS.SCAN) {
    const r = cfg.nu === R.nu ? { res, a } : (() => { const rr = T.simulate(cfg); return { res: rr, a: T.analyse(rr) }; })(), q = r.a;
    const width = q.nd * Math.log10(2), dec = n => n * Math.log10(2);
    xs.push(Math.log10(q.Re)); nds.push(width); ndErrs.push(q.ndErr * Math.log10(2));
    for (const f of [0.75, 0.5, 0.25]) cuts[`flux ${f * 100}%`].push(dec(T.fluxCut(q.av, q.eps, f)));
    for (const f of [0.5, 0.25]) cuts[`spectrum ${f * 100}%`].push(dec(T.spectralCut(q.av, q.n1, q.n2, f)));
    console.log(e2(cfg.nu).padStart(7) + String(cfg.N).padStart(4) + e2(q.Re).padStart(11) + q.nEta.toFixed(2).padStart(8) + `${q.nd.toFixed(2)} +- ${q.ndErr.toFixed(2)}`.padStart(18) +
      (q.nd - q.nEta).toFixed(2).padStart(14) + q.ndSpec.toFixed(2).padStart(22) + width.toFixed(2).padStart(17) + (0.75 * Math.log10(q.Re)).toFixed(2).padStart(17));
  }
  console.log('Width in decades (forcing shell to the cut) against log10 Re, slope by where the cut is put (where the flux or the');
  console.log('spectrum, relative to its power law, has fallen to the given fraction):');
  console.log('  ' + Object.entries(cuts).map(([name, ys]) => `${name} ${f3(T.linfit(xs, ys).slope)}`).join(', '));
  { // the flux half-points weighted by their batch-means errors
    const w = ndErrs.map(e => 1 / (e * e)), W = w.reduce((a, x) => a + x, 0), mx = xs.reduce((a, x, i) => a + w[i] * x, 0) / W, my = nds.reduce((a, y, i) => a + w[i] * y, 0) / W;
    const sxx = xs.reduce((a, x, i) => a + w[i] * (x - mx) ** 2, 0), b = xs.reduce((a, x, i) => a + w[i] * (x - mx) * (nds[i] - my), 0) / sxx;
    console.log(`  flux half-point weighted by its errors: ${f3(b)} +- ${f3(1 / Math.sqrt(sxx))} (one seed; the spread over seeds is larger, see the README)`);
  }
  console.log(`K41: 3/4. Viscous loss at the cut, nu k_d^2 S_2(k_d) = eps with S_2 ~ k^-zeta_2: 1/(2 - zeta_2) = ${f3(1 / (2 - a.zeta.essF[1]))}.`);
  console.log(`Multifractal cut-off Re^(1/(1 + h*)), h* = dzeta_p/dp at p = 3 ~ (zeta_4 - zeta_2)/2: ${f3(1 / (1 + hStar))}. A local Reynolds number`);
  console.log(`of 1 on the rms velocity at the cut, S_2(k_d)^(1/2) = nu k_d, would give 2/(2 + zeta_2) = ${f3(2 / (2 + a.zeta.essF[1]))}, below 3/4.`);
}

const W = T.WIND, di = T.inertialLength(W.n), col = T.protonCollisions(W), cool = T.protonCollisions({ ...W, T: 4e4 }), psi = T.parkerAngle(W.V);
console.log(`\nSolar wind at 1 AU (n = ${W.n / 1e6} cm^-3, V = ${W.V / 1e3} km/s, B = ${W.B * 1e9} nT, T = ${e2(W.T)} K, beta_p = ${T.betaP(W).toFixed(2)};` +
  ` Parker-spiral angle ${(psi * 180 / Math.PI).toFixed(0)} deg)\n`);
console.log('length'.padEnd(40) + 'km'.padStart(6) + '   swept past at V: no angle, V sin(theta_BV)');
for (const [name, ell] of [['proton inertial length c/omega_pi', di], ['proton gyroradius, v_th = sqrt(2kT/m)', T.gyroradius(W.T, W.B, 2)],
  ['proton gyroradius, v_th = sqrt(kT/m)', T.gyroradius(W.T, W.B, 1)]]) {
  console.log(`${name.padEnd(40)} ${(ell / 1e3).toFixed(0).padStart(5)}   ${T.taylorFrequency(W.V, ell).toFixed(2).padStart(10)} Hz ${T.taylorFrequency(W.V, ell, psi).toFixed(2).padStart(10)} Hz`);
}
console.log(`proton collision time ${(col.tau / 86400).toFixed(0)} days, mean free path ${(col.mfp / T.C.AU).toFixed(2)} AU = ${e2(col.mfp / di)} inertial lengths;` +
  ` at 4e4 K ${(cool.tau / 86400).toFixed(0)} days, ${(cool.mfp / T.C.AU).toFixed(2)} AU (ln Lambda = 25)`);
console.log('Observed: breaks between 0.1 and 1 Hz across conditions, at the larger ion scale (Chen et al. 2014). Sahraoui et al. (2009) find');
console.log('0.4 Hz in one fast, high-beta interval and read it as the proton gyroscale; Leamon et al.\'s 33 intervals, as replotted in 2000,');
console.log('run from about 0.12 to 0.87 Hz, mean near 0.38 Hz. Both estimates above lie inside the spread; the data do not choose.');

console.log(`\nMolecular clouds at 10 K: sound speed ${(T.soundSpeed(10) / 1e3).toFixed(3)} km/s (mu = 2.33). Where the 1D non-thermal dispersion falls to it:\n`);
console.log(`Larson (1981), sigma_3D = 1.10 L^0.38, which holds the gas's thermal sigma_s = 0.32 km/s: L = ${T.sonicScale(T.LARSON81).toFixed(3)} pc (maximum projected size);` +
  ` non-thermal Mach ${[0.1, 1, 10, 100].map(l => T.machAt(T.LARSON81, l).toFixed(1)).join(', ')} at 0.1, 1, 10, 100 pc`);
console.log(`  Larson's own criterion, sigma = sigma_s (p. 820): L = ${Math.pow(T.LARSON81.thermal(10) / T.LARSON81.coef, 1 / T.LARSON81.exp).toFixed(3)} pc`);
{ const ds = []; for (const c of [0.9, 1.1]) for (const e of [0.45, 0.55]) ds.push(2 * T.sonicScale(T.solomon(c, e)));
  console.log(`Solomon et al. (1987), sigma_1D = 1.0 S^0.5 = ${T.SOLOMON87.coef.toFixed(3)} R^0.5, R = 1.92 S, CO's thermal width removed: R = ${T.sonicScale(T.SOLOMON87).toFixed(3)} pc` +
    ` (effective radius), diameter ${(2 * T.sonicScale(T.SOLOMON87)).toFixed(3)} pc; ${Math.min(...ds).toFixed(2)} to ${Math.max(...ds).toFixed(2)} pc across within the fit's errors`); }
console.log('Larson\'s data reach about 0.1 pc; Solomon et al.\'s giant clouds are pc-sized and larger. Observed: filaments 0.10 +- 0.03 pc wide');
console.log('(FWHM); coherent cores of about 0.1 pc. Below the sonic scale a shallower, subsonic cascade continues.');
