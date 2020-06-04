/* eslint-disable jsx-a11y/anchor-is-valid, no-unused-vars */
import React, { useRef, useEffect } from 'react';

import { isEqual } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

import MaterialTable, { MTableToolbar, MTableFilterRow } from 'material-table';

import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import {
  VIEWS,
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  FEATURES,
  FEATURE_TYPES,
  SELECTABLE_FEATURE_TYPES,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
  MIN_TABLE_MAX_BODY_HEIGHT,
  HIGHLIGHT_STATUS,
  calculateLocationsInMap,
} from './SiteMapUtils';

const ucWord = word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;

const useStyles = makeStyles(theme => ({
  tableContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
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
  row: {},
  rowSelected: {
    backgroundColor: `${theme.palette.secondary.main}20`,
  },
  startFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toolbarContainer: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px dotted ${theme.palette.grey[300]}`,
    paddingRight: theme.spacing(1),
    // padding: theme.spacing(0, 1, 0, 2),
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
    availableFeatureTypes,
    maxBodyHeight,
    maxBodyHeightUpdateFromAspectRatio,
  } = state.table;
  const selectionActive = state.selection.active === focus;
  const selection = selectionActive ? state.selection[state.selection.active] : new Set();

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
  }, [
    tableRef,
    VIEWS,
    state.view,
    dispatch,
    calculateMaxBodyHeight,
  ]);

  /**
    Effect - Recalculate the max body height the aspect ratio changed (e.g. page resize)
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
    VIEWS,
    state.view,
    dispatch,
    calculateMaxBodyHeight,
    maxBodyHeightUpdateFromAspectRatio,
  ]);

  if (!canRender) { return null; }

  // Selection functions
  let rowIsSelected = () => false;
  let selectRow = () => {};
  switch (focus) {
    case FEATURE_TYPES.SITES:
      rowIsSelected = row => selection.has(row.siteCode);
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
  const renderFeatureIcon = (featureKey, alt = '') => {
    if (!FEATURES[featureKey] || !FEATURES[featureKey].iconSvg) { return null; }
    const { iconSvg } = FEATURES[featureKey];
    return <img alt={getFeatureName(featureKey)} src={iconSvg} className={classes.featureIcon} />;
  };

  const sitesInMap = calculateLocationsInMap(state.sites, state.map.bounds);
  const domainsInMap = new Set();
  const statesInMap = new Set();
  sitesInMap
    .filter(siteCode => state.sites[siteCode])
    .forEach((siteCode) => {
      domainsInMap.add(state.sites[siteCode].domainCode);
      statesInMap.add(state.sites[siteCode].stateCode);
    });

  const renderSite = (siteCode, link = false) => {
    const site = state.sites[siteCode];
    if (!site) { return null; }
    const featureKey = `${site.terrain.toUpperCase()}_${site.type.toUpperCase()}_SITES`;
    const internal = (
      <React.Fragment>
        {renderFeatureIcon(featureKey)}
        <span>{`${site.description} (${site.siteCode})`}</span>
      </React.Fragment>
    );
    return link ? (
      <Link
        component="button"
        className={`${classes.linkButton} ${classes.startFlex}`}
        onClick={() => jumpTo(site.siteCode)}
      >
        {renderFeatureIcon(featureKey)}
        <span>{`${site.description} (${site.siteCode})`}</span>
      </Link>
    ) : (
      <div className={classes.startFlex}>
        {internal}
      </div>
    );
  };

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
        return (
          <Link
            component="button"
            className={`${classes.linkButton} ${classes.startFlex}`}
            onClick={() => jumpTo(site.siteCode)}
          >
            {renderFeatureIcon(featureKey)}
            <span>{`${site.description} (${site.siteCode})`}</span>
          </Link>
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
          <Link
            component="button"
            className={classes.linkButton}
            onClick={() => jumpTo(domain.domainCode)}
          >
            {domain.domainCode}
          </Link>
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
          <Link
            component="button"
            className={classes.linkButton}
            onClick={() => jumpTo(usstate.stateCode)}
          >
            {usstate.name}
          </Link>
        );
      },
    },
    selected: {
      field: 'selected',
      title: '',
      render: row => (
        <Checkbox
          checked={rowIsSelected(row)}
          onChange={selectRow}
          color="secondary"
        />
      ),
    },
    latlng: {
      field: 'latlng',
      title: 'Lat./Lng.',
      sorting: false,
      filtering: false,
      render: row => (
        <Typography
          variant="caption"
          aria-label="Latitude / Longitude"
          style={{ fontFamily: 'monospace', fontSize: '1.05em' }}
        >
          {row.latitude.toFixed(5)}
          <br />
          {row.longitude.toFixed(5)}
        </Typography>
      ),
    },
  };

  /**
     Calculate rows
  */
  const visibleFeatureKeys = Object.keys(state.featureData[focus])
    .filter(featureKey => state.filters.features.visible[featureKey]);
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
  const rows = calculateLocationsInMap(locations, state.map.bounds).map(key => locations[key]);

  /**
     Define columns from current focus feature type
  */
  let columns = [];
  if (focus === FEATURE_TYPES.SITES) {
    columns = [
      commonColumns.site,
      commonColumns.latlng,
      {
        field: 'type',
        title: 'Type',
        sorting: true,
        defaultSort: 'desc',
        lookup: Object.fromEntries(
          Array.from(
            new Set(rows.map(row => row.type)),
          ).map(k => [k, ucWord(k)]),
        ),
        render: row => ucWord(row.type),
      },
      {
        field: 'terrain',
        title: 'Terrain',
        sorting: true,
        defaultSort: 'desc',
        lookup: Object.fromEntries(
          Array.from(
            new Set(rows.map(row => row.terrain)),
          ).map(k => [k, ucWord(k)]),
        ),
        render: row => ucWord(row.terrain),
      },
      commonColumns.domain,
      commonColumns.state,
    ];
  }
  if (focus === FEATURE_TYPES.LOCATIONS) {
    columns = [
      {
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
      {
        field: 'featureKey',
        title: 'Type',
        sorting: true,
        defaultSort: 'desc',
        lookup: Object.fromEntries(
          Array.from(
            new Set(rows.map(row => row.featureKey)),
          ).map(featureKey => [featureKey, getFeatureName(featureKey)]),
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
            <Link
              component="button"
              className={`${classes.linkButton} ${classes.startFlex}`}
            >
              {renderFeatureIcon(featureKey)}
              <span>{featureName}</span>
            </Link>
          );
        },
      },
      commonColumns.latlng,
      {
        field: 'elevation',
        title: 'Elevation',
        sorting: true,
        defaultSort: 'desc',
        filtering: false,
        render: row => (
          <Typography
            variant="caption"
            aria-label="Elevation"
            style={{ fontFamily: 'monospace', fontSize: '1.05em' }}
          >
            {Number.isFinite(row.elevation) ? `${row.elevation.toFixed(2)}m` : '--'}
          </Typography>
        ),
      },
      commonColumns.site,
      commonColumns.domain,
      commonColumns.state,
    ];
  }
  if (selectionActive) { columns.unshift(commonColumns.selected); }

  const handleChangeFocus = (event, newFocus) => {
    if (newFocus && newFocus !== focus) {
      dispatch({ type: 'setTableFocus', focus: newFocus });
    }
  };

  const components = {
    Container: Box,
    Toolbar: props => (
      <div className={classes.toolbarContainer}>
        <MTableToolbar {...props} />
      </div>
      /*
      <div className={classes.toolbarContainer}>
        <ToggleButtonGroup
          exclusive
          color="primary"
          variant="outlined"
          size="small"
          className={classes.toggleButtonGroup}
          value={focus}
          onChange={handleChangeFocus}
        >
          {[FEATURE_TYPES.SITES, FEATURE_TYPES.LOCATIONS].map((key) => {
            const toggleProps = {
              key,
              value: key,
              size: 'small',
              disabled: !availableFeatureTypes[key],
              className: key === focus
                ? `${classes.toggleButton} ${classes.toggleButtonSelected}`
                : classes.toggleButton,
            };
            return <ToggleButton {...toggleProps}>{key}</ToggleButton>;
          })}
        </ToggleButtonGroup>
        <MTableToolbar {...props} />
      </div>
      */
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
    <div ref={tableRef} className={classes.tableContainer}>
      <MaterialTable
        components={components}
        columns={columns}
        data={rows}
        localization={localization}
        title={`${ucWord(focus)} in current view`}
        options={{
          padding: 'dense',
          filtering: true,
          columnsButton: false,
          headerStyle: {
            position: 'sticky',
            top: 0,
            backgroundColor: Theme.palette.grey[50],
          },
          maxBodyHeight: `${maxBodyHeight || MIN_TABLE_MAX_BODY_HEIGHT}px`,
        }}
      />
    </div>
  );
};

export default SiteMapTable;
