"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readState = exports.persistState = void 0;

var _StateService = _interopRequireDefault(require("../../service/StateService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = 'downloadDataContextState';

var persistState = function persistState(state) {
  _StateService.default.setObject(key, state);
};

exports.persistState = persistState;

var readState = function readState() {
  return _StateService.default.getObject(key);
};

exports.readState = readState;