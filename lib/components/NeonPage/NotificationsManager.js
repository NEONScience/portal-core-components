import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import Cookies from 'universal-cookie';
import { Subject } from 'rxjs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import RouteService from '../../service/RouteService';
import LiferayNotifications from './LiferayNotifications';
import { generateNotificationId, getLiferayNotificationsApiPath } from '../../util/liferayNotificationsUtil';
import { getJson } from '../../util/rxUtil';
import { existsNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
const myAccountLink = /*#__PURE__*/ _jsx(Link, {
    href: NeonEnvironment.route.buildAccountRoute(),
    target: "_blank",
    children: "My Account"
});
const contactUsLink = /*#__PURE__*/ _jsx(Link, {
    href: RouteService.getContactUsPath(),
    target: "_blank",
    children: "Contact Us"
});
/* eslint-disable react/jsx-one-expression-per-line */ const TOKEN_EXPIRY_MESSAGE = /*#__PURE__*/ _jsxs("div", {
    children: [
        /*#__PURE__*/ _jsx(Typography, {
            variant: "subtitle2",
            gutterBottom: true,
            children: "API Token Expiration Notice"
        }),
        /*#__PURE__*/ _jsxs(Typography, {
            variant: "body2",
            children: [
                "An API Token associated with your account is expiring soon. If you would like a new token, please navigate to your ",
                myAccountLink,
                " page. At the bottom of your account page, click on the “Get API Token” button. You can delete an expired token by clicking the three dots under the Actions column. If you have any questions or issues, please let us know through our ",
                contactUsLink,
                " form."
            ]
        })
    ]
});
/* eslint-enable react/jsx-one-expression-per-line */ const notificationsReducer = (state, action)=>{
    const newState = {
        ...state
    };
    switch(action.type){
        case 'fetchNotifications':
            newState.fetchStatus = FETCH_STATUS.FETCHING;
            return newState;
        case 'fetchNotificationsSuccess':
            newState.fetchStatus = FETCH_STATUS.SUCCESS;
            return newState;
        case 'fetchNotificationsError':
            newState.fetchStatus = FETCH_STATUS.ERROR;
            return newState;
        case 'userInfoNotificationsFetchCompleted':
            newState.userInfoNotificationsFetchCompleted = true;
            return newState;
        case 'setUserInfoNotifications':
            newState.userInfoNotifications = action.userInfoNotifications;
            return newState;
        default:
            return state;
    }
};
const cookies = new Cookies();
const defaultProps = {
    initialNotification: null
};
const NotificationsManager = (inProps)=>{
    const { initialNotification } = resolveProps(defaultProps, inProps);
    const cancellationSubject$ = useMemo(()=>new Subject(), []);
    const dismissedNotificationsCookie = cookies.get('dismissed-notifications');
    const notificationDismissals = useMemo(()=>{
        if (dismissedNotificationsCookie) {
            return dismissedNotificationsCookie;
        }
        return [];
    }, [
        dismissedNotificationsCookie
    ]);
    const initialFetchStatusState = {
        fetchStatus: null,
        userInfoNotificationsFetchCompleted: false,
        userInfoNotifications: []
    };
    let initialNotifications = [];
    if (initialNotification !== null && initialNotification.length) {
        const notificationPropId = generateNotificationId(initialNotification);
        initialFetchStatusState.fetchStatus = 'success';
        initialNotifications = [
            {
                id: notificationPropId,
                message: initialNotification,
                dismissed: notificationDismissals.includes(notificationPropId)
            }
        ];
    }
    const [{ isActive, auth: { userData } }] = NeonContext.useNeonContextState();
    const [fetchNotificationState, fetchNotificationDispatch] = useReducer(notificationsReducer, initialFetchStatusState);
    const [manualNotifications, setManualNotifications] = useState(initialNotifications);
    const [liferayNotifications, setLiferayNotifications] = useState([]);
    const { userInfoNotificationsFetchCompleted, userInfoNotifications } = fetchNotificationState;
    const handleFetchNotificationsSuccess = useCallback((response)=>{
        fetchNotificationDispatch({
            type: 'fetchNotificationsSuccess'
        });
        if (!Array.isArray(response.notifications)) {
            return;
        }
        const newNotifications = [
            ...liferayNotifications
        ];
        response.notifications.forEach((message)=>{
            const id = generateNotificationId(message);
            const dismissed = notificationDismissals.includes(id);
            newNotifications.push({
                id,
                message,
                dismissed
            });
        });
        setLiferayNotifications(newNotifications);
    }, [
        fetchNotificationDispatch,
        setLiferayNotifications,
        liferayNotifications,
        notificationDismissals
    ]);
    // If the endpoint fails don't bother with any visible error. Just let it go.
    const handleFetchNotificationsError = useCallback(()=>{
        fetchNotificationDispatch({
            type: 'fetchNotificationsError'
        });
        setLiferayNotifications([]);
    }, [
        fetchNotificationDispatch,
        setLiferayNotifications
    ]);
    const handleHideNotifications = ()=>{
        const dismissNotifications = [
            ...manualNotifications,
            ...liferayNotifications,
            ...userInfoNotifications
        ];
        const updatedDismissals = dismissNotifications.map((n)=>n.id);
        cookies.set('dismissed-notifications', updatedDismissals, {
            path: '/',
            maxAge: 86400
        });
        if (existsNonEmpty(manualNotifications)) {
            setManualNotifications(manualNotifications.map((n)=>({
                    ...n,
                    dismissed: true
                })));
        }
        if (existsNonEmpty(liferayNotifications)) {
            setLiferayNotifications(liferayNotifications.map((n)=>({
                    ...n,
                    dismissed: true
                })));
        }
        if (existsNonEmpty(userInfoNotifications)) {
            fetchNotificationDispatch({
                type: 'setUserInfoNotifications',
                userInfoNotifications: userInfoNotifications.map((n)=>({
                        ...n,
                        dismissed: true
                    }))
            });
        }
    };
    /**
   Effect - Fetch liferay notifications
  */ useEffect(()=>{
        if (fetchNotificationState.fetchStatus !== null) {
            return;
        }
        if (NeonEnvironment.auth0DisableApi) {
            fetchNotificationDispatch({
                type: 'fetchNotificationsSuccess'
            });
            return;
        }
        fetchNotificationDispatch({
            type: 'fetchNotifications'
        });
        getJson(getLiferayNotificationsApiPath(), handleFetchNotificationsSuccess, handleFetchNotificationsError, cancellationSubject$, undefined, true);
    }, [
        fetchNotificationState,
        handleFetchNotificationsSuccess,
        handleFetchNotificationsError,
        cancellationSubject$,
        notificationDismissals
    ]);
    /**
   Effect - Listen for userData/auth fetch
  */ useEffect(()=>{
        if (!userData || userInfoNotificationsFetchCompleted) {
            return;
        }
        // Verifies user is logged in
        if (!isActive || !userData?.data?.user) {
            return;
        }
        fetchNotificationDispatch({
            type: 'userInfoNotificationsFetchCompleted'
        });
        if (userData?.data?.expiringApiToken === true) {
            const idObject = {
                message: TOKEN_EXPIRY_MESSAGE
            };
            const id = generateNotificationId(JSON.stringify(idObject));
            const dismissed = notificationDismissals.includes(id);
            const newNotifications = [
                ...userInfoNotifications
            ];
            const newNotification = {
                id,
                dismissed,
                message: TOKEN_EXPIRY_MESSAGE,
                isReactNode: true
            };
            newNotifications.push(newNotification);
            fetchNotificationDispatch({
                type: 'setUserInfoNotifications',
                userInfoNotifications: newNotifications
            });
        }
    }, [
        userData,
        userInfoNotificationsFetchCompleted,
        isActive,
        fetchNotificationDispatch,
        notificationDismissals,
        userInfoNotifications
    ]);
    const appliedNotifications = [
        ...manualNotifications,
        ...liferayNotifications,
        ...userInfoNotifications
    ];
    return /*#__PURE__*/ _jsx(LiferayNotifications, {
        notifications: appliedNotifications,
        onHideNotifications: handleHideNotifications
    });
};
export default NotificationsManager;
