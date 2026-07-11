import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import InfoMessageCard from './InfoMessageCard';
import { makeStyles } from '../Theme/makeStyles';
const useStyles = makeStyles()((theme)=>({
        customIcon: {
            color: 'rgba(0, 0, 0, 0.9)',
            padding: '5px',
            fontSize: '1.5em',
            marginRight: theme.spacing(2)
        }
    }));
const ReleaseMessageCard = (props)=>{
    const { classes } = useStyles();
    return /*#__PURE__*/ _jsx(InfoMessageCard, {
        ...props,
        title: "Data Product Release",
        icon: /*#__PURE__*/ _jsx(FontAwesomeIcon, {
            icon: faTag,
            size: "1x",
            className: classes.customIcon
        })
    });
};
export default ReleaseMessageCard;
