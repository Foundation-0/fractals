// Checks the orbits study (orbits/model.js) against published values and its own closed forms. Run: npm test.
// Each check prints the source, the published or expected value, the model's value and the tolerance. "Arithmetic" and
// "model-internal" mark checks of the code against a closed form or itself, not against nature. Sources were read in
// search results and abstracts only (orbits/README.md, Sources), except where a check says otherwise.
import { createRequire } from 'node:module';
const O = createRequire(import.meta.url)('../orbits/model.js');
const { C } = O;

let fails = 0;
const fmt = x => (Math.abs(x) >= 1e-3 && Math.abs(x) < 1e6 ? x.toPrecision(5) : x.toExponential(3));
function near(name, got, want, tol, src) {
  const ok = Number.isFinite(got) && Math.abs(got - want) <= tol;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  expected ${fmt(want)} +- ${fmt(tol)}  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}

// 1. Kepler's third law across the planets.
const JPL = 'JPL approximate elements, Table 1 (1800-2050); GM_sun IAU 2015 B3; masses DE430';
const mu = O.planetMassFraction(), ex = O.PLANETS.map(p => O.kepler(p).excess), big = Math.max(...ex.map(Math.abs));
check('n^2 a^3 = GM_sun for every planet, to within the planets\' total mass over the Sun\'s', ex.every(x => Math.abs(x) <= mu),
  `largest |n^2 a^3 / GM_sun - 1| = ${fmt(big)} (${O.PLANETS[ex.map(Math.abs).indexOf(big)].name}); sum of m/M_sun = ${fmt(mu)}`, JPL);
near('Kepler\'s exponent: P ~ a^p over 0.39 to 30 au', O.keplerExponent(), 1.5, 1.5 * mu, `${JPL}; tolerance 3/2 times that mass fraction`);

// 2. Where a Kepler domain ends.
const kk = O.oortKepler(1), kf = O.oortFlat(1);
near('Point-mass host: 4A/Omega = 3', O.densityRatio(kk.A, kk.B), 3, 1e-12, 'arithmetic');
near('Flat rotation curve: 4A/Omega = 2', O.densityRatio(kf.A, kf.B), 2, 1e-12, 'arithmetic');
{
  const a = O.PLANETS[4].a * C.au, q = 1 / O.PLANETS[4].sunOver, o = O.oortKepler(Math.sqrt(C.GMsun / a ** 3) / C.kmskpc);
  near('Jacobi radius with point-mass Oort constants / Hill radius a (m/3M)^(1/3), for Jupiter', O.jacobi(C.GMsun * q, o.A, o.B) / O.hill(a, q), 1, 1e-12, 'model-internal');
}
near('The Sun\'s tidal radius in the Galaxy [1e5 au], from Bovy 2017\'s A = 15.3, B = -11.9 km/s/kpc', O.jacobi(C.GMsun, 15.3, -11.9) / C.au / 1e5, 2.8, 0.05,
  'Correa-Otto & Calandra 2019 (MNRAS 490, 2495): "r_J ~ 2.8 x 10^5 au"; tolerance the rounding of 2.8');

// 3. Sgr A*: S2's orbit and the stars around it.
const G20 = 'GRAVITY Collaboration 2020 (A&A 636, L5)';
const s2 = O.orbitOf(O.S2), s2M = O.orbitOf(O.S2, O.S2.M);
near('S2: Kepler\'s third law returns GRAVITY\'s fitted mass [1e6 M_sun]', s2.keplerMass / 1e6, O.S2.M / 1e6, 0.012,
  `${G20}, Table E.1; consistency with their own fit (tolerance its 0.012 error), not a measurement`);
near('S2: Schwarzschild precession per orbit [arcmin]', s2M.precessionArcmin, 12.1, 0.1, `${G20}, appendix B: "the 12.1' precession"`);
near('S2: pericentre distance [au]', s2M.periAU, 120, 5, `${G20}, abstract: "pericentre at 120 AU", rounded to 10 au`);
near('S2: speed at pericentre [km/s]', s2M.periSpeed, 7700, 50, `${G20}, abstract: "7700 km s^-1", rounded to 100 km/s`);
{
  const K = O.CUSP, M = O.SGRA.M, r2 = [K.M1hi, K.M1, K.M1lo].map(m => O.cuspRadius(2, M, m));
  check('The stars inside r weigh twice Sgr A* at 3 to 4 pc in the literature; the cusp model brackets it',
    r2[0] <= 3 && r2[2] >= 4,
    `model ${fmt(r2[0])} to ${fmt(r2[2])} pc (middle ${fmt(r2[1])}) for 0.5-1.5e6 M_sun inside 1 pc and density ~ r^-1.13`,
    'Alexander 2005 (3 pc), Feldmeier-Krause et al. 2017 (about 4 pc), Merritt 2013 (3.9 pc); inputs Schodel et al. 2009, 2018 (search text)');
  near('Kepler inside 0.1 pc of Sgr A*: dln v/dln r', O.cuspSlope(0.1, M), -0.5, 0.01, 'model (Sgr A* plus the cusp)');
}

// 4. The Galaxy.
const g = O.galaxy(), g0 = O.galaxy(O.MWP14, { bh: 0 });
near('MWPotential2014: v_c(8 kpc) without Sgr A* [km/s]', g0.v(8), 220, 1e-9, 'model-internal (the normalisation; parameters as in galpy\'s source)');
{
  const Rs = [5, 8.122, 15, 25], ve = R => 229.0 - 1.7 * (R - 8.122);
  const rel = Rs.map(R => (g.v(R) / g.v(8.122)) / (ve(R) / ve(8.122)) - 1);
  check('The shape of MWPotential2014\'s curve, v(R)/v(R0), within 5% of Eilers et al.\'s from 5 to 25 kpc', rel.every(r => Math.abs(r) < 0.05),
    `ratio to Eilers - 1 = ${rel.map(r => r.toFixed(3)).join(', ')} at ${Rs.join(', ')} kpc; the level differs by ${(g.v(8.122) / 229 - 1).toFixed(3)} (220 against 229 km/s)`,
    'Eilers et al. 2019 (ApJ 871, 120), linear fit; tolerance their 2-5% systematic uncertainty');
  const sl = Rs.map(R => g.slope(R)), se = Rs.map(R => -1.7 * R / ve(R));
  check('Flat, not Kepler, from 5 to 25 kpc: |dln v/dln R| < 0.25 in the model and in Eilers et al.\'s fit',
    sl.every(s => Math.abs(s) < 0.25) && se.every(s => Math.abs(s) < 0.25),
    `model ${sl.map(s => s.toFixed(3)).join(', ')}; Eilers ${se.map(s => s.toFixed(3)).join(', ')}; Kepler -0.5`, 'Eilers et al. 2019; model');
}

// 5. Thin disks: the planets' tilts to the invariable plane.
const SS = 'Souami & Souchay 2012 (A&A 543, A133), as quoted in search text; tolerance covers epoch and element differences';
near('Jupiter\'s inclination to the invariable plane [deg]', O.tiltToInvariable(O.PLANETS[4]), 0.3219, 0.01, SS);
near('Saturn\'s inclination to the invariable plane [deg]', O.tiltToInvariable(O.PLANETS[5]), 0.9254, 0.01, SS);

// 6. Hill's problem: which orbits a body keeps (20 turns of the host, 8 starting angles each).
{
  const K = O.HOST_KEPLER, fates = (h, a, n) => O.hillFates(h, a, [n], { nPhase: 8 }).escapes;
  const pro = [fates(K, 0.4, [0, 0, 1]), fates(K, 0.6, [0, 0, 1])], ret = [fates(K, 0.6, [0, 0, -1]), fates(K, 0.9, [0, 0, -1])];
  check('Point-mass host: prograde circular orbits kept at 0.4 r_H, lost by 0.6 (published limit about 0.5)', pro[0] === 0 && pro[1] >= 0.5,
    `fraction escaped ${pro[0].toFixed(2)} at 0.4 r_H, ${pro[1].toFixed(2)} at 0.6 r_H`,
    'Shen & Tremaine 2008 (about 0.5 r_H), Hamilton & Krivov 1997 (0.53 r_H): search text');
  check('Point-mass host: retrograde orbits kept at 0.6 r_H, lost by 0.9 (published limit about 0.7)', ret[0] === 0 && ret[1] >= 0.5,
    `fraction escaped ${ret[0].toFixed(2)} at 0.6 r_H, ${ret[1].toFixed(2)} at 0.9 r_H`,
    'Shen & Tremaine 2008 (about 0.7 r_H), Hamilton & Krivov 1997 (0.69 r_H): search text');
  const sun = O.hostDisk(15.3, -11.9, 0.10);
  near('The Sun in the Galaxy: (vertical tidal frequency / Omega)^2', sun.nu2, (4 * Math.PI * C.G * 0.1e9 + 2 * (15.3 ** 2 - 11.9 ** 2)) / 27.2 ** 2, 1e-12, 'arithmetic (Poisson\'s equation)');
  const dirs = O.sphere(12), iso = [0.3, 0.6].map(a => O.hillFates(sun, a, dirs, { nPhase: 2 }).escapes);
  check('The Sun keeps orbits facing every way at 0.3 r_J (0.85e5 au) and loses most by 0.6 r_J (1.7e5 au)', iso[0] === 0 && iso[1] >= 0.5,
    `fraction escaped ${iso[0].toFixed(2)} at 0.3 r_J, ${iso[1].toFixed(2)} at 0.6 r_J (12 directions x 2 angles)`,
    'model; the Oort cloud\'s outer edge is quoted at 1 to 2 x 10^5 au (Dones et al. 2004, as cited)');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall orbits checks pass');
process.exit(fails ? 1 : 0);
