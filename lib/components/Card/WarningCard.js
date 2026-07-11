import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import BaseCard, { CardType } from './BaseCard';
import { makeStyles } from '../Theme/makeStyles';
const useStyles = makeStyles()((theme)=>({
        callout: {
            margin: theme.spacing(0.5, 0, 3, 0),
            backgroundColor: theme.colors.BROWN[50],
            borderColor: theme.colors.BROWN[300]
        },
        calloutIcon: {
            color: theme.colors.BROWN[300],
            marginRight: theme.spacing(2)
        }
    }));
const WarningCard = (props)=>{
    const { classes } = useStyles();
    const { classes: calloutClasses } = props;
    const injectedCallout = calloutClasses ? calloutClasses.callout : undefined;
    const injectedCalloutIcon = calloutClasses ? calloutClasses.calloutIcon : undefined;
    return /*#__PURE__*/ _jsx(BaseCard, {
        ...props,
        type: CardType.WARN,
        calloutClasses: {
            callout: injectedCallout || classes.callout,
            calloutIcon: injectedCalloutIcon || classes.calloutIcon
        }
    });
};
export default WarningCard;
