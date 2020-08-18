/**
   Worker - Parse Time Series Data

   This function workerizes the process of building an object containing series of data, indexed
   by fieldName, from a data fetch response. The goal is to produce series columns like so:
     { varX: [1, 10, ...], varY: [2. 20, ...], varZ: [3, 30,...] }
   ...that can be stitched together to create continuous series.

   @param {Object} payload
     @param {string} csv - unparsed CSV string from a data fetch response
     @param {Object} variables - variables object from TimeSeriesViewerContext state
   @return {Object} series object to be applied to state (product/site/position/month/downloadPkg)
*/
export default function parseTimeSeriesData(payload?: Object): Object;
