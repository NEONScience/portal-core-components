'use strict';

process.env.NODE_ENV = 'DEVELOPMENT';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const shp = require('shpjs');

const TMP_DEFERRED_JSON_PATH = './tmp_deferredJSON';
const OUT_DEFERRED_JSON_PATH = './src/lib_components/components/SiteMap/deferredJSON';

const sanitizeGeometry = (geometry) => {
  if (!geometry.coordinates) { return geometry; }
  geometry.coordinates.forEach((a, aidx) => {
    geometry.coordinates[aidx].forEach((b, bidx) => {
      if (Array.isArray(geometry.coordinates[aidx][bidx][0])) {
        geometry.coordinates[aidx][bidx].forEach((c, cidx) => {
          const [x, y] = c;
          if (x < 0) {
            geometry.coordinates[aidx][bidx][cidx][0] = y;
            geometry.coordinates[aidx][bidx][cidx][1] = x;
          }
        });
      } else {
        const [x, y] = b;
        if (x < 0) {
          geometry.coordinates[aidx][bidx][0] = y;
          geometry.coordinates[aidx][bidx][1] = x;
        }        
      }
    });
  });
  return geometry;
};

const generateFeatureSiteFilesDirectory = (featureKey, sitesData) => {
  if (!Object.keys(sources).includes(featureKey)) { return; }
  let count = 1;
  try {
    const outDir = path.join(OUT_DEFERRED_JSON_PATH, featureKey);
    fs.mkdirSync(outDir);
    Object.keys(sitesData).forEach((siteCode) => {
      const outFile = path.join(outDir, `${siteCode}.json`);
      fs.writeFileSync(outFile, JSON.stringify(sitesData[siteCode]));
      count += 1;
    });
  } catch (err) {
    console.error(err);
  }
  console.log(chalk.green(`${featureKey} Complete (${count} sites)`));
  const alphaSites = Object.keys(sitesData).sort();
  console.log(chalk.green(JSON.stringify(alphaSites)));
};

const sources = {
  TOWER_AIRSHEDS: {
    zipFile: null,
    process: () => {},
  },
  AQUATIC_REACHES: {
    zipFile: 'AquaticReach.zip',
    process: (geojson) => {
      const sites = {};
      geojson.features.forEach((feature) => {
        const { SiteID: siteCode, HUC12, UTM_Zone, AreaKm2: areaKm2 } = feature.properties;
        sites[siteCode] = {
          type: 'Feature',
          properties: { siteCode, HUC12, UTM_Zone, areaKm2 },
          geometry: sanitizeGeometry(feature.geometry),
        };
      });
      return sites;
    },
  },
  WATERSHED_BOUNDARIES: {
    zipFile: null,
    process: () => {},
  },
  FLIGHT_BOX_BOUNDARIES: {
    zipFile: null,
    process: () => {},
  },
  SAMPLING_BOUNDARIES: {
    zipFile: 'Field_Sampling_Boundaries.zip',
    process: (geojson) => {
      const sites = {};
      geojson.features.forEach((feature) => {
        const geometry = sanitizeGeometry(feature.geometry);
        const { siteID: siteCode, areaKm2 } = feature.properties;
        if (!sites[siteCode]) {
          sites[siteCode] = {
            type: 'Feature',
            properties: { siteCode, areaKm2 },
            geometry,
          };
        } else {
          sites[siteCode].properties.areaKm2 += areaKm2;
          sites[siteCode].geometry.coordinates.push(geometry.coordinates);
        }
      });
      return sites;
    },
  },
};

console.log(chalk.underline('Building Deferred JSON Artifacts...'));

fsExtra.emptyDirSync(OUT_DEFERRED_JSON_PATH);
fs.readdir(TMP_DEFERRED_JSON_PATH, (err, files) => {
  files.forEach(zipFile => {
    const key = Object.keys(sources).find(k => sources[k].zipFile === zipFile);
    if (!key) { return; }
    const source = sources[key];
    console.log(chalk.yellow(key));
    fs.readFile(path.join(TMP_DEFERRED_JSON_PATH, zipFile), (err, data) => {
      console.log(chalk.yellow('Zip file read; converting shapes'));
      shp(data).then((geojson) => {
        const sites = source.process(geojson);
        generateFeatureSiteFilesDirectory(key, sites);
	    });
    });
  });
});
