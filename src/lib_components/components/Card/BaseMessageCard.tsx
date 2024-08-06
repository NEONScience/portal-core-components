/* eslint-disable react/require-default-props */
import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  makeStyles,
  createStyles,
} from '@mui/styles';
import { Theme as MuiTheme } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { exists, isStringNonEmpty } from '../../util/typeUtil';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titleContentContainer: {
      padding: muiTheme.spacing(2, 2.5, 1.5, 2.5),
    },
    textTitleContent: {
      flexGrow: 1,
      textTransform: 'uppercase',
      fontSize: '0.775rem',
    },
    messageContainer: {
      padding: muiTheme.spacing(0, 3, 3, 3),
    },
  })) as StylesHook;

export enum MessageCardType {
  INFO = 'INFO',
}

export interface BaseMessageCardClasses {
  card: string;
  primaryIcon: string;
  secondaryIcon: string;
  cardTitleContentContainer?: string;
  messageContentContainer?: string;
}

export interface BaseMessageCardProps {
  type: MessageCardType;
  messageCardClasses: BaseMessageCardClasses;
  icon?: React.ReactNode;
  title?: string;
  titleContent?: React.ReactNode;
  message?: string;
  messageContent?: React.ReactNode;
}

const BaseMessageCard: React.FC<BaseMessageCardProps> = (
  props: BaseMessageCardProps,
): React.JSX.Element => {
  const classes = useStyles(Theme);
  const {
    type,
    messageCardClasses,
    icon,
    title,
    titleContent,
    message,
    messageContent,
  }: BaseMessageCardProps = props;
  let appliedTitleContentContainer = classes.titleContentContainer;
  if (messageCardClasses && messageCardClasses.cardTitleContentContainer) {
    appliedTitleContentContainer = messageCardClasses.cardTitleContentContainer;
  }
  let iconContent: React.JSX.Element = (
    <InfoOutlinedIcon fontSize="small" className={messageCardClasses.primaryIcon} />
  );
  let secondaryIconContent: React.JSX.Element|null = null;
  switch (type) {
    case MessageCardType.INFO:
      if (exists(icon)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        iconContent = (<>{icon}</>);
      }
      secondaryIconContent = (
        <InfoOutlinedIcon fontSize="large" className={messageCardClasses.secondaryIcon} />
      );
      break;
    default:
      break;
  }

  const renderTitle = (): React.JSX.Element => {
    let titleTextContent: React.JSX.Element|null = null;
    if (isStringNonEmpty(title)) {
      titleTextContent = (
        <Typography variant="subtitle2" className={classes.textTitleContent}>
          {title}
        </Typography>
      );
    }
    let appliedTitleContent: React.JSX.Element|null = null;
    if (exists(titleContent)) {
      appliedTitleContent = (
        <div style={{ flexGrow: 1 }}>
          {titleContent}
        </div>
      );
    }
    return (
      <>
        {iconContent}
        {titleTextContent}
        {appliedTitleContent}
        {secondaryIconContent}
      </>
    );
  };

  const renderMessage = (): React.JSX.Element|null => {
    const hasCustomClass = (messageCardClasses && messageCardClasses.messageContentContainer);
    const injectedMessageContainerClass: string|undefined = hasCustomClass
      ? messageCardClasses.messageContentContainer
      : classes.messageContainer;
    if (exists(messageContent)) {
      return (
        <div className={injectedMessageContainerClass}>
          {messageContent}
        </div>
      );
    }
    if (isStringNonEmpty(message)) {
      return (
        <div className={injectedMessageContainerClass}>
          <Typography variant="body2">
            {message}
          </Typography>
        </div>
      );
    }
    return null;
  };

  const content = (
    <>
      <CardContent className={`${classes.startFlex} ${appliedTitleContentContainer}`}>
        {renderTitle()}
      </CardContent>
      {renderMessage()}
    </>
  );

  return (
    <div>
      <Card className={messageCardClasses.card}>
        {content}
      </Card>
    </div>
  );
};

export default BaseMessageCard;
