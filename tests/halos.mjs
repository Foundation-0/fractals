// Checks the halos model against published numbers, exact results and its neighbours in the repository. Run: npm test.
// Each check states the source, the published or expected value, the model's value and the tolerance. "As seen in
// search text" marks a value read in a search result or abstract, not in the paper itself. NOTE lines compare without
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
const GHS = 'Green, Hofmann & Schwarz, JCAP 0508, 003 (2005), arXiv:astro-ph/0503387';

// 1. The spectrum the floors sit on: Eisenstein & Hu's no-wiggle transfer function extrapolated to 1e10 h/Mpc,
//    twenty decades in mass below where it was fitted. Two checks of the integration, then the extrapolation itself.
{
  const c = H.HOM.cosmology(P18, { nk: 4000 }), Mr = 4 * Math.PI / 3 * bg.rhoM * Math.pow(1 / h, 3);
  near('sigma(R = 1 Mpc/h): this grid against homogeneity.js (with the baryon wiggles, k up to 100 h/Mpc)', md.sigma(Mr), c.sigma(1), 0.02,
    'consistency with cosmic-homogeneity/homogeneity.js');
  const fine = H.model(P18, { perDecade: 400, kmax: 1e12 });
  near('sigma at the bino half-mode mass: 60 points per decade to 1e10 h/Mpc against 400 to 1e12', md.sigma(Mhm, bino), fine.sigma(Mhm, bino), 2e-3, 'numerical convergence');
}
//    A mode that enters the horizon in the radiation era kicks the dark matter logarithmically. With the neutrinos
//    a perfect fluid the asymptote is known exactly; with them streaming freely it is not, and Eisenstein & Hu fitted
//    a Boltzmann code that let them stream. Modes entering before neutrino decoupling see the fluid case instead.
const fluid = H.radiationEra({ free: false }), freeNu = H.radiationEra({ lmax: 60, xmax: 800 });
const tailFluid = H.smallScaleTail(bg, fluid), tailFree = H.smallScaleTail(bg, freeNu), noB = H.HOM.transferEH({ ...P18, Ob: 1e-7 });
check('Radiation era, neutrinos a perfect fluid: delta_c -> -A ln(B k tau) with A = 9 psi0 and B = e^(gamma_E - 1/2)/sqrt3 (to 1e-3)',
  Math.abs(fluid.A / fluid.psi0 / 9 - 1) < 1e-3 && Math.abs(fluid.B / (Math.exp(0.5772156649 - 0.5) / Math.sqrt(3)) - 1) < 1e-3,
  `A/psi0 = ${(fluid.A / fluid.psi0).toFixed(5)}, B = ${fluid.B.toFixed(5)} (exact 9 and ${(Math.exp(0.5772156649 - 0.5) / Math.sqrt(3)).toFixed(5)})`,
  'closed form for the equation integrated (derivation in model.js); Ma & Bertschinger, ApJ 455, 7 (1995), for the equations');
const ratio = (k, tail) => noB.Tnw(k) / tail.T(k * h);
check("Eisenstein & Hu's tail, baryons removed, within 3% of the free-streaming-neutrino tail from 1e3 to 1e9 h/Mpc",
  [1e3, 1e6, 1e9].every(k => Math.abs(ratio(k, tailFree) - 1) < 0.03),
  `EH/derived ${[1e3, 1e6, 1e9].map(k => `${ratio(k, tailFree).toFixed(3)} at ${fmt(k)}`).join(', ')}; derived tail ${tailFree.coef.toFixed(2)} (k_eq/k)^2 ln(${tailFree.c.toFixed(4)} k/k_eq)`,
  'Eisenstein & Hu, ApJ 496, 605 (1998), eqs. 26-31, fitted to a Boltzmann code with free-streaming neutrinos');
check('With the neutrinos still a fluid at horizon entry the tail is 8-12% below Eisenstein & Hu at k >= 1e5 h/Mpc',
  [1e5, 1e7, 1e9].every(k => ratio(k, tailFluid) > 1.08 && ratio(k, tailFluid) < 1.12),
  `EH/fluid ${[1e5, 1e7, 1e9].map(k => `${ratio(k, tailFluid).toFixed(3)} at ${fmt(k)}`).join(', ')}: bino-scale modes entered before the neutrinos decoupled, so EH overstates them`,
  'model (sign of the neutrino effect)');

// 2. The WIMP floor (100 GeV bino, kinetic decoupling at 30 MeV unless stated).
{
  const derived = H.wimpFreeStream(bg, { m: 100, Tkd: 30 });
  near('Free-streaming wavenumber derived from the coasting distance after kinetic decoupling (Mpc^-1)', derived.kfs, 1.70e6, 0.05,
    'Green, Hofmann & Schwarz, astro-ph/0508553: k_fs = 1.70e6 Mpc^-1, as seen in search text');
}
within('Bino cut-off mass, a sphere of radius pi/k_fs (Msun)', H.massOfK(bg, bino.kfs), 1e-6, 2, GHS + ': "about 1e-6 Msun", as seen in the abstract');
within('Collisional damping mass, radius pi/k_d (Msun)', H.massOfK(bg, bino.kd), 1e-10, 2, 'Green, Hofmann & Schwarz, astro-ph/0508553: about 1e-10 Msun, as seen in search text');
{
  const lz = H.acousticMass(bg, 10), Tc = 50 / Math.pow(H.G_KD, 0.25), cps = H.acousticMass(bg, Tc);
  check('Acoustic mass, the dark matter inside the horizon at kinetic decoupling, against two published scalings',
    lz / 1e-4 < 1.5 && lz / 1e-4 > 1 / 1.5 && cps / 3.4e-6 < 2 && cps / 3.4e-6 > 0.5,
    `${fmt(lz)} Msun at 10 MeV (Loeb & Zaldarriaga 1e-4 (T/10 MeV)^-3, within x1.5); ${fmt(cps)} at T g^(1/4) = 50 MeV (Cornell et al. 3.4e-6, within x2)`,
    'Loeb & Zaldarriaga, PRD 71, 103520 (2005); Cornell, Profumo & Shepherd, PRD 88, 015027 (2013), eq. 14; both as seen in search text');
}

// 3. The wave floor. Hu, Barkana & Gruzinov's Jeans scale and cut-off, and the conventions behind the numbers quoted.
const kJeq = H.kJcomoving(bg, 1, bg.aeq);
near('Comoving Jeans wavenumber at matter-radiation equality, 1e-22 eV, mean matter density (Mpc^-1)', kJeq, 9, 0.05,
  'Hu, Barkana & Gruzinov, PRL 85, 1158 (2000): k_J,eq = 9 m22^(1/2) Mpc^-1, as seen in search text');
{
  const rhoDM = 0.12 * bg.rhoCrit, k0 = H.kJcomoving(bg, 1, 1, { rho0: rhoDM }), kM = H.kJcomoving(bg, 1, 1);
  near('Jeans wavenumber today, 1e-22 eV, in a density of 0.12 rho_crit/h^2 (the dark matter alone) (Mpc^-1)', k0, 66.5, 0.005,
    `Marsh, Phys. Rep. 643, 1 (2016), k_J = 66.5 a^(1/4) (Omega h^2/0.12)^(1/4) m22^(1/2), as quoted by Kulkarni & Ostriker (arXiv:2011.02116), seen in search text; all matter gives ${kM.toFixed(1)}`);
}
{
  const fdm = H.fdmHBG(1), k2 = H.halfMode(fdm, { power: true }), k2b = H.halfMode(H.fdmHBG(200), { power: true });
  check("Hu, Barkana & Gruzinov's half-power wavenumber, T^2 = 1/2: 4.5 m22^(4/9) Mpc^-1",
    Math.abs(k2 / 4.5 - 1) < 0.03 && Math.abs(k2b / k2 / Math.pow(200, 4 / 9) - 1) < 1e-6,
    `${k2.toFixed(3)} at m22 = 1 (within 3%); ${(k2b / k2).toFixed(3)} between m22 = 200 and 1 against 200^(4/9) = ${Math.pow(200, 4 / 9).toFixed(3)}`,
    'Hu, Barkana & Gruzinov (2000), as seen in search text');
}
{
  const J0 = H.jeansMasses(bg, H.kJcomoving(bg, 1, 1));
  within('Jeans mass today, 1e-22 eV, a sphere of diameter lambda_J (Msun): a lower bound on any halo, not the floor of the halo population',
    J0.halfWave, 1e7, 2, 'Hui, Ostriker, Tremaine & Witten, PRD 95, 043541 (2017): about 1e7 m22^(-3/2) Msun, as seen in the abstract');
}
{ // The Witness Map's wave clock m dx^2/hbar across dx = 1/k_J is gravity's clock, with the Witness Map's constants.
  let worst = 0;
  for (const rho of [bg.rhoMsi, bg.rhoMsi / Math.pow(bg.aeq, 3), 0.4 * WM.GEV_CM3]) for (const m22 of [1, 20, 200]) {
    const J = H.jeans(m22 * 1e-22, rho, WM.C);
    worst = Math.max(worst, Math.abs(J.tWave / J.tGrav - 1), Math.abs(J.kJ / J.closed - 1));
  }
  check('The wave clock at 1/k_J equals 1/(4 sqrt(pi G rho)), k_J found as the root of omega^2(k) = 0', worst < 1e-12,
    `worst relative deviation ${worst.toExponential(1)} over 3 densities and 3 masses, Witness Map constants`, 'algebra (a check of units and numerics, not of physics)');
}
{ // The smallest wave structure: the soliton, the Schroedinger-Poisson ground state the Witness Map already solves.
  const s = H.solitonRelation(WM.SOL), unit = H.hbar2Gm2(1e-23, WM.C) / (WM.C.Msun * WM.C.kpc / 1e3);
  near('Soliton: mass inside the half-density radius times that radius, m = 1e-23 eV (Msun pc)', s.coreRc * unit, 5.5e12, 0.05,
    `Schive, Chiueh & Broadhurst, Nature Phys. 10, 496 (2014), 5.5e12 m23^-2 Msun pc, as restated in arXiv:2603.07175, seen in search text; here ${s.coreRc.toFixed(3)} hbar^2/(G m^2)`);
}

// 4. Counting the nesting: Springel et al.'s Aquarius subhalo law extended to the floor.
near('Aquarius normalisation scaled from the 1.84e12 Msun Aq-A to a 1e12 Msun host', H.AQUARIUS.a0 * 1e12 / H.AQUARIUS.host, H.AQUARIUS_MW.a0, 0.01,
  'Erkal et al., arXiv:1606.04946 (2016), quoting Springel et al., MNRAS 391, 1685 (2008), seen in search text (consistency of the quoted pair)');
{
  const nMW = H.subhaloCount(1e-6), nAq = H.subhaloCount(1e-6, Infinity, H.AQUARIUS);
  check('Earth-mass halos in the Galaxy: dN/dM ~ M^-1.9 from above 1e5 Msun down to 1e-6 Msun gives about 1e15',
    [nMW, nAq].every(n => n / 1e15 < 3 && 1e15 / n < 3), `${fmt(nMW)} (1e12 Msun host, 353 kpc), ${fmt(nAq)} (Aq-A, 433 kpc), within x3 of 1e15; tidal losses ignored`,
    'Diemand, Moore & Stadel, Nature 433, 389 (2005): "over 10^15" survive in the Galactic halo, as seen in the arXiv abstract');
}
{ // Where the levels come from: each level's largest subhalo, where the Aquarius law expects one, N(>M) = 1.
  const mu = H.muAquarius(), muAq = H.muAquarius(H.AQUARIUS);
  note('Levels Aquarius itself resolves', `the largest expected subhalo is mu = ${mu.toFixed(4)} of its host (${(-Math.log10(mu)).toFixed(2)} decades per level); ` +
    `four levels below Aq-A's 1.84e12 Msun reach ${fmt(H.AQUARIUS.host * Math.pow(muAq, 4))} Msun; published: "up to four generations" of subhalos within subhalos`,
    'Springel et al. (2008), abstract, as seen in search text');
}

// 5. When the first halos form: the published z = 60 +- 20 against this model (a comparison, not a check: the
//    cosmology and the definition behind the published number were not seen).
{
  const zP = [1, 2].map(nu => md.zc(Mhm, bino, { nu })), zLag = [true, 'cdm'].map(baryonLag => md.zc(Mhm, bino, { baryonLag }));
  const wm = H.model(H.WMAP_ERA, { perDecade: 60 }), MhmW = H.massOfK(wm.bg, H.halfMode(bino));
  note('Bino first halos: published z = 60 +- 20',
    `Planck 2018: 1 sigma z_c = ${zP[0].toFixed(1)} (${zLag.map(z => z.toFixed(1)).join('-')} with the dark matter lagging the gas), 2 sigma ${zP[1].toFixed(1)}; ` +
    `WMAP-era round numbers (n_s = 1, sigma8 = 0.9): 1 sigma ${wm.zc(MhmW, bino).toFixed(1)}, 2 sigma ${wm.zc(MhmW, bino, { nu: 2 }).toFixed(1)}`, GHS + ', as seen in the abstract');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
