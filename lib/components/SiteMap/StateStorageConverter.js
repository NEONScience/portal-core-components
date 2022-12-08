"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStateFromStorage = exports.convertStateForStorage = void 0;
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
var convertStateForStorage = function convertStateForStorage(state) {
  var _state$selection, _state$selection2, _state$filters, _state$filters$featur, _state$filters2, _state$filters2$overl, _state$map;
  var selectionSet = (_state$selection = state.selection) === null || _state$selection === void 0 ? void 0 : _state$selection.set;
  var selectionValidSet = (_state$selection2 = state.selection) === null || _state$selection2 === void 0 ? void 0 : _state$selection2.validSet;
  var filtersFeaturesCollapsed = (_state$filters = state.filters) === null || _state$filters === void 0 ? void 0 : (_state$filters$featur = _state$filters.features) === null || _state$filters$featur === void 0 ? void 0 : _state$filters$featur.collapsed;
  var filtersOverlaysExpanded = (_state$filters2 = state.filters) === null || _state$filters2 === void 0 ? void 0 : (_state$filters2$overl = _state$filters2.overlays) === null || _state$filters2$overl === void 0 ? void 0 : _state$filters2$overl.expanded;
  var mapOverlays = (_state$map = state.map) === null || _state$map === void 0 ? void 0 : _state$map.overlays;
  var newState = (0, _cloneDeep.default)(state);
  if (selectionSet instanceof Set) {
    newState.selection.set = Array.from(selectionSet);
  } else {
    newState.selection.set = [];
  }
  if (selectionValidSet instanceof Set) {
    newState.selection.validSet = Array.from(selectionValidSet);
  } else {
    newState.selection.validSet = [];
  }
  if (filtersFeaturesCollapsed instanceof Set) {
    newState.filters.features.collapsed = Array.from(filtersFeaturesCollapsed);
  } else {
    newState.filters.features.collapsed = [];
  }
  if (filtersOverlaysExpanded instanceof Set) {
    newState.filters.overlays.expanded = Array.from(filtersOverlaysExpanded);
  } else {
    newState.filters.overlays.expanded = [];
  }
  if (filtersOverlaysExpanded instanceof Set) {
    newState.map.overlays = Array.from(mapOverlays);
  } else {
    newState.map.overlays = [];
  }
  return newState;
};

/**
 * Restore the state from JSON serialization. Array objects must be
 * converted back to the expected Set objects.
 * @param storedState The state read from storage.
 */
exports.convertStateForStorage = convertStateForStorage;
var convertStateFromStorage = function convertStateFromStorage(state, initialState) {
  var _state$selection3, _state$selection4, _state$filters3, _state$filters3$featu, _state$filters4, _state$filters4$overl, _state$map2;
  var newState = (0, _cloneDeep.default)(state);
  newState.view = initialState.view;
  newState.map.zoomedIcons = initialState.map.zoomedIcons;
  newState.selection.onChange = initialState.selection.onChange;
  var setValue = (_state$selection3 = state.selection) === null || _state$selection3 === void 0 ? void 0 : _state$selection3.set;
  var validSet = (_state$selection4 = state.selection) === null || _state$selection4 === void 0 ? void 0 : _state$selection4.validSet;
  var collapsedValue = (_state$filters3 = state.filters) === null || _state$filters3 === void 0 ? void 0 : (_state$filters3$featu = _state$filters3.features) === null || _state$filters3$featu === void 0 ? void 0 : _state$filters3$featu.collapsed;
  var expandedValue = (_state$filters4 = state.filters) === null || _state$filters4 === void 0 ? void 0 : (_state$filters4$overl = _state$filters4.overlays) === null || _state$filters4$overl === void 0 ? void 0 : _state$filters4$overl.expanded;
  var mapOverlays = (_state$map2 = state.map) === null || _state$map2 === void 0 ? void 0 : _state$map2.overlays;
  if (Array.isArray(setValue)) {
    newState.selection.set = new Set(setValue);
  } else {
    newState.selection.set = new Set();
  }
  if (Array.isArray(validSet)) {
    newState.selection.validSet = new Set(validSet);
  } else {
    newState.selection.validSet = new Set();
  }
  if (Array.isArray(collapsedValue)) {
    newState.filters.features.collapsed = new Set(collapsedValue);
  } else {
    newState.filters.features.collapsed = new Set();
  }
  if (Array.isArray(expandedValue)) {
    newState.filters.overlays.expanded = new Set(expandedValue);
  } else {
    newState.filters.overlays.expanded = new Set();
  }
  if (Array.isArray(mapOverlays)) {
    newState.map.overlays = new Set(mapOverlays);
  } else {
    newState.map.overlays = new Set();
  }
  return newState;
};
exports.convertStateFromStorage = convertStateFromStorage;