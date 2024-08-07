import React, {
  useReducer,
  useEffect,
  Dispatch,
} from 'react';

import {
  of,
  map,
  catchError,
  Observable,
} from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

import cloneDeep from 'lodash/cloneDeep';

import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import ActionCreator from './DataProductCitation/Actions';
import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import DataProductCitation from './DataProductCitation';
import DataProductCitationContext from './DataProductCitation/Context';
import DataProductCitationService from './DataProductCitation/Service';
import DataProductCitationView from './DataProductCitation/View';
import NeonApi from '../NeonApi';
import NeonContext from '../NeonContext/NeonContext';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import ReleaseFilter from '../ReleaseFilter/ReleaseFilter';
import ReleaseService from '../../service/ReleaseService';
import Theme from '../Theme/Theme';
import { Release } from '../../types/internal';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
import {
  DataProductCitationItem,
  DataProductCitationViewProps,
  DataProductCitationViewState,
} from './DataProductCitation/ViewState';
import { Nullable } from '../../types/core';
import { CitationRelease } from './DataProductCitation/State';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  paper: {
    width: '100%',
    padding: Theme.spacing(3),
  },
  title: {
    fontWeight: 500,
    marginBottom: '8px',
  },
}));

const dataProductCitationPropRows = [
  {
    name: 'disableConditional',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether or not to prevent rendering the citation as a conditional citation.
        Conditional citations include both the provisional and release citations
        when applicable. Disabling conditional will display the provisional
        section only by default with no release specified.
      </p>
    ),
  },
  {
    name: 'disableSkeleton',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether or not to prevent rendering the skeleton loading display for the
        component when loading its state.
      </p>
    ),
  },
  {
    name: 'productCode',
    type: 'string',
    default: 'null',
    examples: (
      <div>
        {/* @ts-ignore */}
        <tt>DP1.00001.001</tt>
      </div>
    ),
    description: (
      <p>
        The product code to build the citation for.
      </p>
    ),
  },
  {
    name: 'release',
    type: 'string',
    default: 'undefined',
    examples: (
      <div>
        {/* @ts-ignore */}
        <tt>RELEASE-2021</tt>
      </div>
    ),
    description: (
      <p>
        The release to build the citation for when defining a citation that is
        specific to a particular release.
      </p>
    ),
  },
  {
    name: 'showQuoteIcon',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether or not to render a quote icon with the citation component
        header for utilization within various contexts. (eg, download summary).
      </p>
    ),
  },
  {
    name: 'showTextOnly',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether or not to render the citation display as text only.
      </p>
    ),
  },
  {
    name: 'textOnlyProps',
    type: 'CitationTextOnlyProps',
    default: 'undefined',
    examples: (
      <div>
        {/* @ts-ignore */}
        <tt>{"{ variant: 'caption', cssClass: classes.citationTextOnly }"}</tt>
      </div>
    ),
    description: (
      <p>
        The properties to apply to the text only display version of the citation.
      </p>
    ),
  },
];

const DATA_PRODUCT_CITATION_DEFAULT_STATE = {
  fetchProducts: {
    status: 'AWAITING_CALL',
    error: null,
  },
  products: [],
  fetchReleases: {
    status: 'AWAITING_CALL',
    error: null,
  },
  releases: [],
};
const dataProductCitationReducer = (state: any, action: any) => {
  const newState = { ...state };
  switch (action.type) {
    case 'fetchProductsCalled':
      newState.fetchProducts.status = 'FETCHING';
      return newState;
    case 'fetchProductsSucceeded':
      newState.fetchProducts.status = 'SUCCESS';
      newState.products = action.products;
      return newState;
    case 'fetchProductsFailed':
      newState.fetchProducts.status = 'ERROR';
      newState.fetchProducts.error = action.error;
      return newState;
    case 'fetchReleasesCalled':
      newState.fetchReleases.status = 'FETCHING';
      return newState;
    case 'fetchReleasesSucceeded':
      newState.fetchReleases.status = 'SUCCESS';
      newState.releases = action.releases;
      return newState;
    case 'fetchReleasesFailed':
      newState.fetchReleases.status = 'ERROR';
      newState.fetchReleases.error = action.error;
      return newState;
    default:
      return state;
  }
};

const DataProductCitationDemoContainer = (): JSX.Element => ((
  <ComponentErrorBoundary onReset={() => {}}>
    <DataProductCitationContext.Provider contextControlled>
      <DataProductCitationDemo />
    </DataProductCitationContext.Provider>
  </ComponentErrorBoundary>
));

const DataProductCitationDemo = (): JSX.Element => {
  const classes = useStyles(Theme);
  const [state, dispatch] = useReducer(
    dataProductCitationReducer,
    cloneDeep(DATA_PRODUCT_CITATION_DEFAULT_STATE),
  );
  const { releases: stateReleases } = state;
  const stateCtx = DataProductCitationContext.useDataProductCitationContextState();
  const {
    productCode: stateProductCode,
    release: stateRelease,
    neonContextState,
  } = stateCtx;
  const appliedReleases: Release[] = ReleaseService.applyUserReleases(
    neonContextState,
    stateReleases,
  );
  const viewState: DataProductCitationViewState = DataProductCitationService.useViewState(
    stateCtx,
    DataProductCitationView.defaultProps as DataProductCitationViewProps,
  );
  const { citationItems }: DataProductCitationViewState = viewState;
  const appliedItem: Nullable<DataProductCitationItem> = existsNonEmpty(citationItems)
    ? citationItems[0]
    : null;
  let appliedCitationReleaseObject: Nullable<CitationRelease> = null;
  if (exists(appliedItem)) {
    appliedCitationReleaseObject = (appliedItem as DataProductCitationItem).releaseObject;
  }
  // eslint-disable-next-line max-len
  const citationDispatch = DataProductCitationContext.useDataProductCitationContextDispatch() as Dispatch<any>;
  const fetchAllProducts$ = (NeonGraphQL.getAllDataProducts() as Observable<AjaxResponse<unknown>>)
    .pipe(
      map((response: any) => {
        if (response.response && response.response.data && response.response.data.products) {
          const products = response.response.data.products
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
      catchError((error: any) => {
        dispatch({ type: 'fetchProductsFailed', error: error.message });
        return of(false);
      }),
    );
  const fetchAllReleases$ = (NeonApi.getReleasesObservable() as Observable<AjaxResponse<unknown>>)
    .pipe(
      map((response: any) => {
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
      catchError((error: any) => {
        dispatch({ type: 'fetchReleasesFailed', error: error.message });
        return of(false);
      }),
    );
  useEffect(() => {
    if (!isStringNonEmpty(stateProductCode) && (state.fetchProducts.status === 'SUCCESS')) {
      citationDispatch(ActionCreator.setProductCode(state.products[0].productCode));
    }
  }, [stateProductCode, citationDispatch, state.fetchProducts.status, state.products]);
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
        <Skeleton variant="rect" width="100%" height={400} />
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
    const nextProduct = state.products.find((product: any) => (
      product.productCode === event.target.value
    ));
    if (!nextProduct) {
      return;
    }
    citationDispatch(ActionCreator.setProductCode(nextProduct.productCode));
  };
  const handleReleaseChange = (selectedRelease: string) => {
    const nextRelease = appliedReleases.find((release: any) => (
      release.release === selectedRelease
    ));
    if (!nextRelease) {
      citationDispatch(ActionCreator.setRelease(undefined));
      return;
    }
    citationDispatch(ActionCreator.setRelease(nextRelease.release));
  };
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            component="h3"
            id="all-products-data-product-citation-select-label"
            className={classes.title}
          >
            Data Product
          </Typography>
          <Select
            id="all-products-data-product-citation-select"
            aria-labelledby="all-products-data-product-citation-select-label"
            variant="outlined"
            value={stateProductCode || state.products[0].productCode}
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
            releases={appliedReleases}
            selected={stateRelease}
            onChange={handleReleaseChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.title}>
            The citation context will determine the applied release based
            on the available releases for the product, release, and bundle.
            <br />
            {`Applied Release: ${appliedCitationReleaseObject?.release}`}
          </Typography>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={12}>
          <DataProductCitationView />
        </Grid>
      </Grid>
    </div>
  );
};

const WrappedDataProductCitationDemo = (Theme as any).getWrappedComponent(
  NeonContext.getWrappedComponent(DataProductCitationDemoContainer),
);

export default function StyleGuide() {
  const classes = useStyles(Theme);
  return (
    <>
      <DocBlock>
        A module for displaying data citations.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>
        Example Data Product Citation Viewer
      </Typography>
      <DocBlock>
        Displays a data product citation.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00024.001" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Container>
          <DataProductCitation productCode="DP1.00024.001" />
        </Container>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Data Product Citation Props</Typography>

      <DocBlock>
        <PropsTable props={dataProductCitationPropRows} />
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>
        Data Product Citation Usage and Exmaples
      </Typography>

      <Typography variant="h6" component="h4" gutterBottom>Demo Data Product Citation Viewer</Typography>
      <DocBlock>
        Demo data product citation component with product and release selection.
      </DocBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <WrappedDataProductCitationDemo />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Data Product Citation Configurations</Typography>
      <DocBlock>
        The data product citation component can be utilized in various configurations. Optionally
        displaying quote icon, conditional citations regarding release vs. provisional data,
        display as text only.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00001.001" showQuoteIcon />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00001.001" showQuoteIcon />
        </Paper>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00001.001" disableConditional />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00001.001" disableConditional />
        </Paper>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00001.001" release="RELEASE-2021" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00001.001" release="RELEASE-2021" />
        </Paper>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00001.001" showTextOnly />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00001.001" showTextOnly />
        </Paper>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00001.001" release="RELEASE-2021" showTextOnly />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00001.001" release="RELEASE-2021" showTextOnly />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Data Product Citation Bundles</Typography>
      <DocBlock>
        The data product citation component will automatically handle bundle resolution
        for the given product and release.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00007.001" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00007.001" />
        </Paper>
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00007.001" showTextOnly />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00007.001" showTextOnly />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Data Product Citation Edge Cases</Typography>
      <DocBlock>
        The data product citation component will automatically handle bundle resolution
        for the given product and release and handle displaying appropriately
        when the product exists or is not bundled in a previous release and does not
        exist or is bundled in a different release.
      </DocBlock>
      <DocBlock>
        DP1.10045.001 is available and not bundled in RELEASE-2021.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.10045.001" release="RELEASE-2021" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.10045.001" release="RELEASE-2021" />
        </Paper>
      </ExampleBlock>
      <DocBlock>
        DP1.10045.001 is not available and bundled in RELEASE-2022.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.10045.001" release="RELEASE-2022" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.10045.001" release="RELEASE-2022" />
        </Paper>
      </ExampleBlock>
      <DocBlock>
        DP1.10045.001 is available when using released data for this product
        in the latest available release, RELEASE-2021, but not available
        and bundled in the latest release.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.10045.001" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.10045.001" />
        </Paper>
      </ExampleBlock>
      <DocBlock>
        DP1.00030.001 is not available in RELEASE-2021, bundled in RELEASE-2022.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00030.001" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00030.001" />
        </Paper>
      </ExampleBlock>
      <DocBlock>
        DP1.00030.001 is not available in RELEASE-2021.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00030.001" release="RELEASE-2021" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00030.001" release="RELEASE-2021" />
        </Paper>
      </ExampleBlock>
      <DocBlock>
        DP1.00030.001 is available in RELEASE-2022 as a bundle.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00030.001" release="RELEASE-2022" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP1.00030.001" release="RELEASE-2022" />
        </Paper>
      </ExampleBlock>
      <DocBlock>
        DP4.00130.001 is not available in RELEASE-2021, not a bundled product.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP4.00130.001" release="RELEASE-2021" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DataProductCitation productCode="DP4.00130.001" release="RELEASE-2021" />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Not Available State</Typography>
      <DocBlock>
        When the product and release combination specified are both valid
        but the specified product is not available with the release, a not
        available message is displayed.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="DP1.00030.001" release="RELEASE-2021" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <DataProductCitation productCode="DP1.00030.001" release="RELEASE-2021" />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Error State</Typography>
      <DocBlock>
        Error state of the data product citation component.
      </DocBlock>
      <CodeBlock>
        {`
import DataProductCitation from 'portal-core-components/lib/components/DataProductCitation';

<DataProductCitation productCode="invalid" />
        `}
      </CodeBlock>
      <ExampleBlock>
        <DataProductCitation productCode="invalid" />
      </ExampleBlock>
    </>
  );
}
