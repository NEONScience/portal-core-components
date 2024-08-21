export namespace FETCH_STATUS {
    let AWAITING_CALL: string;
    let FETCHING: string;
    let ERROR: string;
    let SUCCESS: string;
}
export default NeonContext;
export function getTestableItems(): {
    deriveRegionSites?: undefined;
    parseSitesFetchResponse?: undefined;
    reducer?: undefined;
    DRUPAL_HEADER_HTML?: undefined;
    DRUPAL_FOOTER_HTML?: undefined;
} | {
    deriveRegionSites: (state: any) => any;
    parseSitesFetchResponse: (sitesArray?: any[]) => {};
    reducer: (state: any, action: any) => any;
    DRUPAL_HEADER_HTML: any;
    DRUPAL_FOOTER_HTML: any;
};
declare namespace NeonContext {
    export { Provider };
    export { useNeonContextState };
    export { DEFAULT_STATE };
    export { getWrappedComponent };
    export { ProviderPropTypes };
}
/**
   Context Provider
*/
declare function Provider(inProps: any): React.JSX.Element;
declare namespace Provider {
    export { ProviderPropTypes as propTypes };
}
/**
   HOOK
*/
declare function useNeonContextState(): ({
    data: {
        sites: {};
        bundles: {
            bundleProducts: {};
            bundleProductsForwardAvailability: {};
            bundleDoiLookup: {};
            splitProducts: {};
            allBundleProducts: {};
            apiResponse: never[];
        };
        states: {
            AL: {
                name: string;
                center: number[];
                zoom: number;
            };
            AK: {
                name: string;
                center: number[];
                zoom: number;
            };
            AZ: {
                name: string;
                center: number[];
                zoom: number;
            };
            AR: {
                name: string;
                center: number[];
                zoom: number;
            };
            CA: {
                name: string;
                center: number[];
                zoom: number;
            };
            CO: {
                name: string;
                center: number[];
                zoom: number;
            };
            CT: {
                name: string;
                center: number[];
                zoom: number;
            };
            DC: {
                name: string;
                center: number[];
                zoom: number;
            };
            DE: {
                name: string;
                center: number[];
                zoom: number;
            };
            FL: {
                name: string;
                center: number[];
                zoom: number;
            };
            GA: {
                name: string;
                center: number[];
                zoom: number;
            };
            HI: {
                name: string;
                center: number[];
                zoom: number;
            };
            ID: {
                name: string;
                center: number[];
                zoom: number;
            };
            IL: {
                name: string;
                center: number[];
                zoom: number;
            };
            IN: {
                name: string;
                center: number[];
                zoom: number;
            };
            IA: {
                name: string;
                center: number[];
                zoom: number;
            };
            KS: {
                name: string;
                center: number[];
                zoom: number;
            };
            KY: {
                name: string;
                center: number[];
                zoom: number;
            };
            LA: {
                name: string;
                center: number[];
                zoom: number;
            };
            ME: {
                name: string;
                center: number[];
                zoom: number;
            };
            MD: {
                name: string;
                center: number[];
                zoom: number;
            };
            MA: {
                name: string;
                center: number[];
                zoom: number;
            };
            MI: {
                name: string;
                center: number[];
                zoom: number;
            };
            MN: {
                name: string;
                center: number[];
                zoom: number;
            };
            MS: {
                name: string;
                center: number[];
                zoom: number;
            };
            MO: {
                name: string;
                center: number[];
                zoom: number;
            };
            MT: {
                name: string;
                center: number[];
                zoom: number;
            };
            NE: {
                name: string;
                center: number[];
                zoom: number;
            };
            NV: {
                name: string;
                center: number[];
                zoom: number;
            };
            NH: {
                name: string;
                center: number[];
                zoom: number;
            };
            NJ: {
                name: string;
                center: number[];
                zoom: number;
            };
            NM: {
                name: string;
                center: number[];
                zoom: number;
            };
            NY: {
                name: string;
                center: number[];
                zoom: number;
            };
            NC: {
                name: string;
                center: number[];
                zoom: number;
            };
            ND: {
                name: string;
                center: number[];
                zoom: number;
            };
            OH: {
                name: string;
                center: number[];
                zoom: number;
            };
            OK: {
                name: string;
                center: number[];
                zoom: number;
            };
            OR: {
                name: string;
                center: number[];
                zoom: number;
            };
            PA: {
                name: string;
                center: number[];
                zoom: number;
            };
            PR: {
                name: string;
                center: number[];
                zoom: number;
            };
            RI: {
                name: string;
                center: number[];
                zoom: number;
            };
            SC: {
                name: string;
                center: number[];
                zoom: number;
            };
            SD: {
                name: string;
                center: number[];
                zoom: number;
            };
            TN: {
                name: string;
                center: number[];
                zoom: number;
            };
            TX: {
                name: string;
                center: number[];
                zoom: number;
            };
            UT: {
                name: string;
                center: number[];
                zoom: number;
            };
            VT: {
                name: string;
                center: number[];
                zoom: number;
            };
            VA: {
                name: string;
                center: number[];
                zoom: number;
            };
            WA: {
                name: string;
                center: number[];
                zoom: number;
            };
            WV: {
                name: string;
                center: number[];
                zoom: number;
            };
            WI: {
                name: string;
                center: number[];
                zoom: number;
            };
            WY: {
                name: string;
                center: number[];
                zoom: number;
            };
        };
        domains: {
            D01: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D02: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D03: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D04: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D05: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D06: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D07: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D08: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D09: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D10: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D11: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D12: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D13: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D14: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D15: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D16: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D17: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D18: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D19: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D20: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
        };
        timeSeriesDataProducts: {
            productCodes: string[];
        };
        stateSites: {};
        domainSites: {};
    };
    html: {
        [x: number]: null;
    };
    fetches: {
        [x: number]: {
            status: null;
            error: null;
        };
        sites: {
            status: string;
            error: null;
        };
        bundles: {
            status: string;
            error: null;
        };
        auth: {
            status: null;
            error: null;
        };
    };
    auth: {
        useCore: boolean;
        isAuthenticated: boolean;
        isAuthWorking: boolean;
        isAuthWsConnected: boolean;
        userData: null;
    };
    isActive: boolean;
    isFinal: boolean;
    hasError: boolean;
    whenFinalCalled: boolean;
} & any[]) | ((() => void) | {
    data: {
        sites: {};
        bundles: {
            bundleProducts: {};
            bundleProductsForwardAvailability: {};
            bundleDoiLookup: {};
            splitProducts: {};
            allBundleProducts: {};
            apiResponse: never[];
        };
        states: {
            AL: {
                name: string;
                center: number[];
                zoom: number;
            };
            AK: {
                name: string;
                center: number[];
                zoom: number;
            };
            AZ: {
                name: string;
                center: number[];
                zoom: number;
            };
            AR: {
                name: string;
                center: number[];
                zoom: number;
            };
            CA: {
                name: string;
                center: number[];
                zoom: number;
            };
            CO: {
                name: string;
                center: number[];
                zoom: number;
            };
            CT: {
                name: string;
                center: number[];
                zoom: number;
            };
            DC: {
                name: string;
                center: number[];
                zoom: number;
            };
            DE: {
                name: string;
                center: number[];
                zoom: number;
            };
            FL: {
                name: string;
                center: number[];
                zoom: number;
            };
            GA: {
                name: string;
                center: number[];
                zoom: number;
            };
            HI: {
                name: string;
                center: number[];
                zoom: number;
            };
            ID: {
                name: string;
                center: number[];
                zoom: number;
            };
            IL: {
                name: string;
                center: number[];
                zoom: number;
            };
            IN: {
                name: string;
                center: number[];
                zoom: number;
            };
            IA: {
                name: string;
                center: number[];
                zoom: number;
            };
            KS: {
                name: string;
                center: number[];
                zoom: number;
            };
            KY: {
                name: string;
                center: number[];
                zoom: number;
            };
            LA: {
                name: string;
                center: number[];
                zoom: number;
            };
            ME: {
                name: string;
                center: number[];
                zoom: number;
            };
            MD: {
                name: string;
                center: number[];
                zoom: number;
            };
            MA: {
                name: string;
                center: number[];
                zoom: number;
            };
            MI: {
                name: string;
                center: number[];
                zoom: number;
            };
            MN: {
                name: string;
                center: number[];
                zoom: number;
            };
            MS: {
                name: string;
                center: number[];
                zoom: number;
            };
            MO: {
                name: string;
                center: number[];
                zoom: number;
            };
            MT: {
                name: string;
                center: number[];
                zoom: number;
            };
            NE: {
                name: string;
                center: number[];
                zoom: number;
            };
            NV: {
                name: string;
                center: number[];
                zoom: number;
            };
            NH: {
                name: string;
                center: number[];
                zoom: number;
            };
            NJ: {
                name: string;
                center: number[];
                zoom: number;
            };
            NM: {
                name: string;
                center: number[];
                zoom: number;
            };
            NY: {
                name: string;
                center: number[];
                zoom: number;
            };
            NC: {
                name: string;
                center: number[];
                zoom: number;
            };
            ND: {
                name: string;
                center: number[];
                zoom: number;
            };
            OH: {
                name: string;
                center: number[];
                zoom: number;
            };
            OK: {
                name: string;
                center: number[];
                zoom: number;
            };
            OR: {
                name: string;
                center: number[];
                zoom: number;
            };
            PA: {
                name: string;
                center: number[];
                zoom: number;
            };
            PR: {
                name: string;
                center: number[];
                zoom: number;
            };
            RI: {
                name: string;
                center: number[];
                zoom: number;
            };
            SC: {
                name: string;
                center: number[];
                zoom: number;
            };
            SD: {
                name: string;
                center: number[];
                zoom: number;
            };
            TN: {
                name: string;
                center: number[];
                zoom: number;
            };
            TX: {
                name: string;
                center: number[];
                zoom: number;
            };
            UT: {
                name: string;
                center: number[];
                zoom: number;
            };
            VT: {
                name: string;
                center: number[];
                zoom: number;
            };
            VA: {
                name: string;
                center: number[];
                zoom: number;
            };
            WA: {
                name: string;
                center: number[];
                zoom: number;
            };
            WV: {
                name: string;
                center: number[];
                zoom: number;
            };
            WI: {
                name: string;
                center: number[];
                zoom: number;
            };
            WY: {
                name: string;
                center: number[];
                zoom: number;
            };
        };
        domains: {
            D01: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D02: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D03: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D04: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D05: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D06: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D07: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D08: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D09: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D10: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D11: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D12: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D13: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D14: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D15: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D16: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D17: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D18: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D19: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
            D20: {
                name: string;
                areaKm2: number;
                center: number[];
                zoom: number;
            };
        };
        timeSeriesDataProducts: {
            productCodes: string[];
        };
        stateSites: {};
        domainSites: {};
    };
    html: {
        [x: number]: null;
    };
    fetches: {
        [x: number]: {
            status: null;
            error: null;
        };
        sites: {
            status: string;
            error: null;
        };
        bundles: {
            status: string;
            error: null;
        };
        auth: {
            status: null;
            error: null;
        };
    };
    auth: {
        useCore: boolean;
        isAuthenticated: boolean;
        isAuthWorking: boolean;
        isAuthWsConnected: boolean;
        userData: null;
    };
    isActive: boolean;
    isFinal: boolean;
    hasError: boolean;
    whenFinalCalled: boolean;
})[];
declare namespace DEFAULT_STATE {
    namespace data {
        export let sites: {};
        export namespace bundles {
            let bundleProducts: {};
            let bundleProductsForwardAvailability: {};
            let bundleDoiLookup: {};
            let splitProducts: {};
            let allBundleProducts: {};
            let apiResponse: never[];
        }
        export { statesJSON as states };
        export { domainsJSON as domains };
        export { timeSeriesDataProductsJSON as timeSeriesDataProducts };
        export let stateSites: {};
        export let domainSites: {};
    }
    let html: {
        [x: number]: null;
    };
    let fetches: {
        [x: number]: {
            status: null;
            error: null;
        };
        sites: {
            status: string;
            error: null;
        };
        bundles: {
            status: string;
            error: null;
        };
        auth: {
            status: null;
            error: null;
        };
    };
    namespace auth {
        let useCore: boolean;
        let isAuthenticated: boolean;
        let isAuthWorking: boolean;
        let isAuthWsConnected: boolean;
        let userData: null;
    }
    let isActive: boolean;
    let isFinal: boolean;
    let hasError: boolean;
    let whenFinalCalled: boolean;
}
/**
   getWrappedComponent
*/
declare function getWrappedComponent(Component: any): (props: any) => React.JSX.Element;
declare namespace ProviderPropTypes {
    let children: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
    let fetchPartials: PropTypes.Requireable<boolean>;
    let useCoreAuth: PropTypes.Requireable<boolean>;
    let whenFinal: PropTypes.Requireable<(...args: any[]) => any>;
}
import React from 'react';
import statesJSON from '../../staticJSON/states.json';
import domainsJSON from '../../staticJSON/domains.json';
import timeSeriesDataProductsJSON from '../../staticJSON/timeSeriesDataProducts.json';
import PropTypes from 'prop-types';
