'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authenticate = require('./authenticate');

Object.defineProperty(exports, 'Authenticate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_authenticate).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }