/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid, react/no-unescaped-entities, max-len */

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import Theme from '../Theme/Theme';
import SiteMap from './SiteMap';

import {
  MAP_ZOOM_RANGE,
  FEATURE_TYPES,
  BASE_LAYERS,
  VIEWS,
} from './SiteMapUtils';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  appBar: {
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(4),
  },
}));

const propRows = [
  {
    name: 'aspectRatio',
    type: 'number',
    default: 'null',
    examples: (
      <div>
        <tt>0.5625</tt> (16:9)
        <br />
        <tt>0.5</tt> (2:1)
      </div>
    ),
    description: (
      <>
        <p>
          Desired map height divided by desired map width. Setting discrete dimensions is not
          supported as Site Map instances will always try to expand to the full width of their
          containing element.
        </p>
        <p>
          Use this prop to control the height indirectly by expressing the ratio of height to width
          such that the shape of the Site Map will remain consistent at any viewport size. Omitting
          this prop will set aspect ratio dynamically based on viewport size (e.g. wider for larger
          viewports, more square for smaller viewports, taller for very small / phone viewports).
        </p>
      </>
    ),
  },
  {
    name: 'fullscreen',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether the SiteMap should appear in fullscreen mode. Fullscreen mode makes the map
        attempt to fill all horizontal and vertical space available to it and repositions some
        UI elements to have margins more in keeping with a fullscreen layout.
      </p>
    ),
  },
  {
    name: 'location',
    type: 'string',
    default: 'null',
    description: (
      <>
        <p>
          A location code, as it would appear in the locations API, to initialize the focus of the
          map. This can be any site code (e.g. &quot;ABBY&quot;, &quot;CPER&quot;), domain code
          (e.g. &quot;D03&quot;, &quot;D17&quot;), state code (e.g. &quot;CO&quot;, &quot;NY&quot;),
          or even a finer-grain location code for any site feature (e.g.
          &quot;ARIK.AOS.benchmark.2&quot;, &quot;BARR_035.birdGrid.brd&quot;).
        </p>
        <p>
          If set this will override any zoom and/or center props as the focus location will
          determine the zoom and center for the map.
        </p>
      </>
    ),
  },
  {
    name: 'manualLocationData',
    type: (
      <div>
        Array of objects each containing a valid <tt>manualLocationType</tt> attribute
      </div>
    ),
    default: 'null',
    description: (
      <p>
        When supplied this list of locations will show exclusively relative to other locations of
        the same type (e.g. when providing prototype sites all sites not included will not appear).
        The map will also initialize its zoom and bounds to show only the manual locations.
      </p>
    ),
  },
  {
    name: 'mapBaseLayer',
    type: (
      <div>
        string, one of:
        <br />
        <tt>
          {Object.keys(BASE_LAYERS).map((k) => <div key={k}>{`"${k}"`}</div>)}
        </tt>
      </div>
    ),
    default: '"NATGEO_WORLD_MAP"',
    description: (
      <p>
        Initial base tile layer for the map (i.e. the background map). Valid values are defined in
        the Site Map <tt>BASE_LAYERS</tt> data structure and include a name, url, and attribution
        strings. This is only the initial layer; a user may change the tile layer through stock
        Leaflet UI once loaded.
      </p>
    ),
  },
  {
    name: 'mapCenter',
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
      <p>
        Array expressing latitude and longitude to set as the initial center of the map.
        Default value is a point chosen to approximately center the entire set of existing
        filed sites in a map at the appropriate zoom level.
      </p>
    ),
  },
  {
    name: 'mapZoom',
    type: 'integer',
    default: 'null',
    examples: (
      <div>
        <tt>2</tt>, <tt>9</tt>, <tt>17</tt>
      </div>
    ),
    description: (
      <>
        <p>
          Initial zoom level for the map. Min and max zoom levels are hard-coded
          to <tt>{MAP_ZOOM_RANGE[0]}</tt> and <tt>{MAP_ZOOM_RANGE[1]}</tt> respectively, so the zoom
          prop must be equal to or between these values. A greater value is a closer zoom.
        </p>
        <p>
          When undefined, and if the location prop is not set, the initial zoom is dynamically
          derived to ensure all sites are in view given the dynamically derived aspect ratio
          and dimensions of the map component (i.e a larger viewport may have a closer initial
          zoom as there is more pixel space to fit all sites).
        </p>
      </>
    ),
  },
  {
    name: 'onSelectionChange',
    type: 'function',
    default: 'null',
    description: (
      <p>
        A function that fires whenever the selection changes. It should take one argument
        representing the updated selection as a Set (not an array).
      </p>
    ),
  },
  {
    name: 'selectedItems',
    type: 'array of strings',
    default: '[]',
    examples: (
      <div>
        <tt>['ABBY', 'WREF', 'CPER']</tt>
        <br />
        <tt>['JORN']</tt>
      </div>
    ),
    description: (
      <p>
        Array of strings representing IDs of selectable items to show already selected when the
        SiteMap initializes. For example, if <tt>selection</tt> is <tt>"SITES"</tt> then this prop
        should contain siteCode strings.
      </p>
    ),
  },
  {
    name: 'selection',
    type: (
      <div>
        string, one of:
        {Object.keys(FEATURE_TYPES).filter((k) => FEATURE_TYPES[k].selectable).map((k) => (
          <div key={k} style={{ marginTop: '8px' }}>
            <tt>{`"${k}"`}</tt>
          </div>
        ))}
      </div>
    ),
    default: 'null',
    description: (
      <p>
        String representing the feature type to be selectable in the map. All map features are
        grouped into types, and certain types are selectable.
      </p>
    ),
  },
  {
    name: 'selectionLimit',
    type: 'number or array of exactly two numbers',
    default: 'null',
    examples: (
      <div>
        <tt>3</tt>
        <br />
        <tt>[1, 5]</tt>
      </div>
    ),
    description: (
      <>
        <p>
          When selection is active and this prop is null there are no limits on what constitutes a
          valid selection (as long as at least one selectable item is selected). When not null this
          prop enforces limits on that validity.
        </p>
        <p>
          A numeric value will set a discrete selection limit (e.g. a value of <tt>3</tt> means
          that <i>exactly</i> three items must be selected to be valid). An array of two values
          sets a range (e.g. <tt>[1, 5]</tt> will consider a selection anywhere from one item up
          to five items to be valid).
        </p>
        <p>
          For all numeric values for this prop only non-zero positive integers are allowed. For an
          array of two numbers the second number must be greater than (and not equal two) the first.
        </p>
      </>
    ),
  },
  {
    name: 'tableFullHeight',
    type: 'boolean',
    default: 'false',
    description: (
      <>
        <p>
          Whether the table view of the SiteMap should be unbounded by the aspect ratio restrictions
          of the map view and be allowed to extend to arbitrarirly large vertical height. This also
          changes the options offered for table page size with the largest size going up to 100 and
          that max size selected by default.
        </p>
        <p>
          It recommended to keep this false when <tt>fullScreen</tt> is true as it may make some
          table rows and the table pager impossible to reach.
        </p>
      </>
    ),
  },
  {
    name: 'unusableVerticalSpace',
    type: 'integer',
    default: '0',
    examples: (
      <div>
        <tt>50</tt>, <tt>100</tt>, <tt>200</tt>
      </div>
    ),
    description: (
      <>
        <p>
          Dynamic aspect ratio is based on window innerHeight and innerWidth. In sitautions where the
          available height or width differs this value can be used to still have a dynamic aspect
          ratio but one that respects the actual available space on the page.
        </p>
        <p>
          As an example, consider a page rendering a SiteMap that has a sticky header with a height
          of 150 pixels. Typically the SiteMap would not know about this, so the aspect ratio tuned
          to the total height of the page may render a SiteMap that is too tall to fit in the
          available content area at any viewport size. Setting this prop to <tt>150</tt> would then
          inform the aspect ratio calculation and at all viewport sizes the SiteMap should end up
          with a height that vertically fits in the scrollable area.
        </p>
      </>
    ),
  },
  {
    name: 'validItems',
    type: 'array of strings',
    default: '[]',
    examples: (
      <div>
        <tt>['ABBY', 'WREF', 'CPER']</tt>
        <br />
        <tt>['JORN']</tt>
      </div>
    ),
    description: (
      <p>
        Array of strings representing IDs of selectable items. If non-empty this will be interpreted
        as a subset of the set of all items for the selectable type that are enabled for selection.
        Any items not represented in <tt>validItems</tt> will appear ghosted and will not be
        selectable.
      </p>
    ),
  },
  {
    name: 'view',
    type: (
      <div>
        string, one of:
        <br />
        <tt>
          {Object.keys(VIEWS).map((k) => <div key={k}>{`"${k.toLowerCase()}"`}</div>)}
        </tt>
      </div>
    ),
    default: '"map"',
    description: (
      <p>
        Initial view mode for the SiteMap component.
      </p>
    ),
  },
];

const manualLocationData = [
  {
    manualLocationType: 'PROTOTYPE_SITE',
    domain: 'D04',
    state: 'FL',
    siteCode: 'MAME',
    siteName: 'Mameyes',
    latitude: 18.02192,
    longitude: -66.61391,
  },
  {
    manualLocationType: 'PROTOTYPE_SITE',
    domain: 'D08',
    state: 'OK',
    siteCode: 'BLUE',
    siteName: 'Blue River',
    latitude: 34.444218,
    longitude: -96.624201,
  },
  {
    manualLocationType: 'PROTOTYPE_SITE',
    domain: 'D03',
    state: 'GA',
    siteCode: 'ICHA',
    siteName: 'Ichawaynochaway Creek',
    latitude: 31.199,
    longitude: -84.467,
  },
];

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const [tabValue, setTabValue] = useState(0);

  return (
    <>

      <DocBlock>
        An all-inclusive interactive map for geographically visualizing the NEON observatory at
        any scale.
      </DocBlock>
      <CodeBlock>
        {`
import SiteMap from 'portal-core-components/lib/components/SiteMap';
        `}
      </CodeBlock>
      <DocBlock>
        <b>Note:</b> Do not embed a SiteMap in a node that may be hidden. The Leaflet map relies on
        having discrete non-zero width and height in order to initially render properly. If a
        SiteMap is rendred in a component that may begin hidden the map itself will present
        unrecoverable tiling errors.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Examples</Typography>

      <DocBlock>
        The <tt>SiteMap</tt> component has a broad variety of different modes for different use
        cases. Use the tabs below to toggle between examples showing a few different combinations
        of props.
      </DocBlock>

      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          value={tabValue}
          onChange={(event, newTabValue) => { setTabValue(newTabValue); }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Basic" />
          <Tab label="Zoom" />
          <Tab label="Selection" />
          <Tab label="Focus Location" />
          <Tab label="Full Height Table" />
          <Tab label="Manual Locations" />
          <Tab label="Split View" />
        </Tabs>
      </AppBar>

      {/* 0: Basic */}
      {tabValue !== 0 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Basic</Typography>
          <DocBlock>
            Embedding a basic SiteMap requires no props to get the default observatory-scale view with
            automatic sizing and aspect ratio based on the current viewport.
          </DocBlock>
          <ExampleBlock>
            <SiteMap mapUniqueId={1} />
          </ExampleBlock>
          <CodeBlock>
            {`
<SiteMap />
          `}
          </CodeBlock>
        </div>
      )}

      {/* 1: Basic */}
      {tabValue !== 1 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Zoom</Typography>
          <DocBlock>
            Preset zoom value via the mapZoom property.
          </DocBlock>
          <ExampleBlock>
            <SiteMap mapZoom={13} mapCenter={[44.95011, -110.58715]} mapUniqueId={2} />
          </ExampleBlock>
          <CodeBlock>
            {`
<SiteMap mapZoom={13} mapCenter={[44.95011, -110.58715]} />
          `}
          </CodeBlock>
        </div>
      )}

      {/* 2: Selection */}
      {tabValue !== 2 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Selection</Typography>
          <DocBlock>
            The SiteMap supports selection workflows for some feature types. See
            the <Link href="#MapSelectionButton">Map Selection Button</Link> documentation
            for details and more varied examples.
          </DocBlock>
          <ExampleBlock>
            <SiteMap selection="SITES" mapUniqueId={3} />
          </ExampleBlock>
          <CodeBlock>
            {`
<SiteMap selection="SITES" />
          `}
          </CodeBlock>
        </div>
      )}

      {/* 3: Focus Location */}
      {tabValue !== 3 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Focus Location</Typography>
          <DocBlock>
            Use the <tt>location</tt> prop to initialize the Site Map on a particular location. Any
            valid location name will work so long as it is represented in the locations API with a
            geographical point (latitude and longitude). Additionally all Domain codes and US state
            codes are also supported.
          </DocBlock>
          <ExampleBlock>
            <SiteMap location="D08" mapUniqueId={4} />
          </ExampleBlock>
          <CodeBlock>
            {`
<SiteMap location="D08" />
        `}
          </CodeBlock>
        </div>
      )}

      {/* 4: Full Height Table */}
      {tabValue !== 4 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Full Height Table</Typography>
          <DocBlock>
            Use the <tt>tableFullHeight</tt> prop to allow for the table view to be unbounded by the
            aspect ratio limitations imposed on the map. The result is, when switching into table view,
            the height of the component may grow arbitrarily large with table content. Larger table page
            sizes are also afforded.
          </DocBlock>
          <ExampleBlock>
            <SiteMap tableFullHeight mapUniqueId={5} />
          </ExampleBlock>
          <CodeBlock>
            {`
<SiteMap tableFullHeight />
        `}
          </CodeBlock>
        </div>
      )}

      {/* 5: Manual Locations */}
      {tabValue !== 5 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Manual Locations</Typography>
          <DocBlock>
            In some circumstances it is useful to pass the SiteMap a discrete list of locations for
            exclusive display. This is done using the the <tt>manualLocationData</tt> prop. This should
            be an array of objects that each has a <tt>manualLocationType</tt> attribute. The SiteMap
            has an explicit list of supported values for this attribute that help it determine how to
            process each manual location. Presently only <tt>&quot;PROTOTYPE_SITE&quot;</tt> is
            supported.
          </DocBlock>
          <ExampleBlock>
            <SiteMap manualLocationData={manualLocationData} mapUniqueId={6} />
          </ExampleBlock>
          <CodeBlock>
            {`
const manualLocationData = [
  {
    manualLocationType: 'PROTOTYPE_SITE',
    domain: 'D04',
    state: 'FL',
    siteCode: 'MAME',
    siteName: 'Mameyes',
    latitude: 18.02192,
    longitude: -66.61391,
  },
  {
    manualLocationType: 'PROTOTYPE_SITE',
    domain: 'D08',
    state: 'OK',
    siteCode: 'BLUE',
    siteName: 'Blue River',
    latitude: 34.444218,
    longitude: -96.624201,
  },
  {
    manualLocationType: 'PROTOTYPE_SITE',
    domain: 'D03',
    state: 'GA',
    siteCode: 'ICHA',
    siteName: 'Ichawaynochaway Creek',
    latitude: 31.199,
    longitude: -84.467,
  },
];

return (
  <SiteMap manualLocationData={manualLocationData} />
);
        `}
          </CodeBlock>
        </div>
      )}

      {/* 6: Split View */}
      {tabValue !== 6 ? null : (
        <div role="tabpanel">
          <Typography variant="h4" component="h2" gutterBottom>Split View</Typography>
          <DocBlock>
            For some applications it may be preferable to see the map and table simultaneously. This
            can be achieved by setting the <tt>view</tt> prop to <tt>&quot;split&quot;</tt>. Both
            map and table will still be linked such that only sites or locations visible in the
            map will be visible in the table.
          </DocBlock>
          <ExampleBlock>
            <SiteMap view="split" mapUniqueId={7} />
          </ExampleBlock>
          <CodeBlock>
            {`
<SiteMap view="split" />
          `}
          </CodeBlock>
        </div>
      )}

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} fullHeight />
      </DocBlock>
    </>
  );
}
