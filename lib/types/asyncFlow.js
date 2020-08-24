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
var AsyncStateType;
/**
 * Action type union
 */

exports.AsyncStateType = AsyncStateType;

(function (AsyncStateType) {
  AsyncStateType[AsyncStateType["IDLE"] = 0] = "IDLE";
  AsyncStateType[AsyncStateType["WORKING"] = 1] = "WORKING";
  AsyncStateType[AsyncStateType["FULLFILLED"] = 2] = "FULLFILLED";
  AsyncStateType[AsyncStateType["FAILED"] = 3] = "FAILED";
})(AsyncStateType || (exports.AsyncStateType = AsyncStateType = {}));