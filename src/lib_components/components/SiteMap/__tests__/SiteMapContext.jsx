import { renderHook } from "@testing-library/react-hooks";

import cloneDeep from 'lodash/cloneDeep';
// import statesJSON from '../../../staticJSON/sites.json';

// Mock some functions within SiteMapUtils as they are called by functions we test here
// but are tested directly in the SiteMapUtils test suite
jest.mock('../SiteMapUtils', () => ({
  ...jest.requireActual('../SiteMapUtils'),
  calculateLocationsInBounds: jest.fn(),
}));

jest.mock('lodash/uniqueId');
import uniqueId from 'lodash/uniqueId';

import SiteMapContext, { getTestableItems } from '../SiteMapContext';

import {
  BASE_LAYERS,
  DEFAULT_STATE,
  FETCH_STATUS,
  FEATURES,
  FEATURE_TYPES,
  FEATURE_DATA_SOURCES,
  MAP_ZOOM_RANGE,
  SELECTION_PORTIONS,
  SITE_TERRAINS,
  SITE_LOCATION_HIERARCHIES_MIN_ZOOM,
  calculateLocationsInBounds,
} from '../SiteMapUtils';

const { useSiteMapContext } = SiteMapContext;

const {
  deriveRegionSelections,
  isSelectable,
  getSelectableSet,
  validateSelection,
  isBasePlot,
  zoomIsValid,
  centerIsValid,
  calculateFeatureDataFetches,
  updateMapTileWithZoom,
  completeOverallFetch,
  applyFeatureVisibilityToChildren,
  applyFeatureVisibilityToParents,
  setFetchStatusFromAction,
} = getTestableItems();

describe('SiteMap - SiteMapContext', () => {
  describe('useSiteMapContextState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useSiteMapContext());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('deriveRegionSelections()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
      state.neonContextHydrated = true;
      state.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY] = {
        S1: { sites: new Set(['SITE_A', 'SITE_B', 'SITE_C']) },
        S2: { sites: new Set(['SITE_D', 'SITE_E']) },
        S3: { sites: new Set(['SITE_F']) },
        S4: {},
      };
      state.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY] = {
        D1: { sites: new Set(['SITE_B']) },
        D2: { sites: new Set(['SITE_A', 'SITE_F']) },
        D3: { sites: new Set(['SITE_C', 'SITE_D', 'SITE_E']) },
      };
    });
    test('makes no changes to state when selection mode is anything but SITES', () => {
      state.selection.active = FEATURE_TYPES.DOMAINS.KEY;
      state.selection.set = new Set(['D1']);
      const newState = deriveRegionSelections(state);
      expect(newState).toStrictEqual(state);
    });
    test('makes no changes to state when Neon Context has not been hydrated', () => {
      state.neonContextHydrated = false;
      state.selection.active = FEATURE_TYPES.SITES.KEY;
      state.selection.set = new Set(['SITE_B', 'SITE_D']);
      const newState = deriveRegionSelections(state);
      expect(newState).toStrictEqual(state);
    });
    test('properly sets derived objects to empty when no intersections are present', () => {
      state.selection.active = FEATURE_TYPES.SITES.KEY;
      state.selection.set = new Set(['SITE_G']);
      state.selection.derived[FEATURES.STATES.KEY] = { S1: SELECTION_PORTIONS.TOTAL };
      state.selection.derived[FEATURES.DOMAINS.KEY] = { D2: SELECTION_PORTIONS.PARTIAL };
      const newState = deriveRegionSelections(state);
      expect(newState.selection.derived[FEATURES.STATES.KEY]).toStrictEqual({});
      expect(newState.selection.derived[FEATURES.DOMAINS.KEY]).toStrictEqual({});
    });
    test('properly derives STATES and DOMAINS region selections for the selected set', () => {
      state.selection.active = FEATURE_TYPES.SITES.KEY;
      state.selection.set = new Set(['SITE_B', 'SITE_D', 'SITE_G']);
      const newState = deriveRegionSelections(state);
      expect(newState.selection.derived[FEATURES.STATES.KEY]).toStrictEqual({
        S1: SELECTION_PORTIONS.PARTIAL,
        S2: SELECTION_PORTIONS.PARTIAL,
      });
      expect(newState.selection.derived[FEATURES.DOMAINS.KEY]).toStrictEqual({
        D1: SELECTION_PORTIONS.TOTAL,
        D3: SELECTION_PORTIONS.PARTIAL,
      });
    });
    test('properly derives STATES and DOMAINS region selections for selection and validSet', () => {
      state.selection.active = FEATURE_TYPES.SITES.KEY;
      state.selection.validSet = new Set(['SITE_A', 'SITE_C', 'SITE_D']);
      state.selection.set = new Set(['SITE_B', 'SITE_D']);
      const newState = deriveRegionSelections(state);
      expect(newState.selection.derived[FEATURES.STATES.KEY]).toStrictEqual({
        S2: SELECTION_PORTIONS.TOTAL,
      });
      expect(newState.selection.derived[FEATURES.DOMAINS.KEY]).toStrictEqual({
        D3: SELECTION_PORTIONS.PARTIAL,
      });
    });
  });

  describe('isSelectable()', () => {
    test('Returns true for any truthy item or 0 when no validSet is provided', () => {
      expect(isSelectable('foo')).toBe(true);
      expect(isSelectable(123)).toBe(true);
      expect(isSelectable(0)).toBe(true);
    });
    test('Returns true for any truthy item or 0 when provided validSet is not a set', () => {
      expect(isSelectable('foo', ['bar', 'qux'])).toBe(true);
      expect(isSelectable(123, 12345)).toBe(true);
    });
    test('Returns appropriate boolean when a validSet set is provided', () => {
      expect(isSelectable('foo', new Set(['foo', 'bar']))).toBe(true);
      expect(isSelectable('qux', new Set(['foo', 'bar']))).toBe(false);
      expect(isSelectable(0, new Set([0, 4, 7]))).toBe(true);
      expect(isSelectable(12, new Set([0, 4, 7]))).toBe(false);
    });
    test('Returns false for any non-zero falsey item regardless of validSet', () => {
      expect(isSelectable()).toBe(false);
      expect(isSelectable(null, new Set([null]))).toBe(false);
      expect(isSelectable(NaN, new Set([NaN, false]))).toBe(false);
    });
  });

  describe('getSelectableSet()', () => {
    test('returns an empty set if provided with something other than a set or array', () => {
      expect(getSelectableSet('foo')).toStrictEqual(new Set());
      expect(getSelectableSet()).toStrictEqual(new Set());
    });
    test('reflects set argument back if no validSet is provided', () => {
      const setArg = new Set(['a', 'b']);
      expect(getSelectableSet(setArg)).toStrictEqual(setArg);
    });
    test('reflects set argument back if validSet provided is not a set', () => {
      const setArg = new Set(['a', 'b']);
      expect(getSelectableSet(setArg)).toStrictEqual(setArg);
    });
    test('returns set of only selectable items when validSet is present and a set', () => {
      expect(getSelectableSet(
        new Set(['a', 'b']),
        new Set(['a']),
      )).toStrictEqual(new Set(['a']));
      expect(getSelectableSet(
        new Set(['a', 'b', 'c']),
        new Set(['b', 'c', 'd']),
      )).toStrictEqual(new Set(['b', 'c']));
      expect(getSelectableSet(
        new Set(['a', 'b', 'c']),
        new Set(['d', 'e', 'f']),
      )).toStrictEqual(new Set());
    });
    test('coerces array argument to be a set', () => {
      const setArg = ['a', 'b'];
      expect(getSelectableSet(['a', 'b'])).toStrictEqual(new Set(['a', 'b']));
      expect(getSelectableSet(
        ['a', 'b'],
        new Set(['a']),
      )).toStrictEqual(new Set(['a']));
      expect(getSelectableSet(
        ['a', 'b', 'c'],
        new Set(['b', 'c', 'd']),
      )).toStrictEqual(new Set(['b', 'c']));
      expect(getSelectableSet(
        ['a', 'b', 'c'],
        new Set(['d', 'e', 'f']),
      )).toStrictEqual(new Set());
    });
  });

  describe('validateSelection()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    });
    describe('no limits', () => {
      test('invalid if selection is empty', () => {
        state.selection.set = new Set();
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
      test('invalid if validSet exists with no selection intersection', () => {
        state.selection.set = new Set(['a', 'b', 'c']);
        state.selection.validSet = new Set(['d', 'e', 'f']);
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
      test('valid if selection non-empty and no defined validSet', () => {
        state.selection.set = new Set(['a']);
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(true);
      });
      test('invalid if selection non-empty and has items not in defined validSet', () => {
        state.selection.set = new Set(['a', 'd']);
        state.selection.validSet = new Set(['d', 'e', 'f']);
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
      test('valid if selection non-empty and is contained within defined validSet', () => {
        state.selection.set = new Set(['d']);
        state.selection.validSet = new Set(['d', 'e', 'f']);
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(true);
      });
    });
    describe('integer limit', () => {
      test('invalid if selection empty', () => {
        state.selection.set = new Set();
        state.selection.limit = 2;
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
      test('invalid if selection non-empty but not equal to limit', () => {
        state.selection.set = new Set(['a']);
        state.selection.limit = 2;
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
        newState.selection.set = new Set(['a', 'b', 'c']);
        newState.selection.valid = 'NOT SET';
        const newState2 = validateSelection(newState);
        expect(newState2.selection.valid).toBe(false);
      });
      test('valid if selection length matches limit with no defined validSet', () => {
        state.selection.set = new Set(['a', 'b']);
        state.selection.limit = 2;
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(true);
      });
      test('valid if selection length matches limit and is contained by defined validSet', () => {
        state.selection.set = new Set(['a', 'b']);
        state.selection.validSet = new Set(['a', 'b', 'c', 'd']);
        state.selection.limit = 2;
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(true);
      });
      test('invalid if selection length matches limit but is not contained by defined validSet', () => {
        state.selection.set = new Set(['b', 'f']);
        state.selection.validSet = new Set(['a', 'b', 'c', 'd']);
        state.selection.limit = 2;
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
    });
    describe('range limit', () => {
      test('invalid if selection empty', () => {
        state.selection.set = new Set();
        state.selection.limit = [2, 4];
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
      test('invalid if selection non-empty but not within limits', () => {
        state.selection.set = new Set(['a']);
        state.selection.limit = [2, 4];
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
        newState.selection.set = new Set(['a', 'b', 'c', 'd', 'e']);
        newState.selection.valid = 'NOT SET';
        const newState2 = validateSelection(newState);
        expect(newState2.selection.valid).toBe(false);
      });
      test('valid if selection length within limits with no defined validSet', () => {
        state.selection.set = new Set(['a', 'b', 'c']);
        state.selection.limit = [2, 4];
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(true);
      });
      test('valid if selection length within limits and is contained by defined validSet', () => {
        state.selection.set = new Set(['a', 'b']);
        state.selection.validSet = new Set(['a', 'b', 'c', 'd', 'e']);
        state.selection.limit = [2, 4];
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(true);
      });
      test('invalid if selection length matches limit but is not contained by defined validSet', () => {
        state.selection.set = new Set(['b', 'c', 'f']);
        state.selection.validSet = new Set(['a', 'b', 'c', 'd', 'e']);
        state.selection.limit = [2, 4];
        state.selection.valid = 'NOT SET';
        const newState = validateSelection(state);
        expect(newState.selection.valid).toBe(false);
      });
    });
  });

  describe('isBasePlot()', () => {
    test('returns true for base plot feature keys', () => {
      expect(isBasePlot(FEATURES.DISTRIBUTED_BASE_PLOTS.KEY)).toBe(true);
      expect(isBasePlot(FEATURES.TOWER_BASE_PLOTS.KEY)).toBe(true);
    });
    test('returns false for non-base plot feature keys', () => {
      expect(isBasePlot(FEATURES.TOWER_PHENOLOGY_PLOTS.KEY)).toBe(false);
      expect(isBasePlot(FEATURES.DISTRIBUTED_TICK_PLOTS.KEY)).toBe(false);
      expect(isBasePlot()).toBe(false);
    });
  });

  describe('zoomIsValid()', () => {
    test('returns true for all integers inclusively in the MAP_ZOOM_RANGE', () => {
      expect(zoomIsValid(MAP_ZOOM_RANGE[0])).toBe(true);
      expect(zoomIsValid(MAP_ZOOM_RANGE[1])).toBe(true);
      expect(zoomIsValid(MAP_ZOOM_RANGE[1] - 2)).toBe(true);
    });
    test('returns false for all non-integers', () => {
      expect(zoomIsValid()).toBe(false);
      expect(zoomIsValid(null)).toBe(false);
      expect(zoomIsValid(NaN)).toBe(false);
      expect(zoomIsValid(MAP_ZOOM_RANGE[0] + 0.1)).toBe(false);
    });
    test('returns false for integers outside of the MAP_ZOOM_RANGE', () => {
      expect(zoomIsValid(MAP_ZOOM_RANGE[0] - 1)).toBe(false);
      expect(zoomIsValid(MAP_ZOOM_RANGE[1] + 2)).toBe(false);
    });
  });

  describe('centerIsValid()', () => {
    test('returns false for anything not an array of length 2 containing only numbers', () => {
      expect(centerIsValid()).toBe(false);
      expect(centerIsValid(null)).toBe(false);
      expect(centerIsValid([])).toBe(false);
      expect(centerIsValid([10])).toBe(false);
      expect(centerIsValid([10, 20, 30])).toBe(false);
      expect(centerIsValid([10, NaN])).toBe(false);
    });
    test('returns true for any array of length 2 containing only numbers', () => {
      expect(centerIsValid([10, 20])).toBe(true);
      expect(centerIsValid([-40, -90])).toBe(true);
      expect(centerIsValid([0.56, -12.35])).toBe(true);
      expect(centerIsValid([-32000, 214155616])).toBe(true);
    });
  });

  describe('calculateFeatureDataFetches()', () => {
    let state;
    const {
      REST_LOCATIONS_API,
      ARCGIS_ASSETS_API,
      GRAPHQL_LOCATIONS_API,
    } = FEATURE_DATA_SOURCES;
    const {
      SITE_LOCATION_HIERARCHIES: { KEY: SITE_LOCATION_HIERARCHIES },
    } = FEATURE_TYPES;
    const {
      SAMPLING_BOUNDARIES: { KEY: SAMPLING_BOUNDARIES },
      WATERSHED_BOUNDARIES: { KEY: WATERSHED_BOUNDARIES },
      TOWER_AIRSHEDS: { KEY: TOWER_AIRSHEDS },
      POUR_POINTS: { KEY: POUR_POINTS },
      TOWERS: { KEY: TOWERS },
      TOWER_BASE_PLOTS: {
        KEY: TOWER_BASE_PLOTS,
        minZoom: TOWER_BASE_PLOTS_MINZOOM,
      },
      DISTRIBUTED_BASE_PLOTS: {
        KEY: DISTRIBUTED_BASE_PLOTS,
      },
      DISTRIBUTED_PLOTS: {
        minZoom: DISTRIBUTED_BASE_PLOTS_MINZOOM,
      },
      AQUATIC_STAFF_GAUGES: {
        KEY: AQUATIC_STAFF_GAUGES,
        minZoom: AQUATIC_STAFF_GAUGES_MINZOOM,
      },
      AQUATIC_SENSOR_STATIONS: {
        KEY: AQUATIC_SENSOR_STATIONS,
        minZoom: AQUATIC_SENSOR_STATIONS_MINZOOM,
      },
    } = FEATURES;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
      state.sites = {
        SA: { domainCode: 'D16', terrain: SITE_TERRAINS.TERRESTRIAL },
        SB: { domainCode: 'D01', terrain: SITE_TERRAINS.AQUATIC },
        SC: { domainCode: 'D19', terrain: SITE_TERRAINS.AQUATIC },
        SD: { domainCode: 'D16', terrain: SITE_TERRAINS.TERRESTRIAL },
        SE: { domainCode: 'D01', terrain: SITE_TERRAINS.TERRESTRIAL },
        SF: { domainCode: 'D01', terrain: SITE_TERRAINS.AQUATIC },
        SG: { domainCode: 'D20', terrain: SITE_TERRAINS.TERRESTRIAL },
        SH: { domainCode: 'D12', terrain: SITE_TERRAINS.AQUATIC },
      };
    });
    describe('without requiredSites argument', () => {
      test('takes no action on state if there are no sites in bounds', () => {
        calculateLocationsInBounds.mockReturnValue([]);
        const newState = calculateFeatureDataFetches(state);
        expect(newState).toStrictEqual(state);      
      });
      describe('SITE_LOCATION_HIERARCHIES', () => {
        test('applies no awaiting fetches if zoom is below minimum', () => {
          state.map.zoom = SITE_LOCATION_HIERARCHIES_MIN_ZOOM - 1;
          state.map.bounds = { lat: [-10, 10], lng: [-10, 10] };
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SG', 'SH']);
          const newState = calculateFeatureDataFetches(state);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES])
          ).toStrictEqual([]);
          expect(newState.overallFetch.expected).toBe(0);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(false);
        });
        test('applies awaiting fetches when zoom is at or above minimum', () => {
          state.map.zoom = SITE_LOCATION_HIERARCHIES_MIN_ZOOM;
          state.map.bounds = { lat: [-10, 10], lng: [-10, 10] };
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01 = FETCH_STATUS.FETCHING;
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SG', 'SH']);
          const newState = calculateFeatureDataFetches(state);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES])
          ).toStrictEqual(['D01', 'D20', 'D12']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D20
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D12
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(newState.overallFetch.expected).toBe(2);
          expect(newState.overallFetch.pendingHierarchy).toBe(2);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);
        });
      });
      describe('ARCGIS_ASSETS_API', () => {
        test('applies awaiting fetches for visible features', () => {
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SF']);
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01 = FETCH_STATUS.SUCCESS;
          state.filters.features.available[SAMPLING_BOUNDARIES] = true;
          state.filters.features.available[WATERSHED_BOUNDARIES] = true;
          state.filters.features.available[POUR_POINTS] = true;
          state.filters.features.available[TOWER_AIRSHEDS] = false;
          state.filters.features.visible[SAMPLING_BOUNDARIES] = true;
          state.filters.features.visible[WATERSHED_BOUNDARIES] = true;
          state.filters.features.visible[POUR_POINTS] = false;
          state.filters.features.visible[TOWER_AIRSHEDS] = true;
          state.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SE = FETCH_STATUS.FETCHING;
          const newState = calculateFeatureDataFetches(state);
          Object.keys(newState.featureDataFetches[ARCGIS_ASSETS_API])
            .filter((k) => ![SAMPLING_BOUNDARIES, WATERSHED_BOUNDARIES].includes(k))
            .forEach((k) => {
              expect(Object.keys(newState.featureDataFetches[ARCGIS_ASSETS_API][k])).toStrictEqual([]);
            });
          expect(
            Object.keys(newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES])
          ).toStrictEqual(['SE', 'SB', 'SF']);
          expect(
            Object.keys(newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES])
          ).toStrictEqual(['SB', 'SE', 'SF']);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SB
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SE
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SF
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES].SB
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES].SE
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES].SF
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(newState.overallFetch.expected).toBe(5);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);
        });
      });
      describe('REST_LOCATIONS_API', () => {
        test('applies awaiting fetches for visible features', () => {
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SF']);
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01 = FETCH_STATUS.SUCCESS;
          state.featureData[SITE_LOCATION_HIERARCHIES].SB = {
            TOWER123: { type: 'TOWER', parent: 'SB', description: 'foo tower 1' },
            'SB_060.basePlot.cfc': { type: 'OS Plot - cfc', parent: 'SB', description: 'foo plot' },
            TOWER456: { type: 'TOWER', parent: 'SB', description: 'foo tower 2' },
            HUT789: { type: 'HUT', parent: 'SB', description: 'foo hut' },
          };
          state.featureData[SITE_LOCATION_HIERARCHIES].SF = {
            TOWER987: { type: 'TOWER', parent: 'SF', description: 'foo tower 1' },
            'SB_070.basePlot.mos': { type: 'OS Plot - mos', parent: 'SF', description: 'foo plot' },
            HUT123: { type: 'HUT', parent: 'SF', description: 'foo hut' },
          };
          state.filters.features.available[TOWERS] = true;
          state.filters.features.visible[TOWERS] = true;
          state.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB = {
            TOWER456: FETCH_STATUS.FETCHING,
          };
          const newState = calculateFeatureDataFetches(state);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API])
          ).toStrictEqual([TOWERS, SITE_LOCATION_HIERARCHIES]);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS])
          ).toStrictEqual(['SB', 'SF']);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB)
          ).toStrictEqual(['TOWER456', 'TOWER123']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB.TOWER456
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB.TOWER123
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SF)
          ).toStrictEqual(['TOWER987']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SF.TOWER987
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(newState.overallFetch.expected).toBe(2);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);
        });
      });
      describe('GRAPHQL_LOCATIONS_API', () => {
        test('applies awaiting fetches for visible features', () => {
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SF']);
          uniqueId
            .mockReturnValueOnce('f_uid_1')
            .mockReturnValueOnce('f_uid_2')
            .mockReturnValueOnce('f_uid_3')
            .mockReturnValue('f_BAD');
          state.map.zoom = 15;
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01 = FETCH_STATUS.SUCCESS;
          delete state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM];
          state.featureData[SITE_LOCATION_HIERARCHIES].SB = {
            SENSTA123: { type: 'S1_LOC', parent: 'SB', description: 'aq sen station 1' },
            SENSTA456: { type: 'S2_LOC', parent: 'SB', description: 'aq sen station 2' },
            'SB_060.basePlot.cfc': { type: 'OS Plot - cfc', parent: 'SB', description: 'foo plot' },
            SG789: { type: 'STAFF_GAUGE', parent: 'SB', description: 'staff gauge 789' },
            BUOY123: { type: 'BUOY', parent: 'SB', description: 'foo buoy' },
          };
          state.featureData[SITE_LOCATION_HIERARCHIES].SF = {
            SENSTA789: { type: 'S1_LOC', parent: 'SB', description: 'aq sen station 1' },
            'SB_070.basePlot.mos': { type: 'OS Plot - mos', parent: 'SF', description: 'foo plot' },
            SG456: { type: 'STAFF_GAUGE', parent: 'SB', description: 'staff gauge 456' },
            SG012: { type: 'STAFF_GAUGE', parent: 'SB', description: 'staff gauge 012' },
          };
          state.filters.features.available[AQUATIC_STAFF_GAUGES] = true;
          state.filters.features.visible[AQUATIC_STAFF_GAUGES] = true;
          state.filters.features.available[AQUATIC_SENSOR_STATIONS] = true;
          state.filters.features.visible[AQUATIC_SENSOR_STATIONS] = true;
          state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SB = {
            features: {
              [AQUATIC_STAFF_GAUGES]: {
                fetchId: 'f12345',
                locations: ['SG789'],
              }
            },
            fetches: {
              f12345: {
                locations: ['SG789'],
                status: FETCH_STATUS.FETCHING,
              },
            },
          };
          const newState = calculateFeatureDataFetches(state);
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM])
          ).toStrictEqual(['SB', 'SF']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SB.features[AQUATIC_SENSOR_STATIONS]
          ).toStrictEqual({
            fetchId: 'f_uid_1',
            locations: ['SENSTA123', 'SENSTA456'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SB.fetches
          ).toStrictEqual({
            f_uid_1: {
              locations: ['SENSTA123', 'SENSTA456'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SF.features[AQUATIC_SENSOR_STATIONS]
          ).toStrictEqual({
            fetchId: 'f_uid_2',
            locations: ['SENSTA789'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SF.fetches
          ).toStrictEqual({
            f_uid_2: {
              locations: ['SENSTA789'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM])
          ).toStrictEqual(['SB', 'SF']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SB.features[AQUATIC_STAFF_GAUGES]
          ).toStrictEqual({
            fetchId: 'f12345',
            locations: ['SG789'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SB.fetches
          ).toStrictEqual({
            f12345: {
              locations: ['SG789'],
              status: FETCH_STATUS.FETCHING,
            },
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SF.features[AQUATIC_STAFF_GAUGES]
          ).toStrictEqual({
            fetchId: 'f_uid_3',
            locations: ['SG456', 'SG012'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SF.fetches
          ).toStrictEqual({
            f_uid_3: {
              locations: ['SG456', 'SG012'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(newState.overallFetch.expected).toBe(3);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);
        });
        test('applies awaiting fetches for visible features with companion keys', () => {
          calculateLocationsInBounds.mockReturnValue(['SA']);
          uniqueId
            .mockReturnValueOnce('f_uid_1')
            .mockReturnValueOnce('f_uid_2')
            .mockReturnValue('f_BAD');
          state.map.zoom = 18;
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D16 = FETCH_STATUS.SUCCESS;
          state.featureData[SITE_LOCATION_HIERARCHIES].SA = {
            BP001: { type: 'OS Plot - all', parent: 'SB', description: 'tower base plot 001' },
            DP003: { type: 'OS Plot - all', parent: 'SB', description: 'distributed base plot 003' },
          };
          state.filters.features.available[TOWER_BASE_PLOTS] = true;
          state.filters.features.visible[TOWER_BASE_PLOTS] = true;
          state.filters.features.available[DISTRIBUTED_BASE_PLOTS] = true;
          state.filters.features.visible[DISTRIBUTED_BASE_PLOTS] = false;
          const newState = calculateFeatureDataFetches(state);
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM])
          ).toStrictEqual(['SA']);
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM])
          ).toStrictEqual(['SA']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM].SA.features[TOWER_BASE_PLOTS]
          ).toStrictEqual({
            fetchId: 'f_uid_1',
            locations: ['BP001', 'DP003'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM].SA.fetches
          ).toStrictEqual({
            f_uid_1: {
              locations: ['BP001', 'DP003'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM].SA.features[DISTRIBUTED_BASE_PLOTS]
          ).toStrictEqual({
            fetchId: 'f_uid_1',
            locations: ['BP001', 'DP003'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM].SA.fetches
          ).toStrictEqual({});
          expect(newState.overallFetch.expected).toBe(1);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);          
        });
      });
    });
    describe('with requiredSites argument', () => {
      test('takes no action on state if there are no sites in bounds', () => {
        calculateLocationsInBounds.mockReturnValue([]);
        const newState = calculateFeatureDataFetches(state, ['SG', 'SC']);
        expect(newState).toStrictEqual(state);      
      });
      describe('SITE_LOCATION_HIERARCHIES', () => {
        test('applies no awaiting fetches if zoom is below minimum', () => {
          state.map.zoom = SITE_LOCATION_HIERARCHIES_MIN_ZOOM - 1;
          state.map.bounds = { lat: [-10, 10], lng: [-10, 10] };
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SG', 'SH']);
          const newState = calculateFeatureDataFetches(state, ['SG', 'SC']);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES])
          ).toStrictEqual([]);
          expect(newState.overallFetch.expected).toBe(0);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(false);
        });
        test('applies awaiting fetches when zoom is at or above minimum', () => {
          state.map.zoom = SITE_LOCATION_HIERARCHIES_MIN_ZOOM;
          state.map.bounds = { lat: [-10, 10], lng: [-10, 10] };
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01 = FETCH_STATUS.FETCHING;
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SG', 'SH']);
          const newState = calculateFeatureDataFetches(state, ['SG', 'SC']);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES])
          ).toStrictEqual(['D01', 'D20', 'D12', 'D19']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D20
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D12
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D19
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(newState.overallFetch.expected).toBe(3);
          expect(newState.overallFetch.pendingHierarchy).toBe(3);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);
        });
      });
    });
  });

  describe('updateMapTileWithZoom()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    });
    test('changes base layer to WORLD_IMAGERY when on NATGEO_WORLD_MAP and zooming to 17 or higher', () => {
      state.map.zoom = 17;
      state.map.baseLayer = BASE_LAYERS.NATGEO_WORLD_MAP.KEY;
      state.map.baseLayerAutoChangedAbove17 = false;
      let newState = updateMapTileWithZoom(state);
      expect(state.map.zoom).toBe(17);
      expect(state.map.baseLayer).toBe(BASE_LAYERS.WORLD_IMAGERY.KEY);
      expect(state.map.baseLayerAutoChangedAbove17).toBe(true);
      state.map.zoom = 20;
      state.map.baseLayer = BASE_LAYERS.NATGEO_WORLD_MAP.KEY;
      state.map.baseLayerAutoChangedAbove17 = false;
      newState = updateMapTileWithZoom(newState);
      expect(state.map.zoom).toBe(20);
      expect(state.map.baseLayer).toBe(BASE_LAYERS.WORLD_IMAGERY.KEY);
      expect(state.map.baseLayerAutoChangedAbove17).toBe(true);
    });
    test('changes base layer from WORLD_IMAGERY to WORLD_MAP when zooming below 17 if necessary', () => {
      state.map.zoom = 16;
      state.map.baseLayer = BASE_LAYERS.WORLD_IMAGERY.KEY;
      state.map.baseLayerAutoChangedAbove17 = true;
      const newState = updateMapTileWithZoom(state);
      expect(state.map.zoom).toBe(16);
      expect(state.map.baseLayer).toBe(BASE_LAYERS.NATGEO_WORLD_MAP.KEY);
      expect(state.map.baseLayerAutoChangedAbove17).toBe(false);
    });
    test('makes no changes when crossing the zoom threshold or higher if the map is anything but the special cases', () => {
      state.map.zoom = 16;
      state.map.baseLayer = BASE_LAYERS.WORLD_TOPO_MAP.KEY;
      state.map.baseLayerAutoChangedAbove17 = false;
      let newState = updateMapTileWithZoom(state);
      expect(state.map.zoom).toBe(16);
      expect(state.map.baseLayer).toBe(BASE_LAYERS.WORLD_TOPO_MAP.KEY);
      expect(state.map.baseLayerAutoChangedAbove17).toBe(false);
      newState.map.zoom = 18;
      newState = updateMapTileWithZoom(newState);
      expect(state.map.zoom).toBe(18);
      expect(state.map.baseLayer).toBe(BASE_LAYERS.WORLD_TOPO_MAP.KEY);
      expect(state.map.baseLayerAutoChangedAbove17).toBe(false);
      newState.map.zoom = 12;
      newState = updateMapTileWithZoom(newState);
      expect(state.map.zoom).toBe(12);
      expect(state.map.baseLayer).toBe(BASE_LAYERS.WORLD_TOPO_MAP.KEY);
      expect(state.map.baseLayerAutoChangedAbove17).toBe(false);
    });
  });

  describe('completeOverallFetch()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    });
    test('increments completed overall fetches without zeroing out if more are pending', () => {
      state.overallFetch = {
        expected: 12,
        completed: 4,
        pendingHierarchy: 2,
      };
      const newState = completeOverallFetch(state);
      expect(newState.overallFetch).toStrictEqual({
        expected: 12,
        completed: 5,
        pendingHierarchy: 2,
      });
    });
    test('increments completed overall fetches and zeroes out all if it was the last expected', () => {
      state.overallFetch = {
        expected: 12,
        completed: 11,
        pendingHierarchy: 1,
      };
      const newState = completeOverallFetch(state);
      expect(newState.overallFetch).toStrictEqual({
        expected: 0,
        completed: 0,
        pendingHierarchy: 0,
      });
    });
  });

  describe('applyFeatureVisibilityToChildren()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    });
    test('takes no action if argument visiblity matches current feature visiblity', () => {
      Object.keys(state.filters.features.visible).forEach((k) => {
        state.filters.features.visible[k] = false;
      });
      state.filters.features.visible[FEATURES.AQUATIC_AUTOMATED_INSTRUMENTS.KEY] = true;
      const newState = applyFeatureVisibilityToChildren(state, FEATURES.AQUATIC_AUTOMATED_INSTRUMENTS.KEY, true);
      expect(newState).toStrictEqual(state);
    });
    test('recursively applies true visiblity to children', () => {
      Object.keys(state.filters.features.visible).forEach((k) => {
        state.filters.features.visible[k] = false;
      });
      const newState = applyFeatureVisibilityToChildren(state, FEATURES.AQUATIC_SITE_FEATURES.KEY, true);
      expect(newState.filters.features.visible[FEATURES.AQUATIC_SITE_FEATURES.KEY]).toBe(true);
      expect(newState.filters.features.visible[FEATURES.AQUATIC_AUTOMATED_INSTRUMENTS.KEY]).toBe(true);
      expect(newState.filters.features.visible[FEATURES.AQUATIC_BUOYS.KEY]).toBe(true);
      expect(newState.filters.features.visible[FEATURES.HUTS.KEY]).toBe(false);
    });
    test('recursively applies false visiblity to children', () => {
      Object.keys(state.filters.features.visible).forEach((k) => {
        state.filters.features.visible[k] = true;
      });
      const newState = applyFeatureVisibilityToChildren(state, FEATURES.AQUATIC_SITE_FEATURES.KEY, false);
      expect(newState.filters.features.visible[FEATURES.AQUATIC_SITE_FEATURES.KEY]).toBe(false);
      expect(newState.filters.features.visible[FEATURES.AQUATIC_OBSERVATIONAL_SAMPLING.KEY]).toBe(false);
      expect(newState.filters.features.visible[FEATURES.AQUATIC_FISH_POINTS.KEY]).toBe(false);
      expect(newState.filters.features.visible[FEATURES.DOMAINS.KEY]).toBe(true);
    });
  });

  describe('applyFeatureVisibilityToParents()', () => {
    let state;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    }); 
    test('takes no action if the feature has no parent', () => {
      const newState = applyFeatureVisibilityToParents(state, FEATURES.DOMAINS.KEY);
      expect(newState).toStrictEqual(state);
    });
    test('recursively propagates a true up to any false parents', () => {
      Object.keys(state.filters.features.visible).forEach((k) => {
        state.filters.features.visible[k] = false;
      });
      state.filters.features.visible[FEATURES.DISTRIBUTED_TICK_PLOT_BOUNDARIES.KEY] = true;
      const newState = applyFeatureVisibilityToParents(state, FEATURES.DISTRIBUTED_TICK_PLOT_BOUNDARIES.KEY);
      expect(
        Object.keys(state.filters.features.visible)
          .filter((k) => state.filters.features.visible[k])
      ).toStrictEqual([
        FEATURES.TERRESTRIAL_SITE_FEATURES.KEY,
        FEATURES.PLOT_BOUNDARIES.KEY,
        FEATURES.DISTRIBUTED_TICK_PLOT_BOUNDARIES.KEY,
      ]);
    });
    test('does not recursively propagate a false up to any true parents', () => {
      Object.keys(state.filters.features.visible).forEach((k) => {
        state.filters.features.visible[k] = true;
      });
      state.filters.features.visible[FEATURES.DISTRIBUTED_TICK_PLOT_BOUNDARIES.KEY] = false;
      const newState = applyFeatureVisibilityToParents(state, FEATURES.DISTRIBUTED_TICK_PLOT_BOUNDARIES.KEY);
      expect(
        Object.keys(state.filters.features.visible)
          .filter((k) => !state.filters.features.visible[k])
      ).toStrictEqual([
        FEATURES.DISTRIBUTED_TICK_PLOT_BOUNDARIES.KEY,
      ]);
    });
  });

  describe('setFetchStatusFromAction()', () => {
    let state;
    const {
      REST_LOCATIONS_API,
      ARCGIS_ASSETS_API,
      GRAPHQL_LOCATIONS_API,
      NEON_CONTEXT,
    } = FEATURE_DATA_SOURCES;
    const {
      BOUNDARIES: { KEY: BOUNDARIES },
      LOCATIONS: { KEY: LOCATIONS },
      SAMPLING_POINTS: { KEY: SAMPLING_POINTS },
    } = FEATURE_TYPES;
    const {
      SAMPLING_BOUNDARIES: { KEY: SAMPLING_BOUNDARIES },
      WATERSHED_BOUNDARIES: { KEY: WATERSHED_BOUNDARIES },
      TOWERS: { KEY: TOWERS },
      HUTS: { KEY: HUTS, minZoom: HUTS_MINZOOM },
      TOWER_BASE_PLOTS: { KEY: TOWER_BASE_PLOTS, minZoom: TOWER_BASE_PLOTS_MINZOOM },
      DISTRIBUTED_BASE_PLOTS: { KEY: DISTRIBUTED_BASE_PLOTS },
      DISTRIBUTED_PLOTS: { minZoom: DISTRIBUTED_BASE_PLOTS_MINZOOM },
      TOWER_PHENOLOGY_PLOTS: { KEY: TOWER_PHENOLOGY_PLOTS },
      TOWER_PHENOLOGY_PLOT_BOUNDARIES: {
        KEY: TOWER_PHENOLOGY_PLOT_BOUNDARIES,
        minZoom: TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM,
      },
    } = FEATURES;
    beforeEach(() => {
      state = cloneDeep(DEFAULT_STATE);
    });
    test('does nothing for actions that do not specify a dataSource', () => {
      expect(
        setFetchStatusFromAction(
          state,
          { foo: 'bar' },
          FETCH_STATUS.ERROR,
        ),
      ).toStrictEqual(state);
    });
    test('does nothing for actions that specify an unsupported dataSource', () => {
      expect(
        setFetchStatusFromAction(
          state,
          { dataSource: null },
          FETCH_STATUS.ERROR,
        ),
      ).toStrictEqual(state);
      expect(
        setFetchStatusFromAction(
          state,
          { dataSource: NEON_CONTEXT },
          FETCH_STATUS.ERROR,
        ),
      ).toStrictEqual(state);
    });
    test('does nothing if not provided a FETCH_STATUS other than AWAITING_CALL', () => {
      expect(
        setFetchStatusFromAction(
          state,
          { dataSource: ARCGIS_ASSETS_API },
          FETCH_STATUS.AWAITING_CALL,
        ),
      ).toStrictEqual(state);
      expect(
        setFetchStatusFromAction(
          state,
          { dataSource: ARCGIS_ASSETS_API },
          null,
        ),
      ).toStrictEqual(state);
    });
    describe('ARCGIS_ASSETS_API', () => {
      test('does nothing unless action contains a featureKey/siteCode with an existing fetch', () => {
        state.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES] = {
          S1: FETCH_STATUS.AWAITING_CALL,
          S3: FETCH_STATUS.FETCHING,
        };
        let action = {
          dataSource: ARCGIS_ASSETS_API,
          featureKey: 'NOT REAL',
          siteCode: 'S1',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: ARCGIS_ASSETS_API,
          featureKey: WATERSHED_BOUNDARIES,
          siteCode: 'S1',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: ARCGIS_ASSETS_API,
          featureKey: SAMPLING_BOUNDARIES,
          siteCode: 'S4',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);        
      });
      test('applies only status if status is not SUCCESS', () => {
        state.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES] = {
          S1: FETCH_STATUS.AWAITING_CALL,
          S3: FETCH_STATUS.FETCHING,
        };
        const action = {
          dataSource: ARCGIS_ASSETS_API,
          featureKey: SAMPLING_BOUNDARIES,
          siteCode: 'S1',
          data: { foo: 'bar' },
        };
        const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR);
        expect(newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].S1).toBe(FETCH_STATUS.ERROR);
        expect(newState.featureData[BOUNDARIES][SAMPLING_BOUNDARIES])
          .toStrictEqual(state.featureData[BOUNDARIES][SAMPLING_BOUNDARIES]);
      });
      test('applies status and data if status is SUCCESS', () => {
        state.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES] = {
          S1: FETCH_STATUS.AWAITING_CALL,
          S3: FETCH_STATUS.FETCHING,
        };
        const action = {
          dataSource: ARCGIS_ASSETS_API,
          featureKey: SAMPLING_BOUNDARIES,
          siteCode: 'S1',
          data: { foo: 'bar' },
        };
        const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
        expect(newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].S1).toBe(FETCH_STATUS.SUCCESS);
        expect(Object.keys(newState.featureData[BOUNDARIES][SAMPLING_BOUNDARIES])).toStrictEqual(['S1']);
        expect(newState.featureData[BOUNDARIES][SAMPLING_BOUNDARIES].S1).toStrictEqual(action.data);        
      });
    });
    describe('REST_LOCATIONS_API', () => {
      test('does nothing unless action contains a featureKey/siteCode/location with an existing fetch', () => {
        state.featureDataFetches[REST_LOCATIONS_API][TOWERS] = {
          S1: {
            TA: FETCH_STATUS.AWAITING_CALL,
          },
          S3: {
            TB: FETCH_STATUS.FETCHING,
            TC: FETCH_STATUS.FETCHING,
          },
        };
        let action = {
          dataSource: REST_LOCATIONS_API,
          featureKey: 'NOT REAL',
          siteCode: 'S1',
          location: 'TA',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: REST_LOCATIONS_API,
          featureKey: WATERSHED_BOUNDARIES,
          siteCode: 'S1',
          location: 'TA',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: REST_LOCATIONS_API,
          featureKey: TOWERS,
          siteCode: 'S4',
          location: 'TB',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: REST_LOCATIONS_API,
          featureKey: TOWERS,
          siteCode: 'S3',
          location: 'TA',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
      });
      test('applies only status if status is not SUCCESS', () => {
        state.featureDataFetches[REST_LOCATIONS_API][TOWERS] = {
          S1: {
            TA: FETCH_STATUS.AWAITING_CALL,
          },
          S3: {
            TB: FETCH_STATUS.FETCHING,
            TC: FETCH_STATUS.FETCHING,
          },
        };
        const action = {
          dataSource: REST_LOCATIONS_API,
          featureKey: TOWERS,
          siteCode: 'S3',
          location: 'TC',
        };
        const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR);
        expect(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].S3.TC).toBe(FETCH_STATUS.ERROR);
        expect(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].S3.TB).toBe(FETCH_STATUS.FETCHING);
        expect(newState.featureData[LOCATIONS][TOWERS])
          .toStrictEqual(state.featureData[LOCATIONS][TOWERS]);        
      });
      test('applies status and data if status is SUCCESS', () => {
        state.sites = {
          S1: { stateCode: 'CO', domainCode: 'D14' },
          S3: { stateCode: 'PR', domainCode: 'D09' },
        };
        state.featureDataFetches[REST_LOCATIONS_API][TOWERS] = {
          S1: {
            TA: FETCH_STATUS.AWAITING_CALL,
          },
          S3: {
            TB: FETCH_STATUS.FETCHING,
            TC: FETCH_STATUS.FETCHING,
          },
        };
        const action = {
          dataSource: REST_LOCATIONS_API,
          featureKey: TOWERS,
          siteCode: 'S3',
          location: 'TC',
          data: { foo: 'bar' },
        };
        const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
        expect(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].S3.TC).toBe(FETCH_STATUS.SUCCESS);
        expect(Object.keys(newState.featureData[LOCATIONS][TOWERS].S3)).toStrictEqual(['TC']);
        expect(newState.featureData[LOCATIONS][TOWERS].S3.TC).toStrictEqual({
          ...action.data,
          siteCode: 'S3',
          featureKey: TOWERS,
          name: 'TC',
          domainCode: 'D09',
          stateCode: 'PR',
        });
      });
    });
    describe('GRAPHQL_LOCATIONS_API', () => {
      test('does nothing unless action contains a minZoom/siteCode/fetchId with an existing fetch', () => {
        state.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM] = {
          S1: {
            features: {
              [HUTS]: { fetchId: 'f1', locations: ['HUT1'] },
            },
            fetches: {
              f1: { locations: ['HUT1'], status: FETCH_STATUS.AWAITING_CALL },
            },
          },
          S3: {
            features: {
              [HUTS]: { fetchId: 'f2', locations: ['HUT2'] },
            },
            fetches: {
              f2: { locations: ['HUT2'], status: FETCH_STATUS.AWAITING_CALL },
            },
          },
        };
        let action = {
          dataSource: GRAPHQL_LOCATIONS_API,
          minZoom: 0,
          siteCode: 'S1',
          fetchId: 'f1',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: GRAPHQL_LOCATIONS_API,
          minZoom: HUTS_MINZOOM,
          siteCode: 'S4',
          fetchId: 'f1',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);
        action = {
          dataSource: GRAPHQL_LOCATIONS_API,
          minZoom: HUTS_MINZOOM,
          siteCode: 'S1',
          fetchId: 'f2',
        };
        expect(setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR)).toStrictEqual(state);     
      });
      test('applies only status if status is not SUCCESS', () => {
        state.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM] = {
          S3: {
            features: {
              [HUTS]: { fetchId: 'f2', locations: ['HUT2'] },
            },
            fetches: {
              f2: { locations: ['HUT2'], status: FETCH_STATUS.AWAITING_CALL },
            },
          },
        };
        const action = {
          dataSource: GRAPHQL_LOCATIONS_API,
          minZoom: HUTS_MINZOOM,
          siteCode: 'S3',
          fetchId: 'f2',
        };
        const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.ERROR);
        expect(
          newState.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM].S3.fetches.f2.status
        ).toBe(FETCH_STATUS.ERROR);
      });
      describe('applies status and data if status is SUCCESS', () => {
        test('correctly handles multiple features at the same zoom level', () => {
          if (HUTS_MINZOOM !== DISTRIBUTED_BASE_PLOTS_MINZOOM) {
            throw `This test is broken! It relies on two features with the same minZoom,
expecting HUTS and DISTRIBUTED_BASE_PLOTS to match. One or both of those must have changed
and so this test must be updated.`;
          }
          state.sites = {
            S3: { stateCode: 'PR', domainCode: 'D09' },
          };
          state.featureData[FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY].S3 = {
            'DBP1.foo.brd': { description: 'brd' },
            'DBP1.foo.tck': { description: 'tck' },
            'DBP1.foo.not': { description: 'not' },
            'TBP2.foo.mfb': { description: 'mfb' },
            'TBP2.foo.vst': { description: 'vst' },
            'TBP2.foo.bet': { description: 'bet' },
          };
          state.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM] = {
            S3: {
              features: {
                [HUTS]: { fetchId: 'f2', locations: ['HUT2'] },
                [DISTRIBUTED_BASE_PLOTS]: { fetchId: 'f2', locations: ['DBP1.foo.all', 'TBP2.foo.all'] },
                BAD_FEATURE: { fetchId: 'f2', locations: ['BAD1'] },
              },
              fetches: {
                f2: {
                  locations: ['HUT2', 'DBP1.foo.all', 'TBP2.foo.all', 'BAD1'],
                  status: FETCH_STATUS.FETCHING,
                },
              },
            },
          };
          // mimic geometry that was already fetched
          state.featureData[LOCATIONS][TOWER_BASE_PLOTS] = {
            S3: {
              ['TBP2.foo.all']: {
                geometry: {
                  coordinates: [[3, 4], [5, 6], [7, 9], [3, 9]],
                },
              },
            },
          };
          const action = {
            dataSource: GRAPHQL_LOCATIONS_API,
            minZoom: HUTS_MINZOOM,
            siteCode: 'S3',
            fetchId: 'f2',
            data: {
              HUT2: { name: 'foo', },
              'DBP1.foo.all': { name: 'bar', plotType: 'distributed' },
              'TBP2.foo.all': { name: 'qux', plotType: 'tower' },
              BAD1: { name: 'bad', },
            },
          };
          const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
          expect(
            newState.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM].S3.fetches.f2.status
          ).toBe(FETCH_STATUS.SUCCESS);
          expect(newState.featureData[LOCATIONS][HUTS].S3.HUT2).toStrictEqual({
            name: 'foo',
            featureKey: HUTS,
            stateCode: 'PR',
            domainCode: 'D09',
          });
          expect(newState.featureData[LOCATIONS][DISTRIBUTED_BASE_PLOTS].S3['DBP1.foo.all']).toStrictEqual({
            name: 'bar',
            featureKey: DISTRIBUTED_BASE_PLOTS,
            plotType: 'distributed',
            stateCode: 'PR',
            domainCode: 'D09',
            samplingModules: ['brd', 'tck'],
          });
          expect(newState.featureData[LOCATIONS][TOWER_BASE_PLOTS].S3['TBP2.foo.all']).toStrictEqual({
            name: 'qux',
            featureKey: TOWER_BASE_PLOTS,
            plotType: 'tower',
            stateCode: 'PR',
            domainCode: 'D09',
            samplingModules: ['bet', 'vst'],
            geometry: {
              coordinates: [[3, 4], [5, 6], [7, 9], [3, 9]],
            },
          });
        });
        test('correctly handles sub-location data being piped up to parent locations', () => {
          state.sites = {
            S3: { stateCode: 'PR', domainCode: 'D09' },
          };
          state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM] = {
            S3: {
              features: {
                [TOWER_PHENOLOGY_PLOT_BOUNDARIES]: {
                  fetchId: 'f7',
                  locations: ['TPP1.phe.NW', 'TPP1.phe.SE', 'TPP1.phe.XX', 'TPP1.phe.SW'],
                },
              },
              fetches: {
                f7: {
                  locations: ['TPP1.phe.NW', 'TPP1.phe.SE', 'TPP1.phe.XX', 'TPP1.phe.SW'],
                  status: FETCH_STATUS.FETCHING,
                },
              },
            },
          };
          const action = {
            dataSource: GRAPHQL_LOCATIONS_API,
            minZoom: TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM,
            siteCode: 'S3',
            fetchId: 'f7',
            data: {
              'TPP1.phe.NW': { name: 'foo', parent: 'TPP1.foo.all', latitude: 10, longitude: 14 },
              'TPP1.phe.SE': { name: 'bar', parent: 'TPP1.foo.all', latitude: 13, longitude: 17 },
              'TPP1.phe.XX': { name: 'qux', parent: 'TPP1.foo.all', latitude: 25, longitude: 75 },
              'TPP1.phe.SW': { name: 'no parent', latitude: 38, longitude: 72 },
            },
          };
          const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
          expect(
            newState.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM].S3.fetches.f7.status
          ).toBe(FETCH_STATUS.SUCCESS);
          expect(newState.featureData[LOCATIONS][TOWER_PHENOLOGY_PLOTS].S3['TPP1.foo.all']).toStrictEqual({
            geometry: {
              coordinates: [[10, 14], [], [13, 17], []],
            },
          });
        });
      });
    });
  });
});
