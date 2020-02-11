/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import TimeSeriesViewer from './TimeSeriesViewer';
import Theme from '../Theme/Theme';

import sampleProductData from '../../../sampleData/DP1.00001.001.json';

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
        ...
      </DocBlock>
      <CodeBlock>
        {`
import TimeSeriesViewer from 'portal-core-components/lib/components/TimeSeriesViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        ...
      </DocBlock>

      <ExampleBlock>
        <TimeSeriesViewer productCode="DP1.00001.001" />
      </ExampleBlock>
      <CodeBlock>
        {`
<TimeSeriesViewer productCode="DP1.00001.001" />
        `}
      </CodeBlock>

      <ExampleBlock>
        <TimeSeriesViewer productData={sampleProductData.data} />
      </ExampleBlock>
      <CodeBlock>
        {`
productData = {
  productCode: 'DP1.00001.001',
  availableMonths: [...],
  ...
};

return (
  <TimeSeriesViewer productData={productData} />
);
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
