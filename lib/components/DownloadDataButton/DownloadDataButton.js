import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
const DownloadDataDialog = /*#__PURE__*/ React.lazy(()=>import('../DownloadDataDialog/DownloadDataDialog'));
const useStyles = makeStyles(()=>({
        gtmCaptureButton: {
            '& span': {
                pointerEvents: 'none'
            }
        }
    }));
const defaultProps = {
    label: 'Download Data'
};
const DownloadDataButton = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { label, ...other } = props;
    const classes = useStyles();
    const [{ dialogOpen, productData }, dispatch] = DownloadDataContext.useDownloadDataState();
    function handleOpenDialog() {
        dispatch({
            type: 'setDialogOpen',
            open: true
        });
    }
    const gtmProps = {};
    if ((productData || {}).productCode) {
        gtmProps.className = classes.gtmCaptureButton;
        gtmProps['data-gtm-product-code'] = productData.productCode;
    }
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Button, {
                color: "primary",
                variant: "contained",
                // eslint-disable-next-line react/jsx-no-bind
                onClick: handleOpenDialog,
                "data-selenium": "download-data-button",
                endIcon: /*#__PURE__*/ _jsx(DownloadIcon, {}),
                ...gtmProps,
                ...other,
                children: label
            }),
            !dialogOpen ? null : /*#__PURE__*/ _jsx(Suspense, {
                fallback: null,
                children: /*#__PURE__*/ _jsx(DownloadDataDialog, {})
            })
        ]
    });
};
DownloadDataButton.propTypes = {
    label: PropTypes.string
};
const WrappedDownloadDataButton = Theme.getWrappedComponent(DownloadDataButton);
export default WrappedDownloadDataButton;
