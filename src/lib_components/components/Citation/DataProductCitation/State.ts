import cloneDeep from 'lodash/cloneDeep';

import NeonContext from '../../NeonContext/NeonContext';

export const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const CONTEXT_STATUS = {
  INITIALIZING: 'INITIALIZING',
  HAS_FETCHES_TO_TRIGGER: 'HAS_FETCHES_TO_TRIGGER',
  FETCHING: 'FETCHING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export const DEFAULT_STATE = {
  productCode: null,
  release: null,
  component: {
    status: CONTEXT_STATUS.INITIALIZING,
    error: null,
  },
  fetches: {
    product: null,
    productReleases: {},
    bundleParents: {},
    bundleParentReleases: {},
  },
  bundle: {
    parentCodes: [],
    doiProductCode: null,
  },
  data: {
    product: null, // Latest and provisional product metadata
    productReleases: {}, // Product metadata on a per-release basis
    bundleParents: {}, // Latest and provisional bundle parent product metadata
    bundleParentReleases: {}, // Bundle parent product metadata on a per-release basis
    releases: [], // List of release objects; fed from base product or bundle inheritance
  },

  neonContextState: cloneDeep(NeonContext.DEFAULT_STATE),
};
