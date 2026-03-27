import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import BaseCard, { CardType } from './BaseCard';
import Theme from '../Theme/Theme';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        callout: {
            margin: muiTheme.spacing(0.5, 0, 3, 0),
            backgroundColor: Theme.colors.LIGHT_BLUE[50],
            borderColor: Theme.colors.LIGHT_BLUE[300]
        },
        calloutIcon: {
            color: Theme.colors.LIGHT_BLUE[300],
            marginRight: muiTheme.spacing(2)
        }
    }));
const InfoCard = (props)=>{
    const classes = useStyles(Theme);
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
