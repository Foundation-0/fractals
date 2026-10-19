// Checks the orbits study (orbits/model.js) against published values and its own closed forms. Run: npm test.
// Each check prints the source, the published or expected value, the model's value and the tolerance. "Arithmetic" and
// "model-internal" mark checks of the code against a closed form or itself, not against nature; "model" marks a model
// result with no published value to compare. Sources were read in search results and abstracts only
// (orbits/README.md, Sources), except where a check says otherwise.
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
const JPL = 'JPL approximate elements, Table 1 (1800-2050; a copy of the file); GM_sun IAU 2015 B3; masses DE430';
const mu = O.planetMassFraction(), ex = O.PLANETS.map(p => O.kepler(p).excess), big = Math.max(...ex.map(Math.abs));
check('In this 1800-2050 fit, n^2 a^3 matches GM_sun for every planet to within the planets\' total mass over the Sun\'s',
  ex.every(x => Math.abs(x) <= mu),
  `largest |n^2 a^3 / GM_sun - 1| = ${fmt(big)} (${O.PLANETS[ex.map(Math.abs).indexOf(big)].name}); sum of m/M_sun = ${fmt(mu)}` +
  ' (an observed size, not a physical bound: smeared into rings, the planets\' pull alone gives up to 1.5e-3)', JPL);
{
  const xs = O.PLANETS.map(p => Math.log(p.a)), mx = xs.reduce((s, x) => s + x, 0) / xs.length;
  const tolP = 0.5 * mu * xs.reduce((s, x) => s + Math.abs(x - mx), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  near('Kepler\'s exponent: P ~ a^p over 0.39 to 30 au', O.keplerExponent(), 1.5, tolP,
    `${JPL}; tolerance 0.5 mu sum|dln a| / sum(dln a)^2, the most the first check allows: model-internal, implied by it but independent of GM_sun`);
}

// 2. Where a Kepler region ends.
{
  const g = O.galaxy(), oortAt = R => { // Oort constants from the model's own curve: A = (v/R - dv/dR)/2, B = -(v/R + dv/dR)/2
    const v = g.v(R), dv = v / R * g.slope(R);
    return { A: (v / R - dv) / 2, B: -(v / R + dv) / 2 };
  };
  const k = oortAt(1e-5);
  near('4A/Omega from the model Galaxy\'s curve 1e-5 kpc from Sgr A*, where a point mass rules: Hill\'s 3', O.densityRatio(k.A, k.B), 3, 0.005,
    'model-internal (densityRatio against the curve\'s own Oort constants)');
  const a = O.PLANETS[4].a * C.au, q = 1 / O.PLANETS[4].sunOver, o = O.oortKepler(Math.sqrt(C.GMsun / a ** 3) / C.kmskpc);
  near('Jacobi radius with point-mass Oort constants / Hill radius a (m/3M)^(1/3), for Jupiter', O.jacobi(C.GMsun * q, o.A, o.B) / O.hill(a, q), 1, 1e-12, 'model-internal');
}
near('The Sun\'s tidal radius in the Galaxy [1e5 au], from Bovy 2017\'s A = 15.3, B = -11.9 km/s/kpc', O.jacobi(C.GMsun, 15.3, -11.9) / C.au / 1e5, 2.8, 0.05,
  'Correa-Otto & Calandra 2019 (MNRAS 490, 2495): "r_J ~ 2.8 x 10^5 au", search text; tolerance the rounding of 2.8');

// 3. Sgr A*: S2's orbit and the stars around it.
const G20 = 'GRAVITY Collaboration 2020 (A&A 636, L5), read in a transcription';
const s2 = O.orbitOf(O.S2), s2M = O.orbitOf(O.S2, O.S2.M);
near('S2: Kepler\'s third law returns GRAVITY\'s fitted mass [1e6 M_sun]', s2.keplerMass / 1e6, O.S2.M / 1e6, 0.012,
  `${G20}, Table E.1; consistency with their own fit (tolerance its 0.012 error), not a measurement`);
near('S2: Schwarzschild precession per orbit [arcmin]', s2M.precessionArcmin, 12.1, 0.1,
  `${G20}, appendix B: "the 12.1' precession"; tolerance one unit in the last digit (the formula with their Table E.1 M, a, e gives 12.16')`);
near('S2: pericentre distance [au]', s2M.periAU, 120, 5, `${G20}, introduction: "pericentre at 120 AU", rounded to 10 au`);
near('S2: speed at pericentre [km/s]', s2M.periSpeed, 7700, 50, `${G20}, introduction: "7700 km s^-1", rounded to 100 km/s`);
{
  const K = O.CUSP, M = O.SGRA.M, r2 = [K.M1hi, K.M1, K.M1lo].map(m => O.cuspRadius(2, M, m));
  check('The stars inside r weigh twice Sgr A* at 3 to 4 pc in the literature; the cusp model brackets it',
    r2[0] <= 3 && r2[2] >= 4,
    `model ${fmt(r2[0])} to ${fmt(r2[2])} pc (middle ${fmt(r2[1])}) for 0.5-1.5e6 M_sun inside 1 pc and density ~ r^-1.13; radii past the 3 pc ` +
    'break extrapolate the cusp, where the density falls faster, so they are lower limits and the upper side holds a fortiori',
    'Alexander 2005 (3 pc, as cited), Feldmeier-Krause et al. 2017 (about 4 pc, with their M_BH of 3.0e6), GRAVITY Collaboration 2024 ' +
    '(3.9 pc in their models; definition from Merritt 2013); inputs Schodel et al. 2009, 2018; all search text');
  near('Kepler inside 0.1 pc of Sgr A*: dln v/dln r', O.cuspSlope(0.1, M), -0.5, 0.01, 'model (Sgr A* plus the cusp)');
}

// 4. The Galaxy.
const g = O.galaxy(), g0 = O.galaxy(O.MWP14, { bh: 0 });
near('MWPotential2014 normalisation identity: v_c(8 kpc) without Sgr A* [km/s] (G and the shapes cancel)', g0.v(8), 220, 1e-9,
  'model-internal (parameters as in galpy\'s source)');
{
  const Rs = [5, 8.122, 15, 25], ve = R => 229.0 - 1.7 * (R - 8.122);
  const rel = Rs.map(R => (g.v(R) / g.v(8.122)) / (ve(R) / ve(8.122)) - 1);
  check('The shape of MWPotential2014\'s curve, v(R)/v(R0), within 5% of Eilers et al.\'s from 5 to 25 kpc', rel.every(r => Math.abs(r) < 0.05),
    `ratio to Eilers - 1 = ${rel.map(r => r.toFixed(3)).join(', ')} at ${Rs.join(', ')} kpc; the level differs by ${(g.v(8.122) / 229 - 1).toFixed(3)} (220 against 229 km/s)`,
    'Eilers et al. 2019 (ApJ 871, 120), linear fit, abstract; tolerance their 2-5% systematic uncertainty');
  const sl = Rs.map(R => g.slope(R)), se = Rs.map(R => -1.7 * R / ve(R));
  check('Flat, not Kepler, from 5 to 25 kpc: |dln v/dln R| < 0.25 in the model and in Eilers et al.\'s fit',
    sl.every(s => Math.abs(s) < 0.25) && se.every(s => Math.abs(s) < 0.25),
    `model ${sl.map(s => s.toFixed(3)).join(', ')}; Eilers ${se.map(s => s.toFixed(3)).join(', ')}; Kepler -0.5`, 'Eilers et al. 2019; model');
}

// 5. Thin disks: the planets' tilts to the invariable plane.
const SS = 'Souami & Souchay 2012 (A&A 543, A133), as quoted in search text; tolerance covers epoch and element differences';
near('Jupiter\'s inclination to the invariable plane [deg]', O.tiltToInvariable(O.PLANETS[4]), 0.3219, 0.01, SS);
near('Saturn\'s inclination to the invariable plane [deg]', O.tiltToInvariable(O.PLANETS[5]), 0.9254, 0.01, SS);

// 6. Hill's problem: which orbits a body keeps (20 turns of the host, 8 starting angles each unless stated).
{
  const K = O.HOST_KEPLER, sun = O.hostDisk(15.3, -11.9, 0.10), ST = 'Shen & Tremaine 2008 (arXiv 0806.2882), abstract, search text';
  const edgePro = O.hillScan(K, [[0, 0, 1]], [0.4, 0.45, 0.5, 0.55, 0.6], { nPhase: 8 }).edge;
  near('Point-mass host: radius where half the prograde circular orbits have escaped [r_H]', edgePro, 0.5, 0.1,
    `${ST}: "about 0.5 r_H"; tolerance covers their different criterion and integration time`);
  const esc = (h, a, n) => O.hillFates(h, a, [n], { nPhase: 8 }).escapes, ret = [esc(K, 0.6, [0, 0, -1]), esc(K, 0.9, [0, 0, -1])];
  check('Point-mass host: retrograde orbits kept at 0.6 r_H, lost by 0.9 (published limit about 0.7)', ret[0] === 0 && ret[1] >= 0.5,
    `fraction escaped ${ret[0].toFixed(2)} at 0.6 r_H, ${ret[1].toFixed(2)} at 0.9 r_H`, `${ST}: "about 0.7 r_H"`);
  const r875 = [esc(K, 0.875, [0, 0, -1]), esc(sun, 0.875, [0, 0, -1])];
  check('Retrograde in the plane at 0.875 r_J: lost around a point mass, kept by the Sun (its flatter curve, Gam = 2.25, not its vertical tide)',
    r875[0] >= 0.75 && r875[1] <= 0.25, `fraction escaped ${r875[0].toFixed(2)} (point mass), ${r875[1].toFixed(2)} (the Sun)`, 'model');
  {
    const s0 = O.hillStart(sun, 0.3, [0.6, 0, 0.8], 0.7), end = O.hillOrbit(sun, s0, { orbits: 20 });
    const EJ = ([x, y, z, vx, vy, vz]) => (vx * vx + vy * vy + vz * vz) / 2 - sun.Gam * x * x / 2 + sun.nu2 * z * z / 2 - sun.Gam / Math.hypot(x, y, z);
    near('The Sun in the Galaxy: Jacobi integral |v|^2/2 - Gam x^2/2 + nu2 z^2/2 - Gam/r over 20 turns (a = 0.3, tilted orbit)',
      EJ(end.s) - EJ(s0), 0, 1e-6, `model-internal (fate ${end.fate}; a conserved quantity of the equations of motion)`);
  }
  const Om = 27.2 * C.kmskpc, want = (4 * Math.PI * C.GMsun * 0.10 / C.pc ** 3 + 2 * (15.3 ** 2 - 11.9 ** 2) * C.kmskpc ** 2) / Om ** 2;
  near('The Sun in the Galaxy: (vertical tidal frequency / Omega)^2', sun.nu2, want, 1e-12 * want, 'arithmetic in SI (Poisson\'s equation), independent of C.G');
  const dirs = O.sphere(12), fz = [0.3, 0.6].map(a => O.hillFates(sun, a, dirs, { nPhase: 2 }));
  check('The Sun: no orbit, facing any way, escapes from 0.3 r_J (0.85e5 au); most escape by 0.6 r_J (1.7e5 au)',
    fz[0].escapes === 0 && fz[1].escapes >= 0.5,
    fz.map((r, i) => `at ${[0.3, 0.6][i]} r_J: stay ${r.stays.toFixed(2)}, escape ${r.escapes.toFixed(2)}, plunge ${r.plunges.toFixed(2)}`).join('; ') +
    ' (12 directions x 2 angles)', 'model');
  const rJ = O.jacobi(C.GMsun, 15.3, -11.9), edge = O.hillScan(sun, dirs, [0.3, 0.4, 0.5, 0.6], { nPhase: 2 }).edge * rJ / C.au;
  check('The Sun keeps orbits facing every way out to the Oort cloud\'s quoted outer edge, 1e5 to 2e5 au', edge >= 1e5 && edge <= 2e5,
    `half have escaped by ${fmt(edge)} au (12 directions x 2 angles, grid 0.1 r_J)`,
    'near 1e5 au: Correa-Otto & Calandra 2019, search text; as far as 2e5 au: Dones et al. 2004, as cited in search text');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall orbits checks pass');
process.exit(fails ? 1 : 0);
