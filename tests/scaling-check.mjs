// Checks the no-logarithm exponent check (scaling-check/check.mjs): known answers, exact ties, 3000 random cases against
// 80-digit natural logarithms (BigInt fixed point, no float), the same test on printed base-2 logarithms against the ratio
// form, four must-fail controls (a wrong exponent, a dropped tie, a dropped sign, a perturbed point: each is run through a
// deliberately broken version and the test requires the broken version to give the wrong answer), and the verdicts on the
// series in scaling-check/series.mjs. Run: npm test (or node tests/scaling-check.mjs). Integers only: nothing here can
// flake, and no check is an assert that a flag could strip. Each line states what it guards.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cmpPower, cmpPowerByLogs, dec, exponentIn, exponentInLog2, pairsFor, tightestHalfWidth } from '../scaling-check/check.mjs';
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
  // Steps and all pairs give the same verdict (a longer slope is a weighted average of the step slopes), and window is
  // never stricter than steps. Checked on random ratio series with uneven scale steps.
  let sameBad = 0, winBad = 0, differ = 0;
  for (let i = 0; i < 400; i++) {
    const m = rnd(3, 6), xs = [], ys = [];
    let x = rnd(1, 5);
    for (let j = 0; j < m; j++) { xs.push(R(x)); ys.push(R(rnd(1, 400), rnd(1, 9))); x *= rnd(2, 4); }
    const lo = [rnd(-30, 10), 10], hi = [lo[0] + rnd(0, 30), 10];
    const st = exponentIn(xs, ys, lo, hi, 'steps'), pr = exponentIn(xs, ys, lo, hi, 'pairs'), wi = exponentIn(xs, ys, lo, hi, 'window');
    if (st !== pr) sameBad++;
    if (st && !wi) winBad++;
    if (wi && !st) differ++;
  }
  check('Steps and all pairs agree on 400 random series, window accepts whenever steps does, and window is looser on some',
    sameBad === 0 && winBad === 0 && differ > 0, `${sameBad} steps/pairs disagreements, ${winBad} window rejections under accepted steps, ${differ} looser windows`);
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
  // 91/48 +- 1/100 is [9052/4800, 9148/4800]. The window slope 1.8727 is 0.0232 below 91/48: outside +- 23/1000, inside +- 24/1000.
  check('Rejected: the one-seed percolation mass window slope (1.8727) is outside 91/48 +- 1/100 and +- 23/1000, inside +- 24/1000',
    !perc([9052, 4800], [9148, 4800], 'window') && !perc([91000 - 23 * 48, 48000], [91000 + 23 * 48, 48000], 'window') &&
    perc([91000 - 24 * 48, 48000], [91000 + 24 * 48, 48000], 'window'));
  // From L = 64 on (the README's second reading), the window slope is 1.8804: 0.0155 below 91/48.
  const p64 = SERIES.find(x => x.id === 'perc-mass'), x64 = p64.x.slice(1).map(v => [BigInt(v), 1n]), y64 = p64.y.slice(1).map(dec);
  check('Rejected: from L = 64 on, the percolation window slope (1.8804) is still outside 91/48 +- 1/100 and +- 15/1000, inside +- 16/1000',
    !exponentIn(x64, y64, [9052, 4800], [9148, 4800]) && !exponentIn(x64, y64, [91000 - 15 * 48, 48000], [91000 + 15 * 48, 48000]) &&
    exponentIn(x64, y64, [91000 - 16 * 48, 48000], [91000 + 16 * 48, 48000]));
  check("Rejected: the plain moment's printed log2 slope is outside 0.720 +- 0.008 (slope 0.756 over shells 3 to 8)", !sab([-728, 1000], [-712, 1000], 'window'));
  check('Rejected: and outside K41 2/3 +- 1/30; the window slope is exactly -0.756, an exact tie at [-756/1000, -756/1000]',
    !sab([-21, 30], [-19, 30], 'window') && sab([-756, 1000], [-756, 1000], 'window') && !sab([-755, 1000], [-755, 1000], 'window'));
}

// 8. The smallest half-widths that table.mjs prints and README.md quotes, recomputed outside this repository with 60-digit
// decimal logarithms of the same printed numbers. A changed digit, a wrong mode or a broken grid search turns these red.
{
  const WANT = { // window, steps, pairs, in thousandths
    'ising-m': [1, 23, 23], 'ising-chi': [1, 32, 32], 'ising-g': [3, 39, 39], 'perc-mass': [24, 39, 39], 'sabra-u2': [36, 370, 370],
  };
  for (const s of SERIES) {
    const acc = acceptor(s);
    const have = ['window', 'steps', 'pairs'].map(m => { const w = tightestHalfWidth(acc, s.published, m); return w ? w[0] : null; });
    check(`Series ${s.id}: smallest accepted half-width on a 0.001 grid (window, steps, pairs) is ${have.join(', ')} thousandths`,
      have.join() === WANT[s.id].join(), `expected ${WANT[s.id].join(', ')}`);
  }
  // Known answer for the grid search itself: slope exactly 3/2; 1.4 and 1.6 need half-width 0.1 exactly (a tie at the edge).
  const xs = [R(1), R(4)], ys = [R(1), R(8)];
  const accT = (lo, hi, mode) => exponentIn(xs, ys, lo, hi, mode);
  const w0 = tightestHalfWidth(accT, [3, 2], 'window'), w1 = tightestHalfWidth(accT, [7, 5], 'window'), w2 = tightestHalfWidth(accT, [8, 5], 'window');
  const wNone = tightestHalfWidth(accT, [3, 2], 'window', 1000, -1);
  check('Grid search known answer: 0 around 3/2, 100 thousandths around 7/5 and 8/5, null when no step is tried',
    w0 && w0[0] === 0 && w1 && w1[0] === 100 && w2 && w2[0] === 100 && wNone === null);
}

// 9. The verdict script itself runs and prints the same half-widths (it is not in CI on its own).
{
  const r = spawnSync(process.execPath, [fileURLToPath(new URL('../scaling-check/table.mjs', import.meta.url))], { encoding: 'utf8', timeout: 60000 });
  const lines = (r.stdout || '').split('\n').filter(l => l.includes('smallest half-width'));
  check('scaling-check/table.mjs exits 0 and prints the five half-width lines above',
    r.status === 0 && lines.length === 5 && lines[3].endsWith('window 0.024, steps 0.039, pairs 0.039') && lines[4].endsWith('window 0.036, steps 0.370, pairs 0.370'),
    `exit ${r.status}, ${lines.length} half-width lines`);
}

// 10. Error bars: steps and all pairs can differ. The interval form of all pairs, (U_j/L_i)^q1 >= (x_j/x_i)^p1 and
// (L_j/U_i)^q2 <= (x_j/x_i)^p2 for every i < j, decides whether values inside the boxes exist with every step slope in the
// bracket (a chain of difference constraints, Dechter, Meiri and Pearl 1991; Foundation-0/fractals draft pull request 60).
// It is written here in exact BigInt fractions on purpose and is not a mode of check.mjs. The smallest disagreement: scales
// 1, 2, 4, bracket [1, 1], boxes [1,1], [3/2,5/2], [9/2,5].
{
  const mul = (a, b) => [a[0] * b[0], a[1] * b[1]];
  const rpow = (r, e) => (e >= 0n ? [r[0] ** e, r[1] ** e] : [r[1] ** -e, r[0] ** -e]); // r positive
  const geq = (a, b) => a[0] * b[1] >= b[0] * a[1]; // denominators positive
  const slopeOk = (x, box, i, j, lo, hi) => { // the interval inequalities for the pair (i, j)
    const rx = [x[j][0] * x[i][1], x[j][1] * x[i][0]];
    const up = mul(box[j][1], [box[i][0][1], box[i][0][0]]); // U_j / L_i
    const dn = mul(box[j][0], [box[i][1][1], box[i][1][0]]); // L_j / U_i
    return geq(rpow(up, BigInt(lo[1])), rpow(rx, BigInt(lo[0]))) && geq(rpow(rx, BigInt(hi[0])), rpow(dn, BigInt(hi[1])));
  };
  const allOk = (x, box, lo, hi, pairs) => pairs.every(([i, j]) => slopeOk(x, box, i, j, lo, hi));
  const x = [R(1), R(2), R(4)], one = [1, 1];
  const boxes = [[R(1), R(1)], [R(3, 2), R(5, 2)], [R(9, 2), R(5)]];
  const stepsPairs = pairsFor(3, 'steps'), allPairs = pairsFor(3, 'pairs');
  check('Boxes: each step of the smallest disagreement example admits slope 1, so the step test passes',
    allOk(x, boxes, one, one, stepsPairs));
  check('Boxes: the pair of the first and last scales does not (L_2/U_0 = 9/2 is above 4), so the all-pairs test fails',
    !slopeOk(x, boxes, 0, 2, one, one) && !allOk(x, boxes, one, one, allPairs));
  // Must-fail twin: widen the last box to [4, 5]. Now the pair test passes, and values y = 1, 2, 4 inside the boxes have slope 1.
  const wide = [boxes[0], boxes[1], [R(4), R(5)]];
  const inBox = (v, b) => geq(v, b[0]) && geq(b[1], v);
  check('Control, widened last box [4, 5]: the pair test now passes, and the witness 1, 2, 4 sits in the boxes with slope 1 on every pair',
    allOk(x, wide, one, one, allPairs) && [R(1), R(2), R(4)].every((v, k) => inBox(v, wide[k])) &&
    allPairs.every(([i, j]) => cmpPower(x[i], x[j], [R(1), R(2), R(4)][i], [R(1), R(2), R(4)][j], 1, 1) === 0));
  // The step test is blind to the widening: it gave the same verdict before, so it cannot be what tells the two cases apart.
  check('Control: the step test gives the same verdict (pass) on the original and the widened boxes, only the pair test differs',
    allOk(x, wide, one, one, stepsPairs) && allOk(x, wide, one, one, allPairs) !== allOk(x, boxes, one, one, allPairs));
  // The inequality is not vacuous: a corrupted lower bracket end breaks a case that passed.
  check('Control, corrupted bracket: the widened boxes fail the pair test against [2, 2]', !allOk(x, wide, [2, 1], [2, 1], allPairs));
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall scaling-check checks pass');
process.exit(fails ? 1 : 0);
