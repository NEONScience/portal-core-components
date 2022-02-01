import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

import NeonContext from '../../NeonContext/NeonContext';
import NeonGraphQL from '../../NeonGraphQL/NeonGraphQL';

import ActionCreator from './Actions';
import Reducer from './Reducer';
import Service from './Service';
import { CONTEXT_STATUS, DEFAULT_STATE } from './State';

import { exists, isStringNonEmpty } from '../../../util/typeUtil';
import { Undef } from '../../../types/core';

const StateContext = createContext<any>(DEFAULT_STATE);
const DispatchContext = createContext<Undef<Dispatch<any>>>(undefined);

const useDataProductCitationContextState = () => {
  let state: any = useContext(StateContext);
  if (!exists(state)) {
    state = cloneDeep(DEFAULT_STATE);
  }
  return state;
};
const useDataProductCitationContextDispatch = () => {
  const dispatchContext = useContext(DispatchContext);
  if (!exists(dispatchContext)) {
    throw new Error('Failed to initialize dispatch context');
  }
  return dispatchContext;
};

const buildProductQuery = (productCode: string, release?: string): string => {
  const hasRelease = isStringNonEmpty(release);
  const releaseArgument = !hasRelease ? '' : `, release: "${release as string}"`;
  return `query Product {
    product(productCode: "${productCode}"${releaseArgument}) {
      productCode
      productName
      productDescription
      releases {
        release
        generationDate
        url
        productDoi {
          url
          generationDate
        }
      }
    }
  }`;
};

const verifyProductResponse = (response: AjaxResponse): boolean => (
  exists(response)
  && exists(response.response)
  && exists(response.response.data)
  && exists(response.response.data.product)
);

const Provider = (props: any) => {
  const {
    productCode: propsProductCode,
    release: propsRelease,
    contextControlled,
    children,
  } = props;

  const [neonContextState] = NeonContext.useNeonContextState();
  const {
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError,
  } = neonContextState;

  const initialState = {
    ...cloneDeep(DEFAULT_STATE),
    productCode: propsProductCode,
    release: propsRelease,
  };
  if (neonContextIsFinal && !neonContextHasError) {
    initialState.neonContextState = { ...neonContextState };
  }
  const [state, dispatch] = useReducer(Reducer, initialState);
  const {
    component: { status },
    productCode,
    release,
    fetches,
  } = state;

  useEffect(() => {
    if (status !== CONTEXT_STATUS.INITIALIZING) { return; }
    if (!isStringNonEmpty(productCode)) {
      dispatch(ActionCreator.error('Data product not found'));
    }
  }, [status, productCode]);

  // Respond to prop changes when not context controlled
  useEffect(() => {
    if (contextControlled) { return; }
    if (status !== CONTEXT_STATUS.READY) { return; }
    if ((productCode !== propsProductCode) || (release !== propsRelease)) {
      dispatch(ActionCreator.reinitialize(propsProductCode, propsRelease));
    }
  }, [
    contextControlled,
    status,
    productCode,
    propsProductCode,
    release,
    propsRelease,
  ]);

  useEffect(() => {
    if (neonContextIsFinal && !neonContextHasError) {
      dispatch(ActionCreator.storeFinalizedNeonContextState(neonContextState));
    }
  }, [
    neonContextState,
    neonContextIsFinal,
    neonContextHasError,
  ]);

  // Trigger any fetches that are awaiting call
  useEffect(() => {
    // NeonContext is required to fetch data for the app due to bundles.
    if (!neonContextIsFinal) { return; }
    if (status !== CONTEXT_STATUS.HAS_FETCHES_TO_TRIGGER) { return; }
    // Base product fetch
    if (Service.fetchIsAwaitingCall(fetches.product)) {
      dispatch(ActionCreator.fetchProductStarted());
      (NeonGraphQL.getGraphqlQuery(buildProductQuery(productCode)) as Observable<AjaxResponse>)
        .subscribe(
          (response) => {
            if (!verifyProductResponse(response)) {
              dispatch(ActionCreator.fetchProductFailed('Failed to fetch product'));
              return;
            }
            dispatch(ActionCreator.fetchProductSucceeded(response.response.data.product));
          },
          (error) => {
            dispatch(ActionCreator.fetchProductFailed(error));
          },
        );
    }
    // Product release fetches
    Object.keys(fetches.productReleases)
      .filter((fetchRelease) => Service.fetchIsAwaitingCall(fetches.productReleases[fetchRelease]))
      .forEach((fetchRelease) => {
        dispatch(ActionCreator.fetchProductReleaseStarted(fetchRelease));
        const query = buildProductQuery(productCode, fetchRelease);
        (NeonGraphQL.getGraphqlQuery(query) as Observable<AjaxResponse>)
          .subscribe(
            (response) => {
              if (!verifyProductResponse(response)) {
                dispatch(ActionCreator.fetchProductReleaseFailed(
                  fetchRelease,
                  'Failed to fetch product',
                ));
                return;
              }
              dispatch(ActionCreator.fetchProductReleaseSucceeded(
                fetchRelease,
                response.response.data.product,
              ));
            },
            (error) => {
              dispatch(ActionCreator.fetchProductReleaseFailed(
                fetchRelease,
                error,
              ));
            },
          );
      });
    // Bundle parent fetches
    Object.keys(fetches.bundleParents)
      .filter((bundleParent) => Service.fetchIsAwaitingCall(fetches.bundleParents[bundleParent]))
      .forEach((bundleParent) => {
        dispatch(ActionCreator.fetchBundleParentStarted(bundleParent));
        (NeonGraphQL.getGraphqlQuery(buildProductQuery(bundleParent)) as Observable<AjaxResponse>)
          .subscribe(
            (response) => {
              if (!verifyProductResponse(response)) {
                dispatch(ActionCreator.fetchBundleParentFailed(
                  bundleParent,
                  'Failed to fetch product',
                ));
                return;
              }
              dispatch(ActionCreator.fetchBundleParentSucceeded(
                bundleParent,
                response.response.data.product,
              ));
            },
            (error) => {
              dispatch(ActionCreator.fetchBundleParentFailed(bundleParent, error));
            },
          );
      });
    // Bundle parent release fetches
    Object.keys(fetches.bundleParentReleases)
      .forEach((bundleParent) => {
        Object.keys(fetches.bundleParentReleases[bundleParent])
          .filter((fetchRelease) => (
            Service.fetchIsAwaitingCall(fetches.bundleParentReleases[bundleParent][fetchRelease])
          ))
          .forEach((fetchRelease) => {
            dispatch(ActionCreator.fetchBundleParentReleaseStarted(
              bundleParent,
              fetchRelease,
            ));
            const query = buildProductQuery(bundleParent, fetchRelease);
            (NeonGraphQL.getGraphqlQuery(query) as Observable<AjaxResponse>)
              .subscribe(
                (response) => {
                  if (!verifyProductResponse(response)) {
                    dispatch(ActionCreator.fetchBundleParentReleaseFailed(
                      bundleParent,
                      fetchRelease,
                      'Failed to fetch product',
                    ));
                    return;
                  }
                  dispatch(ActionCreator.fetchBundleParentReleaseSucceeded(
                    bundleParent,
                    fetchRelease,
                    response.response.data.product,
                  ));
                },
                (error) => {
                  dispatch(ActionCreator.fetchBundleParentReleaseFailed(
                    bundleParent,
                    fetchRelease,
                    error,
                  ));
                },
              );
          });
      });
  }, [status, productCode, fetches, neonContextIsFinal]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

Provider.defaultProps = {
  contextControlled: false,
};

const DataProductCitationContext = {
  Provider,
  useDataProductCitationContextState,
  useDataProductCitationContextDispatch,
  DEFAULT_STATE,
};

export default DataProductCitationContext;
