// TODO: Fold this whole file into NeonEnvironment?
import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';

export const ROUTES = {
  BASE: NeonEnvironment.getRouterBasePath(),
  HOME: NeonEnvironment.getRouterBaseHomePath(),
  LOGIN: `${NeonEnvironment.getRouterBaseHomePath()}/login`,
  LOGOUT: `${NeonEnvironment.getRouterBaseHomePath()}/logout`,
  ACCOUNT: '/myaccount',
};

/**
 * Gets the home route
 */
export const getHomeRoute = () => ROUTES.HOME;

/**
 * Prepends the base route to the specified route
 * @param {*} route
 */
export const getFullRoute = route => `${ROUTES.BASE}${route}`;

/**
 * Builds the route from the current host definition
 * @param {*} route
 */
export const buildRouteFromHost = route => `${NeonEnvironment.getHost()}${getFullRoute(route)}`;

/**
 * Builds the account route from the current host definition
 */
export const buildAccountRoute = () => `${NeonEnvironment.getHost()}${ROUTES.ACCOUNT}`;

export default ROUTES;
