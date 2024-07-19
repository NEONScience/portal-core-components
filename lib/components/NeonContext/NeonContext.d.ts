export namespace FETCH_STATUS {
    const AWAITING_CALL: string;
    const FETCHING: string;
    const ERROR: string;
    const SUCCESS: string;
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
declare function Provider(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace Provider {
    export { ProviderPropTypes as propTypes };
    export namespace defaultProps {
        const children: null;
        const fetchPartials: boolean;
        const useCoreAuth: boolean;
        function whenFinal(): void;
    }
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
        export const sites: {};
        export namespace bundles {
            const bundleProducts: {};
            const bundleProductsForwardAvailability: {};
            const bundleDoiLookup: {};
            const splitProducts: {};
            const allBundleProducts: {};
            const apiResponse: never[];
        }
        export { statesJSON as states };
        export { domainsJSON as domains };
        export { timeSeriesDataProductsJSON as timeSeriesDataProducts };
        export const stateSites: {};
        export const domainSites: {};
    }
    const html: {
        [x: number]: null;
    };
    const fetches: {
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
        const useCore: boolean;
        const isAuthenticated: boolean;
        const isAuthWorking: boolean;
        const isAuthWsConnected: boolean;
        const userData: null;
    }
    const isActive: boolean;
    const isFinal: boolean;
    const hasError: boolean;
    const whenFinalCalled: boolean;
}
/**
   getWrappedComponent
*/
declare function getWrappedComponent(Component: any): (props: any) => import("react/jsx-runtime").JSX.Element;
declare namespace ProviderPropTypes {
    const children_1: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
    export { children_1 as children };
    const fetchPartials_1: PropTypes.Requireable<boolean>;
    export { fetchPartials_1 as fetchPartials };
    const useCoreAuth_1: PropTypes.Requireable<boolean>;
    export { useCoreAuth_1 as useCoreAuth };
    const whenFinal_1: PropTypes.Requireable<(...args: any[]) => any>;
    export { whenFinal_1 as whenFinal };
}
import statesJSON from "../../staticJSON/states.json";
import domainsJSON from "../../staticJSON/domains.json";
import timeSeriesDataProductsJSON from "../../staticJSON/timeSeriesDataProducts.json";
import PropTypes from "prop-types";
