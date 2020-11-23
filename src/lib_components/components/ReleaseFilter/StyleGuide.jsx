/* eslint react/jsx-one-expression-per-line: 0 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import ReleaseFilter from './ReleaseFilter';
import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const releases = [
  {
    release: 'test-tag-1',
    url: 'https://doi.test.datacite.org/10.80606/1wvk-f032',
    generationDate: '2020-11-10T01:01:30Z',
  },
  {
    release: 'test-tag-3',
    url: 'https://doi.test.datacite.org/10.80606/c93r-j2px',
    generationDate: '2020-11-20T03:22:30Z',
  },
  {
    release: 'test-tag-2',
    url: 'https://doi.test.datacite.org/10.80606/8cuy-lz8m',
    generationDate: '2020-11-15T02:17:30Z',
  },
];

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <React.Fragment>

      <DocBlock>
        ...
      </DocBlock>
      <CodeBlock>
        {`
import ReleaseFilter from 'portal-core-components/lib/components/ReleaseFilter';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        ...
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '276px' }}>
          <ReleaseFilter skeleton />
        </div>
      </ExampleBlock>
      <ExampleBlock>
        <div style={{ width: '236px' }}>
          <ReleaseFilter releases={releases} />
        </div>
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} maxWidth={236} selected="test-tag-2" />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} selected="test-tag-1" showGenerationDate />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} selected="test-tag-3" showDoi />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} selected="test-tag-2" showDoi showGenerationDate />
      </ExampleBlock>
      <CodeBlock>
        {`
<ReleaseFilter />
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
