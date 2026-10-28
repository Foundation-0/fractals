/* Orbits: is a galaxy a big solar system? Where Kepler's law holds, where rotation curves go flat, and what sets the
 * boundary. Part of https://github.com/Foundation-0/fractals (issue #36). No dependencies. Loads in Node (require) and
 * in a browser (window.ORB).
 *
 * Kepler's law. Around one dominant mass M, a circular orbit of radius r has speed v = sqrt(GM/r), so v falls as
 * r^(-1/2) and the period P obeys P^2 = 4 pi^2 a^3 / (G(M + m)). The law holds at every radius from the central body to
 * where something else's pull competes, so it repeats across scales with no size of its own.
 *
 * Where it stops. A body of mass m on a circular orbit of angular speed Omega in a host keeps its own satellites
 * inside the tidal (Jacobi) radius, where its pull matches the host's tidal stretch less the centrifugal term
 * (Binney & Tremaine 2008, as Jiang & Tremaine 2010 give it; section not confirmed):
 *   r_J^3 = G m / (4 Omega^2 - kappa^2) = G m / (4 A (A - B)),  Omega = A - B,  kappa^2 = -4 B (A - B),
 * with A and B the host's Oort constants at the orbit. For a point-mass host A = 3 Omega / 4 and B = -Omega / 4, and
 * r_J is Hill's radius a (m / 3M)^(1/3). For a flat rotation curve A = -B = Omega / 2. Either way the mean density of
 * m inside r_J, 3m / (4 pi r_J^3), equals 4A/Omega times the host's mean density inside the orbit, 3 Omega^2 / (4 pi G)
 * (spherical host): 3 times for a point mass, 2 for a flat curve, and in general 2(1 - dln v/dln R). So the edge is set
 * by a ratio of mean densities, not a size. The host's density here is its mean inside the orbit, not its local
 * density.
 *
 * Flat curves. Where the enclosed mass grows as M(<r) ~ r (mean density ~ r^-2), v stays constant. The Milky Way
 * between about 5 and 25 kpc comes close: Eilers et al. (2019) find its curve gently declining. The model's Galaxy is Bovy's MWPotential2014 (Bovy 2015,
 * sec. 3.5): a power-law bulge rho ~ r^-1.8 exp(-(r/1.9 kpc)^2), a Miyamoto-Nagai disk (a = 3 kpc, b = 0.28 kpc) and an
 * NFW halo (scale radius 16 kpc), normalised so that v_c(8 kpc) = 220 km/s, with the bulge, disk and halo supplying
 * 5%, 60% and 35% of the radial force there. Sgr A* is added as a point mass. Speeds are in the disk's mid-plane; the
 * bulge and halo are spherical.
 *
 * Sgr A*. The star S2 orbits it in 16 years (GRAVITY Collaboration 2020). Kepler's third law with a in AU (angle in
 * arcsec times distance in pc) and P in years gives the mass in solar masses; general relativity adds a prograde
 * precession of 6 pi G M / (c^2 a (1 - e^2)) per orbit.
 *
 * Units: SI unless named. Astronomical: kpc, km/s, solar masses, with G = GM_sun / (1 kpc) in (km/s)^2 kpc / M_sun.
 */
(function (root) {
  'use strict';
  // IAU 2015 Resolution B3 nominal GM_sun (Prsa et al. 2016); IAU 2012 au; parsec = 648000/pi au; Julian year.
  const C = { GMsun: 1.3271244e20, au: 149597870700, c: 299792458, day: 86400 };
  C.pc = 648000 / Math.PI * C.au; C.kpc = 1e3 * C.pc; C.yr = 365.25 * C.day;
  C.G = C.GMsun / C.kpc / 1e6;   // (km/s)^2 kpc / M_sun, 4.3009e-6
  C.kmskpc = 1e3 / C.kpc;        // 1 km/s/kpc in s^-1

  // ---------- the Solar System ----------
  // JPL "Keplerian Elements for Approximate Positions of the Major Planets" (Standish & Williams), Table 1 (1800 AD - 2050 AD),
  // heliocentric, mean ecliptic and equinox of J2000: a [au], inclination i and node Om [deg], mean-longitude rate
  // Ldot [deg/century]. Sun/planet mass ratios from the DE430 GM values (Folkner et al. 2014); "EM Bary" is the
  // Earth-Moon barycentre.
  const PLANETS = [
    { name: 'Mercury', a: 0.38709927, i: 7.00497902, Om: 48.33076593, Ldot: 149472.67411175, sunOver: 6023682 },
    { name: 'Venus', a: 0.72333566, i: 3.39467605, Om: 76.67984255, Ldot: 58517.81538729, sunOver: 408523.719 },
    { name: 'EM Bary', a: 1.00000261, i: -0.00001531, Om: 0, Ldot: 35999.37244981, sunOver: 328900.560 },
    { name: 'Mars', a: 1.52371034, i: 1.84969142, Om: 49.55953891, Ldot: 19140.30268499, sunOver: 3098703.59 },
    { name: 'Jupiter', a: 5.20288700, i: 1.30439695, Om: 100.47390909, Ldot: 3034.74612775, sunOver: 1047.3486 },
    { name: 'Saturn', a: 9.53667594, i: 2.48599187, Om: 113.66242448, Ldot: 1222.49362201, sunOver: 3497.9018 },
    { name: 'Uranus', a: 19.18916464, i: 0.77263783, Om: 74.01692503, Ldot: 428.48202785, sunOver: 22902.98 },
    { name: 'Neptune', a: 30.06992276, i: 1.77004347, Om: 131.78422574, Ldot: 218.45945325, sunOver: 19412.26 },
  ];
  // The invariable plane (normal to the Solar System's total angular momentum) on the J2000 ecliptic: inclination
  // 1 deg 34' 43.3", node 107.5822 deg (Souami & Souchay 2012).
  const INVARIABLE = { i: 1.5787, Om: 107.5822 };
  const orbitNormal = (i, Om) => { const d = Math.PI / 180; return [Math.sin(i * d) * Math.sin(Om * d), -Math.sin(i * d) * Math.cos(Om * d), Math.cos(i * d)]; };
  // A planet's orbital inclination to the invariable plane [deg].
  function tiltToInvariable(p) {
    const n = orbitNormal(p.i, p.Om), m = orbitNormal(INVARIABLE.i, INVARIABLE.Om);
    return Math.acos(Math.min(1, n[0] * m[0] + n[1] * m[1] + n[2] * m[2])) * 180 / Math.PI;
  }
  const planetMassFraction = () => PLANETS.reduce((s, p) => s + 1 / p.sunOver, 0);

  // Kepler's third law for one planet: the GM its orbit implies, n^2 a^3, against GM_sun, with n the mean-longitude
  // rate Ldot: the orbit's angular rate, for which n^2 a is the mean inward pull at a on a near-circular orbit
  // (G M(<a) / a^2 only for a spherical mass inside; see ringExcess). The mean-anomaly rate Ldot - wdot is the radial
  // frequency instead. A 250-year fit to a perturbed orbit, so
  // the excess carries the other planets' pull as well as the planet's own mass.
  function kepler(p) {
    const n = p.Ldot * Math.PI / 180 / (36525 * C.day), a = p.a * C.au;
    const GM = n * n * a * a * a;
    return { name: p.name, n, P: 2 * Math.PI / n / C.yr, GM, excess: GM / C.GMsun - 1, own: 1 / p.sunOver };
  }

  // The planet's own mass plus what the other planets' pull adds to n^2 a^3 / GM_sun - 1, averaged over their orbits:
  // the heliocentric two-body term m/M_sun, plus each other planet smeared into a coplanar ring at its semi-major axis,
  // whose in-plane pull at the planet's a is added to the Sun's. { own: false } leaves out the planet's own mass, and
  // `which` picks the other planets counted (all by default). The ring potential is -(2 G m / pi) K(k) / (r + b),
  // k = 2 sqrt(r b) / (r + b), with K the complete elliptic integral (by the arithmetic-geometric mean). A secular
  // estimate: it leaves out the long-period terms a 250-year fit also carries.
  function ellipticK(k) {
    let a = 1, b = Math.sqrt(1 - k * k);
    for (let i = 0; i < 40 && Math.abs(a - b) > 1e-16 * a; i++) { const an = (a + b) / 2; b = Math.sqrt(a * b); a = an; }
    return Math.PI / (2 * a);
  }
  const ringPotential = (r, b) => -(2 / Math.PI) * ellipticK(2 * Math.sqrt(r * b) / (r + b)) / (r + b); // per unit G m
  function ringExcess(p, { own = true, which = () => true } = {}) {
    let ex = own ? 1 / p.sunOver : 0;
    for (const q of PLANETS) {
      if (q === p || !which(q)) continue;
      const h = 1e-6 * p.a, pull = (ringPotential(p.a + h, q.a) - ringPotential(p.a - h, q.a)) / (2 * h); // inward > 0
      ex += p.a * p.a * pull / q.sunOver;
    }
    return ex;
  }

  // Least-squares slope of log P against log a: 3/2 for Kepler.
  function keplerExponent(list = PLANETS) {
    const xs = list.map(p => Math.log(p.a)), ys = list.map(p => Math.log(kepler(p).P));
    const mx = xs.reduce((s, x) => s + x, 0) / xs.length, my = ys.reduce((s, y) => s + y, 0) / ys.length;
    let sxy = 0, sxx = 0;
    xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; });
    return sxy / sxx;
  }

  // ---------- where a Kepler domain ends ----------
  // Jacobi radius [m] of a body of GM [m^3/s^2] in a host with Oort constants A, B [km/s/kpc].
  const jacobi = (GM, A, B) => Math.cbrt(GM / (4 * A * (A - B) * C.kmskpc ** 2));
  // Hill radius [same unit as a] for a point-mass host: the Jacobi radius with A = 3 Omega/4, B = -Omega/4.
  const hill = (a, massRatio) => a * Math.cbrt(massRatio / 3);
  // Oort constants of a point-mass host and of a flat rotation curve, at angular speed Omega.
  const oortKepler = Omega => ({ A: 0.75 * Omega, B: -0.25 * Omega });
  const oortFlat = Omega => ({ A: 0.5 * Omega, B: -0.5 * Omega });
  // The body's mean density inside r_J over the host's mean density inside the orbit (spherical host): 4A/Omega,
  // which is 2(1 - dln v/dln R) for a rotation curve v(R).
  const densityRatio = (A, B) => 4 * A / (A - B);
  // Where a mass's own pull falls to an acceleration g: r = sqrt(GM/g) [m].
  const radiusAtAcceleration = (GM, g) => Math.sqrt(GM / g);

  // ---------- Sgr A* and S2 ----------
  // GRAVITY Collaboration 2020 (A&A 636, L5), Table E.1: S2's semi-major axis [mas], eccentricity, period [yr]; their
  // fitted mass [M_sun] and distance [pc].
  const S2 = { aMas: 125.058, e: 0.884649, P: 16.0455, M: 4.261e6, R0: 8246.7, fSP: 1.10, fSPerr: 0.19 };
  function orbitOf({ aMas, e, P, R0 }, M) {
    const aAU = aMas * 1e-3 * R0, Mk = aAU ** 3 / (P * P);  // Kepler's third law in au, yr, M_sun (m << M)
    const mass = M === undefined ? Mk : M, GM = mass * C.GMsun, a = aAU * C.au;
    const precession = 6 * Math.PI * GM / (C.c * C.c * a * (1 - e * e));  // rad per orbit
    const rp = a * (1 - e);
    return {
      aAU, keplerMass: Mk, precessionArcmin: precession * 180 / Math.PI * 60,
      periAU: rp / C.au, periSpeed: Math.sqrt(GM * (1 + e) / rp) / 1e3, periOverRs: rp / (2 * GM / (C.c * C.c)),
    };
  }

  // The stars around Sgr A*: inside the break near 3 pc the density falls as r^-gamma, gamma = 1.13 (Schodel et al.
  // 2018: the light-density slope of the innermost 1-2 pc, which mass follows at constant M/L; their robust range is
  // 1.1-1.4), so their mass grows as r^(3 - gamma); 0.5 to 1.5 million solar masses lie inside 1 pc (Schodel, Merritt &
  // Eckart 2009). Radii in pc.
  const CUSP = { M1: 1.0e6, M1lo: 0.5e6, M1hi: 1.5e6, gamma: 1.13, rBreak: 3 };
  const cuspMass = (r, M1 = CUSP.M1, gamma = CUSP.gamma) => M1 * Math.pow(r, 3 - gamma);
  // The radius where the stars inside weigh k times Sgr A* (k = 1, the equal-mass radius; k = 2, the usual influence
  // radius). Radii beyond rBreak extrapolate the power law past the break, where the density falls faster, so they are
  // lower limits.
  const cuspRadius = (k, Mbh, M1 = CUSP.M1, gamma = CUSP.gamma) => Math.pow(k * Mbh / M1, 1 / (3 - gamma));
  // dln v / dln r for Sgr A* plus the cusp: (dln M / dln r - 1) / 2.
  const cuspSlope = (r, Mbh, M1 = CUSP.M1, gamma = CUSP.gamma) => { const m = cuspMass(r, M1, gamma); return ((3 - gamma) * m / (Mbh + m) - 1) / 2; };
  // Where that slope equals s (between -1/2 and (2 - gamma)/2), in closed form: the stars' mass is then
  // Mbh (2s + 1) / ((3 - gamma) - (2s + 1)).
  const cuspSlopeRadius = (s, Mbh, M1 = CUSP.M1, gamma = CUSP.gamma) =>
    Math.pow(Mbh * (2 * s + 1) / ((3 - gamma) - (2 * s + 1)) / M1, 1 / (3 - gamma));

  // ---------- the Milky Way ----------
  function lgamma(z) { // Lanczos, g = 7; |error| < 1e-14 for z > 0
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
      12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
    z -= 1; let x = c[0];
    for (let i = 1; i < 9; i++) x += c[i] / (z + i);
    const t = z + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  function gammaP(s, x) { // regularised lower incomplete gamma: series below s + 1, continued fraction above
    if (x <= 0) return 0;
    const pre = Math.exp(-x + s * Math.log(x) - lgamma(s));
    if (x < s + 1) {
      let sum = 1 / s, term = 1 / s;
      for (let n = 1; n < 1000; n++) { term *= x / (s + n); sum += term; if (term < sum * 1e-17) break; }
      return pre * sum;
    }
    let b = x + 1 - s, c = 1e300, d = 1 / b, h = d; // modified Lentz
    for (let i = 1; i < 1000; i++) {
      const an = -i * (i - s); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-16) break;
    }
    return 1 - pre * h;
  }

  // Bovy 2015 (ApJS 216, 29), sec. 3.5: MWPotential2014.
  const MWP14 = { R0: 8, v0: 220, f: { bulge: 0.05, disk: 0.6, halo: 0.35 }, alpha: 1.8, rc: 1.9, a: 3, b: 0.28, rs: 16 };
  const SGRA = { M: 4.297e6 }; // GRAVITY Collaboration 2022 (A&A 657, L12)

  function galaxy(par = MWP14, { bh = SGRA.M } = {}) {
    const shape = {
      bulge: r => gammaP((3 - par.alpha) / 2, (r / par.rc) ** 2),              // M(<r) / M_bulge
      disk: R => R * R / Math.pow(R * R + (par.a + par.b) ** 2, 1.5),           // v^2 / (G M_disk), mid-plane
      halo: r => Math.log(1 + r / par.rs) - (r / par.rs) / (1 + r / par.rs),    // M(<r) / (4 pi rho_s r_s^3)
    };
    const v02 = par.v0 * par.v0, R0 = par.R0;
    const M = {
      bulge: par.f.bulge * v02 * R0 / C.G / shape.bulge(R0),
      disk: par.f.disk * v02 / C.G / shape.disk(R0),
      halo: par.f.halo * v02 * R0 / C.G / shape.halo(R0),
      bh,
    };
    const parts = R => ({
      bh: C.G * M.bh / R, bulge: C.G * M.bulge * shape.bulge(R) / R, disk: C.G * M.disk * shape.disk(R),
      halo: C.G * M.halo * shape.halo(R) / R,
    });
    const v2 = R => { const p = parts(R); return p.bh + p.bulge + p.disk + p.halo; };
    const v = R => Math.sqrt(v2(R));
    const slope = R => { const h = 1e-4; return Math.log(v(R * (1 + h)) / v(R * (1 - h))) / Math.log((1 + h) / (1 - h)); };
    const bulgeMass = r => M.bulge * shape.bulge(r);
    // The disk's mass inside a sphere of radius r, by Gauss's theorem: (r^2 / G) times the mean over the sphere of the
    // outward radial pull, here r^2/2 times the integral over mu = z/r of dPhi/dr for the Miyamoto-Nagai potential
    // -G M / sqrt(R^2 + (a + sqrt(z^2 + b^2))^2) (Simpson's rule in mu on [0, 1], doubled by symmetry).
    const diskSphereMass = r => {
      const n = 4000, a = par.a, b = par.b;
      const f = mu => {
        const z = r * mu, R = r * Math.sqrt(Math.max(0, 1 - mu * mu)), zeta = Math.sqrt(z * z + b * b), D = Math.hypot(R, a + zeta);
        return (R * R + (a + zeta) * z * z / zeta) / (r * D * D * D);
      };
      let sum = f(0) + f(1);
      for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(i / n);
      return M.disk * r * r * sum / (3 * n);
    };
    // The total mass inside a sphere of radius r [M_sun].
    const sphereMass = r => M.bh + bulgeMass(r) + diskSphereMass(r) + M.halo * shape.halo(r);
    // The halo's (NFW) density at radius r [M_sun/pc^3].
    const haloDensity = r => M.halo / (4 * Math.PI * par.rs ** 3) / ((r / par.rs) * (1 + r / par.rs) ** 2) / 1e9;
    // the smallest radius above r0 where f crosses zero, by a log grid then bisection
    const cross = (f, r0, r1) => {
      let lo = r0, flo = f(lo);
      for (let r = r0 * 1.02; r <= r1; r *= 1.02) {
        const fr = f(r);
        if (Math.sign(fr) !== Math.sign(flo)) {
          let a = lo, b = r;
          for (let i = 0; i < 100; i++) { const m = Math.sqrt(a * b); if (Math.sign(f(m)) === Math.sign(flo)) a = m; else b = m; }
          return Math.sqrt(a * b);
        }
        lo = r; flo = fr;
      }
      return NaN;
    };
    return {
      par, M, parts, v, slope, bulgeMass, diskSphereMass, sphereMass, haloDensity, cross,
      // where the bulge's stars inside r first weigh k times Sgr A* (k = 1, equal mass; k = 2, the influence radius)
      influence: (k = 1) => cross(r => bulgeMass(r) - k * M.bh, 1e-6, 1),
      // the longest run of radii (kpc, on a grid 0.5% apart) where |dln v / dln R| < tol; by default outside the bulge
      // (R > 1 kpc), since the r^-1.8 bulge is also flat to +-0.15 from about 7 to 180 pc
      flatRange: (tol = 0.15, rMin = 1, rMax = 300) => {
        let best = [NaN, NaN], start = NaN, last = NaN;
        for (let r = rMin; r <= rMax * 1.0001; r *= 1.005) {
          if (Math.abs(slope(r)) < tol) { if (Number.isNaN(start)) start = r; last = r; }
          else if (!Number.isNaN(start)) {
            if (Number.isNaN(best[0]) || last / start > best[1] / best[0]) best = [start, last];
            start = NaN;
          }
        }
        if (!Number.isNaN(start) && (Number.isNaN(best[0]) || last / start > best[1] / best[0])) best = [start, last];
        return best;
      },
    };
  }

  // ---------- Hill's problem: which orbits a body keeps inside its tidal radius ----------
  // A satellite of a body on a circular orbit in a host, in the frame rotating with the body (x away from the host's
  // centre, y along the motion, z out of the plane), lengths in r_J and times in 1/Omega (Binney & Tremaine 2008,
  // as Jiang & Tremaine 2010 give it; Heisler & Tremaine 1986 for the vertical tide):
  //   x'' = 2y' + Gam x - Gam x/r^3,   y'' = -2x' - Gam y/r^3,   z'' = -nu2 z - Gam z/r^3,
  // with Gam = 4A/Omega (3 for a point-mass host, so these are Hill's equations) and nu2 = (vertical tidal frequency /
  // Omega)^2: 1 for a point-mass host; for a disk, (4 pi G rho0 + 2(A^2 - B^2)) / Omega^2 by Poisson's equation, with
  // rho0 the local mid-plane density. The tidal radius r_J is where the x-axis forces balance (x = 1).
  const HOST_KEPLER = { name: 'point-mass host (a planet around the Sun)', Gam: 3, nu2: 1 };
  function hostDisk(A, B, rho0) { // A, B in km/s/kpc; rho0 in M_sun/pc^3
    const Omega = A - B, nuz = 4 * Math.PI * C.G * rho0 * 1e9 + 2 * (A * A - B * B); // (km/s/kpc)^2; 1 pc^-3 = 1e9 kpc^-3
    return { name: 'disk host (the Sun in the Galaxy)', Gam: 4 * A / Omega, nu2: nuz / (Omega * Omega), A, B, rho0 };
  }

  function hillDeriv(s, Gam, nu2, out) {
    const x = s[0], y = s[1], z = s[2], vx = s[3], vy = s[4], vz = s[5];
    const r2 = x * x + y * y + z * z, k = Gam / (r2 * Math.sqrt(r2));
    out[0] = vx; out[1] = vy; out[2] = vz;
    out[3] = 2 * vy + Gam * x - k * x; out[4] = -2 * vx - k * y; out[5] = -nu2 * z - k * z;
  }
  // Dormand-Prince 5(4) with step control (Hairer, Norsett & Wanner, Solving ODEs I, sec. II.5).
  const DP = {
    a: [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
      [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]],
    e: [71 / 57600, 0, -71 / 16695, 71 / 1920, -17253 / 339200, 22 / 525, -1 / 40],
  };
  // Follows one orbit for `orbits` turns of the host (time 2 pi orbits). Fate: 'escapes' once r > rEsc, 'plunges'
  // once r < rIn (1e-3 r_J is 0.74 of Jupiter's radius; for the Sun it is 283 au, outside the planets), otherwise
  // 'stays'. Returns the final state s too. Throws on non-finite settings, on a non-finite step, or after maxSteps
  // (by default 2.5e5 per turn of the host; the hardest orbit in the tables, a polar orbit at 0.025 r_J that stays,
  // needs about 7e4 per turn; steps per turn grow as a^-1.5, so the cap would fire only below about 0.012 r_J, under
  // the smallest radius scanned here), rather than looping.
  function hillOrbit(host, s0, { orbits = 20, rEsc = 3, rIn = 1e-3, tol = 1e-10, maxSteps = 2.5e5 * orbits } = {}) {
    if (![orbits, rEsc, rIn, tol, maxSteps, host.Gam, host.nu2, ...s0].every(Number.isFinite)) throw new Error('hillOrbit: non-finite input');
    const T = 2 * Math.PI * orbits, k = Array.from({ length: 7 }, () => new Float64Array(6));
    const y = new Float64Array(6), s = Float64Array.from(s0);
    let t = 0, h = 1e-3, steps = 0;
    hillDeriv(s, host.Gam, host.nu2, k[0]);
    while (t < T) {
      if (t + h > T) h = T - t;
      for (let j = 1; j < 7; j++) {
        for (let i = 0; i < 6; i++) { let acc = s[i]; for (let m = 0; m < j; m++) acc += h * DP.a[j][m] * k[m][i]; y[i] = acc; }
        hillDeriv(y, host.Gam, host.nu2, k[j]);
      }
      let err = 0;
      for (let i = 0; i < 6; i++) {
        let ei = 0; for (let m = 0; m < 7; m++) ei += DP.e[m] * k[m][i];
        err = Math.max(err, Math.abs(h * ei) / (tol * (1 + Math.abs(s[i]))));
      }
      if (!Number.isFinite(err) || !(h > 0)) throw new Error(`hillOrbit: non-finite step at t = ${t}`);
      if (steps > maxSteps) throw new Error(`hillOrbit: more than ${maxSteps} steps`);
      if (err <= 1) {
        t += h; steps++;
        for (let i = 0; i < 6; i++) { s[i] = y[i]; k[0][i] = k[6][i]; }
        const r = Math.hypot(s[0], s[1], s[2]);
        if (r > rEsc) return { fate: 'escapes', t, steps, s: Array.from(s) };
        if (r < rIn) return { fate: 'plunges', t, steps, s: Array.from(s) };
      }
      h *= Math.min(5, Math.max(0.2, 0.9 * Math.pow(err, -0.2)));
    }
    return { fate: 'stays', t, steps, s: Array.from(s) };
  }
  // A circular orbit of radius a (in r_J) about the body, at the two-body speed, in the plane with unit normal n
  // (rotating-frame axes; n = +z is prograde, -z retrograde), starting at angle phi.
  function hillStart(host, a, n, phi) {
    const [nx, ny, nz] = n;
    let ux, uy, uz;
    if (Math.abs(nz) < 0.9) { ux = -ny; uy = nx; uz = 0; } else { ux = 0; uy = -nz; uz = ny; }
    const un = Math.hypot(ux, uy, uz); ux /= un; uy /= un; uz /= un;
    const wx = ny * uz - nz * uy, wy = nz * ux - nx * uz, wz = nx * uy - ny * ux;
    const c = Math.cos(phi), s = Math.sin(phi), v = Math.sqrt(host.Gam / a);
    const x = a * (c * ux + s * wx), y = a * (c * uy + s * wy), z = a * (c * uz + s * wz);
    // velocity in the rotating frame: the inertial circular velocity less Omega x r, Omega = +z
    return [x, y, z, v * (-s * ux + c * wx) + y, v * (-s * uy + c * wy) - x, v * (-s * uz + c * wz)];
  }
  // n directions spread evenly over the sphere (Fibonacci lattice).
  function sphere(n) {
    const out = [], g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) { const z = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - z * z); out.push([r * Math.cos(g * i), r * Math.sin(g * i), z]); }
    return out;
  }
  // Fractions of orbits that stay, escape and plunge, over the given orbit normals and nPhase starting angles each.
  // Hill's equations are symmetric under r -> -r, v -> -v: a start at phi + pi is the inverted start at phi, with the
  // same fate. So the starting angles span the half turn [0, pi). The equations are also symmetric under z -> -z, and
  // under time reversal with y -> -y. For a normal in the x-z plane (or, with z -> -z as well and an inversion, the
  // y-z plane), as in every single-plane scan here, the start at pi - phi is then the mirror of the start at phi run
  // backward. Its fate matches nearly always in the plane but often not for polar orbits, so it is no duplicate there;
  // still, the angles phi = pi (p + offset)/nPhase are offset by a quarter step so that no such pair falls in one
  // sample. offset = 0.75 takes the mirrored set pi - phi instead.
  function hillFates(host, a, normals, { nPhase = 4, offset = 0.25, ...opt } = {}) {
    const n = { stays: 0, escapes: 0, plunges: 0 };
    for (const nv of normals) for (let p = 0; p < nPhase; p++) n[hillOrbit(host, hillStart(host, a, nv, Math.PI * (p + offset) / nPhase), opt).fate]++;
    const tot = normals.length * nPhase;
    return { stays: n.stays / tot, escapes: n.escapes / tot, plunges: n.plunges / tot };
  }
  // Fates on a grid of radii (in r_J), and the radius where a fraction first reaches one half (linear interpolation
  // between grid points; NaN if it never does): edge for the orbits that escaped, edgeLost for those escaped or plunged.
  // A half reached already at the first grid point returns that point, so start the grid inside the edge.
  function halfPoint(rows, frac) {
    for (let i = 0; i < rows.length; i++) {
      const f = frac(rows[i]);
      if (f >= 0.5) {
        if (i === 0) return rows[0].a;
        const g = frac(rows[i - 1]);
        return rows[i - 1].a + (rows[i].a - rows[i - 1].a) * (0.5 - g) / (f - g);
      }
    }
    return NaN;
  }
  function hillScan(host, normals, as, opt = {}) {
    const rows = as.map(a => ({ a, ...hillFates(host, a, normals, opt) }));
    return { rows, edge: halfPoint(rows, r => r.escapes), edgeLost: halfPoint(rows, r => r.escapes + r.plunges) };
  }

  // McGaugh, Lelli & Schombert 2016: the acceleration where the radial acceleration relation bends.
  const GDAGGER = 1.20e-10; // m s^-2

  const api = {
    C, PLANETS, INVARIABLE, tiltToInvariable, planetMassFraction, kepler, ellipticK, ringExcess, keplerExponent, jacobi, hill, oortKepler, oortFlat, densityRatio,
    radiusAtAcceleration, S2, orbitOf, CUSP, cuspMass, cuspRadius, cuspSlope, cuspSlopeRadius, lgamma, gammaP, MWP14, SGRA, galaxy, GDAGGER,
    HOST_KEPLER, hostDisk, hillOrbit, hillStart, sphere, hillFates, hillScan,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ORB = api;
})(typeof window !== 'undefined' ? window : globalThis);
