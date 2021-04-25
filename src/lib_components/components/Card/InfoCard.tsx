/* eslint-disable react/require-default-props */
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

interface InfoCardClasses {
  callout?: string;
  calloutIcon?: string;
}

type BaseInfoCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type InfoCardProps = BaseInfoCardProps & {
  classes?: InfoCardClasses;
};

const InfoCard: React.FC<InfoCardProps> = (props: InfoCardProps): JSX.Element => {
  const classes = useStyles(Theme);
  const { classes: calloutClasses }: InfoCardProps = props;
  const injectedCallout: string|undefined = calloutClasses
    ? calloutClasses.callout
    : undefined;
  const injectedCalloutIcon: string|undefined = calloutClasses
    ? calloutClasses.calloutIcon
    : undefined;
  return (
    <BaseCard
      {...props}
      type={CardType.INFO}
      calloutClasses={{
        callout: injectedCallout || classes.callout,
        calloutIcon: injectedCalloutIcon || classes.calloutIcon,
      }}
    />
  );
};

export default InfoCard;
