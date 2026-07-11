import React from 'react';

import BaseCard, { CardType, BaseCardProps } from './BaseCard';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  callout: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.BROWN[50],
    borderColor: theme.colors.BROWN[300],
  },
  calloutIcon: {
    color: theme.colors.BROWN[300],
    marginRight: theme.spacing(2),
  },
}));

interface WarningCardClasses {
  callout?: string;
  calloutIcon?: string;
}

type BaseWarningCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type WarningCardProps = BaseWarningCardProps & {
  classes?: WarningCardClasses;
};

const WarningCard: React.FC<WarningCardProps> = (props: WarningCardProps): React.JSX.Element => {
  const { classes } = useStyles();
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
