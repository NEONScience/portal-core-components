import { Nullable } from '../../types/core';

export const DOWNLOAD_PROGRESS_TRAY_ID = 'neon-download-progress-tray';

let trayElement: Nullable<HTMLElement> = null;
let subscriberCount = 0;

/**
 * Subscribes to the shared tray that minimized downloads are shown in.
 * The tray is created by the first subscriber and removed with the last, so
 * downloads from separate providers on a page stack instead of overlapping.
 * The tray exists once subscribed, so subscribers are not notified of changes.
 * @return The function to unsubscribe
 */
export const subscribeDownloadProgressTray = (): () => void => {
  subscriberCount += 1;
  if (!trayElement && (typeof document === 'object') && document.body) {
    trayElement = document.createElement('div');
    trayElement.id = DOWNLOAD_PROGRESS_TRAY_ID;
    trayElement.setAttribute('data-selenium', 'download-progress-tray');
    Object.assign(trayElement.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      left: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
      // The tray only captures pointer events on the downloads within
      pointerEvents: 'none',
    });
    document.body.appendChild(trayElement);
  }
  return () => {
    subscriberCount -= 1;
    if ((subscriberCount <= 0) && trayElement) {
      if (trayElement.parentNode) {
        trayElement.parentNode.removeChild(trayElement);
      }
      trayElement = null;
      subscriberCount = 0;
    }
  };
};

/**
 * Gets the shared tray element, null until subscribed
 */
export const getDownloadProgressTray = (): Nullable<HTMLElement> => trayElement;

/**
 * Applies the stacking order of the shared tray
 * @param zIndex The z-index to apply
 */
export const applyDownloadProgressTrayZIndex = (zIndex: number): void => {
  if (!trayElement) return;
  trayElement.style.zIndex = `${zIndex}`;
};
