import React from 'react';

import { makeStyles } from 'tss-react/mui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';

const useStyles: StylesHook = makeStyles()((theme: NeonTheme) =>
  ({
    customIcon: {
      color: 'rgba(0, 0, 0, 0.9)',
      padding: '5px',
      fontSize: '1.5em',
      marginRight: theme.spacing(2),
    }
  })) as StylesHook;

const ReleaseMessageCard: React.FC<InfoMessageCardProps> = (
  props: InfoMessageCardProps,
): React.JSX.Element => {
  const { classes } = useStyles(Theme, {
    props: Theme,
  });
  return (
    <InfoMessageCard
      {...props}
      title="Data Product Release"
      icon={(
        <FontAwesomeIcon
          icon={faTag}
          size="1x"
          className={classes.customIcon}
        />
      )}
    />
  );
};

export default ReleaseMessageCard;
