'use strict';

const path = require('path');
const fs = require('fs');

console.log('Adjusting babel polyfills for workers...');

const workers = fs.readdirSync(path.resolve(__dirname, 'lib/workers/'));
workers.forEach((worker) => {
  // Only look at .js files
  if (!/\.js$/.test(worker)) { return; }
  const uri = path.resolve(__dirname, 'lib/workers/', worker);
  const inSource = fs.readFileSync(uri, 'utf8');
  let workerEntered = false;
  const preLines = [];
  const polyfillLines = ['', '    // Babel polyfills for worker logic'];
  const postLines = [''];
  // Go through the file one line at a time
  inSource.split('\n').forEach((line) => {
    // Store babel polyfills OTHER THAN _interopRequireDefault
    if (/^function _[a-zA-Z0-9]+\(.*\) \{.*\}$/.test(line) && !line.includes('interopRequireDefault')) {
      polyfillLines.push(`    ${line}`);
      return;
    }
    // Store lines before entering the worker and note when we do enter it
    if (!workerEntered) {
      preLines.push(line);
      if (/^\s*return [_a-zA-Z0-9]+\.spawn\(function \(.*\) \{$/.test(line)) {
        workerEntered = true;
      }
      return;
    }
    // Store lines after entering the worker
    postLines.push(line);
  });
  // Final sanity checks
  if (!workerEntered) {
    console.log(`* ${worker} - SKIPPED - no worker entrypoint found (not good! go fix it!)`);
    return;
  }
  if (polyfillLines.length === 2) {
    console.log(`* ${worker} - SKIPPED - no polyfills in need of moving`);
    return;    
  }
  // Write the updated file back out to lib
  const outSource = [...preLines, ...polyfillLines, ...postLines].join('\n').replace(/[\n]{2,}/g, '\n\n');
  fs.writeFileSync(uri, outSource);
  console.log(`* ${worker} - UPDATED - ${polyfillLines.length - 2} polyfill(s) moved`);
});
