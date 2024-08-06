/* eslint-disable react/require-default-props */
import React from 'react';

import {
  makeStyles,
  createStyles,
} from '@mui/styles';
import { Theme as MuiTheme } from '@mui/material';

import BaseCard, { CardType, BaseCardProps } from './BaseCard';
import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';
import { StylesHook } from '../../types/muiTypes';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    callout: {
      margin: muiTheme.spacing(0.5, 0, 3, 0),
      backgroundColor: (Theme as NeonTheme).colors.RED[50],
      borderColor: (Theme as NeonTheme).colors.RED[300],
    },
    calloutIcon: {
      color: (Theme as NeonTheme).colors.RED[300],
      marginRight: muiTheme.spacing(2),
    },
  })) as StylesHook;

interface ErrorCardClasses {
  callout?: string;
  calloutIcon?: string;
}

type BaseErrorCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type ErrorCardProps = BaseErrorCardProps & {
  classes?: ErrorCardClasses;
};

const ErrorCard: React.FC<ErrorCardProps> = (props: ErrorCardProps): React.JSX.Element => {
  const classes = useStyles(Theme);
  const { classes: calloutClasses }: ErrorCardProps = props;
  const injectedCallout: string|undefined = calloutClasses
    ? calloutClasses.callout
    : undefined;
  const injectedCalloutIcon: string|undefined = calloutClasses
    ? calloutClasses.calloutIcon
    : undefined;
  return (
    <BaseCard
      {...props}
      type={CardType.ERROR}
      calloutClasses={{
        callout: injectedCallout || classes.callout,
        calloutIcon: injectedCalloutIcon || classes.calloutIcon,
      }}
    />
  );
};

export default ErrorCard;
