import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import AvailabilityContext from './AvailabilityContext';
import BasicAvailabilityInterface from './BasicAvailabilityInterface';
import EnhancedAvailabilityInterface from './EnhancedAvailabilityInterface';
import { AvailabilityPropTypes } from './AvailabilityUtils';
const defaultProps = {
    sites: [],
    siteCodes: [],
    dataProducts: [],
    view: null,
    sortMethod: null,
    sortDirection: 'ASC',
    disableSelection: false,
    delineateRelease: false,
    availabilityStatusType: null
};
const DataProductAvailability = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { sites: enhancedSites, siteCodes: basicSiteCodes, ...other } = props;
    // Favor enhanced view if we have the enhanced prop
    return enhancedSites.length ? /*#__PURE__*/ _jsx(AvailabilityContext.Provider, {
        ...props,
        children: /*#__PURE__*/ _jsx(EnhancedAvailabilityInterface, {
            sites: enhancedSites,
            ...other
        })
    }) : /*#__PURE__*/ _jsx(BasicAvailabilityInterface, {
        siteCodes: basicSiteCodes,
        ...other
    });
};
DataProductAvailability.propTypes = {
    sites: AvailabilityPropTypes.enhancedSites,
    siteCodes: AvailabilityPropTypes.basicSiteCodes,
    dataProducts: AvailabilityPropTypes.dataProducts,
    view: PropTypes.oneOf([
        'summary',
        'sites',
        'states',
        'domains',
        'ungrouped',
        'products'
    ]),
    sortMethod: PropTypes.oneOf([
        'sites',
        'states',
        'domains'
    ]),
    sortDirection: PropTypes.oneOf([
        'ASC',
        'DESC'
    ]),
    disableSelection: PropTypes.bool,
    delineateRelease: PropTypes.bool,
    availabilityStatusType: PropTypes.oneOf([
        'available',
        'tombstoned'
    ])
};
const WrappedDataProductAvailability = Theme.getWrappedComponent(NeonContext.getWrappedComponent(DataProductAvailability));
export default WrappedDataProductAvailability;
