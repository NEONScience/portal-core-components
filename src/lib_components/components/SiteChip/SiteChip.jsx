import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Cancel';

import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  avatarLarge: {
    '& svg': {
      height: theme.spacing(3),
    },
  },
}));

const useChipStyles = makeStyles((theme) => ({
  outlined: {
    color: theme.palette.grey.A200,
  },
  outlinedPrimary: {
    color: theme.palette.primary.main,
  },
  outlinedSecondary: {
    color: theme.palette.secondary.main,
  },
}));

const SiteChip = (props) => {
  const classes = useStyles(Theme);
  const chipClasses = useChipStyles(Theme);
  const { label, ...otherProps } = props;

  // Default optional props
  if (!otherProps.color) { otherProps.color = 'secondary'; }
  if (!otherProps.variant) { otherProps.variant = 'outlined'; }
  if (!otherProps.size) { otherProps.size = 'small'; }
  if (!otherProps['data-selenium']) { otherProps['data-selenium'] = 'site-chip'; }

  // Backwards compatible with MUI v4
  if (otherProps.variant === 'default') {
    otherProps.variant = 'filled';
  }

  /*
    Avatar style overrides
    Material UI has a bug where Avatars in chips do not inherit styles correctly
    in production due to CSS class definition order and strict specificity. See here:
    https://github.com/mui-org/material-ui/issues/16374
    Should that get fixed upstream then all inline styles on <Avatar> can be removed.
    There is also no 'large' size despite having a small and medium, and we have
    use cases for large (see DataProductAvailability).
  */
  const avatarStyle = {
    width: '32px',
    height: '32px',
    marginLeft: '0px',
  };
  if (['primary', 'secondary'].includes(otherProps.color)) {
    avatarStyle.backgroundColor = Theme.palette[otherProps.color].main;
  }
  if (otherProps.size === 'small') {
    avatarStyle.width = '24px';
    avatarStyle.height = '24px';
  }

  /*
    General style overrides
    There is also 'large' size despite having a small and medium, and we have
    use cases for large (see DataProductAvailability).
  */
  const chipStyle = {};
  if (otherProps.variant === 'outlined') {
    chipStyle.backgroundColor = 'transparent';
  } else if ((otherProps.variant === 'filled') && (otherProps.color === 'secondary')) {
    chipStyle.backgroundColor = Theme.palette.secondary.main;
  } else if ((otherProps.variant === 'filled') && (otherProps.color === 'primary')) {
    chipStyle.backgroundColor = Theme.palette.primary.main;
  }
  const deleteIconStyle = {};
  let avatarClass = null;
  if (otherProps.size === 'large') {
    avatarClass = classes.avatarLarge;
    chipStyle.fontSize = '1rem';
    chipStyle.borderRadius = '20px';
    chipStyle.height = '40px';
    avatarStyle.width = '40px';
    avatarStyle.height = '40px';
    deleteIconStyle.width = '32px';
    deleteIconStyle.height = '32px';
    deleteIconStyle.margin = '0 6px 0 0';
  }

  return (
    <Chip
      {...otherProps}
      label={label}
      style={chipStyle}
      avatar={<Avatar className={avatarClass} style={avatarStyle}><PlaceIcon /></Avatar>}
      deleteIcon={<DeleteIcon style={deleteIconStyle} />}
      classes={chipClasses}
    />
  );
};

SiteChip.propTypes = {
  label: PropTypes.string.isRequired,
};

const WrappedSiteChip = Theme.getWrappedComponent(SiteChip);

export default WrappedSiteChip;
