/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React from 'react';

import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import StoryMap from './StoryMap';

export default function StyleGuide() {
  return (
    <React.Fragment>

      <DocBlock>
        A component for neatly embedding an ArcGIS Story Map into a page.
      </DocBlock>
      <CodeBlock>
        {`
import StoryMap from 'portal-core-components/lib/components/StoryMap';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        A StoryMap component requires a <tt>url</tt> prop which should be the URL of the story map
        as hosted elsewhere. It also takes a <tt>title</tt> prop which is not required. If there are
        more than one StoryMap components on the same page it is best to explicitly define a unique
        title for each of them.
      </DocBlock>

      <ExampleBlock>
        <StoryMap
          url="https://storymaps.arcgis.com/stories/953a6c06a53b44d48c3780867ff692d0"
          title="Central Plains: Getting to Know the NEON Domains"
        />
      </ExampleBlock>
      <CodeBlock>
        {`
<StoryMap
  url="https://storymaps.arcgis.com/stories/953a6c06a53b44d48c3780867ff692d0"
  title="Central Plains: Getting to Know the NEON Domains"
/>
        `}
      </CodeBlock>

    </React.Fragment>
  );
}
