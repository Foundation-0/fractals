// Prints every number in orbits/README.md. Run: node orbits/table.mjs (about 50 s; the stability scans of section 5
// take nearly all of it), node orbits/table.mjs quick (well under a second; section 5 left out), or
// node orbits/table.mjs long (adds the all-directions scans followed for 100 turns of the host; about 2 minutes in all).
import { createRequire } from 'node:module';
const O = createRequire(import.meta.url)('./model.js');
const { C } = O;
const e3 = x => x.toExponential(3), f = (x, d = 3) => x.toFixed(d);
const quick = process.argv[2] === 'quick', long = process.argv[2] === 'long';

console.log('1. Kepler in the Solar System (JPL approximate elements, Table 1, 1800-2050; GM_sun IAU 2015; masses DE430)\n');
console.log('   n = the mean-longitude rate Ldot (the angular rate); excess = n^2 a^3/GM_sun - 1');
console.log('   planet     a [au]       P [yr]       excess      own mass/Sun   own + inner planets   own + other planets as rings');
let inner = 0;
for (const p of O.PLANETS) {
  const k = O.kepler(p);
  console.log(`   ${p.name.padEnd(9)} ${f(p.a, 6).padStart(10)} ${f(k.P, 5).padStart(11)}    ${e3(k.excess).padStart(10)}     ${e3(k.own)}       ${e3(k.own + inner)}          ${e3(O.ringExcess(p)).padStart(10)}`);
  inner += k.own;
}
{
  const nep = O.PLANETS[7], nA = (nep.Ldot + 0.32241464) * Math.PI / 180 / (36525 * C.day);
  console.log(`   with the mean-anomaly rate Ldot - wdot instead (Table 1's wdot = -0.32241464 deg/century), Neptune's excess would be ${e3(nA * nA * (nep.a * C.au) ** 3 / C.GMsun - 1)}`);
}
const mu = O.planetMassFraction();
console.log(`   all eight planets together: ${e3(mu)} of the Sun's mass; largest |excess| ${e3(Math.max(...O.PLANETS.map(p => Math.abs(O.kepler(p).excess))))}`);
console.log(`   fitted exponent of P against a: ${f(O.keplerExponent(), 6)} over all eight (0.39 to 30 au), ${f(O.keplerExponent(O.PLANETS.slice(0, 4)), 6)} over the inner four; Kepler 1.5`);
console.log(`   mass inside Neptune's orbit over mass inside Mercury's: 1 + ${e3(mu - 1 / O.PLANETS[7].sunOver)}`);
console.log(`   the other planets' rings alone: ${O.PLANETS.map(p => `${p.name} ${e3(O.ringExcess(p, { own: false }))}`).join(', ')}`);
console.log(`   Saturn's ring estimate minus its fit: ${e3(O.ringExcess(O.PLANETS[5]) - O.kepler(O.PLANETS[5]).excess)}`);

console.log('\n2. Where a Kepler domain ends: the tidal (Jacobi) radius, r_J^3 = G m / (4 A (A - B))\n');
const OORT = { A: 15.3, B: -11.9, dA: 0.4, dB: 0.4 }; // Bovy 2017
const rJ = O.jacobi(C.GMsun, OORT.A, OORT.B);
const rJs = [[OORT.A + OORT.dA, OORT.B], [OORT.A - OORT.dA, OORT.B], [OORT.A, OORT.B + OORT.dB], [OORT.A, OORT.B - OORT.dB]].map(([A, B]) => O.jacobi(C.GMsun, A, B) / C.pc);
console.log(`   the Sun in the Galaxy (A = ${OORT.A}, B = ${OORT.B} km/s/kpc, Bovy 2017): r_J = ${f(rJ / C.pc)} pc = ${f(rJ / C.au / 1e5, 2)}e5 au` +
  ` (moving A or B by its statistical error: ${f(Math.min(...rJs))} to ${f(Math.max(...rJs))} pc; adding A's 0.5 systematic: ` +
  `${f(O.jacobi(C.GMsun, OORT.A + 0.9, OORT.B) / C.pc)} to ${f(O.jacobi(C.GMsun, OORT.A - 0.9, OORT.B) / C.pc)} pc)`);
console.log(`   the Sun's mean density inside r_J over the Galaxy's inside the Sun's orbit: 4A/(A - B) = ${f(O.densityRatio(OORT.A, OORT.B), 2)}` +
  ` (3 for a point-mass host, 2 for a flat rotation curve; 2(1 - dln v/dln R) with dln v/dln R = -(A + B)/(A - B) = ${f(-(OORT.A + OORT.B) / (OORT.A - OORT.B))})`);
const rhoJ = 1 / (4 / 3 * Math.PI * (rJ / C.pc) ** 3);
console.log(`   that mean density: ${f(rhoJ, 3)} M_sun/pc^3; the Galaxy's spherical mean inside the Sun's orbit, 3 Omega^2/(4 pi G): ` +
  `${f(3 * ((OORT.A - OORT.B) * 1e-3) ** 2 / (4 * Math.PI * C.G * 1e9 * 1e-6), 3)} M_sun/pc^3; the local mid-plane density is about 0.10`);
for (const p of O.PLANETS) console.log(`   Hill radius of ${p.name.padEnd(8)} a (m/3M)^(1/3) = ${f(O.hill(p.a, 1 / p.sunOver), 4)} au = ${f(O.hill(p.a, 1 / p.sunOver) / p.a, 4)} a`);
console.log(`   the Sun's own pull falls to g+ = ${O.GDAGGER.toExponential(2)} m/s^2 at ${f(O.radiusAtAcceleration(C.GMsun, O.GDAGGER) / C.au, 0)} au` +
  ` (${f(O.radiusAtAcceleration(C.GMsun, O.GDAGGER) / rJ, 3)} r_J)`);

console.log('\n3. Sgr A*: a Kepler domain at the centre of the Galaxy (S2, GRAVITY Collaboration 2020)\n');
const s2 = O.orbitOf(O.S2), s2M = O.orbitOf(O.S2, O.S2.M);
console.log(`   a = ${O.S2.aMas} mas at R0 = ${O.S2.R0} pc: ${f(s2.aAU, 1)} au; P = ${O.S2.P} yr; e = ${O.S2.e}`);
console.log(`   Kepler's third law: M = a^3/P^2 = ${f(s2.keplerMass / 1e6, 4)}e6 M_sun (their fit ${O.S2.M / 1e6}e6)`);
console.log(`   Schwarzschild precession 6 pi GM / (c^2 a (1 - e^2)) = ${f(s2M.precessionArcmin, 2)} arcmin per orbit; measured f_SP = ${O.S2.fSP} +- ${O.S2.fSPerr} of it`);
console.log(`   pericentre ${f(s2M.periAU, 0)} au = ${f(s2M.periOverRs, 0)} Schwarzschild radii, at ${f(s2M.periSpeed, 0)} km/s (${f(s2M.periSpeed * 1e3 / C.c * 100, 2)}% of c)`);
const MBH = O.SGRA.M, K = O.CUSP;
console.log(`   Sgr A* today: ${MBH / 1e6}e6 M_sun (GRAVITY Collaboration 2022). The stars around it: ${K.M1lo / 1e6} to ${K.M1hi / 1e6}e6 M_sun inside 1 pc` +
  ` (Schodel, Merritt & Eckart 2009), density ~ r^-${K.gamma} inside ~${K.rBreak} pc (Schodel et al. 2018)`);
const quarter = M1 => { let lo = 1e-3, hi = 30; for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); if (O.cuspSlope(m, MBH, M1) < -0.25) lo = m; else hi = m; } return lo; };
for (const [lab, M1] of [['low', K.M1lo], ['middle', K.M1], ['high', K.M1hi]]) {
  console.log(`   ${lab.padEnd(6)} (${M1 / 1e6}e6 inside 1 pc): dln v/dln r passes -1/4 at ${f(quarter(M1), 2)} pc; stars weigh as much as Sgr A* inside` +
    ` ${f(O.cuspRadius(1, MBH, M1), 2)} pc, twice as much inside ${f(O.cuspRadius(2, MBH, M1), 2)} pc`);
}
console.log(`   (radii past the ${K.rBreak} pc break extrapolate the power law; the density falls faster there, so they are lower limits)`);
console.log(`   dln v/dln r (middle): ${[0.01, 0.1, 0.5, 1, 2, 3].map(r => `${f(O.cuspSlope(r, MBH))} at ${r} pc`).join(', ')}`);
console.log(`   the stars inside 1 pc (middle): ${f(O.cuspMass(1) / MBH, 2)} of Sgr A*'s mass; their density at 1 pc, (3 - gamma) M1/(4 pi): ` +
  `${e3((3 - K.gamma) * K.M1 / (4 * Math.PI))} M_sun/pc^3, ${e3((3 - K.gamma) * K.M1 / (4 * Math.PI) / 0.10)} times the 0.10 near the Sun; Sgr A* is ${e3(MBH)} Suns`);
const g = O.galaxy();
console.log(`   for comparison, MWPotential2014's bulge (fit on kpc scales, no nuclear star cluster) plus Sgr A*: stars weigh as much as Sgr A* inside` +
  ` ${f(g.influence(1) * 1e3, 2)} pc, twice as much inside ${f(g.influence(2) * 1e3, 2)} pc`);

console.log('\n4. The Galaxy: v(R) and its log slope in the mid-plane (MWPotential2014, Bovy 2015, plus Sgr A*)\n');
console.log(`   component masses: bulge ${e3(g.M.bulge)}, disk ${e3(g.M.disk)} M_sun; halo 4 pi rho_s r_s^3 = ${e3(g.M.halo)} M_sun`);
console.log('   R [kpc]      v [km/s]   dln v/dln R   fractions of v^2: BH, bulge, disk, halo');
for (const R of [1e-5, 1e-4, 1e-3, 3e-3, 1e-2, 0.03, 0.1, 0.3, 1, 3, 5, 8, 15, 25, 50, 100, 200]) {
  const p = g.parts(R), v2 = p.bh + p.bulge + p.disk + p.halo;
  console.log(`   ${String(R).padEnd(10)} ${f(g.v(R), 1).padStart(9)}   ${f(g.slope(R)).padStart(8)}      ${[p.bh, p.bulge, p.disk, p.halo].map(x => f(x / v2, 3)).join(', ')}`);
}
const flat = g.flatRange(0.15), flatBulge = g.flatRange(0.15, 1e-3, 1);
console.log(`   |dln v/dln R| < 0.15 outside the bulge (R > 1 kpc) from ${f(flat[0], 2)} to ${f(flat[1], 1)} kpc; the r^-1.8 bulge is also that flat from` +
  ` ${f(flatBulge[0] * 1e3, 0)} to ${f(flatBulge[1] * 1e3, 0)} pc`);
const EILERS = { v0: 229.0, dv: -1.7, R0: 8.122, Rmin: 5, Rmax: 25 }; // Eilers et al. 2019
const ve = R => EILERS.v0 + EILERS.dv * (R - EILERS.R0);
console.log(`   Eilers et al. 2019: v = ${EILERS.v0} ${EILERS.dv} (R - ${EILERS.R0}) km/s for ${EILERS.Rmin} to ${EILERS.Rmax} kpc;` +
  ` dln v/dln R = ${f(EILERS.dv * EILERS.Rmin / ve(EILERS.Rmin))} at ${EILERS.Rmin}, ${f(EILERS.dv * EILERS.R0 / ve(EILERS.R0))} at R0, ${f(EILERS.dv * EILERS.Rmax / ve(EILERS.Rmax))} at ${EILERS.Rmax} kpc`);
{
  const Rs = [5, 8.122, 15, 25];
  console.log(`   Eilers et al.'s v at ${Rs.join(', ')} kpc: ${Rs.map(R => f(ve(R), 1)).join(', ')} km/s; the model's: ${Rs.map(R => f(g.v(R), 1)).join(', ')}`);
  console.log(`   shape, (v/v(R0)) / (v_Eilers/v_Eilers(R0)) - 1: ${Rs.map(R => f(g.v(R) / g.v(8.122) / (ve(R) / ve(8.122)) - 1)).join(', ')}; level at R0: ${f(g.v(8.122) / 229 - 1)}`);
}
const Mgrow = ve(EILERS.Rmax) ** 2 * EILERS.Rmax / (ve(EILERS.Rmin) ** 2 * EILERS.Rmin);
console.log(`   mass inside 25 kpc over mass inside 5 kpc, v^2 R / G (spherical): ${f(Mgrow, 2)}; for Kepler it would be 1`);
for (const Mb of [5e10, 6e10, 1e11]) console.log(`   ${e3(Mb)} M_sun all inside 25 kpc, as a point mass: v(25 kpc) = ${f(Math.sqrt(C.G * Mb / 25), 0)} km/s (measured ${f(ve(25), 0)})`);
console.log('   (the stars: 5 +- 1 x 10^10 M_sun, Bland-Hawthorn & Gerhard 2016; 10^11 is twice that)');
const gR0 = (ve(EILERS.R0) * 1e3) ** 2 / (EILERS.R0 * C.kpc);
console.log(`   the Galaxy's pull at the Sun: v^2/R0 = ${e3(gR0)} m/s^2 = ${f(gR0 / O.GDAGGER, 2)} g+`);

console.log('\n4b. What does repeat: thin disks\n');
console.log(`   inclinations to the invariable plane (JPL Table 1 elements; plane from Souami & Souchay 2012): ` +
  O.PLANETS.map(p => `${p.name} ${f(O.tiltToInvariable(p), 3)}`).join(', ') + ' deg');
const tilts = O.PLANETS.map(p => O.tiltToInvariable(p) * Math.PI / 180);
console.log(`   mean inclination over the eight: ${f(O.PLANETS.reduce((a, p) => a + O.tiltToInvariable(p), 0) / 8, 2)} deg`);
console.log(`   rms sin(i) over the eight: ${f(Math.sqrt(tilts.reduce((a, t) => a + Math.sin(t) ** 2, 0) / 8), 3)}; without Mercury: ${f(Math.sqrt(tilts.slice(1).reduce((a, t) => a + Math.sin(t) ** 2, 0) / 7), 3)}`);
console.log(`   the Galaxy's thin disk: scale height 300 +- 50 pc over scale length 2.6 +- 0.5 kpc = ${f(0.3 / 2.6, 3)}, the axis ratio of its density` +
  ` contours (Bland-Hawthorn & Gerhard 2016)`);

if (!quick) {
  console.log('\n5. Which orbits a body keeps: circular orbits followed for 20 turns of the host (Hill\'s problem)\n');
  const RHO0 = 0.10; // M_sun/pc^3, local mid-plane density (McKee, Parravano & Hollenbach 2015: 0.097 +- 0.013)
  const sun = O.hostDisk(OORT.A, OORT.B, RHO0);
  console.log(`   point-mass host: Gam = 4A/Omega = ${O.HOST_KEPLER.Gam}, (nu/Omega)^2 = ${O.HOST_KEPLER.nu2}`);
  console.log(`   the Sun in the Galaxy (A, B as above, rho0 = ${RHO0} M_sun/pc^3): Gam = ${f(sun.Gam, 3)}, (nu/Omega)^2 = ${f(sun.nu2, 2)}`);
  console.log(`   20 turns of the host: ${f(20 * 2 * Math.PI / ((OORT.A - OORT.B) * C.kmskpc) / C.yr / 1e9, 2)} Gyr for the Sun; ${f(20 * O.kepler(O.PLANETS[4]).P, 0)} yr for Jupiter`);
  console.log(`   an orbit counts as plunged inside 1e-3 r_J: ${f(1e-3 * rJ / C.au, 0)} au for the Sun, ${f(1e-3 * O.hill(O.PLANETS[4].a, 1 / O.PLANETS[4].sunOver) * C.au / 7.1492e7, 2)} Jupiter radii (71,492 km)`);
  console.log(`   the Sun's vertical oscillation through the disk with this nu: ${f(2 * Math.PI / (Math.sqrt(sun.nu2) * (OORT.A - OORT.B) * C.kmskpc) / C.yr / 1e6, 0)} Myr`);
  const planes = { 'prograde, in the plane': [[0, 0, 1]], 'retrograde, in the plane': [[0, 0, -1]], 'polar, plane holds the host': [[0, 1, 0]], 'polar, plane across it': [[1, 0, 0]] };
  const as = []; for (let a = 0.3; a <= 1.2001; a += 0.025) as.push(a);
  console.log('   radius [r_J] where half the orbits (8 starting angles) have escaped beyond 3 r_J:');
  const sunNu1 = { ...sun, nu2: 1, name: 'the Sun in the Galaxy with (nu/Omega)^2 = 1' };
  console.log('   orbit                         point-mass host   the Sun in the Galaxy   the same with (nu/Omega)^2 = 1');
  for (const [k, n] of Object.entries(planes)) {
    const e = [O.HOST_KEPLER, sun, sunNu1].map(h => O.hillScan(h, n, as, { nPhase: 8 }).edge);
    console.log(`   ${k.padEnd(28)}  ${f(e[0], 3).padStart(10)}         ${f(e[1], 3).padStart(10)}              ${f(e[2], 3).padStart(10)}`);
  }
  console.log('   (an orbit that starts in the plane stays in it, so the vertical tide cannot act on the first two rows)');
  const dirs = O.sphere(24), asIso = []; for (let a = 0.2; a <= 1.2001; a += 0.1) asIso.push(a);
  console.log('\n   orbits facing every way (24 directions x 4 starting angles): fractions that stay, escape, and plunge within 1e-3 r_J');
  const iso = {};
  for (const [name, h] of [['point-mass host', O.HOST_KEPLER], ['the Sun in the Galaxy', sun]]) {
    iso[name] = O.hillScan(h, dirs, asIso, { nPhase: 4 });
    console.log(`   ${name}: half have escaped by ${f(iso[name].edge, 3)} r_J`);
    for (const r of iso[name].rows) console.log(`     a = ${f(r.a, 1)} r_J: stay ${f(r.stays, 2)}, escape ${f(r.escapes, 2)}, plunge ${f(r.plunges, 2)}`);
  }
  console.log(`   for the Sun: ${f(iso['the Sun in the Galaxy'].edge * rJ / C.au / 1e5, 2)}e5 au`);
  for (const rho of [0.08, 0.12]) {
    const e = O.hillScan(O.hostDisk(OORT.A, OORT.B, rho), dirs, asIso, { nPhase: 4 }).edge;
    console.log(`   with rho0 = ${rho}: (nu/Omega)^2 = ${f(O.hostDisk(OORT.A, OORT.B, rho).nu2, 2)}, half escaped by ${f(e, 3)} r_J`);
  }
  const oort = [1e5, 2e5].map(x => x * C.au / rJ);
  console.log(`   the Oort cloud's outer edge, near 1e5 au and as far as 2e5 au: ${f(oort[0], 2)} to ${f(oort[1], 2)} r_J`);
  if (long) {
    console.log(`\n   the same, followed for 100 turns of the host (${f(100 * 2 * Math.PI / ((OORT.A - OORT.B) * C.kmskpc) / C.yr / 1e9, 1)} Gyr for the Sun):`);
    for (const [name, h] of [['point-mass host', O.HOST_KEPLER], ['the Sun in the Galaxy', sun]]) {
      const r = O.hillScan(h, dirs, asIso, { nPhase: 4, orbits: 100 });
      console.log(`   ${name}: half have escaped by ${f(r.edge, 3)} r_J; plunged by then, at a = 0.2 to 0.4 r_J: ${r.rows.slice(0, 3).map(x => f(x.plunges, 2)).join(', ')}`);
    }
  }
}
