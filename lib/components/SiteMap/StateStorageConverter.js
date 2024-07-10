"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStateFromStorage = exports.convertStateForStorage = void 0;
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
const convertStateForStorage = state => {
  var _state$selection, _state$selection2, _state$filters, _state$filters2, _state$map;
  const selectionSet = (_state$selection = state.selection) === null || _state$selection === void 0 ? void 0 : _state$selection.set;
  const selectionValidSet = (_state$selection2 = state.selection) === null || _state$selection2 === void 0 ? void 0 : _state$selection2.validSet;
  const filtersFeaturesCollapsed = (_state$filters = state.filters) === null || _state$filters === void 0 || (_state$filters = _state$filters.features) === null || _state$filters === void 0 ? void 0 : _state$filters.collapsed;
  const filtersOverlaysExpanded = (_state$filters2 = state.filters) === null || _state$filters2 === void 0 || (_state$filters2 = _state$filters2.overlays) === null || _state$filters2 === void 0 ? void 0 : _state$filters2.expanded;
  const mapOverlays = (_state$map = state.map) === null || _state$map === void 0 ? void 0 : _state$map.overlays;
  const newState = (0, _cloneDeep.default)(state);
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
const convertStateFromStorage = (state, initialState) => {
  var _state$selection3, _state$selection4, _state$filters3, _state$filters4, _state$map2;
  const newState = (0, _cloneDeep.default)(state);
  newState.view = initialState.view;
  newState.map.zoomedIcons = initialState.map.zoomedIcons;
  newState.selection.onChange = initialState.selection.onChange;
  const setValue = (_state$selection3 = state.selection) === null || _state$selection3 === void 0 ? void 0 : _state$selection3.set;
  const validSet = (_state$selection4 = state.selection) === null || _state$selection4 === void 0 ? void 0 : _state$selection4.validSet;
  const collapsedValue = (_state$filters3 = state.filters) === null || _state$filters3 === void 0 || (_state$filters3 = _state$filters3.features) === null || _state$filters3 === void 0 ? void 0 : _state$filters3.collapsed;
  const expandedValue = (_state$filters4 = state.filters) === null || _state$filters4 === void 0 || (_state$filters4 = _state$filters4.overlays) === null || _state$filters4 === void 0 ? void 0 : _state$filters4.expanded;
  const mapOverlays = (_state$map2 = state.map) === null || _state$map2 === void 0 ? void 0 : _state$map2.overlays;
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