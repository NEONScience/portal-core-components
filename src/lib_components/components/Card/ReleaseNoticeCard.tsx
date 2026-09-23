import React from 'react';

import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import { makeStyles } from '../Theme/makeStyles';
import { type NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  card: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.GOLD[50],
    borderColor: theme.colors.GOLD[300],
  },
  cardSecondaryIcon: {
    color: theme.colors.GOLD[300],
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
