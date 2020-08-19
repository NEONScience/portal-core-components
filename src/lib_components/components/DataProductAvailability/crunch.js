/* eslint-disable max-len */
import { parse } from 'papaparse';
import availabilityFile from './enhanced-availability-src.csv';
import availabilityJson from './enhanced-availability-api-response.json';

const REPROCESS = false;

const crunch = (returnResult = () => {}) => {
  const path = `http://localhost:3010${availabilityFile}`;
  const now = '2020-03';
  if (!REPROCESS) {
    returnResult(availabilityJson);
    return;
  }
  parse(path, {
    worker: true,
    download: true,
    header: true,
    skipEmptyLines: 'greedy',
    complete: (results) => {
      const avail = { products: [] };
      const productMap = {};
      const siteMaps = {};
      const tableMaps = {};
      const statusMap = {};
      results.data.forEach((row) => {
        const {
          collectionExpected,
          description,
          month,
          productCode,
          site,
          status,
          table,
          waitInterval,
        } = row;
        // Product
        if (typeof productMap[productCode] === 'undefined') {
          productMap[productCode] = avail.products.length;
          siteMaps[productCode] = {};
          tableMaps[productCode] = {};
          avail.products.push({
            productCode,
            sites: [],
          });
        }
        const productIdx = productMap[productCode];
        // Site
        if (typeof siteMaps[productCode][site] === 'undefined') {
          siteMaps[productCode][site] = avail.products[productIdx].sites.length;
          tableMaps[productCode][site] = {};
          avail.products[productIdx].sites.push({
            siteCode: site,
            tables: [],
          });
        }
        const siteIdx = siteMaps[productCode][site];
        // Table Index
        if (typeof tableMaps[productCode][site][table] === 'undefined') {
          tableMaps[productCode][site][table] = avail.products[productIdx].sites[siteIdx].tables.length;
          avail.products[productIdx].sites[siteIdx].tables.push({
            name: table,
            description,
            waitInterval,
            months: {},
          });
        }
        const tableIdx = tableMaps[productCode][site][table];
        // Table Data
        const {
          description: currentDescription,
          waitInterval: currentWaitInterval,
        } = avail.products[productIdx].sites[siteIdx].tables[tableIdx];
        if ([null, 'NA'].includes(currentDescription)) {
          avail.products[productIdx].sites[siteIdx].tables[tableIdx].description = description;
        }
        if ([null, 'NA'].includes(currentWaitInterval)) {
          avail.products[productIdx].sites[siteIdx].tables[tableIdx].waitInterval = waitInterval;
        }
        // Month
        let derivedStatus = status;
        switch (status) {
          case 'not collected':
            if (month < now) {
              derivedStatus = 'not collected';
            } else {
              derivedStatus = /^[AEIOU]{1}.*/.test(site) ? 'tentative' : 'expected';
            }
            break;
          case 'expected':
            if (month < now) {
              derivedStatus = 'not collected';
            } else {
              derivedStatus = collectionExpected;
            }
            break;
          case '':
          case null:
            if (month < now) {
              derivedStatus = collectionExpected === 'expected' ? 'not collected' : 'not available';
            } else {
              derivedStatus = collectionExpected === 'expected' ? 'expected' : 'not expected';
            }
            break;
          default:
            break;
        }
        avail.products[productIdx].sites[siteIdx].tables[tableIdx].months[month] = derivedStatus;
        if (typeof statusMap[productCode] === 'undefined') {
          statusMap[productCode] = new Set();
        }
        statusMap[productCode].add(derivedStatus);
      });
      const statusJSON = {};
      Object.keys(statusMap).forEach((pc) => { statusJSON[pc] = Array.from(statusMap[pc]); });
      console.log('CRUNCH COMPLETE; RESULTS:');
      console.log(JSON.stringify(statusJSON, null, 2));
      console.log(JSON.stringify(avail, null, 2));
      returnResult(avail);
    },
  });
};

/*
{
  "DP1.00097.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10099.001": [
    "available",
    "delayed",
    "not collected",
    "expected"
  ],
  "DP1.10102.001": [
    "available",
    "delayed",
    "not collected",
    "expected"
  ],
  "DP1.20093.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10003.001": [
    "available",
    "delayed"
  ],
  "DP1.10058.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10072.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10076.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10086.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10107.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10108.001": [
    "available",
    "delayed",
    "not collected",
    "expected",
    "being processed",
    "tentative"
  ],
  "DP1.10109.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20072.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10020.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10022.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10023.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10055.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10045.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10078.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10081.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10098.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10100.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20252.001": [
    "available",
    "being processed",
    "delayed",
    "expected"
  ],
  "DP1.20254.001": [
    "available",
    "being processed",
    "delayed",
    "expected"
  ],
  "DP1.10043.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10041.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10064.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10092.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10093.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10038.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20163.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20166.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20048.001": [
    "available",
    "not collected",
    "delayed",
    "being processed",
    "expected"
  ],
  "DP1.20063.001": [
    "available",
    "delayed",
    "expected"
  ],
  "DP1.20066.001": [
    "available",
    "delayed",
    "expected"
  ],
  "DP1.20120.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20126.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "tentative"
  ],
  "DP1.20191.001": [
    "available",
    "delayed",
    "expected"
  ],
  "DP1.20194.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20197.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20219.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "tentative"
  ],
  "DP1.20277.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20280.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20092.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20138.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20190.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20193.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20278.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20281.001": [
    "available",
    "not collected",
    "delayed",
    "being processed",
    "expected"
  ],
  "DP1.20097.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20279.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20206.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20282.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected",
    "tentative"
  ],
  "DP1.20275.001": [
    "available",
    "delayed",
    "expected"
  ],
  "DP1.10010.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP4.00132.001": [
    "available",
    "delayed",
    "expected"
  ],
  "DP1.20276.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10033.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10017.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20107.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10014.001": [
    "available",
    "not collected",
    "delayed",
    "being processed",
    "expected"
  ],
  "DP1.10026.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10053.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10067.001": [
    "available",
    "delayed",
    "not collected",
    "expected"
  ],
  "DP1.10031.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10101.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.10080.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.10104.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP4.00131.001": [
    "available",
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20105.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "tentative"
  ],
  "DP1.20221.001": [
    "available",
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP4.00133.001": [
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ],
  "DP1.20099.001": [
    "not collected",
    "delayed",
    "expected"
  ],
  "DP1.20086.001": [
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20141.001": [
    "delayed",
    "being processed",
    "not collected",
    "expected"
  ],
  "DP1.20267.001": [
    "delayed",
    "not collected",
    "being processed",
    "expected"
  ]
}
*/

export default crunch;
