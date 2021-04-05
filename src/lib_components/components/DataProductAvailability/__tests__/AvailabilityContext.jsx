import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

import cloneDeep from 'lodash/cloneDeep';

import sitesJSON from '../../../../sampleData/sites.json';
import statesJSON from '../../../staticJSON/states.json';
import domainsJSON from '../../../staticJSON/domains.json';

import AvailabilityContext, { getTestableItems } from '../AvailabilityContext';

const {
  Provider,
  useAvailabilityState,
  SORT_DIRECTIONS,
} = AvailabilityContext;

const {
  DEFAULT_STATE,
  calculateRows,
  extractTables,
  hydrateNeonContextData,
  reducer,
} = getTestableItems();

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
        const tree = renderer
          .create(
            <Provider>
              <div>children</div>
            </Provider>,
          ).toJSON();
        expect(tree).toMatchSnapshot();
        done();
      });
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
      sites: [
        {
          siteCode: 'ABBY',
          tables: [ // WA / D16
            { name: 't1', months: { '2010-01': 'available', '2010-10': 'delayed' } },
            { name: 't2', months: { '2010-01': 'available', '2010-10': 'tentative' } },
          ],
        },
        {
          siteCode: 'BARR',
          tables: [ // AK / D18
            { name: 't1', months: { '2010-10': 'not collected', '2013-10': 'expected' } },
            { name: 't3', months: { '2010-10': 'delayed', '2013-10': 'available' } },
          ],
        },
        {
          siteCode: 'CLBJ',
          tables: [ // TX / D11
            { name: 't2', months: { '2013-10': 'delayed', '2017-10': 'expected' } },
            { name: 't3', months: { '2013-10': 'tentative', '2017-10': 'being processed' } },
            { name: 'unknown table' },
          ],
        },
        {
          siteCode: 'INVALID', tables: [],
        },
      ],
      tables: {
        t1: { name: 't1', sites: ['ABBY', 'BARR'], tableCode: 'T1' },
        t2: { name: 't2', sites: ['ABBY', 'CLBJ'], tableCode: 'T2' },
        t3: { name: 't3', sites: ['BARR', 'CLBJ'], tableCode: 'T3' },
      },
    };
    test('appropriately calculates rows, rowTitles, and rowLabels for no breakouts (ALL)', () => {
      const expectedOutput = {
        rows: {
          ALL: {
            '2010-01': ['available', 'available'],
            '2010-10': ['delayed', 'tentative', 'not collected', 'delayed'],
            '2013-10': ['expected', 'available', 'delayed', 'tentative'],
            '2017-10': ['expected', 'being processed'],
          },
        },
        rowTitles: {
          ALL: 'Summary of all sites and tables',
        },
        rowLabels: ['ALL'],
      };
      const newState = calculateRows({ ...initialState, breakouts: [] });
      expect(newState.rows).toStrictEqual(expectedOutput.rows);
      expect(newState.rowTitles).toStrictEqual(expectedOutput.rowTitles);
      expect(newState.rowLabels).toStrictEqual(expectedOutput.rowLabels);
    });
    test('appropriately calculates rows, rowTitles, and rowLabels for discrete breakouts', () => {
      const expectedOutput = {
        rows: {
          'AK-D18-BARR-T1': {
            '2010-10': ['not collected'],
            '2013-10': ['expected'],
          },
          'AK-D18-BARR-T3': {
            '2010-10': ['delayed'],
            '2013-10': ['available'],
          },
          'TX-D11-CLBJ-T2': {
            '2013-10': ['delayed'],
            '2017-10': ['expected'],
          },
          'TX-D11-CLBJ-T3': {
            '2013-10': ['tentative'],
            '2017-10': ['being processed'],
          },
          'WA-D16-ABBY-T1': {
            '2010-01': ['available'],
            '2010-10': ['delayed'],
          },
          'WA-D16-ABBY-T2': {
            '2010-01': ['available'],
            '2010-10': ['tentative'],
          },
        },
        rowTitles: {
          'AK-D18-BARR-T1': 'Alaska - Tundra - Utqiaġvik - t1',
          'AK-D18-BARR-T3': 'Alaska - Tundra - Utqiaġvik - t3',
          'TX-D11-CLBJ-T2': 'Texas - Southern Plains - LBJ National Grassland - t2',
          'TX-D11-CLBJ-T3': 'Texas - Southern Plains - LBJ National Grassland - t3',
          'WA-D16-ABBY-T1': 'Washington - Pacific Northwest - Abby Road - t1',
          'WA-D16-ABBY-T2': 'Washington - Pacific Northwest - Abby Road - t2',
        },
        rowLabels: [
          'WA-D16-ABBY-T2',
          'WA-D16-ABBY-T1',
          'TX-D11-CLBJ-T3',
          'TX-D11-CLBJ-T2',
          'AK-D18-BARR-T3',
          'AK-D18-BARR-T1',
        ],
      };
      const newState = calculateRows({
        ...initialState,
        breakouts: ['states', 'domains', 'sites', 'foo', 'tables'],
      });
      expect(newState.rows).toStrictEqual(expectedOutput.rows);
      expect(newState.rowTitles).toStrictEqual(expectedOutput.rowTitles);
      expect(newState.rowLabels).toStrictEqual(expectedOutput.rowLabels);
    });
  });

  describe('extractTables()', () => {
    const initialState = {
      ...cloneDeep(initialHydratedState),
      sites: [
        {
          siteCode: 'ABBY',
          tables: [
            { name: 't1', description: 'table 1', waitInterval: 60 },
            { name: 't2', description: 'table 2', waitInterval: 40 },
            { name: 't1', description: 'table 1', waitInterval: 60 },
          ],
        },
        {
          siteCode: 'BARR',
          tables: [
            { name: 't1', description: 'table 1 different description', waitInterval: 60 },
            { name: 't3', description: 'table 3', waitInterval: 100 },
          ],
        },
      ],
    };
    const expectedOutput = {
      t1: {
        name: 't1',
        description: 'table 1',
        waitInterval: 60,
        sites: ['ABBY', 'BARR'],
        tableCode: 'T1',
      },
      t2: {
        name: 't2',
        description: 'table 2',
        waitInterval: 40,
        sites: ['ABBY'],
        tableCode: 'T2',
      },
      t3: {
        name: 't3',
        description: 'table 3',
        waitInterval: 100,
        sites: ['BARR'],
        tableCode: 'T3',
      },
    };
    test('properly generates extracted tables object', () => {
      expect(extractTables(initialState)).toStrictEqual(expectedOutput);
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
  });
});
