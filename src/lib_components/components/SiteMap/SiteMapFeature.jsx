/* eslint-disable no-underscore-dangle, jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import HelpIcon from '@material-ui/icons/HelpOutline';
import ClickIcon from '@material-ui/icons/TouchApp';
import ElevationIcon from '@material-ui/icons/Terrain';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';
import LocationIcon from '@material-ui/icons/MyLocation';
import MarkerIcon from '@material-ui/icons/Place';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';
import UnselectableIcon from '@material-ui/icons/NotInterested';

import SelectedIcon from '@material-ui/icons/DoneOutline';
import UnselectedIcon from '@material-ui/icons/Remove';

import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug,
} from '@fortawesome/free-solid-svg-icons';

import {
  CircleMarker,
  Map,
  FeatureGroup,
  Marker,
  Polygon,
  Polyline,
  Popup,
} from 'react-leaflet';

import SiteMapContext from './SiteMapContext';
import {
  getHref,
  isCoord,
  calculateLocationsInBounds,
  FEATURES,
  FEATURE_TYPES,
  NLCD_CLASSES,
  KM2_TO_ACRES,
  MAP_MOUSE_MODES,
  MANUAL_LOCATION_TYPES,
  HIGHLIGHT_STATUS,
  SELECTION_STATUS,
  SELECTION_PORTIONS,
  PLOT_SAMPLING_MODULES,
  UNSELECTABLE_MARKER_FILTER,
} from './SiteMapUtils';

import Theme, { COLORS } from '../Theme/Theme';
import { exists } from '../../util/typeUtil';

const useStyles = makeStyles((theme) => ({
  selectionSnackbar: {
    width: '100%',
    color: '#000',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    boxShadow: 'none',
  },
  unselectableSnackbar: {
    backgroundColor: COLORS.GREY[100],
    border: `1px solid ${COLORS.GREY[600]}80`,
  },
  addToSelectionSnackbar: {
    backgroundColor: COLORS.GREEN[100],
    border: `1px solid ${COLORS.GREEN[600]}80`,
  },
  removeFromSelectionSnackbar: {
    backgroundColor: COLORS.BROWN[100],
    border: `1px solid ${COLORS.BROWN[600]}80`,
  },
  selectedSelectionSnackbar: {
    backgroundColor: COLORS.LIGHT_BLUE[100],
    border: `1px solid ${theme.palette.primary.main}80`,
  },
  snackbarIcon: {
    marginRight: theme.spacing(2),
  },
  unselectableSnackbarIcon: {
    color: COLORS.GREY[300],
  },
  addToSelectionSnackbarIcon: {
    color: COLORS.GREEN[500],
  },
  removeFromSelectionSnackbarIcon: {
    color: COLORS.BROWN[500],
  },
  selectedSelectionSnackbarIcon: {
    color: theme.palette.primary.main,
  },
  popup: {
    minWidth: '320px',
    '& a': {
      color: theme.palette.primary.main,
    },
    '& p': {
      margin: 'unset',
    },
    '& div.leaflet-popup-content-wrapper': {
      borderRadius: '2px !important',
    },
    '& a.leaflet-popup-close-button': {
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },
  },
  popupButtonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  popupButton: {
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    '& span': {
      pointerEvents: 'none',
    },
  },
  popupSiteIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
    filter: 'drop-shadow(0px 0px 1.5px #000000bb)',
  },
  popupSiteSelectedIcon: {
    marginRight: theme.spacing(1),
  },
  popupSiteContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  popupFeatureIcon: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    marginRight: theme.spacing(1.5),
    filter: 'drop-shadow(0px 0px 1.5px #000000bb)',
  },
  popupFeaturePolygon: {
    marginRight: theme.spacing(1.5),
  },
  popupTitleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerFlex: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endFlex: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  markerIcon: {
    marginRight: '2px',
    marginBottom: '-3px',
    fontSize: '0.95rem',
  },
  unselectable: {
    filter: 'saturate(0.3) brightness(2)',
  },
  nlcdClass: {
    width: '36px',
    height: '12px',
    border: '1px solid black',
    marginLeft: theme.spacing(1.5),
    marginBottom: '-2px',
    display: 'inline-block',
  },
}));

const checkValidPositions = (positions, checkAllCoords = false) => {
  if (!Array.isArray(positions) || (positions.length === 0)) { return false; }
  if (!checkAllCoords) { return true; }
  // Identify case where we have a coordinate, and therefore cannot
  // have something in the positions array that is not an array
  const hasMultiplePositions = Array.isArray(positions[0]);
  if (hasMultiplePositions) {
    return positions.every((p) => {
      if (!Array.isArray(p)) { return false; }
      return checkValidPositions(p, true);
    });
  }
  // Identified a non array element, ensure it is a valid coordinate
  return isCoord(positions);
};

const SiteMapFeature = (props) => {
  const classes = useStyles(Theme);
  const { mapRef, featureKey } = props;

  const feature = FEATURES[featureKey] || {};

  const [state, dispatch] = SiteMapContext.useSiteMapContext();

  const {
    name,
    nameSingular,
    type: featureType,
    description,
    style: featureStyle,
    featureShape,
    iconSvg,
    primaryIdOnly = false,
    amplifyHighlighted = false,
    parentDataFeatureKey,
  } = feature;
  const featureName = nameSingular || name || featureKey;

  if (!FEATURES[featureKey] || !mapRef.current) { return null; }

  let featureDescription = description;
  let parentFeature = null;
  if (parentDataFeatureKey && FEATURES[parentDataFeatureKey]) {
    parentFeature = FEATURES[parentDataFeatureKey];
    if (description === 'PARENT') { featureDescription = parentFeature.description; }
  }

  // Groups don't render anything ever!
  if (featureType === FEATURE_TYPES.GROUP.KEY) { return null; }

  /**
     Extract feature data from SiteMapContext state
  */
  const {
    neonContextHydrated,
    manualLocationData,
    map: { bounds: mapBounds },
    focusLocation: { current: focusLocation },
    featureData: {
      [parentFeature ? parentFeature.type : featureType]: {
        [parentFeature ? parentFeature.KEY : featureKey]: featureData,
      },
    },
  } = state;
  if (!neonContextHydrated || !featureData || !Object.keys(featureData)) { return null; }

  // Whether this feature can affect selection of items in the map
  const {
    active: selectableFeatureType,
    set: selectedItems,
    validSet: validItems,
    limit: selectionLimit,
    hideUnselectable,
  } = state.selection;
  const selectionActive = !!state.selection.active;
  const selectionType = selectionActive ? state.selection.active : null;
  const selectingCurrentFeatureType = selectionType === featureType;

  // Whether interaction on this type means selection of another type (e.g. clicking a state or
  // domain to affect selection of sites in those regions; distinct from selection states or domains
  // directly).
  let selectingActiveTypeByProxy = false;
  if (selectionActive && !selectingCurrentFeatureType) {
    switch (selectionType) {
      case FEATURE_TYPES.SITES.KEY:
        if ([FEATURES.DOMAINS.KEY, FEATURES.STATES.KEY].includes(featureKey)) {
          selectingActiveTypeByProxy = true;
        }
        break;
      default:
        break;
    }
  }

  // Jump-To function to afford map navigation where appropriate
  const jumpTo = (locationCode = '') => {
    dispatch({ type: 'setNewFocusLocation', location: locationCode });
  };

  /**
     Util: Position Popup
     Leaflet's AutoPan for popups does a "transition" of map center to ensure a new popup renders
     in view. This poses a problem when the center is in the main context state - every micro-step
     of the AutoPan transition is a state update. The transition appears to run recursively as it
     causes a max update depth crash. We get around this by solving the same root problem (want
     popups to render in view) in a different way... specifically by positioning them around their
     parent element dynamcally based on which direction has the most room to render.
  */
  const positionPopup = (target = null, latlng = null, hideCloseButton = false) => {
    if (!target || !latlng || !mapRef.current || !mapRef.current.leafletElement) { return; }
    const { _popup: popup, _icon: icon } = target;
    popup.setLatLng(latlng);
    const containerPoint = mapRef.current.leafletElement.latLngToContainerPoint(latlng);
    const iconHeight = icon ? icon.height : 0;
    const {
      _container: containerNode,
      _containerLeft: containerLeft,
      _containerBottom: containerBottom,
      _tipContainer: tipNode,
    } = popup;
    containerNode.style.marginBottom = '0px';
    // Leaflet popups always open above; open below if mouse event is in the top half of the map
    if (containerPoint.y < (mapRef.current.container.clientHeight / 2)) {
      const contentHeight = containerNode.clientHeight;
      const tipHeight = tipNode.clientHeight;
      const contentBottom = 0 - iconHeight - contentHeight - tipHeight - (1.5 * containerBottom);
      const tipBottom = contentHeight + tipHeight - 1;
      containerNode.style.bottom = `${contentBottom}px`;
      tipNode.style.transform = `rotate(0.5turn) translate(0px, ${tipBottom}px)`;
    } else {
      containerNode.style.bottom = `${-1.5 * containerBottom}px`;
      popup._tipContainer.style.transform = 'translate(0px, -1px)';
    }
    // For left/right we move the popup horizontally as needed while keeping the tip stationary
    const contentWidth = containerNode.clientWidth;
    const mapWidth = mapRef.current.container.parentNode.clientWidth || 0;
    const nudgeBuffer = 40;
    const nudgeLimit = (contentWidth / 2) - (nudgeBuffer / 2);
    let overlap = 0;
    if (mapWidth > (contentWidth + (nudgeBuffer * 3))) {
      let nudge = 0;
      if (containerPoint.x - (contentWidth / 2) < 0) {
        overlap = containerPoint.x - (contentWidth / 2);
        nudge = Math.min((0 - overlap) + nudgeBuffer, nudgeLimit);
      } else if (containerPoint.x + (contentWidth / 2) > mapWidth) {
        overlap = mapWidth - containerPoint.x - (contentWidth / 2);
        nudge = Math.min(overlap - nudgeBuffer, nudgeLimit);
      }
      if (nudge !== 0) {
        containerNode.style.left = `${containerLeft + nudge}px`;
      }
      tipNode.style.left = `${(0 - containerLeft) - nudge}px`;
    }
    if (hideCloseButton) {
      popup._closeButton.style.display = 'none';
    }
  };

  const markerIcon = <MarkerIcon className={classes.markerIcon} />;

  /**
     Render: Popup Title with Feature Icon
  */
  const renderPopupTitle = (title, withFeatureName = true) => {
    const renderedTitle = withFeatureName ? (
      <span>
        {featureName}
        <br />
        {title}
      </span>
    ) : title;
    let icon = null;
    if (iconSvg) {
      icon = <img alt={feature.name} src={feature.iconSvg} className={classes.popupFeatureIcon} />;
    } else if (featureShape === 'Circle') {
      const circleProps = {
        cx: 12,
        cy: 12,
        r: 8,
        style: {
          fill: featureStyle.color ? `${featureStyle.color}88` : 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3,
        },
      };
      icon = (
        <svg width="24" height="24" className={classes.popupFeaturePolygon}>
          <circle {...circleProps} />
        </svg>
      );
    } else if (featureStyle && ![FEATURES.DOMAINS.KEY, FEATURES.STATES.KEY].includes(featureKey)) {
      // We don't show the rect for states and domains since those cover the whole map when showing.
      const rectProps = {
        width: 33,
        height: 23,
        x: 1.5,
        y: 6.5,
        rx: 3,
        style: {
          fill: feature.style.color || null,
          stroke: feature.style.color || null,
          strokeWidth: 2.5,
          fillOpacity: 0.2,
          strokeOpacity: 0.85,
          strokeLinecap: 'round',
          strokeDasharray: feature.style.dashArray || null,
        },
      };
      icon = (
        <svg width="36" height="36" className={classes.popupFeaturePolygon}>
          <rect {...rectProps} />
        </svg>
      );
    }
    return (
      <div className={classes.popupTitleContainer} data-selenium="sitemap-map-popup-title">
        {icon}
        <Typography variant="h6" style={{ lineHeight: '1.4rem' }}>
          {renderedTitle}
        </Typography>
      </div>
    );
  };

  /**
     Render: a numerical value with units and optional label
  */
  const renderNumericalValue = (value, label = null, unit = '', precision = 0, aria = null, right = false, parens = false) => { // eslint-disable-line max-len
    let numberString = Number.isFinite(value) ? `${value.toFixed(precision)}${unit}` : '--';
    if (parens) { numberString = `(${numberString})`; }
    const visibleValue = (
      <Typography variant="caption" aria-label={aria || label} style={{ fontFamily: 'monospace' }}>
        {numberString}
      </Typography>
    );
    return !label ? visibleValue : (
      <div className={classes[right ? 'endFlex' : 'startFlex']}>
        <Typography variant="caption" style={{ marginRight: Theme.spacing(1) }}>
          {label}
        </Typography>
        {visibleValue}
      </div>
    );
  };

  /**
     Render: Site with Icon
     Optionally ghost (fade) icon if selection is active but it's not selectable. If true and the
     site is not selectable this will also skip rendering altogether when hideUnselectable is true.
  */
  const renderSite = (siteCode, ghostUnselectable = false) => {
    const site = state.sites[siteCode];
    if (!site) { return null; }
    const siteFeatureKey = `${site.terrain}_${site.type}_SITES`;
    if (!FEATURES[siteFeatureKey]) { return null; }
    const isSelected = selectedItems.has(siteCode);
    const siteIcon = FEATURES[siteFeatureKey][isSelected ? 'iconSelectedSvg' : 'iconSvg'];
    let selectedIcon = null;
    const markerStyle = {};
    if (selectionActive && selectionType === FEATURE_TYPES.SITES.KEY) {
      if (validItems && !validItems.has(siteCode)) {
        // eslint-disable-next-line max-len
        selectedIcon = (
          <UnselectableIcon
            color="disabled"
            style={{ padding: '4px' }}
            className={classes.popupSiteSelectedIcon}
          />
        );
        if (ghostUnselectable) {
          if (hideUnselectable) { return null; }
          markerStyle.filter = UNSELECTABLE_MARKER_FILTER;
        }
      } else {
        selectedIcon = isSelected
          ? <SelectedIcon className={classes.popupSiteSelectedIcon} color="primary" />
          : <UnselectedIcon className={classes.popupSiteSelectedIcon} color="disabled" />;
      }
    }
    const internal = (
      <>
        {selectedIcon}
        <img src={siteIcon} alt={siteCode} className={classes.popupSiteIcon} style={markerStyle} />
        <Typography variant="caption" style={{ textAlign: 'left' }}>
          {`${site.description} (${site.siteCode})`}
        </Typography>
      </>
    );
    const containerProps = {
      key: siteCode,
      className: classes.popupSiteContainer,
      style: { marginTop: Theme.spacing(0.5) },
    };
    return selectionActive ? (
      <div {...containerProps}>{internal}</div>
    ) : (
      <Link
        variant="caption"
        component="button"
        onClick={() => jumpTo(site.siteCode)}
        data-selenium="sitemap-map-popup-siteLink"
        {...containerProps}
      >
        {internal}
      </Link>
    );
  };

  /**
     Render: Latitude / Longitude with Copy to Clipboard
  */
  const renderLatLon = (latitude, longitude, right = false, renderSubtitle = false) => {
    const iconButtonProps = {
      size: 'small',
      style: { marginRight: Theme.spacing(0.5) },
    };
    const coords = Number.isFinite(latitude) && Number.isFinite(longitude) ? (
      <div
        className={classes[right ? 'endFlex' : 'startFlex']}
        data-selenium="sitemap-map-popup-coordinates"
      >
        <CopyToClipboard text={`${latitude.toFixed(5)} ${longitude.toFixed(5)}`}>
          {selectionActive ? (
            <IconButton
              {...iconButtonProps}
              aria-label="Latitude / Longitude"
              disabled={selectionActive}
            >
              <LocationIcon />
            </IconButton>
          ) : (
            <Tooltip title="Latitude / Longitude (click to copy)">
              <IconButton
                {...iconButtonProps}
                aria-label="Latitude / Longitude (click to copy)"
                disabled={selectionActive}
              >
                <LocationIcon />
              </IconButton>
            </Tooltip>
          )}
        </CopyToClipboard>
        <Typography
          variant="caption"
          aria-label="Latitude / Longitude"
          style={{ fontFamily: 'monospace', textAlign: 'right' }}
        >
          {latitude.toFixed(5)}
          <br />
          {longitude.toFixed(5)}
        </Typography>
      </div>
    ) : (
      <div>
        <Typography variant="subtitle2">Lat./Lon.</Typography>
        <Typography
          variant="caption"
          aria-label="Latitude / Longitude"
          style={{ fontFamily: 'monospace', textAlign: 'right' }}
        >
          --
        </Typography>
      </div>
    );
    return !renderSubtitle ? coords : (
      <div style={{ textAlign: right ? 'right' : 'left' }}>
        <Typography variant="subtitle2">Coordinates</Typography>
        {coords}
      </div>
    );
  };

  /**
     Render: Elevation
  */
  const renderElevation = (loc = {}, right = false) => {
    const { elevation, minimumElevation, maximumElevation } = loc;
    const hasMinMax = Number.isFinite(minimumElevation) || Number.isFinite(maximumElevation);
    return (
      <div
        style={{ textAlign: right ? 'right' : 'left' }}
        data-selenium="sitemap-map-popup-elevation"
      >
        <Typography variant="subtitle2">Elevation</Typography>
        {hasMinMax ? (
          <div>
            {renderNumericalValue(elevation, 'Average', 'm', 2, 'Average Elevation', right)}
            {renderNumericalValue(minimumElevation, 'Minimum', 'm', 2, 'Minimum Elevation', right)}
            {renderNumericalValue(maximumElevation, 'Maximum', 'm', 2, 'Maximum Elevation', right)}
          </div>
        ) : (
          <div className={classes[right ? 'endFlex' : 'startFlex']}>
            <ElevationIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
            {renderNumericalValue(elevation, null, 'm', 2, 'Elevation')}
          </div>
        )}
      </div>
    );
  };

  /**
     Render: Plot Size
  */
  const renderPlotSize = (loc = {}) => (
    <div data-selenium="sitemap-map-popup-plotSize">
      <Typography variant="subtitle2">Plot Size</Typography>
      <Typography variant="caption">
        {loc.plotDimensions}
        {!Number.isFinite(loc.plotSize) ? null : (
          <>
            <br />
            {`(${loc.plotSize.toFixed(0)}m\u00b2)`}
          </>
        )}
      </Typography>
    </div>
  );

  /**
     Render: Plot Slope
  */
  const renderPlotSlope = (loc = {}, right = false) => (
    <div
      style={{ textAlign: right ? 'right' : 'left' }}
      data-selenium="sitemap-map-popup-plotSlope"
    >
      <Typography variant="subtitle2">Plot Slope</Typography>
      {renderNumericalValue(loc.slopeAspect, 'Aspect', '\u00b0', 2, 'Slope Aspect', right)}
      {renderNumericalValue(loc.slopeGradient, 'Gradient', '%', 2, 'Slope Gradient', right)}
    </div>
  );

  /**
     Render: Plot Sampling Modules
  */
  const renderPlotSamplingModules = (loc = {}) => {
    const count = loc.samplingModules.length ? ` (${loc.samplingModules.length})` : '';
    return (
      <Grid
        item
        xs={12}
        key="plotSamplingModules"
        data-selenium="sitemap-map-popup-samplingModules"
      >
        <Typography variant="subtitle2">
          {`Potential Sampling Modules${count}`}
        </Typography>
        <Typography variant="caption">
          {!loc.samplingModules.length ? (
            <i>none</i>
          ) : (
            loc.samplingModules.map((m) => PLOT_SAMPLING_MODULES[m]).join(', ')
          )}
        </Typography>
      </Grid>
    );
  };

  /**
     Render: Popup Row; Boundary Area
  */
  const renderBoundaryArea = (bound = {}) => {
    const { areaKm2 } = bound.properties || {};
    const areaAcres = Number.isFinite(areaKm2) ? KM2_TO_ACRES * areaKm2 : null;
    return (
      <Grid item xs={12} data-selenium="sitemap-map-popup-area">
        <Typography variant="subtitle2">Area</Typography>
        <div className={classes.startFlex}>
          {renderNumericalValue(areaKm2, null, 'km\u00b2', 2, 'Area (km\u00b2)')}
          {areaAcres === null ? null : (
            <div style={{ marginLeft: Theme.spacing(1) }}>
              {renderNumericalValue(areaAcres, null, ' acres', 2, 'Area (acres)', false, true)}
            </div>
          )}
        </div>
      </Grid>
    );
  };

  /**
     Render Method: Popup Row; Child NEON Sites (e.g. within a domain or state)
  */
  const renderChildSites = (boundaryKey) => {
    const { sites = new Set() } = featureData[boundaryKey];
    let selectable = null;
    if (selectionActive && selectionType === FEATURE_TYPES.SITES.KEY) {
      const selectableSites = new Set([...sites].filter((siteCode) => (
        !validItems || validItems.has(siteCode)
      )));
      if (!selectableSites.size) {
        selectable = ', none selectable';
      } else {
        selectable = selectableSites.size === sites.size
          ? ', all selectable'
          : ` total, ${selectableSites.size} selectable`;
      }
    }
    return (
      <Grid
        key="childSites"
        item
        xs={12}
        data-selenium="sitemap-map-popup-childSites"
        style={{ marginBottom: Theme.spacing(2) }}
      >
        {!sites.size ? (
          <>
            <Typography variant="subtitle2" gutterBottom>NEON Sites</Typography>
            <Typography variant="caption">
              <i>none</i>
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="subtitle2" gutterBottom>
              {`NEON Sites (${sites.size}${selectable || ''}):`}
            </Typography>
            <div>
              {[...sites].map((siteCode) => (
                renderSite(siteCode, selectionType === FEATURE_TYPES.SITES.KEY)
              ))}
            </div>
          </>
        )}
      </Grid>
    );
  };

  /**
     Render: Popup Row; Coordinates and Elevation
  */
  const renderCoordsAndElevation = (loc) => {
    const renderCoordsSubtitle = (
      Number.isFinite(loc.minimumElevation) || Number.isFinite(loc.maximumElevation)
    );
    return (
      <React.Fragment key="coordsAndElevation">
        <Grid item xs={6}>
          {renderElevation(loc)}
        </Grid>
        <Grid item xs={6}>
          {renderLatLon(loc.latitude, loc.longitude, true, renderCoordsSubtitle)}
        </Grid>
      </React.Fragment>
    );
  };

  /**
     Render: Popup Row; Plot Size and Slope
  */
  const renderPlotSizeAndSlope = (loc) => (
    <React.Fragment key="plotSizeAndSlope">
      <Grid item xs={6}>
        {renderPlotSize(loc)}
      </Grid>
      <Grid item xs={6}>
        {renderPlotSlope(loc, true)}
      </Grid>
    </React.Fragment>
  );

  /**
     Render: Popup Row; Tower Details
  */
  const renderTowerDetails = (loc) => (
    <Grid key="towerDetails" item xs={12} data-selenium="sitemap-map-popup-towerDetails">
      <Typography variant="subtitle2">Levels</Typography>
      <Typography variant="caption">{(loc.children || []).length}</Typography>
    </Grid>
  );

  /**
     Render: Popup Row; NLCD Classes (nationalLandCoverDatabase2001)
  */
  const renderNlcdClass = (loc) => {
    let nlcd = <i>n/a</i>;
    const titleStyle = {};
    if (loc.nlcdClass) {
      nlcd = loc.nlcdClass;
      if (NLCD_CLASSES[loc.nlcdClass]) {
        titleStyle.marginBottom = '-4px';
        const tooltip = `${NLCD_CLASSES[loc.nlcdClass].name} - ${NLCD_CLASSES[loc.nlcdClass].description}`;
        nlcd = (
          <>
            {NLCD_CLASSES[loc.nlcdClass].name}
            <div
              className={classes.nlcdClass}
              title={NLCD_CLASSES[loc.nlcdClass].name}
              style={{ backgroundColor: NLCD_CLASSES[loc.nlcdClass].color }}
            />
            <Tooltip title={tooltip}>
              <IconButton
                size="small"
                style={{ marginLeft: Theme.spacing(0.5), marginBottom: '1px' }}
                aria-label="NLCD Class Description"
              >
                <HelpIcon style={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </>
        );
      }
    }
    return (
      <Grid key="nlcdClass" item xs={12} data-selenium="sitemap-map-popup-nlcdClass">
        <Typography variant="subtitle2" style={titleStyle}>NLCD Class</Typography>
        <Typography variant="caption">{nlcd}</Typography>
      </Grid>
    );
  };

  /**
     Render: Popup Row; Location Site and Domain
  */
  const renderLocationSiteAndDomain = (siteCode) => {
    const site = state.sites[siteCode];
    if (!site || !state.featureData.DOMAINS.DOMAINS[site.domainCode]) { return null; }
    const { name: domainName } = state.featureData.DOMAINS.DOMAINS[site.domainCode];
    const domainTitle = `${site.domainCode} - ${domainName}`;
    return (
      <React.Fragment key="locationSiteAndDomain">
        <Grid item xs={7} data-selenium="sitemap-map-popup-site">
          <Typography variant="subtitle2">NEON Site</Typography>
          {renderSite(siteCode)}
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'right' }} data-selenium="sitemap-map-popup-domain">
          <Typography variant="subtitle2">Domain</Typography>
          <Tooltip title={`Jump to ${site.domainCode} on the map`}>
            <Link
              variant="caption"
              component="button"
              style={{ textAlign: 'right' }}
              onClick={() => jumpTo(site.domainCode)}
              data-selenium="sitemap-map-popup-domainLink"
            >
              {markerIcon}
              {domainTitle}
            </Link>
          </Tooltip>
        </Grid>
      </React.Fragment>
    );
  };

  const popupProps = {
    className: classes.popup,
    autoPan: false,
    id: 'sitemap-map-popup',
  };

  /**
     Render: Location popup
     Standard title with icon, row with coordinates and elevation, row with parent site and domain
     Optional additional rows will appear between coordinates/elevation and site/domain
  */
  const renderLocationPopup = (siteCode, location, additionalRows = []) => {
    const loc = (featureData[siteCode] || {})[location] || {};
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(location)}
        <Grid container spacing={1}>
          {renderCoordsAndElevation(loc)}
          {additionalRows.map((row) => (typeof row === 'function' ? row(loc) : row))}
          {loc.nlcdClass ? renderNlcdClass(loc) : null}
          {renderLocationSiteAndDomain(siteCode)}
        </Grid>
      </Popup>
    );
  };

  /**
     Render: Boundary popup
     Standard title with bound outline. Show area if present.
  */
  const renderBoundaryPopup = (key, title = null, additionalRows = []) => {
    const { properties = {} } = (featureData[key] || {});
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(title || key, !title)}
        <Grid container spacing={1}>
          {properties.areaKm2 ? renderBoundaryArea(featureData[key]) : null}
          {(
            Array.isArray(additionalRows)
              ? additionalRows.map((row) => (typeof row === 'function' ? row(key) : row))
              : null
          )}
          {renderLocationSiteAndDomain(key)}
        </Grid>
      </Popup>
    );
  };

  /**
     Render: Region Selection Action
  */
  const renderRegionSelectionAction = (boundaryFeatureKey, boundaryKey) => {
    if (
      !selectionActive || !state.selection.derived[boundaryFeatureKey] || selectionLimit === 1
    ) { return null; }
    const { sites: boundarySites = new Set() } = featureData[boundaryKey];
    if (!boundarySites.size) { return null; }
    const selectionPortion = state.selection.derived[boundaryFeatureKey][boundaryKey] || null;
    const selectableSites = !validItems
      ? boundarySites
      : new Set([...boundarySites].filter((siteCode) => validItems.has(siteCode)));
    const selectableCount = selectableSites.size;
    const ActionIcon = selectableCount ? ClickIcon : UnselectableIcon;
    const selectable = boundarySites.size === selectableCount ? '' : ' selectable';
    const thisOne = boundarySites.size === selectableCount ? 'this one' : 'the one';
    let action = selectableCount === 1
      ? `add ${thisOne}${selectable} site`
      : `add all ${selectableCount}${selectable} sites`;
    let preposition = 'to';
    /* eslint-disable max-len */
    let snackbarClass = classes[selectableCount ? 'addToSelectionSnackbar' : 'unselectableSnackbar'];
    let snackbarIconClass = classes[selectableCount ? 'addToSelectionSnackbarIcon' : 'unselectableSnackbarIcon'];
    /* eslint-enable max-len */
    let actionText = `No sites in this ${FEATURES[boundaryFeatureKey].nameSingular} are selectable`;
    if (selectableCount) {
      if (selectionPortion === SELECTION_PORTIONS.PARTIAL) {
        const intersection = new Set([...selectableSites].filter((x) => selectedItems.has(x)));
        const remaining = selectableCount - intersection.size;
        action = `add remaining ${remaining}${selectable} site${remaining === 1 ? '' : 's'}`;
      }
      if (selectionPortion === SELECTION_PORTIONS.TOTAL) {
        action = selectableCount === 1
          ? `remove ${thisOne}${selectable} site`
          : `remove all ${selectableCount}${selectable} sites`;
        preposition = 'from';
        snackbarClass = classes.removeFromSelectionSnackbar;
        snackbarIconClass = classes.removeFromSelectionSnackbarIcon;
      }
      actionText = (
        <>
          {/* eslint-disable react/jsx-one-expression-per-line */}
          Click to <b>{action}</b> {preposition} selection
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </>
      );
    }
    return (
      <div key={boundaryKey} className={classes.centerFlex} style={{ padding: Theme.spacing(0.5) }}>
        <SnackbarContent
          className={`${classes.selectionSnackbar} ${snackbarClass}`}
          message={(
            <div className={classes.startFlex}>
              <ActionIcon className={`${classes.snackbarIcon} ${snackbarIconClass}`} />
              <div>
                <Typography variant="body2">
                  {actionText}
                </Typography>
              </div>
            </div>
          )}
        />
      </div>
    );
  };

  /**
     Render: Item Selection Action Snackbar for a Popup
     (Only for selecting the item directly; selection by proxy action snackbars are different)
  */
  const renderItemSelectionActionSnackbar = (item) => {
    if (!selectionActive) { return null; }
    const unit = FEATURE_TYPES[selectionType].unit || 'item';
    const isSelectable = !validItems || validItems.has(item);
    const isSelected = selectedItems.has(item);
    const verb = isSelected ? 'remove' : 'add';
    const preposition = isSelected ? 'from' : 'to';
    let ActionIcon = UnselectableIcon;
    let action = `This ${unit} cannot be selected`;
    let snackbarClass = classes.unselectableSnackbar;
    let snackbarIconClass = classes.unselectableSnackbarIcon;
    if (isSelectable) {
      ActionIcon = ClickIcon;
      if (selectionLimit === 1) {
        ActionIcon = isSelected ? SelectedIcon : ClickIcon;
        action = isSelected ? (
          <b>Selected</b>
        ) : (
          <>
            {/* eslint-disable react/jsx-one-expression-per-line */}
            Click to <b>select</b>
            {/* eslint-enable react/jsx-one-expression-per-line */}
          </>
        );
        snackbarClass = isSelected
          ? classes.selectedSelectionSnackbar
          : classes.addToSelectionSnackbar;
        snackbarIconClass = isSelected
          ? classes.selectedSelectionSnackbarIcon
          : classes.addToSelectionSnackbarIcon;
      } else {
        action = (
          <>
            {/* eslint-disable react/jsx-one-expression-per-line */}
            Click to <b>{verb}</b> {preposition} selection
            {/* eslint-enable react/jsx-one-expression-per-line */}
          </>
        );
        snackbarClass = isSelected
          ? classes.removeFromSelectionSnackbar
          : classes.addToSelectionSnackbar;
        snackbarIconClass = isSelected
          ? classes.removeFromSelectionSnackbarIcon
          : classes.addToSelectionSnackbarIcon;
      }
    }
    return (
      <SnackbarContent
        key="renderItemSelectionActionSnackbar"
        className={`${classes.selectionSnackbar} ${snackbarClass}`}
        message={(
          <div className={classes.startFlex}>
            <ActionIcon className={`${classes.snackbarIcon} ${snackbarIconClass}`} />
            <div>
              <Typography variant="body2">
                {action}
              </Typography>
            </div>
          </div>
        )}
      />
    );
  };

  /**
     Render: Site Popup
  */
  const renderSitePopup = (siteCode) => {
    const site = featureData[siteCode] || {};
    const { [site.stateCode]: usState = {} } = state
      .featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY];
    const { [site.domainCode]: domain = {} } = state
      .featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY];
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    const renderActions = () => {
      if (selectionActive) {
        return selectingCurrentFeatureType
          ? renderItemSelectionActionSnackbar(site.siteCode)
          : null;
      }
      const actionButtonProps = {
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        target: '_blank',
        size: 'small',
      };
      return (
        <div className={classes.popupButtonRow}>
          <Button
            endIcon={<SiteDetailsIcon />}
            href={getHref('SITE_DETAILS', site.siteCode)}
            {...actionButtonProps}
          >
            Site Details
          </Button>
          <Button
            endIcon={<ExploreDataProductsIcon />}
            href={getHref('EXPLORE_DATA_PRODUCTS_BY_SITE', site.siteCode)}
            {...actionButtonProps}
          >
            Explore Data
          </Button>
          <Button
            endIcon={<FontAwesomeIcon icon={faBug} className={classes.faIcon} />}
            href={getHref('EXPLORE_SAMPLE_PRODUCTS_BY_SITE', site.siteCode)}
            {...actionButtonProps}
          >
            Explore Samples
          </Button>
        </div>
      );
    };
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(`${site.description} (${site.siteCode})`, false)}
        {selectionActive ? null : (
          <Link
            variant="caption"
            component="button"
            onClick={() => jumpTo(site.siteCode)}
            style={{ marginLeft: '-2px', marginBottom: '8px' }}
            data-selenium="sitemap-map-popup-siteLink"
          >
            {markerIcon}
            {`Jump to ${site.siteCode} on the map`}
          </Link>
        )}
        <Grid container spacing={1} style={{ marginBottom: Theme.spacing(1) }}>
          {/* Terrain and Type */}
          <Grid item xs={8}>
            <Typography variant="subtitle2">{feature.nameSingular}</Typography>
            <Typography variant="caption"><i>{featureDescription}</i></Typography>
          </Grid>
          {/* State/Territory */}
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">{stateFieldTitle}</Typography>
            {selectionActive ? (
              <Typography variant="caption">{usState.name}</Typography>
            ) : (
              <Tooltip title={`Jump to ${usState.name} on the map`}>
                <Link
                  variant="caption"
                  component="button"
                  style={{ textAlign: 'right' }}
                  onClick={() => jumpTo(site.stateCode)}
                  data-selenium="sitemap-map-popup-stateLink"
                >
                  {markerIcon}
                  {usState.name}
                </Link>
              </Tooltip>
            )}
          </Grid>
          {/* Latitude/Longitude */}
          <Grid item xs={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {renderLatLon(site.latitude, site.longitude)}
          </Grid>
          {/* Domain */}
          <Grid item xs={7} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Domain</Typography>
            {selectionActive ? (
              <Typography variant="caption">{`${site.domainCode} - ${domain.name}`}</Typography>
            ) : (
              <Tooltip title={`Jump to ${site.domainCode} on the map`}>
                <Link
                  variant="caption"
                  component="button"
                  style={{ textAlign: 'right' }}
                  onClick={() => jumpTo(site.domainCode)}
                  data-selenium="sitemap-map-popup-domainLink"
                >
                  {markerIcon}
                  {`${site.domainCode} - ${domain.name}`}
                </Link>
              </Tooltip>
            )}
          </Grid>
        </Grid>
        {renderActions()}
      </Popup>
    );
  };

  /**
     Render: Decommissioned Site Popup
  */
  const renderDecommissionedSitePopup = (siteCode) => {
    const site = featureData[siteCode] || {};
    const { [site.state]: usState = {} } = state
      .featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY];
    const { [site.domain]: domain = {} } = state
      .featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY];
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(`${site.siteName} (${site.siteCode})`, false)}
        <Link
          variant="caption"
          component="button"
          onClick={() => jumpTo(site.siteCode)}
          style={{ marginLeft: '-2px', marginBottom: '8px' }}
          data-selenium="sitemap-map-popup-siteLink"
        >
          {markerIcon}
          {`Jump to ${site.siteCode} on the map`}
        </Link>
        <Grid container spacing={1} style={{ marginBottom: Theme.spacing(1) }}>
          {/* Terrain and Type */}
          <Grid item xs={8}>
            <Typography variant="subtitle2">{feature.nameSingular}</Typography>
            <Typography variant="caption"><i>{featureDescription}</i></Typography>
          </Grid>
          {/* State/Territory */}
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">{stateFieldTitle}</Typography>
            {selectionActive ? (
              <Typography variant="caption">{usState.name}</Typography>
            ) : (
              <Tooltip title={`Jump to ${usState.name} on the map`}>
                <Link
                  variant="caption"
                  component="button"
                  style={{ textAlign: 'right' }}
                  onClick={() => jumpTo(site.state)}
                  data-selenium="sitemap-map-popup-stateLink"
                >
                  {markerIcon}
                  {usState.name}
                </Link>
              </Tooltip>
            )}
          </Grid>
          {/* Latitude/Longitude */}
          <Grid item xs={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {renderLatLon(site.latitude, site.longitude)}
          </Grid>
          {/* Domain */}
          <Grid item xs={7} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Domain</Typography>
            {selectionActive ? (
              <Typography variant="caption">{`${site.domain} - ${domain.name}`}</Typography>
            ) : (
              <Tooltip title={`Jump to ${site.domain} on the map`}>
                <Link
                  variant="caption"
                  component="button"
                  style={{ textAlign: 'right' }}
                  onClick={() => jumpTo(site.domain)}
                  data-selenium="sitemap-map-popup-domainLink"
                >
                  {markerIcon}
                  {`${site.domain} - ${domain.name}`}
                </Link>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </Popup>
    );
  };

  /**
     Render - All the Rest of the Popups
     Convention is alphabetical listing of keys since order here doesn't matter
  */
  const renderLocationPopupWithPlotSizeAndSlope = (siteCode, location) => renderLocationPopup(
    siteCode,
    location,
    [renderPlotSizeAndSlope],
  );
  const renderPopupFunctions = {
    AQUATIC_BENCHMARKS: renderLocationPopup,
    AQUATIC_BUOYS: renderLocationPopup,
    AQUATIC_CORE_SITES: renderSitePopup,
    AQUATIC_GROUNDWATER_WELLS: renderLocationPopup,
    AQUATIC_DISCHARGE_POINTS: renderLocationPopup,
    AQUATIC_FISH_POINTS: renderLocationPopup,
    AQUATIC_METEOROLOGICAL_STATIONS: renderLocationPopup,
    AQUATIC_PLANT_TRANSECTS: renderLocationPopup,
    AQUATIC_REACHES: renderBoundaryPopup,
    AQUATIC_GRADIENT_SITES: renderSitePopup,
    AQUATIC_RIPARIAN_ASSESSMENTS: renderLocationPopup,
    AQUATIC_SEDIMENT_POINTS: renderLocationPopup,
    AQUATIC_SENSOR_STATIONS: renderLocationPopup,
    AQUATIC_STAFF_GAUGES: renderLocationPopup,
    AQUATIC_WET_DEPOSITION_POINTS: renderLocationPopup,
    DECOMMISSIONED_SITES: renderDecommissionedSitePopup,
    DISTRIBUTED_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
      renderPlotSamplingModules,
    ]),
    DISTRIBUTED_BIRD_GRID_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_BIRD_GRIDS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MAMMAL_GRID_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MAMMAL_GRIDS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MOSQUITO_POINTS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_TICK_PLOT_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_TICK_PLOTS: renderLocationPopupWithPlotSizeAndSlope,
    DOMAINS: (domainCode) => {
      const title = !featureData[domainCode] ? null : (
        <span>
          {`NEON Domain ${domainCode.replace('D', '')} - ${featureData[domainCode].name}`}
        </span>
      );
      const jumpLink = selectionActive ? null : (
        <Link
          key="jumpLink"
          variant="caption"
          component="button"
          onClick={() => jumpTo(domainCode)}
          style={{ marginBottom: '8px' }}
          data-selenium="sitemap-map-popup-domainLink"
        >
          {markerIcon}
          {`Jump to ${domainCode} on the map`}
        </Link>
      );
      return renderBoundaryPopup(
        domainCode,
        title,
        [
          jumpLink,
          renderChildSites,
          selectingCurrentFeatureType
            ? renderItemSelectionActionSnackbar(domainCode)
            : renderRegionSelectionAction(FEATURES.DOMAINS.KEY, domainCode),
        ],
      );
    },
    FLIGHT_BOX_BOUNDARIES: renderBoundaryPopup,
    HUTS: renderLocationPopup,
    MEGAPITS: renderLocationPopup,
    // eslint-disable-next-line react/no-unstable-nested-components
    POUR_POINTS: (siteCode) => (
      <Popup {...popupProps}>
        {renderPopupTitle(`${siteCode} Watershed Pour Point`)}
        <Grid container spacing={1}>
          {renderLocationSiteAndDomain(siteCode)}
        </Grid>
      </Popup>
    ),
    SAMPLING_BOUNDARIES: renderBoundaryPopup,
    STATES: (stateCode) => {
      const jumpLink = selectionActive ? null : (
        <Link
          key="jumpLink"
          variant="caption"
          component="button"
          onClick={() => jumpTo(stateCode)}
          style={{ marginBottom: '8px' }}
          data-selenium="sitemap-map-popup-stateLink"
        >
          {markerIcon}
          {`Jump to ${stateCode} on the map`}
        </Link>
      );
      return renderBoundaryPopup(
        stateCode,
        featureData[stateCode] ? featureData[stateCode].name : stateCode,
        [
          jumpLink,
          renderChildSites,
          selectingCurrentFeatureType
            ? renderItemSelectionActionSnackbar(stateCode)
            : renderRegionSelectionAction(FEATURES.DOMAINS.KEY, stateCode),
        ],
      );
    },
    TERRESTRIAL_CORE_SITES: renderSitePopup,
    TERRESTRIAL_GRADIENT_SITES: renderSitePopup,
    TOWER_AIRSHEDS: renderBoundaryPopup,
    TOWER_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
      renderPlotSamplingModules,
    ]),
    TOWER_PHENOLOGY_PLOT_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    TOWER_PHENOLOGY_PLOTS: renderLocationPopupWithPlotSizeAndSlope,
    TOWER_SOIL_PLOTS: renderLocationPopup,
    TOWERS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderTowerDetails,
    ]),
    WATERSHED_BOUNDARIES: renderBoundaryPopup,
  };
  const hasPopup = typeof renderPopupFunctions[featureKey] === 'function';
  const renderPopup = (siteCode, location = null) => {
    if (
      !hasPopup || !featureData[siteCode]
        || (location !== null && !featureData[siteCode][location])
    ) { return null; }
    return renderPopupFunctions[featureKey](siteCode, location);
  };

  /**
     Render a single shape (marker, rectangle, or polygon)
  */
  const baseColor = featureStyle ? featureStyle.color : '#666666';
  const hoverColor = `#${tinycolor(baseColor).lighten(10).toHex()}`;
  const ghostedBaseColor = `#${tinycolor(baseColor).lighten(10).desaturate(60).toHex()}`;
  const ghostedHoverColor = `#${tinycolor(hoverColor).lighten(10).desaturate(60).toHex()}`;
  const darkenedBaseColor = `#${tinycolor(baseColor).darken(15).toHex()}`;
  const darkenedMoreBaseColor = `#${tinycolor(darkenedBaseColor).darken(15).toHex()}`;
  const isPoint = (shapeData) => {
    const shapeKeys = Object.keys(shapeData);
    return (
      (
        shapeKeys.includes('geometry') && Object.keys(shapeData.geometry).includes('coordinates')
          && Array.isArray(shapeData.geometry.coordinates)
          && shapeData.geometry.coordinates.length === 2
          && shapeData.geometry.coordinates.every((x) => Number.isFinite(x))
      ) || (
        shapeKeys.includes('latitude') && shapeKeys.includes('longitude')
      )
    );
  };
  const renderShape = (primaryId, secondaryId = null) => {
    const polygonInteractionProps = {
      onMouseOver: (e) => {
        e.target._path.setAttribute('stroke', hoverColor);
        e.target._path.setAttribute('fill', hoverColor);
      },
      onMouseOut: (e) => {
        e.target._path.setAttribute('stroke', featureStyle.color);
        e.target._path.setAttribute('fill', featureStyle.color);
      },
    };
    const shapeData = secondaryId && featureData[primaryId][secondaryId]
      ? featureData[primaryId][secondaryId]
      : featureData[primaryId];
    let isSelectable = null;
    let isSelected = false;
    if (selectionActive) {
      isSelectable = !validItems || (
        secondaryId ? validItems.has(secondaryId) : validItems.has(primaryId)
      );
      isSelected = secondaryId ? selectedItems.has(secondaryId) : selectedItems.has(primaryId);
      if (featureType === selectableFeatureType && hideUnselectable && !isSelectable) {
        return null;
      }
    }
    const isHighlighted = (
      (primaryIdOnly && !secondaryId && primaryId === focusLocation)
        || (!primaryIdOnly && secondaryId && secondaryId === focusLocation)
    );
    const key = secondaryId ? `${primaryId} - ${secondaryId}` : primaryId;
    const renderedPopup = renderPopup(primaryId, secondaryId);
    const shapeKeys = Object.keys(shapeData);
    let position = [];
    let positions = [];
    let icon = null;
    let marker = null;
    let interaction = {};
    let shapeProps = {};
    if (shapeData.geometry && shapeData.geometry.coordinates) {
      if (checkValidPositions(shapeData.geometry.coordinates, true)) {
        positions = shapeData.geometry.coordinates;
      }
      // Polyline
      if (featureShape === 'Polyline') {
        shapeProps = {
          ...featureStyle || {},
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', hoverColor);
          },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', baseColor);
          },
        };
      }
      // Polygon
      if (featureShape === 'Polygon') {
        // If the polygon boundary does not intersect the map bounds then do not render it
        // We see this when the map bounds are entirely contained within a boundary but the
        // feature is still visible, resulting in an always-on popup with no context otherwise
        if (!calculateLocationsInBounds({ X: shapeData }, mapBounds).length) { return null; }
        shapeProps = {
          ...featureStyle || {},
          ...polygonInteractionProps,
        };
        // ReactLeaflet does not suport the mask prop, so add it as an unused class.
        // The LayoutEffect in SiteMapLeaflet.jsx then applies it as a mask attribute.
        if ([FEATURES.DOMAINS.KEY, FEATURES.STATES.KEY].includes(featureKey)) {
          shapeProps.className = `#mask_${featureKey}_${primaryId}`;
        }
        if (isHighlighted) {
          shapeProps.color = darkenedBaseColor;
          shapeProps.onMouseOut = (e) => {
            e.target._path.setAttribute('stroke', darkenedBaseColor);
            e.target._path.setAttribute('fill', darkenedBaseColor);
          };
        } else if (exists(focusLocation) && amplifyHighlighted) {
          // Determine if the feature type of the focus location
          // is set to amplify highlighted for this feature type (eg, same type)
          const amplifyFeatureKeys = Object.keys(FEATURES)
            .filter((k) => FEATURES[k].amplifyHighlighted && FEATURES[k].matchLocationType);
          const isFocusAmplifiable = amplifyFeatureKeys.find((amplifyFeatureKey) => {
            if (exists(state.focusLocation)
              && exists(state.focusLocation.data)
              && exists(state.focusLocation.data.type)
            ) {
              return new RegExp(FEATURES[amplifyFeatureKey].matchLocationType)
                .test(state.focusLocation.data.type);
            }
            return false;
          });
          if (isFocusAmplifiable) {
            shapeProps.color = ghostedHoverColor;
            shapeProps.onMouseOut = (e) => {
              e.target._path.setAttribute('stroke', ghostedHoverColor);
              e.target._path.setAttribute('fill', ghostedHoverColor);
            };
          }
        }
        if (selectionActive) {
          let returnColor = isHighlighted ? darkenedBaseColor : featureStyle.color;
          let useHoverColor = hoverColor;
          if (selectingCurrentFeatureType) {
            if (state.selection.set.has(primaryId)) { returnColor = darkenedMoreBaseColor; }
            if (!isSelectable) {
              returnColor = ghostedBaseColor;
              useHoverColor = ghostedHoverColor;
            }
          }
          if (selectingActiveTypeByProxy) {
            const baseColors = {
              [SELECTION_PORTIONS.PARTIAL]: darkenedBaseColor,
              [SELECTION_PORTIONS.TOTAL]: darkenedMoreBaseColor,
            };
            if (
              state.selection.derived[featureKey]
                && state.selection.derived[featureKey][primaryId]
            ) {
              // eslint-disable-next-line max-len
              returnColor = baseColors[state.selection.derived[featureKey][primaryId]] || featureStyle.color;
            }
          }
          shapeProps.color = returnColor;
          shapeProps.onMouseOver = (e) => {
            e.target._path.setAttribute('stroke', useHoverColor);
            e.target._path.setAttribute('fill', useHoverColor);
            if (hasPopup) {
              e.target.openPopup();
              positionPopup(e.target, e.latlng, true);
            }
          };
          shapeProps.onMouseMove = (e) => {
            if (hasPopup) {
              positionPopup(e.target, e.latlng, true);
            }
          };
          shapeProps.onMouseOut = (e) => {
            e.target._path.setAttribute('stroke', returnColor);
            e.target._path.setAttribute('fill', returnColor);
            if (hasPopup) {
              e.target.closePopup();
            }
          };
          // Onclick to select sites by way of clicking a state or domain to capture sites within
          if (selectingActiveTypeByProxy && selectionLimit !== 1) {
            shapeProps.onClick = () => {
              if (featureKey === FEATURES.DOMAINS.KEY) {
                dispatch({ type: 'toggleSitesSelectedForDomain', domainCode: primaryId });
              }
              if (featureKey === FEATURES.STATES.KEY) {
                dispatch({ type: 'toggleSitesSelectedForState', stateCode: primaryId });
              }
            };
          }
          // Onclick to select states or domains directly
          if (selectionType === featureType) {
            shapeProps.onClick = () => {
              if (isSelectable) {
                dispatch({ type: 'toggleItemSelected', item: primaryId });
              }
            };
          }
        }
      }
    }
    // Marker
    if (featureShape === 'Marker' && isPoint(shapeData)) {
      position = ['latitude', 'longitude'].every((k) => shapeKeys.includes(k))
        ? [shapeData.latitude, shapeData.longitude]
        : shapeData.geometry.coordinates;
      if (!checkValidPositions(position, true)) {
        position = [];
      }
      if (state.map.zoomedIcons[featureKey] !== null) {
        const baseIcon = state.map.zoomedIcons[featureKey];
        const selection = (isSelectable
            && isSelected
            && exists(baseIcon)
            && exists(baseIcon[SELECTION_STATUS.SELECTED]))
          ? SELECTION_STATUS.SELECTED
          : SELECTION_STATUS.UNSELECTED;
        const initialHighlight = isHighlighted ? HIGHLIGHT_STATUS.HIGHLIGHT : HIGHLIGHT_STATUS.NONE;
        if (baseIcon && baseIcon[selection]) {
          icon = baseIcon[selection][initialHighlight];
          interaction = {
            onMouseOver: (e) => {
              let highlight = HIGHLIGHT_STATUS.HIGHLIGHT;
              if (selectionActive && selectingCurrentFeatureType && isSelectable) {
                highlight = HIGHLIGHT_STATUS[isSelected ? 'HIGHLIGHT' : 'SELECT'];
              }
              e.target.setIcon(baseIcon[selection][highlight]);
              e.target._bringToFront();
              if (hasPopup && selectionActive) {
                e.target.openPopup();
                positionPopup(e.target, e.latlng, selectionActive);
              }
            },
            onMouseOut: (e) => {
              e.target.setIcon(baseIcon[selection][initialHighlight]);
              if (hasPopup && selectionActive) {
                e.target.closePopup();
              }
            },
            onClick: (e) => {
              if (!selectionActive && hasPopup) {
                const popupOpen = e.target._popup.isOpen();
                const func = () => positionPopup(e.target, e.latlng, selectionActive);
                dispatch({ type: 'setMapRepositionOpenPopupFunc', func });
                if (popupOpen) { func(); }
              }
              if (selectionActive && selectingCurrentFeatureType && isSelectable) {
                switch (selectionType) {
                  case FEATURE_TYPES.SITES.KEY:
                    if (shapeData.siteCode) {
                      dispatch({ type: 'toggleItemSelected', item: shapeData.siteCode });
                    }
                    break;
                  default:
                    break;
                }
              }
            },
          };
        }
      }
      if (exists(icon)) {
        marker = (
          <Marker
            key={`${key}-marker`}
            position={position}
            title={key}
            icon={icon}
            {...interaction}
          >
            {renderedPopup}
          </Marker>
        );
      }
    }
    switch (featureShape) {
      case 'Marker':
        return marker;
      case 'Circle':
        return (
          <CircleMarker
            key={`${key}-circlemarker`}
            title={key}
            center={position}
            radius={Math.max(state.map.zoom - 10, 3)}
            {...featureStyle}
            {...polygonInteractionProps}
          >
            {renderedPopup}
          </CircleMarker>
        );
      case 'Polygon':
        // Only render polygon popups when not in area selection mode. Otherwise area selection
        // could neither start, move, nor end over feature shapes.
        if (!checkValidPositions(positions, featureType === FEATURE_TYPES.SAMPLING_POINTS.KEY)) {
          return null;
        }
        return state.map.mouseMode === MAP_MOUSE_MODES.AREA_SELECT ? (
          <Polygon
            key={`${key}-polygon`}
            positions={positions}
            {...shapeProps}
            onMouseOver={null}
            onMouseMove={null}
            onMouseOut={null}
          />
        ) : (
          <Polygon key={`${key}-polygon`} positions={positions} {...shapeProps}>
            {renderedPopup}
          </Polygon>
        );
      case 'Polyline':
        return (
          <Polyline key={`${key}-polyline`} positions={positions} {...shapeProps}>
            {renderedPopup}
          </Polyline>
        );
      default:
        return null;
    }
  };

  /**
     Main Render
  */
  let renderableKeys = Object.keys(featureData);
  if (Array.isArray(manualLocationData) && manualLocationData.length) {
    const hasPrototypeSites = manualLocationData.some((ml) => (
      ml.manualLocationType === MANUAL_LOCATION_TYPES.PROTOTYPE_SITE
    ));
    if (hasPrototypeSites && featureType === FEATURE_TYPES.SITES.KEY) {
      const allKeys = Object.keys(featureData);
      renderableKeys = manualLocationData
        .filter((ml) => (
          ml.manualLocationType === MANUAL_LOCATION_TYPES.PROTOTYPE_SITE
            && allKeys.includes(ml.siteCode)
        ))
        .map((ml) => ml.siteCode);
    }
  }
  return (
    <FeatureGroup>
      {renderableKeys
        // Valid items should render above unselecatbles
        .sort((a) => {
          if (!validItems) { return 0; }
          return (validItems.has(a) ? 1 : -1);
        })
        // Focus location should render above all others
        .sort((a) => (a === state.focusLocation.current ? 1 : -1))
        .flatMap((keyA) => {
          if (
            [FEATURE_TYPES.LOCATIONS.KEY, FEATURE_TYPES.SAMPLING_POINTS.KEY].includes(featureType)
          ) {
            return Object.keys(featureData[keyA]).map((keyB) => renderShape(keyA, keyB));
          }
          return renderShape(keyA);
        })}
    </FeatureGroup>
  );
};

SiteMapFeature.propTypes = {
  mapRef: PropTypes.shape({
    current: PropTypes.instanceOf(Map),
  }).isRequired,
  featureKey: PropTypes.oneOf(Object.keys(FEATURES)).isRequired,
};

export default SiteMapFeature;
