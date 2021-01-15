import {
  boundsAreValid,
  calculateLocationsInBounds,
  deriveFullObservatoryZoomLevel,
  getHref,
  DEFAULT_STATE,
  FEATURES,
} from '../SiteMapUtils';

describe('SiteMapUtils', () => {
  /**
     Functions
  */
  describe('boundsAreValid', () => {
    test('correctly identifies valid bounds', () => {
      [
        { lat: [10, 20], lng: [10, 20] },
        { lat: [-10, 20], lng: [-80, -30] },
      ].forEach((bounds) => {
        expect(boundsAreValid(bounds)).toBe(true);
      });
    });
    test('correctly identifies invalid bounds', () => {
      [
        null,
        '',
        [[10, 20], [10, 20]],
        { lat: [10, 20], lon: [10, 20] },
        { lat: [20, 10], lng: [10, 20] },
      ].forEach((bounds) => {
        expect(boundsAreValid(bounds)).toBe(false);
      });
    });
  });

  describe('calculateLocationsInBounds', () => {
    const locations = {
      A: { latitude: 15, longitude: 0 },
      B: { latitude: 12, longitude: 0 },
      C: { latitude: 19, longitude: 0 },
      D: { latitude: 8, longitude: 0 },
      E: { latitude: 27, longitude: 0 },
      F: { latitude: -2, longitude: 0 },
      G: { latitude: 38, longitude: 0 },
      H: { latitude: 15, longitude: 0 },
      I: { latitude: 15, longitude: -15 },
      J: { latitude: 15, longitude: 23 },
      K: { latitude: 15, longitude: -37 },
      L: { latitude: 15, longitude: 42 },
      M: { latitude: 15, longitude: -62 },
      N: { latitude: 15, longitude: 71 },
      X: { latitude: 15 },
      Y: { longitude: 0 },
      Z: [12, 0],
    };
    const coordLocations = {
      X: {
        geometry: {
          coordinates: [[13, 20]],
        },
      },
      Y: {
        geometry: {
          coordinates: [[0, 67], [24, -80], [17, -5]],
        },
      },
      Z: {
        geometry: {
          coordinates: [
            [[12, 0], [-30, -41], [-35, 8]],
            [[-32, -87], [-37, -82], [-41, -65]],
          ],
        },
      },
      W: {
        geometry: {
          coordinates: [
            [[56, 0], [-30, -41], [-35, 8]],
            [[-32, -87], [-37, -82], [-41, -65]],
          ],
        },
      },
    };
    const bounds = { lat: [10, 20], lng: [-30, 30] };
    test('correctly identifies locations in bounds with neither map nor point extension', () => {
      expect(calculateLocationsInBounds(locations, bounds)).toStrictEqual([
        'A', 'B', 'C', 'H', 'I', 'J',
      ]);
    });
    test('correctly identifies locations in bounds with only map extension', () => {
      expect(calculateLocationsInBounds(locations, bounds, true)).toStrictEqual([
        'A', 'B', 'C', 'D', 'H', 'I', 'J', 'K', 'L',
      ]);
    });
    test('correctly identifies locations in bounds with only point extension', () => {
      expect(calculateLocationsInBounds(locations, bounds, false, 10)).toStrictEqual([
        'A', 'B', 'C', 'D', 'E', 'H', 'I', 'J', 'K',
      ]);
    });
    test('correctly identifies locations in bounds with both map and point extension', () => {
      expect(calculateLocationsInBounds(locations, bounds, true, 10)).toStrictEqual([
        'A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J',  'K', 'L', 'M',
      ]);
    });
    test('correctly handles deeply nested single coord geometries', () => {
      expect(calculateLocationsInBounds(coordLocations, bounds)).toStrictEqual([
        'X', 'Y', 'Z',
      ]);
    });
    test('correctly returns empty set for invalid inputs', () => {
      expect(calculateLocationsInBounds({})).toStrictEqual([]);
      expect(calculateLocationsInBounds('bad locations')).toStrictEqual([]);
      expect(calculateLocationsInBounds(locations, 'bad bounds')).toStrictEqual([]);
    });
    test('correctly reflects back all locations for null/missing bounds', () => {
      expect(calculateLocationsInBounds(locations)).toStrictEqual(Object.keys(locations));
      expect(calculateLocationsInBounds(locations, null)).toStrictEqual(Object.keys(locations));
    });
  });

  describe('deriveFullObservatoryZoomLevel', () => {
    test('returns FALLBACK_ZOOM if provided mapRef is not valid', () => {
      expect(deriveFullObservatoryZoomLevel()).toBe(2);
      expect(deriveFullObservatoryZoomLevel({ current: null })).toBe(2);
    });
    test('returns appropriate zoom levels for various container sizes', () => {
      const mapRef = { current: { container: { parentElement: {} } } };
      [
        [10, 0, 2],
        [0, 10, 2],
        [10, 10, 1],
        [300, 200, 1],
        [600, 400, 2],
        [800, 600, 2],
        [1000, 800, 3],
        [1400, 1200, 4],
        [1200, 200, 1],
        [1200, 600, 2],
      ].forEach((test) => {
        mapRef.current.container.parentElement.clientWidth = test[0];
        mapRef.current.container.parentElement.clientHeight = test[1];
        expect(deriveFullObservatoryZoomLevel(mapRef)).toBe(test[2]);
      });
    });
  });

  describe('getHref', () => {
    test('generates proper fallback href for missing or invalid key', () => {
      expect(getHref()).toEqual('#');
      expect(getHref('INVALID_KEY', 'foo')).toEqual('#');
    });
    test('generates proper href for EXPLORE_DATA_PRODUCTS_BY_SITE', () => {
      expect(getHref('EXPLORE_DATA_PRODUCTS_BY_SITE', 'ARIK'))
        .toEqual('https://data.neonscience.org/data-products/explore?site=ARIK');
      expect(getHref('EXPLORE_DATA_PRODUCTS_BY_SITE')).toEqual('#');
    });
    test('generates proper href for EXPLORE_DATA_PRODUCTS_BY_STATE', () => {
      expect(getHref('EXPLORE_DATA_PRODUCTS_BY_STATE', 'CO'))
        .toEqual('https://data.neonscience.org/data-products/explore?state=CO');
      expect(getHref('EXPLORE_DATA_PRODUCTS_BY_STATE')).toEqual('#');
    });
    test('generates proper href for EXPLORE_DATA_PRODUCTS_BY_DOMAIN', () => {
      expect(getHref('EXPLORE_DATA_PRODUCTS_BY_DOMAIN', 'D13'))
        .toEqual('https://data.neonscience.org/data-products/explore?domain=D13');
      expect(getHref('EXPLORE_DATA_PRODUCTS_BY_DOMAIN')).toEqual('#');
    });
    test('generates proper href for SITE_DETAILS', () => {
      expect(getHref('SITE_DETAILS', 'BARC'))
        .toEqual('https://www.neonscience.org/field-sites/BARC');
      expect(getHref('SITE_DETAILS')).toEqual('#');
    });
    test('generates proper href for DOMAIN_DETAILS', () => {
      expect(getHref('DOMAIN_DETAILS', 'D08'))
        .toEqual('https://www.neonscience.org/domains/D08');
      expect(getHref('DOMAIN_DETAILS')).toEqual('#');
    });
  });

  /**
     CONSTANTS
  */
  describe('FEATURES construction', () => {
    test('all features have an explicit KEY', () => {
      Object.keys(FEATURES).forEach((key) => {
        expect(FEATURES[key].KEY).toBe(key);
      });
    });
  });

  describe('DEFAULT_STATE construction', () => {
    test('view - all VIEWS present and uninitialized', () => {
      expect(DEFAULT_STATE.view).toStrictEqual({
        current: null,
        initialized: {
          MAP: false,
          TABLE: false,
        },
      });
    });
    describe('featureDataFetches - initialized for all fetchable in FEATURE_DATA_SOURCES', () => {
      expect(DEFAULT_STATE.featureDataFetches).toStrictEqual({
        REST_LOCATIONS_API: {
          SITE_LOCATION_HIERARCHIES: {},
          TOWERS: {},
        },
        ARCGIS_ASSETS_API: {
          FLIGHT_BOX_BOUNDARIES: {},
          WATERSHED_BOUNDARIES: {},
          DRAINAGE_LINES: {},
          POUR_POINTS: {},
          SAMPLING_BOUNDARIES: {},
          AQUATIC_REACHES: {},
          TOWER_AIRSHEDS: {},
        },
        GRAPHQL_LOCATIONS_API: {
          10: {},
          11: {},
          13: {},
          14: {},
          15: {},
          16: {},
          17: {},
        },
      });        
    });      
  });
});
