import React, { Suspense } from 'react';

import { useDownloadProgressView } from './DownloadProgressContext';

const DownloadProgressDialog = React.lazy(() => import('./DownloadProgressDialog'));
const DownloadProgressIndicator = React.lazy(() => import('./DownloadProgressIndicator'));

/**
 * Presents the download tracked by the provider, as a dialog when expanded or in
 * the shared tray when minimized. Renders nothing when there is no download.
 */
const DownloadProgress: React.FC = (): React.JSX.Element | null => {
  const view = useDownloadProgressView();
  if (view === 'none') return null;
  return (
    <>
      {/* Remains rendered when minimized so the dialog can transition out */}
      <Suspense fallback={null}>
        <DownloadProgressDialog />
      </Suspense>
      {(view !== 'minimized') ? null : (
        <Suspense fallback={null}>
          <DownloadProgressIndicator />
        </Suspense>
      )}
    </>
  );
};

export default DownloadProgress;
