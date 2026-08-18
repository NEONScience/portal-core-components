import { useMemo, useSyncExternalStore } from 'react';

// Number of consecutive checks for considering the network state as offline
const OFFLINE_CONFIRMATION_CHECKS = 20;
// The interval to update the offline check
const OFFLINE_CHECK_INTERVAL_MS = 3_000;

const subscribeNetworkOnlineStatus = (onStoreChange: () => void): () => void => {
  window.addEventListener('online', onStoreChange);
  window.addEventListener('offline', onStoreChange);
  return () => {
    window.removeEventListener('online', onStoreChange);
    window.removeEventListener('offline', onStoreChange);
  };
};
const getNetworkOnlineSnapshot: () => boolean = () => (
  window.navigator.onLine
);
export const useNetworkOnlineStatus: () => boolean = () => (
  useSyncExternalStore<boolean>(subscribeNetworkOnlineStatus, getNetworkOnlineSnapshot)
);

const subscribeDocumentVisibleStatus = (onStoreChange: () => void): () => void => {
  document.addEventListener('visibilitychange', onStoreChange);
  return () => {
    document.removeEventListener('visibilitychange', onStoreChange);
  };
};
const getDocumentVisibleSnapshot: () => boolean = () => (
  window.document.visibilityState === 'visible'
);
export const useDocumentVisibleStatus: () => boolean = () => (
  useSyncExternalStore<boolean>(subscribeDocumentVisibleStatus, getDocumentVisibleSnapshot)
);

interface NetworkAvailabilitySnapshot {
  isAvailable: boolean;
  offlineChecks: number;
  offlineCheckInterval: number | null;
}
interface NetworkAvailabilityStore {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => boolean;
}

/**
 * Hook for determing the current definition of "Network Availability".
 * To prevent flapping and continually changing UI, this debounces the
 * offline indication such that it only reports as being disconnected
 * after a specified number of consecutive checks have failed for the check
 * interval. Only after those consecutive offline indications will this hook
 * report as being offline.
 * Once online status resumes, this resets any offline checking state and
 * immediately resumes and indicates that the connection is online.
 * @returns {boolean} Flag indicating currently determined network availability
 */
export const useNetworkAvailability: () => boolean = () => {
  const store = useMemo<NetworkAvailabilityStore>(() => {
    const snapshot: NetworkAvailabilitySnapshot = {
      isAvailable: true,
      offlineChecks: 0,
      offlineCheckInterval: null,
    };
    // Reset the offline check state
    const resetOfflineChecks = () => {
      if (snapshot.offlineCheckInterval !== null) {
        window.clearInterval(snapshot.offlineCheckInterval);
      }
      snapshot.offlineCheckInterval = null;
      snapshot.offlineChecks = 0;
    };
    const subscribe = (onStoreChange: () => void): () => void => {
      // Handle setting the state to online
      // Reset the offline check state whenever connection becomes online
      // This recovers to online immediately while check offline requires
      // consecutive failures
      const handleOnline = () => {
        resetOfflineChecks();
        if (!snapshot.isAvailable) {
          snapshot.isAvailable = true;
          onStoreChange();
        }
      };
      // Setup an interval to check the online status, handle setting
      // to offline once a specified number of consecutive online checks
      // have indicated that the connection is offline, and once reached,
      // indicate from this hook that the connection is reporting as offline
      const handleOffline = () => {
        if (snapshot.offlineCheckInterval !== null) {
          return;
        }
        snapshot.offlineChecks = 0;
        snapshot.offlineCheckInterval = window.setInterval(() => {
          if (navigator.onLine) {
            handleOnline();
            return;
          }
          snapshot.offlineChecks += 1;
          if (snapshot.offlineChecks >= OFFLINE_CONFIRMATION_CHECKS) {
            resetOfflineChecks();
            if (snapshot.isAvailable) {
              snapshot.isAvailable = false;
              onStoreChange();
            }
          }
        }, OFFLINE_CHECK_INTERVAL_MS);
      };
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      if (!window.navigator.onLine) {
        handleOffline();
      }
      return () => {
        resetOfflineChecks();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    };
    return {
      subscribe,
      getSnapshot: () => snapshot.isAvailable,
    };
  }, []);
  return useSyncExternalStore<boolean>(
    store.subscribe,
    store.getSnapshot,
  );
};
