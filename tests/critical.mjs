// Checks the critical-point study (critical/model.js, issue #20) against exact results: Onsager's T_c and energy,
// Yang's magnetisation, the exact correlation length, the 2D Ising exponents, the Binder cumulant at T_c, the
// measurement trap in cluster runs, Newman and Ziff's percolation threshold and the 91/48 dimension. Run: npm test (or
// node tests/critical.mjs).
// Each check states the source, the exact value, the model's value and the tolerance. The Monte Carlo runs use fixed
// seeds and integer-only random numbers, so every run, on every Node version, prints the same numbers. Error bars are
// jackknife estimates over 40 blocks. Each tolerance is 3 to 5 standard deviations of the noisiest estimate it covers,
// plus any known finite-size shift; runs at several temperatures share one tolerance, so the quieter runs are held to it
// more loosely. For the Ising runs the standard deviation is the jackknife error, which matches the scatter between
// seeds to within about 10%; for percolation it is the scatter over eight other seeds, printed by
// node critical/table.mjs scatter. Against the seed-to-seed scatter the tightest checks are gamma/nu (about 3 sigma
// after its +0.0015 finite-size bias) and the L = 64/128 Binder crossing (about 3.4 sigma). In a one-off repeat with
// 120 other sets of seeds (each study seed plus 10000k, k = 1 to 120; not one of the repository's scripts, and made
// before the measurement-trap checks were added), 119 passed every check; the other missed the L = 64/128 crossing by
// 0.0003. Each line prints the margin it passes by.
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
// A Monte Carlo estimate {value, err} against an exact value: passes if |model - exact| <= tol.
function near(name, est, want, tol, src, why, d) {
  const dev = est.value - want, ok = Math.abs(dev) <= tol;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(est.value, d)} ± ${fmt(est.err, d)}  exact ${fmt(want, d)}  ` +
    `(within ${fmt(tol, d)}; off by ${fmt(dev, d)} = ${(dev / est.err).toFixed(1)} sigma; margin ${fmt(tol - Math.abs(dev), d)})  ${src}` +
    (why ? `\n      ${why}` : ''));
  if (!ok) fails++;
}
// The same with a relative tolerance.
function nearRel(name, est, want, rel, src, why) {
  const dev = est.value / want - 1, ok = Math.abs(dev) <= rel;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${est.value.toFixed(3)} ± ${est.err.toFixed(3)}  exact ${want.toFixed(3)}  ` +
    `(within ${(rel * 100).toFixed(0)}%; off by ${(dev * 100).toFixed(1)}% = ${((est.value - want) / est.err).toFixed(1)} sigma; ` +
    `margin ${((rel - Math.abs(dev)) * 100).toFixed(1)} points)  ${src}` + (why ? `\n      ${why}` : ''));
  if (!ok) fails++;
}

// 1. The closed forms themselves (no Monte Carlo): these test the code against the published formulas.
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
const r1 = CR.rng(1);
check('Random numbers are integer-only xoshiro128**: seed 1 starts 2442144158, 3238099751, 3819917871',
  [2442144158, 3238099751, 3819917871].every(v => r1() === v), 'same on every engine, so every run below is reproducible', 'model');

// 2. Below T_c: magnetisation and energy (L = 64; the correlation length is at most 9.1 lattice spacings, so finite-size
//    effects, of relative order exp(-L/xi) < 1e-3, stay below the statistical errors). Tolerances: 0.006 in |m| is
//    3.8 sigma of the noisiest run (T = 2.2, sigma = 0.0016); 0.005 in energy is 3.8 sigma of the noisiest (sigma = 0.0013).
const ordered = CR.studyOrdered();
for (const r of ordered) near(`Spontaneous magnetisation <|m|> at T = ${r.T} (L = ${r.L}, ${r.n} measurements)`, r.M, r.Mexact, 0.006, YANG, '', 5);
for (const r of ordered) near(`Energy per spin at T = ${r.T}`, r.e, r.eExact, 0.005, ONS, '', 5);

// 3-4. At the critical point: L = 8 to 128, runs at T = 2.27 reweighted to T_c (Ferrenberg & Swendsen 1988).
const crit = CR.studyCritical();
const cross = (L1) => crit.crossings.find(c => c.L1 === L1);
near(`T_c from the crossing of the Binder cumulants of L = 32 and 64`, cross(32).T, TC, 0.010, ONS,
  'tolerance 4.5 sigma (sigma = 0.0022), 3.8 sigma of the seed-to-seed scatter (0.0026). The leading correction to U at T_c is ' +
  'the L^-7/4 analytic background of chi (Salas & Sokal 2000, sec. 4.1; Caselle et al. 2002, sec. 7.2, D0 = -0.104), so the ' +
  'crossing approaches T_c as L^-(1/nu + 7/4) = L^-11/4: about 2e-4 below T_c here with Salas & Sokal\'s fitted amplitude ' +
  '(B4 = -0.48 +- 0.23) and the slope -dU/dT = 0.035 L of these runs, at most about 6e-4 scaling the noisier L = 8/16 shift ' +
  '(-0.026 +- 0.008) the same way; far inside sigma', 4);
near(`T_c from the crossing of the Binder cumulants of L = 64 and 128`, cross(64).T, TC, 0.007, ONS,
  'tolerance 4.1 sigma (sigma = 0.0017), 3.5 sigma of the seed-to-seed scatter (0.0020); the L^-11/4 shift above is about 4e-5 here, ' +
  'at most 1e-4', 4);
near('Binder cumulant at T_c, mean of L = 16 to 128', crit.binderMean, 1 - 1.1679229 / 3, 0.005,
  'Salas & Sokal 2000: 1 - V4/3, V4 = 1.1679229(47)', 'tolerance 4.5 sigma (sigma = 0.0011), 4.3 sigma of the seed-to-seed scatter ' +
  '(0.0012); the sizes agree with each other within their errors');
const Ls = crit.Ls.join(', ');
near(`beta/nu from <|m|> ~ L^(-beta/nu) at T_c, least squares over L = ${Ls}`, crit.betaNu, EXP.beta / EXP.nu, 0.012,
  'Pelissetto & Vicari 2002, sec. 3.5: beta = 1/8, nu = 1', 'tolerance 4.6 sigma (sigma = 0.0026), 3.8 sigma of the seed-to-seed scatter (0.0031)');
near(`gamma/nu from chi = N <m^2> ~ L^(gamma/nu) at T_c, same sizes`, crit.gammaNu, EXP.gamma / EXP.nu, 0.016,
  'Pelissetto & Vicari 2002, sec. 3.5: gamma = 7/4', 'tolerance 4 sigma (sigma = 0.0040), 3.3 sigma of the seed-to-seed scatter (0.0049) ' +
  'and about 3 after its +0.0015 finite-size bias; corrections to chi at T_c are of relative order L^-7/4 (Caselle et al. 2002, sec. 7.2)');
near(`eta from G(L/2) ~ L^-eta at T_c, same sizes`, crit.eta, EXP.eta, 0.020,
  'Pelissetto & Vicari 2002, sec. 3.5: eta = 1/4', 'tolerance 4.3 sigma (sigma = 0.0047), 3.7 sigma of the seed-to-seed scatter (0.0054); ' +
  'G(L/2) is the spin-spin correlation at half the box, along either axis');
near(`1/nu from the slope of the Binder cumulant, -dU/dT ~ L^(1/nu), at T_c`, crit.invNu, 1 / EXP.nu, 0.13,
  'Pelissetto & Vicari 2002, sec. 3.5: nu = 1', 'tolerance 4 sigma (sigma = 0.032), 3.7 sigma of the seed-to-seed scatter (0.035); ' +
  'slope from reweighting to T_c -+ 0.003');

// 4b. The measurement trap (critical/README.md, "A trap in measuring cluster runs"): L = 16 at T_c, 40000 measurements,
//     measured after a fixed number of cluster flips (as every run here is), against each time the flipped clusters add
//     up to L^2 spins.
const trap = CR.studyTrap();
near(`Binder cumulant at T_c, L = ${trap.L}, measured after a fixed number of cluster flips (${trap.n} measurements)`, trap.fixed,
  1 - 1.1679229 / 3, 0.005, 'Salas & Sokal 2000: 1 - V4/3', 'tolerance about 4 sigma (sigma = 0.0008) plus the finite-size shift ' +
  'at L = 16, about +0.001 by Salas & Sokal\'s fit (B4 = -0.48 +- 0.23), rounded up');
const gap = trap.until.value - trap.fixed.value, gapErr = Math.hypot(trap.until.err, trap.fixed.err);
check('Measuring each time the flipped clusters add up to L^2 spins over-weights ordered states: the Binder cumulant comes out higher',
  gap / gapErr > 10, `U = ${fmt(trap.until.value)} ± ${fmt(trap.until.err)} that way, against ${fmt(trap.fixed.value)} ± ` +
  `${fmt(trap.fixed.err)} with a fixed count: ${(gap / gapErr).toFixed(1)} combined sigma apart (must exceed 10)`, 'model');

// 5. Above T_c: the correlation length falls to about one lattice spacing as the temperature rises. Each run is at least
//    six correlation lengths across. Tolerance 8%: 3.5 sigma of the noisiest run (T = 4, sigma = 2.3%), 3.8 sigma of
//    its seed-to-seed scatter (2.1%).
const hot = CR.studyHot();
for (const r of hot) nearRel(`Correlation length at T = ${r.T}, (T - T_c)/T_c = ${r.t.toFixed(3)} (L = ${r.L}, fitted from r = ${r.xi.r1} to ${r.xi.r2})`,
  r.xi, r.exact, 0.08, `1/xi = ln coth(1/T) - 2/T: ${CHPV} eqs. 5.1-5.4`);
const eHot = hot.map(r => ({ T: r.T, dev: r.e.value - r.eExact, err: r.e.err }));
check('Energy per spin at the same five temperatures, within 0.005 (3.7 sigma of the noisiest, T = 4, sigma = 0.00136; ' +
  '3.5 sigma of the seed-to-seed scatter at T = 2.75, 0.0014)', eHot.every(x => Math.abs(x.dev) <= 0.005),
  eHot.map(x => `T = ${x.T}: ${(x.dev + hot.find(r => r.T === x.T).eExact).toFixed(4)}, exact ${hot.find(r => r.T === x.T).eExact.toFixed(4)}, ` +
    `off by ${x.dev.toFixed(4)} (${(x.dev / x.err).toFixed(1)} sigma)`).join('; ') +
  `; margin ${(0.005 - Math.max(...eHot.map(x => Math.abs(x.dev)))).toFixed(4)}`, ONS);

// 6. Site percolation, open edges, spanning top to bottom.
const perc = CR.studyPercolation();
const NZ = 'Newman & Ziff 2000: p_c = 0.59274621(13)';
for (const c of perc.wide) near(`p_c from the crossing of the spanning probabilities of L = ${c.L1} and ${c.L2}`, c.p, PERC.pc, 0.0025, NZ,
  c.L1 === 32 ? 'tolerance: over eight other seeds (node critical/table.mjs scatter) this crossing scatters by 0.0007 and sits 0.0005 high (open edges shift it as L^-7/4: Ziff & Newman 2002), so 3 sigma + 0.0005'
    : 'tolerance about 4 sigma: over eight other seeds (node critical/table.mjs scatter) this crossing scatters by 0.0006, with no detectable shift', 5);
near(`Fractal dimension of the spanning cluster at p_c: mass ~ L^D, least squares over L = ${perc.Ls.slice(1).join(', ')}`, perc.D, PERC.D, 0.05,
  'D = 2 - 5/48 = 91/48: Lawler, Schramm & Werner 2002 (one-arm exponent 5/48)',
  'tolerance: over eight other seeds (node critical/table.mjs scatter) this slope scatters by 0.0065 and sits 0.016 low, the effective exponent still rising with L; 4 sigma + 0.016, rounded up', 4);

const secs = (Date.now() - start) / 1000;
console.log(`\nruntime ${secs.toFixed(1)} s on Node ${process.versions.node}`);
console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
