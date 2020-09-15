/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import SelectSitesButton from './SelectSitesButton';

import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const siteMapLink = (
    <Link
      href="#SiteMap"
    >
      Site Map
    </Link>
  );

  return (
    <React.Fragment>

      <DocBlock>
        A button to launch the {siteMapLink} in a full screen selection-mode dialog.
      </DocBlock>
      <CodeBlock>
        {`
import SelectSitesButton from 'portal-core-components/lib/components/SelectSitesButton';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        ...
      </DocBlock>
      <ExampleBlock>
        <SelectSitesButton />
      </ExampleBlock>
      <CodeBlock>
        {`
<SelectSitesButton />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>...</Typography>

      <DocBlock>
        ...
      </DocBlock>

    </React.Fragment>
  );
}
