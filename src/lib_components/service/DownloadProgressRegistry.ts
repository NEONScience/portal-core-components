// The most downloads that may be in progress at once within a page
export const MAX_CONCURRENT_DOWNLOADS = 3;

type RegistryListener = () => void;

const activeDownloadIds: Set<string> = new Set<string>();
const listeners: Set<RegistryListener> = new Set<RegistryListener>();

const notify = (): void => {
  listeners.forEach((listener: RegistryListener): void => listener());
};

/**
 * Registry of the downloads in progress within a page, shared by all download
 * progress providers to enforce the concurrent download limit.
 */
export interface IDownloadProgressRegistry {
  /**
   * Acquires a slot for the download when one is available.
   * Checking and acquiring is a single synchronous step.
   * @param downloadId The download to acquire a slot for
   * @return Whether the download holds a slot
   */
  tryAcquire: (downloadId: string) => boolean;
  /**
   * Releases the slot held by the download, if any
   * @param downloadId The download to release the slot for
   */
  release: (downloadId: string) => void;
  /**
   * Whether the download holds a slot
   * @param downloadId The download to check
   */
  isHeld: (downloadId: string) => boolean;
  getActiveCount: () => number;
  isLimitReached: () => boolean;
  /**
   * Subscribes to changes to the slots held
   * @param listener The listener to notify of changes
   * @return The function to unsubscribe
   */
  subscribe: (listener: RegistryListener) => () => void;
}

const DownloadProgressRegistry: IDownloadProgressRegistry = {
  tryAcquire: (downloadId: string): boolean => {
    if (activeDownloadIds.has(downloadId)) return true;
    if (activeDownloadIds.size >= MAX_CONCURRENT_DOWNLOADS) return false;
    activeDownloadIds.add(downloadId);
    notify();
    return true;
  },
  release: (downloadId: string): void => {
    if (!activeDownloadIds.delete(downloadId)) return;
    notify();
  },
  isHeld: (downloadId: string): boolean => activeDownloadIds.has(downloadId),
  getActiveCount: (): number => activeDownloadIds.size,
  isLimitReached: (): boolean => activeDownloadIds.size >= MAX_CONCURRENT_DOWNLOADS,
  subscribe: (listener: RegistryListener): () => void => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

Object.freeze(DownloadProgressRegistry);

export default DownloadProgressRegistry;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    reset: (): void => {
      activeDownloadIds.clear();
      notify();
    },
  }
);
