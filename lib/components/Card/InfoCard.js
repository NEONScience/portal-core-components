import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import BaseCard, { CardType } from './BaseCard';
import { makeStyles } from '../Theme/makeStyles';
const useStyles = makeStyles()((muiTheme)=>({
        callout: {
            margin: muiTheme.spacing(0.5, 0, 3, 0),
            backgroundColor: muiTheme.colors.LIGHT_BLUE[50],
            borderColor: muiTheme.colors.LIGHT_BLUE[300]
        },
        calloutIcon: {
            color: muiTheme.colors.LIGHT_BLUE[300],
            marginRight: muiTheme.spacing(2)
        }
    }));
const InfoCard = (props)=>{
    const { classes } = useStyles();
    const { classes: calloutClasses } = props;
    const injectedCallout = calloutClasses ? calloutClasses.callout : undefined;
    const injectedCalloutIcon = calloutClasses ? calloutClasses.calloutIcon : undefined;
    return /*#__PURE__*/ _jsx(BaseCard, {
        ...props,
        type: CardType.INFO,
        calloutClasses: {
            callout: injectedCallout || classes.callout,
            calloutIcon: injectedCalloutIcon || classes.calloutIcon
        }
    });
};
export default InfoCard;
