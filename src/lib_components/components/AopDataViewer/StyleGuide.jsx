/* eslint react/jsx-one-expression-per-line: 0 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import AopDataViewer from './AopDataViewer';
import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <>

      <DocBlock>
        An interactive visualization of AOP data sets built and maintained by the
        University of Utah.
      </DocBlock>
      <CodeBlock>
        {`
import AopDataViewer from 'portal-core-components/lib/components/AopDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        Invoke an AOP Data Viewer with a <tt>productCode</tt> prop to generate
        the basic integrated viewer. Site and time selector will be included and
        the viewer itself will be loaded in an iframe. The whole package will
        scale itself responsively to its parent container.
      </DocBlock>
      <ExampleBlock>
        <AopDataViewer productCode="DP3.30026.001" />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopDataViewer productCode="DP3.30026.001" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Failure State</Typography>

      <DocBlock>
        If passed a <tt>productCode</tt> prop that does not resolve to streamable
        AOP data then the component will load in a generic graceful error state,
        still taking the full width of the container as if it loaded normally.
      </DocBlock>
      <ExampleBlock>
        <AopDataViewer productCode="FAKE.PRODUCT.CODE" />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopDataViewer productCode="FAKE.PRODUCT.CODE" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Initial Site / Year / Flight</Typography>

      <DocBlock>
        There are three props that can be provided to dial into a particular site,
        year, and/or flight:
        <ul>
          <li>
            <tt>initialSite</tt>
            <br />
            Any valid site code string. If provided and not valid for the product
            will revert to first site.
          </li>
          <li>
            <tt>initialYear</tt>
            <br />
            Any 4-digit year as an integer. If provided and not valid for the product
            and initial site will revert to latest year for the initial site.
          </li>
          <li>
            <tt>initialFlight</tt>
            <br />
            Any integer. Flight numbers are indexed starting at 1. If provided and
            not valid for the initial site and year for the product will revert to
            the highest available flight number for the site/year.
          </li>
        </ul>
      </DocBlock>
      <ExampleBlock>
        <AopDataViewer
          productCode="DP3.30010.001"
          initialSite="ORNL"
          initialYear={2015}
          initialFlight={1}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopDataViewer
  productCode="DP3.30010.001"
  initialSite="ORNL"
  initialYear={2015}
  initialFlight={1}
 />
        `}
      </CodeBlock>

    </>
  );
}
