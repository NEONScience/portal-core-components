import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import { makeStyles } from '@/components/Theme/makeStyles';

const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: theme.spacing(2.5),
    '& tt': {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
  },
}));

export default function DocBlock(props) {
  const { classes } = useStyles();
  const { children } = props;
  return (
    <Typography className={classes.root} component="div">
      {children}
    </Typography>
  );
}

DocBlock.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};
