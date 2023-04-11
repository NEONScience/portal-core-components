/* eslint-disable react/require-default-props */
import React from 'react';

import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import BaseMessageCard, { MessageCardType, BaseMessageCardProps } from './BaseMessageCard';
import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    card: {
      margin: muiTheme.spacing(0.5, 0, 3, 0),
      backgroundColor: 'rgba(230, 241, 251, 0.5)', // theme.colors.LIGHT_BLUE[50] with 'a' value applied
      borderColor: 'rgba(138, 191, 236, 0.5)', // theme.colors.LIGHT_BLUE[200] with 'a' value applied
    },
    primaryIcon: {
      marginRight: muiTheme.spacing(2),
    },
    secondaryIcon: {
      color: 'rgba(138, 191, 236, 0.9)', // theme.colors.LIGHT_BLUE[200] with 'a' value applied
      marginLeft: muiTheme.spacing(2),
    },
  })) as StylesHook;

interface InfoMessageCardClasses {
  card?: string;
  primaryIcon?: string;
  secondaryIcon?: string;
  cardTitleContentContainer?: string;
  messageContentContainer?: string;
}

type BaseInfoMessageCardProps = Omit<BaseMessageCardProps, 'type' | 'messageCardClasses'>;
export type InfoMessageCardProps = BaseInfoMessageCardProps & {
  classes?: InfoMessageCardClasses;
};

const InfoCard: React.FC<InfoMessageCardProps> = (props: InfoMessageCardProps): JSX.Element => {
  const classes = useStyles(Theme);
  const { classes: messageCardClasses }: InfoMessageCardProps = props;
  const injectedCard: string|undefined = messageCardClasses
    ? messageCardClasses.card
    : undefined;
  const injectedPrimaryIcon: string|undefined = messageCardClasses
    ? messageCardClasses.primaryIcon
    : undefined;
  const injectedSecondaryIcon: string|undefined = messageCardClasses
    ? messageCardClasses.secondaryIcon
    : undefined;
  return (
    <BaseMessageCard
      {...props}
      type={MessageCardType.INFO}
      messageCardClasses={{
        card: injectedCard || classes.card,
        primaryIcon: injectedPrimaryIcon || classes.primaryIcon,
        secondaryIcon: injectedSecondaryIcon || classes.secondaryIcon,
        cardTitleContentContainer: messageCardClasses?.cardTitleContentContainer,
        messageContentContainer: messageCardClasses?.messageContentContainer,
      }}
    />
  );
};

export default InfoCard;
