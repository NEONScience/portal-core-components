/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React, { useEffect, useReducer, useState } from 'react';

import { of, map, catchError } from 'rxjs';

import cloneDeep from 'lodash/cloneDeep';

import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/lab/Skeleton';
import Typography from '@mui/material/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DialogBase from '../DialogBase/DialogBase';
import NeonApi from '../NeonApi';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import NeonContext from '../NeonContext/NeonContext';
import ReleaseFilter from '../ReleaseFilter/ReleaseFilter';
import Theme from '../Theme/Theme';

import BundleService from '../../service/BundleService';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';
import TimeSeriesViewer from './TimeSeriesViewer';
import TimeSeriesViewerContainer from './TimeSeriesViewerContainer';

import parseTimeSeriesData from '../../workers/parseTimeSeriesData';

import timeSeriesDataProductsJSON from '../../staticJSON/timeSeriesDataProducts.json';

import DP1_00001_001_ABBY_BASIC_30MIN_2018_12 from '../../../sampleData/TimeSeries/D16.ABBY.DP1.00001.001.2018-12.30min.basic';

import productJSON from '../../../sampleData/DP1.00001.001.json';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

// Set this to initialize the all products demo on a particular product
const DEMO_PRODUCT_CODE = null;
const DEMO_RELEASE_TAG = null;

const allProductsInitialState = {
  fetchProducts: { status: 'AWAITING_CALL', error: null },
  products: [],
  selectedProduct: null,
  fetchReleases: { status: 'AWAITING_CALL', error: null },
  releases: [],
  selectedRelease: null,
};
const allProductsReducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'fetchProductsCalled':
      newState.fetchProducts.status = 'FETCHING';
      return newState;
    case 'fetchProductsSucceeded':
      newState.fetchProducts.status = 'SUCCESS';
      newState.products = action.products;
      newState.selectedProduct = DEMO_PRODUCT_CODE || action.products[0].productCode;
      return newState;
    case 'fetchProductsFailed':
      newState.fetchProducts.status = 'ERROR';
      newState.fetchProducts.error = action.error;
      return newState;
    case 'selectProduct':
      if (!state.products.find((product) => product.productCode === action.productCode)) {
        return state;
      }
      newState.selectedProduct = action.productCode;
      return newState;
    case 'fetchReleasesCalled':
      newState.fetchReleases.status = 'FETCHING';
      return newState;
    case 'fetchReleasesSucceeded':
      newState.fetchReleases.status = 'SUCCESS';
      newState.releases = action.releases;
      if (DEMO_RELEASE_TAG !== null) {
        newState.selectedRelease = DEMO_RELEASE_TAG;
      }
      return newState;
    case 'fetchReleasesFailed':
      newState.fetchReleases.status = 'ERROR';
      newState.fetchReleases.error = action.error;
      return newState;
    case 'selectRelease':
      newState.selectedRelease = action.release;
      return newState;
    default:
      return state;
  }
};
const AllProductsTimeSeries = () => {
  const [state, dispatch] = useReducer(allProductsReducer, cloneDeep(allProductsInitialState));
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { bundles } = neonContextData;
  const includeOnlyTs = true;
  const productIsTs = (product) => {
    if (includeOnlyTs) {
      return timeSeriesDataProductsJSON.productCodes.includes(product.productCode);
    }
    return product.productScienceTeam.includes('AIS') || product.productScienceTeam.includes('TIS');
  };
  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchAllProducts$ = NeonGraphQL.getAllDataProducts().pipe(
    map((response) => {
      if (response.response && response.response.data && response.response.data.products) {
        const products = response.response.data.products
          .filter((product) => (
            product.siteCodes
              && product.siteCodes.length
              && productIsTs(product)
              && !BundleService.isProductDefined(bundles, product.productCode)
          ))
          .map((product) => ({
            productCode: product.productCode,
            productName: product.productName,
          }));
        if (!products.length) {
          dispatch({ type: 'fetchProductsFailed', error: 'fetch succeeded; no products found' });
          return of(false);
        }
        dispatch({ type: 'fetchProductsSucceeded', products });
        return of(true);
      }
      dispatch({ type: 'fetchProductsFailed', error: 'malformed response' });
      return of(false);
    }),
    catchError((error) => {
      dispatch({ type: 'fetchProductsFailed', error: error.message });
      return of(false);
    }),
  );
  const fetchAllReleases$ = NeonApi.getReleasesObservable().pipe(
    map((response) => {
      if (response.data) {
        const { data: releases } = response;
        if (!releases.length) {
          dispatch({ type: 'fetchReleasesFailed', error: 'fetch succeeded; no releases found' });
          return of(false);
        }
        dispatch({ type: 'fetchReleasesSucceeded', releases });
        return of(true);
      }
      dispatch({ type: 'fetchReleasesFailed', error: 'malformed response' });
      return of(false);
    }),
    catchError((error) => {
      dispatch({ type: 'fetchReleasesFailed', error: error.message });
      return of(false);
    }),
  );
  useEffect(() => {
    if (state.fetchProducts.status === 'AWAITING_CALL') {
      dispatch({ type: 'fetchProductsCalled' });
      fetchAllProducts$.subscribe();
    }
    if (state.fetchReleases.status === 'AWAITING_CALL') {
      dispatch({ type: 'fetchReleasesCalled' });
      fetchAllReleases$.subscribe();
    }
  });
  const loadStatus = ['AWAITING_CALL', 'FETCHING'];
  const isLoading = loadStatus.includes(state.fetchProducts.status)
    || loadStatus.includes(state.fetchReleases.status);
  const isError = state.fetchProducts.status === 'ERROR'
    || state.fetchReleases.status === 'ERROR';
  if (isLoading) {
    return (
      <div>
        <Skeleton variant="rectangular" width="100%" height={800} />
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <div>
          {`Error: ${state.fetchProducts.error}`}
        </div>
        <div>
          {`Error: ${state.fetchReleases.error}`}
        </div>
      </div>
    );
  }
  const handleChange = (event) => {
    dispatch({ type: 'selectProduct', productCode: event.target.value });
  };
  const handleReleaseChange = (release) => {
    dispatch({ type: 'selectRelease', release });
  };
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" id="all-products-time-series-select-label" gutterBottom>
            Select Data Product
          </Typography>
          <Select
            id="all-products-time-series-select"
            aria-labelledby="all-products-time-series-select-label"
            variant="outlined"
            value={state.selectedProduct}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '32px' }}
          >
            {state.products.map((product) => {
              const { productCode, productName } = product;
              return (
                <MenuItem key={productCode} value={productCode}>
                  {`${productCode} - ${productName}`}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <ReleaseFilter
            showGenerationDate
            showProductCount
            releases={state.releases}
            selected={state.selectedRelease}
            onChange={handleReleaseChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TimeSeriesViewer
            productCode={state.selectedProduct}
            release={state.selectedRelease}
            timeSeriesUniqueId={1}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const StaticTimeSeriesViewer = () => {
  const [timeSeriesState, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { status, variables } = timeSeriesState;

  useEffect(() => {
    dispatch({
      type: 'fetchSitePositionsSucceeded',
      csv: DP1_00001_001_ABBY_BASIC_30MIN_2018_12.sensorPositions,
      siteCode: 'ABBY',
    });
    dispatch({
      type: 'fetchSiteVariablesSucceeded',
      csv: DP1_00001_001_ABBY_BASIC_30MIN_2018_12.variables,
      siteCode: 'ABBY',
    });
  }, [dispatch]);

  useEffect(() => {
    if (status === 'READY_FOR_DATA') {
      const input = {
        csv: DP1_00001_001_ABBY_BASIC_30MIN_2018_12.data,
        variables,
      };
      parseTimeSeriesData(input)
        .then((series) => {
          const actionProps = {
            siteCode: 'ABBY',
            position: '000.010',
            month: '2018-12',
            downloadPkg: 'basic',
            timeStep: '30min',
            table: '2DWSD_30min',
          };
          dispatch({
            type: 'fetchDataFileSucceeded',
            series,
            ...actionProps,
          });
          dispatch({ type: 'staticFetchDataFilesCompleted' });
        });
    }
  }, [dispatch, status, variables]);

  return (<TimeSeriesViewerContainer />);
};

const StaticTimeSeriesViewerDialog = () => {
  const classes = useStyles(Theme);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>

      <DocBlock>
        The Time Series Viewer development environment for dialog presentation
        with statically injected data.
      </DocBlock>
      <CodeBlock>
        {`
import Button from '@mui/material/Button';
import DialogBase from '../DialogBase/DialogBase';
import TimeSeriesViewerContext from 'portal-core-components/lib/components/TimeSeriesViewerContext/TimeSeriesViewerContext';
import TimeSeriesViewerContainer from 'portal-core-components/lib/components/TimeSeriesViewerContainer/TimeSeriesViewerContainer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <CodeBlock>
        {`
const [dialogOpen, setDialogOpen] = useState(false);
// API response for a product as productJSON
return (
  <>
    <Button
      color="primary"
      variant="contained"
      onClick={() => setDialogOpen(true)}
    >
      Open Time Series Dialog
    </Button>
    {!dialogOpen ? null : (
      <DialogBase
        open
        nopaper
        title="Time Series Viewer"
        onClose={() => setDialogOpen(false)}
      >
        <TimeSeriesViewerContext.Provider mode="STATIC" productData={productJSON.data}>
          <StaticTimeSeriesViewer />
        </TimeSeriesViewerContext.Provider>
      </DialogBase>
    )}
  </>
);
        `}
      </CodeBlock>
      <ExampleBlock>
        <>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setDialogOpen(true)}
          >
            Open Time Series Dialog
          </Button>
          {!dialogOpen ? null : (
            <DialogBase
              open
              nopaper
              title="Time Series Viewer"
              onClose={() => setDialogOpen(false)}
            >
              <TimeSeriesViewerContext.Provider mode="STATIC" productData={productJSON.data} timeSeriesUniqueId={10}>
                <StaticTimeSeriesViewer />
              </TimeSeriesViewerContext.Provider>
            </DialogBase>
          )}
        </>
      </ExampleBlock>

      <Divider className={classes.divider} />

    </>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <>

      <DocBlock>
        The Time Series Viewer is a component designed to compose arbitrary NEON data into an
        interactive line chart visualization. It comes fully contained with all necessary internals
        for querying NEON APIs for product, position, and variable information as well as pulling
        data files from their globally accessible locations.
      </DocBlock>
      <CodeBlock>
        {`
import TimeSeriesViewer from 'portal-core-components/lib/components/TimeSeriesViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <CodeBlock>
        {`
<TimeSeriesViewer productCode="DP1.00001.001" />
        `}
      </CodeBlock>
      <DocBlock>
        Initializing a TimeSeriesViewer requires only a valid <tt>productCode</tt> prop. The example
        below wraps a TimeSeriesViewer instance with a data product selector to demonstrate how
        different products perform.
      </DocBlock>
      <ExampleBlock>
        <AllProductsTimeSeries />
      </ExampleBlock>

      <Divider className={classes.divider} />
      {/*
      TODO: Example showing preloading selection
      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>...</Typography>

      <DocBlock>
        ...
      </DocBlock>
      */}

      <Typography variant="h4" component="h2" gutterBottom>Static Data</Typography>

      <DocBlock>
        The Time Series Viewer development environment with statically injected data.
      </DocBlock>

      <DocBlock>
        Define higher order component to wrap the injection of static data:
      </DocBlock>
      <CodeBlock>
        {`
const StaticTimeSeriesViewer = () => {
  const [timeSeriesState, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { status, variables } = timeSeriesState;

  useEffect(() => {
    dispatch({
      type: 'fetchSitePositionsSucceeded',
      csv: DP1_00001_001_ABBY_BASIC_30MIN_2018_12.sensorPositions,
      siteCode: 'ABBY',
    });
    dispatch({
      type: 'fetchSiteVariablesSucceeded',
      csv: DP1_00001_001_ABBY_BASIC_30MIN_2018_12.variables,
      siteCode: 'ABBY',
    });
  }, [dispatch]);

  useEffect(() => {
    if (status === 'READY_FOR_DATA') {
      const input = {
        csv: DP1_00001_001_ABBY_BASIC_30MIN_2018_12.data,
        variables,
      };
      parseTimeSeriesData(input)
        .then((series) => {
          const actionProps = {
            siteCode: 'ABBY',
            position: '000.010',
            month: '2018-12',
            downloadPkg: 'basic',
            timeStep: '30min',
            table: '2DWSD_30min',
          };
          dispatch({
            type: 'fetchDataFileSucceeded',
            series,
            ...actionProps,
          });
          dispatch({ type: 'staticFetchDataFilesCompleted' });
        });
    }
  }, [dispatch, status, variables]);

  return (<TimeSeriesViewerContainer />);
};
        `}
      </CodeBlock>
      <CodeBlock>
        {`
import TimeSeriesViewerContext from 'portal-core-components/lib/components/TimeSeriesViewerContext/TimeSeriesViewerContext';
import TimeSeriesViewerContainer from 'portal-core-components/lib/components/TimeSeriesViewerContainer/TimeSeriesViewerContainer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <CodeBlock>
        {`
// API response for a product as productJSON
<TimeSeriesViewerContext.Provider mode="STATIC" productData={productJSON.data}>
  <StaticTimeSeriesViewer />
</TimeSeriesViewerContext.Provider>
        `}
      </CodeBlock>
      <ExampleBlock>
        <TimeSeriesViewerContext.Provider
          mode="STATIC"
          productData={productJSON.data}
          timeSeriesUniqueId={100}
        >
          <StaticTimeSeriesViewer />
        </TimeSeriesViewerContext.Provider>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>Static Data Dialog</Typography>

      <StaticTimeSeriesViewerDialog />

    </>
  );
}
