/* Halos within halos: where the nesting of dark matter halos stops, and what sets the smallest halo. Its only
 * dependency is the repository's cosmic-homogeneity model, which supplies the Eisenstein & Hu (1998) no-wiggle
 * transfer function and the linear growth factor (in a browser, load cosmic-homogeneity/homogeneity.js first: it
 * sets window.HOMOGENEITY).
 *
 * 1. Linear matter power today: P(k) = A k^ns Tnw(k)^2 Tcut(k)^2, with A set by sigma8 (Planck 2018) at Tcut = 1.
 *    Wavenumbers in h/Mpc on the grid (as in homogeneity.js); the cut-off formulas are in Mpc^-1, as in their papers.
 *    Masses in Msun (not h^-1 Msun): M = (4 pi/3) rho_m R^3, rho_m today's mean matter density (dark matter and
 *    baryons, for every mass in this study).
 *      sigma^2(R) = int Delta^2(k) Tcut^2 W^2(kR) dln k, Delta^2 = k^3 P/(2 pi^2), W the top-hat 3 j1(x)/x.
 *      Effective slope: sigma ~ M^-alpha, n_eff = 6 alpha - 3. Near n_eff = -3 all masses collapse at nearly once.
 *      Half mode: Tcut(k_hm) = 1/2 in amplitude, M_hm = (4 pi/3) rho_m (pi/k_hm)^3, a sphere whose radius is half the
 *        wavelength 2 pi/k_hm (Schneider et al. 2012). Half power, Tcut^2 = 1/2 (Hu, Barkana & Gruzinov 2000): {power: true}.
 *      Collapse: sigma(M) D(z_c) = 1.686, D = 1 today (or another threshold: Green, Hofmann & Schwarz's z_nl is where
 *        sigma = 1). Optional factors: the radiation-era growing mode 1 + 2 a_eq/(3a) (Meszaros), and the dark matter
 *        growing alone on scales the gas never falls into (integrated; see growth()).
 * 2. Cut-offs set by the particle.
 *    WIMP, free streaming (Green, Hofmann & Schwarz 2005): T = [1 - (2/3)(k/k_fs)^2] exp[-(k/k_fs)^2 - (k/k_d)^2],
 *      their JCAP eqs. dfs and dk, stated as valid for k < k_fs (the half mode is at 0.625 k_fs), with
 *      k_fs = 1.70e6 Mpc^-1 (m/100 GeV)^1/2 (T_kd/30 MeV)^1/2 / [1 + ln(T_kd/30 MeV)/19.2],
 *      k_d  = 3.76e7 Mpc^-1 (m/100 GeV)^1/2 (T_kd/30 MeV)^1/2.
 *      The scalings were first read in search text and the prefactor recalled; #35's review read all three in the
 *      papers' arXiv source.
 *      Also derived here: after kinetic decoupling a WIMP of one-dimensional speed spread sigma_v = sqrt(T_kd/m) coasts
 *      a comoving distance s; a Maxwellian smears a mode as exp(-k^2 s^2/2), so k_fs = sqrt(2)/s.
 *    WIMP, acoustic damping (Loeb & Zaldarriaga 2005; Bertschinger 2006): until kinetic decoupling the WIMPs move with
 *      the radiation, whose sound waves erase everything inside the horizon. M_ao = (4 pi/3) rho_m tau_kd^3, the mass
 *      inside the comoving horizon tau_kd = 1/(a H) at T_kd. The floor is the larger of the two (Bringmann 2009,
 *      Sec. 4, who gives 1e-11 to nearly 1e-3 Msun across WIMP models; as seen in search text, checked in review).
 *      Bringmann, and Cornell et al. for M_ao, count the dark matter alone, rho_chi = f_c rho_m (as #35's review read
 *      them): their floors are f_c (0.84 for Planck 2018) times the ones here.
 *      The expansion before and after decoupling comes from ideal gases of photons, neutrinos, e+-, mu+- and pions
 *      (see thermal()), valid from below 1 MeV to about 80 MeV: kaons and heavier hadrons are left out (they would
 *      add about 1% to g at 70 MeV and 7% at 100 MeV).
 *    Wave dark matter (Hu, Barkana & Gruzinov 2000): T = cos(x^3)/(1 + x^8), x = 1.61 m22^(1/18) k/k_Jeq,
 *      k_Jeq = 9 m22^(1/2) Mpc^-1, m22 = m/1e-22 eV. Schive et al. (2016) fit the halo mass function's turn-down at
 *      M0 = 1.6e10 m22^(-4/3) Msun (their eq. MFFit, fitted to runs at m22 = 0.8, 1.6 and 3.2, so every bound mass is
 *      an extrapolation). Both first seen as quoted by later papers in search text; #35's review read them in the
 *      papers' arXiv source.
 * 3. The small-scale tail of the transfer function, as a check on extrapolating Eisenstein & Hu twenty decades in
 *    mass: a mode that enters the horizon in the radiation era leaves the dark matter with a logarithmic kick,
 *    delta_c -> -A ln(B k tau), after which it grows as in Meszaros's solution. Radiation-era perturbations in the
 *    conformal Newtonian gauge (Ma & Bertschinger 1995): photons a perfect fluid, neutrinos either a second perfect
 *    fluid (still coupled when the mode enters) or a truncated Boltzmann hierarchy (free streaming), the dark matter
 *    a test fluid. Matching onto Meszaros's growing mode gives, for k >> k_eq,
 *      T(k) -> (15/16) A (k_eq/k)^2 ln(4 sqrt2 e^-3 B k/k_eq),   A in units of the adiabatic constant C
 *    (Ma & Bertschinger's; B is a pure number), with the large-scale matter-era potential (6/5) C.
 * 4. The Jeans scale of a wave of mass m in density rho: omega^2 = (hbar k^2/2m)^2 - 4 pi G rho, so
 *    k_J = (16 pi G rho)^(1/4) (m/hbar)^(1/2), and the Witness Map's wave clock across 1/k_J,
 *    m (1/k_J)^2/hbar = 1/(4 sqrt(pi G rho)), is gravity's own clock.
 * 5. Nesting: the decades of mass from a floor up to a host, and the subhalo counts of Springel et al. (2008),
 *    dN/dM = a0 (M/m0)^-1.9, extrapolated down to the floor. The levels apply the host's ratio at every level, the
 *    self-similar case Springel et al. call an upper limit; they find sub-subhalos 2 or 3 times fewer.
 */
(function (root) {
  'use strict';
  const HOM = typeof module !== 'undefined' && module.exports ? require('../cosmic-homogeneity/homogeneity.js') : root.HOMOGENEITY;

  // SI. CODATA 2018 G and hbar; IAU 2015 nominal solar mass; the parsec from the IAU 2012 astronomical unit.
  const C = { G: 6.6743e-11, hbar: 1.054571817e-34, c: 2.99792458e8, e: 1.602176634e-19, kB: 1.380649e-23,
    Msun: 1.98841e30, Mpc: 3.0856775814913673e22, yr: 3.15576e7 };
  C.eV = C.e / (C.c * C.c);                                  // kilograms per eV/c^2
  C.pc = C.Mpc / 1e6; C.kpc = C.Mpc / 1e3;
  const PLANCK18 = HOM.PLANCK18;
  // Round numbers of the WMAP era, for comparing with papers of 2004-2005. Assumed: not any paper's stated inputs.
  const WMAP_ERA = { h: 0.7, Om: 0.3, Ob: 0.045, ns: 1, sigma8: 0.9, Tcmb: 2.725 };
  const DELTA_C = 1.686;                                     // spherical collapse threshold (Einstein-de Sitter)
  const MW = 1e12;                                           // Milky Way halo mass, Msun
  // Neutrinos' share of the radiation, 3.046 species: rho_nu/rho_gamma = 3.046 (7/8)(4/11)^(4/3).
  const R_NU = (() => { const r = 3.046 * 7 / 8 * Math.pow(4 / 11, 4 / 3); return r / (1 + r); })();

  // Background: densities, equality (EH 1998 eqs. 2-3), drag epoch, cosmic time.
  function background(par = PLANCK18) {
    const H100 = 1e5 / C.Mpc;                                 // 100 km/s/Mpc in s^-1
    const rhoCrit = 3 * H100 * H100 / (8 * Math.PI * C.G);   // kg m^-3 per h^2
    const rhoMsi = rhoCrit * par.h * par.h * par.Om;          // kg m^-3
    const rhoM = rhoMsi * Math.pow(C.Mpc, 3) / C.Msun;        // Msun Mpc^-3
    const tf = HOM.transferEH(par), zeq = tf.zeq, aeq = 1 / (1 + zeq);
    const keq = 7.46e-2 * par.Om * par.h * par.h * Math.pow(par.Tcmb / 2.7, -2); // Mpc^-1, = a_eq H(a_eq)
    const Or = par.Om * aeq, OL = 1 - par.Om - Or, H0 = par.h / 2997.92458; // H0 in Mpc^-1
    const fc = 1 - par.Ob / par.Om;
    const hubbleGyr = 977.792 / (100 * par.h);                // 1/H0 in Gyr
    const E = a => Math.sqrt(Or / (a * a * a * a) + par.Om / (a * a * a) + OL);
    function age(z) { // int_0^a da/(a H) by Simpson in ln a from a = 1e-12
      const a1 = 1 / (1 + z), l0 = Math.log(1e-12), l1 = Math.log(a1), n = 400, h = (l1 - l0) / n;
      let s = 0; for (let i = 0; i <= n; i++) { const a = Math.exp(l0 + i * h), w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2; s += w / E(a); }
      return s * h / 3 * hubbleGyr;
    }
    return { par, rhoCrit, rhoMsi, rhoM, zeq, aeq, keq, Or, OL, H0, fc, zd: tf.zd, age, hubbleGyr, state: thermal(par, rhoMsi) };
  }

  // ---- The thermal history around kinetic decoupling: the scale factor and the expansion rate at photon temperature T
  // (MeV), from ideal gases in equilibrium: photons (2), three neutrinos (6, fermions), e+- (4), mu+- (4), pi+- (2) and
  // pi0 (1). The neutrinos decouple at T_NU = 1 MeV (taken as instantaneous); below it the photon-e+- plasma keeps its
  // own entropy, so e+- annihilation heats the photons and not the neutrinos. Not valid above about 80 MeV, where the
  // hadrons left out (kaons and heavier) start to matter.
  const T_NU = 1, NU = 7 / 8 * 6, ME = 0.51099895, MMU = 105.6583755, MPI = 139.57039, MPI0 = 134.9768; // MeV
  // One species of dof degrees of freedom and mass x T: g = rho/((pi^2/30) T^4) and gs = s/((2 pi^2/45) T^3), with
  // rho = dof/(2 pi^2) int E p^2 f dp and P = dof/(6 pi^2) int p^4/E f dp; Simpson's rule over u = p/T up to 50.
  function species(dof, x, fermi) {
    if (x > 60) return { g: 0, gs: 0 };
    const n = 400, du = 50 / n; let r = 0, p = 0;
    for (let i = 1; i <= n; i++) {                            // the integrands vanish at u = 0
      const u = i * du, e = Math.sqrt(u * u + x * x), f = 1 / (Math.exp(e) + (fermi ? 1 : -1)), w = i === n ? 1 : i % 2 ? 4 : 2;
      r += w * u * u * e * f; p += w * u * u * u * u / e * f;
    }
    r *= du / 3 * dof / (2 * Math.PI * Math.PI); p *= du / 3 * dof / (6 * Math.PI * Math.PI);
    return { g: r * 30 / (Math.PI * Math.PI), gs: (r + p) * 45 / (2 * Math.PI * Math.PI) };
  }
  function dof(T) { // the photon-e+- plasma, and the muons and pions
    const e = species(4, ME / T, true), mu = species(4, MMU / T, true), pc = species(2, MPI / T, false), p0 = species(1, MPI0 / T, false);
    return { g: 2 + e.g, gs: 2 + e.gs, gH: mu.g + pc.g + p0.g, gsH: mu.gs + pc.gs + p0.gs };
  }
  function thermal(par, rhoMsi) {
    const T0 = par.Tcmb * C.kB / C.e / 1e6, dNu = dof(T_NU);
    const aNu = T0 * Math.cbrt(2 / dNu.gs) / T_NU;           // photon entropy today, g_s = 2
    const gsNu = dNu.gs + NU + dNu.gsH;
    const U = (g, T) => Math.PI * Math.PI / 30 * g * Math.pow(T * 1e6 * C.e, 4) / Math.pow(C.hbar * C.c, 3); // J m^-3
    return function state(T) {
      if (T > 80) throw new RangeError('thermal history: kaons and heavier hadrons, left out, add over 2% to g above about 80 MeV');
      const d = dof(T); let a, u, g = null;
      if (T >= T_NU) { g = d.g + NU + d.gH; a = aNu * T_NU / T * Math.cbrt(gsNu / (d.gs + NU + d.gsH)); u = U(g, T); }
      else { a = T0 * Math.cbrt(2 / d.gs) / T; u = U(d.g, T) + U(NU, T_NU * aNu / a); }
      return { a, g, u, H: Math.sqrt(8 * Math.PI * C.G / 3 * (u / (C.c * C.c) + rhoMsi / (a * a * a))) };
    };
  }

  // Mass of a sphere of radius pi/k (half a wavelength), k in Mpc^-1.
  const massOfK = (bg, k) => 4 * Math.PI / 3 * bg.rhoM * Math.pow(Math.PI / k, 3);
  const radiusOfMass = (bg, M) => Math.cbrt(3 * M / (4 * Math.PI * bg.rhoM)); // Mpc

  // ---- WIMPs. m in GeV, T_kd in MeV.
  // Green, Hofmann & Schwarz 2005 (JCAP 0508, 003), scalings as given in their proceedings, astro-ph/0508553.
  function wimpGHS({ m = 100, Tkd = 30 } = {}) {
    const r = Math.sqrt(m / 100 * Tkd / 30);
    const kfs = 1.70e6 * r / (1 + Math.log(Tkd / 30) / 19.2), kd = 3.76e7 * r;
    return { name: `WIMP ${m} GeV, T_kd ${Tkd} MeV`, short: `WIMP ${m}/${Tkd}`, kind: 'wimp', m, Tkd, kfs, kd, T: k => wimpT(k, kfs, kd) };
  }
  function wimpT(k, kfs, kd) { const x = k / kfs, y = k / kd; return (1 - 2 / 3 * x * x) * Math.exp(-x * x - y * y); }
  // The universe at kinetic decoupling: scale factor, expansion rate (s^-1), the radiation's g, and the comoving
  // horizon tau = 1/(a H) in Mpc.
  function decoupling(bg, Tkd) { const st = bg.state(Tkd); return { ...st, tau: C.c / (st.a * st.H) / C.Mpc }; }
  // Free streaming from first principles. After decoupling at a_kd the speed spread falls as sigma_v a_kd/a, so the
  // comoving distance coasted is s = sigma_v a_kd c int da/(a^3 H) = sigma_v a_kd c int dln a/(a^2 H): numerically
  // through the thermal history down to 1 keV, where e+- annihilation is over, then in closed form for radiation and
  // matter up to today, (F(y) - F(Om/Or))/(H0 sqrt(Or)), F(y) = 2 ln[(sqrt(1+y) + 1)/sqrt(y)], y = a Om/Or (Lambda
  // ignored: it would lower s by 0.02%). And k_fs = sqrt(2)/s.
  function wimpFreeStream(bg, { m = 100, Tkd = 30 } = {}) {
    const sig = Math.sqrt(Tkd * 1e-3 / m), n = 400, l0 = Math.log(Tkd), l1 = Math.log(1e-3);   // sigma_v in units of c
    let prev = bg.state(Tkd), I = 0;
    const akd = prev.a;
    for (let i = 1; i <= n; i++) {                             // trapezoid in ln a
      const st = bg.state(Math.exp(l0 + (l1 - l0) * i / n));
      I += Math.log(st.a / prev.a) * (1 / (st.a * st.a * st.H) + 1 / (prev.a * prev.a * prev.H)) / 2; prev = st;
    }
    const Or = prev.u / (C.c * C.c) * Math.pow(prev.a, 4) / (bg.rhoCrit * bg.par.h * bg.par.h), F = y => 2 * Math.log((Math.sqrt(1 + y) + 1) / Math.sqrt(y));
    const s = sig * akd * (C.c * I / C.Mpc + (F(prev.a * bg.par.Om / Or) - F(bg.par.Om / Or)) / (bg.H0 * Math.sqrt(Or)));   // Mpc
    const kfs = Math.SQRT2 / s, kd = 3.76e7 * Math.sqrt(m / 100 * Tkd / 30);
    return { name: `WIMP ${m} GeV, T_kd ${Tkd} MeV (free streaming derived)`, kind: 'wimp', m, Tkd, kfs, kd, s, akd, T: k => wimpT(k, kfs, kd) };
  }
  // Acoustic damping: the matter inside the horizon at kinetic decoupling (the dark matter alone is f_c of it).
  const acousticMass = (bg, Tkd) => 4 * Math.PI / 3 * bg.rhoM * Math.pow(decoupling(bg, Tkd).tau, 3);
  // The WIMP floor under two conventions: Bringmann's max[M(pi/k_fs), M_ao], and the half-mode mass with the same rule.
  // Both in all the matter, as every mass here; Bringmann writes his with the dark matter density, f_c times these.
  function wimpFloor(bg, { m = 100, Tkd = 30 } = {}) {
    const w = wimpGHS({ m, Tkd }), Mfs = massOfK(bg, w.kfs), Mhm = massOfK(bg, halfMode(w)), Mao = acousticMass(bg, Tkd);
    return { cut: w, Mfs, Mhm, Mao, bringmann: Math.max(Mfs, Mao), halfMode: Math.max(Mhm, Mao) };
  }

  // ---- Wave dark matter. Hu, Barkana & Gruzinov 2000 (PRL 85, 1158).
  function fdmHBG(m22) {
    const kJeq = 9 * Math.sqrt(m22), c = 1.61 * Math.pow(m22, 1 / 18) / kJeq;
    return { name: `wave DM ${(m22 * 1e-22).toExponential(1)} eV`, short: `wave ${(m22 * 1e-22).toExponential(0)}`, kind: 'fdm', m22, kJeq,
      T: k => { const x = c * k, x3 = x * x * x; return Math.cos(x3) / (1 + x3 * x3 * x * x); } };
  }
  const schiveM0 = m22 => 1.6e10 * Math.pow(m22, -4 / 3);  // Schive et al. 2016 (ApJ 818, 89), Msun
  // Lower bounds on the mass (eV), each assuming the wave is all of the dark matter; values and confidence levels
  // as seen in search text (abstracts and search summaries), and as #35's review read them in the papers.
  const BOUNDS = [
    { m: 2.0e-21, cl: '2 sigma', src: 'Irsic et al. 2017, Lyman-alpha (conservative thermal history)' },
    { m: 2.9e-21, cl: '95%', src: 'Armengaud et al. 2017, Lyman-alpha; Nadler et al. 2021, Milky Way satellites' },
    { m: 2.0e-20, cl: '95%', src: 'Rogers & Peiris 2021, Lyman-alpha' },
    { m: 3e-19, cl: '99%', src: 'Dalal & Kravtsov 2022, sizes and stellar speeds of ultrafaint dwarfs' },
    { m: 8e-18, cl: '95%', src: 'May, Dalal & Kravtsov 2025, Ursa Major III / UNIONS 1, if it is a galaxy' },
  ];

  const CDM = { name: 'CDM (no cut-off)', short: 'CDM no cut', kind: 'cdm', T: () => 1 };
  // Sensitivity of the WIMP form: the same k_fs with a plain Gaussian, exp(-(k/k_fs)^2 - (k/k_d)^2).
  const gaussianOf = w => ({ ...w, name: w.name + ', Gaussian only', short: w.short + ' G', T: k => Math.exp(-Math.pow(k / w.kfs, 2) - Math.pow(k / w.kd, 2)) });

  // First k (Mpc^-1) where T falls to 1/2 (half mode), or T^2 does ({power: true}). Scans upward, then bisects;
  // Infinity if it never does.
  function halfMode(cut, { power = false } = {}) {
    const f = k => { const t = cut.T(k); return (power ? t * t : t) - 0.5; };
    let k = 1e-4; while (f(k) > 0 && k < 1e14) k *= 1.05;
    if (f(k) > 0) return Infinity;
    let lo = k / 1.05, hi = k;
    for (let i = 0; i < 80; i++) { const mid = Math.sqrt(lo * hi); if (f(mid) > 0) lo = mid; else hi = mid; }
    return hi;
  }

  // ---- The linear spectrum on a log-k grid (h/Mpc), and sigma(M) for any cut-off.
  const tophat2 = x => {
    if (x < 1e-3) return 1 - x * x / 5;
    if (x > 10) return 4.5 * (1 + x * x) / Math.pow(x, 6); // phase average of W^2: the grid cannot follow the wiggles
    const w = 3 * (Math.sin(x) - x * Math.cos(x)) / (x * x * x); return w * w;
  };
  // opts: perDecade (grid density), kmax (h/Mpc), running (dn_s/dln k about 0.05 Mpc^-1), factor (a function of k in
  // Mpc^-1 multiplying the transfer function at small scales, applied after the sigma8 normalisation).
  function model(par = PLANCK18, opts = {}) {
    const bg = background(par), tf = HOM.transferEH(par), gr = HOM.growth(par);
    const perDec = opts.perDecade || 100, k0 = 1e-5, k1 = opts.kmax || 1e10;
    const NK = Math.ceil(Math.log10(k1 / k0) * perDec), dl = Math.log(k1 / k0) / NK;
    const alphaS = opts.running || 0, kp = 0.05 / par.h;
    const K = new Float64Array(NK), D2 = new Float64Array(NK);
    const shape = k => Math.pow(k, 3 + par.ns) * Math.pow(k / kp, 0.5 * alphaS * Math.log(k / kp)) * Math.pow(tf.Tnw(k), 2) / (2 * Math.PI * Math.PI);
    for (let i = 0; i < NK; i++) { K[i] = k0 * Math.exp((i + 0.5) * dl); D2[i] = shape(K[i]); }
    let s8 = 0; for (let i = 0; i < NK; i++) s8 += D2[i] * tophat2(8 * K[i]) * dl;
    const A = par.sigma8 * par.sigma8 / s8;
    for (let i = 0; i < NK; i++) { D2[i] *= A; if (opts.factor) D2[i] *= Math.pow(opts.factor(K[i] * par.h), 2); }
    const cache = new Map();
    function weights(cut) {
      if (cache.has(cut)) return cache.get(cut);
      const w = new Float64Array(NK); for (let i = 0; i < NK; i++) { const t = cut.T(K[i] * par.h); w[i] = D2[i] * t * t * dl; }
      cache.set(cut, w); return w;
    }
    const Rh = M => radiusOfMass(bg, M) * par.h;              // h^-1 Mpc
    function sigma(M, cut = CDM) {
      const w = weights(cut), R = Rh(M); let s = 0;
      for (let i = 0; i < NK; i++) s += w[i] * tophat2(K[i] * R); return Math.sqrt(s);
    }
    function slope(M, cut = CDM) {
      const e = 0.05, a = -Math.log(sigma(M * Math.exp(e), cut) / sigma(M * Math.exp(-e), cut)) / (2 * e);
      return { alpha: a, neff: 6 * a - 3 };
    }
    // Peak of Delta^2 T^2 (Mpc^-1): where the power per log k is largest once the cut-off is applied.
    function peak(cut) { const w = weights(cut); let j = 0; for (let i = 1; i < NK; i++) if (w[i] > w[j]) j = i; return K[j] * par.h; }
    // Growth table: ln D against ln(1+z), from homogeneity.js (flat LCDM, no radiation).
    const NZ = 300, lz1 = Math.log(1 + 3e4), LZ = new Float64Array(NZ + 1), LD = new Float64Array(NZ + 1);
    for (let i = 0; i <= NZ; i++) { LZ[i] = lz1 * i / NZ; LD[i] = Math.log(gr.D(Math.exp(LZ[i]) - 1)); }
    // The dark matter growing alone. Far below the gas's Jeans mass the baryons never fall in, but the growth factor
    // (and Eisenstein & Hu's transfer function) assume that after the drag epoch they do. Both histories, in ln a with
    // radiation, matter and Lambda,  delta'' + (2 + dln H/dln a) delta' = (3/2)(Omega_c(a) delta_c + Omega_b(a) delta_b),
    // the baryons smooth throughout, or released from rest at the drag epoch. Started at a_eq/100 on the radiation-era
    // logarithmic mode, delta_c = 14 + ln(a/a_i) (a mode that entered at about 1e6 Mpc^-1; from 8 to 20 in place of
    // 14 the collapse redshifts do not change at the 0.01 level).
    let lag = null;
    function lagTable() {
      const fc = bg.fc, fb = 1 - fc, Om = par.Om, Or = bg.Or, OL = 1 - Om - Or;
      const rhs = (N, y) => {
        const a = Math.exp(N), m = Om / (a * a * a), r = Or / (a * a * a * a), E2 = r + m + OL;
        const fr = 2 + (-4 * r - 3 * m) / (2 * E2), src = 1.5 * m / E2 * (fc * y[0] + fb * y[2]);
        return [y[1], src - fr * y[1], y[3], src - fr * y[3]];
      };
      const rk4 = (N, y, h) => {
        const k1 = rhs(N, y), k2 = rhs(N + h / 2, y.map((v, i) => v + h / 2 * k1[i])), k3 = rhs(N + h / 2, y.map((v, i) => v + h / 2 * k2[i]));
        const k4 = rhs(N + h, y.map((v, i) => v + h * k3[i])); return y.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      };
      const N0 = Math.log(bg.aeq / 100), Nd = -Math.log(1 + bg.zd), n1 = Math.ceil((Nd - N0) / 0.005), n2 = Math.ceil(-Nd / 0.005);
      let y = [14, 1, 0, 0], N = N0;
      for (let i = 0; i < n1; i++) { y = rk4(N, y, (Nd - N0) / n1); y[2] = y[3] = 0; N += (Nd - N0) / n1; }   // smooth before drag
      let ySmooth = y.slice(), yIn = y.slice();
      const tab = [[Nd, 1]];
      const smooth = (N, v) => { const d = rhs(N, v); d[2] = d[3] = 0; return d; };
      for (let i = 0; i < n2; i++) {
        const h = -Nd / n2;
        yIn = rk4(N, yIn, h);
        const k1 = smooth(N, ySmooth), k2 = smooth(N + h / 2, ySmooth.map((v, j) => v + h / 2 * k1[j])), k3 = smooth(N + h / 2, ySmooth.map((v, j) => v + h / 2 * k2[j]));
        const k4 = smooth(N + h, ySmooth.map((v, j) => v + h * k3[j]));
        ySmooth = ySmooth.map((v, j) => v + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); N += h;
        tab.push([N, fc * ySmooth[0] / (fc * yIn[0] + fb * yIn[2])]);
      }
      return tab;
    }
    function growth(z, { radiation = false, baryonLag = false } = {}) {
      const u = Math.log(1 + z) / lz1 * NZ, i = Math.min(NZ - 1, Math.floor(u)), t = u - i;
      let D = Math.exp(LD[i] + t * (LD[i + 1] - LD[i]));
      const a = 1 / (1 + z);
      if (radiation) D *= 1 + 2 * bg.aeq / (3 * a);
      // The lag on the matter contrast f_c delta_c (baryonLag true), or on the dark matter contrast itself ('cdm',
      // which also divides by f_c): two readings of which contrast reaches 1.686.
      if (baryonLag && z < bg.zd) {
        if (!lag) lag = lagTable();
        const N = -Math.log(1 + z), j = Math.min(lag.length - 2, Math.floor((N - lag[0][0]) / (lag[1][0] - lag[0][0])));
        const w = (N - lag[j][0]) / (lag[j + 1][0] - lag[j][0]);
        D *= lag[j][1] + w * (lag[j + 1][1] - lag[j][1]);
      }
      if (baryonLag === 'cdm') D /= bg.fc;                     // before drag too, the baryons are smooth
      return D;
    }
    // Redshift at which a peak of height nu sigma reaches 1.686 (or o.delta); -1 if it has not yet.
    function zc(M, cut = CDM, o = {}) {
      const s = (o.nu || 1) * sigma(M, cut, o), dc = o.delta || DELTA_C; if (s * growth(0, o) < dc) return -1;
      let lo = 0, hi = lz1;
      for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (s * growth(Math.exp(mid) - 1, o) > dc) lo = mid; else hi = mid; }
      return Math.exp(lo) - 1;
    }
    const fac = k => (opts.factor ? Math.pow(opts.factor(k * par.h), 2) : 1);
    return { par, bg, tf, A, K, D2, dl, NK, sigma, slope, peak, growth, zc, Rh,
      Delta2: k => A * shape(k) * fac(k), P: k => A * shape(k) * fac(k) * 2 * Math.PI * Math.PI / (k * k * k) };
  }

  // ---- Radiation-era kick (section 3 above). Units k = 1, x = k tau, adiabatic constant C = 1. Rnu is the neutrinos'
  // share of the radiation; free: true lets them stream through a hierarchy of lmax multipoles, free: false keeps them
  // a perfect fluid (as photons are). The potential follows the 0i Einstein equation up to x = 1 and the algebraic
  // Poisson constraint after, so it cannot drift. Returns {A, B} of delta_c -> -A ln(B x), fitted between xmax/4 and
  // xmax, and the radiation-era potential psi0 = 20/(15 + 4 Rnu) (Ma & Bertschinger eq. 96).
  // For a perfect fluid the asymptote is exact. The potential is phi = psi = 3 psi0 (sin y - y cos y)/y^3, y = x/sqrt3,
  // and delta_c' = 3 phi' - theta_c, theta_c' = psi - theta_c/x integrate once to
  //   x delta_c' = 3 x phi' - int_0^x x' psi dx' = 3 x phi' - 9 psi0 (1 - sin y/y).
  // With int_0^Y (1 - sin y/y) dy/y = ln Y + gamma_E - 1 + O(1/Y) and delta_c(0) = -3 psi0/2, phi(0) = psi0,
  //   delta_c -> -9 psi0 ln(x e^(gamma_E - 1/2)/sqrt3):  A = 9 psi0, B = e^(gamma_E - 1/2)/sqrt3.
  // This integration reaches it to 1e-3.
  function radiationEra({ Rnu = R_NU, free = true, lmax = 60, xmax = 800 } = {}) {
    if (!(xmax >= 4)) throw new RangeError('radiationEra: xmax must be at least 4');
    const fn = Rnu, fg = 1 - Rnu, L = free ? lmax : 1;
    // state: delta_g, theta_g, delta_nu, theta_nu, F_2..F_L (neutrino multipoles, F_2 = 2 sigma), delta_c, theta_c, phi
    const iF = 4, iDC = 4 + L - 1, iTC = iDC + 1, iPHI = iDC + 2, N = iDC + 3;
    const psi0 = 20 / (15 + 4 * (free ? Rnu : 0)), phi0 = (1 + 0.4 * (free ? Rnu : 0)) * psi0;
    let x = 1e-3; const s = new Float64Array(N);
    s[0] = s[2] = -2 * psi0; s[1] = s[3] = 0.5 * x * psi0;
    if (free) s[iF] = 2 * x * x / 15 * psi0;
    s[iDC] = -1.5 * psi0; s[iTC] = 0.5 * x * psi0; s[iPHI] = phi0;
    function deriv(x, s, d) {
      const phi = x < 1 ? s[iPHI] : -1.5 / (x * x) * (fg * s[0] + fn * s[2] + 4 / x * (fg * s[1] + fn * s[3]));
      const sig = free ? s[iF] / 2 : 0, psi = phi - 6 * fn * sig / (x * x);
      const phip = -psi / x + 2 / (x * x) * (fg * s[1] + fn * s[3]);
      d[0] = -4 / 3 * s[1] + 4 * phip; d[1] = s[0] / 4 + psi;
      d[2] = -4 / 3 * s[3] + 4 * phip; d[3] = s[2] / 4 - sig + psi;
      if (free) {
        const F = l => (l === 1 ? 4 / 3 * s[3] : s[iF + l - 2]);
        d[iF] = 8 / 15 * s[3] - 3 / 5 * (L >= 3 ? s[iF + 1] : 0);
        for (let l = 3; l <= L; l++) {
          const Fp1 = l < L ? s[iF + l - 1] : (2 * L + 1) / x * F(L) - F(L - 1);   // Ma & Bertschinger's truncation
          d[iF + l - 2] = (l * F(l - 1) - (l + 1) * Fp1) / (2 * l + 1);
        }
      }
      d[iDC] = -s[iTC] + 3 * phip; d[iTC] = -s[iTC] / x + psi; d[iPHI] = phip;
    }
    const k1 = new Float64Array(N), k2 = new Float64Array(N), k3 = new Float64Array(N), k4 = new Float64Array(N), t = new Float64Array(N);
    const step = h => {
      deriv(x, s, k1); for (let i = 0; i < N; i++) t[i] = s[i] + h / 2 * k1[i];
      deriv(x + h / 2, t, k2); for (let i = 0; i < N; i++) t[i] = s[i] + h / 2 * k2[i];
      deriv(x + h / 2, t, k3); for (let i = 0; i < N; i++) t[i] = s[i] + h * k3[i];
      deriv(x + h, t, k4); for (let i = 0; i < N; i++) s[i] += h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
      x += h;
    };
    const x1 = xmax / 4; let d1 = null;
    for (const stop of [1, x1, xmax]) {                      // land exactly on x = 1 (the switch) and on x1
      while (x < stop - 1e-12) step(Math.min(0.02, 0.3 * x / (2 * L + 1), 0.1 * x, stop - x));
      if (stop === x1) d1 = s[iDC];
    }
    const A = -(s[iDC] - d1) / Math.log(xmax / x1), B = Math.exp(-s[iDC] / A) / xmax;
    return { A, B, psi0 };
  }
  // The tail it implies, T(k) for k in Mpc^-1, written as coef (k_eq/k)^2 ln(c k/k_eq).
  function smallScaleTail(bg, { A, B }) {
    const coef = 15 / 16 * A, c = 4 * Math.SQRT2 * Math.exp(-3) * B;
    return { coef, c, T: k => coef * Math.pow(bg.keq / k, 2) * Math.log(c * k / bg.keq) };
  }

  // ---- Jeans scale of a wave of mass mEV (eV) in density rho (kg m^-3), physical, SI. K: the constants to use
  // (G, hbar, and eV in kilograms), e.g. the Witness Map's own.
  function jeans(mEV, rho, K = C) {
    const m = mEV * K.eV, closed = Math.pow(16 * Math.PI * K.G * rho, 0.25) * Math.sqrt(m / K.hbar);
    // Root of omega^2(k) = (hbar k^2/2m)^2 - 4 pi G rho by bisection, independent of the closed form.
    const w2 = k => Math.pow(K.hbar * k * k / (2 * m), 2) - 4 * Math.PI * K.G * rho;
    let lo = closed / 10, hi = closed * 10;
    for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (w2(mid) < 0) lo = mid; else hi = mid; }
    const kJ = Math.sqrt(lo * hi);
    return { kJ, closed, tWave: m / (K.hbar * kJ * kJ), tGrav: 1 / (4 * Math.sqrt(Math.PI * K.G * rho)),
      tFF: Math.sqrt(3 * Math.PI / (32 * K.G * rho)), lambdaJ: 2 * Math.PI / kJ };
  }
  // Comoving Jeans wavenumber (Mpc^-1) at scale factor a, in the mean matter density rho_m0 a^-3 (or a given density
  // today, rho0 in kg m^-3), so k_J ~ a^(1/4).
  function kJcomoving(bg, m22, a, { rho0 = bg.rhoMsi } = {}) {
    return a * jeans(m22 * 1e-22, rho0 / (a * a * a)).kJ * C.Mpc;
  }
  // Jeans masses (Msun) under the definitions in use, in the comoving density rhoM (Msun Mpc^-3; mean matter by
  // default); lambda_J = 2 pi/k_J. halfWave, a sphere of diameter lambda_J, is Hui, Ostriker, Tremaine & Witten's
  // (2017) definition, M_J = (4/3) pi rho (lambda_J/2)^3 in the wave's own density (their eq. jeans, as #35's review
  // read it in the arXiv source; first seen quoted in search text).
  function jeansMasses(bg, kJ, rhoM = bg.rhoM) {
    const lam = 2 * Math.PI / kJ, V = r => 4 * Math.PI / 3 * r * r * r * rhoM;
    return { halfWave: V(lam / 2), fullWave: V(lam), inverseK: V(1 / kJ), cube: rhoM * lam * lam * lam };
  }
  // The soliton (a halo's core) from the Schroedinger-Poisson ground state in the Witness Map's units (its SOL: half-
  // density radius xc, mass Ic inside it and I in all, in units hbar = m = 4 pi G rho_c = 1). Masses times the
  // half-density radius r_c, in units of hbar^2/(G m^2): the same combination that sets a gravitational atom's size.
  function solitonRelation(SOL) {
    return { coreRc: SOL.Ic * SOL.xc, totalRc: SOL.I * SOL.xc, coreShare: SOL.Ic / SOL.I };
  }
  const hbar2Gm2 = (mEV, K = C) => K.hbar * K.hbar / (K.G * Math.pow(mEV * K.eV, 2)); // kg m

  // ---- Subhalos. Springel et al. 2008 (Aquarius, MNRAS 391, 1685) fit dN/dM = a0 (M/m0)^-n for Aq-A-1 within
  // r50 = 433 kpc (host M200 = 1.84e12 Msun): a0 = 3.26e-5 Msun^-1, m0 = 2.52e7 Msun, n = 1.9; and the same law scaled
  // to a 1e12 Msun host within 353 kpc, a0 = 1.77e-5 (both as quoted by Erkal et al. 2016, arXiv:1606.04946; #35's
  // review found Aq-A's in Springel et al. directly). m50, the mass inside r50: Aq-A's 2.52e12 Msun (their Table 1,
  // recalled; it gives the mu of 0.0195 against M50 that #35's review found), scaled with the host.
  const AQUARIUS = { a0: 3.26e-5, m0: 2.52e7, n: 1.9, host: 1.84e12, r: 433, m50: 2.52e12 };
  const AQUARIUS_MW = { a0: 1.77e-5, m0: 2.52e7, n: 1.9, host: 1e12, r: 353, m50: 2.52e12 / 1.84 };
  const subhaloCount = (Mmin, Mmax = Infinity, s = AQUARIUS_MW) =>
    s.a0 * s.m0 / (s.n - 1) * (Math.pow(Mmin / s.m0, 1 - s.n) - (isFinite(Mmax) ? Math.pow(Mmax / s.m0, 1 - s.n) : 0));
  const subhaloMass = (Mmin, Mmax, s = AQUARIUS_MW) =>
    s.a0 * s.m0 * s.m0 / (2 - s.n) * (Math.pow(Mmax / s.m0, 2 - s.n) - Math.pow(Mmin / s.m0, 2 - s.n));
  // The largest subhalo to expect, N(>M) = 1, as a fraction mu of its host's M200 (of its M50 with {m50: true}).
  const muAquarius = (s = AQUARIUS_MW, { m50 = false } = {}) => s.m0 * Math.pow(s.a0 * s.m0 / (s.n - 1), 1 / (s.n - 1)) / (m50 ? s.m50 : s.host);
  // Decades of mass between a floor and a host, and levels of nesting if each level is a factor mu below its host:
  // levels (whole), exact (the fraction dec/log10(1/mu), for each mu). suppressed: the levels at mu = muAquarius() if,
  // below the first, each level's subhalos are a factor f = 2 or 3 fewer than the self-similar count (Springel et al.'s
  // sub-subhalos). N(>M) ~ M^-(n-1), so each of those levels is mu f^(-1/(n-1)) of its host.
  const nesting = (floor, host = MW, mus = [0.1, 0.01, muAquarius()]) => {
    const dec = Math.log10(host / floor), d1 = -Math.log10(muAquarius());
    const suppressed = [2, 3].map(f => (dec < d1 ? 0 : 1 + Math.floor((dec - d1) / (d1 + Math.log10(f) / (AQUARIUS_MW.n - 1)))));
    return { decades: dec, levels: mus.map(mu => Math.max(0, Math.floor(dec / -Math.log10(mu)))), exact: mus.map(mu => dec / -Math.log10(mu)), suppressed };
  };

  const api = { C, PLANCK18, WMAP_ERA, DELTA_C, MW, R_NU, HOM, background, massOfK, radiusOfMass,
    wimpGHS, wimpT, decoupling, wimpFreeStream, acousticMass, wimpFloor, fdmHBG, schiveM0, BOUNDS, CDM, gaussianOf, halfMode,
    model, radiationEra, smallScaleTail, jeans, kJcomoving, jeansMasses, solitonRelation, hbar2Gm2,
    AQUARIUS, AQUARIUS_MW, subhaloCount, subhaloMass, muAquarius, nesting };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.HALOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
