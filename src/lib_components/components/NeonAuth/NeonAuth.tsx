/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, Dispatch } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import { Theme as MuiThemeType } from '@mui/material';

import Logout from '@mui/icons-material/Logout';

import AuthService, { LOGOUT_REDIRECT_PATHS } from './AuthService';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';
import NeonSignInButtonState from '../NeonSignInButton/NeonSignInButtonState';

import { StringPropsObject } from '../../types/objectTypes';
import { StylesHook } from '../../types/muiTypes';
import { Undef } from '../../types/core';
import { exists, isStringNonEmpty } from '../../util/typeUtil';

export enum NeonAuthType {
  REDIRECT = 'REDIRECT',
  SILENT = 'SILENT',
}
export enum NeonAuthDisplayType {
  MENU = 'MENU',
  MENU_CUSTOM = 'MENU_CUSTOM',
}

export interface NeonAuthProps {
  loginType: NeonAuthType;
  logoutType: NeonAuthType;
  displayType: NeonAuthDisplayType;
  loginPath: string;
  logoutPath: string;
  accountPath: string;
}

const useStyles: StylesHook = makeStyles((theme: MuiThemeType) => ({
  button: {
    whiteSpace: 'nowrap',
    // The following styles are !important overrides to styles applied by the drupal header.css
    // when NeonAuth is injected into the drupal header.
    color: `${theme.palette.primary.main} !important`,
    textTransform: 'uppercase !important' as 'uppercase',
    fontSize: '0.55rem !important',
    fontWeight: '600 !important' as any,
    fontFamily: '"Inter",Helvetica,Arial,sans-serif !important',
    lineHeight: '1.75 !important',
  },
  loadingContainer: {
    display: 'flex',
    width: '64px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(0.5),
  },
  loadingContainerSpan: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[400],
  },
  accountMenuContainer: {
    '& :focus': {
      outline: 'none !important',
    },
  },
})) as StylesHook;

const UX_TIMEOUT_MS: number = 300;

export interface AccountMenuProps {
  accountPath: string;
  handleLogout: () => void;
}

const AccountMenu = (props: AccountMenuProps) => {
  const { accountPath, handleLogout } = props;
  const classes: StringPropsObject = useStyles(Theme);
  const [
    {
      auth: {
        userData,
      },
    },
  ] = NeonContext.useNeonContextState();
  const user = userData?.data?.user;
  const containerRef = React.useRef<null | HTMLDivElement>(null);
  const belowLg = useMediaQuery(Theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleMyAccountNav = (): void => {
    window.location.href = accountPath;
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };
  // eslint-disable-next-line no-undef-init
  let avatarAlt = undefined;
  if (exists(user)) {
    if (isStringNonEmpty(user.name)) {
      avatarAlt = user.name;
    } else if (isStringNonEmpty(user.email)) {
      avatarAlt = user.email;
    }
  }
  const avatarContainerSx = {
    display: 'block',
    width: '64px',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '-4px',
  };
  if (belowLg) {
    avatarContainerSx.marginTop = '-3px';
    avatarContainerSx.textAlign = 'right';
  }
  return (
    <>
      <Box sx={avatarContainerSx}>
        <Tooltip title="My Account">
          <IconButton
            onClick={handleClick}
            size="small"
            autoFocus={false}
            sx={{ padding: 0 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              alt={avatarAlt}
              src={user?.picture}
              sx={{ width: 32, height: 32 }}
            >
              {avatarAlt?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <div ref={containerRef} className={classes.accountMenuContainer}>
        <Menu
          container={containerRef.current}
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          variant="menu"
          autoFocus={false}
          disableAutoFocusItem
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleMyAccountNav}>
            <Avatar style={{ width: '24px', height: '24px' }} sx={{ width: 24, height: 24 }} />
            {' My Account'}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleLogout()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

const triggerAuth = (
  path: string,
  login: boolean,
  dispatch: Dispatch<any>,
  redirectUriPath?: string,
): void => {
  if (!path) return;
  // Give the browser time to render to allow for immediate feedback
  // by way of a spinner.
  dispatch({ type: 'setAuthWorking', isAuthWorking: true });
  setTimeout(
    () => {
      if (login) {
        AuthService.login(path, redirectUriPath);
      } else {
        AuthService.logout(path, redirectUriPath);
      }
    },
    UX_TIMEOUT_MS,
  );
};

const renderAuth = (
  props: NeonAuthProps,
  classes: StringPropsObject,
  isAuthenticated: boolean,
  showAuthWorking: boolean,
  isAuthWsConnected: boolean,
  dispatch: Dispatch<any>,
): React.JSX.Element => {
  const {
    loginType,
    logoutType,
    displayType,
    loginPath,
    logoutPath,
    accountPath,
  }: NeonAuthProps = props;

  const handleLogin = (): void => {
    if (NeonEnvironment.enableGlobalSignInState) {
      // Notify observers the sign in button has been clicked.
      NeonSignInButtonState.sendNotification();
    }
    let appliedLoginType: NeonAuthType = loginType;
    // Default to redirect if WS isn't connected
    if (!isAuthWsConnected) {
      appliedLoginType = NeonAuthType.REDIRECT;
    }
    const redirectUriPath: Undef<string> = AuthService.getLoginRedirectUri();
    switch (appliedLoginType) {
      case NeonAuthType.SILENT:
        AuthService.loginSilently(dispatch, false, loginPath, redirectUriPath);
        break;
      case NeonAuthType.REDIRECT:
      default:
        triggerAuth(loginPath, true, dispatch, redirectUriPath);
        break;
    }
  };
  const handleLogout = (): void => {
    let appliedLogoutType: NeonAuthType = logoutType;
    let redirectUriPath: Undef<string>;
    // Default to redirect if WS isn't connected
    if (!isAuthWsConnected) {
      appliedLogoutType = NeonAuthType.REDIRECT;
    }
    const appHomePath: string = NeonEnvironment.getRouterBaseHomePath();
    if (LOGOUT_REDIRECT_PATHS.indexOf(appHomePath) >= 0) {
      appliedLogoutType = NeonAuthType.REDIRECT;
      redirectUriPath = NeonEnvironment.route.home();
    } else {
      // If not a auto redirect path, redirect back to the current path
      const currentPath: string = window.location.pathname;
      const hasPath: boolean = isStringNonEmpty(currentPath) && currentPath.includes(appHomePath);
      redirectUriPath = hasPath ? currentPath : appHomePath;
    }
    switch (appliedLogoutType) {
      case NeonAuthType.SILENT:
        AuthService.logoutSilently(dispatch, logoutPath, redirectUriPath);
        break;
      case NeonAuthType.REDIRECT:
      default:
        triggerAuth(logoutPath, false, dispatch, redirectUriPath);
        break;
    }
  };
  // eslint-disable-next-line react/jsx-no-useless-fragment
  let authContent: React.JSX.Element = <></>;
  const isCustom = NeonAuthDisplayType.MENU_CUSTOM;
  switch (displayType) {
    case NeonAuthDisplayType.MENU_CUSTOM:
    case NeonAuthDisplayType.MENU:
    default:
      authContent = <AccountMenu accountPath={accountPath} handleLogout={handleLogout} />;
      if (showAuthWorking) {
        authContent = (
          <div className={classes.loadingContainer}>
            {isCustom ? null : (
              <span className={classes.loadingContainerSpan}>
                {isAuthenticated ? 'Signing out...' : 'Signing in...'}
              </span>
            )}
            <CircularProgress size={20} />
          </div>
        );
      } else if (isAuthenticated) {
        authContent = isCustom
          ? (<AccountMenu accountPath={accountPath} handleLogout={handleLogout} />)
          : (
            <ButtonGroup size="small" aria-label="Authentication">
              <Button
                className={classes.button}
                data-selenium="neon-menu.sign-out-button"
                onClick={() => handleLogout()}
              >
                Sign Out
              </Button>
              <Button
                href={accountPath}
                className={classes.button}
                data-selenium="neon-menu.my-account-button"
              >
                My Account
              </Button>
            </ButtonGroup>
          );
      }
      break;
  }
  return authContent;
};

const NeonAuth = (props: NeonAuthProps): React.JSX.Element => {
  const [
    {
      auth: {
        isAuthenticated,
        isAuthWorking,
        isAuthWsConnected,
      },
      fetches: {
        auth: {
          status,
        },
      },
    },
    dispatch,
  ] = NeonContext.useNeonContextState();

  const classes: StringPropsObject = useStyles(Theme);

  const isFetchingAuthentication: boolean = (status === FETCH_STATUS.FETCHING);
  const isAuthFetched: boolean = ([FETCH_STATUS.SUCCESS, FETCH_STATUS.ERROR].indexOf(status) >= 0);
  const showAuthWorking: boolean = (isAuthWorking || isFetchingAuthentication);

  const authFetchCb = useCallback(() => {
    AuthService.fetchUserInfoWithDispatch(dispatch);
  }, [dispatch]);
  if (!isFetchingAuthentication && !isAuthFetched) {
    authFetchCb();
  }
  return (
    <>
      {renderAuth(props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch)}
    </>
  );
};

const WrappedNeonAuth = (Theme as any).getWrappedComponent(
  NeonContext.getWrappedComponent(NeonAuth),
);

export default WrappedNeonAuth;
