/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React, { useEffect, useReducer } from 'react';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import TimeSeriesViewer from './TimeSeriesViewer';

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

    </>
  );
}
