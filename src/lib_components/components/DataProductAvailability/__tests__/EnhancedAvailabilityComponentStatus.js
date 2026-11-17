import {
  calcComponentRows,
  calcComponentStatuses,
} from '../EnhancedAvailabilityComponentStatus';
import { AvailabilityInheritanceMode } from '../EnhancedAvailabilityInheritance';

const { TECHNICAL_AVAILABILITY, CATEGORICAL_STATUS, NONE } = AvailabilityInheritanceMode;

describe('DataProductAvailability - EnhancedAvailabilityComponentStatus', () => {
  describe('calcComponentStatuses()', () => {
    test('uses site-month availability over any component status by default', () => {
      expect(calcComponentStatuses({ available: true, status: null }, 'PROVISIONAL', ['Partial']))
        .toStrictEqual(['available-provisional']);
      expect(calcComponentStatuses(
        { available: true, status: 'Expected' },
        'RELEASE-2026',
        ['Partial', 'Not Collected'],
      )).toStrictEqual(['available']);
      expect(calcComponentStatuses({ available: true, status: null }, 'RELEASE-2026'))
        .toStrictEqual(['available']);
      expect(calcComponentStatuses(
        { available: true, status: null },
        'PROVISIONAL',
        ['Partial'],
        TECHNICAL_AVAILABILITY,
      )).toStrictEqual(['available-provisional']);
    });
    test('only inherits the site-month status without inheriting availability', () => {
      expect(calcComponentStatuses(
        { available: true, status: null },
        'PROVISIONAL',
        ['Partial'],
        CATEGORICAL_STATUS,
      )).toStrictEqual(['partial']);
      // Listed components without a status of their own inherit the site-month status
      expect(calcComponentStatuses(
        { available: true, status: 'Expected' },
        'RELEASE-2026',
        ['Not Collected', null],
        CATEGORICAL_STATUS,
      )).toStrictEqual(['not collected', 'expected']);
      expect(calcComponentStatuses(
        { available: false, status: 'Not Planned' },
        'PROVISIONAL',
        [null, ''],
        CATEGORICAL_STATUS,
      )).toStrictEqual(['not expected', 'not expected']);
      expect(calcComponentStatuses(
        { available: true, status: null },
        'RELEASE-2026',
        [],
        CATEGORICAL_STATUS,
      )).toStrictEqual([]);
    });
    test('inherits nothing from the site-month without inheritance', () => {
      expect(calcComponentStatuses(
        { available: true, status: 'Expected' },
        'RELEASE-2026',
        ['Not Collected', null],
        NONE,
      )).toStrictEqual(['not collected']);
      expect(calcComponentStatuses(
        { available: false, status: 'Not Planned' },
        'PROVISIONAL',
        [null, ''],
        NONE,
      )).toStrictEqual([]);
      expect(calcComponentStatuses(
        { available: true, status: null },
        'PROVISIONAL',
        undefined,
        NONE,
      )).toStrictEqual([]);
    });
    test('inherits availability with an unknown inheritance mode', () => {
      expect(calcComponentStatuses(
        { available: true, status: null },
        'PROVISIONAL',
        ['Partial'],
        null,
      )).toStrictEqual(['available-provisional']);
      expect(calcComponentStatuses(
        { available: true, status: null },
        'PROVISIONAL',
        ['Partial'],
        'Unknown Mode',
      )).toStrictEqual(['available-provisional']);
    });
    test('uses component statuses over the site-month status when not available', () => {
      expect(calcComponentStatuses(
        { available: false, status: 'Expected' },
        'PROVISIONAL',
        ['Not Collected'],
      )).toStrictEqual(['not collected']);
      expect(calcComponentStatuses(
        { available: false, status: null },
        'PROVISIONAL',
        ['Partial', 'Potential'],
      )).toStrictEqual(['partial', 'tentative']);
    });
    test('uses the site-month status only for listed components without a status of their own', () => {
      expect(calcComponentStatuses(
        { available: false, status: 'Not Planned' },
        'PROVISIONAL',
        [null, undefined, '', '  '],
      )).toStrictEqual(['not expected', 'not expected', 'not expected', 'not expected']);
      expect(calcComponentStatuses(
        { available: false, status: 'Expected' },
        'PROVISIONAL',
        ['Partial', null],
      )).toStrictEqual(['partial', 'expected']);
    });
    test('does not use the site-month status for a component with an unknown status', () => {
      expect(calcComponentStatuses(
        { available: false, status: 'Not Planned' },
        'PROVISIONAL',
        ['Unknown Status'],
      )).toStrictEqual([]);
      expect(calcComponentStatuses(
        { available: false, status: 'Not Planned' },
        'PROVISIONAL',
        [null, 'Unknown Status'],
      )).toStrictEqual(['not expected']);
    });
    test('does not use the site-month status for components the site-month does not list', () => {
      expect(calcComponentStatuses({ available: false, status: 'Expected' }, 'PROVISIONAL'))
        .toStrictEqual([]);
      expect(calcComponentStatuses({ available: false, status: 'Expected' }, 'PROVISIONAL', []))
        .toStrictEqual([]);
    });
    test('returns no statuses when none apply', () => {
      expect(calcComponentStatuses({ available: false, status: null }, 'PROVISIONAL', [null]))
        .toStrictEqual([]);
      expect(calcComponentStatuses({ available: false, status: 'Unknown Status' }, 'PROVISIONAL'))
        .toStrictEqual([]);
      expect(calcComponentStatuses(undefined, 'PROVISIONAL')).toStrictEqual([]);
    });
  });

  describe('calcComponentRows()', () => {
    const siteCodes = [
      {
        siteCode: 'ABBY',
        availableReleases: [
          {
            release: 'PROVISIONAL',
            months: [
              {
                month: '2020-01',
                available: false,
                status: null,
                packages: [{
                  packageType: 'basic',
                  components: [
                    { name: 't1', type: 'tablename', status: 'Partial' },
                    { name: 'f1', type: 'filename', status: 'Expected' },
                  ],
                }],
              },
              {
                month: '2020-02',
                available: true,
                status: null,
                packages: [{
                  packageType: 'basic',
                  components: [{ name: 't1', type: 'tablename', status: 'Partial' }],
                }],
              },
              {
                month: '2020-03',
                available: false,
                status: 'Expected',
                packages: [{
                  packageType: 'expanded',
                  components: [{ name: 't2', type: 'tablename', status: 'Not Collected' }],
                }],
              },
              { month: '2020-04', available: false, status: null },
              {
                month: '2020-05',
                available: false,
                status: 'Partial',
                packages: [{
                  packageType: 'basic',
                  components: [{ name: 't1', type: 'tablename', status: null }],
                }],
              },
            ],
          },
          {
            release: 'RELEASE-2026',
            months: [{ month: '2020-01', available: true, status: null }],
          },
        ],
      },
      {
        siteCode: 'BART',
        availableReleases: [{
          release: 'PROVISIONAL',
          months: [
            { month: '2020-01', available: false, status: 'Potential' },
            { month: '2020-02', available: true, status: null },
          ],
        }],
      },
      {
        siteCode: 'CLBJ',
        availableReleases: [{
          release: 'PROVISIONAL',
          months: [
            {
              month: '2020-01',
              available: false,
              status: 'Expected',
              packages: [{
                packageType: 'basic',
                components: [{ name: 't1', type: 'tablename', status: null }],
              }],
            },
            { month: '2020-02', available: true, status: null },
          ],
        }],
      },
    ];
    test('returns no rows without package / table components', () => {
      expect(calcComponentRows()).toStrictEqual([]);
      expect(calcComponentRows([{
        siteCode: 'ABBY',
        availableReleases: [{
          release: 'PROVISIONAL',
          months: [{ month: '2020-01', available: true, status: null }],
        }],
      }])).toStrictEqual([]);
    });
    test('applies availability to every component a site reports, statuses to those listed', () => {
      const rows = calcComponentRows(siteCodes);
      // BART reports no components and CLBJ only reports basic / t1, so neither has rows for
      // the other packages / tables reported for the product
      expect(rows).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 't1',
          months: {
            '2020-01': ['partial', 'available'],
            '2020-02': ['available-provisional'],
            '2020-05': ['partial'],
          },
        },
        {
          siteCode: 'ABBY',
          packageType: 'expanded',
          tableName: 't2',
          months: {
            '2020-01': ['available'],
            '2020-02': ['available-provisional'],
            '2020-03': ['not collected'],
          },
        },
        {
          siteCode: 'CLBJ',
          packageType: 'basic',
          tableName: 't1',
          months: { '2020-01': ['expected'], '2020-02': ['available-provisional'] },
        },
      ]);
      expect(calcComponentRows(siteCodes, TECHNICAL_AVAILABILITY)).toStrictEqual(rows);
    });
    test('only applies statuses to the components listed without inheriting availability', () => {
      // Available site-months only apply the statuses of the components they list too, so ABBY
      // basic / t1 is partial in 2020-02, and inherits the site-month status in 2020-05
      expect(calcComponentRows(siteCodes, CATEGORICAL_STATUS)).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 't1',
          months: { '2020-01': ['partial'], '2020-02': ['partial'], '2020-05': ['partial'] },
        },
        {
          siteCode: 'ABBY',
          packageType: 'expanded',
          tableName: 't2',
          months: { '2020-03': ['not collected'] },
        },
        {
          siteCode: 'CLBJ',
          packageType: 'basic',
          tableName: 't1',
          months: { '2020-01': ['expected'] },
        },
      ]);
    });
    test('only applies the statuses of the components listed without inheritance', () => {
      // Listed components without a status of their own have no status, so CLBJ basic / t1 is
      // presented without any statuses
      expect(calcComponentRows(siteCodes, NONE)).toStrictEqual([
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 't1',
          months: { '2020-01': ['partial'], '2020-02': ['partial'] },
        },
        {
          siteCode: 'ABBY',
          packageType: 'expanded',
          tableName: 't2',
          months: { '2020-03': ['not collected'] },
        },
        {
          siteCode: 'CLBJ',
          packageType: 'basic',
          tableName: 't1',
          months: {},
        },
      ]);
    });
    test('keeps rows for components without any statuses', () => {
      const availableSiteCodes = [{
        siteCode: 'ABBY',
        availableReleases: [{
          release: 'PROVISIONAL',
          months: [{
            month: '2020-01',
            available: true,
            status: null,
            packages: [{
              packageType: 'basic',
              components: [{ name: 't1', type: 'tablename', status: null }],
            }],
          }],
        }],
      }];
      const row = { siteCode: 'ABBY', packageType: 'basic', tableName: 't1' };
      expect(calcComponentRows(availableSiteCodes)).toStrictEqual([
        { ...row, months: { '2020-01': ['available-provisional'] } },
      ]);
      expect(calcComponentRows(availableSiteCodes, CATEGORICAL_STATUS))
        .toStrictEqual([{ ...row, months: {} }]);
      expect(calcComponentRows(availableSiteCodes, NONE)).toStrictEqual([{ ...row, months: {} }]);
    });
  });
});
