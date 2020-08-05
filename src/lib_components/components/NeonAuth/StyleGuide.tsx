/* eslint-disable react/jsx-one-expression-per-line */
// @ts-nocheck

import React from 'react';

import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from './NeonAuth';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';

const NEON_SSO_COOKIE_NAME: string = 'X-NEON-SSO';
const ALLOW_SSO_TOGGLE: boolean = false;

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

/**
 * For demonstration purposes only, trigger a simulated SSO client
 *  indicating it's authenticated.
 */
const prepareSsoLoginDemo = (): void => {
  window.document.cookie = `${NEON_SSO_COOKIE_NAME}=true; max-age=60`;
};
const clearSsoLoginDemo = (): void => {
  window.document.cookie = `${NEON_SSO_COOKIE_NAME}=; max-age=-1`;
};

const propRows = [
  {
    name: 'loginType',
    type: 'NeonAuthType',
    default: 'required - NeonAuthType.REDIRECT',
    examples: (
      <div>
        <tt>NeonAuthType.REDIRECT</tt>
        <br />
        <tt>NeonAuthType.SILENT</tt>
      </div>
    ),
    description: (
      <React.Fragment>
        <p>
          Controls the login flow type.
        </p>
      </React.Fragment>
    ),
  },
  {
    name: 'logoutType',
    type: 'NeonAuthType',
    default: 'required - NeonAuthType.SILENT',
    examples: (
      <div>
        <tt>NeonAuthType.REDIRECT</tt>
        <br />
        <tt>NeonAuthType.SILENT</tt>
      </div>
    ),
    description: (
      <React.Fragment>
        <p>
          Controls the logout flow type.
        </p>
      </React.Fragment>
    ),
  },
  {
    name: 'displayType',
    type: 'NeonAuthDisplayType',
    default: 'required - NeonAuthDisplayType.MENU',
    examples: (
      <div>
        <tt>NeonAuthDisplayType.MENU</tt>
      </div>
    ),
    description: (
      <React.Fragment>
        <p>
          Controls the display of the authentication component.
        </p>
      </React.Fragment>
    ),
  },
];

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const hasSsoCookie: boolean = (document.cookie.indexOf(NEON_SSO_COOKIE_NAME) >= 0);
  const [ssoCookieEnabled, setSsoCookieEnabled] = React.useState(hasSsoCookie);
  const handleSsoCookieToggle = (enable: boolean): void => {
    if (enable) {
      prepareSsoLoginDemo();
    } else {
      clearSsoLoginDemo();
    }
    setSsoCookieEnabled(enable);
  };
  let ssoToggleContent: JSX.Element = (<React.Fragment />);
  if (ALLOW_SSO_TOGGLE) {
    ssoToggleContent = (
      <ExampleBlock>
        <FormGroup row>
          <FormControlLabel
            label="SSO Demo Enabled State"
            control={(
              <Switch
                checked={ssoCookieEnabled}
                onChange={() => handleSsoCookieToggle(!ssoCookieEnabled)}
                color="primary"
              />
            )}
          />
        </FormGroup>
      </ExampleBlock>
    );
  }
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
      <Typography variant="h6" component="h4" gutterBottom>Standard Authentication</Typography>
      <DocBlock>
        The standard authentication flow will initiate redirects to the appropriate
        authentication API endpoints, specifying a return URI for the process
        to return to upon successful completion. This will break the flow of the
        application and hand off control of the process to the authentication
        APIs entirely. The <tt>loginType</tt> and <tt>logoutType</tt> properties
        of the <tt>NeonAuth</tt> component allow setting the type of authentication
        flow for each action respectively.
      </DocBlock>
      <ExampleBlock>
        <NeonAuth
          loginPath={NeonEnvironment.getFullAuthPath('login')}
          logoutPath={NeonEnvironment.getFullAuthPath('logout')}
          accountPath={NeonEnvironment.route.buildAccountRoute()}
          loginType={NeonAuthType.REDIRECT}
          logoutType={NeonAuthType.REDIRECT}
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
  loginType={NeonAuthType.REDIRECT}
  logoutType={NeonAuthType.REDIRECT}
  displayType={NeonAuthDisplayType.MENU}
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Silent SSO Authentication</Typography>
      <DocBlock>
        Note that the following example for silent authentication is for demonstration
        purposes only with respect to the login flow - it will only complete
        successfully in the event that an actual SSO application is also logged in.
      </DocBlock>
      {ssoToggleContent}
      <DocBlock>
        The silent authentication flow will initiate the process inline and
        check for an active SSO application silently. The logout flow will also
        occur inline without yielding flow of the application to the authentication
        APIs.
      </DocBlock>
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

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} />
      </DocBlock>

    </React.Fragment>
  );
}