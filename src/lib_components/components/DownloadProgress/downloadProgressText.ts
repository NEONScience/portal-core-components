import { Nullable } from '../../types/core';
import {
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressTracking,
} from '../../types/downloadProgress';
import { formatBytes } from '../../util/manifestUtil';
import { formatDuration, isActivePhase } from '../../util/downloadProgressUtil';

export const UNAVAILABLE_DESCRIPTION = 'Your download continues in your browser.';

export const DEFAULT_FAILURE_MESSAGE = 'Something went wrong with your download. '
  + 'Please try again.';

/**
 * Types of notices for a download that failed or needs attention
 */
export enum DownloadStatusNoticeType {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

/**
 * Notice for a download that failed or needs attention
 */
export interface DownloadStatusNotice {
  type: DownloadStatusNoticeType;
  title: string;
  message: Nullable<string>;
}

/**
 * Formats a byte count for display
 * @param bytes The byte count
 */
export const displayBytes = (bytes: Nullable<number>): string => {
  if ((typeof bytes !== 'number') || !Number.isFinite(bytes) || (bytes < 1)) return '0 B';
  return formatBytes(Math.round(bytes));
};

const capitalize = (text: string): string => (
  `${text.charAt(0).toUpperCase()}${text.substring(1)}`
);

/**
 * Gets the name of the downloaded file for display
 * @param zipFileName The download package name reported by the server
 */
export const getZipFileDisplayName = (zipFileName: Nullable<string>): Nullable<string> => {
  if (!zipFileName) return null;
  return zipFileName.toLowerCase().endsWith('.zip') ? zipFileName : `${zipFileName}.zip`;
};

const pluralizeFiles = (count: number): string => `${count} file${count === 1 ? '' : 's'}`;

const isTrackingUnavailable = (state: DownloadProgressState): boolean => (
  isActivePhase(state.phase) && (state.tracking === DownloadProgressTracking.UNAVAILABLE)
);

/**
 * Gets the title for the download
 * @param state The download state
 */
export const getTitle = (state: DownloadProgressState): string => {
  if (isTrackingUnavailable(state)) return 'Download in progress';
  switch (state.phase) {
    case DownloadProgressPhase.CONNECTING:
      return 'Starting your download';
    case DownloadProgressPhase.STARTED:
      return 'Your download is starting';
    case DownloadProgressPhase.PREPARING:
      return 'Preparing your download';
    case DownloadProgressPhase.STREAMING:
      return 'Downloading your data';
    case DownloadProgressPhase.FINALIZING:
      return 'Finishing up';
    case DownloadProgressPhase.COMPLETED:
      return 'Download complete';
    case DownloadProgressPhase.FAILED:
      return 'Download failed';
    case DownloadProgressPhase.CANCELED:
      return 'Download canceled';
    default:
      return '';
  }
};

/**
 * Gets the description of the download's status
 * @param state The download state
 */
export const getDescription = (state: DownloadProgressState): string => {
  if (isTrackingUnavailable(state)) return UNAVAILABLE_DESCRIPTION;
  const zipFileName = getZipFileDisplayName(state.zipFileName) || 'your download';
  switch (state.phase) {
    case DownloadProgressPhase.CONNECTING:
      return 'Connecting to follow your download as it happens.';
    case DownloadProgressPhase.STARTED:
      return 'Waiting for the server to begin your download.';
    case DownloadProgressPhase.PREPARING:
      return 'Gathering the files for your request. Large requests can take a few minutes.';
    case DownloadProgressPhase.STREAMING:
      return `Your browser is saving ${zipFileName}.`;
    case DownloadProgressPhase.FINALIZING:
      return 'Adding the final touches to your download.';
    case DownloadProgressPhase.COMPLETED:
      return `Check your browser's downloads for ${zipFileName}.`;
    case DownloadProgressPhase.FAILED:
      return 'Your download couldn\'t be completed.';
    case DownloadProgressPhase.CANCELED:
      return 'Your download stopped before it finished.';
    default:
      return '';
  }
};

/**
 * Gets the reason a download failed, safe to present to the user
 * @param state The download state
 */
export const getFailureMessage = (state: DownloadProgressState): string => (
  state.message || DEFAULT_FAILURE_MESSAGE
);

/**
 * Gets the notice for a download that failed or needs attention
 * @param state The download state
 * @return The notice, null when there is nothing to call attention to
 */
export const getStatusNotice = (state: DownloadProgressState): Nullable<DownloadStatusNotice> => {
  switch (state.phase) {
    case DownloadProgressPhase.FAILED:
      return {
        type: DownloadStatusNoticeType.ERROR,
        title: getFailureMessage(state),
        message: null,
      };
    case DownloadProgressPhase.CANCELED:
      return {
        type: DownloadStatusNoticeType.WARNING,
        title: 'Your download may have been canceled in your browser, or the connection '
          + 'was lost.',
        message: 'Please try downloading your data again.',
      };
    default:
      break;
  }
  if (!isActivePhase(state.phase)) return null;
  if (state.tracking === DownloadProgressTracking.UNAVAILABLE) {
    return {
      type: DownloadStatusNoticeType.WARNING,
      title: 'Live updates are unavailable',
      message: 'Check your browser\'s downloads to follow your download. You can close this '
        + 'window, your download will continue.',
    };
  }
  if (state.tracking === DownloadProgressTracking.RECONNECTING) {
    return {
      type: DownloadStatusNoticeType.WARNING,
      title: 'Reconnecting for live updates…',
      message: 'Your download continues while live updates reconnect.',
    };
  }
  if (state.stalled) {
    return {
      type: DownloadStatusNoticeType.WARNING,
      title: 'Waiting for data from the server…',
      message: 'Large requests can pause while files are gathered. Your download will continue '
        + 'automatically.',
    };
  }
  return null;
};

/**
 * Gets the short status of the download, e.g. for the minimized download
 * @param state The download state
 */
export const getShortStatus = (state: DownloadProgressState): string => {
  if (isTrackingUnavailable(state)) return 'In progress — live updates unavailable';
  const percent = (state.percent !== null) ? `${state.percent}%` : null;
  switch (state.phase) {
    case DownloadProgressPhase.CONNECTING:
    case DownloadProgressPhase.STARTED:
      return 'Starting…';
    case DownloadProgressPhase.PREPARING:
      return 'Preparing…';
    case DownloadProgressPhase.STREAMING: {
      const parts: string[] = [percent || 'Downloading…'];
      if (state.tracking === DownloadProgressTracking.RECONNECTING) {
        parts.push('Reconnecting…');
      } else if (state.stalled) {
        parts.push('Waiting for data…');
      } else {
        const remaining = formatDuration(state.etaSeconds);
        if (remaining) parts.push(`${remaining} left`);
      }
      return parts.join(' · ');
    }
    case DownloadProgressPhase.FINALIZING:
      return 'Finishing up…';
    case DownloadProgressPhase.COMPLETED:
      return (state.filesFailed > 0)
        ? `Complete · ${pluralizeFiles(state.filesFailed)} not included`
        : 'Download complete';
    case DownloadProgressPhase.FAILED:
      return 'Download failed';
    case DownloadProgressPhase.CANCELED:
      return 'Download canceled';
    default:
      return '';
  }
};

/**
 * Gets the text to announce to assistive technology. The text only changes with the
 * status and every 25 percent of progress, so announcements are not too frequent.
 * @param state The download state
 */
export const getAnnouncement = (state: DownloadProgressState): string => {
  const title = getTitle(state);
  if ((state.phase === DownloadProgressPhase.STREAMING) && (typeof state.percent === 'number')) {
    const milestone = Math.floor(state.percent / 25) * 25;
    return (milestone > 0) ? `${title}, ${milestone} percent complete` : title;
  }
  if (state.phase === DownloadProgressPhase.FAILED) {
    return `${title}. ${getFailureMessage(state)}`;
  }
  return title;
};

/**
 * Gets the estimated time remaining for display
 * @param state The download state
 */
export const getTimeRemaining = (state: DownloadProgressState): string => {
  const remaining = formatDuration(state.etaSeconds);
  return remaining ? `${capitalize(remaining)} remaining` : 'Calculating...';
};

/**
 * Gets how long the download took for display
 * @param state The download state
 */
export const getElapsedTime = (state: DownloadProgressState): Nullable<string> => {
  const elapsed = formatDuration(state.elapsedMs / 1000);
  return elapsed ? capitalize(elapsed.replace(/^about /, '')) : null;
};

export { pluralizeFiles };
