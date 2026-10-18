// Prints the witness number of every object. Usage: node witness-map/table.mjs [gap in metres, > 0] [surroundings]
// Surroundings: natural (default), uhv, cryo, air, sunlit, interstellar, intergalactic.
import { createRequire } from 'node:module';
const { ENVS, OBJECTS, rates } = createRequire(import.meta.url)('./model.js');
const dx = Number(process.argv[2] || '2.5e-7'), envKey = process.argv[3] || 'natural';
const f = x => (x === 0 ? '0' : !isFinite(x) ? 'never' : x.toExponential(1));
if (!(dx > 0 && isFinite(dx))) { console.error(`gap must be a positive number in metres, got "${process.argv[2]}"`); process.exit(1); }
if (envKey !== 'natural' && !Object.hasOwn(ENVS, envKey)) { console.error(`unknown surroundings "${envKey}": use natural, ${Object.keys(ENVS).join(', ')}`); process.exit(1); }
console.log(`gap ${dx} m, surroundings: ${envKey}\n`);
console.log('object'.padEnd(32) + 'W'.padStart(10) + 'wave clock s'.padStart(14) + 'witness s'.padStart(12) + '  main witness');
for (const o of OBJECTS) {
  const env = ENVS[envKey === 'natural' ? o.home : envKey];
  const r = rates(o, env, dx, null);
  const top = r.parts.slice().sort((a, b) => b.rate - a.rate)[0];
  console.log(o.name.padEnd(32) + f(r.W).padStart(10) + f(r.tWave).padStart(14) + f(r.tau).padStart(12) + '  ' + (top ? top.label : 'none'));
}
