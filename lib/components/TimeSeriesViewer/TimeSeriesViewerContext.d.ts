export namespace TIME_SERIES_VIEWER_STATUS_TITLES {
    let INIT_PRODUCT: string;
    let LOADING_META: string;
    let READY_FOR_DATA: string;
    let LOADING_DATA: string;
    let READY_FOR_SERIES: string;
    let ERROR: null;
    let READY: null;
}
export namespace Y_AXIS_RANGE_MODES {
    let CENTERED: string;
    let FROM_ZERO: string;
    let CUSTOM: string;
}
export namespace Y_AXIS_RANGE_MODE_DETAILS {
    export namespace CENTERED_1 {
        let name: string;
        let description: string;
    }
    export { CENTERED_1 as CENTERED };
    export namespace FROM_ZERO_1 {
        let name_1: string;
        export { name_1 as name };
        let description_1: string;
        export { description_1 as description };
    }
    export { FROM_ZERO_1 as FROM_ZERO };
    export namespace CUSTOM_1 {
        let name_2: string;
        export { name_2 as name };
        let description_2: string;
        export { description_2 as description };
    }
    export { CUSTOM_1 as CUSTOM };
}
export namespace TabComponentPropTypes {
    let setSelectedTab: PropTypes.Validator<(...args: any[]) => any>;
    let TAB_IDS: PropTypes.Validator<{
        [x: string]: string | null | undefined;
    }>;
}
export namespace DEFAULT_STATE {
    import mode = VIEWER_MODE.DEFAULT;
    export { mode };
    export let status: string;
    export let displayError: null;
    export namespace fetchProduct {
        import status_1 = FETCH_STATUS.AWAITING_CALL;
        export { status_1 as status };
        export let error: null;
    }
    export let metaFetches: {};
    export let dataFetches: {};
    export let dataFetchProgress: number;
    export let variables: {};
    export namespace product {
        let productCode: null;
        let productName: null;
        let productDescription: null;
        let productSensor: null;
        let dateRange: null[];
        let continuousDateRange: never[];
        let sites: {};
    }
    export namespace fetchReleases {
        import status_2 = FETCH_STATUS.AWAITING_CALL;
        export { status_2 as status };
        let error_1: null;
        export { error_1 as error };
    }
    export let release: null;
    export let releases: never[];
    export namespace graphData {
        let data: never[];
        let qualityData: never[];
        let monthOffsets: {};
        let timestampMap: {};
        let series: never[];
        let labels: string[];
        let qualityLabels: string[];
    }
    export namespace selection {
        let dateRange_1: null[];
        export { dateRange_1 as dateRange };
        let continuousDateRange_1: never[];
        export { continuousDateRange_1 as continuousDateRange };
        let variables_1: never[];
        export { variables_1 as variables };
        export let derivedVariableTable: {};
        export let dateTimeVariable: null;
        let sites_1: never[];
        export { sites_1 as sites };
        export let timeStep: string;
        export let autoTimeStep: null;
        export let qualityFlags: never[];
        export let rollPeriod: number;
        export let logscale: boolean;
        export namespace yAxes {
            namespace y1 {
                export let units: null;
                let logscale_1: boolean;
                export { logscale_1 as logscale };
                export let dataRange: null[];
                export let precision: number;
                export let standardDeviation: number;
                import rangeMode = Y_AXIS_RANGE_MODES.CENTERED;
                export { rangeMode };
                export let axisRange: number[];
            }
            namespace y2 { }
        }
        export let isDefault: boolean;
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
import PropTypes from 'prop-types';
declare namespace VIEWER_MODE {
    let DEFAULT: string;
    let STATIC: string;
}
declare namespace FETCH_STATUS {
    export let AWAITING_CALL: string;
    export let FETCHING: string;
    let ERROR_1: string;
    export { ERROR_1 as ERROR };
    export let SUCCESS: string;
}
declare namespace TimeSeriesViewerContext {
    export { Provider };
    export { useTimeSeriesViewerState };
    export { TimeSeriesViewerPropTypes };
}
/**
   Context Provider
*/
declare function Provider(props: any): React.JSX.Element;
declare namespace Provider {
    namespace propTypes {
        export { number as timeSeriesUniqueId };
        let mode_1: PropTypes.Requireable<string>;
        export { mode_1 as mode };
        import productCode_1 = TimeSeriesViewerPropTypes.productCode;
        export { productCode_1 as productCode };
        import productData = TimeSeriesViewerPropTypes.productData;
        export { productData };
        let release_1: PropTypes.Requireable<string>;
        export { release_1 as release };
        export let children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
    }
    namespace defaultProps {
        export let timeSeriesUniqueId: number;
        import mode_2 = VIEWER_MODE.DEFAULT;
        export { mode_2 as mode };
        let productCode_2: null;
        export { productCode_2 as productCode };
        let productData_1: null;
        export { productData_1 as productData };
        let release_2: null;
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
import React from 'react';
import { number } from 'prop-types';
