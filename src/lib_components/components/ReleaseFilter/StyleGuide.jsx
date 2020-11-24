/* eslint react/jsx-one-expression-per-line: 0 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import ReleaseFilter from './ReleaseFilter';
import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const propRows = [
  {
    name: 'excludeNullRelease',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether to exclude the n/a option (no release or null release) which is usually
        automatically inserted into the sorted set of release options.
      </p>
    ),
  },
  {
    name: 'maxWidth',
    type: 'number',
    default: '236',
    examples: (
      <div>
        <tt>250</tt>
        <br />
        <tt>400</tt>
      </div>
    ),
    description: (
      <p>
        CSS maxWidth value to apply to the the select element and its container. Note the default
        value is <tt>236</tt> as this lines up with the inner content width of the sidebar for
        the <Link href="#NeonPage">NeonPage</Link> component, a common location where ReleaseFilter
        may be used.
      </p>
    ),
  },
  {
    name: 'onChange',
    type: 'function',
    default: '() => {}',
    description: (
      <p>
        Function to fire when the ReleaseFilter is updated by user interaction. It should take a
        single string argument representing the selected release name (or <tt>null</tt> if n/a
        was selected).
      </p>
    ),
  },
  {
    name: 'releases',
    type: 'array of release objects',
    default: '[]',
    examples: (
      <i>See functional example code below</i>
    ),
    description: (
      <React.Fragment>
        <p>
          Array of objects containing the following keys:
        </p>
        <ul>
          <li><tt>release</tt> (string, required)</li>
          <li><tt>generationDate</tt> (ISO date string, required)</li>
          <li><tt>url</tt> (DOI string, optional)</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    name: 'selected',
    type: 'string',
    examples: (
      <div>
        <tt>&quot;test-tag-1&quot;</tt>
        <br />
        <tt>null</tt>
      </div>
    ),
    description: (
      <p>
        Initial selected value expressed as a release string or <tt>null</tt>. Note:
        if <tt>excludeNullRelease</tt> is <tt>true</tt> and this prop is <tt>null</tt> or omitted
        then the latest release will automatically be selected.
      </p>
    ),
  },
  {
    name: 'showDoi',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether to show the selected release DOI with a copy button below the select input.
      </p>
    ),
  },
  {
    name: 'showGenerationDate',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether to show the selected release generation date below the select input.
      </p>
    ),
  },
  {
    name: 'skeleton',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Whether to render a skeleton version of the ReleaseFilter (useful when in a loading state).
      </p>
    ),
  },
  {
    name: 'title',
    type: 'string',
    default: 'Release',
    examples: (
      <div>
        <tt>&quot;Select a Release&quot;</tt>
        <br />
        <tt>null</tt>
      </div>
    ),
    description: (
      <p>
        Title to appear above the select input. The rendered title is also linked to the select
        input with <tt>aria-labelledby</tt> attribute.
      </p>
    ),
  },
];

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

const onChange = (newRelease) => {
  console.log(`New release: ${newRelease}`); // eslint-disable-line no-console
};

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <React.Fragment>

      <DocBlock>
        Use a ReleaseFilter to present a visually consistent means of switching between releases
        on a page or in any workflow where release differentiation is important. Caveats:
      </DocBlock>
      <DocBlock>
        <ul>
          <li>ReleaseFilter is stateless (none of the examples below will persist their state)</li>
          <li>ReleaseFilter is data-product agnostic</li>
        </ul>
      </DocBlock>
      <CodeBlock>
        {`
import ReleaseFilter from 'portal-core-components/lib/components/ReleaseFilter';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} />
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Usage and Exmaples</Typography>

      <ExampleBlock>
        <ReleaseFilter skeleton />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} onChange={onChange} />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} maxWidth={400} selected="test-tag-2" />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} selected="test-tag-1" showGenerationDate />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} selected="test-tag-3" showGenerationDate showDoi />
      </ExampleBlock>
      <ExampleBlock>
        <ReleaseFilter releases={releases} title={null} excludeNullRelease />
      </ExampleBlock>
      <CodeBlock>
        {`
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

const onChange = (newRelease) => {
  console.log(\`New release: $\{newRelease}\`);
};

<ReleaseFilter skeleton />
<ReleaseFilter releases={releases} onChange={onChange} />
<ReleaseFilter releases={releases} maxWidth={236} selected="test-tag-2" />
<ReleaseFilter releases={releases} selected="test-tag-1" showGenerationDate />
<ReleaseFilter releases={releases} selected="test-tag-3" showGenerationDate showDoi />
<ReleaseFilter releases={releases} title={null} excludeNullRelease />
        `}
      </CodeBlock>

    </React.Fragment>
  );
}
