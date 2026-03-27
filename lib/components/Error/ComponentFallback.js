import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Grid from '@mui/material/Grid';
import ErrorCard from '../Card/ErrorCard';
const ComponentFallback = (props)=>{
    const { error, resetErrorBoundary } = props;
    // eslint-disable-next-line no-console
    console.error(error);
    return /*#__PURE__*/ _jsx(Grid, {
        container: true,
        spacing: 2,
        children: /*#__PURE__*/ _jsx(Grid, {
            item: true,
            xs: 12,
            children: /*#__PURE__*/ _jsx(ErrorCard, {
                title: "Something broke",
                message: error.message,
                actionLabel: "Reset",
                onActionClick: resetErrorBoundary
            })
        })
    });
};
export default ComponentFallback;
