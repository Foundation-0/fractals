// Checks the cosmic homogeneity model against published numbers and its own closed forms. Run: npm test.
// Each check states the source, the published or expected value, the model's value and the tolerance.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const H = require('../cosmic-homogeneity/homogeneity.js');

let fails = 0;
const fmt = x => (x === 0 ? '0' : x.toExponential(2));
function within(name, got, want, factor, src) {
  const ok = got > 0 && got / want <= factor && want / got <= factor;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      model ${fmt(got)}  expected ${fmt(want)}  (within x${factor})  ${src}`);
  if (!ok) fails++;
}
function check(name, ok, detail, src) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}  ${src}`);
  if (!ok) fails++;
}
const S12 = 'Scrimgeour et al., MNRAS 425, 116 (2012), arXiv:1205.6812';

// 1. Scrimgeour et al.'s own LCDM prediction for WiggleZ: their fiducial cosmology, and each slice's measured bias b^2
//    (Table 4, fitted separately for the D2 and the N statistic) and redshift-space beta (Table 3). Linear theory with
//    the Kaiser factor only.
const sc = H.cosmology(H.SCRIMGEOUR12);
const rows = H.WIGGLEZ.map(s => {
  const amp = b2 => H.amplitude(sc, { z: s.z, b2, beta: s.beta, redshiftSpace: true });
  return { ...s, model: H.homogeneityScale(sc, amp(s.b2D)), modelN: H.homogeneityScale(sc, amp(s.b2N), { by: 'N' }) };
});
check('WiggleZ LCDM homogeneity scale (D2 = 2.97), four slices, within 3 h^-1 Mpc',
  rows.every(s => Math.abs(s.model - s.RHlcdm) <= 3),
  rows.map(s => `z ${s.z}: ${s.model.toFixed(1)} vs ${s.RHlcdm}`).join('; '), S12 + ', Table 4 and Conclusions');
check('Measured WiggleZ homogeneity scales lie within 2 sigma of the model',
  rows.every(s => Math.abs(s.model - s.RH) <= 2 * s.err),
  rows.map(s => `z ${s.z}: ${s.RH}±${s.err} vs ${s.model.toFixed(1)}`).join('; '), S12 + ', abstract');
check('The other definition (N = 1.01) gives a few h^-1 Mpc more, as in their LCDM counts, within 3 h^-1 Mpc',
  rows.every(s => Math.abs(s.modelN - s.RHlcdmN) <= 3 && s.modelN > s.model),
  rows.map(s => `z ${s.z}: ${s.modelN.toFixed(1)} vs ${s.RHlcdmN}`).join('; '), S12 + ', Table 4');

// 2. Ntelis et al. (2017), BOSS CMASS galaxies, corrected for bias and redshift-space distortion: their abstract gives
//    LCDM R_H = 62.0 h^-1 Mpc, a real-space matter value (Sec. 5.5, Table 5), in their fiducial Planck 2015 cosmology.
//    The paper attaches no redshift to it; z = 0.57 is the CMASS effective redshift.
const p15 = H.cosmology(H.PLANCK15);
within('Matter homogeneity scale at z = 0.57, Planck 2015 (h^-1 Mpc)', H.homogeneityScale(p15, H.amplitude(p15, { z: 0.57 })), 62.0, 1.05,
  'Ntelis et al., JCAP 06 (2017) 019, arXiv:1702.02159, abstract (LCDM value for matter)');

// 3. The linear spectrum itself.
const pc = H.cosmology(H.PLANCK18);
within('Sound horizon at Planck\'s drag redshift (z = 1059.94), Eisenstein-Hu eq. 6 (Mpc)', pc.tf.soundHorizon(H.PLANCK18.zdrag), H.PLANCK18.rdrag, 1.01,
  'Planck 2018 r_drag (TT,TE,EE+lowE+lensing); at their own fitted z_d = 1021 the same formula gives 150.9');
within('Baryon acoustic peak in the linear correlation function (sanity check)', H.baoPeak(pc), 100, 1.05, 'Eisenstein et al., ApJ 633, 560 (2005), ~100 h^-1 Mpc');
within('sigma8 normalisation', pc.sigma(8), H.PLANCK18.sigma8, 1.0001, 'model');

// 4. Small scales: galaxies with xi = (r/r0)^-gamma, r0 = 5 h^-1 Mpc and gamma = 1.8 (Zehavi et al., ApJ 630, 1 (2005)).
//    Deep inside r0 the counts grow as r^(3 - gamma) = r^1.2; between 1 and 30 h^-1 Mpc their endpoint slope is ~1.9.
const PL = 'model, with the power law of Zehavi et al., ApJ 630, 1 (2005)';
within('Correlation dimension deep inside r0 tends to 3 - gamma', H.D2powerLaw(0.01, 5, 1.8), 1.2, 1.01, PL);
check('The counts\' slope over 1-30 h^-1 Mpc is an average through the climb from 1.2 to 3', Math.abs(H.slopePowerLaw(1, 30, 5, 1.8) - 1.9) < 0.05,
  `slope ${H.slopePowerLaw(1, 30, 5, 1.8).toFixed(2)}; D2 is ${H.D2powerLaw(1, 5, 1.8).toFixed(2)} at 1 and ${H.D2powerLaw(30, 5, 1.8).toFixed(2)} at 30 h^-1 Mpc`, PL);

// 5. The homogeneity scale is a convention, not a length nature sets: it moves with the threshold, the tracer and the epoch.
const r1 = H.homogeneityScale(pc), r01 = H.homogeneityScale(pc, 1, { eps: 0.001 });
const rz = [0, 0.5, 1, 2.4].map(z => H.homogeneityScale(pc, H.amplitude(pc, { z })));
check('A ten times stricter threshold more than doubles R_H; R_H falls with redshift for matter',
  r01 > 2 * r1 && rz.every((v, i) => i === 0 || v < rz[i - 1]),
  `matter, z = 0: ${r1.toFixed(0)} (1%) and ${r01.toFixed(0)} (0.1%) h^-1 Mpc; z = 0, 0.5, 1, 2.4: ${rz.map(v => v.toFixed(0)).join(', ')}`, 'model');
// The acoustic peak makes the linear D2 dip slightly near 113 h^-1 Mpc, so there R_H can jump. Nonlinear motions
// smooth the peak (Sigma ~ 8 h^-1 Mpc before reconstruction in BOSS, Beutler et al. 2017) and the jump goes away.
function largestJump(cos) {
  const a = H.amplitude(cos, { z: 0.5, b2: 4 }); let prev = null, best = 0;
  for (let f = 1; f <= 1.15001; f += 0.005) { const r = H.homogeneityScale(cos, a * f); if (prev !== null) best = Math.max(best, r - prev); prev = r; }
  return best;
}
const jLin = largestJump(pc), jSm = largestJump(H.cosmology(H.PLANCK18, { sigmaNL: 7 }));
check('Linear theory: R_H jumps on the acoustic plateau; with the peak smoothed it does not',
  jLin > 10 && jSm < 2, `b = 2, z = 0.5, real space: largest change for a 0.5% amplitude step ${jLin.toFixed(1)} h^-1 Mpc (linear), ${jSm.toFixed(1)} (Sigma = 7 h^-1 Mpc)`, 'model');

console.log(fails ? `\n${fails} check(s) failed` : '\nall checks pass');
process.exit(fails ? 1 : 0);
