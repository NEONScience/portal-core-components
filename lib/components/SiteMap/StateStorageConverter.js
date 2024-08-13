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
  const selectionSet = state.selection?.set;
  const selectionValidSet = state.selection?.validSet;
  const filtersFeaturesCollapsed = state.filters?.features?.collapsed;
  const filtersOverlaysExpanded = state.filters?.overlays?.expanded;
  const mapOverlays = state.map?.overlays;
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
  const newState = (0, _cloneDeep.default)(state);
  newState.view = initialState.view;
  newState.map.zoomedIcons = initialState.map.zoomedIcons;
  newState.selection.onChange = initialState.selection.onChange;
  const setValue = state.selection?.set;
  const validSet = state.selection?.validSet;
  const collapsedValue = state.filters?.features?.collapsed;
  const expandedValue = state.filters?.overlays?.expanded;
  const mapOverlays = state.map?.overlays;
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