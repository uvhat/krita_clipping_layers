const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
new Function(scripts[1]);                       // syntax check of UI script
const createEngine = new Function(scripts[0] + '; return createEngine;')();
function run(mode, combine, same, op) {
  const e = createEngine(400, 200);
  Object.assign(e.st, { mode, combine, size: 160, opacity: op });
  e.beginStroke(); e.dab(150, 100);
  if (!same) e.beginStroke();
  e.dab(250, 100);
  // level changes along the line y=60 (off-centre, low values), x in overlap 170..230
  let ch = 0, row = [];
  for (let x = 140; x <= 260; x++) row.push(e.L[60 * 400 + x]);
  for (let i = 1; i < row.length; i++) if (row[i] !== row[i - 1]) ch++;
  // count non-monotonic wiggles in overlap (sign flips of derivative)
  let flips = 0, last = 0;
  for (let i = 1; i < row.length; i++) { const s = Math.sign(row[i] - row[i - 1]); if (s && last && s !== last) flips++; if (s) last = s; }
  console.log(`${mode.padEnd(4)} ${combine.padEnd(6)} ${same ? 'one ' : 'two '} op=${op}  changes=${ch} flips=${flips}  row:`, row.filter((_, i) => i % 3 === 0).join(' '));
}
for (const op of [0.02, 0.05]) {
  run('i8', 'normal', true, op);
  run('isw', 'normal', true, op);
  run('isw', 'normal', false, op);
  run('isw', 'max', true, op);
}
