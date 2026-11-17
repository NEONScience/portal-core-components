import React, { useState } from 'react';

import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import DataProductAvailability from '@/components/DataProductAvailability/DataProductAvailability';
import {
  SVG,
  VALID_ENHANCED_STATUSES,
  AVAILABILITY_COLOR_SCHEMES,
  AVAILABILITY_COLOR_SCHEME_LABELS,
  DEFAULT_AVAILABILITY_COLOR_SCHEME,
} from '@/components/DataProductAvailability/AvailabilityUtils';
import {
  NEON_GREEN_PALETTE,
  COLOR_VISION_ACCESSIBLE_PALETTE,
  JsxCell,
  SvgDefs,
} from '@/components/DataProductAvailability/AvailabilitySvgComponents';
import DownloadDataContext from '@/components/DownloadDataContext/DownloadDataContext';
import { makeStyles } from '@/components/Theme/makeStyles';
import { NeonTheme } from '@/components/Theme/types';
import { Nullable } from '@/types/core';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import sampleProductData from '../../../sampleData/DP1.00001.001.json';
import sampleSiteData from '../../../sampleData/CPER.json';
import sampleAvaProvData from '../../../sampleData/DP4.00130.001.release.prov.json';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  demoOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(2, 3),
    marginBottom: theme.spacing(3),
  },
  fetchSelections: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(2, 3),
    flex: '1 1 100%',
  },
  fetchSelection: {
    flex: '1 1 320px',
    minWidth: 0,
  },
  demoProps: {
    margin: theme.spacing(0, 0, 3, 0),
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    fontSize: '0.8125rem',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
}));

// <tt> is not a JSX intrinsic element in TypeScript, but DocBlock styles inline code with it
const Tt = ({ children }: { children: React.ReactNode }) => React.createElement('tt', null, children);

const { NEON_GREEN, COLOR_VISION_ACCESSIBLE } = AVAILABILITY_COLOR_SCHEMES;

type Status = keyof typeof VALID_ENHANCED_STATUSES;

interface NeonGreenStatus {
  status: Status;
  colorName: string;
  color: string;
}
const NEON_GREEN_STATUSES: NeonGreenStatus[] = [
  { status: 'available', colorName: 'Dark green', color: NEON_GREEN_PALETTE.AVAILABLE },
  {
    status: 'available-provisional',
    colorName: 'Dark green diagonal stripes',
    color: NEON_GREEN_PALETTE.AVAILABLE,
  },
  { status: 'expected', colorName: 'Light green', color: NEON_GREEN_PALETTE.EXPECTED },
  { status: 'partial', colorName: 'Yellow', color: NEON_GREEN_PALETTE.PARTIAL },
  { status: 'tentative', colorName: 'Blue', color: NEON_GREEN_PALETTE.POTENTIAL },
  { status: 'not collected', colorName: 'Dark gray', color: NEON_GREEN_PALETTE.NOT_COLLECTED },
  { status: 'not expected', colorName: 'Light gray', color: NEON_GREEN_PALETTE.NOT_PLANNED },
];

interface ColorVisionAccessibleStyle {
  style: string;
  statuses: {
    status: Status;
    colorName: string;
    colors: string[];
  }[];
}
const {
  AVAILABLE,
  EXPECTED,
  POTENTIAL,
  NOT_PLANNED,
  NOT_COLLECTED,
  NOT_AVAILABLE,
} = COLOR_VISION_ACCESSIBLE_PALETTE;
const COLOR_VISION_ACCESSIBLE_STYLES: ColorVisionAccessibleStyle[] = [
  {
    style: 'Solid: final statuses',
    statuses: [
      { status: 'available', colorName: 'NEON blue', colors: [AVAILABLE] },
      { status: 'not collected', colorName: 'Dark gold', colors: [NOT_COLLECTED] },
      { status: 'not available', colorName: 'Light gray', colors: [NOT_AVAILABLE] },
    ],
  },
  {
    style: 'Striped with a thin border: partial versions of a solid status, in the same color',
    statuses: [
      { status: 'available-provisional', colorName: 'NEON blue stripes', colors: [AVAILABLE] },
      { status: 'partial', colorName: 'Dark gold stripes', colors: [NOT_COLLECTED] },
    ],
  },
  {
    style: 'Outlined: future statuses, darkest for the most certain',
    statuses: [
      { status: 'expected', colorName: 'Dark NEON blue', colors: [EXPECTED] },
      { status: 'tentative', colorName: 'Bronze', colors: [POTENTIAL] },
      { status: 'not expected', colorName: 'Gray', colors: [NOT_PLANNED] },
    ],
  },
  {
    style: 'Split diagonally: mixed statuses, half each of the statuses they mix',
    statuses: [
      {
        status: 'mixed-available-provisional',
        colorName: 'NEON blue and NEON blue stripes',
        colors: [AVAILABLE],
      },
      {
        status: 'mixed some availability',
        colorName: 'NEON blue and dark gold',
        colors: [AVAILABLE, NOT_COLLECTED],
      },
      {
        status: 'mixed no availability',
        colorName: 'Light gray and dark gold',
        colors: [NOT_AVAILABLE, NOT_COLLECTED],
      },
    ],
  },
];

const StatusCell = ({ status, colorScheme }: { status: Status; colorScheme: string }) => (
  <svg
    width={SVG.CELL_WIDTH}
    height={SVG.CELL_HEIGHT}
    style={{ verticalAlign: 'middle', marginRight: '8px' }}
  >
    <JsxCell status={status} colorScheme={colorScheme} />
  </svg>
);

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ExclusiveToggleProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  labelId: string;
  size: 'small' | 'medium' | 'large';
}

const ExclusiveToggle = <T extends string>(props: ExclusiveToggleProps<T>) => {
  const {
    value,
    options,
    onChange,
    labelId,
    size,
  } = props;
  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      size={size}
      value={value}
      aria-labelledby={labelId}
      onChange={(event: React.MouseEvent<HTMLElement>, newValue: Nullable<T>) => {
        // Clicking the selected button would otherwise leave nothing selected
        if (newValue) { onChange(newValue); }
      }}
    >
      {options.map((option: ToggleOption<T>) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const COLOR_SCHEME_OPTIONS: ToggleOption<string>[] = Object.values(AVAILABILITY_COLOR_SCHEMES)
  .map((value: string) => ({ value, label: AVAILABILITY_COLOR_SCHEME_LABELS[value] }));

interface ColorSchemeToggleProps {
  colorScheme: string;
  onChange: (colorScheme: string) => void;
  labelId: string;
  size: 'small' | 'medium' | 'large';
}

const ColorSchemeToggle = (props: ColorSchemeToggleProps) => {
  const {
    colorScheme,
    onChange,
    labelId,
    size,
  } = props;
  return (
    <ExclusiveToggle
      value={colorScheme}
      options={COLOR_SCHEME_OPTIONS}
      onChange={onChange}
      labelId={labelId}
      size={size}
    />
  );
};

const sites = ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];
const dateRange = ['2018-01', '2018-12'];

export default function StyleGuide() {
  const { classes } = useStyles();
  const [colorScheme, setColorScheme] = useState<string>(DEFAULT_AVAILABILITY_COLOR_SCHEME);

  const DownloadDataContextLink = (
    <Link href="#DownloadDataContext">
      DownloadDataContext
    </Link>
  );

  const DownloadDataButtonLink = (
    <Link href="#DownloadDataButton">
      DownloadDataButton
    </Link>
  );

  return (
    <>

      <DocBlock>
        A visualization of all available data for a given data product over time.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        A DataProductAvailability visualization needs only a <Tt>siteCodes</Tt> prop
        to be invoked. This is an array of objects each containing a <Tt>siteCode</Tt>&nbsp;
        string and an <Tt>availableMonths</Tt> array of year-months strings of the
        format <Tt>&quot;YYYY-MM&quot;</Tt>, conforming to the schema used in the data
        products API response.
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability
          siteCodes={sampleProductData.data.siteCodes}
          colorScheme={colorScheme}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [
  {
    "siteCode": "ABBY",
    "availableMonths": [ "2016-04", "2016-05", ... ],
  },
  {
    "siteCode": "BART",
    "availableMonths": [ "2014-10", "2014-12", ... ],
  },
  ...
];

<DataProductAvailability siteCodes={siteCodes} />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Color Scheme</Typography>

      <DocBlock>
        Statuses can be drawn in one of three color schemes with the <Tt>colorScheme</Tt> prop:
        <ul>
          <li>
            <Tt>neonBlue</Tt> (default), <b>NEON Blue</b>: blue available data, with outlined cells
            for most statuses without data.
          </li>
          <li>
            <Tt>neonGreen</Tt>, <b>NEON Green</b>: every status is filled with its own color.
            Released data are a solid fill and provisional data are 45° diagonal stripes.
          </li>
          <li>
            <Tt>colorVisionAccessible</Tt>, <b>Color Vision Accessible</b>: NEON blue, gold, and
            gray, where the fill style of every status carries its meaning as well as its color,
            so statuses remain distinguishable.
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        NEON Green colors:
        <ul>
          {NEON_GREEN_STATUSES.map(({ status, colorName, color }) => (
            <li key={status}>
              <StatusCell status={status} colorScheme={NEON_GREEN} />
              <b>{VALID_ENHANCED_STATUSES[status].title}</b>
              {`: ${colorName} `}
              <Tt>{color}</Tt>
            </li>
          ))}
        </ul>
        Statuses without a NEON Green color (Not Available and No Longer Available) look the same
        as in the NEON Blue scheme. Mixed statuses use the same patterns as the NEON Blue scheme in
        NEON Green colors.
      </DocBlock>
      <DocBlock>
        Color Vision Accessible fill styles and colors:
        <SvgDefs colorScheme={COLOR_VISION_ACCESSIBLE} />
        <ul>
          {COLOR_VISION_ACCESSIBLE_STYLES.map(({ style, statuses }) => (
            <li key={style}>
              {style}
              <ul>
                {statuses.map(({ status, colorName, colors }) => (
                  <li key={status}>
                    <StatusCell status={status} colorScheme={COLOR_VISION_ACCESSIBLE} />
                    <b>{VALID_ENHANCED_STATUSES[status].title}</b>
                    {`: ${colorName} `}
                    {colors.map((color: string, idx: number) => (
                      <React.Fragment key={color}>
                        {idx > 0 ? ' and ' : null}
                        <Tt>{color}</Tt>
                      </React.Fragment>
                    ))}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        No Longer Available looks the same as in the NEON Blue scheme. Statuses drawn in the same
        fill style differ in lightness as well as hue, as differences in lightness remain with
        color vision deficiency, and with none at all.
      </DocBlock>
      <DocBlock>
        Color schemes are listed in <Tt>AVAILABILITY_COLOR_SCHEMES</Tt>, with their names
        in <Tt>AVAILABILITY_COLOR_SCHEME_LABELS</Tt>, both exported from <Tt>AvailabilityUtils</Tt>.
        Charts without a <Tt>colorScheme</Tt> prop
        use <Tt>DEFAULT_AVAILABILITY_COLOR_SCHEME</Tt>, so changing it there changes the color
        scheme of every availability chart.
      </DocBlock>
      <DocBlock>
        The toggle below switches the color scheme of every example on this page.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <Typography
              variant="h6"
              id="availability-color-scheme-label"
              style={{ marginRight: '16px' }}
            >
              Color Scheme
            </Typography>
            <ColorSchemeToggle
              colorScheme={colorScheme}
              onChange={setColorScheme}
              labelId="availability-color-scheme-label"
              size="small"
            />
          </div>
          <DataProductAvailability
            delineateRelease
            siteCodes={sampleAvaProvData.data.siteCodes}
            colorScheme={colorScheme}
          />
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [...];

<DataProductAvailability
  delineateRelease
  siteCodes={siteCodes}
  colorScheme="colorVisionAccessible"
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Initial View</Typography>

      <DocBlock>
        The DataProductAvailability visualization can present data over time with
        different categorical rollups (e.g. broken out by site, domain, state, or
        summarized into one row) called <b>views</b>. The view to load on mount can
        be specified with the <Tt>view</Tt> prop.
      </DocBlock>
      <DocBlock>
        Valid views: <Tt>summary</Tt>, <Tt>sites</Tt>, <Tt>states</Tt>, <Tt>domains</Tt>, <Tt>ungrouped</Tt>
      </DocBlock>
      <DocBlock>
        Default view: <Tt>summary</Tt>
      </DocBlock>
      <DocBlock>
        <b>NOTE:</b> When a DataProductAvailability visualization is rendered inside
        an active {DownloadDataContextLink} (see below) then the state for the view is
        mirrored to the context as a part of broader state for the entire download
        workflow. The context can also take a specified view for the availability chart.
        If both are specified and different then the context will supercede
        the <Tt>view</Tt> prop on the DataProductAvailability node.
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability
          siteCodes={sampleProductData.data.siteCodes}
          view="domains"
          colorScheme={colorScheme}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [...];

<DataProductAvailability
  siteCodes={siteCodes}
  view="domains"
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Ungrouped View and Sorting</Typography>

      <DocBlock>
        An alternate view for the availabiliy chart is <Tt>ungrouped</Tt>.
        This view is essentially the same as the <Tt>sites</Tt> view in that
        each row is one site, but the label for each also includes state and
        domain values.
      </DocBlock>
      <DocBlock>
        Only in this view is sorting rows afforded. The <b>View Options</b> are
        replaced by <b>Sort Options</b>. Initial sort dimension and direction can
        also be provided by way of the <Tt>sortMethod</Tt> and <Tt>sortDirection</Tt> props.
        By default, when using the ungrouped view mode, the sort method will
        be <Tt>&quot;states&quot;</Tt> and the direction will be <Tt>&quot;ASC&quot;</Tt>.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <h4>Ungrouped, initial sort by domain, descending:</h4>
          <DataProductAvailability
            siteCodes={sampleProductData.data.siteCodes}
            view="ungrouped"
            sortMethod="domains"
            sortDirection="DESC"
            colorScheme={colorScheme}
          />
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [...];

<h4>Ungrouped, initial sort by domain, descending:</h4>
<DataProductAvailability
  siteCodes={siteCodes}
  view="ungrouped"
  sortMethod="domains"
  sortDirection="DESC"
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Site Centric View</Typography>

      <DocBlock>
        The DataProductAvailability visualization can present data over time with
        a site centric view, showing product availability at a particular site.
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability
          dataProducts={sampleSiteData.data.dataProducts}
          view="products"
          colorScheme={colorScheme}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const dataProducts = [...];

<DataProductAvailability
  dataProducts={dataProducts}
  view="products"
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Using a Download Context</Typography>

      <DocBlock>
        The DataProductAvailability visualization affords the ability to select
        one or more sites and a date range. This selection is typically tied to
        a download workflow.
      </DocBlock>
      <DocBlock>
        Selection is automatically enabled when the DataProductAvailability component
        is rendered inside a {DownloadDataContextLink}, provided that the product data
        associated with the context is valid and the nature of the product requires
        site and date range selection.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider productData={sampleProductData.data} downloadDataContextUniqueId={0}>
          <DataProductAvailability colorScheme={colorScheme} />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {
  productCode: 'DPX.0000X.00X',
  productName: 'Sample Data Product',
  siteCodes: [
    {
      "siteCode": "ABBY",
      "availableMonths": [ "2016-04", "2016-05", ... ],
    },
    {
      "siteCode": "BART",
      "availableMonths": [ "2014-10", "2014-12", ... ],
    },
    ...
  ],
  ...
};

<DownloadDataContext.Provider productData={productData}>
  <DataProductAvailability />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Setting Initial View</Typography>

      <DocBlock>
        The DataProductAvailability visualization can present data over time with
        different categorical rollups (e.g. broken out by site, domain, state, or
        summarized into one row) called <b>views</b>. The view to load on mount
        can  be specified with the <Tt>availabilityView</Tt> prop provided to
        the {DownloadDataContextLink}.
      </DocBlock>
      <DocBlock>
        This creates a scenario where view can be defined in more than one place--on the context
        and on the availability chart within the context. If both are set then the most local prop
        will win (so the chart prop with override the context prop).
      </DocBlock>
      <DocBlock>
        Valid views: <Tt>summary</Tt>, <Tt>sites</Tt>, <Tt>states</Tt>, <Tt>domains</Tt>, <Tt>ungrouped</Tt>
      </DocBlock>
      <DocBlock>
        Default view: <Tt>summary</Tt>
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider
          productData={sampleProductData.data}
          availabilityView="domains"
          downloadDataContextUniqueId={1}
        >
          <DataProductAvailability colorScheme={colorScheme} />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {...};

<DownloadDataContext.Provider
  productData={productData}
  availabilityView="domains"
>
  <DataProductAvailability />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Setting Initial Selection</Typography>

      <DocBlock>
        Pass a <Tt>sites</Tt> and/or a <Tt>dateRange</Tt> prop to a DataProductAvailability
        rendered inside a {DownloadDataContextLink} where site/dateRange selection is
        required in order to initialize the chart with a selection already in place.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider
          productData={sampleProductData.data}
          sites={sites}
          dateRange={dateRange}
          downloadDataContextUniqueId={2}
        >
          <DataProductAvailability delineateRelease colorScheme={colorScheme} />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {...};
const sites: ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];
const dateRange: ['2018-01', '2018-12'];

<DownloadDataContext.Provider
  productData={productData}
  sites={sites}
  dateRange={dateRange}
>
  <DataProductAvailability />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>
        Disabling Selection Inside a Download Context
      </Typography>

      <DocBlock>
        Sometimes a Data Product Availability chart needs to be displayed inside
        a {DownloadDataContextLink} but selection should not be afforded. A typical use case might
        be where the chart is presented as read-only with an adjacent {DownloadDataButtonLink}.
        This can be achieved with the <Tt>disableSelection</Tt> boolean prop.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider productData={sampleProductData.data} downloadDataContextUniqueId={3}>
          <DataProductAvailability disableSelection colorScheme={colorScheme} />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {...};

<DownloadDataContext.Provider productData={productData}>
  <DataProductAvailability disableSelection />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Availability Provisional Rollup</Typography>

      <DocBlock>
        The DataProductAvailability visualization can show various status types
        for provisional and released available data and provide a rollup status when grouped.
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability
          delineateRelease
          siteCodes={sampleAvaProvData.data.siteCodes}
          colorScheme={colorScheme}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [...];

<DataProductAvailability
  delineateRelease
  siteCodes={siteCodes}
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Availability Status Types</Typography>

      <DocBlock>
        The DataProductAvailability visualization can show various status types
        to adapt to different kinds of availability displays.
      </DocBlock>
      <DocBlock>
        Valid status types: <Tt>available</Tt>, <Tt>tombstoned</Tt>
      </DocBlock>
      <DocBlock>
        Default view: <Tt>available</Tt>
      </DocBlock>
      <DocBlock>
        The availability status type shown below is <Tt>tombstoned</Tt>
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability
          siteCodes={sampleProductData.data.siteCodes}
          availabilityStatusType="tombstoned"
          view="ungrouped"
          sortMethod="sites"
          sortDirection="DESC"
          colorScheme={colorScheme}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [...];

<DataProductAvailability
  siteCodes={siteCodes}
  availabilityStatusType="tombstoned"
  view="ungrouped"
  sortMethod="sites"
  sortDirection="DESC"
/>
        `}
      </CodeBlock>

    </>
  );
}
