import { Observable, Subscription } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { AjaxResponse } from 'rxjs/ajax';

import NeonApi from '../components/NeonApi/NeonApi';
import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import DownloadProgressRegistry, { IDownloadProgressRegistry } from './DownloadProgressRegistry';
import { Nullable } from '../types/core';
import {
  DownloadProgressActions,
  DownloadProgressClientMessageType,
  DownloadProgressCloseCode,
  DownloadProgressConnectMessage,
  DownloadProgressFailedFile,
  DownloadProgressMessage,
  DownloadProgressMessageType,
  DownloadProgressPhase,
  DownloadProgressStartOptions,
  DownloadProgressStartResult,
  DownloadProgressState,
  DownloadProgressTicket,
  DownloadProgressTracking,
  DownloadSubmitFunc,
} from '../types/downloadProgress';
import {
  ThroughputEstimator,
  computePercent,
  createThroughputEstimator,
  generateDownloadId,
  getPhaseForStatus,
  isActivePhase,
  isDismissible,
  isTerminalPhase,
} from '../util/downloadProgressUtil';
import {
  getPublicApiRoot,
  sanitizeFailedFile,
  sanitizeFileName,
} from '../util/downloadSanitizeUtil';
import { isStringNonEmpty } from '../util/typeUtil';

export const DOWNLOAD_PROGRESS_TIMING = {
  // Most time to wait for live progress before submitting the download
  SUBMIT_DEADLINE_MS: 3_000,
  TICKET_TIMEOUT_MS: 5_000,
  OPEN_TIMEOUT_MS: 5_000,
  READY_TIMEOUT_MS: 5_000,
  // The server sends a heartbeat every 20 seconds
  WATCHDOG_TIMEOUT_MS: 45_000,
  // Processed bytes unchanged for this long while streaming is considered stalled
  STALL_TIMEOUT_MS: 60_000,
  // Live progress is given up on after failing to reconnect for this long
  GIVE_UP_AFTER_MS: 30 * 60_000,
  // Time to wait for a failure status after the download frame loads an error response
  FRAME_FAILURE_GRACE_MS: 4_000,
  RECONNECT_BACKOFF_MS: [1_000, 2_000, 4_000, 8_000, 16_000, 30_000],
  RECONNECT_JITTER: 0.2,
};

export const DOWNLOAD_FRAME_NAME_PREFIX = 'neon-download-frame-';

export const START_FAILED_MESSAGE = 'We couldn\'t start your download. Please try again.';

/**
 * The subset of the WebSocket interface used to receive progress
 */
export interface DownloadProgressSocket {
  onopen: Nullable<(event: Event) => void>;
  onmessage: Nullable<(event: MessageEvent) => void>;
  onclose: Nullable<(event: CloseEvent) => void>;
  onerror: Nullable<(event: Event) => void>;
  send: (data: string) => void;
  close: (code?: number, reason?: string) => void;
}

export type DownloadProgressSocketCtor = new (url: string) => DownloadProgressSocket;

export interface DownloadFrameInspection {
  // Whether the frame is still blank, as a download response does not replace the document
  blank: boolean;
  // A short detail read from an error response, when available
  detail: Nullable<string>;
}

export interface DownloadProgressServiceDeps {
  registry: IDownloadProgressRegistry;
  requestTicket: (
    downloadId: string,
    sessionHeaders: Record<string, string>,
  ) => Observable<DownloadProgressTicket>;
  WebSocketCtor: Nullable<DownloadProgressSocketCtor>;
  buildWebSocketUrl: (ticket: string) => string;
  // Gets the root of the public API the portal uses, which file URLs must be within
  getPublicApiRoot: () => string;
  getDocument: () => Nullable<Document>;
  getWindow: () => Nullable<Window>;
  inspectFrame: (frame: HTMLIFrameElement) => DownloadFrameInspection;
  setTimeout: (handler: () => void, timeoutMs: number) => unknown;
  clearTimeout: (handle: unknown) => void;
  now: () => number;
  random: () => number;
  generateId: () => string;
}

export interface IDownloadProgressService {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => DownloadProgressState;
  // Stable actions object
  actions: DownloadProgressActions;
  start: DownloadProgressActions['start'];
  expand: DownloadProgressActions['expand'];
  minimize: DownloadProgressActions['minimize'];
  dismiss: DownloadProgressActions['dismiss'];
  // Attaches the window event listeners, may be called again after disposing
  attach: () => void;
  // Stops tracking and releases resources, the download itself is unaffected
  dispose: () => void;
}

export const createInitialDownloadProgressState = (): DownloadProgressState => ({
  downloadId: null,
  phase: DownloadProgressPhase.IDLE,
  tracking: DownloadProgressTracking.CLOSED,
  expanded: false,
  summary: null,
  runId: null,
  sequence: -1,
  zipFileName: null,
  totalBytes: null,
  totalFiles: null,
  unknownSizeFiles: 0,
  bytesSent: 0,
  bytesSkipped: 0,
  filesCompleted: 0,
  filesFailed: 0,
  currentFile: null,
  elapsedMs: 0,
  percent: null,
  rate: null,
  etaSeconds: null,
  stalled: false,
  failedFiles: [],
  failedFileDetails: [],
  message: null,
  startedAt: null,
  finishedAt: null,
});

/**
 * Parses the ticket from the ticket endpoint response body
 * @param body The response body
 * @param downloadId The download the ticket was requested for
 * @return The ticket
 */
export const parseTicketResponse = (body: unknown, downloadId: string): DownloadProgressTicket => {
  const data: unknown = ((typeof body === 'object') && (body !== null))
    ? (body as Record<string, unknown>).data
    : null;
  if ((typeof data !== 'object') || (data === null)) {
    throw new Error('Invalid download progress ticket response');
  }
  const { ticket, expiresInSeconds } = data as Record<string, unknown>;
  if (!isStringNonEmpty(ticket)) {
    throw new Error('Invalid download progress ticket response');
  }
  return {
    ticket: ticket as string,
    downloadId,
    expiresInSeconds: (typeof expiresInSeconds === 'number') ? expiresInSeconds : 0,
  };
};

/**
 * Builds the message authenticating a progress websocket connection, the first message sent
 * on the connection. As with the headers of a STOMP CONNECT frame, it carries the session token
 * headers, as browsers can't add headers to the websocket handshake.
 * @param sessionHeaders The session token headers
 * @return The serialized message
 */
export const buildConnectMessage = (
  sessionHeaders: Record<string, string>,
): string => {
  const message: DownloadProgressConnectMessage = {
    type: DownloadProgressClientMessageType.CONNECT,
    headers: { ...sessionHeaders },
  };
  return JSON.stringify(message);
};

const requestTicketDefault = (
  downloadId: string,
  sessionHeaders: Record<string, string>,
): Observable<DownloadProgressTicket> => (
  (NeonApi.postJsonObservable(
    NeonEnvironment.getFullDownloadApiPath('downloadProgressTicket'),
    { downloadId },
    sessionHeaders,
    false,
  ) as Observable<Nullable<AjaxResponse<unknown>>>).pipe(
    map((response: Nullable<AjaxResponse<unknown>>): DownloadProgressTicket => (
      parseTicketResponse(response ? response.response : null, downloadId)
    )),
  )
);

const buildWebSocketUrlDefault = (ticket: string): string => (
  `${NeonEnvironment.getFullDownloadApiWsPath('downloadProgressWs')}`
  + `?ticket=${encodeURIComponent(ticket)}`
);

// Reads a short detail from an API error response, e.g. { error: { detail: 'Access Denied' } }
const readFrameErrorDetail = (frame: HTMLIFrameElement): Nullable<string> => {
  try {
    const text = frame.contentDocument?.body?.textContent?.trim();
    if (!text) return null;
    const parsed = JSON.parse(text);
    const candidates: unknown[] = [
      parsed?.error?.detail,
      parsed?.error?.message,
      parsed?.detail,
      parsed?.message,
    ];
    const detail = candidates.find((candidate: unknown): boolean => (
      isStringNonEmpty(candidate) && ((candidate as string).length <= 200)
    ));
    return detail ? (detail as string).trim() : null;
  } catch (e) {
    return null;
  }
};

const inspectFrameDefault = (frame: HTMLIFrameElement): DownloadFrameInspection => {
  try {
    const href = frame.contentWindow?.location?.href;
    if (!href || (href === 'about:blank')) {
      return { blank: true, detail: null };
    }
  } catch (e) {
    // A cross origin document was loaded into the frame
    return { blank: false, detail: null };
  }
  return { blank: false, detail: readFrameErrorDetail(frame) };
};

const getDefaultDeps = (): DownloadProgressServiceDeps => ({
  registry: DownloadProgressRegistry,
  requestTicket: requestTicketDefault,
  WebSocketCtor: (typeof WebSocket === 'function')
    ? WebSocket as unknown as DownloadProgressSocketCtor
    : null,
  buildWebSocketUrl: buildWebSocketUrlDefault,
  getPublicApiRoot,
  getDocument: (): Nullable<Document> => ((typeof document === 'object') ? document : null),
  getWindow: (): Nullable<Window> => ((typeof window === 'object') ? window : null),
  inspectFrame: inspectFrameDefault,
  setTimeout: (handler: () => void, timeoutMs: number): unknown => setTimeout(handler, timeoutMs),
  clearTimeout: (handle: unknown): void => {
    clearTimeout(handle as ReturnType<typeof setTimeout>);
  },
  now: (): number => Date.now(),
  random: (): number => Math.random(),
  generateId: (): string => generateDownloadId(),
});

const isFatalTicketError = (error: unknown): boolean => {
  if ((typeof error !== 'object') || (error === null)) return false;
  const { status } = error as Record<string, unknown>;
  // Not authenticated, no data access, invalid request or the feature is disabled
  return (typeof status === 'number') && [400, 401, 403, 404].includes(status);
};

const numberOrDefault = (value: unknown, defaultValue: number): number => (
  ((typeof value === 'number') && Number.isFinite(value)) ? value : defaultValue
);

const numberOrNull = (value: unknown): number | null => (
  ((typeof value === 'number') && Number.isFinite(value)) ? value : null
);

const stringOrNull = (value: unknown): Nullable<string> => (
  isStringNonEmpty(value) ? value as string : null
);

/**
 * Parses the details of the files that could not be included in a download,
 * reported by the download API with a terminal status. Each value is only kept
 * when it matches its expected public form.
 * @param value The reported details
 * @param publicApiRoot The root of the public API the portal uses
 * @return The failed files
 */
export const parseFailedFileDetails = (
  value: unknown,
  publicApiRoot: string,
): DownloadProgressFailedFile[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item: unknown): Nullable<DownloadProgressFailedFile> => (
      sanitizeFailedFile(item, publicApiRoot)
    ))
    .filter((item: Nullable<DownloadProgressFailedFile>): item is DownloadProgressFailedFile => (
      item !== null
    ));
};

type TimerKey = 'submit' | 'open' | 'ready' | 'watchdog' | 'reconnect' | 'stall' | 'frame';

/**
 * A download being tracked
 */
interface TrackedDownload {
  downloadId: string;
  sessionHeaders: Record<string, string>;
  submit: DownloadSubmitFunc;
  submitted: boolean;
  frame: Nullable<HTMLIFrameElement>;
  socket: Nullable<DownloadProgressSocket>;
  ticketSubscription: Nullable<Subscription>;
  // Incremented to invalidate the handlers of the previous connection
  connectionGeneration: number;
  reconnectAttempt: number;
  firstFailureAt: number | null;
  awaitingOnline: boolean;
  lastProcessedBytes: number | null;
  estimator: ThroughputEstimator;
}

/**
 * Creates a service tracking the progress of one download at a time, through the
 * download API progress websocket. Live progress is an enhancement, the download is
 * always submitted regardless of whether live progress can be established.
 * @param overrideDeps Dependencies to override, e.g. for testing
 * @return The service
 */
export const createDownloadProgressService = (
  overrideDeps: Partial<DownloadProgressServiceDeps> = {},
): IDownloadProgressService => {
  const deps: DownloadProgressServiceDeps = { ...getDefaultDeps(), ...overrideDeps };
  const timing = DOWNLOAD_PROGRESS_TIMING;
  const listeners: Set<() => void> = new Set<() => void>();
  const timers: Partial<Record<TimerKey, unknown>> = {};
  let state: DownloadProgressState = createInitialDownloadProgressState();
  let current: Nullable<TrackedDownload> = null;
  let attachedWindow: Nullable<Window> = null;
  let beforeUnloadWindow: Nullable<Window> = null;

  const notify = (): void => {
    listeners.forEach((listener: () => void): void => listener());
  };
  const setState = (update: Partial<DownloadProgressState>): void => {
    state = { ...state, ...update };
    notify();
  };

  const clearTimer = (key: TimerKey): void => {
    if (typeof timers[key] === 'undefined') return;
    deps.clearTimeout(timers[key]);
    delete timers[key];
  };
  const setTimer = (key: TimerKey, timeoutMs: number, handler: () => void): void => {
    clearTimer(key);
    timers[key] = deps.setTimeout(() => {
      delete timers[key];
      handler();
    }, timeoutMs);
  };
  const clearAllTimers = (): void => {
    (Object.keys(timers) as TimerKey[]).forEach((key: TimerKey): void => clearTimer(key));
  };

  const isCurrent = (download: TrackedDownload): boolean => (
    (current === download) && isActivePhase(state.phase)
  );
  const isCurrentConnection = (download: TrackedDownload, generation: number): boolean => (
    isCurrent(download) && (download.connectionGeneration === generation)
  );

  // Warns when leaving the page would cancel the download before it starts streaming
  const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    const preparingPhases = [DownloadProgressPhase.STARTED, DownloadProgressPhase.PREPARING];
    if (current && current.submitted && preparingPhases.includes(state.phase)) {
      event.preventDefault();
    }
  };
  const updateBeforeUnload = (): void => {
    const shouldWarn = !!current && current.submitted && !!attachedWindow
      && [DownloadProgressPhase.STARTED, DownloadProgressPhase.PREPARING].includes(state.phase);
    if (shouldWarn && !beforeUnloadWindow) {
      beforeUnloadWindow = attachedWindow;
      (beforeUnloadWindow as Window).addEventListener('beforeunload', handleBeforeUnload);
    } else if (!shouldWarn && beforeUnloadWindow) {
      beforeUnloadWindow.removeEventListener('beforeunload', handleBeforeUnload);
      beforeUnloadWindow = null;
    }
  };

  // Invalidates and closes the current connection, if any
  const clearConnection = (download: TrackedDownload): void => {
    // eslint-disable-next-line no-param-reassign
    download.connectionGeneration += 1;
    if (download.ticketSubscription) {
      download.ticketSubscription.unsubscribe();
      // eslint-disable-next-line no-param-reassign
      download.ticketSubscription = null;
    }
    if (download.socket) {
      const { socket } = download;
      // eslint-disable-next-line no-param-reassign
      download.socket = null;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      try {
        socket.close(DownloadProgressCloseCode.NORMAL);
      } catch (e) {
        // The socket is already closed
      }
    }
    clearTimer('open');
    clearTimer('ready');
    clearTimer('watchdog');
  };

  const releaseSlot = (download: TrackedDownload): void => {
    deps.registry.release(download.downloadId);
  };

  const removeFrame = (download: TrackedDownload): void => {
    if (!download.frame) return;
    const { frame } = download;
    // eslint-disable-next-line no-param-reassign
    download.frame = null;
    if (frame.parentNode) {
      frame.parentNode.removeChild(frame);
    }
  };

  // Ends tracking for the current download in a terminal phase
  const finish = (
    download: TrackedDownload,
    phase: DownloadProgressPhase,
    update: Partial<DownloadProgressState> = {},
  ): void => {
    if (current !== download) return;
    clearAllTimers();
    clearConnection(download);
    releaseSlot(download);
    const nextState: DownloadProgressState = {
      ...state,
      ...update,
      phase,
      tracking: DownloadProgressTracking.CLOSED,
      stalled: false,
      rate: null,
      etaSeconds: null,
      currentFile: (phase === DownloadProgressPhase.COMPLETED) ? null : state.currentFile,
      finishedAt: update.finishedAt ?? state.finishedAt ?? deps.now(),
    };
    nextState.percent = computePercent(nextState);
    state = nextState;
    updateBeforeUnload();
    notify();
  };

  // Submits the download, at most once
  const submitDownload = (download: TrackedDownload): void => {
    if ((current !== download) || download.submitted) return;
    // eslint-disable-next-line no-param-reassign
    download.submitted = true;
    clearTimer('submit');
    try {
      download.submit({
        downloadId: download.downloadId,
        target: download.frame ? download.frame.name : undefined,
      });
    } catch (e) {
      finish(download, DownloadProgressPhase.FAILED, { message: START_FAILED_MESSAGE });
      return;
    }
    if (state.phase === DownloadProgressPhase.CONNECTING) {
      setState({ phase: DownloadProgressPhase.STARTED });
    }
    updateBeforeUnload();
  };

  // Stops trying to get live progress, the download may still be running
  const stopTracking = (download: TrackedDownload): void => {
    if (!isCurrent(download)) return;
    clearConnection(download);
    clearTimer('reconnect');
    clearTimer('stall');
    submitDownload(download);
    if (!isCurrent(download)) return;
    setState({
      tracking: DownloadProgressTracking.UNAVAILABLE,
      stalled: false,
      rate: null,
      etaSeconds: null,
    });
  };

  // Declared ahead for the mutual recursion of connecting and reconnecting
  let connect: (download: TrackedDownload) => void = () => {};

  const isOffline = (): boolean => {
    const win = deps.getWindow();
    return !!win && !!win.navigator && (win.navigator.onLine === false);
  };

  const scheduleReconnect = (download: TrackedDownload, useMaxBackoff: boolean): void => {
    if (!isCurrent(download) || (state.tracking === DownloadProgressTracking.UNAVAILABLE)) return;
    submitDownload(download);
    if (!isCurrent(download)) return;
    const now = deps.now();
    if (download.firstFailureAt === null) {
      // eslint-disable-next-line no-param-reassign
      download.firstFailureAt = now;
    }
    if ((now - download.firstFailureAt) >= timing.GIVE_UP_AFTER_MS) {
      stopTracking(download);
      return;
    }
    if (state.tracking !== DownloadProgressTracking.RECONNECTING) {
      setState({ tracking: DownloadProgressTracking.RECONNECTING });
    }
    if (isOffline()) {
      // Resumes when the browser is back online
      // eslint-disable-next-line no-param-reassign
      download.awaitingOnline = true;
      clearTimer('reconnect');
      return;
    }
    const backoff = timing.RECONNECT_BACKOFF_MS;
    const baseDelayMs = useMaxBackoff
      ? backoff[backoff.length - 1]
      : backoff[Math.min(download.reconnectAttempt, backoff.length - 1)];
    // eslint-disable-next-line no-param-reassign
    download.reconnectAttempt += 1;
    const jitter = 1 + (((deps.random() * 2) - 1) * timing.RECONNECT_JITTER);
    setTimer('reconnect', Math.round(baseDelayMs * jitter), () => connect(download));
  };

  const handleConnectionFailure = (download: TrackedDownload, fatal: boolean): void => {
    if (!isCurrent(download)) return;
    clearConnection(download);
    if (fatal) {
      stopTracking(download);
      return;
    }
    scheduleReconnect(download, false);
  };

  const markLive = (download: TrackedDownload): void => {
    clearTimer('ready');
    /* eslint-disable no-param-reassign */
    download.reconnectAttempt = 0;
    download.firstFailureAt = null;
    /* eslint-enable no-param-reassign */
    if (state.tracking !== DownloadProgressTracking.LIVE) {
      setState({ tracking: DownloadProgressTracking.LIVE });
    }
  };

  const markStalled = (download: TrackedDownload): void => {
    if (!isCurrent(download) || (state.phase !== DownloadProgressPhase.STREAMING)) return;
    setState({ stalled: true });
  };

  const applyProgress = (download: TrackedDownload, message: DownloadProgressMessage): void => {
    const phase = getPhaseForStatus(message.status);
    if (!phase) return;
    const runId = stringOrNull(message.runId);
    // Only the first run seen for the download is followed
    if (state.runId && runId && (runId !== state.runId)) return;
    const sequence = numberOrNull(message.sequence);
    if ((sequence !== null) && (sequence <= state.sequence)) return;
    const bytesSent = numberOrDefault(message.bytesSent, 0);
    const bytesSkipped = numberOrDefault(message.bytesSkipped, 0);
    const elapsedMs = numberOrDefault(message.elapsedMs, state.elapsedMs);
    const totalBytes = numberOrNull(message.totalBytes) ?? state.totalBytes;
    const processedBytes = bytesSent + bytesSkipped;
    const streaming = (phase === DownloadProgressPhase.STREAMING)
      || (phase === DownloadProgressPhase.FINALIZING);
    if (streaming) {
      download.estimator.addSample(processedBytes, elapsedMs);
    }
    let { stalled } = state;
    if (phase === DownloadProgressPhase.STREAMING) {
      if (download.lastProcessedBytes !== processedBytes) {
        // eslint-disable-next-line no-param-reassign
        download.lastProcessedBytes = processedBytes;
        stalled = false;
        setTimer('stall', timing.STALL_TIMEOUT_MS, () => markStalled(download));
      }
    } else {
      clearTimer('stall');
      stalled = false;
    }
    const rate = streaming ? download.estimator.getRate() : null;
    const etaSeconds = ((phase === DownloadProgressPhase.STREAMING)
        && (typeof totalBytes === 'number') && (totalBytes > 0))
      ? download.estimator.getEtaSeconds(totalBytes - processedBytes)
      : null;
    const nextState: DownloadProgressState = {
      ...state,
      phase,
      runId: runId || state.runId,
      sequence: (sequence !== null) ? sequence : state.sequence,
      zipFileName: stringOrNull(message.zipFileName) ?? state.zipFileName,
      totalBytes,
      totalFiles: numberOrNull(message.totalFiles) ?? state.totalFiles,
      unknownSizeFiles: numberOrDefault(message.unknownSizeFiles, 0),
      bytesSent,
      bytesSkipped,
      filesCompleted: numberOrDefault(message.filesCompleted, 0),
      filesFailed: numberOrDefault(message.filesFailed, 0),
      currentFile: stringOrNull(message.currentFile),
      elapsedMs,
      rate,
      etaSeconds,
      stalled,
      failedFiles: Array.isArray(message.failedFiles)
        ? message.failedFiles
          .map((name: unknown): Nullable<string> => sanitizeFileName(name))
          .filter((name: Nullable<string>): name is string => name !== null)
        : state.failedFiles,
      failedFileDetails: Array.isArray(message.failedFileDetails)
        ? parseFailedFileDetails(message.failedFileDetails, deps.getPublicApiRoot())
        : state.failedFileDetails,
      message: stringOrNull(message.message),
      finishedAt: isTerminalPhase(phase)
        ? (numberOrNull(message.timestamp) ?? deps.now())
        : state.finishedAt,
    };
    nextState.percent = computePercent(nextState);
    state = nextState;
    if (isTerminalPhase(phase)) {
      finish(download, phase);
      return;
    }
    updateBeforeUnload();
    notify();
  };

  const handleMessage = (download: TrackedDownload, data: unknown): void => {
    let message: Nullable<DownloadProgressMessage> = null;
    try {
      message = JSON.parse(String(data)) as DownloadProgressMessage;
    } catch (e) {
      return;
    }
    if ((typeof message !== 'object') || (message === null) || !isStringNonEmpty(message.type)) {
      return;
    }
    if (isStringNonEmpty(message.downloadId) && (message.downloadId !== download.downloadId)) {
      return;
    }
    switch (message.type) {
      case DownloadProgressMessageType.READY:
        markLive(download);
        submitDownload(download);
        break;
      case DownloadProgressMessageType.PROGRESS:
        markLive(download);
        applyProgress(download, message);
        break;
      default:
        break;
    }
  };

  const handleClose = (download: TrackedDownload, code: number): void => {
    switch (code) {
      case DownloadProgressCloseCode.BAD_REQUEST:
      case DownloadProgressCloseCode.SESSION_INVALID:
      case DownloadProgressCloseCode.FORBIDDEN:
      case DownloadProgressCloseCode.IDLE:
        stopTracking(download);
        break;
      case DownloadProgressCloseCode.TOO_MANY_CONNECTIONS:
        scheduleReconnect(download, true);
        break;
      case DownloadProgressCloseCode.TRY_AGAIN_LATER:
      default:
        scheduleReconnect(download, false);
        break;
    }
  };

  const resetWatchdog = (download: TrackedDownload, generation: number): void => {
    setTimer('watchdog', timing.WATCHDOG_TIMEOUT_MS, () => {
      if (!isCurrentConnection(download, generation)) return;
      handleConnectionFailure(download, false);
    });
  };

  const openSocket = (download: TrackedDownload, generation: number, ticket: string): void => {
    const SocketCtor = deps.WebSocketCtor as DownloadProgressSocketCtor;
    let socket: DownloadProgressSocket;
    try {
      socket = new SocketCtor(deps.buildWebSocketUrl(ticket));
    } catch (e) {
      handleConnectionFailure(download, false);
      return;
    }
    // eslint-disable-next-line no-param-reassign
    download.socket = socket;
    socket.onopen = (): void => {
      if (!isCurrentConnection(download, generation)) return;
      clearTimer('open');
      try {
        socket.send(buildConnectMessage(download.sessionHeaders));
      } catch (e) {
        handleConnectionFailure(download, false);
        return;
      }
      // The server is ready once it has verified the connection
      setTimer('ready', timing.READY_TIMEOUT_MS, () => {
        if (!isCurrentConnection(download, generation)) return;
        handleConnectionFailure(download, false);
      });
      resetWatchdog(download, generation);
    };
    socket.onmessage = (event: MessageEvent): void => {
      if (!isCurrentConnection(download, generation)) return;
      resetWatchdog(download, generation);
      handleMessage(download, event.data);
    };
    // The close event follows any error
    socket.onerror = (): void => {};
    socket.onclose = (event: CloseEvent): void => {
      if (!isCurrentConnection(download, generation)) return;
      clearConnection(download);
      handleClose(download, event.code);
    };
    setTimer('open', timing.OPEN_TIMEOUT_MS, () => {
      if (!isCurrentConnection(download, generation)) return;
      handleConnectionFailure(download, false);
    });
  };

  connect = (download: TrackedDownload): void => {
    if (!isCurrent(download) || (state.tracking === DownloadProgressTracking.UNAVAILABLE)) return;
    clearConnection(download);
    clearTimer('reconnect');
    if (!deps.WebSocketCtor) {
      stopTracking(download);
      return;
    }
    if (isOffline()) {
      // eslint-disable-next-line no-param-reassign
      download.awaitingOnline = true;
      submitDownload(download);
      if (isCurrent(download) && (state.tracking !== DownloadProgressTracking.RECONNECTING)) {
        setState({ tracking: DownloadProgressTracking.RECONNECTING });
      }
      return;
    }
    // eslint-disable-next-line no-param-reassign
    download.awaitingOnline = false;
    const generation = download.connectionGeneration;
    let subscription: Nullable<Subscription> = null;
    try {
      subscription = deps.requestTicket(download.downloadId, download.sessionHeaders)
        .pipe(timeout(timing.TICKET_TIMEOUT_MS))
        .subscribe({
          next: (ticket: DownloadProgressTicket): void => {
            if (!isCurrentConnection(download, generation)) return;
            openSocket(download, generation, ticket.ticket);
          },
          error: (error: unknown): void => {
            if (!isCurrentConnection(download, generation)) return;
            handleConnectionFailure(download, isFatalTicketError(error));
          },
        });
    } catch (e) {
      handleConnectionFailure(download, false);
      return;
    }
    if (subscription && isCurrentConnection(download, generation) && !subscription.closed) {
      // eslint-disable-next-line no-param-reassign
      download.ticketSubscription = subscription;
    }
  };

  const handleFrameLoad = (download: TrackedDownload): void => {
    if (!isCurrent(download) || !download.submitted || !download.frame) return;
    const startedPhases = [DownloadProgressPhase.STREAMING, DownloadProgressPhase.FINALIZING];
    if (startedPhases.includes(state.phase)) return;
    const inspection = deps.inspectFrame(download.frame);
    // A download response does not replace the blank document
    if (inspection.blank) return;
    // The frame loaded an error response, wait for a failure status with more detail
    setTimer('frame', timing.FRAME_FAILURE_GRACE_MS, () => {
      if (!isCurrent(download) || startedPhases.includes(state.phase)) return;
      finish(download, DownloadProgressPhase.FAILED, {
        message: inspection.detail
          ? `${START_FAILED_MESSAGE} (${inspection.detail})`
          : START_FAILED_MESSAGE,
      });
    });
  };

  const createFrame = (download: TrackedDownload): Nullable<HTMLIFrameElement> => {
    const doc = deps.getDocument();
    if (!doc || !doc.body) return null;
    const frame = doc.createElement('iframe');
    // The name must be set before the frame is added for the form to target it
    frame.name = `${DOWNLOAD_FRAME_NAME_PREFIX}${download.downloadId}`;
    frame.title = 'Data download';
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.style.display = 'none';
    frame.addEventListener('load', () => handleFrameLoad(download));
    doc.body.appendChild(frame);
    return frame;
  };

  // Clears the current download. The frame of a download that may still be running
  // is kept, as removing the frame could cancel the download.
  const clearCurrent = (): void => {
    const download = current;
    if (!download) return;
    clearAllTimers();
    clearConnection(download);
    releaseSlot(download);
    if (!isActivePhase(state.phase)) {
      removeFrame(download);
    }
    current = null;
    updateBeforeUnload();
  };

  const start = (options: DownloadProgressStartOptions): DownloadProgressStartResult => {
    if (isActivePhase(state.phase)) return 'already-active';
    const downloadId = deps.generateId();
    if (!deps.registry.tryAcquire(downloadId)) return 'limit-reached';
    // Replaces any finished download that has not been dismissed
    clearCurrent();
    const download: TrackedDownload = {
      downloadId,
      sessionHeaders: { ...options.sessionHeaders },
      submit: options.submit,
      submitted: false,
      frame: null,
      socket: null,
      ticketSubscription: null,
      connectionGeneration: 0,
      reconnectAttempt: 0,
      firstFailureAt: null,
      awaitingOnline: false,
      lastProcessedBytes: null,
      estimator: createThroughputEstimator(),
    };
    current = download;
    download.frame = createFrame(download);
    state = {
      ...createInitialDownloadProgressState(),
      downloadId,
      phase: DownloadProgressPhase.CONNECTING,
      tracking: DownloadProgressTracking.CONNECTING,
      expanded: true,
      summary: options.summary,
      startedAt: deps.now(),
    };
    notify();
    setTimer('submit', timing.SUBMIT_DEADLINE_MS, () => submitDownload(download));
    connect(download);
    return 'started';
  };

  const expand = (): void => {
    if ((state.phase === DownloadProgressPhase.IDLE) || state.expanded) return;
    setState({ expanded: true });
  };

  const minimize = (): void => {
    if ((state.phase === DownloadProgressPhase.IDLE) || !state.expanded) return;
    setState({ expanded: false });
  };

  const dismiss = (): boolean => {
    if ((state.phase === DownloadProgressPhase.IDLE) || !isDismissible(state)) return false;
    clearCurrent();
    state = createInitialDownloadProgressState();
    notify();
    return true;
  };

  const handleOnline = (): void => {
    const download = current;
    if (!download || !isCurrent(download)) return;
    if (download.awaitingOnline || (state.tracking === DownloadProgressTracking.RECONNECTING)) {
      connect(download);
    }
  };

  const attach = (): void => {
    if (attachedWindow) return;
    attachedWindow = deps.getWindow();
    if (attachedWindow) {
      attachedWindow.addEventListener('online', handleOnline);
    }
    updateBeforeUnload();
  };

  const dispose = (): void => {
    if (attachedWindow) {
      attachedWindow.removeEventListener('online', handleOnline);
      attachedWindow = null;
    }
    clearCurrent();
    updateBeforeUnload();
    if (state.phase !== DownloadProgressPhase.IDLE) {
      state = createInitialDownloadProgressState();
      notify();
    }
  };

  const actions: DownloadProgressActions = Object.freeze({
    start,
    expand,
    minimize,
    dismiss,
  });

  return {
    subscribe: (listener: () => void): () => void => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: (): DownloadProgressState => state,
    actions,
    start,
    expand,
    minimize,
    dismiss,
    attach,
    dispose,
  };
};

export default createDownloadProgressService;
