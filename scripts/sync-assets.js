'use strict';

process.env.NODE_ENV = 'DEVELOPMENT';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

import fs from 'fs';
import readline from 'readline';
import path, { dirname } from 'path';
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
    '--cwd-relative-app-dir-path <value>',
    'app folder path relative to current working directory',
  )
  .option(
    '--prettify-index',
    'option to prettify index file',
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
if ((config.cwdRelativeAppDirPath === null)
  || (config.cwdRelativeAppDirPath === undefined)
  || (config.cwdRelativeAppDirPath.length <= 0)
) {
  console.error('Invalid command arguments. --cwd-relative-app-dir-path must be specified');
  process.exit(9);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const CORE_COMPONENTS_PUBLIC_CSS_ASSETS_PATH = path.join(__dirname, '../public/assets/css');

const PUBLIC_OUTPUT_PATH = path.join(process.cwd(), config.cwdRelativePublicDirPath);
const APP_OUTPUT_PATH = path.join(process.cwd(), config.cwdRelativeAppDirPath);
const PUBLIC_ASSETS_CSS_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_PATH, 'assets/css');

const APP_FILE_LINE_REPLACE = 'const DRUPAL_THEME_CSS_ASSET_HASH =';

console.log(`Current working directory:\n\t${process.cwd()}`);
console.log(`Assets to sync from directory:\n\t${CORE_COMPONENTS_PUBLIC_CSS_ASSETS_PATH}`);
console.log(`Public directory path:\n\t${PUBLIC_OUTPUT_PATH}\n`);
console.log(`App directory path:\n\t${APP_OUTPUT_PATH}\n`);

console.log('Synching assets...\n');

const SYNC_CSS_ASSET_PREFIX = {
  DRUPAL_THEME: 'drupal-theme',
};
const SYNC_CSS_ASSET_INDEX = {
  DRUPAL_THEME: {
    prefix: 'drupal-theme',
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
        const appFilePath = path.join(APP_OUTPUT_PATH, 'layout.tsx');
        if (fs.existsSync(appFilePath)) {
          const fileNameHash = assetFileName.split('.')[1];
          const rl = readline.createInterface({
            input: fs.createReadStream(appFilePath),
            // Considers \r and \n as a single newline.
            // https://nodejs.org/api/readline.html#readlinepromisescreateinterfaceoptions
            crlfDelay: Infinity,
          });
          const lines = [];
          for await (const line of rl) {
            if (line.startsWith(APP_FILE_LINE_REPLACE)) {
              const updatedHashLine = `${APP_FILE_LINE_REPLACE} '${fileNameHash}';`;
              lines.push(updatedHashLine);
            } else {
              lines.push(line);
            }
          }
          rl.close();
          let appFileOutput = lines.join('\n');
          if (config.prettifyIndex) {
            appFileOutput = await prettier.format(
              appFileOutput,
              {
                parser: 'babel-ts',
                printWidth: 100,
                singleQuote: true,
              },
            );
          }
          fs.writeFileSync(appFilePath, appFileOutput, { encoding: 'utf8' });
        }
      }
    });
  });
  console.log('Finished processing assets');
};

syncCssAssets();
