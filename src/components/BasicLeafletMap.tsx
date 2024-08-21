import React, {
  useEffect,
  useContext,
  createContext,
  useReducer,
  useId,
  Dispatch,
} from 'react';

import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { css, useTheme } from '@mui/material/styles';

import ObservatoryIcon from '@mui/icons-material/Public';

import type { SerializedStyles } from '@emotion/react';

import MarkerIcon2xPng from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIconPng from 'leaflet/dist/images/marker-icon.png';
import MarkerIconShadowPng from 'leaflet/dist/images/marker-shadow.png';

import { NeonTheme } from '@/components/Theme/types';
import { AnyAction, Nullable, Undef } from '@/types/core';

import 'leaflet/dist/leaflet.css';

const LEAFLET_ATTR_PREFIX = `
<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>
`;

const useStyles: (theme: NeonTheme) => Record<string, SerializedStyles> = (
  theme: NeonTheme,
): Record<string, SerializedStyles> => ({
  mapContainer: css({
    width: '100%',
    height: '600px',
  }),
  mapNavButton: css({
    backgroundColor: '#fff !important',
    width: '32px',
    height: '32px',
    padding: 'unset',
    borderRadius: '2px 0px 2px 0px',
    border: `1px solid ${theme.colors.LIGHT_BLUE[500]}`,
    '&:hover, &:active': {
      color: theme.colors.LIGHT_BLUE[400],
      borderColor: theme.colors.LIGHT_BLUE[400],
      backgroundColor: theme.palette.grey[50],
    },
    '& svg': {
      fontSize: '1.15rem !important',
      width: '1.2em',
      height: '1.2em',
    },
  }),
  mapNavButtonContainer: css({
    position: 'absolute',
    zIndex: 999,
    margin: '0px',
    left: '11px',
  }),
  observatoryButton: css({
    top: '82px',
  }),
});

interface BasicLeafletMapState {
  initialZoom: number;
  initialCenter: L.LatLngExpression;
  zoom: Nullable<number>;
  center: Nullable<L.LatLngExpression>;
}

const DEFAULT_STATE: BasicLeafletMapState = {
  initialZoom: 3,
  initialCenter: [52.68, -110.75],
  zoom: null,
  center: null,
};
const StateContext = createContext<BasicLeafletMapState>(DEFAULT_STATE);
const DispatchContext = createContext<Undef<Dispatch<AnyAction>>>(undefined);

const useContextDispatch = (): Dispatch<AnyAction> => {
  const dispatchContext = useContext(DispatchContext);
  if (!dispatchContext) {
    throw new Error('Failed to initialize dispatch context');
  }
  return dispatchContext;
};

enum ActionTypes {
  SET_VIEW = 'SET_VIEW',
  SET_ZOOM = 'SET_ZOOM',
  SET_CENTER = 'SET_CENTER',
}

interface SetViewAction extends AnyAction {
  type: typeof ActionTypes.SET_VIEW;
  zoom: number;
  center: L.LatLngExpression;
}
interface SetZoomAction extends AnyAction {
  type: typeof ActionTypes.SET_ZOOM;
  zoom: number;
}
interface SetCenterAction extends AnyAction {
  type: typeof ActionTypes.SET_CENTER;
  center: L.LatLngExpression;
}

type BasicLeafletMapActionTypes = (
  SetViewAction
  | SetZoomAction
  | SetCenterAction
  | AnyAction
);

const ActionCreator = {
  setView: (zoom: number, center: L.LatLngExpression): SetViewAction => ({
    type: ActionTypes.SET_VIEW,
    zoom,
    center,
  }),
  setZoom: (zoom: number): SetZoomAction => ({
    type: ActionTypes.SET_ZOOM,
    zoom,
  }),
  setCenter: (center: L.LatLngExpression): SetCenterAction => ({
    type: ActionTypes.SET_CENTER,
    center,
  }),
};

const reducer = (
  state: BasicLeafletMapState,
  action: BasicLeafletMapActionTypes,
): BasicLeafletMapState => {
  const newState: BasicLeafletMapState = { ...state };
  switch (action.type) {
    case ActionTypes.SET_VIEW:
      newState.zoom = (action as SetViewAction).zoom;
      newState.center = (action as SetViewAction).center;
      break;
    case ActionTypes.SET_ZOOM:
      newState.zoom = (action as SetZoomAction).zoom;
      break;
    case ActionTypes.SET_CENTER:
      newState.center = (action as SetCenterAction).center;
      break;
    default:
      break;
  }
  return newState;
};

interface ProviderProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode | React.ReactNode[];
}
const providerDefaultProps: ProviderProps = {
  children: undefined,
};

export const Provider: React.FC<ProviderProps> = (
  props: ProviderProps = providerDefaultProps,
): React.JSX.Element => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const LeafletMapManager: React.FC = (): React.JSX.Element => {
  const dispatch: Dispatch<AnyAction> = useContextDispatch();
  const theme: NeonTheme = useTheme();
  const classes: Record<string, SerializedStyles> = useStyles(theme);
  const map: L.Map = useMapEvents({
    zoomend: (event: L.LeafletEvent): void => {
      const targetZoom: number = event.target.getZoom();
      const targetCenter: L.LatLngLiteral = event.target.getCenter();
      const appliedCenter: L.LatLngExpression = [targetCenter.lat, targetCenter.lng];
      dispatch(ActionCreator.setView(targetZoom, appliedCenter));
    },
    moveend: (event: L.LeafletEvent): void => {
      const targetCenter: L.LatLngLiteral = event.target.getCenter();
      const appliedCenter: L.LatLngExpression = [targetCenter.lat, targetCenter.lng];
      dispatch(ActionCreator.setCenter(appliedCenter));
    },
  });
  useEffect(() => {
    map.attributionControl.setPrefix(LEAFLET_ATTR_PREFIX);
  }, [map]);
  return (
    <Tooltip placement="right" title="Reset Map">
      <div css={[classes.mapNavButtonContainer, classes.observatoryButton]}>
        <IconButton
          css={classes.mapNavButton}
          type="button"
          size="large"
          onClick={() => {
            map.setView(DEFAULT_STATE.initialCenter, DEFAULT_STATE.initialZoom);
          }}
        >
          <ObservatoryIcon fontSize="small" />
        </IconButton>
      </div>
    </Tooltip>
  );
};

const BasicLeafletMap: React.FC = (): React.JSX.Element => {
  const state: BasicLeafletMapState = useContext(StateContext);
  const mapInstanceId = useId();
  const theme: NeonTheme = useTheme();
  const classes: Record<string, SerializedStyles> = useStyles(theme);
  const {
    initialZoom,
    initialCenter,
  } = state;
  return (
    <div css={classes.mapContainer}>
      <MapContainer
        id={`sitemap-${mapInstanceId}`}
        center={initialCenter}
        zoom={initialZoom}
        minZoom={1}
        maxZoom={19}
        style={{
          width: '100%',
          height: '600px',
        }}
        worldCopyJump
        dragging
        tap={false}
        boxZoom={false}
        data-component="SiteMap"
        data-selenium="sitemap-content-map"
      >
        <LeafletMapManager />
        <TileLayer
          data-id={`tile-layer-${mapInstanceId}`}
          attribution="© Natl. Geographic et al."
          url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker
          position={[40.015, -105.271]}
          icon={new L.Icon({
            ...L.Icon.Default.prototype.options,
            iconRetinaUrl: MarkerIcon2xPng.src,
            iconUrl: MarkerIconPng.src,
            shadowUrl: MarkerIconShadowPng.src,
          })}
        >
          <Popup>
            Marker
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BasicLeafletMap;
