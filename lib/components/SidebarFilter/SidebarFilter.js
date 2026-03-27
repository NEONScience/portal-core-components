import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/jsx-no-useless-fragment */ import React, { useId } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles, createStyles } from '@mui/styles';
import Skeleton from '@mui/material/Skeleton';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import Theme from '../Theme/Theme';
import { isStringNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        title: {
            fontWeight: 500
        },
        titleContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: muiTheme.spacing(1)
        },
        selectInput: {
            width: '100%',
            marginBottom: muiTheme.spacing(0.5),
            backgroundColor: '#fff'
        },
        descriptionContainer: {
            marginTop: muiTheme.spacing(0.5)
        },
        descriptionFlexInnerContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        description: {
            display: 'block',
            color: muiTheme.palette.grey[400],
            overflowWrap: 'break-word'
        },
        descriptionLabel: {
            fontWeight: 700,
            color: muiTheme.palette.grey[400],
            marginRight: muiTheme.spacing(1)
        },
        menuItemSubtitle: {
            color: muiTheme.palette.grey[400]
        },
        horizontalFlex: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        horizontalDescriptions: {
            marginLeft: Theme.spacing(3),
            '& > div:first-child': {
                marginTop: '-2px !important'
            }
        }
    }));
const SidebarFilter = (props)=>{
    const classes = useStyles(Theme);
    const { title, skeleton, selected, values, maxWidth, horizontal, onChange, tooltipText, helperText, ...otherProps } = props;
    const instanceId = useId();
    const selectSeleniumId = `sidebar-filter-select-selenium-${instanceId}`;
    const inputId = `sidebar-filter-input-${instanceId}`;
    const labelId = `sidebar-filter-label-${instanceId}`;
    // SANITY CHECK: Render nothing if there are no releases and null release is excluded
    const optionCount = values.length + (values ? 0 : 1);
    if (!optionCount) {
        return /*#__PURE__*/ _jsx(_Fragment, {});
    }
    const handleChange = (nextValue)=>onChange(nextValue);
    const maxWidthStyle = maxWidth ? {
        maxWidth: `${maxWidth}px`
    } : {};
    const input = /*#__PURE__*/ _jsx(OutlinedInput, {
        id: inputId,
        name: inputId,
        size: "small",
        className: classes.selectInput,
        style: maxWidthStyle
    });
    const tooltip = !isStringNonEmpty(tooltipText) ? /*#__PURE__*/ _jsx(_Fragment, {}) : /*#__PURE__*/ _jsx("div", {
        children: tooltipText
    });
    const titleNode = !title ? null : /*#__PURE__*/ _jsxs("div", {
        className: classes.titleContainer,
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "h5",
                component: "h3",
                className: classes.title,
                id: labelId,
                children: title
            }),
            /*#__PURE__*/ _jsx(Tooltip, {
                placement: "right",
                title: tooltip,
                children: /*#__PURE__*/ _jsx(IconButton, {
                    size: "small",
                    style: {
                        marginLeft: Theme.spacing(0.5)
                    },
                    children: /*#__PURE__*/ _jsx(InfoIcon, {
                        fontSize: "small"
                    })
                })
            })
        ]
    });
    // Render skeleton
    if (skeleton) {
        const skeletonStyle = {
            marginBottom: Theme.spacing(1)
        };
        return /*#__PURE__*/ _jsxs("div", {
            ...otherProps,
            style: {
                maxWidth: `${maxWidth}px`,
                overflow: 'hidden'
            },
            children: [
                titleNode,
                /*#__PURE__*/ _jsx(Skeleton, {
                    variant: "rectangular",
                    width: maxWidth,
                    height: 36,
                    style: skeletonStyle
                }),
                /*#__PURE__*/ _jsx(Skeleton, {
                    width: "70%",
                    height: 16,
                    style: skeletonStyle
                })
            ]
        });
    }
    const selectNode = /*#__PURE__*/ _jsx(Select, {
        "data-selenium": selectSeleniumId,
        value: selected,
        onChange: (event)=>handleChange(event.target.value),
        input: input,
        "aria-labelledby": labelId,
        disabled: optionCount < 2,
        children: values.map((option)=>/*#__PURE__*/ _jsx(MenuItem, {
                value: option.value,
                children: /*#__PURE__*/ _jsx("div", {
                    children: /*#__PURE__*/ _jsx(Typography, {
                        display: "block",
                        children: option.title
                    })
                })
            }, option.value))
    });
    const renderHelperText = ()=>{
        if (!isStringNonEmpty(helperText)) {
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsx("div", {
            className: classes.descriptionContainer,
            children: /*#__PURE__*/ _jsx(Typography, {
                variant: "caption",
                className: classes.description,
                children: helperText
            })
        });
    };
    // Final Render
    return horizontal ? /*#__PURE__*/ _jsxs("div", {
        ...otherProps,
        children: [
            /*#__PURE__*/ _jsx("div", {
                children: titleNode
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.horizontalFlex,
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        style: maxWidth ? {
                            width: `${maxWidth}px`
                        } : {},
                        children: selectNode
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: classes.horizontalDescriptions,
                        children: renderHelperText()
                    })
                ]
            })
        ]
    }) : /*#__PURE__*/ _jsxs("div", {
        ...otherProps,
        style: {
            width: '100%',
            ...maxWidthStyle
        },
        children: [
            titleNode,
            selectNode,
            renderHelperText()
        ]
    });
};
export default SidebarFilter;
