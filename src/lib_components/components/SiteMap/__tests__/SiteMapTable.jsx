import { getTestableItems } from '../SiteMapTable';

import { MIN_TABLE_MAX_BODY_HEIGHT } from '../SiteMapUtils';

const {
  ucWord,
  parseSearchTerms,
  searchOnAttribs,
  getFeatureName,
  calculateMaxBodyHeight,
  exportCsv,
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

  describe('exportCsv()', () => {
    let createElementMock = null;
    const setAttributeMock = jest.fn();
    const clickMock = jest.fn();
    beforeAll(() => {
      createElementMock = jest.spyOn(document, 'createElement').mockReturnValue({
        href: null,
        setAttribute: setAttributeMock,
        click: clickMock,
      });
      Object.defineProperty(window.document, 'body', {
        writeable: false,
        value: { appendChild: jest.fn(), removeChild: jest.fn() },
      });
    });
    afterEach(() => { jest.clearAllMocks(); });
    afterAll(() => { jest.resetAllMocks(); });
    test('does nothing if either columns or rows are empty', () => {
      exportCsv();
      expect(createElementMock).not.toHaveBeenCalled();
      exportCsv([{ name: 'foo' }], []);
      expect(createElementMock).not.toHaveBeenCalled();
      exportCsv([], [{ name: 'foo' }]);
      expect(createElementMock).not.toHaveBeenCalled();
    });
    test('generates a csv with appropriate column spreading', () => {
      const columns = [
        {
          field: 'siteCode',
          csvFields: ['siteCode', 'siteName'],
          csvRender: (row) => [row.siteCode, row.siteName || null],
        },
        {
          field: 'domainCode',
        },
        {
          field: 'elevation',
          csvFields: ['elevation (m)'],
          csvRender: (row) => (
            Number.isFinite(row.elevation) ? row.elevation.toFixed(2) : null
          ),
        },
      ];
      const rows = [
        // eslint-disable-next-line object-curly-newline
        { siteCode: 'ABBY', siteName: 'Abbey, Road', domainCode: 'D16', elevation: 123.4567 },
        { siteCode: 'BARR', domainCode: 'D12', elevation: 'n/a' },
        { siteName: 'Some "site"', domainCode: null, elevation: 45.678 },
      ];
      const expectedHref = 'data:text/csv;charset=utf-8,siteCode,siteName,domainCode,elevation%20(m)%0AABBY,%22Abbey,%20Road%22,D16,123.46%0ABARR,,D12,%0A,%22Some%20%22%22site%22%22%22,,45.68';
      const expectedFilename = 'NEON-SiteMap-Table.csv';
      exportCsv(columns, rows);
      expect(createElementMock).toHaveBeenCalled();
      expect(setAttributeMock).toHaveBeenCalledTimes(2);
      expect(setAttributeMock).toHaveBeenNthCalledWith(1, 'href', expectedHref);
      expect(setAttributeMock).toHaveBeenNthCalledWith(2, 'download', expectedFilename);
      expect(clickMock).toHaveBeenCalled();
    });
  });
});
