import React, { useCallback, Dispatch } from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';

import AuthService from '../NeonAuth/AuthService'; /* eslint-disable-line */
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

export enum NeonAuthType {
  INTERRUPT = 'INTERRUPT',
  SEAMLESS = 'SEAMLESS',
  SILENT = 'SILENT',
}
export enum NeonAuthDisplayType {
  MENU = 'MENU',
}

export interface NeonAuthProps {
  title: string;
  loginType: NeonAuthType;
  logoutType: NeonAuthType;
  displayType: NeonAuthDisplayType;
  loginPath: string;
  logoutPath: string;
  accountPath: string;
}

const UX_TIMEOUT_MS: number = 300;

const triggerAuth = (path: string, login: boolean): void => {
  if (!path) return;
  // Give the browser time to render to allow for immediate feedback
  // by way of a spinner.
  setTimeout(
    () => {
      if (login) {
        AuthService.login(path);
      } else {
        AuthService.logout(path);
      }
    },
    UX_TIMEOUT_MS,
  );
};

const renderAuth = (
  props: NeonAuthProps,
  isAuthenticated: boolean,
  showAuthWorking: boolean,
  isAuthWsConnected: boolean,
  dispatch: Dispatch<any>,
): JSX.Element => {
  const {
    loginType,
    logoutType,
    displayType,
    loginPath,
    logoutPath,
    accountPath,
  }: {
    loginType: NeonAuthType,
    logoutType: NeonAuthType,
    displayType: NeonAuthDisplayType,
    loginPath: string,
    logoutPath: string,
    accountPath: string,
  } = props;

  const handleLogin = (): void => {
    let appliedLoginType: NeonAuthType = loginType;
    // Default to interrupt if WS isn't connected
    if (!isAuthWsConnected) {
      appliedLoginType = NeonAuthType.INTERRUPT;
    }
    switch (appliedLoginType) {
      case NeonAuthType.SEAMLESS:
        break;
      case NeonAuthType.SILENT:
        setTimeout(
          () => AuthService.loginSilently(dispatch),
          UX_TIMEOUT_MS,
        );
        break;
      case NeonAuthType.INTERRUPT:
      default:
        triggerAuth(loginPath, true);
        break;
    }
  };
  const handleLogout = (): void => {
    let appliedLogoutType: NeonAuthType = logoutType;
    // Default to interrupt if WS isn't connected
    if (!isAuthWsConnected) {
      appliedLogoutType = NeonAuthType.INTERRUPT;
    }
    switch (appliedLogoutType) {
      case NeonAuthType.SEAMLESS:
      case NeonAuthType.SILENT:
        setTimeout(
          () => AuthService.logoutSilently(dispatch),
          UX_TIMEOUT_MS,
        );
        break;
      case NeonAuthType.INTERRUPT:
      default:
        triggerAuth(logoutPath, false);
        break;
    }
  };
  let authContent: JSX.Element = <React.Fragment />;
  switch (displayType) {
    case NeonAuthDisplayType.MENU:
    default:
      authContent = (
        <Button
          size="small"
          variant="outlined"
          data-selenium="neon-menu.sign-in-button"
          onClick={() => handleLogin()}
        >
          Sign In
        </Button>
      );
      if (showAuthWorking) {
        authContent = (
          <CircularProgress size={24} />
        );
      } else if (isAuthenticated) {
        authContent = (
          <ButtonGroup size="small" aria-label="Authentication">
            <Button
              style={{ whiteSpace: 'nowrap' }}
              data-selenium="neon-menu.sign-out-button"
              onClick={() => handleLogout()}
            >
              Sign Out
            </Button>
            <Button
              href={accountPath}
              style={{ whiteSpace: 'nowrap' }}
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

const NeonAuth = (props: NeonAuthProps): JSX.Element => {
  const [
    {
      isAuthenticated,
      isAuthWorking,
      isAuthWsConnected,
      fetches: {
        auth: {
          status,
        },
      },
    },
    dispatch,
  ] = NeonContext.useNeonContextState();

  const isFetchingAuthentication = (status === FETCH_STATUS.FETCHING);
  const isAuthFetched = ([FETCH_STATUS.SUCCESS, FETCH_STATUS.ERROR].indexOf(status) >= 0);
  const showAuthWorking = (isAuthWorking || isFetchingAuthentication);

  const authFetchCb = useCallback(() => {
    AuthService.fetchUserInfoWithDispatch(dispatch);
  }, [dispatch]);
  if (!isFetchingAuthentication && !isAuthFetched) {
    authFetchCb();
  }
  return (
    <React.Fragment>
      {renderAuth(props, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch)}
    </React.Fragment>
  );
};

const WrappedNeonAuth = (Theme as any).getWrappedComponent(
  NeonContext.getWrappedComponent(NeonAuth),
);

export default WrappedNeonAuth;
