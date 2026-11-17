import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  NEVER,
  Observable,
  of,
  throwError,
} from 'rxjs';

import {
  DOWNLOAD_FRAME_NAME_PREFIX,
  DOWNLOAD_PROGRESS_TIMING,
  DownloadFrameInspection,
  DownloadProgressServiceDeps,
  DownloadProgressSocket,
  IDownloadProgressService,
  createDownloadProgressService,
  parseTicketResponse,
} from '../DownloadProgressService';
import DownloadProgressRegistry, { getTestableItems } from '../DownloadProgressRegistry';
import NeonApi from '../../components/NeonApi/NeonApi';
import { Nullable } from '../../types/core';
import {
  DownloadProgressPhase,
  DownloadProgressTicket,
  DownloadProgressTracking,
  DownloadSubmitOptions,
  DownloadSummary,
} from '../../types/downloadProgress';

// The API is frozen, so the ticket request is mocked through the module
jest.mock('../../components/NeonApi/NeonApi', () => {
  const actual = jest.requireActual<{ default: object }>('../../components/NeonApi/NeonApi');
  return {
    __esModule: true,
    default: { ...actual.default, postJsonObservable: jest.fn() },
  };
});

const { reset: resetRegistry } = getTestableItems() as { reset: () => void };

const setServerData = (serverData: Nullable<Record<string, string>>): void => {
  const win = window as unknown as Record<string, unknown>;
  if (serverData) {
    win.NEON_SERVER_DATA = serverData;
  } else {
    delete win.NEON_SERVER_DATA;
  }
};

class FakeSocket implements DownloadProgressSocket {
  static instances: FakeSocket[] = [];

  url: string;

  onopen: Nullable<(event: Event) => void> = null;

  onmessage: Nullable<(event: MessageEvent) => void> = null;

  onclose: Nullable<(event: CloseEvent) => void> = null;

  onerror: Nullable<(event: Event) => void> = null;

  closed = false;

  closeCode: Nullable<number> = null;

  // Messages sent by the client
  sent: string[] = [];

  failSend = false;

  constructor(url: string) {
    this.url = url;
    FakeSocket.instances.push(this);
  }

  send(data: string): void {
    if (this.failSend) throw new Error('Not open');
    this.sent.push(data);
  }

  close(code?: number): void {
    this.closed = true;
    this.closeCode = code;
  }

  open(): void {
    if (this.onopen) this.onopen(new Event('open'));
  }

  // Delivers a message from the server
  receive(data: unknown): void {
    if (this.onmessage) this.onmessage({ data: JSON.stringify(data) } as MessageEvent);
  }

  serverClose(code: number): void {
    if (this.onclose) this.onclose({ code } as CloseEvent);
  }
}

const latestSocket = (): FakeSocket => FakeSocket.instances[FakeSocket.instances.length - 1];

const SUMMARY: DownloadSummary = {
  productCode: 'DP1.00001.001',
  productName: 'Product name',
  release: null,
  releaseLabel: 'Latest released and provisional data',
  sites: ['ABBY'],
  dateRange: ['2020-01', '2020-02'],
  dateRangeLabel: 'Jan 2020 - Feb 2020',
  packageType: 'basic',
  includeDocumentation: true,
  includeProvisionalData: false,
  fileCount: null,
  estimatedBytes: 1000,
  isEstimateUncompressed: false,
};

const SESSION_HEADERS = { 'some-header': 'value' };

const ticketFor = (downloadId: string): DownloadProgressTicket => ({
  ticket: `ticket-for-${downloadId}`,
  downloadId,
  expiresInSeconds: 30,
});

type TicketRequest = (
  downloadId: string,
  sessionHeaders: Record<string, string>,
) => Observable<DownloadProgressTicket>;

interface TestContext {
  service: IDownloadProgressService;
  submit: jest.Mock<(options: DownloadSubmitOptions) => void>;
  requestTicket: jest.Mock<TicketRequest>;
  inspectFrame: jest.Mock<(frame: HTMLIFrameElement) => DownloadFrameInspection>;
}

let idCounter = 0;

const setup = (overrides: Partial<DownloadProgressServiceDeps> = {}): TestContext => {
  const submit = jest.fn<(options: DownloadSubmitOptions) => void>();
  const requestTicket = jest.fn<TicketRequest>((downloadId: string) => of(ticketFor(downloadId)));
  const inspectFrame = jest.fn<(frame: HTMLIFrameElement) => DownloadFrameInspection>(
    () => ({ blank: true, detail: null }),
  );
  const service = createDownloadProgressService({
    WebSocketCtor: FakeSocket,
    buildWebSocketUrl: (ticket: string) => `wss://test-host.example.org/ws?ticket=${ticket}`,
    requestTicket,
    inspectFrame,
    random: () => 0.5,
    generateId: () => {
      idCounter += 1;
      return `download-${idCounter}`;
    },
    ...overrides,
  });
  service.attach();
  return {
    service,
    submit,
    requestTicket,
    inspectFrame,
  };
};

const startDownload = (context: TestContext): string => {
  expect(context.service.start({
    summary: SUMMARY,
    sessionHeaders: SESSION_HEADERS,
    submit: context.submit,
  })).toBe('started');
  return context.service.getSnapshot().downloadId as string;
};

// Starts a download that becomes live
const startLiveDownload = (context: TestContext): string => {
  const downloadId = startDownload(context);
  latestSocket().open();
  latestSocket().receive({ type: 'READY', downloadId });
  return downloadId;
};

const progress = (downloadId: string, sequence: number, fields: Record<string, unknown>) => ({
  type: 'PROGRESS',
  downloadId,
  runId: 'run-1',
  sequence,
  ...fields,
});

const getFrames = (): HTMLIFrameElement[] => Array.from(document.querySelectorAll('iframe'));

describe('DownloadProgressService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetRegistry();
    FakeSocket.instances = [];
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    setServerData(null);
    document.body.innerHTML = '';
  });

  test('parses the ticket response', () => {
    expect(parseTicketResponse(
      { data: { ticket: 'abc', downloadId: 'id', expiresInSeconds: 30 } },
      'id',
    )).toEqual({ ticket: 'abc', downloadId: 'id', expiresInSeconds: 30 });
    expect(() => parseTicketResponse({ data: {} }, 'id')).toThrow();
    expect(() => parseTicketResponse(null, 'id')).toThrow();
  });

  test('submits into the download frame with the download id once ready', () => {
    const context = setup();
    const downloadId = startDownload(context);
    let state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.CONNECTING);
    expect(state.tracking).toBe(DownloadProgressTracking.CONNECTING);
    expect(state.expanded).toBe(true);
    expect(state.summary).toBe(SUMMARY);
    expect(context.requestTicket).toHaveBeenCalledWith(downloadId, SESSION_HEADERS);
    expect(latestSocket().url).toBe(
      `wss://test-host.example.org/ws?ticket=ticket-for-${downloadId}`,
    );
    expect(context.submit).not.toHaveBeenCalled();
    latestSocket().open();
    latestSocket().receive({ type: 'READY', downloadId });
    expect(context.submit).toHaveBeenCalledTimes(1);
    expect(context.submit).toHaveBeenCalledWith({
      downloadId,
      target: `${DOWNLOAD_FRAME_NAME_PREFIX}${downloadId}`,
    });
    const frames = getFrames();
    expect(frames).toHaveLength(1);
    expect(frames[0].name).toBe(`${DOWNLOAD_FRAME_NAME_PREFIX}${downloadId}`);
    state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.STARTED);
    expect(state.tracking).toBe(DownloadProgressTracking.LIVE);
    expect(DownloadProgressRegistry.isHeld(downloadId)).toBe(true);
  });

  test('requests the ticket', () => {
    const postJsonObservable = jest.mocked(NeonApi.postJsonObservable);
    postJsonObservable.mockReturnValue(
      of({ response: { data: { ticket: 'ticket-1', expiresInSeconds: 30 } } }) as ReturnType<
        typeof NeonApi.postJsonObservable
      >,
    );
    const service = createDownloadProgressService({
      WebSocketCtor: FakeSocket,
      buildWebSocketUrl: (ticket: string) => `wss://test-host.example.org/ws?ticket=${ticket}`,
      generateId: () => 'download-ticket',
    });
    expect(service.start({
      summary: SUMMARY,
      sessionHeaders: SESSION_HEADERS,
      submit: jest.fn<(options: DownloadSubmitOptions) => void>(),
    })).toBe('started');
    expect(postJsonObservable).toHaveBeenCalledWith(
      expect.any(String),
      { downloadId: 'download-ticket' },
      SESSION_HEADERS,
      false,
    );
    expect(latestSocket().url).toBe('wss://test-host.example.org/ws?ticket=ticket-1');
    service.dispose();
  });

  test('authenticates the connection', () => {
    setServerData({ NeonPublicAPITokenHeader: 'some-header', NeonPublicAPIToken: 'some-value' });
    const context = setup();
    const downloadId = startDownload(context);
    const socket = latestSocket();
    expect(socket.sent).toHaveLength(0);
    socket.open();
    // Sent first, as the headers of a STOMP CONNECT frame would be
    expect(socket.sent).toHaveLength(1);
    expect(JSON.parse(socket.sent[0])).toEqual({
      type: 'CONNECT',
      headers: { 'some-header': 'value' },
    });
    // Live once the server has verified the connection
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.CONNECTING);
    socket.receive({ type: 'READY', downloadId });
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.LIVE);
    expect(socket.sent).toHaveLength(1);
  });

  test('waits for the server to be ready from when the connection is authenticated', () => {
    const context = setup();
    startDownload(context);
    const socket = latestSocket();
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.OPEN_TIMEOUT_MS - 1);
    socket.open();
    expect(socket.sent).toHaveLength(1);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.READY_TIMEOUT_MS - 1);
    expect(socket.closed).toBe(false);
    jest.advanceTimersByTime(1);
    expect(socket.closed).toBe(true);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
  });

  test('reconnects when the connection can\'t be authenticated', () => {
    const context = setup();
    startDownload(context);
    const socket = latestSocket();
    socket.failSend = true;
    socket.open();
    expect(socket.closed).toBe(true);
    expect(context.submit).toHaveBeenCalledTimes(1);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0]);
    expect(context.requestTicket).toHaveBeenCalledTimes(2);
  });

  test('applies progress snapshots, closing the socket and releasing the slot when complete', () => {
    const context = setup();
    const downloadId = startLiveDownload(context);
    const socket = latestSocket();
    socket.receive(progress(downloadId, 1, { status: 'PREPARING' }));
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.PREPARING);
    expect(context.service.getSnapshot().percent).toBeNull();
    socket.receive(progress(downloadId, 2, {
      status: 'STREAMING',
      zipFileName: 'NEON_par',
      totalBytes: 1000,
      totalFiles: 4,
      bytesSent: 0,
      elapsedMs: 0,
    }));
    socket.receive(progress(downloadId, 3, {
      status: 'STREAMING',
      totalBytes: 1000,
      totalFiles: 4,
      bytesSent: 500,
      filesCompleted: 2,
      currentFile: 'file-3.csv',
      elapsedMs: 4000,
    }));
    let state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.STREAMING);
    expect(state.zipFileName).toBe('NEON_par');
    expect(state.percent).toBe(50);
    expect(state.currentFile).toBe('file-3.csv');
    expect(state.rate).toBe(125);
    expect(state.etaSeconds).toBe(4);
    // Duplicate and stale messages, and messages for another run, are dropped
    socket.receive(progress(downloadId, 3, { status: 'STREAMING', bytesSent: 10 }));
    socket.receive(progress(downloadId, 2, { status: 'STREAMING', bytesSent: 10 }));
    socket.receive({ ...progress(downloadId, 9, { status: 'STREAMING', bytesSent: 10 }), runId: 'x' });
    expect(context.service.getSnapshot().bytesSent).toBe(500);
    socket.receive(progress(downloadId, 4, {
      status: 'COMPLETED',
      totalBytes: 1000,
      totalFiles: 4,
      bytesSent: 900,
      bytesSkipped: 100,
      filesCompleted: 3,
      filesFailed: 1,
      failedFiles: ['file-4.csv'],
      elapsedMs: 8000,
    }));
    state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.COMPLETED);
    expect(state.percent).toBe(100);
    expect(state.tracking).toBe(DownloadProgressTracking.CLOSED);
    expect(state.failedFiles).toEqual(['file-4.csv']);
    expect(socket.closed).toBe(true);
    expect(socket.closeCode).toBe(1000);
    expect(DownloadProgressRegistry.isHeld(downloadId)).toBe(false);
    // The frame remains until the download is dismissed
    expect(getFrames()).toHaveLength(1);
    expect(context.service.dismiss()).toBe(true);
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.IDLE);
    expect(getFrames()).toHaveLength(0);
  });

  test('records when the download started and finished, and the files not included', () => {
    const context = setup({ getPublicApiRoot: () => 'https://test-host.example.org/api/v0' });
    const startedAt = Date.now();
    const downloadId = startLiveDownload(context);
    expect(context.service.getSnapshot().startedAt).toBe(startedAt);
    latestSocket().receive(progress(downloadId, 1, { status: 'STREAMING', filesFailed: 1 }));
    expect(context.service.getSnapshot().failedFileDetails).toEqual([]);
    expect(context.service.getSnapshot().finishedAt).toBeNull();
    latestSocket().receive(progress(downloadId, 2, {
      status: 'COMPLETED',
      filesFailed: 3,
      timestamp: startedAt + 5000,
      failedFiles: ['file.csv', 'private/path/file.csv'],
      failedFileDetails: [
        {
          fileName: 'NEON.D01.HARV.DP1.00001.001.2020-01.basic.csv',
          type: 'DATA',
          siteCode: 'HARV',
          month: '2020-01',
          sizeBytes: 2000,
          url: 'https://test-host.example.org/api/v0/data/DP1.00001.001/HARV/2020-01/file.csv',
          reason: 'SIGNING_FAILED',
          unexpected: 'ignored',
        },
        'not a file',
        { fileName: 'readme.txt', sizeBytes: 'unknown', reason: 'NOT_FOUND' },
        {
          fileName: 'invalid.csv',
          url: 'https://storage.example/invalid.csv?X-Some-Param=invalid',
          reason: 'Connection refused',
        },
      ],
    }));
    const state = context.service.getSnapshot();
    expect(state.finishedAt).toBe(startedAt + 5000);
    expect(state.failedFiles).toEqual(['file.csv']);
    const expectedEmpty = {
      fileName: null,
      type: null,
      description: null,
      productCode: null,
      siteCode: null,
      month: null,
      release: null,
      packageType: null,
      sizeBytes: null,
      checksum: null,
      checksumAlgorithm: null,
      url: null,
    };
    expect(state.failedFileDetails).toEqual([
      {
        ...expectedEmpty,
        fileName: 'NEON.D01.HARV.DP1.00001.001.2020-01.basic.csv',
        type: 'DATA',
        siteCode: 'HARV',
        month: '2020-01',
        sizeBytes: 2000,
        url: 'https://test-host.example.org/api/v0/data/DP1.00001.001/HARV/2020-01/file.csv',
        reason: 'SIGNING_FAILED',
      },
      { ...expectedEmpty, fileName: 'readme.txt', reason: 'NOT_FOUND' },
      // A storage location and a reason that isn't a known category are never kept
      { ...expectedEmpty, fileName: 'invalid.csv', reason: 'UNKNOWN' },
    ]);
  });

  test('records when a download failed to start', () => {
    const inspectFrame = jest.fn<(frame: HTMLIFrameElement) => DownloadFrameInspection>(
      () => ({ blank: false, detail: 'Access Denied' }),
    );
    const context = setup({ inspectFrame });
    startLiveDownload(context);
    getFrames()[0].dispatchEvent(new Event('load'));
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.FRAME_FAILURE_GRACE_MS);
    const state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.FAILED);
    expect(state.finishedAt).toBe(Date.now());
    expect(state.failedFileDetails).toEqual([]);
  });

  test('submits by the deadline when live progress is slow to connect', () => {
    const requestTicket = jest.fn<TicketRequest>(() => NEVER);
    const context = setup({ requestTicket });
    const downloadId = startDownload(context);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.SUBMIT_DEADLINE_MS - 1);
    expect(context.submit).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(context.submit).toHaveBeenCalledWith({
      downloadId,
      target: `${DOWNLOAD_FRAME_NAME_PREFIX}${downloadId}`,
    });
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.STARTED);
    // The ticket request times out and is retried
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.TICKET_TIMEOUT_MS);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0]);
    expect(requestTicket).toHaveBeenCalledTimes(2);
  });

  test('submits immediately when the ticket fails, then restores live progress', () => {
    const requestTicket = jest.fn<TicketRequest>()
      .mockImplementationOnce(() => throwError(() => ({ status: 503 })))
      .mockImplementation((downloadId: string) => of(ticketFor(downloadId)));
    const context = setup({ requestTicket });
    const downloadId = startDownload(context);
    expect(context.submit).toHaveBeenCalledTimes(1);
    let state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.STARTED);
    expect(state.tracking).toBe(DownloadProgressTracking.RECONNECTING);
    expect(state.percent).toBeNull();
    expect(FakeSocket.instances).toHaveLength(0);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0]);
    expect(requestTicket).toHaveBeenCalledTimes(2);
    expect(requestTicket).toHaveBeenLastCalledWith(downloadId, SESSION_HEADERS);
    latestSocket().open();
    // A connection made after the download started receives the latest snapshot
    latestSocket().receive(progress(downloadId, 7, {
      status: 'STREAMING',
      totalBytes: 1000,
      bytesSent: 250,
      elapsedMs: 2000,
    }));
    state = context.service.getSnapshot();
    expect(state.tracking).toBe(DownloadProgressTracking.LIVE);
    expect(state.phase).toBe(DownloadProgressPhase.STREAMING);
    expect(state.percent).toBe(25);
    expect(context.submit).toHaveBeenCalledTimes(1);
  });

  test('stops tracking without retrying when the ticket is refused', () => {
    const requestTicket = jest.fn<TicketRequest>(() => throwError(() => ({ status: 404 })));
    const context = setup({ requestTicket });
    const downloadId = startDownload(context);
    expect(context.submit).toHaveBeenCalledTimes(1);
    const state = context.service.getSnapshot();
    expect(state.tracking).toBe(DownloadProgressTracking.UNAVAILABLE);
    expect(state.phase).toBe(DownloadProgressPhase.STARTED);
    jest.advanceTimersByTime(60_000);
    expect(requestTicket).toHaveBeenCalledTimes(1);
    // The download may still be running, so its slot is held until dismissed
    expect(DownloadProgressRegistry.isHeld(downloadId)).toBe(true);
    expect(context.service.dismiss()).toBe(true);
    expect(DownloadProgressRegistry.isHeld(downloadId)).toBe(false);
  });

  test('submits when the socket fails to connect', () => {
    const context = setup();
    startDownload(context);
    latestSocket().serverClose(1006);
    expect(context.submit).toHaveBeenCalledTimes(1);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
  });

  test('submits when ready is not received in time', () => {
    const context = setup();
    startDownload(context);
    latestSocket().open();
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.SUBMIT_DEADLINE_MS);
    expect(context.submit).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(
      DOWNLOAD_PROGRESS_TIMING.READY_TIMEOUT_MS - DOWNLOAD_PROGRESS_TIMING.SUBMIT_DEADLINE_MS,
    );
    expect(latestSocket().closed).toBe(true);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
  });

  test('reconnects with a fresh ticket for the same download after an unexpected close', () => {
    const context = setup();
    const downloadId = startLiveDownload(context);
    latestSocket().receive(progress(downloadId, 1, {
      status: 'STREAMING',
      totalBytes: 1000,
      bytesSent: 100,
      elapsedMs: 1000,
    }));
    latestSocket().serverClose(1006);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    // Progress is kept while reconnecting
    expect(context.service.getSnapshot().percent).toBe(10);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0]);
    expect(context.requestTicket).toHaveBeenCalledTimes(2);
    expect(context.requestTicket).toHaveBeenLastCalledWith(downloadId, SESSION_HEADERS);
    expect(FakeSocket.instances).toHaveLength(2);
    latestSocket().open();
    latestSocket().receive(progress(downloadId, 2, {
      status: 'STREAMING',
      totalBytes: 1000,
      bytesSent: 600,
      elapsedMs: 3000,
    }));
    const state = context.service.getSnapshot();
    expect(state.tracking).toBe(DownloadProgressTracking.LIVE);
    expect(state.percent).toBe(60);
    expect(context.submit).toHaveBeenCalledTimes(1);
  });

  test('reconnects when no frames are received before the watchdog', () => {
    const context = setup();
    startLiveDownload(context);
    const socket = latestSocket();
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.WATCHDOG_TIMEOUT_MS - 1);
    socket.receive({ type: 'HEARTBEAT', timestamp: 1 });
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.WATCHDOG_TIMEOUT_MS - 1);
    expect(socket.closed).toBe(false);
    jest.advanceTimersByTime(1);
    expect(socket.closed).toBe(true);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0]);
    expect(context.requestTicket).toHaveBeenCalledTimes(2);
  });

  test.each([4400, 4401, 4403, 4408])('stops reconnecting when closed with %p', (code: number) => {
    const context = setup();
    startLiveDownload(context);
    latestSocket().serverClose(code);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.UNAVAILABLE);
    jest.advanceTimersByTime(5 * 60_000);
    expect(context.requestTicket).toHaveBeenCalledTimes(1);
  });

  test('keeps the download running when the session expires while streaming', () => {
    const context = setup();
    const downloadId = startLiveDownload(context);
    latestSocket().receive(progress(downloadId, 1, {
      status: 'STREAMING',
      totalBytes: 1000,
      bytesSent: 100,
      elapsedMs: 1000,
    }));
    // The server closes the connection once it no longer verifies the session
    latestSocket().serverClose(4401);
    jest.advanceTimersByTime(5 * 60_000);
    const state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.STREAMING);
    expect(state.tracking).toBe(DownloadProgressTracking.UNAVAILABLE);
    expect(state.message).toBeNull();
    expect(state.percent).toBe(10);
    expect(context.submit).toHaveBeenCalledTimes(1);
    // The download continues in its frame, which is kept even once dismissed
    expect(getFrames()).toHaveLength(1);
    expect(getFrames()[0].name).toBe(`${DOWNLOAD_FRAME_NAME_PREFIX}${downloadId}`);
    expect(context.service.dismiss()).toBe(true);
    expect(getFrames()).toHaveLength(1);
  });

  test('keeps the download running when reconnecting is refused once the session expires', () => {
    const requestTicket = jest.fn<TicketRequest>()
      .mockImplementationOnce((downloadId: string) => of(ticketFor(downloadId)))
      .mockImplementation(() => throwError(() => ({ status: 401 })));
    const context = setup({ requestTicket });
    const downloadId = startLiveDownload(context);
    latestSocket().receive(progress(downloadId, 1, {
      status: 'STREAMING',
      totalBytes: 1000,
      bytesSent: 100,
      elapsedMs: 1000,
    }));
    latestSocket().serverClose(1006);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0] * 2);
    expect(requestTicket).toHaveBeenCalledTimes(2);
    const state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.STREAMING);
    expect(state.tracking).toBe(DownloadProgressTracking.UNAVAILABLE);
    expect(state.percent).toBe(10);
    expect(context.submit).toHaveBeenCalledTimes(1);
    expect(getFrames()).toHaveLength(1);
  });

  test('reconnects with the normal backoff when verifying the connection is unavailable', () => {
    const context = setup();
    startLiveDownload(context);
    latestSocket().serverClose(1013);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[0] - 1);
    expect(context.requestTicket).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1);
    expect(context.requestTicket).toHaveBeenCalledTimes(2);
  });

  test('reconnects with the maximum backoff when there are too many connections', () => {
    const context = setup();
    startLiveDownload(context);
    latestSocket().serverClose(4429);
    const maxBackoffMs = DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS[
      DOWNLOAD_PROGRESS_TIMING.RECONNECT_BACKOFF_MS.length - 1
    ];
    jest.advanceTimersByTime(maxBackoffMs - 1);
    expect(context.requestTicket).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1);
    expect(context.requestTicket).toHaveBeenCalledTimes(2);
  });

  test('pauses reconnecting while offline and resumes when back online', () => {
    const navigatorState = { onLine: true };
    const fakeWindow = Object.assign(new EventTarget(), { navigator: navigatorState });
    const context = setup({ getWindow: () => fakeWindow as unknown as Window });
    startLiveDownload(context);
    navigatorState.onLine = false;
    latestSocket().serverClose(1006);
    jest.advanceTimersByTime(5 * 60_000);
    expect(context.requestTicket).toHaveBeenCalledTimes(1);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    navigatorState.onLine = true;
    fakeWindow.dispatchEvent(new Event('online'));
    expect(context.requestTicket).toHaveBeenCalledTimes(2);
  });

  test('flags a stall when no data is processed for a while', () => {
    const context = setup();
    const downloadId = startLiveDownload(context);
    const socket = latestSocket();
    socket.receive(progress(downloadId, 1, { status: 'STREAMING', bytesSent: 100, elapsedMs: 1 }));
    jest.advanceTimersByTime(30_000);
    // Heartbeats keep the connection alive but do not reset the stall
    socket.receive({ type: 'HEARTBEAT' });
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.STALL_TIMEOUT_MS - 30_000 - 1);
    expect(context.service.getSnapshot().stalled).toBe(false);
    jest.advanceTimersByTime(1);
    expect(context.service.getSnapshot().stalled).toBe(true);
    socket.receive(progress(downloadId, 2, { status: 'STREAMING', bytesSent: 200, elapsedMs: 2 }));
    expect(context.service.getSnapshot().stalled).toBe(false);
  });

  test('gives up on live progress after failing to reconnect for too long', () => {
    const requestTicket = jest.fn<TicketRequest>(() => throwError(() => ({ status: 503 })));
    const context = setup({ requestTicket });
    startDownload(context);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.RECONNECTING);
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.GIVE_UP_AFTER_MS + 60_000);
    expect(context.service.getSnapshot().tracking).toBe(DownloadProgressTracking.UNAVAILABLE);
    const callCount = requestTicket.mock.calls.length;
    jest.advanceTimersByTime(5 * 60_000);
    expect(requestTicket).toHaveBeenCalledTimes(callCount);
  });

  test('fails when the download frame loads an error response', () => {
    const inspectFrame = jest.fn<(frame: HTMLIFrameElement) => DownloadFrameInspection>(
      () => ({ blank: false, detail: 'Access Denied' }),
    );
    const context = setup({ inspectFrame });
    startLiveDownload(context);
    getFrames()[0].dispatchEvent(new Event('load'));
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.FRAME_FAILURE_GRACE_MS - 1);
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.STARTED);
    jest.advanceTimersByTime(1);
    const state = context.service.getSnapshot();
    expect(state.phase).toBe(DownloadProgressPhase.FAILED);
    expect(state.message).toContain('Access Denied');
    expect(latestSocket().closed).toBe(true);
  });

  test('ignores the download frame loading once the download is streaming', () => {
    const inspectFrame = jest.fn<(frame: HTMLIFrameElement) => DownloadFrameInspection>(
      () => ({ blank: false, detail: null }),
    );
    const context = setup({ inspectFrame });
    const downloadId = startLiveDownload(context);
    getFrames()[0].dispatchEvent(new Event('load'));
    latestSocket().receive(progress(downloadId, 1, { status: 'STREAMING', bytesSent: 1 }));
    jest.advanceTimersByTime(DOWNLOAD_PROGRESS_TIMING.FRAME_FAILURE_GRACE_MS);
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.STREAMING);
  });

  test('expands, minimizes and only dismisses downloads that are no longer tracked', () => {
    const context = setup();
    const downloadId = startLiveDownload(context);
    context.service.minimize();
    expect(context.service.getSnapshot().expanded).toBe(false);
    expect(context.service.dismiss()).toBe(false);
    context.service.expand();
    expect(context.service.getSnapshot().expanded).toBe(true);
    latestSocket().receive(progress(downloadId, 1, { status: 'FAILED', message: 'Failed' }));
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.FAILED);
    expect(context.service.getSnapshot().message).toBe('Failed');
    expect(context.service.dismiss()).toBe(true);
  });

  test('refuses to start while a download is active', () => {
    const context = setup();
    startLiveDownload(context);
    expect(context.service.start({
      summary: SUMMARY,
      sessionHeaders: SESSION_HEADERS,
      submit: context.submit,
    })).toBe('already-active');
    expect(context.submit).toHaveBeenCalledTimes(1);
    expect(FakeSocket.instances).toHaveLength(1);
  });

  test('refuses to start when the page limit is reached', () => {
    const context = setup();
    DownloadProgressRegistry.tryAcquire('a');
    DownloadProgressRegistry.tryAcquire('b');
    DownloadProgressRegistry.tryAcquire('c');
    expect(context.service.start({
      summary: SUMMARY,
      sessionHeaders: SESSION_HEADERS,
      submit: context.submit,
    })).toBe('limit-reached');
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.IDLE);
    expect(context.requestTicket).not.toHaveBeenCalled();
    expect(getFrames()).toHaveLength(0);
  });

  test('replaces a finished download when starting another', () => {
    const context = setup();
    const firstId = startLiveDownload(context);
    latestSocket().receive(progress(firstId, 1, { status: 'COMPLETED' }));
    const secondId = startDownload(context);
    expect(secondId).not.toBe(firstId);
    const frames = getFrames();
    expect(frames).toHaveLength(1);
    expect(frames[0].name).toBe(`${DOWNLOAD_FRAME_NAME_PREFIX}${secondId}`);
  });

  test('disposing while active closes the socket and releases the slot but keeps the frame', () => {
    const context = setup();
    const downloadId = startLiveDownload(context);
    const socket = latestSocket();
    context.service.dispose();
    expect(socket.closed).toBe(true);
    expect(DownloadProgressRegistry.isHeld(downloadId)).toBe(false);
    expect(getFrames()).toHaveLength(1);
    expect(context.service.getSnapshot().phase).toBe(DownloadProgressPhase.IDLE);
    // May be attached and used again, as when remounted in strict mode
    context.service.attach();
    expect(context.service.start({
      summary: SUMMARY,
      sessionHeaders: SESSION_HEADERS,
      submit: context.submit,
    })).toBe('started');
  });

  test('warns before leaving the page while the download is being prepared', () => {
    const fakeWindow = Object.assign(new EventTarget(), { navigator: { onLine: true } });
    const context = setup({ getWindow: () => fakeWindow as unknown as Window });
    const downloadId = startLiveDownload(context);
    latestSocket().receive(progress(downloadId, 1, { status: 'PREPARING' }));
    const preparingEvent = new Event('beforeunload', { cancelable: true });
    fakeWindow.dispatchEvent(preparingEvent);
    expect(preparingEvent.defaultPrevented).toBe(true);
    latestSocket().receive(progress(downloadId, 2, { status: 'STREAMING', bytesSent: 1 }));
    const streamingEvent = new Event('beforeunload', { cancelable: true });
    fakeWindow.dispatchEvent(streamingEvent);
    expect(streamingEvent.defaultPrevented).toBe(false);
  });

  test('notifies subscribers of changes', () => {
    const context = setup();
    const listener = jest.fn();
    const unsubscribe = context.service.subscribe(listener);
    startLiveDownload(context);
    expect(listener).toHaveBeenCalled();
    const callCount = listener.mock.calls.length;
    unsubscribe();
    context.service.minimize();
    expect(listener).toHaveBeenCalledTimes(callCount);
  });
});
