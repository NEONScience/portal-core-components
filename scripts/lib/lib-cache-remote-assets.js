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
import crypto from 'crypto';
import postcss from 'postcss';
import cssnano from 'cssnano';
import jsdom from 'jsdom';
import prettier from 'prettier';
import { Command } from 'commander';
import { fileURLToPath } from 'url';

import packageJson from '../../package.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const CACHED_REMOTE_ASSETS_PATH = path.join(__dirname, '../../src/lib_components/remoteAssets');
const PUBLIC_OUTPUT_PATH = path.join(__dirname, '../../public');
const PUBLIC_ASSETS_CSS_OUTPUT_PATH = path.join(__dirname, '../../public/assets/css');

const REMOTE_ASSET_PATHS = {
  DRUPAL_THEME_CSS: '/themes/custom/neon/dist/css/components/theme/theme.css',
  DRUPAL_HEADER_JS: '/themes/custom/neon/dist/js/header/header.js',
  DRUPAL_HEADER_HTML: '/neon-assets/partial/header',
  DRUPAL_FOOTER_HTML: '/neon-assets/partial/footer',
};

const REMOTE_ASSET_NAMES = {
  DRUPAL_THEME_CSS: 'drupal-theme.css',
  DRUPAL_HEADER_JS: 'drupal-header.js',
  DRUPAL_HEADER_HTML: 'drupal-header.html',
  DRUPAL_FOOTER_HTML: 'drupal-footer.html',
};

const MAKE_HASHED_FILENAMES = [REMOTE_ASSET_NAMES.DRUPAL_THEME_CSS];
const MAKE_MINIMIZED_FILENAMES = [REMOTE_ASSET_NAMES.DRUPAL_THEME_CSS];

const WEB_HOST_URL = 'https://www.neonscience.org';

// When fetching cached remote assets, reference production
const REMOTE_ASSETS_CACHE = {
  DRUPAL_THEME_CSS: {
    name: REMOTE_ASSET_NAMES.DRUPAL_THEME_CSS,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_THEME_CSS}`,
  },
  DRUPAL_HEADER_JS: {
    name: REMOTE_ASSET_NAMES.DRUPAL_HEADER_JS,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_HEADER_JS}`,
  },
  DRUPAL_HEADER_HTML: {
    name: REMOTE_ASSET_NAMES.DRUPAL_HEADER_HTML,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_HEADER_HTML}`,
  },
  DRUPAL_FOOTER_HTML: {
    name: REMOTE_ASSET_NAMES.DRUPAL_FOOTER_HTML,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_FOOTER_HTML}`,
  },
};

Object.keys(REMOTE_ASSETS_CACHE).forEach((key) => { REMOTE_ASSETS_CACHE[key].KEY = key; });

const program = new Command();
program.usage('Usage: node lib-cache-remote-assets.js [options]')
  .version(packageJson.version)
  .option(
    '--prettify-index',
    'option to minimize css file',
  )
  .option(
    '--css-replace-relative-urls',
    'option to replace relative urls when appropriate',
  )
  .option(
    '--css-prevent-minify',
    'option to prevent minifying css file',
  )
  .option(
    '--css-generate-source-map',
    'option to generate a source map file for CSS file',
  );
program.parse(process.argv);
const config = program.opts();

console.log('Caching remote assets...\n');

const fetches = [];

const sanitizeContent = (key, content) => {
  switch (key) {
    // DRUPAL_THEME_CSS - comment out all styles with relative path URLs (these will always fail)
    case REMOTE_ASSETS_CACHE.DRUPAL_THEME_CSS.KEY:
      content.match(/^(.*url\([\"\']((?!data)).*)$/mg).forEach((match) => {
        let shouldCommentMatch = true;
        if (config.cssReplaceRelativeUrls) {
          const relativeUrlRegex = /(?<relative>url\(["']\.\.\/\.\.\/\.\.\/(?<path>images\/.+)["']\))/;
          const matchesRelative = relativeUrlRegex.exec(match);
          if (matchesRelative
            && (matchesRelative.length > 0)
            && matchesRelative.groups
            && matchesRelative.groups?.relative
            && matchesRelative.groups?.path
          ) {
            const replaceRelative = matchesRelative.groups?.relative;
            const replaceRelativePath = matchesRelative.groups?.path;
            const replaceWith = `url("${WEB_HOST_URL}/themes/custom/neon/${replaceRelativePath}")`;
            content = content.replace(replaceRelative, replaceWith);
            shouldCommentMatch = false;
          }
        }
        if (shouldCommentMatch) {
          const replacement = match.endsWith('}')
            ? `/* ${match.slice(0, -1)} */ }`
            : `/* ${match} */`;
          content = content.replace(match, replacement);
        }
      });
      return content;
    // HTML files - convert to JS module that exports a string of the HTML content
    // We do this so that apps consuming portal-core-components don't need to configure html-loader
    case REMOTE_ASSETS_CACHE.DRUPAL_HEADER_HTML.KEY:
    case REMOTE_ASSETS_CACHE.DRUPAL_FOOTER_HTML.KEY:
      content = content.replace(/`/g, '\\`');
      return `let html;\nexport default html = \`${content}\`;`;
    default:
      return content;
  }
};

/**
 * Minimizes the specified content from fileName to minFileName;
 * @param {*} content
 * @param {*} fileName
 * @param {*} minFileName
 * @returns
 */
const minimizeContent = async (content, fileName, minFileName) => {
  const resultPromise = await postcss([cssnano()])
    .process(content, { from: fileName, to: minFileName, map: { inline: false } });
  return resultPromise;
};

/**
 * Inject the file contents hash into the filename as the last segment
 * before the file extension.
 * This assumes the filename has an extension.
 * @param {*} name
 * @param {*} content
 * @param {*} algo
 */
const makeHashedFilename = (name, content, algo = 'md5') => {
  const hash = crypto.createHash(algo);
  hash.update(content);
  const hexDigest = hash.digest('hex');
  const nameParts = name.split('.');
  const ext = nameParts.pop();
  return `${nameParts.join('.')}.${hexDigest}.${ext}`;
};

/**
 * Inject the 'min' infix into the filename as the last segment
 * before the file extension.
 * This assumes the filename has an extension.
 * @param {*} name
 */
const makeMinimizedFilename = (name) => {
  const nameParts = name.split('.');
  const ext = nameParts.pop();
  return `${nameParts.join('.')}.min.${ext}`;
};

const writeContent = async (key, content, fileName) => {
  const destination = path.join(CACHED_REMOTE_ASSETS_PATH, fileName);
  switch (key) {
    case REMOTE_ASSETS_CACHE.DRUPAL_THEME_CSS.KEY:
      const cachedFiles = fs.readdirSync(CACHED_REMOTE_ASSETS_PATH);
      const assetFiles = fs.readdirSync(PUBLIC_ASSETS_CSS_OUTPUT_PATH);
      cachedFiles.forEach((cachedFileName) => {
        if (cachedFileName.startsWith('drupal-theme')) {
          const rmFile = path.join(CACHED_REMOTE_ASSETS_PATH, cachedFileName);
          fs.rmSync(rmFile);
        }
      });
      assetFiles.forEach((assetFileName) => {
        if (assetFileName.startsWith('drupal-theme')) {
          const rmFile = path.join(PUBLIC_ASSETS_CSS_OUTPUT_PATH, assetFileName);
          fs.rmSync(rmFile);
        }
      });
      fs.writeFileSync(destination, content, { encoding: 'utf8' });
      const cssAssetDes = path.join(PUBLIC_ASSETS_CSS_OUTPUT_PATH, fileName);
      const cssAssetDesMap = path.join(PUBLIC_ASSETS_CSS_OUTPUT_PATH, `${fileName}.map`);
      let minContentResultCss = content;
      let minContentResultMap = null;
      if (!config.cssPreventMinify) {
        const minContentResult = await minimizeContent(content, destination, cssAssetDes);
        minContentResultCss = minContentResult.css;
        minContentResultMap = minContentResult.map;
      }
      fs.writeFileSync(cssAssetDes, minContentResultCss, { encoding: 'utf8' });
      if (config.cssGenerateSourceMap && minContentResultMap) {
        fs.writeFileSync(cssAssetDesMap, minContentResultMap.toString(), { encoding: 'utf8' });
      }
      fs.rmSync(destination);
      const indexFilePath = path.join(PUBLIC_OUTPUT_PATH, 'index.html');
      if (fs.existsSync(indexFilePath)) {
        const indexFileData = fs.readFileSync(indexFilePath);
        const dom = new jsdom.JSDOM(indexFileData);
        const drupalThemeNode = dom.window.document.head
          .querySelector('link[data-meta="drupal-theme"]');
        if (drupalThemeNode) {
          drupalThemeNode.setAttribute('href', `%PUBLIC_URL%/assets/css/${fileName}`)
        }
        let indexFileOutput = dom.serialize();
        if (config.prettifyIndex) {
          indexFileOutput = prettier.format(indexFileOutput, { parser: 'html', printWidth: 100 });
        }
        fs.writeFileSync(indexFilePath, indexFileOutput, { encoding: 'utf8' });
      }
      break;
    case REMOTE_ASSETS_CACHE.DRUPAL_HEADER_HTML.KEY:
    case REMOTE_ASSETS_CACHE.DRUPAL_FOOTER_HTML.KEY:
    default:
      fs.writeFileSync(destination, content, { encoding: 'utf8' });
      break;
  }
};

const processContent = async (key, name, res, resolve) => {
  const sanitizedContent = sanitizeContent(key, res);
  let cachedFileName = name;
  if (cachedFileName.endsWith('.html')) {
    cachedFileName = `${cachedFileName}.js`;
  } else if (MAKE_HASHED_FILENAMES.includes(name)) {
    cachedFileName = makeHashedFilename(cachedFileName, sanitizedContent);
  }
  if (MAKE_MINIMIZED_FILENAMES.includes(name)) {
    switch (key) {
      case REMOTE_ASSETS_CACHE.DRUPAL_THEME_CSS.KEY:
        if (!config.cssPreventMinify) {
          cachedFileName = makeMinimizedFilename(cachedFileName);
        }
        break;
      default:
        break;
    }
  }
  await writeContent(key, sanitizedContent, cachedFileName);
  console.log(`* Completed: ${name} (saved as ${cachedFileName})`);
  resolve(true);
};

Object.keys(REMOTE_ASSETS_CACHE)
  .filter((key) => key !== 'default')
  .forEach((key) => {
    const { name, url } = REMOTE_ASSETS_CACHE[key];
    console.log(`* Fetching: ${name}`);
    const promise = fetch(url)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then((res) => {
        return new Promise((resolve, reject) => {
          processContent(key, name, res, resolve);
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
