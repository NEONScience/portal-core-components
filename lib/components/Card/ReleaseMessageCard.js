import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import InfoMessageCard from './InfoMessageCard';
import Theme from '../Theme/Theme';
const useStyles = makeStyles((theme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        customIcon: {
            color: 'rgba(0, 0, 0, 0.9)',
            padding: '5px',
            fontSize: '1.5em',
            marginRight: theme.spacing(2)
        }
    }));
const ReleaseMessageCard = (props)=>{
    const classes = useStyles(Theme);
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
