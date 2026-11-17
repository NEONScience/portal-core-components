import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import cloneDeep from 'lodash/cloneDeep';

import sitesJSON from '../../../../sampleData/sites.json';
import componentSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-components.json';
import statesJSON from '../../../staticJSON/states.json';
import domainsJSON from '../../../staticJSON/domains.json';

import AvailabilityContext, { getTestableItems } from '../AvailabilityContext';
import { AvailabilityInheritanceMode } from '../EnhancedAvailabilityInheritance';

const {
  Provider,
  useAvailabilityState,
  SORT_DIRECTIONS,
} = AvailabilityContext;

const {
  DEFAULT_STATE,
  applyAvailability,
  calculateRows,
  hydrateNeonContextData,
  reducer,
} = getTestableItems();

const { TECHNICAL_AVAILABILITY, CATEGORICAL_STATUS, NONE } = AvailabilityInheritanceMode;

const initialHydratedState = {
  ...cloneDeep(DEFAULT_STATE),
  neonContextHydrated: true,
  reference: {
    sites: sitesJSON,
    states: statesJSON,
    domains: domainsJSON,
  },
};

describe('DataProductAvailability - AvailabilityContext', () => {
  describe('Provider', () => {
    test('renders with no props', (done) => {
      setTimeout(() => {
        const tree = render(
          <Provider>
            <div>children</div>
          </Provider>,
        );
        expect(tree).toMatchSnapshot();
        done();
      });
    });
    test('applies availability provided after the initial render', () => {
      const ProductCode = () => {
        const [{ productCode }] = useAvailabilityState();
        return <div>{productCode || 'none'}</div>;
      };
      const { getByText, rerender } = render(
        <Provider>
          <ProductCode />
        </Provider>,
      );
      expect(getByText('none')).toBeTruthy();
      rerender(
        <Provider enhancedAvailability={{ productCode: 'DP1.00000.001', siteCodes: [] }}>
          <ProductCode />
        </Provider>,
      );
      expect(getByText('DP1.00000.001')).toBeTruthy();
    });
    test('applies availability again when the inheritance mode changes', () => {
      // ABBY lists its tables as Expected in 2021-03, a month it is available in another release
      const TableStatus = () => {
        const [{ componentRows }] = useAvailabilityState();
        return <div>{componentRows[0]?.months['2021-03'] || 'none'}</div>;
      };
      const { getByText, rerender } = render(
        <Provider enhancedAvailability={componentSample.data}>
          <TableStatus />
        </Provider>,
      );
      expect(getByText('available')).toBeTruthy();
      rerender(
        <Provider enhancedAvailability={componentSample.data} inheritanceMode={NONE}>
          <TableStatus />
        </Provider>,
      );
      expect(getByText('expected')).toBeTruthy();
      rerender(
        <Provider
          enhancedAvailability={componentSample.data}
          inheritanceMode={TECHNICAL_AVAILABILITY}
        >
          <TableStatus />
        </Provider>,
      );
      expect(getByText('available')).toBeTruthy();
    });
  });

  describe('useAvailabilityState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useAvailabilityState());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('calculateRows()', () => {
    test('does nothing if NeonContext is not yet hydrated in state', () => {
      expect(calculateRows(DEFAULT_STATE)).toStrictEqual(DEFAULT_STATE);
    });
    const initialState = {
      ...cloneDeep(initialHydratedState),
      rows: { foo: 'bar' },
      rowTitles: { baz: 'qux' },
      rowLabels: ['foo', 'bar'],
      siteMonths: {
        ABBY: { '2010-01': 'available', '2010-10': 'partial' }, // WA / D16
        BARR: { '2010-10': 'not collected', '2013-10': 'available-provisional' }, // AK / D18
        CLBJ: { '2013-10': 'expected', '2017-10': 'tentative' }, // TX / D11
        INVALID: { '2013-10': 'available' },
      },
      componentRows: [
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 't1',
          months: { '2010-10': 'partial' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'expanded',
          tableName: 't1',
          months: { '2010-10': 'expected' },
        },
        {
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 't2',
          months: { '2010-10': 'not collected' },
        },
        {
          siteCode: 'CLBJ',
          packageType: 'basic',
          tableName: 't2',
          months: { '2013-10': 'expected' },
        },
        {
          siteCode: 'INVALID',
          packageType: 'basic',
          tableName: 't1',
          months: { '2013-10': 'expected' },
        },
      ],
      tables: {
        t1: { name: 't1', tableCode: 'T1' },
        t2: { name: 't2', tableCode: 'T2' },
      },
      hasComponents: true,
      validBreakouts: ['states', 'domains', 'sites', 'packages', 'tables'],
    };
    test('calculates a summary row of all sites for no breakouts (ALL)', () => {
      const newState = calculateRows({ ...initialState, breakouts: [] });
      expect(newState.isComponentLevel).toBe(false);
      expect(newState.rows).toStrictEqual({
        ALL: {
          '2010-01': ['available'],
          '2010-10': ['partial', 'not collected'],
          '2013-10': ['available-provisional', 'expected'],
          '2017-10': ['tentative'],
        },
      });
      expect(newState.rowTitles).toStrictEqual({ ALL: 'Summary of all sites' });
      expect(newState.rowLabels).toStrictEqual(['ALL']);
    });
    test('calculates site rows for site breakouts, ignoring unknown breakouts', () => {
      const newState = calculateRows({
        ...initialState,
        breakouts: ['states', 'domains', 'sites', 'foo'],
      });
      expect(newState.isComponentLevel).toBe(false);
      expect(newState.rows).toStrictEqual({
        'WA-D16-ABBY': { '2010-01': ['available'], '2010-10': ['partial'] },
        'AK-D18-BARR': { '2010-10': ['not collected'], '2013-10': ['available-provisional'] },
        'TX-D11-CLBJ': { '2013-10': ['expected'], '2017-10': ['tentative'] },
      });
      expect(newState.rowTitles).toStrictEqual({
        'WA-D16-ABBY': 'Washington - Pacific Northwest - Abby Road',
        'AK-D18-BARR': 'Alaska - Tundra - Utqiaġvik',
        'TX-D11-CLBJ': 'Texas - Southern Plains - LBJ National Grassland',
      });
      expect(newState.rowLabels).toStrictEqual(['WA-D16-ABBY', 'TX-D11-CLBJ', 'AK-D18-BARR']);
    });
    test('calculates component rows when package or table breakouts are present', () => {
      const newState = calculateRows({
        ...initialState,
        breakouts: ['sites', 'packages', 'tables'],
      });
      expect(newState.isComponentLevel).toBe(true);
      expect(newState.rows).toStrictEqual({
        'ABBY-basic-T1': { '2010-10': ['partial'] },
        'ABBY-expanded-T1': { '2010-10': ['expected'] },
        'ABBY-basic-T2': { '2010-10': ['not collected'] },
        'CLBJ-basic-T2': { '2013-10': ['expected'] },
      });
      expect(newState.rowTitles).toStrictEqual({
        'ABBY-basic-T1': 'Abby Road - Basic package - t1',
        'ABBY-expanded-T1': 'Abby Road - Expanded package - t1',
        'ABBY-basic-T2': 'Abby Road - Basic package - t2',
        'CLBJ-basic-T2': 'LBJ National Grassland - Basic package - t2',
      });
      expect(newState.rowLabels).toStrictEqual([
        'CLBJ-basic-T2',
        'ABBY-expanded-T1',
        'ABBY-basic-T2',
        'ABBY-basic-T1',
      ]);
    });
    test('rolls up component rows across sites and packages', () => {
      const newState = calculateRows({
        ...initialState,
        breakouts: ['tables'],
        sortDirection: SORT_DIRECTIONS.DESC,
      });
      expect(newState.isComponentLevel).toBe(true);
      expect(newState.rows).toStrictEqual({
        T1: { '2010-10': ['partial', 'expected'] },
        T2: { '2010-10': ['not collected'], '2013-10': ['expected'] },
      });
      expect(newState.rowTitles).toStrictEqual({ T1: 't1', T2: 't2' });
      expect(newState.rowLabels).toStrictEqual(['T1', 'T2']);
    });
    test('derives a fixed width code for unrecognized package types', () => {
      const newState = calculateRows({
        ...initialState,
        componentRows: [{
          siteCode: 'ABBY',
          packageType: 'other',
          tableName: 't1',
          months: { '2010-10': 'expected' },
        }],
        breakouts: ['packages'],
      });
      expect(newState.rows).toStrictEqual({ OTH: { '2010-10': ['expected'] } });
      expect(newState.rowTitles).toStrictEqual({ OTH: 'Other package' });
    });
    test('presents component rows without any statuses', () => {
      const newState = calculateRows({
        ...initialState,
        componentRows: [{
          siteCode: 'ABBY',
          packageType: 'basic',
          tableName: 't1',
          months: {},
        }],
        breakouts: ['sites', 'tables'],
      });
      expect(newState.rows).toStrictEqual({ 'ABBY-T1': {} });
      expect(newState.rowLabels).toStrictEqual(['ABBY-T1']);
    });
    describe('with the component level sample', () => {
      // Only ABBY (WA / D16) reports tables, BART (NH / D01) only reports site-months
      const sampleState = applyAvailability(cloneDeep(initialHydratedState), componentSample.data);
      test('presents every site without package or table breakouts', () => {
        expect(calculateRows({ ...sampleState, breakouts: ['sites'] }).rowLabels)
          .toStrictEqual(['BART', 'ABBY']);
      });
      test.each([
        [['sites', 'tables'], ['ABBY-ltr_massdata', 'ABBY-ltr_fielddata']],
        [['states', 'tables'], ['WA-ltr_massdata', 'WA-ltr_fielddata']],
        [['domains', 'tables'], ['D16-ltr_massdata', 'D16-ltr_fielddata']],
        [['packages', 'tables'], [
          'expanded-ltr_massdata',
          'expanded-ltr_fielddata',
          'basic-ltr_massdata',
          'basic-ltr_fielddata',
        ]],
        [['sites', 'packages', 'tables'], [
          'ABBY-expanded-ltr_massdata',
          'ABBY-expanded-ltr_fielddata',
          'ABBY-basic-ltr_massdata',
          'ABBY-basic-ltr_fielddata',
        ]],
      ])('only presents the sites reporting the tables for %j breakouts', (breakouts, rowLabels) => {
        expect(calculateRows({ ...sampleState, breakouts }).rowLabels).toStrictEqual(rowLabels);
      });
      test('only presents the statuses of the sites reporting the tables', () => {
        // Each package / table row is ABBY's alone, which matches its site-month availability
        const abbyRow = Object.fromEntries(
          Object.entries(sampleState.siteMonths.ABBY).map(([month, status]) => [month, [status]]),
        );
        const { rows } = calculateRows({ ...sampleState, breakouts: ['packages', 'tables'] });
        Object.values(rows).forEach((row) => { expect(row).toStrictEqual(abbyRow); });
      });
      test('never presents packages / tables with sites, states, or domains not reporting them', () => {
        const allBreakouts = ['states', 'domains', 'sites', 'packages', 'tables'];
        const combinations = allBreakouts
          .reduce((acc, breakout) => [...acc, ...acc.map((combo) => [...combo, breakout])], [[]])
          .filter((combo) => combo.includes('packages') || combo.includes('tables'));
        combinations.forEach((breakouts) => {
          const { rowLabels } = calculateRows({ ...sampleState, breakouts });
          expect(rowLabels.length).toBeGreaterThan(0);
          rowLabels.forEach((label) => {
            expect(label.split('-').filter((code) => ['BART', 'NH', 'D01'].includes(code)))
              .toStrictEqual([]);
          });
        });
      });
    });
  });

  describe('applyAvailability()', () => {
    const siteMonthAvailability = {
      productCode: 'DP1.00000.001',
      siteCodes: [{
        siteCode: 'ABBY',
        availableReleases: [{
          release: 'PROVISIONAL',
          months: [{ month: '2020-01', available: true, status: null }],
        }],
      }],
    };
    const componentAvailability = {
      productCode: 'DP1.00000.002',
      siteCodes: [{
        siteCode: 'ABBY',
        availableReleases: [{
          release: 'PROVISIONAL',
          months: [{
            month: '2020-01',
            available: false,
            status: null,
            packages: [{
              packageType: 'basic',
              components: [{ name: 't1', type: 'tablename', status: 'Partial' }],
            }],
          }],
        }],
      }],
    };
    test('applies site-month availability without package or table breakouts', () => {
      const newState = applyAvailability(
        { ...cloneDeep(DEFAULT_STATE), breakouts: ['tables', 'sites'] },
        siteMonthAvailability,
      );
      expect(newState.productCode).toBe('DP1.00000.001');
      expect(newState.siteMonths).toStrictEqual({ ABBY: { '2020-01': 'available-provisional' } });
      expect(newState.componentRows).toStrictEqual([]);
      expect(newState.hasComponents).toBe(false);
      expect(newState.validBreakouts).toStrictEqual(['states', 'domains', 'sites']);
      expect(newState.breakouts).toStrictEqual(['sites']);
    });
    test('applies component availability with package and table breakouts', () => {
      const newState = applyAvailability(
        { ...cloneDeep(DEFAULT_STATE), breakouts: ['tables', 'sites'] },
        componentAvailability,
      );
      expect(newState.productCode).toBe('DP1.00000.002');
      expect(newState.siteMonths).toStrictEqual({ ABBY: { '2020-01': 'partial' } });
      expect(newState.componentRows).toStrictEqual([{
        siteCode: 'ABBY',
        packageType: 'basic',
        tableName: 't1',
        months: { '2020-01': 'partial' },
      }]);
      expect(newState.tables).toStrictEqual({ t1: { name: 't1', tableCode: 't1' } });
      expect(newState.hasComponents).toBe(true);
      expect(newState.validBreakouts).toStrictEqual([
        'states', 'domains', 'sites', 'packages', 'tables',
      ]);
      expect(newState.breakouts).toStrictEqual(['tables', 'sites']);
    });
    test('applies component availability with the inheritance mode', () => {
      const availableMonthAvailability = {
        productCode: 'DP1.00000.002',
        siteCodes: [{
          siteCode: 'ABBY',
          availableReleases: [{
            release: 'PROVISIONAL',
            months: [{
              month: '2020-01',
              available: true,
              status: null,
              packages: [{
                packageType: 'basic',
                components: [{ name: 't1', type: 'tablename', status: 'Partial' }],
              }],
            }],
          }],
        }],
      };
      const inherited = applyAvailability(cloneDeep(DEFAULT_STATE), availableMonthAvailability);
      expect(inherited.siteMonths).toStrictEqual({ ABBY: { '2020-01': 'available-provisional' } });
      expect(inherited.componentRows.map(({ months }) => months))
        .toStrictEqual([{ '2020-01': 'available-provisional' }]);
      [CATEGORICAL_STATUS, NONE].forEach((inheritanceMode) => {
        const newState = applyAvailability(
          cloneDeep(DEFAULT_STATE),
          availableMonthAvailability,
          inheritanceMode,
        );
        expect(newState.siteMonths).toStrictEqual(inherited.siteMonths);
        expect(newState.componentRows.map(({ months }) => months))
          .toStrictEqual([{ '2020-01': 'partial' }]);
      });
    });
  });

  describe('hydrateNeonContextData()', () => {
    test('properly applies NeonContext data', () => {
      const newState = hydrateNeonContextData(
        cloneDeep(DEFAULT_STATE),
        {
          sites: { foo: 'bar' },
          states: { abc: 'def' },
          domains: { ghi: 'jkl' },
          otherContextData: 'foo',
        },
      );
      expect(newState.reference).toStrictEqual({
        sites: { foo: 'bar' },
        states: { abc: 'def' },
        domains: { ghi: 'jkl' },
      });
      expect(newState.neonContextHydrated).toBe(true);
      Object.keys(newState)
        .filter((key) => !['reference', 'neonContextHydrated'].includes(key))
        .forEach((key) => {
          expect(newState[key]).toStrictEqual(DEFAULT_STATE[key]);
        });
    });
  });

  describe('reducer()', () => {
    test('reflects back original state for unrecognized action', () => {
      expect(
        reducer({ foo: 'bar' }, { type: 'unknown' }),
      ).toStrictEqual({ foo: 'bar' });
    });
    describe('hydrateNeonContextData', () => {
      test('requires neonContextData in the action to do anything', () => {
        expect(
          reducer({ foo: 'bar' }, { type: 'hydrateNeonContextData' }),
        ).toStrictEqual({ foo: 'bar' });
      });
      test('hydrates data and calculates rows if neonContextData is present', () => {
        const initialState = cloneDeep(DEFAULT_STATE);
        const neonContextData = {
          sites: sitesJSON,
          states: statesJSON,
          domains: domainsJSON,
        };
        const newState = reducer(initialState, { type: 'hydrateNeonContextData', neonContextData });
        expect(newState.neonContextHydrated).toBe(true);
        expect(newState.reference).toStrictEqual(neonContextData);
        expect(newState.rows).toStrictEqual({ ALL: {} });
      });
    });
    describe('setBreakouts', () => {
      test('requires action breakouts to be an array of all valid breakouts', () => {
        expect(
          reducer(initialHydratedState, { type: 'setBreakouts' }),
        ).toStrictEqual(initialHydratedState);
        expect(
          reducer(initialHydratedState, { type: 'setBreakouts', breakouts: ['states', 'qux'] }),
        ).toStrictEqual(initialHydratedState);
      });
      test('rejects package and table breakouts without component detail', () => {
        expect(
          reducer(initialHydratedState, { type: 'setBreakouts', breakouts: ['sites', 'tables'] }),
        ).toStrictEqual(initialHydratedState);
      });
      test('sets breakouts and caluclates rows', () => {
        const newState = reducer(
          initialHydratedState,
          { type: 'setBreakouts', breakouts: ['states', 'domains'] },
        );
        expect(newState.breakouts).toStrictEqual(['states', 'domains']);
      });
      test('keeps leading breakout in the front if still present in action breakouts', () => {
        const previousState = {
          ...initialHydratedState,
          breakouts: ['states', 'domains'],
        };
        const newState = reducer(
          previousState,
          { type: 'setBreakouts', breakouts: ['sites', 'domains', 'states'] },
        );
        expect(newState.breakouts).toStrictEqual(['states', 'sites', 'domains']);
      });
    });
    describe('setSortMethod', () => {
      test('requires action method be a valid breakout', () => {
        expect(
          reducer(initialHydratedState, { type: 'setSortMethod' }),
        ).toStrictEqual(initialHydratedState);
        expect(
          reducer(initialHydratedState, { type: 'setSortMethod', method: 'qux' }),
        ).toStrictEqual(initialHydratedState);
      });
      test('adds valid action method to the front of the breakout list', () => {
        const previousState = {
          ...initialHydratedState,
          validBreakouts: ['states', 'domains', 'sites', 'packages', 'tables'],
          breakouts: ['states', 'domains', 'tables'],
        };
        const newState = reducer(
          previousState,
          { type: 'setSortMethod', method: 'tables' },
        );
        expect(newState.breakouts).toStrictEqual(['tables', 'states', 'domains']);
      });
    });
    describe('setSortDirection', () => {
      test('requires a valid sort direction', () => {
        expect(
          reducer(initialHydratedState, { type: 'setSortDirection' }),
        ).toStrictEqual(initialHydratedState);
        expect(
          reducer(initialHydratedState, { type: 'setSortDirection', direction: 'qux' }),
        ).toStrictEqual(initialHydratedState);
      });
      test('applies valid sort direction', () => {
        const previousState = {
          ...initialHydratedState,
          sortDirection: SORT_DIRECTIONS.ASC,
        };
        const newState = reducer(
          previousState,
          { type: 'setSortDirection', direction: SORT_DIRECTIONS.DESC },
        );
        expect(newState.sortDirection).toBe(SORT_DIRECTIONS.DESC);
      });
    });
    describe('setAvailability', () => {
      const availability = {
        productCode: 'DP1.00000.001',
        siteCodes: [{
          siteCode: 'ABBY',
          availableReleases: [{
            release: 'RELEASE-2026',
            months: [{ month: '2020-01', available: true, status: null }],
          }],
        }],
      };
      test('parses availability and calculates rows', () => {
        const newState = reducer(
          { ...cloneDeep(initialHydratedState), breakouts: ['sites'] },
          { type: 'setAvailability', availability },
        );
        expect(newState.productCode).toBe('DP1.00000.001');
        expect(newState.rows).toStrictEqual({ ABBY: { '2020-01': ['available'] } });
        expect(newState.rowLabels).toStrictEqual(['ABBY']);
      });
      test('parses availability with the inheritance mode', () => {
        const newState = reducer(
          { ...cloneDeep(initialHydratedState), breakouts: ['tables'] },
          { type: 'setAvailability', availability: componentSample.data, inheritanceMode: NONE },
        );
        // Each table rolls up ABBY's basic and expanded packages, only listed in 2021-03
        expect(newState.rows).toStrictEqual({
          ltr_fielddata: { '2021-03': ['expected', 'expected'] },
          ltr_massdata: { '2021-03': ['expected', 'expected'] },
        });
      });
      test('clears data when availability is removed', () => {
        const previousState = reducer(
          cloneDeep(initialHydratedState),
          { type: 'setAvailability', availability },
        );
        const newState = reducer(previousState, { type: 'setAvailability', availability: null });
        expect(newState.productCode).toBe(null);
        expect(newState.siteMonths).toStrictEqual({});
        expect(newState.rows).toStrictEqual({ ALL: {} });
      });
    });
  });
});
