import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import NeonEnvironment, {
  INeonEnvironment,
  NeonProfile,
  requiredEnvironmentVars,
  optionalEnvironmentVars,
} from '../NeonEnvironment';
import { Undef } from '../../../types/core';

requiredEnvironmentVars.forEach((v) => { process.env[v] = v; });
optionalEnvironmentVars.forEach((v) => { process.env[v] = v; });

type ServerDataWindow = Window & { NEON_SERVER_DATA?: unknown };

const setServerData = (serverData: unknown): void => {
  (window as ServerDataWindow).NEON_SERVER_DATA = serverData;
};

const setEnv = (envVar: string, value: Undef<string>): void => {
  if (typeof value === 'undefined') {
    delete process.env[envVar];
  } else {
    process.env[envVar] = value;
  }
};

// The dev environment is determined when the module is loaded, so load an
// isolated instance of the module for the specified NODE_ENV.
const loadNeonEnvironment = (nodeEnv: string): INeonEnvironment => {
  const originalNodeEnv = process.env.NODE_ENV;
  let isolatedNeonEnvironment: Undef<INeonEnvironment>;
  setEnv('NODE_ENV', nodeEnv);
  try {
    jest.isolateModules(() => {
      isolatedNeonEnvironment = require('../NeonEnvironment').default;
    });
  } finally {
    setEnv('NODE_ENV', originalNodeEnv);
  }
  return isolatedNeonEnvironment as INeonEnvironment;
};

describe('NeonEnvironment', () => {
  describe('boolean properties', () => {
    const properties: (keyof INeonEnvironment)[] = [
      'isValid',
      'isDevEnv',
      'isProdEnv',
    ];
    properties.forEach((prop) => {
      test(`${prop}`, () => {
        expect(typeof NeonEnvironment[prop]).toBe('boolean');
      });
    });
  });

  describe('boolean access methods', () => {
    const methods: (keyof INeonEnvironment)[] = [
      'authDisableWs',
      'auth0DisableApi',
      'authDisableBroadcastChannel',
      'sessionDisable',
      'sessionDisablePing',
      'enableGlobalSignInState',
      'fetchDrupalAssets',
      'isAutonomousProfile',
    ];
    methods.forEach((method) => {
      test(`${method}()`, () => {
        expect(typeof (NeonEnvironment[method] as () => unknown)()).toBe('boolean');
      });
    });
  });

  describe('simple string access methods', () => {
    const methods: (keyof INeonEnvironment)[] = [
      'getRootApiPath',
      'getRootGraphqlPath',
      'getRootJsonLdPath',
      'getRootAuthApiPath',
      'getRootAuth0ApiPath',
      'getRootDownloadApiPath',
      'getAopGEEDesktopUrl',
      'getAopGEEDesktopUrl',
      'getRouterBasePath',
      'getRouterBaseHomePath',
      'getApiHostOverride',
      'getWsHostOverride',
    ];
    methods.forEach((method) => {
      test(`${method}()`, () => {
        expect(typeof (NeonEnvironment[method] as () => unknown)()).toBe('string');
      });
    });
  });

  describe('nested string access methods', () => {
    const methodGroups: (keyof INeonEnvironment)[] = [
      'getApiPath',
      'getApiLdPath',
      'getAuthPath',
      'getAuthApiPath',
      'getDownloadApiPath',
      'authTopics',
      'route',
    ];
    methodGroups.forEach((methodGroup) => {
      describe(`${methodGroup} string access methods`, () => {
        const group = NeonEnvironment[methodGroup] as Record<string, () => string>;
        Object.keys(group).forEach((method) => {
          test(`${methodGroup}.${method}()`, () => {
            expect(typeof group[method]()).toBe('string');
          });
        });
      });
    });
  });

  describe('get full path methods', () => {
    test('getFullApiPath()', () => {
      const host = NeonEnvironment.getApiHost();
      const fullPath1 = NeonEnvironment.getFullApiPath('');
      expect(fullPath1.startsWith(host)).toBe(true);
      const productPath = NeonEnvironment.getApiPath.products();
      const fullPath2 = NeonEnvironment.getFullApiPath('products');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(productPath)).toBe(true);
    });
    test('getFullJsonLdApiPath()', () => {
      const host = NeonEnvironment.getApiHost();
      const fullPath1 = NeonEnvironment.getFullJsonLdApiPath('');
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
      const fullPath1 = NeonEnvironment.getFullAuthPath('');
      expect(fullPath1.startsWith(host)).toBe(true);
      const loginPath = NeonEnvironment.getAuthPath.login();
      const fullPath2 = NeonEnvironment.getFullAuthPath('login');
      expect(fullPath2.startsWith(host)).toBe(true);
      expect(fullPath2.endsWith(loginPath)).toBe(true);
    });
    test('getFullAuthApiPath()', () => {
      const wsPath = NeonEnvironment.getAuthApiPath.ws();
      const host1 = NeonEnvironment.getApiHost();
      const fullPath1 = NeonEnvironment.getFullAuthApiPath('', false);
      expect(fullPath1.startsWith(host1)).toBe(true);
      const fullPath2 = NeonEnvironment.getFullAuthApiPath('ws', false);
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

  describe('NeonProfile', () => {
    const PROFILE_OVERRIDE = 'NEXT_PUBLIC_NEON_PROFILE_OVERRIDE';
    type ProfileOption = 'authDisableWs'
      | 'auth0DisableApi'
      | 'authDisableBroadcastChannel'
      | 'sessionDisable'
      | 'sessionDisablePing'
      | 'enableGlobalSignInState'
      | 'fetchDrupalAssets';
    // [option, environment variable, value when unset, value forced by the autonomous profile]
    const PROFILE_OPTIONS: [ProfileOption, string, boolean, boolean][] = [
      ['authDisableWs', 'NEXT_PUBLIC_NEON_AUTH_DISABLE_WS', false, true],
      ['auth0DisableApi', 'NEXT_PUBLIC_NEON_AUTH_DISABLE_AUTH0_API', false, true],
      ['authDisableBroadcastChannel', 'NEXT_PUBLIC_NEON_AUTH_DISABLE_BROADCAST_CHANNEL', false, true],
      ['sessionDisable', 'NEXT_PUBLIC_NEON_AUTH_DISABLE_SESSION', false, true],
      ['sessionDisablePing', 'NEXT_PUBLIC_NEON_AUTH_DISABLE_SESSION_PING', false, true],
      ['enableGlobalSignInState', 'NEXT_PUBLIC_NEON_ENABLE_GLOBAL_SIGNIN_STATE', false, false],
      ['fetchDrupalAssets', 'NEXT_PUBLIC_NEON_FETCH_DRUPAL_ASSETS', true, false],
    ];
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
      process.env = { ...ORIGINAL_ENV };
      setEnv(PROFILE_OVERRIDE, undefined);
      PROFILE_OPTIONS.forEach(([, envVar]) => setEnv(envVar, undefined));
    });
    afterEach(() => {
      process.env = ORIGINAL_ENV;
      delete (window as ServerDataWindow).NEON_SERVER_DATA;
    });

    describe('getNeonProfile()', () => {
      test('is the default profile without server data or an override', () => {
        expect(NeonEnvironment.getNeonProfile()).toBe(NeonProfile.DEFAULT);
        expect(NeonEnvironment.isAutonomousProfile()).toBe(false);
      });
      test('is the default profile with unreplaced server data', () => {
        setServerData('__NEON_SERVER_DATA__');
        expect(NeonEnvironment.getNeonProfile()).toBe(NeonProfile.DEFAULT);
      });
      test.each([
        ['autonomous', NeonProfile.AUTONOMOUS],
        ['AUTONOMOUS', NeonProfile.AUTONOMOUS],
        [' Autonomous ', NeonProfile.AUTONOMOUS],
        ['default', NeonProfile.DEFAULT],
        ['unknown', NeonProfile.DEFAULT],
        ['', NeonProfile.DEFAULT],
        [null, NeonProfile.DEFAULT],
        [true, NeonProfile.DEFAULT],
      ])('server data profile %p is the %p profile', (serverDataProfile, expected) => {
        setServerData({ NeonProfile: serverDataProfile });
        expect(NeonEnvironment.getNeonProfile()).toBe(expected);
        expect(NeonEnvironment.isAutonomousProfile()).toBe(expected === NeonProfile.AUTONOMOUS);
      });
      test.each(['test', 'production'])('ignores the override when NODE_ENV is %p', (nodeEnv) => {
        const env = loadNeonEnvironment(nodeEnv);
        expect(env.isDevEnv).toBe(false);
        setEnv(PROFILE_OVERRIDE, 'autonomous');
        expect(env.getNeonProfile()).toBe(NeonProfile.DEFAULT);
        setServerData({ NeonProfile: 'autonomous' });
        setEnv(PROFILE_OVERRIDE, 'default');
        expect(env.getNeonProfile()).toBe(NeonProfile.AUTONOMOUS);
      });

      describe('in a dev environment', () => {
        let devEnv: INeonEnvironment;
        beforeEach(() => {
          devEnv = loadNeonEnvironment('development');
        });
        test('applies the override', () => {
          expect(devEnv.isDevEnv).toBe(true);
          setEnv(PROFILE_OVERRIDE, 'autonomous');
          expect(devEnv.getNeonProfile()).toBe(NeonProfile.AUTONOMOUS);
          expect(devEnv.isAutonomousProfile()).toBe(true);
        });
        test('the override takes precedence over the server data profile', () => {
          setServerData({ NeonProfile: 'default' });
          setEnv(PROFILE_OVERRIDE, 'autonomous');
          expect(devEnv.getNeonProfile()).toBe(NeonProfile.AUTONOMOUS);
          setServerData({ NeonProfile: 'autonomous' });
          setEnv(PROFILE_OVERRIDE, 'default');
          expect(devEnv.getNeonProfile()).toBe(NeonProfile.DEFAULT);
        });
        test.each([undefined, '', 'unknown'])('uses the server data profile with override %p', (override) => {
          setServerData({ NeonProfile: 'autonomous' });
          setEnv(PROFILE_OVERRIDE, override);
          expect(devEnv.getNeonProfile()).toBe(NeonProfile.AUTONOMOUS);
        });
      });
    });

    describe('getNeonProfileOverride()', () => {
      test('returns the override value', () => {
        setEnv(PROFILE_OVERRIDE, 'autonomous');
        expect(NeonEnvironment.getNeonProfileOverride()).toBe('autonomous');
      });
      test.each([undefined, ''])('returns undefined when the override is %p', (override) => {
        setEnv(PROFILE_OVERRIDE, override);
        expect(NeonEnvironment.getNeonProfileOverride()).toBeUndefined();
      });
    });

    describe.each(PROFILE_OPTIONS)('%s()', (option, envVar, unsetValue, autonomousValue) => {
      test('the default profile applies the environment variable', () => {
        expect(NeonEnvironment[option]()).toBe(unsetValue);
        setEnv(envVar, 'true');
        expect(NeonEnvironment[option]()).toBe(true);
        setEnv(envVar, 'false');
        expect(NeonEnvironment[option]()).toBe(false);
        setServerData({ NeonProfile: 'default' });
        expect(NeonEnvironment[option]()).toBe(false);
      });
      test.each([undefined, 'true', 'false'])(
        'the autonomous profile overrides the environment variable value %p',
        (envValue) => {
          setServerData({ NeonProfile: 'autonomous' });
          setEnv(envVar, envValue);
          expect(NeonEnvironment[option]()).toBe(autonomousValue);
        },
      );
      test('the autonomous profile override overrides the environment variable', () => {
        const devEnv = loadNeonEnvironment('development');
        setEnv(envVar, autonomousValue ? 'false' : 'true');
        expect(devEnv[option]()).toBe(!autonomousValue);
        setEnv(PROFILE_OVERRIDE, 'autonomous');
        expect(devEnv[option]()).toBe(autonomousValue);
      });
    });
  });
});
