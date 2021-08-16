"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _operators = require("rxjs/operators");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * A function to use a distributed shared state for sharing state between components outside
 * of the component heirarchy. The subject would be defined in an
 * external module and then this function can be imported to incorporate the shared
 * state into a component.
 * @param subject A subject.
 * @returns The value and function to set the state.
 */
var useSharedState = function useSharedState(subject) {
  var _useState = (0, _react.useState)(subject.getValue()),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setState = _useState2[1];

  (0, _react.useEffect)(function () {
    var subscription = subject.pipe((0, _operators.skip)(1)).subscribe(function (s) {
      return setState(s);
    });
    return function () {
      return subscription.unsubscribe();
    };
  }, [subject]);

  var setDistributedState = function setDistributedState(state) {
    return subject.next(state);
  }; // @ts-ignore


  return [value, setDistributedState];
};

var _default = useSharedState;
exports.default = _default;