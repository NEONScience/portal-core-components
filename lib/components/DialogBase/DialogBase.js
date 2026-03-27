import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
const Transition = /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Slide, {
        direction: "up",
        ref: ref,
        ...props
    }));
const useStyles = (belowSm)=>makeStyles((theme)=>({
            dialogTitle: {
                marginLeft: theme.spacing(2),
                flex: 1
            },
            dialogPaper: {
                backgroundColor: theme.palette.grey[200],
                position: 'relative'
            },
            noPaper: {
                margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2)
            },
            contentPaper: {
                margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
                padding: theme.spacing(3)
            }
        }));
const defaultProps = {
    open: true,
    toolbarChildren: null,
    closeButtonProps: {},
    customClasses: {},
    nopaper: false,
    style: {}
};
const DialogBase = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
    const classes = useStyles(belowSm)(Theme);
    const { open, onClose, title, toolbarChildren, children, closeButtonProps, customClasses, nopaper, style, ...other } = props;
    const appliedPaperClass = customClasses && customClasses.contentPaper ? customClasses.contentPaper : classes.contentPaper;
    return /*#__PURE__*/ _jsxs(Dialog, {
        open: open,
        onClose: onClose,
        TransitionComponent: Transition,
        fullScreen: true,
        PaperProps: {
            className: classes.dialogPaper
        },
        style: {
            ...style,
            zIndex: Theme.zIndex.fullScreenBackdrop
        },
        ...other,
        children: [
            /*#__PURE__*/ _jsx(AppBar, {
                color: "secondary",
                children: /*#__PURE__*/ _jsxs(Toolbar, {
                    children: [
                        /*#__PURE__*/ _jsx(IconButton, {
                            "data-selenium": "dialog-close-button",
                            edge: "start",
                            color: "inherit",
                            onClick: onClose,
                            "aria-label": "cancel",
                            ...closeButtonProps,
                            size: "large",
                            children: /*#__PURE__*/ _jsx(CloseIcon, {})
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h5",
                            className: classes.dialogTitle,
                            noWrap: true,
                            children: title
                        }),
                        toolbarChildren
                    ]
                })
            }),
            nopaper ? /*#__PURE__*/ _jsx("div", {
                className: classes.noPaper,
                children: children
            }) : /*#__PURE__*/ _jsx(Paper, {
                className: appliedPaperClass,
                children: children
            })
        ]
    });
};
DialogBase.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    toolbarChildren: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.string
        ])),
        PropTypes.node,
        PropTypes.string
    ]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.string
        ])),
        PropTypes.node,
        PropTypes.string
    ]).isRequired,
    closeButtonProps: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])),
    customClasses: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string
    ])),
    nopaper: PropTypes.bool,
    style: PropTypes.object
};
export default DialogBase;
