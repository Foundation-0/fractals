// Runs the Python unit tests and benchmark for pont_beta(tau) and the period-ratio separability check. Needs python3 (3.10 or later).
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const unit = spawnSync('python3', [path.join(root, 'tests', 'test_pont_witness.py'), '-v'], {
  cwd: root,
  encoding: 'utf8',
});
if (unit.error) {
  console.error(`pont-witness: could not run python3: ${unit.error.message}`);
  process.exit(1);
}
if (unit.status !== 0) {
  console.error(unit.stdout || '');
  console.error(unit.stderr || '');
  process.exit(unit.status ?? 1);
}

const bench = spawnSync('python3', [path.join(root, 'scripts', 'pont_witness.py')], {
  cwd: root,
  encoding: 'utf8',
});
if (bench.error) {
  console.error(`pont-witness: could not run python3: ${bench.error.message}`);
  process.exit(1);
}
if (bench.status !== 0 || !bench.stdout.includes('TOI-540_b')) {
  console.error(bench.stdout || '');
  console.error(bench.stderr || '');
  process.exit(1);
}
console.log(bench.stdout.trim());
console.log('pont-witness: python unit suite and benchmark checks pass');
