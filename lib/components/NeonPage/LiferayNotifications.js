import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles()((theme)=>({
        notification: {
            color: theme.palette.text.primary,
            backgroundColor: COLORS.GOLD[50],
            border: `1px solid ${COLORS.GOLD[300]}`,
            borderRadius: '4px',
            marginLeft: theme.spacing(3),
            [theme.breakpoints.up('sm')]: {
                maxWidth: '75%'
            },
            [theme.breakpoints.up('md')]: {
                maxWidth: '50%'
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: '33%'
            }
        },
        notificationDiv: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2)
        }
    }));
const defaultProps = {
    notifications: [],
    onHideNotifications: null
};
const LiferayNotifications = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { classes } = useStyles();
    const { notifications, onHideNotifications } = props;
    if (!notifications.length || notifications.every((n)=>n.dismissed)) {
        return null;
    }
    const renderNotificationContent = ()=>/*#__PURE__*/ _jsx("div", {
            id: "neon-data-portal-notifications",
            children: notifications.map((notification)=>{
                if (notification.isReactNode === true) {
                    return /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: classes.notificationDiv,
                                children: notification.message
                            }),
                            /*#__PURE__*/ _jsx(Divider, {})
                        ]
                    }, notification.id);
                }
                return /*#__PURE__*/ _jsxs("div", {
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                            className: classes.notificationDiv,
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML: {
                                __html: notification.message
                            }
                        }),
                        /*#__PURE__*/ _jsx(Divider, {})
                    ]
                }, notification.id);
            })
        });
    return /*#__PURE__*/ _jsx(Snackbar, {
        open: true,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
        },
        slotProps: {
            content: {
                'aria-describedby': 'neon-data-portal-notifications'
            }
        },
        children: /*#__PURE__*/ _jsx(SnackbarContent, {
            className: classes.notification,
            message: renderNotificationContent(),
            action: typeof onHideNotifications === 'function' ? /*#__PURE__*/ _jsx(IconButton, {
                color: "default",
                size: "small",
                "aria-label": "close",
                onClick: onHideNotifications,
                children: /*#__PURE__*/ _jsx(CloseIcon, {})
            }, "close") : null
        })
    });
};
LiferayNotifications.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        message: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.string
        ]).isRequired,
        dismissed: PropTypes.bool.isRequired
    })),
    onHideNotifications: PropTypes.func
};
export default LiferayNotifications;
