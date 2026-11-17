import {
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import DownloadProgressRegistry, {
  MAX_CONCURRENT_DOWNLOADS,
  getTestableItems,
} from '../DownloadProgressRegistry';

const { reset } = getTestableItems() as { reset: () => void };

describe('DownloadProgressRegistry', () => {
  beforeEach(() => {
    reset();
  });

  test('allows at most the concurrent download limit', () => {
    expect(MAX_CONCURRENT_DOWNLOADS).toBe(3);
    expect(DownloadProgressRegistry.tryAcquire('a')).toBe(true);
    expect(DownloadProgressRegistry.tryAcquire('b')).toBe(true);
    expect(DownloadProgressRegistry.isLimitReached()).toBe(false);
    // Two rapid acquires for the last slot, only one may succeed
    expect(DownloadProgressRegistry.tryAcquire('c')).toBe(true);
    expect(DownloadProgressRegistry.tryAcquire('d')).toBe(false);
    expect(DownloadProgressRegistry.getActiveCount()).toBe(3);
    expect(DownloadProgressRegistry.isLimitReached()).toBe(true);
    expect(DownloadProgressRegistry.isHeld('d')).toBe(false);
  });

  test('acquiring a held slot again succeeds without taking another slot', () => {
    expect(DownloadProgressRegistry.tryAcquire('a')).toBe(true);
    expect(DownloadProgressRegistry.tryAcquire('a')).toBe(true);
    expect(DownloadProgressRegistry.getActiveCount()).toBe(1);
  });

  test('releasing is idempotent and frees a slot', () => {
    DownloadProgressRegistry.tryAcquire('a');
    DownloadProgressRegistry.tryAcquire('b');
    DownloadProgressRegistry.tryAcquire('c');
    DownloadProgressRegistry.release('b');
    DownloadProgressRegistry.release('b');
    DownloadProgressRegistry.release('unknown');
    expect(DownloadProgressRegistry.getActiveCount()).toBe(2);
    expect(DownloadProgressRegistry.isLimitReached()).toBe(false);
    expect(DownloadProgressRegistry.tryAcquire('d')).toBe(true);
  });

  test('notifies subscribers of changes only', () => {
    const listener = jest.fn();
    const unsubscribe = DownloadProgressRegistry.subscribe(listener);
    DownloadProgressRegistry.tryAcquire('a');
    expect(listener).toHaveBeenCalledTimes(1);
    // No change when already held or released
    DownloadProgressRegistry.tryAcquire('a');
    DownloadProgressRegistry.release('b');
    expect(listener).toHaveBeenCalledTimes(1);
    DownloadProgressRegistry.release('a');
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    DownloadProgressRegistry.tryAcquire('a');
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
