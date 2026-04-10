import React, {
  useState,
  useEffect,
} from 'react';
import { string } from 'prop-types';

import Cookies from 'universal-cookie';
import { Subject } from 'rxjs';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import RouteService from '../../service/RouteService';
import { getJson } from '../../util/rxUtil';
import LiferayNotifications from './LiferayNotifications';
import {
  generateNotificationId,
  getLiferayNotificationsApiPath,
} from '../../util/liferayNotificationsUtil';

const myAccountLink = (
  <Link href={NeonEnvironment.route.buildAccountRoute()} target="_blank">
    My Account
  </Link>
);

const contactUsLink = (
  <Link href={RouteService.getContactUsPath()} target="_blank">
    Contact Us
  </Link>
);

/* eslint-disable react/jsx-one-expression-per-line */
const TOKEN_EXPIRY_MESSAGE = (
  <div>
    <Typography variant="subtitle2" gutterBottom>
      API Token Expiration Notice
    </Typography>
    <Typography variant="body2">
      An API Token associated with your account is expiring soon. If you would
      like a new token, please navigate to your {myAccountLink} page.
      At the bottom of your account page,
      click on the “Get API Token” button. You can delete an expired token by
      clicking the three dots under the Actions column.
      If you have any questions or issues, please let us know through our {contactUsLink} form.
    </Typography>
  </div>
);
/* eslint-enable react/jsx-one-expression-per-line */

const NotificationsManager = (props) => {
  const { initialNotification } = props;
  const cookies = new Cookies();
  const notificationDismissals = cookies.get('dismissed-notifications') || [];
  const cancellationSubject$ = new Subject();

  let initialFetchStatus = null;
  let initialNotifications = [];
  if (initialNotification !== null && initialNotification.length) {
    const notificationPropId = generateNotificationId(initialNotification);
    initialFetchStatus = 'success';
    initialNotifications = [{
      id: notificationPropId,
      message: initialNotification,
      dismissed: notificationDismissals.includes(notificationPropId),
    }];
  }

  const [{
    isActive,
    auth: { userData },
  }] = NeonContext.useNeonContextState();
  const [fetchNotificationsStatus, setFetchNotificationsStatus] = useState(initialFetchStatus);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isUserStatusNotificationsFetched, setIsUserStatusNotificationsFetched] = useState(false);

  const handleFetchNotificationsSuccess = (response) => {
    setFetchNotificationsStatus('success');
    if (!Array.isArray(response.notifications)) { return; }
    const newNotifications = [...notifications];
    response.notifications.forEach((message) => {
      const id = generateNotificationId(message);
      const dismissed = notificationDismissals.includes(id);
      newNotifications.push({ id, message, dismissed });
    });
    setNotifications(newNotifications);
  };

  const handleUserInfoNotifications = () => {
    // verifies user is logged in
    if (!isActive || !userData?.data?.user) { return; }
    setIsUserStatusNotificationsFetched(true);
    if (userData?.data?.expiringApiToken === true) {
      const idObject = {
        message: TOKEN_EXPIRY_MESSAGE,
      };
      const id = generateNotificationId(JSON.stringify(idObject));
      const dismissed = notificationDismissals.includes(id);
      const newNotifications = [...notifications];
      const newNotification = {
        id,
        dismissed,
        message: TOKEN_EXPIRY_MESSAGE,
        isReactNode: true,
      };
      newNotifications.push(newNotification);
      setNotifications(newNotifications);
    }
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  const handleFetchNotificationsError = () => {
    setFetchNotificationsStatus('error');
  };

  const handleHideNotifications = () => {
    const updatedDismissals = notifications.map((n) => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, { path: '/', maxAge: 86400 });
    setNotifications(notifications.map((n) => ({ ...n, dismissed: true })));
  };

  /**
   Effect - Fetch liferay notifications
  */
  useEffect(() => {
    if (fetchNotificationsStatus !== null) { return; }
    setFetchNotificationsStatus('fetching');
    getJson(
      getLiferayNotificationsApiPath(),
      handleFetchNotificationsSuccess,
      handleFetchNotificationsError,
      cancellationSubject$,
      undefined,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotificationsStatus]);

  /**
   Effect - Listen for userData/auth fetch
  */
  useEffect(() => {
    if (!userData || isUserStatusNotificationsFetched) { return; }
    handleUserInfoNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isUserStatusNotificationsFetched]);

  return (
    <LiferayNotifications
      notifications={notifications}
      onHideNotifications={handleHideNotifications}
    />
  );
};

NotificationsManager.propTypes = {
  initialNotification: string,
};

NotificationsManager.defaultProps = {
  initialNotification: null,
};

export default NotificationsManager;
