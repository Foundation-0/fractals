/* Cosmic homogeneity model: the scale where the clustering of matter and galaxies stops looking fractal. No dependencies.
 *
 * Count the galaxies within a distance r of a galaxy and divide by the count for an even spread: N(<r) = 1 + xibar(r),
 * where xibar is the correlation function averaged over the sphere. A fractal of dimension D gives counts growing as
 * r^D; an even spread, as r^3. The correlation dimension is
 *   D2(r) = 3 + dln N / dln r = 3 + 3 (xi - xibar) / (1 + xibar)      (using dxibar/dln r = 3 (xi - xibar)).
 * The homogeneity scale R_H is where D2 comes within 1% of 3 (D2 = 2.97), or N within 1% of 1 (Scrimgeour et al. 2012).
 * Linear theory: xi(r) = int k^2 P(k) j0(kr) dk / 2pi^2; xibar is the same with the top-hat window 3 j1(kr)/(kr).
 * P(k) = A k^ns T(k)^2 with the Eisenstein & Hu (1998) transfer function, normalised to sigma8.
 * Galaxies: xi_g = b^2 D(z)^2 xi_0 in real space, times the Kaiser factor 1 + 2beta/3 + beta^2/5 in redshift space.
 * Optionally the acoustic peak is smoothed as nonlinear motions do: P = P_nw + (P - P_nw) exp(-k^2 Sigma^2 / 2), with
 * P_nw the Eisenstein-Hu no-wiggle spectrum.
 * Lengths in h^-1 Mpc and wavenumbers in h Mpc^-1, except where a name says Mpc.
 */
(function (root) {
  'use strict';
  // Planck 2018, TT,TE,EE+lowE+lensing (Planck Collaboration VI, A&A 641, A6 (2020)), with its drag redshift and
  // sound horizon at the drag epoch (Mpc).
  const PLANCK18 = { h: 0.6736, Om: 0.3153, Ob: 0.02237 / (0.6736 * 0.6736), ns: 0.9649, sigma8: 0.8111, Tcmb: 2.7255, zdrag: 1059.94, rdrag: 147.09 };
  // The fiducial cosmology of Scrimgeour et al. (2012), as in Blake et al. (2011).
  const SCRIMGEOUR12 = { h: 0.71, Om: 0.27, Ob: 0.04482, ns: 0.96, sigma8: 0.8, Tcmb: 2.725 };
  // WiggleZ redshift slices (Scrimgeour et al. 2012): measured bias b^2 (Table 4) and beta (Table 3); measured R_H from
  // D2 = 2.97 (abstract) and the paper's LCDM values with best-fitting bias (Sec. 5), h^-1 Mpc.
  const WIGGLEZ = [
    { z: 0.2, b2: 0.68, beta: 0.69, RH: 71, err: 8, RHlcdm: 76 },
    { z: 0.4, b2: 0.87, beta: 0.73, RH: 70, err: 5, RHlcdm: 78 },
    { z: 0.6, b2: 1.23, beta: 0.60, RH: 81, err: 5, RHlcdm: 81 },
    { z: 0.8, b2: 1.43, beta: 0.51, RH: 75, err: 4, RHlcdm: 78 },
  ];

  // Eisenstein & Hu 1998, ApJ 496, 605: matter transfer function with baryon wiggles (eqs. 2-24).
  function transferEH(par) {
    const th = par.Tcmb / 2.7, om = par.Om * par.h * par.h, ob = par.Ob * par.h * par.h;
    const fb = par.Ob / par.Om, fc = 1 - fb;
    const zeq = 2.5e4 * om * Math.pow(th, -4);                       // eq. 2
    const keq = 7.46e-2 * om * Math.pow(th, -2);                     // eq. 3, Mpc^-1
    const b1 = 0.313 * Math.pow(om, -0.419) * (1 + 0.607 * Math.pow(om, 0.674)), b2 = 0.238 * Math.pow(om, 0.223);
    const zd = 1291 * Math.pow(om, 0.251) / (1 + 0.659 * Math.pow(om, 0.828)) * (1 + b1 * Math.pow(ob, b2)); // eq. 4
    const R = z => 31.5 * ob * Math.pow(th, -4) * (1e3 / z);         // eq. 5
    const Req = R(zeq), Rd = R(zd);
    const soundHorizon = z => { const R1 = R(z); return 2 / (3 * keq) * Math.sqrt(6 / Req) * Math.log((Math.sqrt(1 + R1) + Math.sqrt(R1 + Req)) / (1 + Math.sqrt(Req))); };
    const s = soundHorizon(zd); // eq. 6, Mpc, at Eisenstein and Hu's fitted drag redshift
    const ksilk = 1.6 * Math.pow(ob, 0.52) * Math.pow(om, 0.73) * (1 + Math.pow(10.4 * om, -0.95)); // eq. 7, Mpc^-1
    const a1 = Math.pow(46.9 * om, 0.670) * (1 + Math.pow(32.1 * om, -0.532));
    const a2 = Math.pow(12.0 * om, 0.424) * (1 + Math.pow(45.0 * om, -0.582));
    const ac = Math.pow(a1, -fb) * Math.pow(a2, -fb * fb * fb);      // eq. 11
    const c1 = 0.944 / (1 + Math.pow(458 * om, -0.708)), c2 = Math.pow(0.395 * om, -0.0266);
    const bc = 1 / (1 + c1 * (Math.pow(fc, c2) - 1));                // eq. 12
    const y = (1 + zeq) / (1 + zd), sy = Math.sqrt(1 + y);
    const G = y * (-6 * sy + (2 + 3 * y) * Math.log((sy + 1) / (sy - 1))); // eq. 15
    const ab = 2.07 * keq * s * Math.pow(1 + Rd, -0.75) * G;         // eq. 14
    const bnode = 8.41 * Math.pow(om, 0.435);                         // eq. 23
    const bb = 0.5 + fb + (3 - 2 * fb) * Math.sqrt(Math.pow(17.2 * om, 2) + 1); // eq. 24
    const T0 = (k, a, b) => { // eqs. 10, 19, 20
      const q = k / (13.41 * keq), L = Math.log(Math.E + 1.8 * b * q), C = 14.2 / a + 386 / (1 + 69.9 * Math.pow(q, 1.08));
      return L / (L + C * q * q);
    };
    const j0 = x => (x < 1e-4 ? 1 - x * x / 6 : Math.sin(x) / x);
    function T(kh) {
      const k = kh * par.h, ks = k * s;
      const f = 1 / (1 + Math.pow(ks / 5.4, 4));                      // eq. 18
      const Tc = f * T0(k, 1, bc) + (1 - f) * T0(k, ac, bc);          // eq. 17
      const st = s / Math.cbrt(1 + Math.pow(bnode / ks, 3));          // eq. 22
      const Tb = (T0(k, 1, 1) / (1 + Math.pow(ks / 5.2, 2)) + ab / (1 + Math.pow(bb / ks, 3)) * Math.exp(-Math.pow(k / ksilk, 1.4))) * j0(k * st); // eq. 21
      return fb * Tb + fc * Tc;                                       // eq. 16
    }
    // No-wiggle form (eqs. 26, 28-31): the same broad shape without the acoustic oscillations.
    const sNw = 44.5 * Math.log(9.83 / om) / Math.sqrt(1 + 10 * Math.pow(ob, 0.75)); // eq. 26, Mpc
    const aG = 1 - 0.328 * Math.log(431 * om) * fb + 0.38 * Math.log(22.3 * om) * fb * fb; // eq. 31
    function Tnw(kh) {
      const k = kh * par.h, G = par.Om * par.h * (aG + (1 - aG) / (1 + Math.pow(0.43 * k * sNw, 4))); // eq. 30
      const q = kh * th * th / G, L = Math.log(2 * Math.E + 1.8 * q), C = 14.2 + 731 / (1 + 62.5 * q); // eqs. 28, 29
      return L / (L + C * q * q);
    }
    return { T, Tnw, s, soundHorizon, zd, zeq };
  }

  // Linear growth in flat LCDM: D(a) proportional to H(a) int_0^a da' / (a' H(a'))^3, with D = 1 today; f = dln D / dln a.
  function growth(par) {
    const E = a => Math.sqrt(par.Om / (a * a * a) + 1 - par.Om);
    const Dun = a => { const N = 2000; let s = 0; for (let i = 0; i < N; i++) { const x = a * (i + 0.5) / N; s += a / N / Math.pow(x * E(x), 3); } return E(a) * s; };
    const D0 = Dun(1);
    const D = z => Dun(1 / (1 + z)) / D0;
    const f = z => { const a = 1 / (1 + z), e = 1e-4; return Math.log(Dun(a * (1 + e)) / Dun(a * (1 - e))) / Math.log((1 + e) / (1 - e)); };
    return { D, f };
  }

  const tophat = x => (x < 1e-3 ? 1 - x * x / 10 : 3 * (Math.sin(x) - x * Math.cos(x)) / (x * x * x));
  const sinc = x => (x < 1e-4 ? 1 - x * x / 6 : Math.sin(x) / x);

  // A cosmology: today's linear matter power spectrum and the correlation integrals on a log-k grid.
  // opts.sigmaNL (h^-1 Mpc) smooths the acoustic peak. A Gaussian cutoff exp(-(k kd)^2), kd = 0.25 h^-1 Mpc, lets the
  // oscillating integrals converge at small r; it changes D2 by under 1e-5 beyond 40 h^-1 Mpc. The log-k grid
  // resolves xi to 0.3% out to r = 300 h^-1 Mpc and not beyond, so R_H is searched no further than that.
  function cosmology(par = PLANCK18, opts = {}) {
    const tf = transferEH(par), gr = growth(par), SNL = opts.sigmaNL || 0;
    const NK = opts.nk || 8000, k0 = 1e-5, k1 = 100, dl = Math.log(k1 / k0) / NK, kd = opts.kdamp || 0.25, K = [];
    for (let i = 0; i < NK; i++) K.push(k0 * Math.exp((i + 0.5) * dl));
    const P0 = k => Math.pow(k, par.ns) * Math.pow(tf.T(k), 2);
    const Psm = k => { const pnw = Math.pow(k, par.ns) * Math.pow(tf.Tnw(k), 2); return pnw + (P0(k) - pnw) * Math.exp(-k * k * SNL * SNL / 2); };
    const sum = (w, f) => { let s = 0; for (let i = 0; i < NK; i++) s += w[i] * f(K[i]); return s; };
    const w0 = K.map(k => k * k * k * P0(k) * dl / (2 * Math.PI * Math.PI));
    const A = par.sigma8 * par.sigma8 / sum(w0, k => Math.pow(tophat(8 * k), 2));
    const w = w0.map(x => A * x);
    const wd = K.map((k, i) => (SNL ? A * k * k * k * Psm(k) * dl / (2 * Math.PI * Math.PI) : w[i]) * Math.exp(-k * k * kd * kd));
    return {
      par, tf, growth: gr,
      P: k => A * P0(k),
      sigma: R => Math.sqrt(sum(w, k => Math.pow(tophat(k * R), 2))),
      xi: r => sum(wd, k => sinc(k * r)),
      xibar: r => sum(wd, k => tophat(k * r)),
    };
  }

  // Clustering amplitude relative to today's matter: b^2 D(z)^2, times the Kaiser factor in redshift space.
  // beta defaults to f(z)/b.
  function amplitude(cos, { z = 0, b2 = 1, beta, redshiftSpace = false } = {}) {
    const D = cos.growth.D(z), bt = beta === undefined ? cos.growth.f(z) / Math.sqrt(b2) : beta;
    return b2 * D * D * (redshiftSpace ? 1 + 2 * bt / 3 + bt * bt / 5 : 1);
  }
  function D2(cos, r, amp = 1) {
    const x = amp * cos.xi(r), xb = amp * cos.xibar(r);
    return 3 + 3 * (x - xb) / (1 + xb);
  }
  const counts = (cos, r, amp = 1) => 1 + amp * cos.xibar(r);
  // Smallest r beyond which the clustering stays within eps of homogeneity: D2 > 3(1 - eps) (by = 'D2'), or
  // N < 1 + eps (by = 'N'). Scans outward from 1 to rmax h^-1 Mpc and bisects the last crossing; NaN if the
  // clustering is already that even at 1 or not yet at rmax.
  function homogeneityScale(cos, amp = 1, { eps = 0.01, by = 'D2', rmax = 300 } = {}) {
    const inside = by === 'N' ? r => counts(cos, r, amp) > 1 + eps : r => D2(cos, r, amp) < 3 * (1 - eps);
    if (!inside(1)) return NaN;
    let last = null, prev = true;
    for (let r = 1; r <= rmax; r *= 1.02) { const now = inside(r); if (!now && prev) last = r; prev = now; }
    if (last === null || prev) return NaN;
    let lo = last / 1.02, hi = last;
    for (let i = 0; i < 40; i++) { const mid = Math.sqrt(lo * hi); if (inside(mid)) lo = mid; else hi = mid; }
    return hi;
  }
  // The baryon acoustic peak: the local maximum of xi between 80 and 130 h^-1 Mpc (NaN if xi has none there).
  function baoPeak(cos) {
    let best = 80, bv = -Infinity;
    for (let r = 80; r <= 130; r += 0.1) { const v = cos.xi(r); if (v > bv) { bv = v; best = r; } }
    return best < 80.05 || best > 129.95 ? NaN : best;
  }
  // Galaxies on small scales: xi = (r/r0)^-gamma. Deep inside r0 the counts grow as r^(3 - gamma).
  function D2powerLaw(r, r0, gamma) {
    const x = Math.pow(r / r0, -gamma), xb = 3 * x / (3 - gamma);
    return 3 + 3 * (x - xb) / (1 + xb);
  }
  // Endpoint (secant) slope of ln N(<r) (unscaled counts, n r^3 (1 + xibar)) between r1 and r2.
  function slopePowerLaw(r1, r2, r0, gamma) {
    const lnN = r => 3 * Math.log(r) + Math.log(1 + 3 * Math.pow(r / r0, -gamma) / (3 - gamma));
    return (lnN(r2) - lnN(r1)) / Math.log(r2 / r1);
  }

  const api = { PLANCK18, SCRIMGEOUR12, WIGGLEZ, transferEH, growth, cosmology, amplitude, D2, counts, homogeneityScale, baoPeak, D2powerLaw, slopePowerLaw };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.HOMOGENEITY = api;
})(typeof window !== 'undefined' ? window : globalThis);
