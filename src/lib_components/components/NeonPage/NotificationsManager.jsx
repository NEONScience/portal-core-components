import React, {
  useState,
  useEffect,
} from 'react';
import { string } from 'prop-types';

import Cookies from 'universal-cookie';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import { getJsonObservable } from '../../util/rxUtil';
import LiferayNotifications from './LiferayNotifications';
import {
  generateNotificationId,
  getLiferayNotificationsApiPath,
} from '../../util/liferayNotificationsUtil';

const NotificationsManager = ({ initialNotification }) => {
  const cookies = new Cookies();
  const notificationDismissals = cookies.get('dismissed-notifications') || [];

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
    fetches: { auth: authFetches },
  }] = NeonContext.useNeonContextState();
  const [fetchNotificationsStatus, setFetchNotificationsStatus] = useState(initialFetchStatus);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isAllNotificationsFetched, setIsAllNotificationsFetched] = useState(false);

  // Handle a successful response from the notifications endpoint
  const handleFetchNotificationsSuccess = (response, newNotifications) => {
    setFetchNotificationsStatus('success');

    if (!Array.isArray(response.notifications)) { return; }
    response.notifications.forEach((message) => {
      const id = generateNotificationId(message);
      const dismissed = notificationDismissals.includes(id);
      newNotifications.push({ id, message, dismissed });
    });
  };

  const handleUserInfoNotifications = (newNotifications) => {
    // verifies user is logged in
    if (!isActive || !userData?.data?.user) { return; }

    if (userData?.data?.expiringApiToken) {
      const message = 'An API Token associated with your account has expired.';
      const id = generateNotificationId(message);
      const dismissed = notificationDismissals.includes(id);
      newNotifications.push({ id, message, dismissed });
    }
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  const handleFetchNotificationsError = () => {
    setFetchNotificationsStatus('error');
    setNotifications([]);
  };

  const handleHideNotifications = () => {
    const updatedDismissals = notifications.map((n) => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, { path: '/', maxAge: 86400 });
    setNotifications(notifications.map((n) => ({ ...n, dismissed: true })));
  };

  const handleNotificationSetup = async () => {
    if (
      isAllNotificationsFetched
      || fetchNotificationsStatus === 'fetching'
    ) { return; }

    setFetchNotificationsStatus('fetching');
    getJsonObservable(
      getLiferayNotificationsApiPath(),
      undefined,
      true,
    ).subscribe({
      next: (values) => {
        const newNotifications = [];
        handleFetchNotificationsSuccess(
          values.response,
          newNotifications,
        );
        handleUserInfoNotifications(newNotifications);
        setNotifications([...newNotifications]);
        setIsAllNotificationsFetched(true);
      },
      error: () => { handleFetchNotificationsError(); },
    });
  };

  /**
   Effect - Listen for userData/auth fetch
  */
  useEffect(() => {
    if (
      authFetches.status !== FETCH_STATUS.SUCCESS
      && authFetches.status !== FETCH_STATUS.ERROR
    ) { return; }

    handleNotificationSetup();
  }, [userData, authFetches]); // eslint-disable-line react-hooks/exhaustive-deps

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
