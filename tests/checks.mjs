// Checks the Witness Map model against published numbers. Run: npm test (or node tests/checks.mjs).
// Each check states the source, the published value, the model's value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const W = require('../witness-map/model.js');
const { C, ENVS, OBJECTS, rates, planckIntegral, BH_M, RS } = W;

let fails = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  published ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const obj = id => OBJECTS.find(o => o.id === id);

// 1. Joos & Zeh (1985) localisation rates for a grain of radius 1e-3 cm = 1e-5 m, long-wavelength limit.
//    Table values in cm^-2 s^-1: CMB 1e6, sunlight on Earth 1e21, air 1e37  ->  x1e4 for m^-2 s^-1.
const grain = { a: 1e-5, m: 1e-11, noGlow: true };
const lam = (env, i, dx) => rates(grain, { pops: [ENVS[env].pops[i]], Tamb: 0 }, dx, null).gamma / (dx * dx);
const JZ = 'Joos & Zeh 1985, table of localisation rates (a = 1e-3 cm)';
within('Big Bang afterglow, Lambda', lam('intergalactic', 0, 1e-7), 1e10, 3, JZ);
within('Sunlight at 1 AU, Lambda', lam('sunlit', 0, 1e-9), 1e25, 5, JZ);
within('Air at room temperature, Lambda', lam('air', 1, 1e-13), 1e41, 3, JZ);

// 2. Danielson, Satishchandran & Wald (2022), eqs. 16 and 20: worked examples with the Sun as a black hole at 1 AU.
const DSW = 'Danielson, Satishchandran & Wald 2022, arXiv:2205.06279';
const sunBH = { M: C.Msun, b: C.au };
const earthT = rates({ ...obj('earth'), dark: true }, ENVS.sunlit, 6.371e6, sunBH).tau;
within('Earth split by its own radius: decoherence time (s)', earthT, 1e-5, 3, DSW + ' eq. 20');
const elT = rates({ ...obj('electron'), dark: true }, ENVS.uhv, 1, sunBH).tau / 3.156e7;
within('Electron split by 1 m: decoherence time (years)', elT, 1e43, 3, DSW + ' eq. 16');

// 3. Hackermueller et al. (2004): heated C60 loses interference at a few thousand kelvin.
//    Model: about one informative photon per interferometer transit (~2 ms) between 2,000 and 3,500 K.
const perTransit = T => rates({ ...obj('c60'), T }, ENVS.uhv, 1e-6, null).gamma * 2e-3;
check('Buckyball heating onset', perTransit(2000) < 1 && perTransit(3500) > 1,
  `photons per 2 ms transit: ${fmt(perTransit(2000))} at 2,000 K, ${fmt(perTransit(3500))} at 3,500 K`,
  'Hackermueller et al., Nature 427, 711 (2004)');

// 4. Objects seen as waves in experiments land on the wave side at the gaps used (a few hundred nm).
const dx = 2.5e-7;
for (const o of OBJECTS.filter(o => o.seen)) {
  const r = rates(o, ENVS[o.home], dx, null);
  check(`${o.name} is on the wave side at 250 nm`, r.W < 1, `W = ${fmt(r.W)}`, o.seen);
}

// 5. Structural properties of the model.
check('Dark matter has no witnesses without a black hole', ['fdm', 'wimp'].every(id => rates(obj(id), ENVS.intergalactic, 1e-6, null).W === 0),
  'W = 0 for both dark matter particles', 'model');
check('Planck integral gives the CMB photon density', Math.abs(planckIntegral(2.725, 1, () => 1) / 4.11e8 - 1) < 0.02,
  `n = ${fmt(planckIntegral(2.725, 1, () => 1))} per m^3 (expected 4.11e8)`, 'standard value, 411 per cm^3');

// 6. The crowd (issue #2): a whole halo of wave dark matter acting as one classical wave. Not a witness number.
const { crowd, CROWDS, SOL, sis, AGE } = W;
const kpc = C.kpc, Msun = C.Msun, Gyr = 1e9 * C.yr, m22 = 1e-22 * C.eV, MSUN_PC3 = Msun / Math.pow(kpc / 1e3, 3);
const BFT = 'Bar-Or, Fouvry & Tremaine 2019, arXiv:1809.07673', HOTW = 'Hui, Ostriker, Tremaine & Witten 2017, arXiv:1610.08297';
within('Lump scale hbar/(m v), 1e-22 eV at 10 km/s (kpc)', crowd({ m: m22, rho: 1, sigma: 1e4, r: 100 * kpc }).lam / kpc, 1.92, 1.01, HOTW + ' eq. 18');
const in1 = crowd({ m: m22, ...sis(2e5, kpc) }); // isothermal halo, circular speed 200 km/s, 1 kpc from the centre
within('de Broglie wavelength h/(m sigma), isothermal halo at 200 km/s (kpc)', 2 * Math.PI * in1.lam / kpc, 0.85, 1.02, BFT + ' eq. 65');
within('Lump mass 1 kpc from the centre (Suns)', in1.mLump / Msun, 1.03e7, 1.02, BFT + ' eq. 64');
within('Stirring time x Coulomb logarithm, 1 kpc from the centre (Gyr)', in1.tStir * in1.lnL / Gyr, 2.08, 1.02, BFT + ' eq. 104');
//    Hui et al.'s relaxation time (eq. 32, f_relax = 1); Bar-Or et al. find the true rates 2 to 11 times slower.
const hui = (v, r) => 0.4 * Math.pow(m22, 3) * v * v * Math.pow(r, 4) / (Math.pow(Math.PI, 3) * Math.pow(C.hbar, 3));
within('Relaxation time at 100 km/s, 5 kpc (years)', hui(1e5, 5 * kpc) / C.yr, 1e10, 1.15, HOTW + ' eq. 32');
const slower = crowd({ m: m22, ...sis(1e5, 5 * kpc) }).tStir / hui(1e5, 5 * kpc);
check('Stirring time is 2 to 11 times the Hui et al. relaxation time', slower > 2 && slower < 11, `ratio ${slower.toFixed(1)}`, BFT + ', section 2.2');
//    A lump's lifetime is the per-particle wave clock at a gap of one lump scale.
const sun = crowd(CROWDS.find(h => h.id === 'sun')), same = crowd({ ...CROWDS[0], m: obj('fdm').m });
const tw = rates(obj('fdm'), ENVS.intergalactic, same.lam, null).tWave;
check('Lump lifetime equals the wave clock of one particle at a gap of hbar/(m sigma)', Math.abs(tw / same.tLump - 1) < 1e-9,
  `wave clock ${fmt(tw)} s, lump lifetime ${fmt(same.tLump)} s`, 'model (identity)');
//    Rough picture: one kick per lump lifetime, summed over distances (Coulomb logarithm), against the full calculation.
for (const [name, h] of [["Sun's orbit", sun], ['1 kpc, isothermal', in1]]) {
  const tKick = h.tLump * Math.pow(h.lam / h.tLump, 2) / (h.kick * h.kick * h.lnL), r = tKick / h.tStir;
  check(`Kick picture gives the stirring time within x3, ${name}`, r < 3 && r > 1 / 3,
    `kicks ${fmt(tKick / C.yr)} yr, full calculation ${fmt(h.tStir / C.yr)} yr`, BFT + ' eq. 85');
}
//    Who is a crowd: particles per lump. Bar-Or et al. put the crossover at a few tens of eV in a typical galaxy.
const perLumpAt = m => crowd({ ...CROWDS[0], m }).perLump;
const mCross = m22 * Math.pow(perLumpAt(m22), 0.25) / C.eV; // perLump scales as m^-4
check('Crowd ends (one particle per lump) near "a few tens of eV"', mCross > 5 && mCross < 100, `crossover ${mCross.toFixed(0)} eV`, BFT + ', section 2.2');
check('Heavy dark matter (100 GeV) is not a crowd', perLumpAt(1e11 * C.eV) < 1e-30, `particles per lump ${fmt(perLumpAt(1e11 * C.eV))}`, 'model');
check("At the Sun's orbit, lumps renew far faster than the age of the universe and stir far slower",
  sun.tLump < AGE / 1e3 && sun.tStir > 10 * AGE, `lifetime ${fmt(sun.tLump / C.yr)} yr, stirring ${fmt(sun.tStir / C.yr)} yr`, 'model');
//    The core (soliton): ground state of the Schroedinger-Poisson equations, against published fits.
const SCB14 = 'Schive, Chiueh & Broadhurst 2014, arXiv:1406.6586', SCB20 = 'Schive, Chiueh & Broadhurst 2020, arXiv:1912.09483';
const c23 = crowd({ m: 1e-23 * C.eV, rc: kpc });
within('Core peak density, 1e-23 eV, 1 kpc core (Suns per pc^3)', c23.rhoC / MSUN_PC3, 1.9, 1.05, SCB14 + ' eq. 4');
within('Core mass inside the core radius (Suns)', c23.mCore / Msun, 5.5e9, 1.05, SCB14 + ' eq. 3');
check('Core radius encloses about a quarter of the core', c23.mCore / c23.mSol > 0.2 && c23.mCore / c23.mSol < 0.3,
  `fraction ${(c23.mCore / c23.mSol).toFixed(3)}`, SCB14 + ', methods');
const eri = crowd(CROWDS.find(h => h.id === 'core'));
within('Eridanus II-like core: peak density (Suns per pc^3)', eri.rhoC / MSUN_PC3, 0.1, 1.5, SCB20);
within('Eridanus II-like core: mass inside the core radius (Suns)', eri.mCore / Msun, 1e8, 1.5, SCB20);
within('Core wave period at 0.1 Suns per pc^3 (Myr)', eri.tWave * Math.sqrt(eri.rhoC / (0.1 * MSUN_PC3)) / (1e6 * C.yr), 120, 1.05, SCB20);
//    Breathing: Veltmaat et al.'s fitted frequency against a rough first-principles estimate, the gap between the core's
//    two lowest radial levels in its own frozen gravity. Units hbar = m = 4 pi G rho_c = 1; own solver, not model.js.
{
  const h = 2e-3, N = 30000, x0 = 9; // grid to x = 60; outside x0 the core's pull is that of a point mass
  const rk4 = (d, x, y) => { const a = (y, k, s) => y.map((v, j) => v + s * k[j]);
    const k1 = d(x, y), k2 = d(x + h / 2, a(y, k1, h / 2)), k3 = d(x + h / 2, a(y, k2, h / 2)), k4 = d(x + h, a(y, k3, h));
    return y.map((v, j) => v + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); };
  const ground = e => { const d = (x, y) => [y[1], 2 * (y[2] - e) * y[0] - 2 * y[1] / x, y[3], y[0] * y[0] - 2 * y[3] / x];
    let y = [1 - e * h * h / 3, -2 * e * h / 3, h * h / 6, h / 3]; const pot = [0, y[2]];
    for (let i = 1; i * h < x0; i++) { y = rk4(d, i * h, y); pot.push(y[2]); if (y[0] < 0) return { s: -1 }; if (y[1] > 0) return { s: 1 }; }
    return { s: 0, pot, I: x0 * x0 * y[3], inf: y[2] + x0 * y[3] }; };
  let lo = 0.1, hi = 2, g = ground(1); // bisect until a run reaches x0 without turning: that is the ground state
  while (g.s !== 0) { const mid = (lo + hi) / 2; g = ground(mid); if (g.s > 0) lo = mid; else hi = mid; }
  const V = i => (i < g.pot.length ? g.pot[i] - g.inf : -g.I / (i * h));
  const nodes = E => { let u0 = 0, u1 = h, n = 0; for (let i = 1; i < N && Math.abs(u1) < 1e100; i++) {
    const u2 = 2 * u1 - u0 + 2 * h * h * (V(i) - E) * u1; if (u2 * u1 < 0) n++; u0 = u1; u1 = u2; } return n; };
  const level = k => { let a = -2, b = -1e-3; for (let it = 0; it < 50; it++) { const mid = (a + b) / 2; if (nodes(mid) > k) b = mid; else a = mid; } return a; };
  const E0 = level(0), E1 = level(1);
  check('Core energy level agrees between two independent solvers', Math.abs(E0 / SOL.eInf - 1) < 1e-3,
    `here ${E0.toFixed(4)}, model.js ${SOL.eInf.toFixed(4)}`, 'model');
  const fFrozen = (E1 - E0) * Math.sqrt(4 * Math.PI) / (2 * Math.PI); // cycles per (G rho_c)^-1/2
  const fFit = 10.94 / Gyr / Math.sqrt(C.G * 1e9 * Msun / Math.pow(kpc, 3));
  within('Core breathing frequency, cycles per (G rho_c)^-1/2 (frozen-gravity estimate)', fFrozen, fFit, 1.5, 'Veltmaat, Niemeyer & Schwabe 2018, eq. 16');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
