import React from 'react';

import { makeStyles } from 'tss-react/mui';

import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import { type NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme) => ({
  card: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: (theme as NeonTheme).colors.GOLD[50],
    borderColor: (theme as NeonTheme).colors.GOLD[300],
  },
  cardSecondaryIcon: {
    color: (theme as NeonTheme).colors.GOLD[300],
    marginLeft: theme.spacing(2),
  },
}));

const ReleaseNoticeCard: React.FC<InfoMessageCardProps> = (
  props: InfoMessageCardProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  return (
    <InfoMessageCard
      {...props}
      title="Release Notice"
      classes={{
        card: classes.card,
        secondaryIcon: classes.cardSecondaryIcon,
      }}
    />
  );
};

export default ReleaseNoticeCard;
