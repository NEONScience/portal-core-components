import moment from 'moment';

import {
  calcRollupStatus,
  SVG_STYLES,
  TIME,
} from '../AvailabilityUtils';

describe('AvailabilityUtils', () => {
  describe('calcRollupStatus', () => {
    test('returns null for any invalid argument or array containing invalid status', () => {
      expect(calcRollupStatus()).toBe(null);
      expect(calcRollupStatus([])).toBe(null);
      expect(calcRollupStatus(true)).toBe(null);
      expect(calcRollupStatus(['BAD STATUS'])).toBe(null);
      expect(calcRollupStatus(['available', 'BAD STATUS'])).toBe(null);
    });
    test('reflects back status if defined and valid but not an array', () => {
      expect(calcRollupStatus('available')).toBe('available');
      expect(calcRollupStatus('mixed no availability')).toBe('mixed no availability');
    });
    test('returns only status if only one is supplied', () => {
      expect(calcRollupStatus(['available'])).toBe('available');
      expect(calcRollupStatus(['mixed some availability'])).toBe('mixed some availability');
    });
    test('returns appropriate mixed status for any combination of input statuses', () => {
      expect(calcRollupStatus(['available', 'delayed'])).toBe('mixed some availability');
      expect(calcRollupStatus(['not available', 'delayed'])).toBe('mixed no availability');
      expect(calcRollupStatus([
        'not collected', 'delayed', 'mixed no availability', 'available',
      ])).toBe('mixed some availability');
      expect(calcRollupStatus([
        'tentative', 'delayed', 'mixed some availability', 'expected',
      ])).toBe('mixed no availability');
    });
  });

  describe('TIME', () => {
    test('getYearMonthMoment', () => {
      const tests = ['2005-06', '1999-12', '2000-01'];
      tests.forEach((yearMonth) => {
        const result = TIME.getYearMonthMoment(yearMonth);
        expect(result).toBeInstanceOf(moment);
        expect(result.format('YYYY-MM')).toBe(yearMonth);
      });
    });
    test('getNextMonth', () => {
      const inputs = ['2005-06', '1999-12', '2000-01'];
      const outputs = ['2005-07', '2000-01', '2000-02'];
      inputs.forEach((yearMonth, idx) => {
        const result = TIME.getNextMonth(yearMonth);
        expect(result).toBe(outputs[idx]);
      });
    });
    test('getPreviousMonth', () => {
      const inputs = ['2005-06', '1999-12', '2000-01'];
      const outputs = ['2005-05', '1999-11', '1999-12'];
      inputs.forEach((yearMonth, idx) => {
        const result = TIME.getPreviousMonth(yearMonth);
        expect(result).toBe(outputs[idx]);
      });
    });
  });

  describe('SVG_STYLES.apply', () => {
    test('makes no d3 style calls if the className argument is not present in SVG_STYLES', () => {
      const mockNode = { style: jest.fn() };
      SVG_STYLES.apply(mockNode, 'invalidStyleName');
      expect(mockNode.style).not.toHaveBeenCalled();
      SVG_STYLES.apply(mockNode, null);
      expect(mockNode.style).not.toHaveBeenCalled();
    });
    test('correctly calls d3 API to apply SVG_STYLES classes as styles', () => {
      SVG_STYLES.styles.mockStyle = {
        foo: '54px',
        fooBarQux: 300,
        loremIpsum: '"foo","bar"',
      };
      const mockNode = { style: jest.fn() };
      SVG_STYLES.apply(mockNode, 'mockStyle');
      expect(mockNode.style).toHaveBeenCalledTimes(3);
      expect(mockNode.style).toHaveBeenNthCalledWith(1, 'foo', '54px');
      expect(mockNode.style).toHaveBeenNthCalledWith(2, 'foo-bar-qux', 300);
      expect(mockNode.style).toHaveBeenNthCalledWith(3, 'lorem-ipsum', '"foo","bar"');
    });
  });
});
