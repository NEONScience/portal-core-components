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
import LiferayNotifications from './LiferayNotifications';
import {
  generateNotificationId,
  getLiferayNotificationsApiPath,
} from '../../util/liferayNotificationsUtil';
import { getJson } from '../../util/rxUtil';
import { existsNonEmpty } from '../../util/typeUtil';

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

const cookies = new Cookies();

const NotificationsManager = (props) => {
  const { initialNotification } = props;
  const notificationDismissals = cookies.get('dismissed-notifications') || [];
  const cancellationSubject$ = new Subject();

  let initialNotifications = [];
  if (initialNotification !== null && initialNotification.length) {
    const notificationPropId = generateNotificationId(initialNotification);
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
  const [fetchNotificationsStatus, setFetchNotificationsStatus] = useState(null);
  const [manualNotifications, setManualNotifications] = useState(initialNotifications);
  const [liferayNotifications, setLiferayNotifications] = useState([]);
  const [userInfoNotifications, setUserInfoNotifications] = useState([]);
  const [isUserStatusNotificationsFetched, setIsUserStatusNotificationsFetched] = useState(false);

  const handleFetchNotificationsSuccess = (response) => {
    setFetchNotificationsStatus('success');
    if (!Array.isArray(response.notifications)) { return; }
    const newNotifications = [...liferayNotifications];
    response.notifications.forEach((message) => {
      const id = generateNotificationId(message);
      const dismissed = notificationDismissals.includes(id);
      newNotifications.push({ id, message, dismissed });
    });
    setLiferayNotifications(newNotifications);
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
      const newNotifications = [...userInfoNotifications];
      const newNotification = {
        id,
        dismissed,
        message: TOKEN_EXPIRY_MESSAGE,
        isReactNode: true,
      };
      newNotifications.push(newNotification);
      setUserInfoNotifications(newNotifications);
    }
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  const handleFetchNotificationsError = () => {
    setFetchNotificationsStatus('error');
  };

  const handleHideNotifications = () => {
    const dismissNotifications = [
      ...manualNotifications,
      ...liferayNotifications,
      ...userInfoNotifications,
    ];
    const updatedDismissals = dismissNotifications.map((n) => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, { path: '/', maxAge: 86400 });
    if (existsNonEmpty(manualNotifications)) {
      setManualNotifications(manualNotifications.map((n) => ({ ...n, dismissed: true })));
    }
    if (existsNonEmpty(liferayNotifications)) {
      setLiferayNotifications(liferayNotifications.map((n) => ({ ...n, dismissed: true })));
    }
    if (existsNonEmpty(userInfoNotifications)) {
      setUserInfoNotifications(userInfoNotifications.map((n) => ({ ...n, dismissed: true })));
    }
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

  const appliedNotifications = [
    ...manualNotifications,
    ...liferayNotifications,
    ...userInfoNotifications,
  ];

  return (
    <LiferayNotifications
      notifications={appliedNotifications}
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
