import { endsWithPolyfill } from './polyfillUtil';

/**
 * Cleans the current browser path
 */
const cleanPath = () => {
  let path = window.location.pathname;
  if (endsWithPolyfill(path, '/')) {
    while (endsWithPolyfill(path, '/')) {
      path = path.slice(0, path.length - 1);
    }
    window.history.replaceState(window.history.state, '', path);
  }
};

const HistoryService = {
  cleanPath,
};

export default HistoryService;
