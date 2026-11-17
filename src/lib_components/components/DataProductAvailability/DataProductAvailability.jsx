import React from 'react';
import PropTypes from 'prop-types';

import NeonContext from '../NeonContext/NeonContext';
import { resolveProps } from '../../util/defaultProps';
import { exists, isStringNonEmpty } from '../../util/typeUtil';

import BasicAvailabilityInterface from './BasicAvailabilityInterface';
import EnhancedAvailabilityContainer from './EnhancedAvailabilityContainer';
import { AvailabilityPropTypes, DEFAULT_AVAILABILITY_COLOR_SCHEME } from './AvailabilityUtils';
import { DEFAULT_AVAILABILITY_INHERITANCE_MODE } from './EnhancedAvailabilityInheritance';

const defaultProps = {
  enhancedAvailability: null,
  siteCodes: [],
  dataProducts: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
  delineateRelease: false,
  availabilityStatusType: null,
  rowLabelWidth: null,
  inheritanceMode: DEFAULT_AVAILABILITY_INHERITANCE_MODE,
  colorScheme: DEFAULT_AVAILABILITY_COLOR_SCHEME,
};

const DataProductAvailability = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    enhancedAvailability,
    siteCodes: basicSiteCodes,
    rowLabelWidth,
    inheritanceMode,
    ...other
  } = props;
  const { productCode } = props;

  // Favor enhanced view if we have enhanced availability data or a product to fetch it for
  return (exists(enhancedAvailability) || isStringNonEmpty(productCode)) ? (
    <EnhancedAvailabilityContainer
      enhancedAvailability={enhancedAvailability}
      rowLabelWidth={rowLabelWidth}
      inheritanceMode={inheritanceMode}
      {...other}
    />
  ) : (
    <BasicAvailabilityInterface siteCodes={basicSiteCodes} {...other} />
  );
};

DataProductAvailability.propTypes = {
  enhancedAvailability: AvailabilityPropTypes.enhancedAvailability, // Enhanced availability data
  productCode: PropTypes.string, // Product to fetch enhanced availability for
  release: PropTypes.string, // Release to scope fetched enhanced availability to
  dataLevel: AvailabilityPropTypes.dataLevel, // Enhanced availability data level
  siteCodes: AvailabilityPropTypes.basicSiteCodes, // Basic availability data
  dataProducts: AvailabilityPropTypes.dataProducts,
  view: PropTypes.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped', 'products']),
  sortMethod: PropTypes.oneOf(['sites', 'states', 'domains']),
  sortDirection: PropTypes.oneOf(['ASC', 'DESC']),
  disableSelection: PropTypes.bool,
  delineateRelease: PropTypes.bool,
  availabilityStatusType: PropTypes.oneOf(['available', 'tombstoned']),
  rowLabelWidth: PropTypes.number, // Row label column width in pixels (enhanced mode only)
  inheritanceMode: AvailabilityPropTypes.inheritanceMode, // Enhanced availability inheritance mode
  colorScheme: AvailabilityPropTypes.colorScheme, // One of AVAILABILITY_COLOR_SCHEMES
};

const WrappedDataProductAvailability = NeonContext.getWrappedComponent(DataProductAvailability);

export default WrappedDataProductAvailability;
