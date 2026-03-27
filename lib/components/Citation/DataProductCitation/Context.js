import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import NeonApi from '../../NeonApi/NeonApi';
import NeonContext from '../../NeonContext/NeonContext';
import NeonGraphQL from '../../NeonGraphQL/NeonGraphQL';
import { resolveProps } from '../../../util/defaultProps';
import { exists, isStringNonEmpty } from '../../../util/typeUtil';
import ActionCreator from './Actions';
import Reducer from './Reducer';
import Service from './Service';
import { ContextStatus, getDefaultState } from './State';
const StateContext = /*#__PURE__*/ createContext(getDefaultState());
const DispatchContext = /*#__PURE__*/ createContext(undefined);
const useDataProductCitationContextState = ()=>{
    let state = useContext(StateContext);
    if (!exists(state)) {
        state = getDefaultState();
    }
    return state;
};
const useDataProductCitationContextDispatch = ()=>{
    const dispatchContext = useContext(DispatchContext);
    if (!exists(dispatchContext)) {
        throw new Error('Failed to initialize dispatch context');
    }
    return dispatchContext;
};
const buildProductQuery = (productCode, release)=>{
    const hasRelease = isStringNonEmpty(release);
    const releaseArgument = !hasRelease ? '' : `, release: "${release}"`;
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
const verifyProductResponse = (response)=>exists(response) && exists(response.response) && exists(response.response.data) && exists(response.response.data.product);
const verifyProductReleaseDoiResponse = (response)=>exists(response);
const defaultProps = {
    contextControlled: false
};
const Provider = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { productCode: propsProductCode, release: propsRelease, contextControlled, children } = props;
    const [neonContextState] = NeonContext.useNeonContextState();
    const { isFinal: neonContextIsFinal, hasError: neonContextHasError } = neonContextState;
    const initialState = {
        ...getDefaultState(),
        productCode: propsProductCode,
        release: propsRelease
    };
    if (neonContextIsFinal || neonContextHasError) {
        initialState.neonContextState = {
            ...neonContextState
        };
    }
    const [state, dispatch] = useReducer(Reducer, initialState);
    const { component: { status }, productCode, release, fetches } = state;
    useEffect(()=>{
        if (status !== ContextStatus.INITIALIZING) {
            return;
        }
        if (!isStringNonEmpty(productCode)) {
            dispatch(ActionCreator.error('Data product not found'));
        }
    }, [
        status,
        productCode
    ]);
    // Respond to prop changes when not context controlled
    useEffect(()=>{
        if (contextControlled) {
            return;
        }
        if (status !== ContextStatus.READY) {
            return;
        }
        if (productCode !== propsProductCode || release !== propsRelease) {
            const initProductCode = isStringNonEmpty(propsProductCode) ? propsProductCode : '';
            dispatch(ActionCreator.reinitialize(initProductCode, propsRelease));
        }
    }, [
        contextControlled,
        status,
        productCode,
        propsProductCode,
        release,
        propsRelease
    ]);
    useEffect(()=>{
        if (neonContextIsFinal || neonContextHasError) {
            dispatch(ActionCreator.storeFinalizedNeonContextState(neonContextState));
        }
    }, [
        neonContextState,
        neonContextIsFinal,
        neonContextHasError
    ]);
    // Transform the object to a string to ensure the effect
    // fires anytime the object changes for ensure it always resolves fetches.
    const fetchesStringified = JSON.stringify(fetches);
    // Trigger any fetches that are awaiting call
    useEffect(()=>{
        // NeonContext is required to fetch data for the app due to bundles.
        if (!neonContextIsFinal) {
            return;
        }
        if (status !== ContextStatus.HAS_FETCHES_TO_TRIGGER) {
            return;
        }
        // Base product fetch
        if (Service.fetchIsAwaitingCall(fetches.product)) {
            dispatch(ActionCreator.fetchProductStarted());
            const queryProductCode = productCode;
            // eslint-disable-next-line max-len
            NeonGraphQL.getGraphqlQuery(buildProductQuery(queryProductCode)).subscribe({
                next: (response)=>{
                    if (!verifyProductResponse(response)) {
                        dispatch(ActionCreator.fetchProductFailed('Failed to fetch product'));
                        return;
                    }
                    dispatch(ActionCreator.fetchProductSucceeded(response.response.data.product));
                },
                error: (error)=>{
                    dispatch(ActionCreator.fetchProductFailed(error));
                }
            });
        }
        // Product release fetches
        Object.keys(fetches.productReleases).filter((fetchRelease)=>Service.fetchIsAwaitingCall(fetches.productReleases[fetchRelease])).forEach((fetchRelease)=>{
            dispatch(ActionCreator.fetchProductReleaseStarted(fetchRelease));
            const queryProductCode = productCode;
            const query = buildProductQuery(queryProductCode, fetchRelease);
            // eslint-disable-next-line max-len
            NeonGraphQL.getGraphqlQuery(query).subscribe({
                next: (response)=>{
                    if (!verifyProductResponse(response)) {
                        dispatch(ActionCreator.fetchProductReleaseFailed(fetchRelease, 'Failed to fetch product'));
                        return;
                    }
                    dispatch(ActionCreator.fetchProductReleaseSucceeded(fetchRelease, response.response.data.product));
                },
                error: (error)=>{
                    dispatch(ActionCreator.fetchProductReleaseFailed(fetchRelease, error));
                }
            });
        });
        // Product release doi fetches
        Object.keys(fetches.productReleaseDois).filter((fetchRelease)=>Service.fetchIsAwaitingCall(fetches.productReleaseDois[fetchRelease])).forEach((fetchRelease)=>{
            dispatch(ActionCreator.fetchProductReleaseDoiStarted(fetchRelease));
            const queryProductCode = productCode;
            // eslint-disable-next-line max-len
            NeonApi.getProductDoisObservable(queryProductCode, fetchRelease).subscribe({
                next: (response)=>{
                    if (!verifyProductReleaseDoiResponse(response)) {
                        dispatch(ActionCreator.fetchProductReleaseDoiFailed(fetchRelease, 'Failed to fetch product release doi status'));
                        return;
                    }
                    dispatch(ActionCreator.fetchProductReleaseDoiSucceeded(queryProductCode, fetchRelease, response.data));
                },
                error: (error)=>{
                    dispatch(ActionCreator.fetchProductReleaseDoiFailed(fetchRelease, error));
                }
            });
        });
        // Bundle parent fetches
        Object.keys(fetches.bundleParents).filter((bundleParent)=>Service.fetchIsAwaitingCall(fetches.bundleParents[bundleParent])).forEach((bundleParent)=>{
            dispatch(ActionCreator.fetchBundleParentStarted(bundleParent));
            // eslint-disable-next-line max-len
            NeonGraphQL.getGraphqlQuery(buildProductQuery(bundleParent)).subscribe({
                next: (response)=>{
                    if (!verifyProductResponse(response)) {
                        dispatch(ActionCreator.fetchBundleParentFailed(bundleParent, 'Failed to fetch product'));
                        return;
                    }
                    dispatch(ActionCreator.fetchBundleParentSucceeded(bundleParent, response.response.data.product));
                },
                error: (error)=>{
                    dispatch(ActionCreator.fetchBundleParentFailed(bundleParent, error));
                }
            });
        });
        // Bundle parent release fetches
        Object.keys(fetches.bundleParentReleases).forEach((bundleParent)=>{
            Object.keys(fetches.bundleParentReleases[bundleParent]).filter((fetchRelease)=>Service.fetchIsAwaitingCall(fetches.bundleParentReleases[bundleParent][fetchRelease])).forEach((fetchRelease)=>{
                dispatch(ActionCreator.fetchBundleParentReleaseStarted(bundleParent, fetchRelease));
                const query = buildProductQuery(bundleParent, fetchRelease);
                // eslint-disable-next-line max-len
                NeonGraphQL.getGraphqlQuery(query).subscribe({
                    // eslint-disable-next-line max-len
                    next: (response)=>{
                        if (!verifyProductResponse(response)) {
                            dispatch(ActionCreator.fetchBundleParentReleaseFailed(bundleParent, fetchRelease, 'Failed to fetch product'));
                            return;
                        }
                        dispatch(ActionCreator.fetchBundleParentReleaseSucceeded(bundleParent, fetchRelease, response.response.data.product));
                    },
                    error: (error)=>{
                        dispatch(ActionCreator.fetchBundleParentReleaseFailed(bundleParent, fetchRelease, error));
                    }
                });
            });
        });
    }, [
        status,
        productCode,
        fetches,
        neonContextIsFinal,
        fetchesStringified
    ]);
    return /*#__PURE__*/ _jsx(StateContext.Provider, {
        value: state,
        children: /*#__PURE__*/ _jsx(DispatchContext.Provider, {
            value: dispatch,
            children: children
        })
    });
};
const DataProductCitationContext = {
    Provider,
    useDataProductCitationContextState,
    useDataProductCitationContextDispatch
};
export default DataProductCitationContext;
