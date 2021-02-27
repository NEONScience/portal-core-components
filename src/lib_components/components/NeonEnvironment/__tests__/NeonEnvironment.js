import NeonEnvironment, {
  requiredEnvironmentVars,
  optionalEnvironmentVars,
} from '../NeonEnvironment';

requiredEnvironmentVars.forEach((v) => { process.env[v] = v; });
optionalEnvironmentVars.forEach((v) => { process.env[v] = v; });

describe('NeonEnvironment', () => {
  describe('boolean properties', () => {
    [
      'isValid',
      'isDevEnv',
      'isProdEnv',
      'isForeignEnv',
      'useGraphql',
      'showAopViewer',
      'authDisableWs',
    ].forEach((prop) => {
      test(`${prop}`, () => {
        expect(typeof NeonEnvironment[prop]).toBe('boolean')
      });
    });
  });

  describe('simple string access methods', () => {
    [
      'getApiName',
      'getApiVersion',
      'getRootApiPath',
      'getRootGraphqlPath',
      'getRootJsonLdPath',
      'getRootAuthApiPath',
      'getVisusProductsBaseUrl',
      'getVisusIframeBaseUrl',
      'getRouterBasePath',
      'getRouterBaseHomePath',
      'getHostOverride',
      'getWsHostOverride',
    ].forEach((method) => {
      test(`${method}()`, () => {
        expect(typeof NeonEnvironment[method]()).toBe('string')
      });
    });
  });

  describe('nested string access methods', () => {
    [
      'getApiPath',
      'getApiLdPath',
      'getPagePath',
      'getAuthPath',
      'getAuthApiPath',
      'authTopics',
      'route',
    ].forEach((methodGroup) => {
      describe(`${methodGroup} string access methods`, () => {
        Object.keys(NeonEnvironment[methodGroup]).forEach((method) => {
          test(`${methodGroup}.${method}()`, () => {
            expect(typeof NeonEnvironment[methodGroup][method]()).toBe('string')
          });
        });
      });
    });
  });

  describe('get full path methods', () => {
    test('getFullApiPath()', () => {
      const host = NeonEnvironment.getHost();
      const fullPath1 = NeonEnvironment.getFullApiPath();
      expect(fullPath1.startsWith(host)).toBe(true);
      const downloadPath = NeonEnvironment.getApiPath.download();
      const fullPath2 = NeonEnvironment.getFullApiPath('download');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(downloadPath)).toBe(true);
    });
    test('getFullJsonLdApiPath()', () => {
      const host = NeonEnvironment.getHost();
      const fullPath1 = NeonEnvironment.getFullJsonLdApiPath();
      expect(fullPath1.startsWith(host)).toBe(true);
      const productsPath = NeonEnvironment.getApiPath.products();
      const fullPath2 = NeonEnvironment.getFullJsonLdApiPath('products');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(productsPath)).toBe(true);
      const repoPath = NeonEnvironment.getApiLdPath.repo();
      const fullPath3 = NeonEnvironment.getFullJsonLdApiPath('repo');
      expect(fullPath3.startsWith(host)).toBe(true);
      expect(fullPath3.endsWith(repoPath)).toBe(true);
    });
    test('getFullPagePath()', () => {
      const host = NeonEnvironment.getHost();
      const fullPath1 = NeonEnvironment.getFullPagePath();
      expect(fullPath1.startsWith(host)).toBe(true);
      const fileNamingConventionsPath = NeonEnvironment.getPagePath.fileNamingConventions();
      const fullPath2 = NeonEnvironment.getFullPagePath('fileNamingConventions');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(fileNamingConventionsPath)).toBe(true);
    });
    test('getFullAuthPath()', () => {
      const host = NeonEnvironment.getHost();
      const fullPath1 = NeonEnvironment.getFullAuthPath();
      expect(fullPath1.startsWith(host)).toBe(true);
      const loginPath = NeonEnvironment.getAuthPath.login();
      const fullPath2 = NeonEnvironment.getFullAuthPath('login');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(loginPath)).toBe(true);
    });
    test('getFullAuthApiPath()', () => {
      const wsPath = NeonEnvironment.getAuthApiPath.ws();
      const host1 = NeonEnvironment.getHost();
      const fullPath1 = NeonEnvironment.getFullAuthApiPath();
      expect(fullPath1.startsWith(host1)).toBe(true);
      const fullPath2 = NeonEnvironment.getFullAuthApiPath('ws');
      expect(fullPath2.startsWith(host1)).toBe(true);
      expect(fullPath2.endsWith(wsPath)).toBe(true);
      const host2 = NeonEnvironment.getWebSocketHost();
      const fullPath3 = NeonEnvironment.getFullAuthApiPath('', true);
      expect(fullPath3.startsWith(host2)).toBe(true);
      const fullPath4 = NeonEnvironment.getFullAuthApiPath('ws', true);
      expect(fullPath4.startsWith(host2)).toBe(true);
      expect(fullPath4.endsWith(wsPath)).toBe(true);
    });
    test('getFullGraphqlath()', () => {
      const host = NeonEnvironment.getHost();
      expect(NeonEnvironment.getFullGraphqlPath().startsWith(host)).toBe(true);
    });
  });

  test('getAuthSilentType()', () => {
    expect(NeonEnvironment.getAuthSilentType()).toBe('DISABLED');
  });
});
