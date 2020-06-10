import React from 'react';

import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapContainer from './SiteMapContainer';
import { SITE_MAP_PROP_TYPES, SITE_MAP_DEFAULT_PROPS } from './SiteMapUtils';

const SiteMap = (props) => {
  const { unusableVerticalSpace = 0 } = props; // no need to store this in state, just pass it thru
  return (
    <SiteMapContext.Provider {...props}>
      <SiteMapContainer unusableVerticalSpace={unusableVerticalSpace} />
    </SiteMapContext.Provider>
  );
};

SiteMap.propTypes = SITE_MAP_PROP_TYPES;
SiteMap.defaultProps = SITE_MAP_DEFAULT_PROPS;

const WrappedSiteMap = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(SiteMap),
);

export default WrappedSiteMap;
