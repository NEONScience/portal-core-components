import React from 'react';

import BaseCard, { CardType, BaseCardProps } from './BaseCard';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((muiTheme: NeonTheme) => ({
  callout: {
    margin: muiTheme.spacing(0.5, 0, 3, 0),
    backgroundColor: muiTheme.colors.LIGHT_BLUE[50],
    borderColor: muiTheme.colors.LIGHT_BLUE[300],
  },
  calloutIcon: {
    color: muiTheme.colors.LIGHT_BLUE[300],
    marginRight: muiTheme.spacing(2),
  },
}));

interface InfoCardClasses {
  callout?: string;
  calloutIcon?: string;
}

type BaseInfoCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type InfoCardProps = BaseInfoCardProps & {
  classes?: InfoCardClasses;
};

const InfoCard: React.FC<InfoCardProps> = (props: InfoCardProps): React.JSX.Element => {
  const { classes } = useStyles();
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
