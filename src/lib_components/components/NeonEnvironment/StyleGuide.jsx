/* eslint react/jsx-one-expression-per-line: 0 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';

import Theme from '../Theme/Theme';
import NeonEnvironment, {
  requiredEnvironmentVars,
  optionalEnvironmentVars,
} from './NeonEnvironment';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);

  const attributes = Object.keys(NeonEnvironment)
    .map((key) => {
      const type = typeof NeonEnvironment[key];
      return `${type} ${key}${type === 'function' ? '()' : ''}`;
    });

  return (
    <React.Fragment>

      <DocBlock>
        A module for standardized access to paths and other environment variables
        for any NEON web application.
      </DocBlock>
      <CodeBlock>
        {`
import NeonEnvironment from 'portal-core-components/lib/components/NeonEnvironment';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        Whenever a module needs to construct paths (e.g. for routing to a page or
        building an API request) it should use the standard methods afforded by
        the <tt>NeonEnvironment</tt> module to do so.
      </DocBlock>
      <CodeBlock>
        {`
${attributes.join('\n')}

`}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Environment Variables</Typography>

      <DocBlock>
        The following environment variables are <b>required</b> in order for
        the <tt>NeonEnvironment</tt> module to report itself as <i>valid</i>.
        How an invalid environment is handled may vary from app to app, if there
        is any special handling at all.
      </DocBlock>
      <CodeBlock>
        {`
${requiredEnvironmentVars.join('\n')}

`}
      </CodeBlock>

      <DocBlock>
        There are also <b>optional</b> environment variables that may be required by a
        particular app but may not be required by all apps. The reported validity
        of the <tt>NeonEnvironment</tt> module is not affected by whether these are
        defined or not.
      </DocBlock>
      <CodeBlock>
        {`
${optionalEnvironmentVars.join('\n')}

`}
      </CodeBlock>
      <DocBlock>
        Taking all required and optional environment variables above together yields
        a list of all environment variables the <tt>NeonEnvironment</tt> module will
        ever reference.
      </DocBlock>
      <DocBlock>
        Environment variables should be defined in the <tt>.env.development</tt> and
        <tt>.env.production</tt> files in the root directory of a given application.
      </DocBlock>

    </React.Fragment>
  );
}
