import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Theme from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { exists } from '../../util/typeUtil';
const useStyles = makeStyles()((theme)=>({
        fullWidth: {
            width: '100%'
        },
        fitContent: {
            width: 'fit-content'
        },
        noChange: {}
    }));
const SplitButton = (props)=>{
    const { name, options, selectedOption, selectedOptionDisplayCallback, onClick, onChange, buttonGroupProps, buttonMenuProps, buttonProps, isFullWidth, styleOverrides } = props;
    const { classes } = useStyles();
    const [open, setOpen] = useState(false);
    const [stateSelectedOption, setStateSelectedOption] = useState(selectedOption);
    const anchorRef = useRef(null);
    const [anchorRefEl, setAnchorRefEl] = useState(null);
    let appliedButtonGroupProps = {
        variant: 'outlined',
        color: 'primary'
    };
    if (exists(buttonGroupProps)) {
        appliedButtonGroupProps = buttonGroupProps;
    }
    let appliedButtonProps = {
        color: 'primary',
        size: 'small'
    };
    if (exists(buttonProps)) {
        appliedButtonProps = buttonProps;
    }
    let appliedButtonMenuProps = {
        color: 'primary',
        size: 'small'
    };
    if (exists(buttonMenuProps)) {
        appliedButtonMenuProps = buttonMenuProps;
    }
    if (selectedOption !== stateSelectedOption) {
        setStateSelectedOption(selectedOption);
    }
    const handleClick = ()=>{
        onClick(stateSelectedOption);
    };
    const handleMenuItemClick = (event, index)=>{
        setStateSelectedOption(options[index]);
        onChange(options[index]);
        setOpen(false);
    };
    const handleToggle = ()=>{
        setAnchorRefEl(anchorRef.current);
        setOpen((prevOpen)=>!prevOpen);
    };
    const handleClose = (event)=>{
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const renderSelectedOption = ()=>{
        if (exists(selectedOptionDisplayCallback)) {
            // eslint-disable-next-line max-len
            return selectedOptionDisplayCallback(stateSelectedOption);
        }
        return stateSelectedOption;
    };
    const widthStyle = exists(isFullWidth) ? classes.fullWidth : classes.noChange;
    const iconWidthStyle = exists(isFullWidth) ? classes.fitContent : classes.noChange;
    const customStyles = exists(styleOverrides) ? styleOverrides : {};
    return /*#__PURE__*/ _jsx(Grid, {
        container: true,
        direction: "column",
        alignItems: "center",
        className: widthStyle,
        children: /*#__PURE__*/ _jsxs(Grid, {
            size: {
                xs: 12
            },
            className: widthStyle,
            children: [
                /*#__PURE__*/ _jsxs(ButtonGroup, {
                    "aria-label": `${name}-split-button`,
                    ...appliedButtonGroupProps,
                    ref: anchorRef,
                    className: widthStyle,
                    children: [
                        /*#__PURE__*/ _jsx(Button, {
                            ...appliedButtonProps,
                            onClick: handleClick,
                            className: widthStyle,
                            children: renderSelectedOption()
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                            "aria-controls": open ? `${name}-split-button-menu` : undefined,
                            "aria-expanded": open ? 'true' : undefined,
                            "aria-label": `${name}-split-button-select`,
                            "aria-haspopup": "menu",
                            ...appliedButtonMenuProps,
                            onClick: handleToggle,
                            className: iconWidthStyle,
                            style: {
                                ...customStyles
                            },
                            children: /*#__PURE__*/ _jsx(ArrowDropDownIcon, {})
                        })
                    ]
                }),
                /*#__PURE__*/ _jsx(Popper, {
                    transition: true,
                    anchorEl: anchorRefEl,
                    open: open,
                    role: undefined,
                    children: ({ TransitionProps, placement })=>/*#__PURE__*/ _jsx(Grow, {
                            ...TransitionProps,
                            style: {
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                            },
                            children: /*#__PURE__*/ _jsx(Paper, {
                                children: /*#__PURE__*/ _jsx(ClickAwayListener, {
                                    onClickAway: handleClose,
                                    children: /*#__PURE__*/ _jsx(MenuList, {
                                        id: `${name}-split-button-menu`,
                                        children: options.map((option, index)=>/*#__PURE__*/ _jsx(MenuItem, {
                                                selected: option === stateSelectedOption,
                                                onClick: (event)=>handleMenuItemClick(event, index),
                                                children: option
                                            }, option))
                                    })
                                })
                            })
                        })
                })
            ]
        })
    });
};
const WrappedSplitButton = Theme.getWrappedComponent(SplitButton);
export default WrappedSplitButton;
