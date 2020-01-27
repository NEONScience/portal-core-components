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

import SiteMap, { TILE_LAYERS } from './SiteMap';
import Theme from '../Theme/Theme';

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
  {
    prop: 'popupExploreDataProductsButton',
    type: 'boolean',
    default: 'true',
    description: (
      <div>
        Whether to show an <i>Explore Data Products</i> button in the popup
        (info section that appears when a site is clicked) for a given site. When
        enabled the rendered button will link to the Explore Data Products page with
        only the individual site set in the sites filter.
      </div>
    ),
  },
  {
    prop: 'popupHrefNew',
    type: 'boolean',
    default: 'true',
    description: (
      <div>
        <p>
          Whether buttons in popups that behave as links (such
          as <i>Explore Data Products</i>, <i>Site Details</i>, etc.) open their targets
          in a new window.
        </p>
        <p>
          Being <tt>true</tt> by default said buttons will open in a new window with a
          blank target. Set to <tt>false</tt> to stay in the same window where the map
          is displayed when such buttons are clicked.
        </p>
      </div>
    ),
  },
  {
    prop: 'sites',
    type: 'array or object',
    default: 'null',
    description: (
      <div>
        <p>
          Data structure containing all sites to show in the map. This prop is provided as a means
          to prevent unnecessary API calls or to show a subset of all sites.
        </p>
        <p>
          By default, when <tt>sites</tt> is <tt>null</tt>, the Site Map will fetch all sites data
          from the API. If the Site Map instance is the only one on the page this is usually
          desired, but if there are several potential Site Map instances dynamically rendered in
          the course of a page session it may make sense to perform the sites API fetch at the page
          level and pass the value in using this prop for every newly generated Site Map instance.
        </p>
      </div>
    ),
  },
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
        <li>Include a button to Explore Data Products in site popups</li>
        <li>Have all site popup links open in a new window</li>
      </ul>

      <ExampleBlock>
        <SiteMap />
      </ExampleBlock>
      <CodeBlock>
        {`
<SiteMap />
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
