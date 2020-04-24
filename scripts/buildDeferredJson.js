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

// Shape Files that we download and parse into geojson
const FEATURE_SOURCES = {
  TOWER_AIRSHEDS: {
    zipFile: '90percentfootprint.zip',
    parsed: false,
  },
  AQUATIC_REACHES: {
    zipFile: 'AquaticReach.zip',
    parsed: false,
  },
  FLIGHT_BOX_BOUNDARIES: {
    zipFile: 'AOP_Flightboxes.zip',
    parsed: false,
  },
  SAMPLING_BOUNDARIES: {
    zipFile: 'Field_Sampling_Boundaries.zip',
    parsed: false,
  },
  AQUATIC_WATERSHEDS: {
    zipFile: 'NEONAquaticWatershed.zip',
    parsed: false,
  },
};
Object.keys(FEATURE_SOURCES).forEach((key) => { FEATURE_SOURCES[key].KEY = key; });

// Feature data that we extract fdrom above geojson. Note that there is NOT a 1:1 correlation
// of feature sources to features... some sources may be parsed out into more than one feature.
const FEATURES = {
  TOWER_AIRSHEDS: {
    source: FEATURE_SOURCES.TOWER_AIRSHEDS.KEY,
    getProperties: (properties) => {
      const { SiteID: siteCode } = properties;
      return { siteCode };
    },
  },
  AQUATIC_REACHES: {
    source: FEATURE_SOURCES.AQUATIC_REACHES.KEY,
    getProperties: (properties) => {
      const { SiteID: siteCode, HUC12, UTM_Zone, AreaKm2: areaKm2 } = properties;
      return { siteCode, HUC12, UTM_Zone, areaKm2 };
    },
  },
  FLIGHT_BOX_BOUNDARIES: {
    source: FEATURE_SOURCES.FLIGHT_BOX_BOUNDARIES.KEY,
    getProperties: (properties) => {
      const { siteID: siteCode, priority, version, flightbxID: flightBoxId } = properties;
      return { siteCode, priority, version, flightBoxId };
    },
  },
  SAMPLING_BOUNDARIES: {
    source: FEATURE_SOURCES.SAMPLING_BOUNDARIES.KEY,
    getProperties: (properties) => {
      const { siteID: siteCode, areaKm2 } = properties;
      return { siteCode, areaKm2 };
    },
  },
  WATERSHED_BOUNDARIES: {
    source: FEATURE_SOURCES.AQUATIC_WATERSHEDS.KEY,
    geojsonFileName: 'NEON_Aquatic_Watershed',
    getProperties: (properties) => {
      const { SiteID: siteCode, UTM_Zone, WSAreaKm2 } = properties;
      const areaKm2 = parseFloat(WSAreaKm2, 10);
      return { siteCode, UTM_Zone, areaKm2: areaKm2 || null };
    }
  },
  DRAINAGE_LINES: {
    source: FEATURE_SOURCES.AQUATIC_WATERSHEDS.KEY,
    geojsonFileName: 'NEON_Aquatic_DrainageLine',
    getProperties: (properties) => {
      const { SiteID: siteCode } = properties;
      return { siteCode };
    }
  },
  POUR_POINTS: {
    source: FEATURE_SOURCES.AQUATIC_WATERSHEDS.KEY,
    geojsonFileName: 'NEON_Aquatic_PourPoint',
    getProperties: (properties) => {
      const { SiteID: siteCode } = properties;
      return { siteCode };
    }
  },
};

// Shapefiles from the ArcGIS Gallery processed through shpjs produce [lon, lat] coordinates.
// Leaflet interprets coordinates as [lat,lon], so we have to flip every coordinate.
// Coordinates can also be deeply nested as in a MultiPolygon set, so do it recursively.
const sanitizeCoordinates = (coords) => {
  if (!Array.isArray(coords)) { return coords; }
  if (Array.isArray(coords[0])) {
    coords = coords.map(arr => sanitizeCoordinates(arr));
  } else {
    if (coords.length === 2 && coords.every(c => Number.isFinite(c))) {
      const [x, y] = coords;
      // All NEON features are in the north and west hemispheres, so latitude should always be
      // positive and longitude should always be negative.
      if (x < 0) {
        coords[0] = y;
        coords[1] = x;
      }
    }
  }
  return coords;
};

// Parse a converted single geojson object for a feature into a dictionary of geojson objects
// keyed by siteCode. Also sanitize coordinates and properties.
// getProperties function comes from FEATURES
const geojsonToSites = (geojson = {}, getProperties = p => p) => {
  const sites = {};
  if (!geojson.features) { return sites; }
  geojson.features.forEach((feature) => {
    if (!feature.geometry) { return; }
    const geometry = {
      type: feature.geometry.type,
      coordinates: sanitizeCoordinates(feature.geometry.coordinates),
    };
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

// Create a directory of geojson files named for their site (e.g. ABBY.json)
const generateFeatureSiteFilesDirectory = (featureKey, sitesData) => {
  if (!Object.keys(FEATURES).includes(featureKey)) { return 0; }
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
  return count;
};

console.log(chalk.underline('=== Building Deferred JSON Artifacts ===\n'));

// Extract feature data from converted geojson and render out to files (async step)
const GEOJSON_SOURCES = {};
const generateOutfiles = () => {
  console.log('- Generating feature data files\n');
  Object.keys(FEATURES).forEach((key) => {
    const feature = FEATURES[key];
    const { source } = feature;
    if (!source || !GEOJSON_SOURCES[source]) {
      console.log(chalk.red(`- - ${key} unable to generate; invalid source: ${source}`));
      return;
    }
    const geojson = (feature.geojsonFileName
      ? GEOJSON_SOURCES[source].find(fc => fc.fileName === feature.geojsonFileName)
      : GEOJSON_SOURCES[source]) || {};
    console.log(chalk.yellow(`- - ${key} - Parsing sites...`));
    const sites = geojsonToSites(geojson, feature.getProperties);
    const expectedSiteCount = Object.keys(sites).length;
    if (!expectedSiteCount) {
      console.log(chalk.red(`- - ${key} no sites parsed; aborting`));
      return;
    }
    console.log(chalk.yellow(`- - ${key} - Writing site JSON files...`));
    const resultSiteCount = generateFeatureSiteFilesDirectory(key, sites);
    if (resultSiteCount !== expectedSiteCount) {
      console.log(chalk.red(`- - ${key} expected ${expectedSiteCount} site files; ${resultSiteCount} generated:`));
    } else {
      console.log(chalk.green(`- - ${key} generated ${resultSiteCount} site files`));
      const alphaSites = Object.keys(sites).sort();
      console.log(chalk.green(`- - ${key} SiteMapDeferredJson.js entry:\n`));
      console.log(chalk.blue(`  [FEATURES.${key}.KEY]: {`));
      alphaSites.forEach(siteCode => {
        console.log(chalk.blue(`    ${siteCode}: () => import('./deferredJSON/${key}/${siteCode}.json'),`));
      });      
      console.log(chalk.blue(`  },\n`));
    }
  });
};

// Download shape files
// ...

// Clear the output directory
console.log('- Clearing output directory\n');
fsExtra.emptyDirSync(OUT_DEFERRED_JSON_PATH);

// Convert all shape files to geojson
console.log('- Converting feature source ZIP files to geojson\n');
Object.keys(FEATURE_SOURCES).forEach((key) => {
  const featureSource = FEATURE_SOURCES[key];
  const { zipFile } = featureSource;
  console.log(chalk.yellow(`- - ZIP: ${zipFile} - Reading...`));
  fs.readFile(path.join(TMP_DEFERRED_JSON_PATH, zipFile), (err, data) => {
    if (err) {
      console.log(chalk.red(`- - ZIP: ${zipFile} unable to read:`));
      console.log(chalk.red(err, ''));
      return;
    }
    console.log(chalk.yellow(`- - ZIP: ${zipFile} read complete; converting shapes...`));
    shp(data).then((geojson) => {
      GEOJSON_SOURCES[key] = geojson;
      console.log(chalk.green(`- - ZIP: ${zipFile} to geojson conversion complete`));
      // Spit out whole geojson if needed for setting up new features
      // const outFile = path.join(OUT_DEFERRED_JSON_PATH, `${key}.json`);
      // fs.writeFileSync(outFile, JSON.stringify(geojson, null, 2));
      FEATURE_SOURCES[key].parsed = true;
      if (Object.keys(FEATURE_SOURCES).every(source => FEATURE_SOURCES[source].parsed)) {
        generateOutfiles();
      }
	  });
  });
});
