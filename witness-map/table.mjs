// Prints the witness number of every object, then the crowd clocks. Usage: node witness-map/table.mjs [gap in metres] [surroundings]
// Surroundings: natural (default), uhv, cryo, air, sunlit, interstellar, intergalactic.
import { createRequire } from 'node:module';
const { C, ENVS, OBJECTS, rates, CROWDS, crowd } = createRequire(import.meta.url)('./model.js');
const dx = parseFloat(process.argv[2] || '2.5e-7'), envKey = process.argv[3] || 'natural';
const f = x => (x === 0 ? '0' : !isFinite(x) ? 'never' : x.toExponential(1));
console.log(`gap ${dx} m, surroundings: ${envKey}\n`);
console.log('object'.padEnd(32) + 'W'.padStart(10) + 'wave clock s'.padStart(14) + 'witness s'.padStart(12) + '  main witness');
for (const o of OBJECTS) {
  const env = ENVS[envKey === 'natural' ? o.home : envKey];
  const r = rates(o, env, dx, null);
  const top = r.parts.slice().sort((a, b) => b.rate - a.rate)[0];
  console.log(o.name.padEnd(32) + f(r.W).padStart(10) + f(r.tWave).padStart(14) + f(r.tau).padStart(12) + '  ' + (top ? top.label : 'none'));
}

// The crowd (issue #2): wave dark matter in a galaxy as a whole. Not a witness number, so it is printed apart.
const pc = C.kpc / 1e3, yr = C.yr;
console.log('\nthe crowd: wave dark matter halos as a whole (not a witness number; README, "The crowd wave")\n');
console.log('halo lumps'.padEnd(52) + 'size pc'.padStart(9) + 'Suns'.padStart(9) + 'particles'.padStart(10) + 'lifetime yr'.padStart(12) + 'stirring yr'.padStart(12) + 'kick m/s'.padStart(10));
for (const h of CROWDS.filter(h => !h.rc)) { const r = crowd(h);
  console.log(`${h.name}, ${(h.m / C.eV).toExponential(0)} eV`.padEnd(52) + f(r.size / pc).padStart(9) + f(r.mLump / C.Msun).padStart(9) + f(r.perLump).padStart(10) + f(r.tLump / yr).padStart(12) + f(r.tStir / yr).padStart(12) + f(r.kick).padStart(10)); }
console.log('\n' + 'core'.padEnd(52) + 'radius pc'.padStart(9) + 'Suns'.padStart(9) + 'particles'.padStart(10) + 'wave yr'.padStart(12) + 'breathing yr'.padStart(13));
for (const h of CROWDS.filter(h => h.rc)) { const r = crowd(h);
  console.log(`${h.name}, ${(h.m / C.eV).toExponential(0)} eV`.padEnd(52) + f(h.rc / pc).padStart(9) + f(r.mSol / C.Msun).padStart(9) + f(r.perLump).padStart(10) + f(r.tWave / yr).padStart(12) + f(r.tBreath / yr).padStart(13)); }
