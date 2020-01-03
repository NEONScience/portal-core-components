/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import SiteMap from './SiteMap';
import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <React.Fragment>

      <DocBlock>
        A general purpose component for displaying an interactive world map with
        markers for NEON field sites.
      </DocBlock>
      <CodeBlock>
        {`
import { SiteMap } from 'portal-core-components';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        A Site Map can be rendered with no props at all for ease of use. When no props
        are present, a Site Map will assume the following:
      </DocBlock>
      <ul>
        <li>Load site data from the API</li>
        <li>Use a 4:3 (letterbox) aspect ratio at 100% of the width of the containing element</li>
        <li>Start at a zoom level of 3 centered on North America</li>
        <li>Include a button to Explore Data Products in site popups</li>
        <li>Have all site popup links open in a new window</li>
      </ul>

      <ExampleBlock>
        <SiteMap />
      </ExampleBlock>
      <CodeBlock>
        {`
<SiteMap />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Props</Typography>

      <DocBlock>
        (props table)
      </DocBlock>

      <ExampleBlock>
        <SiteMap aspectRatio={0.5625} zoom={6} center={[33.5, -110.5]} />
      </ExampleBlock>
      <CodeBlock>
        {`
<SiteMap aspectRatio={0.5625} zoom={6} center={[33.5, -110.5]} />
        `}
      </CodeBlock>

    </React.Fragment>
  );
}
