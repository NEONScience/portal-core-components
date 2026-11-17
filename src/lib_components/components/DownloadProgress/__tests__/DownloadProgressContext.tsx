import React from 'react';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { act, render } from '@testing-library/react';

import DownloadProgressContext, {
  useDownloadProgressActions,
  useDownloadProgressState,
  useDownloadProgressView,
  useIsDownloadLimitReached,
  useIsDownloadProgressActive,
} from '../DownloadProgressContext';
import DownloadProgressRegistry, {
  getTestableItems,
} from '../../../service/DownloadProgressRegistry';
import {
  IDownloadProgressService,
  createInitialDownloadProgressState,
} from '../../../service/DownloadProgressService';
import {
  DownloadProgressActions,
  DownloadProgressPhase,
  DownloadProgressState,
} from '../../../types/downloadProgress';

const { reset: resetRegistry } = getTestableItems() as { reset: () => void };

interface FakeService {
  service: IDownloadProgressService;
  setState: (update: Partial<DownloadProgressState>) => void;
}

const createFakeService = (): FakeService => {
  let state: DownloadProgressState = createInitialDownloadProgressState();
  const listeners: Set<() => void> = new Set<() => void>();
  const actions: DownloadProgressActions = {
    start: jest.fn<DownloadProgressActions['start']>(() => 'started'),
    expand: jest.fn<DownloadProgressActions['expand']>(),
    minimize: jest.fn<DownloadProgressActions['minimize']>(),
    dismiss: jest.fn<DownloadProgressActions['dismiss']>(() => true),
  };
  const service: IDownloadProgressService = {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => state,
    actions,
    ...actions,
    attach: jest.fn(),
    dispose: jest.fn(),
  };
  return {
    service,
    setState: (update: Partial<DownloadProgressState>) => {
      state = { ...state, ...update };
      listeners.forEach((listener: () => void) => listener());
    },
  };
};

describe('DownloadProgressContext', () => {
  beforeEach(() => {
    resetRegistry();
  });
  afterEach(() => {
    resetRegistry();
  });

  test('attaches the service when mounted and disposes of it when unmounted', () => {
    const { service } = createFakeService();
    const { unmount } = render(<DownloadProgressContext.Provider service={service} />);
    expect(service.attach).toHaveBeenCalledTimes(1);
    expect(service.dispose).not.toHaveBeenCalled();
    unmount();
    expect(service.dispose).toHaveBeenCalledTimes(1);
  });

  test('actions are stable and do not re-render consumers as progress changes', () => {
    const { service, setState } = createFakeService();
    const actionRenders = jest.fn<(actions: DownloadProgressActions | null | undefined) => void>();
    const activeRenders = jest.fn<(active: boolean) => void>();
    const stateRenders = jest.fn<(state: DownloadProgressState) => void>();
    const ActionsConsumer = () => {
      actionRenders(useDownloadProgressActions());
      return null;
    };
    const ActiveConsumer = () => {
      activeRenders(useIsDownloadProgressActive());
      return null;
    };
    const StateConsumer = () => {
      stateRenders(useDownloadProgressState());
      return null;
    };
    render(
      <DownloadProgressContext.Provider service={service}>
        <ActionsConsumer />
        <ActiveConsumer />
        <StateConsumer />
      </DownloadProgressContext.Provider>,
    );
    expect(actionRenders).toHaveBeenCalledTimes(1);
    expect(actionRenders).toHaveBeenLastCalledWith(service.actions);
    expect(activeRenders).toHaveBeenLastCalledWith(false);
    act(() => setState({ phase: DownloadProgressPhase.STREAMING, bytesSent: 1 }));
    act(() => setState({ bytesSent: 2 }));
    act(() => setState({ bytesSent: 3 }));
    // Only the state consumer re-renders for every change
    expect(actionRenders).toHaveBeenCalledTimes(1);
    expect(activeRenders).toHaveBeenCalledTimes(2);
    expect(activeRenders).toHaveBeenLastCalledWith(true);
    expect(stateRenders).toHaveBeenCalledTimes(4);
    expect(stateRenders.mock.calls[3][0].bytesSent).toBe(3);
  });

  test('reports how the download is shown', () => {
    const { service, setState } = createFakeService();
    const views: string[] = [];
    const ViewConsumer = () => {
      views.push(useDownloadProgressView());
      return null;
    };
    render(
      <DownloadProgressContext.Provider service={service}>
        <ViewConsumer />
      </DownloadProgressContext.Provider>,
    );
    act(() => setState({ phase: DownloadProgressPhase.STARTED, expanded: true }));
    act(() => setState({ expanded: false }));
    act(() => setState({ phase: DownloadProgressPhase.IDLE }));
    expect(views).toEqual(['none', 'expanded', 'minimized', 'none']);
  });

  test('provides no actions and an idle state outside a provider', () => {
    let actions: DownloadProgressActions | null | undefined;
    let state: DownloadProgressState | undefined;
    let active: boolean | undefined;
    const Consumer = () => {
      actions = useDownloadProgressActions();
      state = useDownloadProgressState();
      active = useIsDownloadProgressActive();
      return null;
    };
    render(<Consumer />);
    expect(actions).toBeNull();
    expect((state as DownloadProgressState).phase).toBe(DownloadProgressPhase.IDLE);
    expect(active).toBe(false);
  });

  test('reports when the page download limit is reached, without a provider', () => {
    const values: boolean[] = [];
    const Consumer = () => {
      values.push(useIsDownloadLimitReached());
      return null;
    };
    render(<Consumer />);
    act(() => {
      DownloadProgressRegistry.tryAcquire('a');
      DownloadProgressRegistry.tryAcquire('b');
    });
    act(() => {
      DownloadProgressRegistry.tryAcquire('c');
    });
    act(() => {
      DownloadProgressRegistry.release('b');
    });
    expect(values).toEqual([false, true, false]);
  });
});
