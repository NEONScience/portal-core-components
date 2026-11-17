import React from 'react';

import {
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import DownloadProgressContext from '../DownloadProgressContext';
import DownloadProgressIndicator from '../DownloadProgressIndicator';
import { DOWNLOAD_PROGRESS_TRAY_ID } from '../downloadProgressTray';
import {
  IDownloadProgressService,
  createInitialDownloadProgressState,
} from '../../../service/DownloadProgressService';
import {
  DownloadProgressActions,
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressTracking,
  DownloadSummary,
} from '../../../types/downloadProgress';

const buildSummary = (productName: string): DownloadSummary => ({
  productCode: 'DP1.00001.001',
  productName,
  release: null,
  releaseLabel: 'Latest released and provisional data',
  sites: [],
  dateRange: null,
  dateRangeLabel: null,
  packageType: null,
  includeDocumentation: null,
  includeProvisionalData: null,
  fileCount: null,
  estimatedBytes: 0,
  isEstimateUncompressed: false,
});

interface FakeService {
  service: IDownloadProgressService;
  actions: DownloadProgressActions;
  setState: (update: Partial<DownloadProgressState>) => void;
}

const createFakeService = (initialState: Partial<DownloadProgressState>): FakeService => {
  let state: DownloadProgressState = {
    ...createInitialDownloadProgressState(),
    ...initialState,
  };
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
    actions,
    setState: (update: Partial<DownloadProgressState>) => {
      state = { ...state, ...update };
      listeners.forEach((listener: () => void) => listener());
    },
  };
};

const STREAMING: Partial<DownloadProgressState> = {
  downloadId: 'download-1',
  phase: DownloadProgressPhase.STREAMING,
  tracking: DownloadProgressTracking.LIVE,
  expanded: false,
  summary: buildSummary('2D wind speed and direction'),
  percent: 42,
  etaSeconds: 190,
};

const renderIndicators = (...services: IDownloadProgressService[]) => render(
  <MockTheme>
    {services.map((service: IDownloadProgressService, index: number) => (
      // eslint-disable-next-line react/no-array-index-key
      <DownloadProgressContext.Provider key={index} service={service}>
        <DownloadProgressIndicator />
      </DownloadProgressContext.Provider>
    ))}
  </MockTheme>,
);

const getTray = (): HTMLElement | null => document.getElementById(DOWNLOAD_PROGRESS_TRAY_ID);

describe('DownloadProgressIndicator', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('shows a minimized download in the shared tray', () => {
    const { service, actions } = createFakeService(STREAMING);
    renderIndicators(service);
    const tray = getTray() as HTMLElement;
    expect(tray).not.toBeNull();
    expect(tray.textContent).toContain('2D wind speed and direction');
    expect(tray.textContent).toContain('42% · about 3 minutes left');
    // A tracked download cannot be dismissed
    expect(screen.queryByRole('button', { name: 'Dismiss download' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Show download details' }));
    fireEvent.click(screen.getByRole('button', { name: /^Show download progress for/ }));
    expect(actions.expand).toHaveBeenCalledTimes(2);
  });

  test('stacks the downloads of separate providers in one tray', () => {
    const first = createFakeService(STREAMING);
    const second = createFakeService({
      ...STREAMING,
      downloadId: 'download-2',
      summary: buildSummary('Single aspirated air temperature'),
    });
    const { unmount } = renderIndicators(first.service, second.service);
    const trays = document.querySelectorAll(`#${DOWNLOAD_PROGRESS_TRAY_ID}`);
    expect(trays).toHaveLength(1);
    expect(trays[0].querySelectorAll('[data-selenium="download-progress-indicator"]'))
      .toHaveLength(2);
    unmount();
    // The tray is removed with the last download
    expect(getTray()).toBeNull();
  });

  test('can be dismissed once finished', () => {
    const { service, actions, setState } = createFakeService(STREAMING);
    renderIndicators(service);
    act(() => setState({
      phase: DownloadProgressPhase.COMPLETED,
      tracking: DownloadProgressTracking.CLOSED,
      percent: 100,
    }));
    expect((getTray() as HTMLElement).textContent).toContain('Download complete');
    expect(screen.getByRole('status').textContent)
      .toBe('Download complete: 2D wind speed and direction');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss download' }));
    expect(actions.dismiss).toHaveBeenCalledTimes(1);
  });

  test('can be dismissed when live updates are unavailable', () => {
    const { service, actions } = createFakeService({
      ...STREAMING,
      phase: DownloadProgressPhase.STARTED,
      tracking: DownloadProgressTracking.UNAVAILABLE,
      percent: null,
    });
    renderIndicators(service);
    expect((getTray() as HTMLElement).textContent)
      .toContain('In progress — live updates unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss download' }));
    expect(actions.dismiss).toHaveBeenCalledTimes(1);
  });

  test('is not shown while the download is expanded', () => {
    const { service, setState } = createFakeService({ ...STREAMING, expanded: true });
    renderIndicators(service);
    expect(document.querySelector('[data-selenium="download-progress-indicator"]')).toBeNull();
    act(() => setState({ expanded: false }));
    expect(document.querySelector('[data-selenium="download-progress-indicator"]'))
      .not.toBeNull();
  });
});
