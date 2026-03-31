import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import Logout from '@mui/icons-material/Logout';
import AuthService, { LOGOUT_REDIRECT_PATHS } from './AuthService';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';
import NeonSignInButtonState from '../NeonSignInButton/NeonSignInButtonState';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
export var NeonAuthType = /*#__PURE__*/ function(NeonAuthType) {
    NeonAuthType["REDIRECT"] = "REDIRECT";
    NeonAuthType["SILENT"] = "SILENT";
    return NeonAuthType;
}({});
export var NeonAuthDisplayType = /*#__PURE__*/ function(NeonAuthDisplayType) {
    NeonAuthDisplayType["MENU"] = "MENU";
    NeonAuthDisplayType["MENU_CUSTOM"] = "MENU_CUSTOM";
    return NeonAuthDisplayType;
}({});
/* eslint-enable react/no-unused-prop-types */ const useStyles = makeStyles((theme)=>({
        button: {
            whiteSpace: 'nowrap',
            // The following styles are !important overrides to styles applied by the drupal header.css
            // when NeonAuth is injected into the drupal header.
            color: `${theme.palette.primary.main} !important`,
            textTransform: 'uppercase !important',
            fontSize: '0.55rem !important',
            fontWeight: '600 !important',
            fontFamily: '"Inter",Helvetica,Arial,sans-serif !important',
            lineHeight: '1.75 !important'
        },
        loadingContainer: {
            display: 'flex',
            width: '64px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(0.5)
        },
        loadingContainerSpan: {
            marginRight: theme.spacing(1),
            color: theme.palette.grey[400]
        },
        accountMenuContainer: {
            '& :focus': {
                outline: 'none !important'
            }
        }
    }));
const UX_TIMEOUT_MS = 300;
const AccountMenu = (props)=>{
    const { accountPath, handleLogout } = props;
    const classes = useStyles(Theme);
    const [{ auth: { userData } }] = NeonContext.useNeonContextState();
    const user = userData?.data?.user;
    const containerRef = useRef(null);
    const [containerRefEl, setContainerRefEl] = useState(null);
    const belowLg = useMediaQuery(Theme.breakpoints.down('lg'));
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event)=>{
        setContainerRefEl(containerRef.current);
        setAnchorEl(event.currentTarget);
    };
    const handleMyAccountNav = ()=>{
        window.location.href = accountPath;
    };
    const handleClose = ()=>{
        setAnchorEl(null);
    };
    let avatarAlt;
    if (exists(user)) {
        if (isStringNonEmpty(user.name)) {
            avatarAlt = user.name;
        } else if (isStringNonEmpty(user.email)) {
            avatarAlt = user.email;
        }
    }
    const avatarContainerSx = {
        display: 'block',
        width: '64px',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: '-4px'
    };
    if (belowLg) {
        avatarContainerSx.marginTop = '-3px';
        avatarContainerSx.textAlign = 'right';
    }
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Box, {
                sx: avatarContainerSx,
                children: /*#__PURE__*/ _jsx(Tooltip, {
                    title: "My Account",
                    children: /*#__PURE__*/ _jsx(IconButton, {
                        onClick: handleClick,
                        size: "small",
                        autoFocus: false,
                        sx: {
                            padding: 0
                        },
                        "aria-controls": open ? 'account-menu' : undefined,
                        "aria-haspopup": "true",
                        "aria-expanded": open ? 'true' : undefined,
                        children: /*#__PURE__*/ _jsx(Avatar, {
                            alt: avatarAlt,
                            src: user?.picture,
                            sx: {
                                width: 32,
                                height: 32
                            },
                            children: avatarAlt?.charAt(0)?.toUpperCase()
                        })
                    })
                })
            }),
            /*#__PURE__*/ _jsx("div", {
                ref: containerRef,
                className: classes.accountMenuContainer,
                children: /*#__PURE__*/ _jsxs(Menu, {
                    container: containerRefEl,
                    anchorEl: anchorEl,
                    id: "account-menu",
                    open: open,
                    variant: "menu",
                    autoFocus: false,
                    disableAutoFocusItem: true,
                    onClose: handleClose,
                    onClick: handleClose,
                    slotProps: {
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0
                                }
                            }
                        }
                    },
                    transformOrigin: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'bottom'
                    },
                    children: [
                        /*#__PURE__*/ _jsxs(MenuItem, {
                            onClick: handleMyAccountNav,
                            children: [
                                /*#__PURE__*/ _jsx(Avatar, {
                                    style: {
                                        width: '24px',
                                        height: '24px'
                                    },
                                    sx: {
                                        width: 24,
                                        height: 24
                                    }
                                }),
                                ' My Account'
                            ]
                        }),
                        /*#__PURE__*/ _jsx(Divider, {}),
                        /*#__PURE__*/ _jsxs(MenuItem, {
                            onClick: ()=>handleLogout(),
                            children: [
                                /*#__PURE__*/ _jsx(ListItemIcon, {
                                    children: /*#__PURE__*/ _jsx(Logout, {
                                        fontSize: "small"
                                    })
                                }),
                                "Logout"
                            ]
                        })
                    ]
                })
            })
        ]
    });
};
const triggerAuth = (path, login, dispatch, redirectUriPath)=>{
    if (!path) return;
    // Give the browser time to render to allow for immediate feedback
    // by way of a spinner.
    dispatch({
        type: 'setAuthWorking',
        isAuthWorking: true
    });
    setTimeout(()=>{
        if (login) {
            AuthService.login(path, redirectUriPath);
        } else {
            AuthService.logout(path, redirectUriPath);
        }
    }, UX_TIMEOUT_MS);
};
const renderAuth = (props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch)=>{
    const { loginType, logoutType, displayType, loginPath, logoutPath, accountPath } = props;
    const handleLogin = ()=>{
        if (NeonEnvironment.enableGlobalSignInState) {
            // Notify observers the sign in button has been clicked.
            NeonSignInButtonState.sendNotification();
        }
        let appliedLoginType = loginType;
        // Default to redirect if WS isn't connected
        if (!isAuthWsConnected) {
            appliedLoginType = "REDIRECT";
        }
        const redirectUriPath = AuthService.getLoginRedirectUri();
        switch(appliedLoginType){
            case "SILENT":
                AuthService.loginSilently(dispatch, false, loginPath, redirectUriPath);
                break;
            case "REDIRECT":
            default:
                triggerAuth(loginPath, true, dispatch, redirectUriPath);
                break;
        }
    };
    const handleLogout = ()=>{
        let appliedLogoutType = logoutType;
        let redirectUriPath;
        // Default to redirect if WS isn't connected
        if (!isAuthWsConnected) {
            appliedLogoutType = "REDIRECT";
        }
        const appHomePath = NeonEnvironment.getRouterBaseHomePath();
        if (LOGOUT_REDIRECT_PATHS.indexOf(appHomePath) >= 0) {
            appliedLogoutType = "REDIRECT";
            redirectUriPath = NeonEnvironment.route.home();
        } else {
            // If not a auto redirect path, redirect back to the current path
            const currentPath = window.location.pathname;
            const hasPath = isStringNonEmpty(currentPath) && currentPath.includes(appHomePath);
            redirectUriPath = hasPath ? currentPath : appHomePath;
        }
        switch(appliedLogoutType){
            case "SILENT":
                AuthService.logoutSilently(dispatch, logoutPath, redirectUriPath);
                break;
            case "REDIRECT":
            default:
                triggerAuth(logoutPath, false, dispatch, redirectUriPath);
                break;
        }
    };
    // eslint-disable-next-line react/jsx-no-useless-fragment
    let authContent = /*#__PURE__*/ _jsx(_Fragment, {});
    const isCustom = "MENU_CUSTOM";
    switch(displayType){
        case "MENU_CUSTOM":
        case "MENU":
        default:
            authContent = /*#__PURE__*/ _jsx(Button, {
                size: "small",
                variant: "outlined",
                className: classes.button,
                "data-selenium": "neon-menu.sign-in-button",
                onClick: ()=>handleLogin(),
                children: "Sign In"
            });
            if (showAuthWorking) {
                authContent = /*#__PURE__*/ _jsxs("div", {
                    className: classes.loadingContainer,
                    children: [
                        isCustom ? null : /*#__PURE__*/ _jsx("span", {
                            className: classes.loadingContainerSpan,
                            children: isAuthenticated ? 'Signing out...' : 'Signing in...'
                        }),
                        /*#__PURE__*/ _jsx(CircularProgress, {
                            size: 20
                        })
                    ]
                });
            } else if (isAuthenticated) {
                authContent = isCustom ? /*#__PURE__*/ _jsx(AccountMenu, {
                    accountPath: accountPath,
                    handleLogout: handleLogout
                }) : /*#__PURE__*/ _jsxs(ButtonGroup, {
                    size: "small",
                    "aria-label": "Authentication",
                    children: [
                        /*#__PURE__*/ _jsx(Button, {
                            className: classes.button,
                            "data-selenium": "neon-menu.sign-out-button",
                            onClick: ()=>handleLogout(),
                            children: "Sign Out"
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                            href: accountPath,
                            className: classes.button,
                            "data-selenium": "neon-menu.my-account-button",
                            children: "My Account"
                        })
                    ]
                });
            }
            break;
    }
    return authContent;
};
const NeonAuth = (props)=>{
    const [{ auth: { isAuthenticated, isAuthWorking, isAuthWsConnected }, fetches: { auth: { status } } }, dispatch] = NeonContext.useNeonContextState();
    const classes = useStyles(Theme);
    const isFetchingAuthentication = status === FETCH_STATUS.FETCHING;
    const isAuthFetched = [
        FETCH_STATUS.SUCCESS,
        FETCH_STATUS.ERROR
    ].indexOf(status) >= 0;
    const showAuthWorking = isAuthWorking || isFetchingAuthentication;
    const authFetchCb = useCallback(()=>{
        AuthService.fetchUserInfoWithDispatch(dispatch);
    }, [
        dispatch
    ]);
    if (!isFetchingAuthentication && !isAuthFetched) {
        authFetchCb();
    }
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: renderAuth(props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch)
    });
};
const WrappedNeonAuth = Theme.getWrappedComponent(NeonContext.getWrappedComponent(NeonAuth));
export default WrappedNeonAuth;
