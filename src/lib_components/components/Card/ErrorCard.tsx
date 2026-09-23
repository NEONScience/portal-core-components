import React from 'react';

import BaseCard, { CardType, BaseCardProps } from './BaseCard';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((muiTheme: NeonTheme) => ({
  callout: {
    margin: muiTheme.spacing(0.5, 0, 3, 0),
    backgroundColor: muiTheme.colors.RED[50],
    borderColor: muiTheme.colors.RED[300],
  },
  calloutIcon: {
    color: muiTheme.colors.RED[300],
    marginRight: muiTheme.spacing(2),
  },
}));

interface ErrorCardClasses {
  callout?: string;
  calloutIcon?: string;
}

type BaseErrorCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type ErrorCardProps = BaseErrorCardProps & {
  classes?: ErrorCardClasses;
};

const ErrorCard: React.FC<ErrorCardProps> = (props: ErrorCardProps): React.JSX.Element => {
  const { classes } = useStyles();
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
