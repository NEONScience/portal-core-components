import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import Theme, { COLORS } from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  notification: {
    backgroundColor: COLORS.YELLOW[700],
    '& a': {
      color: `${theme.palette.secondary.light} !important`,
    },
  },
}));

const LiferayNotifications = (props) => {
  const classes = useStyles(Theme);
  const { notifications, onHideNotifications } = props;

  if (!notifications.length || notifications.every(n => n.dismissed)) { return null; }

  const renderNotificationContent = () => (
    <div id="neon-data-portal-notifications">
      {notifications.map(notification => (
        <div
          key={notification.id}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: notification.message }}
        />
      ))}
    </div>
  );

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      ContentProps={{ 'aria-describedby': 'neon-data-portal-notifications' }}
    >
      <SnackbarContent
        className={classes.notification}
        message={renderNotificationContent()}
        action={(typeof onHideNotifications === 'function' ? (
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={onHideNotifications}
          >
            <CloseIcon />
          </IconButton>
        ) : null)}
      />
    </Snackbar>
  );
};

LiferayNotifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      dismissed: PropTypes.bool.isRequired,
    }),
  ),
  onHideNotifications: PropTypes.func,
};

LiferayNotifications.defaultProps = {
  notifications: [],
  onHideNotifications: null,
};

export default LiferayNotifications;
