import {
  convertDateToUTC,
  parseDataFiles,
} from './dataUtil';

/**
 * Determines which files are valid for wind rose display
 * Order matters, look for higher resolution first
 *
 * Maps temporal spatial index definitions to file name designations
 */
const FILE_RESOLUTION_MATCHERS = [
  { tmi: '001', fileName: '1min' },
  { tmi: '001', fileName: '1_min' },
  { tmi: '002', fileName: '2min' },
  { tmi: '002', fileName: '2_min' },
  { tmi: '005', fileName: '5min' },
  { tmi: '005', fileName: '5_min' },
  { tmi: '030', fileName: '30min' },
  { tmi: '030', fileName: '30_min' },
];

/**
 * Variable constant definitions
 */
// const DATA_FILE_VARIABLES = {
//   NAMES: {
//     START_DATE_TIME: 'startDateTime',
//     QUALITY_FLAG_POSTFIX: 'QF',
//   },
//   DATA_TYPES: {
//     DATE_TIME: 'dateTime',
//     REAL: 'real',
//     SIGNED_INTEGER: 'signed integer',
//     UNSIGNED_INTEGER: 'unsigned integer',
//   },
// };

const START_DATE_TIME_VAR = 'startDateTime';

export const VELOCITY_BINS = [
  '0-.25',
  '.25-.5',
  '.5-.75',
  '.75-1',
  '1-1.5',
  '1.5-2',
  '2-3',
  '3-5',
  '>5',
];

const VELOCITY_BIN_VALUES = [
  { value: 0.25, label: '0-.25' },
  { value: 0.50, label: '.25-.5' },
  { value: 0.75, label: '.5-.75' },
  { value: 1.0, label: '.75-1' },
  { value: 1.5, label: '1-1.5' },
  { value: 2.0, label: '1.5-2' },
  { value: 3.0, label: '2-3' },
  { value: 5.0, label: '3-5' },
];

export const DIRECTION_BIN_LOOKUP = {
  0: { angle: 0, direction: 'N' },
  22.5: { angle: 22.5, direction: 'NNE' },
  45: { angle: 45, direction: 'NE' },
  67.5: { angle: 67.5, direction: 'ENE' },
  90: { angle: 90, direction: 'E' },
  112.5: { angle: 112.5, direction: 'ESE' },
  135: { angle: 135, direction: 'SE' },
  157.5: { angle: 157.5, direction: 'SSE' },
  180: { angle: 180, direction: 'S' },
  202.5: { angle: 202.5, direction: 'SSW' },
  225: { angle: 225, direction: 'SW' },
  247.5: { angle: 247.5, direction: 'WSW' },
  270: { angle: 270, direction: 'W' },
  292.5: { angle: 292.5, direction: 'WNW' },
  315: { angle: 315, direction: 'NW' },
  337.5: { angle: 337.5, direction: 'NNW' },
};
const DIRECTION_BINS = Object.keys(DIRECTION_BIN_LOOKUP).sort((a, b) => a - b);

/**
 * Wind Rose changed type
 */
export const WIND_ROSE_CHANGE_TYPE = {
  SITE: 'SITE_CHANGED',
  MONTH: 'MONTH_CHANGED',
  POSITIONS: 'POSITIONS_CHANGED',
};

/**
 * Parses the file names and determines which should be utilized for
 * time series data and variables, as well as generating sets of
 * available horizontal and vertical spatial index selection options
 * @param {*} data
 * @param {*} query
 */
export const parseWindRoseDataFiles = (data, query) => (
  parseDataFiles(data, query, FILE_RESOLUTION_MATCHERS)
);

export const putWindRoseBin = (windRoseBins, dirBin, speedValue) => {
  if (Number.isNaN(speedValue) || (speedValue < 0)) {
    return;
  }
  let foundBin = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < VELOCITY_BIN_VALUES.length; i++) {
    const velBin = VELOCITY_BIN_VALUES[i];
    if (speedValue < velBin.value) {
      foundBin = true;
      // eslint-disable-next-line no-param-reassign
      windRoseBins[dirBin][velBin.label] += 1;
      break;
    }
  }
  if (!foundBin) {
    // eslint-disable-next-line no-param-reassign
    windRoseBins[dirBin][VELOCITY_BINS[VELOCITY_BINS.length - 1]] += 1;
  }
};

/**
 * Builds the wind rose data for display
 * Builds the selectable parameter options based on available data
 * @param {*} data
 * @param {*} variables
 * @param {*} dataFilesInfo
 */
export const buildWindRoseData = (data, dataFilesInfo) => {
  const builtData = {
    positions: dataFilesInfo.positions,
    positionOptions: dataFilesInfo.positionOptions,
    dataStateMessage: null,
    windRoseDailyBins: {},
    currentWindRose: {},
  };
  const velocityBins = {};
  VELOCITY_BINS.forEach((bin) => {
    velocityBins[bin] = 0;
  });
  // JSON result of parsed CSV data file
  // Array of objects, each index represents a row of data in the CSV
  // vertical slice of time when plotted with X = time, Y = value
  // Each object's key is the fieldName, value is the value
  data.forEach((fileData) => {
    // For each row of data in file
    fileData.data.forEach((rowData) => {
      const rowFieldKeys = Object.keys(rowData);
      let foundDirectionBin = false;
      let windDirValue = null;
      let windSpeedValue = null;
      // Ensure a valid time value to work from
      // The row is invalid if not associated with a time variable
      let seriesTimeValue = rowData[START_DATE_TIME_VAR];
      const seriesTimeDate = new Date(seriesTimeValue);
      if ((seriesTimeValue !== undefined) && (seriesTimeValue !== null)) {
        seriesTimeValue = convertDateToUTC(seriesTimeValue);
        // Build for each field in row
        rowFieldKeys.forEach((fieldName) => {
          if ((typeof rowData[fieldName] !== 'undefined')
              && (rowData[fieldName] !== null)
              && (rowData[fieldName].length > 0)) {
            if (fieldName === 'windDirMean') {
              windDirValue = parseFloat(rowData[fieldName]);
            } else if (fieldName === 'windSpeedMean') {
              windSpeedValue = parseFloat(rowData[fieldName]);
            }
          }
        });
      }
      if ((seriesTimeValue === undefined) || (seriesTimeValue === null)) {
        builtData.dataStateMessage = 'Time variable could not be determined from data.';
      } else {
        const windRoseDayKey = `${seriesTimeDate.getUTCFullYear().toString()}`
          + `-${(seriesTimeDate.getUTCMonth() + 1).toString()}`
          + `-${seriesTimeDate.getUTCDate().toString()}`;
        let windRoseBins = {};
        if (builtData.windRoseDailyBins[windRoseDayKey]) {
          windRoseBins = builtData.windRoseDailyBins[windRoseDayKey];
        } else {
          windRoseBins = {};
          DIRECTION_BINS.forEach((bin) => {
            windRoseBins[bin.toString()] = { ...velocityBins };
          });
        }
        if ((windDirValue !== null) && (windSpeedValue !== null)) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < DIRECTION_BINS.length; i++) {
            if (windDirValue < DIRECTION_BINS[i]) {
              foundDirectionBin = true;
              putWindRoseBin(windRoseBins, DIRECTION_BINS[i], windSpeedValue);
              break;
            }
          }
          if (!foundDirectionBin) {
            putWindRoseBin(windRoseBins, 0, windSpeedValue);
          }
        }
        builtData.windRoseDailyBins[windRoseDayKey] = windRoseBins;
      }
    });
  });
  const dayBins = builtData.windRoseDailyBins;
  let angleTotal = 0;
  // let totalDay = 0;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const dayBinKey in dayBins) {
    // totalDay = 0;
    const angleArray = [];
    let angleKey;
    const angles = Object.keys(dayBins[dayBinKey]).sort((a, b) => a - b);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < angles.length; i++) {
      angleKey = angles[i];
      // eslint-disable-next-line no-prototype-builtins
      if (!dayBins[dayBinKey].hasOwnProperty(angleKey)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      angleTotal = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const velKey in dayBins[dayBinKey][angleKey]) {
        // eslint-disable-next-line no-prototype-builtins
        if (!dayBins[dayBinKey][angleKey].hasOwnProperty(velKey)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        angleTotal += dayBins[dayBinKey][angleKey][velKey];
      }
      dayBins[dayBinKey][angleKey].total = angleTotal;
      // totalDay += angleTotal;
      dayBins[dayBinKey][angleKey].angle = angleKey;
      angleArray.push(dayBins[dayBinKey][angleKey]);
    }
    dayBins[dayBinKey] = angleArray;
    // console.log('Day total: ' + dayBinKey + ' => ' + totalDay.toString());
  }
  builtData.windRoseDailyBins = dayBins;
  if (dayBins && (Object.keys(dayBins).length > 0)) {
    builtData.currentWindRose = dayBins[Object.keys(dayBins)[0]];
  }
  return builtData;
};
