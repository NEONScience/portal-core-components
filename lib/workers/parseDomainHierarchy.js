"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseDomainHierarchy;
var _paralleljs = _interopRequireDefault(require("../vendor/paralleljs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
   Worker - Parse Domain Hierarchy

   This function workerizes the process of taking a raw location hierarchy at the domain level and
   parsing it into an object containing flat maps of location names to thin location objects
   (containing only type, description, and parent) for each site in the domain.

   Example output:
   {
     JORN: {
       TOWER100344: { ... },
       MEGAPT100976: { ... },
       ...
     },
     SRER: {
       TOWER104454: { ... },
       MEGAPT100995: { ... },
       ...
     },
     ...
   }
*/
function parseDomainHierarchy(rawHierarchy) {
  const worker = new _paralleljs.default(rawHierarchy);
  return worker.spawn((inData = {}) => {
    // Recursive function to parse a deeply nest hierarchy object into a flat key/value object
    // where keys are location names and values are objects containing only those location
    // attributes the hierarchy affords us (type, description, and parent)
    const recursiveParseHierarchy = (inHierarchy, parent = null) => {
      let outHierarchy = {};
      const name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
      const description = inHierarchy.locationDescription || null;
      const type = inHierarchy.locationType || null;
      if ((description || '').includes('Not Used')) {
        return outHierarchy;
      }
      if (name !== null) {
        outHierarchy[name] = {
          type,
          description,
          parent
        };
      }
      inHierarchy.locationChildHierarchy.forEach(subLocation => {
        outHierarchy = Object.assign({}, outHierarchy, recursiveParseHierarchy(subLocation, name));
      });
      return outHierarchy;
    };
    const outData = {};
    (inData.locationChildHierarchy || []).forEach(child => {
      // At the top level we only care about sites and don't want the HQ test site
      if (child.locationType !== 'SITE' || child.locationName === 'HQTW') {
        return;
      }
      outData[child.locationName] = recursiveParseHierarchy(child);
    });
    return outData;
  });
}