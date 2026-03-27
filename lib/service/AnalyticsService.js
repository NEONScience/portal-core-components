import debounce from 'lodash/debounce';
import { exists, isStringNonEmpty } from '../util/typeUtil';
const debouncedGaExploreSearchEvent = debounce((searchTerm)=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.gtmDataLayer.push({
        event: 'explore_data_products_search',
        search_term: searchTerm
    });
}, 1000);
const debouncedGaPrototypeDataSearchEvent = debounce((searchTerm)=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.gtmDataLayer.push({
        event: 'prototype_data_search',
        search_term: searchTerm
    });
}, 1000);
const gaPortalHomeSearchEvent = (searchTerm)=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.gtmDataLayer.push({
        event: 'portal_home_search',
        search_term: searchTerm
    });
};
const checkValid = (searchTerm)=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!exists(window.gtmDataLayer)) {
        return false;
    }
    if (!isStringNonEmpty(searchTerm)) {
        return false;
    }
    return true;
};
const AnalyticsService = {
    gaExploreSearchEvent: (searchTerm)=>{
        if (!checkValid(searchTerm)) return;
        debouncedGaExploreSearchEvent(searchTerm);
    },
    gaPrototypeDataSearchEvent: (searchTerm)=>{
        if (!checkValid(searchTerm)) return;
        debouncedGaPrototypeDataSearchEvent(searchTerm);
    },
    gaPortalHomeSearchEvent: (searchTerm)=>{
        if (!checkValid(searchTerm)) return;
        gaPortalHomeSearchEvent(searchTerm);
    }
};
export default AnalyticsService;
