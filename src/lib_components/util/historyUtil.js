import { createBrowserHistory } from 'history';

import NeonEnvironment from '../components/NeonEnvironment';
import { endsWithPolyfill } from './polyfillUtil';

const history = createBrowserHistory({
  basename: NeonEnvironment.getRouterBasePath(),
});

/**
 * Cleans the current browser path
 */
const cleanPath = () => {
  let path = history.location.pathname;
  if (endsWithPolyfill(path, '/')) {
    while (endsWithPolyfill(path, '/')) {
      path = path.slice(0, path.length - 1);
    }
    history.replace(path);
  }
};

const HistoryService = {
  history,
  cleanPath,
};

export default HistoryService;
