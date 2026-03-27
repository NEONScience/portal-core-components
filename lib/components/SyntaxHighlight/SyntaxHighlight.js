import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        root: {
            margin: muiTheme.spacing(2, 0),
            '& code': {
                padding: `${muiTheme.spacing(0, 2)} !important`
            }
        }
    }));
const defaultProps = {
    language: 'typescript',
    style: undefined
};
/**
 * Syntax highlighter component based on:
 * https://github.com/bvaughn/react-highlight.js
 */ const SyntaxHighlight = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { children, language, style } = props;
    const codeRef = useRef(undefined);
    useEffect(()=>{
        const element = codeRef.current;
        if (!element) {
            return;
        }
        hljs.highlightElement(element);
    }, [
        codeRef
    ]);
    return /*#__PURE__*/ _jsx("pre", {
        className: classes.root,
        style: style,
        children: /*#__PURE__*/ _jsx("code", {
            ref: codeRef,
            className: language,
            children: children
        })
    });
};
export default SyntaxHighlight;
