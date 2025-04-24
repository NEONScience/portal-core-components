import React from 'react';
import renderer from 'react-test-renderer';

import {
  FEATURES,
  FEATURE_TYPES,
  HIGHLIGHT_STATUS,
  SELECTION_STATUS,
  getDefaultState,
} from '../SiteMapUtils';
import SiteMapContext from '../SiteMapContext';

import SiteMapFeature from '../SiteMapFeature';

// Mock the Leaflet Map class
const mockMap = class Map {
  constructor() {
    this.leafletElement = {
      latLngToContainerPoint: () => ({ x: 0, y: 0 }),
      container: {
        clientHeight: 100,
        clientWidth: 200,
        parentNode: {
          clientHeight: 500,
          clientWidth: 600,
        },
      },
    };
  }
};
jest.mock('react-leaflet', () => ({
  ...jest.requireActual('react-leaflet'),
  Map: jest.fn().mockImplementation(mockMap),
}));

// Mock the SiteMapContext state
jest.mock('../SiteMapContext', () => ({
  ...(jest.requireActual('../SiteMapContext').default),
  useSiteMapContext: jest.fn(),
}));

const { useSiteMapContext } = SiteMapContext;

useSiteMapContext.mockReturnValue([{
  ...getDefaultState(),
  neonContextHydrated: true,
  map: {
    zoomedIcons: {
      [FEATURES.HUTS.KEY]: {
        [SELECTION_STATUS.UNSELECTED]: {
          [HIGHLIGHT_STATUS.NONE]: 'icon',
        },
      },
    },
  },
  featureData: {
    [FEATURE_TYPES.LOCATIONS.KEY]: {
      [FEATURES.HUTS.KEY]: {
        ONAQ: {
          HUT107218: {
            description: 'Onaqui-Ault Hut',
            domainCode: 'D15',
            elevation: 1656.4,
            featureKey: 'HUTS',
            latitude: 40.17777,
            longitude: -112.45241,
            name: 'HUT107218',
            parent: 'ONAQ',
            siteCode: 'ONAQ',
            stateCode: 'UT',
            type: 'HUT',
          },
        },
      },
    },
  },
}]);

/**
   SKIPPED TEST SUITE
   The idea behind this suite is to generate snapshots for on set of fixed data for each feature
   on the site map. This attempt started with HUTS and a single HUT data point. It doesn't work yet
   and it looks like more mocking of Leaflet components is necessary, so it's been shelved for now.
*/
describe.skip('SiteMapFeature', () => {
  const mapRef = { current: new Map() };
  Object.keys(FEATURES)
    .filter((featureKey) => featureKey === 'HUTS')
    .forEach((featureKey) => {
      test(`Renders correctly for feature key: ${featureKey}`, () => {
        const tree = renderer
          .create(<SiteMapFeature mapRef={mapRef} featureKey={featureKey} />)
          .toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
});
