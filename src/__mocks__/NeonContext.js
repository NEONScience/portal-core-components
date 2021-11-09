/**
   NeonContext Mock

   Various tests cover modules that use NeonContext to get state/site/domain metadata. By mocking
   NeonContext and plugging in all fallback data the tested modules will be able to use a hydrated
   NeonContext for more complete testability.

   Usage:
   import 'path/to/src/__mocks__/NeonContext';
*/

import sitesJSON from '../sampleData/sites.json';
import bundlesJSON from '../sampleData/bundles.json';
import statesJSON from '../lib_components/staticJSON/states.json';
import domainsJSON from '../lib_components/staticJSON/domains.json';
import timeSeriesDataProductsJSON from '../lib_components/staticJSON/timeSeriesDataProducts.json';

import NeonContext from '../lib_components/components/NeonContext/NeonContext';
import BundleParser from '../lib_components/parser/BundleParser';

jest.mock('../lib_components/components/NeonContext/NeonContext', () => (
  {
    ...(jest.requireActual('../lib_components/components/NeonContext/NeonContext').default),
    useNeonContextState: jest.fn(),
    FETCH_STATUS: {
      AWAITING_CALL: 'AWAITING_CALL',
      FETCHING: 'FETCHING',
      ERROR: 'ERROR',
      SUCCESS: 'SUCCESS',
    },
  }
));

NeonContext.useNeonContextState.mockReturnValue([
  {
    ...NeonContext.DEFAULT_STATE,
    data: {
      sites: sitesJSON,
      states: statesJSON,
      domains: domainsJSON,
      bundles: BundleParser.parseContext(
        BundleParser.parseBundlesResponse(bundlesJSON),
      ),
      timeSeriesDataProducts: timeSeriesDataProductsJSON,
      stateSites: {}, // derived when sites is fetched, needs to be mocked here?
      domainSites: {}, // derived when sites is fetched, needs to be mocked here?
    },
    isFinal: true,
  },
]);
