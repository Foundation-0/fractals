/* Fractal landscapes via 1D midpoint displacement (Fournier-Fussell-Carpenter 1982).
 * Hurst parameter H in (0,1): smaller H = rougher. Each midpoint gets a uniform displacement on
 * [-amp, amp], with amp shrinking by 2^-H per level. The left end is always y[0] = 0; the right end
 * is free by default (drawn once, before the recursion, with an fBm-consistent amplitude) or pinned
 * to 0 with opts.pinned = true, which gives the classic FFC bridge. The increments are not
 * stationary for H != 1/2: pairs offset by half a lag have a different variance from
 * dyadic-aligned pairs, so variogram() averages over all pairs while exactAlignedVariance()
 * tracks the aligned ones. D = 2 - H is the known result for the graph dimension of fBm
 * (Orey 1970, Adler 1981); this module does NOT test it.
 * No dependencies. Loads in Node (require) and browser (window.FL).
 */
(function (root) {
  'use strict';

  function mulberry32(seed) { // small seeded generator; exactly repeatable for a given seed
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  function checkNH(n, H) {
    if (!Number.isInteger(n) || n < 2 || n > 24) throw new RangeError('n must be an integer in [2, 24]');
    if (!Number.isFinite(H) || H <= 0 || H >= 1) throw new RangeError('H must be finite with 0 < H < 1');
  }
  // Amplitude of the free right end: the level-1 displacement has amplitude 1 (variance 1/3), and
  // this gives y[N] the variance (1/3)/(2^(-2H) - 1/4), so the end-to-end increment has the
  // fBm-consistent variance relative to the first midpoint.
  function endAmplitude(H) { return Math.pow(2, H) / Math.sqrt(1 - Math.pow(2, 2 * H - 2)); }

  function generate(n, H, seed = 1, opts = {}) {
    checkNH(n, H);
    const rng = mulberry32(seed);
    const N = 1 << n;
    const pinned = opts.pinned === true;
    const y = new Array(N + 1).fill(0); // y[0] = 0 always
    if (!pinned) y[N] = (rng() * 2 - 1) * endAmplitude(H);
    let step = N, amp = 1;
    while (step > 1) {
      const half = step / 2;
      for (let i = half; i < N; i += step) {
        const mid = (y[i - half] + y[i + half]) / 2;
        y[i] = mid + (rng() * 2 - 1) * amp;
      }
      step = half;
      amp *= Math.pow(0.5, H);
    }
    return y;
  }

  // Mean squared increment over all pairs (i, i+lag).
  function variogram(y, lags) {
    return lags.map(lag => {
      let s = 0, cnt = 0;
      for (let i = 0; i + lag < y.length; i++) { const d = y[i + lag] - y[i]; s += d * d; cnt++; }
      return { lag, v: s / cnt };
    });
  }

  // Least-squares log-log fit of {lag, v} points; the Hurst exponent is half the slope.
  function fitH(points) {
    if (!Array.isArray(points) || points.length < 2) throw new RangeError('fitH needs at least two points');
    const xs = points.map(p => Math.log(p.lag)), ys = points.map(p => Math.log(p.v));
    const m = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
    let num = 0, den = 0;
    for (let i = 0; i < m; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
    return num / den / 2;
  }

  // Powers of two 1, 2, 4, ... <= maxLag (and within the grid of N intervals).
  function dyadicLags(N, maxLag) {
    const lags = [];
    for (let l = 1; l <= maxLag && l <= N; l <<= 1) lags.push(l);
    return lags;
  }

  function estimateH(y, opts = {}) {
    const N = y.length - 1;
    const maxLag = opts.maxLag == null ? Math.floor(N / 16) : opts.maxLag;
    const lags = dyadicLags(N, maxLag);
    if (lags.length < 2) throw new RangeError('estimateH needs at least two dyadic lags');
    return fitH(variogram(y, lags));
  }

  // Exact E[(y[i+lag]-y[i])^2] averaged over the dyadic-aligned pairs i = 0, lag, 2*lag, ...
  // (i + lag <= N), by linear propagation: y is linear in the independent uniforms (the end draw
  // and one per midpoint), each with variance amp^2/3, so each grid point carries a coefficient
  // vector over those uniforms and the variance is the sum of squared coefficient differences
  // times the variances. Exact for any n (cost is O(N^2)); meant for n up to 8 (N = 256).
  function exactAlignedVariance(n, H, lag, opts = {}) {
    checkNH(n, H);
    const N = 1 << n;
    if (!Number.isInteger(lag) || lag < 1 || lag > N) throw new RangeError('lag must be an integer in [1, N]');
    const pinned = opts.pinned === true;
    const numU = pinned ? N - 1 : N; // midpoints (N-1) plus the end draw when free
    const coef = new Array(N + 1);
    for (let j = 0; j <= N; j++) coef[j] = new Float64Array(numU);
    const varU = new Float64Array(numU);
    let k = 0;
    if (!pinned) { const a = endAmplitude(H); coef[N][k] = 1; varU[k] = a * a / 3; k++; }
    let step = N, amp = 1;
    while (step > 1) {
      const half = step / 2;
      for (let i = half; i < N; i += step) {
        const lo = coef[i - half], hi = coef[i + half], c = coef[i];
        for (let j = 0; j < numU; j++) c[j] = (lo[j] + hi[j]) / 2;
        c[k] += 1; // coefficient of this uniform is 1; its amplitude lives in varU
        varU[k] = amp * amp / 3;
        k++;
      }
      step = half;
      amp *= Math.pow(0.5, H);
    }
    let acc = 0, cnt = 0;
    for (let i = 0; i + lag <= N; i += lag) {
      const a = coef[i], b = coef[i + lag];
      let s = 0;
      for (let j = 0; j < numU; j++) { const d = b[j] - a[j]; s += d * d * varU[j]; }
      acc += s; cnt++;
    }
    return acc / cnt;
  }

  const api = { generate, variogram, fitH, dyadicLags, estimateH, exactAlignedVariance };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FL = api;
})(typeof window !== 'undefined' ? window : globalThis);
