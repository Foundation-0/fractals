// Prints where quantum and Brownian paths are rough, and how finely each Witness Map object's surroundings draw its path.
// Usage: node quantum-paths/table.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const QP = require('./paths.js');
const WM = require('../witness-map/model.js');
const { C } = QP;
const f = x => x.toExponential(1);

console.log('Abbott-Wise path, recorded to within dx (3D, records far apart): dimension D against dx / (hbar/p)\n');
const m = C.me, p = 1e5 * C.me, lb = C.hbar / p, L = dx => QP.awLength(dx, { m, p, T: 1 });
console.log([0.01, 0.1, 0.3, 1, 3, 10, 100].map(x => `${String(x).padStart(5)}: D = ${QP.localDimension(L, x * lb).toFixed(2)}`).join('\n'));

console.log('\nThe rough window of real particles: from hbar/mc (speed limit) up to hbar/p (drift)\n');
console.log('particle'.padEnd(30) + 'hbar/mc m'.padStart(11) + 'hbar/p m'.padStart(11) + 'width'.padStart(9));
for (const [name, mass, v] of [['Electron at 54 eV', C.me, Math.sqrt(2 * 54 * C.e / C.me)], ['Thermal neutron, 2,200 m/s', C.mn, 2200],
  ['Buckyball (C60), 220 m/s', 720 * C.u, 220]]) {
  const a = C.hbar / (mass * C.c), b = C.hbar / (mass * v);
  console.log(name.padEnd(30) + f(a).padStart(11) + f(b).padStart(11) + f(b / a).padStart(9));
}

console.log('\nA Brownian path is the other way round on the inside: smooth below its ballistic length v_rms tau_p\n');
console.log('Li et al. (2010), 2.79 um silica bead in air: tau_p measured and from slip-corrected Stokes drag; trap size v_rms/w0\n');
const vrms = 0.4235e-3, mb = C.kB * 297 / (vrms * vrms);
for (const [P, meas, f] of [[99.8e3, 48.5e-6, 3064], [2.75e3, 147.3e-6, 3168]]) {
  const tp = mb / QP.stokesCunningham({ r: 1.395e-6, eta: 1.81e-5, mfp: 68e-9 * 101.325e3 / P });
  console.log(`${(P / 1e3 + ' kPa').padEnd(10)} tau_p ${(meas * 1e6).toFixed(1)} us measured, ${(tp * 1e6).toFixed(0)} us model; ballistic length ` +
    `${(vrms * meas * 1e9).toFixed(0)} nm; trap ${(vrms / (2 * Math.PI * f) * 1e9).toFixed(0)} nm`);
}
console.log('The trap holds the bead within its ballistic length, so the measured path is never rough; a free bead would be.');

console.log('\nWho draws the path: how finely each Witness Map object\'s own surroundings record it, against its thermal hbar/p\n');
console.log('object'.padEnd(32) + 'records'.padEnd(14) + 'main witness'.padEnd(32) + 'resolution m'.padStart(13) + 'hbar/p m'.padStart(10) + 'ratio'.padStart(9));
const row = (name, d) => console.log(name.padEnd(32) + d.regime.padEnd(14) + d.witness.padEnd(32) + f(d.resolution).padStart(13) + f(d.lambdaBar).padStart(10) + f(d.ratio).padStart(9));
for (const o of WM.OBJECTS) {
  const d = QP.drawnPath(WM, o, WM.ENVS[o.home]);
  if (d) row(o.name, d); else console.log(o.name.padEnd(32) + 'no witnesses');
}
row('Rubidium atom cooled to 1 uK', QP.drawnPath(WM, WM.OBJECTS.find(o => o.id === 'rb'), WM.ENVS.uhv, 1e-6));
console.log('\nResolution: dx* (the gap where W = 1) for weak records, hbar/q for full records. Ratio above 1: the surroundings');
console.log('never record the object finely enough to see its quantum roughness.');
