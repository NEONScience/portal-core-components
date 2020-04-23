import React from 'react';
import HTMLReactParser from 'html-react-parser';

import Skeleton from '@material-ui/lab/Skeleton';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyHeader from './NeonLegacyHeader';

export default function NeonHeader(props) {
  const [{
    isActive,
    fetches: { header: headerFetch },
    html: { header: headerHTML },
  }] = NeonContext.useNeonContextState();

  let renderMode = 'legacy';
  if (isActive) {
    if (headerFetch.status === FETCH_STATUS.SUCCESS && headerHTML) {
      renderMode = 'drupal';
    }
    if ([FETCH_STATUS.AWAITING_CALL, FETCH_STATUS.FETCHING].includes(headerFetch.status)) {
      renderMode = 'loading';
    }
  }

  switch (renderMode) {
    case 'loading':
      return (
        <header id="footer">
          <Skeleton variant="rect" height="125px" width="100%" />
        </header>
      );

    case 'drupal':
      return (
        <header id="footer">
          {HTMLReactParser(headerHTML)}
        </header>
      );

    default:
      return <NeonLegacyHeader {...props} />;
  }
}
