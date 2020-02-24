export namespace TIME_SERIES_VIEWER_STATUS {
    export const INIT_PRODUCT: string;
    export const LOADING_META: string;
    export const READY_FOR_DATA: string;
    export const LOADING_DATA: string;
    export const ERROR: string;
    export const READY: string;
}
/**
   Time Step Definitions and Functions
*/
export const TIME_STEPS: {
    '1min': {
        key: string;
        seconds: number;
    };
    '2min': {
        key: string;
        seconds: number;
    };
    '5min': {
        key: string;
        seconds: number;
    };
    '30min': {
        key: string;
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
declare namespace TimeSeriesViewerContext {
    export { Provider };
    export { useTimeSeriesViewerState };
    export { TimeSeriesViewerPropTypes };
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
declare function useTimeSeriesViewerState(): {
    status: string;
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
    selection: {
        dateRange: null[];
        continuousDateRange: never[];
        variables: never[];
        sites: never[];
        timeStep: string;
        autoTimeStep: null;
        qualityFlags: never[];
        rollPeriod: number;
        logscale: boolean;
        yAxes: {
            y1: {
                units: null;
                logscale: boolean;
            };
            y2: {
                units: null;
                logscale: boolean;
            };
        };
    };
    availableQualityFlags: Set<any>;
    availableTimeSteps: Set<string>;
} | ((() => void) | {
    status: string;
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
    selection: {
        dateRange: null[];
        continuousDateRange: never[];
        variables: never[];
        sites: never[];
        timeStep: string;
        autoTimeStep: null;
        qualityFlags: never[];
        rollPeriod: number;
        logscale: boolean;
        yAxes: {
            y1: {
                units: null;
                logscale: boolean;
            };
            y2: {
                units: null;
                logscale: boolean;
            };
        };
    };
    availableQualityFlags: Set<any>;
    availableTimeSteps: Set<string>;
})[];
declare namespace TimeSeriesViewerPropTypes {
    export function productCode_2(props: any, propName: any, componentName: any): Error | null;
    export { productCode_2 as productCode };
    export function productData_2(props: any, propName: any, componentName: any): Error | null;
    export { productData_2 as productData };
}
import PropTypes from "prop-types";
