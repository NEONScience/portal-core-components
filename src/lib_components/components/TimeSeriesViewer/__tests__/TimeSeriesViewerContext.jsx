import { renderHook } from "@testing-library/react-hooks";

import TimeSeriesViewerContext, {
  summarizeTimeSteps,
  getTestableItems,
} from '../TimeSeriesViewerContext';

const { useTimeSeriesViewerState } = TimeSeriesViewerContext;

const {
  DEFAULT_STATE,
  getTimeStep,
  getUpdatedValueRange,
  getContinuousDatesArray,
  TimeSeriesViewerPropTypes,
} = getTestableItems();

describe('TimeSeriesViewerContext', () => {
  describe('useTimeSeriesViewerState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useTimeSeriesViewerState());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('summarizeTimeSteps', () => {
    test('returns "none" for a single step', () => {
      expect(summarizeTimeSteps(1)).toBe('none');
    });
    test('defaults to 30 minute increments if not passes an explicit timestep', () => {
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

  /*
  describe('TimeSeriesViewerPropTypes', () => {
    
  });
  */
});
