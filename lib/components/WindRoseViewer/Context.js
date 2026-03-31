import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useReducer, useContext, useEffect, useMemo } from 'react';
import { of, forkJoin, concat, Subject } from 'rxjs';
import { filter, mergeMap, map, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import cloneDeep from 'lodash/cloneDeep';
import { parse } from 'papaparse';
import NeonContext from '../NeonContext/NeonContext';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import { buildWindRoseData, parseWindRoseDataFiles } from './windRoseUtil';
import { AsyncStateType } from '../../types/asyncFlow';
import { getApiDataQueryParams, getDataApiRequest, getMonthOptions, getSiteOptions } from './dataUtil';
import { resolveProps } from '../../util/defaultProps';
import { isStringNonEmpty, exists } from '../../util/typeUtil';
const DEFAULT_STATE = {
    productCode: null,
    release: undefined,
    product: null,
    fetchState: {
        product: {
            status: AsyncStateType.IDLE,
            error: null
        },
        data: null
    },
    dataStateMessage: null,
    siteOptions: [],
    monthOptions: [],
    positionOptions: [],
    query: {
        changeType: null,
        sites: [],
        months: [],
        positions: []
    },
    data: {
        dailyBins: {},
        current: null
    },
    neonContextState: cloneDeep(NeonContext.DEFAULT_STATE)
};
const getDefaultState = ()=>cloneDeep(DEFAULT_STATE);
const getDefaultFetchProducState = ()=>cloneDeep(DEFAULT_STATE.fetchState.product);
const StateContext = /*#__PURE__*/ createContext(getDefaultState());
const DispatchContext = /*#__PURE__*/ createContext(undefined);
export const useStateContext = ()=>useContext(StateContext);
export const useDispatchContext = ()=>{
    const dispatchContext = useContext(DispatchContext);
    if (!dispatchContext) {
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
      siteCodes {
        siteCode
        availableMonths
        availableReleases {
          release
          availableMonths
        }
      }
    }
  }`;
};
const verifyProductResponse = (response)=>exists(response) && exists(response.response) && exists(response.response.data) && exists(response.response.data.product);
export var ActionTypes = /*#__PURE__*/ function(ActionTypes) {
    ActionTypes["STORE_FINALIZED_NEON_CONTEXT_STATE"] = "STORE_FINALIZED_NEON_CONTEXT_STATE";
    ActionTypes["FETCH_PRODUCT"] = "FETCH_PRODUCT";
    ActionTypes["FETCH_PRODUCT_STARTED"] = "FETCH_PRODUCT_STARTED";
    ActionTypes["FETCH_PRODUCT_FAILED"] = "FETCH_PRODUCT_FAILED";
    ActionTypes["FETCH_PRODUCT_SUCCEEDED"] = "FETCH_PRODUCT_SUCCEEDED";
    ActionTypes["RESET_FETCH_PRODUCT"] = "RESET_FETCH_PRODUCT";
    ActionTypes["FETCH_WIND_ROSE"] = "FETCH_WIND_ROSE";
    ActionTypes["FETCH_WIND_ROSE_WORKING"] = "FETCH_WIND_ROSE_WORKING";
    ActionTypes["FETCH_WIND_ROSE_FULLFILLED"] = "FETCH_WIND_ROSE_FULLFILLED";
    ActionTypes["FETCH_WIND_ROSE_FAILED"] = "FETCH_WIND_ROSE_FAILED";
    ActionTypes["RESET_WIND_ROSE"] = "RESET_WIND_ROSE";
    ActionTypes["REINITIALIZE"] = "REINITIALIZE";
    return ActionTypes;
}({});
export const ActionCreator = {
    storeFinalizedNeonContextState: (neonContextState)=>({
            type: "STORE_FINALIZED_NEON_CONTEXT_STATE",
            neonContextState
        }),
    fetchProduct: (productCode, release)=>({
            type: "FETCH_PRODUCT",
            productCode,
            release
        }),
    fetchProductStarted: ()=>({
            type: "FETCH_PRODUCT_STARTED"
        }),
    fetchProductFailed: (error)=>({
            type: "FETCH_PRODUCT_FAILED",
            error
        }),
    fetchProductSucceeded: (data)=>({
            type: "FETCH_PRODUCT_SUCCEEDED",
            data
        }),
    resetFetchProduct: ()=>({
            type: "RESET_FETCH_PRODUCT"
        }),
    fetchWindRose: (product, release, query)=>({
            type: "FETCH_WIND_ROSE",
            product,
            release,
            query
        }),
    fetchWindRoseWorking: ()=>({
            type: "FETCH_WIND_ROSE_WORKING"
        }),
    fetchWindRoseFullfilled: (response, query)=>({
            type: "FETCH_WIND_ROSE_FULLFILLED",
            response,
            query
        }),
    fetchWindRoseFailed: (error, response, initAction)=>({
            type: "FETCH_WIND_ROSE_FAILED",
            error,
            response,
            initAction
        }),
    resetWindRose: ()=>({
            type: "RESET_WIND_ROSE"
        }),
    reinitialize: (productCode, release)=>({
            type: "REINITIALIZE",
            productCode,
            release
        })
};
const reducer = (state, action)=>{
    const newState = {
        ...state
    };
    let wrfAction;
    let wrFailedAction;
    switch(action.type){
        case "STORE_FINALIZED_NEON_CONTEXT_STATE":
            newState.neonContextState = action.neonContextState;
            return newState;
        case "FETCH_PRODUCT":
            return newState;
        case "FETCH_PRODUCT_STARTED":
            newState.fetchState.product.status = AsyncStateType.WORKING;
            return newState;
        case "FETCH_PRODUCT_FAILED":
            newState.fetchState.product.status = AsyncStateType.FAILED;
            // eslint-disable-next-line max-len
            newState.fetchState.product.error = action.error;
            return newState;
        case "FETCH_PRODUCT_SUCCEEDED":
            newState.fetchState.product.status = AsyncStateType.FULLFILLED;
            newState.product = action.data;
            return newState;
        case "RESET_FETCH_PRODUCT":
            return {
                ...newState,
                product: null,
                fetchState: {
                    ...newState.fetchState,
                    product: getDefaultFetchProducState()
                }
            };
        case "FETCH_WIND_ROSE":
            return newState;
        case "FETCH_WIND_ROSE_WORKING":
            newState.fetchState.data = {
                ...newState.fetchState.data,
                status: AsyncStateType.WORKING,
                error: null
            };
            return newState;
        case "FETCH_WIND_ROSE_FULLFILLED":
            wrfAction = action;
            newState.fetchState.data = {
                ...newState.fetchState.data,
                status: AsyncStateType.FULLFILLED,
                error: null
            };
            newState.dataStateMessage = wrfAction.response.dataStateMessage;
            newState.siteOptions = getSiteOptions(newState.product, (newState.neonContextState?.data).sites);
            newState.monthOptions = getMonthOptions(newState.product, wrfAction.query.sites);
            // eslint-disable-next-line max-len
            newState.positionOptions = wrfAction.response.positionOptions;
            newState.data = {
                ...newState.data,
                // eslint-disable-next-line max-len
                dailyBins: wrfAction.response.windRoseDailyBins,
                current: wrfAction.response.currentWindRose
            };
            newState.query = {
                ...newState.query,
                sites: wrfAction.query.sites.map((value)=>value),
                months: wrfAction.query.months.map((value)=>value),
                positions: wrfAction.response.positions.map((value)=>value)
            };
            return newState;
        case "FETCH_WIND_ROSE_FAILED":
            wrFailedAction = action;
            newState.fetchState.data = {
                ...newState.fetchState.data,
                status: AsyncStateType.FAILED,
                error: wrFailedAction.error
            };
            newState.dataStateMessage = null;
            // eslint-disable-next-line max-len
            newState.siteOptions = getSiteOptions(newState.product, (newState.neonContextState?.data).sites);
            // eslint-disable-next-line max-len
            newState.monthOptions = getMonthOptions(newState.product, wrFailedAction.initAction.query.sites);
            newState.data = {
                ...newState.data,
                dailyBins: {},
                current: null
            };
            newState.query = {
                ...newState.query,
                ...wrFailedAction.initAction.query
            };
            return newState;
        case "RESET_WIND_ROSE":
            return getDefaultState();
        case "REINITIALIZE":
            return {
                ...getDefaultState(),
                productCode: action.productCode,
                release: action.release
            };
        default:
            break;
    }
    return newState;
};
// Subject for action side effects / middleware event stream
const actionStream$ = new Subject();
// Cancellation subjects
const cancelProduct$ = new Subject();
const cancelWindRose$ = new Subject();
/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 */ const buildFetchProductObservable = (action, takeUntilOperator)=>{
    const fetchProductAction = action;
    const productObs = NeonGraphQL.getGraphqlQuery(buildProductQuery(fetchProductAction.productCode, fetchProductAction.release));
    return productObs.pipe(// eslint-disable-next-line max-len
    mergeMap((response)=>{
        if (!verifyProductResponse(response)) {
            return of(ActionCreator.fetchProductFailed('Failed to fetch product'));
        }
        return of(ActionCreator.fetchProductSucceeded(response.response.data.product));
    }), catchError((error)=>of(ActionCreator.fetchProductFailed(error))), takeUntilOperator);
};
/**
 * Builds the files AJAX observable to obtain wind rose raw data
 * and variables
 * @param {*} action
 * @param {*} response
 * @param {*} takeUntilOperator
 */ const buildFilesAjaxObservable = (action, response, takeUntilOperator)=>{
    const dataFilesInfo = parseWindRoseDataFiles(response.response.data, action.query);
    if (!dataFilesInfo || dataFilesInfo.dataFileUrls === null || dataFilesInfo.dataFileUrls.length <= 0) {
        throw new Error('API data endpoint failed');
    }
    // Build parallel XHR requests for data and variables
    const ajaxObservables = [];
    const dataFilesAjax = dataFilesInfo.dataFileUrls.map((dataFileUrl)=>ajax({
            method: 'GET',
            crossDomain: true,
            url: dataFileUrl,
            responseType: 'text'
        }));
    ajaxObservables.push(forkJoin(dataFilesAjax).pipe(map((responses)=>responses), catchError(()=>of([]))));
    if (dataFilesInfo.variablesFileUrl) {
        ajaxObservables.push(ajax({
            method: 'GET',
            crossDomain: true,
            url: dataFilesInfo.variablesFileUrl,
            responseType: 'text'
        }));
    }
    return forkJoin(ajaxObservables).pipe(mergeMap((responses)=>{
        // Parse each data file response
        let dataFilesResponseData = [];
        const dataResponses = responses[0];
        if (dataResponses !== null && dataResponses.length > 0) {
            dataFilesResponseData = dataResponses.map((dataResponse)=>{
                const csvData = dataResponse.response;
                return parse(csvData, {
                    header: true,
                    skipEmptyLines: 'greedy'
                });
            });
        }
        // Build wind rose data, return the fullfilled action to be dispatched
        const windRoseData = buildWindRoseData(dataFilesResponseData, dataFilesInfo);
        // eslint-disable-next-line max-len
        return of(ActionCreator.fetchWindRoseFullfilled(windRoseData, action.query));
    }), catchError((error)=>{
        const message = error.xhr ? error.xhr.response : null;
        return of(ActionCreator.fetchWindRoseFailed(error, message, action));
    }), takeUntilOperator);
};
/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 */ const buildDataApiObservable = (action, takeUntilOperator)=>{
    // Get query params to send with request
    const queryParams = getApiDataQueryParams(action);
    // XHR for API data endpoint to retrieve available files
    return ajax({
        method: 'GET',
        crossDomain: true,
        responseType: 'json',
        url: getDataApiRequest(queryParams.productCode, queryParams.release, queryParams.site, queryParams.month)
    }).pipe(mergeMap((response)=>buildFilesAjaxObservable(action, response, takeUntilOperator)), catchError((error)=>{
        const response = error && error.xhr ? error.xhr.response : null;
        // eslint-disable-next-line max-len
        return of(ActionCreator.fetchWindRoseFailed(error, response, action));
    }), takeUntilOperator);
};
/**
 * Epic for fetching wind rose data
 * @param {*} action$ Action stream
 */ const fetchProductEpic = (action$)=>action$.pipe(filter((action)=>action.type === "FETCH_PRODUCT"), switchMap((action)=>concat(of(ActionCreator.fetchProductStarted()), buildFetchProductObservable(action, takeUntil(cancelProduct$)))));
/**
 * Epic for fetching wind rose data
 * @param {*} action$ Action stream
 */ const fetchWindRoseDataEpic = (action$)=>action$.pipe(filter((action)=>action.type === "FETCH_WIND_ROSE"), switchMap((action)=>concat(of(ActionCreator.fetchWindRoseWorking()), buildDataApiObservable(action, takeUntil(cancelWindRose$)))));
const providerDefaultProps = {
    productCode: null,
    release: undefined,
    children: undefined
};
const Provider = (inProps)=>{
    const props = resolveProps(providerDefaultProps, inProps);
    const { productCode: propsProductCode, release: propsRelease, children } = props;
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
    const [state, dispatch] = useReducer(reducer, initialState);
    const { productCode, release, product, fetchState: { product: productFetchState, data: dataFetchState }, query } = state;
    // Dispatch function enhanced to handle both reducer and action streams
    const enhancedDispatch = useMemo(()=>(action)=>{
            // Send action to reducer
            dispatch(action);
            // Send action to stream
            actionStream$.next(action);
            switch(action.type){
                case "RESET_FETCH_PRODUCT":
                    cancelProduct$.next();
                    break;
                case "RESET_WIND_ROSE":
                case "REINITIALIZE":
                    cancelProduct$.next();
                    cancelWindRose$.next();
                    break;
                default:
                    break;
            }
        }, []);
    useEffect(()=>{
        const subscriptions = [
            fetchProductEpic(actionStream$).subscribe(enhancedDispatch),
            fetchWindRoseDataEpic(actionStream$).subscribe(enhancedDispatch)
        ];
        // Cleanup subscription when component unmounts
        return ()=>{
            subscriptions.forEach((s)=>s.unsubscribe());
            // Ensure any ongoing operations are canceled
            cancelProduct$.next();
            cancelWindRose$.next();
        };
    }, [
        enhancedDispatch
    ]);
    useEffect(()=>{
        if (neonContextIsFinal || neonContextHasError) {
            enhancedDispatch(ActionCreator.storeFinalizedNeonContextState(neonContextState));
        }
    }, [
        enhancedDispatch,
        neonContextState,
        neonContextIsFinal,
        neonContextHasError
    ]);
    const productStringified = JSON.stringify(product);
    useEffect(()=>{
        if (!neonContextIsFinal) {
            return;
        }
        if (exists(product)) {
            return;
        }
        if (productFetchState.status !== AsyncStateType.IDLE) {
            return;
        }
        const queryProductCode = propsProductCode;
        enhancedDispatch(ActionCreator.fetchProduct(queryProductCode, propsRelease));
    }, [
        enhancedDispatch,
        neonContextIsFinal,
        productFetchState,
        propsProductCode,
        propsRelease,
        product,
        productStringified
    ]);
    useEffect(()=>{
        if (!neonContextIsFinal) {
            return;
        }
        if (!exists(product)) {
            return;
        }
        if (!exists(dataFetchState) || dataFetchState.status === AsyncStateType.IDLE) {
            enhancedDispatch(ActionCreator.fetchWindRose(product, release, query));
        }
    }, [
        enhancedDispatch,
        neonContextIsFinal,
        product,
        productStringified,
        release,
        query,
        dataFetchState
    ]);
    useEffect(()=>{
        if (!neonContextIsFinal) {
            return;
        }
        const productChanged = productCode !== propsProductCode;
        const releaseChanged = release !== propsRelease;
        if (productChanged || releaseChanged) {
            enhancedDispatch(ActionCreator.reinitialize(propsProductCode, propsRelease));
        }
    }, [
        enhancedDispatch,
        neonContextIsFinal,
        productCode,
        release,
        propsProductCode,
        propsRelease
    ]);
    return /*#__PURE__*/ _jsx(StateContext.Provider, {
        value: state,
        children: /*#__PURE__*/ _jsx(DispatchContext.Provider, {
            value: enhancedDispatch,
            children: children
        })
    });
};
export default Provider;
