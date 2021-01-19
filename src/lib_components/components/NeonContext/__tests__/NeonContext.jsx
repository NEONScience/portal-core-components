import { renderHook } from "@testing-library/react-hooks";

import statesJSON from '../../../staticJSON/sites.json';

import NeonContext, {
  deriveRegionSites,
  parseSitesFetchResponse,
} from '../NeonContext';

const {
  useNeonContextState,
  DEFAULT_STATE,
} = NeonContext;

describe('NeonContext', () => {
  describe('useNeonContextState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useNeonContextState());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
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
      }
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
        { siteCode: 'SITE_A', stateCode: 'WA', domainCode: 'D16', siteLatitude: 23, longitude: 12 },
        { siteCode: 'SITE_B', stateCode: 'WA', domainCode: 'D16', latitude: 44, siteLongitude: 7 },
        { siteCode: 'SITE_C', stateCode: 'CO', type: 'CORE', terrain: 'AQUATIC' },
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
});
