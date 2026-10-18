/* Gravitational atom beside hydrogen: one wave equation, two scales. Leading order in alpha. No dependencies.
 * Part of https://github.com/Foundation-0/fractals. Loads in Node (require) and in a browser (window.GA).
 *
 * A particle of mass mu held by a pull V = -alpha hbar c / r has, for alpha << 1,
 *   levels       E_n = mu c^2 (1 - alpha^2 / 2n^2)   (binding mu c^2 alpha^2 / 2n^2)
 *   Bohr radius  a0  = hbar / (mu c alpha)
 *   shapes       psi_nlm = R_nl(r / a0) Y_lm, the same functions in units of a0
 * Hydrogen: alpha = e^2 / (4 pi eps0 hbar c), about 1/137; mu = the electron.
 * Gravitational atom: alpha = G M mu / (hbar c) = r_g / lambda_c, so a0 = r_g / alpha^2
 *   (Baumann, Chia & Porto 2019, eqs. 2.5-2.9, arXiv:1804.03208).
 * Spin chi = a/M: horizon r+ = r_g (1 + sqrt(1 - chi^2)), angular velocity Omega_H = chi c / (2 r+).
 *   A level grows (superradiance) only if omega / m < Omega_H (BCP 2019 eq. 2.1); otherwise it drains into the hole.
 * Constants: CODATA 2022 (NIST). Solar mass parameter GM_sun: IAU 2015 Resolution B3 (Prsa et al. 2016).
 */
(function (root) {
  'use strict';
  const C = {
    hbar: 1.054571817e-34, c: 2.99792458e8, e: 1.602176634e-19, eps0: 8.8541878188e-12,
    me: 9.1093837139e-31, mp: 1.67262192595e-27, rp: 8.4075e-16, G: 6.6743e-11, GMsun: 1.3271244e20,
    au: 1.495978707e11, ly: 9.4607304725808e15,
  };
  const HBARC = C.hbar * C.c / C.e; // eV m

  // An atom is a particle (rest energy muEV, in eV) and a pull strength alpha. Everything else follows.
  function make(name, muEV, alpha, extra) {
    return Object.assign({ name, muEV, alpha, a0: HBARC / (muEV * alpha), E1: muEV * alpha * alpha / 2 }, extra);
  }
  // recoil: use the electron-proton reduced mass instead of a fixed proton.
  function hydrogen(opts) {
    const m = opts && opts.recoil ? C.me * C.mp / (C.me + C.mp) : C.me;
    return make('Hydrogen', m * C.c * C.c / C.e, C.e * C.e / (4 * Math.PI * C.eps0 * C.hbar * C.c), { core: C.rp });
  }
  // M in solar masses, mu in eV, chi = dimensionless spin (0 to 1).
  function grav(Msun, muEV, chi) {
    const GM = C.GMsun * Msun, rg = GM / (C.c * C.c), lambdaC = HBARC / muEV;
    const hz = horizon(chi);
    return make('Gravitational atom', muEV, rg / lambdaC,
      { M: Msun, chi, rg, lambdaC, Mkg: GM / C.G, rPlus: hz.r * rg, OmegaH: hz.omega * C.c / rg, core: hz.r * rg });
  }
  const level = (atom, n) => atom.muEV * (1 - atom.alpha * atom.alpha / (2 * n * n)); // total energy, eV
  const binding = (atom, n) => atom.E1 / (n * n);                                   // eV

  // Kerr horizon in units of r_g, and its angular velocity in units of c / r_g.
  function horizon(chi) { const r = 1 + Math.sqrt(Math.max(0, 1 - chi * chi)); return { r, omega: chi / (2 * r) }; }
  // Frequency of level n in units of c / r_g: omega r_g / c = alpha (1 - alpha^2 / 2n^2).
  const omegaRg = (n, alpha) => alpha * (1 - alpha * alpha / (2 * n * n));
  // Can level (n, m) grow around a hole of spin chi? BCP 2019 eq. 2.1, with the leading-order frequency.
  const grows = (n, m, alpha, chi) => m > 0 && omegaRg(n, alpha) < m * horizon(chi).omega;
  // Largest alpha at which level (n, m) still grows at spin chi.
  function alphaMax(n, m, chi) {
    const target = m * horizon(chi).omega; let lo = 0, hi = n * Math.sqrt(2 / 3); // omegaRg rises on [0, hi]
    if (omegaRg(n, hi) <= target) return hi;
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (omegaRg(n, mid) < target) lo = mid; else hi = mid; }
    return lo;
  }
  // Spin left when level (n, m) has grown until it stops: BCP 2019 eq. 2.2, ignoring the small loss of mass.
  function spinAfter(n, m, alpha) { const w = omegaRg(n, alpha); return 4 * m * w / (m * m + 4 * w * w); }
  // Next-order shift of the gravitational atom's frequency, in units of mu (BCP 2019 eq. 2.10: relativistic,
  // fine and hyperfine terms). Returned with its size relative to the leading-order binding.
  function nextOrder(n, l, m, alpha, chi) {
    const a4 = Math.pow(alpha, 4);
    const d = -a4 / (8 * Math.pow(n, 4)) + (2 * l - 3 * n + 1) * a4 / (Math.pow(n, 4) * (l + 0.5)) +
      (l > 0 ? 2 * chi * m * Math.pow(alpha, 5) / (Math.pow(n, 3) * l * (l + 0.5) * (l + 1)) : 0);
    return { dOmega: d, relBinding: d / (alpha * alpha / (2 * n * n)) };
  }
  // A cloud of a real field radiates gravitational waves at twice its frequency: f = mu c^2 / (pi hbar) (BCP 2019 eq. 4.1).
  const gwFrequency = muEV => muEV * C.e / (Math.PI * C.hbar);
  // Growth (> 0) or drain (< 0) rate of level (n, l, m), in units of c / r_g: Detweiler's small-alpha result with the
  // factor of 2 corrected, as written in BCP 2019 eqs. 2.12-2.13. Leading order only: near alpha ~ 0.3-0.4 it is several
  // times too slow (compare Arvanitaki, Baryakhtar & Huang 2015, Table I, and Dolan 2007; see tests/gravitational-atom.mjs).
  function growthRate(n, l, m, alpha, chi) {
    const hz = horizon(chi); let prod = 1;
    for (let j = 1; j <= l; j++) prod *= j * j * (1 - chi * chi) + Math.pow(chi * m - 2 * hz.r * alpha, 2);
    const Cnl = Math.pow(2, 4 * l + 1) * fact(n + l) / (Math.pow(n, 2 * l + 4) * fact(n - l - 1)) *
      Math.pow(fact(l) / (fact(2 * l) * fact(2 * l + 1)), 2) * prod;
    return 2 * hz.r * Cnl * (m * hz.omega - omegaRg(n, alpha)) * Math.pow(alpha, 4 * l + 5);
  }
  // Bosons in a level that has taken spin dChi from the hole: N = G M^2 dChi / (m hbar c), the angular momentum given up
  // divided by m hbar per boson (Arvanitaki, Baryakhtar & Huang 2015, eq. 8).
  const occupation = (Msun, dChi, m) => C.GMsun * Msun * (C.GMsun * Msun / C.G) * dChi / (m * C.hbar * C.c);

  // ---------- shapes: hydrogen wavefunctions, in units of a0 ----------
  const fact = k => (k <= 1 ? 1 : k * fact(k - 1));
  function laguerre(k, a, x) { // generalised Laguerre polynomial L_k^(a)(x)
    if (k === 0) return 1;
    let p0 = 1, p1 = 1 + a - x;
    for (let i = 1; i < k; i++) { const p2 = ((2 * i + 1 + a - x) * p1 - (i + a) * p0) / (i + 1); p0 = p1; p1 = p2; }
    return p1;
  }
  function radial(n, l, x) { // R_nl at r = x a0, in units of a0^(-3/2)
    const rho = 2 * x / n, norm = Math.sqrt(Math.pow(2 / n, 3) * fact(n - l - 1) / (2 * n * fact(n + l)));
    return norm * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre(n - l - 1, 2 * l + 1, rho);
  }
  function legendre(l, m, x) { // associated Legendre P_l^m(x), m >= 0 (sign convention irrelevant: only squares are used)
    const s = Math.sqrt(Math.max(0, 1 - x * x)); let pmm = 1;
    for (let i = 1; i <= m; i++) pmm *= (2 * i - 1) * s;
    if (l === m) return pmm;
    let pm1 = x * (2 * m + 1) * pmm;
    for (let k = m + 2; k <= l; k++) { const p = (x * (2 * k - 1) * pm1 - (k + m - 1) * pmm) / (k - m); pmm = pm1; pm1 = p; }
    return pm1;
  }
  function angular2(l, m, theta) { // |Y_lm|^2; theta from the spin (z) axis
    const am = Math.abs(m), p = legendre(l, am, Math.cos(theta));
    return (2 * l + 1) / (4 * Math.PI) * fact(l - am) / fact(l + am) * p * p;
  }
  // |psi_nlm|^2 at r = x a0, in units of a0^-3. It does not depend on the azimuth, so the cloud is a ring around the z axis.
  const density = (n, l, m, x, theta) => { const R = radial(n, l, x); return R * R * angular2(l, m, theta); };

  // Lines of equal density for a "circular" state (l = n - 1, |m| = l; 211 and 322 are both). Their density is
  //   |psi|^2 / peak = [u e^(1-u) sin(theta)]^(2l),  u = r / r*,  r* = n l a0 (the peak, on the equator),
  // so the line at fraction f of the peak solves u e^(1-u) = f^(1/2l) / sin(theta). Returns the right-hand lobe as
  // [x, z] points in units of a0 (the left lobe is its mirror image).
  function contour(n, f, steps) {
    const l = n - 1, rStar = n * l, q0 = Math.pow(f, 1 / (2 * l)), N = steps || 48;
    const th0 = Math.asin(q0), pts = [], inner = [];
    const solve = (q, outer) => { // root of ln u + 1 - u = ln q on the inner (u < 1) or outer (u > 1) branch
      let lo = outer ? 1 : 0, hi = outer ? 4 - 2 * Math.log(q) : 1;
      for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2, g = Math.log(mid) + 1 - mid - Math.log(q);
        if ((g > 0) === outer) lo = mid; else hi = mid; }
      return (lo + hi) / 2;
    };
    for (let i = 0; i <= 2 * N; i++) { // theta from pi - th0 up to th0, packed near the ends where the branches meet
      const t = i / N - 1, d = (Math.PI / 2 - th0) * (1 - Math.abs(t)) * (1 - Math.abs(t));
      const th = t >= 0 ? th0 + d : Math.PI - th0 - d;
      const q = Math.min(1, q0 / Math.sin(th));
      const uo = solve(q, true), ui = solve(q, false);
      pts.push([rStar * uo * Math.sin(th), rStar * uo * Math.cos(th)]);
      inner.push([rStar * ui * Math.sin(th), rStar * ui * Math.cos(th)]);
    }
    return pts.concat(inner.reverse());
  }

  const api = { C, hydrogen, grav, level, binding, horizon, omegaRg, grows, alphaMax, spinAfter, nextOrder, gwFrequency,
    growthRate, occupation, radial, angular2, density, contour };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GA = api;
})(typeof window !== 'undefined' ? window : globalThis);
