'use strict';

process.env.NODE_ENV = 'DEVELOPMENT';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

import fs from 'fs';
import path from 'path';
import jsdom from 'jsdom';
import prettier from 'prettier';
import { Command } from 'commander';

import packageJson from '../package.json' with { type: 'json' };

const program = new Command();
program.usage('Usage: node prettify-index.js [options]')
  .version(packageJson.version)
  .option(
    '--cwd-relative-build-dir-path <value>',
    'build folder path relative to current working directory',
  );
program.parse(process.argv);
const config = program.opts();

if ((config.cwdRelativeBuildDirPath === null)
  || (config.cwdRelativeBuildDirPath === undefined)
  || (config.cwdRelativeBuildDirPath.length <= 0)
) {
  console.error('Invalid command arguments. --cwd-relative-build-dir-path must be specified');
  process.exit(9);
}

const BUILD_OUTPUT_PATH = path.join(process.cwd(), config.cwdRelativeBuildDirPath);

console.log(`Current working directory:\n\t${process.cwd()}`);
console.log(`Build directory path:\n\t${BUILD_OUTPUT_PATH}\n`);

console.log('Running build post-process...\n');

const buildPostProcess = async () => {
  console.log('Prettifying index...\n');
  const indexFilePath = path.join(BUILD_OUTPUT_PATH, 'index.html');
  if (fs.existsSync(indexFilePath)) {
    const indexFileData = fs.readFileSync(indexFilePath);
    const dom = new jsdom.JSDOM(indexFileData);
    const indexFileOutput = await prettier.format(
      dom.serialize(),
      {
        parser: 'html',
        printWidth: 100,
      },
    );
    fs.writeFileSync(indexFilePath, indexFileOutput, { encoding: 'utf8' });
  } else {
    throw Error('Index not found');
  }
  console.log('Finished processing index');
};

buildPostProcess();
