export namespace TIME_SERIES_VIEWER_STATUS_TITLES {
    const INIT_PRODUCT: string;
    const LOADING_META: string;
    const READY_FOR_DATA: string;
    const LOADING_DATA: string;
    const READY_FOR_SERIES: string;
    const ERROR: null;
    const READY: null;
}
export const POINTS_PERFORMANCE_LIMIT: 250000;
export namespace Y_AXIS_RANGE_MODES {
    const CENTERED: string;
    const FROM_ZERO: string;
    const CUSTOM: string;
}
export namespace Y_AXIS_RANGE_MODE_DETAILS {
    export namespace CENTERED_1 {
        const name: string;
        const description: string;
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
    const setSelectedTab: PropTypes.Validator<(...args: any[]) => any>;
    const TAB_IDS: PropTypes.Validator<{
        [x: string]: string | null | undefined;
    }>;
}
export namespace DEFAULT_STATE {
    import mode = VIEWER_MODE.DEFAULT;
    export { mode };
    export const status: string;
    export const displayError: null;
    export namespace fetchProduct {
        import status_1 = FETCH_STATUS.AWAITING_CALL;
        export { status_1 as status };
        export const error: null;
    }
    export const metaFetches: {};
    export const dataFetches: {};
    export const dataFetchProgress: number;
    export const variables: {};
    export const pointTotal: number;
    export namespace product {
        const productCode: null;
        const productName: null;
        const productDescription: null;
        const productSensor: null;
        const dateRange: null[];
        const continuousDateRange: never[];
        const sites: {};
    }
    export namespace fetchReleases {
        import status_2 = FETCH_STATUS.AWAITING_CALL;
        export { status_2 as status };
        const error_1: null;
        export { error_1 as error };
    }
    export const release: null;
    export const releases: never[];
    export namespace graphData {
        const data: never[];
        const qualityData: never[];
        const monthOffsets: {};
        const timestampMap: {};
        const series: never[];
        const labels: string[];
        const qualityLabels: string[];
    }
    export namespace selection {
        const dateRange_1: null[];
        export { dateRange_1 as dateRange };
        const continuousDateRange_1: never[];
        export { continuousDateRange_1 as continuousDateRange };
        const variables_1: never[];
        export { variables_1 as variables };
        export const derivedVariableTable: {};
        export const dateTimeVariable: null;
        const sites_1: never[];
        export { sites_1 as sites };
        export const timeStep: string;
        export const autoTimeStep: null;
        export const qualityFlags: never[];
        export const rollPeriod: number;
        export const logscale: boolean;
        export namespace yAxes {
            namespace y1 {
                export const units: null;
                const logscale_1: boolean;
                export { logscale_1 as logscale };
                export const dataRange: null[];
                export const precision: number;
                export const standardDeviation: number;
                import rangeMode = Y_AXIS_RANGE_MODES.CENTERED;
                export { rangeMode };
                export const axisRange: number[];
            }
            namespace y2 { }
        }
        export const isDefault: boolean;
    }
    export const availableQualityFlags: Set<any>;
    export namespace timeStep_1 {
        export const availableTimeSteps: Set<string>;
        const variables_2: {};
        export { variables_2 as variables };
    }
    export { timeStep_1 as timeStep };
}
/**
   Time Step Definitions and Functions
*/
export const TIME_STEPS: {
    '1min': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '2min': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '5min': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '15min': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '30min': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '60min': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '0AQ': {
        key: string;
        matchFileTableSuffix: string[];
        tmi: string;
        seconds: number;
    };
    '1day': {
        key: string;
        matchFileTableSuffix: string[];
        matchFileTableIncludes: string[];
        tmi: string;
        seconds: number;
    };
};
export function summarizeTimeSteps(steps: any, timeStep?: null, pluralize?: boolean): string;
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
        pointTotal: number;
        product: {
            productCode: null;
            productName: null;
            productDescription: null;
            productSensor: null;
            dateRange: null[];
            continuousDateRange: never[];
            sites: {};
        };
        fetchReleases: {
            status: string;
            error: null;
        };
        release: null;
        releases: never[];
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
            derivedVariableTable: {};
            dateTimeVariable: null;
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
                    dataRange: null[];
                    precision: number;
                    standardDeviation: number;
                    rangeMode: string;
                    axisRange: number[];
                };
                y2: {
                    units: null;
                    logscale: boolean;
                    dataRange: null[];
                    precision: number;
                    standardDeviation: number;
                    rangeMode: string;
                    axisRange: number[];
                };
            };
            isDefault: boolean;
        };
        availableQualityFlags: Set<any>;
        timeStep: {
            availableTimeSteps: Set<string>;
            variables: {};
        };
    };
    FETCH_STATUS: {
        AWAITING_CALL: string;
        FETCHING: string;
        ERROR: string;
        SUCCESS: string;
    };
    applyDefaultsToSelection: (state: Object, invalidDefaultVariables?: Set<any>) => Object;
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
    const DEFAULT: string;
    const STATIC: string;
}
declare namespace FETCH_STATUS {
    export const AWAITING_CALL: string;
    export const FETCHING: string;
    const ERROR_1: string;
    export { ERROR_1 as ERROR };
    export const SUCCESS: string;
}
declare namespace TimeSeriesViewerContext {
    export { Provider };
    export { useTimeSeriesViewerState };
    export { TimeSeriesViewerPropTypes };
    export { calcPredictedPointsForNewPosition };
    export { calcPredictedPointsByTimeStep };
    export { calcPredictedPointsForNewVariable };
    export { calcPredictedPointsByDateRange };
    export { getPositionCount };
}
/**
   Context Provider
*/
declare function Provider(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace Provider {
    namespace propTypes {
        export { number as timeSeriesUniqueId };
        const mode_1: PropTypes.Requireable<string>;
        export { mode_1 as mode };
        import productCode_1 = TimeSeriesViewerPropTypes.productCode;
        export { productCode_1 as productCode };
        import productData = TimeSeriesViewerPropTypes.productData;
        export { productData };
        const release_1: PropTypes.Requireable<string>;
        export { release_1 as release };
        export const children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
    }
    namespace defaultProps {
        export const timeSeriesUniqueId: number;
        import mode_2 = VIEWER_MODE.DEFAULT;
        export { mode_2 as mode };
        const productCode_2: null;
        export { productCode_2 as productCode };
        const productData_1: null;
        export { productData_1 as productData };
        const release_2: null;
        export { release_2 as release };
    }
}
declare function useTimeSeriesViewerState(): {
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
    pointTotal: number;
    product: {
        productCode: null;
        productName: null;
        productDescription: null;
        productSensor: null;
        dateRange: null[];
        continuousDateRange: never[];
        sites: {};
    };
    fetchReleases: {
        status: string;
        error: null;
    };
    release: null;
    releases: never[];
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
        derivedVariableTable: {};
        dateTimeVariable: null;
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
                dataRange: null[];
                precision: number;
                standardDeviation: number;
                rangeMode: string;
                axisRange: number[];
            };
            y2: {
                units: null;
                logscale: boolean;
                dataRange: null[];
                precision: number;
                standardDeviation: number;
                rangeMode: string;
                axisRange: number[];
            };
        };
        isDefault: boolean;
    };
    availableQualityFlags: Set<any>;
    timeStep: {
        availableTimeSteps: Set<string>;
        variables: {};
    };
} | ({
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
    pointTotal: number;
    product: {
        productCode: null;
        productName: null;
        productDescription: null;
        productSensor: null;
        dateRange: null[];
        continuousDateRange: never[];
        sites: {};
    };
    fetchReleases: {
        status: string;
        error: null;
    };
    release: null;
    releases: never[];
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
        derivedVariableTable: {};
        dateTimeVariable: null;
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
                dataRange: null[];
                precision: number;
                standardDeviation: number;
                rangeMode: string;
                axisRange: number[];
            };
            y2: {
                units: null;
                logscale: boolean;
                dataRange: null[];
                precision: number;
                standardDeviation: number;
                rangeMode: string;
                axisRange: number[];
            };
        };
        isDefault: boolean;
    };
    availableQualityFlags: Set<any>;
    timeStep: {
        availableTimeSteps: Set<string>;
        variables: {};
    };
} | (() => void))[];
declare namespace TimeSeriesViewerPropTypes {
    export function productCode_3(props: any, propName: any, componentName: any): Error | null;
    export { productCode_3 as productCode };
    export function productData_2(props: any, propName: any, componentName: any): Error | null;
    export { productData_2 as productData };
}
declare function calcPredictedPointsForNewPosition(state: any, numPositionsOverride: any): number;
declare function calcPredictedPointsByTimeStep(state: any, timeStep: any): number;
declare function calcPredictedPointsForNewVariable(state: any): number;
declare function calcPredictedPointsByDateRange(state: any, startDate: any, endDate: any): number;
declare function getPositionCount(sitesArray: any, siteCodeToExclude: any): number;
import { number } from "prop-types";
