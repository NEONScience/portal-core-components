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
      backgroundColor: (Theme as NeonTheme).colors.BROWN[50],
      borderColor: (Theme as NeonTheme).colors.BROWN[300],
    },
    calloutIcon: {
      color: (Theme as NeonTheme).colors.BROWN[300],
      marginRight: muiTheme.spacing(2),
    },
  })) as StylesHook;

interface WarningCardClasses {
  callout?: string;
  calloutIcon?: string;
}

type BaseWarningCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type WarningCardProps = BaseWarningCardProps & {
  classes?: WarningCardClasses;
};

const WarningCard: React.FC<WarningCardProps> = (props: WarningCardProps): React.JSX.Element => {
  const classes = useStyles(Theme);
  const { classes: calloutClasses }: WarningCardProps = props;
  const injectedCallout: string|undefined = calloutClasses
    ? calloutClasses.callout
    : undefined;
  const injectedCalloutIcon: string|undefined = calloutClasses
    ? calloutClasses.calloutIcon
    : undefined;
  return (
    <BaseCard
      {...props}
      type={CardType.WARN}
      calloutClasses={{
        callout: injectedCallout || classes.callout,
        calloutIcon: injectedCalloutIcon || classes.calloutIcon,
      }}
    />
  );
};

export default WarningCard;
