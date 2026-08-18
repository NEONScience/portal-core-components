import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import { of, map, catchError } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import { resolveProps } from '../../util/defaultProps';

const DRUPAL_HEADER_HTML = REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY;
const DRUPAL_FOOTER_HTML = REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY;

export const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

const DEFAULT_STATE = {
  html: {
    [DRUPAL_HEADER_HTML]: null,
    [DRUPAL_FOOTER_HTML]: null,
  },
  fetches: {
    [DRUPAL_HEADER_HTML]: { status: null, error: null },
    [DRUPAL_FOOTER_HTML]: { status: null, error: null },
  },
  isActive: false,
  isFinal: false,
  hasError: false,
  whenFinalCalled: false,
};

/**
   CONTEXT
*/
const Context = createContext(DEFAULT_STATE);

/**
   HOOK
*/
const useNeonPageAssetsContextState = () => {
  const hookResponse = useContext(Context);
  // If called by a component that's not inside a NeonPageAssetsContext the hookResponse will be
  // DEFAULT_STATE. Otherwise it will return an array of length one containing the current state.
  // Thus we double-check here that we got an active state before returning it.
  if (!Array.isArray(hookResponse) || !hookResponse[0].isActive) {
    return [
      { ...DEFAULT_STATE },
      () => {},
    ];
  }
  return hookResponse;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  // Always deep clone fetches as that's the main thing we care about
  // changing to trigger re-renders in the consumer.
  const newState = { ...state, fetches: cloneDeep(state.fetches) };
  const hasValidRemoteAsset = action.asset && Object.keys(REMOTE_ASSETS).includes(action.asset);
  switch (action.type) {
    case 'fetchCalled':
      if (!action.key || !state.fetches[action.key]) { return state; }
      newState.fetches[action.key].status = FETCH_STATUS.FETCHING;
      return newState;

    // Actions for handling remote assets
    case 'fetchHtmlSucceeded':
      if (!hasValidRemoteAsset) { return state; }
      newState.fetches[action.asset].status = FETCH_STATUS.SUCCESS;
      newState.html[action.asset] = action.html;
      return newState;
    case 'fetchHtmlFailed':
      if (!hasValidRemoteAsset) { return state; }
      newState.fetches[action.asset].status = FETCH_STATUS.ERROR;
      newState.fetches[action.asset].error = action.error;
      return newState;

    case 'whenFinalCalled':
      return { ...newState, whenFinalCalled: true };

    default:
      return state;
  }
};

const defaultProps = {
  children: null,
  fetchPartials: false,
  whenFinal: () => {},
};

/**
   Context Provider
*/
const Provider = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    children,
    fetchPartials,
    whenFinal,
  } = props;

  const initialState = cloneDeep(DEFAULT_STATE);
  initialState.isActive = true;
  if (fetchPartials) {
    initialState.fetches[DRUPAL_HEADER_HTML].status = FETCH_STATUS.AWAITING_CALL;
    initialState.fetches[DRUPAL_FOOTER_HTML].status = FETCH_STATUS.AWAITING_CALL;
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isFinal,
    whenFinalCalled,
  } = state;

  // Method to sanitize partial HTML. As delivered presently there are some markup issues that
  // throw warnings when parsed with HTMLReactParser.
  const sanitizePartialHTML = (html) => html.replace(/ value=""/g, ' initialValue=""');

  // Method to fetch header and/or footer partials
  const fetchPartialHTML = (key) => {
    if (!Object.keys(REMOTE_ASSETS).includes(key)) { return; }
    const { url } = REMOTE_ASSETS[key];
    ajax({
      url,
      method: 'GET',
      responseType: 'text',
    }).pipe(
      map((response) => {
        dispatch({
          type: 'fetchHtmlSucceeded',
          asset: key,
          html: sanitizePartialHTML(response.response),
        });
        return of(true);
      }),
      catchError((error) => {
        dispatch({ type: 'fetchHtmlFailed', asset: key, error });
        return of(false);
      }),
    ).subscribe();
  };

  const fetchMethods = {
    [DRUPAL_HEADER_HTML]: () => fetchPartialHTML(DRUPAL_HEADER_HTML),
    [DRUPAL_FOOTER_HTML]: () => fetchPartialHTML(DRUPAL_FOOTER_HTML),
  };

  // Effect: Trigger all fetches that are awaiting call
  useEffect(() => {
    Object.keys(state.fetches).forEach((key) => {
      if (
        state.fetches[key].status !== FETCH_STATUS.AWAITING_CALL
          || typeof fetchMethods[key] !== 'function'
      ) { return; }
      dispatch({ type: 'fetchCalled', key });
      fetchMethods[key]();
    });
  });

  // Effect: call the whenFinal function prop exactly once when first finalized
  useEffect(() => {
    if (!isFinal || whenFinalCalled) { return; }
    whenFinal(cloneDeep({ ...state, whenFinalCalled: true }));
    dispatch({ type: 'whenFinalCalled' });
  }, [isFinal, whenFinalCalled, whenFinal, state]);

  /**
     Render
  */
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

const ProviderPropTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]),
  fetchPartials: PropTypes.bool,
  whenFinal: PropTypes.func,
};
Provider.propTypes = ProviderPropTypes;

/**
   getWrappedComponent
*/
const getWrappedComponent = (Component) => (props) => {
  const [{ isActive }] = useNeonPageAssetsContextState();
  if (!isActive) {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  }
  return <Component {...props} />;
};

/**
   Export
*/
const NeonPageAssetsContext = {
  Provider,
  useNeonPageAssetsContextState,
  DEFAULT_STATE,
  getWrappedComponent,
  ProviderPropTypes,
};
export default NeonPageAssetsContext;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    reducer,
    DRUPAL_HEADER_HTML,
    DRUPAL_FOOTER_HTML,
  }
);
