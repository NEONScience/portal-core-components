import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import BaseCard, { CardType } from './BaseCard';
import Theme from '../Theme/Theme';
const useStyles = makeStyles()((theme)=>({
        callout: {
            margin: theme.spacing(0.5, 0, 3, 0),
            backgroundColor: Theme.colors.BROWN[50],
            borderColor: Theme.colors.BROWN[300]
        },
        calloutIcon: {
            color: Theme.colors.BROWN[300],
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
