import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import BaseMessageCard, { MessageCardType } from './BaseMessageCard';
import { makeStyles } from '../Theme/makeStyles';
const useStyles = makeStyles()((muiTheme)=>({
        card: {
            margin: muiTheme.spacing(0.5, 0, 3, 0),
            backgroundColor: 'rgba(230, 241, 251, 0.5)',
            borderColor: 'rgba(138, 191, 236, 0.5)'
        },
        primaryIcon: {
            marginRight: muiTheme.spacing(2)
        },
        secondaryIcon: {
            color: 'rgba(138, 191, 236, 0.9)',
            marginLeft: muiTheme.spacing(2)
        }
    }));
const InfoCard = (props)=>{
    const { classes } = useStyles();
    const { classes: messageCardClasses } = props;
    const injectedCard = messageCardClasses ? messageCardClasses.card : undefined;
    const injectedPrimaryIcon = messageCardClasses ? messageCardClasses.primaryIcon : undefined;
    const injectedSecondaryIcon = messageCardClasses ? messageCardClasses.secondaryIcon : undefined;
    return /*#__PURE__*/ _jsx(BaseMessageCard, {
        ...props,
        type: MessageCardType.INFO,
        messageCardClasses: {
            card: injectedCard || classes.card,
            primaryIcon: injectedPrimaryIcon || classes.primaryIcon,
            secondaryIcon: injectedSecondaryIcon || classes.secondaryIcon,
            cardTitleContentContainer: messageCardClasses?.cardTitleContentContainer,
            messageContentContainer: messageCardClasses?.messageContentContainer
        }
    });
};
export default InfoCard;
