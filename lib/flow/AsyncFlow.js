"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
var _asyncFlow = require("../types/asyncFlow");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var AsyncFlowProvider = /*#__PURE__*/_createClass(function AsyncFlowProvider() {
  var _this = this;
  _classCallCheck(this, AsyncFlowProvider);
  this.createCoreReducer = function (actionTypes, parserFunction, state, action) {
    var update;
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
  this.createAsyncFlowReducer = function (actionTypes, parserFunction) {
    return function (state, action) {
      var update = _this.createCoreReducer(actionTypes, parserFunction, state, action);
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
  };
  this.createCoreAsyncFlowActions = function (actionTypes, parserFunction) {
    var resetAction = null;
    if ((0, _typeUtil.exists)(actionTypes.reset)) {
      resetAction = function resetAction() {
        return {
          type: actionTypes.reset
        };
      };
    }
    return {
      asyncWorkingAction: function asyncWorkingAction(param) {
        return {
          type: actionTypes.working,
          param: param
        };
      },
      asyncCompletedAction: function asyncCompletedAction(data) {
        return {
          type: actionTypes.completed,
          data: data
        };
      },
      asyncErrorAction: function asyncErrorAction(error, message, data) {
        return {
          type: actionTypes.error,
          error: error,
          message: message,
          data: data
        };
      },
      asyncResetAction: resetAction,
      parserFunction: parserFunction
    };
  };
  this.create = function (actionTypes, parserFunction, ignoreWhenDevEnv) {
    var reducer = _this.createAsyncFlowReducer(actionTypes, parserFunction);
    return _extends({
      asyncAction: function asyncAction(param) {
        if (_NeonEnvironment.default.isDevEnv && ignoreWhenDevEnv) {
          return {
            type: '__DEV_NEON_CORE_ASYNCFLOW_IGNORE_ACTION'
          };
        }
        return {
          type: actionTypes.fetch,
          param: param
        };
      },
      reducer: reducer
    }, _this.createCoreAsyncFlowActions(actionTypes, parserFunction));
  };
  this.reduce = function (reducer, state, action, fetchStateProp, completedActionType, stateResultProp) {
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
});
var AsyncFlow = new AsyncFlowProvider();
var _default = AsyncFlow;
exports.default = _default;