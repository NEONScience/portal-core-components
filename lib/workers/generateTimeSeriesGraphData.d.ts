export function getTimeSteps(): {
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
/**
   Worker - Generate Time Series Graph Data

   This function workerizes the process of building the graphData object for TimeSeriesViewer state.
   This object is built using parsed series data from elsewhere in state by combining individual
   site/month/variable series into single site/variable series registered to the generated time
   series.

   @param {Object} state - complete TimeSeriesViewer state
   @return {Object} graphData object to be applied to state
*/
export default function generateTimeSeriesGraphData(payload?: {}): Object;
export function getTestableItems(): {
    monthIsValidFormat?: undefined;
    monthToNumbers?: undefined;
    monthIsValid?: undefined;
    monthToTicker?: undefined;
    tickerIsValid?: undefined;
    tickerToMonth?: undefined;
    tickerToIso?: undefined;
    getNextMonth?: undefined;
} | {
    monthIsValidFormat: typeof monthIsValidFormat;
    monthToNumbers: typeof monthToNumbers;
    monthIsValid: typeof monthIsValid;
    monthToTicker: typeof monthToTicker;
    tickerIsValid: typeof tickerIsValid;
    tickerToMonth: typeof tickerToMonth;
    tickerToIso: typeof tickerToIso;
    getNextMonth: typeof getNextMonth;
};
declare function monthIsValidFormat(month: any): boolean;
declare function monthToNumbers(month: any): {
    y: null;
    m: null;
} | {
    y: number;
    m: number;
};
declare function monthIsValid(month: any): boolean;
declare function monthToTicker(month: any): number;
declare function tickerIsValid(ticker: any): boolean;
declare function tickerToMonth(ticker: any): string | null;
declare function tickerToIso(ticker: any, includeSeconds?: boolean): string | null;
declare function getNextMonth(month: any): string | null;
export {};
