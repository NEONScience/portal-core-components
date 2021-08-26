import cloneDeep from 'lodash/cloneDeep';

/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
const convertStateForStorage = (state: any): any => {
  const selectionSet = state.selection?.set;
  const selectionValidSet = state.selection?.validSet;
  const filtersFeaturesCollapsed = state.filters?.features?.collapsed;
  const filtersOverlaysExpanded = state.filters?.overlays?.expanded;
  const mapOverlays = state.map?.overlays;
  const newState = cloneDeep(state);
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
const convertStateFromStorage = (state: any, initialState: any): any => {
  const newState = cloneDeep(state);
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

export { convertStateForStorage, convertStateFromStorage };
