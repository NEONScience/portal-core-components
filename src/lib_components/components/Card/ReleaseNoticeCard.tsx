/* eslint-disable react/require-default-props */
import React from 'react';

import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';

import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';

const useStyles: StylesHook = makeStyles((theme: NeonTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    card: {
      margin: theme.spacing(0.5, 0, 3, 0),
      backgroundColor: theme.colors.GOLD[50],
      borderColor: theme.colors.GOLD[300],
    },
    cardSecondaryIcon: {
      color: theme.colors.GOLD[300],
      marginLeft: theme.spacing(2),
    },
  })) as StylesHook;

const ReleaseNoticeCard: React.FC<InfoMessageCardProps> = (
  props: InfoMessageCardProps,
): JSX.Element => {
  const classes = useStyles(Theme);
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
