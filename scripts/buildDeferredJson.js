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

const geojsonToSites = (geojson = {}, getProperties = (p) => p) => {
  const sites = {};
  if (!geojson.features) { return sites; }
  geojson.features.forEach((feature) => {
    if (!feature.geometry) { return; }
    const geometry = sanitizeGeometry(feature.geometry);
    const properties = getProperties(feature.properties);
    const { siteCode, areaKm2 } = properties;
    if (!siteCode) { return; }
    if (!sites[siteCode]) {
      sites[siteCode] = { type: 'Feature', properties, geometry };
    } else {
      if (areaKm2 && sites[siteCode].properties.areaKm2) {
        sites[siteCode].properties.areaKm2 += areaKm2;
      }
      sites[siteCode].geometry.coordinates.push(geometry.coordinates);
    }
  });
  return sites;
};

const generateFeatureSiteFilesDirectory = (featureKey, sitesData) => {
  if (!Object.keys(sources).includes(featureKey)) { return; }
  let count = 0;
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
    getProperties: (properties) => {
      console.log(properties);
      return properties;
    },
  },
  AQUATIC_REACHES: {
    zipFile: 'AquaticReach.zip',
    getProperties: (properties) => {
      const { SiteID: siteCode, HUC12, UTM_Zone, AreaKm2: areaKm2 } = properties;
      return { siteCode, HUC12, UTM_Zone, areaKm2 };
    },
  },
  WATERSHED_BOUNDARIES: {
    zipFile: 'NEONAquaticWatershed.zip',
    getProperties: (properties) => {
      const { SiteID: siteCode, UTM_Zone, WSAreaKm2 } = properties;
      const areaKm2 = parseFloat(WSAreaKm2, 10);
      return { siteCode, UTM_Zone, areaKm2: areaKm2 || null };
    }
  },
  FLIGHT_BOX_BOUNDARIES: {
    zipFile: 'AOP_Flightboxes.zip',
    getProperties: (properties) => {
      const { siteID: siteCode, priority, version, flightbxID: flightBoxId } = properties;
      return { siteCode, priority, version, flightBoxId };
    },
  },
  SAMPLING_BOUNDARIES: {
    zipFile: 'Field_Sampling_Boundaries.zip',
    getProperties: (properties) => {
      const { siteID: siteCode, areaKm2 } = properties;
      return { siteCode, areaKm2 };
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
        let sites = {};
        if (key === 'WATERSHED_BOUNDARIES') {
          // TODO: add support for drainage lines and pour points?
          const featureCollection = geojson.find(fc => fc.fileName === 'NEON_Aquatic_Watershed') || {};
          sites = geojsonToSites(featureCollection, source.getProperties);
        } else {
          sites = geojsonToSites(geojson, source.getProperties);
        }
        generateFeatureSiteFilesDirectory(key, sites);
	    });
    });
  });
});
