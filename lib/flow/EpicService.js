"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rxjs = require("rxjs");
var _reduxObservable = require("redux-observable");
var _typeUtil = require("../util/typeUtil");
const transformRequest = (ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index) => {
  let transformed = request;
  if ((0, _typeUtil.exists)(action)) {
    if ((0, _typeUtil.exists)(ajaxRequestInjector)) {
      transformed = ajaxRequestInjector(request, action, index);
    }
    if ((0, _typeUtil.exists)(ajaxBodyCreator)) {
      transformed.body = ajaxBodyCreator(action, index);
    }
  }
  return ajax(transformed);
};
const transformRequests = (ajax, requests, action, ajaxBodyCreator, ajaxRequestInjector) => requests.map((request, index) => transformRequest(ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index));
const createSingleAjaxObservable = (ajax, ajaxConfig, operators, action, ajaxBodyCreator, ajaxRequestInjector) => {
  const observable = transformRequest(ajax, ajaxConfig, action, ajaxBodyCreator, ajaxRequestInjector);
  if ((0, _typeUtil.exists)(operators.takeUntilOp)) {
    return observable.pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
  }
  return observable.pipe(operators.successOp, operators.errorOp);
};
const createMultiAjaxObservable = (ajax, ajaxConfigs, operators, action, ajaxBodyCreator, ajaxRequestInjector) => {
  const observables = transformRequests(ajax, ajaxConfigs, action, ajaxBodyCreator, ajaxRequestInjector);
  if ((0, _typeUtil.exists)(operators.takeUntilOp)) {
    return (0, _rxjs.merge)(...observables).pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
  }
  return (0, _rxjs.merge)(...observables).pipe(operators.successOp, operators.errorOp);
};
const createForkJoinAjaxObservable = (ajax, ajaxConfigs, operators, action, ajaxBodyCreator, ajaxRequestInjector) => {
  const observables = transformRequests(ajax, ajaxConfigs, action, ajaxBodyCreator, ajaxRequestInjector);
  if ((0, _typeUtil.exists)(operators.takeUntilOp)) {
    return (0, _rxjs.forkJoin)(observables).pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
  }
  return (0, _rxjs.forkJoin)(observables).pipe(operators.successOp, operators.errorOp);
};
const EpicService = {
  createEpic: (ofTypeFilter, ajaxConfig, workingAction, successAction, errorAction, takeUntilTypeFilter, ajaxBodyCreator, ajaxRequestInjector, useForkJoin) => (action$, state$, _ref) => {
    let {
      ajax
    } = _ref;
    const ofTypeFilters = !Array.isArray(ofTypeFilter) ? [ofTypeFilter] : ofTypeFilter;
    let takeUntilOperator;
    if ((0, _typeUtil.exists)(takeUntilTypeFilter)) {
      takeUntilOperator = (0, _rxjs.takeUntil)(action$.pipe((0, _reduxObservable.ofType)(takeUntilTypeFilter)));
    }
    return action$.pipe(
    // @ts-ignore
    _reduxObservable.ofType.apply(_reduxObservable.ofType, ofTypeFilters), (0, _rxjs.switchMap)(action => (0, _rxjs.concat)((0, _rxjs.of)(workingAction({
      action
    })), EpicService.createAjaxObservable(ajax, ajaxConfig, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin))));
  },
  createMergeEpic: (ofTypeFilter, ajaxConfig, workingAction, successAction, errorAction, takeUntilTypeFilter, ajaxBodyCreator, ajaxRequestInjector, useForkJoin) => (action$, state$, _ref2) => {
    let {
      ajax
    } = _ref2;
    const ofTypeFilters = !Array.isArray(ofTypeFilter) ? [ofTypeFilter] : ofTypeFilter;
    let takeUntilOperator;
    if ((0, _typeUtil.exists)(takeUntilTypeFilter)) {
      takeUntilOperator = (0, _rxjs.takeUntil)(action$.pipe((0, _reduxObservable.ofType)(takeUntilTypeFilter)));
    }
    return action$.pipe(
    // @ts-ignore
    _reduxObservable.ofType.apply(_reduxObservable.ofType, ofTypeFilters), (0, _rxjs.mergeMap)(action => (0, _rxjs.concat)((0, _rxjs.of)(workingAction({
      action
    })), EpicService.createAjaxObservable(ajax, ajaxConfig, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin))));
  },
  createEpicFromProps: props => EpicService.createEpic(props.ofTypeFilter, props.request, props.workingAction, props.successAction, props.errorAction, props.takeUntilTypeFilter, props.bodyCreator, props.requestInjector, props.useForkJoin),
  createMergeEpicFromProps: props => EpicService.createMergeEpic(props.ofTypeFilter, props.request, props.workingAction, props.successAction, props.errorAction, props.takeUntilTypeFilter, props.bodyCreator, props.requestInjector, props.useForkJoin),
  createAjaxObservable: (ajax, ajaxConfig, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin) => {
    const operators = {
      successOp: (0, _rxjs.mergeMap)(response => successAction(response, action)),
      errorOp: (0, _rxjs.catchError)(error => {
        const parsedError = (0, _typeUtil.exists)(error) ? error : null;
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
var _default = exports.default = EpicService;