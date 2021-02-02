import {
  startsWithPolyfill,
  endsWithPolyfill,
} from '../polyfillUtil';

describe('polyfillUtil', () => {
  test('startsWithPolyfill', () => {
    expect(startsWithPolyfill('base string', 'base')).toBe(true);
    expect(startsWithPolyfill('base string', 'base', 0)).toBe(true);
    expect(startsWithPolyfill('base string', 'se', 2)).toBe(true);
    expect(startsWithPolyfill('base string', 'se')).toBe(false);
    expect(startsWithPolyfill('base string', 'base', 2)).toBe(false);
  });
  test('endsWithPolyfill', () => {
    expect(endsWithPolyfill('base string', 'string')).toBe(true);
    expect(endsWithPolyfill('base string', 'string', 11)).toBe(true);
    expect(endsWithPolyfill('base string', 'string', 21)).toBe(true);
    expect(endsWithPolyfill('base string', 'str', 8)).toBe(true);
    expect(endsWithPolyfill('base string', 'str')).toBe(false);
    expect(endsWithPolyfill('base string', 'string', 8)).toBe(false);
  });
});
