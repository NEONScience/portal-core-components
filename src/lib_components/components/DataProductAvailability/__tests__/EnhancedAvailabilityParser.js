import siteMonthSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-site-month.json';
import componentSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-components.json';

import { parseEnhancedAvailability, resolveCellStatus } from '../EnhancedAvailabilityParser';
import { AvailabilityInheritanceMode } from '../EnhancedAvailabilityInheritance';

const { TECHNICAL_AVAILABILITY, CATEGORICAL_STATUS, NONE } = AvailabilityInheritanceMode;

const EMPTY_PARSED = {
  productCode: null,
  siteMonths: {},
  componentRows: [],
  tables: {},
  hasComponents: false,
};

const makeAvailability = (availableReleases) => ({
  productCode: 'DP1.00000.001',
  siteCodes: [{ siteCode: 'ABBY', availableReleases }],
});

describe('DataProductAvailability - EnhancedAvailabilityParser', () => {
  describe('resolveCellStatus()', () => {
    test('returns null when there are no valid statuses', () => {
      expect(resolveCellStatus()).toBe(null);
      expect(resolveCellStatus([])).toBe(null);
      expect(resolveCellStatus(['BAD STATUS'])).toBe(null);
    });
    test('returns the only status reported', () => {
      expect(resolveCellStatus(['expected', 'expected'])).toBe('expected');
      expect(resolveCellStatus(['available-provisional'])).toBe('available-provisional');
    });
    test('favors availability over any other reported status', () => {
      expect(resolveCellStatus(['expected', 'available'])).toBe('available');
      expect(resolveCellStatus(['partial', 'available-provisional']))
        .toBe('available-provisional');
    });
    test('resolves released and provisional availability to mixed', () => {
      expect(resolveCellStatus(['available', 'available-provisional', 'expected']))
        .toBe('mixed-available-provisional');
    });
    test('resolves differing unavailable statuses to mixed no availability', () => {
      expect(resolveCellStatus(['expected', 'partial'])).toBe('mixed no availability');
    });
  });

  describe('parseEnhancedAvailability()', () => {
    test('returns empty structures for missing or empty data', () => {
      expect(parseEnhancedAvailability()).toStrictEqual(EMPTY_PARSED);
      expect(parseEnhancedAvailability(null)).toStrictEqual(EMPTY_PARSED);
      expect(parseEnhancedAvailability({ productCode: 'DP1.00000.001' }))
        .toStrictEqual({ ...EMPTY_PARSED, productCode: 'DP1.00000.001' });
    });
    test('maps site-month availability and statuses across releases', () => {
      const parsed = parseEnhancedAvailability(makeAvailability([
        {
          release: 'PROVISIONAL',
          months: [
            { month: '2020-01', available: false, status: 'Expected' },
            { month: '2020-02', available: true, status: null },
            { month: '2020-03', available: true, status: null },
            { month: '2020-04', available: false, status: 'Potential' },
            { month: '2020-05', available: false, status: 'Not Planned' },
            { month: '2020-06', available: false, status: 'Not Collected' },
            { month: '2020-07', available: false, status: 'Partial' },
            { month: '2020-08', available: false, status: null },
            { month: '2020-09', available: false, status: 'Unknown Status' },
          ],
        },
        {
          release: 'RELEASE-2026',
          months: [
            { month: '2020-01', available: true, status: null },
            { month: '2020-03', available: true, status: null },
          ],
        },
      ]));
      expect(parsed).toStrictEqual({
        ...EMPTY_PARSED,
        productCode: 'DP1.00000.001',
        siteMonths: {
          ABBY: {
            '2020-01': 'available',
            '2020-02': 'available-provisional',
            '2020-03': 'mixed-available-provisional',
            '2020-04': 'tentative',
            '2020-05': 'not expected',
            '2020-06': 'not collected',
            '2020-07': 'partial',
          },
        },
      });
    });
    test('extracts table component statuses by site and package', () => {
      const parsed = parseEnhancedAvailability(makeAvailability([
        {
          release: 'PROVISIONAL',
          months: [
            {
              month: '2021-03',
              available: false,
              status: null,
              packages: [
                {
                  packageType: 'basic',
                  components: [
                    { name: 'tbl_b', type: 'tablename', status: 'Expected' },
                    { name: 'tbl_a', type: 'tablename', status: 'Partial' },
                    { name: 'file_a', type: 'filename', status: 'Expected' },
                  ],
                },
                {
                  packageType: 'expanded',
                  components: [
                    { name: 'tbl_b', type: 'tablename', status: 'Not Collected' },
                    { name: 'tbl_c', type: 'tablename', status: null },
                  ],
                },
              ],
            },
            {
              month: '2021-04',
              available: true,
              status: null,
              packages: [
                {
                  packageType: 'basic',
                  components: [{ name: 'tbl_a', type: 'tablename', status: 'Partial' }],
                },
              ],
            },
          ],
        },
      ]));
      // Months without a status of their own derive it from their components
      expect(parsed.siteMonths).toStrictEqual({
        ABBY: {
          '2021-03': 'mixed no availability',
          '2021-04': 'available-provisional',
        },
      });
      // Package / table rows include every component the site reports, and an available
      // site-month's availability overrides any component status
      expect(parsed.componentRows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_b',
          months: { '2021-03': 'expected', '2021-04': 'available-provisional' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_a',
          months: { '2021-03': 'partial', '2021-04': 'available-provisional' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'expanded',
          tableName: 'tbl_b',
          months: { '2021-03': 'not collected', '2021-04': 'available-provisional' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'expanded',
          tableName: 'tbl_c',
          months: { '2021-04': 'available-provisional' },
        },
      ]);
      expect(parsed.tables).toStrictEqual({
        tbl_a: { name: 'tbl_a', tableCode: 'tbl_a' },
        tbl_b: { name: 'tbl_b', tableCode: 'tbl_b' },
        tbl_c: { name: 'tbl_c', tableCode: 'tbl_c' },
      });
      expect(parsed.hasComponents).toBe(true);
    });
    const statusAvailability = makeAvailability([
      {
        release: 'PROVISIONAL',
        months: [
          {
            month: '2021-03',
            available: false,
            status: 'Expected',
            packages: [{
              packageType: 'basic',
              components: [
                { name: 'tbl_a', type: 'tablename', status: 'Not Collected' },
                { name: 'tbl_b', type: 'tablename', status: '' },
              ],
            }],
          },
          {
            month: '2021-04',
            available: false,
            status: 'Partial',
            packages: [{
              packageType: 'basic',
              components: [{ name: 'tbl_a', type: 'tablename', status: 'Potential' }],
            }],
          },
          {
            month: '2021-05',
            available: false,
            status: 'Not Planned',
            packages: [{
              packageType: 'basic',
              components: [{ name: 'tbl_a', type: 'tablename', status: null }],
            }],
          },
        ],
      },
      {
        release: 'RELEASE-2026',
        months: [{ month: '2021-04', available: true, status: null }],
      },
    ]);
    test('only uses the site-month status for listed components without a status', () => {
      const parsed = parseEnhancedAvailability(statusAvailability);
      // Site rows use the site-month status, and availability in any release takes precedence
      expect(parsed.siteMonths).toStrictEqual({
        ABBY: {
          '2021-03': 'expected',
          '2021-04': 'available',
          '2021-05': 'not expected',
        },
      });
      // A listed component's own status is not overridden by the site-month status, which only
      // applies to listed components without a status of their own (tbl_b is not listed in 2021-05)
      expect(parsed.componentRows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_a',
          months: { '2021-03': 'not collected', '2021-04': 'available', '2021-05': 'not expected' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_b',
          months: { '2021-03': 'expected', '2021-04': 'available' },
        },
      ]);
    });
    test('applies the inheritance mode to the statuses of listed components', () => {
      const inherited = parseEnhancedAvailability(statusAvailability);
      const categorical = parseEnhancedAvailability(statusAvailability, CATEGORICAL_STATUS);
      const none = parseEnhancedAvailability(statusAvailability, NONE);
      // Site rows are the same in every inheritance mode
      expect(categorical.siteMonths).toStrictEqual(inherited.siteMonths);
      expect(none.siteMonths).toStrictEqual(inherited.siteMonths);
      // Without inheriting availability tbl_a shows its own status in 2021-04, and tbl_b has no
      // status in 2021-04 as no release lists it
      expect(categorical.componentRows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_a',
          months: { '2021-03': 'not collected', '2021-04': 'tentative', '2021-05': 'not expected' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_b',
          months: { '2021-03': 'expected' },
        },
      ]);
      // Without inheritance, listed components without a status of their own have no status, so
      // tbl_b is presented without any statuses
      expect(none.componentRows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_a',
          months: { '2021-03': 'not collected', '2021-04': 'tentative' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_b',
          months: {},
        },
      ]);
      expect(Object.keys(none.tables)).toStrictEqual(['tbl_a', 'tbl_b']);
      expect(none.hasComponents).toBe(true);
    });
    test('only shows the statuses of listed tables without inheriting availability', () => {
      const availability = makeAvailability([
        {
          release: 'PROVISIONAL',
          months: [
            {
              month: '2021-03',
              available: false,
              status: null,
              packages: [{
                packageType: 'basic',
                components: [
                  { name: 'tbl_a', type: 'tablename', status: 'Partial' },
                  { name: 'tbl_b', type: 'tablename', status: 'Expected' },
                ],
              }],
            },
            {
              month: '2021-04',
              available: true,
              status: null,
              packages: [{
                packageType: 'basic',
                components: [{ name: 'tbl_a', type: 'tablename', status: 'Not Collected' }],
              }],
            },
          ],
        },
      ]);
      const inherited = parseEnhancedAvailability(availability, TECHNICAL_AVAILABILITY);
      const parsed = parseEnhancedAvailability(availability, CATEGORICAL_STATUS);
      // Site rows are the same in every inheritance mode
      expect(parsed.siteMonths).toStrictEqual({
        ABBY: { '2021-03': 'mixed no availability', '2021-04': 'available-provisional' },
      });
      expect(inherited.siteMonths).toStrictEqual(parsed.siteMonths);
      expect(inherited.componentRows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_a',
          months: { '2021-03': 'partial', '2021-04': 'available-provisional' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_b',
          months: { '2021-03': 'expected', '2021-04': 'available-provisional' },
        },
      ]);
      // tbl_a shows its own status in the available 2021-04, which does not list tbl_b
      expect(parsed.componentRows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_a',
          months: { '2021-03': 'partial', '2021-04': 'not collected' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 'tbl_b',
          months: { '2021-03': 'expected' },
        },
      ]);
      expect(parseEnhancedAvailability(availability, NONE).componentRows)
        .toStrictEqual(parsed.componentRows);
    });
    test('pads table names to a consistent width', () => {
      const components = Array(10).fill(0).map((value, idx) => (
        { name: `t${idx}`, type: 'tablename', status: 'Expected' }
      ));
      const parsed = parseEnhancedAvailability(makeAvailability([
        {
          release: 'PROVISIONAL',
          months: [{
            month: '2021-03',
            available: false,
            status: null,
            packages: [{ packageType: 'basic', components }],
          }],
        },
      ]));
      expect(Object.values(parsed.tables).map(({ tableCode }) => tableCode)).toStrictEqual([
        't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
      ]);
    });
    test('parses the site-month sample response', () => {
      const parsed = parseEnhancedAvailability(siteMonthSample.data);
      expect(parsed.productCode).toBe('DP1.20288.001');
      expect(parsed.hasComponents).toBe(false);
      expect(Object.keys(parsed.siteMonths)).toStrictEqual(['ARIK']);
      const { ARIK } = parsed.siteMonths;
      expect(ARIK['2010-01']).toBe('expected');
      // Expected in PROVISIONAL but available in RELEASE-2026
      expect(ARIK['2016-03']).toBe('available');
      expect(ARIK['2025-06']).toBe('available');
      expect(ARIK['2025-07']).toBe('available-provisional');
    });
    test('parses the component level sample response', () => {
      const parsed = parseEnhancedAvailability(componentSample.data);
      expect(parsed.productCode).toBe('DP1.10033.001');
      expect(parsed.hasComponents).toBe(true);
      expect(Object.keys(parsed.siteMonths)).toStrictEqual(['ABBY', 'BART']);
      // Expected tables in PROVISIONAL but available in RELEASE-2026
      expect(parsed.siteMonths.ABBY['2021-03']).toBe('available');
      expect(parsed.siteMonths.BART['2025-04']).toBe('available-provisional');
      expect(parsed.tables).toStrictEqual({
        ltr_fielddata: { name: 'ltr_fielddata', tableCode: 'ltr_fielddata' },
        ltr_massdata: { name: 'ltr_massdata', tableCode: 'ltr_massdata' },
      });
      // Only ABBY reports components, so BART has no package / table rows
      expect(parsed.componentRows.map(({ siteCode, packageType, tableName }) => (
        [siteCode, packageType, tableName]
      ))).toStrictEqual(['basic', 'expanded'].flatMap((packageType) => (
        ['ltr_fielddata', 'ltr_massdata'].map((tableName) => ['ABBY', packageType, tableName])
      )));
      // Components are only reported for ABBY 2021-03 (Expected in PROVISIONAL but available in
      // RELEASE-2026) so every package / table matches its site-month availability
      parsed.componentRows.forEach(({ months }) => {
        expect(months).toStrictEqual(parsed.siteMonths.ABBY);
      });
      expect(parsed.componentRows[0].months['2021-03']).toBe('available');
    });
    test('parses the component level sample response without inheriting availability', () => {
      const inherited = parseEnhancedAvailability(componentSample.data);
      [CATEGORICAL_STATUS, NONE].forEach((inheritanceMode) => {
        const parsed = parseEnhancedAvailability(componentSample.data, inheritanceMode);
        expect(parsed.siteMonths).toStrictEqual(inherited.siteMonths);
        // ABBY only lists its tables in 2021-03, as Expected in PROVISIONAL
        expect(parsed.componentRows).toStrictEqual(['basic', 'expanded'].flatMap((packageType) => (
          ['ltr_fielddata', 'ltr_massdata'].map((tableName) => ({
            siteCode: 'ABBY',
            packageType,
            tableName,
            months: { '2021-03': 'expected' },
          }))
        )));
      });
    });
  });
});
