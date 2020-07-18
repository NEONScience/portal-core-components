import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import NeonUtilityBar from '../NeonUtilityBar/NeonUtilityBar';
import NeonMenu from '../NeonMenu/NeonMenu';

import { ROUTES, getFullRoute, buildAccountRoute } from '../../routing/routes';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
    zIndex: 2000,
  },
}));

const NeonHeader = forwardRef((props, ref) => {
  const classes = useStyles();
  const { notifications, onShowNotifications } = props;

  const notificationsProps = (typeof onShowNotifications === 'function' ? {
    notifications, onShowNotifications,
  } : {});

  return (
    <div ref={ref} className={classes.root} data-selenium="neon-header">
      <NeonUtilityBar />
      <NeonMenu
        loginPath={getFullRoute(ROUTES.LOGIN)}
        logoutPath={getFullRoute(ROUTES.LOGOUT)}
        accountPath={buildAccountRoute()}
        {...notificationsProps}
      />
      <Divider />
    </div>
  );
});

NeonHeader.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      dismissed: PropTypes.bool.isRequired,
    }),
  ),
  onShowNotifications: PropTypes.func,
};

NeonHeader.defaultProps = {
  notifications: [],
  onShowNotifications: null,
};

export default NeonHeader;
