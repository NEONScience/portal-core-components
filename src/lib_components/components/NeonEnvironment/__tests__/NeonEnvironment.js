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
      'useGraphql',
      'showAopViewer',
      'authDisableWs',
    ].forEach((prop) => {
      test(`${prop}`, () => {
        expect(typeof NeonEnvironment[prop]).toBe('boolean');
      });
    });
  });

  describe('simple string access methods', () => {
    [
      'getRootApiPath',
      'getRootGraphqlPath',
      'getRootJsonLdPath',
      'getRootAuthApiPath',
      'getRootAuth0ApiPath',
      'getRootDownloadApiPath',
      'getVisusProductsBaseUrl',
      'getVisusIframeBaseUrl',
      'getRouterBasePath',
      'getRouterBaseHomePath',
      'getApiHostOverride',
      'getWsHostOverride',
    ].forEach((method) => {
      test(`${method}()`, () => {
        expect(typeof NeonEnvironment[method]()).toBe('string');
      });
    });
  });

  describe('nested string access methods', () => {
    [
      'getApiPath',
      'getApiLdPath',
      'getAuthPath',
      'getAuthApiPath',
      'getDownloadApiPath',
      'authTopics',
      'route',
    ].forEach((methodGroup) => {
      describe(`${methodGroup} string access methods`, () => {
        Object.keys(NeonEnvironment[methodGroup]).forEach((method) => {
          test(`${methodGroup}.${method}()`, () => {
            expect(typeof NeonEnvironment[methodGroup][method]()).toBe('string');
          });
        });
      });
    });
  });

  describe('get full path methods', () => {
    test('getFullApiPath()', () => {
      const host = NeonEnvironment.getApiHost();
      const fullPath1 = NeonEnvironment.getFullApiPath();
      expect(fullPath1.startsWith(host)).toBe(true);
      const productPath = NeonEnvironment.getApiPath.products();
      const fullPath2 = NeonEnvironment.getFullApiPath('products');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(productPath)).toBe(true);
    });
    test('getFullJsonLdApiPath()', () => {
      const host = NeonEnvironment.getApiHost();
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
    test('getFullAuthPath()', () => {
      const host = NeonEnvironment.getApiHost();
      const fullPath1 = NeonEnvironment.getFullAuthPath();
      expect(fullPath1.startsWith(host)).toBe(true);
      const loginPath = NeonEnvironment.getAuthPath.login();
      const fullPath2 = NeonEnvironment.getFullAuthPath('login');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(loginPath)).toBe(true);
    });
    test('getFullAuthApiPath()', () => {
      const wsPath = NeonEnvironment.getAuthApiPath.ws();
      const host1 = NeonEnvironment.getApiHost();
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
      const host = NeonEnvironment.getApiHost();
      expect(NeonEnvironment.getFullGraphqlPath().startsWith(host)).toBe(true);
    });
  });

  test('getAuthSilentType()', () => {
    expect(NeonEnvironment.getAuthSilentType()).toBe('DISABLED');
  });
});
