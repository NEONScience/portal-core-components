import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';

import Container from '@mui/material/Container';

import Theme from '@/components/Theme/Theme';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 'unset !important',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[50],
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

export default function ExampleBlock(props) {
  const classes = useStyles(Theme);
  const { column, children } = props;
  return (
    <Container
      className={classes.root}
      style={{ flexDirection: column ? 'column' : 'row' }}
    >
      {children}
    </Container>
  );
}

ExampleBlock.propTypes = {
  column: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

ExampleBlock.defaultProps = {
  column: false,
};
