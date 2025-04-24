"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStateForStorage = exports.convertAOPInitialState = void 0;
var _DownloadDataContext = _interopRequireDefault(require("./DownloadDataContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // eslint-disable-next-line import/no-cycle
/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
const convertStateForStorage = state => {
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
        value: [..._DownloadDataContext.default.DEFAULT_STATE.sites.value]
      })
    });
  }
  return state;
};
exports.convertStateForStorage = convertStateForStorage;
const convertAOPInitialState = (state, propsState) => {
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