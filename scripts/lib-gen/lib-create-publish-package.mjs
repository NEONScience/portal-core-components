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
// Apply generated package specific properties
const peerReactVersion = '^19.0.0';
const deleteDeps = ['react', 'react-dom'];
Object.keys(publishPackageJson.dependencies).forEach((dep) => {
  if (deleteDeps.includes(dep)) {
    delete publishPackageJson.dependencies[dep];
  }
});
publishPackageJson.peerDependencies.react = peerReactVersion;
publishPackageJson.peerDependencies['react-dom'] = peerReactVersion;
publishPackageJson.bin = {
  'neonscience-portal-core-components--sync-assets': './bin/sync-assets.js',
};
fs.writeFileSync(
  path.join(outDir, 'package.json'),
  `${JSON.stringify(publishPackageJson, null, 2)}\n`,
);
const copyIfExists = (file, copyToOutDir = outDir) => {
  const src = path.join(root, `../../${file}`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(copyToOutDir, file));
  }
};
const copyDirectory = (dir, copyToOutDir) => {
  const src = path.join(root, `../../${dir}`);
  const dest = path.join(copyToOutDir);
  if (!fs.existsSync(src)) {
    return;
  }
  fs.cpSync(src, dest, { recursive: true });
};
// Copy package specific files
copyIfExists('README.md');
copyIfExists('LICENSE');
copyDirectory('public/assets', path.join(outDir, 'bin/assets'));
