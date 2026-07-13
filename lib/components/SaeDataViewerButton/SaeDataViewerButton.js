import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import SaeDataViewerIcon from '@mui/icons-material/TimelineOutlined';
import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
/**
   Setup: CSS classes
*/ const useStyles = makeStyles()((theme)=>({
        productPaperButton: {
            whiteSpace: 'nowrap',
            marginBottom: theme.spacing(1.5),
            borderColor: theme.palette.primary.main,
            '& span': {
                pointerEvents: 'none'
            }
        }
    }));
const defaultProps = {
    isFullWidth: true,
    site: '',
    product: '',
    startDate: '',
    endDate: ''
};
/**
   Main Function
*/ const SaeDataViewerButton = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { isFullWidth, site, product, startDate, endDate } = props;
    const classes = useStyles(Theme);
    const saeButtonName = 'SAE Data Viewer';
    const tooltip = 'Launch the SAE data visuialization tool.';
    const url = RouteService.getSaeViewerUrlPath(product, site, startDate, endDate);
    return /*#__PURE__*/ _jsx(Tooltip, {
        placement: "right",
        title: tooltip,
        children: /*#__PURE__*/ _jsx(Button, {
            href: url.toString(),
            target: "_blank",
            rel: "noopener noreferrer",
            variant: "outlined",
            "data-gtm": "sae-data-viewer-button",
            className: classes.productPaperButton,
            fullWidth: isFullWidth,
            color: "primary",
            endIcon: /*#__PURE__*/ _jsx(SaeDataViewerIcon, {}),
            children: saeButtonName
        })
    });
};
SaeDataViewerButton.propTypes = {
    isFullWidth: PropTypes.bool,
    site: PropTypes.string,
    product: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string
};
const WrappedSaeDataViewer = Theme.getWrappedComponent(NeonContext.getWrappedComponent(SaeDataViewerButton));
export default WrappedSaeDataViewer;
