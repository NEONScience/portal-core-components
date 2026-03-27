import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useRef, useLayoutEffect, useState } from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import DocumentService from '../../service/DocumentService';
import ErrorCard from '../Card/ErrorCard';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
import PdfDocumentViewer from './PdfDocumentViewer';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        container: {
            width: '100%'
        },
        iframe: {
            border: 'none'
        }
    }));
const noop = ()=>{};
const breakpoints = [
    0,
    675,
    900,
    1200
];
const ratios = [
    '8:11',
    '3:4',
    '4:4',
    '4:3'
];
const calcAutoHeight = (width)=>{
    const breakIdx = breakpoints.reduce((acc, breakpoint, idx)=>width >= breakpoint ? idx : acc, 0);
    const ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
    let mult = 4 / 3;
    if (ratio) {
        mult = (parseFloat(ratio[2]) || 1) / (parseFloat(ratio[1]) || 1);
    }
    return Math.floor(width * mult);
};
const defaultProps = {
    fullUrlPath: undefined
};
const DocumentViewer = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { document, width, fullUrlPath } = props;
    const appliedUrlPath = isStringNonEmpty(fullUrlPath) ? fullUrlPath : NeonEnvironment.getFullApiPath('documents');
    const dataUrl = `${appliedUrlPath}/${document.name}?inline=true&fallback=html`;
    const isViewerDeviceSupported = DocumentService.isViewerDeviceSupported();
    const isPdfViewerSupported = DocumentService.isPdfViewerSupported(document);
    const isDocSupported = isViewerDeviceSupported || isPdfViewerSupported;
    const containerRef = useRef(undefined);
    const iframeRef = useRef(undefined);
    const [viewerWidth, setViewerWidth] = useState(width);
    const handleResizeCb = useCallback(()=>{
        const container = containerRef.current;
        const iframeElement = iframeRef.current;
        if (!container || !iframeElement) {
            return;
        }
        if (container.offsetParent === null || iframeElement.offsetParent === null) {
            return;
        }
        if (container.clientWidth === viewerWidth) {
            return;
        }
        const newWidth = container.clientWidth;
        setViewerWidth(newWidth);
        iframeElement.setAttribute('width', `${newWidth}`);
        iframeElement.setAttribute('height', `${calcAutoHeight(newWidth)}`);
    }, [
        containerRef,
        iframeRef,
        viewerWidth,
        setViewerWidth
    ]);
    useLayoutEffect(()=>{
        const element = iframeRef.current;
        if (!element) {
            return noop;
        }
        const parent = element.parentElement;
        if (!parent) {
            return noop;
        }
        handleResizeCb();
        if (typeof ResizeObserver !== 'function') {
            window.addEventListener('resize', handleResizeCb);
            return ()=>{
                window.removeEventListener('resize', handleResizeCb);
            };
        }
        let resizeObserver = new ResizeObserver(handleResizeCb);
        resizeObserver.observe(parent);
        return ()=>{
            if (!resizeObserver) {
                return;
            }
            resizeObserver.disconnect();
            resizeObserver = null;
        };
    }, [
        iframeRef,
        handleResizeCb
    ]);
    if (!isDocSupported) {
        return /*#__PURE__*/ _jsx("div", {
            className: classes.container,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "This document type is not supported"
            })
        });
    }
    if (!isViewerDeviceSupported && isPdfViewerSupported) {
        return /*#__PURE__*/ _jsx(PdfDocumentViewer, {
            ...props
        });
    }
    const renderObject = ()=>{
        if (!DocumentService.isViewerSupported(document)) {
            return /*#__PURE__*/ _jsx(ErrorCard, {
                title: "Document Error",
                message: "This document type is not supported or could not be displayed"
            });
        }
        return /*#__PURE__*/ _jsx("iframe", {
            ref: iframeRef,
            src: dataUrl,
            "aria-label": document.description,
            title: document.description,
            width: viewerWidth,
            height: calcAutoHeight(viewerWidth),
            className: classes.iframe
        });
    };
    return /*#__PURE__*/ _jsx("div", {
        ref: containerRef,
        className: classes.container,
        children: renderObject()
    });
};
export default DocumentViewer;
