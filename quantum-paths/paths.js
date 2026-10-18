/* Quantum paths model: how rough is a path, at what scale, and who draws it. No dependencies.
 *
 * Abbott & Wise (1981): record a free particle's position again and again, each time to within dx, and join the
 * dots. The joined path's mean length <l> grows as dx shrinks, and D = 1 - dln<l>/dln dx is its length-scaling
 * (divider) dimension; for a path in three dimensions it is the Hausdorff dimension of the trace. Each record leaves
 * a momentum spread hbar/(2 dx), and with records far enough apart for the wave to outgrow its start,
 *   <l> = (T/m) E|p + dp|,  dp ~ Normal(0, (hbar/2dx)^2) in each direction            (far field, dt >> m dx^2/hbar)
 * D = 2 when dx << hbar/p (the spread wins) and D = 1 when dx >> hbar/p (the drift wins).
 * Relativity caps the speed at c, so below hbar/mc the length stops growing and D falls back to 1.
 * A real Brownian particle is the reverse: smooth (ballistic) below v_th tau_p, rough above it.
 *
 * Witness Map link: a surroundings records an object about once per wave clock of the gap dx* where W = 1. Weak
 * records (each carrying a little information) add up to a resolution of about dx*; a full record pins the object to
 * about hbar/q, q the momentum the record carries. The path is drawn rough only where that resolution is below hbar/p.
 * All SI units.
 */
(function (root) {
  'use strict';
  const C = {
    h: 6.62607015e-34, hbar: 1.054571817e-34, c: 2.99792458e8, kB: 1.380649e-23, e: 1.602176634e-19,
    u: 1.66053906660e-27, me: 9.1093837015e-31, mn: 1.67492749804e-27,
  };

  function erf(x) { // series below 3, continued fraction for erfc above; good to ~1e-15
    const s = Math.sign(x); x = Math.abs(x);
    if (x < 3) { let sum = x, term = x; for (let n = 1; n < 200; n++) { term *= -x * x / n; sum += term / (2 * n + 1); if (Math.abs(term) < 1e-17) break; } return s * 2 / Math.sqrt(Math.PI) * sum; }
    let f = 0; for (let n = 60; n >= 1; n--) f = n / 2 / (x + f);
    return s * (1 - Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + f));
  }
  // E|X| for X ~ Normal(mean of length mu, variance s^2 in each of dim = 1 or 3 directions).
  function meanNorm(mu, s, dim) {
    if (dim !== 1 && dim !== 3) throw new Error('meanNorm: dim must be 1 or 3');
    const a = Math.abs(mu) / s;
    if (dim === 1) return s * (Math.sqrt(2 / Math.PI) * Math.exp(-a * a / 2) + a * erf(a / Math.SQRT2));
    if (a < 1e-6) return 2 * s * Math.sqrt(2 / Math.PI);
    return s * (Math.sqrt(2 / Math.PI) * Math.exp(-a * a / 2) + (a + 1 / a) * erf(a / Math.SQRT2));
  }

  // Mean length of the recorded path over time T, records far apart (the default), or one record every `clocks`
  // wave clocks (dt = clocks m dx^2 / hbar), the wave starting dx wide and ending dx sqrt(1 + clocks^2/4) wide. The
  // second form leaves out each record's own error; adding it moves the crossover at clocks = 1 from 1.8 to 2.4 hbar/p.
  function awLength(dx, { m, p, T, dim = 3, clocks = Infinity }) {
    if (!isFinite(clocks)) return T / m * meanNorm(p, C.hbar / (2 * dx), dim);
    const dt = clocks * m * dx * dx / C.hbar;
    return T / dt * meanNorm(p * dt / m, dx * Math.sqrt(1 + clocks * clocks / 4), dim);
  }
  // The far-field length in one direction with relativistic speed v(q) = q c^2 / sqrt(q^2 c^2 + m^2 c^4).
  function awLengthRelativistic(dx, { m, p, T }) {
    const s = C.hbar / (2 * dx), n = 4000, a = p - 10 * s, w = 20 * s / n, mc = m * C.c;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const q = a + i * w, z = (q - p) / s;
      sum += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * Math.abs(q) / Math.hypot(q, mc) * Math.exp(-z * z / 2);
    }
    return T * C.c * sum * w / 3 / (s * Math.sqrt(2 * Math.PI));
  }
  // Local dimension D = 1 - dln L / dln dx of a length function L(dx).
  function localDimension(L, dx) {
    const e = 1e-4;
    return 1 - (Math.log(L(dx * (1 + e))) - Math.log(L(dx * (1 - e)))) / (Math.log(1 + e) - Math.log(1 - e));
  }
  // Same, from a structure function S(tau) = <(x(t+tau) - x(t))^2>: sampled every tau, a path of steps sqrt(S)
  // has length ~ T sqrt(S)/tau, so D = 2 / (dln S / dln tau). Ballistic S ~ tau^2 gives 1, diffusive S ~ tau gives 2.
  // Only meaningful for log-slopes between 1 and 2 (a steady process); NaN outside.
  function dimensionFromS(S, tau) {
    const e = 1e-4, a = (Math.log(S(tau * (1 + e))) - Math.log(S(tau * (1 - e)))) / (Math.log(1 + e) - Math.log(1 - e));
    return a < 1 - 1e-6 || a > 2 + 1e-6 ? NaN : 2 / a;
  }

  // Classical Brownian particle (Ornstein-Uhlenbeck velocity, 1D rms speed sigmaV, momentum relaxation time taup)
  // with a steady drift vDrift: smooth below ~sigmaV taup, rough above, smooth again above ~2 sigmaV^2 taup / vDrift.
  const brownianS = (tau, { sigmaV, taup, vDrift = 0 }) =>
    2 * sigmaV * sigmaV * taup * taup * (tau / taup - 1 + Math.exp(-tau / taup)) + Math.pow(vDrift * tau, 2);
  // Drag on a sphere of radius r: Stokes with the Cunningham slip correction (gas mean free path mfp, viscosity eta).
  function stokesCunningham({ r, eta, mfp }) {
    const Kn = mfp / r, Cc = 1 + Kn * (1.257 + 0.4 * Math.exp(-1.1 / Kn));
    return 6 * Math.PI * eta * r / Cc; // force per unit speed
  }
  // Drag on a sphere much smaller than the mean free path, specular reflection (Epstein 1924): (4 pi/3) a^2 n m_g vbar.
  // Diffuse reflection with full accommodation multiplies it by 1 + pi/8 (conducting sphere) or 1 + 9 pi/64 (insulating).
  const epsteinDrag = ({ a, n, mg, T }) => (4 * Math.PI / 3) * a * a * n * mg * Math.sqrt(8 * C.kB * T / (Math.PI * mg));
  // Long-wavelength localisation rate of a sphere in a gas, Gamma = Lambda dx^2 (Schlosshauer 2019, eqs. 67-68).
  const gasLambda = ({ a, n, mg, T }) => 8 * n * Math.sqrt(2 * Math.PI * mg) * a * a * Math.pow(C.kB * T, 1.5) / (3 * C.hbar * C.hbar);

  // Continuous position measurement with localisation rate Gamma = k dx^2 (Jacobs & Steck 2006 convention).
  // Steady conditioned Gaussian: Vx = sqrt(hbar/8km), Vp = hbar sqrt(2kmhbar), Cxp = hbar/2 (a pure state), so the
  // best estimate of the position is uncertain by about 0.6 dx*, where dx* = (hbar/km)^(1/4) is the gap with W = 1.
  function monitored(k, m) {
    const Vx = Math.sqrt(C.hbar / (8 * k * m)), Vp = C.hbar * Math.sqrt(2 * k * m * C.hbar), Cxp = C.hbar / 2;
    return { Vx, Vp, Cxp, sigma: Math.sqrt(Vx), dxStar: Math.pow(C.hbar / (k * m), 0.25), tStar: Math.sqrt(m / (k * C.hbar)) };
  }

  // Exact repeated Gaussian position measurements (resolution dx, one every `clocks` wave clocks) on a free 1D
  // particle, keeping the momentum each record leaves behind. Returns the recorded length and the time it took.
  function sequential({ m, dx, clocks, N, p = 0, rng }) {
    const dt = clocks * m * dx * dx / C.hbar, s2 = dx * dx, H2 = C.hbar * C.hbar / 4;
    let x = 0, q = p, Vx = s2, Vp = H2 / s2, Cxp = 0, prev = 0, L = 0;
    const gauss = () => { let u = 0; while (u === 0) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng()); };
    for (let i = 0; i < N; i++) {
      x += q * dt / m; Vx += 2 * Cxp * dt / m + Vp * dt * dt / (m * m); Cxp += Vp * dt / m;
      const den = Vx + s2, r = x + Math.sqrt(den) * gauss(), d = r - x;
      x += Vx / den * d; q += Cxp / den * d; Vx = Vx * s2 / den; Cxp = Cxp * s2 / den; Vp = (H2 + Cxp * Cxp) / Vx;
      L += Math.abs(r - prev); prev = r;
    }
    return { L, T: N * dt };
  }
  // For a particle starting at rest with records far apart, the k-th step carries the summed kicks of k records,
  // so the recorded length is (1/N) sum_k sqrt(k) ~ (2/3) sqrt(N) times the single-interval formula.
  const heatingFactor = N => { let s = 0; for (let k = 1; k <= N; k++) s += Math.sqrt(k); return s / N; };
  function mulberry32(seed) { // small seeded generator so checks are repeatable
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  const deBroglie = (m, v) => C.h / (m * v);

  // Momentum carried by one record from the named witness: 2.70 kT/c for thermal photons, h/lambda for starlight,
  // and mu v_rel for gas or a particle beam, with mu the reduced mass, so an object lighter than the molecules
  // that hit it gets about its own momentum, whatever theirs.
  function witnessMomentum(o, env, label, T) {
    const photon = Tp => 2.701 * C.kB * Tp / C.c;
    if (label === 'Its own heat glow') return photon(o.selfHeat ? o.T : env.Tamb);
    if (label === 'Its own starlight') return C.h / o.glowLambda;
    const pop = env.pops.find(x => x.label === label);
    if (!pop) return NaN;
    if (pop.type === 'photon') return photon(pop.T);
    const mu = o.m * pop.m / (o.m + pop.m);
    return mu * Math.sqrt(3 * C.kB * T / o.m + (pop.type === 'gas' ? 3 * C.kB * pop.T / pop.m : pop.v * pop.v));
  }
  // Witness Map bridge: how finely an object's own surroundings record it, against its thermal hbar/p, with
  // p = sqrt(m kB T) per direction and T its translational temperature (by default its surroundings'). dx* is the
  // gap where W = 1; the dominant witness there carries q per record; the resolution is min(dx*, hbar/q).
  // WM is the witness-map model (require('../witness-map/model.js') or window.WM).
  function drawnPath(WM, o, env, T = env.Tamb) {
    const W = dx => WM.rates(o, env, dx, null).W;
    let lo = 1e-50, hi = 1e30;
    if (!(W(hi) >= 1) || W(lo) >= 1) return null;
    for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (W(mid) < 1) lo = mid; else hi = mid; }
    const top = WM.rates(o, env, hi, null).parts.slice().sort((a, b) => b.rate - a.rate)[0];
    const q = witnessMomentum(o, env, top.label, T), lambdaBar = C.hbar / Math.sqrt(o.m * C.kB * T);
    const resolution = Math.min(hi, C.hbar / q);
    return { dxStar: hi, witness: top.label, q, regime: C.hbar / q < hi ? 'full records' : 'weak records', resolution, T, lambdaBar, ratio: resolution / lambdaBar };
  }

  const api = {
    C, erf, meanNorm, awLength, awLengthRelativistic, localDimension, dimensionFromS, brownianS, stokesCunningham,
    epsteinDrag, gasLambda, monitored, sequential, heatingFactor, mulberry32, deBroglie, witnessMomentum, drawnPath,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.QP = api;
})(typeof window !== 'undefined' ? window : globalThis);
