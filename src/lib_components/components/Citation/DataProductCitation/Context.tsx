/* eslint-disable react/require-default-props */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';

import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

import NeonContext from '../../NeonContext/NeonContext';
import NeonGraphQL from '../../NeonGraphQL/NeonGraphQL';

import ActionCreator from './Actions';
import Reducer from './Reducer';
import Service from './Service';
import {
  ContextDataProduct,
  ContextStatus,
  DataProductCitationState,
  getDefaultState,
} from './State';

import { exists, isStringNonEmpty } from '../../../util/typeUtil';
import { AnyAction, Nullable, Undef } from '../../../types/core';
import { NeonApiResponse } from '../../../types/neonApi';

const StateContext = createContext<DataProductCitationState>(getDefaultState());
const DispatchContext = createContext<Undef<Dispatch<AnyAction>>>(undefined);

type ContextDataProductResponse = { 'product': ContextDataProduct };

const useDataProductCitationContextState = (): DataProductCitationState => {
  let state: DataProductCitationState = useContext(StateContext);
  if (!exists(state)) {
    state = getDefaultState();
  }
  return state;
};
const useDataProductCitationContextDispatch = (): Undef<Dispatch<AnyAction>> => {
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

const verifyProductResponse = (
  response: AjaxResponse<NeonApiResponse<ContextDataProductResponse>>,
): boolean => (
  exists(response)
  && exists(response.response)
  && exists(response.response.data)
  && exists(response.response.data.product)
);

export interface ProviderProps {
  productCode?: string;
  release?: Nullable<string>;
  contextControlled?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
}

const Provider: React.FC<ProviderProps> = (props: ProviderProps): JSX.Element => {
  const {
    productCode: propsProductCode,
    release: propsRelease,
    contextControlled,
    children,
  }: ProviderProps = props;

  const [neonContextState] = NeonContext.useNeonContextState();
  const {
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError,
  } = neonContextState;

  const initialState = {
    ...getDefaultState(),
    productCode: propsProductCode,
    release: propsRelease,
  };
  if (neonContextIsFinal || neonContextHasError) {
    initialState.neonContextState = { ...neonContextState };
  }
  const [state, dispatch] = useReducer(Reducer, initialState);
  const {
    component: { status },
    productCode,
    release,
    fetches,
  }: DataProductCitationState = state;

  useEffect(() => {
    if (status !== ContextStatus.INITIALIZING) { return; }
    if (!isStringNonEmpty(productCode)) {
      dispatch(ActionCreator.error('Data product not found'));
    }
  }, [status, productCode]);

  // Respond to prop changes when not context controlled
  useEffect(() => {
    if (contextControlled) { return; }
    if (status !== ContextStatus.READY) { return; }
    if ((productCode !== propsProductCode) || (release !== propsRelease)) {
      const initProductCode: string = isStringNonEmpty(propsProductCode)
        ? propsProductCode as string
        : '';
      dispatch(ActionCreator.reinitialize(initProductCode, propsRelease));
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
    if (neonContextIsFinal || neonContextHasError) {
      dispatch(ActionCreator.storeFinalizedNeonContextState(neonContextState));
    }
  }, [
    neonContextState,
    neonContextIsFinal,
    neonContextHasError,
  ]);
  // Transform the object to a string to ensure the effect
  // fires anytime the object changes for ensure it always resolves fetches.
  const fetchesStringified: string = JSON.stringify(fetches);
  // Trigger any fetches that are awaiting call
  useEffect(() => {
    // NeonContext is required to fetch data for the app due to bundles.
    if (!neonContextIsFinal) { return; }
    if (status !== ContextStatus.HAS_FETCHES_TO_TRIGGER) { return; }
    // Base product fetch
    if (Service.fetchIsAwaitingCall(fetches.product)) {
      dispatch(ActionCreator.fetchProductStarted());
      const queryProductCode: string = productCode as string;
      // eslint-disable-next-line max-len
      (NeonGraphQL.getGraphqlQuery(buildProductQuery(queryProductCode)) as Observable<AjaxResponse<NeonApiResponse<ContextDataProductResponse>>>)
        .subscribe({
          next: (response: AjaxResponse<NeonApiResponse<ContextDataProductResponse>>): void => {
            if (!verifyProductResponse(response)) {
              dispatch(ActionCreator.fetchProductFailed('Failed to fetch product'));
              return;
            }
            dispatch(ActionCreator.fetchProductSucceeded(response.response.data.product));
          },
          error: (error: AjaxResponse<unknown>): void => {
            dispatch(ActionCreator.fetchProductFailed(error));
          },
        });
    }
    // Product release fetches
    Object.keys(fetches.productReleases)
      .filter((fetchRelease: string): boolean => (
        Service.fetchIsAwaitingCall(fetches.productReleases[fetchRelease])
      ))
      .forEach((fetchRelease: string): void => {
        dispatch(ActionCreator.fetchProductReleaseStarted(fetchRelease));
        const queryProductCode: string = productCode as string;
        const query: string = buildProductQuery(queryProductCode, fetchRelease);
        // eslint-disable-next-line max-len
        (NeonGraphQL.getGraphqlQuery(query) as Observable<AjaxResponse<NeonApiResponse<ContextDataProductResponse>>>)
          .subscribe({
            next: (response: AjaxResponse<NeonApiResponse<ContextDataProductResponse>>): void => {
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
            error: (error: AjaxResponse<unknown>): void => {
              dispatch(ActionCreator.fetchProductReleaseFailed(
                fetchRelease,
                error,
              ));
            },
          });
      });
    // Bundle parent fetches
    Object.keys(fetches.bundleParents)
      .filter((bundleParent: string): boolean => (
        Service.fetchIsAwaitingCall(fetches.bundleParents[bundleParent])
      ))
      .forEach((bundleParent: string): void => {
        dispatch(ActionCreator.fetchBundleParentStarted(bundleParent));
        // eslint-disable-next-line max-len
        (NeonGraphQL.getGraphqlQuery(buildProductQuery(bundleParent)) as Observable<AjaxResponse<NeonApiResponse<ContextDataProductResponse>>>)
          .subscribe({
            next: (response: AjaxResponse<NeonApiResponse<ContextDataProductResponse>>): void => {
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
            error: (error: AjaxResponse<unknown>): void => {
              dispatch(ActionCreator.fetchBundleParentFailed(bundleParent, error));
            },
          });
      });
    // Bundle parent release fetches
    Object.keys(fetches.bundleParentReleases)
      .forEach((bundleParent: string): void => {
        Object.keys(fetches.bundleParentReleases[bundleParent])
          .filter((fetchRelease: string): boolean => (
            Service.fetchIsAwaitingCall(fetches.bundleParentReleases[bundleParent][fetchRelease])
          ))
          .forEach((fetchRelease: string): void => {
            dispatch(ActionCreator.fetchBundleParentReleaseStarted(
              bundleParent,
              fetchRelease,
            ));
            const query: string = buildProductQuery(bundleParent, fetchRelease);
            // eslint-disable-next-line max-len
            (NeonGraphQL.getGraphqlQuery(query) as Observable<AjaxResponse<NeonApiResponse<ContextDataProductResponse>>>)
              .subscribe({
                // eslint-disable-next-line max-len
                next: (response: AjaxResponse<NeonApiResponse<ContextDataProductResponse>>): void => {
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
                error: (error: AjaxResponse<unknown>): void => {
                  dispatch(ActionCreator.fetchBundleParentReleaseFailed(
                    bundleParent,
                    fetchRelease,
                    error,
                  ));
                },
              });
          });
      });
  }, [
    status,
    productCode,
    fetches,
    neonContextIsFinal,
    fetchesStringified,
  ]);

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
};

export default DataProductCitationContext;
