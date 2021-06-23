export namespace TIME_SERIES_VIEWER_STATUS {
    export const INIT_PRODUCT: string;
    export const LOADING_META: string;
    export const READY_FOR_DATA: string;
    export const LOADING_DATA: string;
    export const ERROR: string;
    export const WARNING: string;
    export const READY_FOR_SERIES: string;
    export const READY: string;
}
export namespace TIME_SERIES_VIEWER_STATUS_TITLES {
    const INIT_PRODUCT_1: string;
    export { INIT_PRODUCT_1 as INIT_PRODUCT };
    const LOADING_META_1: string;
    export { LOADING_META_1 as LOADING_META };
    const READY_FOR_DATA_1: string;
    export { READY_FOR_DATA_1 as READY_FOR_DATA };
    const LOADING_DATA_1: string;
    export { LOADING_DATA_1 as LOADING_DATA };
    const READY_FOR_SERIES_1: string;
    export { READY_FOR_SERIES_1 as READY_FOR_SERIES };
    const ERROR_1: null;
    export { ERROR_1 as ERROR };
    const READY_1: null;
    export { READY_1 as READY };
}
export namespace Y_AXIS_RANGE_MODES {
    export const CENTERED: string;
    export const FROM_ZERO: string;
    export const CUSTOM: string;
}
export namespace Y_AXIS_RANGE_MODE_DETAILS {
    export namespace CENTERED_1 {
        export const name: string;
        export const description: string;
    }
    export { CENTERED_1 as CENTERED };
    export namespace FROM_ZERO_1 {
        const name_1: string;
        export { name_1 as name };
        const description_1: string;
        export { description_1 as description };
    }
    export { FROM_ZERO_1 as FROM_ZERO };
    export namespace CUSTOM_1 {
        const name_2: string;
        export { name_2 as name };
        const description_2: string;
        export { description_2 as description };
    }
    export { CUSTOM_1 as CUSTOM };
}
export namespace TabComponentPropTypes {
    export const setSelectedTab: PropTypes.Validator<(...args: any[]) => any>;
    export const TAB_IDS: PropTypes.Validator<{
        [x: string]: import("../../types/core").Nullable<string>;
    }>;
}
export namespace DEFAULT_STATE {
    import mode = DEFAULT;
    export { mode };
    import status = INIT_PRODUCT;
    export { status };
    export const displayError: null;
    export namespace fetchProduct {
        import status_1 = AWAITING_CALL;
        export { status_1 as status };
        export const error: null;
    }
    export const metaFetches: {};
    export const dataFetches: {};
    export const dataFetchProgress: number;
    export const variables: {};
    export namespace product {
        export const productCode: null;
        export const productName: null;
        export const productDescription: null;
        export const productSensor: null;
        export const dateRange: null[];
        export const continuousDateRange: never[];
        export const sites: {};
    }
    export const release: null;
    export namespace graphData {
        export const data: never[];
        export const qualityData: never[];
        export const monthOffsets: {};
        export const timestampMap: {};
        export const series: never[];
        export const labels: string[];
        export const qualityLabels: string[];
    }
    export namespace selection {
        const dateRange_1: null[];
        export { dateRange_1 as dateRange };
        const continuousDateRange_1: never[];
        export { continuousDateRange_1 as continuousDateRange };
        const variables_1: never[];
        export { variables_1 as variables };
        export const dateTimeVariable: null;
        const sites_1: never[];
        export { sites_1 as sites };
        export const timeStep: string;
        export const autoTimeStep: null;
        export const qualityFlags: never[];
        export const rollPeriod: number;
        export const logscale: boolean;
        export namespace yAxes {
            export const y1: any;
            export const y2: any;
        }
        export const isDefault: boolean;
        export const invalidDefaultVariables: Set<any>;
    }
    export const availableQualityFlags: Set<any>;
    export const availableTimeSteps: Set<string>;
}
/**
   Time Step Definitions and Functions
*/
export const TIME_STEPS: {
    '1min': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '2min': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '5min': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '15min': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '30min': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '60min': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '0AQ': {
        key: string;
        tmi: string;
        seconds: number;
    };
    '1day': {
        key: string;
        tmi: string;
        seconds: number;
    };
};
export function summarizeTimeSteps(steps: any, timeStep?: any, pluralize?: boolean): string;
export default TimeSeriesViewerContext;
export function getTestableItems(): {
    DEFAULT_STATE?: undefined;
    FETCH_STATUS?: undefined;
    applyDefaultsToSelection?: undefined;
    generateYAxisRange?: undefined;
    getTimeStep?: undefined;
    getUpdatedValueRange?: undefined;
    getContinuousDatesArray?: undefined;
    limitVariablesToTwoUnits?: undefined;
    parseProductData?: undefined;
    parseSiteMonthData?: undefined;
    parseSiteVariables?: undefined;
    parseSitePositions?: undefined;
    reducer?: undefined;
    setDataFileFetchStatuses?: undefined;
    TimeSeriesViewerPropTypes?: undefined;
} | {
    DEFAULT_STATE: {
        mode: string;
        status: string;
        displayError: null;
        fetchProduct: {
            status: string;
            error: null;
        };
        metaFetches: {};
        dataFetches: {};
        dataFetchProgress: number;
        variables: {};
        product: {
            productCode: null;
            productName: null;
            productDescription: null;
            productSensor: null;
            dateRange: null[];
            continuousDateRange: never[];
            sites: {};
        };
        release: null;
        graphData: {
            data: never[];
            qualityData: never[];
            monthOffsets: {};
            timestampMap: {};
            series: never[];
            labels: string[];
            qualityLabels: string[];
        };
        selection: {
            dateRange: null[];
            continuousDateRange: never[];
            variables: never[];
            dateTimeVariable: null;
            sites: never[];
            timeStep: string;
            autoTimeStep: null;
            qualityFlags: never[];
            rollPeriod: number;
            logscale: boolean;
            yAxes: {
                y1: any;
                y2: any;
            };
            isDefault: boolean;
            invalidDefaultVariables: Set<any>;
        };
        availableQualityFlags: Set<any>;
        availableTimeSteps: Set<string>;
    };
    FETCH_STATUS: {
        AWAITING_CALL: string;
        FETCHING: string;
        ERROR: string;
        SUCCESS: string;
    };
    applyDefaultsToSelection: (state: Object) => Object;
    generateYAxisRange: (axis?: {}) => any;
    getTimeStep: (input?: string) => string | null;
    getUpdatedValueRange: (existingRange: any, newValue: any) => any;
    getContinuousDatesArray: (dateRange: any[], roundToYears?: boolean) => any[];
    limitVariablesToTwoUnits: (state: any, variables: any) => {
        selectedUnits: any[];
        variables: any;
    };
    parseProductData: (productData?: Object) => Object;
    parseSiteMonthData: (site: Object, files: any[]) => Object;
    parseSiteVariables: (previousVariables: Object, siteCode: string, csv: string) => ParseSiteVariablesReturn;
    parseSitePositions: (site: Object, csv: string) => Object;
    reducer: (state: any, action: any) => any;
    setDataFileFetchStatuses: (state: any, fetches: any) => any;
    TimeSeriesViewerPropTypes: {
        productCode: (props: any, propName: any, componentName: any) => Error | null;
        productData: (props: any, propName: any, componentName: any) => Error | null;
    };
};
/**
 * Build a set of data to update various parts of state from a product/site variables fetch response
 * Goal 1: Expand state.variables to include anything new from this variables fetch
 * Goal 2: Store a list of these variable names on the site in state (differentiate global/local)
 */
export type ParseSiteVariablesReturn = {
    /**
     * - set of all variable names to be stored in state at the site level
     */
    variablesSet: Set<any>;
    /**
     * - updated object to be applied at state.variables
     */
    variablesObject: Object;
};
import PropTypes from "prop-types";
declare namespace VIEWER_MODE {
    export const DEFAULT: string;
    export const STATIC: string;
}
declare namespace FETCH_STATUS {
    export const AWAITING_CALL: string;
    export const FETCHING: string;
    const ERROR_2: string;
    export { ERROR_2 as ERROR };
    export const SUCCESS: string;
}
declare namespace TimeSeriesViewerContext {
    export { Provider };
    export { useTimeSeriesViewerState };
    export { TimeSeriesViewerPropTypes };
}
/**
   Context Provider
*/
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        const mode_1: PropTypes.Requireable<string>;
        export { mode_1 as mode };
        import productCode_1 = productCode;
        export { productCode_1 as productCode };
        import productData = productData;
        export { productData };
        const release_1: PropTypes.Requireable<string>;
        export { release_1 as release };
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        import mode_2 = DEFAULT;
        export { mode_2 as mode };
        const productCode_2: null;
        export { productCode_2 as productCode };
        const productData_1: null;
        export { productData_1 as productData };
        const release_2: null;
        export { release_2 as release };
    }
}
declare function useTimeSeriesViewerState(): any;
declare namespace TimeSeriesViewerPropTypes {
    export function productCode_3(props: any, propName: any, componentName: any): Error | null;
    export { productCode_3 as productCode };
    export function productData_2(props: any, propName: any, componentName: any): Error | null;
    export { productData_2 as productData };
}
