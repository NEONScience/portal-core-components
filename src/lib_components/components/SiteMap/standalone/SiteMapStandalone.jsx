import React from 'react';

import NeonThemeProvider from '../../Theme/NeonThemeProvider';
import SiteMap from '../SiteMap';

const SiteMapStandalone = (inProps) => ((
  <NeonThemeProvider>
    <SiteMap {...inProps} />
  </NeonThemeProvider>
));

export default SiteMapStandalone;
