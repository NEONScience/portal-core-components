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
      expect(tickerToIso(2077453337000)).toBe('2035-10-31T14:22:17Z');
    });
    test('getNextMonth()', () => {
      expect(getNextMonth()).toBe(null);
      expect(getNextMonth('2000')).toBe(null);
      expect(getNextMonth('2010-04')).toBe('2010-05');
      expect(getNextMonth('2014-12')).toBe('2015-01');
      expect(getNextMonth('2038-01')).toBe('2038-02');
    });
  });

  /*
  describe('main worker function', () => {
  });
  */

  /*
  describe('input validation', () => {
    test('generates an empty object from no input', (done) => {
      parseTimeSeriesData().then((actualOutput) => {
        try {
          expect(actualOutput).toStrictEqual({});
          done();
        } catch (error) { done(error); }
      });
    });
    test('generates an empty object from input with empty csv', (done) => {
      const input = { csv: '' };
      parseTimeSeriesData(input).then((actualOutput) => {
        try {
          expect(actualOutput).toStrictEqual({});
          done();
        } catch (error) { done(error); }
      });
    });
    test('generates an empty object from input with missing variables object', (done) => {
      const input = { csv: 'foo' };
      parseTimeSeriesData(input).then((actualOutput) => {
        try {
          expect(actualOutput).toStrictEqual({});
          done();
        } catch (error) { done(error); }
      });
    });
    test('generates an empty object from input with invalid variables type', (done) => {
      const input = { csv: 'foo', variables: 'bar' };
      parseTimeSeriesData(input).then((actualOutput) => {
        try {
          expect(actualOutput).toStrictEqual({});
          done();
        } catch (error) { done(error); }
      });
    });
    test('generates an empty object from input with empty variables object', (done) => {
      const input = { csv: 'foo', variables: {} };
      parseTimeSeriesData(input).then((actualOutput) => {
        try {
          expect(actualOutput).toStrictEqual({});
          done();
        } catch (error) { done(error); }
      });
    });
  });

  const csv = `v1,v2,v3,v4,v5,v6
"2020-01-01T00:00:00Z",6.77,,22,"foo",
"2020-01-01T00:00:30Z",2.51,-54,,"bar","qux"
,5.276,32,0,78,0
"2020-01-01T00:01:30Z",,0,466,98,"foo"`;
  const variables = {
    v1: { dataType: 'dateTime' },
    v2: { dataType: 'real' },
    v3: { dataType: 'signed integer' },
    v4: { dataType: 'unsigned integer' },
    v5: { dataType: 'unknown data type' },
  };
  const expectedOutput = {
    v1: {
      data: ['2020-01-01T00:00:00Z', '2020-01-01T00:00:30Z', '', '2020-01-01T00:01:30Z'],
      range: [null, null],
      sum: 0,
      count: 0,
      variance: 0,
    },
    v2: {
      data: [6.77, 2.51, 5.276, null],
      range: [2.51, 6.77],
      sum: 14.556,
      count: 3,
      variance: 3.1144879999999997,
    },
    v3: {
      data: [null, -54, 32, 0],
      range: [ -54, 32],
      sum: -22,
      count: 3,
      variance: 1259.5555555555554,
    },
    v4: {
      data: [22, null, 0, 466],
      range: [0, 466],
      sum: 488,
      count: 3,
      variance: 46086.222222222226,
    },
    v5: {
      data: ['"foo"', '"bar"', '78', '98'],
      range: [null, null],
      sum: 0,
      count: 0,
      variance: 0,
    },
  };
  test('parses correctly', (done) => {
    parseTimeSeriesData({ csv, variables }).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual(expectedOutput);
        done();
      } catch (error) { done(error); }
    });
  });
  */
});
