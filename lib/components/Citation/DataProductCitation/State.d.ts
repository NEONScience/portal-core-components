export declare const FETCH_STATUS: {
    AWAITING_CALL: string;
    FETCHING: string;
    ERROR: string;
    SUCCESS: string;
};
export declare const CONTEXT_STATUS: {
    INITIALIZING: string;
    HAS_FETCHES_TO_TRIGGER: string;
    FETCHING: string;
    READY: string;
    ERROR: string;
};
export declare const DEFAULT_STATE: {
    productCode: null;
    release: null;
    component: {
        status: string;
        error: null;
    };
    fetches: {
        product: null;
        productReleases: {};
        bundleParents: {};
        bundleParentReleases: {};
    };
    bundle: {
        parentCodes: never[];
        doiProductCode: null;
    };
    data: {
        product: null;
        productReleases: {};
        bundleParents: {};
        bundleParentReleases: {};
        releases: never[];
    };
    neonContextState: {
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
    };
};
