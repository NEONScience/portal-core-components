import React, { useEffect, useReducer, useState } from 'react';

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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import NeonApi from '@/components/NeonApi';
import NeonGraphQL from '@/components/NeonGraphQL/NeonGraphQL';
import NeonContext from '@/components/NeonContext/NeonContext';
import ReleaseFilter from '@/components/ReleaseFilter/ReleaseFilter';

import BundleService from '@/service/BundleService';
import windRoseDataProductsJSON from '@/staticJSON/windRoseDataProducts.json';

import WindRoseViewer from '@/components/WindRoseViewer/WindRoseViewer';
import {
  DEFAULT_WIND_ROSE_COLOR_SCHEME,
  isWindRoseColorScheme,
  WIND_ROSE_COLOR_SCHEME_LABELS,
  WIND_ROSE_COLOR_SCHEMES,
  WIND_ROSE_PALETTES,
  WindRoseColorScheme,
} from '@/components/WindRoseViewer/colorSchemes';
import { VELOCITY_BIN_LABELS, VELOCITY_BINS } from '@/components/WindRoseViewer/windRoseUtil';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

// Set this to initialize the all products demo on a particular product
const DEMO_PRODUCT_CODE = null;
const DEMO_RELEASE_TAG = null;

interface ColorSchemeToggleProps {
  colorScheme: WindRoseColorScheme;
  onChange: (colorScheme: WindRoseColorScheme) => void;
  labelId: string;
}

const ColorSchemeToggle = (props: ColorSchemeToggleProps) => {
  const { colorScheme, onChange, labelId } = props;
  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      size="small"
      value={colorScheme}
      aria-labelledby={labelId}
      onChange={(event: React.MouseEvent<HTMLElement>, value: unknown) => {
        // Clicking the selected button would otherwise leave no color scheme selected
        if (isWindRoseColorScheme(value)) { onChange(value); }
      }}
    >
      {Object.values(WIND_ROSE_COLOR_SCHEMES).map((value: WindRoseColorScheme) => (
        <ToggleButton key={value} value={value}>
          {WIND_ROSE_COLOR_SCHEME_LABELS[value]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

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
interface AllProductsWindRoseProps {
  colorScheme: WindRoseColorScheme;
  onColorSchemeChange: (colorScheme: WindRoseColorScheme) => void;
}

const AllProductsWindRose = (props: AllProductsWindRoseProps) => {
  const { colorScheme, onColorSchemeChange } = props;
  const [state, dispatch] = useReducer(allProductsReducer, cloneDeep(allProductsInitialState));
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { bundles } = neonContextData;
  const productIsTs = (product: any) => (
    windRoseDataProductsJSON.productCodes.includes(product.productCode)
  );
  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchAllProducts$ = (NeonGraphQL.getAllDataProducts(null) as Observable<AjaxResponse<any>>).pipe(
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" id="all-products-wind-rose-select-label" gutterBottom>
            Select Data Product
          </Typography>
          <Select
            id="all-products-wind-rose-select"
            aria-labelledby="all-products-wind-rose-select-label"
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
        <Grid size={{ xs: 12, md: 6 }}>
          <ReleaseFilter
            showGenerationDate
            showProductCount
            releases={state.releases}
            selected={state.selectedRelease}
            onChange={handleReleaseChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" id="all-products-wind-rose-color-scheme-label" gutterBottom>
            Color Scheme
          </Typography>
          <ColorSchemeToggle
            colorScheme={colorScheme}
            onChange={onColorSchemeChange}
            labelId="all-products-wind-rose-color-scheme-label"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <WindRoseViewer
            productCode={state.selectedProduct}
            release={state.selectedRelease}
            colorScheme={colorScheme}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const PaletteTable = () => (
  <table style={{ borderCollapse: 'collapse', marginBottom: '16px' }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'left', padding: '4px 16px 4px 0' }}>Wind speed (m/s)</th>
        {Object.values(WIND_ROSE_COLOR_SCHEMES).map((colorScheme: WindRoseColorScheme) => (
          <th key={colorScheme} style={{ textAlign: 'left', padding: '4px 16px 4px 0' }}>
            <code>{colorScheme}</code>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {VELOCITY_BINS.map((velocityBin: string, velocityIndex: number) => (
        <tr key={velocityBin}>
          <td style={{ padding: '2px 16px 2px 0' }}>{VELOCITY_BIN_LABELS[velocityBin]}</td>
          {Object.values(WIND_ROSE_COLOR_SCHEMES).map((colorScheme: WindRoseColorScheme) => {
            const color = WIND_ROSE_PALETTES[colorScheme][velocityIndex];
            return (
              <td key={colorScheme} style={{ padding: '2px 16px 2px 0' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '14px',
                    marginRight: '8px',
                    verticalAlign: 'middle',
                    borderRadius: '2px',
                    backgroundColor: color,
                  }}
                />
                <code>{color}</code>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

export default function StyleGuide() {
  const [colorScheme, setColorScheme] = useState<WindRoseColorScheme>(
    DEFAULT_WIND_ROSE_COLOR_SCHEME,
  );
  return (
    <>
      <DocBlock>
        A wind rose visualization of the 2D wind speed and direction data product, showing how
        often the wind blew from each of the 16 compass directions, broken down by wind speed.
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
        Initializing a WindRoseViewer requires only a valid <code>productCode</code> prop.
        A <code>release</code> prop may also be provided to view data from a specific release.
        The example below wraps a WindRoseViewer instance with a data product selector, release
        filter and color scheme toggle to demonstrate how different products perform.
      </DocBlock>
      <ExampleBlock>
        <AllProductsWindRose colorScheme={colorScheme} onColorSchemeChange={setColorScheme} />
      </ExampleBlock>

      <Typography variant="h5" component="h3" gutterBottom>Monthly and Daily Wind Roses</Typography>
      <DocBlock>
        Data are fetched one site and month at a time. Use the <b>Monthly</b> and <b>Daily</b> toggle
        to switch between viewing every observation in the month (the default) and a single
        day (UTC).
      </DocBlock>
      <DocBlock>
        A day can be selected in several ways:
        <ul>
          <li>
            The <b>Days in</b> calendar shows a thumbnail wind rose for every day of the month,
            making days with unusual wind patterns easy to spot. Click a day, or focus the
            calendar and use the arrow, <code>Home</code> and <code>End</code> keys to move between days.
          </li>
          <li>
            The previous and next day buttons step through the days with data, continuing into
            the adjacent month at either end of the month.
          </li>
          <li>
            The day picker jumps to any day with data, including days in other months.
          </li>
          <li>
            <b>Play</b> steps through the days of the month automatically.
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        Calm observations (a wind speed of exactly 0 m/s) have no direction, so they are not drawn on
        the wind rose. Instead, the legend reports them as a <b>Calm</b> share of observations, alongside
        the share of each wind speed bin. All shares are of every selected observation, including
        calm observations, and the slowest bin (0-0.25 m/s) does not include 0.
      </DocBlock>
      <DocBlock>
        The citation for the data product (and release, if specified) is shown below the wind rose.
        As with the Time Series Viewer, users who are not signed in to an account that can access data
        are shown a limited dataset, along with a card explaining how to sign in to view the full
        dataset. Release data are only available when signed in, so no data are shown when a release
        is specified until the user signs in.
      </DocBlock>
      <DocBlock>
        The <b>Download Image (PNG)</b> button saves an image of the viewer as currently shown,
        including the selections, wind rose, legend, calendar and citation.
      </DocBlock>

      <Typography variant="h5" component="h3" gutterBottom>Data Quality</Typography>
      <DocBlock>
        The <b>Observations</b> toggle selects which observations the wind roses are built from:
        <ul>
          <li>
            <b>Quality Flag Validated</b> (default): observations with a <code>windSpeedFinalQF</code> of 0
            (pass) and a <code>windDirFinalQF</code> of 0 (pass).
          </li>
          <li>
            <b>All</b>: every observation, including those with either quality flag of 1 (fail).
          </li>
        </ul>
        Observation counts, shares, the prevailing direction, mean speed and the days with data all
        reflect the selected observations. Both are built when a month is fetched, so switching
        between them is immediate.
      </DocBlock>
      <DocBlock>
        The <b>Quality Flag Validated</b> ring beside the observation count shows the share of the shown
        observations that are Quality Flag validated for the month or day: the validated share of every
        observation when viewing <b>All</b>, and a full ring with a check mark at 100% when
        viewing <b>Quality Flag Validated</b>. Hovering over the ring shows how many observations fail a
        quality flag when viewing <b>All</b>, and the validated share of every observation when
        viewing <b>Quality Flag Validated</b>.
      </DocBlock>

      <Typography variant="h5" component="h3" gutterBottom>Color Scheme</Typography>
      <DocBlock>
        Wind speed bins can be drawn in one of two color schemes with the <code>colorScheme</code> prop.
        Both are sequential: the slowest winds are the lightest and the fastest are the darkest.
        <ul>
          <li>
            <code>neon</code> (default): built from the NEON style guide palette, from gold through
            green and teal to NEON blue.
          </li>
          <li>
            <code>color vision accessible</code>: a yellow, green, blue and purple ramp tuned so that every pair of
            adjacent wind speed bins remains distinguishable with protanopia, deuteranopia and
            tritanopia.
          </li>
        </ul>
        Users can also switch between color schemes with the <b>Color palette</b> toggle in the
        legend. Color schemes are listed in <code>WIND_ROSE_COLOR_SCHEMES</code>, exported
        from <code>WindRoseViewer/colorSchemes</code>.
      </DocBlock>
      <PaletteTable />
      <CodeBlock>
        {`
import WindRoseViewer from 'portal-core-components/lib/components/WindRoseViewer';

<WindRoseViewer productCode="DP1.00001.001" colorScheme="colorVisionAccessible" />
        `}
      </CodeBlock>
    </>
  );
}
