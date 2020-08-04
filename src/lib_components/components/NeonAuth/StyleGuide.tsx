/* eslint react/jsx-one-expression-per-line: 0 */

import React, { Dispatch } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import AuthService from './AuthService'; /* eslint-disable-line */

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import Theme from '../Theme/Theme';
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from './NeonAuth'; /* eslint-disable-line */
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

const NEON_SSO_COOKIE_NAME: string = 'X-NEON-SSO';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

/* eslint-disable-next-line */
const handleSilentLogin = (dispatch: Dispatch<any>): void => {
  // For demonstration purposes only, trigger a simulated SSO client
  // indicating it's authenticated.
  window.document.cookie = `${NEON_SSO_COOKIE_NAME}=true
    ;Domain=${window.location.host}
    ;Secure=true;`;
  AuthService.loginSilently(dispatch);
  window.document.cookie = `${NEON_SSO_COOKIE_NAME}=
    ;Domain=${window.location.host}
    ;Secure=true
    ;Expires=-1;`;
};

export default function StyleGuide() {
  const classes = useStyles(Theme);
  return (
    <React.Fragment>

      <DocBlock>
        A module for standardized access to authentication functionality and UI elements.
      </DocBlock>
      <CodeBlock>
        {`
import NeonAuth from 'portal-core-components/lib/components/NeonAuth';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Normal Authentication</Typography>
      <ExampleBlock>
        <NeonAuth
          loginPath={NeonEnvironment.getFullAuthPath('login')}
          logoutPath={NeonEnvironment.getFullAuthPath('logout')}
          accountPath={NeonEnvironment.route.buildAccountRoute()}
          loginType={NeonAuthType.INTERRUPT}
          logoutType={NeonAuthType.INTERRUPT}
          displayType={NeonAuthDisplayType.MENU}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from 'portal-core-components/lib/components/NeonAuth';
import NeonEnvironment from 'portal-core-components/lib/components/NeonEnvironment';

<NeonAuth
  loginPath={NeonEnvironment.getFullAuthPath('login')}
  logoutPath={NeonEnvironment.getFullAuthPath('logout')}
  accountPath={NeonEnvironment.route.buildAccountRoute()}
  loginType={NeonAuthType.INTERRUPT}
  logoutType={NeonAuthType.INTERRUPT}
  displayType={NeonAuthDisplayType.MENU}
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Silent Authentication</Typography>
      <ExampleBlock>
        <NeonAuth
          loginPath={NeonEnvironment.getFullAuthPath('login')}
          logoutPath={NeonEnvironment.getFullAuthPath('logout')}
          accountPath={NeonEnvironment.route.buildAccountRoute()}
          loginType={NeonAuthType.SILENT}
          logoutType={NeonAuthType.SILENT}
          displayType={NeonAuthDisplayType.MENU}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from 'portal-core-components/lib/components/NeonAuth';
import NeonEnvironment from 'portal-core-components/lib/components/NeonEnvironment';

<NeonAuth
  loginPath={NeonEnvironment.getFullAuthPath('login')}
  logoutPath={NeonEnvironment.getFullAuthPath('logout')}
  accountPath={NeonEnvironment.route.buildAccountRoute()}
  loginType={NeonAuthType.SILENT}
  logoutType={NeonAuthType.SILENT}
  displayType={NeonAuthDisplayType.MENU}
/>
        `}
      </CodeBlock>

    </React.Fragment>
  );
}
