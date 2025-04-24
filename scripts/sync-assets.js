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
import jsdom from 'jsdom';
import prettier from 'prettier';
import { Command } from 'commander';
import { fileURLToPath } from 'url';

import packageJson from '../package.json' with { type: 'json' };

const program = new Command();
program.usage('Usage: node sync-assets.js [options]')
  .version(packageJson.version)
  .option(
    '--cwd-relative-public-dir-path <value>',
    'public folder path relative to current working directory',
  )
  .option(
    '--prettify-index',
    'option to prettify css file',
  );
program.parse(process.argv);
const config = program.opts();

if ((config.cwdRelativePublicDirPath === null)
  || (config.cwdRelativePublicDirPath === undefined)
  || (config.cwdRelativePublicDirPath.length <= 0)
) {
  console.error('Invalid command arguments. --cwd-relative-public-dir-path must be specified');
  process.exit(9);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const CORE_COMPONENTS_PUBLIC_CSS_ASSETS_PATH = path.join(__dirname, '../public/assets/css');

const PUBLIC_OUTPUT_PATH = path.join(process.cwd(), config.cwdRelativePublicDirPath);
const PUBLIC_ASSETS_CSS_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_PATH, 'assets/css');

console.log(`Current working directory:\n\t${process.cwd()}`);
console.log(`Assets to sync from directory:\n\t${CORE_COMPONENTS_PUBLIC_CSS_ASSETS_PATH}`);
console.log(`Public directory path:\n\t${PUBLIC_OUTPUT_PATH}\n`);

console.log('Synching assets...\n');

const SYNC_CSS_ASSET_PREFIX = {
  DRUPAL_THEME: 'drupal-theme',
  DRUPAL_FONTS: 'drupal-fonts',
};
const SYNC_CSS_ASSET_INDEX = {
  DRUPAL_THEME: {
    prefix: 'drupal-theme',
    dataMeta: 'drupal-theme',
  },
};

const syncCssAssets = () => {
  const currentAssetFiles = fs.readdirSync(PUBLIC_ASSETS_CSS_OUTPUT_PATH);
  currentAssetFiles.forEach((assetFileName) => {
    Object.keys(SYNC_CSS_ASSET_PREFIX).forEach((assetKey) => {
      const prefix = SYNC_CSS_ASSET_PREFIX[assetKey];
      if (assetFileName.startsWith(prefix)) {
        const rmFile = path.join(PUBLIC_ASSETS_CSS_OUTPUT_PATH, assetFileName);
        fs.rmSync(rmFile);
      }
    });
  });
  const assetFiles = fs.readdirSync(CORE_COMPONENTS_PUBLIC_CSS_ASSETS_PATH);
  assetFiles.forEach((assetFileName) => {
    Object.keys(SYNC_CSS_ASSET_PREFIX).forEach((assetKey) => {
      const prefix = SYNC_CSS_ASSET_PREFIX[assetKey];
      if (assetFileName.startsWith(prefix)) {
        const createFile = path.join(PUBLIC_ASSETS_CSS_OUTPUT_PATH, assetFileName);
        const syncFile = path.join(CORE_COMPONENTS_PUBLIC_CSS_ASSETS_PATH, assetFileName);
        const syncFileData = fs.readFileSync(syncFile);
        fs.writeFileSync(createFile, syncFileData, { encoding: 'utf8' });
      }
    });
    Object.keys(SYNC_CSS_ASSET_INDEX).forEach(async (assetKey) => {
      const assetIndex = SYNC_CSS_ASSET_INDEX[assetKey];
      if (assetFileName.startsWith(assetIndex.prefix)) {
        const indexFilePath = path.join(PUBLIC_OUTPUT_PATH, 'index.html');
        if (fs.existsSync(indexFilePath)) {
          const indexFileData = fs.readFileSync(indexFilePath);
          const dom = new jsdom.JSDOM(indexFileData);
          const assetNode = dom.window.document.head
            .querySelector(`link[data-meta="${assetIndex.dataMeta}"]`);
          if (assetNode) {
            assetNode.setAttribute('href', `%PUBLIC_URL%/assets/css/${assetFileName}`)
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
      }
    });
  });
  console.log('Finished processing assets');
};

syncCssAssets();
