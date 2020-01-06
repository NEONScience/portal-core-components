/* eslint react/jsx-one-expression-per-line: 0 */

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import NeonGraphQL from './NeonGraphQL';

import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  pre: {
    width: '100%',
    height: '40vh',
    overflowY: 'scroll',
    whiteSpace: 'pre',
    fontFamily: 'monospace',
    border: '1px dotted black',
    padding: '4px',
  },
}));

export default function StyleGuide(props) {
  const classes = useStyles(Theme);
  const { onClickHash } = props;
  const rxjsObservableUrl = 'https://rxjs-dev.firebaseapp.com/guide/observable';
  const dataProductAvailabilityLink = (
    <Link
      href="#DataProductAvailability"
      onClick={() => onClickHash('#DataProductAvailability')}
    >
      Data Product Availability Chart
    </Link>
  );

  // getAllDataProducts
  const [allDataProductsStatus, setAllDataProductsStatus] = useState(null);
  const [allDataProductsResponse, setAllDataProductsResponse] = useState(null);
  const allDataProductsObservable = NeonGraphQL.getAllDataProducts().pipe(
    map((response) => {
      setAllDataProductsStatus('success');
      setAllDataProductsResponse(response.response);
    }),
    catchError((error) => {
      setAllDataProductsStatus('error');
      setAllDataProductsResponse(error);
    }),
  );
  const handleFetchAllDataProducts = () => {
    setAllDataProductsStatus('fetching');
    allDataProductsObservable.subscribe();
  };

  // getDataProductByCode
  const [dataProductByCodeStatus, setDataProductByCodeStatus] = useState(null);
  const [dataProductByCodeArgument, setDataProductByCodeArgument] = useState(null);
  const [dataProductByCodeResponse, setDataProductByCodeResponse] = useState(null);
  const getDataProductByCodeObservable = code => NeonGraphQL.getDataProductByCode(code).pipe(
    switchMap(resp => of(resp)),
  ).pipe(
    map((response) => {
      setDataProductByCodeStatus('success');
      setDataProductByCodeResponse(response.response);
    }),
    catchError((error) => {
      setDataProductByCodeStatus('error');
      setDataProductByCodeResponse(error);
    }),
  );
  const handleFetchDataProductByCode = () => {
    const code = document.getElementById('getDataProductByCodeInput').value;
    setDataProductByCodeStatus('fetching');
    setDataProductByCodeArgument(code);
    getDataProductByCodeObservable(code).subscribe();
  };

  // getAllSites
  const [allSitesStatus, setAllSitesStatus] = useState(null);
  const [allSitesResponse, setAllSitesResponse] = useState(null);
  const allSitesObservable = NeonGraphQL.getAllSites().pipe(
    map((response) => {
      setAllSitesStatus('success');
      setAllSitesResponse(response.response);
    }),
    catchError((error) => {
      setAllSitesStatus('error');
      setAllSitesResponse(error);
    }),
  );
  const handleFetchAllSites = () => {
    setAllSitesStatus('fetching');
    allSitesObservable.subscribe();
  };

  // getSiteByCode
  const [siteByCodeStatus, setSiteByCodeStatus] = useState(null);
  const [siteByCodeArgument, setSiteByCodeArgument] = useState(null);
  const [siteByCodeResponse, setSiteByCodeResponse] = useState(null);
  const getSiteByCodeObservable = code => NeonGraphQL.getSiteByCode(code).pipe(
    switchMap(resp => of(resp)),
  ).pipe(
    map((response) => {
      setSiteByCodeStatus('success');
      setSiteByCodeResponse(response.response);
    }),
    catchError((error) => {
      setSiteByCodeStatus('error');
      setSiteByCodeResponse(error);
    }),
  );
  const handleFetchSiteByCode = () => {
    const code = document.getElementById('getSiteByCodeInput').value;
    setSiteByCodeStatus('fetching');
    setSiteByCodeArgument(code);
    getSiteByCodeObservable(code).subscribe();
  };

  return (
    <React.Fragment>

      <DocBlock>
        A utility for generating common Neon GraphQL queries succinctly.
      </DocBlock>
      <CodeBlock>
        {`
import { NeonGraphQL } from 'portal-core-components';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        The NeonGraphQL utility affords a handful of methods for generating GraphQL queries in
        the form of <Link href={rxjsObservableUrl}>RxJS Observables</Link>. This allows maximum
        flexibility with how the success and error responses can be handled by the app using
        this component. It also means that queries returned from this utility are actually
        not <i>executed</i> immediately; that is also up to the hosting app.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Get All Data Products</Typography>

      <DocBlock>
        <tt>NeonGraphQL.getAllDataProducts()</tt>
        <ul>
          <li>
            <i>no arguments</i>
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        Get an observable that will query the GraphQL endpoint for all data products.
        This query type currently supports neither filtering, sorting, nor pagination.
        The result set is small enough (less than 200 records) that it is workable to
        send the whole payload once. Ultimately filtering, sorting, and pagination may
        be added to this method.
      </DocBlock>
      <DocBlock>
        Data Product records in the response will contain high-level information about
        each data product suitable for use on a page showing many data products. This
        includes site/month information for populating a {dataProductAvailabilityLink},
        but not deeper information such as data URLs for individual site/months.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <button type="button" onClick={handleFetchAllDataProducts}>
            Fetch all data products
          </button>
          <div>
            Status: {allDataProductsStatus || <i>n/a</i>}
          </div>
          <div className={classes.pre}>
            {allDataProductsResponse
              ? JSON.stringify(allDataProductsResponse, null, 2)
              : <i>n/a</i>}
          </div>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import { map, catchError } from 'rxjs/operators';
import React, { useState } from 'react';
import { NeonGraphQL } from 'portal-core-components';

const myComponent = () => {
  const classes = useStyles();

  const [allDataProductsStatus, setAllDataProductsStatus] = useState(null);
  const [allDataProductsResponse, setAllDataProductsResponse] = useState(null);

  const allDataProductsObservable = NeonGraphQL.getAllDataProducts().pipe(
    map((response) => {
      setAllDataProductsStatus('success');
      setAllDataProductsResponse(response.response);
    }),
    catchError((error) => {
      setAllDataProductsStatus('error');
      setAllDataProductsResponse(error);
    }),
  );

  const handleFetchAllDataProducts = () => {
    setAllDataProductsStatus('fetching');
    allDataProductsObservable.subscribe();
  };

  return (
    <div>
      <button type="button" onClick={handleFetchAllDataProducts}>
        Fetch all data products
      </button>
      <div>
        Status: {allDataProductsStatus || <i>n/a</i>}
      </div>
      <pre>
        {allDataProductsResponse
          ? JSON.stringify(allDataProductsResponse, null, 2)
          : <i>n/a</i>}
      </pre>
    </div>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Get Data Product By Code</Typography>

      <DocBlock>
        <tt>NeonGraphQL.getDataProductByCode(&lt;code&gt;)</tt>
        <ul>
          <li>
            <tt>code</tt> - <i>String, Required</i>
            <br />
            Data product code (e.g. &quot;DP1.00001.001&quot;)
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        Get an observable that will query the GraphQL endpoint for a single data product,
        identified by product code. The response will contain deeper product information
        (as supported by teh GraphQL implementation) including site/month data suitable for
        populating a {dataProductAvailabilityLink}.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <div>
            Fetch a data product by code:&nbsp;
            <input size="15" id="getDataProductByCodeInput" defaultValue="" />
            <button type="button" onClick={handleFetchDataProductByCode}>
              Fetch
            </button>
          </div>
          <div>
            Argument: {dataProductByCodeArgument || <i>n/a</i>}
          </div>
          <div>
            Status: {dataProductByCodeStatus || <i>n/a</i>}
          </div>
          <div className={classes.pre}>
            {dataProductByCodeResponse
              ? JSON.stringify(dataProductByCodeResponse, null, 2)
              : <i>n/a</i>}
          </div>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import React, { useState } from 'react';
import { NeonGraphQL } from 'portal-core-components';

const myComponent = () => {
  const classes = useStyles();

  const [dataProductByCodeStatus, setDataProductByCodeStatus] = useState(null);
  const [dataProductByCodeArgument, setDataProductByCodeArgument] = useState(null);
  const [dataProductByCodeResponse, setDataProductByCodeResponse] = useState(null);

  const getDataProductByCodeObservable = code => NeonGraphQL.getDataProductByCode(code).pipe(
    switchMap(resp => of(resp)),
  ).pipe(
    map((response) => {
      setDataProductByCodeStatus('success');
      setDataProductByCodeResponse(response.response);
    }),
    catchError((error) => {
      setDataProductByCodeStatus('error');
      setDataProductByCodeResponse(error);
    }),
  );

  const handleFetchDataProductByCode = () => {
    const code = document.getElementById('getDataProductByCodeInput').value;
    setDataProductByCodeStatus('fetching');
    setDataProductByCodeArgument(code);
    getDataProductByCodeObservable(code).subscribe();
  };

  return (
    <div>
      <div>
        Fetch a data product by code:&nbsp;
        <input size="15" id="getDataProductByCodeInput" defaultValue="" />
        <button type="button" onClick={handleFetchDataProductByCode}>
          Fetch
        </button>
      </div>
      <div>
        Argument: {dataProductByCodeArgument || <i>n/a</i>}
      </div>
      <div>
        Status: {dataProductByCodeStatus || <i>n/a</i>}
      </div>
      <pre>
        {dataProductByCodeResponse
          ? JSON.stringify(dataProductByCodeResponse, null, 2)
          : <i>n/a</i>}
      </pre>
    </div>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Get All Sites</Typography>

      <DocBlock>
        <tt>NeonGraphQL.getAllSites()</tt>
        <ul>
          <li>
            <i>no arguments</i>
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        Get an observable that will query the GraphQL endpoint for all field sites.
        This query type currently supports neither filtering, sorting, nor pagination.
        The result set is small enough (less than 100 records) that it is workable to
        send the whole payload once. Ultimately filtering, sorting, and pagination may
        be added to this method.
      </DocBlock>
      <DocBlock>
        Site records in the response will contain high-level information about
        each site suitable for showing all sites on a map.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <button type="button" onClick={handleFetchAllSites}>
            Fetch all sites
          </button>
          <div>
            Status: {allSitesStatus || <i>n/a</i>}
          </div>
          <div className={classes.pre}>
            {allSitesResponse
              ? JSON.stringify(allSitesResponse, null, 2)
              : <i>n/a</i>}
          </div>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import { map, catchError } from 'rxjs/operators';
import React, { useState } from 'react';
import { NeonGraphQL } from 'portal-core-components';

const myComponent = () => {
  const classes = useStyles();

  const [allSitesStatus, setAllSitesStatus] = useState(null);
  const [allSitesResponse, setAllSitesResponse] = useState(null);

  const allSitesObservable = NeonGraphQL.getAllSites().pipe(
    map((response) => {
      setAllSitesStatus('success');
      setAllSitesResponse(response.response);
    }),
    catchError((error) => {
      setAllSitesStatus('error');
      setAllSitesResponse(error);
    }),
  );

  const handleFetchAllSites = () => {
    setAllSitesStatus('fetching');
    allSitesObservable.subscribe();
  };

  return (
    <div>
      <button type="button" onClick={handleFetchAllSites}>
        Fetch all sites
      </button>
      <div>
        Status: {allSitesStatus || <i>n/a</i>}
      </div>
      <pre>
        {allSitesResponse
          ? JSON.stringify(allSitesResponse, null, 2)
          : <i>n/a</i>}
      </pre>
    </div>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Get Site By Code</Typography>

      <DocBlock>
        <tt>NeonGraphQL.getSiteByCode(&lt;code&gt;)</tt>
        <ul>
          <li>
            <tt>code</tt> - <i>String, Required</i>
            <br />
            Site code (e.g. &quot;CPER&quot;)
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        Get an observable that will query the GraphQL endpoint for a single site,
        identified by site code.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <div>
            Fetch a site by code:&nbsp;
            <input size="15" id="getSiteByCodeInput" defaultValue="" />
            <button type="button" onClick={handleFetchSiteByCode}>
              Fetch
            </button>
          </div>
          <div>
            Argument: {siteByCodeArgument || <i>n/a</i>}
          </div>
          <div>
            Status: {siteByCodeStatus || <i>n/a</i>}
          </div>
          <div className={classes.pre}>
            {siteByCodeResponse
              ? JSON.stringify(siteByCodeResponse, null, 2)
              : <i>n/a</i>}
          </div>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import React, { useState } from 'react';
import { NeonGraphQL } from 'portal-core-components';

const myComponent = () => {
  const classes = useStyles();

  const [siteByCodeStatus, setSiteByCodeStatus] = useState(null);
  const [siteByCodeArgument, setSiteByCodeArgument] = useState(null);
  const [siteByCodeResponse, setSiteByCodeResponse] = useState(null);

  const getSiteByCodeObservable = code => NeonGraphQL.getSiteByCode(code).pipe(
    switchMap(resp => of(resp)),
  ).pipe(
    map((response) => {
      setSiteByCodeStatus('success');
      setSiteByCodeResponse(response.response);
    }),
    catchError((error) => {
      setSiteByCodeStatus('error');
      setSiteByCodeResponse(error);
    }),
  );

  const handleFetchSiteByCode = () => {
    const code = document.getElementById('getSiteByCodeInput').value;
    setSiteByCodeStatus('fetching');
    setSiteByCodeArgument(code);
    getSiteByCodeObservable(code).subscribe();
  };

  return (
    <div>
      <div>
        Fetch a site by code:&nbsp;
        <input size="15" id="getSiteByCodeInput" defaultValue="" />
        <button type="button" onClick={handleFetchSiteByCode}>
          Fetch
        </button>
      </div>
      <div>
        Argument: {siteByCodeArgument || <i>n/a</i>}
      </div>
      <div>
        Status: {siteByCodeStatus || <i>n/a</i>}
      </div>
      <pre>
        {siteByCodeResponse
          ? JSON.stringify(siteByCodeResponse, null, 2)
          : <i>n/a</i>}
      </pre>
    </div>
  );
}
        `}
      </CodeBlock>

    </React.Fragment>
  );
}

StyleGuide.propTypes = {
  onClickHash: PropTypes.func.isRequired,
};