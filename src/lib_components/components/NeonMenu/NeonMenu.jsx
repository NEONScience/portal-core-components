import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Menu, { SubMenu, MenuItem } from 'rc-menu';
import { Subject } from 'rxjs';
import get from 'lodash/get';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';

import NeonApi from '../NeonApi/NeonApi';
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from '../NeonAuth/NeonAuth'; /* eslint-disable-line */
import NeonDrawerMenu from './NeonDrawerMenu';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { COLORS } from '../Theme/Theme';

import './NeonMenu.css';

import NeonLogo from '../../images/NSF-NEON-logo.png';

import defaultStaticMenuItems from './menuDefaultFallback.json';

const domParser = new DOMParser();
const decodeName = name => domParser.parseFromString(name, 'text/html').documentElement.textContent;

/**
 * Generates the specified menu item for rc-menu (NOT material-ui)
 * @param {item} object The menu item definition to build from
 * @param {index} int The index of the menu item in the collection
 * @param {depth} int The relative depth of the menu item (0 is top-level)
 * @return The generate menu item JSX.Element
 */
const generateRCMenuItem = (item, index, depth = 0) => {
  if (item.url === '/home') {
    return null;
  }

  let childElements = [];
  if (item.children.length > 0) {
    childElements = item
      .children
      .map((childItem, childIndex) => generateRCMenuItem(
        childItem,
        `${index.toString()}-${childIndex.toString()}`,
        depth + 1,
      ));
  }

  const key = `${index.toString()}-1`;
  const seleniumKey = item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const linkElement = (
    <a href={item.url} data-selenium={`neon-menu.link.${seleniumKey}`}>
      {decodeName(item.name)}
    </a>
  );
  let element = null;

  if (childElements.length > 0) {
    // isContainer is a Liferay boolean that means "has children but is not a link"
    // Liferay also mandates all menu items have a non-empty url EVEN IF they are not links
    // So this bit here updates the href we're actually going to use accordingly.
    let titleElement = decodeName(item.name);
    if (!item.isContainer) {
      titleElement = linkElement;
    }

    // NOTE: We want to put data-selenium={`neon-menu.submenu.${seleniumKey}`} as a
    // prop on this element but unfortunately rc-menu doesn't preserve unsupported
    // props as attributes on the final DOM nodes.
    element = (
      <SubMenu
        key={key}
        title={titleElement}
        className={depth ? null : 'neon-menu__item--relative'}
      >
        {childElements}
      </SubMenu>
    );
  } else {
    element = (
      <MenuItem
        key={index}
        className={depth ? null : 'neon-menu__item--relative neon-menu__nochild'}
      >
        {linkElement}
      </MenuItem>
    );
  }

  return element;
};

const neonLogo = (
  <img
    data-selenium="neon-menu.logo"
    title="NEON Data Portal"
    alt="NEON Data Portal"
    className="neon-menu__logo"
    src={NeonLogo}
  />
);

const cancellationSubject$ = new Subject();

const NeonMenu = (props) => {
  const {
    loginPath,
    logoutPath,
    accountPath,
    notifications,
    onShowNotifications,
  } = props;

  const [menuFetched, setMenuFetched] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  useEffect(() => {
    NeonApi.getJson(
      NeonEnvironment.getFullApiPath('menu'),
      (response) => {
        setMenuItems(get(response || {}, 'data.menuItems', defaultStaticMenuItems));
        setMenuFetched(true);
      },
      () => {
        setMenuItems(defaultStaticMenuItems);
        setMenuFetched(true);
      },
      cancellationSubject$,
    );
    return () => {
      cancellationSubject$.next(true);
      cancellationSubject$.unsubscribe();
    };
  }, [loginPath]);

  const notificationsDisabled = notifications.some(n => !n.dismissed);
  const notificationsColor = notificationsDisabled ? COLORS.GREY[200] : COLORS.GOLD[500];
  const notificationsContent = notifications.length ? (
    <IconButton
      key="show-notifications"
      aria-label="show-notifications"
      title="Show Notifications"
      onClick={onShowNotifications}
      style={{ marginRight: '12px' }}
      disabled={notificationsDisabled}
    >
      <NotificationsIcon style={{ color: notificationsColor, fontSize: '1.65rem !important' }} />
    </IconButton>
  ) : null;
  const authContainer = (
    <div className="neon-menu__auth">
      {notificationsContent}
      <NeonAuth
        loginPath={loginPath}
        logoutPath={logoutPath}
        accountPath={accountPath}
        loginType={NeonAuthType.INTERRUPT}
        logoutType={NeonAuthType.SILENT}
        displayType={NeonAuthDisplayType.MENU}
      />
    </div>
  );

  let menu = (
    <Menu id="main-menu" mode="horizontal">
      <MenuItem>
        <CircularProgress size={24} />
      </MenuItem>
    </Menu>
  );
  if (menuFetched) {
    menu = (
      <Menu id="main-menu" mode="horizontal">
        <MenuItem
          key="home"
          className="rc-menu-item"
          role="menuitem"
        >
          <a href="/" title="NEON Data Portal | Home">
            <HomeIcon />
          </a>
        </MenuItem>
        {(menuItems.length ? menuItems : defaultStaticMenuItems).map(generateRCMenuItem)}
      </Menu>
    );
  }

  return (
    <React.Fragment>
      <div className="neon-menu__container" data-selenium="neon-menu">
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          spacing={0}
        >
          <Hidden mdUp>
            <Grid item xs={7} style={{ whiteSpace: 'nowrap' }}>
              <IconButton
                data-selenium="neon-menu.drawer-iconbutton.open"
                edge="start"
                aria-label="Menu"
                onClick={() => setDrawerIsOpen(true)}
                style={{ margin: '4px 0px 4px 12px' }}
              >
                <MenuIcon />
              </IconButton>
              {neonLogo}
            </Grid>
            <Grid item xs={5}>
              {authContainer}
            </Grid>
          </Hidden>
          <Hidden smDown>
            <Grid item md={9}>
              <div className="neon-menu__header-container">
                {neonLogo}
                {menu}
              </div>
            </Grid>
            <Grid item md={3}>
              {authContainer}
            </Grid>
          </Hidden>
        </Grid>
      </div>
      <Hidden mdUp>
        <Drawer open={drawerIsOpen} onClose={() => setDrawerIsOpen(false)}>
          <div className="neon-menu__drawer-header-container">
            {neonLogo}
            <IconButton
              data-selenium="neon-menu.drawer-iconbutton.close"
              color="primary"
              aria-label="Close Menu"
              onClick={() => setDrawerIsOpen(false)}
              style={{ margin: '8px 0px' }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <NeonDrawerMenu items={menuItems} />
        </Drawer>
      </Hidden>
    </React.Fragment>
  );
};

NeonMenu.propTypes = {
  loginPath: PropTypes.string,
  logoutPath: PropTypes.string,
  accountPath: PropTypes.string,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      dismissed: PropTypes.bool.isRequired,
    }),
  ),
  onShowNotifications: PropTypes.func,
};

NeonMenu.defaultProps = {
  loginPath: '',
  logoutPath: '',
  accountPath: '',
  notifications: [],
  onShowNotifications: null,
};

export default NeonMenu;
