/**
   NeonContext Mock

   Various tests cover modules that use NeonContext to get state/site/domain metadata. By mocking
   NeonContext and plugging in all fallback data the tested modules will be able to use a hydrated
   NeonContext for more complete testability.

   Usage:
   import 'path/to/src/__mocks__/NeonContext';
*/

import sitesJSON from '../lib_components/staticJSON/sites.json';
import statesJSON from '../lib_components/staticJSON/states.json';
import domainsJSON from '../lib_components/staticJSON/domains.json';
import bundlesJSON from '../lib_components/staticJSON/bundles.json';
import timeSeriesDataProductsJSON from '../lib_components/staticJSON/timeSeriesDataProducts.json';

jest.mock('../lib_components/components/NeonContext/NeonContext', () => (
  {
    ...(jest.requireActual('../lib_components/components/NeonContext/NeonContext').default),
    useNeonContextState: jest.fn(),
  }
));

import NeonContext from '../lib_components/components/NeonContext/NeonContext';

NeonContext.useNeonContextState.mockReturnValue([
  {
    data: {
      sites: sitesJSON,
      states: statesJSON,
      domains: domainsJSON,
      bundles: bundlesJSON,
      timeSeriesDataProducts: timeSeriesDataProductsJSON,
      stateSites: {}, // derived when sites is fetched, needs to be mocked here?
      domainSites: {}, // derived when sites is fetched, needs to be mocked here?
    },
    isFinal: true,
  },
]);