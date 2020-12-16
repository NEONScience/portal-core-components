import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Theme from '../Theme/Theme';

/**
 NOTE: The excessive styling here is intended to make the NeonUtilityBar
 component have visual parity with the legacy Utility Bar still being used
 on the Neon Science and Biorepository sites.

 When those sites are serving their utility bars from this shared component
 (i.e. this component is the ONLY implementation of the utility bar) then
 visual changes can be made here and appear consistently across all sites.
*/

const useTabsStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: theme.spacing(3),
    /* borderBottom: '3px solid #fff', */
  },
  indicator: {
    display: 'none',
  },
  flexContainer: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
    },
  },
}));

const useTabStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',
    backgroundColor: theme.palette.secondary.main,
    border: 'none',
    minHeight: theme.spacing(3),
    '&:hover': {
      textDecoration: 'underline',
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
    },
    '&$selected': {
      color: `${theme.palette.secondary.main} !important`,
      backgroundColor: '#fff !important',
    },
    fontWeight: 600,
    letterSpacing: '1px',
    lineHeight: 1.65,
    fontSize: '1rem',
    padding: `${theme.spacing(0.25)}px ${theme.spacing(3.5)}px`,
    [theme.breakpoints.down('sm')]: {
      lineHeight: 1.8,
      fontSize: '0.8rem',
      padding: `${theme.spacing(0.25)}px ${theme.spacing(2)}px`,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.75rem',
      padding: `${theme.spacing(0.25)}px ${theme.spacing(1.5)}px`,
    },
  },
  selected: {},
  textColorInherit: {
    opacity: 1,
  },
}));

const NeonUtilityBar = (props) => {
  const tabsClasses = useTabsStyles(Theme);
  const tabClasses = useTabStyles(Theme);

  const { selectedTab } = props;

  const scienceUrl = 'https://neonscience.org';
  const dataUrl = 'https://data.neonscience.org/home';
  const bioUrl = 'https://biorepo.neonscience.org/portal/index.php';

  return (
    <AppBar position="static" data-selenium="neon-utility-bar" color="secondary" elevation={2}>
      <Tabs value={selectedTab} classes={tabsClasses}>
        <Tab classes={tabClasses} value="science" label="Neon Science" href={scienceUrl} />
        <Tab classes={tabClasses} value="data" label="Data Portal" href={dataUrl} />
        <Tab classes={tabClasses} value="bio" label="Biorepository" href={bioUrl} />
      </Tabs>
    </AppBar>
  );
};

NeonUtilityBar.propTypes = {
  selectedTab: PropTypes.string,
};

NeonUtilityBar.defaultProps = {
  selectedTab: 'data',
};

export default NeonUtilityBar;
