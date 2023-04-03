import React from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles((theme: NeonTheme) => ({
  bundleIcon: {
    padding: '5px',
    marginRight: theme.spacing(2),
  },
}));

export interface BundleListItemIconProps {
  isSplit?: boolean;
}

const BundleListItemIcon: React.FC<BundleListItemIconProps> = (
  props: BundleListItemIconProps,
): JSX.Element => {
  const classes = useStyles(Theme);
  const { isSplit }: BundleListItemIconProps = props;
  return (
    <ListItemIcon>
      <FontAwesomeIcon
        icon={isSplit ? faBoxesStacked : faBox}
        size="2x"
        className={classes.bundleIcon}
      />
    </ListItemIcon>
  );
};

BundleListItemIcon.defaultProps = {
  isSplit: false,
};

export default BundleListItemIcon;
