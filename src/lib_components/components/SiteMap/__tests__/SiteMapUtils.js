import cloneDeep from 'lodash/cloneDeep';

import L from 'leaflet';
import {
  getDefaultState,
  boundsAreValid,
  calculateLocationsInBounds,
  deriveFullObservatoryZoomLevel,
  getDynamicAspectRatio,
  getHref,
  hydrateNeonContextData,
  mapIsAtFocusLocation,
  getZoomedIcon,
  getZoomedIcons,
  findCentroid,
  getPhantomLeafletMap,
  getMapStateForFocusLocation,
  getMapStateForManualLocationData,
  parseManualLocationFeatureData,
  FEATURES,
  FEATURE_TYPES,
  MANUAL_LOCATION_TYPES,
  SITE_MAP_PROP_TYPES,
  HIGHLIGHT_STATUS,
  SELECTION_STATUS,
} from '../SiteMapUtils';

jest.mock('leaflet', () => ({
  ...(jest.requireActual('leaflet')),
  Icon: jest.fn(),
}));

const neonContextData = {
  sites: {
    ABBY: {
      type: 'GRADIENT', terrain: 'TERRESTRIAL', stateCode: 'WA', domainCode: 'D16',
    },
    CLBJ: {
      type: 'CORE', terrain: 'TERRESTRIAL', stateCode: 'TX', domainCode: 'D11',
    },
    SUGG: {
      type: 'CORE', terrain: 'AQUATIC', stateCode: 'FL', domainCode: 'D03',
    },
    WLOU: {
      type: 'GRADIENT', terrain: 'AQUATIC', stateCode: 'CO', domainCode: 'D13',
    },
  },
  states: {
    CO: { name: 'Colorado' },
    FL: { name: 'Florida' },
    TX: { name: 'Texas' },
    WA: { name: 'Washington' },
  },
  domains: {
    D03: { name: 'Southeast' },
    D11: { name: 'Southern Plains' },
    D13: { name: 'Southern Rockies and Colorado Plateau' },
    D16: { name: 'Pacific Northwest' },
  },
  stateSites: {
    CO: ['WLOU'], FL: ['SUGG'], TX: ['CLBJ'], WA: ['ABBY'],
  },
  domainSites: {
    D03: ['SUGG'], D11: ['CLBJ'], D13: ['WLOU'], D16: ['ABBY'],
  },
};

describe('SiteMap - SiteMapUtils', () => {
  /**
     Functions
  */
  describe('boundsAreValid()', () => {
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

  describe('calculateLocationsInBounds()', () => {
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
        'A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M',
      ]);
    });
    test('correctly handles deeply nested single coord geometries', () => {
      expect(calculateLocationsInBounds(coordLocations, bounds)).toStrictEqual([
        'X', 'Y', 'Z',
      ]);
    });
    test('correctly excludes boundaries that do not intersect the bounds', () => {
      const smallerBounds = { lat: [15, 20], lng: [-6, 0] };
      expect(calculateLocationsInBounds(coordLocations, smallerBounds)).toStrictEqual([
        'Y',
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

  describe('deriveFullObservatoryZoomLevel()', () => {
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
        /* eslint-disable prefer-destructuring */
        mapRef.current.container.parentElement.clientWidth = test[0];
        mapRef.current.container.parentElement.clientHeight = test[1];
        expect(deriveFullObservatoryZoomLevel(mapRef)).toBe(test[2]);
        /* eslint-enable prefer-destructuring */
      });
    });
  });

  describe('getDynamicAspectRatio()', () => {
    let windowSpy;
    beforeEach(() => {
      windowSpy = jest.spyOn(global, 'window', 'get');
    });
    afterEach(() => {
      windowSpy.mockRestore();
    });
    test('gets appropriate aspect ratios for various window sizes without a buffer', () => {
      [
        [800, 1, (1 / 3)],
        [800, 100, (1 / 3)],
        [800, 300, (1 / 2.5)],
        [800, 400, (9 / 16)],
        [800, 450, (2 / 3)],
        [800, 520, (5 / 7)],
        [800, 600, (4 / 5)],
        [800, 800, (1 / 1)],
        [800, 1000, (5 / 4)],
        [750, 1000, (7 / 5)],
        [700, 1000, (3 / 2)],
        [600, 1000, (16 / 9)],
        [500, 1000, (2 / 1)],
        [100, 1000, (2 / 1)],
        [1, 1000, (2 / 1)],
      ].forEach((test) => {
        windowSpy.mockImplementation(() => (
          { innerWidth: test[0], innerHeight: test[1] }
        ));
        expect(getDynamicAspectRatio()).toBe(test[2]);
      });
    });
    test('gets appropriate aspect ratios for various window sizes with a buffer', () => {
      [
        [800, 1, (1 / 3)],
        [800, 400, (1 / 3)],
        [800, 600, (1 / 2.5)],
        [800, 700, (9 / 16)],
        [800, 750, (2 / 3)],
        [800, 820, (5 / 7)],
        [800, 900, (4 / 5)],
        [800, 1100, (1 / 1)],
        [800, 1300, (5 / 4)],
        [750, 1300, (7 / 5)],
        [700, 1300, (3 / 2)],
        [600, 1300, (16 / 9)],
        [500, 1300, (2 / 1)],
        [100, 1300, (2 / 1)],
        [1, 1300, (2 / 1)],
      ].forEach((test) => {
        windowSpy.mockImplementation(() => (
          { innerWidth: test[0], innerHeight: test[1] }
        ));
        expect(getDynamicAspectRatio(300)).toBe(test[2]);
      });
    });
  });

  describe('getHref()', () => {
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

  describe('hydrateNeonContextData()', () => {
    test('applies NeonContext data correctly', () => {
      const initialState = {
        neonContextHydrated: false,
        sites: {},
        featureData: {
          SITES: {
            TERRESTRIAL_CORE_SITES: {},
            AQUATIC_CORE_SITES: {},
            TERRESTRIAL_GRADIENT_SITES: {},
            AQUATIC_GRADIENT_SITES: {},
          },
          STATES: { STATES: {} },
          DOMAINS: { DOMAINS: {} },
        },
      };
      expect(hydrateNeonContextData(initialState, neonContextData)).toStrictEqual({
        neonContextHydrated: true,
        sites: { ...neonContextData.sites },
        featureData: {
          SITES: {
            TERRESTRIAL_CORE_SITES: {
              CLBJ: { ...neonContextData.sites.CLBJ },
            },
            AQUATIC_CORE_SITES: {
              SUGG: { ...neonContextData.sites.SUGG },
            },
            TERRESTRIAL_GRADIENT_SITES: {
              ABBY: { ...neonContextData.sites.ABBY },
            },
            AQUATIC_GRADIENT_SITES: {
              WLOU: { ...neonContextData.sites.WLOU },
            },
          },
          STATES: {
            STATES: {
              CO: { name: 'Colorado', sites: ['WLOU'] },
              FL: { name: 'Florida', sites: ['SUGG'] },
              TX: { name: 'Texas', sites: ['CLBJ'] },
              WA: { name: 'Washington', sites: ['ABBY'] },
            },
          },
          DOMAINS: {
            DOMAINS: {
              D03: { name: 'Southeast', sites: ['SUGG'] },
              D11: { name: 'Southern Plains', sites: ['CLBJ'] },
              D13: { name: 'Southern Rockies and Colorado Plateau', sites: ['WLOU'] },
              D16: { name: 'Pacific Northwest', sites: ['ABBY'] },
            },
          },
        },
      });
    });
  });

  describe('getPhantomLeafletMap()', () => {
    test('provides sane defaults for size when aspect ratio and width reference are null', () => {
      const state = {
        map: { center: [0, 0], zoom: null },
        aspectRatio: { currentValue: null, widthReference: null },
      };
      const phantomMap = getPhantomLeafletMap(state);
      expect(phantomMap.getZoom()).toBe(0);
      expect(phantomMap.getCenter()).toStrictEqual({ lat: 0, lng: 0 });
      expect(phantomMap.getSize()).toStrictEqual({ x: 400, y: 300 });
    });
    test('provides size based off of aspect ratio and width reference when defined', () => {
      const state = {
        map: { center: [70, -110], zoom: 4 },
        aspectRatio: { currentValue: 0.85, widthReference: 600 },
      };
      const phantomMap = getPhantomLeafletMap(state);
      expect(phantomMap.getZoom()).toBe(4);
      expect(phantomMap.getCenter()).toStrictEqual({ lat: 70, lng: -110 });
      expect(phantomMap.getSize()).toStrictEqual({ x: 600, y: 510 });
    });
  });

  describe('getMapState functions', () => {
    const newMapStateBoundsAreValid = (newMapState) => {
      expect(typeof newMapState.bounds).toBe('object');
      expect(new Set(Object.keys(newMapState.bounds))).toStrictEqual(new Set(['lat', 'lng']));
      expect(newMapState.bounds.lat.every((c) => Number.isFinite(c))).toBe(true);
      expect(newMapState.bounds.lng.every((c) => Number.isFinite(c))).toBe(true);
      expect(newMapState.bounds.lat[0]).toBeLessThan(newMapState.center[0]);
      expect(newMapState.bounds.lat[1]).toBeGreaterThan(newMapState.center[0]);
      expect(newMapState.bounds.lng[0]).toBeLessThan(newMapState.center[1]);
      expect(newMapState.bounds.lng[1]).toBeGreaterThan(newMapState.center[1]);
    };
    const newMapStateZoomedIconsAreValid = (newMapState) => {
      expect(typeof newMapState.zoomedIcons).toBe('object');
      expect(Object.keys(newMapState.zoomedIcons).length).toBeGreaterThan(0);
    };

    describe('getMapStateForManualLocationData()', () => {
      test('returns previous map state if no manual locations are present', () => {
        const state = {
          map: { center: [60, -115], zoom: 10 },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
        };
        const newMapState = getMapStateForManualLocationData(state);
        expect(newMapState).toStrictEqual(state.map);
      });
      test('returns previous map state if manual locations are present but incomplete lat/lon', () => {
        const state = {
          map: { center: [60, -115], zoom: 10 },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          manualLocationData: [{ latitude: 'bar', longitude: -35 }, { baz: 'qux', latitude: 24 }],
        };
        const newMapState = getMapStateForManualLocationData(state);
        expect(newMapState).toStrictEqual(state.map);
      });
      test('builds out complete map state for a single manual location', () => {
        const state = {
          map: { center: [60, -115], zoom: 10 },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          manualLocationData: [
            { latitude: 35, longitude: -85 },
          ],
        };
        const newMapState = getMapStateForManualLocationData(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(6);
        expect(newMapState.center).toStrictEqual([35, -85]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
      test('builds out complete map state for multiple manual locations', () => {
        const state = {
          map: { center: [60, -115], zoom: 10 },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          manualLocationData: [
            { latitude: 18.02192, longitude: -66.61391 },
            { latitude: 34.444218, longitude: -96.624201 },
            { latitude: 31.199, longitude: -84.467 },
          ],
        };
        const newMapState = getMapStateForManualLocationData(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(4);
        expect(newMapState.center).toStrictEqual([28.4642, -81.8378]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
    });

    describe('getMapStateForFocusLocation()', () => {
      test('returns previous map state if no focus location is present', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(newMapState).toStrictEqual(state.map);
      });
      test('returns previous map state if focus location is present but has invalid lat/lon', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          focusLocation: {
            current: 'Foo',
            data: { type: 'bar', latitude: 62, longitude: null },
          },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(newMapState).toStrictEqual(state.map);
      });
      test('properly handles type SITE', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          focusLocation: {
            current: 'FOO',
            data: { type: 'SITE', latitude: 62, longitude: -12 },
          },
          sites: {
            FOO: { zoom: 13 },
          },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(13);
        expect(newMapState.center).toStrictEqual([62, -12]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
      test('properly handles type DOMAIN', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          focusLocation: {
            current: 'D18',
            data: { type: 'DOMAIN', latitude: 42, longitude: -72 },
          },
          featureData: {
            [FEATURE_TYPES.DOMAINS.KEY]: {
              [FEATURES.DOMAINS.KEY]: {
                D18: { zoom: 7 },
              },
            },
          },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(7);
        expect(newMapState.center).toStrictEqual([42, -72]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
      test('properly handles type STATE', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          focusLocation: {
            current: 'CO',
            data: { type: 'STATE', latitude: 56, longitude: -116 },
          },
          featureData: {
            [FEATURE_TYPES.STATES.KEY]: {
              [FEATURES.STATES.KEY]: {
                CO: { zoom: 9 },
              },
            },
          },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(9);
        expect(newMapState.center).toStrictEqual([56, -116]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
      test('properly handles other feature type with set focusZoom', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          focusLocation: {
            current: 'plotABC',
            data: { type: 'OS Plot - mam', latitude: 61, longitude: -122 },
          },
          featureData: {
            [FEATURE_TYPES.LOCATIONS.KEY]: {
              [FEATURES.DISTRIBUTED_MAMMAL_GRIDS.KEY]: {
                plotABC: { latitude: 61, longitude: -122 },
              },
            },
          },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(17);
        expect(newMapState.center).toStrictEqual([61, -122]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
      test('properly handles other feature type without set focusZoom', () => {
        const state = {
          map: { ...getDefaultState().map },
          aspectRatio: { currentValue: 0.6, widthReference: 640 },
          focusLocation: {
            current: 'buoyABC',
            data: { type: 'BUOY', latitude: 61, longitude: -122 },
          },
          featureData: {
            [FEATURE_TYPES.LOCATIONS.KEY]: {
              [FEATURES.AQUATIC_BUOYS.KEY]: {
                plotABC: { latitude: 61, longitude: -122 },
              },
            },
          },
        };
        const newMapState = getMapStateForFocusLocation(state);
        expect(typeof newMapState).toBe('object');
        expect(newMapState.zoom).toBe(18);
        expect(newMapState.center).toStrictEqual([61, -122]);
        newMapStateBoundsAreValid(newMapState);
        newMapStateZoomedIconsAreValid(newMapState);
      });
    });
  });

  describe('parseManualLocationFeatureData()', () => {
    test('does nothing when neonContextData is not yet hydrated', () => {
      const initialState = {
        neonContextHydrated: false,
        sites: {},
        featureData: { SITES: { DECOMMISSIONED_SITES: {} } },
        map: { ...getDefaultState().map },
        manualLocationData: [
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            siteCode: 'FOOO',
            siteName: 'fooo site',
            domain: 'D03',
            state: 'FL',
          },
        ],
      };
      expect(parseManualLocationFeatureData(initialState)).toStrictEqual(initialState);
    });
    test('does nothing when manualLocationData is missing or empty', () => {
      const initialState = {
        neonContextHydrated: true,
        sites: { ...neonContextData.sites },
        featureData: { SITES: { DECOMMISSIONED_SITES: {} } },
        map: { ...getDefaultState().map },
        manualLocationData: [
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            siteCode: 'FOOO',
            siteName: 'fooo site',
            domain: 'D03',
            state: 'FL',
          },
        ],
      };
      expect(parseManualLocationFeatureData(initialState)).toStrictEqual(initialState);
    });
    test('applies manualLocationData correctly when present', () => {
      const initialState = {
        neonContextHydrated: true,
        sites: { ...neonContextData.sites },
        featureData: {
          SITES: {
            DECOMMISSIONED_SITES: {},
          },
        },
        map: { ...getDefaultState().map },
        manualLocationData: [
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            siteCode: 'FOOO',
            siteName: 'fooo site',
            domain: 'D03',
            state: 'FL',
          },
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            siteCode: 'ABBY',
            siteName: 'abby site', // known incorrect, expect context data to override
            domain: 'D11',
            state: 'TX',
          },
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            siteCode: 'BRRR',
            siteName: 'brrr site',
            domain: 'D16',
            state: 'WA',
          },
        ],
      };
      expect(parseManualLocationFeatureData(initialState)).toStrictEqual({
        neonContextHydrated: true,
        sites: { ...neonContextData.sites },
        map: { ...getDefaultState().map, center: [52.68, -110.75] },
        manualLocationData: [
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            type: 'Decommissioned',
            siteCode: 'FOOO',
            siteName: 'fooo site',
            description: 'fooo site',
            domain: 'D03',
            domainCode: 'D03',
            state: 'FL',
            stateCode: 'FL',
          },
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            siteCode: 'ABBY',
            siteName: 'abby site', // known incorrect, expect context data to override
            domain: 'D11',
            state: 'TX',
          },
          {
            manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
            type: 'Decommissioned',
            siteCode: 'BRRR',
            siteName: 'brrr site',
            description: 'brrr site',
            domain: 'D16',
            domainCode: 'D16',
            state: 'WA',
            stateCode: 'WA',
          },
        ],
        featureData: {
          SITES: {
            DECOMMISSIONED_SITES: {
              FOOO: {
                manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
                type: 'Decommissioned',
                siteCode: 'FOOO',
                siteName: 'fooo site',
                description: 'fooo site',
                domain: 'D03',
                domainCode: 'D03',
                state: 'FL',
                stateCode: 'FL',
              },
              BRRR: {
                manualLocationType: MANUAL_LOCATION_TYPES.PROTOTYPE_SITE,
                type: 'Decommissioned',
                siteCode: 'BRRR',
                siteName: 'brrr site',
                description: 'brrr site',
                domain: 'D16',
                domainCode: 'D16',
                state: 'WA',
                stateCode: 'WA',
              },
            },
          },
        },
      });
    });
  });

  describe('mapIsAtFocusLocation()', () => {
    test('correctly identifies when map center is at focus location', () => {
      expect(mapIsAtFocusLocation({
        map: { zoom: 4, center: [-68.3, 15] },
        focusLocation: {
          current: 'foo',
          map: { zoom: 4, center: [-68.3, 15] },
        },
      })).toBe(true);
    });
    test('correctly identifies when map center is not at focus location', () => {
      expect(mapIsAtFocusLocation({
        map: { zoom: 5, center: [-68.3, 15] },
        focusLocation: {
          current: 'foo',
          map: { zoom: 4, center: [-68.3, 15] },
        },
      })).toBe(false);
      expect(mapIsAtFocusLocation({
        map: { zoom: 4, center: [-69.3, 15] },
        focusLocation: {
          current: 'foo',
          map: { zoom: 4, center: [-68.3, 15] },
        },
      })).toBe(false);
    });
    test('gracefully returns false for any missing focus location or malformed state', () => {
      expect(mapIsAtFocusLocation()).toBe(false);
      expect(mapIsAtFocusLocation({
        map: { zoom: 4, center: [-69.3, 15] },
        focusLocation: { current: null },
      })).toBe(false);
      expect(mapIsAtFocusLocation({
        map: { zoom: 4, center: [-68.3, 15] },
        focusLocation: {
          current: null,
          map: { zoom: 4, center: [-68.3, 15] },
        },
      })).toBe(false);
      expect(mapIsAtFocusLocation({
        map: { zoom: 4, center: [-68.3, 15] },
        focusLocation: {
          current: 'foo',
          map: { center: [-68.3, 15] },
        },
      })).toBe(false);
    });
  });

  describe('getZoomedIcon()', () => {
    beforeEach(() => { L.Icon.mockReset(); });
    test('Uses placeholder when feature has no defined icon', () => {
      getZoomedIcon(FEATURES.TOWER_AIRSHEDS.KEY);
      expect(L.Icon.mock.calls.length).toBe(1);
      expect(L.Icon.mock.calls[0].length).toBe(1);
      expect(L.Icon.mock.calls[0][0]).toStrictEqual({
        iconUrl: 'svg-file.svg',
        iconRetinaUrl: 'svg-file.svg',
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5],
        popupAnchor: [0, -7.5],
        shadowUrl: 'svg-file.svg',
        shadowSize: [18.8, 18.8],
        shadowAnchor: [9.4, 9.4],
      });
    });
    test('Scales appropriately with no defined zoom', () => {
      getZoomedIcon(FEATURES.POUR_POINTS.KEY);
      expect(L.Icon.mock.calls.length).toBe(1);
      expect(L.Icon.mock.calls[0].length).toBe(1);
      expect(L.Icon.mock.calls[0][0]).toStrictEqual({
        iconUrl: 'svg-file.svg',
        iconRetinaUrl: 'svg-file.svg',
        iconSize: [16, 18],
        iconAnchor: [8, 9],
        popupAnchor: [0, -9],
        shadowUrl: 'svg-file.svg',
        shadowSize: [20.2, 22.2],
        shadowAnchor: [10.1, 11.1],
      });
    });
    test('Scales appropriately with defined zoom', () => {
      getZoomedIcon(FEATURES.TOWERS.KEY, 12);
      expect(L.Icon.mock.calls.length).toBe(1);
      expect(L.Icon.mock.calls[0].length).toBe(1);
      expect(L.Icon.mock.calls[0][0]).toStrictEqual({
        iconUrl: 'svg-file.svg',
        iconRetinaUrl: 'svg-file.svg',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24],
        shadowUrl: 'svg-file.svg',
        shadowSize: [59.52, 59.52],
        shadowAnchor: [29.76, 29.76],
      });
    });
    test('Handles explicit highlight status', () => {
      getZoomedIcon(FEATURES.TERRESTRIAL_GRADIENT_SITES.KEY, 7, HIGHLIGHT_STATUS.HIGHLIGHT);
      expect(L.Icon.mock.calls.length).toBe(1);
      expect(L.Icon.mock.calls[0].length).toBe(1);
      expect(L.Icon.mock.calls[0][0]).toStrictEqual({
        iconUrl: 'svg-file.svg',
        iconRetinaUrl: 'svg-file.svg',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -17],
        shadowUrl: 'svg-file.svg',
        shadowSize: [51, 51],
        shadowAnchor: [25.5, 25.5],
      });
    });
    test('Handles explicit selection status', () => {
      getZoomedIcon(
        FEATURES.AQUATIC_GRADIENT_SITES.KEY,
        15,
        HIGHLIGHT_STATUS.NONE,
        SELECTION_STATUS.SELECTED,
      );
      expect(L.Icon.mock.calls.length).toBe(1);
      expect(L.Icon.mock.calls[0].length).toBe(1);
      expect(L.Icon.mock.calls[0][0]).toStrictEqual({
        iconUrl: 'svg-file.svg',
        iconRetinaUrl: 'svg-file.svg',
        iconSize: [79.75, 79.75],
        iconAnchor: [39.875, 39.875],
        popupAnchor: [0, -39.875],
        shadowUrl: 'svg-file.svg',
        shadowSize: [94.25, 94.25],
        shadowAnchor: [47.125, 47.125],
      });
    });
  });

  describe('getZoomedIcons()', () => {
    test('generates an icon map with appropriate structure and feature representation', () => {
      const zoomedIcons = getZoomedIcons(5);
      expect(typeof zoomedIcons).toBe('object');
      Object.keys(zoomedIcons).forEach((f) => {
        const feature = FEATURES[f];
        expect(!!feature.iconSvg && !!feature.iconShape).toBe(true);
        expect(typeof zoomedIcons[f]).toBe('object');
        if (FEATURE_TYPES[feature.type].selectable) {
          expect(Object.keys(zoomedIcons[f])).toStrictEqual(Object.keys(SELECTION_STATUS));
        } else {
          expect(Object.keys(zoomedIcons[f])).toStrictEqual([SELECTION_STATUS.UNSELECTED]);
        }
        Object.keys(zoomedIcons[f]).forEach((s) => {
          expect(Object.keys(zoomedIcons[f][s])).toStrictEqual(Object.keys(HIGHLIGHT_STATUS));
        });
      });
    });
  });

  describe('findCentroid()', () => {
    test('returns null if not provided a non-empty array of all valid points', () => {
      expect(findCentroid()).toBe(null);
      expect(findCentroid([])).toBe(null);
      expect(findCentroid(['foo'])).toBe(null);
      expect(findCentroid([[0, 0], [0, 'foo']])).toBe(null);
    });
    test('reflects back only valid point if only one is present', () => {
      expect(findCentroid([[0, 0]])).toStrictEqual([0, 0]);
      expect(findCentroid([[30, 10]])).toStrictEqual([30, 10]);
    });
    test('calculates centroids when provided more than one valid point', () => {
      expect(
        findCentroid([[-10, -10], [10, 10]]),
      ).toStrictEqual([0, 0]);
      expect(
        findCentroid([[18.02192, -66.61391], [34.444218, -96.624201], [31.199, -84.467]]),
      ).toStrictEqual([28.4642, -81.8378]);
    });
  });

  describe('SelectionLimitPropType', () => {
    const { selectionLimit: SelectionLimitPropType } = SITE_MAP_PROP_TYPES;
    test('valid for null', () => {
      expect(SelectionLimitPropType({ p: null }, 'p')).toBe(null);
    });
    test('invalid for unsupported types', () => {
      expect(SelectionLimitPropType({ p: 'foo' }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: () => {} }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: { foo: 'bar' } }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: NaN }, 'p')).toBeInstanceOf(Error);
    });
    test('valid for null / undefined', () => {
      expect(SelectionLimitPropType({}, 'p')).toBe(null);
      expect(SelectionLimitPropType({ p: null }, 'p')).toBe(null);
    });
    test('valid for integers greater than or equal to 1', () => {
      expect(SelectionLimitPropType({ p: 1 }, 'p')).toBe(null);
      expect(SelectionLimitPropType({ p: 10 }, 'p')).toBe(null);
      expect(SelectionLimitPropType({ p: 10000000 }, 'p')).toBe(null);
    });
    test('invalid for integers less than 1', () => {
      expect(SelectionLimitPropType({ p: 0 }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: -7 }, 'p')).toBeInstanceOf(Error);
    });
    test('invalid for non-integer numbers', () => {
      expect(SelectionLimitPropType({ p: 1.7 }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: Math.PI }, 'p')).toBeInstanceOf(Error);
    });
    test('valid for 2-length arrays of increasing non-equal integers', () => {
      expect(SelectionLimitPropType({ p: [2, 5] }, 'p')).toBe(null);
      expect(SelectionLimitPropType({ p: [1, 4000] }, 'p')).toBe(null);
      expect(SelectionLimitPropType({ p: [466, 467] }, 'p')).toBe(null);
    });
    test('invalid for arrays of integers with length other than 2', () => {
      expect(SelectionLimitPropType({ p: [3] }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: [2, 5, 7] }, 'p')).toBeInstanceOf(Error);
    });
    test('invalid for arrays where any values are non-integer or less than 1', () => {
      expect(SelectionLimitPropType({ p: [3, Math.PI] }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: [5.8, 7] }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: [0, 10] }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: [-15, 10] }, 'p')).toBeInstanceOf(Error);
    });
    test('invalid for 2-length integer arrays where values are equal or not ascending', () => {
      expect(SelectionLimitPropType({ p: [3, 3] }, 'p')).toBeInstanceOf(Error);
      expect(SelectionLimitPropType({ p: [7, 5] }, 'p')).toBeInstanceOf(Error);
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
      expect(getDefaultState().view).toStrictEqual({
        current: null,
        initialized: {
          MAP: false,
          TABLE: false,
        },
      });
    });
    describe('featureDataFetches - initialized for all fetchable in FEATURE_DATA_SOURCES', () => {
      expect(getDefaultState().featureDataFetches).toStrictEqual({
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
