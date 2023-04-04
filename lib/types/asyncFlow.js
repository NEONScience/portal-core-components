"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncStateType = void 0;
/**
 * State shapes
 */
/**
 * Async action type
 */
var AsyncStateType = /*#__PURE__*/function (AsyncStateType) {
  AsyncStateType[AsyncStateType["IDLE"] = 0] = "IDLE";
  AsyncStateType[AsyncStateType["WORKING"] = 1] = "WORKING";
  AsyncStateType[AsyncStateType["FULLFILLED"] = 2] = "FULLFILLED";
  AsyncStateType[AsyncStateType["FAILED"] = 3] = "FAILED";
  return AsyncStateType;
}({});
/**
 * Action type union
 */
/**
 * Async action definitions.
 */
/**
 * General parameter passing actions
 */
/**
 * Completed async action for propagating the result data
 */
/**
 * Error async action for propagating error and optional message
 */
/**
 * Default action function declaration for async flow
 */
/**
 * Completed action function declaration for async flow
 */
/**
 * Error action function declaration for async flow
 */
/**
 * Parser function declaration for parsing the raw response to types result data
 */
/**
 * Core set of flow actions
 */
/**
 * Async flow action type wrapper
 */
/**
 * Async flow handler declaration
 */
/**
 * Async flow handler declaration
 */
exports.AsyncStateType = AsyncStateType;