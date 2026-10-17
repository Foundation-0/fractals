// Prints the witness number of every object. Usage: node witness-map/table.mjs [gap in metres] [surroundings]
// Surroundings: natural (default), uhv, cryo, air, sunlit, interstellar, intergalactic.
import { createRequire } from 'node:module';
const { ENVS, OBJECTS, rates } = createRequire(import.meta.url)('./model.js');
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
