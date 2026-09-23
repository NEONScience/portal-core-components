import { renderHook } from '@testing-library/react';

import cloneDeep from 'lodash/cloneDeep';

import NeonAuthContext, { FETCH_STATUS, getTestableItems } from '../NeonAuthContext';

const {
  useNeonAuthContextState,
  DEFAULT_STATE,
} = NeonAuthContext;

const {
  reducer,
} = getTestableItems();

describe('NeonAuthContext', () => {
  describe('useNeonAuthContextState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', () => {
      const { result } = renderHook(() => useNeonAuthContextState());
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      const [state, dispatch] = result.current;
      expect(state).toStrictEqual(DEFAULT_STATE);
      expect(typeof dispatch).toBe('function');
      expect(dispatch()).toBeUndefined();
    });
  });

  describe('reducer', () => {
    test('does nothing when provided an invalid action', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'not a real action' },
      );
      expect(newState).toStrictEqual(DEFAULT_STATE);
    });
    test('fetchCalled', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchCalled', key: 'auth' },
      );
      expect(newState.fetches.auth.status).toBe(FETCH_STATUS.FETCHING);
      const sameState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchCalled', key: 'not a real key' },
      );
      expect(sameState).toStrictEqual(DEFAULT_STATE);
    });
    test('setAuthenticated', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'setAuthenticated', isAuthenticated: true },
      );
      expect(newState.auth.isAuthenticated).toBe(true);
      const newState2 = reducer(
        newState,
        { type: 'setAuthenticated', isAuthenticated: false },
      );
      expect(newState2.auth.isAuthenticated).toBe(false);
    });
    test('setAuthWorking', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'setAuthWorking', isAuthWorking: true },
      );
      expect(newState.auth.isAuthWorking).toBe(true);
      const newState2 = reducer(
        newState,
        { type: 'setAuthWorking', isAuthWorking: false },
      );
      expect(newState2.auth.isAuthWorking).toBe(false);
    });
    test('setAuthWsConnected', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'setAuthWsConnected', isAuthWsConnected: true },
      );
      expect(newState.auth.isAuthWsConnected).toBe(true);
      const newState2 = reducer(
        newState,
        { type: 'setAuthWsConnected', isAuthWsConnected: false },
      );
      expect(newState2.auth.isAuthWsConnected).toBe(false);
    });
    test('fetchAuthSucceeded', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchAuthSucceeded', isAuthenticated: true, response: { user: 'foo' } },
      );
      expect(newState.fetches.auth.status).toBe(FETCH_STATUS.SUCCESS);
      expect(newState.auth.isAuthenticated).toBe(true);
      expect(newState.auth.userData).toStrictEqual({ user: 'foo' });
      const newState2 = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchAuthSucceeded', isAuthenticated: false, response: {} },
      );
      expect(newState2.fetches.auth.status).toBe(FETCH_STATUS.SUCCESS);
      expect(newState2.auth.isAuthenticated).toBe(false);
      expect(newState2.auth.userData).toStrictEqual({});
    });
    test('fetchAuthFailed', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'fetchAuthFailed', error: 'BAD' },
      );
      expect(newState.fetches.auth.status).toBe(FETCH_STATUS.ERROR);
      expect(newState.fetches.auth.error).toBe('BAD');
      expect(newState.hasError).toBe(false); // auth failures do not invalidate the context
    });
    test('whenFinalCalled', () => {
      const newState = reducer(
        cloneDeep(DEFAULT_STATE),
        { type: 'whenFinalCalled' },
      );
      expect(newState.whenFinalCalled).toBe(true);
    });
  });
});
