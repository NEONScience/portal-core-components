import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Menu, { SubMenu, MenuItem } from 'rc-menu';
import { Subject } from 'rxjs';
import get from 'lodash/get';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';

import NeonDrawerMenu from './NeonDrawerMenu';
import Authenticate from '../../auth/authenticate';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { COLORS } from '../Theme/Theme';
import { getJson } from '../../util/rxUtil';

import './NeonMenu.css';

import NeonLogo from './images/logo--blue-neon-data.png';

const defaultStaticMenuItems = [
  {
    name: 'About',
    url: '/about',
    isContainer: true,
    children: [
      {
        name: 'Usage and Citation Policies',
        url: '/data-policy',
        isContainer: false,
        children: [],
      },
      {
        name: 'Data Quality Program',
        url: '/data-quality',
        isContainer: false,
        children: [],
      },
      {
        name: 'Data Portal News',
        url: '/news',
        isContainer: false,
        children: [],
      },
    ],
  },
  {
    name: 'Download Data',
    url: '/download-data',
    isContainer: true,
    children: [
      {
        name: 'Data Products',
        url: '/browse-data',
        isContainer: false,
        children: [],
      },
      {
        name: 'API',
        url: '/data-api',
        isContainer: false,
        children: [],
      },
      {
        name: 'Prototype Data',
        url: '/prototype-search',
        isContainer: false,
        children: [],
      },
    ],
  },
  {
    name: 'Resources',
    url: '/resources',
    isContainer: true,
    children: [
      {
        name: 'Document Library',
        url: '/documents',
        isContainer: false,
        children: [],
      },
      {
        name: 'Data Product Catalog',
        url: '/data-product-catalog',
        isContainer: false,
        children: [],
      },
      {
        name: 'Data Availability Chart',
        url: '/view-data-availability',
        isContainer: false,
        children: [],
      },
      {
        name: 'Taxonomy Lists',
        url: '/apps/taxon',
        type: 'url',
        isContainer: false,
        children: [],
      },
      {
        name: 'Sample Viewer',
        url: '/apps/samples',
        type: 'url',
        isContainer: false,
        children: [],
      },
      {
        name: 'Frequently Asked Questions',
        url: '/faq',
        type: 'url',
        isContainer: false,
        children: [],
      },
      {
        name: 'Using NEON Data',
        url: '/using-neon-data',
        isContainer: true,
        children: [
          {
            name: 'File Naming Conventions',
            url: '/file-naming-conventions',
            type: 'portlet',
            isContainer: false,
            children: [],
          },
          {
            name: 'Data Tutorials, Workshops & More',
            url: 'https://neonscience.org/resources',
            isContainer: false,
            children: [],
          },
          {
            name: 'Software @ GitHub',
            url: 'https://github.com/NEONScience',
            isContainer: false,
            isExternalLink: true,
            navExternalLink: null,
            isExpanded: false,
            children: [],
          },
        ],
      },
      {
        name: 'Learn More',
        url: '/learn-more',
        isContainer: true,
        children: [
          {
            name: 'Field Sites',
            url: 'https://www.neonscience.org/field-sites',
            isContainer: false,
            children: [],
          },
          {
            name: 'Airborne Data',
            url: 'https://www.neonscience.org/data-resources/get-data/airborne-data',
            isContainer: false,
            children: [],
          },
          {
            name: 'Data Collection',
            url: 'https://www.neonscience.org/data-collection',
            isContainer: false,
            children: [],
          },
          {
            name: 'Sampling Schedules',
            url: 'https://www.neonscience.org/resources/information-researchers#schedules',
            isContainer: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Contact Us',
    url: '/feedback',
    isContainer: false,
    children: [],
  },
];

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

class NeonMenu extends Component {
  constructor(props) {
    super(props);
    this.auth = new Authenticate();
    this.menuFromResponse = this.menuFromResponse.bind(this);
    this.menuErrorCallback = this.menuErrorCallback.bind(this);
    this.authCallback = this.authCallback.bind(this);
    this.authErrorCallback = this.authErrorCallback.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);

    // RxJS cancellation subject
    this.cancellationSubject$ = new Subject();

    this.state = {
      fetched: false,
      menuItems: [],
      isFetchingAuthentication: true,
      isAuthenticated: false,
      drawerIsOpen: false,
    };
  }

  componentDidMount() {
    getJson(
      NeonEnvironment.getFullApiPath('menu'),
      this.menuFromResponse,
      this.menuErrorCallback,
      this.cancellationSubject$,
    );
    this.auth.isAuthenticated(
      this.authCallback,
      this.authErrorCallback,
    );
  }

  componentWillUnmount() {
    this.cancellationSubject$.next(true);
    this.cancellationSubject$.unsubscribe();
    this.auth.cancellationEmitter();
  }

  authCallback(response) {
    if (this.auth.checkAuthResponse(response)) {
      this.setState({
        isFetchingAuthentication: false,
        isAuthenticated: true,
      });
    } else {
      this.setState({
        isFetchingAuthentication: false,
        isAuthenticated: false,
      });
    }
  }

  authErrorCallback(error) {
    console.error(error); // eslint-disable-line no-console
    this.setState({
      isFetchingAuthentication: false,
      isAuthenticated: false,
    });
  }

  menuFromResponse(response) {
    this.setState({
      fetched: true,
      menuItems: get(response || {}, 'data.menuItems', defaultStaticMenuItems),
    });
  }

  menuErrorCallback() {
    this.setState({
      fetched: true,
      menuItems: defaultStaticMenuItems,
    });
  }

  handleDrawerOpen() {
    this.setState({
      drawerIsOpen: true,
    });
  }

  handleDrawerClose() {
    this.setState({
      drawerIsOpen: false,
    });
  }

  render() {
    const {
      loginPath,
      logoutPath,
      accountPath,
      notifications,
      onShowNotifications,
    } = this.props;

    const {
      isFetchingAuthentication,
      isAuthenticated,
      fetched,
      menuItems,
      drawerIsOpen,
    } = this.state;

    const notificationsDisabled = notifications.some(n => !n.dismissed);
    const notificationsColor = notificationsDisabled ? COLORS.GREY[200] : COLORS.YELLOW[700];
    const notificationsContent = notifications.length ? (
      <IconButton
        key="show-notifications"
        aria-label="show-notifications"
        onClick={onShowNotifications}
        style={{ marginRight: '12px' }}
        disabled={notificationsDisabled}
      >
        <NotificationsIcon style={{ color: notificationsColor, fontSize: '1.65rem !important' }} />
      </IconButton>
    ) : null;

    let authContent = (
      <Button href={loginPath} size="small" variant="outlined" data-selenium="neon-menu.sign-in-button">
        Sign In
      </Button>
    );
    if (isFetchingAuthentication) {
      authContent = (
        <CircularProgress size={24} />
      );
    }
    if (isAuthenticated) {
      authContent = (
        <ButtonGroup size="small" aria-label="Authentication">
          <Button href={logoutPath} style={{ whiteSpace: 'nowrap' }} data-selenium="neon-menu.sign-out-button">
            Sign Out
          </Button>
          <Button href={accountPath} style={{ whiteSpace: 'nowrap' }} data-selenium="neon-menu.my-account-button">
            My Account
          </Button>
        </ButtonGroup>
      );
    }
    const authContainer = (
      <div className="neon-menu__auth">
        {notificationsContent}
        {authContent}
      </div>
    );

    let menu = (
      <Menu id="main-menu" mode="horizontal">
        <MenuItem>
          <CircularProgress size={24} />
        </MenuItem>
      </Menu>
    );
    if (fetched) {
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
                  onClick={this.handleDrawerOpen}
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
          <Drawer open={drawerIsOpen} onClose={this.handleDrawerClose}>
            <div className="neon-menu__drawer-header-container">
              {neonLogo}
              <IconButton
                data-selenium="neon-menu.drawer-iconbutton.close"
                color="primary"
                aria-label="Close Menu"
                onClick={this.handleDrawerClose}
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
  }
}

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
