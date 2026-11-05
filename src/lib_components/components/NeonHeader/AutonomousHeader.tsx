import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';

import AppsIcon from '@mui/icons-material/AppsRounded';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const NAVIGATION_ID = 'neon-autonomous-navigation';
const NAVIGATION_TITLE_ID = 'neon-autonomous-navigation-title';
const EASE_OUT_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const useStyles = makeStyles<void, 'tile'>()((theme: NeonTheme, _params, classes) => {
  const tileHover = {
    [`&:hover .${classes.tile}`]: {
      transform: 'rotate(-8deg) scale(1.08)',
    },
  };
  return {
    // Brand accent along the bottom edge, shared by the header and the drawer
    accented: {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${COLORS.NEON_BLUE[700]}, ${COLORS.LIGHT_BLUE[500]})`,
      },
    },
    appBar: {
      // Above the page content to show the shadow, below the NeonPage overlay backdrop
      zIndex: 10,
      backgroundColor: '#ffffff',
      // Matches the Drupal header
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    toolbar: {
      gap: theme.spacing(2),
    },
    // Mirrors the customized Drupal header navigation toggle
    menuButton: {
      flexShrink: 0,
      width: '40px',
      height: '40px',
      padding: '0px',
      borderRadius: '3px',
      border: `1px solid ${COLORS.LIGHT_BLUE[500]}`,
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
      minWidth: 0,
      borderRadius: '4px',
      color: COLORS.NEON_BLUE[700],
      textDecoration: 'none',
      '&:focus-visible': {
        outline: `2px solid ${COLORS.LIGHT_BLUE[500]}`,
        outlineOffset: '4px',
      },
      ...tileHover,
    },
    title: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    tile: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '36px',
      height: '36px',
      borderRadius: '9px',
      color: '#ffffff',
      fontSize: '22px',
      background: `linear-gradient(135deg, ${COLORS.NEON_BLUE[700]}, ${COLORS.LIGHT_BLUE[500]})`,
      boxShadow: `0px 1px 3px ${COLORS.NEON_BLUE[700]}4d, inset 0px 1px 0px #ffffff40`,
      transition: `transform 300ms ${EASE_OUT_BACK}`,
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
    tileSmall: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      fontSize: '20px',
    },
    drawerPaper: {
      width: '320px',
      maxWidth: '85vw',
    },
    drawerHeader: {
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1, 0, 3),
    },
    drawerTitle: {
      color: COLORS.GREY[400],
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    navList: {
      padding: theme.spacing(1.5, 0),
    },
    navItem: {
      gap: theme.spacing(2),
      padding: theme.spacing(1.5, 3),
      ...tileHover,
      // Marks the current application
      [`&.${listItemButtonClasses.selected}::before`]: {
        content: '""',
        position: 'absolute',
        top: theme.spacing(1),
        bottom: theme.spacing(1),
        left: 0,
        width: '3px',
        borderRadius: '0px 3px 3px 0px',
        backgroundColor: COLORS.LIGHT_BLUE[500],
      },
    },
    navItemIcon: {
      minWidth: 0,
    },
    navItemText: {
      color: COLORS.NEON_BLUE[700],
      fontWeight: 600,
    },
  };
});

export interface AutonomousHeaderProps {
  // Title of the application, defaults to the application name
  title?: string;
  // Link to the application home, defaults to the router base home path
  href?: string;
  // Icon representing the application
  icon?: SvgIconComponent;
  minWidth?: string;
  ref?: React.Ref<HTMLElement>;
}

const AutonomousHeader: React.FC<AutonomousHeaderProps> = (
  props: AutonomousHeaderProps,
): React.JSX.Element => {
  const {
    title = NeonEnvironment.getReactAppName(),
    href = NeonEnvironment.getRouterBaseHomePath() || '/',
    icon: ApplicationIcon = AppsIcon,
    minWidth,
    ref,
  }: AutonomousHeaderProps = props;
  const { classes, cx } = useStyles();
  const [navigationOpen, setNavigationOpen] = useState<boolean>(false);
  const handleCloseNavigation = (): void => setNavigationOpen(false);

  const renderTile = (className?: string): React.JSX.Element => (
    <span className={cx(classes.tile, className)} aria-hidden="true">
      <ApplicationIcon fontSize="inherit" />
    </span>
  );

  return (
    <>
      <AppBar
        ref={ref}
        position="relative"
        color="inherit"
        elevation={0}
        className={cx(classes.accented, classes.appBar)}
        style={minWidth ? { minWidth } : undefined}
        data-selenium="neon-header.autonomous"
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            className={classes.menuButton}
            aria-label="Open navigation"
            aria-controls={navigationOpen ? NAVIGATION_ID : undefined}
            aria-expanded={navigationOpen}
            onClick={() => setNavigationOpen(true)}
            data-selenium="neon-header.navigation-toggle"
          >
            <MenuIcon />
          </IconButton>
          <a href={href} className={classes.brand}>
            {renderTile()}
            <Typography component="span" className={classes.title}>
              {title}
            </Typography>
          </a>
        </Toolbar>
      </AppBar>
      <Drawer
        id={NAVIGATION_ID}
        anchor="left"
        open={navigationOpen}
        onClose={handleCloseNavigation}
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar disableGutters className={cx(classes.accented, classes.drawerHeader)}>
          <Typography id={NAVIGATION_TITLE_ID} component="h2" className={classes.drawerTitle}>
            Applications
          </Typography>
          <IconButton aria-label="Close navigation" onClick={handleCloseNavigation}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <List
          component="nav"
          aria-labelledby={NAVIGATION_TITLE_ID}
          className={classes.navList}
        >
          <ListItemButton
            component="a"
            href={href}
            selected
            aria-current="true"
            onClick={handleCloseNavigation}
            className={classes.navItem}
          >
            <ListItemIcon className={classes.navItemIcon}>
              {renderTile(classes.tileSmall)}
            </ListItemIcon>
            <ListItemText
              primary={title}
              slotProps={{ primary: { className: classes.navItemText } }}
            />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default AutonomousHeader;
