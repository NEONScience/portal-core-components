import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DialogBase from '../DialogBase/DialogBase';
import DocumentList from './DocumentList';
import DocumentListItem, { DocumentListItemModel } from './DocumentListItem';
import DocumentSelect from './DocumentSelect';
import DocumentTabs from './DocumentTabs';
import DocumentViewer from './DocumentViewer';
import PdfDocumentViewer from './PdfDocumentViewer';
import Theme from '../Theme/Theme';
import { NeonDocument } from '../../types/neonApi';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabDialogOpen, setTabDialogOpen] = useState(false);
  const exampleDoc: NeonDocument = {
    name: 'NEON.DOC.000780vB.pdf',
    type: 'application/pdf',
    size: 993762,
    description: 'NEON Algorithm Theoretical Basis Document (ATBD) – 2D Wind Speed and Direction',
  };
  const qsgDoc = {
    name: 'NEON.QSG.DP1.00001.001v1.pdf',
    type: 'application/pdf',
    size: 170516,
    description: 'Quick Start Guide for 2D wind speed and direction (DP1.00001.001)',
  };
  const neonDoc = {
    name: 'NEON.DOC.000230vA.pdf',
    type: 'application/pdf',
    size: 599913,
    description: 'NEON sensor command, control and configuration – Barometric pressure',
  };
  const invalidDoc = {
    name: 'invalid.pdf',
    type: 'invalid',
    size: 0,
    description: 'Invalid document',
  };
  const docs: NeonDocument[] = [qsgDoc, neonDoc, invalidDoc];
  const docsList: DocumentListItemModel[] = [
    {
      ...qsgDoc,
      variants: [],
    },
    {
      ...neonDoc,
      variants: [],
    },
    {
      ...invalidDoc,
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
      <Typography variant="h6" component="h4" gutterBottom>Example Document Item</Typography>
      <DocBlock>
        Displays a single document item.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentListItem from 'portal-core-components/lib/components/Documents/DocumentListItem';

<DocumentListItem document={document} enableDownloadButton enableVariantChips fetchVariants />
        `}
      </CodeBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <Paper className={classes.paper} style={{ marginBottom: '10px' }}>
            <DocumentListItem
              document={qsgDoc}
              containerComponent="div"
              enableDownloadButton
              enableVariantChips
              fetchVariants
            />
          </Paper>
          <Paper className={classes.paper} style={{ marginBottom: '10px' }}>
            <DocumentListItem
              document={neonDoc}
              containerComponent="div"
              makeDownloadableLink
              enableDownloadButton
              enableVariantChips
            />
          </Paper>
          <Paper className={classes.paper} style={{ marginBottom: '10px' }}>
            <DocumentListItem
              document={invalidDoc}
              containerComponent="div"
              enableDownloadButton
            />
          </Paper>
        </div>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document List</Typography>
      <DocBlock>
        List for displaying and allowing download of numerous documents.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentList from 'portal-core-components/lib/components/Documents/DocumentList';

const docs: NeonDocument[] = [...];

<DocumentList documents={docs} enableDownloadButton enableVariantChips fetchVariants />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DocumentList
            documents={docsList}
            enableDownloadButton
            enableVariantChips
            fetchVariants
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

const docs: NeonDocument[] = [...];

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

const docs: NeonDocument[] = [...];

<DocumentSelect documents={docs} />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <DocumentSelect documents={docs} />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document Dialog</Typography>
      <DocBlock>
        Dialog for displaying documents.
      </DocBlock>
      <ExampleBlock>
        <div style={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Open Document Dialog
          </Button>
          <br />
          <br />
          <Button variant="contained" onClick={() => setTabDialogOpen(true)}>
            Open Document Tabs Dialog
          </Button>
          <DialogBase
            open={dialogOpen}
            title="View Document"
            onClose={() => setDialogOpen(false)}
            data-selenium="document-viewer-dialog"
            nopaper
          >
            <DocumentViewer
              document={exampleDoc}
              width={800}
            />
          </DialogBase>
          <DialogBase
            open={tabDialogOpen}
            title="View Documents"
            onClose={() => setTabDialogOpen(false)}
            data-selenium="document-tab-viewer-dialog"
            nopaper
          >
            <DocumentTabs documents={docs} />
          </DialogBase>
        </div>
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example PDF.js based Document Viewer</Typography>
      <DocBlock>
        Displays a single PDF document.
      </DocBlock>
      <CodeBlock>
        {`
import PdfDocumentViewer from 'portal-core-components/lib/components/Documents/PdfDocumentViewer';

const exampleDoc: NeonDocument = {
  name: 'NEON.DOC.000780vB.pdf',
  type: 'application/pdf',
  size: 993762,
  description: 'NEON Algorithm Theoretical Basis Document (ATBD) – 2D Wind Speed and Direction',
};

<PdfDocumentViewer
  document={exampleDoc}
  width={800}
/>
        `}
      </CodeBlock>
      <ExampleBlock>
        <PdfDocumentViewer
          document={exampleDoc}
          width={800}
        />
      </ExampleBlock>
    </>
  );
}
