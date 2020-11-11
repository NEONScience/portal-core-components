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
  { name: 'NEON.2021.1', doi: 'https://doi.org/abc/jkl_mno_pqr_stuvwx/yzabcdef' },
  { name: 'NEON.2021.0', doi: 'https://doi.org/abc/def_ghi_jkl_mnopqrstu' },
  { name: 'NEON.2022.0', doi: 'https://doi.org/abc/vwx_yza_bcd_efghijklmnop' },
  { name: 'NEON.2021.2', doi: 'https://doi.org/abc/psr_stu_vwxyz_abcdef' },
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
        <ReleaseFilter releases={releases} maxWidth={236} selected="NEON.2021.1" />
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
