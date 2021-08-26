/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid, max-len */

import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DataProductAvailability from './DataProductAvailability';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import Theme from '../Theme/Theme';

import sampleProductData from '../../../sampleData/DP1.00001.001.json';
import sampleSiteData from '../../../sampleData/CPER.json';

import crunch from '../../../sampleData/DataProductAvailability/crunch';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const EnhancedAvailability = () => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState({});
  const [selectedProductCode, setSelectedProductCode] = useState(null);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      crunch((result) => {
        setAvailability(result);
        setSelectedProductCode('DP1.20093.001'); // result.products[0].productCode
        setLoading(false);
      });
    }
  }, [initialized, setInitialized, setLoading, setAvailability]);

  const productIdx = !availability.products ? -1
    : availability.products.findIndex((p) => p.productCode === selectedProductCode);
  const sites = productIdx === -1 ? [] : availability.products[productIdx].sites;

  const paperStyles = { width: '100%', padding: Theme.spacing(3) };
  return loading ? (
    <Paper style={paperStyles}>loading...</Paper>
  ) : (
    <Paper style={paperStyles}>
      <Typography variant="h6" id="enhanced-availability-products-select-label" gutterBottom>
        Select Data Product
      </Typography>
      <Select
        id="enhanced-availability-products-select"
        aria-labelledby="enhanced-availability-products-select-label"
        variant="outlined"
        value={selectedProductCode}
        onChange={(event) => { setSelectedProductCode(event.target.value); }}
        style={{ width: '100%', marginBottom: '32px' }}
      >
        {availability.products.map((product) => {
          const { productCode } = product;
          return (
            <MenuItem key={productCode} value={productCode}>
              {productCode}
            </MenuItem>
          );
        })}
      </Select>
      <DataProductAvailability sites={sites} />
    </Paper>
  );
};

const sites = ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];
const dateRange = ['2018-01', '2018-12'];

export default function StyleGuide() {
  const classes = useStyles(Theme);

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
          <h4>Ungrouped, initial sort by domain, descending:</h4>
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
          downloadDataContextUniqueId={1}
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
          downloadDataContextUniqueId={2}
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
        <DownloadDataContext.Provider productData={sampleProductData.data} downloadDataContextUniqueId={3}>
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

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>
        Enhanced Data Product Availability Chart
      </Typography>

      <DocBlock>
        An experimental mode exists to show enhanced availability with a more nuanced and complete
        set of statuses for a given site/month. It also allows for arbitrary rollups and breaks out
        product tables where appropriate. It does not, however, support selection and currently
        any APIs do deliver availability data structured as needed for the enhanced chart are still
        in development.
      </DocBlock>
      <ExampleBlock>
        <EnhancedAvailability />
      </ExampleBlock>

    </>
  );
}
