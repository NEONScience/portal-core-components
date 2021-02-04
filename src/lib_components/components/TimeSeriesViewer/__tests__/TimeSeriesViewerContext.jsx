import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

import cloneDeep from 'lodash/cloneDeep';

import { mockAjaxResponse } from '../../../../__mocks__/ajax';

import TimeSeriesViewerContext, {
  summarizeTimeSteps,
  getTestableItems,
  Y_AXIS_RANGE_MODES,
} from '../TimeSeriesViewerContext';

const { Provider, useTimeSeriesViewerState } = TimeSeriesViewerContext;

const {
  DEFAULT_STATE,
  FETCH_STATUS,
  applyDefaultsToSelection,
  generateYAxisRange,
  getTimeStep,
  getUpdatedValueRange,
  getContinuousDatesArray,
  parseProductData,
  parseSiteMonthData,
  parseSiteVariables,
  parseSitePositions,
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
            availableMonths: ['2001-01', '2001-02']
          },
        ],
      };
      setTimeout(() => {
        const tree = renderer
          .create(
            <Provider productData={productData}>
              <div>children</div>
            </Provider>
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
            </Provider>
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
      expect(summarizeTimeSteps(50, '1hr')).toBe('2.1 days');
    });
    test('does not pluralize if directed not to', () => {
      expect(summarizeTimeSteps(2, '5min', false)).toBe('10 minute');
      expect(summarizeTimeSteps(300, '1day', false)).toBe('10 month');
      expect(summarizeTimeSteps(50, '1hr', false)).toBe('2.1 day');
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
          ...expectedInitialSite,
          availableMonths: ['2001-01', '2001-02'],
        },
        BONA: {
          ...expectedInitialSite,
          availableMonths: ['2001-05', '2001-07'],
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
      ...expectedInitialSite,
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
      { // invalid data file (timestep '75min' is not valid)
        name: 'NEON.D16.ABBY.DP1.00001.001.000.030.002.2DWSD_75min.2001-01.expanded.20210105T140638Z.csv',
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
                    url: 'https://bar/qux',
                    status: FETCH_STATUS.AWAITING_CALL,
                    error: null,
                    series: {},
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
2DWSD_30min,rangeFailQM,"QM...",real,percent,expanded,"*.##(round)"
2DWSD_15min,calmWindQF,"QF...",signed integer,NA,expanded,"integer"
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
          timeSteps: new Set(['2min']),
          sites: new Set(['ABBY']),
          isSelectable: false,
          canBeDefault: false,
          isDateTime: true,
        },
        windSpeedMean: {
          dataType: 'real',
          description: 'Mean...',
          downloadPkg: 'basic',
          units: 'metersPerSecond',
          timeSteps: new Set(['2min']),
          sites: new Set(['ABBY']),
          isSelectable: true,
          canBeDefault: true,
          isDateTime: false,
        },
        rangeFailQM: {
          dataType: 'real',
          description: 'QM...',
          downloadPkg: 'expanded',
          units: 'percent',
          timeSteps: new Set(['30min']),
          sites: new Set(['ABBY']),
          isSelectable: true,
          canBeDefault: false,
          isDateTime: false,
        },
        calmWindQF: {
          dataType: 'signed integer',
          description: 'QF...',
          downloadPkg: 'expanded',
          units: 'NA',
          timeSteps: new Set(['15min']),
          sites: new Set(['ABBY']),
          isSelectable: false,
          canBeDefault: false,
          isDateTime: false,
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
      ...expectedInitialSite,
      positions: {
        '000.010': {
          history: [
            {
              'HOR.VER': '000.010',
              name: 'CFGLOC102010',
              description: 'Abby Road 2D Wind L1',
              start: '2001-01-01T00:00:00Z',
              end: '2009-01-01T00:00:00Z',
              xOffset: '2.36',
              yOffset: '6.25',
              zOffset: '0.22',
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
      ...expectedInitialSite,
      positions: {
        '000.010': {
          history: [
            {
              'HOR.VER': '000.010',
              name: 'CFGLOC102010',
              description: 'Abby Road 2D Wind L1',
              start: '2001-01-01T00:00:00Z',
              end: '2009-01-01T00:00:00Z',
              xOffset: '2.36',
              yOffset: '6.25',
              zOffset: '0.22',
            },
            {
              'HOR.VER': '000.010',
              name: 'CFGLOC102010',
              description: 'Abby Road 2D Wind L1',
              start: '2010-01-01T00:00:00Z',
              end: '2020-01-01T00:00:00Z',
              xOffset: '2.36',
              yOffset: '6.25',
              zOffset: '0.22',
            },
            {
              'HOR.VER': '000.010',
              name: 'CFGLOC102010',
              description: 'Abby Road 2D Wind L1',
              start: '2020-01-01T00:00:01Z',
              end: '',
              xOffset: '2.45',
              yOffset: '6.25',
              zOffset: '0.22',
            },
          ],
          data: {},
        },
        '000.030': {
          history: [
            {
              'HOR.VER': '000.030',
              name: 'CFGLOC102020',
              description: 'Abby Road 2D Wind L3',
              start: '2010-01-01T00:00:00Z',
              end: '',
              xOffset: '2.36',
              yOffset: '6.22',
              zOffset: '9.43',
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
        badProductDataShapes.forEach((badShape, idx) => {
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
          ...expectedInitialSite,
          availableMonths: ['2010-03', '2010-09'],
          positions: {
            '000.010': { data: {}, history: [] },
            '000.020': { data: {}, history: [] },
          },
        },
        S2: {
          ...expectedInitialSite,
          availableMonths: ['2012-04', '2012-10'],
          positions: {
            '000.040': { data: {}, history: [] },
            '000.050': { data: {}, history: [] },
          },
        },
        S3: {
          ...expectedInitialSite,
          availableMonths: ['2016-05', '2016-11'],
          positions: {},
        },
      };
      state.variables = {
        foo: {
          canBeDefault: false, isDateTime: false, downloadPkg: 'basic', units: 'foos',
        },
        endDate: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA',
        },
        zux: {
          canBeDefault: false, isDateTime: false, downloadPkg: 'expanded', units: 'zuxs',
        },
        bar: {
          canBeDefault: true, isDateTime: false, downloadPkg: 'basic', units: 'bars',
        },
        startDate: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA',
        },
        startDateTime: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA',
        },
        endDateTime: {
          canBeDefault: false, isDateTime: true, downloadPkg: 'basic', units: 'NA',
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
      };
      const newSelection = applyDefaultsToSelection(state);
      expect(newSelection.yAxes.y1.units).toBe('bars');
      expect(newSelection.yAxes.y1.precision).toBe(2);
      expect(newSelection.yAxes.y1.standardDeviation).toBe(5.76);
      expect(newSelection.yAxes.y1.dataRange).toStrictEqual([7, 23]);
      expect(newSelection.yAxes.y1.axisRange).toStrictEqual([1.24, 28.76]);
    });
  });

  /*
  describe('reducer()', () => {
  });
  */
});
