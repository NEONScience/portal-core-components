/* eslint-disable jsx-a11y/anchor-is-valid, no-unused-vars */
import React, { useRef, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import InfoIcon from '@material-ui/icons/InfoOutlined';
import MarkerIcon from '@material-ui/icons/LocationOn';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';

import MaterialTable, { MTableToolbar, MTableFilterRow } from 'material-table';

import MaterialTableIcons from '../MaterialTableIcons/MaterialTableIcons';
import NeonContext from '../NeonContext/NeonContext';
import Theme, { COLORS } from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import {
  getHref,
  VIEWS,
  FEATURES,
  NLCD_CLASSES,
  FEATURE_TYPES,
  MIN_TABLE_MAX_BODY_HEIGHT,
  PLOT_SAMPLING_MODULES,
  SELECTABLE_FEATURE_TYPES,
  UNSELECTABLE_MARKER_FILTER,
  calculateLocationsInMap,
} from './SiteMapUtils';

const ucWord = word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;

const useStyles = makeStyles(theme => ({
  tableContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    '& table': {
      margin: '0px !important',
      borderCollapse: 'separate',
      '& tr.MuiTableRow-head': {
        backgroundColor: theme.palette.primary.main,
        '& th:first-child span.MuiCheckbox-root': {
          margin: theme.spacing(0, 0.5),
          backgroundColor: '#ffffff88',
          '&:hover': {
            backgroundColor: '#ffffffaa',
          },
        },
      },
      '& tbody tr:first-child': {
        backgroundColor: theme.palette.grey[50],
      },
      '& tfoot': {
        paddingRight: '36px',
      },
    },
    '& td.MuiTablePagination-root': {
      borderBottom: 'none',
    },
  },
  featureIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    filter: 'drop-shadow(0px 0px 1.5px #000000bb)',
  },
  linkButton: {
    textAlign: 'left',
  },
  startFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toolbarContainer: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px dotted ${theme.palette.grey[300]}`,
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(4.5),
    },
    '& div.MuiToolbar-root': {
      padding: theme.spacing(0, 2),
      backgroundColor: theme.palette.grey[50],
    },
    // This hides all but the search input and show columns buttons.
    // No other way to have material table NOT show a selection title in the toolbar.
    '& div.MuiToolbar-root > div:not(:nth-last-child(-n+2))': {
      display: 'none',
    },
  },
  toggleButtonGroup: {
    height: theme.spacing(4),
  },
  toggleButton: {
    height: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1.5),
    whiteSpace: 'nowrap',
  },
  // Use !important here to override the Mui-selected class with higher priority
  toggleButtonSelected: {
    color: '#fff !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  caption: {
    fontFamily: 'monospace',
    fontSize: '1.05em',
    whiteSpace: 'nowrap',
  },
  iconButton: {
    marginTop: theme.spacing(-0.25),
  },
  siteName: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: Theme.spacing(1, 0, 0.5, 0),
    minWidth: '200px',
  },
  nlcdClassContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  nlcdClass: {
    width: '14px',
    height: '14px',
    border: '1px solid black',
    marginRight: theme.spacing(1.5),
  },
}));

const calculateMaxBodyHeight = (tableRef) => {
  if (!tableRef || !tableRef.current) { return MIN_TABLE_MAX_BODY_HEIGHT; }
  const containerHeight = tableRef.current.clientHeight || 0;
  const toolbarHeight = tableRef.current.children[0].children[0].clientHeight || 0;
  const pagerHeight = tableRef.current.children[0].children[2].clientHeight || 0;
  return Math.max(containerHeight - toolbarHeight - pagerHeight, MIN_TABLE_MAX_BODY_HEIGHT);
};

const SiteMapTable = () => {
  const classes = useStyles(Theme);
  const tableRef = useRef(null);

  // Neon Context State
  const [{ isFinal, hasError }] = NeonContext.useNeonContextState();
  const canRender = isFinal && !hasError;

  // Site Map State
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const {
    focus,
    maxBodyHeight,
    maxBodyHeightUpdateFromAspectRatio,
  } = state.table;
  const {
    limit: selectionLimit,
    valid: selectionValid,
    set: selection,
    validSet: selectableItems,
    hideUnselectable,
  } = state.selection;
  const selectionActive = state.selection.active === focus;

  /**
    Effect - Initialize table if this is the first time we're seeing it
  */
  useEffect(() => {
    if (
      !tableRef || !tableRef.current
        || state.view.current !== VIEWS.TABLE || state.view.initialized[VIEWS.TABLE]
    ) { return; }
    dispatch({ type: 'setViewInitialized' });
    dispatch({ type: 'setTableMaxBodyHeight', height: calculateMaxBodyHeight(tableRef) });
  }, [tableRef, state.view, dispatch]);

  /**
    Effect - Recalculate the max body height from an aspect ratio change (e.g. page resize)
  */
  useEffect(() => {
    if (
      state.view.current === VIEWS.TABLE && state.view.initialized[VIEWS.TABLE]
        && maxBodyHeightUpdateFromAspectRatio
    ) {
      dispatch({ type: 'setTableMaxBodyHeight', height: calculateMaxBodyHeight(tableRef) });
    }
  }, [
    tableRef,
    state.view,
    dispatch,
    maxBodyHeightUpdateFromAspectRatio,
  ]);

  if (!canRender) { return null; }

  // Selection functions
  let rowIsSelected = () => false;
  let rowIsSelectable = () => false;
  let selectRow = () => {};
  switch (focus) {
    case FEATURE_TYPES.SITES:
      rowIsSelected = row => selection.has(row.siteCode);
      rowIsSelectable = row => !selectableItems || selectableItems.has(row.siteCode);
      selectRow = row => dispatch({ type: 'toggleSiteSelected', site: row.siteCode });
      break;
    default:
      break;
  }

  // Jump-To function to turn location names in the table to map navigation
  const jumpTo = (locationCode = '') => {
    dispatch({ type: 'setNewFocusLocation', location: locationCode });
  };

  // While sites keep a state and domain code locations only keep a site code.
  // These helper functions will connect the dots to to get site/state/domain/etc. for a location.
  const getParent = (type, location) => {
    let source = null;
    if (type === 'SITE') {
      source = { code: 'siteCode', data: state.sites };
    } else if (type === 'STATE') {
      source = { code: 'stateCode', data: state.featureData.BOUNDARIES.STATES };
    } else if (type === 'DOMAIN') {
      source = { code: 'domainCode', data: state.featureData.BOUNDARIES.DOMAINS };
    }
    if (!source) { return null; }
    let code = null;
    if (location[source.code]) {
      code = location[source.code];
    } else if (location.siteCode) {
      code = state.sites[location.siteCode] ? state.sites[location.siteCode][source.code] : null;
    }
    return source.data[code] ? { [source.code]: code, ...source.data[code] } : null;
  };
  const getSite = location => getParent('SITE', location);
  const getState = location => getParent('STATE', location);
  const getDomain = location => getParent('DOMAIN', location);

  const getFeatureName = (featureKey) => {
    if (FEATURES[featureKey]) {
      return (FEATURES[featureKey].nameSingular || FEATURES[featureKey].name || featureKey);
    }
    return featureKey;
  };
  const renderFeatureIcon = (featureKey, unselectable = false) => {
    if (!FEATURES[featureKey] || !FEATURES[featureKey].iconSvg) { return null; }
    const { iconSvg } = FEATURES[featureKey];
    const style = unselectable ? { filter: UNSELECTABLE_MARKER_FILTER } : {};
    return (
      <img
        src={iconSvg}
        alt={getFeatureName(featureKey)}
        className={classes.featureIcon}
        style={style}
      />
    );
  };

  const renderCaptionString = (str = '--', ariaLabel = null) => (
    <Typography variant="caption" aria-label={ariaLabel} className={classes.caption}>
      {str}
    </Typography>
  );

  /**
     Calculate rows
  */
  const visibleFeatureKeys = Object.keys(state.featureData[focus])
    .filter(featureKey => (
      state.filters.features.available[featureKey] && state.filters.features.visible[featureKey]
    ));
  const locations = {};
  visibleFeatureKeys.forEach((featureKey) => {
    Object.keys(state.featureData[focus][featureKey]).forEach((siteCode) => {
      if (focus === FEATURE_TYPES.SITES) {
        locations[siteCode] = state.featureData[focus][featureKey][siteCode];
      }
      if (focus === FEATURE_TYPES.LOCATIONS) {
        Object.keys(state.featureData[focus][featureKey][siteCode]).forEach((locationCode) => {
          locations[locationCode] = state.featureData[focus][featureKey][siteCode][locationCode];
        });
      }
    });
  });
  let initialRows = calculateLocationsInMap(locations, state.map.bounds);
  if (selectionActive && selectableItems && hideUnselectable) {
    initialRows = initialRows.filter(item => selectableItems.has(item));
  }
  const rows = initialRows.map(key => locations[key]);
  if (selectionActive) {
    rows.forEach((row, idx) => {
      let selected = false;
      if (focus === FEATURE_TYPES.SITES) { selected = selection.has(row.siteCode); }
      // Implement locations preselection here
      if (!rows[idx].tableData) { rows[idx].tableData = {}; }
      rows[idx].tableData.checked = selected;
    });
  }

  /**
     Unique sites, domains, and states off of rows
  */
  const sitesInMap = Array.from(rows.reduce((acc, cur) => {
    if (cur.siteCode) { acc.add(cur.siteCode); }
    return acc;
  }, new Set()));
  const domainsInMap = new Set();
  const statesInMap = new Set();
  sitesInMap
    .filter(siteCode => state.sites[siteCode])
    .forEach((siteCode) => {
      domainsInMap.add(state.sites[siteCode].domainCode);
      statesInMap.add(state.sites[siteCode].stateCode);
    });

  // Columns that are visible for more than one feature type
  const commonColumns = {
    site: {
      field: 'siteCode',
      title: 'Site',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(
        Array.from(sitesInMap).map(siteCode => [siteCode, siteCode]),
      ),
      customSort: (rowA, rowB) => {
        const siteA = getSite(rowA);
        const siteB = getSite(rowB);
        return siteA.description > siteB.description ? -1 : 1;
      },
      render: (row) => {
        const site = getSite(row);
        if (!site) { return null; }
        const featureKey = `${site.terrain.toUpperCase()}_${site.type.toUpperCase()}_SITES`;
        const unselectable = selectionActive && !rowIsSelectable(row);
        return (
          <div>
            <div className={classes.siteName}>
              {renderFeatureIcon(featureKey, unselectable)}
              <span>{`${site.description} (${site.siteCode})`}</span>
            </div>
            <div className={classes.startFlex} style={{ marginLeft: Theme.spacing(-0.75) }}>
              <Tooltip title={`Jump to ${site.siteCode} on the map`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  onClick={() => jumpTo(site.siteCode)}
                  data-selenium="sitemap-table-site-button-jumpTo"
                  aria-label="Jump to site on map"
                >
                  <MarkerIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Visit the ${site.siteCode} site details page`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  href={`${getHref('SITE_DETAILS', site.siteCode)}`}
                  data-selenium="sitemap-table-site-button-siteDetails"
                  aria-label="Visit site details page"
                >
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Explore data products for ${site.siteCode}`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  href={`${getHref('EXPLORE_DATA_PRODUCTS_BY_SITE', site.siteCode)}`}
                  data-selenium="sitemap-table-site-button-exploreDataProducts"
                  aria-label="Explore data products for this site"
                >
                  <ExploreDataProductsIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    domain: {
      field: 'domainCode',
      title: 'Domain',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(
        Array.from(domainsInMap).map(domainCode => [domainCode, domainCode]),
      ),
      customSort: (rowA, rowB) => {
        const domainA = getDomain(rowA);
        const domainB = getDomain(rowB);
        return domainA.domainCode > domainB.domainCode ? -1 : 1;
      },
      render: (row) => {
        const domain = getDomain(row);
        return !domain ? null : (
          <div>
            <div style={{ marginBottom: Theme.spacing(1) }}>
              {domain.domainCode}
            </div>
            <div className={classes.startFlex} style={{ marginLeft: Theme.spacing(-0.75) }}>
              <Tooltip title={`Jump to ${domain.domainCode} on the map`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  onClick={() => jumpTo(domain.domainCode)}
                  data-selenium="sitemap-table-domain-button-jumpTo"
                  aria-label="Jump to domain on map"
                >
                  <MarkerIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Visit the ${domain.domainCode} domain details page`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  href={`${getHref('DOMAIN_DETAILS', domain.domainCode)}`}
                  data-selenium="sitemap-table-domain-button-domainDetails"
                  aria-label="Visit domain details page"
                >
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Explore data products for ${domain.domainCode}`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  href={`${getHref('EXPLORE_DATA_PRODUCTS_BY_DOMAIN', domain.domainCode)}`}
                  data-selenium="sitemap-table-domain-button-exploreDataProducts"
                  aria-label="Explore data products for this domain"
                >
                  <ExploreDataProductsIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    state: {
      field: 'stateCode',
      title: 'State',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(
        Array.from(statesInMap).map(stateCode => [
          stateCode,
          state.featureData.BOUNDARIES.STATES[stateCode].name,
        ]),
      ),
      customSort: (rowA, rowB) => {
        const stateA = getState(rowA);
        const stateB = getState(rowB);
        return stateA.name > stateB.name ? -1 : 1;
      },
      render: (row) => {
        const usstate = getState(row);
        return !usstate ? null : (
          <div>
            <div style={{ marginBottom: Theme.spacing(1) }}>
              {usstate.name}
            </div>
            <div className={classes.startFlex} style={{ marginLeft: Theme.spacing(-0.75) }}>
              <Tooltip title={`Jump to ${usstate.name} on the map`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  onClick={() => jumpTo(usstate.stateCode)}
                  data-selenium="sitemap-table-state-button-jumpTo"
                  aria-label="Jump to state on map"
                >
                  <MarkerIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Explore data products for ${usstate.stateCode}`}>
                <IconButton
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  href={`${getHref('EXPLORE_DATA_PRODUCTS_BY_STATE', usstate.stateCode)}`}
                  data-selenium="sitemap-table-state-button-exploreDataProducts"
                  aria-label="Explore data products for this state"
                >
                  <ExploreDataProductsIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    latitude: {
      field: 'latitude',
      title: 'Latitude',
      sorting: true,
      filtering: false,
      render: row => renderCaptionString(row.latitude.toFixed(5), 'Latitude'),
    },
    longitude: {
      field: 'longitude',
      title: 'Longitude',
      sorting: true,
      filtering: false,
      render: row => renderCaptionString(row.longitude.toFixed(5), 'Longitude'),
    },
  };

  /**
     Define columns from current focus feature type
  */
  let columns = [];
  if (focus === FEATURE_TYPES.SITES) {
    columns = [
      commonColumns.site,
      commonColumns.latitude,
      commonColumns.longitude,
      { // Site Type
        field: 'type',
        title: 'Type',
        sorting: true,
        defaultSort: 'desc',
        lookup: Object.fromEntries(
          Array.from(
            new Set(rows.map(row => row.type)),
          ).sort().map(k => [k, ucWord(k)]),
        ),
        render: row => ucWord(row.type),
      },
      { // Site Terrain
        field: 'terrain',
        title: 'Terrain',
        sorting: true,
        defaultSort: 'desc',
        lookup: Object.fromEntries(
          Array.from(
            new Set(rows.map(row => row.terrain)),
          ).sort().map(k => [k, ucWord(k)]),
        ),
        render: row => ucWord(row.terrain),
      },
      commonColumns.domain,
      commonColumns.state,
    ];
  }
  if (focus === FEATURE_TYPES.LOCATIONS) {
    columns = [
      { // Location Name
        field: 'name',
        title: 'Name',
        sorting: true,
        defaultSort: 'desc',
        render: row => (
          <Link
            component="button"
            className={classes.linkButton}
            onClick={() => jumpTo(row.name)}
          >
            {row.name}
          </Link>
        ),
      },
      { // Location Type
        field: 'featureKey',
        title: 'Type',
        sorting: true,
        defaultSort: 'desc',
        lookup: Object.fromEntries(
          Array.from(new Set(rows.map(row => row.featureKey)))
            .sort((a, b) => (getFeatureName(a) > getFeatureName(b) ? 1 : -1))
            .map(featureKey => [featureKey, getFeatureName(featureKey)]),
        ),
        customSort: (rowA, rowB) => {
          const typeA = getFeatureName(rowA.featureKey);
          const typeB = getFeatureName(rowB.featureKey);
          if (typeA.name === typeB.name) { return 0; }
          return typeA.name > typeB.name ? -1 : 1;
        },
        render: (row) => {
          const { featureKey } = row;
          const featureName = getFeatureName(featureKey);
          return (
            <div className={classes.startFlex}>
              {renderFeatureIcon(featureKey)}
              <span>{featureName}</span>
            </div>
          );
        },
      },
      commonColumns.latitude,
      commonColumns.longitude,
      { // Elevation
        field: 'elevation',
        title: 'Elevation',
        sorting: true,
        defaultSort: 'desc',
        filtering: false,
        render: row => renderCaptionString(
          Number.isFinite(row.elevation) ? `${row.elevation.toFixed(2)}m` : '--',
          'Elevation',
        ),
      },
      { // NLCD Class
        field: 'nlcdClass',
        title: 'NLCD Class',
        sorting: true,
        deafultSort: 'asc',
        lookup: Object.fromEntries(
          Object.keys(NLCD_CLASSES)
            .filter(classKey => rows.some(row => row.nlcdClass === classKey))
            .map(classKey => [classKey, NLCD_CLASSES[classKey].name]),
        ),
        render: (row) => {
          if (!row.nlcdClass) {
            return renderCaptionString();
          }
          if (!NLCD_CLASSES[row.nlcdClass]) {
            return renderCaptionString(row.nlcdClass, 'NLCD Class');
          }
          const { name: title, color: backgroundColor } = NLCD_CLASSES[row.nlcdClass];
          return (
            <div className={classes.nlcdClassContainer}>
              <div className={classes.nlcdClass} title={title} style={{ backgroundColor }} />
              {renderCaptionString(title, 'NLCD Class')}
            </div>
          );
        },
      },
      { // Plot Size
        field: 'plotSize',
        title: 'Plot Size',
        sorting: true,
        deafultSort: 'asc',
        filtering: false,
        render: row => (row.plotDimensions ? (
          <React.Fragment>
            {renderCaptionString(`${row.plotDimensions}`, 'Plot Size (Dimensions)')}
            {Number.isFinite(row.plotSize) ? (
              <React.Fragment>
                <br />
                {renderCaptionString(`(${row.plotSize.toFixed(0)}m\u00b2)`, 'Plot Size (Area)')}
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : renderCaptionString()),
      },
      { // Plot Slope Aspect
        field: 'slopeAspect',
        title: 'Slope Aspect',
        sorting: true,
        deafultSort: 'asc',
        filtering: false,
        render: row => renderCaptionString(
          Number.isFinite(row.slopeAspect) ? `${row.slopeAspect.toFixed(2)}\u00b0` : '--',
          'Slope Aspect',
        ),
      },
      { // Plot Slope Gradient
        field: 'slopeGradient',
        title: 'Slope Gradient',
        sorting: true,
        deafultSort: 'asc',
        filtering: false,
        render: row => renderCaptionString(
          Number.isFinite(row.slopeGradient) ? `${row.slopeGradient.toFixed(2)}%` : '--',
          'Slope Gradient',
        ),
      },
      { // Sampling Module Count
        field: 'samplingModules',
        title: 'Potential Sampling Modules',
        filtering: false,
        sorting: true,
        deafultSort: 'asc',
        customSort: (rowA, rowB) => {
          const a = Array.isArray(rowA.samplingModules) ? rowA.samplingModules.length : null;
          const b = Array.isArray(rowB.samplingModules) ? rowB.samplingModules.length : null;
          if (a === b) { return 0; }
          if (a === null && b !== null) { return 1; }
          if (a !== null && b === null) { return -1; }
          return a > b ? 1 : -1;
        },
        render: row => (
          Array.isArray(row.samplingModules) ? (
            <Tooltip
              interactive
              placement="left"
              title={
                row.samplingModules.length ? (
                  <ul style={{ marginLeft: Theme.spacing(-1) }}>
                    {row.samplingModules.map(m => (
                      <li key={m}>{PLOT_SAMPLING_MODULES[m]}</li>
                    ))}
                  </ul>
                ) : <i>none</i>
              }
            >
              <div className={classes.startFlex}>
                {renderCaptionString(row.samplingModules.length, 'Potential Sampling Modules')}
                <IconButton
                  size="small"
                  className={classes.iconButton}
                  aria-label="Potential Sampling Modules"
                >
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </div>
            </Tooltip>
          ) : (
            renderCaptionString()
          )
        ),
      },
      commonColumns.site,
      commonColumns.domain,
      commonColumns.state,
    ];
  }

  const components = {
    Container: Box,
    Toolbar: toolbarProps => (
      <div className={classes.toolbarContainer} data-selenium="sitemap-table-toolbar">
        <MTableToolbar {...toolbarProps} />
      </div>
    ),
    FilterRow: filterRowProps => (
      <MTableFilterRow
        {...filterRowProps}
        filterCellStyle={{ padding: '8px', backgroundColor: Theme.palette.grey[50] }}
      />
    ),
  };
  const localization = {
    toolbar: {
      searchPlaceholder: `Search ${focus.toLowerCase()} in view`,
    },
    body: {
      emptyDataSourceMessage: `No ${focus.toLowerCase()} in current map view match the current filters.`,
    },
  };

  /**
     Render Table
  */
  return (
    <div ref={tableRef} className={classes.tableContainer} data-selenium="sitemap-content-table">
      <MaterialTable
        icons={MaterialTableIcons}
        components={components}
        columns={columns}
        data={rows}
        localization={localization}
        title={null}
        options={{
          padding: 'dense',
          filtering: true,
          columnsButton: true,
          headerStyle: {
            position: 'sticky',
            top: 0,
            backgroundColor: Theme.palette.grey[50],
          },
          maxBodyHeight: `${maxBodyHeight || MIN_TABLE_MAX_BODY_HEIGHT}px`,
          rowStyle: (row) => {
            if (selectionActive) {
              if (!rowIsSelectable(row)) {
                return { opacity: 0.65 };
              }
              if (rowIsSelected(row)) {
                return { backgroundColor: COLORS.LIGHT_BLUE[50] };
              }
            }
            return {};
          },
          selection: selectionActive,
          selectionProps: !selectionActive ? null : row => ({
            style: { margin: Theme.spacing(0, 0.5) },
            disabled: !rowIsSelectable(row),
          }),
        }}
        onSelectionChange={!selectionActive ? null : (newRows) => {
          const action = { type: 'updateSitesSelection', selection: new Set() };
          newRows.filter(row => row.tableData.checked).forEach((row) => {
            if (focus === FEATURE_TYPES.SITES) {
              action.selection.add(row.siteCode);
            }
          });
          dispatch(action);
        }}
      />
    </div>
  );
};

export default SiteMapTable;
