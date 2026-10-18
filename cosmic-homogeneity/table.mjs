// Prints the correlation dimension D2(r) and the homogeneity scale for matter and galaxies.
// Usage: node cosmic-homogeneity/table.mjs
import { createRequire } from 'node:module';
const H = createRequire(import.meta.url)('./homogeneity.js');

const pc = H.cosmology(H.PLANCK18);
console.log('Correlation dimension D2(r), Planck 2018, h^-1 Mpc\n');
console.log('r'.padStart(6) + 'galaxies, power law'.padStart(22) + 'matter z = 0, linear'.padStart(23));
for (const r of [0.1, 0.3, 1, 3, 5, 10, 20, 40, 60, 80, 100, 120, 150, 200, 300]) {
  const lin = r >= 10 ? H.D2(pc, r).toFixed(4) : '-', pl = r <= 20 ? H.D2powerLaw(r, 5, 1.8).toFixed(3) : '-';
  console.log(String(r).padStart(6) + pl.padStart(22) + lin.padStart(23));
}
console.log('\nGalaxy power law xi = (r/5)^-1.8 (Zehavi et al. 2005) up to 20 h^-1 Mpc; linear theory from 10 h^-1 Mpc out.');

console.log('\nHomogeneity scale R_H, h^-1 Mpc: where D2 reaches 3 (1 - eps)\n');
console.log('eps'.padStart(8) + 'matter z = 0'.padStart(14));
for (const eps of [0.01, 0.005, 0.002, 0.001]) console.log(String(eps).padStart(8) + H.homogeneityScale(pc, 1, { eps }).toFixed(0).padStart(14));

console.log('\nR_H (eps = 1%) for matter and for galaxies of bias b, h^-1 Mpc\n');
console.log('z'.padStart(5) + 'matter'.padStart(9) + 'b = 1, z-space'.padStart(16) + 'b = 2, z-space'.padStart(16));
for (const z of [0, 0.5, 1, 2.4]) {
  const a = H.amplitude(pc, { z }), a1 = H.amplitude(pc, { z, redshiftSpace: true }), a2 = H.amplitude(pc, { z, b2: 4, redshiftSpace: true });
  console.log(String(z).padStart(5) + H.homogeneityScale(pc, a).toFixed(0).padStart(9) + H.homogeneityScale(pc, a1).toFixed(0).padStart(16) + H.homogeneityScale(pc, a2).toFixed(0).padStart(16));
}

console.log('\nWiggleZ (Scrimgeour et al. 2012): their cosmology and measured bias, redshift space, h^-1 Mpc');
console.log('D2: where D2 = 2.97 (the paper\'s definition); N: where the scaled counts N = 1.01\n');
console.log('z'.padStart(5) + 'b^2'.padStart(6) + 'model D2'.padStart(10) + 'paper LCDM'.padStart(12) + 'measured'.padStart(11) + 'model N'.padStart(9));
const sc = H.cosmology(H.SCRIMGEOUR12);
for (const s of H.WIGGLEZ) {
  const amp = H.amplitude(sc, { z: s.z, b2: s.b2, beta: s.beta, redshiftSpace: true });
  const m = H.homogeneityScale(sc, amp), n = H.homogeneityScale(sc, amp, { by: 'N' });
  console.log(String(s.z).padStart(5) + String(s.b2).padStart(6) + m.toFixed(1).padStart(10) + String(s.RHlcdm).padStart(12) + `${s.RH}±${s.err}`.padStart(11) + n.toFixed(1).padStart(9));
}

console.log('\nThe acoustic peak: D2 for matter today, linear and with the peak smoothed by nonlinear motions (Sigma = 7 h^-1 Mpc)\n');
const ps = H.cosmology(H.PLANCK18, { sigmaNL: 7 });
console.log('r'.padStart(6) + 'linear'.padStart(10) + 'smoothed'.padStart(10));
for (const r of [90, 100, 105, 110, 113, 116, 120, 125]) console.log(String(r).padStart(6) + H.D2(pc, r).toFixed(5).padStart(10) + H.D2(ps, r).toFixed(5).padStart(10));
console.log(`peak of xi: ${H.baoPeak(pc).toFixed(1)} (linear), ${H.baoPeak(ps).toFixed(1)} (smoothed) h^-1 Mpc`);
