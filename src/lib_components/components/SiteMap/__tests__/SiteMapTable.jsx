import { getTestableItems } from '../SiteMapTable';

import { MIN_TABLE_MAX_BODY_HEIGHT } from '../SiteMapUtils';

const {
  ucWord,
  parseSearchTerms,
  searchOnAttribs,
  getFeatureName,
  calculateMaxBodyHeight,
} = getTestableItems();

describe('SiteMap - SiteMapTable', () => {
  describe('ucWord()', () => {
    test('capitalizes as expected', () => {
      const cases = [
        ['FOO', 'Foo'],
        ['bar', 'Bar'],
        ['Qux', 'Qux'],
      ];
      cases.forEach((c) => {
        expect(ucWord(c[0])).toBe(c[1]);
      });
    });
  });

  describe('parseSearchTerms()', () => {
    test('breaks up search strings into terms as expected', () => {
      const cases = [
        ['"foo Bar" baz', ['foo bar', 'baz']],
        ['lo-19 "IpsuM do"LOR', ['lo19', 'ipsum', 'lor']],
        ['sit "Amet', ['sit', 'amet']],
      ];
      cases.forEach((c) => {
        expect(parseSearchTerms(c[0])).toStrictEqual(c[1]);
      });
    });
  });

  describe('searchOnAttribs()', () => {
    test('applies search as expected', () => {
      const cases = [
        ['foo', ['bar Foo qux', 'qux'], true],
        ['foo', ['bar f oo qux', 'qux'], false],
        ['', ['bar Foo qux', 'qux'], true],
        ['qux', [null], false],
      ];
      cases.forEach((c) => {
        expect(searchOnAttribs(c[0], c[1])).toBe(c[2]);
      });
    });
  });

  describe('getFeatureName()', () => {
    test('reflects back feature key if not valid', () => {
      expect(getFeatureName('notValid')).toBe('notValid');
    });
    test('returns singular name if defined', () => {
      expect(getFeatureName('STATES')).toBe('US State');
    });
    test('returns name if singular name is not defined', () => {
      expect(getFeatureName('AQUATIC_WATERSHEDS')).toBe('Watersheds');
    });
  });

  describe('calculateMaxBodyHeight()', () => {
    test('returns mininum for an invalid tableRef', () => {
      expect(calculateMaxBodyHeight()).toBe(MIN_TABLE_MAX_BODY_HEIGHT);
      expect(calculateMaxBodyHeight({ current: null })).toBe(MIN_TABLE_MAX_BODY_HEIGHT);
    });
    test('calculates value correctly based on children', () => {
      const tableRef = {
        current: {
          clientHeight: 400,
          children: [
            {
              children: [
                { clientHeight: 80 }, // toolbar
                { clientHeight: 30 },
                { clientHeight: 50 }, // pager
              ],
            },
          ],
        },
      };
      expect(calculateMaxBodyHeight(tableRef)).toBe(270);
    });
  });
});
