"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.buildAccountRoute = exports.buildRouteFromHost = exports.getFullRoute = exports.getHomeRoute = exports.ROUTES = void 0;

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Fold this whole file into NeonEnvironment?
var ROUTES = {
  BASE: _NeonEnvironment.default.getRouterBasePath(),
  HOME: _NeonEnvironment.default.getRouterBaseHomePath(),
  LOGIN: "".concat(_NeonEnvironment.default.getRouterBaseHomePath(), "/login"),
  LOGOUT: "".concat(_NeonEnvironment.default.getRouterBaseHomePath(), "/logout"),
  ACCOUNT: '/myaccount'
};
/**
 * Gets the home route
 */

exports.ROUTES = ROUTES;

var getHomeRoute = function getHomeRoute() {
  return ROUTES.HOME;
};
/**
 * Prepends the base route to the specified route
 * @param {*} route
 */


exports.getHomeRoute = getHomeRoute;

var getFullRoute = function getFullRoute(route) {
  return "".concat(ROUTES.BASE).concat(route);
};
/**
 * Builds the route from the current host definition
 * @param {*} route
 */


exports.getFullRoute = getFullRoute;

var buildRouteFromHost = function buildRouteFromHost(route) {
  return "".concat(_NeonEnvironment.default.getHost()).concat(getFullRoute(route));
};
/**
 * Builds the account route from the current host definition
 */


exports.buildRouteFromHost = buildRouteFromHost;

var buildAccountRoute = function buildAccountRoute() {
  return "".concat(_NeonEnvironment.default.getHost()).concat(ROUTES.ACCOUNT);
};

exports.buildAccountRoute = buildAccountRoute;
var _default = ROUTES;
exports.default = _default;