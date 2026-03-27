import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Warning';
import NeonContext from '../NeonContext/NeonContext';
import { resolveProps } from '../../util/defaultProps';
const defaultProps = {
    message: 'Loading Sites...'
};
export default function AvailabilityPending(inProps) {
    const props = resolveProps(defaultProps, inProps);
    const [{ isFinal: neonContextIsFinal, hasError: neonContextHasError }] = NeonContext.useNeonContextState();
    const { message } = props;
    if (neonContextIsFinal && !neonContextHasError) {
        return null;
    }
    const status = neonContextIsFinal && neonContextHasError ? 'error' : 'loading';
    return /*#__PURE__*/ _jsx(Card, {
        style: {
            width: '100%'
        },
        children: /*#__PURE__*/ _jsx(CardContent, {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                flexDirection: 'column'
            },
            children: status === 'loading' ? /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        component: "h6",
                        gutterBottom: true,
                        children: message
                    }),
                    /*#__PURE__*/ _jsx(CircularProgress, {})
                ]
            }) : /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(ErrorIcon, {
                        fontSize: "large",
                        color: "error"
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        component: "h6",
                        style: {
                            marginTop: '8px'
                        },
                        children: "Error - Unable to Load Sites"
                    })
                ]
            })
        })
    });
}
AvailabilityPending.propTypes = {
    message: PropTypes.string
};
