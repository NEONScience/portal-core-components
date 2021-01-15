"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseDomainHierarchy;

var _paralleljs = _interopRequireDefault(require("paralleljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var worker = new _paralleljs.default(rawHierarchy);
  return worker.spawn(function () {

    // Babel polyfills for worker logic
    function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

    var inData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Recursive function to parse a deeply nest hierarchy object into a flat key/value object
    // where keys are location names and values are objects containing only those location
    // attributes the hierarchy affords us (type, description, and parent)
    var recursiveParseHierarchy = function recursiveParseHierarchy(inHierarchy) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var outHierarchy = {};
      var name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
      var description = inHierarchy.locationDescription || null;
      var type = inHierarchy.locationType || null;

      if ((description || '').includes('Not Used')) {
        return outHierarchy;
      }

      if (name !== null) {
        outHierarchy[name] = {
          type: type,
          description: description,
          parent: parent
        };
      }

      inHierarchy.locationChildHierarchy.forEach(function (subLocation) {
        outHierarchy = _extends({}, outHierarchy, recursiveParseHierarchy(subLocation, name));
      });
      return outHierarchy;
    };

    var outData = {};
    (inData.locationChildHierarchy || []).forEach(function (child) {
      // At the top level we only care about sites and don't want the HQ test site
      if (child.locationType !== 'SITE' || child.locationName === 'HQTW') {
        return;
      }

      outData[child.locationName] = recursiveParseHierarchy(child);
    });
    return outData;
  });
}