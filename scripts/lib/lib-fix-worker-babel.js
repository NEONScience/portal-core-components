'use strict';

process.env.NODE_ENV = 'DEVELOPMENT';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WORKERS_PATH = '../../lib/workers/';

/**
   Fix Worker Babel

   The lib export runs everything through babel, even the workers. But the transpiled internal logic
   of a given worker will fail if it uses polyfills injected by babel at the top of the worker file
   (outside of worker.spawn(...)).

   This script runs as part of the post-babel cleanup of building the lib export. It edits any
   workers that have babel polyfills by moving the polyfill definition lines directly into the
   worker's internal body. This allows us to build workers with ES* syntax and trust that they
   will work as expected when transpiled into the lib export.
*/

console.log('Adjusting babel polyfills for workers...');

const workers = fs.readdirSync(path.resolve(__dirname, WORKERS_PATH));
workers.forEach((worker) => {
  // Only look at .js files
  if (!/\.js$/.test(worker)) { return; }
  const uri = path.resolve(__dirname, WORKERS_PATH, worker);
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
      if (/^\s*return [_a-zA-Z0-9]+\.spawn\((?<funcDef>function \(.*\)|.+ \=\>) \{$/.test(line)) {
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
    throw Error('Worker entrypoint not found');
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
