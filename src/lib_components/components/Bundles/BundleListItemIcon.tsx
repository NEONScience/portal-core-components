import React from 'react';

import ListItemIcon from '@mui/material/ListItemIcon';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { resolveProps } from '../../util/defaultProps';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  bundleIcon: {
    padding: '5px',
    marginRight: theme.spacing(2),
  },
}));

export interface BundleListItemIconProps {
  isSplit?: boolean;
}

const defaultProps: BundleListItemIconProps = {
  isSplit: false,
};

const BundleListItemIcon: React.FC<BundleListItemIconProps> = (
  inProps: BundleListItemIconProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps);
  const { classes } = useStyles();
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

export default BundleListItemIcon;
