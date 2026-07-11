import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState, useEffect, useMemo, useCallback, useLayoutEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import uniqueId from 'lodash/uniqueId';
import { Subject } from 'rxjs';
import { ErrorBoundary } from 'react-error-boundary';
import useMediaQuery from '@mui/material/useMediaQuery';
import Backdrop from '@mui/material/Backdrop';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import CollapseIcon from '@mui/icons-material/ExpandLess';
import ErrorIcon from '@mui/icons-material/Warning';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import ResetIcon from '@mui/icons-material/Autorenew';
import Skeleton from '@mui/material/Skeleton';
import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import { COLORS, getThemeSpacingNumber } from '../Theme/Theme';
import NeonHeader from '../NeonHeader/NeonHeader';
import NeonFooter from '../NeonFooter/NeonFooter';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import BrowserWarning from './BrowserWarning';
import LiferayNotifications from './LiferayNotifications';
import DrupalAssetService from '../../service/DrupalAssetService';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import { getJson } from '../../util/rxUtil';
import { generateNotificationId, getLiferayNotificationsApiPath } from '../../util/liferayNotificationsUtil';
import NeonLogo from '../../images/NSF-NEON-logo.png';
import './styles.css';
const DRUPAL_THEME_CSS = REMOTE_ASSETS.DRUPAL_THEME_CSS.KEY;
const cookies = new Cookies();
// Function to determine if we're effectively scrolled to the bottom of the page. Used to set
// current sidebar link to the last one automatically when the associated content for the last link
// can't be scrolled past (i.e. is not taller than the page height less the footer height)
const isAtMaxScroll = ()=>{
    const windowHeight = window.innerHeight || (document.documentElement || document.body).clientHeight;
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const trackLength = documentHeight - windowHeight;
    return scrollTop / trackLength >= 0.99;
};
// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the index.html for any apps/pages that
// would seek to use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
    window.gtmDataLayer = [];
}
const useStyles = makeStyles()((theme, { sidebarWidth })=>({
        outerPageContainer: {
            display: 'flex',
            position: 'relative',
            minHeight: theme.spacing(30),
            borderTop: '2px solid transparent',
            paddingLeft: '0px',
            paddingRight: '0px',
            [theme.breakpoints.down('md')]: {
                paddingBottom: theme.spacing(2.5),
                flexDirection: 'column'
            }
        },
        pageContent: {
            display: 'block',
            verticalAlign: 'top',
            position: 'relative',
            padding: theme.spacing(4, 8, 12, 8),
            width: `calc(100% - ${sidebarWidth}px)`,
            [theme.breakpoints.down('md')]: {
                width: '100%',
                display: 'block',
                padding: theme.spacing(3, 5, 8, 5)
            },
            // These override links created with a naked <a> tag, as opposed to a <Link>
            // component, to appear the same as the <Link> component. This is especially
            // useful for rendered markdown where injecting Mui Links isn't possible.
            '& a:not([class]), a[class=""]': {
                color: COLORS.LIGHT_BLUE[500],
                textDecoration: 'none'
            },
            '& a:hover:not([class]), a:hover[class=""]': {
                textDecoration: 'underline'
            }
        },
        breadcrumbs: {
            margin: theme.spacing(2, 0, 4, 0),
            [theme.breakpoints.down('md')]: {
                margin: theme.spacing(1, 0, 2, 0)
            }
        },
        sidebarContainer: {
            display: 'block',
            verticalAlign: 'top',
            backgroundColor: COLORS.GREY[50],
            padding: theme.spacing(5, 4),
            [theme.breakpoints.down('md')]: {
                display: 'inline-block',
                width: '100%',
                maxHeight: 'calc(100vh - 84px)',
                padding: theme.spacing(2.5, 2),
                position: 'sticky',
                top: '-2px',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
                zIndex: 2
            },
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1.5)
            }
        },
        sidebarInnerStickyContainer: {
            // Sticky properties injected via CSS to handle webkit position prop
            top: '40px'
        },
        sidebarTitleContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        sidebarTitle: {
            fontWeight: 700,
            [theme.breakpoints.down('md')]: {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            },
            [theme.breakpoints.only('sm')]: {
                marginRight: theme.spacing(1.5)
            }
        },
        sidebarSubtitle: {
            color: COLORS.GREY[300],
            marginTop: theme.spacing(1),
            [theme.breakpoints.down('md')]: {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                marginTop: '0px'
            },
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        },
        sidebarTitlesContainer: {
            minWidth: '0px',
            paddingRight: theme.spacing(1),
            [theme.breakpoints.only('sm')]: {
                display: 'flex',
                alignItems: 'baseline'
            }
        },
        sidebarLink: {
            cursor: 'pointer',
            display: 'block',
            fontSize: '0.9rem',
            marginBottom: '12px'
        },
        sidebarLinkCurrent: {
            fontWeight: 700,
            color: COLORS.GREY[500],
            textDecoration: 'none',
            '&:hover': {
                transition: 'all 0.45s',
                color: COLORS.GREY[900]
            }
        },
        sidebarLinkIcon: {
            marginBottom: '-5px',
            marginRight: '5px',
            fontSize: '1.3rem'
        },
        sidebarLinksContainer: {
            flex: '1 1 auto',
            overflowY: 'auto',
            minHeight: '0px'
        },
        sidebarDivider: {
            margin: '24px 0px',
            [theme.breakpoints.down('md')]: {
                margin: '16px 0px'
            },
            [theme.breakpoints.down('sm')]: {
                margin: '8px 0px 12px 0px'
            }
        },
        backdropPaper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '4px',
            padding: theme.spacing(3),
            position: 'sticky',
            top: theme.spacing(12),
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '70%',
            [theme.breakpoints.up('lg')]: {
                width: '50%'
            }
        },
        pageTitle: {
            margin: theme.spacing(3, 0, 4, 0),
            [theme.breakpoints.up('sm')]: {
                margin: theme.spacing(3, 0, 4, 0)
            }
        },
        pageSubtitle: {
            maxWidth: '660px',
            color: COLORS.GREY[500],
            lineHeight: '1.5',
            fontSize: '1.1rem',
            marginTop: theme.spacing(-1),
            marginBottom: theme.spacing(4)
        },
        errorPageTitleIcon: {
            marginRight: theme.spacing(1.5),
            color: theme.palette.error.dark,
            fontSize: '2.3rem',
            marginBottom: '-3px'
        },
        errorPageCaption: {
            display: 'block',
            fontSize: '1rem',
            fontFamily: 'monospace, monospace',
            marginBottom: theme.spacing(4)
        },
        errorPageLogo: {
            height: '6em',
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(4)
        },
        dismissOverlay: {
            width: '100%',
            textAlign: 'right',
            marginTop: theme.spacing(2)
        }
    }));
/**
  NEON Error Page
  Shown as the fallback for a general error boundary around all NEON page instances
 */ export const NeonErrorPage = (props)=>{
    const { error: { message, stack }, resetErrorBoundary } = props;
    const { classes, theme } = useStyles({
        sidebarWidth: 0
    });
    // eslint-disable-next-line no-console
    console.error(stack);
    return /*#__PURE__*/ _jsxs(Container, {
        className: classes.outerPageContainer,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: classes.pageContent,
                "data-selenium": "neon-page.content",
                children: [
                    /*#__PURE__*/ _jsx("img", {
                        title: "NEON Data Portal",
                        alt: "NEON Data Portal",
                        className: classes.errorPageLogo,
                        src: NeonLogo.src
                    }),
                    /*#__PURE__*/ _jsxs(Typography, {
                        variant: "h3",
                        component: "h1",
                        className: classes.pageTitle,
                        children: [
                            /*#__PURE__*/ _jsx(ErrorIcon, {
                                className: classes.errorPageTitleIcon
                            }),
                            "Something broke."
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "caption",
                            className: classes.errorPageCaption,
                            children: message
                        })
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        style: {
                            display: 'flex'
                        },
                        children: [
                            /*#__PURE__*/ _jsx(Button, {
                                startIcon: /*#__PURE__*/ _jsx(ResetIcon, {}),
                                variant: "outlined",
                                onClick: resetErrorBoundary,
                                children: "Reset and Try Again"
                            }),
                            /*#__PURE__*/ _jsx(Button, {
                                startIcon: /*#__PURE__*/ _jsx(HomeIcon, {}),
                                href: "/",
                                style: {
                                    marginLeft: theme.spacing(4)
                                },
                                children: "Return Home"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("input", {
                type: "hidden",
                "data-gtm": "react-page-run-time-error.stack",
                value: `${stack}`
            })
        ]
    });
};
NeonErrorPage.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string.isRequired,
        stack: PropTypes.string
    }).isRequired,
    resetErrorBoundary: PropTypes.func.isRequired
};
const drupalAssetsReducer = (state, action)=>{
    const newState = {
        ...state
    };
    switch(action.type){
        case 'fetchDrupalCss':
            newState.fetchStatus = 'fetching';
            return newState;
        case 'fetchDrupalCssSuccess':
            newState.fetchStatus = 'success';
            return newState;
        case 'fetchDrupalCssError':
            newState.fetchStatus = 'error';
            return newState;
        default:
            return state;
    }
};
const notificationsReducer = (state, action)=>{
    const newState = {
        ...state
    };
    switch(action.type){
        case 'fetchNotifications':
            newState.fetchStatus = 'fetching';
            return newState;
        case 'fetchNotificationsSuccess':
            newState.fetchStatus = 'success';
            return newState;
        case 'fetchNotificationsError':
            newState.fetchStatus = 'error';
            return newState;
        default:
            return state;
    }
};
const defaultProps = {
    breadcrumbHomeHref: '/',
    breadcrumbs: [],
    customHeader: null,
    customFooter: null,
    customizeAuthContainer: false,
    showHeaderSkeleton: false,
    showFooterSkeleton: false,
    error: null,
    loading: null,
    notification: null,
    outerPageContainerMaxWidth: '2000px',
    progress: null,
    resetStateAfterRuntimeError: ()=>{},
    sidebarContent: null,
    sidebarContentResponsive: false,
    sidebarContainerClassName: null,
    sidebarLinks: null,
    sidebarLinksAdditionalContent: null,
    sidebarLinksAsStandaloneChildren: false,
    sidebarSubtitle: null,
    sidebarTitle: null,
    sidebarWidth: 300,
    sidebarUnsticky: false,
    subtitle: null,
    title: null,
    unstickyDrupalHeader: true,
    NeonContextProviderProps: {}
};
const NeonPage = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { breadcrumbHomeHref, breadcrumbs, customHeader, customFooter, customizeAuthContainer, showHeaderSkeleton, showFooterSkeleton, error, loading, notification, outerPageContainerMaxWidth, progress, resetStateAfterRuntimeError, sidebarContent, sidebarContentResponsive, sidebarContainerClassName: sidebarContainerClassNameProp, sidebarLinks, sidebarLinksAdditionalContent, sidebarLinksAsStandaloneChildren: sidebarLinksAsStandaloneChildrenProp, sidebarSubtitle, sidebarTitle, sidebarWidth, sidebarUnsticky, subtitle, title, unstickyDrupalHeader, NeonContextProviderProps, children } = props;
    /**
    Sidebar Setup
  */ // Sidebar can have content OR links, not both. If both are set then content wins.
    const hasSidebarContent = sidebarContent !== null;
    const hasSidebarLinks = !sidebarContent && Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
    const hasSidebar = hasSidebarContent || hasSidebarLinks;
    const { classes, theme } = useStyles({
        sidebarWidth: hasSidebar ? sidebarWidth : 0
    });
    const [{ isActive: neonContextIsActive }] = NeonContext.useNeonContextState();
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const sidebarRef = useRef(null);
    const sidebarLinksContainerRef = useRef(null);
    const belowMd = useMediaQuery(theme.breakpoints.down('md'));
    const [overlayDismissed, setOverlayDismissed] = useState(false);
    // Boolean - whether any Drupal assets are used; only false if both header and footer are custom
    const useSomeDrupalAssets = NeonEnvironment.fetchDrupalAssets && !(customHeader && customFooter);
    /**
    Continue Sidebar Setup
  */ // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component
    const sidebarLinksAsStandaloneChildren = hasSidebarLinks && sidebarLinksAsStandaloneChildrenProp ? sidebarLinks.every((link)=>link.component) : false;
    const sidebarHashMap = useMemo(()=>!hasSidebarLinks ? {} : Object.fromEntries(sidebarLinks.map((link, idx)=>[
                link.hash || '#',
                idx
            ])), [
        hasSidebarLinks,
        sidebarLinks
    ]);
    const initialCurrentSidebarHash = hasSidebarLinks ? sidebarLinks[0].hash || '#' : '#';
    const [currentSidebarHash, setCurrentSidebarHash] = useState(initialCurrentSidebarHash);
    const hashInitializedRef = useRef(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false); // for small viewports only
    // Get the vertical pixel offset for the content associated to any sidebar link by hash
    const sidebarLinkScrollPositionNudge = getThemeSpacingNumber(theme.spacing(5));
    const getSidebarLinkScrollPosition = useCallback((hash, inSidebarLinksAsStandaloneChildren)=>{
        if (!hasSidebarLinks || inSidebarLinksAsStandaloneChildren || !contentRef.current) {
            return -1;
        }
        const headerOffset = (headerRef.current || {}).offsetHeight || 0;
        const stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;
        if (hash === '#') {
            return 0;
        }
        const anchor = contentRef.current.querySelector(hash);
        return !anchor ? -1 : anchor.offsetTop + headerOffset - stickyOffset - sidebarLinkScrollPositionNudge;
    }, [
        hasSidebarLinks,
        belowMd,
        contentRef,
        headerRef,
        sidebarRef,
        sidebarLinkScrollPositionNudge
    ]);
    const handleHashNav = useCallback((hashNav)=>{
        window.location.hash = hashNav;
    }, []);
    /**
     Effect - For sidebarLinks pages, on successful load, if hash is present then update the current
  */ useLayoutEffect(()=>{
        if (error || loading || !hasSidebarLinks) {
            return ()=>{};
        }
        const handleHashChange = ()=>{
            const { hash } = document.location;
            if (currentSidebarHash === hash) {
                return;
            }
            setCurrentSidebarHash(hash);
            // If standard sidebar mode (scroll to content) also perform the scroll offset here
            if (!sidebarLinksAsStandaloneChildren) {
                window.setTimeout(()=>{
                    window.scrollTo(0, getSidebarLinkScrollPosition(hash, sidebarLinksAsStandaloneChildren));
                }, 0);
            }
        };
        // Handle URL-defined hash on initial load
        if (document.location.hash && !hashInitializedRef.current) {
            hashInitializedRef.current = true;
            // Ensure the document hash maps to a defined hash or '#' at all times
            if (!Object.keys(sidebarHashMap).includes(document.location.hash)) {
                handleHashNav('#');
            }
            handleHashChange();
        }
        // Set max-height on sidebar links container when the sidebar is sticky so the links get
        // a dedicated scrollbar instead of clipping
        if (!sidebarUnsticky && hasSidebarLinks && sidebarLinksContainerRef.current) {
            const maxHeight = window.innerHeight - sidebarLinksContainerRef.current.offsetTop - 104;
            sidebarLinksContainerRef.current.style.maxHeight = `${maxHeight}px`;
        }
        // For sidebarLinksAsStandaloneChildren listen for hash changes to trigger a "redirect".
        if (sidebarLinksAsStandaloneChildren) {
            window.addEventListener('hashchange', handleHashChange);
            return ()=>{
                window.removeEventListener('hashchange', handleHashChange);
            };
        }
        // Set up event listener / handler for user-input scroll events for standard scrolling pages
        const handleScroll = ()=>{
            const scrollBreaks = sidebarLinks.map((link)=>({
                    y: getSidebarLinkScrollPosition(link.hash || '#', sidebarLinksAsStandaloneChildren),
                    hash: link.hash || '#'
                }));
            // Determine the current scrolled-to hash. If at the max scroll always go to the last hash.
            // Otherwise choose from scroll position relative to scroll breakpoints.
            const detectionBuffer = 80; // Extra pixels to highlight the next link when we're close enough
            const currentScrolledHash = isAtMaxScroll() ? scrollBreaks[scrollBreaks.length - 1].hash : scrollBreaks.reduce((acc, curr)=>curr.y !== -1 && window.scrollY >= curr.y - detectionBuffer ? curr.hash : acc, sidebarLinks[0].hash || '#');
            if (currentScrolledHash !== currentSidebarHash) {
                setCurrentSidebarHash(currentScrolledHash);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
        };
    }, [
        error,
        loading,
        sidebarLinks,
        sidebarHashMap,
        sidebarUnsticky,
        hasSidebarLinks,
        hashInitializedRef,
        currentSidebarHash,
        setCurrentSidebarHash,
        handleHashNav,
        sidebarLinksContainerRef,
        getSidebarLinkScrollPosition,
        sidebarLinksAsStandaloneChildren
    ]);
    /**
     Effect - Load Drupal CSS
  */ const initialDrupalFetchStatusState = {
        fetchStatus: useSomeDrupalAssets ? FETCH_STATUS.AWAITING_CALL : FETCH_STATUS.SUCCESS
    };
    const [fetchDrupalCssState, fetchDrupalCssDispatch] = useReducer(drupalAssetsReducer, initialDrupalFetchStatusState);
    const isDrupalCssStatusFinished = fetchDrupalCssState.fetchStatus === FETCH_STATUS.SUCCESS;
    useEffect(()=>{
        if (!useSomeDrupalAssets) {
            return;
        }
        if (fetchDrupalCssState.fetchStatus !== FETCH_STATUS.AWAITING_CALL) {
            return;
        }
        fetchDrupalCssDispatch({
            type: 'fetchDrupalCss'
        });
        fetch(REMOTE_ASSETS[DRUPAL_THEME_CSS].url).then((response)=>{
            if (!response.ok) {
                throw new Error('Failed to fetch Drupal theme CSS');
            }
            return response.text();
        }).then((data)=>{
            const drupalStyle = document.createElement('style');
            drupalStyle.setAttribute('data-meta', 'drupal-theme');
            drupalStyle.setAttribute('data-meta-runtime', 'drupal-theme');
            const appliedData = DrupalAssetService.cleanCss(data, true);
            drupalStyle.textContent = appliedData;
            document.head.appendChild(drupalStyle);
            try {
                const existingBlock = document.head.querySelector('link[data-meta="drupal-theme"]');
                if (typeof existingBlock !== 'undefined' && existingBlock !== null) {
                    existingBlock.remove();
                }
            } catch (e) {
                console.error(e); // eslint-disable-line no-console
            }
            fetchDrupalCssDispatch({
                type: 'fetchDrupalCssSuccess'
            });
        }).catch((err)=>{
            // eslint-disable-next-line no-console
            console.error(err);
            fetchDrupalCssDispatch({
                type: 'fetchDrupalCssSuccess'
            });
        });
    }, [
        useSomeDrupalAssets,
        fetchDrupalCssState,
        fetchDrupalCssDispatch
    ]);
    /**
     Liferay Notifications
   */ const cancellationSubject$ = useMemo(()=>new Subject(), []);
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
        fetchStatus: null
    };
    let initialNotifications = [];
    if (notification !== null && notification.length) {
        const notificationPropId = generateNotificationId(notification);
        initialFetchStatusState.fetchStatus = 'success';
        initialNotifications = [
            {
                id: notificationPropId,
                message: notification,
                dismissed: notificationDismissals.includes(notificationPropId)
            }
        ];
    }
    const [fetchNotificationState, fetchNotificationDispatch] = useReducer(notificationsReducer, initialFetchStatusState);
    const [notifications, setNotifications] = useState(initialNotifications);
    // Handle a successful response from the notifications endpoint
    const handleFetchNotificationsSuccess = useCallback((response)=>{
        fetchNotificationDispatch({
            type: 'fetchNotificationsSuccess'
        });
        if (!Array.isArray(response.notifications)) {
            return;
        }
        setNotifications(response.notifications.map((message)=>{
            const id = generateNotificationId(message);
            const dismissed = notificationDismissals.includes(id);
            return {
                id,
                message,
                dismissed
            };
        }));
    }, [
        fetchNotificationDispatch,
        setNotifications,
        notificationDismissals
    ]);
    // If the endpoint fails don't bother with any visible error. Just let it go.
    const handleFetchNotificationsError = useCallback(()=>{
        fetchNotificationDispatch({
            type: 'fetchNotificationsError'
        });
        setNotifications([]);
    }, [
        fetchNotificationDispatch,
        setNotifications
    ]);
    const handleHideNotifications = ()=>{
        const updatedDismissals = notifications.map((n)=>n.id);
        cookies.set('dismissed-notifications', updatedDismissals, {
            path: '/',
            maxAge: 86400
        });
        setNotifications(notifications.map((n)=>({
                ...n,
                dismissed: true
            })));
    };
    const handleShowNotifications = ()=>{
        cookies.remove('dismissed-notifications');
        setNotifications(notifications.map((n)=>({
                ...n,
                dismissed: false
            })));
    };
    /**
     Effect - Fetch notifications
  */ useEffect(()=>{
        if (fetchNotificationState.fetchStatus !== null) {
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
     Render functions
   */ const renderTitle = ()=>{
        if ((loading || error) && !title) {
            return /*#__PURE__*/ _jsx(Skeleton, {
                width: "45%",
                height: 24,
                style: {
                    margin: theme.spacing(2, 0, 4, 0)
                }
            });
        }
        if ((!title || !title.length) && !sidebarLinksAsStandaloneChildren) {
            return null;
        }
        let titleString = title || '';
        if (sidebarLinksAsStandaloneChildren) {
            const sidebarLink = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0];
            titleString = sidebarLink.pageTitle || sidebarLink.name;
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    "data-selenium": "neon-page.title",
                    variant: "h3",
                    component: "h1",
                    className: classes.pageTitle,
                    children: titleString
                }),
                subtitle ? /*#__PURE__*/ _jsx(Typography, {
                    "data-selenium": "neon-page.subtitle",
                    variant: "subtitle1",
                    component: "p",
                    className: classes.pageSubtitle,
                    children: subtitle
                }) : null
            ]
        });
    };
    const renderBreadcrumbs = ()=>!breadcrumbs.length ? null : /*#__PURE__*/ _jsxs(Breadcrumbs, {
            "aria-label": "Breadcrumbs",
            "data-selenium": "neon-page.breadcrumbs",
            className: classes.breadcrumbs,
            children: [
                /*#__PURE__*/ _jsx(Link, {
                    href: breadcrumbHomeHref,
                    children: /*#__PURE__*/ _jsx(HomeIcon, {
                        title: "Home",
                        fontSize: "small",
                        style: {
                            marginBottom: '-4px'
                        }
                    })
                }, uniqueId()),
                breadcrumbs.map((breadcrumb, idx)=>idx !== breadcrumbs.length - 1 ? /*#__PURE__*/ _jsx(Link, {
                        href: breadcrumb.href,
                        children: breadcrumb.name
                    }, uniqueId()) : /*#__PURE__*/ _jsx(Typography, {
                        color: "textPrimary",
                        children: breadcrumb.name
                    }, "{idx}"))
            ]
        });
    const renderOverlay = (overlayChildren)=>/*#__PURE__*/ _jsx(Backdrop, {
            open: !overlayDismissed,
            children: /*#__PURE__*/ _jsxs(Paper, {
                className: classes.backdropPaper,
                children: [
                    overlayChildren,
                    /*#__PURE__*/ _jsx("div", {
                        className: classes.dismissOverlay,
                        children: /*#__PURE__*/ _jsx(Button, {
                            size: "small",
                            startIcon: /*#__PURE__*/ _jsx(ClearIcon, {}),
                            variant: "outlined",
                            onClick: ()=>{
                                setOverlayDismissed(true);
                            },
                            children: "Dismiss"
                        })
                    })
                ]
            })
        });
    const renderLoading = ()=>!loading || error ? null : renderOverlay(/*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "h5",
                    component: "h3",
                    gutterBottom: true,
                    children: loading
                }),
                progress === null ? /*#__PURE__*/ _jsx(CircularProgress, {}) : /*#__PURE__*/ _jsx(CircularProgress, {
                    variant: "determinate",
                    value: progress
                })
            ]
        }));
    const renderError = ()=>!error ? null : renderOverlay(/*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(ErrorIcon, {
                    fontSize: "large",
                    color: "error"
                }),
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "h5",
                    component: "h3",
                    style: {
                        marginTop: theme.spacing(1)
                    },
                    children: error
                })
            ]
        }));
    const renderSidebar = ()=>{
        if (!hasSidebar) {
            return null;
        }
        const sidebarContainerStyle = belowMd ? {} : {
            width: `${sidebarWidth}px`
        };
        const dividerStyle = !belowMd ? {
            width: `${sidebarWidth - getThemeSpacingNumber(theme.spacing(8))}px`
        } : {};
        const sidebarClassName = sidebarContainerClassNameProp ? `${classes.sidebarContainer} ${sidebarContainerClassNameProp}` : classes.sidebarContainer;
        // Arbitrary Content Sidebar (no automatic skeleton)
        if (hasSidebarContent && !sidebarContentResponsive) {
            return /*#__PURE__*/ _jsx("div", {
                ref: sidebarRef,
                className: sidebarClassName,
                style: sidebarContainerStyle,
                children: sidebarContent
            });
        }
        // Render Sidebar Title
        const renderSidebarTitle = ()=>{
            if (!sidebarTitle && !title) {
                return null;
            }
            return /*#__PURE__*/ _jsx("div", {
                className: classes.sidebarTitlesContainer,
                children: loading || error ? /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx(Skeleton, {
                            width: 200,
                            height: 22,
                            style: {
                                marginBottom: theme.spacing(1)
                            }
                        }),
                        !sidebarSubtitle ? null : /*#__PURE__*/ _jsx(Skeleton, {
                            width: 120,
                            height: 16,
                            style: {
                                marginBottom: theme.spacing(1)
                            }
                        })
                    ]
                }) : /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h5",
                            component: "h3",
                            className: classes.sidebarTitle,
                            children: sidebarTitle || title
                        }),
                        !sidebarSubtitle ? null : /*#__PURE__*/ _jsx(Typography, {
                            variant: "subtitle2",
                            component: "h4",
                            className: classes.sidebarSubtitle,
                            children: sidebarSubtitle
                        })
                    ]
                })
            });
        };
        // Arbitrary Content Sidebar (no automatic skeleton)
        if (hasSidebarContent) {
            return /*#__PURE__*/ _jsx("div", {
                ref: sidebarRef,
                className: sidebarClassName,
                style: sidebarContainerStyle,
                children: /*#__PURE__*/ _jsxs("div", {
                    className: !sidebarUnsticky && !belowMd ? `${classes.sidebarInnerStickyContainer} neon__sidebar-sticky` : null,
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: classes.sidebarTitleContainer,
                            children: [
                                renderSidebarTitle(),
                                !belowMd ? null : /*#__PURE__*/ _jsx(IconButton, {
                                    size: "small",
                                    onClick: ()=>setSidebarExpanded(!sidebarExpanded),
                                    children: sidebarExpanded ? /*#__PURE__*/ _jsx(CollapseIcon, {
                                        fontSize: "large"
                                    }) : /*#__PURE__*/ _jsx(ExpandIcon, {
                                        fontSize: "large"
                                    })
                                })
                            ]
                        }),
                        !belowMd || sidebarExpanded ? /*#__PURE__*/ _jsxs(_Fragment, {
                            children: [
                                /*#__PURE__*/ _jsx(Divider, {
                                    className: classes.sidebarDivider,
                                    style: {
                                        ...dividerStyle
                                    }
                                }),
                                sidebarContent
                            ]
                        }) : null
                    ]
                })
            });
        }
        // Render Single Sidebar Link
        const renderLink = (link, standalone = false)=>{
            if (!link) {
                return null;
            }
            const { name, hash = '#', icon: IconComponent } = link;
            if (loading || error) {
                return /*#__PURE__*/ _jsx(Skeleton, {
                    width: `${Math.floor(50 + Math.random() * 50)}%`,
                    height: 16,
                    style: {
                        marginBottom: '16px'
                    }
                }, name);
            }
            const icon = IconComponent ? /*#__PURE__*/ _jsx(IconComponent, {
                className: classes.sidebarLinkIcon
            }) : null;
            return /*#__PURE__*/ _jsxs(Link, {
                href: hash,
                onClick: sidebarLinksAsStandaloneChildren ? ()=>{
                    setCurrentSidebarHash(hash);
                    if (sidebarExpanded) {
                        setSidebarExpanded(false);
                    }
                } : null,
                className: currentSidebarHash === hash ? `${classes.sidebarLink} ${classes.sidebarLinkCurrent}` : classes.sidebarLink,
                style: standalone ? {
                    marginBottom: '0px'
                } : {},
                children: [
                    icon,
                    name
                ]
            }, name);
        };
        const fullLinks = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("div", {
                    ref: sidebarLinksContainerRef,
                    className: classes.sidebarLinksContainer,
                    children: sidebarLinks.map((link)=>renderLink(link))
                }),
                belowMd ? null : /*#__PURE__*/ _jsx(Divider, {
                    className: classes.sidebarDivider,
                    style: {
                        marginBottom: '0px',
                        ...dividerStyle
                    }
                })
            ]
        });
        const currentLinkOnly = /*#__PURE__*/ _jsx("div", {
            className: classes.sidebarLinksContainer,
            children: renderLink(sidebarLinks[sidebarHashMap[currentSidebarHash]], true)
        });
        return /*#__PURE__*/ _jsx("div", {
            ref: sidebarRef,
            className: sidebarClassName,
            style: sidebarContainerStyle,
            children: /*#__PURE__*/ _jsxs("div", {
                className: !sidebarUnsticky && !belowMd ? `${classes.sidebarInnerStickyContainer} neon__sidebar-sticky` : null,
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.sidebarTitleContainer,
                        children: [
                            renderSidebarTitle(),
                            !belowMd ? null : /*#__PURE__*/ _jsx(IconButton, {
                                size: "small",
                                onClick: ()=>setSidebarExpanded(!sidebarExpanded),
                                children: sidebarExpanded ? /*#__PURE__*/ _jsx(CollapseIcon, {
                                    fontSize: "large"
                                }) : /*#__PURE__*/ _jsx(ExpandIcon, {
                                    fontSize: "large"
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx(Divider, {
                        className: classes.sidebarDivider,
                        style: {
                            ...dividerStyle
                        }
                    }),
                    sidebarLinksAdditionalContent && (!belowMd || sidebarExpanded) ? /*#__PURE__*/ _jsxs(_Fragment, {
                        children: [
                            sidebarLinksAdditionalContent,
                            /*#__PURE__*/ _jsx(Divider, {
                                className: classes.sidebarDivider,
                                style: {
                                    ...dividerStyle
                                }
                            })
                        ]
                    }) : null,
                    belowMd && !sidebarExpanded ? currentLinkOnly : fullLinks
                ]
            })
        });
    };
    const renderNeonPage = ()=>{
        const outerPageContainerStyles = {};
        if (outerPageContainerMaxWidth) {
            outerPageContainerStyles.maxWidth = !hasSidebar || belowMd ? outerPageContainerMaxWidth : `calc(${outerPageContainerMaxWidth} - ${sidebarWidth + 48}px)`;
        }
        let content = children;
        if (hasSidebarLinks && sidebarLinksAsStandaloneChildren) {
            const CurrentComponent = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0].component;
            content = /*#__PURE__*/ _jsx(CurrentComponent, {});
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                customHeader ? /*#__PURE__*/ _jsx("header", {
                    ref: headerRef,
                    children: customHeader
                }) : /*#__PURE__*/ _jsx(NeonHeader, {
                    customizeAuthContainer: customizeAuthContainer,
                    ref: headerRef,
                    unstickyDrupalHeader: unstickyDrupalHeader,
                    notifications: notifications,
                    onShowNotifications: handleShowNotifications,
                    drupalCssLoaded: isDrupalCssStatusFinished,
                    showSkeleton: showHeaderSkeleton
                }),
                /*#__PURE__*/ _jsxs(Container, {
                    disableGutters: true,
                    className: classes.outerPageContainer,
                    style: outerPageContainerStyles,
                    children: [
                        renderSidebar(),
                        /*#__PURE__*/ _jsxs("div", {
                            className: classes.pageContent,
                            style: {
                                top: hasSidebar && !breadcrumbs.length ? '12px' : '0px'
                            },
                            "data-selenium": "neon-page.content",
                            ref: contentRef,
                            children: [
                                renderBreadcrumbs(),
                                renderTitle(),
                                content
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ _jsx(LiferayNotifications, {
                    notifications: notifications,
                    onHideNotifications: handleHideNotifications
                }),
                /*#__PURE__*/ _jsx(BrowserWarning, {}),
                customFooter ? /*#__PURE__*/ _jsx("footer", {
                    children: customFooter
                }) : /*#__PURE__*/ _jsx(NeonFooter, {
                    drupalCssLoaded: isDrupalCssStatusFinished,
                    showSkeleton: showFooterSkeleton
                }),
                renderLoading(),
                renderError()
            ]
        });
    };
    const renderedPage = neonContextIsActive ? renderNeonPage() : /*#__PURE__*/ _jsx(NeonContext.Provider, {
        useCoreAuth: true,
        fetchPartials: useSomeDrupalAssets,
        ...NeonContextProviderProps,
        children: renderNeonPage()
    });
    return /*#__PURE__*/ _jsx(ErrorBoundary, {
        FallbackComponent: NeonErrorPage,
        onReset: resetStateAfterRuntimeError,
        children: renderedPage
    });
};
const children = PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string
    ])),
    PropTypes.node,
    PropTypes.string
]);
NeonPage.propTypes = {
    breadcrumbHomeHref: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        href: PropTypes.string
    })),
    customHeader: PropTypes.node,
    customFooter: PropTypes.node,
    customizeAuthContainer: PropTypes.bool,
    showHeaderSkeleton: PropTypes.bool,
    showFooterSkeleton: PropTypes.bool,
    error: PropTypes.string,
    loading: PropTypes.string,
    notification: PropTypes.string,
    outerPageContainerMaxWidth: PropTypes.string,
    progress: PropTypes.number,
    resetStateAfterRuntimeError: PropTypes.func,
    sidebarContent: children,
    sidebarContentResponsive: PropTypes.bool,
    sidebarContainerClassName: PropTypes.string,
    sidebarLinks: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        pageTitle: PropTypes.string,
        hash: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.object
        ]),
        component: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.object
        ])
    })),
    sidebarLinksAdditionalContent: children,
    sidebarLinksAsStandaloneChildren: PropTypes.bool,
    sidebarSubtitle: PropTypes.string,
    sidebarTitle: PropTypes.string,
    sidebarWidth: PropTypes.number,
    sidebarUnsticky: PropTypes.bool,
    subtitle: PropTypes.oneOfType([
        PropTypes.string,
        children
    ]),
    title: PropTypes.oneOfType([
        PropTypes.string,
        children
    ]),
    unstickyDrupalHeader: PropTypes.bool,
    NeonContextProviderProps: PropTypes.shape(NeonContext.ProviderPropTypes),
    children: children.isRequired
};
export default NeonPage;
