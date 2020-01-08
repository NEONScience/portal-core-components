/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import Theme from '../Theme/Theme';

import ExternalHostInfo from './ExternalHostInfo';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const externalHostJsxUrl = 'https://github.com/NEONScience/portal-core-components/blob/master/src/lib_components/components/ExternalHost/ExternalHost.jsx';
  const snackbarUrl = 'https://material-ui.com/components/snackbars/';

  return (
    <React.Fragment>

      <DocBlock>
        A component for displaying info about and links to an external host (a research project
        distinct from NEON)
      </DocBlock>
      <CodeBlock>
        {`
import { ExternalHostInfo } from 'portal-core-components';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        All an External Host Info component needs to render successfully is
        a <tt>productCode</tt> prop that has a mapping to an external host. This
        renders a <Link href={snackbarUrl}>Material UI Snackbar</Link> to serve
        as a notice to the user about the relationship to the host in context of
        the product, including all relevant links to and info about the external
        host and what relevant data it may or may not offer.
      </DocBlock>
      <ExampleBlock column>
        <ExternalHostInfo productCode="DP1.10038.001" />
        <ExternalHostInfo productCode="DP1.10108.001" />
        <ExternalHostInfo productCode="DP1.10055.001" />
        <ExternalHostInfo productCode="DP1.00043.001" />
      </ExampleBlock>
      <CodeBlock>
        {`
<ExternalHostInfo productCode="DP1.10038.001" />
<ExternalHostInfo productCode="DP1.10108.001" />
<ExternalHostInfo productCode="DP1.10055.001" />
<ExternalHostInfo productCode="DP1.00043.001" />
        `}
      </CodeBlock>

      <DocBlock>
        If an External Host Info component is invoked with a product code that does not have a
        mapping to an external host then <tt>null</tt> is returned, rendering nothing.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Expandable</Typography>

      <DocBlock>
        When external host info needs to be accessible but it is not the focus of the
        page it can be useful to render the snackbar as expandable and collapsed. This
        is achieved using the <tt>expandable</tt> prop, which defaults to <tt>false</tt>:
      </DocBlock>
      <ExampleBlock column>
        <ExternalHostInfo productCode="DP1.10107.001" expandable />
        <ExternalHostInfo productCode="DP1.00042.001" expandable />
      </ExampleBlock>
      <CodeBlock>
        {`
<ExternalHostInfo productCode="DP1.00107.001" expandable />
<ExternalHostInfo productCode="DP1.00042.001" expandable />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>External Host to Data Product Model</Typography>

      <DocBlock>
        Presently the canonical model mapping external hosts to NEON data products (including
        meta data about external hosts independent of product association data such as full name,
        top-level URL, etc.) is persisted in static data structures inside portal-core-components.
      </DocBlock>
      <DocBlock>
        A more ideal setup would be to persist this is a database surfaced by an API with internal
        tools to curate data and relationships. While this is a medium-term goal, the nature of the
        data model is fluid / changing enough that it is easier to be responsive through
        hard-coding in this actively developed library.
      </DocBlock>
      <DocBlock>
        See <Link href={externalHostJsxUrl}>Portal Core Components | External Host</Link> for the
        latest model, relationships, and functions.
      </DocBlock>
    </React.Fragment>
  );
}
