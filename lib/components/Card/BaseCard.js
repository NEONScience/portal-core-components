import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { makeStyles, createStyles } from '@mui/styles';
import InfoIcon from '@mui/icons-material/Info';
import WarnIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import ResetIcon from '@mui/icons-material/Autorenew';
import Theme from '../Theme/Theme';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        divider: {
            margin: muiTheme.spacing(0, 3, 0, 3)
        },
        messageContainer: {
            padding: muiTheme.spacing(3, 3, 3, 3)
        }
    }));
export var CardType = /*#__PURE__*/ function(CardType) {
    CardType["INFO"] = "INFO";
    CardType["WARN"] = "WARN";
    CardType["ERROR"] = "ERROR";
    return CardType;
}({});
const BaseCard = (props)=>{
    const classes = useStyles(Theme);
    const { type, title, calloutClasses, message, titleContent, actionLabel, onActionClick } = props;
    let iconContent = /*#__PURE__*/ _jsx(InfoIcon, {
        fontSize: "large",
        className: calloutClasses.calloutIcon
    });
    switch(type){
        case "WARN":
            iconContent = /*#__PURE__*/ _jsx(WarnIcon, {
                fontSize: "large",
                className: calloutClasses.calloutIcon
            });
            break;
        case "ERROR":
            iconContent = /*#__PURE__*/ _jsx(ErrorIcon, {
                fontSize: "large",
                className: calloutClasses.calloutIcon
            });
            break;
        case "INFO":
        default:
            break;
    }
    const renderTitle = ()=>{
        let titleTextContent = null;
        if (isStringNonEmpty(title)) {
            titleTextContent = /*#__PURE__*/ _jsx(Typography, {
                variant: "subtitle2",
                style: {
                    flexGrow: 1
                },
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
        let action;
        const appliedLabel = isStringNonEmpty(actionLabel) ? actionLabel : 'Reset';
        if (exists(onActionClick)) {
            action = /*#__PURE__*/ _jsx("div", {
                children: /*#__PURE__*/ _jsx(Button, {
                    variant: "outlined",
                    onClick: onActionClick,
                    startIcon: /*#__PURE__*/ _jsx(ResetIcon, {}),
                    children: appliedLabel
                })
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                iconContent,
                titleTextContent,
                appliedTitleContent,
                action
            ]
        });
    };
    const content = /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(CardContent, {
                className: classes.startFlex,
                children: renderTitle()
            }),
            isStringNonEmpty(message) ? /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(Divider, {
                        className: classes.divider
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: classes.messageContainer,
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            children: message
                        })
                    })
                ]
            }) : null
        ]
    });
    return /*#__PURE__*/ _jsx("div", {
        children: /*#__PURE__*/ _jsx(Card, {
            className: calloutClasses.callout,
            children: content
        })
    });
};
export default BaseCard;
