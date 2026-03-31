/* eslint react/jsx-one-expression-per-line: 0 */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import AopGEEDataViewer from './AopGEEDataViewer';
import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  title: {
    fontWeight: 500,
    marginBottom: '8px',
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <>
      <DocBlock>
        Button to launch an interactive visualization of AOP data using Google Earth Engine
        in a new window or tab.
      </DocBlock>
      <CodeBlock>
        {`
import AopGEEDataViewer from 'portal-core-components/lib/components/AopGEEDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        The AOP GEE Data Viewer button checks for mobile or desktop device and openes
        the corresponding GEE Viewer in a new window or tab.
      </DocBlock>
      <ExampleBlock>
        <AopGEEDataViewer />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopGEEDataViewer />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Demo</Typography>
      <ExampleBlock>
        <AopGEEDataViewer />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Failure State</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        No parameters can be passed to the Google earth Engine at this time so failures only happen
        when the Google earth Engine has issues or the link has been changed.
      </DocBlock>
    </>
  );
}
