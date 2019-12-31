import { createBrowserHistory } from 'history';
import { ROUTES } from './routes';

import { endsWithPolyfill } from '../util/polyfillUtil';

const history = createBrowserHistory({
  basename: ROUTES.BASE,
  // forceRefresh: true
});

/**
 * Cleans the current browser path
 * @param {*} history
 */
export const cleanPath = (history) => {
  let path = history.location.pathname;
  if (endsWithPolyfill(path, '/')) {
    while (endsWithPolyfill(path, '/')) {
      path = path.slice(0, path.length - 1);
    }
    history.replace(path);
  }
};

/**
 * Gets the history
 */
export const getHistory = () => history;

export default getHistory;
