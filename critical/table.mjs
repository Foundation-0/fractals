// Prints every number quoted in critical/README.md (issue #20); the percolation seed scatter needs the scatter argument
// (below). Usage: node critical/table.mjs (about 20 s). The Monte Carlo runs are the same fixed-seed runs that
// tests/critical.mjs makes, so the numbers match; not every number printed here is checked (critical/README.md says
// which are).
// node critical/table.mjs scatter: repeats the percolation runs with eight other seeds (about 45 s) and prints how
// much the estimates scatter, which sets the percolation tolerances in tests/critical.mjs.
import { createRequire } from 'node:module';
const CR = createRequire(import.meta.url)('./model.js');
const { TC, KC, EXP, PERC } = CR;
const start = Date.now();
const pm = (j, d) => `${j.value.toFixed(d)} ± ${j.err.toFixed(d)}`;
const col = (s, w) => String(s).padStart(w);

if (process.argv[2] === 'scatter') {
  const rows = [];
  console.log('Percolation repeated with eight other seeds (5010, 5020, ..., 5080)\n');
  console.log(col('seed', 6) + col('p_c, L = 32/128', 22) + col('p_c, L = 64/256', 22) + col('D, L = 64-256', 20) + col('p(R = 1/2), L = 256', 22));
  for (let k = 1; k <= 8; k++) {
    const p = CR.studyPercolation(5000 + 10 * k), last = p.half.length - 1;
    rows.push([p.wide[0].p, p.wide[1].p, p.D, p.half[last]]);
    console.log(col(5000 + 10 * k, 6) + rows[k - 1].map((j, i) => col(pm(j, i === 2 ? 4 : 5), i === 2 ? 20 : 22)).join(''));
  }
  const names = ['p_c from L = 32/128', 'p_c from L = 64/256', 'D over L = 64-256', 'p(R = 1/2) at L = 256'];
  const exact = [PERC.pc, PERC.pc, PERC.D, PERC.pc];
  console.log('');
  names.forEach((name, i) => {
    const v = rows.map(r => r[i].value), m = v.reduce((a, x) => a + x, 0) / v.length;
    const sd = Math.sqrt(v.reduce((a, x) => a + (x - m) * (x - m), 0) / (v.length - 1));
    const jk = rows.reduce((a, r) => a + r[i].err, 0) / rows.length;
    console.log(`  ${name}: mean ${m.toFixed(5)}, exact ${exact[i].toFixed(5)}, mean - exact ${(m - exact[i]).toFixed(5)} ` +
      `(± ${(sd / Math.sqrt(v.length)).toFixed(5)}); scatter ${sd.toFixed(5)}, mean jackknife error ${jk.toFixed(5)}`);
  });
  console.log(`\nruntime ${((Date.now() - start) / 1000).toFixed(1)} s on Node ${process.versions.node}`);
  process.exit(0);
}

console.log('Critical point study (issue #20). J = k_B = 1: temperatures in J/k_B, lengths in lattice spacings.\n');
console.log('Exact values (infinite lattice)');
console.log(`  T_c = 2/ln(1 + sqrt 2) = ${TC.toFixed(6)}, K_c = 1/T_c = ${KC.toFixed(7)}; energy per spin at T_c ${CR.energyExact(TC).toFixed(6)} (-sqrt 2)`);
console.log(`  Ising exponents: beta = ${EXP.beta}, nu = ${EXP.nu}, eta = ${EXP.eta}, gamma = ${EXP.gamma}; ` +
  `beta/nu = ${EXP.beta / EXP.nu}, gamma/nu = ${EXP.gamma / EXP.nu}`);
console.log(`  correlation length above T_c 1/(ln coth K - 2K); near T_c 1/(4(K_c - K)) = ${(1 / (4 * KC)).toFixed(4)}/t, t = (K_c - K)/K_c; ` +
  `below T_c 1/(4(K - K*)), K* the dual coupling`);
console.log(`  Binder cumulant at T_c on a periodic square, L -> infinity: 1 - 1.1679229/3 = ${(1 - 1.1679229 / 3).toFixed(5)}`);
console.log(`  percolation: p_c = ${PERC.pc}, D = 91/48 = ${PERC.D.toFixed(4)} (2 - 5/48)`);
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

const p = CR.studyPercolation();
console.log('\nSite percolation, open edges, spanning top to bottom (Newman-Ziff runs; masses at p_c)');
console.log(col('L', 5) + col('samples', 9) + col('R(p_c)', 18) + col('p where R = 1/2', 20) + col('spanning cluster', 20) + col('largest cluster', 20));
p.Ls.forEach((L, i) => console.log(col(L, 5) + col(p.samples[i], 9) + col(pm(p.atPc[i], 3), 18) + col(pm(p.half[i], 5), 20) +
  col(pm(p.span[i], 0), 20) + col(pm(p.big[i], 0), 20)));
console.log('  crossings of R_L(p): ' + [...p.adjacent, ...p.wide].map(x => `${x.L1}/${x.L2}: ${pm(x.p, 5)}`).join('; '));
console.log(`  spanning-cluster mass ~ L^D: D = ${pm(p.D, 4)} over L = ${p.Ls.slice(1).join(', ')}, ${pm(p.Dall, 4)} over L = ${p.Ls.join(', ')}; ` +
  `largest cluster ${pm(p.Dbig, 4)} over L = ${p.Ls.slice(1).join(', ')}`);
const share = i => p.span[i].value / (p.Ls[i] * p.Ls[i]) * 100, last = p.Ls.length - 1;
console.log(`  share of the sites in the spanning cluster: ${share(0).toFixed(1)}% at L = ${p.Ls[0]}, ${share(last).toFixed(1)}% at ` +
  `L = ${p.Ls[last]} (an exact L^-5/48 fall would give ${(share(0) * Math.pow(p.Ls[last] / p.Ls[0], -5 / 48)).toFixed(1)}%)`);

console.log(`\nruntime ${((Date.now() - start) / 1000).toFixed(1)} s on Node ${process.versions.node}`);
