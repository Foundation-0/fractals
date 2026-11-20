// Checks the no-logarithm exponent check (scaling-check/check.mjs): known answers, exact ties, 3000 random cases against
// 80-digit natural logarithms (BigInt fixed point, no float), the same test on printed base-2 logarithms against the ratio
// form, four must-fail controls (a wrong exponent, a dropped tie, a dropped sign, a perturbed point: each is run through a
// deliberately broken version and the test requires the broken version to give the wrong answer), and the verdicts on the
// series in scaling-check/series.mjs. Run: npm test (or node tests/scaling-check.mjs). Integers only: nothing here can
// flake, and no check is an assert that a flag could strip. Each line states what it guards.
import { cmpPower, cmpPowerByLogs, dec, exponentIn, exponentInLog2, pairsFor } from '../scaling-check/check.mjs';
import { SERIES, acceptor } from '../scaling-check/series.mjs';

let fails = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n      ${detail}` : ''}`); if (!ok) fails++; };
const R = (n, d = 1) => [BigInt(n), BigInt(d)];
const throws = f => { try { f(); return false; } catch { return true; } };

// 1. Known answers for one pair of scales.
{
  // y = x^(3/2) between x = 1 and 4: y goes 1 -> 8, slope exactly 3/2.
  const c = (p, q) => cmpPower(R(1), R(4), R(1), R(8), p, q);
  check('Known answer: slope 8 over 4 is exactly 3/2 (tie, 0), above 1 (+1), below 2 (-1)', c(3, 2) === 0 && c(1, 1) === 1 && c(2, 1) === -1);
  check('Known answer: unreduced fractions give the same slope (6/4, 9/6)', c(6, 4) === 0 && c(9, 6) === 0);
  // falling: y 8 -> 1 over x 1 -> 4: slope -3/2.
  const f = (p, q) => cmpPower(R(1), R(4), R(8), R(1), p, q);
  check('Known answer: slope -3/2 for a falling series; above -2, below -1, tie at -3/2', f(-2, 1) === 1 && f(-1, 1) === -1 && f(-3, 2) === 0);
  check('Known answer: slope 0 for a flat series; tie at 0/1, below 1/100', cmpPower(R(2), R(10), R(5), R(5), 0, 1) === 0 && cmpPower(R(2), R(10), R(5), R(5), 1, 100) === -1);
  check('Known answer: fractions as scales and values (x 1/2 -> 2, y 3/4 -> 12: ratio 16 over 4, slope 2)', cmpPower(R(1, 2), R(2), R(3, 4), R(12), 2, 1) === 0);
  check('Refuses q <= 0, zero or negative values, non-integers', throws(() => cmpPower(R(1), R(2), R(1), R(2), 1, 0)) &&
    throws(() => cmpPower(R(1), R(2), [0n, 1n], R(2), 1, 1)) && throws(() => cmpPower(R(1), R(2), R(1), [-2n, 1n], 1, 1)) &&
    throws(() => cmpPower(R(1), R(2), R(1), R(2), 0.5, 1)));
  check('Decimal strings parse to exact fractions, no float', dec('0.7819')[0] === 7819n && dec('0.7819')[1] === 10000n && dec('-12.71')[0] === -1271n && throws(() => dec('1e-3')));
}

// 2. Exact ties: y = x^(p/q) at points where both ratios are integers.
{
  let n = 0, bad = 0;
  for (const [p, q] of [[3, 2], [-1, 3], [0, 1], [5, 4], [-7, 2], [2, 1], [91, 48], [-18, 25]]) {
    for (const r of [2, 3, 4, 9]) {
      const xr = BigInt(r) ** BigInt(q), ypow = BigInt(r) ** BigInt(Math.abs(p)); // x ratio r^q, y ratio r^p
      const yb = p >= 0 ? [ypow, 1n] : [1n, ypow];
      n++;
      if (cmpPower(R(1), [xr, 1n], R(1), yb, p, q) !== 0) bad++;
      if (cmpPower(R(1), [xr, 1n], R(1), [yb[0] * 2n, yb[1]], p, q) !== 1) bad++; // doubling y moves it strictly above
      if (cmpPower(R(1), [xr, 1n], R(1), [yb[0], yb[1] * 2n], p, q) !== -1) bad++; // halving moves it strictly below
    }
  }
  check('Exact ties are ties, and doubling or halving y leaves the tie on the right side', bad === 0, `${n} ties, ${bad} wrong answers`);
}

// 3. Against 80-digit logarithms on random cases (fixed seed, integer generator).
{
  let s = 20261120;
  const rnd = (lo, hi) => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return lo + (s >>> 8) % (hi - lo + 1); };
  const N = 3000;
  let bad = 0, compared = 0;
  for (let i = 0; i < N; i++) {
    const xa = R(rnd(1, 50), rnd(1, 9)), xb = [xa[0] * BigInt(rnd(2, 9)), xa[1]];
    const ya = R(rnd(1, 99), rnd(1, 99)), yb = R(rnd(1, 99), rnd(1, 99));
    const p = rnd(-9, 9), q = rnd(1, 6);
    const ref = cmpPowerByLogs(xa, xb, ya, yb, p, q);
    if (ref === 0) continue; // a tie or closer than 1e-60: not decided by the reference
    compared++;
    if (cmpPower(xa, xb, ya, yb, p, q) !== ref) bad++;
  }
  check('3000 random cases agree with 80-digit natural logarithms', bad === 0 && compared > 2900, `${compared} compared, ${bad} disagree`);
  check('The log reference is not vacuous: slope 3/2 on 4 -> 8 is above 1.4999, below 1.5001, and a tie at 3/2',
    cmpPowerByLogs(R(1), R(4), R(1), R(8), 14999, 10000) === 1 && cmpPowerByLogs(R(1), R(4), R(1), R(8), 15001, 10000) === -1 && cmpPowerByLogs(R(1), R(4), R(1), R(8), 3, 2) === 0);
}

// 4. Brackets over a series, three modes.
{
  const xs = [R(1), R(4), R(16), R(64)], ys = [R(1), R(8), R(64), R(512)]; // y = x^(3/2) exactly
  check('Series known answer: y = x^(3/2) is inside [3/2, 3/2] in all three modes', ['window', 'steps', 'pairs'].every(m => exponentIn(xs, ys, [3, 2], [3, 2], m)));
  check('Series known answer: and outside [1, 1] and [2, 2]', !exponentIn(xs, ys, [1, 1], [1, 1]) && !exponentIn(xs, ys, [2, 2], [2, 2]) && !exponentIn(xs, ys, [3, 2], [1, 1]));
  // window passes where steps and pairs fail: the middle point is off the line.
  const ys2 = [R(1), R(8), R(80), R(512)];
  check('Modes differ: a bump in the middle leaves the window tie but fails steps and pairs', exponentIn(xs, ys2, [3, 2], [3, 2], 'window') && !exponentIn(xs, ys2, [3, 2], [3, 2], 'steps') && !exponentIn(xs, ys2, [3, 2], [3, 2], 'pairs'));
  check('Modes differ: steps and pairs look at 2 and 3 slopes of a 3-point series', pairsFor(3, 'steps').length === 2 && pairsFor(3, 'pairs').length === 3 && pairsFor(3, 'window').length === 1);
  check('Refuses an unknown mode, one point, mismatched lengths', throws(() => exponentIn(xs, ys, [1, 1], [2, 1], 'all')) && throws(() => exponentIn([R(1)], [R(1)], [1, 1], [2, 1])) && throws(() => exponentIn(xs, ys.slice(1), [1, 1], [2, 1])));
}

// 5. Printed base-2 logarithms: exponentInLog2 against the ratio form where both apply (x = 2^n, y = 2^L, L an integer).
{
  let s = 99, bad = 0, n = 0;
  const rnd = (lo, hi) => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return lo + (s >>> 8) % (hi - lo + 1); };
  for (let i = 0; i < 400; i++) {
    const m = rnd(2, 5), ns = [], Ls = [], n0 = rnd(0, 6);
    let L = rnd(-5, 5);
    for (let j = 0; j < m; j++) { ns.push(n0 + j); L += rnd(-4, 4); Ls.push(L); }
    const lo = [rnd(-6, 2), rnd(1, 4)], hi = [lo[0] + rnd(0, 8), lo[1]];
    for (const mode of ['window', 'steps', 'pairs']) {
      n++;
      const ratio = exponentIn(ns.map(v => [2n ** BigInt(v), 1n]), Ls.map(v => (v >= 0 ? [2n ** BigInt(v), 1n] : [1n, 2n ** BigInt(-v)])), lo, hi, mode);
      const logs = exponentInLog2(ns, Ls.map(v => [BigInt(v), 1n]), lo, hi, mode);
      if (ratio !== logs) bad++;
    }
  }
  check('Printed-log2 form agrees with the ratio form on 1200 integer cases', bad === 0, `${n} compared, ${bad} disagree`);
  const ls = ['0', '1.5', '3', '4.5'].map(dec);
  check('Printed-log2 known answer: slope exactly 3/2 is accepted by [3/2, 3/2] and not by [1, 7/5] or [8/5, 2]',
    exponentInLog2([0, 1, 2, 3], ls, [3, 2], [3, 2]) && !exponentInLog2([0, 1, 2, 3], ls, [1, 1], [7, 5]) && !exponentInLog2([0, 1, 2, 3], ls, [8, 5], [2, 1]));
}

// 6. Must-fail controls. Each control runs a deliberately broken version and requires it to give the wrong answer where
// the real checker gives the right one, so the test goes red if the checker loses the property.
{
  const inWindow = (cmp, xs, ys, lo, hi) => { const j = xs.length - 1; return cmp(xs[0], xs[j], ys[0], ys[j], lo[0], lo[1]) >= 0 && cmp(xs[0], xs[j], ys[0], ys[j], hi[0], hi[1]) <= 0; };
  const strictCmp = (xa, xb, ya, yb, p, q) => (cmpPower(xa, xb, ya, yb, p, q) > 0 ? 1 : -1); // drops the tie: 0 becomes -1
  const unsignedCmp = (xa, xb, ya, yb, p, q) => cmpPower(xa, xb, ya, yb, Math.abs(p), q); // drops the sign of p
  const real = (xs, ys, lo, hi) => inWindow(cmpPower, xs, ys, lo, hi);

  // (a) a wrong exponent is rejected: Ising susceptibility against the mean-field 2 +- 1/10, and the right 7/4 +- 1/10 is accepted.
  const chi = SERIES.find(s => s.id === 'ising-chi'), acc = acceptor(chi);
  check('Control, wrong exponent: susceptibility against 2 +- 1/10 is rejected; against 7/4 +- 1/10 accepted', !acc([19, 10], [21, 10], 'window') && acc([33, 20], [37, 20], 'window'));
  const m = SERIES.find(s => s.id === 'ising-m'), accM = acceptor(m);
  check('Control, wrong exponent: magnetisation against -1/2 +- 1/10 is rejected', !accM([-6, 10], [-4, 10], 'window'));
  // (b) a dropped tie: slope exactly 3/2 must be inside [3/2, 3/2]; a strict comparison rejects it.
  const xs = [R(1), R(4)], ys = [R(1), R(8)];
  check('Control, dropped tie: the real check accepts [3/2, 3/2], the strict-comparison version rejects it', real(xs, ys, [3, 2], [3, 2]) && !inWindow(strictCmp, xs, ys, [3, 2], [3, 2]));
  // (c) a dropped sign: falling series, slope -3/2. Real accepts [-3/2, -3/2] and rejects [0, 1]; the unsigned version gets one wrong.
  const xf = [R(1), R(4)], yf = [R(8), R(1)];
  const realOk = real(xf, yf, [-3, 2], [-3, 2]) && !real(xf, yf, [0, 1], [1, 1]);
  const mutOk = inWindow(unsignedCmp, xf, yf, [-3, 2], [-3, 2]) && !inWindow(unsignedCmp, xf, yf, [0, 1], [1, 1]);
  check('Control, dropped sign: the real check is right on a falling series, the unsigned version is wrong on it', realOk && !mutOk);
  // (d) a perturbed point: y 9 for 8 leaves [3/2, 3/2]; so does 7. And one printed digit changed in a real series leaves a tight bracket.
  check('Control, perturbed point: y = 9 or 7 for 8 leaves [3/2, 3/2]', !real(xs, [R(1), R(9)], [3, 2], [3, 2]) && !real(xs, [R(1), R(7)], [3, 2], [3, 2]) && real(xs, [R(1), R(8)], [3, 2], [3, 2]));
  const ysPert = chi.y.slice(); ysPert[2] = '569.2'; // 469.2 -> 569.2 in the middle point
  const xsR = chi.x.map(v => [BigInt(v), 1n]);
  check('Control, perturbed point: changing the middle susceptibility 469.2 to 569.2 breaks steps at +-1/10 that held',
    acceptor(chi)([33, 20], [37, 20], 'steps') && !exponentIn(xsR, ysPert.map(dec), [33, 20], [37, 20], 'steps'));
}

// 7. The series in scaling-check/series.mjs: what the check says, recorded. window / steps / pairs at +-1/100, +-3/100, +-1/10.
{
  const EXPECT = {
    'ising-m': ['ynn', 'yyy', 'yyy'], 'ising-chi': ['ynn', 'ynn', 'yyy'], 'ising-g': ['ynn', 'ynn', 'yyy'],
    'perc-mass': ['nnn', 'ynn', 'yyy'], 'sabra-u2': ['nnn', 'nnn', 'ynn'],
  };
  const TOLS = [[1n, 100n], [3n, 100n], [1n, 10n]];
  for (const s of SERIES) {
    const acc = acceptor(s);
    const got = TOLS.map(([tn, td]) => {
      const [p, q] = [BigInt(s.published[0]), BigInt(s.published[1])];
      return ['window', 'steps', 'pairs'].map(mode => (acc([p * td - tn * q, q * td], [p * td + tn * q, q * td], mode) ? 'y' : 'n')).join('');
    });
    // EXPECT is indexed by mode order window, steps, pairs for each tolerance: store as one string per mode across tolerances.
    const want = [0, 1, 2].map(i => EXPECT[s.id].map(t => t[i]).join('')); // want[i] = verdicts of mode i at the three tolerances
    const have = [0, 1, 2].map(i => got.map(t => t[i]).join(''));
    check(`Series ${s.id}: verdicts at +-1/100, +-3/100, +-1/10 (window / steps / pairs): ${have.join(' / ')}`, want.join() === have.join(), `expected ${want.join(' / ')}`);
  }
  // Rejections where the repository compares: stated plainly.
  const perc = acceptor(SERIES.find(x => x.id === 'perc-mass')), sab = acceptor(SERIES.find(x => x.id === 'sabra-u2'));
  check('Rejected: the one-seed percolation mass slope is outside 91/48 +- 1/100 (D = 1.8734 on this seed)', !perc([8743, 4800], [8953, 4800], 'window'));
  check("Rejected: the plain moment's printed log2 slope is outside 0.720 +- 0.008 (slope 0.756 over shells 3 to 8)", !sab([-728, 1000], [-712, 1000], 'window'));
  check('Rejected: and outside K41 2/3 +- 1/30; accepted by 0.756 +- 0.001 as a tie control', !sab([-21, 30], [-19, 30], 'window') && sab([-757, 1000], [-755, 1000], 'window'));
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall scaling-check checks pass');
process.exit(fails ? 1 : 0);
