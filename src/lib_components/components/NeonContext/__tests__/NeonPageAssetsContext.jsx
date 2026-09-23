import { renderHook } from '@testing-library/react';

import cloneDeep from 'lodash/cloneDeep';

import NeonPageAssetsContext, { FETCH_STATUS, getTestableItems } from '../NeonPageAssetsContext';

const {
  useNeonPageAssetsContextState,
  DEFAULT_STATE,
} = NeonPageAssetsContext;

const {
  reducer,
  DRUPAL_HEADER_HTML,
  DRUPAL_FOOTER_HTML,
} = getTestableItems();

describe('NeonPageAssetsContext', () => {
  describe('useNeonPageAssetsContextState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useNeonPageAssetsContextState());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('reducer', () => {
    test('does nothing when provided an invalid action', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'not a real action' },
      );
      expect(newState).toStrictEqual(DEFAULT_STATE);
    });
    test('fetchCalled', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchCalled', key: DRUPAL_HEADER_HTML },
      );
      expect(newState.fetches[DRUPAL_HEADER_HTML].status).toBe(FETCH_STATUS.FETCHING);
      const sameState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchCalled', key: 'not a real key' },
      );
      expect(sameState).toStrictEqual(DEFAULT_STATE);
    });
    test('fetchHtmlSucceeded', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchHtmlSucceeded', asset: DRUPAL_HEADER_HTML, html: '<div>foo</div>' },
      );
      expect(newState.fetches[DRUPAL_HEADER_HTML].status).toBe(FETCH_STATUS.SUCCESS);
      expect(newState.html[DRUPAL_HEADER_HTML]).toBe('<div>foo</div>');
      const sameState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchHtmlSucceeded', asset: 'NOT VALID', html: '<div>foo</div>' },
      );
      expect(sameState).toStrictEqual(DEFAULT_STATE);
    });
    test('fetchHtmlFailed', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchHtmlFailed', asset: DRUPAL_FOOTER_HTML, error: 'BAD' },
      );
      expect(newState.fetches[DRUPAL_FOOTER_HTML].status).toBe(FETCH_STATUS.ERROR);
      expect(newState.fetches[DRUPAL_FOOTER_HTML].error).toBe('BAD');
      expect(newState.hasError).toBe(false); // html asset failures do not invalidate the context
      const sameState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchHtmlFailed', asset: 'NOT VALID' },
      );
      expect(sameState).toStrictEqual(DEFAULT_STATE);
    });
    test('whenFinalCalled', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'whenFinalCalled' },
      );
      expect(newState.whenFinalCalled).toBe(true);
    });
  });
});
