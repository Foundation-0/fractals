/* Critical point: a lattice that repeats itself across scales at one temperature, and where the repetition stops.
 * Part of https://github.com/Foundation-0/fractals (issue #20). No dependencies. Loads in Node (require) and in a
 * browser (window.CRIT).
 *
 * Ising model: spins s = +-1 on an L x L square lattice with periodic edges, H = -J sum over neighbour pairs s_i s_j,
 * J = k_B = 1, so temperatures are in units of J/k_B and lengths in lattice spacings. Updates are Wolff single-cluster
 * flips (Wolff 1989): grow a cluster from a random site, adding each aligned neighbour with probability 1 - e^(-2/T),
 * then flip it. Exact results for the infinite lattice, with K = 1/T:
 *   T_c = 2 / ln(1 + sqrt 2) = 2.2692, where sinh 2K = 1 (Onsager 1944).
 *   Spontaneous magnetisation below T_c: M = (1 - sinh(2K)^-4)^(1/8) (Yang 1952).
 *   Energy per spin: u = -coth 2K [1 + (2/pi)(2 tanh^2 2K - 1) K1(k)], k = 2 sinh 2K / cosh^2 2K (Onsager 1944); the
 *     tests check it against the free energy as written by Caselle, Hasenbusch, Pelissetto & Vicari 2002, sec. 2.1.
 *   Correlation length above T_c, the exponential (true) one along a lattice axis: 1/xi = ln coth K - 2K = 2(K* - K),
 *     with K* the dual coupling, tanh K* = e^(-2K). It is the decay rate along an axis of the large-distance two-point
 *     function of Cheng & Wu (1967), as written by Caselle et al. 2002 (eqs. 5.1-5.4): 1/xi = 2 asinh(M_s / 2),
 *     M_s^2 = 4 (sqrt(1 + tau^2) - 1), tau = (1/sinh 2K - sinh 2K) / 2. Near T_c, xi = A / t with t = (K_c - K) / K_c
 *     and A = 1/(4 K_c) = 0.5673 (Caselle, Hasenbusch, Pelissetto & Vicari 2000, sec. 2). Below T_c the exponential
 *     correlation length is 1/(4(K - K*)), half the high-temperature one at the dual coupling (Fujimoto & Otsuka 2020,
 *     appendix A; near T_c the amplitude ratio 2 is in Pelissetto & Vicari 2002, sec. 3.5).
 *   Exponents beta = 1/8, nu = 1, eta = 1/4, gamma = 7/4 (Pelissetto & Vicari 2002, sec. 3.5). On a periodic L x L
 *     lattice at T_c the Binder cumulant 1 - <m^4>/(3<m^2>^2) tends to 1 - V4/3 = 0.61069, V4 = 1.1679229(47)
 *     (Salas & Sokal 2000).
 * Site percolation: an L x L square lattice with open edges, each site occupied with probability p. Newman & Ziff's
 * (2000) algorithm: occupy sites one at a time in random order, join each to its occupied neighbours with weighted
 * union-find, and note when a cluster first touches both the top and the bottom row (spans). Averages at a given p
 * follow by weighting each number of occupied sites n with the binomial probability C(N, n) p^n (1 - p)^(N - n).
 *   p_c = 0.59274621(13) (Newman & Ziff 2000). The incipient spanning cluster has fractal dimension D = 2 - 5/48 = 91/48:
 *   at p_c the chance that a site connects to distance R falls as R^(-5/48) (proved on the triangular lattice by
 *   Lawler, Schramm & Werner 2002; predicted by den Nijs 1979 and Nienhuis, Riedel & Schick 1980).
 * Random numbers: xoshiro128** seeded through splitmix32, integer arithmetic only, so a seed gives the same run on
 * every JavaScript engine.
 */
(function (root) {
  'use strict';
  const TC = 2 / Math.log(1 + Math.SQRT2);
  const KC = 1 / TC;
  const EXP = { beta: 1 / 8, nu: 1, eta: 1 / 4, gamma: 7 / 4 };
  const PERC = { pc: 0.59274621, pcErr: 1.3e-7, D: 91 / 48, oneArm: 5 / 48 };
  const TWO32 = 4294967296;

  // ---------- random numbers ----------
  function rng(seed) {
    let s = seed >>> 0;
    const split = () => { // splitmix32, only to fill the state
      s = (s + 0x9e3779b9) >>> 0;
      let z = s;
      z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
      z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
      return (z ^ (z >>> 16)) >>> 0;
    };
    let a = split(), b = split(), c = split(), d = split();
    if ((a | b | c | d) === 0) a = 1;
    return function next() { // xoshiro128**: a uniform integer in [0, 2^32)
      const r0 = Math.imul(b, 5), r = Math.imul((r0 << 7) | (r0 >>> 25), 9) >>> 0, t = b << 9;
      c ^= a; d ^= b; b ^= c; a ^= d; c ^= t; d = (d << 11) | (d >>> 21);
      return r;
    };
  }
  const below = (next, n) => Math.floor(next() / TWO32 * n); // uniform integer in [0, n), n < 2^21

  // ---------- exact results ----------
  const yangM = T => (T >= TC ? 0 : Math.pow(1 - Math.pow(Math.sinh(2 / T), -4), 1 / 8));
  // Complete elliptic integral of the first kind, K(k) = pi / (2 AGM(1, sqrt(1 - k^2))).
  function ellipticK(k) {
    let a = 1, b = Math.sqrt(1 - k * k);
    for (let i = 0; i < 40 && Math.abs(a - b) > 1e-16 * a; i++) { const m = (a + b) / 2; b = Math.sqrt(a * b); a = m; }
    return Math.PI / (2 * a);
  }
  function energyExact(T) { // energy per spin, J = 1; at T_c it is -sqrt 2
    const K = 1 / T, s = Math.sinh(2 * K), c = Math.cosh(2 * K), k = 2 * s / (c * c), th = Math.tanh(2 * K);
    if (Math.abs(k - 1) < 1e-12) return -Math.SQRT2;
    return -(c / s) * (1 + (2 / Math.PI) * (2 * th * th - 1) * ellipticK(k));
  }
  const dualK = K => -0.5 * Math.log(Math.tanh(K)); // tanh K* = e^(-2K)
  // Exponential correlation length along a lattice axis, above T_c (lattice spacings).
  const xiExact = T => { const K = 1 / T; return K >= KC ? Infinity : 1 / (Math.log(1 / Math.tanh(K)) - 2 * K); };
  // The same from Caselle et al. 2002, eqs. 5.1-5.4: the pole of the large-distance two-point function along an axis,
  // where 4 sinh^2(1/(2 xi)) = M_s^2.
  function xiCaselle(T) {
    const s = Math.sinh(2 / T), tau = (1 / s - s) / 2, Ms = Math.sqrt(4 * (Math.sqrt(1 + tau * tau) - 1));
    return 1 / (2 * Math.asinh(Ms / 2));
  }

  // ---------- Ising lattice and Wolff updates ----------
  function neighbours(L) { // right, left, up, down, with periodic edges
    const N = L * L, nb = new Int32Array(4 * N);
    for (let y = 0; y < L; y++) for (let x = 0; x < L; x++) {
      const i = y * L + x;
      nb[4 * i] = y * L + (x + 1) % L; nb[4 * i + 1] = y * L + (x + L - 1) % L;
      nb[4 * i + 2] = ((y + 1) % L) * L + x; nb[4 * i + 3] = ((y + L - 1) % L) * L + x;
    }
    return nb;
  }
  function ising(L, T, seed) { // starts with every spin up
    const N = L * L;
    return { L, N, T, s: new Int8Array(N).fill(1), nb: neighbours(L), stack: new Int32Array(N), next: rng(seed),
      thr: Math.floor((1 - Math.exp(-2 / T)) * TWO32), M: N };
  }
  function wolff(sys) { // one cluster flip; returns the cluster's size
    const s = sys.s, nb = sys.nb, stack = sys.stack, next = sys.next, thr = sys.thr;
    const i = below(next, sys.N), s0 = s[i];
    s[i] = -s0; stack[0] = i;
    let top = 1, size = 1;
    while (top > 0) {
      const j = 4 * stack[--top];
      for (let k = 0; k < 4; k++) {
        const n = nb[j + k];
        if (s[n] === s0 && next() < thr) { s[n] = -s0; stack[top++] = n; size++; }
      }
    }
    sys.M -= 2 * s0 * size;
    return size;
  }
  // k cluster flips. The count must be fixed in advance: flipping clusters until N spins have turned over, and measuring
  // then, stops more often just after a large cluster and over-weights ordered states (at T_c, L = 16, the Binder
  // cumulant comes out 0.629 that way, against 0.610 with a fixed count: studyTrap below, printed by
  // critical/table.mjs and checked by tests/critical.mjs).
  function flips(sys, k) { let n = 0; for (let i = 0; i < k; i++) n += wolff(sys); return n; }
  function energy(sys) { // total energy
    const s = sys.s, nb = sys.nb; let e = 0;
    for (let i = 0; i < sys.N; i++) e -= s[i] * (s[nb[4 * i]] + s[nb[4 * i + 2]]);
    return e;
  }
  // Spin-spin correlation G(r) = <s_i s_j> at distance r along either axis, from one configuration.
  function correlation(sys, r) {
    const s = sys.s, L = sys.L; let c = 0;
    for (let y = 0; y < L; y++) {
      const row = y * L, row2 = ((y + r) % L) * L;
      for (let x = 0; x < L; x++) c += s[row + x] * (s[row + (x + r) % L] + s[row2 + x]);
    }
    return c / (2 * sys.N);
  }
  // Row-summed correlation C(r) = sum over y of G(r, y), r = 0..L/2, from one configuration, added into out. It falls
  // as cosh((L/2 - r)/xi) with the exponential correlation length itself, without the 1/sqrt(r) of G(r).
  function projected(sys, out) {
    const s = sys.s, L = sys.L, col = new Float64Array(L), row = new Float64Array(L);
    for (let y = 0; y < L; y++) for (let x = 0; x < L; x++) { const v = s[y * L + x]; col[x] += v; row[y] += v; }
    for (let r = 0; r <= L / 2; r++) {
      let c = 0;
      for (let x = 0; x < L; x++) c += col[x] * col[(x + r) % L] + row[x] * row[(x + r) % L];
      out[r] += c / (2 * L * L);
    }
  }
  // A run: thermalise for `therm` sweeps, then take `sweeps` measurements, one per sweep. A sweep is a fixed number of
  // cluster flips, k = N / (mean cluster size during thermalisation), so that about N spins turn over per sweep.
  // Per measurement: m = magnetisation per spin (signed), e = energy per spin; with half: G(L/2); with proj: the
  // row-summed correlation, summed in `blocks` blocks.
  function simulate(L, T, opts) {
    const o = Object.assign({ seed: 1, therm: 200, sweeps: 1000, half: false, proj: false, blocks: 20 }, opts);
    const sys = ising(L, T, o.seed);
    let flipped = 0, count = 0;
    for (let i = 0; i < o.therm; i++) while (flipped < (i + 1) * sys.N) { flipped += wolff(sys); count++; }
    const k = Math.max(1, Math.round(count * sys.N / flipped));
    const n = o.sweeps, m = new Float64Array(n), e = new Float64Array(n), g = o.half ? new Float64Array(n) : null;
    const proj = o.proj ? Array.from({ length: o.blocks }, () => new Float64Array(L / 2 + 1)) : null;
    for (let t = 0; t < n; t++) {
      flips(sys, k);
      m[t] = sys.M / sys.N; e[t] = energy(sys) / sys.N;
      if (g) g[t] = correlation(sys, L / 2);
      if (proj) projected(sys, proj[Math.floor(t * o.blocks / n)]);
    }
    return { L, T, N: sys.N, n, k, m, e, g, proj, blocks: o.blocks, seed: o.seed };
  }


  // ---------- statistics ----------
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  // Jackknife over B blocks: f(b) is the estimate with block b left out of every run (b = -1: nothing left out).
  function jackknife(B, f) {
    const value = f(-1), part = [];
    for (let b = 0; b < B; b++) part.push(f(b));
    const mu = avg(part);
    return { value, err: Math.sqrt((B - 1) / B * part.reduce((a, x) => a + (x - mu) * (x - mu), 0)) };
  }
  const block = (n, b, B) => (b < 0 ? [0, 0] : [Math.floor(b * n / B), Math.floor((b + 1) * n / B)]);
  // Averages of |m|, m^2, m^4, G(L/2) and e in a run, without block b, reweighted from the run's temperature to T
  // (Ferrenberg & Swendsen 1988): each measurement counts with weight exp(-(1/T - 1/T_run) E).
  function moments(run, T, b) {
    const [lo, hi] = block(run.n, b === undefined ? -1 : b, run.blocks);
    const db = 1 / T - 1 / run.T, N = run.N, m = run.m, e = run.e, g = run.g;
    let ebar = 0;
    for (let i = 0; i < run.n; i++) if (i < lo || i >= hi) ebar += e[i];
    ebar /= run.n - (hi - lo);
    let w0 = 0, wa = 0, w2 = 0, w4 = 0, wg = 0, we = 0;
    for (let i = 0; i < run.n; i++) {
      if (i >= lo && i < hi) continue;
      const w = db === 0 ? 1 : Math.exp(-db * N * (e[i] - ebar)), x = m[i], x2 = x * x;
      w0 += w; wa += w * Math.abs(x); w2 += w * x2; w4 += w * x2 * x2; we += w * e[i];
      if (g) wg += w * g[i];
    }
    const m2 = w2 / w0, m4 = w4 / w0;
    return { abs: wa / w0, m2, m4, chi: N * m2, binder: 1 - m4 / (3 * m2 * m2), g: g ? wg / w0 : NaN, e: we / w0 };
  }
  // Root of f between lo and hi by bisection (NaN if f does not change sign).
  function bisect(f, lo, hi, steps) {
    let flo = f(lo);
    if (!(flo * f(hi) < 0)) return NaN;
    for (let i = 0; i < (steps || 30); i++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if (fm * flo > 0) { lo = mid; flo = fm; } else hi = mid;
    }
    return (lo + hi) / 2;
  }
  // Temperature where the Binder cumulants of two runs (a smaller, b larger) cross, without block k.
  const binderCrossing = (a, b, lo, hi, k) =>
    bisect(T => moments(b, T, k).binder - moments(a, T, k).binder, lo, hi, 24);
  // Least-squares slope of ln y against ln x.
  function logSlope(xs, ys) {
    const lx = xs.map(Math.log), ly = ys.map(Math.log), mx = avg(lx), my = avg(ly);
    let sxy = 0, sxx = 0;
    for (let i = 0; i < lx.length; i++) { sxy += (lx[i] - mx) * (ly[i] - my); sxx += (lx[i] - mx) * (lx[i] - mx); }
    return sxy / sxx;
  }
  // Exponential correlation length from the row-summed correlation at r1 < r2 on a ring of L sites:
  // C(r1)/C(r2) = cosh((L/2 - r1)/xi) / cosh((L/2 - r2)/xi), solved for xi by bisection on 1/xi.
  function xiFromProjected(C, L, r1, r2) {
    const lr = Math.log(C[r1] / C[r2]), a = L / 2 - r1, b = L / 2 - r2;
    if (!(lr > 0)) return NaN;
    return 1 / bisect(x => Math.log(Math.cosh(x * a) / Math.cosh(x * b)) - lr, 1e-6, 20, 60);
  }
  // Correlation length of a run made with proj: fitted from r1 = 1 out to r2, the last distance at which the row-summed
  // correlation is still above e^-2 of its value at r = 1 (about two correlation lengths). Jackknife over its blocks.
  function correlationLength(run) {
    const L = run.L, tot = new Float64Array(L / 2 + 1);
    for (const blk of run.proj) for (let r = 0; r <= L / 2; r++) tot[r] += blk[r];
    let r2 = 2;
    while (r2 + 1 < L / 2 && tot[r2 + 1] >= tot[1] * Math.exp(-2)) r2++;
    const C = b => (b < 0 ? tot : tot.map((v, r) => v - run.proj[b][r]));
    const res = jackknife(run.blocks, b => xiFromProjected(C(b), L, 1, r2));
    return Object.assign(res, { r1: 1, r2, C: Array.from(tot, v => v / run.n) });
  }

  // ---------- site percolation ----------
  // Binomial probabilities C(N, n) p^n (1 - p)^(N - n), n = 0..N, built outward from the most likely n.
  function binomial(N, p) {
    const pmf = new Float64Array(N + 1), mode = Math.min(N, Math.floor((N + 1) * p)), q = p / (1 - p);
    pmf[mode] = 1;
    for (let n = mode; n < N; n++) { pmf[n + 1] = pmf[n] * (N - n) / (n + 1) * q; if (pmf[n + 1] < 1e-300) break; }
    for (let n = mode; n > 0; n--) { pmf[n - 1] = pmf[n] * n / ((N - n + 1) * q); if (pmf[n - 1] < 1e-300) break; }
    let sum = 0;
    for (let n = 0; n <= N; n++) sum += pmf[n];
    for (let n = 0; n <= N; n++) pmf[n] /= sum;
    return pmf;
  }
  // `samples` runs on an L x L lattice with open edges. For each: nSpan, the number of occupied sites at which a cluster
  // first touches both the top and the bottom row; and, for every n in a window of +-7 standard deviations around p N,
  // the mass of the largest spanning cluster (0 if none) and of the largest cluster.
  function percolation(L, opts) {
    const o = Object.assign({ seed: 1, samples: 100, p: PERC.pc, blocks: 20 }, opts);
    const N = L * L, next = rng(o.seed), sd = Math.sqrt(N * o.p * (1 - o.p));
    const n0 = Math.max(1, Math.floor(N * o.p - 7 * sd)), n1 = Math.min(N, Math.ceil(N * o.p + 7 * sd)), w = n1 - n0 + 1;
    const nSpan = new Int32Array(o.samples), span = new Float64Array(o.samples * w), big = new Float64Array(o.samples * w);
    const order = new Int32Array(N), parent = new Int32Array(N), size = new Int32Array(N), flag = new Uint8Array(N);
    const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    const join = (r, j) => { // merge the cluster of occupied site j into root r (smaller under larger); returns the root
      if (parent[j] < 0) return r;
      const rj = find(j);
      if (rj === r) return r;
      if (size[rj] > size[r]) { parent[r] = rj; size[rj] += size[r]; flag[rj] |= flag[r]; return rj; }
      parent[rj] = r; size[r] += size[rj]; flag[r] |= flag[rj];
      return r;
    };
    for (let t = 0; t < o.samples; t++) {
      for (let i = 0; i < N; i++) order[i] = i;
      for (let i = N - 1; i > 0; i--) { const j = below(next, i + 1), v = order[i]; order[i] = order[j]; order[j] = v; }
      parent.fill(-1);
      let spanAt = 0, spanMax = 0, largest = 0;
      for (let k = 0; k < N; k++) {
        const i = order[k], x = i % L, y = (i - x) / L;
        parent[i] = i; size[i] = 1; flag[i] = (y === 0 ? 1 : 0) | (y === L - 1 ? 2 : 0);
        let r = i;
        if (x > 0) r = join(r, i - 1);
        if (x < L - 1) r = join(r, i + 1);
        if (y > 0) r = join(r, i - L);
        if (y < L - 1) r = join(r, i + L);
        if (size[r] > largest) largest = size[r];
        if (flag[r] === 3) { if (!spanAt) spanAt = k + 1; if (size[r] > spanMax) spanMax = size[r]; }
        const n = k + 1;
        if (n >= n0 && n <= n1) { span[t * w + n - n0] = spanMax; big[t * w + n - n0] = largest; }
        if (spanAt && n >= n1) break;
      }
      nSpan[t] = spanAt;
    }
    return { L, N, samples: o.samples, p: o.p, n0, n1, w, nSpan, span, big, blocks: o.blocks, seed: o.seed };
  }
  // Spanning probability R(p) on a grid of p, per block of samples: R[j][b] for p = ps[j]. A jackknife replicate is the
  // total less one block, so every replicate comes from the same arrays.
  function spanningGrid(perc, ps) {
    const B = perc.blocks;
    return ps.map(p => {
      const pmf = binomial(perc.N, p), cum = new Float64Array(perc.N + 2); // cum[n] = P(at least n occupied)
      for (let n = perc.N; n >= 0; n--) cum[n] = cum[n + 1] + pmf[n];
      const sums = new Float64Array(B);
      for (let t = 0; t < perc.samples; t++) sums[Math.floor(t * B / perc.samples)] += cum[perc.nSpan[t]];
      return sums;
    });
  }
  function gridValue(perc, sums, b) { // spanning probability from block sums, block b left out
    const tot = sums.reduce((x, y) => x + y, 0), [lo, hi] = block(perc.samples, b, perc.blocks);
    return b < 0 ? tot / perc.samples : (tot - sums[b]) / (perc.samples - (hi - lo));
  }
  // Where f (sampled on the grid ps) changes sign, by linear interpolation between grid points.
  function gridRoot(ps, f) {
    for (let j = 0; j + 1 < ps.length; j++) {
      const a = f(j), c = f(j + 1);
      if (a === 0) return ps[j];
      if (a * c < 0) return ps[j] + (ps[j + 1] - ps[j]) * a / (a - c);
    }
    return NaN;
  }
  // Mean mass of the largest spanning cluster, given that one spans, and of the largest cluster, at perc.p (canonical:
  // the window of occupied-site numbers weighted binomially), with block b of samples left out.
  function massSums(perc) {
    const P = binomial(perc.N, perc.p), w = perc.w, B = perc.blocks;
    const s = { ws: new Float64Array(B), wm: new Float64Array(B), wb: new Float64Array(B), cnt: new Float64Array(B) };
    for (let t = 0; t < perc.samples; t++) {
      const k = Math.floor(t * B / perc.samples);
      s.cnt[k]++;
      for (let j = 0; j < w; j++) {
        const pr = P[perc.n0 + j], ms = perc.span[t * w + j];
        if (ms > 0) { s.ws[k] += pr; s.wm[k] += pr * ms; }
        s.wb[k] += pr * perc.big[t * w + j];
      }
    }
    return s;
  }
  function masses(sums, b) {
    const tot = a => a.reduce((x, y) => x + y, 0) - (b < 0 ? 0 : a[b]);
    return { span: tot(sums.wm) / tot(sums.ws), big: tot(sums.wb) / tot(sums.cnt), spans: tot(sums.ws) / tot(sums.cnt) };
  }

  // ---------- the runs the study quotes: tests/critical.mjs checks them, critical/table.mjs prints them ----------
  // Seeds are fixed; each run's seed is the listed seed plus its index.
  const STUDY = {
    therm: 200, blocks: 40,
    ordered: { L: 64, temps: [2.0, 2.1, 2.2], sweeps: 3000, seed: 101 },
    critical: { T: 2.27, sizes: [[8, 8000], [16, 8000], [32, 8000], [64, 6000], [128, 3000]], dT: 0.003, seed: 201 },
    hot: { runs: [[2.4, 64, 6000], [2.5, 64, 4000], [2.75, 32, 4000], [3.0, 32, 4000], [4.0, 16, 8000]], seed: 301 },
    perc: { sizes: [[32, 4000], [64, 4000], [128, 2000], [256, 800]], seed: 401 },
    trap: { L: 16, sweeps: 40000, seed: 77 },
  };
  // Below T_c: |m| against Yang and e against Onsager.
  function studyOrdered() {
    const o = STUDY.ordered, B = STUDY.blocks;
    return o.temps.map((T, i) => {
      const r = simulate(o.L, T, { seed: o.seed + i, therm: STUDY.therm, sweeps: o.sweeps, blocks: B });
      const K = 1 / T; // xiBelow: exponential correlation length, half the high-temperature one at the dual coupling K*
      return { T, L: o.L, n: o.sweeps, M: jackknife(B, b => moments(r, T, b).abs), Mexact: yangM(T),
        e: jackknife(B, b => moments(r, T, b).e), eExact: energyExact(T), xiBelow: 1 / (4 * (K - dualK(K))) };
    });
  }
  // At the critical point: runs at T = 2.27, a round number 0.04% above T_c, reweighted to Onsager's T_c and nearby.
  function studyCritical() {
    const c = STUDY.critical, B = STUDY.blocks;
    const runs = c.sizes.map(([L, n], i) => simulate(L, c.T, { seed: c.seed + i, therm: STUDY.therm, sweeps: n, half: true, blocks: B }));
    const Ls = runs.map(r => r.L), at = [];
    runs.forEach((r, i) => { at[i] = []; for (let b = -1; b < B; b++) at[i][b + 1] = moments(r, TC, b); });
    const q = (name, b) => runs.map((r, i) => at[i][b + 1][name]);
    const per = name => runs.map((r, i) => jackknife(B, b => at[i][b + 1][name]));
    const dU = (r, b) => (moments(r, TC - c.dT, b).binder - moments(r, TC + c.dT, b).binder) / (2 * c.dT); // -dU/dT
    // Crossings are searched within +-0.6/L of 2.27 (L the smaller size), where reweighting stays within about one
    // standard deviation of the sampled energies.
    const crossings = runs.slice(1).map((r, i) => ({ L1: runs[i].L, L2: r.L,
      T: jackknife(B, b => binderCrossing(runs[i], r, c.T - 0.6 / runs[i].L, c.T + 0.6 / runs[i].L, b)) }));
    return { T0: c.T, Ls, n: runs.map(r => r.n), abs: per('abs'), chi: per('chi'), g: per('g'), binder: per('binder'),
      betaNu: jackknife(B, b => -logSlope(Ls, q('abs', b))),
      gammaNu: jackknife(B, b => logSlope(Ls, q('chi', b))),
      eta: jackknife(B, b => -logSlope(Ls, q('g', b))),
      invNu: jackknife(B, b => logSlope(Ls, runs.map(r => dU(r, b)))),
      binderMean: jackknife(B, b => avg(q('binder', b).slice(1))), // L = 16 and up
      crossings };
  }
  // Above T_c: the correlation length, and the energy, at five temperatures.
  function studyHot() {
    const h = STUDY.hot, B = STUDY.blocks;
    return h.runs.map(([T, L, n], i) => {
      const r = simulate(L, T, { seed: h.seed + i, therm: STUDY.therm, sweeps: n, proj: true, blocks: B });
      return { T, L, n, t: (T - TC) / TC, xi: correlationLength(r), exact: xiExact(T),
        e: jackknife(B, b => moments(r, T, b).e), eExact: energyExact(T) };
    });
  }
  // Percolation: spanning probabilities, their crossings, and the masses at p_c. Another seed gives an independent
  // repeat (critical/table.mjs scatter).
  function studyPercolation(seed) {
    const P = STUDY.perc, B = STUDY.blocks, ps = [], s0 = seed === undefined ? P.seed : seed;
    for (let p = 0.57; p <= 0.615 + 1e-9; p += 0.00025) ps.push(Math.round(p * 1e5) / 1e5);
    const runs = P.sizes.map(([L, S], i) => percolation(L, { seed: s0 + i, samples: S, blocks: B }));
    const grids = runs.map(r => spanningGrid(r, ps)), sums = runs.map(massSums);
    const R = (i, j, b) => gridValue(runs[i], grids[i][j], b);
    const cross = (i, k) => ({ L1: runs[i].L, L2: runs[k].L, p: jackknife(B, b => gridRoot(ps, j => R(k, j, b) - R(i, j, b))) });
    const Ls = runs.map(r => r.L), idx = L => Ls.indexOf(L);
    return { Ls, samples: runs.map(r => r.samples), ps,
      atPc: runs.map(r => { const g = spanningGrid(r, [PERC.pc])[0]; return jackknife(B, b => gridValue(r, g, b)); }),
      half: runs.map((r, i) => jackknife(B, b => gridRoot(ps, j => R(i, j, b) - 0.5))),
      adjacent: runs.slice(1).map((r, i) => cross(i, i + 1)),
      wide: [cross(idx(32), idx(128)), cross(idx(64), idx(256))],
      span: sums.map(s => jackknife(B, b => masses(s, b).span)),
      big: sums.map(s => jackknife(B, b => masses(s, b).big)),
      D: jackknife(B, b => logSlope(Ls.slice(1), sums.slice(1).map(s => masses(s, b).span))),
      Dall: jackknife(B, b => logSlope(Ls, sums.map(s => masses(s, b).span))),
      Dbig: jackknife(B, b => logSlope(Ls.slice(1), sums.slice(1).map(s => masses(s, b).big))) };
  }

  // The measurement trap: the Binder cumulant at T_c, L = 16, measured after a fixed number of cluster flips (as every
  // run above is), against measuring each time the flipped clusters add up to N spins (seed + 1).
  function studyTrap() {
    const o = STUDY.trap, B = STUDY.blocks, n = o.sweeps;
    const fixed = simulate(o.L, TC, { seed: o.seed, therm: STUDY.therm, sweeps: n, blocks: B });
    const sys = ising(o.L, TC, o.seed + 1), m = new Float64Array(n);
    for (let i = 0; i < STUDY.therm; i++) { let f = 0; while (f < sys.N) f += wolff(sys); }
    for (let t = 0; t < n; t++) { let f = 0; while (f < sys.N) f += wolff(sys); m[t] = sys.M / sys.N; }
    const until = { n, N: sys.N, T: TC, m, e: new Float64Array(n), g: null, blocks: B };
    const U = r => jackknife(B, b => moments(r, TC, b).binder);
    return { L: o.L, n, fixed: U(fixed), until: U(until) };
  }

  const api = { TC, KC, EXP, PERC, STUDY, rng, yangM, ellipticK, energyExact, dualK, xiExact, xiCaselle, ising, wolff,
    flips, energy, correlation, projected, simulate, jackknife, moments, bisect, binderCrossing, logSlope,
    xiFromProjected, correlationLength, binomial, percolation, spanningGrid, gridValue, gridRoot, massSums, masses,
    studyOrdered, studyCritical, studyHot, studyPercolation, studyTrap };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CRIT = api;
})(typeof window !== 'undefined' ? window : globalThis);
