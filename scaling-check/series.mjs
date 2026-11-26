// The series the checker is applied to: numbers printed by this repository's own scripts, copied here as the strings the
// scripts print (rounded, as printed). Each series says which script prints it, at which commit, and where in the output,
// so `node scaling-check/table.mjs verify` can run the script and find every number again.
// Source commit for every number below: 48b923bd25dbcfef7fa8e8399d4144592145f0ef (main when this study was added).
import { dec, exponentIn, exponentInLog2 } from './check.mjs';
export const SOURCE_COMMIT = '48b923bd25dbcfef7fa8e8399d4144592145f0ef';

// 'critical' prints the Ising table "At T_c" (columns <|m|>, chi, G(L/2)) and the percolation table (spanning cluster).
// 'turbulence' is `node turbulence/table.mjs quick`, the cascade table's last column, log2 <|u_n|^2>.
export const SERIES = [
  { id: 'ising-m', kind: 'ratio', what: '2D Ising at T_c, magnetisation <|m|> against box size L', command: 'critical/table.mjs',
    after: /^At T_c \(runs at/, col: 2, rows: [8, 16, 32, 64, 128],
    x: [8, 16, 32, 64, 128], y: ['0.7819', '0.7060', '0.6537', '0.5975', '0.5520'],
    published: [-1, 8], publishedLabel: 'beta/nu = 1/8, so slope -1/8 (Onsager, Yang: exact)' },
  { id: 'ising-chi', kind: 'ratio', what: '2D Ising at T_c, susceptibility chi = N<m^2> against L', command: 'critical/table.mjs',
    after: /^At T_c \(runs at/, col: 5, rows: [8, 16, 32, 64, 128],
    x: [8, 16, 32, 64, 128], y: ['41.8', '137.6', '469.2', '1572', '5337'],
    published: [7, 4], publishedLabel: 'gamma/nu = 7/4 (exact)' },
  { id: 'ising-g', kind: 'ratio', what: '2D Ising at T_c, correlation G(L/2) against L', command: 'critical/table.mjs',
    after: /^At T_c \(runs at/, col: 8, rows: [8, 16, 32, 64, 128],
    x: [8, 16, 32, 64, 128], y: ['0.6324', '0.5177', '0.4421', '0.3706', '0.3139'],
    published: [-1, 4], publishedLabel: 'eta = 1/4, so slope -1/4 (exact)' },
  { id: 'perc-mass', kind: 'ratio', what: 'site percolation at p_c, spanning-cluster mass against L (study seed 401, one seed)', command: 'critical/table.mjs',
    after: /^Site percolation, open edges, spanning top to bottom/, col: 8, rows: [32, 64, 128, 256],
    x: [32, 64, 128, 256], y: ['398', '1442', '5308', '19546'],
    published: [91, 48], publishedLabel: 'D = 91/48 (den Nijs, Nienhuis et al.; proved for the triangular lattice)' },
  { id: 'sabra-u2', kind: 'log2', what: 'Sabra shell model (CI run), plain moment <|u_n|^2> against k_n = 2^n, shells 3 to 8, printed as log2', command: 'turbulence/table.mjs quick',
    after: /^ {2}n {3}Pi_n\/eps/, col: 4, rows: [3, 4, 5, 6, 7, 8],
    x: [3, 4, 5, 6, 7, 8], y: ['-8.93', '-9.43', '-10.52', '-10.94', '-11.85', '-12.71'],
    published: [-18, 25], publishedLabel: "zeta_2 = 0.720 +- 0.008 (L'vov et al. 1998, moments of u); slope -0.720" },
];

// The check bound to a series: (lo, hi, mode) -> true when every slope the mode looks at lies in [lo, hi], lo and hi [p, q].
export function acceptor(s) {
  if (s.kind === 'log2') {
    const ls = s.y.map(dec);
    return (lo, hi, mode) => exponentInLog2(s.x, ls, lo, hi, mode);
  }
  const xs = s.x.map(v => [BigInt(v), 1n]), ys = s.y.map(v => { const [n, d] = dec(v); return [n, d]; });
  return (lo, hi, mode) => exponentIn(xs, ys, lo, hi, mode);
}
