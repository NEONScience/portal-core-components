import { renderHook } from "@testing-library/react-hooks";

import cloneDeep from 'lodash/cloneDeep';
// import statesJSON from '../../../staticJSON/sites.json';

import SiteMapContext, { getTestableItems } from '../SiteMapContext';
import {
  DEFAULT_STATE,
  FEATURES,
  FEATURE_TYPES,
  MAP_ZOOM_RANGE,
  SELECTION_PORTIONS,
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

  /*
  describe('calculateFeatureDataFetches()', () => {
    test('', () => {
    });
  });
  */
});
