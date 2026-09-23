import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import DialogBase from '@/components/DialogBase/DialogBase';
import SaeDataViewer from '@/components/SaeDataViewer/SaeDataViewer';
import { makeStyles } from '@/components/Theme/makeStyles';
import { NeonTheme } from '@/components/Theme/types';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const StaticSaeDataViewerDialog = () => {
  const { classes } = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>

      <DocBlock>
        The SAE Data Viewer development environment for dialog presentation.
      </DocBlock>
      <CodeBlock>
        {`
import Button from '@mui/material/Button';
import DialogBase from '../DialogBase/DialogBase';
import SaeDataViewer from 'portal-core-components/lib/components/SaeDataViewer/SaeDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <CodeBlock>
        {`
const [dialogOpen, setDialogOpen] = useState(false);
return (
  <>
    <Button
      color="primary"
      variant="contained"
      onClick={() => setDialogOpen(true)}
    >
      Open SAE Data Viewer Dialog
    </Button>
    {!dialogOpen ? null : (
      <DialogBase
        open
        nopaper
        title="SAE Data Viewer"
        onClose={() => setDialogOpen(false)}
      >
        <SaeDataViewer productCode="DP4.00067.001" />
      </DialogBase>
    )}
  </>
);
        `}
      </CodeBlock>
      <ExampleBlock>
        <>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setDialogOpen(true)}
          >
            Open SAE Data Viewer Dialog
          </Button>
          {!dialogOpen ? null : (
            <DialogBase
              open
              nopaper
              title="SAE Data Viewer"
              onClose={() => setDialogOpen(false)}
            >
              <SaeDataViewer productCode="DP4.00067.001" />
            </DialogBase>
          )}
        </>
      </ExampleBlock>

      <Divider className={classes.divider} />

    </>
  );
};

export default function StyleGuide() {
  const { classes } = useStyles();

  return (
    <>

      <DocBlock>
        Surface Atmostphere Exchange (SAE) Data Viewer
      </DocBlock>
      <CodeBlock>
        {`
import SaeDataViewer from 'portal-core-components/lib/components/SaeDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <CodeBlock>
        {`
<SaeDataViewer productCode="DP4.00067.001" />
        `}
      </CodeBlock>
      <DocBlock>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
        {/* @ts-ignore */}
        Initializing a SaeDataViewer requires only a valid <tt>productCode</tt> prop. The example
        below wraps a SaeDataViewer instance with a data product selector to demonstrate how
        different products perform.
      </DocBlock>
      <ExampleBlock>
        <SaeDataViewer productCode="DP4.00067.001" />
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h5" component="h3" gutterBottom>Bundled Product Usage</Typography>

      <CodeBlock>
        {`
<SaeDataViewer productCode="DP4.00200.001" />
        `}
      </CodeBlock>
      <DocBlock>
        Initializing a SaeDataViewer with the bundled data product.
      </DocBlock>
      <ExampleBlock>
        <SaeDataViewer productCode="DP4.00200.001" />
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>Dialog</Typography>

      <StaticSaeDataViewerDialog />

    </>
  );
}
