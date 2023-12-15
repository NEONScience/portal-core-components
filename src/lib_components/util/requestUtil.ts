import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { isStringNonEmpty } from './typeUtil';

export const getUserAgentHeader = (component: string): string => {
  const appName = NeonEnvironment.getReactAppName();
  const appVersion = NeonEnvironment.getReactAppVersion();
  if (!isStringNonEmpty(appName) || !isStringNonEmpty(appVersion)) {
    return '';
  }
  return `${appName}/${appVersion} (${component})`;
};

const RequestUtil = {
  getUserAgentHeader,
};

export default RequestUtil;
