import React from 'react';
import HTMLReactParser from 'html-react-parser';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyFooter from './NeonLegacyFooter';

export default function NeonFooter() {
  const [{
    isActive,
    fetches: { footer: footerFetch },
    html: { footer: footerHTML },
  }] = NeonContext.useNeonContextState();

  let renderMode = 'legacy';
  if (isActive) {
    if (footerFetch.status === FETCH_STATUS.SUCCESS && footerHTML) {
      renderMode = 'drupal';
    }
    if ([FETCH_STATUS.AWAITING_CALL, FETCH_STATUS.FETCHING].includes(footerFetch.status)) {
      renderMode = 'loading';
    }
  }

  switch (renderMode) {
    case 'loading':
      return <div>LOADING FOOTER</div>;

    case 'drupal':
      return (
        <footer id="footer">
          {HTMLReactParser(footerHTML)}
        </footer>
      );

    default:
      return <NeonLegacyFooter />;
  }
}
