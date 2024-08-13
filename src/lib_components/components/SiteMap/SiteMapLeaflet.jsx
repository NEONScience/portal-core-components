/* eslint-disable no-underscore-dangle */
import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useCallback,
  useLayoutEffect,
} from 'react';
import ReactDOMServer from 'react-dom/server';

import { useId } from 'react-id-generator';

import L from 'leaflet';
import {
  LayerGroup,
  MapContainer,
  ScaleControl,
  TileLayer,
  WMSTileLayer,
  useMapEvents,
} from 'react-leaflet';

import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import MapPanIcon from '@mui/icons-material/PanTool';
import MapAreaSelectIcon from '@mui/icons-material/CropFree';
import ObservatoryIcon from '@mui/icons-material/Public';
import FocusLocationIcon from '@mui/icons-material/Place';

import LeafletGroupedLayerControl from './LeafletGroupedLayerControl';

import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapFeature from './SiteMapFeature';
import {
  VIEWS,
  BASE_LAYERS,
  OBSERVATORY_CENTER,
  OVERLAYS,
  OVERLAY_GROUPS,
  MAP_ZOOM_RANGE,
  FEATURES,
  FEATURE_TYPES,
  FETCH_STATUS,
  MAP_MOUSE_MODES,
  UNSELECTABLE_MARKER_FILTER,
  LEAFLET_ATTR_PREFIX,
  mapIsAtFocusLocation,
  calculateLocationsInBounds,
  deriveFullObservatoryZoomLevel,
} from './SiteMapUtils';

import 'leaflet/dist/leaflet.css';
import './SiteMap.css';

const useStyles = makeStyles((theme) => ({
  map: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
    background: theme.palette.grey[50],
    '& div.rlglc-wrap': {
      boxShadow: 'unset',
      margin: '0px',
      left: '8px',
      top: '8px',
      '& .rlglc': {
        border: `1px solid ${Theme.colors.LIGHT_BLUE[500]}`,
        borderRadius: '2px',
      },
      '& .rlglc-active': {
        border: `1px solid ${Theme.palette.grey[300]}`,
      },
      '& .rlglc:not(.rlglc-active) .rlglc-a': {
        width: '36px',
        height: '36px !important',
      },
      '& .rlglc.rlglc-active .rlglc-a': {
        width: 'auto !important',
        height: 'auto !important',
        padding: '12px',
      },
      '& .rlglc-open': {
        '& .rlglc-input': {
          width: '14px',
          height: '14px',
          margin: '3px 0px 0px 0px',
          cursor: 'pointer',
        },
        '& .rlglc-title': {
          fontFamily: '"Inter",Helvetica,Arial,sans-serif',
        },
        '& .rlglc-groupTitle': {
          fontFamily: '"Inter",Helvetica,Arial,sans-serif',
          fontSize: '13px',
        },
      },
    },
    '& div.leaflet-control-zoom': {
      border: 'none',
    },
    // '& div.leaflet-top.leaflet-right': {
    //   right: 'unset !important',
    //   left: '0px',
    // },
    '& div.leaflet-bar': {
      top: '54px',
      left: '8px',
      margin: '0px',
      borderRadius: '2px',
      boxShadow: 'unset',
      '& a': {
        color: Theme.colors.LIGHT_BLUE[500],
        border: `1px solid ${Theme.colors.LIGHT_BLUE[500]}`,
        width: '26px',
        height: '26px',
        lineHeight: '26px',
        fontSize: '18px',
        '&:hover, &:active': {
          color: Theme.colors.LIGHT_BLUE[400],
          borderColor: Theme.colors.LIGHT_BLUE[400],
        },
        '&:first-child': {
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px',
        },
        '&:last-child': {
          borderTop: 'none',
          borderBottomLeftRadius: '2px',
          borderBottomRightRadius: '2px',
        },
      },
    },
    '& div.leaflet-control-attribution': {
      borderTopLeftRadius: '2px',
      marginRight: '26px',
      height: '26px',
      padding: '4px 8px',
    },
    '& div.leaflet-control-attribution a': {
      color: theme.palette.primary.main,
    },
    '& .leaflet-container a': {
      color: theme.palette.primary.main,
    },
    '& input[type="radio"]': {
      cursor: 'pointer',
    },
  },
  mapNoMarkerPointerEvents: {
    '& div.leaflet-marker-pane *': {
      pointerEvents: 'none',
    },
  },
  mapFullscreen: {
    '& div.leaflet-control-attribution': {
      marginRight: '0px',
    },
  },
  attribution: {
    color: theme.palette.secondary.main,
    fontSize: '11.5px',
    cursor: 'help',
    display: 'inline',
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  endFlex: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  progress: {
    zIndex: 900,
    position: 'absolute',
    top: '12px',
    left: '56px',
  },
  mapNavButtonContainer: {
    position: 'absolute',
    zIndex: 999,
    margin: '0px',
    left: '8px',
  },
  mapNavButton: {
    backgroundColor: '#fff !important',
    width: '26px',
    height: '26px',
    padding: 'unset',
    borderRadius: '2px 0px 2px 0px',
    border: `1px solid ${Theme.colors.LIGHT_BLUE[500]}`,
    '&:hover, &:active': {
      color: Theme.colors.LIGHT_BLUE[400],
      borderColor: Theme.colors.LIGHT_BLUE[400],
      backgroundColor: theme.palette.grey[50],
    },
    '& svg': {
      fontSize: '1.15rem !important',
    },
  },
  observatoryButton: {
    top: '114px',
  },
  focusLocationButton: {
    top: '148px',
  },
  mouseModeToggleButtonGroup: {
    borderRadius: '2px',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 999,
    margin: '0px',
    top: '8px',
    left: '56px',
    '& button': {
      width: '26px',
      height: '26px',
      padding: 'unset !important',
      '& svg': {
        fontSize: '0.9rem',
      },
    },
  },
  areaSelection: {
    position: 'absolute',
    pointerEvents: 'none',
    border: `3px dotted ${Theme.colors.LIGHT_BLUE[500]}`,
    backgroundColor: Theme.colors.LIGHT_BLUE[100],
    opacity: 0.6,
    zIndex: 999,
  },
}));

const handleBaseLayerChange = (dispatch, key) => {
  if (key === null) { return; }
  const isNone = key === 'none';
  if (!isNone && !BASE_LAYERS[key]) { return; }
  const appliedKey = isNone ? null : key;
  dispatch({ type: 'setMapBaseLayer', baseLayer: appliedKey });
};

const LeafletMapManager = () => {
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const {
    aspectRatio: { currentValue: aspectRatioValue },
  } = state;
  const handleMoveEnd = (event) => {
    const targetCenter = event.target.getCenter();
    const targetBounds = event.target.getBounds();
    dispatch({
      type: 'setMapCenter',
      center: [targetCenter.lat, targetCenter.lng],
      bounds: {
        lat: [targetBounds._southWest.lat, targetBounds._northEast.lat],
        lng: [targetBounds._southWest.lng, targetBounds._northEast.lng],
      },
    });
    if (typeof state.map.repositionOpenPopupFunc === 'function') {
      state.map.repositionOpenPopupFunc();
    }
  };
  const handleZoomEnd = (event) => {
    const targetZoom = event.target.getZoom();
    const targetCenter = event.target.getCenter();
    const targetBounds = event.target.getBounds();
    dispatch({
      type: 'setMapZoom',
      zoom: targetZoom,
      center: [targetCenter.lat, targetCenter.lng],
      bounds: {
        lat: [targetBounds._southWest.lat, targetBounds._northEast.lat],
        lng: [targetBounds._southWest.lng, targetBounds._northEast.lng],
      },
    });
    if (typeof state.map.repositionOpenPopupFunc === 'function') {
      state.map.repositionOpenPopupFunc();
    }
  };
  const handleBaseLayerChangeLeaflet = (event) => {
    handleBaseLayerChange(dispatch, event.name);
  };
  const map = useMapEvents({
    zoomend: (event) => handleZoomEnd(event),
    moveend: (event) => handleMoveEnd(event),
    baselayerchange: (event) => handleBaseLayerChangeLeaflet(event),
  });
  useEffect(() => {
    map.attributionControl.setPrefix(LEAFLET_ATTR_PREFIX);
  }, [map]);
  useEffect(() => {
    map._container.style.paddingBottom = `${(aspectRatioValue || 0.75) * 100}%`;
  }, [map, aspectRatioValue]);
  return null;
};

/**
   Main Component
*/
const SiteMapLeaflet = () => {
  const classes = useStyles(Theme);
  const mapRef = useRef(null);
  const [mapInstanceId] = useId();

  const mapRefExists = () => (
    mapRef && mapRef.current && mapRef.current._container
      && mapRef.current._panes && mapRef.current._layers
  );

  // State, Dispatch, and other stuff from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  let canRender = state.neonContextHydrated;
  if (
    state.focusLocation.current
      && state.focusLocation.fetch.status !== FETCH_STATUS.SUCCESS
  ) {
    canRender = false;
  }

  const [mapRefReady, setMapRefReady] = useState(false);

  /**
     Effect
     If zoom was not set as a prop then attempt to set the initial zoom such that
     all sites are visible. This depends on the client dimensions of the map
     and whether height or width is the deciding factor depends on the aspect ratio.
  */
  useEffect(() => {
    if (!canRender || state.map.zoom !== null || !mapRefExists()) { return; }
    dispatch({
      type: 'setMapZoom',
      zoom: deriveFullObservatoryZoomLevel(mapRef),
    });
  }, [
    canRender,
    state.map.zoom,
    mapRef,
    dispatch,
  ]);

  /**
    Effect
    If map bounds are null (as they will be when setting a focus location) then fill them in
    We have to do it this way as only the Leaflet Map instance can give us bounds

    Effect for setting the initial zoom so that we can include the bounds
    of the map in the initial zoom setting to allow proper feature detection.
  */
  const mapRefExistsProp = mapRefExists();
  useEffect(() => {
    if (state.map.bounds !== null || !mapRefExistsProp) { return; }
    const bounds = mapRef.current.getBounds();
    if (state.map.zoom === null) {
      dispatch({
        type: 'setMapBounds',
        bounds: {
          lat: [bounds._southWest.lat, bounds._northEast.lat],
          lng: [bounds._southWest.lng, bounds._northEast.lng],
        },
      });
    } else {
      dispatch({
        type: 'setMapZoom',
        zoom: state.map.zoom,
        bounds: {
          lat: [bounds._southWest.lat, bounds._northEast.lat],
          lng: [bounds._southWest.lng, bounds._northEast.lng],
        },
      });
    }
  }, [mapRefExistsProp, state.map.bounds, state.map.zoom, dispatch]);

  /**
    Effect
    Visually distinguish unselectable markers in the marker pane while also changing the draw order
    of marker icons to put unselectable ones behind selectable ones. Use a 0-length setTimeout to
    allow the map to complete one render cycle first. We must do this here, instead of in
    SiteMapFeature.jsx where we render the markers, because React-Leaflet does not currently support
    setting arbitrary styles on markers. =(
  */
  useLayoutEffect(() => {
    const timeout = window.setTimeout(() => {
      if (
        !mapRefExists() || state.view.current !== VIEWS.MAP
          || !state.selection.active || !state.selection.validSet
          || state.selection.active !== FEATURE_TYPES.SITES.KEY
      ) { return; }
      const { markerPane } = mapRef.current._panes;
      if (markerPane && markerPane.children && markerPane.children.length) {
        // Unselectables: apply CSS filters to appear ghosted
        [...markerPane.children]
          .filter((marker) => !state.selection.validSet.has(marker.title))
          .forEach((marker) => {
            // eslint-disable-next-line no-param-reassign
            marker.style.filter = UNSELECTABLE_MARKER_FILTER;
          });
        // Selecatbles: Uniformly bump the zIndexOffset to put them all on top
        state.selection.validSet.forEach((item) => {
          const layerIdx = Object.keys(mapRef.current._layers).find((k) => (
            mapRef.current._layers[k].options
              && mapRef.current._layers[k].options.title === item
          ));
          if (layerIdx !== -1 && mapRef.current._layers[layerIdx]) {
            const zIndex = (mapRef.current._layers[layerIdx] || {})._zIndex || 0;
            mapRef.current._layers[layerIdx].setZIndexOffset(zIndex + 1000);
          }
        });
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [
    state.selection.active,
    state.selection.validSet,
    state.selection.hideUnselectable,
    state.map.bounds,
    state.view,
  ]);

  /**
     Callback
     Call map.invalidateSize to fix any tiling errors. We call this when the map is first ready
     to get around race conditions with leaflet initialization and loading the sitemap in dynamic
     containers like dialogs.
  */
  const invalidateSize = useCallback(() => {
    if (!mapRefExists()) { return; }
    // setTimeout of 0 to fire after map render cycle completes
    window.setTimeout(() => {
      if (!mapRefExists()) { return; }
      mapRef.current.invalidateSize();
    }, 0);
  }, []);

  /**
    Effect
    Force a redraw when switching to the map for the first time from another view or when component
    dimensions (e.g. aspectRatio or widthReference) has changed
  */
  useEffect(() => {
    if (!mapRefExists() || state.view.current !== VIEWS.MAP) { return; }
    mapRef.current.invalidateSize();
    if (!state.view.initialized[VIEWS.MAP]) {
      dispatch({ type: 'setViewInitialized' });
    }
  }, [
    dispatch,
    state.view,
    state.aspectRatio.currentValue,
    state.aspectRatio.widthReference,
  ]);

  /**
     Area Selection - Local State & Reducer
     NOTE: this is not kept in primary state because it's used only when actively selecting and
     updated frequently during mouse drag. The cycle through the main reducer is too laggy.
  */
  const areaSelectionDefaultState = {
    isDragging: false,
    shiftPressed: false,
    center: { x: null, y: null },
    reach: { x: null, y: null },
  };
  const areaSelectionReducer = (areaSelectionState, action) => {
    const { isDragging } = areaSelectionState;
    const newState = { ...areaSelectionState };
    switch (action.type) {
      case 'start':
        if (isDragging || !Number.isInteger(action.x) || !Number.isInteger(action.y)) {
          return areaSelectionState;
        }
        newState.isDragging = true;
        newState.center = { x: action.x, y: action.y };
        newState.reach = { x: action.x, y: action.y };
        return newState;
      case 'move':
        if (!isDragging || !Number.isInteger(action.x) || !Number.isInteger(action.y)) {
          return areaSelectionState;
        }
        newState.reach = { x: action.x, y: action.y };
        return newState;
      case 'end':
        if (!isDragging || !Number.isInteger(action.x) || !Number.isInteger(action.y)) {
          return areaSelectionState;
        }
        newState.isDragging = false;
        newState.center = { x: null, y: null };
        newState.reach = { x: null, y: null };
        return newState;
      case 'shift':
        newState.shiftPressed = !!action.pressed;
        return newState;
      default:
        return areaSelectionState;
    }
  };
  const [areaSelection, areaSelectionDispatch] = useReducer(
    areaSelectionReducer,
    areaSelectionDefaultState,
  );

  /**
     Local State / Effect - Whether GroupedLayerControl has been rendered
     <ReactLeafletGroupedLayerControl> is a child of <Map>, but it also must take the ref to the map
     as a prop. Thus we must track whether it has rendered with local state. We want to basically
     re-render the map immediately and only once when the mepRef is set through the first render.
  */
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (mapRefExists() && !mapRefReady) {
      setMapRefReady(true);
      mapRef.current.invalidateSize();
    }
  });

  /**
     Effect
     Area Selection - event listeners to handle area selection mouse events
  */
  useEffect(() => {
    if (
      !mapRef || !mapRef.current || !mapRef.current._container
        || state.map.mouseMode !== MAP_MOUSE_MODES.AREA_SELECT
    ) { return () => {}; }
    const leafletElement = mapRef.current;
    const { isDragging, center, shiftPressed } = areaSelection;
    mapRef.current._container.onmousedown = (event) => {
      if (isDragging) { return; }
      areaSelectionDispatch({ type: 'start', x: event.offsetX, y: event.offsetY });
    };
    mapRef.current._container.onmousemove = (event) => {
      if (!isDragging) { return; }
      areaSelectionDispatch({ type: 'move', x: event.offsetX, y: event.offsetY });
    };
    mapRef.current._container.onmouseup = (event) => {
      if (!isDragging) { return; }
      const reach = { x: event.offsetX, y: event.offsetY };
      const centerLatLng = leafletElement.containerPointToLatLng(L.point(center.x, center.y));
      const reachLatLng = leafletElement.containerPointToLatLng(L.point(reach.x, reach.y));
      const selectionBounds = {
        lat: [
          Math.min(centerLatLng.lat, reachLatLng.lat),
          Math.max(centerLatLng.lat, reachLatLng.lat),
        ],
        lng: [
          Math.min(centerLatLng.lng, reachLatLng.lng),
          Math.max(centerLatLng.lng, reachLatLng.lng),
        ],
      };
      let selectableData = {};
      if (state.selection.active === FEATURE_TYPES.SITES.KEY) {
        selectableData = state.sites;
      }
      if ([FEATURE_TYPES.STATES.KEY, FEATURE_TYPES.DOMAINS.KEY].includes(state.selection.active)) {
        const selectableFeatureKey = Object.keys(FEATURES)
          .find((k) => FEATURES[k].type === state.selection.active);
        if (selectableFeatureKey) {
          selectableData = state.featureData[state.selection.active][selectableFeatureKey];
        }
      }
      const newSelectionSet = calculateLocationsInBounds(selectableData, selectionBounds);
      const finalSelectionSet = new Set([
        ...newSelectionSet,
        ...(shiftPressed ? Array.from(state.selection.set) : []),
      ]);
      areaSelectionDispatch({ type: 'end', x: event.offsetX, y: event.offsetY });
      dispatch({ type: 'updateSelectionSet', selection: finalSelectionSet });
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Shift') { areaSelectionDispatch({ type: 'shift', pressed: true }); }
    };
    const handleKeyUp = (event) => {
      if (event.key === 'Shift') { areaSelectionDispatch({ type: 'shift', pressed: false }); }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  /**
    Effect
    Create masks for DOMAINS and/or STATES.
    These features intentionally have extra-wide strokes. When combined with a mask it creates
    the effect of stroke "only on the inside" so that strokes of adjacent domains/states never
    overlap along shared borders. This is especially useful for visual differentiation of different
    selection statuses for adjacent states/domains.
  */
  useLayoutEffect(() => {
    // setTimeout of 0 to fire after map render cycle completes
    window.setTimeout(() => {
      // Only continue if the map is in a ready / fully rendered state.
      if (
        !mapRef || !mapRef.current || !mapRef.current
          || !mapRef.current._ready || mapRef.current._updating
          || !mapRef.current._panes
          || !mapRef.current._panes.overlayPane
          || !mapRef.current._panes.overlayPane.children.length
          || mapRef.current._panes.overlayPane.children[0].nodeName !== 'svg'
      ) { return; }
      // Only continue if DOMAINS and/or STATES are showing
      if (
        !state.filters.features.visible[FEATURES.DOMAINS.KEY]
          && !state.filters.features.visible[FEATURES.STATES.KEY]
      ) { return; }
      // Only continue if the overlay pane has child nodes (rendered feature data)
      const svg = mapRef.current._panes.overlayPane.children[0];
      if (!svg.children.length) { return; }
      // Remove any existing <defs> node (it's only created by this effect, never by Leaflet)
      if (svg.children[0].nodeName.toLowerCase() === 'defs') {
        svg.removeChild(svg.children[0]);
      }
      // Only continue if there is one child node and it's a non-empty <g>
      if (svg.children.length !== 1
        || svg.children[0].nodeName.toLowerCase() !== 'g'
        || !svg.children[0].children.length
      ) { return; }
      const paths = [...svg.children[0].children];
      const svgNS = 'http://www.w3.org/2000/svg';
      const defs = document.createElementNS(svgNS, 'defs');
      let defCount = 0;
      paths
        .filter((path) => path.attributes.class && path.attributes.class.value.includes('#mask'))
        .forEach((path) => {
          defCount += 1;
          const baseId = path.attributes.class.value.split(' ')[0];
          const defMaskId = baseId.replace('#', '');
          // Create a new <mask> element
          const defMask = document.createElementNS(svgNS, 'mask');
          defMask.setAttributeNS(null, 'id', defMaskId);
          // Create a new <path> element with the same coordinates and append it to the mask
          const defPath = document.createElementNS(svgNS, 'path');
          defPath.setAttributeNS(null, 'd', path.attributes.d.value);
          defPath.setAttributeNS(null, 'fill', 'white');
          defPath.setAttributeNS(null, 'stroke', 'rgba(255, 255, 255, 0.5)');
          defPath.setAttributeNS(null, 'stroke-width', '1.5');
          defMask.appendChild(defPath);
          // Append the <mask> to <defs>
          defs.appendChild(defMask);
          // Set the mask-path attribute on the <path> in the overlay pane
          path.setAttributeNS(null, 'mask', `url(${baseId})`);
          // React Leaflet Polygon doesn't afford arbitrary styling and we use the className for
          // masking as we can't set arbitrary attributes or id either. But when showing masked
          // polygons AND doing area selection we need to apply some extra styles to the polygons
          // so that they are not fighting area selection for mouse control.
          path.setAttributeNS(null, 'style', state.map.mouseMode === MAP_MOUSE_MODES.AREA_SELECT
            ? 'cursor: crosshair; pointer-events: none'
            : '');
        });
      if (defCount === 0) { return; }
      svg.prepend(defs);
    }, 0);
  });

  if (!canRender) { return null; }

  /**
     Render - Zoom to Observatory Button
  */
  const renderShowFullObservatoryButton = () => (
    <Tooltip placement="right" title="Show the full NEON Observatory">
      <div className={`${classes.mapNavButtonContainer} ${classes.observatoryButton}`}>
        <IconButton
          type="button"
          className={classes.mapNavButton}
          onClick={() => {
            if (mapRefExists()) {
              // mapRef.current.invalidateSize();
              const nextZoom = deriveFullObservatoryZoomLevel(mapRef);
              mapRef.current.setView(OBSERVATORY_CENTER, nextZoom);
            }
          }}
          size="large"
        >
          <ObservatoryIcon fontSize="small" />
        </IconButton>
      </div>
    </Tooltip>
  );

  /**
     Render - Zoom to Observatory Button
  */
  const renderReturnToFocusLocationButton = () => (
    !state.focusLocation.current ? null : (
      <Tooltip
        placement="right"
        title={`Return to previous focus location: ${state.focusLocation.current}`}
      >
        <div className={`${classes.mapNavButtonContainer} ${classes.focusLocationButton}`}>
          <IconButton
            type="button"
            className={classes.mapNavButton}
            onClick={() => { dispatch({ type: 'returnToFocusLocation' }); }}
            disabled={mapIsAtFocusLocation(state)}
            size="large"
          >
            <FocusLocationIcon fontSize="small" />
          </IconButton>
        </div>
      </Tooltip>
    )
  );

  /**
     Render - Mouse Mode Buttoms (Pan / Select)
   */
  const renderMouseModeToggleButtonGroup = () => {
    if (!state.selection.active) { return null; }
    const units = FEATURE_TYPES[state.selection.active].units || '';
    const mouseModeTooltips = {
      [MAP_MOUSE_MODES.PAN]: 'Click and drag on map to move the map center; shift+drag to zoom to an area',
      [MAP_MOUSE_MODES.AREA_SELECT]: `Click and drag on map to select ${units} in an area; shift+drag to add onto selection`,
    };
    const mouseModeIcons = {
      [MAP_MOUSE_MODES.PAN]: MapPanIcon,
      [MAP_MOUSE_MODES.AREA_SELECT]: MapAreaSelectIcon,
    };
    return (
      <ToggleButtonGroup
        exclusive
        color="primary"
        variant="outlined"
        value={state.map.mouseMode}
        onChange={(event, newMouseMode) => {
          dispatch({ type: 'setMapMouseMode', mouseMode: newMouseMode });
        }}
        className={classes.mouseModeToggleButtonGroup}
      >
        {Object.keys(MAP_MOUSE_MODES).map((key) => {
          const Icon = mouseModeIcons[key];
          return (
            <Tooltip
              key={key}
              title={mouseModeTooltips[key]}
              enterDelay={500}
              enterNextDelay={200}
              placement="bottom-start"
            >
              <ToggleButton
                value={key}
                selected={state.map.mouseMode === key}
                data-selenium={`sitemap-mouseMode-${key}`}
                area-label={mouseModeTooltips[key]}
              >
                <Icon />
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>
    );
  };

  /**
     Render: Base Layer
     NOTE: Leaflet has breaking display issues when a tile layer is "reused". We use the unique map
     instance id here with the data-id attribute to attempt to force no tile layer reuse between
     instances of SiteMap components.
  */
  const renderBaseLayer = () => {
    const id = `tile-layer-${mapInstanceId}`;
    if (!state.map.baseLayer) { return <TileLayer url="" attribution="" data-id={id} />; }
    const baseLayer = BASE_LAYERS[state.map.baseLayer];
    const attributionNode = (
      <div title={baseLayer.fullAttribution} className={classes.attribution}>
        {baseLayer.shortAttribution}
      </div>
    );
    const attributionString = ReactDOMServer.renderToStaticMarkup(attributionNode);
    return (
      <TileLayer url={baseLayer.url} attribution={attributionString} data-id={id} />
    );
  };

  /**
     Render: Overlay
  */
  const renderOverlay = (key) => {
    const overlay = OVERLAYS[key];
    const group = OVERLAY_GROUPS[overlay.group] || {};
    const commonProps = {
      ...(group.commonProps || {}),
      ...(overlay.commonProps || {}),
    };
    return (
      <LayerGroup key={key}>
        {overlay.components.map((node) => {
          let Component = null;
          if (node.type === 'WMSTileLayer') { Component = WMSTileLayer; }
          if (!Component) { return null; }
          return (
            <Component key={node.key} {...{ ...commonProps, ...node.props }} />
          );
        })}
      </LayerGroup>
    );
  };

  /**
     Render: AreaSelection
  */
  const renderAreaSelection = () => {
    const { isDragging, center, reach } = areaSelection;
    if (
      !isDragging
        || !Number.isInteger(center.x) || !Number.isInteger(center.y)
        || !Number.isInteger(reach.x) || !Number.isInteger(reach.y)
    ) { return null; }
    const style = {
      width: Math.abs(reach.x - center.x),
      height: Math.abs(reach.y - center.y),
      left: Math.min(center.x, reach.x),
      top: Math.min(center.y, reach.y),
    };
    return <div className={classes.areaSelection} style={style} />;
  };

  const handleOverlayChange = (overlays) => {
    dispatch({
      type: 'setMapOverlays',
      overlays: overlays.filter((o) => o.checked).map((o) => o.name),
    });
  };

  const renderGroupedLayerControl = () => {
    const groupedLayerControlBaseLayers = Object.keys(BASE_LAYERS).map((key) => ({
      name: key,
      title: BASE_LAYERS[key].title,
    })).concat([{
      name: 'none',
      title: <span style={{ color: Theme.palette.grey[300], fontStyle: 'italic' }}>none</span>,
    }]);
    const groupedLayerControlOverlays = Object.keys(OVERLAYS).map((key) => {
      const { KEY: name, title, group } = OVERLAYS[key];
      const checked = state.map.overlays.has(key);
      let groupTitle = null;
      if (group && OVERLAY_GROUPS[group]) { groupTitle = OVERLAY_GROUPS[group].title; }
      return {
        name,
        title,
        groupTitle,
        checked,
      };
    });
    const checkedBaseLayer = (state.map.baseLayer === null)
      ? 'none'
      : state.map.baseLayer;
    return (
      <LeafletGroupedLayerControl
        position="topleft"
        baseLayers={groupedLayerControlBaseLayers}
        checkedBaseLayer={checkedBaseLayer}
        overlays={groupedLayerControlOverlays}
        onBaseLayerChange={(key) => handleBaseLayerChange(dispatch, key)}
        onOverlayChange={handleOverlayChange}
      />
    );
  };

  /**
     Render: Loading / Progress
  */
  const renderProgress = () => {
    if (state.overallFetch.expected === state.overallFetch.completed) { return null; }
    const style = state.selection.active ? { left: '48px', top: '48px' } : null;
    if (state.overallFetch.pendingHierarchy !== 0) {
      return (
        <Box className={classes.progress} style={style}>
          <CircularProgress size={32} />
        </Box>
      );
    }
    const progress = state.overallFetch.expected === 0 ? 0
      : Math.floor((state.overallFetch.completed / state.overallFetch.expected) * 10) * 10;
    const progressProps = progress < 60 ? {
      size: 32,
    } : {
      size: 32,
      variant: 'determinate',
      value: progress,
    };
    return (
      <Box className={classes.progress} style={style}>
        <CircularProgress {...progressProps} />
        <Box
          top={0}
          left={0}
          bottom={8}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  /**
     Render: Map
  */
  const mouseModeCursors = {
    [MAP_MOUSE_MODES.PAN]: 'grab',
    [MAP_MOUSE_MODES.AREA_SELECT]: 'crosshair',
  };
  const mouseModeProps = state.map.mouseMode === MAP_MOUSE_MODES.PAN ? {
    boxZoom: true, dragging: true,
  } : {
    boxZoom: false, dragging: false, touchZoom: false,
  };
  let className = classes.map;
  if (state.fullscreen) { className = `${className} ${classes.mapFullscreen}`; }
  if (areaSelection.isDragging) { className = `${className} ${classes.mapNoMarkerPointerEvents}`; }
  return (
    <>
      <MapContainer
        id={`sitemap-${mapInstanceId}`}
        ref={mapRef}
        className={className}
        style={{
          paddingBottom: `${(state.aspectRatio.currentValue || 0.75) * 100}%`,
          cursor: mouseModeCursors[state.map.mouseMode],
        }}
        center={state.map.center}
        zoom={state.map.zoom}
        minZoom={MAP_ZOOM_RANGE[0]}
        maxZoom={MAP_ZOOM_RANGE[1]}
        whenReady={invalidateSize}
        worldCopyJump
        data-component="SiteMap"
        data-selenium="sitemap-content-map"
        tap={false}
        {...mouseModeProps}
      >
        <LeafletMapManager />
        <ScaleControl imperial metric updateWhenIdle />
        {renderBaseLayer()}
        {Array.from(state.map.overlays).map(renderOverlay)}
        {renderGroupedLayerControl()}
        {Object.keys(FEATURES)
          .filter((key) => state.filters.features.available[key])
          .filter((key) => state.filters.features.visible[key])
          .map((key) => <SiteMapFeature key={key} featureKey={key} />)}
      </MapContainer>
      {renderAreaSelection()}
      {renderShowFullObservatoryButton()}
      {renderReturnToFocusLocationButton()}
      {renderMouseModeToggleButtonGroup()}
      {renderProgress()}
    </>
  );
};

export default SiteMapLeaflet;
