// Applies the no-logarithm exponent check (scaling-check/check.mjs) to series printed by this repository's own scripts and
// prints a verdict for each, in three modes. Usage: node scaling-check/table.mjs            (instant, integers only)
//                                                   node scaling-check/table.mjs verify     (runs the two source scripts, about 45 s,
//                                                                                          and finds every number in their output)
// A verdict is about the printed numbers and nothing else: no error bar, no physics. See scaling-check/README.md.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { tightestHalfWidth } from './check.mjs';
import { SERIES, SOURCE_COMMIT, acceptor } from './series.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODES = ['window', 'steps', 'pairs'];
const TOLS = [[1n, 100n], [3n, 100n], [1n, 10n]];

// Closed bracket [e - tol, e + tol] as two [p, q] pairs.
const bracket = (e, [tn, td]) => {
  const [p, q] = [BigInt(e[0]), BigInt(e[1])];
  return [[p * td - tn * q, q * td], [p * td + tn * q, q * td]];
};
const word = ok => (ok ? 'accepts' : 'rejects');
const grid = ([k, step]) => `${(k / step).toFixed(3)}`;

function verdicts() {
  for (const s of SERIES) {
    const acc = acceptor(s);
    console.log(`\n${s.what}\n  published: ${s.publishedLabel}\n  points: ${s.x.join(', ')} -> ${s.y.join(', ')}`);
    for (const t of TOLS) {
      const [lo, hi] = bracket(s.published, t);
      console.log(`  bracket +-${t[0]}/${t[1]}: ` + MODES.map(m => `${m} ${word(acc(lo, hi, m))}`).join(', '));
    }
    console.log('  smallest half-width that is accepted (grid 0.001): ' +
      MODES.map(m => { const w = tightestHalfWidth(acc, s.published, m); return `${m} ${w ? grid(w) : 'over 1.000'}`; }).join(', '));
  }
}

function verify() {
  const outputs = {};
  for (const cmd of [...new Set(SERIES.map(s => s.command))]) {
    const [script, ...args] = cmd.split(' ');
    const r = spawnSync(process.execPath, [path.join(root, script), ...args], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 600000 });
    if (r.status !== 0) { console.log(`FAIL  ${cmd} exited with ${r.status}`); process.exit(1); }
    outputs[cmd] = r.stdout.split('\n');
  }
  let bad = 0;
  for (const s of SERIES) {
    const lines = outputs[s.command], start = lines.findIndex(l => s.after.test(l));
    if (start < 0) { console.log(`FAIL  ${s.id}: section not found in ${s.command}`); bad++; continue; }
    s.rows.forEach((row, i) => {
      const line = lines.slice(start + 1).find(l => l.trim().split(/\s+/)[0] === String(row));
      const tok = line ? line.trim().split(/\s+/)[s.col] : undefined;
      const ok = tok === s.y[i];
      if (!ok) bad++;
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${s.id} row ${row}: pinned ${s.y[i]}, printed ${tok}`);
    });
  }
  console.log(bad ? `\n${bad} number(s) differ from the printed output` : `\nevery pinned number is in the output of the scripts (source commit ${SOURCE_COMMIT.slice(0, 7)})`);
  process.exit(bad ? 1 : 0);
}

if (process.argv[2] === 'verify') verify(); else verdicts();
