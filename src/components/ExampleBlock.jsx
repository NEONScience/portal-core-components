import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';

import Theme from '../lib_components/components/Theme/Theme';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

export default function ExampleBlock(props) {
  const classes = useStyles(Theme);
  const { children } = props;
  return (
    <Container className={classes.root}>
      {children}
    </Container>
  );
}

ExampleBlock.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};
