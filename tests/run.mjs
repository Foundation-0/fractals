// Runs every check file in tests/ and fails if any of them fails. Run: npm test (or node tests/run.mjs).
// Each study keeps its checks in its own file here, so studies developed in parallel do not edit the same file.
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter(f => f.endsWith('.mjs') && f !== 'run.mjs').sort();
const failed = [];
for (const f of files) {
  console.log(`\n== ${f}\n`);
  const r = spawnSync(process.execPath, [path.join(dir, f)], { stdio: 'inherit' });
  if (r.status !== 0) failed.push(f);
}
console.log(failed.length ? `\nfailed: ${failed.join(', ')}` : `\nall ${files.length} check file(s) pass`);
process.exit(failed.length ? 1 : 0);
