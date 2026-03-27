import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { makeStyles, createStyles } from '@mui/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Theme from '../Theme/Theme';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        titleContentContainer: {
            padding: muiTheme.spacing(2, 2.5, 1.5, 2.5)
        },
        textTitleContent: {
            flexGrow: 1,
            textTransform: 'uppercase',
            fontSize: '0.775rem'
        },
        messageContainer: {
            padding: muiTheme.spacing(0, 3, 3, 3)
        }
    }));
export var MessageCardType = /*#__PURE__*/ function(MessageCardType) {
    MessageCardType["INFO"] = "INFO";
    return MessageCardType;
}({});
const BaseMessageCard = (props)=>{
    const classes = useStyles(Theme);
    const { type, messageCardClasses, icon, title, titleContent, message, messageContent } = props;
    let appliedTitleContentContainer = classes.titleContentContainer;
    if (messageCardClasses && messageCardClasses.cardTitleContentContainer) {
        appliedTitleContentContainer = messageCardClasses.cardTitleContentContainer;
    }
    let iconContent = /*#__PURE__*/ _jsx(InfoOutlinedIcon, {
        fontSize: "small",
        className: messageCardClasses.primaryIcon
    });
    let secondaryIconContent = null;
    switch(type){
        case "INFO":
            if (exists(icon)) {
                // eslint-disable-next-line react/jsx-no-useless-fragment
                iconContent = /*#__PURE__*/ _jsx(_Fragment, {
                    children: icon
                });
            }
            secondaryIconContent = /*#__PURE__*/ _jsx(InfoOutlinedIcon, {
                fontSize: "large",
                className: messageCardClasses.secondaryIcon
            });
            break;
        default:
            break;
    }
    const renderTitle = ()=>{
        let titleTextContent = null;
        if (isStringNonEmpty(title)) {
            titleTextContent = /*#__PURE__*/ _jsx(Typography, {
                variant: "subtitle2",
                className: classes.textTitleContent,
                children: title
            });
        }
        let appliedTitleContent = null;
        if (exists(titleContent)) {
            appliedTitleContent = /*#__PURE__*/ _jsx("div", {
                style: {
                    flexGrow: 1
                },
                children: titleContent
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                iconContent,
                titleTextContent,
                appliedTitleContent,
                secondaryIconContent
            ]
        });
    };
    const renderMessage = ()=>{
        const hasCustomClass = messageCardClasses && messageCardClasses.messageContentContainer;
        const injectedMessageContainerClass = hasCustomClass ? messageCardClasses.messageContentContainer : classes.messageContainer;
        if (exists(messageContent)) {
            return /*#__PURE__*/ _jsx("div", {
                className: injectedMessageContainerClass,
                children: messageContent
            });
        }
        if (isStringNonEmpty(message)) {
            return /*#__PURE__*/ _jsx("div", {
                className: injectedMessageContainerClass,
                children: /*#__PURE__*/ _jsx(Typography, {
                    variant: "body2",
                    children: message
                })
            });
        }
        return null;
    };
    const content = /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(CardContent, {
                className: `${classes.startFlex} ${appliedTitleContentContainer}`,
                children: renderTitle()
            }),
            renderMessage()
        ]
    });
    return /*#__PURE__*/ _jsx("div", {
        children: /*#__PURE__*/ _jsx(Card, {
            className: messageCardClasses.card,
            children: content
        })
    });
};
export default BaseMessageCard;
