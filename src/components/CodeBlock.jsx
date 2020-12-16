import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Highlight from 'react-highlight.js';
import '../../node_modules/highlight.js/styles/zenburn.css';

import Theme from '../lib_components/components/Theme/Theme';

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
    <Highlight language={language} className={classes.root} {...other}>
      {children}
    </Highlight>
  );
}

CodeBlock.propTypes = {
  language: PropTypes.string,
  children: PropTypes.string.isRequired,
};

CodeBlock.defaultProps = {
  language: 'typescript',
};
