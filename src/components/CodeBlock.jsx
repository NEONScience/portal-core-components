import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';

import SyntaxHighlight from '@/components/SyntaxHighlight';
import Theme from '@/components/Theme/Theme';
import { resolveProps } from '@/util/defaultProps';

import 'highlight.js/styles/github-dark-dimmed.css';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    '& code': {
      padding: theme.spacing(0, 2),
    },
  },
}));

const defaultProps = {
  language: 'typescript',
};

export default function CodeBlock(inProps) {
  const props = resolveProps(defaultProps, inProps);
  const classes = useStyles(Theme);
  const { language, children, ...other } = props;
  return (
    <SyntaxHighlight language={language} className={classes.root} {...other}>
      {children}
    </SyntaxHighlight>
  );
}

CodeBlock.propTypes = {
  language: PropTypes.string,
  children: PropTypes.string.isRequired,
};
