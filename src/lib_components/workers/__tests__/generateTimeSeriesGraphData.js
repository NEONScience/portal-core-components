import generateTimeSeriesGraphData, {
  getTimeSteps,
  getTestableItems,
} from '../generateTimeSeriesGraphData';

const {
  monthIsValidFormat,
  monthToNumbers,
  monthIsValid,
  monthToTicker,
  tickerIsValid,
  tickerToMonth,
  tickerToIso,
  getNextMonth,
} = getTestableItems();

describe('generateTimeSeriesGraphData worker', () => {
  describe('helper functions', () => {
    test('getTimeSteps()', () => {
      const TIME_STEPS = getTimeSteps();
      expect(typeof TIME_STEPS).toBe('object');
      Object.keys(TIME_STEPS).forEach((key) => {
        expect(typeof TIME_STEPS[key]).toBe('object');
        expect(TIME_STEPS[key].key).toBe(key);
        expect(typeof TIME_STEPS[key].tmi).toBe('string');
        expect(Number.isInteger(TIME_STEPS[key].seconds)).toBe(true);
        expect(TIME_STEPS[key].seconds > 0).toBe(true);
      });
    });
    test('monthIsValidFormat()', () => {
      expect(monthIsValidFormat()).toBe(false);
      expect(monthIsValidFormat(null)).toBe(false);
      expect(monthIsValidFormat(['2010', '01'])).toBe(false);
      expect(monthIsValidFormat(12)).toBe(false);
      expect(monthIsValidFormat('2012-2')).toBe(false);
      expect(monthIsValidFormat('12012-12')).toBe(false);
      expect(monthIsValidFormat('2012-122')).toBe(false);
      expect(monthIsValidFormat('2020-01')).toBe(true);
      expect(monthIsValidFormat('1234-56')).toBe(true);
    });
    test('monthToNumbers()', () => {
      expect(monthToNumbers()).toStrictEqual({ y: null, m: null });
      expect(monthToNumbers('2012-2')).toStrictEqual({ y: null, m: null });
      expect(monthToNumbers('0000-00')).toStrictEqual({ y: 0, m: 0 });
      expect(monthToNumbers('1234-56')).toStrictEqual({ y: 1234, m: 56 });
      expect(monthToNumbers('2020-04')).toStrictEqual({ y: 2020, m: 4 });
    });
    test('monthIsValid()', () => {
      expect(monthIsValid()).toBe(false);
      expect(monthIsValid('1234-56')).toBe(false);
      expect(monthIsValid('2020-00')).toBe(false);
      expect(monthIsValid('2010-13')).toBe(false);
      expect(monthIsValid('2009-09')).toBe(true);
      expect(monthIsValid('2018-12')).toBe(true);
    });
    test('monthToTicker()', () => {
      expect(monthToTicker()).toBe(0);
      expect(monthToTicker('2000')).toBe(0);
      expect(monthToTicker('2000-01')).toBe(946684800000);
      expect(monthToTicker('2015-04')).toBe(1427846400000);
      expect(monthToTicker('2035-10')).toBe(2074809600000);
    });
    test('tickerIsValid()', () => {
      expect(tickerIsValid()).toBe(false);
      expect(tickerIsValid(null)).toBe(false);
      expect(tickerIsValid('2020-01')).toBe(false);
      expect(tickerIsValid(NaN)).toBe(false);
      expect(tickerIsValid(0)).toBe(false);
      expect(tickerIsValid(946684800000)).toBe(true);
      expect(tickerIsValid(2074809600000)).toBe(true);
    });
    test('tickerToMonth()', () => {
      expect(tickerToMonth()).toBe(null);
      expect(tickerToMonth(0)).toBe(null);
      expect(tickerToMonth(946684800000)).toBe('2000-01');
      expect(tickerToMonth(946684801000)).toBe('2000-01');
      expect(tickerToMonth(1612807490406)).toBe('2021-02');
      expect(tickerToMonth(1427847578935)).toBe('2015-04');
    });
    test('tickerToIso()', () => {
      expect(tickerToIso()).toBe(null);
      expect(tickerToIso('2020-01')).toBe(null);
      expect(tickerToIso(946684800000)).toBe('2000-01-01T00:00:00Z');
      expect(tickerToIso(2077453337000, true)).toBe('2035-10-31T14:22:17Z');
      expect(tickerToIso(946684800000, false)).toBe('2000-01-01T00:00Z');
      expect(tickerToIso(2077453337000, false)).toBe('2035-10-31T14:22Z');
    });
    test('getNextMonth()', () => {
      expect(getNextMonth()).toBe(null);
      expect(getNextMonth('2000')).toBe(null);
      expect(getNextMonth('2010-04')).toBe('2010-05');
      expect(getNextMonth('2014-12')).toBe('2015-01');
      expect(getNextMonth('2038-01')).toBe('2038-02');
    });
  });

  describe('main worker function', () => {
    // Input Validation
    const outSanityCheckData = {
      data: [[0, 0]],
      qualityData: [[0, 0]],
      monthOffsets: {},
      timestampMap: {},
      series: [],
      labels: ['x'],
      qualityLabels: ['start', 'end'],
    };
    describe.each([
      [
        'requires a valid time step in the selection',
        {
          selection: {
            timeStep: 'bad',
          },
        },
      ],
      [
        'if timestep is auto then requires that auto timestep is valid',
        {
          selection: {
            autoTimeStep: 'bad',
            timeStep: 'auto',
          },
        },
      ],
      [
        'requires a valid date range',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2020-10', '2010-03'],
          },
        },
      ],
      [
        'requires a valid continuous date range with the same bounds as date range',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06', '2015-07'],
          },
        },
      ],
      [
        'requires qualityFlags where all entries are valid variables',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06'],
            qualityFlags: ['q1'],
          },
          variables: {
            q2: { units: 'foo', downloadPkg: 'basic' },
          },
        },
      ],
      [
        'requires a valid dateTime variable',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06'],
            qualityFlags: [],
            dateTimeVariable: 'v1',
          },
          variables: {
            v2: { units: 'foo', downloadPkg: 'basic' },
          },
        },
      ],
      [
        'requires at least one valid selected variable',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06'],
            qualityFlags: [],
            dateTimeVariable: 'v1',
            variables: ['v3'],
          },
          variables: {
            v1: { units: 'bar', downloadPkg: 'basic' },
            v2: { units: 'foo', downloadPkg: 'expanded' },
          },
        },
      ],
      [
        'requires at selected sites are present and all properly structured',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06'],
            qualityFlags: [],
            dateTimeVariable: 'v1',
            variables: ['v2'],
            sites: [
              { siteCode: 'BLUE', positions: ['050.070', '040.010'] },
              { siteCode: 'BLWA', positions: [] },
            ],
          },
          variables: {
            v1: { units: 'bar', downloadPkg: 'basic' },
            v2: { units: 'foo', downloadPkg: 'expanded' },
          },
        },
      ],
      [
        'requires a product be included with basic sites-based structure',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06'],
            qualityFlags: [],
            dateTimeVariable: 'v1',
            variables: ['v2'],
            sites: [
              { siteCode: 'BLUE', positions: ['050.070', '040.010'] },
            ],
          },
          variables: {
            v1: { units: 'bar', downloadPkg: 'basic' },
            v2: { units: 'foo', downloadPkg: 'expanded' },
          },
          product: {
            sites: null,
          },
        },
      ],
      [
        'requires includes product have nested data for all selected sites and positions (1)',
        {
          selection: {
            autoTimeStep: '1day',
            timeStep: 'auto',
            dateRange: ['2015-04', '2015-06'],
            continuousDateRange: ['2015-04', '2015-05', '2015-06'],
            qualityFlags: [],
            dateTimeVariable: 'v1',
            variables: ['v2'],
            sites: [
              { siteCode: 'BLWA', positions: ['050.070'] },
            ],
          },
          variables: {
            v1: { units: 'bar', downloadPkg: 'basic' },
            v2: { units: 'foo', downloadPkg: 'expanded' },
          },
          product: {
            sites: {
              BLUE: {
                positions: {
                  '050.070': { data: { '2015-04': true, '2015-05': true } },
                },
              },
            },
          },
        },
      ],
      //TODO: turn this into a verification that we get data back from this scenario
      // [
      //   'requires includes product have nested data for at least one selected site and position',
      //   {
      //     selection: {
      //       autoTimeStep: '1day',
      //       timeStep: 'auto',
      //       dateRange: ['2015-04', '2015-06'],
      //       continuousDateRange: ['2015-04', '2015-05', '2015-06'],
      //       qualityFlags: [],
      //       dateTimeVariable: 'v1',
      //       variables: ['v2'],
      //       sites: [
      //         { siteCode: 'BLUE', positions: ['050.070', '040.010'] },
      //       ],
      //     },
      //     variables: {
      //       v1: { units: 'bar', downloadPkg: 'basic' },
      //       v2: { units: 'foo', downloadPkg: 'expanded' },
      //     },
      //     product: {
      //       sites: {
      //         BLUE: {
      //           positions: {
      //             '050.070': { data: { '2015-04': true, '2015-05': true } },
      //             '040.010': { data: {} },
      //           },
      //         },
      //       },
      //     },
      //   },
      // ],
    ])('input validation', (rule, inData) => {
      test(rule, (done) => {
        generateTimeSeriesGraphData(inData).then((outData) => {
          try {
            expect(outData).toStrictEqual(outSanityCheckData);
            done();
          } catch (error) { done(error); }
        });
      });
    });

    // Main Worker Logic
    describe('main worker logic', () => {
      const inData = {
        selection: {
          autoTimeStep: '1day',
          timeStep: 'auto',
          dateRange: ['2015-02', '2015-03'],
          continuousDateRange: ['2015-02', '2015-03'],
          qualityFlags: ['q1'],
          dateTimeVariable: 'v1',
          variables: ['v2'],
          derivedVariableTable: { 'v2': 'default' },
          sites: [
            { siteCode: 'BLUE', positions: ['050.070', '040.010'] },
          ],
        },
        variables: {
          v1: { units: 'bar', downloadPkg: 'basic', tables: ['default'] },
          v2: { units: 'foo', downloadPkg: 'basic', tables: ['default'] },
          q1: { units: 'qux', downloadPkg: 'basic', tables: ['default'] },
        },
        product: {
          sites: {
            BLUE: {
              positions: {
                '050.070': {
                  data: {
                    '2015-02': {
                      basic: {
                        '1day': {
                          'default': {
                            // variable series is equal in length to generated time series
                            series: {
                              v1: {
                                data: [
                                  '2015-02-01T00:00:00Z', '2015-02-02T00:00:00Z',
                                  '2015-02-03T00:00:00Z', '2015-02-04T00:00:00Z',
                                  '2015-02-05T00:00:00Z', '2015-02-06T00:00:00Z',
                                  '2015-02-07T00:00:00Z', '2015-02-08T00:00:00Z',
                                  '2015-02-09T00:00:00Z', '2015-02-10T00:00:00Z',
                                  '2015-02-11T00:00:00Z', '2015-02-12T00:00:00Z',
                                  '2015-02-13T00:00:00Z', '2015-02-14T00:00:00Z',
                                  '2015-02-15T00:00:00Z', '2015-02-16T00:00:00Z',
                                  '2015-02-17T00:00:00Z', '2015-02-18T00:00:00Z',
                                  '2015-02-19T00:00:00Z', '2015-02-20T00:00:00Z',
                                  '2015-02-21T00:00:00Z', '2015-02-22T00:00:00Z',
                                  '2015-02-23T00:00:00Z', '2015-02-24T00:00:00Z',
                                  '2015-02-25T00:00:00Z', '2015-02-26T00:00:00Z',
                                  '2015-02-27T00:00:00Z', '2015-02-28T00:00:00Z',
                                ],
                              },
                              v2: {
                                data: [
                                  0, 1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53,
                                  59, 61, 67, 71, 73, 79, 83, 89, 97, 101,
                                ],
                              },
                              q1: {
                                data: [
                                  0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1,
                                  0, 0, 0, 0, 0, 1, 1, 1,
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                    '2015-03': {
                      basic: {
                        '1day': {
                          'default': {
                            // Missing data altogether
                            series: {
                              v1: {
                                data: [
                                  '2015-03-01T00:00:00Z', '2015-03-02T00:00:00Z',
                                  '2015-03-03T00:00:00Z', '2015-03-04T00:00:00Z',
                                  '2015-03-05T00:00:00Z', '2015-03-06T00:00:00Z',
                                  '2015-03-07T00:00:00Z', '2015-03-08T00:00:00Z',
                                  '2015-03-09T00:00:00Z', '2015-03-10T00:00:00Z',
                                  '2015-03-11T00:00:00Z', '2015-03-12T00:00:00Z',
                                  '2015-03-13T00:00:00Z', '2015-03-14T00:00:00Z',
                                  '2015-03-15T00:00:00Z', '2015-03-16T00:00:00Z',
                                  '2015-03-17T00:00:00Z', '2015-03-18T00:00:00Z',
                                  '2015-03-19T00:00:00Z', '2015-03-20T00:00:00Z',
                                  '2015-03-21T00:00:00Z', '2015-03-22T00:00:00Z',
                                  '2015-03-23T00:00:00Z', '2015-03-24T00:00:00Z',
                                  '2015-03-25T00:00:00Z', '2015-03-26T00:00:00Z',
                                  '2015-03-27T00:00:00Z', '2015-03-28T00:00:00Z',
                                  '2015-03-29T00:00:00Z', '2015-03-30T00:00:00Z',
                                  '2015-03-31T00:00:00Z',
                                ],
                              },
                              /*
                              v2: {
                                data: [
                                  283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367,
                                  373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443,
                                  449, 457, 461, 463, 467,
                                ],
                              },
                              */
                            },
                          },
                        },
                      },
                    },
                  },
                },
                '040.010': {
                  data: {
                    '2015-02': {
                      basic: {
                        '1day': {
                          'default': {
                            // variable series is longer than generated time series
                            series: {
                              v1: {
                                data: [
                                  '2015-02-01T00:00:00Z', '2015-02-02T00:00:00Z',
                                  '2015-02-03T00:00:00Z', '2015-02-04T00:00:00Z',
                                  '2015-02-05T00:00:00Z', '2015-02-06T00:00:00Z',
                                  '2015-02-07T00:00:00Z', '2015-02-08T00:00:00Z',
                                  '2015-02-09T00:00:00Z', '2015-02-10T00:00:00Z',
                                  '2015-02-10T04:00:00Z', '2015-02-10T08:00:00Z',
                                  '2015-02-11T00:00:00Z', '2015-02-12T00:00:00Z',
                                  '2015-02-13T00:00:00Z', '2015-02-14T00:00:00Z',
                                  '2015-02-15T00:00:00Z', '2015-02-16T00:00:00Z',
                                  '2015-02-17T00:00:00Z', '2015-02-18T00:00:00Z',
                                  '2015-02-19T00:00:00Z', '2015-02-20T00:00:00Z',
                                  '2015-02-21T00:00:00Z', '2015-02-22T00:00:00Z',
                                  '2015-02-23T00:00:00Z', '2015-02-24T00:00:00Z',
                                  '2015-02-25T00:00:00Z', '2015-02-26T00:00:00Z',
                                  '2015-02-27T00:00:00Z', '2015-02-28T00:00:00Z',
                                ],
                              },
                              v2: {
                                data: [
                                  283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367,
                                  373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443,
                                  449, 457, 461, 463,
                                ],
                              },
                              q1: {
                                data: [
                                  0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1,
                                  0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                    '2015-03': {
                      basic: {
                        '1day': {
                          'default': {
                            // variable series is shorter than generated time series
                            series: {
                              v1: {
                                data: [
                                  '2015-03-01T00:00:00Z', '2015-03-02T00:00:00Z',
                                  '2015-03-03T00:00:00Z', '2015-03-04T00:00:00Z',
                                  '2015-03-07T00:00:00Z', '2015-03-08T00:00:00Z',
                                  '2015-03-09T00:00:00Z', '2015-03-10T00:00:00Z',
                                  '2015-03-11T00:00:00Z', '2015-03-12T00:00:00Z',
                                  '2015-03-13T00:00:00Z', '2015-03-14T00:00:00Z',
                                  '2015-03-15T00:00:00Z', '2015-03-16T00:00:00Z',
                                  '2015-03-17T00:00:00Z', '2015-03-18T00:00:00Z',
                                  '2015-03-19T00:00:00Z', '2015-03-20T00:00:00Z',
                                  '2015-03-21T00:00:00Z', '2015-03-22T00:00:00Z',
                                  '2015-03-23T00:00:00Z', '2015-03-24T00:00:00Z',
                                  '2015-03-25T00:00:00Z', '2015-03-26T00:00:00Z',
                                  '2015-03-27T00:00:00Z', '2015-03-28T00:00:00Z',
                                  '2015-03-29T00:00:00Z', '2015-03-30T00:00:00Z',
                                  '2015-03-31T00:00:00Z',
                                ],
                              },
                              v2: {
                                data: [
                                  0, 1, 2, 3, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53,
                                  59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109,
                                ],
                              },
                              q1: {
                                data: [
                                  0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1,
                                  0, 0, 0, 0, 0, 1, 1, 1, null,
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const isoToDate = (iso) => {
        const p = iso.split(/\D+/);
        return new Date(Date.UTC(p[0], p[1] - 1, p[2], p[3], p[4], p[5], p[6]));
      };
      const expectedOutData = {
        data: [
          [isoToDate('2015-02-01T00:00:00Z'), 0, 283],
          [isoToDate('2015-02-02T00:00:00Z'), 1, 293],
          [isoToDate('2015-02-03T00:00:00Z'), 2, 307],
          [isoToDate('2015-02-04T00:00:00Z'), 3, 311],
          [isoToDate('2015-02-05T00:00:00Z'), 5, 313],
          [isoToDate('2015-02-06T00:00:00Z'), 7, 317],
          [isoToDate('2015-02-07T00:00:00Z'), 11, 331],
          [isoToDate('2015-02-08T00:00:00Z'), 13, 337],
          [isoToDate('2015-02-09T00:00:00Z'), 17, 347],
          [isoToDate('2015-02-10T00:00:00Z'), 19, 349],
          [isoToDate('2015-02-11T00:00:00Z'), 23, 367],
          [isoToDate('2015-02-12T00:00:00Z'), 29, 373],
          [isoToDate('2015-02-13T00:00:00Z'), 31, 379],
          [isoToDate('2015-02-14T00:00:00Z'), 37, 383],
          [isoToDate('2015-02-15T00:00:00Z'), 41, 389],
          [isoToDate('2015-02-16T00:00:00Z'), 43, 397],
          [isoToDate('2015-02-17T00:00:00Z'), 47, 401],
          [isoToDate('2015-02-18T00:00:00Z'), 53, 409],
          [isoToDate('2015-02-19T00:00:00Z'), 59, 419],
          [isoToDate('2015-02-20T00:00:00Z'), 61, 421],
          [isoToDate('2015-02-21T00:00:00Z'), 67, 431],
          [isoToDate('2015-02-22T00:00:00Z'), 71, 433],
          [isoToDate('2015-02-23T00:00:00Z'), 73, 439],
          [isoToDate('2015-02-24T00:00:00Z'), 79, 443],
          [isoToDate('2015-02-25T00:00:00Z'), 83, 449],
          [isoToDate('2015-02-26T00:00:00Z'), 89, 457],
          [isoToDate('2015-02-27T00:00:00Z'), 97, 461],
          [isoToDate('2015-02-28T00:00:00Z'), 101, 463],
          [isoToDate('2015-03-01T00:00:00Z'), null, 0],
          [isoToDate('2015-03-02T00:00:00Z'), null, 1],
          [isoToDate('2015-03-03T00:00:00Z'), null, 2],
          [isoToDate('2015-03-04T00:00:00Z'), null, 3],
          [isoToDate('2015-03-05T00:00:00Z'), null, null],
          [isoToDate('2015-03-06T00:00:00Z'), null, null],
          [isoToDate('2015-03-07T00:00:00Z'), null, 11],
          [isoToDate('2015-03-08T00:00:00Z'), null, 13],
          [isoToDate('2015-03-09T00:00:00Z'), null, 17],
          [isoToDate('2015-03-10T00:00:00Z'), null, 19],
          [isoToDate('2015-03-11T00:00:00Z'), null, 23],
          [isoToDate('2015-03-12T00:00:00Z'), null, 29],
          [isoToDate('2015-03-13T00:00:00Z'), null, 31],
          [isoToDate('2015-03-14T00:00:00Z'), null, 37],
          [isoToDate('2015-03-15T00:00:00Z'), null, 41],
          [isoToDate('2015-03-16T00:00:00Z'), null, 43],
          [isoToDate('2015-03-17T00:00:00Z'), null, 47],
          [isoToDate('2015-03-18T00:00:00Z'), null, 53],
          [isoToDate('2015-03-19T00:00:00Z'), null, 59],
          [isoToDate('2015-03-20T00:00:00Z'), null, 61],
          [isoToDate('2015-03-21T00:00:00Z'), null, 67],
          [isoToDate('2015-03-22T00:00:00Z'), null, 71],
          [isoToDate('2015-03-23T00:00:00Z'), null, 73],
          [isoToDate('2015-03-24T00:00:00Z'), null, 79],
          [isoToDate('2015-03-25T00:00:00Z'), null, 83],
          [isoToDate('2015-03-26T00:00:00Z'), null, 89],
          [isoToDate('2015-03-27T00:00:00Z'), null, 97],
          [isoToDate('2015-03-28T00:00:00Z'), null, 101],
          [isoToDate('2015-03-29T00:00:00Z'), null, 103],
          [isoToDate('2015-03-30T00:00:00Z'), null, 107],
          [isoToDate('2015-03-31T00:00:00Z'), null, 109],
        ],
        qualityData: [
          [isoToDate('2015-02-01T00:00:00Z'), isoToDate('2015-02-02T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-02T00:00:00Z'), isoToDate('2015-02-03T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-03T00:00:00Z'), isoToDate('2015-02-04T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-04T00:00:00Z'), isoToDate('2015-02-05T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-05T00:00:00Z'), isoToDate('2015-02-06T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-06T00:00:00Z'), isoToDate('2015-02-07T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-07T00:00:00Z'), isoToDate('2015-02-08T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-08T00:00:00Z'), isoToDate('2015-02-09T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-09T00:00:00Z'), isoToDate('2015-02-10T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-10T00:00:00Z'), isoToDate('2015-02-11T00:00:00Z'), [1], [0]],
          [isoToDate('2015-02-11T00:00:00Z'), isoToDate('2015-02-12T00:00:00Z'), [1], [0]],
          [isoToDate('2015-02-12T00:00:00Z'), isoToDate('2015-02-13T00:00:00Z'), [1], [0]],
          [isoToDate('2015-02-13T00:00:00Z'), isoToDate('2015-02-14T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-14T00:00:00Z'), isoToDate('2015-02-15T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-15T00:00:00Z'), isoToDate('2015-02-16T00:00:00Z'), [0], [1]],
          [isoToDate('2015-02-16T00:00:00Z'), isoToDate('2015-02-17T00:00:00Z'), [0], [1]],
          [isoToDate('2015-02-17T00:00:00Z'), isoToDate('2015-02-18T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-18T00:00:00Z'), isoToDate('2015-02-19T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-19T00:00:00Z'), isoToDate('2015-02-20T00:00:00Z'), [1], [0]],
          [isoToDate('2015-02-20T00:00:00Z'), isoToDate('2015-02-21T00:00:00Z'), [1], [0]],
          [isoToDate('2015-02-21T00:00:00Z'), isoToDate('2015-02-22T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-22T00:00:00Z'), isoToDate('2015-02-23T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-23T00:00:00Z'), isoToDate('2015-02-24T00:00:00Z'), [0], [0]],
          [isoToDate('2015-02-24T00:00:00Z'), isoToDate('2015-02-25T00:00:00Z'), [0], [1]],
          [isoToDate('2015-02-25T00:00:00Z'), isoToDate('2015-02-26T00:00:00Z'), [0], [1]],
          [isoToDate('2015-02-26T00:00:00Z'), isoToDate('2015-02-27T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-27T00:00:00Z'), isoToDate('2015-02-28T00:00:00Z'), [1], [1]],
          [isoToDate('2015-02-28T00:00:00Z'), isoToDate('2015-03-01T00:00:00Z'), [1], [1]],
          [isoToDate('2015-03-01T00:00:00Z'), isoToDate('2015-03-02T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-02T00:00:00Z'), isoToDate('2015-03-03T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-03T00:00:00Z'), isoToDate('2015-03-04T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-04T00:00:00Z'), isoToDate('2015-03-05T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-05T00:00:00Z'), isoToDate('2015-03-06T00:00:00Z'), [null], [null]],
          [isoToDate('2015-03-06T00:00:00Z'), isoToDate('2015-03-07T00:00:00Z'), [null], [null]],
          [isoToDate('2015-03-07T00:00:00Z'), isoToDate('2015-03-08T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-08T00:00:00Z'), isoToDate('2015-03-09T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-09T00:00:00Z'), isoToDate('2015-03-10T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-10T00:00:00Z'), isoToDate('2015-03-11T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-11T00:00:00Z'), isoToDate('2015-03-12T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-12T00:00:00Z'), isoToDate('2015-03-13T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-13T00:00:00Z'), isoToDate('2015-03-14T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-14T00:00:00Z'), isoToDate('2015-03-15T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-15T00:00:00Z'), isoToDate('2015-03-16T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-16T00:00:00Z'), isoToDate('2015-03-17T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-17T00:00:00Z'), isoToDate('2015-03-18T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-18T00:00:00Z'), isoToDate('2015-03-19T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-19T00:00:00Z'), isoToDate('2015-03-20T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-20T00:00:00Z'), isoToDate('2015-03-21T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-21T00:00:00Z'), isoToDate('2015-03-22T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-22T00:00:00Z'), isoToDate('2015-03-23T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-23T00:00:00Z'), isoToDate('2015-03-24T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-24T00:00:00Z'), isoToDate('2015-03-25T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-25T00:00:00Z'), isoToDate('2015-03-26T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-26T00:00:00Z'), isoToDate('2015-03-27T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-27T00:00:00Z'), isoToDate('2015-03-28T00:00:00Z'), [null], [0]],
          [isoToDate('2015-03-28T00:00:00Z'), isoToDate('2015-03-29T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-29T00:00:00Z'), isoToDate('2015-03-30T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-30T00:00:00Z'), isoToDate('2015-03-31T00:00:00Z'), [null], [1]],
          [isoToDate('2015-03-31T00:00:00Z'), isoToDate('2015-04-01T00:00:00Z'), [null], [null]],
        ],
        monthOffsets: { '2015-02': 0, '2015-03': 28 },
        timestampMap: {
          1422748800000: 0,
          1422835200000: 1,
          1422921600000: 2,
          1423008000000: 3,
          1423094400000: 4,
          1423180800000: 5,
          1423267200000: 6,
          1423353600000: 7,
          1423440000000: 8,
          1423526400000: 9,
          1423612800000: 10,
          1423699200000: 11,
          1423785600000: 12,
          1423872000000: 13,
          1423958400000: 14,
          1424044800000: 15,
          1424131200000: 16,
          1424217600000: 17,
          1424304000000: 18,
          1424390400000: 19,
          1424476800000: 20,
          1424563200000: 21,
          1424649600000: 22,
          1424736000000: 23,
          1424822400000: 24,
          1424908800000: 25,
          1424995200000: 26,
          1425081600000: 27,
          1425168000000: 28,
          1425254400000: 29,
          1425340800000: 30,
          1425427200000: 31,
          1425513600000: 32,
          1425600000000: 33,
          1425686400000: 34,
          1425772800000: 35,
          1425859200000: 36,
          1425945600000: 37,
          1426032000000: 38,
          1426118400000: 39,
          1426204800000: 40,
          1426291200000: 41,
          1426377600000: 42,
          1426464000000: 43,
          1426550400000: 44,
          1426636800000: 45,
          1426723200000: 46,
          1426809600000: 47,
          1426896000000: 48,
          1426982400000: 49,
          1427068800000: 50,
          1427155200000: 51,
          1427241600000: 52,
          1427328000000: 53,
          1427414400000: 54,
          1427500800000: 55,
          1427587200000: 56,
          1427673600000: 57,
          1427760000000: 58,
        },
        series: [
          {
            label: 'BLUE - 050.070 - v2',
            position: '050.070',
            siteCode: 'BLUE',
            units: 'foo',
            variable: 'v2',
          },
          {
            label: 'BLUE - 040.010 - v2',
            position: '040.010',
            siteCode: 'BLUE',
            units: 'foo',
            variable: 'v2',
          },
        ],
        labels: ['x', 'BLUE - 050.070 - v2', 'BLUE - 040.010 - v2'],
        qualityLabels: ['start', 'end', 'BLUE - 050.070', 'BLUE - 040.010'],
      };
      test('generates expected graphData', (done) => {
        generateTimeSeriesGraphData(inData).then((outData) => {
          try {
            expect(outData).toStrictEqual(expectedOutData);
            done();
          } catch (error) { done(error); }
        });
      });
    });
  });
});
