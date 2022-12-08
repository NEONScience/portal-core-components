/* eslint react/jsx-one-expression-per-line: 0 */

import React, { useReducer, useEffect, useState } from 'react';

import { of, map, catchError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import cloneDeep from 'lodash/cloneDeep';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import AopDataViewer from './AopDataViewer';
import DialogBase from '../DialogBase/DialogBase';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import { exists } from '../../util/typeUtil';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  title: {
    fontWeight: 500,
    marginBottom: '8px',
  },
}));

const useDialogBaseStyles = makeStyles((theme) => ({
  contentPaper: {
    margin: theme.spacing(10, 2, 2, 2),
    padding: theme.spacing(3),
    height: '100%',
    position: 'relative',
    width: `calc(100% - ${theme.spacing(2) * 2}px)`,
    minWidth: '340px',
    minHeight: '600px',
    [Theme.breakpoints.down('xs')]: {
      minHeight: '700px',
    },
  },
}));

const DEFAULT_STATE = {
  fetchProducts: {
    status: 'AWAITING_CALL',
    error: null,
  },
  products: [],
  selectedProduct: null,
  isProductLoading: false,
};
const aopViewerReducer = (state: any, action: any) => {
  const newState = { ...state };
  switch (action.type) {
    case 'fetchProductsCalled':
      newState.fetchProducts.status = 'FETCHING';
      return newState;
    case 'fetchProductsSucceeded':
      newState.fetchProducts.status = 'SUCCESS';
      newState.products = action.products;
      // eslint-disable-next-line prefer-destructuring
      newState.selectedProduct = action.products[0];
      return newState;
    case 'fetchProductsFailed':
      newState.fetchProducts.status = 'ERROR';
      newState.fetchProducts.error = action.error;
      return newState;
    case 'selectProduct':
      if (!state.products.find((product: string) => product === action.productCode)) {
        return state;
      }
      newState.selectedProduct = action.productCode;
      newState.isProductLoading = false;
      return newState;
    case 'setProductLoading':
      newState.isProductLoading = true;
      return newState;
    default:
      return state;
  }
};

const AopViewerDemo = (): JSX.Element => {
  const classes = useStyles(Theme);
  const [state, dispatch] = useReducer(
    aopViewerReducer,
    cloneDeep(DEFAULT_STATE),
  );
  const fetchAllProducts$ = ajax({
    method: 'GET',
    url: `${NeonEnvironment.getVisusProductsBaseUrl()}`,
    crossDomain: true,
  }).pipe(
    map((response: any) => {
      if (exists(response)
          && Array.isArray(response.response)
          && (response.response.length > 0)) {
        const products = response.response;
        if (!products.length) {
          dispatch({
            type: 'fetchProductsFailed',
            error: 'fetch succeeded; no products found',
          });
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
  useEffect(() => {
    if (state.fetchProducts.status === 'AWAITING_CALL') {
      dispatch({ type: 'fetchProductsCalled' });
      fetchAllProducts$.subscribe();
    }
  });
  const loadStatus = ['AWAITING_CALL', 'FETCHING'];
  const isLoading = loadStatus.includes(state.fetchProducts.status);
  const isError = state.fetchProducts.status === 'ERROR';
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
      </div>
    );
  }
  const handleChange = (event: any) => {
    const nextProduct = state.products.find((product: any) => (
      product === event.target.value
    ));
    if (!nextProduct) {
      return;
    }
    dispatch({ type: 'setProductLoading' });
    setTimeout(() => {
      dispatch({ type: 'selectProduct', productCode: event.target.value });
    }, 1000);
  };
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            id="all-aop-products-select-label"
            className={classes.title}
          >
            Data Product
          </Typography>
          <Select
            id="all-aop-products-select"
            aria-labelledby="all-aop-products-select-label"
            variant="outlined"
            value={state.selectedProduct}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '32px' }}
          >
            {state.products.map((product: any) => ((
              <MenuItem key={product} value={product}>
                {`${product}`}
              </MenuItem>
            )))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          {state.isProductLoading ? (<Skeleton variant="rect" width="100%" height={600} />) : (
            <AopDataViewer productCode={state.selectedProduct} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const dialogBaseClasses = useDialogBaseStyles(Theme);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>

      <DocBlock>
        An interactive visualization of AOP data sets built and maintained by the
        University of Utah.
      </DocBlock>
      <CodeBlock>
        {`
import AopDataViewer from 'portal-core-components/lib/components/AopDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        Invoke an AOP Data Viewer with a <tt>productCode</tt> prop to generate
        the basic integrated viewer. Site and time selector will be included and
        the viewer itself will be loaded in an iframe. The whole package will
        scale itself responsively to its parent container.
      </DocBlock>
      <ExampleBlock>
        <AopDataViewer productCode="DP3.30026.001" />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopDataViewer productCode="DP3.30026.001" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Demo</Typography>
      <ExampleBlock>
        <AopViewerDemo />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Failure State</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        If passed a <tt>productCode</tt> prop that does not resolve to streamable
        AOP data then the component will load in a generic graceful error state,
        still taking the full width of the container as if it loaded normally.
      </DocBlock>
      <ExampleBlock>
        <AopDataViewer productCode="FAKE.PRODUCT.CODE" />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopDataViewer productCode="FAKE.PRODUCT.CODE" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Initial Site / Year / Flight</Typography>

      <DocBlock>
        There are three props that can be provided to dial into a particular site,
        year, and/or flight:
        <ul>
          <li>
            { /* @ts-ignore */ }
            <tt>initialSite</tt>
            <br />
            Any valid site code string. If provided and not valid for the product
            will revert to first site.
          </li>
          <li>
            { /* @ts-ignore */ }
            <tt>initialYear</tt>
            <br />
            Any 4-digit year as an integer. If provided and not valid for the product
            and initial site will revert to latest year for the initial site.
          </li>
          <li>
            { /* @ts-ignore */ }
            <tt>initialFlight</tt>
            <br />
            Any integer. Flight numbers are indexed starting at 1. If provided and
            not valid for the initial site and year for the product will revert to
            the highest available flight number for the site/year.
          </li>
        </ul>
      </DocBlock>
      <ExampleBlock>
        <AopDataViewer
          productCode="DP3.30012.001"
          initialSite="ABBY"
          initialYear={2021}
          initialFlight={1}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopDataViewer
  productCode="DP3.30012.001"
  initialSite="ABBY"
  initialYear={2021}
  initialFlight={1}
 />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Viewer in Dialog</Typography>

      <ExampleBlock>
        <div style={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Open AOP Viewer Dialog
          </Button>
          <br />
          <br />
          <DialogBase
            open={dialogOpen}
            title="AOP Viewer"
            customClasses={dialogBaseClasses}
            onClose={() => setDialogOpen(false)}
            data-selenium="aop-viewer-dialog"
          >
            <AopDataViewer
              fillContainer
              productCode="DP3.30012.001"
              initialSite="ABBY"
              initialYear={2021}
              initialFlight={1}
            />
          </DialogBase>
        </div>
      </ExampleBlock>

    </>
  );
}
