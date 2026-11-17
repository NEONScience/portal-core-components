import React, { act } from 'react';

import {
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import { DownloadProgressDialogView } from '../DownloadProgressDialog';
import { createInitialDownloadProgressState } from '../../../service/DownloadProgressService';
import {
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressTracking,
  DownloadSummary,
} from '../../../types/downloadProgress';
import { saveFailedFilesReport } from '../../../util/downloadReportUtil';

jest.mock('../../../util/downloadReportUtil', () => ({
  ...jest.requireActual<Record<string, unknown>>('../../../util/downloadReportUtil'),
  saveFailedFilesReport: jest.fn(() => true),
}));

const mockedSaveFailedFilesReport = jest.mocked(saveFailedFilesReport);

const SUMMARY: DownloadSummary = {
  productCode: 'DP1.00001.001',
  productName: '2D wind speed and direction',
  release: null,
  releaseLabel: 'Latest released and provisional data',
  sites: ['ABBY', 'BART', 'BLAN', 'CLBJ', 'CPER', 'DCFS', 'DELA', 'DSNY', 'GRSM', 'HARV'],
  dateRange: ['2020-01', '2020-06'],
  dateRangeLabel: 'Jan 2020 - Jun 2020',
  packageType: 'basic',
  includeDocumentation: true,
  includeProvisionalData: false,
  fileCount: null,
  estimatedBytes: 3_400_000_000,
  isEstimateUncompressed: false,
};

const buildState = (update: Partial<DownloadProgressState>): DownloadProgressState => ({
  ...createInitialDownloadProgressState(),
  downloadId: 'download-1',
  summary: SUMMARY,
  expanded: true,
  ...update,
});

const STREAMING_STATE = buildState({
  phase: DownloadProgressPhase.STREAMING,
  tracking: DownloadProgressTracking.LIVE,
  runId: 'run-1',
  sequence: 4,
  zipFileName: 'NEON_wind-2d',
  totalBytes: 1_000_000,
  totalFiles: 380,
  bytesSent: 420_000,
  filesCompleted: 142,
  currentFile: 'NEON.D01.HARV.DP1.00001.001.000.020.002.2DWSD_2min.2020-01.basic.csv',
  elapsedMs: 10_000,
  percent: 42,
  rate: 42_000,
  etaSeconds: 190,
});

const COMPLETED_STATE = buildState({
  phase: DownloadProgressPhase.COMPLETED,
  tracking: DownloadProgressTracking.CLOSED,
  zipFileName: 'NEON_wind-2d',
  totalBytes: 1_000_000,
  totalFiles: 380,
  bytesSent: 990_000,
  bytesSkipped: 10_000,
  filesCompleted: 378,
  filesFailed: 2,
  failedFiles: ['a.csv', 'b.csv'],
  elapsedMs: 120_000,
  percent: 100,
});

interface RenderedDialog {
  onMinimize: jest.Mock<() => void>;
  onDismiss: jest.Mock<() => void>;
}

// Renders the dialog, letting the focus ripple of an initially focused button settle
const renderDialog = async (state: DownloadProgressState): Promise<RenderedDialog> => {
  const onMinimize = jest.fn<() => void>();
  const onDismiss = jest.fn<() => void>();
  await act(async () => {
    render(
      <MockTheme>
        <DownloadProgressDialogView state={state} onMinimize={onMinimize} onDismiss={onDismiss} />
      </MockTheme>,
    );
  });
  return { onMinimize, onDismiss };
};

// Gets the card presenting the text, as rendered by the Card components
const getCard = (text: string): HTMLElement => {
  const card = screen.getByText(text).closest('.MuiCard-root');
  expect(card).toBeTruthy();
  return card as HTMLElement;
};

describe('DownloadProgressDialog', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('presents the progress of a streaming download', async () => {
    await renderDialog(STREAMING_STATE);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Downloading your data' })).toBeTruthy();
    expect(screen.getByText('Your browser is saving NEON_wind-2d.zip.')).toBeTruthy();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('42');
    expect(screen.getByText('142 of 380 files')).toBeTruthy();
    expect(screen.getByText('About 3 minutes remaining')).toBeTruthy();
    expect(screen.getByText('Downloading')).toBeTruthy();
    expect(screen.getByText(STREAMING_STATE.currentFile as string)).toBeTruthy();
    // Summary
    expect(screen.getByText('2D wind speed and direction')).toBeTruthy();
    expect(screen.getByText('Jan 2020 - Jun 2020')).toBeTruthy();
    expect(screen.getByText('+2 more')).toBeTruthy();
    expect(screen.getByText('NEON_wind-2d.zip')).toBeTruthy();
    // Announces milestones rather than every update
    expect(screen.getByRole('status').textContent)
      .toBe('Downloading your data, 25 percent complete');
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue in background' })).toBeTruthy();
    // Nothing calls for attention
    expect(dialog.querySelector('.MuiCard-root')).toBeNull();
  });

  test('presents the title, content and actions in distinct sections', async () => {
    await renderDialog(STREAMING_STATE);
    const dialog = screen.getByRole('dialog');
    const title = dialog.querySelector('.MuiDialogTitle-root') as HTMLElement;
    const content = dialog.querySelector('.MuiDialogContent-dividers') as HTMLElement;
    const actions = dialog.querySelector('.MuiDialogActions-root') as HTMLElement;
    expect(within(title).getByRole('heading', { name: 'Downloading your data' })).toBeTruthy();
    expect(within(title).getByRole('button', { name: 'Minimize download progress' }))
      .toBeTruthy();
    expect(within(content).getByRole('progressbar')).toBeTruthy();
    expect(within(actions).getByRole('button', { name: 'Continue in background' })).toBeTruthy();
    // The dialog is labelled by the heading rather than the whole title section
    const heading = within(title).getByRole('heading', { name: 'Downloading your data' });
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(title.id).not.toBe(heading.id);
  });

  test('minimizes rather than closes while the download is active', async () => {
    const { onMinimize, onDismiss } = await renderDialog(STREAMING_STATE);
    fireEvent.click(screen.getByRole('button', { name: 'Continue in background' }));
    fireEvent.click(screen.getByRole('button', { name: 'Minimize download progress' }));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onMinimize).toHaveBeenCalledTimes(3);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test.each([
    ['an active', STREAMING_STATE],
    ['a completed', COMPLETED_STATE],
  ])('clicking outside the dialog keeps %s download open', async (
    label: string,
    state: DownloadProgressState,
  ) => {
    jest.useFakeTimers();
    const { onMinimize, onDismiss } = await renderDialog(state);
    const container = document.querySelector('.MuiDialog-container') as HTMLElement;
    fireEvent.mouseDown(container);
    fireEvent.click(container);
    // Allows any transition out to finish
    await act(async () => {
      jest.advanceTimersByTime(1_000);
    });
    expect(onMinimize).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  test('closing a completed download dismisses it', async () => {
    const { onMinimize, onDismiss } = await renderDialog(COMPLETED_STATE);
    expect(screen.getByRole('heading', { name: 'Download complete' })).toBeTruthy();
    expect(screen.getByText('Check your browser\'s downloads for NEON_wind-2d.zip.')).toBeTruthy();
    const failedFilesCard = getCard('2 files couldn\'t be included in your download');
    expect(within(failedFilesCard).getByTestId('WarningIcon')).toBeTruthy();
    fireEvent.click(within(failedFilesCard).getByRole('button', { name: 'Show files' }));
    expect(within(failedFilesCard).getByText('a.csv')).toBeTruthy();
    expect(within(failedFilesCard).getByRole('button', { name: 'Hide files' })).toBeTruthy();
    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.click(closeButton);
    // Dismissed once the dialog has transitioned out
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 5000 });
    expect(onMinimize).not.toHaveBeenCalled();
  });

  test('closing a completed download with escape dismisses it', async () => {
    const { onMinimize, onDismiss } = await renderDialog(COMPLETED_STATE);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 5000 });
    expect(onMinimize).not.toHaveBeenCalled();
  });

  test('downloads the list of files that couldn\'t be included', async () => {
    mockedSaveFailedFilesReport.mockClear();
    await renderDialog(COMPLETED_STATE);
    const failedFilesCard = getCard('2 files couldn\'t be included in your download');
    const downloadListButton = within(failedFilesCard).getByRole('button', {
      name: 'Download list of files not included, as JSON',
    });
    expect(downloadListButton.textContent).toBe('Download list');
    fireEvent.click(downloadListButton);
    expect(mockedSaveFailedFilesReport).toHaveBeenCalledTimes(1);
    expect(mockedSaveFailedFilesReport).toHaveBeenCalledWith(COMPLETED_STATE);
  });

  test('offers the list when only the number of files not included is known', async () => {
    await renderDialog(buildState({
      ...COMPLETED_STATE,
      failedFiles: [],
      failedFileDetails: [],
    }));
    const failedFilesCard = getCard('2 files couldn\'t be included in your download');
    expect(within(failedFilesCard).queryByRole('button', { name: 'Show files' })).toBeNull();
    expect(within(failedFilesCard).getByRole('button', {
      name: 'Download list of files not included, as JSON',
    })).toBeTruthy();
  });

  test('does not offer the list while the download is in progress', async () => {
    await renderDialog(buildState({ ...STREAMING_STATE, filesFailed: 2 }));
    expect(screen.queryByRole('button', {
      name: 'Download list of files not included, as JSON',
    })).toBeNull();
  });

  test('presents a failure with an error card', async () => {
    await renderDialog(buildState({
      phase: DownloadProgressPhase.FAILED,
      tracking: DownloadProgressTracking.CLOSED,
      message: 'We couldn\'t prepare your download. Please try again.',
    }));
    expect(screen.getByRole('heading', { name: 'Download failed' })).toBeTruthy();
    expect(screen.getByText('Your download couldn\'t be completed.')).toBeTruthy();
    const errorCard = getCard('We couldn\'t prepare your download. Please try again.');
    expect(within(errorCard).getByTestId('ErrorIcon')).toBeTruthy();
    expect(screen.getByRole('status').textContent)
      .toBe('Download failed. We couldn\'t prepare your download. Please try again.');
    // No progress was made
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  test('presents a failure without a reason', async () => {
    await renderDialog(buildState({
      phase: DownloadProgressPhase.FAILED,
      tracking: DownloadProgressTracking.CLOSED,
    }));
    const errorCard = getCard('Something went wrong with your download. Please try again.');
    expect(within(errorCard).getByTestId('ErrorIcon')).toBeTruthy();
  });

  test('presents an indeterminate download when live updates are unavailable', async () => {
    const { onDismiss } = await renderDialog(buildState({
      phase: DownloadProgressPhase.STARTED,
      tracking: DownloadProgressTracking.UNAVAILABLE,
    }));
    expect(screen.getByRole('heading', { name: 'Download in progress' })).toBeTruthy();
    expect(screen.getByText('Your download continues in your browser.')).toBeTruthy();
    const warningCard = getCard('Live updates are unavailable');
    expect(within(warningCard).getByTestId('WarningIcon')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue in background' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 5000 });
  });

  test.each([
    [
      'reconnecting',
      { ...STREAMING_STATE, tracking: DownloadProgressTracking.RECONNECTING },
      'Reconnecting for live updates…',
    ],
    [
      'stalled',
      { ...STREAMING_STATE, stalled: true },
      'Waiting for data from the server…',
    ],
    [
      'canceled',
      buildState({
        phase: DownloadProgressPhase.CANCELED,
        tracking: DownloadProgressTracking.CLOSED,
      }),
      'Your download may have been canceled in your browser, or the connection was lost.',
    ],
  ])('presents a warning card for a %s download', async (
    label: string,
    state: DownloadProgressState,
    title: string,
  ) => {
    await renderDialog(state);
    const warningCard = getCard(title);
    expect(within(warningCard).getByTestId('WarningIcon')).toBeTruthy();
  });

  test('presents a download that is being prepared', async () => {
    await renderDialog(buildState({
      phase: DownloadProgressPhase.PREPARING,
      tracking: DownloadProgressTracking.LIVE,
    }));
    expect(screen.getByRole('heading', { name: 'Preparing your download' })).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });

  test('presents connecting for live updates as a hint', async () => {
    await renderDialog(buildState({
      phase: DownloadProgressPhase.STARTED,
      tracking: DownloadProgressTracking.CONNECTING,
    }));
    expect(screen.getByText('Connecting for live updates…')).toBeTruthy();
    expect(screen.getByText('Connecting for live updates…').closest('.MuiCard-root')).toBeNull();
  });

  test('renders nothing while minimized', async () => {
    await renderDialog({ ...STREAMING_STATE, expanded: false });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
