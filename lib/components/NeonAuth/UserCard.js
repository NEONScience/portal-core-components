import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/label-has-associated-control */ import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import EmailIcon from '@mui/icons-material/Email';
import { makeStyles, createStyles } from '@mui/styles';
import moment from 'moment';
import Theme from '../Theme/Theme';
import { exists } from '../../util/typeUtil';
const useStyles = makeStyles((theme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        cardHeaderContainer: {
            padding: '10px',
            '& label.account-title': {
                marginLeft: '20px',
                height: '68px',
                marginTop: '25px',
                fontWeight: 600,
                fontSize: '20px'
            },
            '& img.profile-image': {
                width: '120px'
            }
        },
        card: {
            margin: 'auto',
            textAlign: 'center'
        },
        profileArea: {
            '& img': {
                marginBottom: '15px',
                borderRadius: '50%',
                marginLeft: '10px',
                marginRight: '10px'
            }
        },
        profileInfoArea: {
            width: '100%',
            textAlign: 'left',
            display: 'inline-block',
            marginTop: '20px',
            '& i.fa': {
                marginRight: '10px'
            },
            '& i.fa-user': {
                verticalAlign: 'middle'
            },
            '& label': {
                fontSize: '16px',
                fontWeight: 600
            },
            '& label.label-block': {
                display: 'block',
                paddingBottom: '5px'
            },
            '& div.label-info-container': {
                padding: '10px',
                paddingTop: '20px',
                paddingLeft: '20px',
                paddingRight: '20px'
            },
            '& div.label-name-container': {
                padding: '10px'
            },
            '& label.username-label': {
                verticalAlign: 'middle'
            },
            '& label.label-normal': {
                fontSize: '14px',
                fontWeight: 'normal',
                wordBreak: 'break-all'
            }
        },
        emailChipContainer: {
            '& .MuiChip-root': {
                height: '100% !important'
            },
            '& .MuiChip-label': {
                width: '100% !important',
                wordBreak: 'break-all !important',
                whiteSpace: 'normal !important',
                padding: '6px'
            },
            '& .chip-email.MuiChip-root': {
                fontSize: '.90em !important'
            },
            '& .chip-email .MuiAvatar-root.MuiChip-avatar.MuiChip-avatarColorPrimary': {
                width: '32px !important',
                height: '32px !important'
            }
        }
    }));
const UserCard = (props)=>{
    const { pictureUrl, email, fullName, providers, lastLogin } = props;
    const classes = useStyles(Theme);
    let lastLoginDisplay = null;
    if (exists(lastLogin)) {
        const dateFmt = 'MMMM Do, YYYY h:mm:ss a';
        const lastLoginDate = moment(new Date(lastLogin));
        lastLoginDisplay = lastLoginDate.format(dateFmt);
    }
    return /*#__PURE__*/ _jsx("div", {
        className: classes.profileArea,
        children: /*#__PURE__*/ _jsxs("div", {
            className: classes.card,
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: classes.cardHeaderContainer,
                    children: /*#__PURE__*/ _jsx("img", {
                        src: pictureUrl,
                        className: "profile-image",
                        alt: "Profile"
                    })
                }),
                /*#__PURE__*/ _jsx("div", {
                    children: /*#__PURE__*/ _jsx(Typography, {
                        variant: "h4",
                        component: "h4",
                        style: {
                            margin: '10px'
                        },
                        children: fullName
                    })
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: classes.emailChipContainer,
                    children: /*#__PURE__*/ _jsx(Chip, {
                        avatar: /*#__PURE__*/ _jsx(Avatar, {
                            color: "primary",
                            children: /*#__PURE__*/ _jsx(EmailIcon, {})
                        }),
                        label: email,
                        className: "chip-email",
                        color: "primary"
                    }, email)
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.profileInfoArea,
                    children: [
                        /*#__PURE__*/ _jsx(Divider, {}),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "label-info-container",
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    className: "control-label label-block",
                                    children: "Identity Provider"
                                }),
                                /*#__PURE__*/ _jsx("label", {
                                    className: "label-normal",
                                    children: providers
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "label-info-container",
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    className: "control-label label-block",
                                    children: "Last Login"
                                }),
                                /*#__PURE__*/ _jsx("label", {
                                    className: "label-normal",
                                    children: lastLoginDisplay
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
export default UserCard;
