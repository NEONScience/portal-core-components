import debounce from 'lodash/debounce';

import { exists, isStringNonEmpty } from '../util/typeUtil';

const debouncedGaExploreSearchEvent = debounce((searchTerm: string): void => {
  // @ts-ignore
  window.gtmDataLayer.push({
    event: 'dataProductSearch',
    dataProductSearchTerm: searchTerm,
  });
  // @ts-ignore
  window.gtag(
    'event',
    'explore_data_products_search',
    { search_term: searchTerm },
  );
}, 1000);

const debouncedGaPrototypeDataSearchEvent = debounce((searchTerm: string): void => {
  // @ts-ignore
  window.gtmDataLayer.push({
    event: 'prototypeDatasetSearch',
    datasetSearchTerm: searchTerm,
  });
  // @ts-ignore
  window.gtag(
    'event',
    'prototype_data_search',
    { search_term: searchTerm },
  );
}, 1000);

const gaPortalHomeSearchEvent = (searchTerm: string): void => {
  // @ts-ignore
  window.gtmDataLayer.push({
    event: 'portalHomeSearch',
    portalHomeSearchTerm: searchTerm,
  });
  // @ts-ignore
  window.gtag(
    'event',
    'portal_home_search',
    { search_term: searchTerm },
  );
};

export interface IAnalyticsService {
  /**
   * Sends a GA explore data products search event with the specified search term.
   * This function is debounced to reduce noise.
   * @param searchTerm The search term to record.
   */
  gaExploreSearchEvent: (searchTerm: string) => void;
  /**
   * Sends a GA prototype data search event with the specified search term.
   * This function is debounced to reduce noise.
   * @param searchTerm The search term to record.
   */
  gaPrototypeDataSearchEvent: (searchTerm: string) => void;
  /**
   * Sends a GA portal home search event with the specified search term.
   * @param searchTerm The search term to record.
   */
  gaPortalHomeSearchEvent: (searchTerm: string) => void;
}

const checkValid = (searchTerm: string): boolean => {
  // @ts-ignore
  if (!exists(window.gtmDataLayer) || !exists(window.gtmDataLayerGA4) || !exists(window.gtag)) {
    return false;
  }
  if (!isStringNonEmpty(searchTerm)) {
    return false;
  }
  return true;
};

const AnalyticsService: IAnalyticsService = {
  gaExploreSearchEvent: (searchTerm: string): void => {
    if (!checkValid(searchTerm)) return;
    debouncedGaExploreSearchEvent(searchTerm);
  },
  gaPrototypeDataSearchEvent: (searchTerm: string): void => {
    if (!checkValid(searchTerm)) return;
    debouncedGaPrototypeDataSearchEvent(searchTerm);
  },
  gaPortalHomeSearchEvent: (searchTerm: string): void => {
    if (!checkValid(searchTerm)) return;
    gaPortalHomeSearchEvent(searchTerm);
  },
};

export default AnalyticsService;
