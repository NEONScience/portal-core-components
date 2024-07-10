"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
var _asyncFlow = require("../types/asyncFlow");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable class-methods-use-this */ /* eslint-disable arrow-parens */
class AsyncFlowProvider {
  constructor() {
    /**
     * Core async flow reducer.
     * @param actionTypes The actions types to apply reduction for
     * @param parserFunction The parse function for parsing the completed action's response
     * @param state The redux state to update
     * @param action The current action to apply reduction for
     * @return The updated state
     */
    this.createCoreReducer = (actionTypes, parserFunction, state, action) => {
      let update;
      if ((0, _typeUtil.exists)(state)) {
        update = state;
      } else {
        update = {};
      }
      switch (action.type) {
        case actionTypes.working:
          update = _extends({}, update, {
            asyncState: _asyncFlow.AsyncStateType.WORKING,
            error: null
          });
          break;
        case actionTypes.completed:
          update = _extends({}, update, {
            asyncState: _asyncFlow.AsyncStateType.FULLFILLED,
            data: parserFunction(action.data),
            error: null
          });
          break;
        case actionTypes.error:
          console.error(action.error); // eslint-disable-line no-console
          update = _extends({}, update, {
            asyncState: _asyncFlow.AsyncStateType.FAILED,
            error: _extends({}, update.error, {
              error: action.error,
              message: action.message
            })
          });
          break;
        case actionTypes.reset:
          update = _extends({}, update, {
            asyncState: _asyncFlow.AsyncStateType.IDLE,
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
     * @return The decorated core flow reducer
     */
    this.createAsyncFlowReducer = (actionTypes, parserFunction) => (state, action) => {
      let update = this.createCoreReducer(actionTypes, parserFunction, state, action);
      switch (action.type) {
        case actionTypes.fetch:
          update = _extends({}, update, {
            error: null
          });
          break;
        default:
          break;
      }
      return update;
    };
    /**
     * Creates the set of async flow action creators to dispatch
     * @param actionTypes The action types to create for
     * @param parserFunction The parser function to apply
     * @return The set of action creators
     */
    this.createCoreAsyncFlowActions = (actionTypes, parserFunction) => {
      let resetAction = null;
      if ((0, _typeUtil.exists)(actionTypes.reset)) {
        resetAction = () => ({
          type: actionTypes.reset
        });
      }
      return {
        asyncWorkingAction: param => ({
          type: actionTypes.working,
          param
        }),
        asyncCompletedAction: data => ({
          type: actionTypes.completed,
          data
        }),
        asyncErrorAction: (error, message, data) => ({
          type: actionTypes.error,
          error,
          message,
          data
        }),
        asyncResetAction: resetAction,
        parserFunction
      };
    };
    /**
     * Creates an async flow handler for unifying asynchronous flows within redux
     * state manipulation and reducing boilerplate for doing so
     * @param actionTypes The action types for the flow
     * @param parserFunction The parser function for the flow
     * @param ignoreWhenDevEnv Optionally execute the flow
     * @returns The decorated async flow handler
     */
    this.create = (actionTypes, parserFunction, ignoreWhenDevEnv) => {
      const reducer = this.createAsyncFlowReducer(actionTypes, parserFunction);
      return _extends({
        asyncAction: param => {
          if (_NeonEnvironment.default.isDevEnv && ignoreWhenDevEnv) {
            return {
              type: '__DEV_NEON_CORE_ASYNCFLOW_IGNORE_ACTION'
            };
          }
          return {
            type: actionTypes.fetch,
            param
          };
        },
        reducer
      }, this.createCoreAsyncFlowActions(actionTypes, parserFunction));
    };
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
    this.reduce = (reducer, state, action, fetchStateProp, completedActionType, stateResultProp) => {
      const update = _extends({}, state, {
        [fetchStateProp]: reducer(state[fetchStateProp], action)
      });
      switch (action.type) {
        case completedActionType:
          return _extends({}, state, {
            [fetchStateProp]: _extends({}, update[fetchStateProp], {
              data: null
            }),
            [stateResultProp]: update[fetchStateProp].data
          });
        default:
          return update;
      }
    };
  }
}
const AsyncFlow = new AsyncFlowProvider();
var _default = exports.default = AsyncFlow;