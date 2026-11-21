// Exponent brackets without logarithms or floats. For positive rationals, the slope between scales a < b is at least
// p/q exactly when (y_b / y_a)^q >= (x_b / x_a)^p (q > 0, p any integer). Both sides are rationals raised to integer
// powers, so the comparison is a comparison of BigInt integers: no rounding, and a tie is a tie.
// A rational is a pair [num, den] of positive integers (BigInt, or Number holding a safe integer).
// Used by scaling-check/table.mjs and tests/scaling-check.mjs. No dependencies.

const big = v => {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'number' && Number.isSafeInteger(v)) return BigInt(v);
  throw new TypeError(`expected an integer, got ${String(v)}`);
};
const rat = r => {
  const n = big(r[0]), d = big(r[1]);
  if (n <= 0n || d <= 0n) throw new RangeError('positive rationals only');
  return [n, d];
};

// A decimal string such as "0.7819" or "-12.71" as [num, den] (num may be negative; den > 0). No float is made.
export function dec(s) {
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(String(s).trim());
  if (!m) throw new SyntaxError(`not a decimal: ${s}`);
  const frac = m[3] || '';
  const num = BigInt(m[2] + frac) * (m[1] ? -1n : 1n);
  return [num, 10n ** BigInt(frac.length)];
}

// Sign (+1, 0, -1) of (y_b/y_a)^q - (x_b/x_a)^p, in integers only.
export function cmpPower(xa, xb, ya, yb, p, q) {
  const Q = big(q), P = big(p);
  if (Q <= 0n) throw new RangeError('q must be positive');
  const [xan, xad] = rat(xa), [xbn, xbd] = rat(xb), [yan, yad] = rat(ya), [ybn, ybd] = rat(yb);
  const ryn = ybn * yad, ryd = ybd * yan; // y_b / y_a
  const rxn = xbn * xad, rxd = xbd * xan; // x_b / x_a
  const lhs = P >= 0n ? ryn ** Q * rxd ** P : ryn ** Q * rxn ** -P;
  const rhs = P >= 0n ? rxn ** P * ryd ** Q : rxd ** -P * ryd ** Q;
  return lhs > rhs ? 1 : lhs < rhs ? -1 : 0;
}

// The pairs of points a mode looks at: 'window' the first and last, 'steps' each consecutive pair, 'pairs' every pair.
export function pairsFor(n, mode) {
  if (mode === 'window') return [[0, n - 1]];
  const out = [];
  if (mode === 'steps') { for (let i = 0; i + 1 < n; i++) out.push([i, i + 1]); return out; }
  if (mode === 'pairs') { for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]); return out; }
  throw new RangeError(`unknown mode: ${mode}`);
}

// True when every slope the mode looks at lies in the closed bracket [lo, hi]; lo and hi are [p, q] with q > 0.
export function exponentIn(xs, ys, lo, hi, mode = 'window') {
  if (xs.length !== ys.length || xs.length < 2) throw new RangeError('need two or more points, xs and ys the same length');
  for (const [i, j] of pairsFor(xs.length, mode)) {
    if (cmpPower(xs[i], xs[j], ys[i], ys[j], lo[0], lo[1]) < 0) return false;
    if (cmpPower(xs[i], xs[j], ys[i], ys[j], hi[0], hi[1]) > 0) return false;
  }
  return true;
}

// Same test when the printed values are base-2 logarithms of y at x = 2^n (a column such as log2 <|u_n|^2> against shell
// n). Then (y_b/y_a)^q >= (x_b/x_a)^p reads 2^(q dL) >= 2^(p dn), that is q dL >= p dn, with dL a difference of decimals.
// ns are integers, ls are [num, den] decimals (den > 0, num any sign). Integers only.
export function exponentInLog2(ns, ls, lo, hi, mode = 'window') {
  if (ns.length !== ls.length || ns.length < 2) throw new RangeError('need two or more points, ns and ls the same length');
  for (const [i, j] of pairsFor(ns.length, mode)) {
    const dn = big(ns[j]) - big(ns[i]);
    const [an, ad] = ls[i], [bn, bd] = ls[j];
    const dLn = bn * ad - an * bd, dLd = ad * bd; // L_b - L_a = dLn / dLd, dLd > 0
    // slope = dLn / (dLd dn); compare q * dLn against p * dLd * dn (dn > 0)
    if (big(lo[1]) * dLn < big(lo[0]) * dLd * dn) return false;
    if (big(hi[1]) * dLn > big(hi[0]) * dLd * dn) return false;
  }
  return true;
}

// Smallest half-width w = k/step, k = 0, 1, 2, ..., kMax, for which accepts(lo, hi, mode) holds on the bracket
// [e - w, e + w], or null if none up to kMax/step. e is [p, q]. accepts is exponentIn or exponentInLog2 with its data bound.
// Each trial is exact; the grid is the only coarseness.
export function tightestHalfWidth(accepts, e, mode, step = 1000, kMax = 1000) {
  const p = big(e[0]), q = big(e[1]), st = BigInt(step);
  for (let k = 0; k <= kMax; k++) {
    const den = q * st;
    if (accepts([p * st - BigInt(k) * q, den], [p * st + BigInt(k) * q, den], mode)) return [k, step];
  }
  return null;
}

// ---- reference used by the tests: natural logarithm of a positive rational to about 70 decimal digits, BigInt only.
const SCALE_DIGITS = 80n, S = 10n ** SCALE_DIGITS;
function atanhFixed(zn, zd) { // atanh(zn/zd) as fixed point, |zn/zd| < 1/5
  const z = zn * S / zd, z2 = z * z / S;
  let term = z, sum = 0n, k = 1n;
  while (term !== 0n) { sum += term / k; term = term * z2 / S; k += 2n; }
  return sum;
}
const LN2 = 2n * atanhFixed(1n, 3n);
export function lnFixed(num, den) { // ln(num/den) times 10^80, truncated
  let n = big(num), d = big(den), k = 0n;
  if (n <= 0n || d <= 0n) throw new RangeError('positive rationals only');
  while (n * n > 2n * d * d) { d *= 2n; k += 1n; }
  while (2n * n * n < d * d) { n *= 2n; k -= 1n; }
  return k * LN2 + 2n * atanhFixed(n - d, n + d);
}
// Sign of q ln(y_b/y_a) - p ln(x_b/x_a), or 0 when its size is under 10^(-60) (a tie or too close to call).
export function cmpPowerByLogs(xa, xb, ya, yb, p, q) {
  const [xan, xad] = rat(xa), [xbn, xbd] = rat(xb), [yan, yad] = rat(ya), [ybn, ybd] = rat(yb);
  const v = big(q) * lnFixed(ybn * yad, ybd * yan) - big(p) * lnFixed(xbn * xad, xbd * xan);
  const tiny = 10n ** (SCALE_DIGITS - 60n);
  return v > tiny ? 1 : v < -tiny ? -1 : 0;
}
