import { renderHook } from '@testing-library/react-hooks';

import cloneDeep from 'lodash/cloneDeep';

import statesJSON from '../../../../sampleData/sites.json';

import NeonContext, { FETCH_STATUS, getTestableItems } from '../NeonContext';

const {
  useNeonContextState,
  DEFAULT_STATE,
} = NeonContext;

const {
  deriveRegionSites,
  parseSitesFetchResponse,
  reducer,
  DRUPAL_HEADER_HTML,
  DRUPAL_FOOTER_HTML,
} = getTestableItems();

describe('NeonContext', () => {
  describe('useNeonContextState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useNeonContextState());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('deriveRegionSites()', () => {
    const derived = deriveRegionSites({
      otherState: 'foo',
      data: {
        otherState: 'bar',
        sites: {
          SITE_A: { stateCode: 'WA', domainCode: 'D16' },
          SITE_B: { stateCode: 'WA', domainCode: 'D16' },
          SITE_C: { stateCode: 'CO', domainCode: 'D10' },
          SITE_D: { stateCode: 'NH', domainCode: 'D01' },
        },
        states: statesJSON,
      },
    });
    test('properly maps all sites to domains with no backfill for empty domains', () => {
      expect(derived.data.domainSites).toStrictEqual({
        D01: new Set(['SITE_D']),
        D10: new Set(['SITE_C']),
        D16: new Set(['SITE_A', 'SITE_B']),
      });
    });
    test('properly maps all sites to states and backfills empty states', () => {
      expect(derived.data.stateSites.WA).toStrictEqual(new Set(['SITE_A', 'SITE_B']));
      expect(derived.data.stateSites.CO).toStrictEqual(new Set(['SITE_C']));
      expect(derived.data.stateSites.NH).toStrictEqual(new Set(['SITE_D']));
      Object.keys(statesJSON)
        .filter((stateCode) => !['WA', 'CO', 'NH'].includes(stateCode))
        .forEach((stateCode) => {
          expect(derived.data.stateSites[stateCode]).toStrictEqual(new Set());
        });
    });
    test('preserves other state', () => {
      expect(derived.otherState).toBe('foo');
      expect(derived.data.otherState).toBe('bar');
    });
  });

  describe('parseSitesFetchResponse()', () => {
    test('returns empty object for an empty input', () => {
      expect(parseSitesFetchResponse()).toStrictEqual({});
      expect(parseSitesFetchResponse([])).toStrictEqual({});
      expect(parseSitesFetchResponse({})).toStrictEqual({});
    });
    test('correctly parses a response with data', () => {
      const parsed = parseSitesFetchResponse([
        {
          siteCode: 'SITE_A', stateCode: 'WA', domainCode: 'D16', siteLatitude: 23, longitude: 12,
        },
        {
          siteCode: 'SITE_B', stateCode: 'WA', domainCode: 'D16', latitude: 44, siteLongitude: 7,
        },
        {
          siteCode: 'SITE_C', stateCode: 'CO', type: 'CORE', terrain: 'AQUATIC',
        },
        { siteCode: 'SITE_D', stateCode: 'NH', siteDescription: 'foo' },
        { stateCode: 'PR' },
      ]);
      expect(typeof parsed).toBe('object');
      expect(Object.keys(parsed)).toStrictEqual(['SITE_A', 'SITE_B', 'SITE_C', 'SITE_D']);
      Object.keys(parsed).forEach((siteCode) => {
        expect(parsed[siteCode].siteCode).toBe(siteCode);
      });
      expect(parsed.SITE_A.stateCode).toBe('WA');
      expect(parsed.SITE_A.domainCode).toBe('D16');
      expect(parsed.SITE_A.latitude).toBe(23);
      expect(parsed.SITE_A.longitude).toBe(12);
      expect(parsed.SITE_A.description).toBe(null);
      expect(parsed.SITE_B.stateCode).toBe('WA');
      expect(parsed.SITE_B.domainCode).toBe('D16');
      expect(parsed.SITE_B.latitude).toBe(44);
      expect(parsed.SITE_B.longitude).toBe(7);
      expect(parsed.SITE_B.description).toBe(null);
      expect(parsed.SITE_C.type).toBe('CORE');
      expect(parsed.SITE_C.terrain).toBe('AQUATIC');
      expect(parsed.SITE_D.description).toBe('foo');
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
        { type: 'fetchCalled', key: 'sites' },
      );
      expect(newState.fetches.sites.status).toBe(FETCH_STATUS.FETCHING);
      const sameState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchCalled', key: 'not a real key' },
      );
      expect(sameState).toStrictEqual(DEFAULT_STATE);
    });
    test('fetchSitesSucceeded', () => {
      const sites = { SITE_A: { stateCode: 'WA', domainCode: 'D16' } };
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchSitesSucceeded', sites },
      );
      expect(newState.fetches.sites.status).toBe(FETCH_STATUS.SUCCESS);
      expect(newState.data.sites).toStrictEqual(sites);
      expect(newState.isFinal).toBe(false);
      expect(newState.hasError).toBe(false);
      expect(newState.data.stateSites.WA).toStrictEqual(new Set(['SITE_A']));
      expect(newState.data.domainSites).toStrictEqual({ D16: new Set(['SITE_A']) });
    });
    test('fetchSitesFailed', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchSitesFailed', error: 'BAD' },
      );
      expect(newState.fetches.sites.status).toBe(FETCH_STATUS.ERROR);
      expect(newState.fetches.sites.error).toBe('BAD');
      expect(newState.data.sites).toStrictEqual({});
      expect(newState.isFinal).toBe(false);
      expect(newState.hasError).toBe(true);
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
    test('setAuthenticated', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'setAuthenticated', isAuthenticated: true },
      );
      expect(newState.auth.isAuthenticated).toBe(true);
      const newState2 = reducer(
        newState,
        { type: 'setAuthenticated', isAuthenticated: false },
      );
      expect(newState2.auth.isAuthenticated).toBe(false);
    });
    test('setAuthWorking', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'setAuthWorking', isAuthWorking: true },
      );
      expect(newState.auth.isAuthWorking).toBe(true);
      const newState2 = reducer(
        newState,
        { type: 'setAuthWorking', isAuthWorking: false },
      );
      expect(newState2.auth.isAuthWorking).toBe(false);
    });
    test('setAuthWsConnected', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'setAuthWsConnected', isAuthWsConnected: true },
      );
      expect(newState.auth.isAuthWsConnected).toBe(true);
      const newState2 = reducer(
        newState,
        { type: 'setAuthWsConnected', isAuthWsConnected: false },
      );
      expect(newState2.auth.isAuthWsConnected).toBe(false);
    });
    test('fetchAuthSucceeded', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchAuthSucceeded', isAuthenticated: true, response: { user: 'foo' } },
      );
      expect(newState.fetches.auth.status).toBe(FETCH_STATUS.SUCCESS);
      expect(newState.auth.isAuthenticated).toBe(true);
      expect(newState.auth.userData).toStrictEqual({ user: 'foo' });
      const newState2 = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchAuthSucceeded', isAuthenticated: false, response: {} },
      );
      expect(newState2.fetches.auth.status).toBe(FETCH_STATUS.SUCCESS);
      expect(newState2.auth.isAuthenticated).toBe(false);
      expect(newState2.auth.userData).toStrictEqual({});
    });
    test('fetchAuthFailed', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchAuthFailed', error: 'BAD' },
      );
      expect(newState.fetches.auth.status).toBe(FETCH_STATUS.ERROR);
      expect(newState.fetches.auth.error).toBe('BAD');
      expect(newState.hasError).toBe(false); // auth failures do not invalidate the context
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
