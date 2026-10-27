// Checks the halos model against published numbers, exact results and its neighbours in the repository. Run: npm test.
// Each check states the source, the published or expected value, the model's value and the tolerance. "As seen in
// search text" marks a value the authors read in a search result or abstract, not in the paper itself. "Checked in
// review" marks one that the independent review of #35 then read in the paper's arXiv source (with the equation or
// section it names); "as #35's review read it" marks one taken from that reading alone. NOTE lines compare without
// passing or failing.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const H = require('../halos/model.js');
const WM = require('../witness-map/model.js');

let fails = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  expected ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function near(name, got, want, rel, src) {
  const ok = Math.abs(got / want - 1) <= rel;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${got.toPrecision(5)}  expected ${want.toPrecision(5)}  (within ${rel * 100}%)  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const note = (name, detail, src) => console.log(`NOTE  ${name}\n      ${detail}  ${src}`);

const P18 = H.PLANCK18, md = H.model(P18, { perDecade: 60 }), bg = md.bg, h = P18.h;
const bino = H.wimpGHS({ m: 100, Tkd: 30 }), Mhm = H.massOfK(bg, H.halfMode(bino));
const GHS = 'Green, Hofmann & Schwarz, JCAP 0508, 003 (2005), arXiv:astro-ph/0503387', GHS04 = 'Green, Hofmann & Schwarz, MNRAS 353, L23 (2004)';

// 1. The spectrum sigma(M) and the collapse redshifts sit on: Eisenstein & Hu's no-wiggle transfer function extrapolated
//    to 1e10 h/Mpc, twenty decades in mass below where it was fitted. Two checks of the integration, then the
//    extrapolation itself.
{ // sigma(1 Mpc/h)/sigma8 by a direct quadrature with the exact top-hat window (the grid phase-averages W^2 at kR > 10).
  const n = 400000, l0 = Math.log(1e-5), l1 = Math.log(1e3), dl = (l1 - l0) / n, W2 = x => { const w = 3 * (Math.sin(x) - x * Math.cos(x)) / (x * x * x); return w * w; };
  let s1 = 0, s8 = 0;
  for (let i = 0; i < n; i++) { const k = Math.exp(l0 + (i + 0.5) * dl), d = Math.pow(k, 3 + P18.ns) * Math.pow(md.tf.Tnw(k), 2); s1 += d * W2(k); s8 += d * W2(8 * k); }
  const Mr = 4 * Math.PI / 3 * bg.rhoM * Math.pow(1 / h, 3);
  near('sigma(R = 1 Mpc/h)/sigma8: the 60-per-decade grid against a direct quadrature with the exact window', md.sigma(Mr) / P18.sigma8, Math.sqrt(s1 / s8), 1e-3,
    'numerical (400,000 points in ln k)');
  const fine = H.model(P18, { perDecade: 400, kmax: 1e12 });
  near('sigma at the bino half-mode mass: 60 points per decade to 1e10 h/Mpc against 400 to 1e12', md.sigma(Mhm, bino), fine.sigma(Mhm, bino), 2e-5, 'numerical convergence');
}
//    A mode that enters the horizon in the radiation era kicks the dark matter logarithmically. With the neutrinos
//    a perfect fluid the asymptote is known exactly; with them streaming freely it is not, and Eisenstein & Hu fitted
//    a Boltzmann code that let them stream. Modes entering before neutrino decoupling see the fluid case instead.
const fluid = H.radiationEra({ free: false }), freeNu = H.radiationEra({ lmax: 60, xmax: 800 });
const tailFluid = H.smallScaleTail(bg, fluid), tailFree = H.smallScaleTail(bg, freeNu), noB = H.HOM.transferEH({ ...P18, Ob: 1e-7 });
check('Radiation era, neutrinos a perfect fluid: delta_c -> -A ln(B k tau) with A = 9 psi0 and B = e^(gamma_E - 1/2)/sqrt3 (to 1e-3)',
  Math.abs(fluid.A / fluid.psi0 / 9 - 1) < 1e-3 && Math.abs(fluid.B / (Math.exp(0.5772156649 - 0.5) / Math.sqrt(3)) - 1) < 1e-3,
  `A/psi0 = ${(fluid.A / fluid.psi0).toFixed(5)}, B = ${fluid.B.toFixed(5)} (exact 9 and ${(Math.exp(0.5772156649 - 0.5) / Math.sqrt(3)).toFixed(5)})`,
  'closed form, derived in model.js above radiationEra(); Ma & Bertschinger, ApJ 455, 7 (1995), for the equations');
const ratio = (k, tail) => noB.Tnw(k) / tail.T(k * h);
check("Eisenstein & Hu's tail, baryons removed, within 3% of the free-streaming-neutrino tail from 1e3 to 1e9 h/Mpc",
  [1e3, 1e6, 1e9].every(k => Math.abs(ratio(k, tailFree) - 1) < 0.03),
  `EH/derived ${[1e3, 1e6, 1e9].map(k => `${ratio(k, tailFree).toFixed(3)} at ${fmt(k)}`).join(', ')}; derived tail ${tailFree.coef.toFixed(2)} (k_eq/k)^2 ln(${tailFree.c.toFixed(4)} k/k_eq)`,
  'Eisenstein & Hu, ApJ 496, 605 (1998), eqs. 26-31, fitted to a Boltzmann code with free-streaming neutrinos');
note('With the neutrinos still a fluid when the mode enters, the tail is lower than Eisenstein & Hu',
  `EH/fluid ${[1e5, 1e7, 1e9].map(k => `${ratio(k, tailFluid).toFixed(3)} at ${fmt(k)}`).join(', ')}: bino-scale modes entered before the neutrinos decoupled, so EH overstates them by about 10%`,
  'model only: no published value');

// 2. The WIMP floor (100 GeV bino, kinetic decoupling at 30 MeV unless stated).
{
  const derived = H.wimpFreeStream(bg, { m: 100, Tkd: 30 });
  near('Free-streaming wavenumber derived from the coasting distance after kinetic decoupling, through the thermal history (Mpc^-1)', derived.kfs, 1.70e6, 0.05,
    'Green, Hofmann & Schwarz, astro-ph/0508553 and JCAP 0508, 003 (2005): k_fs = 1.70e6 Mpc^-1, as seen in search text; checked in review, with the same sqrt2 ' +
    '(this checks k_fs = sqrt2/s through this model\'s thermal history)');
}
within('Bino cut-off mass, a sphere of radius pi/k_fs (Msun)', H.massOfK(bg, bino.kfs), 1e-6, 2, GHS + ': "about 1e-6 Msun", as seen in the abstract; ' +
  'checked in review, which found the sphere of radius pi/k_fs to be their stated definition (' + GHS04 + ', gives 9e-7 for its model A)');
within('Collisional damping mass, a sphere of radius pi/k_d (Msun)', H.massOfK(bg, bino.kd), 1e-10, 2,
  GHS + ': "M_d ~ 1e-10 Msun" for a sphere of radius pi/k_d; ' + GHS04 + ': 9e-11 at T_kd = 33 MeV; both as #35\'s review read them in the arXiv source');
{ // Cornell et al. write M_ao with the dark matter density rho_chi, f_c of the matter density used here.
  const lz = H.acousticMass(bg, 10), m30 = H.acousticMass(bg, 30), g30 = H.decoupling(bg, 30).g, cps = 3.4e-6 * Math.pow(30 * Math.pow(g30, 0.25) / 50, -3);
  const chi30 = bg.fc * m30;
  check('Acoustic mass, the mass inside the horizon at kinetic decoupling, against two published scalings',
    lz / 1e-4 < 1.5 && lz / 1e-4 > 1 / 1.5 && chi30 / cps < 2 && chi30 / cps > 0.5,
    `${fmt(lz)} Msun of matter at 10 MeV against Loeb & Zaldarriaga's 1e-4 (T/10 MeV)^-3 (within x1.5); at 30 MeV, the dark matter alone, as Cornell et al. count it, ` +
    `${fmt(chi30)} (${(chi30 / cps).toFixed(2)} times theirs; all matter ${fmt(m30)}, ${(m30 / cps).toFixed(2)} times) against their 3.4e-6 (T g^(1/4)/50 MeV)^-3 = ${fmt(cps)} ` +
    `with this model's g = ${g30.toFixed(2)} (within x2)`,
    'Loeb & Zaldarriaga, PRD 71, 103520 (2005); Cornell, Profumo & Shepherd, PRD 88, 015027 (2013), eq. 14, with rho_chi; both as seen in search text, checked in review');
}

// 3. The wave floor. Hu, Barkana & Gruzinov's Jeans scale and cut-off, and the conventions behind the numbers quoted.
const kJeq = H.kJcomoving(bg, 1, bg.aeq);
near('Comoving Jeans wavenumber at matter-radiation equality, 1e-22 eV, mean matter density (Mpc^-1)', kJeq, 9, 0.05,
  'Hu, Barkana & Gruzinov, PRL 85, 1158 (2000): k_J,eq = 9 m22^(1/2) Mpc^-1, as seen in search text; checked in review');
{
  const rhoDM = 0.12 * bg.rhoCrit, k0 = H.kJcomoving(bg, 1, 1, { rho0: rhoDM }), kM = H.kJcomoving(bg, 1, 1);
  near('Jeans wavenumber today, 1e-22 eV, in a density of 0.12 rho_crit/h^2 (the dark matter alone) (Mpc^-1)', k0, 66.5, 0.005,
    `Marsh, Phys. Rep. 643, 1 (2016), eq. axion_jeans: k_J = 66.5 a^(1/4) (Omega_a h^2/0.12)^(1/4) m22^(1/2), as quoted by Kulkarni & Ostriker (arXiv:2011.02116), ` +
    `seen in search text; checked in review, Omega_a the axion density; all matter gives ${kM.toFixed(1)}`);
}
near("Hu, Barkana & Gruzinov's half-power wavenumber, T^2 = 1/2, at 1e-22 eV (Mpc^-1)", H.halfMode(H.fdmHBG(1), { power: true }), 4.5, 0.03,
  'Hu, Barkana & Gruzinov (2000): 4.5 m22^(4/9) Mpc^-1, as seen in search text; checked in review');
{ // Hui et al. normalise to the wave's own density, Omega_FDM = 0.27 with h = 0.7.
  const toM = rho => rho * Math.pow(H.C.Mpc, 3) / H.C.Msun, MJ = rho => H.jeansMasses(bg, H.kJcomoving(bg, 1, 1, { rho0: rho }), toM(rho)).halfWave;
  const Oc = P18.Om - P18.Ob, hui = 1.5e7 * Math.pow(Oc / 0.27, 0.25) * Math.sqrt(h / 0.7);
  near('Jeans mass today, 1e-22 eV, a sphere of diameter lambda_J in Omega_FDM = 0.27, h = 0.7 (Msun): a lower bound on any halo, not the floor of the halo population',
    MJ(0.27 * 0.7 * 0.7 * bg.rhoCrit), 1.5e7, 0.01, 'Hui, Ostriker, Tremaine & Witten, PRD 95, 043541 (2017), eq. jeans: M_J = (4/3) pi rho (lambda_J/2)^3 = ' +
    '1.5e7 (Omega_FDM/0.27)^(1/4) (H0/70)^(1/2) m22^(-3/2) Msun, as quoted in arXiv:2106.02526, seen in search text; checked in review. ' +
    `At this model's cosmology: dark matter alone ${fmt(MJ(Oc * h * h * bg.rhoCrit))}, their formula ${fmt(hui)}; all matter ${fmt(MJ(bg.rhoMsi))}`);
}
{ // The Witness Map's wave clock m dx^2/hbar across dx = 1/k_J is gravity's clock, with the Witness Map's constants.
  let worst = 0;
  for (const rho of [bg.rhoMsi, bg.rhoMsi / Math.pow(bg.aeq, 3), 0.4 * WM.GEV_CM3]) for (const m22 of [1, 20, 200]) {
    const J = H.jeans(m22 * 1e-22, rho, WM.C);
    worst = Math.max(worst, Math.abs(J.tWave / J.tGrav - 1), Math.abs(J.kJ / J.closed - 1));
  }
  check('The wave clock at 1/k_J equals 1/(4 sqrt(pi G rho)), k_J found as the root of omega^2(k) = 0', worst < 1e-12,
    `worst relative deviation ${worst.toExponential(1)} over 3 densities and 3 masses (tolerance 1e-12)`,
    'algebra: an identity for any constants, so this checks only the bisection root against the closed form');
}
{ // The smallest wave structure: the soliton, the Schroedinger-Poisson ground state the Witness Map already solves.
  const s = H.solitonRelation(WM.SOL), unit = H.hbar2Gm2(1e-23, WM.C) / (WM.C.Msun * WM.C.kpc / 1e3);
  near('Soliton: mass inside the half-density radius times that radius, m = 1e-23 eV (Msun pc)', s.coreRc * unit, 5.5e12, 0.05,
    'Schive, Chiueh & Broadhurst, Nature Phys. 10, 496 (2014), Supplementary Information: the core mass-radius relation M_c ~ 5.5e9 m23^-2 (r_c/kpc)^-1 Msun, ' +
    'as #35\'s review read it (first seen restated in arXiv:2603.07175, which credits it to PRL 113, 261302; that paper does not contain it); ' +
    `here ${s.coreRc.toFixed(3)} hbar^2/(G m^2); their fitted profile, integrated to r_c, gives 5.3e12 (halos/table.mjs)`);
}

// 4. Counting the nesting: Springel et al.'s Aquarius subhalo law extended to the floor.
near('Aquarius normalisation scaled from the 1.84e12 Msun Aq-A to a 1e12 Msun host', H.AQUARIUS.a0 * 1e12 / H.AQUARIUS.host, H.AQUARIUS_MW.a0, 0.01,
  'Erkal et al., MNRAS 463, 102 (2016), quoting Springel et al., MNRAS 391, 1685 (2008), seen in search text; Aq-A\'s checked in review (a guard on the transcribed pair)');
{ // Diemand, Moore & Stadel: "over 10^15" survive; their own m^-1.9 law, extrapolated, gives about 5e15 above 1e-6 Msun.
  const nMW = H.subhaloCount(1e-6), nAq = H.subhaloCount(1e-6, Infinity, H.AQUARIUS), DMS = 'Diemand, Moore & Stadel, Nature 433, 389 (2005)';
  check('Earth-mass halos in Aq-A: the Aquarius law down to 1e-6 Msun, tides ignored, holds at least the "over 10^15" that survive',
    nAq >= 1e15, `Aq-A (1.84e12 Msun, within 433 kpc) ${fmt(nAq)}, ${((nAq / 1e15 - 1) * 100).toFixed(0)}% above 1e15`,
    DMS + ': "over 10^15" survive in the Galactic halo, as seen in the arXiv abstract; checked in review');
  note('Earth-mass halos, like for like: the Aquarius law against Diemand, Moore & Stadel\'s own m^-1.9 law, both without tides',
    `above 1e-6 Msun: Aq-A ${fmt(nAq)}, ${(5e15 / nAq).toFixed(1)} times fewer than 5e15; a 1e12 Msun host (within 353 kpc) ${fmt(nMW)}, ${(5e15 / nMW).toFixed(1)} times fewer ` +
    '(their host mass is not given)', DMS + ', body text after Fig. 3: N(>1e-6 Msun) ~ 5e15, as #35\'s review read it in the arXiv source');
}
{ // Where the levels come from: each level's largest subhalo, where the Aquarius law expects one, N(>M) = 1.
  const mu = H.muAquarius(), muAq = H.muAquarius(H.AQUARIUS);
  note('Levels Aquarius itself resolves', `the largest expected subhalo is mu = ${mu.toFixed(4)} of a 1e12 Msun host's M200 (${(-Math.log10(mu)).toFixed(2)} decades per level), ` +
    `${muAq.toFixed(4)} of Aq-A's; four levels at that ratio below Aq-A's 1.84e12 Msun reach ${fmt(H.AQUARIUS.host * Math.pow(muAq, 4))} Msun; published: "up to four generations" of subhalos within subhalos, ` +
    'and sub-subhalos "a factor of 2 or 3 below" the self-similar count, which "provides an upper limit"',
    'Springel et al. (2008), abstract, as seen in search text; Sec. 4, as #35\'s review read it');
}

// 5. When the bino's fluctuations go nonlinear. Green, Hofmann & Schwarz's z = 60 +- 20 is z_nl, where typical
//    fluctuations reach sigma(R, z_nl) = 1 (top hat, sigma8 = 0.9, n = 1, baryons ignored), not this model's 1.686.
//    A comparison, not a check: the rest of their calculation is not this one, and a factor of about 1.3 in 1 + z
//    remains.
{
  const nl = m => [H.halfMode(bino), bino.kfs].map(k => m.zc(H.massOfK(m.bg, k), bino, { delta: 1 }).toFixed(1)).join('-');
  const wm = H.model(H.WMAP_ERA, { perDecade: 60 }), ghsLike = H.model({ ...H.WMAP_ERA, Ob: 1e-7 }, { perDecade: 60 }), z0 = ghsLike.zc(H.massOfK(ghsLike.bg, bino.kfs), bino, { delta: 1 });
  note('Bino: onset of nonlinearity for typical fluctuations, sigma(M, z_nl) = 1 at M_hm to M(pi/k_fs): published z_nl = 60 +- 20',
    `Planck 2018 ${nl(md)}; WMAP-era round numbers (h = 0.7, Omega_m = 0.3, n_s = 1, sigma8 = 0.9) ${nl(wm)}; the same without baryons ${nl(ghsLike)}, ` +
    `inside their range, (1 + 60)/(1 + z_nl) = ${(61 / (1 + z0)).toFixed(2)}; this model's first halos (1 sigma, 1.686, M_hm) collapse at z = ${md.zc(Mhm, bino).toFixed(1)}`,
    GHS + ', section "The first structures", as #35\'s review read it in the arXiv source');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
