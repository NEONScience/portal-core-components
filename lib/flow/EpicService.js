"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _reduxObservable = require("redux-observable");

var _typeUtil = require("../util/typeUtil");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var transformRequest = function transformRequest(ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index) {
  var transformed = request;

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

var transformRequests = function transformRequests(ajax, requests, action, ajaxBodyCreator, ajaxRequestInjector) {
  return requests.map(function (request, index) {
    return transformRequest(ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index);
  });
};

var createSingleAjaxObservable = function createSingleAjaxObservable(ajax, ajaxRequest, operators, action, ajaxBodyCreator, ajaxRequestInjector) {
  var observable = transformRequest(ajax, ajaxRequest, action, ajaxBodyCreator, ajaxRequestInjector);

  if ((0, _typeUtil.exists)(operators.takeUntilOp)) {
    return observable.pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
  }

  return observable.pipe(operators.successOp, operators.errorOp);
};

var createMultiAjaxObservable = function createMultiAjaxObservable(ajax, ajaxRequests, operators, action, ajaxBodyCreator, ajaxRequestInjector) {
  var observables = transformRequests(ajax, ajaxRequests, action, ajaxBodyCreator, ajaxRequestInjector);

  if ((0, _typeUtil.exists)(operators.takeUntilOp)) {
    return _rxjs.merge.apply(void 0, _toConsumableArray(observables)).pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
  }

  return _rxjs.merge.apply(void 0, _toConsumableArray(observables)).pipe(operators.successOp, operators.errorOp);
};

var createForkJoinAjaxObservable = function createForkJoinAjaxObservable(ajax, ajaxRequests, operators, action, ajaxBodyCreator, ajaxRequestInjector) {
  var observables = transformRequests(ajax, ajaxRequests, action, ajaxBodyCreator, ajaxRequestInjector);

  if ((0, _typeUtil.exists)(operators.takeUntilOp)) {
    return (0, _rxjs.forkJoin)(observables).pipe(operators.successOp, operators.errorOp, operators.takeUntilOp);
  }

  return (0, _rxjs.forkJoin)(observables).pipe(operators.successOp, operators.errorOp);
};

var EpicService = {
  createEpic: function createEpic(ofTypeFilter, ajaxRequest, workingAction, successAction, errorAction, takeUntilTypeFilter, ajaxBodyCreator, ajaxRequestInjector, useForkJoin) {
    return function (action$, state$, _ref) {
      var ajax = _ref.ajax;
      var ofTypeFilters = !Array.isArray(ofTypeFilter) ? [ofTypeFilter] : ofTypeFilter;
      var takeUntilOperator;

      if ((0, _typeUtil.exists)(takeUntilTypeFilter)) {
        takeUntilOperator = (0, _operators.takeUntil)(action$.ofType(takeUntilTypeFilter));
      }

      return action$.pipe(_reduxObservable.ofType.apply(_reduxObservable.ofType, ofTypeFilters), (0, _operators.switchMap)(function (action) {
        return (0, _rxjs.concat)((0, _rxjs.of)(workingAction({
          action: action
        })), EpicService.createAjaxObservable(ajax, ajaxRequest, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin));
      }));
    };
  },
  createMergeEpic: function createMergeEpic(ofTypeFilter, ajaxRequest, workingAction, successAction, errorAction, takeUntilTypeFilter, ajaxBodyCreator, ajaxRequestInjector, useForkJoin) {
    return function (action$, state$, _ref2) {
      var ajax = _ref2.ajax;
      var ofTypeFilters = !Array.isArray(ofTypeFilter) ? [ofTypeFilter] : ofTypeFilter;
      var takeUntilOperator;

      if ((0, _typeUtil.exists)(takeUntilTypeFilter)) {
        takeUntilOperator = (0, _operators.takeUntil)(action$.ofType(takeUntilTypeFilter));
      }

      return action$.pipe(_reduxObservable.ofType.apply(_reduxObservable.ofType, ofTypeFilters), (0, _operators.mergeMap)(function (action) {
        return (0, _rxjs.concat)((0, _rxjs.of)(workingAction({
          action: action
        })), EpicService.createAjaxObservable(ajax, ajaxRequest, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin));
      }));
    };
  },
  createEpicFromProps: function createEpicFromProps(props) {
    return EpicService.createEpic(props.ofTypeFilter, props.request, props.workingAction, props.successAction, props.errorAction, props.takeUntilTypeFilter, props.bodyCreator, props.requestInjector, props.useForkJoin);
  },
  createMergeEpicFromProps: function createMergeEpicFromProps(props) {
    return EpicService.createMergeEpic(props.ofTypeFilter, props.request, props.workingAction, props.successAction, props.errorAction, props.takeUntilTypeFilter, props.bodyCreator, props.requestInjector, props.useForkJoin);
  },
  createAjaxObservable: function createAjaxObservable(ajax, ajaxRequest, successAction, errorAction, action, takeUntilOperator, ajaxBodyCreator, ajaxRequestInjector, useForkJoin) {
    var operators = {
      successOp: (0, _operators.mergeMap)(function (response) {
        return successAction(response, action);
      }),
      errorOp: (0, _operators.catchError)(function (error) {
        var parsedError = (0, _typeUtil.exists)(error) ? error : null;
        return errorAction(parsedError, action);
      }),
      takeUntilOp: takeUntilOperator
    };
    var isArrayRequest = Array.isArray(ajaxRequest);

    if (isArrayRequest && useForkJoin) {
      return createForkJoinAjaxObservable(ajax, ajaxRequest, operators, action, ajaxBodyCreator, ajaxRequestInjector);
    }

    if (isArrayRequest) {
      return createMultiAjaxObservable(ajax, ajaxRequest, operators, action, ajaxBodyCreator, ajaxRequestInjector);
    }

    return createSingleAjaxObservable(ajax, ajaxRequest, operators, action, ajaxBodyCreator, ajaxRequestInjector);
  }
};
var _default = EpicService;
exports.default = _default;