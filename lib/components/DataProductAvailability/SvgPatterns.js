import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Theme, { COLORS } from '../Theme/Theme';
/**
   SVG Patterns
   Pattern shapes borrowed from https://github.com/iros/patternfills
   And edited here to be theme-colored.
*/ const svgPatternsSrc = {
    horizontalStripeSecondaryBlue2: {
        dim: 8,
        node: /*#__PURE__*/ _jsxs("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "8",
            height: "8",
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    x: "0",
                    y: "0",
                    width: "8",
                    height: "8",
                    fill: COLORS.LIGHT_BLUE[100]
                }),
                /*#__PURE__*/ _jsx("rect", {
                    x: "0",
                    y: "0",
                    width: "8",
                    height: "2",
                    fill: COLORS.LIGHT_BLUE[300]
                }),
                /*#__PURE__*/ _jsx("rect", {
                    x: "0",
                    y: "4",
                    width: "8",
                    height: "2",
                    fill: COLORS.LIGHT_BLUE[300]
                })
            ]
        })
    },
    diagonalStripeSecondaryBlue3: {
        dim: 10,
        node: /*#__PURE__*/ _jsxs("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "10",
            height: "10",
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    x: "0",
                    y: "0",
                    width: "10",
                    height: "10",
                    fill: COLORS.LIGHT_BLUE[100]
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2",
                    stroke: Theme.palette.secondary.main,
                    strokeWidth: "2"
                })
            ]
        })
    }
};
export default function SvgPatterns() {
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: Object.keys(svgPatternsSrc).map((pattern)=>{
            const { dim, node } = svgPatternsSrc[pattern];
            const base64 = btoa(ReactDOMServer.renderToStaticMarkup(node));
            return /*#__PURE__*/ _jsx("pattern", {
                id: pattern,
                patternUnits: "userSpaceOnUse",
                width: dim,
                height: dim,
                children: /*#__PURE__*/ _jsx("image", {
                    xlinkHref: `data:image/svg+xml;base64,${base64}`,
                    x: "0",
                    y: "0",
                    width: dim,
                    height: dim
                })
            }, pattern);
        })
    });
}
export const SvgPatternsString = ()=>ReactDOMServer.renderToStaticMarkup(SvgPatterns());
