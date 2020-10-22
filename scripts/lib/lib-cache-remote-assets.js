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

const sanitizeContent = (key, content) => {
  switch (key) {
    // DRUPAL_THEME_CSS - comment out all styles with relative path URLs (these will always fail)
    case REMOTE_ASSETS.DRUPAL_THEME_CSS.KEY:
      content.match(/^(.*url\([\"\']((?!data)).*)$/mg).forEach((match) => {
        const replacement = match.endsWith('}')
          ? `/* ${match.slice(0, -1)} */ }`
          : `/* ${match} */`;
        content = content.replace(match, replacement);
      });
      return content;
    // HTML files - convert to JS module that exports a string of the HTML content
    // We do this so that apps consuming portal-core-components don't need to configure html-loader
    case REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY:
    case REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY:
      content = content.replace(/`/g, '\\`');
      return `let html;\nexport default html = \`${content}\`;`;
    default:
      return content;
  }
};

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
          let cachedFileName = name;
          let savedAs = '';
          if (cachedFileName.endsWith('.html')) {
            cachedFileName = `${cachedFileName}.js`;
            savedAs = ` (saved as ${cachedFileName})`;
          }
          const destination = path.join(CACHED_REMOTE_ASSETS_PATH, cachedFileName);
          fs.writeFileSync(
            destination,
            sanitizeContent(key, res),
            { encoding:'utf8' },
          );
          console.log(`* Completed: ${name}${savedAs}`);
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
