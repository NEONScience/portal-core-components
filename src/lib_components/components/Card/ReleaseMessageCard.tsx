import React from 'react';

import { makeStyles } from 'tss-react/mui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';

const useStyles = makeStyles()((theme) => ({
  customIcon: {
    color: 'rgba(0, 0, 0, 0.9)',
    padding: '5px',
    fontSize: '1.5em',
    marginRight: theme.spacing(2),
  },
}));

const ReleaseMessageCard: React.FC<InfoMessageCardProps> = (
  props: InfoMessageCardProps,
): React.JSX.Element => {
  const { classes } = useStyles();
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
