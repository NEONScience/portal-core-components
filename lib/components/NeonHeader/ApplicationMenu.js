import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useRef, useState } from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import AppsIcon from '@mui/icons-material/Apps';
import Fade from '@mui/material/Fade';
import LaunchIcon from '@mui/icons-material/Launch';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import NeonContext from '../NeonContext/NeonContext';
// declare styles
const useStyles = makeStyles((theme)=>createStyles({
        menuContainer: {
            zIndex: 1000
        },
        toolbarContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.45)',
            position: 'relative'
        },
        toolbarButtons: {
            display: 'flex',
            marginLeft: 'auto',
            marginRight: theme.spacing(2.5),
            marginTop: theme.spacing(0.5),
            marginBottom: theme.spacing(0.5)
        },
        paper: {
            padding: theme.spacing(4),
            maxWidth: '500px',
            marginTop: theme.spacing(1),
            overflowX: 'unset',
            overflowY: 'unset',
            '&::before': {
                content: '""',
                position: 'absolute',
                marginRight: theme.spacing(4),
                top: 0,
                right: 0,
                width: theme.spacing(2),
                height: theme.spacing(2),
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                transform: 'rotate(315deg)',
                clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))'
            }
        },
        card: {
            transition: '0.4s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2]
            },
            cursor: 'pointer',
            width: '100%',
            border: 0
        },
        cardContent: {
            textAlign: 'center'
        },
        gridItem: {
            display: 'flex'
        }
    }));
// define the menu component
const Menu = (props)=>{
    const { apps } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [anchorRefEl, setAnchorRefEl] = useState(null);
    // handle menu toggle
    const handleToggle = ()=>{
        setAnchorRefEl(anchorRef.current);
        setOpen((prevOpen)=>!prevOpen);
    };
    // close the menu
    const handleClose = (event)=>{
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    // open menu by tab key
    const handleMenuKeyDown = (event)=>{
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    };
    // handle a menu selection
    const handleMenuItemClick = useCallback((url)=>{
        window.location.href = url;
    }, []);
    return /*#__PURE__*/ _jsx("div", {
        className: classes.toolbarContainer,
        children: /*#__PURE__*/ _jsxs("div", {
            className: classes.toolbarButtons,
            children: [
                /*#__PURE__*/ _jsx(Tooltip, {
                    title: "Neon Applications",
                    "aria-label": "Neon Applications",
                    placement: "left",
                    TransitionComponent: Fade,
                    TransitionProps: {
                        timeout: 200
                    },
                    arrow: true,
                    children: /*#__PURE__*/ _jsx(IconButton, {
                        ref: anchorRef,
                        style: {
                            color: 'black'
                        },
                        "aria-label": "more",
                        "aria-controls": open ? 'neon-application-menu' : undefined,
                        "aria-haspopup": "true",
                        onClick: handleToggle,
                        onKeyDown: handleMenuKeyDown,
                        size: "large",
                        children: /*#__PURE__*/ _jsx(AppsIcon, {})
                    })
                }),
                /*#__PURE__*/ _jsx(Popper, {
                    className: classes.menuContainer,
                    open: open,
                    anchorEl: anchorRefEl,
                    role: "presentation",
                    transition: true,
                    children: ({ TransitionProps, placement })=>/*#__PURE__*/ _jsx(Fade, {
                            ...TransitionProps,
                            style: {
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                            },
                            timeout: 200,
                            children: /*#__PURE__*/ _jsx(Paper, {
                                elevation: 3,
                                className: classes.paper,
                                children: /*#__PURE__*/ _jsx(ClickAwayListener, {
                                    onClickAway: handleClose,
                                    children: /*#__PURE__*/ _jsx(Grid, {
                                        container: true,
                                        spacing: 4,
                                        alignItems: "stretch",
                                        children: apps.map((app)=>/*#__PURE__*/ _jsx(Grid, {
                                                item: true,
                                                xs: apps.length === 1 ? 12 : 6,
                                                className: classes.gridItem,
                                                children: /*#__PURE__*/ _jsx(Card, {
                                                    onClick: (event)=>handleMenuItemClick(app.url),
                                                    className: classes.card,
                                                    children: /*#__PURE__*/ _jsxs(CardContent, {
                                                        className: classes.cardContent,
                                                        children: [
                                                            /*#__PURE__*/ _jsx(LaunchIcon, {
                                                                fontSize: "large"
                                                            }),
                                                            /*#__PURE__*/ _jsx(Typography, {
                                                                variant: "subtitle1",
                                                                gutterBottom: true,
                                                                style: {
                                                                    lineHeight: 1
                                                                },
                                                                children: app.name
                                                            }),
                                                            app.description
                                                        ]
                                                    })
                                                }, app.url)
                                            }, app.name))
                                    })
                                })
                            })
                        })
                })
            ]
        })
    });
};
/**
 * Return the application menu
 * @returns The menu or null if the user has no applications to display.
 */ const ApplicationMenu = ()=>{
    const [{ auth: authData }] = NeonContext.useNeonContextState();
    const apps = authData?.userData?.data?.apps;
    if (apps?.length > 0) {
        return /*#__PURE__*/ _jsx(Menu, {
            apps: apps
        });
    }
    return null;
};
export default ApplicationMenu;
