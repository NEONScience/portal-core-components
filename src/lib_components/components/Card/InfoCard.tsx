import React from 'react';

import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import BaseCard, { CardType } from './BaseCard';
import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';
import { StylesHook } from '../../types/muiTypes';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    callout: {
      margin: muiTheme.spacing(0.5, 0, 3, 0),
      backgroundColor: (Theme as NeonTheme).colors.LIGHT_BLUE[50],
      borderColor: (Theme as NeonTheme).colors.LIGHT_BLUE[300],
    },
    calloutIcon: {
      color: (Theme as NeonTheme).colors.LIGHT_BLUE[300],
      marginRight: muiTheme.spacing(2),
    },
  })) as StylesHook;

export interface InfoCardProps {
  title: string;
  message?: string;
}

const InfoCard: React.FC<InfoCardProps> = (props: InfoCardProps): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    title,
    message,
  }: InfoCardProps = props;

  return (
    <BaseCard
      type={CardType.INFO}
      title={title}
      message={message}
      calloutClasses={{
        callout: classes.callout,
        calloutIcon: classes.calloutIcon,
      }}
    />
  );
};

export default InfoCard;
