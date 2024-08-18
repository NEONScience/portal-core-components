/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */
import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import StoryMap from '@/components/StoryMap/StoryMap';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

export default function StyleGuide() {
  const FullWidthVisualizationLink = (
    <Link href="#FullWidthVisualization">FullWidthVisualization</Link>
  );

  return (
    <>

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
      <DocBlock>
        The StoryMap component uses the {FullWidthVisualizationLink} component as a container with
        automatic derived height. This means a StoryMap component will always fill the full width of
        its container and automatically derive its height from the viewport size; mimicking the
        aspect ratio of the viewport at several set break points.
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

    </>
  );
}
