/* eslint max-len: 0 */
import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

import uniqueId from 'lodash/uniqueId';

import SiteMapContext, { getTestableItems } from '../SiteMapContext';

import {
  BASE_LAYERS,
  FETCH_STATUS,
  FEATURES,
  FEATURE_TYPES,
  FEATURE_DATA_SOURCES,
  MANUAL_LOCATION_TYPES,
  MAP_MOUSE_MODES,
  MAP_ZOOM_RANGE,
  MIN_TABLE_MAX_BODY_HEIGHT,
  OBSERVATORY_CENTER,
  OVERLAYS,
  SELECTION_PORTIONS,
  SITE_TERRAINS,
  SITE_LOCATION_HIERARCHIES_MIN_ZOOM,
  VIEWS,
  getDefaultState,
  boundsAreValid,
  calculateLocationsInBounds,
  deriveFullObservatoryZoomLevel,
  hydrateNeonContextData,
  getMapStateForFocusLocation,
  getZoomedIcons,
} from '../SiteMapUtils';

// Mock some functions within SiteMapUtils as they are called by functions we test here
// but are tested directly in the SiteMapUtils test suite
jest.mock('../SiteMapUtils', () => ({
  ...jest.requireActual('../SiteMapUtils'),
  boundsAreValid: jest.fn(),
  calculateLocationsInBounds: jest.fn(),
  deriveFullObservatoryZoomLevel: jest.fn(),
  hydrateNeonContextData: jest.fn(),
  getMapStateForFocusLocation: jest.fn(),
  getZoomedIcons: jest.fn(),
}));

jest.mock('lodash/uniqueId');

const { Provider, useSiteMapContext } = SiteMapContext;

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
  reducer,
} = getTestableItems();

describe('SiteMap - SiteMapContext', () => {
  describe('Provider', () => {
    test('renders with no props', () => {
      const tree = renderer
        .create((
          <Provider>
            <div>children</div>
          </Provider>
        ))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('useSiteMapContextState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useSiteMapContext());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(getDefaultState());
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('deriveRegionSelections()', () => {
    let state;
    beforeEach(() => {
      state = getDefaultState();
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
      state = getDefaultState();
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
      state = getDefaultState();
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
      test('only acts on subset of sites if manualLocationData contains prototype sites', () => {
        calculateLocationsInBounds.mockReturnValue(['SB']);
        state.manualLocationData = [
          { manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE, siteCode: 'SB' },
          { manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE, siteCode: 'FOO' },
        ];
        state.map.zoom = SITE_LOCATION_HIERARCHIES_MIN_ZOOM;
        state.map.bounds = { lat: [-10, 10], lng: [-10, 10] };
        const newState = calculateFeatureDataFetches(state);
        expect(
          Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES]),
        ).toStrictEqual(['D01']);
        expect(
          newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01,
        ).toBe(FETCH_STATUS.AWAITING_CALL);
        expect(newState.overallFetch.expected).toBe(1);
        expect(newState.overallFetch.pendingHierarchy).toBe(1);
        expect(newState.featureDataFetchesHasAwaiting).toBe(true);
      });
      describe('SITE_LOCATION_HIERARCHIES', () => {
        test('applies no awaiting fetches if zoom is below minimum', () => {
          state.map.zoom = SITE_LOCATION_HIERARCHIES_MIN_ZOOM - 1;
          state.map.bounds = { lat: [-10, 10], lng: [-10, 10] };
          calculateLocationsInBounds.mockReturnValue(['SB', 'SE', 'SG', 'SH']);
          const newState = calculateFeatureDataFetches(state);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES]),
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
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES]),
          ).toStrictEqual(['D01', 'D20', 'D12']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01,
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D20,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D12,
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
            Object.keys(newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES]),
          ).toStrictEqual(['SE', 'SB', 'SF']);
          expect(
            Object.keys(newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES]),
          ).toStrictEqual(['SB', 'SE', 'SF']);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SB,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SE,
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][SAMPLING_BOUNDARIES].SF,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES].SB,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES].SE,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[ARCGIS_ASSETS_API][WATERSHED_BOUNDARIES].SF,
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
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API]),
          ).toStrictEqual([TOWERS, SITE_LOCATION_HIERARCHIES]);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS]),
          ).toStrictEqual(['SB', 'SF']);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB),
          ).toStrictEqual(['TOWER456', 'TOWER123']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB.TOWER456,
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SB.TOWER123,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SF),
          ).toStrictEqual(['TOWER987']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][TOWERS].SF.TOWER987,
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
              },
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
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM]),
          ).toStrictEqual(['SB', 'SF']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SB.features[AQUATIC_SENSOR_STATIONS],
          ).toStrictEqual({
            fetchId: 'f_uid_1',
            locations: ['SENSTA123', 'SENSTA456'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SB.fetches,
          ).toStrictEqual({
            f_uid_1: {
              locations: ['SENSTA123', 'SENSTA456'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SF.features[AQUATIC_SENSOR_STATIONS],
          ).toStrictEqual({
            fetchId: 'f_uid_2',
            locations: ['SENSTA789'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_SENSOR_STATIONS_MINZOOM].SF.fetches,
          ).toStrictEqual({
            f_uid_2: {
              locations: ['SENSTA789'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM]),
          ).toStrictEqual(['SB', 'SF']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SB.features[AQUATIC_STAFF_GAUGES],
          ).toStrictEqual({
            fetchId: 'f12345',
            locations: ['SG789'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SB.fetches,
          ).toStrictEqual({
            f12345: {
              locations: ['SG789'],
              status: FETCH_STATUS.FETCHING,
            },
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SF.features[AQUATIC_STAFF_GAUGES],
          ).toStrictEqual({
            fetchId: 'f_uid_3',
            locations: ['SG456', 'SG012'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][AQUATIC_STAFF_GAUGES_MINZOOM].SF.fetches,
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
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM]),
          ).toStrictEqual(['SA']);
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM]),
          ).toStrictEqual(['SA']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM].SA.features[TOWER_BASE_PLOTS],
          ).toStrictEqual({
            fetchId: 'f_uid_1',
            locations: ['BP001', 'DP003'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM].SA.fetches,
          ).toStrictEqual({
            f_uid_1: {
              locations: ['BP001', 'DP003'],
              status: FETCH_STATUS.AWAITING_CALL,
            },
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM].SA.features[DISTRIBUTED_BASE_PLOTS],
          ).toStrictEqual({
            fetchId: 'f_uid_1',
            locations: ['BP001', 'DP003'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM].SA.fetches,
          ).toStrictEqual({});
          expect(newState.overallFetch.expected).toBe(1);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(true);
        });
        test('applies awaiting fetches for visible features with companion keys, respecting existing fetches', () => {
          calculateLocationsInBounds.mockReturnValue(['SA']);
          uniqueId
            .mockReturnValueOnce('f_uid_1')
            .mockReturnValueOnce('f_uid_2')
            .mockReturnValue('f_BAD');
          state.map.zoom = 18;
          state.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D16 = FETCH_STATUS.SUCCESS;
          state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM] = {
            SA: {
              features: {
                [DISTRIBUTED_BASE_PLOTS]: {
                  fetchId: 'f_uid_0',
                  locations: ['BP001', 'DP003'],
                },
              },
              fetches: {
                fetchId: 'f_uid_0',
                locations: ['BP001', 'DP003'],
                status: FETCH_STATUS.AWAITING_CALL,
              },
            },
          };
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
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM]),
          ).toStrictEqual(['SA']);
          expect(
            Object.keys(state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM]),
          ).toStrictEqual(['SA']);
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM].SA.features[TOWER_BASE_PLOTS],
          ).toStrictEqual({
            fetchId: 'f_uid_0',
            locations: ['BP001', 'DP003'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_BASE_PLOTS_MINZOOM].SA.fetches,
          ).toStrictEqual({});
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM].SA.features[DISTRIBUTED_BASE_PLOTS],
          ).toStrictEqual({
            fetchId: 'f_uid_0',
            locations: ['BP001', 'DP003'],
          });
          expect(
            state.featureDataFetches[GRAPHQL_LOCATIONS_API][DISTRIBUTED_BASE_PLOTS_MINZOOM].SA.fetches,
          ).toStrictEqual({
            fetchId: 'f_uid_0',
            status: FETCH_STATUS.AWAITING_CALL,
            locations: ['BP001', 'DP003'],
          });
          expect(newState.overallFetch.expected).toBe(0);
          expect(newState.overallFetch.pendingHierarchy).toBe(0);
          expect(newState.featureDataFetchesHasAwaiting).toBe(false);
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
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES]),
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
            Object.keys(newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES]),
          ).toStrictEqual(['D01', 'D20', 'D12', 'D19']);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D01,
          ).toBe(FETCH_STATUS.FETCHING);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D20,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D12,
          ).toBe(FETCH_STATUS.AWAITING_CALL);
          expect(
            newState.featureDataFetches[REST_LOCATIONS_API][SITE_LOCATION_HIERARCHIES].D19,
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
      state = getDefaultState();
    });
    test('changes base layer to WORLD_IMAGERY when on NATGEO_WORLD_MAP and zooming to 17 or higher', () => {
      state.map.zoom = 17;
      state.map.baseLayer = BASE_LAYERS.NATGEO_WORLD_MAP.KEY;
      state.map.baseLayerAutoChangedAbove17 = false;
      let newState = updateMapTileWithZoom(state);
      expect(newState.map.zoom).toBe(17);
      expect(newState.map.baseLayer).toBe(BASE_LAYERS.WORLD_IMAGERY.KEY);
      expect(newState.map.baseLayerAutoChangedAbove17).toBe(true);
      newState.map.zoom = 20;
      newState.map.baseLayer = BASE_LAYERS.NATGEO_WORLD_MAP.KEY;
      newState.map.baseLayerAutoChangedAbove17 = false;
      newState = updateMapTileWithZoom(newState);
      expect(newState.map.zoom).toBe(20);
      expect(newState.map.baseLayer).toBe(BASE_LAYERS.WORLD_IMAGERY.KEY);
      expect(newState.map.baseLayerAutoChangedAbove17).toBe(true);
    });
    test('changes base layer from WORLD_IMAGERY to WORLD_MAP when zooming below 17 if necessary', () => {
      state.map.zoom = 16;
      state.map.baseLayer = BASE_LAYERS.WORLD_IMAGERY.KEY;
      state.map.baseLayerAutoChangedAbove17 = true;
      const newState = updateMapTileWithZoom(state);
      expect(newState.map.zoom).toBe(16);
      expect(newState.map.baseLayer).toBe(BASE_LAYERS.NATGEO_WORLD_MAP.KEY);
      expect(newState.map.baseLayerAutoChangedAbove17).toBe(false);
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
      state = getDefaultState();
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
      state = getDefaultState();
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
      state = getDefaultState();
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
        Object.keys(newState.filters.features.visible)
          .filter((k) => newState.filters.features.visible[k]),
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
        Object.keys(newState.filters.features.visible)
          .filter((k) => !newState.filters.features.visible[k]),
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
    } = FEATURE_TYPES;
    const {
      SAMPLING_BOUNDARIES: { KEY: SAMPLING_BOUNDARIES },
      WATERSHED_BOUNDARIES: { KEY: WATERSHED_BOUNDARIES },
      TOWERS: { KEY: TOWERS },
      HUTS: { KEY: HUTS, minZoom: HUTS_MINZOOM },
      TOWER_BASE_PLOTS: { KEY: TOWER_BASE_PLOTS },
      DISTRIBUTED_BASE_PLOTS: { KEY: DISTRIBUTED_BASE_PLOTS },
      DISTRIBUTED_PLOTS: { minZoom: DISTRIBUTED_BASE_PLOTS_MINZOOM },
      TOWER_PHENOLOGY_PLOTS: { KEY: TOWER_PHENOLOGY_PLOTS },
      TOWER_PHENOLOGY_PLOT_BOUNDARIES: {
        KEY: TOWER_PHENOLOGY_PLOT_BOUNDARIES,
        minZoom: TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM,
      },
    } = FEATURES;
    beforeEach(() => {
      state = getDefaultState();
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
          newState.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM].S3.fetches.f2.status,
        ).toBe(FETCH_STATUS.ERROR);
      });
      describe('applies status and data if status is SUCCESS', () => {
        test('correctly handles multiple features at the same zoom level', () => {
          if (HUTS_MINZOOM !== DISTRIBUTED_BASE_PLOTS_MINZOOM) {
            throw new Error(`This test is broken! It relies on two features with the same minZoom,
expecting HUTS and DISTRIBUTED_BASE_PLOTS to match. One or both of those must have changed
and so this test must be updated.`);
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
              'TBP2.foo.all': {
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
              HUT2: { name: 'foo' },
              'DBP1.foo.all': { name: 'bar', plotType: 'distributed' },
              'TBP2.foo.all': { name: 'qux', plotType: 'tower' },
              BAD1: { name: 'bad' },
            },
          };
          const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
          expect(
            newState.featureDataFetches[GRAPHQL_LOCATIONS_API][HUTS_MINZOOM].S3.fetches.f2.status,
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
                  locations: ['TPP1.phe.NW', 'TPP1.phe.SE', 'TPP1.phe.NE', 'TPP1.phe.SW'],
                },
              },
              fetches: {
                f7: {
                  locations: ['TPP1.phe.NW', 'TPP1.phe.SE', 'TPP1.phe.NE', 'TPP1.phe.SW'],
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
              'TPP1.phe.NW': {
                name: 'foo', parent: 'TPP1.foo.all', latitude: 10, longitude: 14,
              },
              'TPP1.phe.SE': {
                name: 'bar', parent: 'TPP1.foo.all', latitude: 13, longitude: 17,
              },
              'TPP1.phe.NE': {
                name: 'qux', parent: 'TPP1.foo.all', latitude: 25, longitude: 75,
              },
              'TPP1.phe.SW': {
                name: 'quo', parent: 'TPP1.foo.all', latitude: 38, longitude: 72
              },
            },
          };
          const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
          expect(
            newState.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM].S3.fetches.f7.status,
          ).toBe(FETCH_STATUS.SUCCESS);
          expect(newState.featureData[LOCATIONS][TOWER_PHENOLOGY_PLOTS].S3['TPP1.foo.all']).toStrictEqual({
            geometry: {
              coordinates: [[10, 14], [25, 75], [13, 17], [38, 72]],
            },
          });
        });
        test('correctly handles sub-location data being piped up to parent locations, invalid', () => {
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
              'TPP1.phe.NW': {
                name: 'foo', parent: 'TPP1.foo.all', latitude: 10, longitude: 14,
              },
              'TPP1.phe.SE': {
                name: 'bar', parent: 'TPP1.foo.all', latitude: 13, longitude: 17,
              },
              'TPP1.phe.XX': {
                name: 'qux', parent: 'TPP1.foo.all', latitude: 25, longitude: 75,
              },
              'TPP1.phe.SW': { name: 'no parent', latitude: 38, longitude: 72 },
            },
          };
          const newState = setFetchStatusFromAction(state, action, FETCH_STATUS.SUCCESS);
          expect(
            newState.featureDataFetches[GRAPHQL_LOCATIONS_API][TOWER_PHENOLOGY_PLOT_BOUNDARIES_MINZOOM].S3.fetches.f7.status,
          ).toBe(FETCH_STATUS.SUCCESS);
          expect(newState.featureData[LOCATIONS][TOWER_PHENOLOGY_PLOTS].S3['TPP1.foo.all']).toStrictEqual({
            hasIncompleteValidSamplingPoints: true,
            geometry: {
              coordinates: [],
            },
          });
        });
      });
    });
  });

  describe('reducer()', () => {
    let state;
    beforeEach(() => {
      state = getDefaultState();
    });
    test('does nothing if passed an unsupported action type', () => {
      expect(reducer(state, { type: 'invalidActionType' })).toStrictEqual(state);
    });
    describe('setView', () => {
      test('does nothing if passed an invalid view', () => {
        expect(
          reducer(state, { type: 'setView' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setView', view: 'INVALID_VIEW' }),
        ).toStrictEqual(state);
      });
      test('applies view if valid', () => {
        const newState = reducer(state, { type: 'setView', view: VIEWS.TABLE });
        expect(newState.view.current).toBe(VIEWS.TABLE);
      });
    });
    describe('setViewInitialized', () => {
      test('does nothing if current view is not valid (somehow)', () => {
        state.view.current = 'INVALID_VIEW';
        const newState = reducer(state, { type: 'setViewInitialized' });
        expect(newState.view.current).toBe('INVALID_VIEW');
        Object.keys(newState.view.initialized).forEach((view) => {
          expect(newState.view.initialized[view]).toBe(false);
        });
      });
      test('initializes only the current view (if valid)', () => {
        state.view.current = VIEWS.TABLE;
        const newState = reducer(state, { type: 'setViewInitialized' });
        expect(newState.view.current).toBe(VIEWS.TABLE);
        Object.keys(newState.view.initialized).forEach((view) => {
          expect(newState.view.initialized[view]).toBe(view === VIEWS.TABLE);
        });
      });
    });
    describe('setAspectRatio', () => {
      test('does nothing if action ascpectRatio is not a positive number', () => {
        expect(
          reducer(state, { type: 'setAspectRatio' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setAspectRatio', aspectRatio: 'foo' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setAspectRatio', aspectRatio: 0 }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setAspectRatio', aspectRatio: -1.5 }),
        ).toStrictEqual(state);
      });
      test('applies aspectRatio if valid, optionally taking up widthReference', () => {
        let newState = reducer(state, { type: 'setAspectRatio', aspectRatio: 1.5 });
        expect(newState.aspectRatio.currentValue).toBe(1.5);
        expect(newState.aspectRatio.widthReference).toBe(0);
        expect(newState.table.maxBodyHeightUpdateFromAspectRatio).toBe(true);
        newState = reducer(state, { type: 'setAspectRatio', aspectRatio: 1.5, widthReference: 60 });
        expect(newState.aspectRatio.currentValue).toBe(1.5);
        expect(newState.aspectRatio.widthReference).toBe(60);
        expect(newState.table.maxBodyHeightUpdateFromAspectRatio).toBe(true);
      });
    });
    describe('setAspectRatioResizeEventListenerInitialized', () => {
      test('flips the bit', () => {
        const newState = reducer(state, { type: 'setAspectRatioResizeEventListenerInitialized' });
        expect(newState.aspectRatio.resizeEventListenerInitialized).toBe(true);
      });
    });
    describe('hydrateNeonContextData', () => {
      test('does nothing if action is missing neonContextData', () => {
        hydrateNeonContextData.mockReset();
        const newState = reducer(state, { type: 'hydrateNeonContextData' });
        expect(newState).toStrictEqual(state);
        expect(hydrateNeonContextData).not.toHaveBeenCalled();
      });
      test('invokes hydrateNeonContextData()', () => {
        hydrateNeonContextData.mockReset();
        reducer(
          state,
          { type: 'hydrateNeonContextData', neonContextData: { foo: 'bar' } },
        );
        expect(hydrateNeonContextData).toHaveBeenCalledTimes(1);
        expect(hydrateNeonContextData).toHaveBeenCalledWith(state, { foo: 'bar' });
      });
    });
    describe('setTableFocus', () => {
      test('sets table focus', () => {
        const newState = reducer(state, { type: 'setTableFocus', focus: 'foo' });
        expect(newState.table.focus).toBe('foo');
      });
    });
    describe('setTableMaxBodyHeight', () => {
      test('sets table maxBodyHeight from action if above minimum', () => {
        const height = MIN_TABLE_MAX_BODY_HEIGHT + 50;
        const newState = reducer(state, { type: 'setTableMaxBodyHeight', height });
        expect(newState.table.maxBodyHeight).toBe(height);
        expect(newState.table.maxBodyHeightUpdateFromAspectRatio).toBe(false);
      });
      test('sets table maxBodyHeight to the minimum if invalid or below', () => {
        const newState = reducer(state, { type: 'setTableMaxBodyHeight' });
        expect(newState.table.maxBodyHeight).toBe(MIN_TABLE_MAX_BODY_HEIGHT);
        expect(newState.table.maxBodyHeightUpdateFromAspectRatio).toBe(false);
      });
    });
    describe('setMapZoom', () => {
      test('does nothing if action zoom is invalid', () => {
        expect(
          reducer(state, { type: 'setMapZoom' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setMapZoom', zoom: -50 }),
        ).toStrictEqual(state);
      });
      test('sets only zoom (not center and not bounds) if only passed zoom', () => {
        getZoomedIcons.mockReset();
        getZoomedIcons.mockReturnValue('ZOOMED ICONS');
        const newState = reducer(state, { type: 'setMapZoom', zoom: 10 });
        expect(newState.map.zoom).toBe(10);
        expect(newState.map.zoomedIcons).toBe('ZOOMED ICONS');
      });
      test('sets center if provided', () => {
        getZoomedIcons.mockReset();
        getZoomedIcons.mockReturnValue('ZOOMED ICONS');
        const newState = reducer(state, { type: 'setMapZoom', zoom: 12, center: [50, 80] });
        expect(newState.map.zoom).toBe(12);
        expect(newState.map.center).toStrictEqual([50, 80]);
        expect(newState.map.zoomedIcons).toBe('ZOOMED ICONS');
      });
      test('sets bounds if provided', () => {
        const bounds = 'BOUNDS';
        boundsAreValid.mockReset();
        boundsAreValid.mockReturnValue(true);
        getZoomedIcons.mockReset();
        getZoomedIcons.mockReturnValue('ZOOMED ICONS');
        const newState = reducer(state, { type: 'setMapZoom', zoom: 5, bounds });
        expect(newState.map.zoom).toBe(5);
        expect(newState.map.bounds).toBe(bounds);
        expect(newState.map.zoomedIcons).toBe('ZOOMED ICONS');
      });
    });
    describe('setMapBounds', () => {
      test('does nothing if action bounds are invalid', () => {
        const bounds = 'BOUNDS';
        boundsAreValid.mockReset();
        boundsAreValid.mockReturnValue(false);
        const newState = reducer(state, { type: 'setMapBounds', bounds });
        expect(newState).toStrictEqual(state);
      });
      test('sets bounds if valid', () => {
        const bounds = 'BOUNDS';
        boundsAreValid.mockReset();
        boundsAreValid.mockReturnValue(true);
        const newState = reducer(state, { type: 'setMapBounds', bounds });
        expect(newState.map.bounds).toBe(bounds);
      });
    });
    describe('setMapCenter', () => {
      test('does nothing if action center is invalid', () => {
        const newState = reducer(state, { type: 'setMapCenter', center: 'invalid' });
        expect(newState).toStrictEqual(state);
      });
      test('sets map center valid', () => {
        boundsAreValid.mockReset();
        boundsAreValid.mockReturnValue(false);
        const newState = reducer(state, { type: 'setMapCenter', center: [50, 80] });
        expect(newState.map.center).toStrictEqual([50, 80]);
      });
      test('sets map center and bounds if both provided and valid', () => {
        const bounds = 'BOUNDS';
        boundsAreValid.mockReset();
        boundsAreValid.mockReturnValue(true);
        const newState = reducer(state, { type: 'setMapCenter', center: [50, 80], bounds });
        expect(newState.map.center).toStrictEqual([50, 80]);
        expect(newState.map.bounds).toBe(bounds);
      });
    });
    describe('setMapBaseLayer', () => {
      test('does nothing if action base layer is not null and not valid', () => {
        const baseLayer = 'foo';
        const newState = reducer(state, { type: 'setMapBaseLayer', baseLayer });
        expect(newState).toStrictEqual(state);
      });
      test('sets base layer if null', () => {
        state.map.baseLayer = 'something else';
        const baseLayer = null;
        const newState = reducer(state, { type: 'setMapBaseLayer', baseLayer });
        expect(newState.map.baseLayer).toBe(null);
      });
      test('sets base layer if valid', () => {
        state.map.baseLayer = 'something else';
        const baseLayer = Object.keys(BASE_LAYERS)[0];
        const newState = reducer(state, { type: 'setMapBaseLayer', baseLayer });
        expect(newState.map.baseLayer).toBe(baseLayer);
      });
    });
    describe('setMapOverlayVisibility', () => {
      test('does nothing if action overlay is not valid', () => {
        const overlay = 'invalid';
        const newState = reducer(state, { type: 'setMapOverlayVisibility', overlay });
        expect(newState).toStrictEqual(state);
      });
      test('sets and automatically expands a valid overlay if setting to visible', () => {
        const overlay = Object.keys(OVERLAYS)[0];
        const newState = reducer(state, { type: 'setMapOverlayVisibility', visible: true, overlay });
        expect(newState.map.overlays).toStrictEqual(new Set([overlay]));
        expect(newState.filters.overlays.expanded).toStrictEqual(new Set([overlay]));
      });
      test('removes and automatically collapses a valid overlay if setting to not visible', () => {
        const { 0: overlay0, 1: overlay1 } = Object.keys(OVERLAYS);
        state.map.overlays = new Set([overlay0, overlay1]);
        state.filters.overlays.expanded = new Set([overlay0]);
        const newState = reducer(
          state,
          { type: 'setMapOverlayVisibility', visible: false, overlay: overlay0 },
        );
        expect(newState.map.overlays).toStrictEqual(new Set([overlay1]));
        expect(newState.filters.overlays.expanded).toStrictEqual(new Set());
      });
    });
    describe('setMapOverlays', () => {
      test('does nothing if action overlays is not an array containing only overlay keys', () => {
        expect(
          reducer(state, { type: 'setMapOverlays', overlays: null }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setMapOverlays', overlays: [Object.keys(OVERLAYS)[0], 'invalid'] }),
        ).toStrictEqual(state);
      });
      test('applies overlays and expands all of them if valid', () => {
        const { 0: overlay0, 1: overlay1 } = Object.keys(OVERLAYS);
        state.map.overlays = new Set([overlay1]);
        state.filters.overlays.expanded = new Set([overlay1]);
        const newState = reducer(
          state,
          { type: 'setMapOverlays', overlays: [overlay0] },
        );
        expect(newState.map.overlays).toStrictEqual(new Set([overlay0]));
        expect(newState.filters.overlays.expanded).toStrictEqual(new Set([overlay0]));
      });
    });
    describe('setMapRepositionOpenPopupFunc', () => {
      test('sets reposition function to null if passed anything but a function', () => {
        state.map.repositionOpenPopupFunc = 'foo';
        const newState = reducer(
          state,
          { type: 'setMapRepositionOpenPopupFunc', func: 123 },
        );
        expect(newState.map.repositionOpenPopupFunc).toBe(null);
      });
      test('sets reposition function to passed function', () => {
        state.map.repositionOpenPopupFunc = 'foo';
        const func = () => 'funcreturn';
        const newState = reducer(
          state,
          { type: 'setMapRepositionOpenPopupFunc', func },
        );
        expect(typeof newState.map.repositionOpenPopupFunc).toBe('function');
        expect(newState.map.repositionOpenPopupFunc()).toBe('funcreturn');
      });
    });
    describe('showFullObservatory', () => {
      test('resets map center and zoom appropriately', () => {
        deriveFullObservatoryZoomLevel.mockReset();
        deriveFullObservatoryZoomLevel.mockReturnValue(7);
        const newState = reducer(state, { type: 'showFullObservatory', mapRef: 'foo' });
        expect(newState.map.center).toStrictEqual(OBSERVATORY_CENTER);
        expect(deriveFullObservatoryZoomLevel).toHaveBeenCalledTimes(1);
        expect(deriveFullObservatoryZoomLevel).toHaveBeenCalledWith('foo');
        expect(newState.map.zoom).toBe(7);
      });
    });
    describe('setMapMouseMode', () => {
      test('does nothing if action mouseMode is not valid', () => {
        expect(
          reducer(state, { type: 'setMapMouseMode', mouseMode: null }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setMapMouseMode', mouseMode: 'invalid' }),
        ).toStrictEqual(state);
      });
      test('sets mouseMode if valid', () => {
        const { 0: mouseMode } = Object.keys(MAP_MOUSE_MODES);
        state.map.mouseMode = 'notyetset';
        const newState = reducer(state, { type: 'setMapMouseMode', mouseMode });
        expect(newState.map.mouseMode).toBe(mouseMode);
      });
    });
    describe('setLegendOpen', () => {
      test('coerces passed value to a boolean to set the open status of the legend', () => {
        const newState1 = reducer(state, { type: 'setLegendOpen' });
        expect(newState1.filters.legendOpen).toBe(false);
        const newState2 = reducer(state, { type: 'setLegendOpen', open: 'true' });
        expect(newState2.filters.legendOpen).toBe(true);
        const newState3 = reducer(state, { type: 'setLegendOpen', open: 0 });
        expect(newState3.filters.legendOpen).toBe(false);
        const newState4 = reducer(state, { type: 'setLegendOpen', open: 'OPEN' });
        expect(newState4.filters.legendOpen).toBe(true);
      });
    });
    describe('setLegendFeatureOptionVisibility', () => {
      test('does nothing if not both action feature and action visible are valid', () => {
        expect(
          reducer(state, { type: 'setLegendFeatureOptionVisibility' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setLegendFeatureOptionVisibility', feature: FEATURES.HUTS.KEY }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setLegendFeatureOptionVisibility', feature: FEATURES.HUTS.KEY, visible: 'foo' }),
        ).toStrictEqual(state);
      });
      test('sets the feature visibility correctly for valid feature and visibility', () => {
        const { HUTS: { KEY: HUTS } } = FEATURES;
        state.filters.features.visible[HUTS] = false;
        const newState = reducer(
          state,
          { type: 'setLegendFeatureOptionVisibility', feature: HUTS, visible: true },
        );
        expect(newState.filters.features.visible[HUTS]).toBe(true);
      });
    });
    describe('setLegendFeatureOptionCollapsed', () => {
      test('does nothing if action feature is not valid', () => {
        state.filters.features.collapsed = new Set([FEATURES.MEGAPITS.KEY]);
        expect(
          reducer(state, { type: 'setLegendFeatureOptionCollapsed' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setLegendFeatureOptionCollapsed', feature: 'invalid' }),
        ).toStrictEqual(state);
      });
      test('collapses feature if action feature is valid', () => {
        state.filters.features.collapsed = new Set();
        const newState = reducer(
          state,
          { type: 'setLegendFeatureOptionCollapsed', feature: FEATURES.HUTS.KEY },
        );
        expect(newState.filters.features.collapsed).toStrictEqual(new Set([FEATURES.HUTS.KEY]));
      });
    });
    describe('setLegendFeatureOptionExpanded', () => {
      test('does nothing if action feature is not valid', () => {
        state.filters.features.collapsed = new Set([FEATURES.HUTS.KEY, FEATURES.MEGAPITS.KEY]);
        expect(
          reducer(state, { type: 'setLegendFeatureOptionExpanded' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setLegendFeatureOptionExpanded', feature: 'invalid' }),
        ).toStrictEqual(state);
      });
      test('expands feature if action feature is valid', () => {
        state.filters.features.collapsed = new Set([FEATURES.HUTS.KEY, FEATURES.MEGAPITS.KEY]);
        const newState = reducer(
          state,
          { type: 'setLegendFeatureOptionExpanded', feature: FEATURES.HUTS.KEY },
        );
        expect(newState.filters.features.collapsed).toStrictEqual(new Set([FEATURES.MEGAPITS.KEY]));
      });
    });
    describe('setLegendOverlayOptionCollapsed', () => {
      test('does nothing if action overlay is not valid', () => {
        state.filters.features.collapsed = new Set([OVERLAYS.IMPERVIOUS.KEY, OVERLAYS.LAND_COVER.KEY]);
        expect(
          reducer(state, { type: 'setLegendOverlayOptionCollapsed' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setLegendOverlayOptionCollapsed', overlay: 'invalid' }),
        ).toStrictEqual(state);
      });
      test('collapses overlay if action overlay is valid', () => {
        state.filters.overlays.expanded = new Set([OVERLAYS.IMPERVIOUS.KEY, OVERLAYS.LAND_COVER.KEY]);
        const newState = reducer(
          state,
          { type: 'setLegendOverlayOptionCollapsed', overlay: OVERLAYS.IMPERVIOUS.KEY },
        );
        expect(newState.filters.overlays.expanded).toStrictEqual(new Set([OVERLAYS.LAND_COVER.KEY]));
      });
    });
    describe('setLegendOverlayOptionExpanded', () => {
      test('does nothing if action overlay is not valid', () => {
        state.filters.features.collapsed = new Set([OVERLAYS.LAND_COVER.KEY]);
        expect(
          reducer(state, { type: 'setLegendOverlayOptionExpanded' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setLegendOverlayOptionExpanded', overlay: 'invalid' }),
        ).toStrictEqual(state);
      });
      test('expands overlay if action overlay is valid', () => {
        state.filters.overlays.expanded = new Set([OVERLAYS.LAND_COVER.KEY]);
        const newState = reducer(
          state,
          { type: 'setLegendOverlayOptionExpanded', overlay: OVERLAYS.IMPERVIOUS.KEY },
        );
        expect(newState.filters.overlays.expanded).toStrictEqual(new Set([OVERLAYS.LAND_COVER.KEY, OVERLAYS.IMPERVIOUS.KEY]));
      });
    });
    describe('setNewFocusLocation', () => {
      test('sets the location and stays on the map if already there', () => {
        state.view.current = VIEWS.MAP;
        const newState = reducer(state, { type: 'setNewFocusLocation', location: 'foo' });
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.AWAITING_CALL);
        expect(newState.focusLocation.current).toBe('foo');
        expect(newState.focusLocation.data).toBe(null);
        expect(newState.overallFetch.expected).toBe(1);
        expect(newState.view.current).toBe(VIEWS.MAP);
      });
      test('sets the location and switches to map view if necessary', () => {
        state.focusLocation.data = { foo: 'bar' };
        state.overallFetch.expected = 4;
        state.view.current = VIEWS.TABLE;
        const newState = reducer(state, { type: 'setNewFocusLocation', location: 'bar' });
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.AWAITING_CALL);
        expect(newState.focusLocation.current).toBe('bar');
        expect(newState.focusLocation.data).toBe(null);
        expect(newState.overallFetch.expected).toBe(5);
        expect(newState.view.current).toBe(VIEWS.MAP);
      });
    });
    describe('setFocusLocationFetchStarted', () => {
      test('initializes the fetch', () => {
        state.focusLocation.fetch = { status: FETCH_STATUS.AWAITING_CALL, error: null };
        state.focusLocation.data = { foo: 'bar' };
        const newState = reducer(state, { type: 'setFocusLocationFetchStarted' });
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.FETCHING);
        expect(newState.focusLocation.fetch.error).toBe(null);
        expect(newState.focusLocation.data).toBe(null);
      });
    });
    describe('setFocusLocationFetchFailed', () => {
      test('fails the fetch', () => {
        state.overallFetch = { expected: 7, completed: 5, pendingHierarchy: 0 };
        state.focusLocation.current = 'foo';
        state.focusLocation.fetch = { status: FETCH_STATUS.FETCHING, error: null };
        state.focusLocation.data = { foo: 'bar' };
        const newState = reducer(state, { type: 'setFocusLocationFetchFailed' });
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.ERROR);
        expect(typeof newState.focusLocation.fetch.error).toBe('string');
        expect(newState.focusLocation.data).toBe(null);
        expect(newState.overallFetch.completed).toBe(6);
      });
    });
    describe('setFocusLocationFetchSucceeded', () => {
      beforeEach(() => {
        getMapStateForFocusLocation.mockReset();
        getMapStateForFocusLocation.mockReturnValue({ zoom: 4, center: [21, 15] });
      });
      test('completes the fetch and sets data', () => {
        state.overallFetch = { expected: 4, completed: 2, pendingHierarchy: 0 };
        state.focusLocation.fetch = { status: FETCH_STATUS.FETCHING, error: null };
        state.focusLocation.data = { foo: 'bar' };
        const newState = reducer(
          state,
          {
            type: 'setFocusLocationFetchSucceeded',
            data: { type: 'SITE', siteCode: 'ABCD' },
          },
        );
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.SUCCESS);
        expect(newState.focusLocation.fetch.error).toBe(null);
        expect(newState.focusLocation.data).toStrictEqual({ type: 'SITE', siteCode: 'ABCD' });
        expect(newState.focusLocation.map.zoom).toBe(4);
        expect(newState.focusLocation.map.center).toStrictEqual([21, 15]);
        expect(newState.overallFetch.completed).toBe(3);
      });
      test('completes the fetch and sets data; if state data sets states on and domains off', () => {
        state.overallFetch = { expected: 2, completed: 0, pendingHierarchy: 0 };
        state.focusLocation.fetch = { status: FETCH_STATUS.FETCHING, error: null };
        state.focusLocation.data = { foo: 'bar' };
        state.filters.features.visible[FEATURES.STATES.KEY] = false;
        state.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
        const newState = reducer(
          state,
          {
            type: 'setFocusLocationFetchSucceeded',
            data: { type: 'STATE', name: 'CO' },
          },
        );
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.SUCCESS);
        expect(newState.focusLocation.fetch.error).toBe(null);
        expect(newState.focusLocation.data).toStrictEqual({ type: 'STATE', name: 'CO' });
        expect(newState.focusLocation.map.zoom).toBe(4);
        expect(newState.focusLocation.map.center).toStrictEqual([21, 15]);
        expect(newState.overallFetch.completed).toBe(1);
        expect(newState.filters.features.visible[FEATURES.STATES.KEY]).toBe(true);
        expect(newState.filters.features.visible[FEATURES.DOMAINS.KEY]).toBe(false);
      });
      test('completes the fetch and sets data; if domain data sets domains on and states off', () => {
        state.overallFetch = { expected: 20, completed: 10, pendingHierarchy: 0 };
        state.focusLocation.fetch = { status: FETCH_STATUS.FETCHING, error: null };
        state.focusLocation.data = { foo: 'bar' };
        state.filters.features.visible[FEATURES.STATES.KEY] = true;
        state.filters.features.visible[FEATURES.DOMAINS.KEY] = false;
        const newState = reducer(
          state,
          {
            type: 'setFocusLocationFetchSucceeded',
            data: { type: 'DOMAIN', name: 'D05' },
          },
        );
        expect(newState.focusLocation.fetch.status).toBe(FETCH_STATUS.SUCCESS);
        expect(newState.focusLocation.fetch.error).toBe(null);
        expect(newState.focusLocation.data).toStrictEqual({ type: 'DOMAIN', name: 'D05' });
        expect(newState.focusLocation.map.zoom).toBe(4);
        expect(newState.focusLocation.map.center).toStrictEqual([21, 15]);
        expect(newState.overallFetch.completed).toBe(11);
        expect(newState.filters.features.visible[FEATURES.STATES.KEY]).toBe(false);
        expect(newState.filters.features.visible[FEATURES.DOMAINS.KEY]).toBe(true);
      });
    });
    describe('returnToFocusLocation', () => {
      beforeEach(() => {
        state.map = { zoom: 14, center: [12, 18] };
        getMapStateForFocusLocation.mockReset();
        getMapStateForFocusLocation.mockReturnValue({ zoom: 10, center: [20, 30] });
      });
      test('does nothing if focusLocation is not fully set', () => {
        state.focusLocation = { current: null, data: null };
        expect(
          reducer(state, { type: 'returnToFocusLocation' }),
        ).toStrictEqual(state);
        state.focusLocation = { current: 'foo', data: null };
        expect(
          reducer(state, { type: 'returnToFocusLocation' }),
        ).toStrictEqual(state);
        state.focusLocation = { current: null, data: { foo: 'bar' } };
        expect(
          reducer(state, { type: 'returnToFocusLocation' }),
        ).toStrictEqual(state);
      });
      test('returns to focus location center and zoom', () => {
        state.focusLocation = { current: 'foo', data: { type: 'SITE', siteCode: 'ABCD' } };
        const newState = reducer(state, { type: 'returnToFocusLocation' });
        expect(newState.map.zoom).toBe(10);
        expect(newState.map.center).toStrictEqual([20, 30]);
      });
      test('returns to focus location center and zoom, toggles states on and domains off if state', () => {
        state.focusLocation = { current: 'foo', data: { type: 'STATE', name: 'CO' } };
        state.filters.features.visible[FEATURES.STATES.KEY] = false;
        state.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
        const newState = reducer(state, { type: 'returnToFocusLocation' });
        expect(newState.map.zoom).toBe(10);
        expect(newState.map.center).toStrictEqual([20, 30]);
        expect(newState.filters.features.visible[FEATURES.STATES.KEY]).toBe(true);
        expect(newState.filters.features.visible[FEATURES.DOMAINS.KEY]).toBe(false);
      });
      test('returns to focus location center and zoom, toggles domains on and states off if domain', () => {
        state.focusLocation = { current: 'foo', data: { type: 'DOMAIN', name: 'D05' } };
        state.filters.features.visible[FEATURES.STATES.KEY] = true;
        state.filters.features.visible[FEATURES.DOMAINS.KEY] = false;
        const newState = reducer(state, { type: 'returnToFocusLocation' });
        expect(newState.map.zoom).toBe(10);
        expect(newState.map.center).toStrictEqual([20, 30]);
        expect(newState.filters.features.visible[FEATURES.STATES.KEY]).toBe(false);
        expect(newState.filters.features.visible[FEATURES.DOMAINS.KEY]).toBe(true);
      });
    });
    describe('awaitingFeatureDataFetchesTriggered', () => {
      test('toggles off awaiting flag', () => {
        state.featureDataFetchesHasAwaiting = true;
        const newState = reducer(state, { type: 'awaitingFeatureDataFetchesTriggered' });
        expect(newState.featureDataFetchesHasAwaiting).toBe(false);
      });
    });
    describe('setFeatureDataFetchStarted', () => {
      test('does nothing if action dataSource is invalid', () => {
        expect(
          reducer(state, { type: 'setFeatureDataFetchStarted' }),
        ).toStrictEqual(state);
      });
    });
    describe('setFeatureDataFetchSucceeded', () => {
      test('completes the fetch as success', () => {
        state.overallFetch = { expected: 2, completed: 0, pendingHierarchy: 0 };
        let newState = reducer(state, { type: 'setFeatureDataFetchSucceeded' });
        expect(newState.overallFetch.completed).toBe(1);
        expect(newState.overallFetch.expected).toBe(2);
        newState = reducer(state, { type: 'setFeatureDataFetchSucceeded' });
        expect(newState.overallFetch.completed).toBe(0);
        expect(newState.overallFetch.expected).toBe(0);
      });
    });
    describe('setFeatureDataFetchFailed', () => {
      test('completes the fetch as error', () => {
        state.overallFetch = { expected: 2, completed: 0, pendingHierarchy: 0 };
        const newState = reducer(state, { type: 'setFeatureDataFetchFailed' });
        expect(newState.overallFetch.completed).toBe(1);
        expect(newState.overallFetch.expected).toBe(2);
      });
    });
    describe('setDomainLocationHierarchyFetchStarted', () => {
      test('does nothing if action domain code does not map to a fetch', () => {
        const { REST_LOCATIONS_API: DATA_SOURCE } = FEATURE_DATA_SOURCES;
        const { SITE_LOCATION_HIERARCHIES: { KEY: FEATURE_TYPE } } = FEATURE_TYPES;
        state.overallFetch = { expected: 4, completed: 2, pendingHierarchy: 1 };
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchStarted' }),
        ).toStrictEqual(state);
        state.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05 = FETCH_STATUS.AWAITING_CALL;
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchStarted', domainCode: 'D13' }),
        ).toStrictEqual(state);
      });
      test('sets existing hierarchy to fetching for a valid domain code', () => {
        const { REST_LOCATIONS_API: DATA_SOURCE } = FEATURE_DATA_SOURCES;
        const { SITE_LOCATION_HIERARCHIES: { KEY: FEATURE_TYPE } } = FEATURE_TYPES;
        state.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05 = FETCH_STATUS.AWAITING_CALL;
        const newState = reducer(state, { type: 'setDomainLocationHierarchyFetchStarted', domainCode: 'D05' });
        expect(newState.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05).toBe(FETCH_STATUS.FETCHING);
      });
    });
    describe('setDomainLocationHierarchyFetchSucceeded', () => {
      test('does nothing if action domainCode fetch does not exist or no action data', () => {
        const { REST_LOCATIONS_API: DATA_SOURCE } = FEATURE_DATA_SOURCES;
        const { SITE_LOCATION_HIERARCHIES: { KEY: FEATURE_TYPE } } = FEATURE_TYPES;
        state.overallFetch = { expected: 4, completed: 2, pendingHierarchy: 1 };
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchSucceeded' }),
        ).toStrictEqual(state);
        state.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05 = FETCH_STATUS.FETCHING;
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchSucceeded', domainCode: 'D13' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchSucceeded', data: { foo: 'bar' } }),
        ).toStrictEqual(state);
      });
      test('applies data for valid domainCode and data', () => {
        const { REST_LOCATIONS_API: DATA_SOURCE } = FEATURE_DATA_SOURCES;
        const { SITE_LOCATION_HIERARCHIES: { KEY: FEATURE_TYPE } } = FEATURE_TYPES;
        state.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05 = FETCH_STATUS.FETCHING;
        state.overallFetch = { expected: 2, completed: 0, pendingHierarchy: 1 };
        const newState = reducer(
          state,
          {
            type: 'setDomainLocationHierarchyFetchSucceeded',
            domainCode: 'D05',
            data: { S1: 'foo', S2: 'bar' },
          },
        );
        expect(newState.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05).toBe(FETCH_STATUS.SUCCESS);
        expect(newState.featureData[FEATURE_TYPE].S1).toBe('foo');
        expect(newState.featureData[FEATURE_TYPE].S2).toBe('bar');
        expect(newState.overallFetch.completed).toBe(1);
        expect(newState.overallFetch.expected).toBe(2);
        expect(newState.overallFetch.pendingHierarchy).toBe(0);
      });
    });
    describe('setDomainLocationHierarchyFetchFailed', () => {
      test('does nothing if action domainCode fetch does not exist or no action data', () => {
        const { REST_LOCATIONS_API: DATA_SOURCE } = FEATURE_DATA_SOURCES;
        const { SITE_LOCATION_HIERARCHIES: { KEY: FEATURE_TYPE } } = FEATURE_TYPES;
        state.overallFetch = { expected: 4, completed: 2, pendingHierarchy: 1 };
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchFailed' }),
        ).toStrictEqual(state);
        state.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05 = FETCH_STATUS.FETCHING;
        expect(
          reducer(state, { type: 'setDomainLocationHierarchyFetchFailed', domainCode: 'D13' }),
        ).toStrictEqual(state);
      });
      test('fails the fetch', () => {
        const { REST_LOCATIONS_API: DATA_SOURCE } = FEATURE_DATA_SOURCES;
        const { SITE_LOCATION_HIERARCHIES: { KEY: FEATURE_TYPE } } = FEATURE_TYPES;
        state.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05 = FETCH_STATUS.FETCHING;
        state.overallFetch = { expected: 4, completed: 2, pendingHierarchy: 1 };
        const newState = reducer(state, { type: 'setDomainLocationHierarchyFetchFailed', domainCode: 'D05' });
        expect(newState.featureDataFetches[DATA_SOURCE][FEATURE_TYPE].D05).toBe(FETCH_STATUS.ERROR);
        expect(newState.overallFetch.completed).toBe(3);
        expect(newState.overallFetch.expected).toBe(4);
        expect(newState.overallFetch.pendingHierarchy).toBe(0);
      });
    });
    describe('setHideUnselectable', () => {
      test('coerces action hideUnselectable to boolean and applies', () => {
        state.selection.hideUnselectable = false;
        const newState = reducer(state, { type: 'setHideUnselectable', hideUnselectable: 'true' });
        expect(newState.selection.hideUnselectable).toBe(true);
      });
    });
    describe('toggleSelectionSummary', () => {
      test('coerces action showSummary to boolean and applies', () => {
        state.selection.showSummary = false;
        const newState = reducer(state, { type: 'toggleSelectionSummary', showSummary: 'true' });
        expect(newState.selection.showSummary).toBe(true);
      });
    });
    describe('selectionOnChangeTriggered', () => {
      test('flips the bit', () => {
        state.selection.changed = true;
        const newState = reducer(state, { type: 'selectionOnChangeTriggered' });
        expect(newState.selection.changed).toBe(false);
      });
    });
    describe('updateSelectionSet', () => {
      test('does nothing if not provided a selection set', () => {
        expect(
          reducer(state, { type: 'updateSelectionSet' }),
        ).toStrictEqual(state);
        expect(
          reducer(state, { type: 'updateSelectionSet', selection: ['foo', 'bar'] }),
        ).toStrictEqual(state);
      });
      test('applies the selection set if valid', () => {
        state.selection.validSet = new Set(['foo', 'qux']);
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        let newState = reducer(state, { type: 'updateSelectionSet', selection: new Set(['foo', 'bar']) });
        expect(newState.selection.set).toStrictEqual(new Set(['foo']));
        expect(newState.selection.changed).toBe(true);
        newState.selection.active = FEATURE_TYPES.DOMAINS.KEY;
        newState.selection.changed = false;
        newState = reducer(newState, { type: 'updateSelectionSet', selection: new Set(['qux', 'bar']) });
        expect(newState.selection.set).toStrictEqual(new Set(['qux']));
        expect(newState.selection.changed).toBe(true);
      });
    });
    describe('toggleItemSelected', () => {
      test('does not change the selection if action item is not in the validSet', () => {
        state.selection.limit = 1;
        state.selection.set = new Set(['foo']);
        state.selection.validSet = new Set(['foo', 'bar', 'qux']);
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.changed = false;
        const newState = reducer(state, { type: 'toggleItemSelected', item: 'tap' });
        expect(newState.selection.set).toStrictEqual(new Set(['foo']));
        expect(newState.selection.changed).toBe(false);
      });
      test('selects one item when limit is 1 and none selected', () => {
        state.selection.limit = 1;
        state.selection.set = new Set();
        state.selection.validSet = new Set(['foo', 'bar', 'qux']);
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.changed = false;
        const newState = reducer(state, { type: 'toggleItemSelected', item: 'foo' });
        expect(newState.selection.set).toStrictEqual(new Set(['foo']));
        expect(newState.selection.changed).toBe(true);
      });
      test('still allows deselection when limit is 1 and 1 selected', () => {
        state.selection.limit = 1;
        state.selection.set = new Set(['qux']);
        state.selection.validSet = new Set(['foo', 'bar', 'qux']);
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.changed = false;
        const newState = reducer(state, { type: 'toggleItemSelected', item: 'qux' });
        expect(newState.selection.set).toStrictEqual(new Set());
        expect(newState.selection.changed).toBe(true);
      });
      test('maintains a selection of 1 when limit is 1', () => {
        state.selection.limit = 1;
        state.selection.set = new Set(['foo']);
        state.selection.validSet = new Set(['foo', 'bar', 'qux']);
        state.selection.active = FEATURE_TYPES.STATES.KEY;
        state.selection.changed = false;
        const newState = reducer(state, { type: 'toggleItemSelected', item: 'bar' });
        expect(newState.selection.set).toStrictEqual(new Set(['bar']));
        expect(newState.selection.changed).toBe(true);
      });
      test('selects unselected items when not limited to 1', () => {
        state.selection.limit = [2, 5];
        state.selection.set = new Set(['foo', 'bar']);
        state.selection.validSet = new Set(['foo', 'bar', 'qux']);
        state.selection.active = FEATURE_TYPES.DOMAINS.KEY;
        state.selection.changed = false;
        const newState = reducer(state, { type: 'toggleItemSelected', item: 'qux' });
        expect(newState.selection.set).toStrictEqual(new Set(['foo', 'bar', 'qux']));
        expect(newState.selection.changed).toBe(true);
      });
      test('deselects selected items', () => {
        state.selection.limit = [2, 5];
        state.selection.set = new Set(['foo', 'bar']);
        state.selection.validSet = new Set(['foo', 'bar', 'qux']);
        state.selection.active = FEATURE_TYPES.DOMAINS.KEY;
        state.selection.changed = false;
        const newState = reducer(state, { type: 'toggleItemSelected', item: 'bar' });
        expect(newState.selection.set).toStrictEqual(new Set(['foo']));
        expect(newState.selection.changed).toBe(true);
      });
    });
    describe('toggleSitesSelectedForState', () => {
      test('does nothing if action stateCode is invalid', () => {
        expect(
          reducer(state, { type: 'toggleSitesSelectedForState' }),
        ).toStrictEqual(state);
      });
      test('adds valid state sites selection when state is not totally selected', () => {
        state.selection.changed = false;
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.set = new Set(['S2']);
        state.selection.validSet = new Set(['S1', 'S2', 'S3', 'S4']);
        state.selection.derived[FEATURES.STATES.KEY].CO = SELECTION_PORTIONS.PARTIAL;
        state.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY].CO = {
          sites: new Set(['S1', 'S2', 'S3']),
        };
        const newState = reducer(state, { type: 'toggleSitesSelectedForState', stateCode: 'CO' });
        expect(newState.selection.changed).toBe(true);
        expect(newState.selection.set).toStrictEqual(new Set(['S1', 'S2', 'S3']));
      });
      test('removes all valid state sites from selection when state is totally selected', () => {
        state.selection.changed = false;
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.set = new Set(['S1', 'S2', 'S3', 'S4']);
        state.selection.validSet = new Set(['S1', 'S2', 'S3', 'S4']);
        state.selection.derived[FEATURES.STATES.KEY].CO = SELECTION_PORTIONS.TOTAL;
        state.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY].CO = {
          sites: new Set(['S1', 'S2', 'S3']),
        };
        const newState = reducer(state, { type: 'toggleSitesSelectedForState', stateCode: 'CO' });
        expect(newState.selection.changed).toBe(true);
        expect(newState.selection.set).toStrictEqual(new Set(['S4']));
      });
    });
    describe('toggleSitesSelectedForDomain', () => {
      test('does nothing if action domainCode is invalid', () => {
        expect(
          reducer(state, { type: 'toggleSitesSelectedForDomain' }),
        ).toStrictEqual(state);
      });
      test('adds valid domain sites selection when domain is not totally selected', () => {
        state.selection.changed = false;
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.set = new Set(['S2']);
        state.selection.validSet = new Set(['S1', 'S2', 'S3', 'S4']);
        state.selection.derived[FEATURES.DOMAINS.KEY].CO = SELECTION_PORTIONS.PARTIAL;
        state.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY].CO = {
          sites: new Set(['S1', 'S2', 'S3']),
        };
        const newState = reducer(state, { type: 'toggleSitesSelectedForDomain', domainCode: 'CO' });
        expect(newState.selection.changed).toBe(true);
        expect(newState.selection.set).toStrictEqual(new Set(['S1', 'S2', 'S3']));
      });
      test('removes all valid domain sites from selection when domain is totally selected', () => {
        state.selection.changed = false;
        state.selection.active = FEATURE_TYPES.SITES.KEY;
        state.selection.set = new Set(['S1', 'S2', 'S3', 'S4']);
        state.selection.validSet = new Set(['S1', 'S2', 'S3', 'S4']);
        state.selection.derived[FEATURES.DOMAINS.KEY].CO = SELECTION_PORTIONS.TOTAL;
        state.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY].CO = {
          sites: new Set(['S1', 'S2', 'S3']),
        };
        const newState = reducer(state, { type: 'toggleSitesSelectedForDomain', domainCode: 'CO' });
        expect(newState.selection.changed).toBe(true);
        expect(newState.selection.set).toStrictEqual(new Set(['S4']));
      });
    });
  });
});
