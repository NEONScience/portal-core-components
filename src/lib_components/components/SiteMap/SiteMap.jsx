import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import CustomComponentFallback from '../Error/CustomComponentFallback';
import ErrorCard from '../Card/ErrorCard';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapContainer from './SiteMapContainer';
import { SITE_MAP_PROP_TYPES, SITE_MAP_DEFAULT_PROPS } from './SiteMapUtils';

const SiteMapFallbackComponent = (props) => {
  const { resetErrorBoundary } = props;
  return (
    <CustomComponentFallback
      // eslint-disable-next-line react/no-unstable-nested-components
      FallbackComponent={() => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ErrorCard
              title="Component Error"
              message="Site map encountered a problem"
              actionLabel="Reset"
              onActionClick={resetErrorBoundary}
            />
          </Grid>
        </Grid>
      )}
    />
  );
};

SiteMapFallbackComponent.propTypes = {
  resetErrorBoundary: PropTypes.func.isRequired,
};

const SiteMap = (props) => {
  // no need to store this in state, just pass it thru
  const { unusableVerticalSpace = 0, mapUniqueId = 0 } = props;
  return (
    <ComponentErrorBoundary
      fallbackComponent={SiteMapFallbackComponent}
      onReset={() => { /* noop for boundary reset */ }}
    >
      <SiteMapContext.Provider {...props}>
        <SiteMapContainer unusableVerticalSpace={unusableVerticalSpace} mapUniqueId={mapUniqueId} />
      </SiteMapContext.Provider>
    </ComponentErrorBoundary>
  );
};

SiteMap.propTypes = SITE_MAP_PROP_TYPES;
SiteMap.defaultProps = SITE_MAP_DEFAULT_PROPS;

const WrappedSiteMap = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(SiteMap),
);

export default WrappedSiteMap;
