import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import InfoMessageCard from './InfoMessageCard';
import Theme from '../Theme/Theme';
const useStyles = makeStyles((theme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        card: {
            margin: theme.spacing(0.5, 0, 3, 0),
            backgroundColor: theme.colors.GOLD[50],
            borderColor: theme.colors.GOLD[300]
        },
        cardSecondaryIcon: {
            color: theme.colors.GOLD[300],
            marginLeft: theme.spacing(2)
        }
    }));
const ReleaseNoticeCard = (props)=>{
    const classes = useStyles(Theme);
    return /*#__PURE__*/ _jsx(InfoMessageCard, {
        ...props,
        title: "Release Notice",
        classes: {
            card: classes.card,
            secondaryIcon: classes.cardSecondaryIcon
        }
    });
};
export default ReleaseNoticeCard;
