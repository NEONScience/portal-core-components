'use strict';

process.env.NODE_ENV = 'DEVELOPMENT';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

import fs from 'fs';
import fetch from 'node-fetch';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import REMOTE_ASSETS from '../../src/lib_components/remoteAssetsMap/remoteAssetsMap.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

const CACHED_REMOTE_ASSETS_PATH = path.join(__dirname, '../../src/lib_components/remoteAssets');

console.log('Caching remote assets...\n');

const fetches = [];

Object.keys(REMOTE_ASSETS)
  .filter((key) => key !== 'default')
  .forEach((key) => {
    const { name, url } = REMOTE_ASSETS[key];
    console.log(`* Fetching: ${name}`);
    const promise = fetch(url)
      .then((res) => {
        if (res.status >= 400) { throw new Error(`${res.status} ${res.statusText}`); }
        return res.text();
      })
      .then((res) => {
        return new Promise((resolve, reject) => {
          const destination = path.join(CACHED_REMOTE_ASSETS_PATH, name);
          fs.writeFileSync(destination, res, { encoding:'utf8' });
          console.log(`* Completed: ${name}`);
          resolve(true);
        });
      })
      .catch((error) => {
        console.log(`* Failed: ${name} -- ${error}`);
      });
    fetches.push(promise);
  });

Promise.allSettled(fetches).then((results) => {
  const total = results.length;
  const completed = results.filter(res => res.value).length;
  console.log(`\nCached ${completed}/${total} remote assets.\n`);
});
