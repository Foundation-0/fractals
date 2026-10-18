// Prints every number in notes/bh-lensing.md. Usage: node notes/bh-lensing.mjs
// Order-of-magnitude estimates: each input is cited in the note, and every output is good to a factor of a few.
import { createRequire } from 'node:module';
const { C, gravAtom } = createRequire(import.meta.url)('../witness-map/model.js');
const YR = 3.156e7, AGE = 13.8e9 * YR, PC = C.kpc / 1e3;          // age of the universe: Planck Collaboration 2020
const MU = 1e-22;                                                  // wave dark matter particle mass, eV (issue #1)
const f = (x, d = 2) => (x === 0 ? '0' : !isFinite(x) ? 'never' : x.toExponential(d - 1));
const p = x => (x >= 0.01 && x < 1e4 ? String(Number(x.toPrecision(2))) : f(x));  // plain number when short
const sigmaOf = Mbh => 200e3 * Math.pow(Mbh / (0.309e9 * C.Msun), 1 / 4.38); // M-sigma, Kormendy & Ho 2013 eq. 7 (m/s)
const muFor = (alpha, M) => alpha * C.hbar * C.c / (C.G * M) * C.c * C.c / C.e; // boson mass (eV) giving this alpha
const edge = (ok, lo, hi) => { for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (ok(mid)) lo = mid; else hi = mid; } return lo; };

console.log(`1. A ${MU} eV boson around a central black hole (level |211>, spin 0.99 unless stated)\n`);
const lamC = C.hbar * C.c / (MU * C.e), freq = MU * C.e / C.hbar;
console.log(`reduced Compton wavelength ${f(lamC)} m = ${p(lamC / PC)} pc; rest frequency ${f(freq)} /s, one cycle per ${p(2 * Math.PI / freq / YR)} yr\n`);
for (const m of [1e8, 1e9]) {
  const M = m * C.Msun, r = gravAtom(M, MU, 0.99), sigma = sigmaOf(M), rInfl = C.G * M / (sigma * sigma);
  const spinMin = 10 ** edge(x => !gravAtom(M, MU, 10 ** x).superradiant, -8, 0);
  console.log(`M = ${f(m)} Msun: r_g = ${f(r.rg)} m, alpha = ${f(r.alpha, 3)}, grows only if spin > ${f(spinMin)}`);
  console.log(`  cloud peak 4 r_g/alpha^2 = ${p(r.rCloud / C.kpc)} kpc, Bohr speed alpha c/2 = ${p(r.vBohr / 1e3)} km/s`);
  console.log(`  growth time ${f(r.tGrow / YR)} yr (spin 0.99), ${f(gravAtom(M, MU, 0.5).tGrow / YR)} yr (spin 0.5): ${f(r.tGrow / AGE)} ages of the universe`);
  console.log(`  host stars, M-sigma: sigma = ${p(sigma / 1e3)} km/s; the black hole's pull dominates out to G M / sigma^2 = ${p(rInfl / PC)} pc`);
  console.log(`  cloud / that radius = ${p(r.rCloud / rInfl)}; galaxy mass inside the cloud (isothermal, 2 sigma^2 r / G) = ${p(2 * sigma * sigma * r.rCloud / (C.G * M))} x the black hole`);
  const x = edge(x => gravAtom(M, 10 ** x, 0.99).tGrow > AGE, -26, Math.log10(muFor(0.2, M)));
  const g = gravAtom(M, 10 ** x, 0.99);
  console.log(`  lightest boson that grows within the age (one e-fold, spin 0.99): ${f(10 ** x)} eV, alpha = ${p(g.alpha)}, cloud ${p(g.rCloud / PC)} pc`);
  console.log(`  (Baumann, Chia & Porto eq. 2.14 lower edge 0.005 (M/3 Msun)^(1/9) = ${p(0.005 * Math.pow(m / 3, 1 / 9))})\n`);
}
const Mneed = 10 ** edge(x => gravAtom(10 ** x * C.Msun, MU, 0.99).tGrow > AGE, 8, 13);
console.log(`Black hole needed for a ${MU} eV cloud to grow within the age (spin 0.99): ${f(Mneed)} Msun, cloud ${p(gravAtom(Mneed * C.Msun, MU, 0.99).rCloud / PC)} pc`);
const fast = gravAtom(1e6 * C.Msun, muFor(0.42, 1e6 * C.Msun), 0.999);  // where growth is fastest (Brito, Cardoso & Pani eq. 5.32)
console.log(`Rate formula at alpha = 0.42, spin 0.999: growth time ${f(fast.tGrow / (C.G * 1e6 * C.Msun / C.c ** 3))} GM/c^3 (full numerical result: 6.7e6)`);
const tAbs = m => { const r = gravAtom(m * C.Msun, MU, 0); return 1 / (32 * Math.PI * Math.pow(r.alpha, 5) * MU * C.e / C.hbar) / YR; };
console.log(`Swallowing a black-hole-dominated core, 1/(32 pi alpha^5 mu) (Bar et al. 2019 eq. A21): ${f(tAbs(1e9))} yr for 1e9 Msun\n`);

// 2. HS 0810+2554, the lens studied by Amruth et al. (2023): z_l ~ 0.89 (an estimate), z_s = 1.51, Einstein radius 0.48".
const Mpc = 1e3 * C.kpc, H0 = 67.4e3 / Mpc, Om = 0.315;          // flat LCDM, Planck Collaboration 2020
const comoving = (z1, z2) => { let s = 0; const N = 4000; for (let i = 0; i < N; i++) { const z = z1 + (z2 - z1) * (i + 0.5) / N; s += 1 / Math.sqrt(Om * (1 + z) ** 3 + 1 - Om); } return s * (z2 - z1) / N * C.c / H0; };
const zl = 0.89, zs = 1.51, thE = 0.48 / 206265;
const Dl = comoving(0, zl) / (1 + zl), Ds = comoving(0, zs) / (1 + zs), Dls = comoving(zl, zs) / (1 + zs);
const sigE = C.c * Math.sqrt(thE * Ds / (4 * Math.PI * Dls)), RE = thE * Dl;  // singular isothermal sphere
const Mbh = 0.309e9 * Math.pow(sigE / 200e3, 4.38);
const Mh = 7e11, Msol = 3.3e8 * Math.cbrt(Mh / 1e9), rc = 1.6 * 0.79 * Math.cbrt(1e9 / Mh); // Oguri & Kubo 2026 eqs. 2.3, 2.6 (z = 0.88)
console.log('2. HS 0810+2554');
console.log(`  1 arcsec = ${p(Dl / 206265 / C.kpc)} kpc; Einstein radius ${p(RE / C.kpc)} kpc; isothermal sigma = ${p(sigE / 1e3)} km/s`);
console.log(`  M-sigma black hole ~ ${f(Mbh)} Msun (scatter 0.29 dex); its pull at the Einstein radius / the galaxy's, G M / (2 sigma^2 R) = ${p(C.G * Mbh * C.Msun / (2 * RE * sigE * sigE))}`);
console.log(`  soliton core for M_h = 7e11 Msun: r_c = ${p(rc * 1e3)} pc, mass ${f(Msol)} Msun; black hole / soliton = ${p(Mbh / Msol)} (soliton ${p(Math.cbrt(1e13 / Mh))} x heavier if M_h = 1e13)`);
console.log(`  soliton radius / Einstein radius = ${p(rc * C.kpc / RE)}; a reshaped core's quadrupole at the images ~ (r_c/R_E)^2 = ${p((rc * C.kpc / RE) ** 2)}`);
const lam = 150 * Math.cbrt(1e12 / Mh);                                        // Amruth et al. 2023 eq. 1
console.log(`  wave granule size (Amruth et al. eq. 1) ${p(lam)} pc`);
const mas = (pcs, z) => pcs * PC / (comoving(0, z) / (1 + z)) * 206265e3;
console.log(`  a black hole's reach of 18 to 63 pc spans ${p(mas(18, 0.3))} to ${p(mas(63, 0.3))} mas at z = 0.3 and ${p(mas(18, zl))} to ${p(mas(63, zl))} mas at z = ${zl}`);
