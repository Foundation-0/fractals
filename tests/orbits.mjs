// Checks the orbits study (orbits/model.js) against published values and its own closed forms. Run: npm test.
// Each check prints the source, the published or expected value, the model's value and the tolerance. "Arithmetic" and
// "model-internal" mark checks of the code against a closed form or itself, not against nature; "model" marks a model
// result with no published value to compare. Sources were read in search results and abstracts only
// (orbits/README.md, Sources), except where a check says otherwise; "#37's review" marks values a reviewer read in the
// paper's arXiv source.
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
const JPL = 'JPL approximate elements, Table 1 (1800-2050; checked against the SSD page in #37\'s review); GM_sun IAU 2015 B3; masses DE430';
const mu = O.planetMassFraction(), ex = O.PLANETS.map(p => O.kepler(p).excess), big = Math.max(...ex.map(Math.abs));
check('In this 1800-2050 fit, n^2 a^3 matches GM_sun for every planet to within the planets\' total mass over the Sun\'s',
  ex.every(x => Math.abs(x) <= mu),
  `largest |n^2 a^3 / GM_sun - 1| = ${fmt(big)} (${O.PLANETS[ex.map(Math.abs).indexOf(big)].name}); sum of m/M_sun = ${fmt(mu)}` +
  ' (an observed size, not a physical bound: smeared into rings, the other planets\' pull alone gives up to 1.36e-3, for Uranus)', JPL);
{
  const inner = Math.max(...ex.slice(0, 4).map(Math.abs));
  near('The inner four planets: largest |n^2 a^3 / GM_sun - 1|', inner, 0, 5e-5,
    `${JPL}; a regression bound, which a GM_sun error beyond -1.3e-5 or +5.5e-5, or a century-length error beyond -0.6e-5 or +2.7e-5, would break`);
}
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
  'Correa-Otto & Calandra 2019 (MNRAS 490, 2495): "r_J ~ 2.8 x 10^5 au" (#37\'s review), from Jiang & Tremaine\'s constants (2.78e5 au), so this confirms ' +
  'the formula on nearby inputs; tolerance the rounding of 2.8');

// 3. Sgr A*: S2's orbit and the stars around it.
const G20 = 'GRAVITY Collaboration 2020 (A&A 636, L5), read in a transcription and in #37\'s review';
const s2 = O.orbitOf(O.S2), s2M = O.orbitOf(O.S2, O.S2.M);
near('S2: Kepler\'s third law returns GRAVITY\'s fitted mass [1e6 M_sun]', s2.keplerMass / 1e6, O.S2.M / 1e6, 0.012,
  `${G20}, Table E.1; consistency with their own fit (tolerance its 0.012 error), not a measurement`);
near('S2: Schwarzschild precession per orbit [arcmin]', s2M.precessionArcmin, 12.1, 0.1,
  `${G20}, appendix B: "the 12.1' precession"; tolerance one unit in the last digit (the formula with their Table E.1 M, a, e gives 12.16')`);
near('S2: pericentre distance [au]', s2M.periAU, 120, 5, `${G20}, sect. 1.2: "pericentre at 120 AU", rounded to 10 au`);
near('S2: speed at pericentre [km/s]', s2M.periSpeed, 7700, 50, `${G20}, sect. 1.2: "7700 km/s", rounded to 100 km/s`);
{
  const K = O.CUSP, M = O.SGRA.M, r2 = [K.M1hi, K.M1, K.M1lo].map(m => O.cuspRadius(2, M, m));
  check('The stars inside r weigh twice Sgr A* at 3 to 4 pc in the literature; the cusp model brackets it',
    r2[0] <= 3 && r2[2] >= 4,
    `model ${fmt(r2[0])} to ${fmt(r2[2])} pc (middle ${fmt(r2[1])}) for 0.5-1.5e6 M_sun inside 1 pc and density ~ r^-1.13; radii past the 3 pc ` +
    'break extrapolate the cusp, where the density falls faster, so they are lower limits and the upper side holds a fortiori',
    'Schodel et al. 2018 sect. 4.5 (7.8e6 M_sun inside 3 pc, "roughly twice" Sgr A*), Alexander 2005 (2m reached by <~4 pc), Feldmeier-Krause et al. ' +
    '2017 sect. 3.3.2 (4.0 +2.2/-1.1 pc with M_BH = 4e6 and Merritt\'s 2004 definition), GRAVITY Collaboration 2024 sect. 4.3 (3.9 pc in their cusp ' +
    'simulation); all #37\'s review; inputs Schodel et al. 2009, 2018');
  near('The cusp model\'s stars inside 3 pc [1e6 M_sun] (middle mass inside 1 pc)', O.cuspMass(3) / 1e6, 7.8, 0.6,
    'Schodel et al. 2018 sect. 4.5: "7.8+-0.6 x 10^6 M_sun" within 3 pc (#37\'s review)');
  near('The cusp model\'s stars inside 0.01 pc [M_sun]', O.cuspMass(0.01), 180, 30, 'Schodel et al. 2018: "180+-30" within 0.01 pc (#37\'s review)');
  near('Kepler inside 0.1 pc of Sgr A*: dln v/dln r', O.cuspSlope(0.1, M), -0.5, 0.01, 'model (Sgr A* plus the cusp)');
  let lo = 1e-3, hi = 30;
  for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi); if (O.cuspSlope(m, M) < -0.25) lo = m; else hi = m; }
  near('Where dln v/dln r = -1/4: the closed form against bisection [pc]', O.cuspSlopeRadius(-0.25, M), lo, 1e-9, 'model-internal');
}

// Special functions the model uses: the complete elliptic integral and the incomplete gamma function.
near('ellipticK(1/sqrt 2) [the lemniscate value Gamma(1/4)^2 / (4 sqrt pi)]', O.ellipticK(Math.SQRT1_2), 1.8540746773013719, 1e-14, 'arithmetic');
for (const x of [0.25, 1, 4]) {
  const erf = { 0.25: 0.5204998778130465, 1: 0.8427007929497149, 4: 0.9953222650189527 }[x]; // erf(sqrt x)
  near(`gammaP(1/2, ${x}) = erf(sqrt ${x})`, O.gammaP(0.5, x), erf, 1e-13, `arithmetic (${x < 1.5 ? 'series' : 'continued fraction'})`);
}

// 4. The Galaxy.
const g = O.galaxy(), g0 = O.galaxy(O.MWP14, { bh: 0 });
near('MWPotential2014 normalisation identity: v_c(8 kpc) without Sgr A* [km/s] (G and the shapes cancel)', g0.v(8), 220, 1e-9,
  'model-internal (parameters as in galpy\'s source)');
{
  const T1 = 'Bovy 2015, Table 1 (arXiv source, mwpotential2014.txt), as #37\'s re-review read it; tolerance the rounding of the printed value';
  near('MWPotential2014: bulge mass [1e10 M_sun]', g0.M.bulge / 1e10, 0.5, 0.05, T1);
  near('MWPotential2014: disk mass [1e10 M_sun]', g0.M.disk / 1e10, 6.8, 0.05, T1);
  near('MWPotential2014: mass inside 60 kpc, as v^2 R/G [1e11 M_sun]', g0.v(60) ** 2 * 60 / C.G / 1e11, 4.1, 0.05, `${T1} (the true sphere mass is 4.05)`);
  near('MWPotential2014: dln v_c/dln R at R0 = 8 kpc', g0.slope(8), -0.10, 0.005, T1);
  near('MWPotential2014: dark-matter density at R0 [M_sun/pc^3]', g0.haloDensity(8), 0.008, 0.0005, T1);
}
near('MWPotential2014: halo mass inside 245 kpc [1e12 M_sun]', g0.parts(245).halo * 245 / C.G / 1e12, 0.8, 0.05,
  'Bovy 2015, Table 1: M_vir = 0.8e12 M_sun with r_vir = 245 kpc (#37\'s review); tolerance the rounding of 0.8');
near('The disk\'s mass inside a sphere of 1e4 kpc / its total (Gauss\'s theorem by quadrature)', g.diskSphereMass(1e4) / g.M.disk, 1, 1e-3,
  'model-internal (the Miyamoto-Nagai mass outside 1e4 kpc is about 3e-4 of the total)');
near('Disk sphere mass, Kuzmin limit (b -> 0): fraction inside 8 kpc = 1 - a / sqrt(r^2 + a^2)', ((G) => G.diskSphereMass(8) / G.M.disk)(O.galaxy({ ...O.MWP14, b: 1e-9 })),
  1 - 3 / Math.hypot(8, 3), 1e-8, 'arithmetic (closed form)');
near('Disk sphere mass, Plummer limit (a = 0): fraction inside 0.3 kpc = r^3 / (r^2 + b^2)^(3/2)', ((G) => G.diskSphereMass(0.3) / G.M.disk)(O.galaxy({ ...O.MWP14, a: 0 })),
  0.3 ** 3 / (0.09 + 0.28 ** 2) ** 1.5, 1e-8, 'arithmetic (closed form)');
{
  const Rs = [5, 8.122, 15, 25], ve = R => 229.0 - 1.7 * (R - 8.122);
  const rel = Rs.map(R => (g.v(R) / g.v(8.122)) / (ve(R) / ve(8.122)) - 1);
  check('The shape of MWPotential2014\'s curve, v(R)/v(R0), within 5% of Eilers et al.\'s from 5 to 25 kpc', rel.every(r => Math.abs(r) < 0.05),
    `ratio to Eilers - 1 = ${rel.map(r => r.toFixed(3)).join(', ')} at ${Rs.join(', ')} kpc; the level differs by ${(g.v(8.122) / 229 - 1).toFixed(3)} (220 against 229 km/s)`,
    'Eilers et al. 2019 (ApJ 871, 120), eq. 7 (#37\'s review); tolerance their 2-5% systematic uncertainty out to about 20 kpc (the slope\'s 0.46 ' +
    'km/s/kpc systematic gives 0.6% at 5 kpc and 3.9% at 25 kpc)');
  const sl = Rs.map(R => g.slope(R)), se = Rs.map(R => -1.7 * R / ve(R));
  check('Flat, not Kepler, from 5 to 25 kpc: |dln v/dln R| < 0.25 in the model and in Eilers et al.\'s fit',
    sl.every(s => Math.abs(s) < 0.25) && se.every(s => Math.abs(s) < 0.25),
    `model ${sl.map(s => s.toFixed(3)).join(', ')}; Eilers ${se.map(s => s.toFixed(3)).join(', ')}; Kepler -0.5`, 'Eilers et al. 2019; model');
}

// 5. Thin disks: the planets' tilts to the invariable plane.
const SS = 'Souami & Souchay 2012 (A&A 543, A133), as quoted in search text, not confirmed in the paper; tolerance covers epoch and element differences';
near('Jupiter\'s inclination to the invariable plane [deg]', O.tiltToInvariable(O.PLANETS[4]), 0.3219, 0.01, SS);
near('Saturn\'s inclination to the invariable plane [deg]', O.tiltToInvariable(O.PLANETS[5]), 0.9254, 0.01, SS);

// 6. Hill's problem: which orbits a body keeps (20 turns of the host, 8 starting angles each unless stated).
{
  const K = O.HOST_KEPLER, sun = O.hostDisk(15.3, -11.9, 0.10);
  const NV = 'Nesvorny et al. 2003, as Shen & Tremaine 2008 (AJ 136, 2453) quote them: semi-major axes of "~0.7 r_H for retrograde satellites and ' +
    '~0.4 r_H for prograde ones", for nearly circular orbits near the ecliptic (#37\'s review)';
  const esc = (h, a, n) => O.hillFates(h, a, [n], { nPhase: 8 }).escapes, pro = [esc(K, 0.4, [0, 0, 1]), esc(K, 0.6, [0, 0, 1])];
  check('Point-mass host: prograde circular orbits mostly kept at 0.4 r_H, mostly lost by 0.6', pro[0] < 0.5 && pro[1] >= 0.5,
    `fraction escaped ${pro[0].toFixed(2)} at 0.4 r_H (must be < 0.5), ${pro[1].toFixed(2)} at 0.6 r_H (must be >= 0.5)`, 'model');
  const edgePro = O.hillScan(K, [[0, 0, 1]], [0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7], { nPhase: 8 }).edge;
  near('Point-mass host: radius where half the prograde circular orbits in the plane have escaped [r_H]', edgePro, 0.4, 0.1,
    `${NV}; tolerance covers their different criterion and integration time`);
  const gRet = []; for (let a = 0.6; a <= 1.0001; a += 0.025) gRet.push(+a.toFixed(3));
  const edgeRet = O.hillScan(K, [[0, 0, -1]], gRet, { nPhase: 8 }).edge;
  check('Point-mass host: the retrograde in-plane edge lies between 0.7 r_H (near-circular, near-ecliptic orbits) and r_H (some coplanar ones)',
    edgeRet >= 0.7 && edgeRet <= 1, `half escaped by ${fmt(edgeRet)} r_H (must be 0.7 to 1)`,
    `${NV}; Shen & Tremaine 2008 abstract: "some coplanar retrograde satellites ... can survive out to ~r_H" (#37's review)`);
  const r85 = [esc(K, 0.85, [0, 0, -1]), esc(sun, 0.85, [0, 0, -1])];
  check('Retrograde in the plane at 0.85 r_J: mostly lost around a point mass, kept by the Sun (its flatter curve, Gam = 2.25, not its vertical tide)',
    r85[0] >= 0.5 && r85[1] <= 0.25,
    `fraction escaped ${r85[0].toFixed(2)} (point mass; must be >= 0.5), ${r85[1].toFixed(2)} (the Sun; must be <= 0.25)`, 'model');
  {
    const s0 = O.hillStart(sun, 0.3, [0.6, 0, 0.8], 0.7), end = O.hillOrbit(sun, s0, { orbits: 20 });
    const EJ = ([x, y, z, vx, vy, vz]) => (vx * vx + vy * vy + vz * vz) / 2 - sun.Gam * x * x / 2 + sun.nu2 * z * z / 2 - sun.Gam / Math.hypot(x, y, z);
    const dE = EJ(end.s) - EJ(s0);
    check('The Sun in the Galaxy: Jacobi integral |v|^2/2 - Gam x^2/2 + nu2 z^2/2 - Gam/r kept over 20 turns (a = 0.3, tilted orbit, which stays)',
      end.fate === 'stays' && Math.abs(dE) <= 1e-6, `change ${fmt(dE)} (must be within 1e-6); fate ${end.fate} (must be stays)`,
      'model-internal (a conserved quantity of the equations of motion)');
  }
  {
    const pol = O.hillFates(sun, 0.3, [[1, 0, 0]], { nPhase: 8 });
    check('The Sun: polar circular orbits at 0.3 r_J are lost within 20 turns, by plunging (Lidov-Kozai), not by escaping',
      pol.plunges >= 0.5 && pol.escapes === 0, `plunge ${pol.plunges.toFixed(2)} (must be >= 0.5), escape ${pol.escapes.toFixed(2)} (must be 0)`,
      'model (Lidov 1962, Kozai 1962: the eccentricity reaches 1 at 90 deg)');
    const L = O.hillScan(K, [[1, 0, 0]], [0.1, 0.2], { nPhase: 8 });
    check('Point-mass host: polar orbits (plane across the host) are lost by plunging between 0.1 and 0.2 r_H, before any escapes',
      L.rows.every(r => r.escapes === 0) && L.edgeLost > 0.1 && L.edgeLost <= 0.2,
      `half lost by ${fmt(L.edgeLost)} r_H (must be above 0.1 and at most 0.2); escaped fractions ${L.rows.map(r => r.escapes.toFixed(2)).join(', ')} (must all be 0)`,
      'model (the edgeLost path)');
  }
  const Om = 27.2 * C.kmskpc, want = (4 * Math.PI * C.GMsun * 0.10 / C.pc ** 3 + 2 * (15.3 ** 2 - 11.9 ** 2) * C.kmskpc ** 2) / Om ** 2;
  near('The Sun in the Galaxy: (vertical tidal frequency / Omega)^2', sun.nu2, want, 1e-12 * want, 'arithmetic in SI (Poisson\'s equation), independent of C.G');
  const dirs = O.sphere(12), fz = [0.3, 0.6].map(a => O.hillFates(sun, a, dirs, { nPhase: 2 }));
  check('The Sun: no orbit, facing any way, escapes from 0.3 r_J (0.85e5 au); most escape by 0.6 r_J (1.7e5 au)',
    fz[0].escapes === 0 && fz[1].escapes >= 0.5,
    fz.map((r, i) => `at ${[0.3, 0.6][i]} r_J: stay ${r.stays.toFixed(2)}, escape ${r.escapes.toFixed(2)}, plunge ${r.plunges.toFixed(2)}`).join('; ') +
    ' (12 directions x 2 angles)', 'model');
  const rJ = O.jacobi(C.GMsun, 15.3, -11.9), edge = O.hillScan(sun, dirs, [0.2, 0.3, 0.4, 0.5, 0.6], { nPhase: 2 }).edge * rJ / C.au;
  check('The Sun\'s all-directions escape edge lies within the Oort cloud\'s quoted outer limits, 6.5e4 to 2e5 au', edge >= 6.5e4 && edge <= 2e5,
    `half have escaped by ${fmt(edge)} au (12 directions x 2 angles, grid 0.1 r_J from 0.2 r_J = 5.7e4 au; the tide alone, no passing stars)`,
    'Correa-Otto & Calandra 2019 sect. 4.3: a_crit ~ 6.5e4 au, set by the frequency of stellar passages acting with the tide (#37\'s review); ' +
    'Dones et al. 2004: as far as 2e5 au, as cited in search text; a wide window: at fixed r_J the edge stays within 1.24-1.29e5 au for Gam from 0.5 to 2 times its value, so this checks the scale, not the tide\'s details');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall orbits checks pass');
process.exit(fails ? 1 : 0);
