/* eslint-disable jsx-a11y/anchor-is-valid, no-unused-vars */
import React from 'react';

import { isEqual } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import {
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  FEATURES,
  FEATURE_TYPES,
  SELECTABLE_FEATURE_TYPES,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
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
  },
  linkButton: {
    textAlign: 'left',
  },
  row: {},
  rowSelected: {
    backgroundColor: `${Theme.palette.secondary.main}20`,
  },
  startFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));

const SiteMapTable = () => {
  const classes = useStyles(Theme);

  // Neon Context State
  const [{ isFinal, hasError }] = NeonContext.useNeonContextState();
  const canRender = isFinal && !hasError;

  // Site Map State
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { focus, sortColumn, sortDirection } = state.table;
  const selectionActive = state.selection.active === focus;
  const selection = selectionActive ? state.selection[state.selection.active] : new Set();

  if (!canRender) { return null; }

  const visibleAttributeCombos = [];
  Object.keys(FEATURES).filter(f => (
    FEATURES[f].type === focus
      && state.filters.features.available[f] && state.filters.features.visible[f]
  )).forEach((f) => {
    visibleAttributeCombos.push(FEATURES[f].attributes);
  });

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

  // Columns that are visible for more than one feature type
  const commonColumns = {
    site: {
      key: 'site',
      label: 'Site',
      render: (row) => {
        const site = getSite(row);
        if (!site) { return null; }
        const featureKey = `${site.terrain.toUpperCase()}_${site.type.toUpperCase()}_SITES`;
        const svg = FEATURES[featureKey] ? FEATURES[featureKey].iconSvg : null;
        const icon = !svg ? null : (
          <img alt={`${site.type} ${site.terrain} Site`} src={svg} className={classes.featureIcon} />
        );
        return (
          <Link
            component="button"
            className={`${classes.linkButton} ${classes.startFlex}`}
            onClick={() => jumpTo(site.siteCode)}
          >
            {icon}
            <span>{`${site.description} (${site.siteCode})`}</span>
          </Link>
        );
      },
    },
    domain: {
      key: 'domain',
      label: 'Domain',
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
      key: 'state',
      label: 'State',
      render: (row) => {
        const usstate = getState(row);
        return !usstate ? null : (
          <Link
            component="button"
            className={classes.linkButton}
            onClick={() => jumpTo(usstate.stateCode)}
          >
            {`${usstate.name} (${usstate.stateCode})`}
          </Link>
        );
      },
    },
    selected: {
      key: 'selected',
      label: '',
      render: row => (
        <Checkbox
          checked={rowIsSelected(row)}
          onChange={selectRow}
          color="secondary"
        />
      ),
    },
    latlng: {
      key: 'latlng',
      label: 'Lat./Lng.',
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
     Calculate columns and rows from current focus feature type
  */
  let columns = [];
  let rows = [];

  // SITES
  if (focus === FEATURE_TYPES.SITES) {
    columns = [
      commonColumns.site,
      commonColumns.latlng,
      {
        key: 'siteType',
        label: 'Type',
        render: row => ucWord(row.type),
      },
      {
        key: 'siteTerrain',
        label: 'Terrain',
        render: row => ucWord(row.terrain),
      },
      commonColumns.domain,
      commonColumns.state,
    ];
    if (selectionActive) { columns.unshift(commonColumns.selected); }
    rows = Object.keys(state.sites)
      .filter((siteCode) => {
        const siteAttributes = (({ type, terrain }) => ({ type, terrain }))(state.sites[siteCode]);
        return visibleAttributeCombos.some(attributes => isEqual(attributes, siteAttributes));
      })
      .map(siteCode => ({ ...state.sites[siteCode], key: siteCode }));
  }

  // LOCATIONS
  if (focus === FEATURE_TYPES.LOCATIONS) {
    columns = [];
    if (selectionActive) { columns.unshift(commonColumns.selected); }
  }

  /**
     Render Table
  */
  return (
    <TableContainer className={classes.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.key}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.key} className={classes[rowIsSelected(row) ? 'rowSelected' : 'row']}>
              {columns.map(column => (
                <TableCell key={column.key}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SiteMapTable;
