import { of, concat, merge, forkJoin, switchMap, mergeMap, catchError, takeUntil } from 'rxjs';
import { ofType } from 'redux-observable';
import { exists } from '../util/typeUtil';
const transformRequest = (ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index)=>{
    let transformed = request;
    if (exists(action)) {
        if (exists(ajaxRequestInjector)) {
            transformed = ajaxRequestInjector(request, action, index);
        }
        if (exists(ajaxBodyCreator)) {
            transformed.body = ajaxBodyCreator(action, index);
        }
    }
    return ajax(transformed);
};
const transformRequests = (ajax, requests, action, ajaxBodyCreator, ajaxRequestInjector)=>requests.map((request, index)=>transformRequest(ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index));
const createSingleAjaxObservable = (ajax, ajaxConfig, operators, action, ajaxBodyCreator, ajaxRequestInjector)=>{
    const observable = transformRequest(ajax, ajaxConfig, action, ajaxBodyCreator, ajaxRequestInjector);
    if (exists(operators.takeUntilOp)) {
        return observable.pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
    }
    return observable.pipe(operators.successOp, operators.errorOp);
};
const createMultiAjaxObservable = (ajax, ajaxConfigs, operators, action, ajaxBodyCreator, ajaxRequestInjector)=>{
    const observables = transformRequests(ajax, ajaxConfigs, action, ajaxBodyCreator, ajaxRequestInjector);
    if (exists(operators.takeUntilOp)) {
        return merge(...observables).pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
    }
    return merge(...observables).pipe(operators.successOp, operators.errorOp);
};
const createForkJoinAjaxObservable = (ajax, ajaxConfigs, operators, action, ajaxBodyCreator, ajaxRequestInjector)=>{
    const observables = transformRequests(ajax, ajaxConfigs, action, ajaxBodyCreator, ajaxRequestInjector);
    if (exists(operators.takeUntilOp)) {
        return forkJoin(observables).pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
    }
    return forkJoin(observables).pipe(operators.successOp, operators.errorOp);
};
const EpicService = {
    createEpic: (ofTypeFilter, ajaxConfig, workingAction, successAction, errorAction, takeUntilTypeFilter, ajaxBodyCreator, ajaxRequestInjector, useForkJoin)=>(action$, state$, { ajax })=>{
            const ofTypeFilters = !Array.isArray(ofTypeFilter) ? [
                ofTypeFilter
            ] : ofTypeFilter;
            let takeUntilOperator;
            if (exists(takeUntilTypeFilter)) {
                takeUntilOperator = takeUntil(action$.pipe(ofType(takeUntilTypeFilter)));
            }
            return action$.pipe(ofType.apply(ofType, ofTypeFilters), switchMap((action)=>concat(of(workingAction({
                    action
                })), EpicService.createAjaxObservable(ajax, ajaxConfig, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin))));
        },
    createMergeEpic: (ofTypeFilter, ajaxConfig, workingAction, successAction, errorAction, takeUntilTypeFilter, ajaxBodyCreator, ajaxRequestInjector, useForkJoin)=>(action$, state$, { ajax })=>{
            const ofTypeFilters = !Array.isArray(ofTypeFilter) ? [
                ofTypeFilter
            ] : ofTypeFilter;
            let takeUntilOperator;
            if (exists(takeUntilTypeFilter)) {
                takeUntilOperator = takeUntil(action$.pipe(ofType(takeUntilTypeFilter)));
            }
            return action$.pipe(ofType.apply(ofType, ofTypeFilters), mergeMap((action)=>concat(of(workingAction({
                    action
                })), EpicService.createAjaxObservable(ajax, ajaxConfig, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin))));
        },
    createEpicFromProps: (props)=>EpicService.createEpic(props.ofTypeFilter, props.request, props.workingAction, props.successAction, props.errorAction, props.takeUntilTypeFilter, props.bodyCreator, props.requestInjector, props.useForkJoin),
    createMergeEpicFromProps: (props)=>EpicService.createMergeEpic(props.ofTypeFilter, props.request, props.workingAction, props.successAction, props.errorAction, props.takeUntilTypeFilter, props.bodyCreator, props.requestInjector, props.useForkJoin),
    createAjaxObservable: (ajax, ajaxConfig, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin)=>{
        const operators = {
            successOp: mergeMap((response)=>successAction(response, action)),
            errorOp: catchError((error)=>{
                const parsedError = exists(error) ? error : null;
                return errorAction(parsedError, action);
            }),
            takeUntilOp: takeUntilOperator
        };
        const isArrayRequest = Array.isArray(ajaxConfig);
        if (isArrayRequest && useForkJoin) {
            return createForkJoinAjaxObservable(ajax, ajaxConfig, operators, action, ajaxBodyCreator, ajaxRequestInjector);
        }
        if (isArrayRequest) {
            return createMultiAjaxObservable(ajax, ajaxConfig, operators, action, ajaxBodyCreator, ajaxRequestInjector);
        }
        return createSingleAjaxObservable(ajax, ajaxConfig, operators, action, ajaxBodyCreator, ajaxRequestInjector);
    }
};
export default EpicService;
