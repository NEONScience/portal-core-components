import { formatBytes } from '../manifestUtil';

describe('Utils - manifestUtil', () => {
  describe.each([
    ['(int) 1', 1, '1.000 B'],
    ['(int) 234234', 234234, '229 KB'],
    ['(int) -6', -6, '0.000 B'],
    ['(int) 42949672960', 42949672960, '40.0 GB'],
    ['null', null, '0.000 B'],
    ['(float) 5.6', 5.6, '0.000 B'],
    ['(string) "1"', '1', '0.000 B'],
  ])('formatBytes', (inputLabel, inputValue, expected) => {
    test(`${inputLabel} resolves to ${expected}`, () => {
      expect(formatBytes(inputValue)).toBe(expected);
    });
  });
});
