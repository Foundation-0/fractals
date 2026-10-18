// Prints the Monte Carlo numbers quoted in critical/README.md (issue #20) and the exact values beside them. Usage: node
// critical/table.mjs (about 65 s). The runs are the same fixed-seed runs that tests/critical.mjs makes, so the numbers
// match; not every number printed here is checked (critical/README.md says which are). Percolation runs with nine
// seeds, and its checks use their mean: printed here with each seed's values, the standard error of the mean, the
// slopes of the spanning cluster's mass between successive sizes, and how much leaving out L = 32 raises its fit; and
// the means beside Ziff & Newman's measurements on this same system (2002, Table 1).
// (node critical/table.mjs scatter, which used to print eight of those seeds on their own, now prints the same.)
// No script prints the numbers critical/README.md takes from the one-off repeat with 120 other sets of seeds, or the
// finite-size shifts it works out from published formulas other than the open-edge shifts printed below; the README
// names them.
import { createRequire } from 'node:module';
const CR = createRequire(import.meta.url)('./model.js');
const { TC, KC, EXP, PERC } = CR;
const start = Date.now();
const pm = (j, d) => `${j.value.toFixed(d)} ± ${j.err.toFixed(d)}`;
const col = (s, w) => String(s).padStart(w);

console.log('Critical point study (issue #20). J = k_B = 1: temperatures in J/k_B, lengths in lattice spacings.\n');
console.log('Exact values (infinite lattice)');
console.log(`  T_c = 2/ln(1 + sqrt 2) = ${TC.toFixed(6)}, K_c = 1/T_c = ${KC.toFixed(7)}; energy per spin at T_c ${CR.energyExact(TC).toFixed(6)} (-sqrt 2)`);
console.log(`  Ising exponents: beta = ${EXP.beta}, nu = ${EXP.nu}, eta = ${EXP.eta}, gamma = ${EXP.gamma}; ` +
  `beta/nu = ${EXP.beta / EXP.nu}, gamma/nu = ${EXP.gamma / EXP.nu}`);
console.log(`  correlation length above T_c 1/(ln coth K - 2K); near T_c 1/(4(K_c - K)) = ${(1 / (4 * KC)).toFixed(4)}/t, t = (K_c - K)/K_c; ` +
  `below T_c 1/(4(K - K*)), K* the dual coupling`);
console.log(`  Binder cumulant at T_c on a periodic square, L -> infinity: 1 - 1.1679229/3 = ${(1 - 1.1679229 / 3).toFixed(5)}`);
console.log(`  percolation: p_c = ${PERC.pc}, D = 91/48 = ${PERC.D.toFixed(4)} (2 - 5/48); open edges put the crossing of ` +
  `R_L1(p) and R_L2(p) above p_c by (b0/a1)(1/L1 - 1/L2)/(L2^(3/4) - L1^(3/4)), b0 = ${PERC.b0}, a1 = ${PERC.a1}: ` +
  `+${CR.edgeShift(32, 128).toFixed(5)} for L = 32/128, +${CR.edgeShift(64, 256).toFixed(5)} for 64/256`);
const nu3 = 0.629971;
console.log(`  3D Ising (liquid-vapour critical points): nu = ${nu3}, eta = 0.0362978; a tenfold approach to T_c multiplies xi by ` +
  `10^nu = ${Math.pow(10, nu3).toFixed(2)} in 3D, ${Math.pow(10, EXP.nu).toFixed(0)} in 2D`);

console.log('\nBelow T_c (Wolff clusters, L = 64, 3000 measurements each)');
console.log(col('T', 6) + col('<|m|>', 22) + col('Yang', 10) + col('energy', 22) + col('Onsager', 11) + col('xi (exact)', 12));
for (const r of CR.studyOrdered()) {
  console.log(col(r.T.toFixed(2), 6) + col(pm(r.M, 5), 22) + col(r.Mexact.toFixed(5), 10) + col(pm(r.e, 5), 22) +
    col(r.eExact.toFixed(5), 11) + col(r.xiBelow.toFixed(2), 12));
}

const c = CR.studyCritical();
console.log(`\nAt T_c (runs at T = ${c.T0}, reweighted to T_c)`);
console.log(col('L', 5) + col('measurements', 14) + col('<|m|>', 18) + col('chi = N<m^2>', 18) + col('G(L/2)', 18) + col('Binder U', 18));
c.Ls.forEach((L, i) => console.log(col(L, 5) + col(c.n[i], 14) + col(pm(c.abs[i], 4), 18) + col(pm(c.chi[i], c.chi[i].value > 1000 ? 0 : 1), 18) +
  col(pm(c.g[i], 4), 18) + col(pm(c.binder[i], 4), 18)));
console.log(`  slopes over L = ${c.Ls.join(', ')}: beta/nu = ${pm(c.betaNu, 4)}, gamma/nu = ${pm(c.gammaNu, 4)}, eta = ${pm(c.eta, 4)}, ` +
  `1/nu = ${pm(c.invNu, 3)}`);
console.log(`  Binder cumulant at T_c, mean of L = 16 to 128: ${pm(c.binderMean, 4)}`);
console.log('  Binder crossings: ' + c.crossings.map(x => `L = ${x.L1} and ${x.L2}: T = ${pm(x.T, 4)}`).join('; '));
const span = c.Ls[c.Ls.length - 1] / c.Ls[0];
// Ratio of two sizes' values, with the two runs' independent errors added in quadrature.
const ratio = (a, b) => { const value = a.value / b.value; return { value, err: value * Math.hypot(a.err / a.value, b.err / b.value) }; };
const top = c.Ls.length - 1, rm = ratio(c.abs[0], c.abs[top]), rc = ratio(c.chi[top], c.chi[0]), rg = ratio(c.g[0], c.g[top]);
const rel = r => (r.err / r.value * 100).toFixed(1) + '%';
console.log(`  from L = ${c.Ls[0]} to ${c.Ls[top]} (x${span}): <|m|> falls x${pm(rm, 3)}, chi grows x${pm(rc, 0)}, G(L/2) falls x${pm(rg, 2)} ` +
  `(exact power laws: x${Math.pow(span, 1 / 8).toFixed(3)}, x${Math.pow(span, 7 / 4).toFixed(0)}, x${Math.pow(span, 1 / 4).toFixed(2)}; ` +
  `statistical errors ${rel(rm)}, ${rel(rc)}, ${rel(rg)})`);

// The trap in measuring Wolff runs: a fixed number of cluster flips per measurement (as the model does), against
// flipping clusters until they add up to L^2 spins and measuring then. L = 16 at T_c, 40000 measurements each.
const trap = CR.studyTrap();
console.log(`  measuring after a fixed number of cluster flips (the model), L = ${trap.L}: U = ${pm(trap.fixed, 4)}; ` +
  `after flips adding up to L^2 spins: U = ${pm(trap.until, 4)}`);

console.log('\nAbove T_c: the correlation length (row-summed correlation, fitted from r = 1 to where it has fallen by e^2)');
console.log(col('T', 6) + col('t', 7) + col('L', 5) + col('fit r', 8) + col('xi measured', 16) + col('exact', 8) + col('off', 8) +
  col('1/4(Kc-K)', 11) + col('energy', 20) + col('Onsager', 10));
for (const r of CR.studyHot()) {
  console.log(col(r.T.toFixed(2), 6) + col(r.t.toFixed(3), 7) + col(r.L, 5) + col(`${r.xi.r1}-${r.xi.r2}`, 8) + col(pm(r.xi, 2), 16) +
    col(r.exact.toFixed(2), 8) + col(((r.xi.value / r.exact - 1) * 100).toFixed(1) + '%', 8) +
    col((1 / (4 * (KC - 1 / r.T))).toFixed(2), 11) + col(pm(r.e, 4), 20) + col(r.eExact.toFixed(4), 10));
}

const pool = CR.studyPooled(), p = pool.each[0], seeds = pool.seeds;
console.log(`\nSite percolation, open edges, spanning top to bottom (Newman-Ziff runs; masses at p_c), study seed ${seeds[0]}`);
console.log(col('L', 5) + col('samples', 9) + col('R(p_c)', 18) + col('p where R = 1/2', 20) + col('spanning cluster', 20) + col('largest cluster', 20));
p.Ls.forEach((L, i) => console.log(col(L, 5) + col(p.samples[i], 9) + col(pm(p.atPc[i], 3), 18) + col(pm(p.half[i], 5), 20) +
  col(pm(p.span[i], 0), 20) + col(pm(p.big[i], 0), 20)));
console.log('  crossings of R_L(p): ' + [...p.adjacent, ...p.wide].map(x => `${x.L1}/${x.L2}: ${pm(x.p, 5)}`).join('; '));
console.log(`  spanning-cluster mass ~ L^D: D = ${pm(p.D, 4)} over L = ${p.Ls.slice(1).join(', ')}, ${pm(p.Dall, 4)} over L = ${p.Ls.join(', ')}; ` +
  `largest cluster ${pm(p.Dbig, 4)} over L = ${p.Ls.slice(1).join(', ')}`);
const share = i => p.span[i].value / (p.Ls[i] * p.Ls[i]) * 100, last = p.Ls.length - 1;
console.log(`  share of the sites in the spanning cluster: ${share(0).toFixed(1)}% at L = ${p.Ls[0]}, ${share(last).toFixed(1)}% at ` +
  `L = ${p.Ls[last]} (an exact L^-5/48 fall would give ${(share(0) * Math.pow(p.Ls[last] / p.Ls[0], -PERC.oneArm)).toFixed(1)}%)`);

// The same runs with nine seeds (each seed's runs use it plus 0 to 3). The checks use the mean over the nine seeds,
// with the standard error of that mean: the scatter between seeds (standard deviation) over 3.
console.log(`\nPercolation pooled over nine seeds (${seeds[0]}, then ${seeds.slice(1, 3).join(', ')}, ..., ${seeds[seeds.length - 1]}); ` +
  'each seed with its jackknife error, then the mean with its standard error');
const cols = [['p_c, L = 32/128', r => r.wide[0].p, pool.wide[0].p, PERC.pc, 5, CR.edgeShift(32, 128)],
  ['p_c, L = 64/256', r => r.wide[1].p, pool.wide[1].p, PERC.pc, 5, CR.edgeShift(64, 256)],
  ['D, L = 64-256', r => r.D, pool.D, PERC.D, 4], ['p(R = 1/2), L = 256', r => r.half[last], pool.half[last], PERC.pc, 5],
  ['D, L = 32-256', r => r.Dall, pool.Dall, PERC.D, 4]];
console.log(col('seed', 6) + cols.map(c => col(c[0], 22)).join(''));
pool.each.forEach((r, i) => console.log(col(seeds[i], 6) + cols.map(c => col(pm(c[1](r), c[4]), 22)).join('')));
console.log(col('mean', 6) + cols.map(c => col(pm(c[2], c[4]), 22)).join('') + '\n');
for (const [name, f, m, exact, d, shift] of cols) {
  const jk = pool.each.reduce((a, r) => a + f(r).err, 0) / pool.each.length;
  console.log(`  ${name}: mean ${pm(m, d)}, exact ${exact.toFixed(d)}, mean - exact ${(m.value - exact).toFixed(d)}` +
    (shift ? ` (open-edge shift +${shift.toFixed(d)})` : '') + `; scatter between seeds ${m.sd.toFixed(d)}, mean jackknife error ${jk.toFixed(d)}`);
}
// How the slope of ln(mass) against ln L changes with L: slopes between successive sizes, and how much leaving out
// L = 32 raises the fitted slope, seed by seed (mean ± standard error over the nine seeds).
console.log('\n  spanning-cluster mass, slopes between successive sizes: ' + pool.local.map(x => `L = ${x.L1}-${x.L2}: ${pm(x.D, 3)}`).join(', '));
console.log('  change from one of those slopes to the next, seed by seed: ' + pool.change.map(x =>
  `L = ${x.L1}-${x.L2} to ${x.L2}-${x.L3}: ${pm(x.D, 3)}`).join(', '));
console.log(`  D over L = 64-256 less D over L = 32-256: ${pm(pool.rise, 3)}, positive for ${pool.rise.v.filter(x => x > 0).length} of ` +
  `${pool.rise.v.length} seeds`);

// The nine seeds' means against Ziff & Newman's measurements on this same system at the same sizes (their Table 1),
// with z = (mean - theirs) / standard error of the mean; their own errors are in the last digit quoted. The crossing
// at L is that of L/2 and L. Then how far open edges move their values from the L -> infinity ones, in the same units.
const zn = PERC.zn, zi = L => zn.Ls.indexOf(L), z = (m, v) => (m.value - v) / m.err;
const adj = L => pool.adjacent.find(x => x.L2 === L), zs = [];
console.log('\nPercolation against Ziff & Newman\'s measurements on the same system (2002, Table 1), means of the nine seeds');
console.log(col('L', 5) + col('R(p_c)', 18) + col('Z&N', 10) + col('z', 7) + col('p where R = 1/2', 20) + col('Z&N', 11) + col('z', 7) +
  col('crossing L/2, L', 20) + col('Z&N', 10) + col('z', 7));
p.Ls.forEach((L, i) => {
  const R = pool.atPc[i], h = pool.half[i], c = adj(L), j = zi(L);
  zs.push(z(R, zn.atPc[j]), z(h, zn.half[j]));
  if (c) zs.push(z(c.p, zn.cross[j]));
  console.log(col(L, 5) + col(pm(R, 4), 18) + col(zn.atPc[j], 10) + col(z(R, zn.atPc[j]).toFixed(2), 7) + col(pm(h, 5), 20) +
    col(zn.half[j], 11) + col(z(h, zn.half[j]).toFixed(2), 7) +
    (c ? col(pm(c.p, 5), 20) + col(zn.cross[j], 10) + col(z(c.p, zn.cross[j]).toFixed(2), 7) : col('-', 20)));
});
console.log(`  ${zs.length} comparisons, largest |z| ${Math.max(...zs.map(Math.abs)).toFixed(2)}`);
const eff = (f, from) => p.Ls.map((L, i) => from(i) ? (f(i) / from(i).err).toFixed(1) : '-').join(', ');
console.log(`  open-edge effect in their values, in standard errors of the mean, L = ${p.Ls.join(', ')}:\n    R(p_c) - 1/2: ` +
  eff(i => zn.atPc[zi(p.Ls[i])] - 0.5, i => pool.atPc[i]) + '; p_c - p where R = 1/2: ' +
  eff(i => PERC.pc - zn.half[zi(p.Ls[i])], i => pool.half[i]) + '; crossing - p_c: ' +
  eff(i => zn.cross[zi(p.Ls[i])] - PERC.pc, i => adj(p.Ls[i]) && adj(p.Ls[i]).p));
const h32 = pool.half[p.Ls.indexOf(32)];
console.log(`  at L = 32: p_c less their p where R = 1/2 = ${(PERC.pc - zn.half[zi(32)]).toFixed(5)}; the mean is ` +
  `${((PERC.pc - h32.value) / h32.err).toFixed(1)} standard errors below p_c (tests/critical.mjs checks it against theirs)`);
console.log(`\nruntime ${((Date.now() - start) / 1000).toFixed(1)} s on Node ${process.versions.node}`);
