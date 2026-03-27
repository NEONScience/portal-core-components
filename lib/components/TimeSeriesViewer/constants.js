// Every possible top-level status the TimeSeriesViewer component can have
export const TIME_SERIES_VIEWER_STATUS = {
    INIT_PRODUCT: 'INIT_PRODUCT',
    LOADING_META: 'LOADING_META',
    READY_FOR_DATA: 'READY_FOR_DATA',
    LOADING_DATA: 'LOADING_DATA',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    READY_FOR_SERIES: 'READY_FOR_SERIES',
    READY: 'READY'
};
const TimeSeriesViewerConstants = {
    TIME_SERIES_VIEWER_STATUS
};
export default TimeSeriesViewerConstants;
