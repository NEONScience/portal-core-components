import React from 'react';

import { makeStyles } from 'tss-react/mui';

import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';

const useStyles: StylesHook = makeStyles()((theme: NeonTheme) =>
  ({
    card: {
      margin: theme.spacing(0.5, 0, 3, 0),
      backgroundColor: theme.colors.GOLD[50],
      borderColor: theme.colors.GOLD[300],
    },

    cardSecondaryIcon: {
      color: theme.colors.GOLD[300],
      marginLeft: theme.spacing(2),
    }
  })) as StylesHook;

const ReleaseNoticeCard: React.FC<InfoMessageCardProps> = (
  props: InfoMessageCardProps,
): React.JSX.Element => {
  const { classes } = useStyles(Theme, {
    props: Theme,
  });
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
