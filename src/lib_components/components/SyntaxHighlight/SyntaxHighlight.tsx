import React, { useEffect, useRef } from 'react';

import { makeStyles } from 'tss-react/mui';
import { Theme as MuiTheme } from '@mui/material';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';

import { resolveProps } from '../../util/defaultProps';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);

const useStyles = makeStyles()((muiTheme: MuiTheme) => ({
  root: {
    margin: muiTheme.spacing(2, 0),
    '& code': {
      padding: `${muiTheme.spacing(0, 2)} !important`,
    },
  },
}));

export interface SyntaxHighlightProps {
  children: React.ReactNode;
  language?: string;
  style?: React.CSSProperties;
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
  const { classes } = useStyles();
  const {
    children,
    language,
    style,
  }: SyntaxHighlightProps = props;
  const codeRef: React.RefObject<HTMLElement|undefined> = useRef(undefined);

  useEffect(() => {
    const element = codeRef.current;
    if (!element) { return; }
    hljs.highlightElement(element);
  }, [codeRef]);

  return (
    <pre className={classes.root} style={style}>
      <code ref={codeRef as React.RefObject<HTMLElement>} className={language}>
        {children}
      </code>
    </pre>
  );
};

export default SyntaxHighlight;
