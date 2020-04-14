/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import Theme from '../Theme/Theme';
import SiteMap from './SiteMap';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const propRows = [
  {
    prop: 'aspectRatio',
    type: 'number',
    default: '0.75',
    examples: (
      <div>
        <tt>0.5625</tt> (16:9)
        <br />
        <tt>0.5</tt> (2:1)
      </div>
    ),
    description: (
      <div>
        <p>
          Desired map height divided by desired map width. Setting discrete dimensions is not
          supported as Site Map instances will always try to expand to the full width of their
          containing element.
        </p>
        <p>
          Use this prop to control the height indirectly by expressing the
          ratio of height to width such that the shape of the Site Map will remain consistent
          at any viewport size.
        </p>
      </div>
    ),
  },
  {
    prop: 'center',
    type: 'array of exactly two numbers',
    default: '[52.28, -110.75]',
    examples: (
      <div>
        <tt>[33.9, -110.5]</tt> (US southwest)
        <br />
        <tt>[65.85, -151.5]</tt> (Alaska)
      </div>
    ),
    description: (
      <div>
        Array expressing latitude and longitude to set as the initial center of the map.
        Default value is a point chosen to approximately center the entire set of existing
        filed sites in a map at the appropriate zoom level.
      </div>
    ),
  },
  /*
  {
    prop: 'mode',
    type: (
      <div>
        string, one of:
        <br />
        <tt>
          {Object.keys(SITE_MAP_MODES).map(k => <div key={k}>{`"${k}"`}</div>)}
        </tt>
      </div>
    ),
    default: 'EXPLORE',
    description: (
      <div>
        <div>
          Interaction mode for the map.
        </div>
        <div>
          <tt>EXPLORE</tt> - Click site icons to open and persist an exclusive popup containing site
          info and navigation buttons to access the Field Site page of the Explore Data Products
          page with an appropriate filter setting.
        </div>
        <div>
          <tt>SELECT</tt> - Mouse over site icons to open an exclusive popup containing only site
          info (no navigation buttons or other interactive elements). Click sites to toggle their
          selected state.
        </div>
      </div>
    ),
  },
  */
  /*
  {
    prop: 'tileLayer',
    type: (
      <div>
        string, one of:
        <br />
        <tt>
          {Object.keys(TILE_LAYERS).map(k => <div key={k}>{`"${k}"`}</div>)}
        </tt>
      </div>
    ),
    default: '"NatGeo_World_Map"',
    description: (
      <div>
        Initial tile layer for the map (i.e. the visual appearance of the map). Valid values
        are defined in the Site Map <tt>TILE_LAYERS</tt> data structure and include a name, url,
        and attribution strings. This is only the initial layer; a user may change the tile layer
        through stock Leaflet UI once loaded.
      </div>
    ),
  },
  */
  {
    prop: 'zoom',
    type: 'integer',
    default: '3',
    examples: (
      <div>
        <tt>2</tt>, <tt>9</tt>, <tt>17</tt>
      </div>
    ),
    description: (
      <div>
        Initial zoom level for the map. Min and max zoom levels are hard-coded
        to <tt>2</tt> and <tt>17</tt> respectively, so the zoom prop must be equal
        to or between these values. A greater value is a closer zoom.
      </div>
    ),
  },
];

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <React.Fragment>

      <DocBlock>
        A general purpose component for displaying an interactive world map with
        markers for NEON field sites.
      </DocBlock>
      <CodeBlock>
        {`
import SiteMap from 'portal-core-components/lib/components/SiteMap';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        A Site Map can be rendered with no props at all for ease of use. When no props
        are present, a Site Map will assume the following:
      </DocBlock>
      <ul>
        <li>Load site data from the API</li>
        <li>Use a 4:3 (letterbox) aspect ratio at 100% of the width of the containing element</li>
        <li>Start centered and zoomed such that all sites are visible at any map dimensions</li>
        <li><tt>EXPLORE</tt> mode (no selection enabled; popups include links to other pages)</li>
      </ul>

      <ExampleBlock>
        <SiteMap selection="SITES" />
      </ExampleBlock>
      <CodeBlock>
        {`
<SiteMap selection="SITES" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Props</Typography>

      <DocBlock>
        <TableContainer component={Paper} style={{ maxHeight: '70vh' }}>
          <Table stickyHeader aria-label="props">
            <TableHead>
              <TableRow style={{ backgroundColor: Theme.palette.grey[50] }}>
                <TableCell>Prop</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Default</TableCell>
                <TableCell>Examples</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propRows.map(row => (
                <React.Fragment key={row.prop}>
                  <TableRow>
                    <TableCell component="th" scope="row" rowSpan={2}>
                      <tt>{row.prop}</tt>
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell><tt>{row.default}</tt></TableCell>
                    <TableCell>{row.examples ? row.examples : '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>{row.description}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DocBlock>

    </React.Fragment>
  );
}
