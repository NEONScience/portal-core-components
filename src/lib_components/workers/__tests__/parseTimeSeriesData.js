import parseTimeSeriesData from '../parseTimeSeriesData';

describe('parseTimeSeriesData worker', () => {
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
});
