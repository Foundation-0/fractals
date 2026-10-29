// Checks the critical-point study (critical/model.js, issue #20) against exact or high-precision results: Onsager's
// T_c and energy, Yang's magnetisation, the exact correlation length, the 2D Ising exponents, Salas and Sokal's
// high-precision Binder cumulant at T_c, the measurement trap in cluster runs, Newman and Ziff's measured percolation
// threshold, 0.59274621(13), whose error is negligible here, and the 91/48 dimension; and against Ziff and Newman's
// measurements of the same percolation system at finite sizes: their crossings of two sizes test the open-edge shift,
// and one point tests the runs. Run: npm test (or node tests/critical.mjs).
// Each check states the source, the value compared with (exact or high-precision, or in two checks Ziff and Newman's
// measurements), the model's value and the tolerance. Monte Carlo runs use fixed seeds and integer-only random
// numbers, so every run, on every Node version, prints the same numbers. Ising error bars are jackknife
// estimates over 40 blocks. The percolation checks use the mean over nine seeds, the study seed and eight others, with
// the standard error of that mean as error bar: the scatter between the nine seeds over 3. Each tolerance is a fixed
// number, 3 to 5 standard deviations of the noisiest estimate it covers, plus any finite-size shift: worked out from
// published results, except for D, whose shortfall is measured, in these runs and in the independent 120-seed repeat
// below, which give the same bound. For D, the two p_c crossings and the Binder cumulant at L = 16 the two sides are
// bounded separately, so the shift widens one side only; every other check has one tolerance for both sides. A sigma
// count below is (tolerance - shift) / sigma, with sigma and shift as quoted, on the side the shift points to; on the
// other side it is tolerance / sigma and allows no shift. Runs at several temperatures share one tolerance, so the
// quieter runs are held to it more loosely: |m| at T = 2.0 and 2.1 to 17 and 10 sigma, the energy at T = 2.0, 2.1, 2.4
// and 2.5 to between 5 and 8 sigma. For the Ising runs the standard deviation is the jackknife error. Over the 120
// repeat seeds below it matches the scatter between seeds within about 10% on average, but this seed's errors from the
// runs reweighted to T_c (L = 8 to 128) come out 6% to 17% below that scatter, so those checks also quote the scatter.
// For percolation it is the standard error of the nine-seed mean. It comes out 9% above the repeat's scatter of a
// nine-seed mean (its scatter between seeds over 3) for the crossing of L = 32 and 128, 44% above for 64 and 256, 16%
// above for the point where R = 1/2 at L = 32 and 20% below for D, so those checks also quote that scatter. Against
// the seed-to-seed scatter, on the side each shift points to, the tightest checks are gamma/nu (3.0 sigma after its
// +0.0012 finite-size bias), the Binder crossing of L = 64 and 128 (3.5 sigma) and the energy above T_c (3.6 sigma, at
// T = 2.75). D's low side is 3.8 sigma of the repeat's scatter of a nine-seed mean beyond the shortfall the repeat
// expects. Its high side, the far side, is 3.1 sigma by the rule above, which allows no shift, but it sits 0.0222 (8.7
// sigma) above the value the repeat expects, so the high side guards only against gross errors. In a one-off repeat at
// these tolerances with 120 other sets of seeds (each study seed plus 10000k, k = 1 to 120; not one of the
// repository's scripts), 119 passed every Ising check; the other missed the crossing of L = 64 and 128 by 0.0003. The
// repeat predates the pooled percolation checks, but it saved each seed's percolation crossings and D, and a rerun of
// its percolation seeds, which reproduced those exactly, saved the points where R = 1/2 too: split into 13 sets of
// nine seeds, all 13 pass the pooled checks, and of 200000 sets of nine drawn at random from the 120, 37 fail, 3 on D
// and 34 on the point where R = 1/2 at L = 32. That is one draw, by a resampler that is not one of the repository's
// scripts either: 100 other draws of 200000 give 22 to 60 failures, about 2 in 10000, nearly all on that point. Each
// line prints the margin it passes by.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const CR = require('../critical/model.js');
const { TC, KC, EXP, PERC } = CR;
const start = Date.now();

let fails = 0;
const fmt = (x, d) => x.toFixed(d === undefined ? 4 : d);
const sci = x => x.toExponential(1);
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
// A Monte Carlo estimate {value, err} against a reference value: passes if ref - lo <= model <= ref + hi, where tol is
// one number (lo = hi = tol) or [lo, hi], and the error bar is finite (a jackknife replicate can fail and give NaN).
// `label` names the value compared with when it is not an exact value: 'reference' for Newman and Ziff's measured
// threshold and Salas and Sokal's V4 (exact CFT correlators integrated numerically), whose errors (1.3e-7, and 1.6e-6
// in U) are negligible here, 'measured' for a finite-size measurement.
function near(name, est, want, tol, src, why, d, label = 'exact') {
  const [lo, hi] = Array.isArray(tol) ? tol : [tol, tol], dev = est.value - want;
  const finite = Number.isFinite(est.err), ok = finite && dev >= -lo && dev <= hi;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(est.value, d)} ± ${fmt(est.err, d)}  ${label} ${fmt(want, d)}  ` +
    `(within ${lo === hi ? fmt(hi, d) : `-${fmt(lo, d)}/+${fmt(hi, d)}`}; off by ${fmt(dev, d)} = ${(dev / est.err).toFixed(1)} sigma; ` +
    `margin ${fmt(Math.min(hi - dev, dev + lo), d)})  ${src}` + (finite ? '' : '\n      the error bar is not finite') + (why ? `\n      ${why}` : ''));
  if (!ok) fails++;
}
// The same with a relative tolerance.
function nearRel(name, est, want, rel, src, why) {
  const dev = est.value / want - 1, finite = Number.isFinite(est.err), ok = finite && Math.abs(dev) <= rel;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${est.value.toFixed(3)} ± ${est.err.toFixed(3)}  exact ${want.toFixed(3)}  ` +
    `(within ${(rel * 100).toFixed(0)}%; off by ${(dev * 100).toFixed(1)}% = ${((est.value - want) / est.err).toFixed(1)} sigma; ` +
    `margin ${((rel - Math.abs(dev)) * 100).toFixed(1)} points)  ${src}` + (finite ? '' : '\n      the error bar is not finite') +
    (why ? `\n      ${why}` : ''));
  if (!ok) fails++;
}

// 1. No Monte Carlo: the closed forms against the published formulas, the open-edge shift also against Ziff & Newman's
//    measured crossings (Table 1), and the random-number generator.
const ONS = 'Onsager 1944', YANG = 'Yang 1952', CHPV = 'Caselle, Hasenbusch, Pelissetto & Vicari 2002 (arXiv:cond-mat/0106372)';
check('Critical temperature: sinh(2/T_c) = 1, T_c = 2/ln(1 + sqrt 2)', Math.abs(Math.sinh(2 / TC) - 1) < 1e-14 && Math.abs(KC - 0.4406868) < 1e-7,
  `T_c = ${TC.toFixed(6)}, 1/T_c = ${KC.toFixed(7)} (published 0.4406868...)`, `${ONS}; ${CHPV} sec. 2.1`);
// Energy per spin u = -dF/dK from the free energy F(K) = (1/2) ln(2 cosh^2 2K) + int_0^pi dtheta/(2 pi)
// ln[1 + (1 - cos^2 theta / (1 + tau^2))^(1/2)], tau = (1/sinh 2K - sinh 2K)/2, integrated and differentiated numerically.
function freeEnergy(K) {
  const s = Math.sinh(2 * K), tau = (1 / s - s) / 2, n = 20000; let I = 0;
  for (let i = 0; i < n; i++) { const c = Math.cos((i + 0.5) * Math.PI / n); I += Math.log(1 + Math.sqrt(1 - c * c / (1 + tau * tau))); }
  return 0.5 * Math.log(2 * Math.cosh(2 * K) ** 2) + I / (2 * n);
}
const uDiff = [2.0, 2.5, 3.0, 4.0].map(T => { const K = 1 / T, h = 1e-4; return Math.abs(-(freeEnergy(K + h) - freeEnergy(K - h)) / (2 * h) - CR.energyExact(T)); });
check("Onsager's energy (elliptic-integral form) equals -dF/dK of the published free energy", Math.max(...uDiff) < 1e-6,
  `largest difference ${sci(Math.max(...uDiff))} at T = 2, 2.5, 3, 4 (numerical derivative); at T_c u = ${CR.energyExact(TC).toFixed(6)} = -sqrt 2`, `${ONS}; ${CHPV} sec. 2.1`);
const mDiff = [1.5, 2.0, 2.2, 2.26].map(T => { const s = Math.sinh(2 / T), tau = (1 / s - s) / 2, k = (Math.sqrt(1 + tau * tau) + tau) ** 2;
  return Math.abs(CR.yangM(T) / Math.pow(1 - k * k, 1 / 8) - 1); });
check("Yang's magnetisation (1 - sinh(2/T)^-4)^(1/8) equals the published (1 - k^2)^(1/8)", Math.max(...mDiff) < 1e-12,
  `largest relative difference ${sci(Math.max(...mDiff))} at T = 1.5, 2, 2.2, 2.26`, `${YANG}; ${CHPV} sec. 2.1`);
const xDiff = [2.3, 2.4, 2.5, 3, 4, 10].map(T => Math.abs(CR.xiExact(T) / CR.xiCaselle(T) - 1));
check('Correlation length 1/(ln coth K - 2K) equals the pole of the large-distance two-point function along an axis', Math.max(...xDiff) < 1e-10,
  `largest relative difference ${sci(Math.max(...xDiff))} at T = 2.3 to 10 (4 sinh^2(1/2 xi) = M_s^2)`, `Cheng & Wu 1967, as written in ${CHPV} eqs. 5.1-5.4`);
const t6 = 1e-6, amp = t6 * CR.xiExact(1 / (KC * (1 - t6)));
check('Near T_c the same correlation length is A/t with A = 1/(4 K_c) = 0.56729632855 (t = (K_c - K)/K_c)', Math.abs(amp / 0.56729632855 - 1) < 1e-5,
  `t xi = ${amp.toFixed(8)} at t = 1e-6: it is the exponential correlation length, not the second-moment one (A = 0.5670683)`,
  'Caselle, Hasenbusch, Pelissetto & Vicari 2000 (arXiv:hep-th/0003049), sec. 2');
// Percolation on a square with open edges: where the spanning probabilities of two sizes cross, from Ziff & Newman's
// expansion of R_L(p) (critical/model.js header). First against the coefficient they predict from the same b0 and a1
// for sizes L/2 and L, which catches a slip in the algebra; then against their measured crossings of L/2 and L, which
// tests whether the expansion describes this system at these sizes. Neither uses the Monte Carlo runs: section 7
// checks those against their measurements.
const ZN = 'Ziff & Newman 2002 (arXiv:cond-mat/0203496)', coef = CR.edgeShift(32, 64) * Math.pow(64, 7 / 4);
check('Open edges shift the crossing of R_L1(p) and R_L2(p) above p_c by (b0/a1)(1/L1 - 1/L2)/(L2^(3/4) - L1^(3/4)); for ' +
  "L1 = L/2 and L2 = L that is the 1.04 L^-7/4 Ziff & Newman predict from the same b0 and a1 (they measured 1.02)",
  Math.abs(coef - 1.04) < 0.005,
  `coefficient ${coef.toFixed(3)} from their b0 = ${PERC.b0} and a1 = ${PERC.a1}; the shifts used in section 6 below: ` +
  `+${fmt(CR.edgeShift(32, 128), 5)} for L = 32 and 128, +${fmt(CR.edgeShift(64, 256), 5)} for 64 and 256`, `${ZN}, secs. I, II and IV`);
// Their measured crossings (Table 1, PERC.zn.cross) less p_c, over the shift. Their errors, one in the last digit,
// are at most 1.6% of it (at L = 256); the rest of the 10% allows the terms the expansion leaves out, of relative
// order L^-0.9 (their secs. II and IV). L = 32, the crossing of 16 and 32, is left out: there those terms still take
// 14% off.
const edge = [32, 64, 128, 256].map(L => {
  const d = PERC.zn.cross[PERC.zn.Ls.indexOf(L)] - PERC.pc, s = CR.edgeShift(L / 2, L);
  return { L, d, s, r: d / s };
}), fit = edge.slice(1), worst = Math.max(...fit.map(x => Math.abs(x.r - 1)));
check("Ziff & Newman's measured crossings of R_L/2(p) and R_L(p) sit above p_c by that shift, within 10% for L = 64, 128 and 256",
  worst <= 0.1, fit.map(x => `L = ${x.L}: measured +${fmt(x.d, 6)}, shift +${fmt(x.s, 6)}, ratio ${x.r.toFixed(3)}`).join('; ') +
  `; margin ${fmt(0.1 - worst, 3)} (L = 32, left out: ratio ${edge[0].r.toFixed(3)})`, `${ZN}, secs. II and IV and Table 1`);
const r1 = CR.rng(1);
check('Random numbers are integer-only xoshiro128**: seed 1 starts 2442144158, 3238099751, 3819917871',
  [2442144158, 3238099751, 3819917871].every(v => r1() === v), 'same on every engine, so every run below is reproducible', 'model');

// 2. Below T_c: magnetisation and energy (L = 64; the correlation length is at most 9.1 lattice spacings, so finite-size
//    effects, of relative order exp(-L/xi) < 1e-3, stay below the statistical errors). Tolerances: 0.006 in |m| is
//    3.8 sigma of the noisiest run (T = 2.2, sigma = 0.0016); 0.005 in energy is 3.8 sigma of the noisiest (sigma = 0.0013).
//    The quieter runs are held to them more loosely: |m| at T = 2.0 and 2.1 to 17 and 10 sigma (sigma = 0.00035 and
//    0.00060), the energy to 7.6 and 5.2 (0.00066 and 0.00096).
const ordered = CR.studyOrdered();
for (const r of ordered) near(`Spontaneous magnetisation <|m|> at T = ${r.T} (L = ${r.L}, ${r.n} measurements)`, r.M, r.Mexact, 0.006, YANG, '', 5);
for (const r of ordered) near(`Energy per spin at T = ${r.T}`, r.e, r.eExact, 0.005, ONS, '', 5);

// 3-4. At the critical point: L = 8 to 128, runs at T = 2.27 reweighted to T_c (Ferrenberg & Swendsen 1988).
const crit = CR.studyCritical();
const cross = (L1) => crit.crossings.find(c => c.L1 === L1);
near(`T_c from the crossing of the Binder cumulants of L = 32 and 64`, cross(32).T, TC, 0.010, ONS,
  'tolerance 4.5 sigma (sigma = 0.0022), 3.8 sigma of the seed-to-seed scatter (0.0026). The leading correction to U at T_c is ' +
  'the L^-7/4 analytic background of chi (Salas & Sokal 2000, sec. 4.1; Caselle et al. 2002, sec. 7.2, D0 = -0.104), so the ' +
  'crossing approaches T_c as L^-(1/nu + 7/4) = L^-11/4: about 1.3e-4 below T_c here, from the slope -dU/dT = 0.035 L of these ' +
  'runs and an L^-7/4 amplitude set by Salas & Sokal\'s measured V4(16) = 1.16586(38), which puts U(16) 0.0007 above its limit ' +
  '(their fit with the exponent free, Delta = 2.01 +- 0.22 and B4 = -0.48 +- 0.23, gives 1.0e-4); at most about 6e-4 scaling ' +
  'the noisier L = 8/16 shift (-0.026 +- 0.008) the same way; far inside sigma', 4);
near(`T_c from the crossing of the Binder cumulants of L = 64 and 128`, cross(64).T, TC, 0.007, ONS,
  'tolerance 4.1 sigma (sigma = 0.0017), 3.5 sigma of the seed-to-seed scatter (0.0020); the L^-11/4 shift above is about 2e-5 here, ' +
  'at most 1e-4', 4);
near('Binder cumulant at T_c, mean of L = 16 to 128', crit.binderMean, 1 - 1.1679229 / 3, 0.005,
  'Salas & Sokal 2000: 1 - V4/3, V4 = 1.1679229(47)', 'tolerance 4.5 sigma (sigma = 0.0011), 4.2 sigma of the seed-to-seed scatter ' +
  '(0.0012); 4.3 and 4.0 after the mean\'s +0.00024 finite-size shift, most of it from L = 16, which sits 0.0007 above its limit ' +
  '(Salas & Sokal\'s V4(L); the 120 repeat seeds average +0.0002 +- 0.0001); the sizes agree with each other within their errors',
  4, 'reference');
const Ls = crit.Ls.join(', ');
near(`beta/nu from <|m|> ~ L^(-beta/nu) at T_c, least squares over L = ${Ls}`, crit.betaNu, EXP.beta / EXP.nu, 0.012,
  'Pelissetto & Vicari 2002, sec. 3.5: beta = 1/8, nu = 1', 'tolerance 4.6 sigma (sigma = 0.0026), 3.9 sigma of the seed-to-seed scatter (0.0031)');
near(`gamma/nu from chi = N <m^2> ~ L^(gamma/nu) at T_c, same sizes`, crit.gammaNu, EXP.gamma / EXP.nu, 0.016,
  'Pelissetto & Vicari 2002, sec. 3.5: gamma = 7/4', 'tolerance 4 sigma (sigma = 0.0040), 3.3 sigma of the seed-to-seed scatter (0.0049); ' +
  '3.7 and 3.0 after its +0.0012 finite-size bias, the slope of the torus chi_L over these sizes less 7/4 (Caselle et al. 2002, ' +
  'sec. 7.2: exact up to L = 17, their expansion beyond, with corrections of relative order L^-7/4; the 120 repeat seeds average ' +
  '+0.0015 +- 0.0004)');
near(`eta from G(L/2) ~ L^-eta at T_c, same sizes`, crit.eta, EXP.eta, 0.020,
  'Pelissetto & Vicari 2002, sec. 3.5: eta = 1/4', 'tolerance 4.3 sigma (sigma = 0.0047), 3.7 sigma of the seed-to-seed scatter (0.0054); ' +
  'G(L/2) is the spin-spin correlation at half the box, along either axis');
near(`1/nu from the slope of the Binder cumulant, -dU/dT ~ L^(1/nu), at T_c`, crit.invNu, 1 / EXP.nu, 0.13,
  'Pelissetto & Vicari 2002, sec. 3.5: nu = 1', 'tolerance 4.1 sigma (sigma = 0.032), 3.7 sigma of the seed-to-seed scatter (0.035); ' +
  'slope from reweighting to T_c -+ 0.003');

// 4b. The measurement trap (critical/README.md, "A trap in measuring cluster runs"): L = 16 at T_c, 40000 measurements,
//     measured after a fixed number of cluster flips (as every run here is), against each time the flipped clusters add
//     up to L^2 spins.
const trap = CR.studyTrap();
near(`Binder cumulant at T_c, L = ${trap.L}, measured after a fixed number of cluster flips (${trap.n} measurements)`, trap.fixed,
  1 - 1.1679229 / 3, [0.0035, 0.004], 'Salas & Sokal 2000: 1 - V4/3', 'tolerance: at L = 16 U sits +0.0007 above its limit ' +
  '(Salas & Sokal\'s measured V4(16) = 1.16586(38)), so the high side is 4.1 sigma (sigma = 0.0008) above that shift and the low ' +
  'side, 4.4 sigma, allows none; 4.4 and 4.7 sigma of the seed-to-seed scatter (0.00075)', 4, 'reference');
const gap = trap.until.value - trap.fixed.value, gapErr = Math.hypot(trap.until.err, trap.fixed.err);
check('Measuring each time the flipped clusters add up to L^2 spins over-weights ordered states: the Binder cumulant comes out higher',
  gap / gapErr > 10, `U = ${fmt(trap.until.value)} ± ${fmt(trap.until.err)} that way, against ${fmt(trap.fixed.value)} ± ` +
  `${fmt(trap.fixed.err)} with a fixed count: ${(gap / gapErr).toFixed(1)} combined sigma apart (must exceed 10)`, 'model');

// 5. Above T_c: the correlation length falls to about one lattice spacing as the temperature rises. Each run is at least
//    six correlation lengths across. Tolerance 8%: 3.5 sigma of the noisiest run (T = 4, sigma = 2.3%), 3.8 sigma of
//    its seed-to-seed scatter (2.1%). The energy's 0.005 holds the quieter runs at T = 2.4 and 2.5 to about 7 and 6
//    sigma (sigma = 0.0007 and 0.0008).
const hot = CR.studyHot();
for (const r of hot) nearRel(`Correlation length at T = ${r.T}, (T - T_c)/T_c = ${r.t.toFixed(3)} (L = ${r.L}, fitted from r = ${r.xi.r1} to ${r.xi.r2})`,
  r.xi, r.exact, 0.08, `1/xi = ln coth(1/T) - 2/T: ${CHPV} eqs. 5.1-5.4`);
const eHot = hot.map(r => ({ T: r.T, dev: r.e.value - r.eExact, err: r.e.err }));
check('Energy per spin at the same five temperatures, within 0.005 (3.7 sigma of the noisiest, T = 4, sigma = 0.00136; ' +
  '3.6 sigma of the seed-to-seed scatter at T = 2.75, 0.0014)', eHot.every(x => Number.isFinite(x.err) && Math.abs(x.dev) <= 0.005),
  eHot.map(x => `T = ${x.T}: ${(x.dev + hot.find(r => r.T === x.T).eExact).toFixed(4)}, exact ${hot.find(r => r.T === x.T).eExact.toFixed(4)}, ` +
    `off by ${x.dev.toFixed(4)} (${(x.dev / x.err).toFixed(1)} sigma)`).join('; ') +
  `; margin ${(0.005 - Math.max(...eHot.map(x => Math.abs(x.dev)))).toFixed(4)}`, ONS);

// 6. Site percolation, open edges, spanning top to bottom. Each result is a mean over nine independent seeds
//    (the study seed and the eight of STUDY.perc.pool), and sigma is the standard error of the mean: the scatter
//    between the nine seeds over 3. The tolerances are fixed numbers, set once from that scatter. The open-edge shifts
//    are the ones checked in section 1. The details also quote the scatter of a nine-seed mean in the 120-seed repeat.
const NZ = 'Newman & Ziff 2000: p_c = 0.59274621(13)';
const pool = CR.studyPooled(), n = pool.seeds.length;
for (const c of pool.wide) near(`p_c from the crossing of the spanning probabilities of L = ${c.L1} and ${c.L2}, mean of ${n} seeds`, c.p,
  PERC.pc, c.L1 === 32 ? [0.0009, 0.0013] : [0.0009, 0.0010], NZ, c.L1 === 32
    ? 'tolerance: sigma = 0.00024; the low side is 3.8 sigma and allows no shift, the high side 3.8 sigma above the ' +
      'open-edge shift, +0.00040, more than three times that of L = 64 and 256. Each side is 4.1 sigma of the ' +
      'seed-to-seed scatter of a nine-seed mean (0.00022). A mean more than 0.0013 above p_c or 0.0009 below fails, so ' +
      'an offset of 0.0012 would pass here: with its larger shift this crossing is checked more loosely, and the ' +
      'crossing of L = 64 and 256 is the check that rules such an offset out. The mean sits 0.8 sigma above the shift'
    : 'tolerance: sigma = 0.00023; the low side is 3.9 sigma and allows no shift, the high side 3.8 sigma above the ' +
      'open-edge shift, +0.00012; 5.6 and 5.5 sigma of the seed-to-seed scatter of a nine-seed mean (0.00016), as these ' +
      'nine seeds scatter more than the repeat\'s 120. About half of that excess is the study seed\'s: it sits 0.0013 ' +
      'high, about 2.4 standard deviations of a single seed beyond the shift (single seeds scatter by about 0.0005 in ' +
      'the repeat; 0.0006 for the eight other seeds). A mean more than 0.0010 above p_c or 0.0009 below fails, so an ' +
      'offset of 0.0012 fails. The mean sits 0.2 sigma above the shift', 5, 'reference');
near(`Fractal dimension of the spanning cluster at p_c: mass ~ L^D, least squares over L = ${pool.Ls.slice(1).join(', ')}, mean of ${n} seeds`,
  pool.D, PERC.D, [0.024, 0.008], 'D = 2 - 5/48 = 91/48: Lawler, Schramm & Werner 2002 (one-arm exponent 5/48)',
  'tolerance: the slope between successive sizes rises with L (1.861, 1.876 and 1.884 from L = 32 to 256, means of the ' +
  'nine seeds), so a fit over L = 64 to 256 falls short of 91/48. The shortfall is measured, not predicted, so this ' +
  'check does not test it. The low side allows the shortfall that the independent 120-seed repeat in the header ' +
  'expects, 0.0142 +- 0.0007 (it shares no seeds with these runs), plus 3.8 times its scatter of a nine-seed mean ' +
  '(0.00256): a D more than 0.024 (1.3%) below 91/48 fails. These runs\' own shortfall, 0.016, plus 4.0 sigma ' +
  '(sigma = 0.0020) gives the same bound. The high side is not tight. It allows no shift, as on the far side of every ' +
  'shifted check here: a D more than 0.008 above 91/48 fails, 4.0 sigma and 3.1 times the repeat\'s scatter. That is ' +
  '0.0222 above the value the repeat expects at these sizes, 8.7 times its scatter, so the high side guards only ' +
  'against gross errors', 4);

// 7. The same percolation runs against Ziff & Newman's measurements on this same system at the same size (their
//    Table 1), not against a value for L -> infinity. critical/table.mjs prints eleven such comparisons, for L = 32 to
//    256, and all agree within 1.04 sigma. They amount to about four independent ones, one per size: at each size
//    R(p_c) and the point where R = 1/2 are read off the same curve (seed-to-seed correlation -1.00 in the 120-seed
//    repeat), and each crossing of L/2 and L is nearly fixed by the points where R = 1/2 at those two sizes. This one
//    is the clearest: open edges move it 4.3 sigma from its L -> infinity value, p_c (the same shift moves R(p_c) at
//    L = 32 by 4.2; the rest are under 2).
const zn = PERC.zn, h32 = pool.half[pool.Ls.indexOf(32)];
near(`Where the spanning probability is 1/2 at L = 32, mean of ${n} seeds, against Ziff & Newman's measurement, 0.5918352`, h32,
  zn.half[zn.Ls.indexOf(32)], 0.0007, `${ZN}, Table 1`,
  'tolerance 3.3 sigma (sigma = 0.00021), 3.9 sigma of the seed-to-seed scatter of a nine-seed mean (0.00018), with ' +
  'no shift: both are at L = 32. Open edges put this point 0.00091 below p_c, so a mean at p_c fails, by 1.0 sigma: ' +
  'the check tests the model\'s finite-size behaviour against published measurements, not only the threshold. Only ' +
  'modestly: with the 120-seed repeat\'s values moved to centre on p_c, about one set of nine seeds in eight would ' +
  'still pass. The mean sits 4.5 sigma below p_c', 5, 'measured');

const secs = (Date.now() - start) / 1000;
console.log(`\nruntime ${secs.toFixed(1)} s on Node ${process.versions.node}`);
console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
