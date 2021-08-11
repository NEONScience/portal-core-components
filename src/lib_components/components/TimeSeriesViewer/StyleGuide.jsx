/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React, { useEffect, useReducer, useState } from 'react';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DialogBase from '../DialogBase/DialogBase';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';
import TimeSeriesViewer from './TimeSeriesViewer';
import TimeSeriesViewerContainer from './TimeSeriesViewerContainer';

import parseTimeSeriesData from '../../workers/parseTimeSeriesData';

import DP1_00001_001_ABBY_BASIC_30MIN_2018_12 from '../../../sampleData/TimeSeries/D16.ABBY.DP1.00001.001.2018-12.30min.basic';

import productJSON from '../../../sampleData/DP1.00001.001.json';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

// Set this to initialize the all products demo on a particular product
const DEMO_PRODUCT_CODE = null;

const allProductsInitialState = {
  fetch: { status: 'AWAITING_CALL', error: null },
  products: [],
  selectedProduct: null,
};
const allProductsReducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'fetchCalled':
      newState.fetch.status = 'FETCHING';
      return newState;
    case 'fetchSucceeded':
      newState.fetch.status = 'SUCCESS';
      newState.products = action.products;
      newState.selectedProduct = DEMO_PRODUCT_CODE || action.products[0].productCode;
      return newState;
    case 'fetchFailed':
      newState.fetch.status = 'ERROR';
      newState.fetch.error = action.error;
      return newState;
    case 'selectProduct':
      if (!state.products.find((product) => product.productCode === action.productCode)) {
        return state;
      }
      newState.selectedProduct = action.productCode;
      return newState;
    default:
      return state;
  }
};
const AllProductsTimeSeries = () => {
  const [state, dispatch] = useReducer(allProductsReducer, cloneDeep(allProductsInitialState));
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { bundles } = neonContextData;
  const productIsIS = (product) => (
    product.productScienceTeam.includes('AIS') || product.productScienceTeam.includes('TIS')
  );
  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchAllProducts$ = NeonGraphQL.getAllDataProducts().pipe(
    map((response) => {
      if (response.response && response.response.data && response.response.data.products) {
        const products = response.response.data.products
          .filter((product) => (
            product.siteCodes
              && product.siteCodes.length
              && productIsIS(product)
              && !Object.keys(bundles.parents).includes(product.productCode)
              && !Object.keys(bundles.children).includes(product.productCode)
          ))
          .map((product) => ({
            productCode: product.productCode,
            productName: product.productName,
          }));
        if (!products.length) {
          dispatch({ type: 'fetchFailed', error: 'fetch succeeded; no products found' });
          return of(false);
        }
        dispatch({ type: 'fetchSucceeded', products });
        return of(true);
      }
      dispatch({ type: 'fetchFailed', error: 'malformed response' });
      return of(false);
    }),
    catchError((error) => {
      dispatch({ type: 'fetchFailed', error: error.message });
      return of(false);
    }),
  );
  useEffect(() => {
    if (state.fetch.status === 'AWAITING_CALL') {
      dispatch({ type: 'fetchCalled' });
      fetchAllProducts$.subscribe();
    }
  });
  // Render
  if (state.fetch.status === 'ERROR') {
    return <div>{`Error: ${state.fetch.error}`}</div>;
  }
  if (state.fetch.status === 'SUCCESS') {
    const handleChange = (event) => {
      dispatch({ type: 'selectProduct', productCode: event.target.value });
    };
    return (
      <div style={{ width: '100%' }}>
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
        <TimeSeriesViewer productCode={state.selectedProduct} />
      </div>
    );
  }
  return <div>Loading...</div>;
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
import Button from '@material-ui/core/Button';
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
        <TimeSeriesViewerContext.Provider mode="STATIC" productData={productJSON.data} timeSeriesUniqueId={100}>
          <StaticTimeSeriesViewer />
        </TimeSeriesViewerContext.Provider>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>Static Data Dialog</Typography>

      <StaticTimeSeriesViewerDialog />

    </>
  );
}
