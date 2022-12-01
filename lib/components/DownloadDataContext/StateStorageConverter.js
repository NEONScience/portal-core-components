"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStateForStorage = exports.convertAOPInitialState = void 0;
var _DownloadDataContext = _interopRequireDefault(require("./DownloadDataContext"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
var convertStateForStorage = function convertStateForStorage(state) {
  if (state.fromAOPManifest) {
    // AOP S3 Files will incur too much data to be saved in session state
    // Restore to default state in terms of s3Files and selection state.
    return _extends({}, state, {
      s3FileFetches: _extends({}, _DownloadDataContext.default.DEFAULT_STATE.s3FileFetches),
      s3FileFetchProgress: _DownloadDataContext.default.DEFAULT_STATE.s3FileFetchProgress,
      s3Files: _extends({}, _DownloadDataContext.default.DEFAULT_STATE.s3Files),
      manifest: _extends({}, _DownloadDataContext.default.DEFAULT_STATE.manifest),
      allStepsComplete: _DownloadDataContext.default.DEFAULT_STATE.allStepsComplete,
      sites: _extends({}, state.sites, {
        value: _toConsumableArray(_DownloadDataContext.default.DEFAULT_STATE.sites.value)
      })
    });
  }
  return state;
};
exports.convertStateForStorage = convertStateForStorage;
var convertAOPInitialState = function convertAOPInitialState(state, propsState) {
  if (!state.fromAOPManifest) return state;
  return _extends({}, state, {
    s3FileFetches: _extends({}, propsState.s3FileFetches),
    s3FileFetchProgress: propsState.s3FileFetchProgress,
    s3Files: _extends({}, propsState.s3Files),
    manifest: _extends({}, propsState.manifest),
    allStepsComplete: propsState.allStepsComplete,
    policies: _extends({}, propsState.policies)
  });
};

// eslint-disable-next-line import/prefer-default-export
exports.convertAOPInitialState = convertAOPInitialState;