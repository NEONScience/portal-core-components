export namespace FETCH_STATUS {
    export const AWAITING_CALL: string;
    export const FETCHING: string;
    export const ERROR: string;
    export const SUCCESS: string;
}
export default NeonContext;
declare namespace NeonContext {
    export { Provider };
    export { useNeonContextState };
    export { DEFAULT_STATE };
    export { getWrappedComponent };
}
/**
   Context Provider
*/
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        export const useCoreAuth: PropTypes.Requireable<boolean>;
        export const useCoreHeader: PropTypes.Requireable<boolean>;
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const useCoreAuth_1: boolean;
        export { useCoreAuth_1 as useCoreAuth };
        const useCoreHeader_1: boolean;
        export { useCoreHeader_1 as useCoreHeader };
    }
}
/**
   HOOK
*/
declare function useNeonContextState(): ({
    data: {
        sites: {};
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
            }; /**
               HOOK
            */
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
        bundles: {
            children: {
                "DP1.00007.001": string;
                "DP1.00010.001": string;
                "DP1.00034.001": string;
                "DP1.00035.001": string;
                "DP1.00036.001": string;
                "DP1.00037.001": string;
                "DP4.00067.001": string;
                "DP1.00099.001": string;
                "DP1.00100.001": string;
                "DP2.00008.001": string;
                "DP2.00009.001": string;
                "DP2.00024.001": string;
                "DP3.00008.001": string;
                "DP3.00009.001": string;
                "DP3.00010.001": string;
                "DP4.00002.001": string;
                "DP4.00007.001": string;
                "DP4.00137.001": string;
                "DP4.00201.001": string;
                "DP1.10102.001": string[];
                "DP1.10099.001": string[];
                "DP1.10053.001": string;
                "DP1.10031.001": string;
                "DP1.10101.001": string;
                "DP1.10080.001": string;
                "DP1.10078.001": string;
                "DP1.10100.001": string;
                "DP1.10008.001": string;
                "DP1.00097.001": string;
            };
            parents: {
                "DP4.00200.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10067.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10026.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10033.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10086.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10047.001": {
                    forwardAvailability: boolean;
                };
                "DP1.00096.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10066.001": {
                    forwardAvailability: boolean;
                };
            };
        };
        timeSeriesDataProducts: {
            productCodes: string[];
        };
        stateSites: {};
        domainSites: {};
    };
    html: {
        header: null;
        footer: null;
    };
    fetches: {
        sites: {
            status: string;
            error: null;
        };
        auth: {
            status: null;
            error: null;
        };
        header: {
            status: null;
            error: null;
        };
        footer: {
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
} & any[]) | ((() => void) | {
    data: {
        sites: {};
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
            }; /**
               HOOK
            */
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
        bundles: {
            children: {
                "DP1.00007.001": string;
                "DP1.00010.001": string;
                "DP1.00034.001": string;
                "DP1.00035.001": string;
                "DP1.00036.001": string;
                "DP1.00037.001": string;
                "DP4.00067.001": string;
                "DP1.00099.001": string;
                "DP1.00100.001": string;
                "DP2.00008.001": string;
                "DP2.00009.001": string;
                "DP2.00024.001": string;
                "DP3.00008.001": string;
                "DP3.00009.001": string;
                "DP3.00010.001": string;
                "DP4.00002.001": string;
                "DP4.00007.001": string;
                "DP4.00137.001": string;
                "DP4.00201.001": string;
                "DP1.10102.001": string[];
                "DP1.10099.001": string[];
                "DP1.10053.001": string;
                "DP1.10031.001": string;
                "DP1.10101.001": string;
                "DP1.10080.001": string;
                "DP1.10078.001": string;
                "DP1.10100.001": string;
                "DP1.10008.001": string;
                "DP1.00097.001": string;
            };
            parents: {
                "DP4.00200.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10067.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10026.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10033.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10086.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10047.001": {
                    forwardAvailability: boolean;
                };
                "DP1.00096.001": {
                    forwardAvailability: boolean;
                };
                "DP1.10066.001": {
                    forwardAvailability: boolean;
                };
            };
        };
        timeSeriesDataProducts: {
            productCodes: string[];
        };
        stateSites: {};
        domainSites: {};
    };
    html: {
        header: null;
        footer: null;
    };
    fetches: {
        sites: {
            status: string;
            error: null;
        };
        auth: {
            status: null;
            error: null;
        };
        header: {
            status: null;
            error: null;
        };
        footer: {
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
})[];
declare namespace DEFAULT_STATE {
    export namespace data {
        export const sites: {};
        export { statesJSON as states };
        export { domainsJSON as domains };
        export { bundlesJSON as bundles };
        export { timeSeriesDataProductsJSON as timeSeriesDataProducts };
        export const stateSites: {};
        export const domainSites: {};
    }
    export namespace html {
        export const header: null;
        export const footer: null;
    }
    export namespace fetches {
        export namespace sites_1 {
            import status = AWAITING_CALL;
            export { status };
            export const error: null;
        }
        export { sites_1 as sites };
        export namespace auth {
            const status_1: null;
            export { status_1 as status };
            const error_1: null;
            export { error_1 as error };
        }
        export namespace header_1 {
            const status_2: null;
            export { status_2 as status };
            const error_2: null;
            export { error_2 as error };
        }
        export { header_1 as header };
        export namespace footer_1 {
            const status_3: null;
            export { status_3 as status };
            const error_3: null;
            export { error_3 as error };
        }
        export { footer_1 as footer };
    }
    export namespace auth_1 {
        export const useCore: boolean;
        export const isAuthenticated: boolean;
        export const isAuthWorking: boolean;
        export const isAuthWsConnected: boolean;
        export const userData: null;
    }
    export { auth_1 as auth };
    export const isActive: boolean;
    export const isFinal: boolean;
    export const hasError: boolean;
}
/**
   getWrappedComponent
*/
declare function getWrappedComponent(Component: any): (props: any) => JSX.Element;
import PropTypes from "prop-types";
import statesJSON from "../../staticJSON/states.json";
import domainsJSON from "../../staticJSON/domains.json";
import bundlesJSON from "../../staticJSON/bundles.json";
import timeSeriesDataProductsJSON from "../../staticJSON/timeSeriesDataProducts.json";
