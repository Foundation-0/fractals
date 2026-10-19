// Prints how deep the nesting of dark matter halos goes and what stops it: the small-scale spectrum, the floors a WIMP
// and wave dark matter set, sigma(M) and when each mass collapses, the levels of nesting below a Milky Way, and the
// Jeans scale and soliton in the Witness Map's terms. Usage: node halos/table.mjs (under a second)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const H = require('./model.js');
const WM = require('../witness-map/model.js');
const e2 = x => (x === 0 ? '0' : Math.abs(x) >= 1e-2 && Math.abs(x) < 1e4 ? x.toPrecision(3) : x.toExponential(2));
const pad = (s, n) => String(s).padStart(n);

const P18 = H.PLANCK18, md = H.model(P18, { perDecade: 160 }), bg = md.bg, h = P18.h;
const hm = c => { const k = H.halfMode(c), k2 = H.halfMode(c, { power: true }); return { k, M: H.massOfK(bg, k), k2, M2: H.massOfK(bg, k2) }; };

// ---- 1. The spectrum
const tailFree = H.smallScaleTail(bg, H.radiationEra({ lmax: 120, xmax: 1600 })), tailFluid = H.smallScaleTail(bg, H.radiationEra({ free: false }));
const noB = H.HOM.transferEH({ ...P18, Ob: 1e-7 });
console.log('1. Linear matter power today: Planck 2018, Eisenstein & Hu no-wiggle transfer function, sigma8 = 0.8111');
console.log(`   rho_m = ${e2(bg.rhoM)} Msun/Mpc^3, z_eq = ${bg.zeq.toFixed(0)}, k_eq = ${bg.keq.toFixed(5)} Mpc^-1\n`);
console.log('   k [h/Mpc]  P [(Mpc/h)^3]  Delta^2  dlnDelta^2/dlnk   T_nw    T_nw / T_nw(no baryons)   EH (no baryons) / derived tail:');
console.log('                                                                                         free neutrinos   fluid neutrinos');
for (const k of [1e-3, 1e-2, 1e-1, 1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9]) {
  const sl = Math.log(md.Delta2(k * 1.01) / md.Delta2(k / 1.01)) / Math.log(1.01 * 1.01);
  console.log(`   ${pad(k.toExponential(0), 7)}  ${pad(e2(md.P(k)), 11)}  ${pad(e2(md.Delta2(k)), 9)}  ${pad(sl.toFixed(3), 9)}  ${pad(md.tf.Tnw(k).toExponential(2), 12)}  ` +
    `${pad((md.tf.Tnw(k) / noB.Tnw(k)).toFixed(3), 12)}` + (k >= 1e2 ? `  ${pad((noB.Tnw(k) / tailFree.T(k * h)).toFixed(3), 23)}  ${pad((noB.Tnw(k) / tailFluid.T(k * h)).toFixed(3), 16)}` : ''));
}
console.log(`   Derived tails T -> coef (k_eq/k)^2 ln(c k/k_eq): free-streaming neutrinos ${tailFree.coef.toFixed(2)}, c = ${tailFree.c.toFixed(4)};` +
  ` neutrinos a fluid ${tailFluid.coef.toFixed(2)}, c = ${tailFluid.c.toFixed(4)}`);
const kNu = 1 / H.decoupling(bg, 1).tau;                  // horizon wavenumber when the neutrinos decouple, at about 1 MeV
console.log(`   The neutrinos decouple at about 1 MeV, when the horizon is k = ${e2(kNu)} Mpc^-1. Modes entering well before that see them`);
console.log(`   as a fluid: from about ${e2(10 * kNu)} Mpc^-1 up the fluid tail applies, and Eisenstein & Hu overstate the transfer function`);
console.log('   there, at the bino cut-off included, by about 10%.');

// ---- 2. The floors
const bino = H.wimpGHS({ m: 100, Tkd: 30 }), Mb = hm(bino).M;
const derived = H.wimpFreeStream(bg, { m: 100, Tkd: 30 });
console.log('\n2. Floors. Masses of spheres: radius pi/k (half a wavelength) for a wavenumber k; M_hm where T = 1/2, M_1/2 where T^2 = 1/2 [Msun]');
console.log(`   WIMP 100 GeV, T_kd 30 MeV: k_fs = ${e2(bino.kfs)} Mpc^-1 (derived from the coasting distance ${(derived.s * 1e6).toFixed(3)} pc: k_fs = sqrt2/s = ${e2(derived.kfs)}), k_d = ${e2(bino.kd)}`);
console.log(`     M(pi/k_fs) = ${e2(H.massOfK(bg, bino.kfs))}, M_hm = ${e2(Mb)}, M_1/2 = ${e2(hm(bino).M2)}, M(pi/k_d) = ${e2(H.massOfK(bg, bino.kd))};` +
  ` Gaussian form, same k_fs: M_hm = ${e2(hm(H.gaussianOf(bino)).M)}`);
console.log(`     pi/k_fs = ${(Math.PI / bino.kfs * 1e6).toFixed(2)} pc comoving (a sphere of radius 1 pc holds ${e2(4 * Math.PI / 3 * bg.rhoM * 1e-18)} Msun)`);
const dk = H.decoupling(bg, 30);
console.log(`     at 30 MeV the radiation has g = ${dk.g.toFixed(2)} (muons and pions add ${(dk.g - 10.75).toFixed(2)} to photons, e+- and neutrinos);` +
  ` horizon ${(dk.tau * 1e6).toFixed(2)} pc comoving: acoustic mass M_ao = ${e2(H.acousticMass(bg, 30))}`);
const TK = [3, 10, 20, 30, 50];
console.log('\n   WIMP floor, max[M(pi/k_fs), M_ao] (Bringmann 2009) / the same with M_hm, by mass and kinetic decoupling temperature:');
console.log('   ' + 'm [GeV] \\ T_kd [MeV]'.padEnd(21) + TK.map(t => pad(t, 20)).join(''));
for (const m of [10, 100, 1000]) console.log('   ' + pad(m, 6).padEnd(21) + TK.map(Tkd => { const f = H.wimpFloor(bg, { m, Tkd }); return pad(`${e2(f.bringmann)} / ${e2(f.halfMode)}`, 20); }).join(''));
console.log('   ' + 'acoustic mass alone'.padEnd(21) + TK.map(Tkd => pad(e2(H.acousticMass(bg, Tkd)), 20)).join(''));
console.log('   Bringmann (2009): across WIMP models the floor runs from about 1e-11 to nearly 1e-3 Msun (T_kd from several MeV to a few GeV).');

const MASSES = [1e-22, 2e-21, 2.9e-21, 2e-20, 3e-19, 8e-18];
const wave = MASSES.map(m => { const c = H.fdmHBG(m / 1e-22), r = hm(c), J = H.jeansMasses(bg, H.kJcomoving(bg, m / 1e-22, 1));
  return { m, c, k2: r.k2, M2: r.M2, Mhm: r.M, M0: H.schiveM0(m / 1e-22), MJ: J.halfWave }; });
console.log('\n   Wave dark matter: the halo population turns down near M_1/2, M_hm and Schive\'s M0; nothing collapses below the Jeans mass.');
console.log('   m [eV]     k_1/2 [Mpc^-1]   M_1/2      M_hm      M0 (Schive)   Jeans today   bound at this mass (each assumes all the dark matter)');
for (const w of wave) {
  const b = H.BOUNDS.find(x => x.m === w.m);
  console.log(`   ${w.m.toExponential(1)}  ${pad(e2(w.k2), 12)}  ${pad(e2(w.M2), 11)}  ${pad(e2(w.Mhm), 9)}  ${pad(e2(w.M0), 11)}  ${pad(e2(w.MJ), 12)}   ${b ? `${b.cl}: ${b.src}` : 'benchmark of the lensing notes; excluded by all of the bounds'}`);
}
console.log('   The fits of Hu et al. (2000) and Schive et al. (2016) were calibrated near 1e-22 eV; at 3e-19 eV and above they are extrapolations.');

// ---- 3. sigma(M) and collapse
const masses = [1e-12, 1e-9, 1e-6, 1e-3, 1, 1e3, 1e6, 1e9, 1e12, 1e15];
const models = [H.CDM, bino, wave[0].c, wave[3].c];
console.log('\n3. sigma(M) today (top-hat), with n_eff = 6 alpha - 3 for sigma ~ M^-alpha in brackets: at n_eff = -3 every mass collapses at once');
console.log('   M [Msun] ' + models.map(c => c.short.padStart(17)).join(''));
for (const M of masses) console.log(`   ${pad(M.toExponential(0), 7)} ` + models.map(c => pad(`${md.sigma(M, c).toFixed(2)} (${md.slope(M, c).neff.toFixed(2)})`, 17)).join(''));
const tMyr = z => bg.age(z) * 1e3;
console.log('\n   Collapse redshift of a 1 sigma peak, sigma(M) D(z_c) = 1.686, and the cosmic age then [Myr]');
console.log('   M [Msun] ' + models.map(c => c.short.padStart(17)).join(''));
for (const M of masses) console.log(`   ${pad(M.toExponential(0), 7)} ` + models.map(c => { const z = md.zc(M, c); return pad(z < 0 ? 'not yet' : `${z.toFixed(1)} (${tMyr(z).toFixed(0)})`, 17); }).join(''));
console.log('   Below a cut-off sigma stops growing, so the flat redshifts there are not halos: nothing smaller collapses on its own.');
const chain = [1e-12, 1e-9, 1e-6, 1e-3].map(M => ({ M, z: md.zc(M) }));
console.log(`   CDM without a cut-off: ${chain.map(c => `${e2(c.M)} at z ${c.z.toFixed(1)}`).join(', ')}: nine decades within ${(tMyr(chain[3].z) - tMyr(chain[0].z)).toFixed(0)} Myr`);
const zb = o => md.zc(Mb, bino, o).toFixed(1);
console.log(`\n   Bino halos at M_hm = ${e2(Mb)} Msun, 1 sigma: z_c = ${zb()}; with the radiation-era growing mode ${zb({ radiation: true })};` +
  ` with the dark matter growing alone (the gas never falls in) ${zb({ baryonLag: true })} to ${zb({ baryonLag: 'cdm' })}; 2 sigma ${zb({ nu: 2 })}, 3 sigma ${zb({ nu: 3 })};` +
  ` z = 60 takes a ${(H.DELTA_C / (md.sigma(Mb, bino) * md.growth(60))).toFixed(1)} sigma peak`);
const runs = [-0.01, 0.01].map(a => H.model(P18, { perDecade: 160, running: a }));
console.log(`   Running dn_s/dlnk = -0.01 / +0.01 (sigma8 fixed): sigma(M_hm) ${runs[0].sigma(Mb, bino).toFixed(1)} / ${runs[1].sigma(Mb, bino).toFixed(1)} (${md.sigma(Mb, bino).toFixed(1)} without), z_c ${runs[0].zc(Mb, bino).toFixed(1)} / ${runs[1].zc(Mb, bino).toFixed(1)}`);
// Neutrinos still coupled at horizon entry: scale T by the fluid/free tail ratio, ramped in ln k over a decade above k_nu.
const ramp = k => { const t = Math.min(1, Math.max(0, Math.log(k / kNu) / Math.LN10)); return 1 - t + t * tailFluid.T(k) / tailFree.T(k); };
const nuF = H.model(P18, { perDecade: 160, factor: ramp });
console.log(`   Neutrinos coupled at horizon entry (the fluid tail from ${e2(10 * kNu)} Mpc^-1 up): sigma(M_hm) ${nuF.sigma(Mb, bino).toFixed(1)}, z_c ${nuF.zc(Mb, bino).toFixed(1)}`);
const wm = H.model(H.WMAP_ERA, { perDecade: 160 }), MbW = H.massOfK(wm.bg, H.halfMode(bino));
console.log(`   WMAP-era round numbers (h 0.7, Om 0.3, n_s 1, sigma8 0.9): sigma(M_hm) ${wm.sigma(MbW, bino).toFixed(1)}, z_c 1 sigma ${wm.zc(MbW, bino).toFixed(1)}, 2 sigma ${wm.zc(MbW, bino, { nu: 2 }).toFixed(1)}` +
  ` (Green, Hofmann & Schwarz 2005: z = 60 +- 20)`);
console.log(`   The bino's power per log k, Delta^2 T^2, peaks at k = ${e2(md.peak(bino))} Mpc^-1, a factor ${(hm(bino).k / md.peak(bino)).toFixed(1)} below k_hm: just before the cut-off.`);

// ---- 4. Nesting
const muAq = H.muAquarius();
console.log(`\n4. Nesting below a 1e12 Msun Milky Way: decades from the floor, and levels if each level is 10x, 100x or mu = ${muAq.toFixed(4)} below its host`);
console.log('   (mu: where the Aquarius law expects the largest subhalo, N(>mu M_host) = 1). Subhalos above the floor, dN/dM = a0 (M/m0)^-1.9,');
console.log('   m0 = 2.52e7 Msun: a0 = 1.77e-5/Msun for a 1e12 Msun host within 353 kpc, and 3.26e-5 for Aq-A (1.84e12, within 433 kpc);');
console.log('   f_sub: the mass in subhalos from the floor to 1e10 Msun over 1e12 Msun. All extrapolated below about 1e5 Msun, tides ignored.\n');
const floors = [
  ['WIMP range, lightest (Bringmann)', 1e-11],
  ...[[40, 'bringmann'], [30, 'bringmann'], [30, 'halfMode'], [10, 'bringmann']].map(([Tkd, key]) =>
    [`Bino, T_kd ${Tkd} MeV, ${key === 'bringmann' ? 'max(M(pi/k_fs), M_ao)' : 'max(M_hm, M_ao)'}`, H.wimpFloor(bg, { m: 100, Tkd })[key]]),
  ['WIMP range, heaviest (Bringmann)', 1e-3],
  ...wave.flatMap(w => [[`wave ${w.m.toExponential(1)} eV, M_hm`, w.Mhm], [`wave ${w.m.toExponential(1)} eV, Schive M0`, w.M0]]),
];
console.log('   floor                                          M_floor   decades   levels 10x  100x   mu    N(>floor), 1e12   Aq-A      f_sub');
for (const [name, M] of floors) {
  const n = H.nesting(M);
  console.log(`   ${name.padEnd(45)} ${pad(e2(M), 9)}  ${pad(n.decades.toFixed(1), 6)}  ${pad(n.levels[0], 10)}  ${pad(n.levels[1], 4)}  ${pad(n.levels[2], 4)}  ${pad(e2(H.subhaloCount(M)), 15)}` +
    `  ${pad(e2(H.subhaloCount(M, Infinity, H.AQUARIUS)), 9)}  ${pad(M < 1e10 ? e2(H.subhaloMass(M, 1e10) / 1e12) : '-', 7)}`);
}
console.log('\n   Wave dark matter, decades from the population floor (M_1/2, M_hm, M0) and, for comparison, from the Jeans mass today:');
for (const w of wave) {
  const d = [w.M2, w.Mhm, w.M0].map(M => H.nesting(M).decades), lev = [w.M2, w.Mhm, w.M0].map(M => H.nesting(M).levels[2]);
  const lv = Math.min(...lev) === Math.max(...lev) ? Math.min(...lev) : `${Math.min(...lev)}-${Math.max(...lev)}`;
  console.log(`   ${w.m.toExponential(1)} eV: ${Math.min(...d).toFixed(1)}-${Math.max(...d).toFixed(1)} decades, ${lv} levels at mu; Jeans mass today ${H.nesting(w.MJ).decades.toFixed(1)} decades`);
}

// ---- 5. The Jeans scale and the soliton
console.log('\n5. The Jeans scale in the Witness Map\'s terms (its constants): the wave clock m dx^2/hbar at dx = 1/k_J against 1/(4 sqrt(pi G rho))');
for (const [lab, rho] of [['mean matter today', bg.rhoMsi], ['mean matter at equality', bg.rhoMsi / Math.pow(bg.aeq, 3)], ['the Sun\'s orbit, 0.4 GeV/cm^3', 0.4 * WM.GEV_CM3]]) {
  const J = H.jeans(1e-22, rho, WM.C);
  console.log(`   ${lab.padEnd(30)} 1e-22 eV: lambda_J = ${e2(J.lambdaJ / WM.C.kpc)} kpc; wave clock ${e2(J.tWave / WM.C.yr)} yr = gravity's ${e2(J.tGrav / WM.C.yr)} yr; free fall ${e2(J.tFF / WM.C.yr)} yr`);
}
console.log('   At dx = lambda_J/2 = pi/k_J the clock is pi^2 = 9.87 times longer: the factor is a choice of convention.');
const kJ0 = H.kJcomoving(bg, 1, 1), kJeq = H.kJcomoving(bg, 1, bg.aeq), kJdm = H.kJcomoving(bg, 1, 1, { rho0: 0.12 * bg.rhoCrit });
console.log(`   Comoving k_J at 1e-22 eV: today ${kJ0.toFixed(1)} Mpc^-1 (all matter) or ${kJdm.toFixed(1)} (0.12 rho_crit/h^2, the dark matter alone: the quoted 66.5);` +
  ` at equality ${kJeq.toFixed(2)}`);
{ const rhoDM = 0.12 * bg.rhoCrit * Math.pow(H.C.Mpc, 3) / H.C.Msun, lam = 2 * Math.PI / kJdm;
  console.log(`   Jeans mass today in the dark matter density alone, sphere of diameter lambda_J: ${e2(4 * Math.PI / 3 * rhoDM * Math.pow(lam / 2, 3))} Msun` +
    ' (k_J and M_J both go as rho^(1/4))'); }
const J0 = H.jeansMasses(bg, kJ0), Jeq = H.jeansMasses(bg, kJeq);
console.log('   Jeans mass at 1e-22 eV [Msun]             today      at equality');
for (const [key, lab] of [['fullWave', 'sphere of radius lambda_J'], ['cube', 'cube of side lambda_J'], ['halfWave', 'sphere of diameter lambda_J (Hui et al.)'], ['inverseK', 'sphere of radius 1/k_J']])
  console.log(`   ${lab.padEnd(40)} ${pad(e2(J0[key]), 9)}   ${pad(e2(Jeq[key]), 9)}`);
console.log(`   Spread: ${e2(Jeq.fullWave / J0.inverseK)} between the largest and smallest; M_J ~ m^-3/2 while M_hm and M0 go as m^-4/3`);
const s = H.solitonRelation(WM.SOL), u22 = H.hbar2Gm2(1e-22, WM.C) / (WM.C.Msun * WM.C.kpc);
console.log(`\n   Soliton (the Schroedinger-Poisson ground state, solved in witness-map/model.js), r_c its half-density radius:`);
console.log(`   M(<r_c) r_c = ${s.coreRc.toFixed(3)} hbar^2/(G m^2), M_total r_c = ${s.totalRc.toFixed(3)} hbar^2/(G m^2); ${(s.coreShare * 100).toFixed(1)}% of the mass lies inside r_c.`);
console.log(`   At 1e-22 eV, hbar^2/(G m^2) = ${e2(u22)} Msun kpc: a 1e9 Msun soliton has r_c = ${(s.totalRc * u22 / 1e9 * 1e3).toFixed(0)} pc.`);
console.log(`   A gravitational atom, the same wave around a point mass M, has its density halved at r = (ln 2/2) a0 with M a0 = hbar^2/(G m^2):`);
console.log(`   M r_1/2 = ${(Math.LN2 / 2).toFixed(3)} hbar^2/(G m^2). The soliton is the same atom with the mass spread through it, ${(s.totalRc / (Math.LN2 / 2)).toFixed(1)} times larger.`);
