import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '../Theme/makeStyles';
const useStyles = makeStyles()((theme)=>({
        releaseIcon: {
            color: theme.colors.LIGHT_BLUE[600],
            fontSize: '1em',
            marginRight: theme.spacing(0.75)
        },
        releaseChip: {
            color: theme.colors.LIGHT_BLUE[600],
            border: `1px solid ${theme.colors.LIGHT_BLUE[600]}`,
            backgroundColor: theme.colors.LIGHT_BLUE[50],
            fontWeight: 600,
            cursor: 'help'
        }
    }));
const ReleaseChip = (props)=>{
    const { classes } = useStyles();
    const { tooltipTitle, chipLabel, classes: customClasses, chipStyle, tooltipProps } = props;
    const injectedChipClass = customClasses ? customClasses.chip : undefined;
    const injectedChipIconClass = customClasses ? customClasses.icon : undefined;
    return /*#__PURE__*/ _jsx(Tooltip, {
        ...tooltipProps,
        // eslint-disable-next-line react/jsx-no-useless-fragment
        title: /*#__PURE__*/ _jsx(_Fragment, {
            children: tooltipTitle
        }),
        children: /*#__PURE__*/ _jsx(Chip, {
            size: "small",
            className: injectedChipClass || classes.releaseChip,
            style: chipStyle,
            label: /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(FontAwesomeIcon, {
                        icon: faTag,
                        size: "1x",
                        className: injectedChipIconClass || classes.releaseIcon
                    }),
                    chipLabel
                ]
            })
        })
    });
};
export default ReleaseChip;
