import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Link from '@mui/material/Link';
import RouteService from '../../service/RouteService';
import Theme from '../Theme/Theme';
import { isStringNonEmpty } from '../../util/typeUtil';
import { LATEST_AND_PROVISIONAL } from '../../service/ReleaseService';
const BundleContentBuilder = {
    getParentProductLink: (dataProduct, release)=>{
        const isRelease = isStringNonEmpty(release) && release !== LATEST_AND_PROVISIONAL;
        const href = RouteService.getProductDetailPath(dataProduct.productCode, isRelease ? release : undefined);
        return /*#__PURE__*/ _jsx(Link, {
            href: href,
            target: "_blank",
            children: `${dataProduct.productName} (${dataProduct.productCode})`
        });
    },
    getBundledLink: ()=>{
        const href = RouteService.getDataProductBundlesPath();
        return /*#__PURE__*/ _jsx(Link, {
            href: href,
            target: "_blank",
            children: "bundled"
        });
    },
    buildManyParentsMainContent: (dataProducts, release)=>/*#__PURE__*/ _jsx("ul", {
            style: {
                margin: Theme.spacing(1, 0)
            },
            children: dataProducts.map((dataProduct)=>/*#__PURE__*/ _jsx("li", {
                    children: BundleContentBuilder.getParentProductLink(dataProduct, release)
                }, dataProduct.productCode))
        }),
    buildDefaultTitleContent: (dataProduct, release)=>{
        const isRelease = isStringNonEmpty(release) && release !== LATEST_AND_PROVISIONAL;
        const bundleParentLink = BundleContentBuilder.getParentProductLink(dataProduct, isRelease ? release : undefined);
        const bundledLink = BundleContentBuilder.getBundledLink();
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                "This data product ",
                isRelease ? 'release ' : '',
                "is ",
                bundledLink,
                " into ",
                bundleParentLink
            ]
        });
    },
    buildDefaultSplitTitleContent: (isRelease, terminalChar)=>{
        const bundledLink = BundleContentBuilder.getBundledLink();
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                "This data product ",
                isRelease ? 'release ' : '',
                "is ",
                bundledLink,
                " into the following data product",
                isRelease ? ' releases' : 's',
                `${terminalChar}`
            ]
        });
    },
    buildDefaultSubTitleContent: (forwardAvailability, hasManyParents)=>// eslint-disable-next-line react/jsx-no-useless-fragment
        /*#__PURE__*/ _jsx(_Fragment, {
            children: forwardAvailability ? /*#__PURE__*/ _jsx(_Fragment, {
                children: "It is not available as a standalone download. Data availability shown below reflects availability of the entire bundle."
            }) : /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    "It is not available as a standalone download. Data availability information and data product download is only available through the bundle data ",
                    hasManyParents ? 'products' : 'product',
                    "."
                ]
            })
        })
};
Object.freeze(BundleContentBuilder);
export default BundleContentBuilder;
