import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

import cloneDeep from 'lodash/cloneDeep';

import { mockAjaxResponse } from '../../../../__mocks__/ajax';

import TimeSeriesViewerContext, {
  getTestableItems,
  summarizeTimeSteps,
  Y_AXIS_RANGE_MODES,
} from '../TimeSeriesViewerContext';
import { TIME_SERIES_VIEWER_STATUS } from '../constants';

const { Provider, useTimeSeriesViewerState } = TimeSeriesViewerContext;

const {
  DEFAULT_STATE,
  FETCH_STATUS,
  applyDefaultsToSelection,
  generateYAxisRange,
  getTimeStep,
  getUpdatedValueRange,
  getContinuousDatesArray,
  limitVariablesToTwoUnits,
  parseProductData,
  parseSiteMonthData,
  parseSiteVariables,
  parseSitePositions,
  reducer,
  setDataFileFetchStatuses,
  TimeSeriesViewerPropTypes,
} = getTestableItems();

mockAjaxResponse({});

// Used in testing the parse functions below
const expectedInitialSite = {
  fetches: {
    siteMonths: {},
    positions: { status: FETCH_STATUS.AWAITING_CALL, error: null, url: null },
    variables: { status: FETCH_STATUS.AWAITING_CALL, error: null, url: null },
  },
  variables: new Set(),
  positions: {},
  availableMonths: [],
};

describe('TimeSeriesViewerContext', () => {
  describe('Provider', () => {
    test.skip('renders with productData prop', (done) => {
      const productData = {
        productCode: 'foo',
        productName: 'bar',
        siteCodes: [
          {
            siteCode: 'A',
            availableMonths: ['2001-01', '2001-02'],
          },
        ],
      };
      setTimeout(() => {
        const tree = renderer
          .create(
            <Provider productData={productData}>
              <div>children</div>
            </Provider>,
          ).toJSON();
        expect(tree).toMatchSnapshot();
        done();
      });
    });
    test('renders with productCode prop', (done) => {
      setTimeout(() => {
        const tree = renderer
          .create(
            <Provider productCode="DP1.23456.789">
              <div>children</div>
            </Provider>,
          ).toJSON();
        expect(tree).toMatchSnapshot();
        done();
      });
    });
  });

  describe('useTimeSeriesViewerState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', (done) => {
      setTimeout(() => {
        const { result } = renderHook(() => useTimeSeriesViewerState());
        expect(Array.isArray(result.current)).toBe(true);
        expect(result.current.length).toBe(2);
        const [state, dispatch] = result.current;
        expect(state).toStrictEqual(DEFAULT_STATE);
        expect(typeof dispatch).toBe('function');
        expect(dispatch()).toBeUndefined();
        done();
      });
    });
  });

  describe('summarizeTimeSteps', () => {
    test('returns "none" for a single step', () => {
      expect(summarizeTimeSteps(1)).toBe('none');
    });
    test('defaults to 30 minute increments if not passed an explicit timestep', () => {
      expect(summarizeTimeSteps(2)).toBe('60 minutes');
      expect(summarizeTimeSteps(48)).toBe('24 hours');
      expect(summarizeTimeSteps(2880)).toBe('2 months');
    });
    test('appropriately scales response to provided timestep', () => {
      expect(summarizeTimeSteps(2, '5min')).toBe('10 minutes');
      expect(summarizeTimeSteps(300, '1day')).toBe('10 months');
      expect(summarizeTimeSteps(50, '60min')).toBe('2.1 days');
    });
    test('does not pluralize if directed not to', () => {
      expect(summarizeTimeSteps(2, '5min', false)).toBe('10 minute');
      expect(summarizeTimeSteps(300, '1day', false)).toBe('10 month');
      expect(summarizeTimeSteps(50, '60min', false)).toBe('2.1 day');
    });
  });

  describe('generateYAxisRange', () => {
    test('returns original axis range if the providd axis object is misconfigured', () => {
      expect(generateYAxisRange({})).toBeUndefined();
      expect(generateYAxisRange({
        rangeMode: 'INVALID',
        axisRange: [0, 10],
      })).toStrictEqual([0, 10]);
    });
    test('returns proper range for CENTERED', () => {
      expect(generateYAxisRange({
        rangeMode: Y_AXIS_RANGE_MODES.CENTERED,
        axisRange: [0, 10],
        dataRange: [-10, 30],
        standardDeviation: 1,
      })).toStrictEqual([-11, 31]);
    });
    test('returns proper range for FROM_ZERO', () => {
      expect(generateYAxisRange({
        rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO,
        axisRange: [0, 10],
        dataRange: [15, 30],
        standardDeviation: 3,
      })).toStrictEqual([0, 33]);
    });
    test('returns unaltered axisRange for CUSTOM', () => {
      expect(generateYAxisRange({
        rangeMode: Y_AXIS_RANGE_MODES.CUSTOM,
        axisRange: [0, 10],
        dataRange: [15, 30],
        standardDeviation: 7,
      })).toStrictEqual([0, 10]);
    });
    test('returns proper range for CENTERED with 0 stddev; flat at zero', () => {
      expect(generateYAxisRange({
        rangeMode: Y_AXIS_RANGE_MODES.CENTERED,
        axisRange: [0, 0],
        dataRange: [0, 0],
        standardDeviation: 0,
      })).toStrictEqual([-1, 1]);
    });
    test('returns proper range for CENTERED with 0 stddev; flat at non-zero value', () => {
      expect(generateYAxisRange({
        rangeMode: Y_AXIS_RANGE_MODES.CENTERED,
        axisRange: [0, 0],
        dataRange: [-12, -12],
        standardDeviation: 0,
      })).toStrictEqual([-18, -6]);
    });
  });

  describe('getTimeStep', () => {
    test('returns null for unsupported inputs', () => {
      expect(getTimeStep()).toBe(null);
      expect(getTimeStep(null)).toBe(null);
      expect(getTimeStep('7min')).toBe(null);
    });
    test('returns time step key for valid inputs', () => {
      expect(getTimeStep('001')).toBe('1min');
      expect(getTimeStep('015')).toBe('15min');
      expect(getTimeStep('01D')).toBe('1day');
    });
  });

  describe('getUpdatedValueRange', () => {
    test('reflects original range if new range values are not numbers', () => {
      expect(getUpdatedValueRange([4, 5], null)).toStrictEqual([4, 5]);
      expect(getUpdatedValueRange([4, 5], [null, 7])).toStrictEqual([4, 5]);
    });
    test('applies any new values directly to a fully null range', () => {
      expect(getUpdatedValueRange([null, null], 12)).toStrictEqual([12, 12]);
      expect(getUpdatedValueRange([null, null], [3, 4])).toStrictEqual([3, 4]);
    });
    test('applies new scalar values correctly', () => {
      expect(getUpdatedValueRange([-5, 8], 12)).toStrictEqual([-5, 12]);
      expect(getUpdatedValueRange([-5, 8], -17)).toStrictEqual([-17, 8]);
      expect(getUpdatedValueRange([-5, 8], 1)).toStrictEqual([-5, 8]);
    });
    test('applies new array values correctly', () => {
      expect(getUpdatedValueRange([-5, 8], [6, 12])).toStrictEqual([-5, 12]);
      expect(getUpdatedValueRange([-5, 8], [-17, -11])).toStrictEqual([-17, 8]);
      expect(getUpdatedValueRange([-5, 8], [1, 4])).toStrictEqual([-5, 8]);
    });
  });

  describe('getContinuousDatesArray', () => {
    test('returns an empty array for invalid inputs', () => {
      expect(getContinuousDatesArray()).toStrictEqual([]);
      expect(getContinuousDatesArray([])).toStrictEqual([]);
      expect(getContinuousDatesArray(null)).toStrictEqual([]);
      expect(getContinuousDatesArray(['2010-01', 'bad', '2019-01'])).toStrictEqual([]);
    });
    test('reduces an input array of equal values to a single value array', () => {
      expect(getContinuousDatesArray(['2010-06', '2010-06'])).toStrictEqual(['2010-06']);
    });
    test('returns a valid continuous range for valid inputs', () => {
      expect(getContinuousDatesArray(['1999-10', '2000-02'])).toStrictEqual([
        '1999-10', '1999-11', '1999-12', '2000-01', '2000-02',
      ]);
      expect(getContinuousDatesArray(['2015-06', '2017-03'])).toStrictEqual([
        '2015-06', '2015-07', '2015-08', '2015-09', '2015-10', '2015-11', '2015-12', '2016-01',
        '2016-02', '2016-03', '2016-04', '2016-05', '2016-06', '2016-07', '2016-08', '2016-09',
        '2016-10', '2016-11', '2016-12', '2017-01', '2017-02', '2017-03',
      ]);
    });
    test('returns a valid continuous range for valid inputs rounded to years', () => {
      expect(getContinuousDatesArray(['1999-10', '2000-02'], true)).toStrictEqual([
        '1999-01', '1999-02', '1999-03', '1999-04', '1999-05', '1999-06', '1999-07', '1999-08',
        '1999-09', '1999-10', '1999-11', '1999-12', '2000-01', '2000-02', '2000-03', '2000-04',
        '2000-05', '2000-06', '2000-07', '2000-08', '2000-09', '2000-10', '2000-11', '2000-12',
        '2001-01',
      ]);
      expect(getContinuousDatesArray(['2015-06', '2017-03'], true)).toStrictEqual([
        '2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-07', '2015-08',
        '2015-09', '2015-10', '2015-11', '2015-12', '2016-01', '2016-02', '2016-03', '2016-04',
        '2016-05', '2016-06', '2016-07', '2016-08', '2016-09', '2016-10', '2016-11', '2016-12',
        '2017-01', '2017-02', '2017-03', '2017-04', '2017-05', '2017-06', '2017-07', '2017-08',
        '2017-09', '2017-10', '2017-11', '2017-12', '2018-01',
      ]);
    });
  });

  describe('parseProductData', () => {
    const parseProductDataInput = {
      productCode: 'DP1.00001.001',
      productName: '2D wind speed and direction',
      productDescription: 'Lorem ipsum',
      siteCodes: [
        { siteCode: 'ABBY', availableMonths: ['2001-01', '2001-02'] },
        { siteCode: 'BONA', availableMonths: ['2001-05', '2001-07'] },
        { siteCode: 'CLBJ', availableMonths: null },
      ],
    };
    const expectedParseProductDataOutput = {
      productCode: 'DP1.00001.001',
      productName: '2D wind speed and direction',
      productDescription: 'Lorem ipsum',
      productSensor: null,
      dateRange: ['2001-01', '2001-07'],
      variables: {},
      sites: {
        ABBY: {
          ...cloneDeep(expectedInitialSite),
          availableMonths: ['2001-01', '2001-02'],
          availableReleases: undefined,
        },
        BONA: {
          ...cloneDeep(expectedInitialSite),
          availableMonths: ['2001-05', '2001-07'],
          availableReleases: undefined,
        },
      },
      continuousDateRange: [
        '2001-01', '2001-02', '2001-03', '2001-04', '2001-05', '2001-06', '2001-07', '2001-08',
        '2001-09', '2001-10', '2001-11', '2001-12', '2002-01',
      ],
    };
    test('correctly parses valid input', () => {
      expect(parseProductData(parseProductDataInput))
        .toStrictEqual(expectedParseProductDataOutput);
    });
  });

  describe('parseSiteMonthData', () => {
    const parseSiteMonthDataInputSite = {
      ...cloneDeep(expectedInitialSite),
      availableMonths: ['2001-01', '2001-02'],
    };
    const parseSiteMonthDataInputFiles = [
      { // valid data file
        name: 'NEON.D16.ABBY.DP1.00001.001.000.030.002.2DWSD_2min.2001-01.expanded.20210105T140638Z.csv',
        url: 'https://bar/qux',
      },
      { // invalid data file (position '0F0' is not valid)
        name: 'NEON.D16.ABBY.DP1.00001.001.0F0.030.002.2DWSD_2min.2001-01.expanded.20210105T140638Z.csv',
        url: 'https://bar/qux',
      },
      { // valid data file
        name: 'NEON.D16.ABBY.DP1.00001.001.000.010.030.2DWSD_30min.2001-02.basic.20210105T140638Z.csv',
        url: 'https://foo/bar',
      },
      { // invalid data file (timestep '075' is not valid)
        name: 'NEON.D16.ABBY.DP1.00001.001.000.030.075.2DWSD_75min.2001-01.expanded.20210105T140638Z.csv',
        url: 'https://bar/qux',
      },
      { // valid variables file
        name: 'NEON.D16.ABBY.DP1.00001.001.variables.csv',
        url: 'https://foo/bar/var',
      },
      { // valid sensor positions file
        name: 'NEON.D16.ABBY.DP1.00001.001.sensor_positions.csv',
        url: 'https://foo/bar/sen',
      },
      { // valid second sensor positions file
        name: 'NEON.D16.ABBY.DP1.00001.001.sensor_positions.2.csv',
        url: 'https://foo/bar/sen2',
      },
      { // invalid / unrecognized file
        name: 'NOT-A-CSV.json',
        url: 'https://foo/bar/json',
      },
    ];
    const expectedParseSiteMonthDataOutput = {
      availableTimeSteps: new Set(['2min', '30min']),
      siteObject: {
        ...parseSiteMonthDataInputSite,
        fetches: {
          siteMonths: {},
          positions: {
            status: FETCH_STATUS.AWAITING_CALL,
            error: null,
            url: 'https://foo/bar/sen',
          },
          variables: {
            status: FETCH_STATUS.AWAITING_CALL,
            error: null,
            url: 'https://foo/bar/var',
          },
        },
        positions: {
          '000.030': {
            history: [],
            data: {
              '2001-01': {
                expanded: {
                  '2min': {
                    '2DWSD_2min': {
                      url: 'https://bar/qux',
                      status: FETCH_STATUS.AWAITING_CALL,
                      error: null,
                      series: {},
                    },
                  },
                },
              },
            },
          },
          '000.010': {
            history: [],
            data: {
              '2001-02': {
                basic: {
                  '30min': {
                    '2DWSD_30min': {
                      url: 'https://foo/bar',
                      status: FETCH_STATUS.AWAITING_CALL,
                      error: null,
                      series: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    test('correctly parses valid input', () => {
      expect(parseSiteMonthData(parseSiteMonthDataInputSite, parseSiteMonthDataInputFiles))
        .toStrictEqual(expectedParseSiteMonthDataOutput);
    });
  });

  describe('parseSiteVariables', () => {
    const previousVariables = {
      existingVar: {
        dataType: 'unsigned integer',
        description: 'Existing...',
        downloadPkg: 'expanded',
        units: 'foo',
        timeSteps: new Set(['1min']),
        sites: new Set(['BONA', 'CLBJ']),
        isSelectable: true,
        canBeDefault: false,
        isDateTime: false,
      },
    };
    const inputCSV = `
table,fieldName,description,dataType,units,downloadPkg,pubFormat
2DWSD_2min,startDateTime,"Date...",dateTime,NA,basic,"yyyy-MM-dd'T'HH:mm:ss'Z'(floor)"
2DWSD_2min,windSpeedMean,"Mean...",real,metersPerSecond,basic,"*.##(round)"
2DWSD_2min,rangeFailQM,"QM...",real,percent,expanded,"*.##(round)"
2DWSD_30min,rangeFailQM,"QM...",real,percent,expanded,"*.##(round)"
2DWSD_15min,calmWindQF,"QF...",signed integer,NA,expanded,"integer"
2DWSD_60min,uid,"uid field",signed integer,NA,expanded,"integer"
`;
    const expectedOutput = {
      variablesSet: new Set(['startDateTime', 'windSpeedMean', 'rangeFailQM', 'calmWindQF']),
      variablesObject: {
        ...previousVariables,
        startDateTime: {
          dataType: 'dateTime',
          description: 'Date...',
          downloadPkg: 'basic',
          units: 'NA',
          tables: new Set(['2DWSD_2min']),
          timeSteps: new Set(['2min']),
          sites: new Set(['ABBY']),
          isSelectable: false,
          canBeDefault: false,
          isDateTime: true,
          order: 0,
        },
        windSpeedMean: {
          dataType: 'real',
          description: 'Mean...',
          downloadPkg: 'basic',
          units: 'metersPerSecond',
          tables: new Set(['2DWSD_2min']),
          timeSteps: new Set(['2min']),
          sites: new Set(['ABBY']),
          isSelectable: true,
          canBeDefault: true,
          isDateTime: false,
          order: 1,
        },
        rangeFailQM: {
          dataType: 'real',
          description: 'QM...',
          downloadPkg: 'expanded',
          units: 'percent',
          tables: new Set(['2DWSD_2min', '2DWSD_30min']),
          timeSteps: new Set(['2min', '30min']),
          sites: new Set(['ABBY']),
          isSelectable: true,
          canBeDefault: false,
          isDateTime: false,
          order: 2,
        },
        calmWindQF: {
          dataType: 'signed integer',
          description: 'QF...',
          downloadPkg: 'expanded',
          units: 'NA',
          tables: new Set(['2DWSD_15min']),
          timeSteps: new Set(['15min']),
          sites: new Set(['ABBY']),
          isSelectable: false,
          canBeDefault: false,
          isDateTime: false,
          order: 4,
        },
      },
      timeStepVariables: {
        '15min': {
          dateTimeVariables: new Set(),
          variables: new Set(['calmWindQF']),
        },
        '2min': {
          dateTimeVariables: new Set(['startDateTime']),
          variables: new Set(['startDateTime', 'windSpeedMean', 'rangeFailQM']),
        },
        '30min': {
          dateTimeVariables: new Set(),
          variables: new Set(['rangeFailQM']),
        },
      },
    };
    test('correctly parses valid input', () => {
      expect(parseSiteVariables(previousVariables, 'ABBY', inputCSV))
        .toStrictEqual(expectedOutput);
    });
  });

  describe('parseSitePositions', () => {
    const inputSite = {
      ...cloneDeep(expectedInitialSite),
      positions: {
        '000.010': {
          history: [
            {
              horVer: '000.010',
              sensorName: 'CFGLOC102010',
              sensorDescription: 'Abby Road 2D Wind L1',
              sensorStartDateTime: '2001-01-01T00:00:00Z',
              sensorEndDateTime: '2009-01-01T00:00:00Z',
              xOffset: 2.36,
              yOffset: 6.25,
              zOffset: 0.22,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            },
          ],
          data: {},
        },
      },
    };
    const inputCSV = `
HOR.VER,name,description,start,end,xOffset,yOffset,zOffset
"000.010",CFGLOC102010,"Abby Road 2D Wind L1","2010-01-01T00:00:00Z","2020-01-01T00:00:00Z",2.36,6.25,0.22
"000.010",CFGLOC102010,"Abby Road 2D Wind L1","2010-01-01T00:00:00Z","2020-01-01T00:00:00Z",2.36,6.25,0.22
"000.010",CFGLOC102010,"Abby Road 2D Wind L1","2020-01-01T00:00:01Z",,2.45,6.25,0.22
"000.030",CFGLOC102020,"Abby Road 2D Wind L3","2010-01-01T00:00:00Z",,2.36,6.22,9.43
`;
    const expectedOutput = {
      ...cloneDeep(expectedInitialSite),
      positions: {
        '000.010': {
          history: [
            {
              horVer: '000.010',
              sensorName: 'CFGLOC102010',
              sensorDescription: 'Abby Road 2D Wind L1',
              sensorStartDateTime: '2001-01-01T00:00:00Z',
              sensorEndDateTime: '2009-01-01T00:00:00Z',
              xOffset: 2.36,
              yOffset: 6.25,
              zOffset: 0.22,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            },
            {
              horVer: '000.010',
              sensorName: 'CFGLOC102010',
              sensorDescription: 'Abby Road 2D Wind L1',
              sensorStartDateTime: '2010-01-01T00:00:00Z',
              sensorEndDateTime: '2020-01-01T00:00:00Z',
              xOffset: 2.36,
              yOffset: 6.25,
              zOffset: 0.22,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            },
            {
              horVer: '000.010',
              sensorName: 'CFGLOC102010',
              sensorDescription: 'Abby Road 2D Wind L1',
              sensorStartDateTime: '2020-01-01T00:00:01Z',
              sensorEndDateTime: '',
              xOffset: 2.45,
              yOffset: 6.25,
              zOffset: 0.22,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            },
          ],
          data: {},
        },
        '000.030': {
          history: [
            {
              horVer: '000.030',
              sensorName: 'CFGLOC102020',
              sensorDescription: 'Abby Road 2D Wind L3',
              sensorStartDateTime: '2010-01-01T00:00:00Z',
              sensorEndDateTime: '',
              xOffset: 2.36,
              yOffset: 6.22,
              zOffset: 9.43,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            },
          ],
          data: {},
        },
      },
    };
    test('correctly parses valid input', () => {
      expect(parseSitePositions(inputSite, inputCSV))
        .toStrictEqual(expectedOutput);
    });
  });

  describe('TimeSeriesViewerPropTypes', () => {
    const { productCode, productData } = TimeSeriesViewerPropTypes;
    describe('productCode', () => {
      test('not valid if neither productCode nor productData are present', () => {
        expect(productCode({ foo: 'bar' }, 'productCode')).toBeInstanceOf(Error);
      });
      test('valid if missing but productData is present', () => {
        expect(productCode({ productData: 'bar' }, 'productCode')).toBe(null);
      });
      test('invalid if present but not a string or otherwise empty', () => {
        expect(productCode({ productCode: null }, 'productCode')).toBeInstanceOf(Error);
        expect(productCode({ productCode: 1000 }, 'productCode')).toBeInstanceOf(Error);
        expect(productCode({ productCode: ['foo', 'bar'] }, 'productCode')).toBeInstanceOf(Error);
        expect(productCode({ productCode: '' }, 'productCode')).toBeInstanceOf(Error);
      });
      test('valid with any string', () => {
        expect(productCode({ productCode: 'DP1.00001.001' }, 'productCode')).toBe(null);
        expect(productCode({ productCode: 'bar' }, 'productCode')).toBe(null);
      });
    });
    describe('productData', () => {
      test('not valid if neither productCode nor productData are present', () => {
        expect(productData({ foo: 'bar' }, 'productData')).toBeInstanceOf(Error);
      });
      test('valid if missing but productCode is present', () => {
        expect(productData({ productCode: 'bar' }, 'productData')).toBe(null);
      });
      test('invalid if present but not matching the productDataShape', () => {
        const badProductDataShapes = [
          { productCode: 'foo' },
          {
            productCode: 'foo',
            siteCodes: [
              { siteCode: 'A', availableMonths: ['2001-01', '2001-02'] },
            ],
          },
          {
            productCode: 'foo',
            productName: 'bar',
            siteCodes: [
              { availableMonths: ['2001-01', '2001-02'] },
            ],
          },
          {
            productCode: 'foo',
            productName: 'bar',
            siteCodes: [
              { siteCode: 'A', availableMonths: [null] },
            ],
          },
        ];
        badProductDataShapes.forEach((badShape) => {
          expect(productData({ productData: badShape }, 'productData')).toBeInstanceOf(Error);
        });
      });
      test('valid for supported product data shapes', () => {
        const goodProductDataShapes = [
          {
            productCode: 'foo',
            productName: 'bar',
            siteCodes: [
              { siteCode: 'A', availableMonths: ['2001-01', '2001-02'] },
            ],
          },
          {
            productCode: 'foo',
            productName: 'bar',
            siteCodes: [
              { siteCode: 'A', availableMonths: ['2001-01', '2001-02'], otherThings: null },
              { siteCode: 'B', availableMonths: ['2001-01', '2001-02'] },
            ],
            additionalStuff: 'whatever',
          },
        ];
        goodProductDataShapes.forEach((goodShape) => {
          expect(productData({ productData: goodShape }, 'productData')).toBe(null);
        });
      });
    });
  });

  describe('applyDefaultsToSelection()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
      state.selection.sites = [];
      state.product.sites = {
        S1: {
          ...cloneDeep(expectedInitialSite),
          availableMonths: ['2010-03', '2010-09'],
          positions: {
            '000.010': { data: {}, history: [] },
            '000.020': { data: {}, history: [] },
          },
        },
        S2: {
          ...cloneDeep(expectedInitialSite),
          availableMonths: ['2012-04', '2012-10'],
          positions: {
            '000.040': { data: {}, history: [] },
            '000.050': { data: {}, history: [] },
          },
        },
        S3: {
          ...cloneDeep(expectedInitialSite),
          availableMonths: ['2016-05', '2016-11'],
          positions: {},
        },
      };
      state.timeStep = {
        availableTimeSteps: new Set(['auto', '30min']),
        variables: {
          '30min': {
            variables: new Set(['startDateTime', 'foo', 'endDate', 'zux', 'bar', 'startDate', 'endDateTime']),
            dateTimeVariables: new Set(['startDateTime', 'startDate', 'endDate', 'endDateTime']),
          }
        },
      };
      state.variables = {
        foo: {
          canBeDefault: false, isDateTime: false, downloadPkg: 'basic', units: 'foos', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 4,
        },
        endDate: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 3,
        },
        zux: {
          canBeDefault: false, isDateTime: false, downloadPkg: 'expanded', units: 'zuxs', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 5,
        },
        bar: {
          canBeDefault: true, isDateTime: false, downloadPkg: 'basic', units: 'bars', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 6,
        },
        startDate: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 2,
        },
        startDateTime: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 0,
        },
        endDateTime: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA', tables: ['TABLE_30min'], timeSteps: new Set(['30min']), order: 1,
        },
      };
    });
    test('does nothing if there are no product sites in state', () => {
      state.product.sites = {};
      expect(
        applyDefaultsToSelection(state),
      ).toStrictEqual(state.selection);
    });
    test('applies site, date range, and position if none are defined in selection and no variables yet', () => {
      state.variables = [];
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.sites).toStrictEqual([{ siteCode: 'S1', positions: ['000.010'] }]);
      expect(newSelection.dateRange).toStrictEqual(['2010-09', '2010-09']);
    });
    test('also applies variable if none selected and variable present', () => {
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.variables).toStrictEqual(['bar']);
      expect(newSelection.dateTimeVariable).toStrictEqual('startDateTime');
    });
    test('does not apply variable if no default is available', () => {
      Object.keys(state.variables).forEach((v) => {
        state.variables[v].canBeDefault = false;
      });
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.variables).toStrictEqual([]);
    });
    test('does not apply dateTimeVariable if no dateTime variables are available', () => {
      Object.keys(state.variables).forEach((v) => {
        state.variables[v].isDateTime = false;
      });
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.dateTimeVariable).toBe(null);
    });
    test('does not apply position if site has none to apply', () => {
      state.selection.sites = [{ siteCode: 'S3', positions: [] }];
      state.selection.dateRange = ['2016-05', '2016-11'];
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.sites).toStrictEqual([{ siteCode: 'S3', positions: [] }]);
      expect(newSelection.dateRange).toStrictEqual(['2016-05', '2016-11']);
    });
    test('does not apply site, date range, position, or variables if already selected', () => {
      state.selection.sites = [{ siteCode: 'S2', positions: ['000.050'] }];
      state.selection.dateRange = ['2012-04', '2012-04'];
      state.selection.variables = ['foo', 'zux'];
      state.selection.dateTimeVariable = 'endDate';
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.sites).toStrictEqual([{ siteCode: 'S2', positions: ['000.050'] }]);
      expect(newSelection.dateRange).toStrictEqual(['2012-04', '2012-04']);
    });
    test('sets yAxis range when changing the default variable if series data present', () => {
      state.selection.sites = [{ siteCode: 'S2', positions: ['000.050'] }];
      state.selection.timeStep = '30min';
      state.product.sites.S2.positions['000.050'].data['2012-10'] = {
        basic: {
          '30min': {
            'TABLE_30min': {
              series: {
                bar: {
                  data: [17, 15, 23, 7, 9, 13],
                  range: [7, 23],
                  count: 6,
                  sum: 84,
                  variance: 33.2,
                },
                startDateTime: {
                  data: [1, 2, 3, 4, 5, 6],
                  range: [null, null],
                  count: 0,
                  sum: 0,
                  variance: 0,
                },
              },
            },
          },
        },
      };
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.yAxes.y1.units).toBe('bars');
      expect(newSelection.yAxes.y1.precision).toBe(2);
      expect(newSelection.yAxes.y1.standardDeviation).toBe(5.76);
      expect(newSelection.yAxes.y1.dataRange).toStrictEqual([7, 23]);
      expect(newSelection.yAxes.y1.axisRange).toStrictEqual([1.24, 28.76]);
    });
  });

  describe('limitVariablesToTwoUnits()', () => {
    test('generates appropriate output with ordered selectedUnits for two variables', () => {
      const output = limitVariablesToTwoUnits(
        {
          variables: {
            v1: { units: 'bar' },
            v2: { units: 'foo' },
            v3: { units: 'foo' },
            v4: { units: 'qux' },
          },
        },
        ['v4', 'v2'],
      );
      expect(output.selectedUnits).toStrictEqual(['qux', 'foo']);
      expect(output.variables).toStrictEqual(['v4', 'v2']);
    });
    test('truncates selected variables if a third unit is present', () => {
      const output = limitVariablesToTwoUnits(
        {
          variables: {
            v1: { units: 'bar' },
            v2: { units: 'foo' },
            v3: { units: 'foo' },
            v4: { units: 'qux' },
          },
        },
        ['v2', 'v4', 'v1', 'v3'],
      );
      expect(output.selectedUnits).toStrictEqual(['foo', 'qux']);
      expect(output.variables).toStrictEqual(['v2', 'v4', 'v3']);
    });
  });

  describe('setDataFileFetchStatuses()', () => {
    test('applies FETCHING status for all supplied fetches, ignoring mismatches', () => {
      const newState = setDataFileFetchStatuses(
        // state argument
        {
          product: {
            sites: {
              BLUE: {
                positions: {
                  A: {
                    data: {
                      X: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.AWAITING_CALL } } } },
                      Y: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.AWAITING_CALL } } } },
                    },
                  },
                },
              },
              HARV: {
                positions: {
                  B: {
                    data: {
                      X: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.AWAITING_CALL } } } },
                      Y: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.AWAITING_CALL } } } },
                    },
                  },
                },
              },
            },
          },
        },
        // fetches argument
        [
          {
            siteCode: 'BLUE', position: 'A', month: 'X', downloadPkg: 'basic', timeStep: '1min', table: 'TABLE_1min',
          },
          {
            siteCode: 'HARV', position: 'B', month: 'Y', downloadPkg: 'basic', timeStep: '1min', table: 'TABLE_1min',
          },
          {
            siteCode: 'HARV', position: 'B', month: 'X', downloadPkg: 'basic', timeStep: '10min', table: 'TABLE_1min',
          },
        ],
      );
      expect(
        newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].status,
      ).toBe(FETCH_STATUS.FETCHING);
      expect(
        newState.product.sites.BLUE.positions.A.data.Y.basic['1min']['TABLE_1min'].status,
      ).toBe(FETCH_STATUS.AWAITING_CALL);
      expect(
        newState.product.sites.HARV.positions.B.data.X.basic['1min']['TABLE_1min'].status,
      ).toBe(FETCH_STATUS.AWAITING_CALL);
      expect(
        newState.product.sites.HARV.positions.B.data.Y.basic['1min']['TABLE_1min'].status,
      ).toBe(FETCH_STATUS.FETCHING);
    });
  });

  describe('reducer()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    });
    test('does nothing if passed an unsupported action type', () => {
      expect(reducer(state, { type: 'invalidActionType' })).toStrictEqual(state);
    });
    describe('reinitialize', () => {
      test('resets to default state and applies productCode', () => {
        const modifiedState = { ...state, otherStuff: 'bar' };
        const newState = reducer(modifiedState, { type: 'reinitialize', productCode: 'foo', release: 'bar' });
        expect(newState).toStrictEqual({
          ...DEFAULT_STATE,
          release: 'bar',
          product: {
            ...DEFAULT_STATE.product,
            productCode: 'foo',
          },
        });
      });
    });

    // initFetchProduct actions
    describe('initFetchProductCalled', () => {
      test('sets the status', () => {
        expect(reducer(state, { type: 'initFetchProductCalled' })).toStrictEqual({
          ...state,
          fetchProduct: {
            ...state.fetchProduct,
            status: FETCH_STATUS.FETCHING,
          },
        });
      });
    });
    describe('initFetchProductFailed', () => {
      test('sets failure appropriately', () => {
        expect(reducer(state, { type: 'initFetchProductFailed', error: 'foo' })).toStrictEqual({
          ...state,
          fetchProduct: {
            ...state.fetchProduct,
            status: FETCH_STATUS.ERROR,
            error: 'foo',
          },
          status: TIME_SERIES_VIEWER_STATUS.ERROR,
          displayError: 'Unable to load product: foo',
        });
      });
    });
    describe('initFetchProductSucceeded', () => {
      test('sets success appropriately', () => {
        const productData = { productCode: 'foo', productName: 'bar' };
        const newState = reducer(state, { type: 'initFetchProductSucceeded', productData });
        expect(newState.fetchProduct.status).toBe(FETCH_STATUS.SUCCESS);
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_META);
      });
    });

    // fetchSiteMonth actions
    describe('fetchSiteMonth', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = { HARV: {}, BLUE: {} };
        expect(
          reducer(state, { type: 'fetchSiteMonth', siteCode: 'JERC', month: '2020-01' }),
        ).toStrictEqual(state);
      });
      test('sets site/month fetch in motion', () => {
        state.product.sites = {
          HARV: { fetches: { siteMonths: {} } },
          JERC: { fetches: { siteMonths: {} } },
        };
        const newState = reducer(
          state,
          { type: 'fetchSiteMonth', siteCode: 'JERC', month: '2020-01' },
        );
        expect(newState.metaFetches).toStrictEqual({
          'fetchSiteMonth.JERC.2020-01': true,
        });
        expect(newState.product.sites.JERC.fetches.siteMonths['2020-01']).toStrictEqual({
          status: FETCH_STATUS.FETCHING, error: null,
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_META);
      });
    });
    describe('fetchSiteMonthFailed', () => {
      test('does nothing if siteCode or month do not map to an existing meta fetch', () => {
        expect(
          reducer(state, { type: 'fetchSiteMonthFailed', siteCode: 'JERC', month: '2020-01' }),
        ).toStrictEqual(state);
      });
      test('properly fails an existing siteMonth fetch', () => {
        state.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
        state.product.sites = {
          HARV: {
            fetches: {
              siteMonths: {
                '2020-01': { status: FETCH_STATUS.FETCHING, error: null },
              },
            },
          },
          JERC: {
            fetches: {
              siteMonths: {
                '2020-01': { status: FETCH_STATUS.FETCHING, error: null },
              },
            },
          },
        };
        state.metaFetches = {
          'fetchSiteMonth.JERC.2020-01': true,
          'fetchSiteMonth.HARV.2020-01': true,
        };
        const newState = reducer(
          state,
          {
            type: 'fetchSiteMonthFailed', siteCode: 'JERC', month: '2020-01', error: 'foo',
          },
        );
        expect(newState.metaFetches).toStrictEqual({
          'fetchSiteMonth.HARV.2020-01': true,
        });
        expect(newState.product.sites.JERC.fetches.siteMonths['2020-01']).toStrictEqual({
          status: FETCH_STATUS.ERROR, error: 'foo',
        });
        expect(newState.product.sites.HARV.fetches.siteMonths['2020-01']).toStrictEqual({
          status: FETCH_STATUS.FETCHING, error: null,
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_META);
      });
    });
    describe('fetchSiteMonthSucceeded', () => {
      beforeEach(() => {
        state.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            availableMonths: ['2020-01', '2020-02'],
          },
        };
        state.product.sites.JERC.fetches.siteMonths = {
          '2020-01': { status: FETCH_STATUS.FETCHING, error: null },
        };
        state.metaFetches = {
          'fetchSiteMonth.JERC.2020-01': true,
        };
      });
      test('does nothing if siteCode or month do not map to an existing meta fetch', () => {
        expect(
          reducer(state, { type: 'fetchSiteMonthSucceeded', siteCode: 'BLUE', month: '2020-01' }),
        ).toStrictEqual(state);
      });
      test('fails generally if no available timestep results', () => {
        const files = [
          { // invalid data file (timestep '075' is not valid)
            name: 'NEON.D16.JERC.DP1.00001.001.000.030.075.2DWSD_75min.2020-01.expanded.20210105T140638Z.csv',
            url: 'https://bar/qux',
          },
          { // valid variables file
            name: 'NEON.D16.JERC.DP1.00001.001.variables.csv',
            url: 'https://foo/bar/var',
          },
          { // valid sensor positions file
            name: 'NEON.D16.JERC.DP1.00001.001.sensor_positions.csv',
            url: 'https://foo/bar/sen',
          },
        ];
        const newState = reducer(
          state, {
            type: 'fetchSiteMonthSucceeded', siteCode: 'JERC', month: '2020-01', files,
          },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.siteMonths['2020-01']).toStrictEqual({
          status: FETCH_STATUS.SUCCESS, error: null,
        });
        expect(newState.timeStep.availableTimeSteps).toStrictEqual(new Set(['auto']));
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.ERROR);
      });
      test('stores results and sets the available time steps from parsed file names', () => {
        const files = [
          { // invalid data file (timestep '75min' is not valid)
            name: 'NEON.D16.JERC.DP1.00001.001.000.030.002.2DWSD_2min.2020-01.basic.20210105T140638Z.csv',
            url: 'https://bar/qux',
          },
          { // valid variables file
            name: 'NEON.D16.JERC.DP1.00001.001.variables.csv',
            url: 'https://foo/bar/var',
          },
          { // valid sensor positions file
            name: 'NEON.D16.JERC.DP1.00001.001.sensor_positions.csv',
            url: 'https://foo/bar/sen',
          },
        ];
        const newState = reducer(
          state, {
            type: 'fetchSiteMonthSucceeded', siteCode: 'JERC', month: '2020-01', files,
          },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.siteMonths['2020-01']).toStrictEqual({
          status: FETCH_STATUS.SUCCESS, error: null,
        });
        expect(
          newState.product.sites.JERC.positions['000.030'].data['2020-01'].basic['2min']['2DWSD_2min'],
        ).toStrictEqual({
          url: 'https://bar/qux',
          status: FETCH_STATUS.AWAITING_CALL,
          error: null,
          series: {},
        });
        expect(newState.timeStep.availableTimeSteps).toStrictEqual(new Set(['auto', '2min']));
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_META);
      });
    });

    // fetchSiteVariables actions
    describe('fetchSiteVariables', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        expect(
          reducer(state, { type: 'fetchSiteVariables', siteCode: 'JERC' }),
        ).toStrictEqual(state);
      });
      test('sets variables fetch in motion', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const newState = reducer(
          state,
          { type: 'fetchSiteVariables', siteCode: 'JERC' },
        );
        expect(newState.metaFetches).toStrictEqual({
          'fetchSiteVariables.JERC': true,
        });
        expect(newState.product.sites.JERC.fetches.variables).toStrictEqual({
          status: FETCH_STATUS.FETCHING, error: null, url: null,
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_META);
      });
    });
    describe('fetchSiteVariablesFailed', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        expect(
          reducer(state, { type: 'fetchSiteVariablesFailed', siteCode: 'JERC', error: 'foo' }),
        ).toStrictEqual(state);
      });
      test('properly fails an existing variable fetch', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const newState = reducer(
          state,
          { type: 'fetchSiteVariablesFailed', siteCode: 'JERC', error: 'foo' },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.variables).toStrictEqual({
          status: FETCH_STATUS.ERROR, error: 'foo', url: null,
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA);
      });
    });
    describe('fetchSiteVariablesSucceeded', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        expect(
          reducer(state, { type: 'fetchSiteVariablesSucceeded', siteCode: 'JERC', csv: '' }),
        ).toStrictEqual(state);
      });
      test('properly handles completed variables fetch for only valid tables', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const csv = `table,fieldName,description,dataType,units,downloadPkg,pubFormat
t1_2min,v1,v1desc,dateTime,NA,basic,*
t1_2min,v2,v2desc,real,meters,basic,*
t1_2min,v3QM,v3QMdesc,real,percent,basic,*
t2_10min,v4,v4desc,real,meters,basic,*
t2_10min,uid,v5desc,real,meters,basic,*
t3_60min,v6,v6desc,real,meters,expanded,*
t3_60min,v7QF,v7QFdesc,real,NA,basic,*
`;
        const newState = reducer(
          state,
          { type: 'fetchSiteVariablesSucceeded', siteCode: 'JERC', csv },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.variables).toStrictEqual({
          status: FETCH_STATUS.SUCCESS, error: null, url: null,
        });
        expect(newState.variables).toStrictEqual({
          v1: {
            canBeDefault: false,
            dataType: 'dateTime',
            description: 'v1desc',
            downloadPkg: 'basic',
            isDateTime: true,
            isSelectable: false,
            units: 'NA',
            tables: new Set(['t1_2min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['2min']),
            order: 0,
          },
          v2: {
            canBeDefault: true,
            dataType: 'real',
            description: 'v2desc',
            downloadPkg: 'basic',
            isDateTime: false,
            isSelectable: true,
            units: 'meters',
            tables: new Set(['t1_2min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['2min']),
            order: 1,
          },
          v3QM: {
            canBeDefault: false,
            dataType: 'real',
            description: 'v3QMdesc',
            downloadPkg: 'basic',
            isDateTime: false,
            isSelectable: true,
            units: 'percent',
            tables: new Set(['t1_2min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['2min']),
            order: 2,
          },
          v6: {
            canBeDefault: false,
            dataType: 'real',
            description: 'v6desc',
            downloadPkg: 'expanded',
            isDateTime: false,
            isSelectable: true,
            units: 'meters',
            tables: new Set(['t3_60min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['60min']),
            order: 3,
          },
          v7QF: {
            canBeDefault: false,
            dataType: 'real',
            description: 'v7QFdesc',
            downloadPkg: 'basic',
            isDateTime: false,
            isSelectable: false,
            units: 'NA',
            tables: new Set(['t3_60min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['60min']),
            order: 4,
          },
        });
        expect(newState.product.sites.JERC.variables)
          .toStrictEqual(new Set(['v1', 'v2', 'v3QM', 'v6', 'v7QF']));
        expect(newState.availableQualityFlags)
          .toStrictEqual(new Set(['v7QF']));
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA);
      });
      test('fails to a general error state if no dateTime variables are present', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const csv = `table,fieldName,description,dataType,units,downloadPkg,pubFormat
t1_2min,v2,v2desc,real,meters,basic,*
t1_2min,v3QM,v3QMdesc,real,percent,basic,*
`;
        const newState = reducer(
          state,
          { type: 'fetchSiteVariablesSucceeded', siteCode: 'JERC', csv },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.variables).toStrictEqual({
          status: FETCH_STATUS.SUCCESS, error: null, url: null,
        });
        expect(newState.variables).toStrictEqual({
          v2: {
            canBeDefault: true,
            dataType: 'real',
            description: 'v2desc',
            downloadPkg: 'basic',
            isDateTime: false,
            isSelectable: true,
            units: 'meters',
            tables: new Set(['t1_2min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['2min']),
            order: 0,
          },
          v3QM: {
            canBeDefault: false,
            dataType: 'real',
            description: 'v3QMdesc',
            downloadPkg: 'basic',
            isDateTime: false,
            isSelectable: true,
            units: 'percent',
            tables: new Set(['t1_2min']),
            sites: new Set(['JERC']),
            timeSteps: new Set(['2min']),
            order: 1,
          },
        });
        expect(newState.product.sites.JERC.variables)
          .toStrictEqual(new Set(['v2', 'v3QM']));
        expect(newState.availableQualityFlags).toStrictEqual(new Set());
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.ERROR);
      });
    });
    describe('regenerateGraphData', () => {
      test('soft fails to warning if graphData has no series', () => {
        expect(reducer(state, { type: 'regenerateGraphData', graphData: { series: [] } }))
          .toStrictEqual({
            ...state,
            status: TIME_SERIES_VIEWER_STATUS.WARNING,
            displayError: 'Current selection of dates/sites/positions/variables does not have any valid numeric data.',
          });
      });
      test('soft fails to warning if no yAxes have a non-null dataRange', () => {
        state.selection.yAxes.y1.dataRange = [null, null];
        state.selection.yAxes.y2.dataRange = [null, null];
        expect(reducer(state, { type: 'regenerateGraphData', graphData: { series: ['foo'] } }))
          .toStrictEqual({
            ...state,
            status: TIME_SERIES_VIEWER_STATUS.WARNING,
            displayError: 'Current selection of dates/sites/positions/variables does not have any valid numeric data.',
          });
      });
      test('applies graphData and sets status if ', () => {
        state.selection.yAxes.y1.dataRange = [0.1, 0.4];
        state.selection.yAxes.y2.dataRange = [null, null];
        expect(reducer(state, { type: 'regenerateGraphData', graphData: { series: ['foo'] } }))
          .toStrictEqual({
            ...state,
            graphData: { series: ['foo'] },
            status: TIME_SERIES_VIEWER_STATUS.READY,
          });
      });
    });

    // fetchSitePositions actions
    describe('fetchSitePositions', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        expect(
          reducer(state, { type: 'fetchSitePositions', siteCode: 'JERC' }),
        ).toStrictEqual(state);
      });
      test('sets positions fetch in motion', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const newState = reducer(
          state,
          { type: 'fetchSitePositions', siteCode: 'JERC' },
        );
        expect(newState.metaFetches).toStrictEqual({
          'fetchSitePositions.JERC': true,
        });
        expect(newState.product.sites.JERC.fetches.positions).toStrictEqual({
          status: FETCH_STATUS.FETCHING, error: null, url: null,
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_META);
      });
    });
    describe('fetchSitePositionsFailed', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        expect(
          reducer(state, { type: 'fetchSitePositionsFailed', siteCode: 'JERC', error: 'foo' }),
        ).toStrictEqual(state);
      });
      test('properly fails an existing variable fetch', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const newState = reducer(
          state,
          { type: 'fetchSitePositionsFailed', siteCode: 'JERC', error: 'foo' },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.positions).toStrictEqual({
          status: FETCH_STATUS.ERROR, error: 'foo', url: null,
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA);
      });
    });
    describe('fetchSitePositionsSucceeded', () => {
      test('does nothing if siteCode is not present in product', () => {
        state.product.sites = {
          HARV: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        expect(
          reducer(state, { type: 'fetchSitePositionsSucceeded', siteCode: 'JERC', csv: '' }),
        ).toStrictEqual(state);
      });
      test('properly handles completed positions fetch for only valid tables', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite) },
        };
        const csv = `HOR.VER,name
"000.010",CFGLOC102010
"000.020",CFGLOC102015
`;
        const newState = reducer(
          state,
          { type: 'fetchSitePositionsSucceeded', siteCode: 'JERC', csv },
        );
        expect(newState.metaFetches).toStrictEqual({});
        expect(newState.product.sites.JERC.fetches.positions).toStrictEqual({
          status: FETCH_STATUS.SUCCESS, error: null, url: null,
        });
        expect(newState.product.sites.JERC.positions).toStrictEqual({
          '000.010': {
            data: {},
            history: [{
              horVer: '000.010',
              sensorName: 'CFGLOC102010',
              sensorDescription: undefined,
              sensorStartDateTime: undefined,
              sensorEndDateTime: undefined,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              xOffset: null,
              yOffset: null,
              zOffset: null,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            }],
          },
          '000.020': {
            data: {},
            history: [{
              horVer: '000.020',
              sensorName: 'CFGLOC102015',
              sensorDescription: undefined,
              sensorStartDateTime: undefined,
              sensorEndDateTime: undefined,
              referenceLocationName: undefined,
              referenceLocationDescription: undefined,
              referenceLocationStartDateTime: undefined,
              referenceLocationEndDateTime: undefined,
              xOffset: null,
              yOffset: null,
              zOffset: null,
              pitch: null,
              roll: null,
              azimuth: null,
              referenceLocationLatitude: null,
              referenceLocationLongitude: null,
              referenceLocationElevation: null,
              eastOffset: null,
              northOffset: null,
              xAzimuth: null,
              yAzimuth: null,
            }],
          },
        });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA);
      });
    });

    // fetchDataFiles actions
    describe('fetchDataFiles', () => {
      test('sets data file fetches and general status while tracking the token', () => {
        state.product.sites = {
          BLUE: {
            positions: {
              A: {
                data: {
                  X: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.AWAITING_CALL } } } },
                  Y: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.AWAITING_CALL } } } },
                },
              },
            },
          },
        };
        const fetches = [
          {
            siteCode: 'BLUE', position: 'A', month: 'X', downloadPkg: 'basic', timeStep: '1min', table: 'TABLE_1min',
          },
          {
            siteCode: 'BLUE', position: 'A', month: 'Y', downloadPkg: 'basic', timeStep: '1min',table: 'TABLE_1min',
          },
        ];
        const newState = reducer(state, { type: 'fetchDataFiles', token: 'foo', fetches });
        expect(
          newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].status,
        ).toBe(FETCH_STATUS.FETCHING);
        expect(
          newState.product.sites.BLUE.positions.A.data.Y.basic['1min']['TABLE_1min'].status,
        ).toBe(FETCH_STATUS.FETCHING);
        expect(newState.dataFetches).toStrictEqual({ foo: true });
        expect(newState.dataFetchProgress).toBe(0);
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.LOADING_DATA);
      });
    });
    describe('fetchDataFilesProgress', () => {
      test('updates the progress', () => {
        const newState = reducer(state, { type: 'fetchDataFilesProgress', value: 50 });
        expect(newState.dataFetchProgress).toBe(50);
      });
    });
    describe('fetchDataFilesCompleted', () => {
      test('does nothing if action token is not present in dataFetches', () => {
        const modifiedState = { ...state, dataFetches: { foo: true } };
        expect(
          reducer(modifiedState, { type: 'fetchDataFilesCompleted', token: 'bar' }),
        ).toStrictEqual(modifiedState);
      });
      test('clears the data fetches token and applies default selections with warning', () => {
        state.dataFetches = { foo: true };
        state.product.sites = { S1: { ...cloneDeep(expectedInitialSite) } };
        const newState = reducer(state, { type: 'fetchDataFilesCompleted', token: 'foo' });
        expect(newState.dataFetches).toStrictEqual({});
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.WARNING);
        expect(newState.selection.sites).toStrictEqual([{ siteCode: 'S1', positions: [] }]);
      });
      test('ensure returns to ready when given a valid state', () => {
        state.dataFetches = { foo: true };
        state.product.continuousDateRange = ['2021-06'];
        state.product.sites = {
          ABBY: {
            ...cloneDeep(expectedInitialSite),
            ...{
              availableMonths: ['2021-06'],
              positions: {
                '000.010': {
                  data: {
                    '2021-06': {
                      basic: {
                        '30min': {
                          'TABLE_30min': {
                            url: '',
                            status: 'SUCCESS',
                            error: null,
                            series: {
                              startDateTime: {
                                data: [
                                  '2021-06-01T00:00:00Z',
                                ],
                                range: [
                                  null,
                                  null
                                ],
                                sum: 0,
                                count: 0,
                                variance: 0
                              },
                              endDateTime: {
                                data: [
                                  '2021-06-01T00:30:00Z',
                                ],
                                range: [
                                  null,
                                  null
                                ],
                                sum: 0,
                                count: 0,
                                variance: 0
                              },
                              windSpeedMean: {
                                data: [
                                  0.18,
                                ],
                                range: [
                                  0.03,
                                  0.38
                                ],
                                sum: 174.07999999999996,
                                count: 1440,
                                variance: 0.004028793209876535
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  history: [
                    {
                      horVer: '000.010',
                      sensorName: 'CFGLOC102010',
                      sensorDescription: 'Abby Road 2D Wind L1',
                      sensorStartDateTime: '2010-01-01T00:00:00Z',
                      sensorEndDateTime: '',
                      referenceLocationName: 'TOWER102005',
                      referenceLocationDescription: 'Abby Road Tower',
                      referenceLocationStartDateTime: '2010-01-01T00:00:00Z',
                      referenceLocationEndDateTime: '',
                      xOffset: 2.36,
                      yOffset: 6.25,
                      zOffset: 0.22,
                      pitch: 0.00,
                      roll: 0.00,
                      azimuth: 180.00,
                      referenceLocationLatitude: 45.762439,
                      referenceLocationLongitude: -122.330317,
                      referenceLocationElevation: 364.55,
                      eastOffset: -2.36,
                      northOffset: -6.25,
                      xAzimuth: 270.00,
                      yAzimuth: 180.00,
                    },
                  ],
                },
              },
            },
          },
        };
        state.variables = {
          startDateTime: {
            dataType: 'dateTime',
            description: 'Date and time at which a sampling is initiated',
            downloadPkg: 'basic',
            units: 'NA',
            tables: new Set(['TABLE_30min']),
            timeSteps: new Set(['30min']),
            sites: new Set(['ABBY']),
            isSelectable: false,
            canBeDefault: false,
            isDateTime: true
          },
          endDateTime: {
            dataType: 'dateTime',
            description: 'Date and time at which a sampling is completed',
            downloadPkg: 'basic',
            units: 'NA',
            tables: new Set(['TABLE_30min']),
            timeSteps: new Set(['30min']),
            sites: new Set(['ABBY']),
            isSelectable: false,
            canBeDefault: false,
            isDateTime: true
          },
          windSpeedMean: {
            dataType: 'real',
            description: 'Arithmetic mean of wind speed',
            downloadPkg: 'basic',
            units: 'metersPerSecond',
            tables: new Set(['TABLE_30min']),
            timeSteps: new Set(['30min']),
            sites: new Set(['ABBY']),
            isSelectable: true,
            canBeDefault: true,
            isDateTime: false
          },
        };
        state.selection = {
          dateRange: [
            '2021-06',
            '2021-06'
          ],
          continuousDateRange: [
            '2021-06'
          ],
          variables: [
            'windSpeedMean'
          ],
          dateTimeVariable: 'startDateTime',
          sites: [
            {
              siteCode: 'ABBY',
              positions: [
                '000.010'
              ]
            }
          ],
          timeStep: 'auto',
          autoTimeStep: '30min',
          qualityFlags: [],
          rollPeriod: 1,
          logscale: false,
          yAxes: {
            y1: {
              units: 'metersPerSecond',
              logscale: false,
              dataRange: [
                0.03,
                0.38
              ],
              precision: 3,
              standardDeviation: 0.063,
              rangeMode: 'CENTERED',
              axisRange: [
                -0.033,
                0.443
              ]
            },
            y2: {
              units: null,
              logscale: false,
              dataRange: [
                null,
                null
              ],
              precision: 0,
              standardDeviation: 0,
              rangeMode: 'CENTERED',
              axisRange: [
                0,
                0
              ]
            },
          },
          isDefault: true,
          digest: '{\"sites\":[{\"siteCode\":\"ABBY\",\"positions\":[\"000.010\"]}],\"dateRange\":[\"2021-06\",\"2021-06\"],\"variables\":[\"windSpeedMean\"]}',
        };
        const newState = reducer(state, { type: 'fetchDataFilesCompleted', token: 'foo' });
        expect(newState.dataFetches).toStrictEqual({});
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES);
        expect(newState.selection.sites.length).toStrictEqual(1);
      });
    });
    describe('noDataFilesFetchNecessary', () => {
      test('only sets general status to continue', () => {
        const newState = reducer(state, { type: 'noDataFilesFetchNecessary' });
        expect(newState.status).toBe(TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES);
      });
    });
    describe('fetchDataFileFailed', () => {
      test('applies error to the action path fetch record', () => {
        state.product.sites = {
          BLUE: {
            positions: {
              A: {
                data: {
                  X: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.FETCHING, error: null } } } },
                },
              },
            },
          },
        };
        const newState = reducer(state, {
          type: 'fetchDataFileFailed',
          siteCode: 'BLUE',
          position: 'A',
          month: 'X',
          downloadPkg: 'basic',
          timeStep: '1min',
          table: 'TABLE_1min',
          error: 'foo',
        });
        expect(
          newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].status,
        ).toBe(FETCH_STATUS.ERROR);
        expect(
          newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].error,
        ).toBe('foo');
      });
    });
    describe('fetchDataFileSucceeded', () => {
      test('applies series to the action path fetch record', () => {
        state.product.sites = {
          BLUE: {
            positions: {
              A: {
                data: {
                  X: { basic: { '1min': { 'TABLE_1min': { status: FETCH_STATUS.FETCHING, error: null } } } },
                },
              },
            },
          },
        };
        const newState = reducer(state, {
          type: 'fetchDataFileSucceeded',
          siteCode: 'BLUE',
          position: 'A',
          month: 'X',
          downloadPkg: 'basic',
          timeStep: '1min',
          series: [1, 2, 3],
          table: 'TABLE_1min',
        });
        expect(
          newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].status,
        ).toBe(FETCH_STATUS.SUCCESS);
        expect(
          newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].error,
        ).toBe(null);
        expect(
          newState.product.sites.BLUE.positions.A.data.X.basic['1min']['TABLE_1min'].series,
        ).toStrictEqual([1, 2, 3]);
      });
    });

    // selection actions
    describe('selectDateRange', () => {
      test('sets date range and active date range selection', () => {
        const newState = reducer(
          state,
          { type: 'selectDateRange', dateRange: ['2020-01', '2020-04'] },
        );
        expect(newState.selection.dateRange).toStrictEqual(['2020-01', '2020-04']);
        expect(newState.selection.activelySelectingDateRange).toStrictEqual(['2020-01', '2020-04']);
      });
    });
    describe('selectVariables', () => {
      beforeEach(() => {
        state.variables = {
          v1: { units: 'foo' },
          v2: { units: 'foo' },
          v3: { units: 'foo' },
          v4: { units: 'bar' },
          v5: { units: 'bar' },
        };
      });
      test('applies variables selection (1 selected unit / y axis)', () => {
        const newState = reducer(state, { type: 'selectVariables', variables: ['v1', 'v3'] });
        expect(newState.selection.variables).toStrictEqual(['v1', 'v3']);
        expect(newState.selection.yAxes.y1.units).toBe('foo');
        expect(newState.selection.yAxes.y2).toStrictEqual(DEFAULT_STATE.selection.yAxes.y2);
      });
      test('applies variables selection (2 selected units / y axes)', () => {
        const newState = reducer(state, { type: 'selectVariables', variables: ['v1', 'v4'] });
        expect(newState.selection.variables).toStrictEqual(['v1', 'v4']);
        expect(newState.selection.yAxes.y1.units).toBe('foo');
        expect(newState.selection.yAxes.y2.units).toBe('bar');
      });
      test('preserves logscale from y2 if going from 2 axes to 1 with y2 being kept as y1', () => {
        state.selection.variables = ['v1', 'v4', 'v5'];
        state.selection.yAxes.y1.units = 'foo';
        state.selection.yAxes.y1.logscale = false;
        state.selection.yAxes.y2.units = 'bar';
        state.selection.yAxes.y2.logscale = true;
        const newState = reducer(state, { type: 'selectVariables', variables: ['v4', 'v5'] });
        expect(newState.selection.variables).toStrictEqual(['v4', 'v5']);
        expect(newState.selection.yAxes.y1.units).toBe('bar');
        expect(newState.selection.yAxes.y1.logscale).toBe(true);
        expect(newState.selection.yAxes.y2).toStrictEqual(DEFAULT_STATE.selection.yAxes.y2);
      });
    });

    // select axis actions
    describe('selectYAxisRangeMode', () => {
      test('does nothing if either the axis or the mode are invalid', () => {
        state.selection.yAxes.y1 = { rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO };
        const newState = reducer(
          state,
          { type: 'selectYAxisRangeMode', axis: 'y1', mode: 'BAD' },
        );
        expect(newState).toStrictEqual(state);
      });
      test('sets the mode; and if mode is custom does nothing else', () => {
        const y1 = {
          rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO,
          axisRange: [0, 100],
          dataRange: [40, 80],
          precision: 1,
          standardDeviation: 5,
        };
        state.selection.yAxes.y1 = y1;
        const newState = reducer(
          state,
          { type: 'selectYAxisRangeMode', axis: 'y1', mode: Y_AXIS_RANGE_MODES.CUSTOM },
        );
        expect(newState.selection.yAxes.y1).toStrictEqual({
          ...y1, rangeMode: Y_AXIS_RANGE_MODES.CUSTOM,
        });
      });
      test('sets the mode; and if mode is not custom also generates the axis range', () => {
        const y1 = {
          rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO,
          axisRange: [0, 100],
          dataRange: [40, 80],
          precision: 1,
          standardDeviation: 5,
        };
        state.selection.yAxes.y1 = y1;
        const newState = reducer(
          state,
          { type: 'selectYAxisRangeMode', axis: 'y1', mode: Y_AXIS_RANGE_MODES.CENTERED },
        );
        expect(newState.selection.yAxes.y1).toStrictEqual({
          ...y1, axisRange: [35, 85], rangeMode: Y_AXIS_RANGE_MODES.CENTERED,
        });
      });
    });
    describe('selectYAxisCustomRange', () => {
      test('does nothing if action axis is not valid', () => {
        state.selection.yAxes.y1 = { rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO };
        const newState = reducer(
          state,
          { type: 'selectYAxisCustomRange', axis: 'y3', range: [0, 100] },
        );
        expect(newState).toStrictEqual(state);
      });
      test('does nothing if action range is not valid', () => {
        state.selection.yAxes.y1 = {
          rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO,
          axisRange: [0, 100],
          dataRange: [40, 80],
          precision: 1,
          standardDeviation: 5,
        };
        const newState = reducer(
          state,
          { type: 'selectYAxisCustomRange', axis: 'y1', range: [100, 10] },
        );
        expect(newState).toStrictEqual(state);
      });
      test('applies custom range if action axis and range are valid', () => {
        const y1 = {
          rangeMode: Y_AXIS_RANGE_MODES.CUSTOM,
          axisRange: [0, 100],
          dataRange: [40, 80],
          precision: 1,
          standardDeviation: 5,
        };
        state.selection.yAxes.y1 = y1;
        const newState = reducer(
          state,
          { type: 'selectYAxisCustomRange', axis: 'y1', range: [15, 90] },
        );
        expect(newState.selection.yAxes.y1).toStrictEqual({ ...y1, axisRange: [15, 90] });
      });
    });
    describe('selectLogScale', () => {
      test('sets the logscale boolean (coerced)', () => {
        state.selection.logscale = false;
        const newState1 = reducer(state, { type: 'selectLogScale', logscale: true });
        expect(newState1.selection.logscale).toBe(true);
        const newState2 = reducer(newState1, { type: 'selectLogScale', logscale: 0 });
        expect(newState2.selection.logscale).toBe(false);
      });
    });
    describe('selectSwapYAxes', () => {
      test('does nothing if y2 has no defined units', () => {
        state.selection.yAxes = {
          y1: { units: 'foo', rangeMode: Y_AXIS_RANGE_MODES.CUSTOM, axisRange: [0, 100] },
          y2: { units: null, rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO, axisRange: [0, 0] },
        };
        expect(reducer(state, { type: 'selectSwapYAxes' })).toStrictEqual(state);
      });
      test('swaps the axes if y2 has defined units', () => {
        state.selection.yAxes = {
          y1: { units: 'foo', rangeMode: Y_AXIS_RANGE_MODES.CUSTOM, axisRange: [0, 100] },
          y2: { units: 'bar', rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO, axisRange: [20, 80] },
        };
        const newState = reducer(state, { type: 'selectSwapYAxes' });
        expect(newState.selection.yAxes).toStrictEqual({
          y1: { units: 'bar', rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO, axisRange: [20, 80] },
          y2: { units: 'foo', rangeMode: Y_AXIS_RANGE_MODES.CUSTOM, axisRange: [0, 100] },
        });
      });
    });
    describe('setRollPeriod', () => {
      test('applies the roll period value', () => {
        const newState = reducer(state, { type: 'setRollPeriod', rollPeriod: 4 });
        expect(newState.selection.rollPeriod).toBe(4);
      });
    });

    // select quality flags actions
    describe('selectAllQualityFlags', () => {
      test('applies all available quality flags', () => {
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        const newState = reducer(state, { type: 'selectAllQualityFlags' });
        expect(newState.selection.qualityFlags).toStrictEqual(['v1QF', 'v2QF', 'v3QF']);
      });
    });
    describe('selectNoneQualityFlags', () => {
      test('empties the quality flags selection', () => {
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        state.selection.qualityFlags = ['v1QF', 'v2QF'];
        const newState = reducer(state, { type: 'selectNoneQualityFlags' });
        expect(newState.selection.qualityFlags).toStrictEqual([]);
      });
    });
    describe('selectToggleQualityFlag', () => {
      test('does nothing if action qualityFlag is not in availableQualityFlags', () => {
        state.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        const newState = reducer(
          state,
          { type: 'selectToggleQualityFlag', qualityFlag: 'v7QF', selected: true },
        );
        expect(newState).toStrictEqual(state);
      });
      test('does nothing if selecting an already-selected qualityFlag', () => {
        state.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        state.selection.qualityFlags = ['v1QF', 'v2QF'];
        const newState = reducer(
          state,
          { type: 'selectToggleQualityFlag', qualityFlag: 'v2QF', selected: true },
        );
        expect(newState).toStrictEqual(state);
      });
      test('does nothing if deselecting a not-selected qualityFlag', () => {
        state.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        state.selection.qualityFlags = ['v1QF', 'v2QF'];
        const newState = reducer(
          state,
          { type: 'selectToggleQualityFlag', qualityFlag: 'v3QF', selected: false },
        );
        expect(newState).toStrictEqual(state);
      });
      test('adds to selection if necessary', () => {
        state.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        state.selection.qualityFlags = ['v2QF'];
        const newState = reducer(
          state,
          { type: 'selectToggleQualityFlag', qualityFlag: 'v3QF', selected: true },
        );
        expect(newState.selection.qualityFlags).toStrictEqual(['v2QF', 'v3QF']);
      });
      test('removes from selection if necessary', () => {
        state.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
        state.availableQualityFlags = new Set(['v1QF', 'v2QF', 'v3QF']);
        state.selection.qualityFlags = ['v1QF', 'v2QF'];
        const newState = reducer(
          state,
          { type: 'selectToggleQualityFlag', qualityFlag: 'v1QF', selected: false },
        );
        expect(newState.selection.qualityFlags).toStrictEqual(['v2QF']);
      });
    });

    describe('selectTimeStep', () => {
      test('does nothing if action time step is not available', () => {
        state.timeStep.availableTimeSteps = new Set(['auto', '2min', '30min']);
        const newState = reducer(state, { type: 'selectTimeStep', timeStep: '15min' });
        expect(newState).toStrictEqual(state);
      });
      test('applies action time step if available', () => {
        state.timeStep.availableTimeSteps = new Set(['auto', '2min', '30min']);
        state.selection.timeStep = 'auto';
        const newState = reducer(state, { type: 'selectTimeStep', timeStep: '30min' });
        expect(newState.selection.timeStep).toBe('30min');
      });
    });

    // select site actions
    describe('selectAddSite', () => {
      test('does nothing if trying to add a site that is not in the product', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            availableMonths: ['2020-01', '2020-02'],
          },
        };
        const newState = reducer(state, { type: 'selectAddSite', siteCode: 'BLUE' });
        expect(newState).toStrictEqual(state);
      });
      test('does nothing if trying to add a site that is already selected', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            availableMonths: ['2020-01', '2020-02'],
          },
        };
        state.selection.sites = [{ siteCode: 'JERC', positions: [] }];
        const newState = reducer(state, { type: 'selectAddSite', siteCode: 'JERC' });
        expect(newState).toStrictEqual(state);
      });
      test('adds a valid unselected site to the selection', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            availableMonths: ['2020-01', '2020-02'],
            positions: {
              '000.030': { history: [] },
              '000.010': { history: [] },
            },
          },
        };
        const newState = reducer(state, { type: 'selectAddSite', siteCode: 'JERC' });
        expect(newState.selection.sites).toStrictEqual([
          { siteCode: 'JERC', positions: ['000.010'] },
        ]);
      });
    });
    describe('updateSelectedSites', () => {
      test('does nothing if action siteCodes is an empty set', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite) },
          BLUE: { ...cloneDeep(expectedInitialSite) },
        };
        state.selection.sites = [{ siteCode: 'JERC', positions: [] }];
        const newState = reducer(state, { type: 'updateSelectedSites', siteCodes: new Set() });
        expect(newState).toStrictEqual(state);
      });
      test('adds to and removes from selection as necessary, ignoring any invalid sites', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite), positions: { '000.030': { history: [] } } },
          BLUE: { ...cloneDeep(expectedInitialSite), positions: { '000.070': { history: [] } } },
          HARV: { ...cloneDeep(expectedInitialSite), positions: { '000.090': { history: [] } } },
          FLNT: { ...cloneDeep(expectedInitialSite), positions: { '010.010': { history: [] } } },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
          { siteCode: 'HARV', positions: ['000.090'] },
        ];
        const newState = reducer(
          state,
          { type: 'updateSelectedSites', siteCodes: new Set(['HARV', 'FLNT', 'ABBY']) },
        );
        expect(newState.selection.sites).toStrictEqual([
          { siteCode: 'HARV', positions: ['000.090'] },
          { siteCode: 'FLNT', positions: ['010.010'] },
        ]);
      });
    });
    describe('selectRemoveSite', () => {
      test('does nothing if there is only one selected set (can never have zero selected)', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite), positions: { '000.030': { history: [] } } },
          BLUE: { ...cloneDeep(expectedInitialSite), positions: { '000.070': { history: [] } } },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
        ];
        const newState = reducer(state, { type: 'selectRemoveSite', siteCode: 'JERC' });
        expect(newState).toStrictEqual(state);
      });
      test('does nothing action site is not currently selected', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite), positions: { '000.030': { history: [] } } },
          BLUE: { ...cloneDeep(expectedInitialSite), positions: { '000.070': { history: [] } } },
          HARV: { ...cloneDeep(expectedInitialSite), positions: { '000.090': { history: [] } } },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
          { siteCode: 'BLUE', positions: ['000.070'] },
        ];
        const newState = reducer(state, { type: 'selectRemoveSite', siteCode: 'HARV' });
        expect(newState).toStrictEqual(state);
      });
      test('removes only the action site if currently selected at least one will remain', () => {
        state.product.sites = {
          JERC: { ...cloneDeep(expectedInitialSite), positions: { '000.030': { history: [] } } },
          BLUE: { ...cloneDeep(expectedInitialSite), positions: { '000.070': { history: [] } } },
          HARV: { ...cloneDeep(expectedInitialSite), positions: { '000.090': { history: [] } } },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
          { siteCode: 'HARV', positions: ['000.090'] },
        ];
        const newState = reducer(state, { type: 'selectRemoveSite', siteCode: 'JERC' });
        expect(newState.selection.sites).toStrictEqual([
          { siteCode: 'HARV', positions: ['000.090'] },
        ]);
      });
    });
    describe('selectSitePositions', () => {
      test('does nothing if action siteCode does not map to a currently selected site', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.010': { history: [] },
              '000.030': { history: [] },
            },
          },
          BLUE: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.080': { history: [] },
              '000.090': { history: [] },
            },
          },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
        ];
        const newState = reducer(
          state,
          { type: 'selectSitePositions', siteCode: 'BLUE', positions: ['000.080'] },
        );
        expect(newState).toStrictEqual(state);
      });
      test('does nothing if no action positions are present (must have at least one)', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.010': { history: [] },
              '000.030': { history: [] },
            },
          },
          BLUE: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.080': { history: [] },
              '000.090': { history: [] },
            },
          },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
        ];
        const newState = reducer(
          state,
          { type: 'selectSitePositions', siteCode: 'JERC', positions: [] },
        );
        expect(newState).toStrictEqual(state);
      });
      test('does nothing if any action positions are not present on the site', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.010': { history: [] },
              '000.030': { history: [] },
            },
          },
          BLUE: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.080': { history: [] },
              '000.090': { history: [] },
            },
          },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
        ];
        const newState = reducer(
          state,
          { type: 'selectSitePositions', siteCode: 'JERC', positions: ['000.010', '000.080'] },
        );
        expect(newState).toStrictEqual(state);
      });
      test('applies positions to the already-selected site', () => {
        state.product.sites = {
          JERC: {
            ...cloneDeep(expectedInitialSite),
            positions: {
              '000.010': { history: [] },
              '000.030': { history: [] },
              '000.050': { history: [] },
            },
          },
        };
        state.selection.sites = [
          { siteCode: 'JERC', positions: ['000.030'] },
        ];
        const newState = reducer(
          state,
          { type: 'selectSitePositions', siteCode: 'JERC', positions: ['000.010', '000.050'] },
        );
        expect(newState.selection.sites).toStrictEqual([
          { siteCode: 'JERC', positions: ['000.010', '000.050'] },
        ]);
      });
    });
  });
});
