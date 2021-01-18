import {
  exists,
  isStringNonEmpty,
  isNum,
  existsNonEmpty,
} from '../typeUtil';

describe('typeUtil', () => {
  test('exists', () => {
    expect(exists()).toBe(false);
    expect(exists(null)).toBe(false);
    expect(exists(NaN)).toBe(true);
    expect(exists(false)).toBe(true);
    expect(exists('undefined')).toBe(true);
  });
  test('isStringNonEmpty', () => {
    expect(isStringNonEmpty()).toBe(false);
    expect(isStringNonEmpty('')).toBe(false);
    expect(isStringNonEmpty('     ')).toBe(false);
    expect(isStringNonEmpty(' false ')).toBe(true);
    expect(isStringNonEmpty('.')).toBe(true);
  });
  test('isNum', () => {
    expect(isNum()).toBe(false);
    expect(isNum(0)).toBe(true);
    expect(isNum(9.8)).toBe(true);
    expect(isNum(Math.PI)).toBe(true);
    expect(isNum(NaN)).toBe(false);
  });
  test('existsNonEmpty', () => {
    expect(existsNonEmpty()).toBe(false);
    expect(existsNonEmpty('')).toBe(false);
    expect(existsNonEmpty([])).toBe(false);
    expect(existsNonEmpty('foo')).toBe(true);
    expect(existsNonEmpty([4])).toBe(true);
  });
});
