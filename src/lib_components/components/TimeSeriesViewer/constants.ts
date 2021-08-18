// Every possible top-level status the TimeSeriesViewer component can have
export const TIME_SERIES_VIEWER_STATUS = {
  INIT_PRODUCT: 'INIT_PRODUCT', // Handling props; fetching product data if needed
  LOADING_META: 'LOADING_META', // Actively loading meta data (sites, variables, and positions)
  READY_FOR_DATA: 'READY_FOR_DATA', // Ready to trigger fetches for data
  LOADING_DATA: 'LOADING_DATA', // Actively loading plottable series data
  ERROR: 'ERROR', // Stop everything because problem, do not trigger new fetches no matter what
  WARNING: 'WARNING', // Current selection/data makes a graph not possible; show warning
  READY_FOR_SERIES: 'READY_FOR_SERIES', // Ready to re-calculate series data for the graph
  READY: 'READY', // Ready for user input
};

const TimeSeriesViewerConstants = {
  TIME_SERIES_VIEWER_STATUS,
};

export default TimeSeriesViewerConstants;
