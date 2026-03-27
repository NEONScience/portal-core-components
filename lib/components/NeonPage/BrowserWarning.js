import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Theme from '../Theme/Theme';
/*
  Browser duck typing and warning
  We know detecting browser on user agent strings for feature gating is bad practice.
  Here, though, we just want a generic warning if we know the browser is IE.
  Nothing else is or should be predicated on the value detected here.
  Don't make this any more complicated!
*/ const isBrowserIE = ()=>navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
const useStyles = makeStyles((theme)=>({
        browserWarning: {
            backgroundColor: theme.palette.error.main
        },
        browserWarningMessage: {
            display: 'flex',
            alignItems: 'center'
        },
        buttonRow: {
            marginTop: theme.spacing(1),
            display: 'flex',
            justifyContent: 'space-around'
        }
    }));
const cookies = new Cookies();
const BrowserWarning = ()=>{
    const classes = useStyles(Theme);
    const browserIsIE = isBrowserIE();
    const [browserWarningOpen, setBrowserWarningOpen] = useState(browserIsIE);
    if (!browserIsIE) {
        return null;
    }
    if (cookies.get('ignoreIE11Warning')) {
        return null;
    }
    const handleBrowserWarningClose = ()=>{
        cookies.set('ignoreIE11Warning', true, {
            path: '/',
            maxAge: 86400
        });
        setBrowserWarningOpen(false);
    };
    const buttonProps = {
        color: 'inherit',
        target: '_blank'
    };
    const message = /*#__PURE__*/ _jsx("span", {
        id: "browser-warning",
        className: classes.browserWarningMessage,
        "data-selenium": "neon-page.browser-warning",
        children: /*#__PURE__*/ _jsxs("div", {
            children: [
                /*#__PURE__*/ _jsx("b", {
                    children: "Your browser has limited support on the NEON Data Portal."
                }),
                /*#__PURE__*/ _jsx("br", {}),
                "Some parts of the portal will not work for you.",
                /*#__PURE__*/ _jsx("br", {}),
                "Please use a modern browser for full support.",
                /*#__PURE__*/ _jsx("br", {}),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.buttonRow,
                    children: [
                        /*#__PURE__*/ _jsx(Button, {
                            ...buttonProps,
                            href: "https://www.mozilla.org/en-US/firefox/new/",
                            children: "Firefox"
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                            ...buttonProps,
                            href: "https://www.google.com/chrome/",
                            children: "Chrome"
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                            ...buttonProps,
                            href: "https://www.apple.com/safari/",
                            children: "Safari"
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                            ...buttonProps,
                            href: "https://www.microsoft.com/en-us/windows/microsoft-edge",
                            children: "Edge"
                        })
                    ]
                })
            ]
        })
    });
    return /*#__PURE__*/ _jsx(Snackbar, {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
        },
        ContentProps: {
            'aria-describedby': 'browser-warning'
        },
        open: browserWarningOpen,
        children: /*#__PURE__*/ _jsx(SnackbarContent, {
            className: classes.browserWarning,
            message: message,
            action: /*#__PURE__*/ _jsx(IconButton, {
                "aria-label": "close",
                color: "inherit",
                onClick: handleBrowserWarningClose,
                size: "large",
                children: /*#__PURE__*/ _jsx(CloseIcon, {})
            }, "close")
        })
    });
};
export default BrowserWarning;
