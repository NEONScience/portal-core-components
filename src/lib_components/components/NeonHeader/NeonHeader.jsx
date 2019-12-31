import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import NeonUtilityBar from '../NeonUtilityBar/NeonUtilityBar';
import NeonMenu from '../NeonMenu/NeonMenu';

import { ROUTES, getFullRoute, buildAccountRoute } from '../../routing/routes';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export default function NeonHeader() {
  const classes = useStyles();

  return (
    <div className={classes.root} data-selenium="neon-header">
      <NeonUtilityBar />
      <NeonMenu
        loginPath={getFullRoute(ROUTES.LOGIN)}
        logoutPath={getFullRoute(ROUTES.LOGOUT)}
        accountPath={buildAccountRoute()}
      />
      <Divider />
    </div>
  );
}
