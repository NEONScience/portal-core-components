import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, '../../lib');
// Read and create published package JSON
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, '../../package.json'), 'utf8'),
);
// Merge values from the root package
const omitPackageJsonProperties = [
  'private',
  'devDependencies',
  'overrides',
  'scripts',
];
const publishPackageJson = {
  ...Object.fromEntries(
    Object.entries(packageJson).filter(
      ([key]) => !omitPackageJsonProperties.includes(key),
    ),
  ),
  main: './index.js',
};
fs.writeFileSync(
  path.join(outDir, 'package.json'),
  `${JSON.stringify(publishPackageJson, null, 2)}\n`,
);
const copyIfExists = (file) => {
  const src = path.join(root, `../../${file}`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, file));
  }
};
// Copy package specific files
copyIfExists('README.md');
copyIfExists('LICENSE');
