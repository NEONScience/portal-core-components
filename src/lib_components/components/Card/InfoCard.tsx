import React from 'react';

import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import BaseCard, { CardType, BaseCardProps } from './BaseCard';
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

export type InfoCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;

const InfoCard: React.FC<InfoCardProps> = (props: InfoCardProps): JSX.Element => {
  const classes = useStyles(Theme);
  return (
    <BaseCard
      {...props}
      type={CardType.INFO}
      calloutClasses={{
        callout: classes.callout,
        calloutIcon: classes.calloutIcon,
      }}
    />
  );
};

export default InfoCard;
