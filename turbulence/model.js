/* Turbulence model: a pattern that repeats over many decades of scale, and the sizes where it stops. No dependencies.
 *
 * 1. Kolmogorov (1941): energy fed in at a large scale L cascades to smaller scales at a rate eps per unit mass,
 *    the same at every scale in between, until viscosity nu takes it at eta = (nu^3/eps)^(1/4). Between the two the
 *    velocity difference across a distance r depends only on eps and r, so the statistics repeat at every scale.
 * 2. The cascade itself, in the Sabra shell model (L'vov, Podivilov, Pomyalov, Procaccia & Vandembroucq, "Improved shell
 *    model of turbulence", Phys. Rev. E 58, 1811 (1998)): one complex velocity u_n per octave of wavenumber,
 *      du_n/dt = i (a k_{n+1} u_{n+2} u*_{n+1} + b k_n u_{n+1} u*_{n-1} - c k_{n-1} u_{n-1} u_{n-2}) - nu k_n^2 u_n + f_n
 *    on shells k_n = k0 lambda^n, n = 0..N-1, with u_{-2} = u_{-1} = u_N = u_{N+1} = 0.
 *    Invariants. Write T_m = u*_m u*_{m+1} u_{m+2} (one triad per m). The a-term of shell m, the b-term of shell m+1
 *    and the c-term of shell m+2 all carry T_m (the c-term as its conjugate) with the same k_{m+1}, so for any q
 *      d/dt sum q^n |u_n|^2 (nonlinear part) = -2 sum_m k_{m+1} q^m (a + b q + c q^2) Im T_m.
 *    So E = sum |u_n|^2 is conserved if a + b + c = 0, and then H = sum (a/c)^n |u_n|^2 is too. With a = 1,
 *    b = c = -1/2 and lambda = 2 (the 3D-like case), a/c = -2 and H = sum (-1)^n (k_n/k0) |u_n|^2, a helicity.
 *    Energy flux out of shells 0..n (energy normalised as E = sum |u_n|^2, not half of it):
 *      Pi_n = 2 [a k_{n+1} Im T_n - c k_n Im T_{n-1}]
 *    With the energy flux eps and the helicity flux delta both constant, Sigma_n = <Im T_{n-1}> obeys exactly
 *      2 (a - c) k_n Sigma_n = eps - delta (c/a)^n,   i.e. 3 k_n Sigma_n = eps - delta (-1/2)^n,
 *    the shell model's 4/5 law: a third-order correlator that scales exactly as 1/k_n. Forcing on shell 0 alone puts
 *    helicity in at delta = eps. The relation is derived here from the equation above; its form in the literature
 *    was not seen.
 *    Integrator: integrating-factor RK4 with the viscous factor exact. The exponentials are precomputed by an own
 *    + - * / routine, so the trajectory uses only IEEE + - * / and is the same bit for bit on any conforming engine.
 *    Model units: k0 = 1.
 * 3. Where real cascades stop, in SI units: the ion inertial length and gyroradius of the solar wind (a plasma too
 *    dilute for viscosity), and the sonic scale of molecular clouds, where the turbulent velocity falls to the sound
 *    speed.
 */
(function (root) {
  'use strict';
  const C = {
    c: 2.99792458e8, kB: 1.380649e-23, e: 1.602176634e-19, eps0: 8.8541878128e-12, mu0: 1.25663706212e-6,
    mp: 1.67262192369e-27, mH: 1.6735575e-27, pc: 3.0856775814913673e16, AU: 1.495978707e11,
  };

  // ---------- 1. Kolmogorov scales ----------
  // Kinematic viscosity, m^2/s: air at 20 C and 1 atm; seawater at 20 C and salinity 35 g/kg.
  const NU = { air: 1.51e-5, seawater: 1.05e-6 };
  // Dissipation scale, time and velocity for kinematic viscosity nu (m^2/s) and dissipation rate eps (W/kg = m^2/s^3).
  const kolmogorov = (nu, eps) => ({ eta: Math.pow(nu * nu * nu / eps, 0.25), tau: Math.sqrt(nu / eps), v: Math.pow(nu * eps, 0.25) });
  // Taylor-scale Reynolds number to the ratio of the large scale to eta, with Pope's conventions (Turbulent Flows,
  // 2000): L = k^(3/2)/eps, Re_L = k^(1/2) L/nu = (3/20) Re_lambda^2, L/eta = Re_L^(3/4).
  const outerOverEta = reLambda => Math.pow(0.15 * reLambda * reLambda, 0.75);

  // ---------- 2. Sabra shell model ----------
  function mulberry32(seed) { // small seeded generator so runs are repeatable
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  // A random point on the unit circle from + - * / only: (1 - t^2, 2t)/(1 + t^2), t in [-1, 1), then a random half-plane.
  function unitPhase(rng) {
    const t = 2 * rng() - 1, d = 1 + t * t, s = rng() < 0.5 ? -1 : 1;
    return [s * (1 - t * t) / d, s * 2 * t / d];
  }
  // exp(x) from + - * / only (scaling and squaring of a Taylor series); good to ~1e-13 relative.
  function expDet(x) {
    if (x > 0) return 1 / expDet(-x);
    if (x < -745) return 0;
    let m = 0; while (x < -0.25) { x /= 2; m++; }
    let s = 1, t = 1; for (let j = 1; j <= 18; j++) { t = t * x / j; s += t; }
    for (let j = 0; j < m; j++) s *= s;
    return s;
  }

  const SABRA = { a: 1, b: -0.5, c: -0.5, lambda: 2, k0: 1 };
  const FORCE = [{ n: 0, re: 0.005, im: 0.005 }]; // constant force on shell 0
  // Runs. CI: about 2.5 s, about 860 large-eddy times sampled (L/U = 5.6). TABLE: about 45 s. SCAN: the viscosity scan.
  const RUNS = {
    CI: { N: 18, nu: 1e-6, dt: 2e-3, transient: 200, blockTime: 300, nBlocks: 16, every: 10, seed: 1, fit: [3, 8] },
    TABLE: { N: 21, nu: 1e-7, dt: 5e-4, transient: 500, blockTime: 1000, nBlocks: 20, every: 10, seed: 1, fit: [3, 11] },
    SCAN: [
      { N: 16, nu: 1e-5, dt: 4e-3, transient: 300, blockTime: 300, nBlocks: 8, every: 5, seed: 1, fit: [3, 6] },
      { N: 18, nu: 1e-6, dt: 2e-3, transient: 300, blockTime: 300, nBlocks: 8, every: 5, seed: 1, fit: [3, 8] },
      { N: 21, nu: 1e-7, dt: 5e-4, transient: 300, blockTime: 300, nBlocks: 8, every: 10, seed: 1, fit: [3, 11] },
      { N: 23, nu: 1e-8, dt: 1.6e-4, transient: 300, blockTime: 150, nBlocks: 8, every: 20, seed: 1, fit: [3, 13] },
    ],
  };
  const k41 = p => p / 3;
  // She & Leveque, Phys. Rev. Lett. 72, 336 (1994), for Navier-Stokes turbulence.
  const sheLeveque = p => p / 9 + 2 * (1 - Math.pow(2 / 3, p / 3));

  function create({ N = 22, nu = 1e-7, a = SABRA.a, b = SABRA.b, c = SABRA.c, lambda = SABRA.lambda, k0 = SABRA.k0, force = FORCE } = {}) {
    const L = N + 4, k = new Float64Array(L); // index j = n + 2; ghosts j = 0, 1, N + 2, N + 3
    let kn = k0 / (lambda * lambda);
    for (let j = 0; j < L; j++) { k[j] = kn; kn *= lambda; }
    const A = new Float64Array(L), B = new Float64Array(L), Cc = new Float64Array(L), fr = new Float64Array(L), fi = new Float64Array(L);
    for (let j = 2; j < N + 2; j++) { A[j] = a * k[j + 1]; B[j] = b * k[j]; Cc[j] = -c * k[j - 1]; }
    for (const f of force) { fr[f.n + 2] = f.re; fi[f.n + 2] = f.im; }
    const arr = () => new Float64Array(L);
    return {
      N, nu, a, b, c, lambda, k0, force, k, A, B, Cc, fr, fi,
      ur: arr(), ui: arr(), k1r: arr(), k1i: arr(), k2r: arr(), k2i: arr(), k3r: arr(), k3i: arr(), k4r: arr(), k4i: arr(),
      vr: arr(), vi: arr(), E1: arr(), E2: arr(), dt: 0, t: 0,
    };
  }
  // Initial state: |u_n| = amp for n < 2, then x0.8 per shell (about K41's 2^(-1/3)) up to nCut, then x0.25 per shell,
  // with seeded random phases.
  function init(m, { seed = 1, amp = 0.05, nCut = 8 } = {}) {
    const rng = mulberry32(seed);
    let r = amp;
    for (let n = 0; n < m.N; n++) {
      const [x, y] = unitPhase(rng);
      m.ur[n + 2] = r * x; m.ui[n + 2] = r * y;
      if (n >= 1) r *= n < nCut ? 0.8 : 0.25;
    }
    m.t = 0;
  }
  function setDt(m, dt) {
    m.dt = dt;
    for (let j = 0; j < m.N + 4; j++) { const g = -m.nu * m.k[j] * m.k[j] * dt; m.E1[j] = expDet(g); m.E2[j] = expDet(g / 2); }
  }
  // Nonlinear term plus forcing: out = i (...) + f.
  function rhs(m, ur, ui, outr, outi) {
    const A = m.A, B = m.B, Cc = m.Cc, fr = m.fr, fi = m.fi, top = m.N + 2;
    for (let j = 2; j < top; j++) {
      const r2 = ur[j + 2], i2 = ui[j + 2], r1 = ur[j + 1], i1 = ui[j + 1], rm = ur[j - 1], im = ui[j - 1], rmm = ur[j - 2], imm = ui[j - 2];
      const x = A[j] * (r2 * r1 + i2 * i1) + B[j] * (r1 * rm + i1 * im) + Cc[j] * (rm * rmm - im * imm);
      const y = A[j] * (i2 * r1 - r2 * i1) + B[j] * (i1 * rm - r1 * im) + Cc[j] * (rm * imm + im * rmm);
      outr[j] = fr[j] - y; outi[j] = fi[j] + x;
    }
  }
  // nSteps of integrating-factor RK4 (Lawson type).
  function advance(m, nSteps) {
    const { ur, ui, k1r, k1i, k2r, k2i, k3r, k3i, k4r, k4i, vr, vi, E1, E2 } = m, h = m.dt, h2 = h / 2, h6 = h / 6, top = m.N + 2;
    for (let s = 0; s < nSteps; s++) {
      rhs(m, ur, ui, k1r, k1i);
      for (let j = 2; j < top; j++) { vr[j] = E2[j] * (ur[j] + h2 * k1r[j]); vi[j] = E2[j] * (ui[j] + h2 * k1i[j]); }
      rhs(m, vr, vi, k2r, k2i);
      for (let j = 2; j < top; j++) { vr[j] = E2[j] * ur[j] + h2 * k2r[j]; vi[j] = E2[j] * ui[j] + h2 * k2i[j]; }
      rhs(m, vr, vi, k3r, k3i);
      for (let j = 2; j < top; j++) { vr[j] = E1[j] * ur[j] + h * E2[j] * k3r[j]; vi[j] = E1[j] * ui[j] + h * E2[j] * k3i[j]; }
      rhs(m, vr, vi, k4r, k4i);
      for (let j = 2; j < top; j++) {
        ur[j] = E1[j] * ur[j] + h6 * (E1[j] * k1r[j] + 2 * E2[j] * (k2r[j] + k3r[j]) + k4r[j]);
        ui[j] = E1[j] * ui[j] + h6 * (E1[j] * k1i[j] + 2 * E2[j] * (k2i[j] + k3i[j]) + k4i[j]);
      }
    }
    m.t += nSteps * h;
  }
  // Im T_m for the triad starting at shell m (index j = m + 2): Im(u*_m u*_{m+1} u_{m+2}).
  function imT(ur, ui, j) {
    const pr = ur[j] * ur[j + 1] - ui[j] * ui[j + 1], pi = ur[j] * ui[j + 1] + ui[j] * ur[j + 1];
    return pr * ui[j + 2] - pi * ur[j + 2];
  }
  // E = sum |u|^2 and sum q^n |u|^2 for each q in qs.
  function invariants(m, qs = [m.a / m.c]) {
    let E = 0; const H = qs.map(() => 0), w = qs.map(() => 1);
    for (let n = 0; n < m.N; n++) {
      const e = m.ur[n + 2] * m.ur[n + 2] + m.ui[n + 2] * m.ui[n + 2]; E += e;
      for (let i = 0; i < qs.length; i++) { H[i] += w[i] * e; w[i] *= qs[i]; }
    }
    return { E, H };
  }

  const PMAX = 8;
  // Statistics in nBlocks consecutive time blocks (batch means). Per block and shell: <|u_n|^p> and
  // <|Pi_n/k_n|^(p/3)>, p = 1..8; <Pi_n>; <Im T_{n-1}>. Per block: injection 2 Re<f u*>, dissipation 2 nu sum k^2 |u|^2.
  function newStats(N, nBlocks) {
    return { N, nBlocks, cnt: new Float64Array(nBlocks), S: new Float64Array(nBlocks * PMAX * N), F: new Float64Array(nBlocks * PMAX * N),
      Pi: new Float64Array(nBlocks * N), Sig: new Float64Array(nBlocks * N), inj: new Float64Array(nBlocks), dis: new Float64Array(nBlocks),
      E: new Float64Array(nBlocks), maxRate: 0 };
  }
  function sample(m, st, blk) {
    const N = m.N, ur = m.ur, ui = m.ui, k = m.k, o = blk * PMAX * N, op = blk * N;
    let inj = 0, dis = 0, E = 0, rate = 0;
    for (let n = 0; n < N; n++) {
      const j = n + 2, e = ur[j] * ur[j] + ui[j] * ui[j], r = Math.sqrt(e);
      let pw = r; for (let p = 0; p < PMAX; p++) { st.S[o + p * N + n] += pw; pw *= r; }
      const tn = imT(ur, ui, j), tm = imT(ur, ui, j - 1), P = 2 * (m.a * k[j + 1] * tn - m.c * k[j] * tm);
      st.Pi[op + n] += P; st.Sig[op + n] += tm;
      const g = Math.cbrt(Math.abs(P) / k[j]); let pf = g; for (let p = 0; p < PMAX; p++) { st.F[o + p * N + n] += pf; pf *= g; }
      inj += 2 * (m.fr[j] * ur[j] + m.fi[j] * ui[j]); dis += 2 * m.nu * k[j] * k[j] * e; E += e;
      if (k[j] * r > rate) rate = k[j] * r;
    }
    st.inj[blk] += inj; st.dis[blk] += dis; st.E[blk] += E; st.cnt[blk]++;
    if (rate > st.maxRate) st.maxRate = rate;
  }
  // A full run: transient, then nBlocks blocks of blockTime, sampled every `every` steps.
  function simulate({ N, nu, dt, seed = 1, transient, blockTime, nBlocks, every = 10, fit, force, a, b, c, amp, nCut } = {}) {
    const m = create({ N, nu, force, a, b, c });
    init(m, { seed, amp, nCut });
    setDt(m, dt);
    const tSteps = Math.round(transient / dt);
    advance(m, tSteps);
    const st = newStats(N, nBlocks), chunks = Math.max(1, Math.round(blockTime / dt / every));
    for (let blk = 0; blk < nBlocks; blk++) for (let i = 0; i < chunks; i++) { advance(m, every); sample(m, st, blk); }
    return { config: { N, nu, dt, seed, transient, blockTime: chunks * every * dt, nBlocks, every }, fit, model: m, stats: st,
      steps: tSteps + nBlocks * chunks * every, finite: m.ur.every(Number.isFinite) };
  }

  function linfit(x, y) { // least squares y = icept + slope x
    const n = x.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let i = 0; i < n; i++) { sx += x[i]; sy += y[i]; sxx += x[i] * x[i]; sxy += x[i] * y[i]; }
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return { slope, icept: (sy - slope * sx) / n };
  }
  const mean = v => v.reduce((s, x) => s + x, 0) / v.length;
  const sd = v => { const mu = mean(v); return Math.sqrt(v.reduce((s, x) => s + (x - mu) * (x - mu), 0) / (v.length - 1)); };

  // Averages over all blocks, or over a subset of block indices.
  function averages(res, blocks) {
    const st = res.stats, N = st.N, bl = blocks || [...Array(st.nBlocks).keys()];
    let cnt = 0; for (const b of bl) cnt += st.cnt[b];
    const S = [...Array(PMAX)].map(() => new Float64Array(N)), F = [...Array(PMAX)].map(() => new Float64Array(N)), Pi = new Float64Array(N), Sig = new Float64Array(N);
    let inj = 0, dis = 0, E = 0;
    for (const b of bl) {
      for (let p = 0; p < PMAX; p++) for (let n = 0; n < N; n++) { S[p][n] += st.S[(b * PMAX + p) * N + n]; F[p][n] += st.F[(b * PMAX + p) * N + n]; }
      for (let n = 0; n < N; n++) { Pi[n] += st.Pi[b * N + n]; Sig[n] += st.Sig[b * N + n]; }
      inj += st.inj[b]; dis += st.dis[b]; E += st.E[b];
    }
    for (let p = 0; p < PMAX; p++) for (let n = 0; n < N; n++) { S[p][n] /= cnt; F[p][n] /= cnt; }
    for (let n = 0; n < N; n++) { Pi[n] /= cnt; Sig[n] /= cnt; }
    return { S, F, Pi, Sig, inj: inj / cnt, dis: dis / cnt, E: E / cnt };
  }
  // Where the cascade stops: the shell (interpolated in n) where <Pi_n> first falls to frac * eps.
  function fluxCut(av, eps, frac = 0.5) {
    for (let n = 1; n < av.Pi.length - 1; n++) if (av.Pi[n] >= frac * eps && av.Pi[n + 1] < frac * eps) return n + (av.Pi[n] - frac * eps) / (av.Pi[n] - av.Pi[n + 1]);
    return NaN;
  }
  // The shell where <|u_n|^2> falls to frac of its inertial power law fitted on [n1, n2].
  function spectralCut(av, n1, n2, frac = 0.5) {
    const xs = [], ys = []; for (let n = n1; n <= n2; n++) { xs.push(n); ys.push(Math.log2(av.S[1][n])); }
    const f = linfit(xs, ys), d = n => Math.log2(av.S[1][n]) - (f.icept + f.slope * n), lv = Math.log2(frac);
    for (let n = n2; n < av.S[1].length - 1; n++) if (d(n) >= lv && d(n + 1) < lv) return n + (d(n) - lv) / (d(n) - d(n + 1));
    return NaN;
  }
  // Scaling exponents over shells [n1, n2] (log2 k_n = n, so slopes against n are exponents in k):
  //   u:    zeta_p = -slope of log2 <|u_n|^p>, the plain structure functions;
  //   F:    -slope of log2 F_p(n), F_p = <|Pi_n/k_n|^(p/3)>, the flux-based structure functions;
  //   essF: extended self-similarity, the slope of log F_p against log F_3 (zeta_3 = 1 by construction).
  const KEYS = ['u', 'F', 'essF'];
  function exponents(av, n1, n2) {
    const ns = [], f3 = []; for (let n = n1; n <= n2; n++) { ns.push(n); f3.push(Math.log2(av.F[2][n])); }
    const out = { u: [], F: [], essF: [] };
    for (let p = 0; p < PMAX; p++) {
      const y = ns.map(n => Math.log2(av.S[p][n])), yF = ns.map(n => Math.log2(av.F[p][n]));
      out.u.push(-linfit(ns, y).slope); out.F.push(-linfit(ns, yF).slope); out.essF.push(linfit(f3, yF).slope);
    }
    return out;
  }
  // Analysis with error bars: batch means over blocks, and the spread over fit ranges [n1 + d1, n2 + d2], d1, d2 in {-1, 0, 1}.
  function analyse(res, [n1, n2] = res.fit || [3, 8]) {
    const m = res.model, all = averages(res), eps = all.inj, nb = res.stats.nBlocks;
    const z = exponents(all, n1, n2);
    const perBlock = [...Array(nb).keys()].map(b => exponents(averages(res, [b]), n1, n2));
    const be = key => [...Array(PMAX).keys()].map(p => sd(perBlock.map(e => e[key][p])) / Math.sqrt(nb));
    const ranges = []; for (const d1 of [-1, 0, 1]) for (const d2 of [-1, 0, 1]) if (n2 + d2 - (n1 + d1) >= 3) ranges.push([n1 + d1, n2 + d2]);
    const rs = ranges.map(([a, b]) => exponents(all, a, b));
    const spread = key => [...Array(PMAX).keys()].map(p => { const v = rs.map(e => e[key][p]); return (Math.max(...v) - Math.min(...v)) / 2; });
    const injBlocks = [...Array(nb).keys()].map(b => res.stats.inj[b] / res.stats.cnt[b]);
    const ndBlocks = [...Array(nb).keys()].map(b => fluxCut(averages(res, [b]), injBlocks[b]));
    const nu = m.nu, kEta = Math.pow(eps / (nu * nu * nu), 0.25), U = Math.sqrt(all.E), L = 1 / m.k0;
    const plateau = mean([1, 2, 3, 4, 5].map(n => all.Pi[n]));
    return {
      eps, epsErr: sd(injBlocks) / Math.sqrt(nb), dis: all.dis, E: all.E, U, L, Re: U * L / nu, kEta, nEta: Math.log2(kEta / m.k0), plateau,
      nd: fluxCut(all, eps), ndErr: sd(ndBlocks) / Math.sqrt(nb), ndSpec: spectralCut(all, n1, n2), n1, n2, av: all, zeta: z,
      err: Object.fromEntries(KEYS.map(key => [key, be(key)])), spread: Object.fromEntries(KEYS.map(key => [key, spread(key)])),
    };
  }
  // Inviscid, unforced: largest relative change of E and of each sum q^n |u|^2 over time T, checked every `every` steps,
  // each normalised by sum |q|^n |u_n|^2 at t = 0 (H itself can be near 0). Stops once E has changed by more than stopAt.
  function conservation({ N = 10, a = 1, b = -0.5, c = -0.5, dt = 1e-3, T = 10, seed = 7, amp = 0.05, qs, every = 100, stopAt = 1 } = {}) {
    const m = create({ N, nu: 0, a, b, c, force: [] });
    init(m, { seed, amp, nCut: N });
    setDt(m, dt);
    const q = qs || [a / c], i0 = invariants(m, q), norm = invariants(m, q.map(Math.abs)).H;
    let dE = 0, tStop = null; const dH = q.map(() => 0);
    for (let i = 0, nChunks = Math.round(T / dt / every); i < nChunks; i++) {
      advance(m, every);
      const iv = invariants(m, q), e = (iv.E - i0.E) / i0.E;
      if (!(Math.abs(e) <= Math.abs(dE))) dE = e;
      iv.H.forEach((h, j) => { const d = (h - i0.H[j]) / norm[j]; if (!(Math.abs(d) <= Math.abs(dH[j]))) dH[j] = d; });
      if (!(Math.abs(e) <= stopAt)) { tStop = m.t; break; }
    }
    return { dE, dH, tStop };
  }

  // ---------- 3. Plasma scales (solar wind) ----------
  // A typical solar wind at 1 AU: density, speed, field, proton temperature (slow-wind protons are cooler, a few 1e4 K).
  const WIND = { n: 5e6, V: 4e5, B: 5e-9, T: 1e5 };
  const OMEGA_SUN = 2 * Math.PI / (25.38 * 86400); // sidereal rotation of the solar equator, rad/s
  const inertialLength = n => C.c / Math.sqrt(n * C.e * C.e / (C.eps0 * C.mp)); // c / omega_pi, m
  // Proton gyroradius v_th / Omega_p; thermal speed sqrt(kT/m) (convention 1) or sqrt(2kT/m) (convention 2).
  const gyroradius = (T, B, conv = 1) => Math.sqrt(conv * C.kB * T / C.mp) / (C.e * B / C.mp);
  const betaP = ({ n, T, B }) => 2 * C.mu0 * n * C.kB * T / (B * B);
  // A structure of size ell swept past a spacecraft at speed V. Fluctuations elongated along the field (k_perp >> k_par)
  // are seen at V sin(theta_BV) / (2 pi ell), theta_BV the angle between the field and the flow.
  const taylorFrequency = (V, ell, theta = Math.PI / 2) => V * Math.sin(theta) / (2 * Math.PI * ell);
  // The Parker spiral: the field winds up at tan(psi) = Omega_sun r / V.
  const parkerAngle = (V, r = C.AU) => Math.atan(OMEGA_SUN * r / V);
  // Proton collision time (Braginskii, Rev. Plasma Phys. 1, 205 (1965), in SI) and mean free path sqrt(2kT/m) tau.
  function protonCollisions({ n, T }, lnLambda = 25) {
    const tau = 3 * Math.sqrt(C.mp) * Math.pow(C.kB * T, 1.5) * Math.pow(4 * Math.PI * C.eps0, 2) / (4 * Math.sqrt(Math.PI) * n * Math.pow(C.e, 4) * lnLambda);
    return { tau, mfp: Math.sqrt(2 * C.kB * T / C.mp) * tau };
  }

  // ---------- 4. Molecular clouds ----------
  const soundSpeed = (T, mu = 2.33) => Math.sqrt(C.kB * T / (mu * C.mH)); // isothermal, m/s
  // Linewidth-size relations, sigma = coef (size/pc)^exp km/s. Larson: sigma is the 3D dispersion from observed line
  // widths, so it includes the tracer molecule's own thermal width (taken as CO's, mass 28), and L is the maximum
  // projected size. Solomon et al.: sigma is the 1D dispersion of 12CO lines and R = 1.91 S the effective radius
  // (the fit in the size parameter S is 1.0 S^0.5); CO's thermal width is left in, as it is small.
  const LARSON81 = { coef: 1.10, exp: 0.38, dims: 3, tracerMu: 28, size: 'maximum projected size' };
  const SOLOMON87 = { coef: 0.72, exp: 0.5, dims: 1, size: 'effective radius' };
  // The size (pc, in the relation's own convention) where the 1D non-thermal dispersion equals the sound speed: the
  // observed 1D dispersion is then sqrt(c_s^2 + kT/m_tracer) when the tracer's thermal width is included.
  const sonicScale = (rel, T = 10) => {
    const th = rel.tracerMu ? C.kB * T / (rel.tracerMu * C.mH) : 0, s1 = Math.sqrt(soundSpeed(T) ** 2 + th) / 1e3;
    return Math.pow(Math.sqrt(rel.dims) * s1 / rel.coef, 1 / rel.exp);
  };
  // The non-thermal Mach number of a relation at a given size (pc): the 1D non-thermal dispersion over c_s.
  const machAt = (rel, size, T = 10) => {
    const th = rel.tracerMu ? C.kB * T / (rel.tracerMu * C.mH) : 0, s1 = rel.coef * Math.pow(size, rel.exp) * 1e3 / Math.sqrt(rel.dims);
    return Math.sqrt(s1 * s1 - th) / soundSpeed(T);
  };

  const api = {
    C, NU, kolmogorov, outerOverEta,
    SABRA, FORCE, RUNS, PMAX, KEYS, k41, sheLeveque, mulberry32, unitPhase, expDet, create, init, setDt, rhs, advance, imT, invariants,
    newStats, sample, simulate, linfit, mean, sd, averages, fluxCut, spectralCut, exponents, analyse, conservation,
    WIND, inertialLength, gyroradius, betaP, taylorFrequency, parkerAngle, protonCollisions,
    soundSpeed, LARSON81, SOLOMON87, sonicScale, machAt,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TURB = api;
})(typeof window !== 'undefined' ? window : globalThis);
