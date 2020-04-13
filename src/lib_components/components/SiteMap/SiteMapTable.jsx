/* eslint-disable no-unused-vars */
import React from 'react';

import { isEqual } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
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
  ICON_SVGS,
  FEATURES,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
} from './SiteMapUtils';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  featureIcon: {
    width: '22px',
    height: '22px',
    marginRight: '4px',
    marginBottom: '-6px',
  },
}));

const SiteMapTable = () => {
  const classes = useStyles(Theme);

  // Neon Context State
  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
  const canRender = neonContextIsFinal && !neonContextHasError;

  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { focus, sortColumn, sortDirection } = state.table;

  if (!canRender) { return null; }

  const visibleAttributeCombos = [];
  Object.keys(FEATURES).filter(f => (
    FEATURES[f].hasAttributes === focus
      && state.filters.features.available[f] && state.filters.features.visible[f]
  )).forEach((f) => {
    visibleAttributeCombos.push(FEATURES[f].attributes);
  });

  // Columns that are always visible (on the left
  const permaColumns = [
    {
      key: 'domain',
      label: 'Domain',
      render: row => row.domainCode,
    },
    {
      key: 'state',
      label: 'State',
      render: row => `${allStates[row.stateCode].name} (${row.stateCode})`,
    },
    {
      key: 'site',
      label: 'Site',
      render: (row) => {
        const svg = (
          ICON_SVGS.SITE_MARKERS[row.type] && ICON_SVGS.SITE_MARKERS[row.type][row.terrain]
        ) ? ICON_SVGS.SITE_MARKERS[row.type][row.terrain].BASE : null;
        const icon = !svg ? null : (
          <img alt={`${row.type} ${row.terrain} Site`} src={svg} className={classes.featureIcon} />
        );
        return (
          <React.Fragment>
            {icon}
            {`${row.description} (${row.siteCode})`}
          </React.Fragment>
        );
      },
    },
  ];

  // Used for any single point location (sites and plots)
  const renderCoords = row => (
    <Typography
      variant="caption"
      aria-label="Latitude / Longitude"
      style={{ fontFamily: 'monospace', fontSize: '1.05em' }}
    >
      {row.latitude}
      <br />
      {row.longitude}
    </Typography>
  );

  // Calculate Columns and Rows
  let columns = [];
  let rows = [];
  if (focus === 'SITE') {
    columns = [
      ...permaColumns,
      {
        key: 'coords',
        label: 'Site Lat./Lng.',
        render: renderCoords,
      },
      {
        key: 'siteType',
        label: 'Site Type',
        render: row => row.type,
      },
      {
        key: 'siteTerrain',
        label: 'Site Terrain',
        render: row => row.terrain,
      },
    ];
    rows = Object.keys(allSites)
      .filter((siteCode) => {
        const siteAttributes = (({ type, terrain }) => ({ type, terrain }))(allSites[siteCode]);
        return visibleAttributeCombos.some(attributes => isEqual(attributes, siteAttributes));
      })
      .map(siteCode => ({ ...allSites[siteCode], key: siteCode }));
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
            <TableRow key={row.key}>
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
