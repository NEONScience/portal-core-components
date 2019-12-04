'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routes = require('./routes');

Object.defineProperty(exports, 'ROUTES', {
  enumerable: true,
  get: function get() {
    return _routes.ROUTES;
  }
});
Object.defineProperty(exports, 'getHomeRoute', {
  enumerable: true,
  get: function get() {
    return _routes.getHomeRoute;
  }
});
Object.defineProperty(exports, 'getFullRoute', {
  enumerable: true,
  get: function get() {
    return _routes.getFullRoute;
  }
});
Object.defineProperty(exports, 'buildRouteFromHost', {
  enumerable: true,
  get: function get() {
    return _routes.buildRouteFromHost;
  }
});
Object.defineProperty(exports, 'buildAccountRoute', {
  enumerable: true,
  get: function get() {
    return _routes.buildAccountRoute;
  }
});

var _history = require('./history');

Object.defineProperty(exports, 'getHistory', {
  enumerable: true,
  get: function get() {
    return _history.getHistory;
  }
});
Object.defineProperty(exports, 'cleanPath', {
  enumerable: true,
  get: function get() {
    return _history.cleanPath;
  }
});