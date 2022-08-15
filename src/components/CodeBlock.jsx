import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import SyntaxHighlight from '../lib_components/components/SyntaxHighlight';
import Theme from '../lib_components/components/Theme/Theme';

import 'highlight.js/styles/github-dark-dimmed.css';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    '& code': {
      padding: theme.spacing(0, 2),
    },
  },
}));

export default function CodeBlock(props) {
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

CodeBlock.defaultProps = {
  language: 'typescript',
};
