import React, { useEffect, useRef } from 'react';

import {
  makeStyles,
  createStyles,
} from '@mui/styles';
import { Theme as MuiTheme } from '@mui/material';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';

import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { resolveProps } from '../../util/defaultProps';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    root: {
      margin: muiTheme.spacing(2, 0),
      '& code': {
        padding: `${muiTheme.spacing(0, 2)} !important`,
      },
    },
  })) as StylesHook;

export interface SyntaxHighlightProps {
  children: React.ReactNode,
  language?: string,
  style?: React.CSSProperties,
}

const defaultProps = {
  language: 'typescript',
  style: undefined,
};

/**
 * Syntax highlighter component based on:
 * https://github.com/bvaughn/react-highlight.js
 */
const SyntaxHighlight: React.FC<SyntaxHighlightProps> = (
  inProps: SyntaxHighlightProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps) as SyntaxHighlightProps;
  const classes = useStyles(Theme);
  const {
    children,
    language,
    style,
  }: SyntaxHighlightProps = props;
  const codeRef: React.MutableRefObject<HTMLElement|undefined> = useRef();

  useEffect(() => {
    const element = codeRef.current;
    if (!element) { return; }
    hljs.highlightElement(element);
  }, [codeRef]);

  return (
    <pre className={classes.root} style={style}>
      <code ref={codeRef as React.MutableRefObject<HTMLElement>} className={language}>
        {children}
      </code>
    </pre>
  );
};

export default SyntaxHighlight;
