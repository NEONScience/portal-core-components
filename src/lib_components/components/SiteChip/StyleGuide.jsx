/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import SiteChip from './SiteChip';
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
        A standardized Material UI Chip for displaying a site or short-form
        information associated with one or more sites. Standardization includes
        using the secondary theme color and using the <tt>Place</tt> icon as
        an avatar.
      </DocBlock>
      <CodeBlock>
        {`
import { SiteChip } from 'portal-core-components';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        Pass a <tt>label</tt> prop to generate a basic standard SiteChip.
      </DocBlock>
      <ExampleBlock>
        <SiteChip label="MOAB" />
        <SiteChip label="Something besides a site code" />
      </ExampleBlock>
      <CodeBlock>
        {`
<SiteChip label="MOAB" />
<SiteChip label="Something besides a site code" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Supported Material UI Props</Typography>

      <DocBlock>
        SiteChip is a thin wrapper around <Link href="https://material-ui.com/api/chip/">Material UI Chip</Link>.
        All Material UI Chip props are supported by SiteChip. Some default values
        are applied to SiteChip that differ from Material UI Chip defaults:
        <ul>
          <li>
            <tt>label</tt> - <i>String, Required</i>
            <br />
            Text for the the chip to display
          </li>
          <li>
            <tt>color</tt> - <i>String, Optional</i>
            <br />
            SiteChip default: <tt>&quot;secondary&quot;</tt>
          </li>
          <li>
            <tt>variant</tt> - <i>String, Optional</i>
            <br />
            SiteChip default: <tt>&quot;outlined&quot;</tt>
          </li>
          <li>
            <tt>size</tt> - <i>Optional</i>
            <br />
            SiteChip default: <tt>&quot;small&quot;</tt>. Also note that in addition to Material
            UI Chip&apos;s <tt>&quot;small&quot;</tt> and <tt>&quot;small&quot;</tt> values,
            SiteChip also supports a size of <tt>&quot;large&quot;</tt>.
          </li>
        </ul>
      </DocBlock>
      <ExampleBlock>
        <SiteChip label="NIWO" color="primary" />
        <SiteChip label="BART" onClick={() => {}} onDelete={() => {}} />
        <SiteChip label="GRSM" variant="default" size="medium" />
        <SiteChip label="CLBJ" size="medium" color="default" />
        <SiteChip label="DEJU" size="large" variant="default" color="default" onDelete={() => {}} />
      </ExampleBlock>
      <CodeBlock>
        {`
<SiteChip label="NIWO" color="primary" />
<SiteChip label="BART" onClick={() => {}} onDelete={() => {}} />
<SiteChip label="GRSM" variant="default" size="medium" />
<SiteChip label="DEJU" size="medium" />
<SiteChip label="DEJU" size="large" variant="default" color="default" onDelete={() => {}} />
        `}
      </CodeBlock>
    </React.Fragment>
  );
}
