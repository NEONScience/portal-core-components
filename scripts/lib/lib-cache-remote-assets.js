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

import packageJson from '../../package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const program = new Command();
program.usage('Usage: node lib-cache-remote-assets.js [options]')
  .version(packageJson.version)
  .option(
    '--prettify-index',
    'option to prettify css file',
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
  )
  .option(
    '--generate-public-assets-only',
    'option to generate public folder assets only',
  )
  .option(
    '--use-current-working-dir',
    'option to utilize the current working directory to derive paths',
  )
  .option(
    '--cwd-relative-remote-assets-path <value>',
    'when --use-current-working-dir is specified, and not --generate-public-assets-only, '
      + 'a current working directory relative path must be specified for non-public remote assets',
  )
  .option(
    '--cwd-relative-public-dir-path <value>',
    'when --use-current-working-dir is specified, a current working directory relative '
      + 'path must be specified for public assets',
  );
program.parse(process.argv);
const config = program.opts();

let CACHED_REMOTE_ASSETS_PATH = path.join(__dirname, '../../src/lib_components/remoteAssets');
let PUBLIC_OUTPUT_PATH = path.join(__dirname, '../../public');
let PUBLIC_ASSETS_CSS_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_PATH, 'assets/css');

if (config.useCurrentWorkingDir) {
  if (!config.generatePublicAssetsOnly) {
    if ((config.cwdRelativeRemoteAssetsPath === null)
        || (config.cwdRelativeRemoteAssetsPath === undefined)
        || (config.cwdRelativeRemoteAssetsPath.length <= 0)) {
      console.error('Invalid command arguments. --cwd-relative-remote-assets-path must be specified');
      process.exit(9);
    }
    CACHED_REMOTE_ASSETS_PATH = path.join(process.cwd(), config.cwdRelativeRemoteAssetsPath);
  }
  if ((config.cwdRelativePublicDirPath === null)
      || (config.cwdRelativePublicDirPath === undefined)
      || (config.cwdRelativePublicDirPath.length <= 0)) {
    console.error('Invalid command arguments. --cwd-relative-public-dir-path must be specified');
    process.exit(9);
  }
  PUBLIC_OUTPUT_PATH = path.join(process.cwd(), config.cwdRelativePublicDirPath);
  PUBLIC_ASSETS_CSS_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_PATH, 'assets/css');
}

if (config.useCurrentWorkingDir) {
  console.log(`Current working directory:\n\t${process.cwd()}`);
}
if (!config.generatePublicAssetsOnly) {
  console.log(`Remote assets path:\n\t${CACHED_REMOTE_ASSETS_PATH}`);
}
console.log(`Public directory path:\n\t${PUBLIC_OUTPUT_PATH}\n`);

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
    public: true,
  },
  DRUPAL_HEADER_JS: {
    name: REMOTE_ASSET_NAMES.DRUPAL_HEADER_JS,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_HEADER_JS}`,
    public: false,
  },
  DRUPAL_HEADER_HTML: {
    name: REMOTE_ASSET_NAMES.DRUPAL_HEADER_HTML,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_HEADER_HTML}`,
    public: false,
  },
  DRUPAL_FOOTER_HTML: {
    name: REMOTE_ASSET_NAMES.DRUPAL_FOOTER_HTML,
    url: `${WEB_HOST_URL}${REMOTE_ASSET_PATHS.DRUPAL_FOOTER_HTML}`,
    public: false,
  },
};

Object.keys(REMOTE_ASSETS_CACHE).forEach((key) => { REMOTE_ASSETS_CACHE[key].KEY = key; });

console.log('Caching remote assets...\n');

const fetches = [];

const sanitizeContent = (key, content) => {
  switch (key) {
    // DRUPAL_THEME_CSS - comment out all styles with relative path URLs (these will always fail)
    case REMOTE_ASSETS_CACHE.DRUPAL_THEME_CSS.KEY:
      (content.match(/^(.*url\(["']((?!data|https)).*)$/mg) || []).forEach((match) => {
        let shouldCommentMatch = true;
        if (config.cssReplaceRelativeUrls) {
          const relativeUrlRegex = /(?<relative>url\(["'](?<relativePathSegments>\.\.\/\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/|\.\.\/)(?<path>images\/.+)["']\))/;
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
      // Ensure we always produce a valid, backtick quoted JavaScript string
      // by escaping any backticks, ignore already escaped backticks,
      // and only matching on even number of backslashes prior to backtick
      // as those would produce strings that are not properly escaped.
      content = content.replace(/(?<!\\)(?:\\\\)*`/g, '\\`');
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
          indexFileOutput = await prettier.format(
            indexFileOutput,
            {
              parser: 'html',
              printWidth: 100,
            },
          );
        }
        fs.writeFileSync(indexFilePath, indexFileOutput, { encoding: 'utf8' });
      }
      break;
    case REMOTE_ASSETS_CACHE.DRUPAL_HEADER_JS.KEY:
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
  writeContent(key, sanitizedContent, cachedFileName);
  console.log(`* Completed: ${name} (saved as ${cachedFileName})`);
  resolve(true);
};

Object.keys(REMOTE_ASSETS_CACHE)
  .filter((key) => key !== 'default')
  .filter((key) => {
    if (!config.generatePublicAssetsOnly) {
      return true;
    }
    return REMOTE_ASSETS_CACHE[key].public;
  })
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
