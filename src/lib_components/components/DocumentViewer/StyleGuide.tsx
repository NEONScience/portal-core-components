import React from 'react';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DocumentViewer from './DocumentViewer';
import Theme from '../Theme/Theme';
import { NeonDocument } from '../../types/neon';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
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
  return (
    <>
      <DocBlock>
        A module for displaying documents inline.
      </DocBlock>
      <CodeBlock>
        {`
import DocumentViewer from 'portal-core-components/lib/components/DocumentViewer';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Example Document Viewer</Typography>
      <DocBlock>
        Displays a single embeded document.
      </DocBlock>
      <ExampleBlock>
        <DocumentViewer
          document={exampleDoc}
          width={800}
        />
      </ExampleBlock>
    </>
  );
}
