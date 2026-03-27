import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';
import InfoMessageCard from '../Card/InfoMessageCard';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import { exists } from '../../util/typeUtil';
const useStyles = makeStyles((theme)=>({
        cardIcon: {
            color: 'rgba(0, 0, 0, 0.9)',
            padding: '5px 0px',
            fontSize: '1.5em',
            marginRight: theme.spacing(2)
        },
        cardSecondaryIcon: {
            color: 'rgba(138, 191, 236, 0.9)',
            marginLeft: theme.spacing(2),
            fontSize: '1.5rem'
        },
        cardTitleContentContainer: {
            padding: theme.spacing(2, 2.5, 0.5, 2.5)
        },
        cardMessageContentContainer: {
            padding: theme.spacing(0.25, 2.5, 2, 2.5)
        }
    }));
const defaultProps = {
    titleContent: undefined,
    detailContent: undefined,
    subTitleContent: undefined,
    customContent: undefined,
    isSplit: false,
    classes: undefined
};
const DataProductBundleCard = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { titleContent, subTitleContent, detailContent, customContent, isSplit, classes: customClasses } = props;
    const customIconClass = customClasses ? customClasses.cardIcon : undefined;
    const renderContent = ()=>{
        if (exists(customContent)) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {
                children: customContent
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                !exists(titleContent) ? null : /*#__PURE__*/ _jsx(Typography, {
                    variant: "subtitle2",
                    children: titleContent
                }),
                !exists(detailContent) ? null : // eslint-disable-next-line react/jsx-no-useless-fragment
                /*#__PURE__*/ _jsx(_Fragment, {
                    children: detailContent
                }),
                !exists(subTitleContent) ? null : /*#__PURE__*/ _jsx(Typography, {
                    variant: "body2",
                    children: subTitleContent
                })
            ]
        });
    };
    return /*#__PURE__*/ _jsx(InfoMessageCard, {
        title: "Data Product Bundle",
        messageContent: renderContent(),
        icon: /*#__PURE__*/ _jsx(FontAwesomeIcon, {
            icon: isSplit ? faBoxesStacked : faBox,
            size: "1x",
            className: customIconClass || classes.cardIcon
        }),
        classes: {
            secondaryIcon: classes.cardSecondaryIcon,
            cardTitleContentContainer: classes.cardTitleContentContainer,
            messageContentContainer: classes.cardMessageContentContainer
        }
    });
};
export default DataProductBundleCard;
