"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAsyncFlow = void 0;

var _actionTypes = require("../types/actionTypes");

var _typeUtil = require("../util/typeUtil");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var coreFlowReduction = function coreFlowReduction(actionTypes, parserFunction, state, action) {
  var update;

  if ((0, _typeUtil.exists)(state)) {
    update = state;
  } else {
    update = {};
  }

  switch (action.type) {
    case actionTypes.working:
      update = _extends(_extends({}, update), {}, {
        asyncState: _actionTypes.AsyncStateType.WORKING,
        error: null
      });
      break;

    case actionTypes.completed:
      update = _extends(_extends({}, update), {}, {
        asyncState: _actionTypes.AsyncStateType.FULLFILLED,
        data: parserFunction(action.data),
        error: null
      });
      break;

    case actionTypes.error:
      /* eslint-disable no-console */
      console.error(action.error);
      update = _extends(_extends({}, update), {}, {
        asyncState: _actionTypes.AsyncStateType.FAILED,
        error: _extends(_extends({}, update.error), {}, {
          error: action.error,
          message: action.message
        })
      });
      break;

    case actionTypes.reset:
      update = _extends(_extends({}, update), {}, {
        asyncState: _actionTypes.AsyncStateType.IDLE,
        data: null,
        error: null
      });
      break;

    default:
      break;
  }

  return update;
};
/**
 * Creates the reducer for handling all async actions within the flow
 * @param actionTypes The action types for the flow
 * @param parserFunction The parser function for the flow
 */


var createAsyncFlowReducer = function createAsyncFlowReducer(actionTypes, parserFunction) {
  return function (state, action) {
    var update = coreFlowReduction(actionTypes, parserFunction, state, action);

    switch (action.type) {
      case actionTypes.fetch:
        update = _extends(_extends({}, update), {}, {
          error: null
        });
        break;

      default:
        break;
    }

    return update;
  };
};

var createCoreAsyncFlowActions = function createCoreAsyncFlowActions(actionTypes, parserFunction) {
  var resetAction = null;

  if ((0, _typeUtil.exists)(actionTypes.reset)) {
    resetAction = function resetAction() {
      return {
        type: actionTypes.reset
      };
    };
  }

  return {
    asyncWorkingAction: function asyncWorkingAction() {
      return {
        type: actionTypes.working
      };
    },
    asyncCompletedAction: function asyncCompletedAction(data) {
      return {
        type: actionTypes.completed,
        data: data
      };
    },
    asyncErrorAction: function asyncErrorAction(error, message) {
      return {
        type: actionTypes.error,
        error: error,
        message: message
      };
    },
    asyncResetAction: resetAction,
    parserFunction: parserFunction
  };
};
/**
 * Creates an async flow handler for unifying asynchronous flows within redux
 * state manipulation and reducing boilerplate for doing so
 * @param actionTypes The action types for the flow
 * @param parserFunction The parser function for the flow
 */


var createAsyncFlow = function createAsyncFlow(actionTypes, parserFunction) {
  var reducer = createAsyncFlowReducer(actionTypes, parserFunction);
  return _extends({
    asyncAction: function asyncAction(param) {
      return {
        type: actionTypes.fetch,
        param: param
      };
    },
    reducer: reducer
  }, createCoreAsyncFlowActions(actionTypes, parserFunction));
};

exports.createAsyncFlow = createAsyncFlow;