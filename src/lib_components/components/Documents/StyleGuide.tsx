import React from 'react';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DocumentList from './DocumentList';
import DocumentSelect from './DocumentSelect';
import DocumentTabs from './DocumentTabs';
import DocumentViewer from './DocumentViewer';
import Theme from '../Theme/Theme';
import { NeonDocument } from '../../types/neonApi';
import { DocumentListItemModel } from './documentTypes';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3, 3, 3, 3),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  paper: {
    width: '100%',
    padding: Theme.spacing(3),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const exampleDoc: NeonDocument = {
    name: 'NEON.DOC.000780vB.pdf',
    type: 'application/pdf',
    size: 993762,
    description: 'NEON Algorithm Theoretical Basis Document (ATBD) – 2D Wind Speed and Direction',
  };
  const docs: NeonDocument[] = [
    {
      name: 'NEON.QSG.DP1.00001.001v1.pdf',
      type: 'application/pdf',
      size: 170516,
      description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
    },
    {
      name: 'NEON.DOC.000230vA.pdf',
      type: 'application/pdf',
      size: 599913,
      description: 'NEON sensor command, control and configuration – Barometric pressure',
    },
    {
      name: 'invalid.pdf',
      type: 'invalid',
      size: 0,
      description: 'Invalid document',
    },
  ];
  const docsList: DocumentListItemModel[] = [
    {
      name: 'NEON.QSG.DP1.00001.001v1.pdf',
      type: 'application/pdf',
      size: 170516,
      description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
      variants: [
        {
          name: 'NEON.QSG.DP1.00001.001v1.pdf',
          type: 'application/pdf',
          size: 170516,
          description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
        },
        {
          name: 'NEON.QSG.DP1.00001.001v1.html',
          description: 'HTML Quick Start Guide for 2D wind speed and direction (NEON.DOM.SITE.DP1.00001.001)',
          type: 'text/html',
          size: 4287380,
        },
        {
          name: 'NEON.QSG.DP1.00001.001v1.md',
          description: 'Markdown Quick Start Guide for 2D wind speed and direction (NEON.DOM.SITE.DP1.00001.001)',
          type: 'text/markdown',
          size: 3556,
        },
      ],
    },
    {
      name: 'NEON.DOC.000230vA.pdf',
      type: 'application/pdf',
      size: 599913,
      description: 'NEON sensor command, control and configuration – Barometric pressure',
      variants: [],
    },
    {
      name: 'invalid.pdf',
      type: 'invalid',
      size: 0,
      description: 'Invalid document',
      variants: [],
    },
  ];
  return (
    <>
      <DocBlock>
        A module for displaying documents inline.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentViewer from 'portal-core-components/lib/components/Documents/DocumentViewer';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document Viewer</Typography>
      <DocBlock>
        Displays a single embedded document.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentViewer from 'portal-core-components/lib/components/Documents/DocumentViewer';

const exampleDoc: NeonDocument = {
  name: 'NEON.DOC.000780vB.pdf',
  type: 'application/pdf',
  size: 993762,
  description: 'NEON Algorithm Theoretical Basis Document (ATBD) – 2D Wind Speed and Direction',
};

<DocumentViewer
  document={exampleDoc}
  width={800}
/>
        `}
      </CodeBlock>
      <ExampleBlock>
        <DocumentViewer
          document={exampleDoc}
          width={800}
        />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document List</Typography>
      <DocBlock>
        List for displaying and allowing download of numerous documents.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentList from 'portal-core-components/lib/components/Documents/DocumentList';

const docs: NeonDocument[] = [
  {
    name: 'NEON.QSG.DP1.00001.001v1.pdf',
    type: 'application/pdf',
    size: 170516,
    description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
  },
  {
    name: 'NEON.DOC.000230vA.pdf',
    type: 'application/pdf',
    size: 599913,
    description: 'NEON sensor command, control and configuration – Barometric pressure',
  },
  {
    name: 'invalid.pdf',
    type: 'invalid',
    size: 0,
    description: 'Invalid document',
  },
];

<DocumentList documents={docs} makeDownloadableLink enableDownloadButton />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DocumentList
            documents={docsList}
            enableDownloadButton
            enableVariantChips
          />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document Tabs</Typography>
      <DocBlock>
        Tab selection for toggling and displaying numerous documents.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentTabs from 'portal-core-components/lib/components/Documents/DocumentTabs';

const docs: NeonDocument[] = [
  {
    name: 'NEON.QSG.DP1.00001.001v1.pdf',
    type: 'application/pdf',
    size: 170516,
    description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
  },
  {
    name: 'NEON.DOC.000230vA.pdf',
    type: 'application/pdf',
    size: 599913,
    description: 'NEON sensor command, control and configuration – Barometric pressure',
  },
  {
    name: 'invalid.pdf',
    type: 'invalid',
    size: 0,
    description: 'Invalid document',
  },
];

<DocumentTabs documents={docs} />
        `}
      </CodeBlock>
      <ExampleBlock>
        <DocumentTabs documents={docs} />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document Selector</Typography>
      <DocBlock>
        Selector for toggling and displaying numerous documents.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentSelect from 'portal-core-components/lib/components/Documents/DocumentSelect';

const docs: NeonDocument[] = [
  {
    name: 'NEON.QSG.DP1.00001.001v1.pdf',
    type: 'application/pdf',
    size: 170516,
    description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
  },
  {
    name: 'NEON.DOC.000230vA.pdf',
    type: 'application/pdf',
    size: 599913,
    description: 'NEON sensor command, control and configuration – Barometric pressure',
  },
  {
    name: 'invalid.pdf',
    type: 'invalid',
    size: 0,
    description: 'Invalid document',
  },
];

<DocumentSelect documents={docs} />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DocumentSelect documents={docs} />
        </Paper>
      </ExampleBlock>
    </>
  );
}
