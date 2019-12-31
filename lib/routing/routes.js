'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAccountRoute = exports.buildRouteFromHost = exports.getFullRoute = exports.getHomeRoute = exports.ROUTES = undefined;

var _NeonEnvironment = require('../components/NeonEnvironment/NeonEnvironment');

var _NeonEnvironment2 = _interopRequireDefault(_NeonEnvironment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ROUTES = exports.ROUTES = {
  BASE: _NeonEnvironment2.default.getRouterBasePath(),
  HOME: _NeonEnvironment2.default.getRouterBaseHomePath(),
  LOGIN: _NeonEnvironment2.default.getRouterBaseHomePath() + '/login',
  LOGOUT: _NeonEnvironment2.default.getRouterBaseHomePath() + '/logout',
  ACCOUNT: '/myaccount'
};

/**
 * Gets the home route
 */
// TODO: Fold this whole file into NeonEnvironment?
var getHomeRoute = exports.getHomeRoute = function getHomeRoute() {
  return ROUTES.HOME;
};

/**
 * Prepends the base route to the specified route
 * @param {*} route
 */
var getFullRoute = exports.getFullRoute = function getFullRoute(route) {
  return '' + ROUTES.BASE + route;
};

/**
 * Builds the route from the current host definition
 * @param {*} route
 */
var buildRouteFromHost = exports.buildRouteFromHost = function buildRouteFromHost(route) {
  return '' + _NeonEnvironment2.default.getHost() + getFullRoute(route);
};

/**
 * Builds the account route from the current host definition
 */
var buildAccountRoute = exports.buildAccountRoute = function buildAccountRoute() {
  return '' + _NeonEnvironment2.default.getHost() + ROUTES.ACCOUNT;
};

exports.default = ROUTES;