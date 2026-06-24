/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import EmailIcon from '@material-ui/icons/Email';
import {
  makeStyles,
  createStyles,
  Theme as MuiThemeType,
} from '@material-ui/core/styles';

import moment, { Moment } from 'moment';

import Theme from '../Theme/Theme';
import { StringPropsObject, StylesHook } from '../../types/core';
import { exists } from '../../util/typeUtil';

// eslint-disable-next-line no-unused-vars
const useStyles: StylesHook = makeStyles((theme: MuiThemeType) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    cardHeaderContainer: {
      padding: '10px',
      '& label.account-title': {
        marginLeft: '20px',
        height: '68px',
        marginTop: '25px',
        fontWeight: 600,
        fontSize: '20px',
      },
      '& img.profile-image': {
        width: '120px',
      },
    },
    card: {
      margin: 'auto',
      textAlign: 'center',
    },
    profileArea: {
      '& img': {
        marginBottom: '15px',
        borderRadius: '50%',
        marginLeft: '10px',
        marginRight: '10px',
      },
    },
    profileInfoArea: {
      width: '100%',
      textAlign: 'left',
      display: 'inline-block',
      marginTop: '20px',
      '& i.fa': {
        marginRight: '10px',
      },
      '& i.fa-user': {
        verticalAlign: 'middle',
      },
      '& label': {
        fontSize: '16px',
        fontWeight: 600,
      },
      '& label.label-block': {
        display: 'block',
        paddingBottom: '5px',
      },
      '& div.label-info-container': {
        padding: '10px',
        paddingTop: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      '& div.label-name-container': {
        padding: '10px',
      },
      '& label.username-label': {
        verticalAlign: 'middle',
      },
      '& label.label-normal': {
        fontSize: '14px',
        fontWeight: 'normal',
        wordBreak: 'break-all',
      },
    },
    emailChipContainer: {
      '& .MuiChip-root': {
        height: '100% !important',
      },
      '& .MuiChip-label': {
        width: '100% !important',
        wordBreak: 'break-all !important',
        whiteSpace: 'normal !important',
        padding: '6px',
      },
      '& .chip-email.MuiChip-root': {
        fontSize: '.90em !important',
      },
      '& .chip-email .MuiAvatar-root.MuiChip-avatar.MuiChip-avatarColorPrimary': {
        width: '32px !important',
        height: '32px !important',
      },
    },
  })) as StylesHook;

export interface UserCardProps {
  pictureUrl: string;
  email: string;
  fullName: string;
  providers: string;
  // eslint-disable-next-line react/require-default-props
  lastLogin?: string;
}

const UserCard = (props: UserCardProps): JSX.Element => {
  const {
    pictureUrl,
    email,
    fullName,
    providers,
    lastLogin,
  }: UserCardProps = props;
  const classes: StringPropsObject = useStyles(Theme);

  let lastLoginDisplay: string | null = null;
  if (exists(lastLogin)) {
    const dateFmt: string = 'MMMM Do, YYYY h:mm:ss a';
    const lastLoginDate: Moment = moment(new Date(lastLogin as string));
    lastLoginDisplay = lastLoginDate.format(dateFmt);
  }

  return (
    <div className={classes.profileArea}>
      <div className={classes.card}>
        <div className={classes.cardHeaderContainer}>
          <img src={pictureUrl} className="profile-image" alt="Profile" />
        </div>
        <div>
          <Typography variant="h4" component="h4" style={{ margin: '10px' }}>
            {fullName}
          </Typography>
        </div>
        <div className={classes.emailChipContainer}>
          <Chip
            avatar={(
              <Avatar color="primary">
                <EmailIcon />
              </Avatar>
            )}
            key={email}
            label={email}
            className="chip-email"
            color="primary"
          />
        </div>
        <div className={classes.profileInfoArea}>
          <Divider />
          <div className="label-info-container">
            <label className="control-label label-block">
              Identity Provider
            </label>
            <label className="label-normal">{providers}</label>
          </div>
          <div className="label-info-container">
            <label className="control-label label-block">
              Last Login
            </label>
            <label className="label-normal">{lastLoginDisplay}</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
