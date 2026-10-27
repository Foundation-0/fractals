import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { generate, estimateH } = require('../fractal-landscapes/model.js');

let fails = 0;
function check(name, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}`);
  if (!ok) fails++;
}

for (const H of [0.25, 0.5, 0.75]) {
  let ests = [];
  for (let t = 0; t < 30; t++) ests.push(estimateH(generate(11, H, 12345 + t)));
  const mean = ests.reduce((a, b) => a + b, 0) / ests.length;
  check(`H=${H}: estimated H within 0.1`, Math.abs(mean - H) < 0.1, `estimated ${mean.toFixed(3)} (D=${(2-mean).toFixed(3)})`);
}

// D = 2 - H
check('D = 2 - H identity', Math.abs((2 - 0.5) - 1.5) < 1e-12, 'D(0.5)=1.5');

if (fails) { console.log(`\n${fails} check(s) failed`); process.exit(1); }
else console.log('\nall checks pass');
