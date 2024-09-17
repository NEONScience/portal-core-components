import React, { useEffect, useReducer } from 'react';

import {
  of,
  map,
  catchError,
  Observable,
} from 'rxjs';
import { type AjaxResponse } from 'rxjs/ajax';

import cloneDeep from 'lodash/cloneDeep';

import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import NeonApi from '@/components/NeonApi';
import NeonGraphQL from '@/components/NeonGraphQL/NeonGraphQL';
import NeonContext from '@/components/NeonContext/NeonContext';
import ReleaseFilter from '@/components/ReleaseFilter/ReleaseFilter';

import BundleService from '@/service/BundleService';
import windRoseDataProductsJSON from '@/staticJSON/windRoseDataProducts.json';

import WindRoseViewer from '@/components/WindRoseViewer/WindRoseViewer';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

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
const allProductsReducer = (state: any, action: any) => {
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
      if (!state.products.find((product: any) => product.productCode === action.productCode)) {
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
  const productIsTs = (product: any) => (
    windRoseDataProductsJSON.productCodes.includes(product.productCode)
  );
  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchAllProducts$ = (NeonGraphQL.getAllDataProducts() as Observable<AjaxResponse<any>>).pipe(
    map((response) => {
      if (response.response && response.response.data && response.response.data.products) {
        const products = response.response.data.products
          .filter((product: any) => (
            product.siteCodes
              && product.siteCodes.length
              && productIsTs(product)
              && !BundleService.isProductDefined(bundles, product.productCode)
          ))
          .map((product: any) => ({
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
  const handleChange = (event: any) => {
    dispatch({ type: 'selectProduct', productCode: event.target.value });
  };
  const handleReleaseChange = (release: any) => {
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
            {state.products.map((product: any) => {
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
          <WindRoseViewer productCode={state.selectedProduct} release={state.selectedRelease} />
        </Grid>
      </Grid>
    </div>
  );
};

export default function StyleGuide() {
  return (
    <>
      <DocBlock>
        Wind Rose Viewer
      </DocBlock>
      <CodeBlock>
        {`
import WindRoseViewer from 'portal-core-components/lib/components/WindRoseViewer';
        `}
      </CodeBlock>
      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>
      <CodeBlock>
        {`
<WindRoseViewer productCode="DP1.00001.001" />
        `}
      </CodeBlock>
      <DocBlock>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
        Initializing a WindRoseViewer requires only a valid <code>productCode</code> prop.
        The example below wraps a TimeSeriesViewer instance with a data
        product selector to demonstrate how different products perform.
      </DocBlock>
      <ExampleBlock>
        <AllProductsTimeSeries />
      </ExampleBlock>
    </>
  );
}
