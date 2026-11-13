/* Fractal landscapes via 1D midpoint displacement (Fournier-Fussell-Carpenter 1982).
 * Hurst parameter H in (0,1): smaller H = rougher. Fractal dimension D = 2 - H.
 * No dependencies. Loads in Node (require) and browser (window.FL).
 */
(function (root) {
  'use strict';

  function generate(n, H, seed) {
    // deterministic-ish via simple LCG if seed given
    let rng = seed == null ? Math.random : (() => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; }; })();
    const N = 1 << n;
    const y = new Array(N + 1).fill(0);
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

  function estimateH(y) {
    const lags = [];
    for (let k = 0; (1 << k) < y.length / 2; k++) lags.push(1 << k);
    const pts = lags.map(lag => {
      let s = 0, n = 0;
      for (let i = 0; i + lag < y.length; i++) { const d = y[i + lag] - y[i]; s += d * d; n++; }
      return { lag, v: s / n };
    });
    const xs = pts.map(p => Math.log(p.lag));
    const ys = pts.map(p => Math.log(p.v));
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
    return num / den / 2;
  }

  const api = { generate, estimateH };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FL = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
