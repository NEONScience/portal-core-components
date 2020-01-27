"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleAsyncFlowReduction = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable import/no-unresolved, import/extensions, arrow-parens, arrow-body-style, import/prefer-default-export, max-len */

/**
 * Handles the reduction of an asynchronous flow by propagating the
 * result data object from the async state object to the owning state
 * upon completion
 * @param reducer The async flow reducer to handle async state reduction
 * @param state The owning state to reduce
 * @param action The current action
 * @param fetchStateProp The async state property on the owning state
 * @param completedActionType The completed action type to responsd to
 * @param stateResultProp The result property on the owning state to set
 * @return The resulting owning state
 */
var handleAsyncFlowReduction = function handleAsyncFlowReduction(reducer, state, action, fetchStateProp, completedActionType, stateResultProp) {
  var _extends3;

  var update = _extends({}, state, _defineProperty({}, fetchStateProp, reducer(state[fetchStateProp], action)));

  switch (action.type) {
    case completedActionType:
      return _extends({}, state, (_extends3 = {}, _defineProperty(_extends3, fetchStateProp, _extends({}, update[fetchStateProp], {
        data: null
      })), _defineProperty(_extends3, stateResultProp, update[fetchStateProp].data), _extends3));

    default:
      return update;
  }
};

exports.handleAsyncFlowReduction = handleAsyncFlowReduction;