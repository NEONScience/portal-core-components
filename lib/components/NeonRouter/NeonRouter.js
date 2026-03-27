import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import HistoryService from '../../util/historyUtil';
const NeonRouter = (props)=>{
    const { cleanPath, disableRedirect, children } = props;
    if (cleanPath !== false) {
        HistoryService.cleanPath();
    }
    const renderFallthrough = ()=>{
        if (disableRedirect === true) {
            return children;
        }
        return /*#__PURE__*/ _jsx(Navigate, {
            to: NeonEnvironment.getRouterBaseHomePath()
        });
    };
    return /*#__PURE__*/ _jsx(BrowserRouter, {
        children: /*#__PURE__*/ _jsxs(Routes, {
            children: [
                /*#__PURE__*/ _jsx(Route, {
                    path: NeonEnvironment.getRouterBaseHomePath(),
                    element: children
                }),
                /*#__PURE__*/ _jsx(Route, {
                    path: "*",
                    element: renderFallthrough()
                })
            ]
        })
    });
};
export default NeonRouter;
