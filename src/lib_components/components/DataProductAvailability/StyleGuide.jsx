/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid, max-len */

import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DataProductAvailability from './DataProductAvailability';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import Theme from '../Theme/Theme';

import sampleProductData from '../../../sampleData/DP1.00001.001.json';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const sites = ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];
const dateRange = ['2018-01', '2018-12'];

export default function StyleGuide(props) {
  const classes = useStyles(Theme);
  const { onClickHash } = props;

  const DownloadDataContextLink = (
    <Link href="#DownloadDataContext" onClick={() => onClickHash('#DownloadDataContext')}>
      DownloadDataContext
    </Link>
  );

  const DownloadDataButtonLink = (
    <Link href="#DownloadDataButton" onClick={() => onClickHash('#DownloadDataButton')}>
      DownloadDataButton
    </Link>
  );

  return (
    <React.Fragment>

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
        A DataProductAvailability visualization needs only a <tt>siteCodes</tt> prop
        to be invoked. This is an array of objects each containing a <tt>siteCode</tt>&nbsp;
        string and an <tt>availableMonths</tt> array of year-months strings of the
        format <tt>&quot;YYYY-MM&quot;</tt>, conforming to the schema used in the data
        products API response.
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability siteCodes={sampleProductData.data.siteCodes} />
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
      <Typography variant="h6" component="h4" gutterBottom>Initial View</Typography>

      <DocBlock>
        The DataProductAvailability visualization can present data over time with
        different categorical rollups (e.g. broken out by site, domain, state, or
        summarized into one row) called <b>views</b>. The view to load on mount can
        be specified with the <tt>view</tt> prop.
      </DocBlock>
      <DocBlock>
        Valid views: <tt>summary</tt>, <tt>sites</tt>, <tt>states</tt>, <tt>domains</tt>, <tt>ungrouped</tt>
      </DocBlock>
      <DocBlock>
        Default view: <tt>summary</tt>
      </DocBlock>
      <DocBlock>
        <b>NOTE:</b> When a DataProductAvailability visualization is rendered inside
        an active {DownloadDataContextLink} (see below) then the state for the view is
        mirrored to the context as a part of broader state for the entire download
        workflow. The context can also take a specified view for the availability chart.
        If both are specified and different then the context will supercede
        the <tt>view</tt> prop on the DataProductAvailability node.
      </DocBlock>
      <ExampleBlock>
        <DataProductAvailability
          siteCodes={sampleProductData.data.siteCodes}
          view="domains"
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
        An alternate view for the availabiliy chart is <tt>ungrouped</tt>.
        This view is essentially the same as the <tt>sites</tt> view in that
        each row is one site, but the label for each also includes state and
        domain values.
      </DocBlock>
      <DocBlock>
        Only in this view is sorting rows afforded. The <b>View Options</b> are
        replaced by <b>Sort Options</b>. Initial sort dimension and direction can
        also be provided by way of the <tt>sortMethod</tt> and <tt>sortDirection</tt> props.
        By default, when using the ungrouped view mode, the sort method will
        be <tt>&quot;states&quot;</tt> and the direction will be <tt>&quot;ASC&quot;</tt>.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <h4>Ungrouped, initial sort by state, descending:</h4>
          <DataProductAvailability
            siteCodes={sampleProductData.data.siteCodes}
            view="ungrouped"
            sortMethod="domains"
            sortDirection="DESC"
          />
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const siteCodes = [...];

<h4>Ungrouped, initial sort by state, descending:</h4>
<DataProductAvailability
  siteCodes={siteCodes}
  view="ungrouped"
  sortMethod="domains"
  sortDirection="DESC"
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
        <DownloadDataContext.Provider productData={sampleProductData.data}>
          <DataProductAvailability />
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
        can  be specified with the <tt>availabilityView</tt> prop provided to
        the {DownloadDataContextLink}.
      </DocBlock>
      <DocBlock>
        This creates a scenario where view can be defined in more than one place--on the context
        and on the availability chart within the context. If both are set then the most local prop
        will win (so the chart prop with override the context prop).
      </DocBlock>
      <DocBlock>
        Valid views: <tt>summary</tt>, <tt>sites</tt>, <tt>states</tt>, <tt>domains</tt>, <tt>ungrouped</tt>
      </DocBlock>
      <DocBlock>
        Default view: <tt>summary</tt>
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider
          productData={sampleProductData.data}
          availabilityView="domains"
        >
          <DataProductAvailability />
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
      Pass a <tt>sites</tt> and/or a <tt>dateRange</tt> prop to a DataProductAvailability
      rendered inside a {DownloadDataContextLink} where site/dateRange selection is
      required in order to initialize the chart with a selection already in place.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider
          productData={sampleProductData.data}
          sites={sites}
          dateRange={dateRange}
        >
          <DataProductAvailability />
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
      <Typography variant="h6" component="h4" gutterBottom>Disabling Selection Collapse</Typography>

      <DocBlock>
      If selection is enabled it may make sense to disable selection collapse entirely.
      Apply the <tt>disableSelectionCollapse</tt> boolean prop to make that happen.
      When true this will override the value of <tt>availabilitySelectionExpanded</tt> in
      the {DownloadDataContextLink} such that selection will always be expanded.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider productData={sampleProductData.data}>
          <DataProductAvailability disableSelectionCollapse />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {...};

<DownloadDataContext.Provider productData={productData}>
  <DataProductAvailability disableSelectionCollapse />
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
        This can be achieved with the <tt>disableSelection</tt> boolean prop.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider productData={sampleProductData.data}>
          <DataProductAvailability disableSelection />
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

    </React.Fragment>
  );
}

StyleGuide.propTypes = {
  onClickHash: PropTypes.func.isRequired,
};
