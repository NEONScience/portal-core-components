import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import Theme, { COLORS } from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';

const useStyles = makeStyles((theme) => ({
  notification: {
    color: theme.palette.text.primary,
    backgroundColor: COLORS.GOLD[50],
    border: `1px solid ${COLORS.GOLD[300]}`,
    borderRadius: '4px',
    marginLeft: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      maxWidth: '75%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '33%',
    },
  },
}));

const defaultProps = {
  notifications: [],
  onHideNotifications: null,
};

const LiferayNotifications = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const classes = useStyles(Theme);
  const { notifications, onHideNotifications } = props;

  if (!notifications.length || notifications.every((n) => n.dismissed)) { return null; }

  const renderNotificationContent = () => (
    <div id="neon-data-portal-notifications">
      {notifications.map((notification) => (
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
            color="default"
            size="small"
            key="close"
            aria-label="close"
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

export default LiferayNotifications;
