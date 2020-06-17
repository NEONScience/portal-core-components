"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _SiteMapDeferredJson = _interopRequireDefault(require("./SiteMapDeferredJson"));

var _SiteMapUtils = require("./SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Derive the selected status of a given boundary (US state or NEON domain). This should run
// every time the list of selected sites changes. It regenerates selectedStates and
// selectedDomains in state to each contain a key/value lookup where the key is the boundary code
// (state code or domain code) and the value is either 'total' (all sites selected) or 'partial'
// (some sites selected). If no sites are selected for the boundary it is omitted from the map.
var deriveBoundarySelections = function deriveBoundarySelections(state) {
  var _derived;

  var derive = function derive(featureKey) {
    if (!state.neonContextHydrated || !state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][featureKey]) {
      return {};
    }

    var selectedBoundarys = {};
    Object.keys(state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][featureKey]).forEach(function (boundaryCode) {
      var boundarySitesSet = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][featureKey][boundaryCode].sites || new Set();

      var intersection = _toConsumableArray(boundarySitesSet).filter(function (x) {
        return state.selection[_SiteMapUtils.SELECTABLE_FEATURE_TYPES.SITES].has(x);
      });

      if (!intersection.length) {
        return;
      }

      selectedBoundarys[boundaryCode] = intersection.length === boundarySitesSet.size ? 'total' : 'partial';
    });
    return selectedBoundarys;
  };

  return _extends(_extends({}, state), {}, {
    selection: _extends(_extends({}, state.selection), {}, {
      derived: (_derived = {}, _defineProperty(_derived, _SiteMapUtils.FEATURES.STATES.KEY, derive(_SiteMapUtils.FEATURES.STATES.KEY)), _defineProperty(_derived, _SiteMapUtils.FEATURES.DOMAINS.KEY, derive(_SiteMapUtils.FEATURES.DOMAINS.KEY)), _derived)
    })
  });
};
/**
   Reducer
*/


var zoomIsValid = function zoomIsValid(zoom) {
  return Number.isInteger(zoom) && zoom >= _SiteMapUtils.MAP_ZOOM_RANGE[0] && zoom <= _SiteMapUtils.MAP_ZOOM_RANGE[1];
};

var centerIsValid = function centerIsValid(center) {
  return Array.isArray(center) && center.length === 2 && center.every(function (v) {
    return typeof v === 'number';
  });
};

var calculateFeatureDataFetches = function calculateFeatureDataFetches(state) {
  var sitesInMap = (0, _SiteMapUtils.calculateLocationsInMap)(state.sites, state.map.bounds, true, 0.06);

  if (!sitesInMap.length) {
    return state;
  }

  var domainsInMap = new Set();
  sitesInMap.filter(function (siteCode) {
    return state.sites[siteCode];
  }).forEach(function (siteCode) {
    domainsInMap.add(state.sites[siteCode].domainCode);
  });

  var newState = _extends({}, state); // Domain-location hierarchy fetches for individual domains
  // Only fetch if bounds are not null as that way we can trust sitesInMap is not all the sites


  if (state.map.zoom >= _SiteMapUtils.SITE_LOCATION_HIERARCHIES_MIN_ZOOM && state.map.bounds) {
    Array.from(domainsInMap).forEach(function (domainCode) {
      if (newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[domainCode]) {
        return;
      }

      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[domainCode] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len

      newState.overallFetch.expected += 1;
      newState.overallFetch.pendingHierarchy += 1;
      newState.featureDataFetchesHasAwaiting = true;
    });
  } // Feature fetches - IMPORT (deferredJson)


  Object.keys(_SiteMapUtils.FEATURES).filter(function (featureKey) {
    return _SiteMapUtils.FEATURES[featureKey].dataLoadType === _SiteMapUtils.FEATURE_DATA_LOAD_TYPES.IMPORT && state.filters.features.available[featureKey] && state.filters.features.visible[featureKey];
  }).forEach(function (featureKey) {
    var featureType = _SiteMapUtils.FEATURES[featureKey].type;
    sitesInMap.forEach(function (siteCode) {
      if (newState.featureDataFetches[featureType][featureKey][siteCode]) {
        return;
      }

      newState.featureDataFetches[featureType][featureKey][siteCode] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL;
      newState.overallFetch.expected += 1;
      newState.featureDataFetchesHasAwaiting = true;
    });
  }); // Feature fetches - FETCH (Locations API, primary locations)

  Object.keys(_SiteMapUtils.FEATURES) // Only look at available+visible features that get fetched and have a location type match
  // If fetching for other child features then at least one of them must be available+visible
  .filter(function (featureKey) {
    var doFetch = _SiteMapUtils.FEATURES[featureKey].dataLoadType === _SiteMapUtils.FEATURE_DATA_LOAD_TYPES.FETCH && _SiteMapUtils.FEATURES[featureKey].matchLocationType && state.filters.features.available[featureKey] && state.filters.features.visible[featureKey];

    if (doFetch && _SiteMapUtils.FEATURES[featureKey].fetchingForFeatures) {
      doFetch = _SiteMapUtils.FEATURES[featureKey].fetchingForFeatures.some(function (fetchingForKey) {
        return state.filters.features.available[fetchingForKey] && state.filters.features.visible[fetchingForKey];
      });
    }

    return doFetch;
  }).forEach(function (featureKey) {
    var _FEATURES$featureKey = _SiteMapUtils.FEATURES[featureKey],
        featureType = _FEATURES$featureKey.type,
        matchLocationType = _FEATURES$featureKey.matchLocationType; // For each feature that warrants fetching; loop through the sites in the map

    sitesInMap // Domain hierarchy must be completed in order to generate subsequent fetches
    // (only true if site location hierarchy feature data is there)
    .filter(function (siteCode) {
      return state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
    }).forEach(function (siteCode) {
      if (!newState.featureDataFetches[featureType][featureKey][siteCode]) {
        newState.featureDataFetches[featureType][featureKey][siteCode] = {};
      } // Extract matching location IDs from the hierarchy and set them as fetches awaiting call


      var hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
      var locationIsMatch = matchLocationType instanceof RegExp ? function (locationKey) {
        return matchLocationType.test(hierarchy[locationKey].type);
      } : function (locationKey) {
        return hierarchy[locationKey].type === matchLocationType;
      };
      Object.keys(hierarchy).filter(locationIsMatch).forEach(function (locationKey) {
        if (newState.featureDataFetches[featureType][featureKey][siteCode][locationKey]) {
          return;
        }

        newState.featureDataFetches[featureType][featureKey][siteCode][locationKey] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len

        newState.overallFetch.expected += 1;
        newState.featureDataFetchesHasAwaiting = true;
      });
    });
  }); // Feature fetches - FETCH (Locations API, sampling points)

  Object.keys(_SiteMapUtils.FEATURES) // Only look at available+visible features that get fetched and have a parentDataFeature
  .filter(function (featureKey) {
    return _SiteMapUtils.FEATURES[featureKey].type === _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS && _SiteMapUtils.FEATURES[featureKey].dataLoadType === _SiteMapUtils.FEATURE_DATA_LOAD_TYPES.FETCH && _SiteMapUtils.FEATURES[featureKey].parentDataFeatureKey && state.filters.features.available[featureKey] && state.filters.features.visible[featureKey];
  }).forEach(function (featureKey) {
    var _FEATURES$featureKey2 = _SiteMapUtils.FEATURES[featureKey],
        featureType = _FEATURES$featureKey2.type,
        parentDataFeatureKey = _FEATURES$featureKey2.parentDataFeatureKey;
    var parentDataFeatureType = _SiteMapUtils.FEATURES[parentDataFeatureKey].type;
    var parentLocations = {};
    Object.keys(state.featureData[parentDataFeatureType][parentDataFeatureKey]).forEach(function (siteCode) {
      Object.keys(state.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode]).forEach(function (locationCode) {
        parentLocations[locationCode] = state.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode][locationCode]; // eslint-disable-line max-len
      });
    });
    var locationsInMap = (0, _SiteMapUtils.calculateLocationsInMap)(parentLocations, state.map.bounds, true);

    if (!locationsInMap) {
      return;
    }

    locationsInMap.forEach(function (locationCode) {
      if (!parentLocations[locationCode].children) {
        return;
      }

      var _parentLocations$loca = parentLocations[locationCode].siteCode,
          siteCode = _parentLocations$loca === void 0 ? null : _parentLocations$loca;

      if (!newState.featureDataFetches[featureType][featureKey][siteCode]) {
        newState.featureDataFetches[featureType][featureKey][siteCode] = {};
      }

      parentLocations[locationCode].children.filter(function (childLocation) {
        return !newState.featureDataFetches[featureType][featureKey][siteCode][childLocation];
      }).forEach(function (childLocation) {
        newState.featureDataFetches[featureType][featureKey][siteCode][childLocation] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len

        newState.overallFetch.expected += 1;
        newState.featureDataFetchesHasAwaiting = true;
      });
    });
  });
  return newState;
};

var reducer = function reducer(state, action) {
  var setMethod = null;

  var newState = _extends({}, state); // Increment the completed count for overall fetch and, if completed and expected are now equal,
  // reset both (so that subsequent batches of fetches can give an accurate progress metric).


  var completeOverallFetch = function completeOverallFetch() {
    newState.overallFetch.completed += 1;

    if (newState.overallFetch.expected === newState.overallFetch.completed) {
      newState.overallFetch.expected = 0;
      newState.overallFetch.completed = 0;
      newState.overallFetch.pendingHierarchy = 0;
    }
  }; // Returns a boolean describing whether a fetch status was updated


  var setFetchStatusFromAction = function setFetchStatusFromAction(status) {
    if (!Object.keys(_SiteMapUtils.FETCH_STATUS).includes(status) || status === _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
      return false;
    }

    var data = action.data,
        featureKey = action.feature,
        siteCode = action.siteCode,
        _action$location = action.location,
        location = _action$location === void 0 ? null : _action$location;

    if (!_SiteMapUtils.FEATURES[featureKey]) {
      return false;
    }

    var featureType = _SiteMapUtils.FEATURES[featureKey].type;

    if (!newState.featureDataFetches[featureType] || !newState.featureDataFetches[featureType][featureKey] || !newState.featureDataFetches[featureType][featureKey][siteCode]) {
      return false;
    } // No location present in action: just siteCode deep


    if (!location && typeof newState.featureDataFetches[featureType][featureKey][siteCode] === 'string') {
      newState.featureDataFetches[featureType][featureKey][siteCode] = status; // If the status is SUCCESS and the action has data, also commit the data

      if (status === _SiteMapUtils.FETCH_STATUS.SUCCESS && data) {
        newState.featureData[featureType][featureKey][siteCode] = data;
      }

      return true;
    } // Location present: go one level deeper


    if (!newState.featureDataFetches[featureType][featureKey][siteCode][location]) {
      return false;
    }

    newState.featureDataFetches[featureType][featureKey][siteCode][location] = status; // If the status is SUCCESS and the action has data, also commit the data

    if (status === _SiteMapUtils.FETCH_STATUS.SUCCESS && data) {
      var parsedData = (0, _SiteMapUtils.parseLocationData)(data);
      var dataFeatureKey = featureKey;
      var dataFeatureType = featureType; // Tower and Distributed base plots share a type so both fetched as TERRESTRIAL_SITE_FEATURES

      if (featureKey === _SiteMapUtils.FEATURES.TERRESTRIAL_SITE_FEATURES.KEY) {
        dataFeatureKey = parsedData.plotType === 'tower' ? _SiteMapUtils.FEATURES.TOWER_BASE_PLOTS.KEY : _SiteMapUtils.FEATURES.DISTRIBUTED_BASE_PLOTS.KEY;
        dataFeatureType = _SiteMapUtils.FEATURES[dataFeatureKey].type; // We also want to pull sampling module data from the hierarchy just for these features

        var hierarchy = newState.featureData[_SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES][siteCode];
        var basePlot = location.replace('all', '').replace('.', '\\.');
        var basePlotRegex = new RegExp("^".concat(basePlot, "([a-z]{3})$"));
        parsedData.samplingModules = Object.keys(hierarchy).reduce(function (acc, cur) {
          var match = cur.match(basePlotRegex);

          if (match) {
            acc.push(match[1]);
          }

          return acc;
        }, []).filter(function (k) {
          return k !== 'all' && k !== 'mfb';
        }).sort(function (a, b) {
          return (_SiteMapUtils.PLOT_SAMPLING_MODULES[a] || null) > (_SiteMapUtils.PLOT_SAMPLING_MODULES[b] || null) ? 1 : -1;
        });
      }

      if (!newState.featureData[dataFeatureType][dataFeatureKey]) {
        newState.featureData[dataFeatureType][dataFeatureKey] = {};
      }

      if (!newState.featureData[dataFeatureType][dataFeatureKey][siteCode]) {
        newState.featureData[dataFeatureType][dataFeatureKey][siteCode] = {};
      }

      newState.featureData[dataFeatureType][dataFeatureKey][siteCode][location] = _extends(_extends({}, parsedData), {}, {
        siteCode: siteCode,
        name: location,
        featureKey: dataFeatureKey,
        domainCode: state.sites[siteCode].domainCode,
        stateCode: state.sites[siteCode].stateCode
      });
    }

    return true;
  }; // Recursively applies a feature visibility change to parents and chilren up/down the tree


  var applyFeatureVisibilityToChildren = function applyFeatureVisibilityToChildren(feature, visible) {
    if (newState.filters.features.visible[feature] === visible) {
      return;
    }

    newState.filters.features.visible[feature] = visible;

    if (_SiteMapUtils.FEATURES[feature].type === _SiteMapUtils.FEATURE_TYPES.GROUP) {
      Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
        return _SiteMapUtils.FEATURES[f].parent === feature;
      }).forEach(function (f) {
        applyFeatureVisibilityToChildren(f, visible);
      });
    }
  };

  var applyFeatureVisibilityToParents = function applyFeatureVisibilityToParents(feature) {
    if (_SiteMapUtils.FEATURES[feature].parent) {
      var parentVisible = Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
        return _SiteMapUtils.FEATURES[f].parent === _SiteMapUtils.FEATURES[feature].parent;
      }) // Of all children...
      .some(function (f) {
        return newState.filters.features.visible[f];
      }); // ...some child is visible

      newState.filters.features.visible[_SiteMapUtils.FEATURES[feature].parent] = parentVisible;
      applyFeatureVisibilityToParents(_SiteMapUtils.FEATURES[feature].parent, parentVisible);
    }
  }; // NATGEO_WORLD_MAP has no data at zoom 17 or higher so go to WORLD_IMAGERY (satellite)


  var updateMapTileWithZoom = function updateMapTileWithZoom() {
    if (newState.map.zoom <= 17 && state.map.tileLayer !== _SiteMapUtils.TILE_LAYERS.NATGEO_WORLD_MAP.KEY && state.map.tileLayerAutoChangedAbove17) {
      newState.map.tileLayer = _SiteMapUtils.TILE_LAYERS.NATGEO_WORLD_MAP.KEY;
      newState.map.tileLayerAutoChangedAbove17 = false;
    }

    if (newState.map.zoom >= 17 && state.map.tileLayer === _SiteMapUtils.TILE_LAYERS.NATGEO_WORLD_MAP.KEY) {
      newState.map.tileLayer = _SiteMapUtils.TILE_LAYERS.WORLD_IMAGERY.KEY;
      newState.map.tileLayerAutoChangedAbove17 = true;
    }
  };

  switch (action.type) {
    case 'setView':
      if (!Object.keys(_SiteMapUtils.VIEWS).includes(action.view)) {
        return state;
      }

      newState.view.current = action.view;
      return newState;

    case 'setViewInitialized':
      if (!Object.keys(_SiteMapUtils.VIEWS).includes(state.view.current)) {
        return state;
      }

      newState.view.initialized[state.view.current] = true;
      return newState;

    case 'setAspectRatio':
      if (typeof action.aspectRatio !== 'number' || action.aspectRatio <= 0) {
        return state;
      }

      newState.aspectRatio.currentValue = action.aspectRatio;
      newState.aspectRatio.widthReference = action.widthReference || 0;
      newState.table.maxBodyHeightUpdateFromAspectRatio = true;
      return newState;

    case 'setAspectRatioResizeEventListenerInitialized':
      newState.aspectRatio.resizeEventListenerInitialized = true;
      return newState;

    case 'hydrateNeonContextData':
      if (!action.neonContextData) {
        return state;
      }

      return (0, _SiteMapUtils.hydrateNeonContextData)(newState, action.neonContextData);
    // Table

    case 'setTableFocus':
      newState.table.focus = action.focus;
      return newState;

    case 'setTableMaxBodyHeight':
      newState.table.maxBodyHeight = Math.max(action.height || 0, _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT);
      newState.table.maxBodyHeightUpdateFromAspectRatio = false;
      return newState;
    // Map

    case 'setMapZoom':
      if (!zoomIsValid(action.zoom)) {
        return state;
      }

      newState.map.zoom = action.zoom;

      if (centerIsValid(action.center)) {
        newState.map.center = action.center;
      }

      if ((0, _SiteMapUtils.boundsAreValid)(action.bounds)) {
        newState.map.bounds = action.bounds;
      }

      newState.map.zoomedIcons = (0, _SiteMapUtils.getZoomedIcons)(newState.map.zoom);
      updateMapTileWithZoom();
      return calculateFeatureDataFetches((0, _SiteMapUtils.calculateFeatureAvailability)(newState));

    case 'setMapBounds':
      if ((0, _SiteMapUtils.boundsAreValid)(action.bounds)) {
        newState.map.bounds = action.bounds;
      }

      return calculateFeatureDataFetches(newState);

    case 'setMapCenter':
      if (!centerIsValid(action.center)) {
        return state;
      }

      if ((0, _SiteMapUtils.boundsAreValid)(action.bounds)) {
        newState.map.bounds = action.bounds;
      }

      newState.map.center = _toConsumableArray(action.center);
      return calculateFeatureDataFetches(newState);

    case 'setMapTileLayer':
      if (!Object.keys(_SiteMapUtils.TILE_LAYERS).includes(action.tileLayer)) {
        return state;
      }

      newState.map.tileLayer = action.tileLayer;
      return newState;

    case 'setMapRepositionOpenPopupFunc':
      newState.map.repositionOpenPopupFunc = typeof action.func === 'function' ? action.func : null;
      return newState;
    // Features

    case 'setFilterFeaturesOpen':
      newState.filters.features.open = !!action.open;
      return newState;

    case 'setFilterFeatureVisibility':
      if (!Object.keys(_SiteMapUtils.FEATURES).includes(action.feature) || typeof action.visible !== 'boolean') {
        return state;
      }

      applyFeatureVisibilityToChildren(action.feature, action.visible);
      applyFeatureVisibilityToParents(action.feature);
      return calculateFeatureDataFetches(newState);

    case 'setFilterFeatureCollapsed':
      if (!Object.keys(_SiteMapUtils.FEATURES).includes(action.feature)) {
        return state;
      }

      newState.filters.features.collapsed.add(action.feature);
      return newState;

    case 'setFilterFeatureExpanded':
      if (!Object.keys(_SiteMapUtils.FEATURES).includes(action.feature)) {
        return state;
      }

      newState.filters.features.collapsed.delete(action.feature);
      return newState;
    // Focus Location

    case 'setNewFocusLocation':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.AWAITING_CALL,
        error: null
      };
      newState.focusLocation.current = action.location;
      newState.focusLocation.data = null;
      newState.overallFetch.expected += 1;

      if (newState.view.current !== _SiteMapUtils.VIEWS.MAP) {
        newState.view.current = _SiteMapUtils.VIEWS.MAP;
      }

      return newState;

    case 'setFocusLocationFetchStarted':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.FETCHING,
        error: null
      };
      newState.focusLocation.data = null;
      return newState;

    case 'setFocusLocationFetchFailed':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.ERROR,
        error: "Invalid location: ".concat(state.focusLocation.current.toString())
      };
      newState.focusLocation.current = null;
      newState.focusLocation.data = null;
      completeOverallFetch();
      return newState;

    case 'setFocusLocationFetchSucceeded':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.SUCCESS,
        error: null
      };
      newState.focusLocation.data = action.skipParse ? action.data : (0, _SiteMapUtils.parseLocationData)(action.data); // For STATE and DOMAIN types: ensure corresponding feature is visible

      if (newState.focusLocation.data.type === 'STATE') {
        newState.filters.features.visible[_SiteMapUtils.FEATURES.STATES.KEY] = true;
        newState.filters.features.visible[_SiteMapUtils.FEATURES.DOMAINS.KEY] = false;
      }

      if (newState.focusLocation.data.type === 'DOMAIN') {
        newState.filters.features.visible[_SiteMapUtils.FEATURES.DOMAINS.KEY] = true;
        newState.filters.features.visible[_SiteMapUtils.FEATURES.STATES.KEY] = false;
      }

      completeOverallFetch();
      newState.map = (0, _SiteMapUtils.getMapStateForFocusLocation)(newState);
      updateMapTileWithZoom();
      return calculateFeatureDataFetches((0, _SiteMapUtils.calculateFeatureAvailability)(newState));
    // Fetch and Import

    case 'awaitingFeatureDataFetchesTriggered':
      return _extends(_extends({}, state), {}, {
        featureDataFetchesHasAwaiting: false
      });

    case 'setFeatureDataFetchStarted':
      setFetchStatusFromAction(_SiteMapUtils.FETCH_STATUS.FETCHING);
      return newState;

    case 'setFeatureDataFetchSucceeded':
      setFetchStatusFromAction(_SiteMapUtils.FETCH_STATUS.SUCCESS);
      completeOverallFetch();
      return newState.overallFetch.expected === 0 ? calculateFeatureDataFetches(newState) : newState;

    case 'setFeatureDataFetchFailed':
      setFetchStatusFromAction(_SiteMapUtils.FETCH_STATUS.ERROR);
      completeOverallFetch();
      return newState;

    case 'setDomainLocationHierarchyFetchStarted':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode]) {
        return state;
      }

      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] = _SiteMapUtils.FETCH_STATUS.FETCHING;
      /* eslint-enable max-len */

      return newState;

    case 'setDomainLocationHierarchyFetchSucceeded':
      if (!newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] || !Array.isArray(action.data.locationChildHierarchy)) {
        return state;
      }
      /* eslint-disable max-len */


      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] = _SiteMapUtils.FETCH_STATUS.SUCCESS;
      action.data.locationChildHierarchy.forEach(function (child) {
        if (child.locationType !== 'SITE' || child.locationName === 'HQTW') {
          return;
        }

        newState.featureData.SITE_LOCATION_HIERARCHIES[child.locationName] = (0, _SiteMapUtils.parseLocationHierarchy)(child);
      });
      /* eslint-enable max-len */

      newState.overallFetch.pendingHierarchy -= 1;
      completeOverallFetch();
      return calculateFeatureDataFetches(newState);

    case 'setDomainLocationHierarchyFetchFailed':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode]) {
        return state;
      }

      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] = _SiteMapUtils.FETCH_STATUS.ERROR;
      /* eslint-enable max-len */

      newState.overallFetch.pendingHierarchy -= 1;
      completeOverallFetch();
      return newState;
    // Selection

    case 'toggleSiteSelected':
      if (newState.selection[_SiteMapUtils.SELECTABLE_FEATURE_TYPES.SITES].has(action.site)) {
        newState.selection[_SiteMapUtils.SELECTABLE_FEATURE_TYPES.SITES].delete(action.site);
      } else {
        newState.selection[_SiteMapUtils.SELECTABLE_FEATURE_TYPES.SITES].add(action.site);
      }

      return deriveBoundarySelections(newState);

    case 'toggleStateSelected':
      if (!action.stateCode) {
        return state;
      }

      setMethod = state.selection.derived[_SiteMapUtils.FEATURES.STATES.KEY][action.stateCode] === 'total' ? 'delete' : 'add';

      newState.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.STATES.KEY][action.stateCode].sites.forEach(function (siteCode) {
        newState.selection[_SiteMapUtils.SELECTABLE_FEATURE_TYPES.SITES][setMethod](siteCode);
      });

      return deriveBoundarySelections(newState);

    case 'toggleDomainSelected':
      if (!action.domainCode) {
        return state;
      }

      setMethod = state.selection.derived[_SiteMapUtils.FEATURES.DOMAINS.KEY][action.domainCode] === 'total' ? 'delete' : 'add';

      newState.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.DOMAINS.KEY][action.domainCode].sites.forEach(function (siteCode) {
        newState.selection[_SiteMapUtils.SELECTABLE_FEATURE_TYPES.SITES][setMethod](siteCode);
      });

      return deriveBoundarySelections(newState);
    // Default

    default:
      return state;
  }
};
/**
   Context and Hook
*/


var Context = (0, _react.createContext)(_SiteMapUtils.DEFAULT_STATE);

var useSiteMapContext = function useSiteMapContext() {
  var hookResponse = (0, _react.useContext)(Context);

  if (hookResponse.length !== 2) {
    return [(0, _cloneDeep.default)(_SiteMapUtils.DEFAULT_STATE), function () {}];
  }

  return hookResponse;
};
/**
   Context Provider
*/


var Provider = function Provider(props) {
  var view = props.view,
      aspectRatio = props.aspectRatio,
      filterPosition = props.filterPosition,
      mapZoom = props.mapZoom,
      mapCenter = props.mapCenter,
      mapTileLayer = props.mapTileLayer,
      locationProp = props.location,
      selection = props.selection,
      maxSelectable = props.maxSelectable,
      children = props.children; // Neon Context State

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextData = _NeonContext$useNeonC3.data,
      neonContextIsFinal = _NeonContext$useNeonC3.isFinal,
      neonContextHasError = _NeonContext$useNeonC3.hasError;
  /**
     Initial State and Reducer Setup
  */


  var initialMapZoom = mapZoom === null ? null : Math.max(Math.min(mapZoom, _SiteMapUtils.MAP_ZOOM_RANGE[1]), _SiteMapUtils.MAP_ZOOM_RANGE[0]);
  var initialState = (0, _cloneDeep.default)(_SiteMapUtils.DEFAULT_STATE);
  initialState.view.current = Object.keys(_SiteMapUtils.VIEWS).includes(view.toUpperCase()) ? view.toUpperCase() : _SiteMapUtils.VIEWS.MAP;
  initialState.filters.position = filterPosition;
  initialState.map = _extends(_extends({}, initialState.map), {}, {
    zoom: initialMapZoom,
    center: mapCenter,
    tileLayer: mapTileLayer
  });

  if (typeof locationProp === 'string') {
    initialState.focusLocation.current = locationProp;
    initialState.focusLocation.fetch.status = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL;
    initialState.overallFetch.expected += 1;
  }

  if (typeof aspectRatio === 'number' && aspectRatio > 0) {
    initialState.aspectRatio.isDynamic = false;
    initialState.aspectRatio.currentValue = aspectRatio;
  }

  if (Object.keys(_SiteMapUtils.SELECTABLE_FEATURE_TYPES).includes(selection)) {
    initialState.selection.active = selection;
    initialState.selection.maxSelectable = maxSelectable;
  }

  if (neonContextIsFinal && !neonContextHasError) {
    initialState = (0, _SiteMapUtils.hydrateNeonContextData)(initialState, neonContextData);
  }

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var canFetchFeatureData = state.neonContextHydrated && !(state.focusLocation.current && state.focusLocation.fetch.status !== _SiteMapUtils.FETCH_STATUS.SUCCESS);
  /**
     Effect - trigger focusLocation fetch or short circuit if found in NeonContext data
  */

  (0, _react.useEffect)(function () {
    var _state$focusLocation = state.focusLocation,
        current = _state$focusLocation.current,
        status = _state$focusLocation.fetch.status;

    if (!current || status !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL || !state.neonContextHydrated) {
      return;
    } // If the location is a known Domain or State then pull from NeonContext


    var _state$featureData$FE = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES],
        _state$featureData$FE2 = _state$featureData$FE[_SiteMapUtils.FEATURES.STATES.KEY],
        statesData = _state$featureData$FE2 === void 0 ? {} : _state$featureData$FE2,
        _state$featureData$FE3 = _state$featureData$FE[_SiteMapUtils.FEATURES.DOMAINS.KEY],
        domainsData = _state$featureData$FE3 === void 0 ? {} : _state$featureData$FE3;

    if (Object.keys(statesData).includes(current)) {
      var _statesData$current$c = statesData[current].center,
          latitude = _statesData$current$c[0],
          longitude = _statesData$current$c[1];
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: {
          type: 'STATE',
          latitude: latitude,
          longitude: longitude
        },
        skipParse: true
      });
      return;
    }

    if (Object.keys(domainsData).includes(current)) {
      var _domainsData$current$ = domainsData[current].center,
          _latitude = _domainsData$current$[0],
          _longitude = _domainsData$current$[1];
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: {
          type: 'DOMAIN',
          latitude: _latitude,
          longitude: _longitude
        },
        skipParse: true
      });
      return;
    }

    if (Object.keys(state.sites).includes(current)) {
      var _state$sites$current = state.sites[current],
          _latitude2 = _state$sites$current.latitude,
          _longitude2 = _state$sites$current.longitude;
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: {
          type: 'SITE',
          latitude: _latitude2,
          longitude: _longitude2
        },
        skipParse: true
      });
      return;
    } // Trigger focus location fetch


    dispatch({
      type: 'setFocusLocationFetchStarted'
    });

    _NeonApi.default.getLocationObservable(current).pipe((0, _operators.map)(function (response) {
      if (response && response.data && response.data) {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: response.data
        });
        return (0, _rxjs.of)(true);
      }

      dispatch({
        type: 'setFocusLocationFetchFailed',
        error: 'malformed response'
      });
      return (0, _rxjs.of)(false);
    }), (0, _operators.catchError)(function (error) {
      dispatch({
        type: 'setFocusLocationFetchFailed',
        error: error.message
      });
      return (0, _rxjs.of)(false);
    })).subscribe();
  }, [state.sites, state.focusLocation, state.focusLocation.fetch.status, state.neonContextHydrated, state.featureData]);
  /**
     Effect - trigger all data fetches and imports
  */

  (0, _react.useEffect)(function () {
    if (!canFetchFeatureData || !state.featureDataFetchesHasAwaiting) {
      return;
    } // Special case: fetch site-location hierarchies. These are not features themselves
    // but constitute critical data in order to generate feature fetches within sites


    Object.keys(state.featureDataFetches.SITE_LOCATION_HIERARCHIES).forEach(function (domainCode) {
      if (state.featureDataFetches.SITE_LOCATION_HIERARCHIES[domainCode] !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
        return;
      } // eslint-disable-line max-len


      dispatch({
        type: 'setDomainLocationHierarchyFetchStarted',
        domainCode: domainCode
      });

      _NeonApi.default.getSiteLocationHierarchyObservable(domainCode).pipe((0, _operators.map)(function (response) {
        if (response && response.data && response.data) {
          dispatch({
            type: 'setDomainLocationHierarchyFetchSucceeded',
            data: response.data,
            domainCode: domainCode
          });
          return (0, _rxjs.of)(true);
        }

        dispatch({
          type: 'setDomainLocationHierarchyFetchFailed',
          error: 'malformed response',
          domainCode: domainCode
        });
        return (0, _rxjs.of)(false);
      }), (0, _operators.catchError)(function (error) {
        dispatch({
          type: 'setDomainLocationHierarchyFetchFailed',
          error: error.message,
          domainCode: domainCode
        });
        return (0, _rxjs.of)(false);
      })).subscribe();
    }); // All other feature-based fetches

    Object.keys(state.featureDataFetches).filter(function (type) {
      return type !== _SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
    }).forEach(function (type) {
      Object.keys(state.featureDataFetches[type]).forEach(function (feature) {
        var dataLoadType = _SiteMapUtils.FEATURES[feature].dataLoadType;
        Object.keys(state.featureDataFetches[type][feature]).forEach(function (siteCode) {
          var featureSite = state.featureDataFetches[type][feature][siteCode]; // IMPORT - Fetch via SiteMapDeferredJson

          if (dataLoadType === _SiteMapUtils.FEATURE_DATA_LOAD_TYPES.IMPORT) {
            if (featureSite !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
              return;
            }

            dispatch({
              type: 'setFeatureDataFetchStarted',
              feature: feature,
              siteCode: siteCode
            });

            var onSuccess = function onSuccess(data) {
              return dispatch({
                type: 'setFeatureDataFetchSucceeded',
                feature: feature,
                siteCode: siteCode,
                data: data
              });
            };

            var onError = function onError(error) {
              return dispatch({
                type: 'setFeatureDataFetchFailed',
                feature: feature,
                siteCode: siteCode,
                error: error
              });
            };

            (0, _SiteMapDeferredJson.default)(feature, siteCode, onSuccess, onError);
          } // FETCH - Fetch via the Locations API


          if (dataLoadType === _SiteMapUtils.FEATURE_DATA_LOAD_TYPES.FETCH) {
            if (_typeof(featureSite) !== 'object') {
              return;
            }

            Object.keys(featureSite).forEach(function (location) {
              if (featureSite[location] !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
                return;
              }

              dispatch({
                type: 'setFeatureDataFetchStarted',
                feature: feature,
                siteCode: siteCode,
                location: location
              });

              _NeonApi.default.getLocationObservable(location).pipe((0, _operators.map)(function (response) {
                if (response && response.data && response.data) {
                  dispatch({
                    type: 'setFeatureDataFetchSucceeded',
                    data: response.data,
                    feature: feature,
                    siteCode: siteCode,
                    location: location
                  });
                  return (0, _rxjs.of)(true);
                }

                dispatch({
                  type: 'setFeatureDataFetchFailed',
                  error: 'malformed response',
                  feature: feature,
                  siteCode: siteCode,
                  location: location
                });
                return (0, _rxjs.of)(false);
              }), (0, _operators.catchError)(function (error) {
                dispatch({
                  type: 'setFeatureDataFetchFailed',
                  error: error.message,
                  feature: feature,
                  siteCode: siteCode,
                  location: location
                });
                return (0, _rxjs.of)(false);
              })).subscribe();
            });
          }
        });
      });
    });
    dispatch({
      type: 'awaitingFeatureDataFetchesTriggered'
    });
  }, [canFetchFeatureData, state.featureDataFetchesHasAwaiting, state.featureDataFetches]);
  /**
     Render
  */

  return /*#__PURE__*/_react.default.createElement(Context.Provider, {
    value: [state, dispatch]
  }, children);
};

Provider.propTypes = _extends(_extends({}, _SiteMapUtils.SITE_MAP_PROP_TYPES), {}, {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
});
Provider.defaultProps = _SiteMapUtils.SITE_MAP_DEFAULT_PROPS;
/**
   Export
*/

var SiteMapContext = {
  Provider: Provider,
  useSiteMapContext: useSiteMapContext,
  SORT_DIRECTIONS: _SiteMapUtils.SORT_DIRECTIONS,
  VIEWS: _SiteMapUtils.VIEWS
};
var _default = SiteMapContext;
exports.default = _default;