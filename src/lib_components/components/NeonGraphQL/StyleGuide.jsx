/* eslint react/jsx-one-expression-per-line: 0 */
import {
  of,
  map,
  switchMap,
  catchError,
} from 'rxjs';

import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import NeonGraphQL from '@/components/NeonGraphQL/NeonGraphQL';
import Theme from '@/components/Theme/Theme';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

const useStyles = makeStyles((theme) => ({
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
  tableRowGrey: {
    backgroundColor: theme.palette.grey[50],
  },
  tt: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  statusSuccess: {
    fontWeight: 700,
    color: '#009900',
  },
  statusFetching: {
    fontWeight: 700,
    color: '#999900',
  },
  statusError: {
    fontWeight: 700,
    color: '#CC0000',
  },
  statusOther: {
    color: '#666666',
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const rxjsObservableUrl = 'https://rxjs-dev.firebaseapp.com/guide/observable';
  const dataProductAvailabilityLink = (
    <Link href="#DataProductAvailability">Data Product Availability Chart</Link>
  );

  // Methods Table Rows
  const methodRows = [
    // getAllDataProducts
    {
      name: 'getAllDataProducts',
      arguments: (
        <ul>
          <li>
            <tt className={classes.tt}>release</tt> - <i>String, Optional</i>
            <br />
            Release tag (e.g. &quot;test-tag-1&quot;)
          </li>
        </ul>
      ),
      description: 'Get an array of all data products with full attributes (including availability).',
      example: (
        <CodeBlock style={{ margin: 0 }}>
          {`
const observable = NeonGraphQL.getAllDataProducts().pipe(
  map((response) => { /* handle response */ }),
  catchError((error) => { /* handle error */ }),
);

observable.subscribe();
          `}
        </CodeBlock>
      ),
    },
    // getDataProductByCode
    {
      name: 'getDataProductByCode',
      arguments: (
        <ul>
          <li>
            <tt className={classes.tt}>productCode</tt> - <i>String, Required</i>
            <br />
            Data product code (e.g. &quot;DP1.00001.001&quot;)
          </li>
          <li>
            <tt className={classes.tt}>release</tt> - <i>String, Optional</i>
            <br />
            Release tag (e.g. &quot;test-tag-1&quot;)
          </li>
        </ul>
      ),
      description: `
Get a single data product with full attributes (including availability) by product code.
        `,
      example: (
        <CodeBlock style={{ margin: 0 }}>
          {`
const productCode = 'DP1.00001.001';

const observable = NeonGraphQL.getDataProductByCode(productCode).pipe(
  map((response) => { /* handle response */ }),
  catchError((error) => { /* handle error */ }),
);

observable.subscribe();
          `}
        </CodeBlock>
      ),
    },
    // getAllSites
    {
      name: 'getAllSites',
      arguments: <i>none</i>,
      description: 'Get an array of all field sites with full attributes.',
      example: (
        <CodeBlock style={{ margin: 0 }}>
          {`
const observable = NeonGraphQL.getAllSites().pipe(
  map((response) => { /* handle response */ }),
  catchError((error) => { /* handle error */ }),
);

observable.subscribe();
          `}
        </CodeBlock>
      ),
    },
    // getSiteByCode
    {
      name: 'getSiteByCode',
      arguments: (
        <ul>
          <li>
            <tt className={classes.tt}>siteCode</tt> - <i>String, Required</i>
            <br />
            Site code (e.g. &quot;CPER&quot;)
          </li>
        </ul>
      ),
      description: `
Get a single field site with full attributes by site code.
        `,
      example: (
        <CodeBlock style={{ margin: 0 }}>
          {`
const siteCode = 'ABBY';

const observable = NeonGraphQL.getSiteByCode(siteCode).pipe(
  map((response) => { /* handle response */ }),
  catchError((error) => { /* handle error */ }),
);

observable.subscribe();
          `}
        </CodeBlock>
      ),
    },
    // getLocationByName
    {
      name: 'getLocationByName',
      arguments: (
        <ul>
          <li>
            <tt className={classes.tt}>locationName</tt> - <i>String, Required</i>
            <br />
            Location name (e.g. &quot;D10&quot;, &quot;CPER&quot;, &quot;TOWER104454&quot;, etc.)
          </li>
        </ul>
      ),
      description: `
Get a location with full attributes (including locationProperties), by name.
        `,
      example: (
        <CodeBlock style={{ margin: 0 }}>
          {`
const locationName = 'SOILPL104531';

const observable = NeonGraphQL.getLocationByName(locationName).pipe(
  map((response) => { /* handle response */ }),
  catchError((error) => { /* handle error */ }),
);

observable.subscribe();
          `}
        </CodeBlock>
      ),
    },
    // getManyLocationsByName
    {
      name: 'getManyLocationsByName',
      arguments: (
        <ul>
          <li>
            <tt className={classes.tt}>locationNames</tt> - <i>Array of Strings, Required</i>
            <br />
            Array for location name strings (e.g. [&quot;D10&quot;, &quot;CPER&quot;])
          </li>
        </ul>
      ),
      description: `
Get an array containing matching location objects with full attributes
(including locationProperties), by name.
        `,
      example: (
        <CodeBlock style={{ margin: 0 }}>
          {`
const locationNames = ['SYCA.AOS.fish.point.01', 'SYCA.AOS.fish.point.02', 'SYCA.AOS.fish.point.03'];

const observable = NeonGraphQL.getManyLocationsByName(locationNames).pipe(
  map((response) => { /* handle response */ }),
  catchError((error) => { /* handle error */ }),
);

observable.subscribe();
          `}
        </CodeBlock>
      ),
    },
  ];

  // getAllDataProducts
  const [allDataProductsStatus, setAllDataProductsStatus] = useState(null);
  const [allDataProductsResponse, setAllDataProductsResponse] = useState(null);
  const [allDataProductsReleaseArgument, setAllDataProductsReleaseArgument] = useState(null);
  const getAllDataProductsObservable = (release) => (
    NeonGraphQL.getAllDataProducts(release).pipe(
      map((response) => {
        setAllDataProductsStatus(response.response.errors ? 'error' : 'success');
        setAllDataProductsResponse(response.response);
      }),
      catchError((error) => {
        setAllDataProductsStatus('error');
        setAllDataProductsResponse(error);
      }),
    )
  );
  const handleFetchAllDataProducts = () => {
    const release = document.getElementById('allDataProductsReleaseInput').value;
    setAllDataProductsStatus('fetching');
    setAllDataProductsReleaseArgument(release);
    getAllDataProductsObservable(release).subscribe();
  };

  // getDataProductByCode
  const [dataProductByCodeStatus, setDataProductByCodeStatus] = useState(null);
  const [dataProductByCodeArgument, setDataProductByCodeArgument] = useState(null);
  const [dataProductByCodeReleaseArgument, setDataProductByCodeReleaseArgument] = useState(null);
  const [dataProductByCodeResponse, setDataProductByCodeResponse] = useState(null);
  const getDataProductByCodeObservable = (code, release) => (
    NeonGraphQL.getDataProductByCode(code, release).pipe(
      switchMap((resp) => of(resp)),
    ).pipe(
      map((response) => {
        setDataProductByCodeStatus(response.response.errors ? 'error' : 'success');
        setDataProductByCodeResponse(response.response);
      }),
      catchError((error) => {
        setDataProductByCodeStatus('error');
        setDataProductByCodeResponse(error);
      }),
    )
  );
  const handleFetchDataProductByCode = () => {
    const productCode = document.getElementById('getDataProductByCodeInput').value;
    const release = document.getElementById('getDataProductByCodeReleaseInput').value;
    setDataProductByCodeStatus('fetching');
    setDataProductByCodeArgument(productCode);
    setDataProductByCodeReleaseArgument(release);
    getDataProductByCodeObservable(productCode, release).subscribe();
  };

  // getAllSites
  const [allSitesStatus, setAllSitesStatus] = useState(null);
  const [allSitesResponse, setAllSitesResponse] = useState(null);
  const allSitesObservable = NeonGraphQL.getAllSites().pipe(
    map((response) => {
      setAllSitesStatus(response.response.errors ? 'error' : 'success');
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
  const getSiteByCodeObservable = (code) => NeonGraphQL.getSiteByCode(code).pipe(
    switchMap((resp) => of(resp)),
  ).pipe(
    map((response) => {
      setSiteByCodeStatus(response.response.errors ? 'error' : 'success');
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

  const renderStatus = (status) => {
    let className = classes.statusOther;
    if (status === 'success') { className = classes.statusSuccess; }
    if (status === 'error') { className = classes.statusError; }
    return <span className={className}>{status || <i>n/a</i>}</span>;
  };

  return (
    <>

      <DocBlock>
        A utility for generating common Neon GraphQL queries succinctly.
      </DocBlock>
      <CodeBlock>
        {`
import NeonGraphQL from 'portal-core-components/lib/components/NeonGraphQL';
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
      <Typography variant="h6" component="h4" gutterBottom>Query Methods</Typography>

      <TableContainer component={Paper} style={{ maxHeight: '70vh' }}>
        <Table stickyHeader aria-label="props">
          <TableHead>
            <TableRow>
              <TableCell>Method</TableCell>
              <TableCell>Arguments</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {methodRows.map((row, idx) => (
              <React.Fragment key={row.name}>
                <TableRow className={idx % 2 ? classes.tableRowGrey : null}>
                  <TableCell component="th" scope="row" rowSpan={2}>
                    <tt className={classes.tt}>{row.name}</tt>
                  </TableCell>
                  <TableCell>{row.arguments}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
                <TableRow className={idx % 2 ? classes.tableRowGrey : null}>
                  <TableCell colSpan={3} style={{ padding: 0 }}>{row.example}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>
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
          <div>
            Fetch all data products (optional: in release tag:&nbsp;
            <input size="15" id="allDataProductsReleaseInput" defaultValue="" />
            )
            <br />
            <button type="button" onClick={handleFetchAllDataProducts}>
              Fetch
            </button>
          </div>
          <div>
            release: {allDataProductsReleaseArgument || <i>n/a</i>}
          </div>
          <div>
            Status: {renderStatus(allDataProductsStatus)}
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
import { map, catchError } from 'rxjs';
import React, { useState } from 'react';
import NeonGraphQL from 'portal-core-components/lib/components/NeonGraphQL';

const myComponent = () => {
  const classes = useStyles();

  const [allDataProductsStatus, setAllDataProductsStatus] = useState(null);
  const [allDataProductsResponse, setAllDataProductsResponse] = useState(null);
  const [allDataProductsReleaseArgument, setAllDataProductsReleaseArgument] = useState(null);

  const getAllDataProductsObservable = release => (
    NeonGraphQL.getAllDataProducts(release).pipe(
      map((response) => {
        setAllDataProductsStatus('success');
        setAllDataProductsResponse(response.response);
      }),
      catchError((error) => {
        setAllDataProductsStatus('error');
        setAllDataProductsResponse(error);
      }),
    )
  );

  const handleFetchAllDataProducts = () => {
    const release = document.getElementById('allDataProductsReleaseInput').value;
    setAllDataProductsStatus('fetching');
    setAllDataProductsReleaseArgument(release);
    getAllDataProductsObservable(release).subscribe();
  };

  return (
    <div>
      <div>
        Fetch all data products (optional: in release tag:&nbsp;
        <input size="15" id="allDataProductsReleaseInput" defaultValue="" />
        )
        <br />
        <button type="button" onClick={handleFetchAllDataProducts}>
          Fetch
        </button>
      </div>
      <div>
        release: {allDataProductsReleaseArgument || <i>n/a</i>}
      </div>
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
            &nbsp;...(optional: in release tag:&nbsp;
            <input size="15" id="getDataProductByCodeReleaseInput" defaultValue="" />
            )
            <br />
            <button type="button" onClick={handleFetchDataProductByCode}>
              Fetch
            </button>
          </div>
          <div>
            productCode: {dataProductByCodeArgument || <i>n/a</i>}
            <br />
            release: {dataProductByCodeReleaseArgument || <i>n/a</i>}
          </div>
          <div>
            Status: {renderStatus(dataProductByCodeStatus)}
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
import {
  of,
  map,
  switchMap,
  catchError,
} from 'rxjs';
import React, { useState } from 'react';
import NeonGraphQL from 'portal-core-components/lib/components/NeonGraphQL';

const myComponent = () => {
  const classes = useStyles();

  const [dataProductByCodeStatus, setDataProductByCodeStatus] = useState(null);
  const [dataProductByCodeArgument, setDataProductByCodeArgument] = useState(null);
  const [dataProductByCodeReleaseArgument, setDataProductByCodeReleaseArgument] = useState(null);
  const [dataProductByCodeResponse, setDataProductByCodeResponse] = useState(null);

  const getDataProductByCodeObservable = (code, release) => (
    NeonGraphQL.getDataProductByCode(code, release).pipe(
      switchMap(resp => of(resp)),
    ).pipe(
      map((response) => {
        setDataProductByCodeStatus('success');
        setDataProductByCodeResponse(response.response);
      }),
      catchError((error) => {
        console.log('ERROR', error);
        setDataProductByCodeStatus('error');
        setDataProductByCodeResponse(error);
      }),
    )
  );

  const handleFetchDataProductByCode = () => {
    const productCode = document.getElementById('getDataProductByCodeInput').value;
    const release = document.getElementById('getDataProductByCodeReleaseInput').value;
    setDataProductByCodeStatus('fetching');
    setDataProductByCodeArgument(productCode);
    setDataProductByCodeReleaseArgument(release);
    getDataProductByCodeObservable(productCode, release).subscribe();
  };

  return (
    <div>
      <div>
        Fetch a data product by code:&nbsp;
        <input size="15" id="getDataProductByCodeInput" defaultValue="" />
        &nbsp;...(optional: in release tag:&nbsp;
        <input size="15" id="getDataProductByCodeReleaseInput" defaultValue="" />
        )
        <br />
        <button type="button" onClick={handleFetchDataProductByCode}>
          Fetch
        </button>
      </div>
      <div>
        productCode: {dataProductByCodeArgument || <i>n/a</i>}
        <br />
        release: {dataProductByCodeReleaseArgument || <i>n/a</i>}
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
            Status: {renderStatus(allSitesStatus)}
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
import { map, catchError } from 'rxjs';
import React, { useState } from 'react';
import NeonGraphQL from 'portal-core-components/lib/components/NeonGraphQL';

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
            Status: {renderStatus(siteByCodeStatus)}
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
import {
  of,
  map,
  switchMap,
  catchError,
} from 'rxjs';
import React, { useState } from 'react';
import NeonGraphQL from 'portal-core-components/lib/components/NeonGraphQL';

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

    </>
  );
}
