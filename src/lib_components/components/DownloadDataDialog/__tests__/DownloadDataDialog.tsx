import React, { act } from 'react';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';

import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';
import DownloadProgressContext from '../../DownloadProgress/DownloadProgressContext';
import NeonAuthContext from '../../NeonContext/NeonAuthContext';
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
import { downloadManifest } from '../../../util/manifestUtil';

import MockTheme from '../../../../__mocks__/MockTheme';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';
import DownloadDataDialog from '../DownloadDataDialog';

jest.mock('@material-table/core', () => mockReactComponent('@material-table/core'));
jest.mock('../../../util/manifestUtil', () => ({
  ...jest.requireActual<Record<string, unknown>>('../../../util/manifestUtil'),
  downloadManifest: jest.fn(),
  downloadAopManifest: jest.fn(),
}));

const mockedDownloadManifest = jest.mocked(downloadManifest);
const { reset: resetRegistry } = getTestableItems() as { reset: () => void };
const { DEFAULT_STATE, DOWNLOAD_STATUS } = DownloadDataContext;

const SESSION_HEADERS: Record<string, string> = { 'some-header': 'value' };

const DOWNLOADABLE_STATE = {
  ...DEFAULT_STATE,
  dialogOpen: true,
  downloadStatus: DOWNLOAD_STATUS.ALLOW_DOWNLOAD,
  fromManifest: true,
  allStepsComplete: true,
  requiredSteps: [],
  productData: {
    productCode: 'DP1.00001.001',
    productName: '2D wind speed and direction',
  },
  manifest: {
    status: 'fetched',
    sizeEstimate: 1000,
    body: { data: { mimeType: 'application/zip' } },
  },
};

interface FakeService {
  service: IDownloadProgressService;
  start: jest.Mock<DownloadProgressActions['start']>;
  expand: jest.Mock<DownloadProgressActions['expand']>;
}

const createFakeService = (phase: DownloadProgressPhase = DownloadProgressPhase.IDLE): FakeService => {
  const state: DownloadProgressState = { ...createInitialDownloadProgressState(), phase };
  const start = jest.fn<DownloadProgressActions['start']>(() => 'started');
  const expand = jest.fn<DownloadProgressActions['expand']>();
  const actions: DownloadProgressActions = {
    start,
    expand,
    minimize: jest.fn<DownloadProgressActions['minimize']>(),
    dismiss: jest.fn<DownloadProgressActions['dismiss']>(() => true),
  };
  const service: IDownloadProgressService = {
    subscribe: () => () => {},
    getSnapshot: () => state,
    actions,
    ...actions,
    attach: jest.fn(),
    dispose: jest.fn(),
  };
  return { service, start, expand };
};

const renderDialog = async (service: IDownloadProgressService): Promise<void> => {
  await act(async () => {
    render(
      <MockTheme>
        <DownloadProgressContext.Provider service={service}>
          <DownloadDataDialog />
        </DownloadProgressContext.Provider>
      </MockTheme>,
    );
  });
};

const getButton = (name: string): HTMLButtonElement => (
  screen.getByRole('button', { name }) as HTMLButtonElement
);

describe('DownloadDataDialog', () => {
  const ORIGINAL_ENV = process.env;
  let sessionHeaders: Record<string, string>;
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_NEON_AUTH_DISABLE_SESSION;
    sessionHeaders = SESSION_HEADERS;
    resetRegistry();
    mockedDownloadManifest.mockReset();
    jest.spyOn(DownloadDataContext, 'useDownloadDataState')
      .mockReturnValue([{ ...DOWNLOADABLE_STATE }, jest.fn()] as any);
    jest.spyOn(NeonAuthContext, 'useNeonAuthContextSessionState').mockImplementation(() => ({
      enabled: true,
      ready: true,
      authenticated: true,
      accountValidated: true,
      accountValidationSteps: [],
      canAccessData: true,
      sessionHeaders,
    } as any));
  });
  afterEach(() => {
    // Unmounts before resetting what the dialog subscribes to, and restoring its mocked hooks
    cleanup();
    process.env = ORIGINAL_ENV;
    resetRegistry();
    jest.restoreAllMocks();
  });

  test('submits the download directly when download progress is disabled', async () => {
    const { service, start } = createFakeService();
    await renderDialog(service);
    fireEvent.click(getButton('Download Data'));
    expect(start).not.toHaveBeenCalled();
    expect(mockedDownloadManifest).toHaveBeenCalledTimes(1);
    expect(mockedDownloadManifest).toHaveBeenCalledWith(
      expect.anything(),
      SESSION_HEADERS,
      undefined,
    );
  });

  test('starts a tracked download without an API token configured', async () => {
    process.env.NEXT_PUBLIC_NEON_DOWNLOAD_ENABLE_PROGRESS = 'true';
    const { service, start } = createFakeService();
    await renderDialog(service);
    fireEvent.click(getButton('Download Data'));
    expect(mockedDownloadManifest).not.toHaveBeenCalled();
    expect(start).toHaveBeenCalledTimes(1);
    const options = start.mock.calls[0][0];
    expect(options.sessionHeaders).toEqual(SESSION_HEADERS);
    expect(options.summary.productCode).toBe('DP1.00001.001');
    expect(options.summary.productName).toBe('2D wind speed and direction');
    expect(options.summary.estimatedBytes).toBe(1000);
    options.submit({ downloadId: 'download-1', target: 'frame-1' });
    expect(mockedDownloadManifest).toHaveBeenCalledWith(
      expect.anything(),
      { ...SESSION_HEADERS, downloadId: 'download-1' },
      { target: 'frame-1' },
    );
  });

  test('submits the download directly without a session token', async () => {
    process.env.NEXT_PUBLIC_NEON_DOWNLOAD_ENABLE_PROGRESS = 'true';
    sessionHeaders = {};
    const { service, start } = createFakeService();
    await renderDialog(service);
    fireEvent.click(getButton('Download Data'));
    expect(start).not.toHaveBeenCalled();
    expect(mockedDownloadManifest).toHaveBeenCalledTimes(1);
    expect(mockedDownloadManifest).toHaveBeenCalledWith(
      expect.anything(),
      {},
      undefined,
    );
  });

  test('disables downloading while a download of the product is in progress', async () => {
    process.env.NEXT_PUBLIC_NEON_DOWNLOAD_ENABLE_PROGRESS = 'true';
    const { service, expand } = createFakeService(DownloadProgressPhase.STREAMING);
    await renderDialog(service);
    expect(getButton('Download in progress').disabled).toBe(true);
    expect(screen.getByText('A download of this data product is in progress.')).toBeTruthy();
    fireEvent.click(getButton('View progress'));
    expect(expand).toHaveBeenCalledTimes(1);
  });

  test('disables downloading when the page download limit is reached', async () => {
    process.env.NEXT_PUBLIC_NEON_DOWNLOAD_ENABLE_PROGRESS = 'true';
    DownloadProgressRegistry.tryAcquire('a');
    DownloadProgressRegistry.tryAcquire('b');
    DownloadProgressRegistry.tryAcquire('c');
    const { service, start } = createFakeService();
    await renderDialog(service);
    const button = getButton('Download limit reached');
    expect(button.disabled).toBe(true);
    const limitTitle = screen.getByText(/^Up to 3 downloads can run at once/);
    const limitCard = limitTitle.closest('.MuiCard-root') as HTMLElement;
    expect(limitCard).toBeTruthy();
    expect(within(limitCard).getByTestId('WarningIcon')).toBeTruthy();
    expect(within(limitCard).getByText(/^Wait for one to finish/)).toBeTruthy();
    fireEvent.click(button);
    expect(start).not.toHaveBeenCalled();
  });

  test('ignores the download limit when download progress is disabled', async () => {
    DownloadProgressRegistry.tryAcquire('a');
    DownloadProgressRegistry.tryAcquire('b');
    DownloadProgressRegistry.tryAcquire('c');
    const { service } = createFakeService();
    await renderDialog(service);
    expect(getButton('Download Data').disabled).toBe(false);
  });
});
