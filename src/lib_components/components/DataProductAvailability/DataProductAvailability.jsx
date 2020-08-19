import React from 'react';
import PropTypes from 'prop-types';

import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import AvailabilityContext from './AvailabilityContext';
import BasicAvailabilityInterface from './BasicAvailabilityInterface';
import EnhancedAvailabilityInterface from './EnhancedAvailabilityInterface';
import { AvailabilityPropTypes } from './AvailabilityUtils';

const DataProductAvailability = (props) => {
  const {
    sites: enhancedSites,
    siteCodes: basicSiteCodes,
    ...other
  } = props;

  // Favor enhanced view if we have the enhanced prop
  return enhancedSites.length ? (
    <AvailabilityContext.Provider {...props}>
      <EnhancedAvailabilityInterface sites={enhancedSites} {...other} />
    </AvailabilityContext.Provider>
  ) : (
    <BasicAvailabilityInterface siteCodes={basicSiteCodes} {...other} />
  );
};

DataProductAvailability.propTypes = {
  sites: AvailabilityPropTypes.enhancedSites, // Enhanced availability data
  siteCodes: AvailabilityPropTypes.basicSiteCodes, // Basic availability data
  view: PropTypes.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped']),
  sortMethod: PropTypes.oneOf(['sites', 'states', 'domains']),
  sortDirection: PropTypes.oneOf(['ASC', 'DESC']),
  disableSelection: PropTypes.bool,
};

DataProductAvailability.defaultProps = {
  sites: [],
  siteCodes: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
};

const WrappedDataProductAvailability = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(DataProductAvailability),
);

export default WrappedDataProductAvailability;
