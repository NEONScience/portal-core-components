import { Nullable } from './core';

/**
 * Types of messages sent from the download API progress websocket
 */
export enum DownloadProgressMessageType {
  READY = 'READY',
  PROGRESS = 'PROGRESS',
  HEARTBEAT = 'HEARTBEAT',
}

/**
 * Types of messages sent to the download API progress websocket
 */
export enum DownloadProgressClientMessageType {
  // Authenticates the connection, must be the first message sent
  CONNECT = 'CONNECT',
}

/**
 * Message authenticating a download API progress websocket connection. Browsers can't add
 * headers to the websocket handshake, so the headers are sent as with a STOMP CONNECT frame.
 */
export interface DownloadProgressConnectMessage {
  type: DownloadProgressClientMessageType.CONNECT;
  headers: Record<string, string>;
}

/**
 * Statuses reported by the download API for a download
 */
export enum DownloadProgressStatus {
  PREPARING = 'PREPARING',
  STREAMING = 'STREAMING',
  FINALIZING = 'FINALIZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

/**
 * Message received from the download API progress websocket.
 * PROGRESS messages are always a full snapshot of the download state,
 * where a missing field indicates the value is unknown.
 * Details of the files that could not be included are only sent with a terminal status.
 */
export interface DownloadProgressMessage {
  type: string;
  downloadId?: string;
  runId?: string;
  sequence?: number;
  status?: string;
  zipFileName?: string;
  totalBytes?: number;
  totalFiles?: number;
  unknownSizeFiles?: number;
  bytesSent?: number;
  bytesSkipped?: number;
  filesCompleted?: number;
  filesFailed?: number;
  currentFile?: string;
  elapsedMs?: number;
  failedFiles?: string[];
  failedFileDetails?: unknown[];
  message?: string;
  timestamp?: number;
}

/**
 * Reasons reported by the download API for a file that could not be included in a download
 */
export enum DownloadProgressFailureReason {
  SIGNING_FAILED = 'SIGNING_FAILED',
  NOT_FOUND = 'NOT_FOUND',
  READ_FAILED = 'READ_FAILED',
  INVALID_LOCATION = 'INVALID_LOCATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * A file that could not be included in a download, identifying it so it can be retrieved again.
 * The URL is the public API location of the file. Values are only kept when they match their
 * expected public form.
 */
export interface DownloadProgressFailedFile {
  fileName: Nullable<string>;
  // DATA or DOCUMENT
  type: Nullable<string>;
  description: Nullable<string>;
  productCode: Nullable<string>;
  siteCode: Nullable<string>;
  month: Nullable<string>;
  release: Nullable<string>;
  packageType: Nullable<string>;
  sizeBytes: Nullable<number>;
  checksum: Nullable<string>;
  checksumAlgorithm: Nullable<string>;
  url: Nullable<string>;
  reason: DownloadProgressFailureReason;
}

/**
 * One-time ticket for connecting to the download API progress websocket
 */
export interface DownloadProgressTicket {
  ticket: string;
  downloadId: string;
  expiresInSeconds: number;
}

/**
 * Websocket close codes used by the download API progress websocket
 */
export enum DownloadProgressCloseCode {
  NORMAL = 1000,
  GOING_AWAY = 1001,
  // Verifying the connection is temporarily unavailable
  TRY_AGAIN_LATER = 1013,
  // The connection was not authenticated with a valid CONNECT message
  BAD_REQUEST = 4400,
  // The session or session token is invalid
  SESSION_INVALID = 4401,
  FORBIDDEN = 4403,
  // The connection was idle, or was not authenticated in time
  IDLE = 4408,
  TOO_MANY_CONNECTIONS = 4429,
}

/**
 * Client side phase of a download
 */
export enum DownloadProgressPhase {
  // No download
  IDLE = 'IDLE',
  // Establishing live progress prior to submitting the download
  CONNECTING = 'CONNECTING',
  // The download was submitted but no status has been received for it
  STARTED = 'STARTED',
  PREPARING = 'PREPARING',
  STREAMING = 'STREAMING',
  FINALIZING = 'FINALIZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

/**
 * Availability of live progress updates for a download
 */
export enum DownloadProgressTracking {
  CONNECTING = 'CONNECTING',
  LIVE = 'LIVE',
  RECONNECTING = 'RECONNECTING',
  // Live updates can't be established, the download may still be running in the browser
  UNAVAILABLE = 'UNAVAILABLE',
  // Live updates are no longer needed
  CLOSED = 'CLOSED',
}

/**
 * Summary of what is being downloaded, captured when the download is started
 */
export interface DownloadSummary {
  productCode: string;
  productName: string;
  release: Nullable<string>;
  releaseLabel: string;
  sites: string[];
  dateRange: Nullable<string[]>;
  dateRangeLabel: Nullable<string>;
  packageType: Nullable<string>;
  includeDocumentation: Nullable<boolean>;
  includeProvisionalData: Nullable<boolean>;
  fileCount: Nullable<number>;
  estimatedBytes: number;
  isEstimateUncompressed: boolean;
}

/**
 * State of a tracked download
 */
export interface DownloadProgressState {
  downloadId: Nullable<string>;
  phase: DownloadProgressPhase;
  tracking: DownloadProgressTracking;
  // Whether the progress dialog is shown, otherwise the download is minimized
  expanded: boolean;
  summary: Nullable<DownloadSummary>;
  runId: Nullable<string>;
  sequence: number;
  zipFileName: Nullable<string>;
  totalBytes: Nullable<number>;
  totalFiles: Nullable<number>;
  unknownSizeFiles: number;
  bytesSent: number;
  bytesSkipped: number;
  filesCompleted: number;
  filesFailed: number;
  currentFile: Nullable<string>;
  elapsedMs: number;
  // Percent complete, null when the progress is indeterminate
  percent: Nullable<number>;
  // Bytes per second
  rate: Nullable<number>;
  etaSeconds: Nullable<number>;
  // Whether no data has been processed for a while
  stalled: boolean;
  failedFiles: string[];
  // Details of the files that could not be included, reported once the download has finished
  failedFileDetails: DownloadProgressFailedFile[];
  message: Nullable<string>;
  // Epoch millisecond times the download was started and finished
  startedAt: Nullable<number>;
  finishedAt: Nullable<number>;
}

/**
 * Options supplied to the function that submits the download
 */
export interface DownloadSubmitOptions {
  downloadId?: string;
  // Name of the browsing context to submit the download into
  target?: string;
}

export type DownloadSubmitFunc = (options: DownloadSubmitOptions) => void;

export type DownloadProgressStartResult = 'started' | 'already-active' | 'limit-reached';

export interface DownloadProgressStartOptions {
  summary: DownloadSummary;
  sessionHeaders: Record<string, string>;
  submit: DownloadSubmitFunc;
}

/**
 * Actions for controlling a tracked download
 */
export interface DownloadProgressActions {
  start: (options: DownloadProgressStartOptions) => DownloadProgressStartResult;
  expand: () => void;
  minimize: () => void;
  // Clears a download that can be dismissed, returns whether it was cleared
  dismiss: () => boolean;
}
