/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid, max-len, no-unused-vars */
import React, { useReducer, useEffect } from 'react';

import { ReplaySubject } from 'rxjs';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DownloadDataContext from './DownloadDataContext';

import DownloadDataButton from '../DownloadDataButton/DownloadDataButton';
import DataProductAvailability from '../DataProductAvailability/DataProductAvailability';
import Theme from '../Theme/Theme';

import sampleProductData1 from '../../../sampleData/DP1.00001.001.json';
import sampleProductData2 from '../../../sampleData/DP1.00004.001.json';
import sampleProductData3 from '../../../sampleData/DP1.00001.001.release.json';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const selectedSites = ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];

const ListSitesComponent = () => {
  const [{ sites }] = DownloadDataContext.useDownloadDataState();
  return (
    <div>
      <b>You have selected the following {sites.value.length} site(s):</b>
      <br />
      {sites.value.join(', ')}
    </div>
  );
};

const AlphaSitesComponent = () => {
  const [{ sites }, dispatch] = DownloadDataContext.useDownloadDataState();
  const handleSelectSitesByLetter = (letter) => {
    const newSites = sites.validValues.filter((site) => (
      site.toLowerCase().startsWith(letter.toLowerCase())
    ));
    dispatch({
      type: 'setValidatableValue',
      key: 'sites',
      value: newSites,
    });
  };
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <div>
      <b>Select all sites starting with a given letter:</b>
      {letters.map((letter) => (
        <button
          type="button"
          key={letter}
          style={{ marginLeft: '4px' }}
          onClick={() => handleSelectSitesByLetter(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

const MyAppComponent = () => {
  const products = [
    sampleProductData1.data,
    sampleProductData2.data,
  ];

  // "Global" state for this example keeps a copy of the product code and full state of
  // the last child download context to be updated by user interaction. The reducer at this
  // level defers to the context reducer for all unrecognized action types to allow for
  // performing all the same state modifications afforded inside the context at the level
  // of this "global" component.
  const initialMyAppState = {
    downloadProductCode: null,
    downloadState: DownloadDataContext.DEFAULT_STATE,
  };
  const myAppReducer = (state, action) => {
    let reducedState = {};
    switch (action.type) {
      case 'setDownloadState':
        return {
          ...state,
          downloadProductCode: action.downloadState.productData.productCode || null,
          downloadState: action.downloadState,
        };
      default:
        reducedState = DownloadDataContext.reducer(state.downloadState, action);
        return {
          ...state,
          downloadState: reducedState,
        };
    }
  };
  const [myAppState, myAppDispatch] = useReducer(myAppReducer, initialMyAppState);

  // Create an rxjs ReplaySubject to broadcast the global state to all child contexts.
  // Don't forget to dispatch 'setBroadcastDone' at this level so that we stop
  // broadcasting updates at the top level after one time, until another update is
  // made in this component that explicitly triggers a subsequent broadcast.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const higherOrderSubject = new ReplaySubject(1);
  useEffect(() => {
    if (myAppState.downloadState.broadcast) {
      higherOrderSubject.next(myAppState.downloadState);
      myAppDispatch({ type: 'setBroadcastDone' });
    }
  }, [myAppState.downloadState, higherOrderSubject]);

  // Create an effect to subscribe to all contexts so that when they broadcast their
  // state this component can feed it to its own reducer to update its state.
  useEffect(() => {
    DownloadDataContext.getStateObservable().subscribe((downloadState) => {
      myAppDispatch({
        type: 'setDownloadState',
        downloadState,
      });
    });
  }, []);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const handleSelectSitesByLetter = (letter) => {
    const newSites = myAppState.downloadState.sites.validValues.filter((site) => (
      site.toLowerCase().startsWith(letter.toLowerCase())
    ));
    myAppDispatch({
      type: 'setValidatableValue',
      key: 'sites',
      value: newSites,
    });
  };

  return (
    <div>
      Workflow in one button gets applied to the other through higher-order state:
      {products.map((productData) => (
        <div key={productData.productCode} style={{ marginBottom: '20px' }}>
          <hr />
          <DownloadDataContext.Provider
            productData={productData}
            stateObservable={() => higherOrderSubject.asObservable()}
          >
            <DownloadDataButton label={`Download ${productData.productName}`} />
          </DownloadDataContext.Provider>
          {
            myAppState.downloadProductCode === productData.productCode
              ? <div>App state last set from here</div> : null
          }
        </div>
      ))}
      <div>
        <div>
          State can also be changed from the top through other components that
          are not in a download context.
        </div>
        <br />
        <b>Select all sites starting with a given letter:</b>
        {letters.map((letter) => (
          <button
            type="button"
            key={letter}
            style={{ marginLeft: '4px' }}
            onClick={() => handleSelectSitesByLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const downloadDataButtonLink = (
    <Link
      href="#DownloadDataButton"
    >
      Download Data Button
    </Link>
  );
  const dataProductAvailabilityLink = (
    <Link
      href="#DataProductAvailability"
    >
      Data Product Availability
    </Link>
  );
  const useReducerLink = (
    <Link
      target="_new"
      href="https://reactjs.org/docs/hooks-reference.html#usereducer"
    >
      useReducer hook
    </Link>
  );
  const rxjsReplaySubjectsLink = (
    <Link
      target="_new"
      href="https://rxjs-dev.firebaseapp.com/guide/subject#replaysubject"
    >
      RxJS ReplaySubjects
    </Link>
  );

  return (
    <>

      <DocBlock>
        The Download Data Context is a component designed to encapsulate all state
        and validation logic required for a product download configuration workflow.
        It affords a context provider for establishing the encapsulated state at a
        desired spot in the DOM tree and and a hook for accessing and updating that
        state for components nested arbitrarily deep within the provider.
      </DocBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Provider Usage</Typography>

      <Typography variant="h6" component="h4" gutterBottom>Initializing With Product Data</Typography>

      <DocBlock>
        The first step to establish a download configuration workflow is to invoke
        the Download Data Context <tt>Provider</tt>.
      </DocBlock>
      <DocBlock>
        The Provider is invoked as any other component would be - with a JSX tag.
        At a minimum the Provider must have the required <tt>productData</tt> prop
        containing a <tt>productCode</tt> string, a <tt>productName</tt> string,
        and a <tt>siteCodes</tt> array of site availability objects.
      </DocBlock>
      <ExampleBlock>
        <div />
        {/*
        <DownloadDataContext.Provider productData={sampleProductData1.data}>
          <DownloadDataButton />
        </DownloadDataContext.Provider>
        */}
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataButton from 'portal-core-components/lib/components/DownloadDataButton';
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';

const productData = {
  productCode: 'DPX.00001.001',
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
  <DownloadDataButton />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>
      <DocBlock>
        <b>Where in the DOM tree the Provider is invoked is important!</b>
      </DocBlock>
      <DocBlock>
        Since the Provider is a component just like any other component it will
        be rerendered <i>and its state will be reset</i> if it is nested within
        higher order components that are being rerendered. Because the Provider
        state includes a lot of user input (as the download workflow is navigated)
        it is best to avoid ever rerendering a Provider. The best way to do that is
        to invoke it at the highest order possible (e.g. at the application or page
        level, <i>not</i> inside a layout grid or deeper).
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Initializing With Selections</Typography>

      <DocBlock>
        The Provider can be initialized with selections. These will have the effect
        of completing steps in the download configuration workflow automatically.
        Supported props (all optional):
        <ul>
          <li>
            <tt>release</tt> - <i>String</i>
            <br />
            Tag for release to download. Note at present that this prop is the only way to instigate
            a download workflow for a particular release and it <b>cannot</b> be changed from inside
            the workflow via UI at this time.
          </li>
          <li>
            <tt>sites</tt> - <i>Array</i>
            <br />
            List of selected site code strings (e.g. <tt>[&quot;ABBY&quot;, &quot;BART&quot;, ...]</tt>)
          </li>
          <li>
            <tt>dateRange</tt> - <i>Array</i>
            <br />
            List of exactly two year-month strings to represent selected date range (e.g. <tt>[&quot;2013-08&quot;, &quot;2017-11&quot;]</tt>)
          </li>
          <li>
            <tt>documentation</tt> - <i>String</i>
            <br />
            Whether to include documentation; either <tt>&quot;include&quot;</tt> or <tt>&quot;exclude&quot;</tt>
          </li>
          <li>
            <tt>packageType</tt> - <i>String</i>
            <br />
            Either <tt>&quot;basic&quot;</tt> or <tt>&quot;expanded&quot;</tt>
          </li>
        </ul>
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider
          productData={sampleProductData3.data}
          release="test-tag-1"
          sites={['ARIK']}
          documentation="exclude"
          packageType="basic"
        >
          <DownloadDataButton />
        </DownloadDataContext.Provider>
        <DownloadDataContext.Provider
          productData={sampleProductData3.data}
        >
          <DownloadDataButton label="No Props" />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataButton from 'portal-core-components/lib/components/DownloadDataButton';
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';

const productData = {...};

<DownloadDataContext.Provider
  productData={productData}
  release="test-tag-1"
  sites={['ARIK']}
  documentation="exclude"
  packageType="basic"
>
  <DownloadDataButton />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Hook Usage</Typography>

      <Typography variant="h6" component="h4" gutterBottom>Accessing State</Typography>

      <DocBlock>
        When building a new component that is to exist within the Download Data Context
        the shared state can be accessed by invoking the <tt>useDownloadDataState</tt> hook.
      </DocBlock>
      <DocBlock>
        All values in state can be accessed locally using the destructuring pattern shown below.
        The <tt>useDownloadDataState</tt> hook returns a similar structure to the React {useReducerLink}.
        The return value is an array of two elements. The first element is the entire download
        configuration state, out of which individual state values can be destructured.
      </DocBlock>
      <ExampleBlock>
        <div />
        {/*
        <div>
          <DownloadDataContext.Provider
            productData={sampleProductData1.data}
            sites={selectedSites}
          >
            <ListSitesComponent />
            <hr />
            <DataProductAvailability />
          </DownloadDataContext.Provider>
        </div>
         */}
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {...};
const selectedSites = ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];

const ListSitesComponent = () => {
  const [{ sites }] = DownloadDataContext.useDownloadDataState();
  return (
    <div>
      <b>You have selected the following {sites.value.length} site(s):</b>
      <br />
      {sites.value.join(', ')}
    </div>
  );
};

<DownloadDataContext.Provider
  productData={productData}
  sites={selectedSites}
>
  <ListSitesComponent />
  <hr />
  <DataProductAvailability />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Manipulating State</Typography>

      <DocBlock>
        If a component nested in the Download Data Context should have read and write access
        to the shared state it can obtain a <tt>dispatch</tt> function from the hook. This
        feeds a reducer as seen in Redux and useReducer patterns. State can <i>only</i> be
        updated by feeding the dispatch function an action with a <tt>type</tt> and, if
        appropriate, new data to apply.
      </DocBlock>
      <ExampleBlock>
        <div />
        {/*
        <div>
          <DownloadDataContext.Provider
            productData={sampleProductData1.data}
            sites={selectedSites}
          >
            <AlphaSitesComponent />
            <hr />
            <DataProductAvailability />
          </DownloadDataContext.Provider>
        </div>
        */}
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const productData = {...};
const selectedSites = ['ARIK', 'COMO', 'CPER', 'NIWO', 'RMNP', 'STER', 'UNDE', 'WLOU'];

const AlphaSitesComponent = () => {
  const [{ sites }, dispatch] = DownloadDataContext.useDownloadDataState();

  const handleSelectSitesByLetter = (letter) => {
    const newSites = sites.validValues.filter(site => (
      site.toLowerCase().startsWith(letter.toLowerCase())
    ));
    dispatch({
      type: 'setValidatableValue',
      key: 'sites',
      value: newSites,
    });
  };

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div>
      <b>Select all sites starting with a given letter:</b>
      {letters.map(letter => (
        <button
          type="button"
          style={{ marginLeft: '4px' }}
          onClick={() => handleSelectSitesByLetter(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

<DownloadDataContext.Provider
  productData={productData}
  sites={selectedSites}
>
  <AlphaSitesComponent />
  <hr />
  <DataProductAvailability />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Tying to Higher-Order State</Typography>

      <DocBlock>
        The importable Download Data Context object exports additional functions and objects
        for use in mirroring local context state in a higher order component or at application level:
        <ul>
          <li>
            <tt>DEFAULT_STATE</tt> - <i>Object</i>
            <br />
            Default state object used for every Download Data Context prior to product specification
          </li>
          <li>
            <tt>reducer</tt> - <i>Function</i>
            <br />
            Pure reducer function used by every Download Data Context for all state modifications
          </li>
          <li>
            <tt>getStateObservable</tt> - <i>Function</i>
            <br />
            Export of an RxJS ReplaySubject as an Observable for subscribing to broadcasted state updates from all Download Data Contexts
          </li>
        </ul>
      </DocBlock>
      <DocBlock>
        As shown in the example below, {rxjsReplaySubjectsLink} can be used to connect the state in
        arbitrarily many Download Data Contexts to state in a higher-order component and vice versa.
        The net effect is that a page can selectively apply state updates in one Download Data Context
        to others on the same page, or make updates to state inside Download Data Contexts from outside
        any particular context (i.e. using custom components).
      </DocBlock>
      <DocBlock>
        <i>NOTE:</i> <tt>ReplaySubject(1)</tt> is recommended as opposed to <tt>Subject()</tt> for the
        higher order observable because ReplaySubjects will &quot;replay&quot; their last value(s) to new
        subscribers upon subscription. The <tt>(1)</tt> argument specifices that we only want the one
        previous value played to new subscribers upon subscription. The net effect is that if the higher
        order observable has download state to share then as new subscribers are added they
        will <i>immediately</i> pick up the download state in the observable, instead of waiting
        for the next upstream change.
      </DocBlock>
      <DocBlock>
        To prevent an infinite state update loop not all updates are broadcasted by the Download
        Data Context. This is handled by a <tt>broadcast</tt> boolean at the root of the Download
        Data Context state which is <i>false</i> most of the time. An update to a validatable field
        (e.g. <tt>sites</tt>, <tt>dateRange</tt>, <tt>packageType</tt>, etc.) will also
        flip <tt>broadcast</tt> to <i>true</i>, prompting the entire updated state inside the
        context to be broadcasted through the context&apos;s RxJS ReplaySubject. Then, any higher order
        components that have subscribed to <tt>DownloadDataContext.getStateObservable()</tt> will
        see the update and any logic they have tied to it will be triggered.
      </DocBlock>
      <DocBlock>
        To push state changes into all Download Data Contexts from the higher order state, as
        shown in the example below, the higher order component creates its own RxJS ReplaySubject.
        This is then provided via the <tt>stateObservable</tt> prop to all child contexts that
        should be paying attention to changes coming from the higher order state. The Download
        Data Context, when provided this prop, will automatically subscribe, expecting the higher
        order subject to provide <b>whole Download Data Context state objects</b> (<i>not</i> partial
        objects!) Upon seeing an update through the context the full context state from the higher
        order component will be selectively applied within the context (meaning validatable values such
        as <tt>sites</tt>, <tt>dateRange</tt>, etc. will be applied, and logic will be applied to make
        those values <i>fit</i> the context as best as possible, such as taking the intersecion of
        sites from the higher order state and valid sites available for the particular context). This
        application of higher order state will never affect the data product in an individual context,
        nor will the application of higher order state to a local context be broadcasted back out to
        to the higher order component.
      </DocBlock>
      <ExampleBlock>
        <div />
        {/*
        <MyAppComponent />
        */}
      </ExampleBlock>
      <CodeBlock>
        {`
import React, { useReducer, useEffect } from 'react';
import { ReplaySubject } from 'rxjs';

import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';

const MyAppComponent = () => {
  const products = [
    {...}, // Product data for DP1.00001.001 - 2D Wind Speed and Direction
    {...}, // Product data for DP1.00004.001 - Barometric Pressure
  ];

  // "Global" state for this example keeps a copy of the product code and full state of
  // the last child download context to be updated by user interaction. The reducer at this
  // level defers to the context reducer for all unrecognized action types to allow for
  // performing all the same state modifications afforded inside the context at the level
  // of this "global" component.
  const initialMyAppState = {
    downloadProductCode: null,
    downloadState: DownloadDataContext.DEFAULT_STATE,
  };
  const myAppReducer = (state, action) => {
    let reducedState = {};
    switch (action.type) {
      case 'setDownloadState':
        return {
          ...state,
          downloadProductCode: action.downloadState.productData.productCode || null,
          downloadState: action.downloadState,
        };
      default:
        reducedState = DownloadDataContext.reducer(state.downloadState, action);
        return {
          ...state,
          downloadState: reducedState,
        };
    }
  };
  const [myAppState, myAppDispatch] = useReducer(myAppReducer, initialMyAppState);

  // Create an rxjs ReplaySubject to broadcast the global state to all child contexts.
  // Don't forget to dispatch 'setBroadcastDone' at this level so that we stop
  // broadcasting updates at the top level after one time, until another update is
  // made in this component that explicitly triggers a subsequent broadcast.
  const higherOrderSubject = new ReplaySubject();
  useEffect(() => {
    if (myAppState.downloadState.broadcast) {
      higherOrderSubject.next(myAppState.downloadState);
      myAppDispatch({ type: 'setBroadcastDone' });
    }
  }, [myAppState.downloadState]);

  // Create an effect to subscribe to all contexts so that when they broadcast their
  // state this component can feed it to its own reducer to update its state.
  useEffect(() => {
    DownloadDataContext.getStateObservable().subscribe((downloadState) => {
      myAppDispatch({
        type: 'setDownloadState',
        downloadState,
      });
    });
  }, []);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const handleSelectSitesByLetter = (letter) => {
    const newSites = myAppState.downloadState.sites.validValues.filter(site => (
      site.toLowerCase().startsWith(letter.toLowerCase())
    ));
    myAppDispatch({
      type: 'setValidatableValue',
      key: 'sites',
      value: newSites,
    });
  };

  return (
    <div>
      Workflow in one button gets applied to the other through higher-order state:
      {products.map(productData => (
        <div key={productData.productCode} style={{ marginBottom: '20px' }}>
          <hr />
          <DownloadDataContext.Provider
            productData={productData}
            stateObservable={() => higherOrderSubject.asObservable()}
          >
            <DownloadDataButton label={\`Download $\{productData.productName}\`} />
          </DownloadDataContext.Provider>
          {
            myAppState.downloadProductCode === productData.productCode
              ? <div>App state last set from here</div> : null
          }
        </div>
      ))}
      <div>
        <div>
          State can also be changed from the top through other components that
          are not in a download context.
        </div>
        <br />
        <b>Select all sites starting with a given letter:</b>
        {letters.map(letter => (
          <button
            type="button"
            key={letter}
            style={{ marginLeft: '4px' }}
            onClick={() => handleSelectSitesByLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};
        `}
      </CodeBlock>

    </>
  );
}
