export default NeonContext;
declare namespace NeonContext {
    export { Provider };
    export { useNeonContextState };
    export { DEFAULT_STATE };
    export { getWrappedComponent };
}
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
}
declare function useNeonContextState(): ({
    data: {
        sites: {};
        states: {
            AL: {
                name: string;
            };
            AK: {
                name: string;
            };
            AZ: {
                name: string;
            };
            AR: {
                name: string;
            };
            CA: {
                name: string;
            };
            CO: {
                name: string;
            };
            CT: {
                name: string;
            };
            DC: {
                name: string;
            };
            DE: {
                name: string;
            };
            FL: {
                name: string;
            };
            GA: {
                name: string;
            };
            HI: {
                name: string;
            };
            ID: {
                name: string;
            };
            IL: {
                name: string;
            };
            IN: {
                name: string;
            };
            IA: {
                name: string;
            };
            KS: {
                name: string;
            };
            KY: {
                name: string;
            };
            LA: {
                name: string;
            };
            ME: {
                name: string;
            };
            MD: {
                name: string;
            };
            MA: {
                name: string;
            };
            MI: {
                name: string;
            };
            MN: {
                name: string;
            };
            MS: {
                name: string;
            };
            MO: {
                name: string;
            };
            MT: {
                name: string;
            };
            NE: {
                name: string;
            };
            NV: {
                name: string;
            };
            NH: {
                name: string;
            };
            NJ: {
                name: string;
            };
            NM: {
                name: string;
            };
            NY: {
                name: string;
            };
            NC: {
                name: string;
            };
            ND: {
                name: string;
            };
            OH: {
                name: string;
            };
            OK: {
                name: string;
            };
            OR: {
                name: string;
            };
            PA: {
                name: string;
            };
            PR: {
                name: string;
            };
            RI: {
                name: string;
            };
            SC: {
                name: string;
            };
            SD: {
                name: string;
            };
            TN: {
                name: string;
            };
            TX: {
                name: string;
            };
            UT: {
                name: string;
            };
            VT: {
                name: string;
            };
            VA: {
                name: string;
            };
            WA: {
                name: string;
            };
            WV: {
                name: string;
            };
            WI: {
                name: string;
            };
            WY: {
                name: string;
            };
        };
        domains: {
            D01: {
                name: string;
            };
            D02: {
                name: string;
            };
            D03: {
                name: string;
            };
            D04: {
                name: string;
            };
            D05: {
                name: string;
            };
            D06: {
                name: string;
            };
            D07: {
                name: string;
            };
            D08: {
                name: string;
            };
            D09: {
                name: string;
            };
            D10: {
                name: string;
            };
            D11: {
                name: string;
            };
            D12: {
                name: string;
            };
            D13: {
                name: string;
            };
            D14: {
                name: string;
            };
            D15: {
                name: string;
            };
            D16: {
                name: string;
            };
            D17: {
                name: string;
            };
            D18: {
                name: string;
            };
            D19: {
                name: string;
            };
            D20: {
                name: string;
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
            };
            parents: string[];
        };
        timeSeriesDataProducts: {
            productCodes: string[];
        };
    };
    fetches: {
        sites: {
            status: string;
            error: null;
        };
    };
    auth: {
        isAuthenticated: boolean;
        fetchStatus: string;
    };
    isActive: boolean;
} & any[]) | ((() => void) | {
    data: {
        sites: {};
        states: {
            AL: {
                name: string;
            };
            AK: {
                name: string;
            };
            AZ: {
                name: string;
            };
            AR: {
                name: string;
            };
            CA: {
                name: string;
            };
            CO: {
                name: string;
            };
            CT: {
                name: string;
            };
            DC: {
                name: string;
            };
            DE: {
                name: string;
            };
            FL: {
                name: string;
            };
            GA: {
                name: string;
            };
            HI: {
                name: string;
            };
            ID: {
                name: string;
            };
            IL: {
                name: string;
            };
            IN: {
                name: string;
            };
            IA: {
                name: string;
            };
            KS: {
                name: string;
            };
            KY: {
                name: string;
            };
            LA: {
                name: string;
            };
            ME: {
                name: string;
            };
            MD: {
                name: string;
            };
            MA: {
                name: string;
            };
            MI: {
                name: string;
            };
            MN: {
                name: string;
            };
            MS: {
                name: string;
            };
            MO: {
                name: string;
            };
            MT: {
                name: string;
            };
            NE: {
                name: string;
            };
            NV: {
                name: string;
            };
            NH: {
                name: string;
            };
            NJ: {
                name: string;
            };
            NM: {
                name: string;
            };
            NY: {
                name: string;
            };
            NC: {
                name: string;
            };
            ND: {
                name: string;
            };
            OH: {
                name: string;
            };
            OK: {
                name: string;
            };
            OR: {
                name: string;
            };
            PA: {
                name: string;
            };
            PR: {
                name: string;
            };
            RI: {
                name: string;
            };
            SC: {
                name: string;
            };
            SD: {
                name: string;
            };
            TN: {
                name: string;
            };
            TX: {
                name: string;
            };
            UT: {
                name: string;
            };
            VT: {
                name: string;
            };
            VA: {
                name: string;
            };
            WA: {
                name: string;
            };
            WV: {
                name: string;
            };
            WI: {
                name: string;
            };
            WY: {
                name: string;
            };
        };
        domains: {
            D01: {
                name: string;
            };
            D02: {
                name: string;
            };
            D03: {
                name: string;
            };
            D04: {
                name: string;
            };
            D05: {
                name: string;
            };
            D06: {
                name: string;
            };
            D07: {
                name: string;
            };
            D08: {
                name: string;
            };
            D09: {
                name: string;
            };
            D10: {
                name: string;
            };
            D11: {
                name: string;
            };
            D12: {
                name: string;
            };
            D13: {
                name: string;
            };
            D14: {
                name: string;
            };
            D15: {
                name: string;
            };
            D16: {
                name: string;
            };
            D17: {
                name: string;
            };
            D18: {
                name: string;
            };
            D19: {
                name: string;
            };
            D20: {
                name: string;
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
            };
            parents: string[];
        };
        timeSeriesDataProducts: {
            productCodes: string[];
        };
    };
    fetches: {
        sites: {
            status: string;
            error: null;
        };
    };
    auth: {
        isAuthenticated: boolean;
        fetchStatus: string;
    };
    isActive: boolean;
})[];
declare namespace DEFAULT_STATE {
    export namespace data {
        export const sites: {};
        export { statesJSON as states };
        export { domainsJSON as domains };
        export { bundlesJSON as bundles };
        export { timeSeriesDataProductsJSON as timeSeriesDataProducts };
    }
    export namespace fetches {
        export namespace sites_1 {
            import status = AWAITING_CALL;
            export { status };
            export const error: null;
        }
        export { sites_1 as sites };
    }
    export namespace auth {
        export const isAuthenticated: boolean;
        import fetchStatus = AWAITING_CALL;
        export { fetchStatus };
    }
    export const isActive: boolean;
}
declare function getWrappedComponent(Component: any): (props: any) => JSX.Element;
import PropTypes from "prop-types";
import statesJSON from "../../staticJSON/states.json";
import domainsJSON from "../../staticJSON/domains.json";
import bundlesJSON from "../../staticJSON/bundles.json";
import timeSeriesDataProductsJSON from "../../staticJSON/timeSeriesDataProducts.json";
declare namespace FETCH_STATUS {
    export const AWAITING_CALL: string;
    export const FETCHING: string;
    export const ERROR: string;
    export const SUCCESS: string;
}
