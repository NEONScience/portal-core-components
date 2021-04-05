import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import InfoIcon from '@material-ui/icons/Info';
import WarnIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

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
    divider: {
      margin: muiTheme.spacing(0, 3, 0, 3),
    },
    messageContainer: {
      padding: muiTheme.spacing(3, 3, 3, 3),
    },
  })) as StylesHook;

export enum CardType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface BaseCardClasses {
  callout: string;
  calloutIcon: string;
}

export interface BaseCardProps {
  type: CardType;
  calloutClasses: BaseCardClasses;
  title?: string;
  titleContent?: React.ReactNode;
  message?: string;
}

const BaseCard: React.FC<BaseCardProps> = (props: BaseCardProps): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    type,
    title,
    calloutClasses,
    message,
    titleContent,
  }: BaseCardProps = props;

  let iconContent: JSX.Element = (
    <InfoIcon fontSize="large" className={calloutClasses.calloutIcon} />
  );
  switch (type) {
    case CardType.WARN:
      iconContent = (
        <WarnIcon fontSize="large" className={calloutClasses.calloutIcon} />
      );
      break;
    case CardType.ERROR:
      iconContent = (
        <ErrorIcon fontSize="large" className={calloutClasses.calloutIcon} />
      );
      break;
    case CardType.INFO:
    default:
      break;
  }

  const renderTitle = (): JSX.Element => {
    let titleTextContent: JSX.Element = (<></>);
    if (isStringNonEmpty(title)) {
      titleTextContent = (
        <Typography variant="subtitle2" style={{ flexGrow: 1 }}>
          {title}
        </Typography>
      );
    }
    let appliedTitleContent: JSX.Element = (<></>);
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
      </>
    );
  };

  const content = (
    <>
      <CardContent className={classes.startFlex}>
        {renderTitle()}
      </CardContent>
      {isStringNonEmpty(message) ? (
        <>
          <Divider className={classes.divider} />
          <div className={classes.messageContainer}>
            <Typography variant="body2">
              {message}
            </Typography>
          </div>
        </>
      ) : null }
    </>
  );

  return (
    <div>
      <Card className={calloutClasses.callout}>
        {content}
      </Card>
    </div>
  );
};

export default BaseCard;
