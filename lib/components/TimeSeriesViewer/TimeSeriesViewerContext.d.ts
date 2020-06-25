export namespace TIME_SERIES_VIEWER_STATUS {
    export const INIT_PRODUCT: string;
    export const LOADING_META: string;
    export const READY_FOR_DATA: string;
    export const LOADING_DATA: string;
    export const ERROR: string;
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
    export const FROM_ZERO: string;
    export const CENTERED: string;
    export const CUSTOM: string;
}
export namespace Y_AXIS_RANGE_MODE_DETAILS {
    export namespace FROM_ZERO_1 {
        export const name: string;
        export const description: string;
    }
    export { FROM_ZERO_1 as FROM_ZERO };
    export namespace CENTERED_1 {
        const name_1: string;
        export { name_1 as name };
        const description_1: string;
        export { description_1 as description };
    }
    export { CENTERED_1 as CENTERED };
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
        [x: string]: import("../../types/coreTypes").Nullable<string>;
    }>;
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
declare namespace TimeSeriesViewerContext {
    export { Provider };
    export { useTimeSeriesViewerState };
    export { TimeSeriesViewerPropTypes };
    export { getUpdatedValueRange };
}
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        import productCode = productCode;
        export { productCode };
        import productData = productData;
        export { productData };
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const productCode_1: null;
        export { productCode_1 as productCode };
        const productData_1: null;
        export { productData_1 as productData };
    }
}
declare function useTimeSeriesViewerState(): any[] | {
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
    };
    availableQualityFlags: Set<any>;
    availableTimeSteps: Set<string>;
};
declare namespace TimeSeriesViewerPropTypes {
    export function productCode_2(props: any, propName: any, componentName: any): Error | null;
    export { productCode_2 as productCode };
    export function productData_2(props: any, propName: any, componentName: any): Error | null;
    export { productData_2 as productData };
}
declare function getUpdatedValueRange(existingRange: any, newValue: any): any;
