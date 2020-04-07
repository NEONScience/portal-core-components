/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */

import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import FullWidthVisualization from './FullWidthVisualization';
import Theme from '../Theme/Theme';

// Pattern borrowed from here: https://leaverou.github.io/css3patterns/#japanese-cube
const makeVizClass = (base, dark, light) => ({
  height: '100px',
  padding: '8px',
  color: '#fff',
  backgroundColor: base,
  backgroundImage: `
    linear-gradient(30deg, ${dark} 12%, transparent 12.5%, transparent 87%, ${dark} 87.5%, ${dark}),
    linear-gradient(150deg, ${dark} 12%, transparent 12.5%, transparent 87%, ${dark} 87.5%, ${dark}),
    linear-gradient(30deg, ${dark} 12%, transparent 12.5%, transparent 87%, ${dark} 87.5%, ${dark}),
    linear-gradient(150deg, ${dark} 12%, transparent 12.5%, transparent 87%, ${dark} 87.5%, ${dark}),
    linear-gradient(60deg, ${light} 25%, transparent 25.5%, transparent 75%, ${light} 75%, ${light}),
    linear-gradient(60deg, ${light} 25%, transparent 25.5%, transparent 75%, ${light} 75%, ${light})
  `,
  backgroundSize: '80px 140px',
  backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
});

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  viz_0: makeVizClass('#555566', '#444455', '#9999aa'),
  viz_1: makeVizClass('#566767', '#445555', '#99aaaa'),
  viz_2: makeVizClass('#566756', '#445544', '#99aa99'),
  viz_3: makeVizClass('#676756', '#555544', '#aaaa99'),
  viz_4: makeVizClass('#675656', '#554444', '#aa9999'),
  viz_5: makeVizClass('#675656', '#445544', '#9999aa'),
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);

  const myVizRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const [vizHidden, setVizHidden] = useState(false);
  const [redraws, setRedraws] = useState(0);

  return (
    <React.Fragment>

      <DocBlock>
        A container for a visualization that is expected to dynamically resize and
        redraw itself as the viewport changes dimensions, favoring always being <i>full width</i>.
      </DocBlock>
      <CodeBlock>
        {`
import FullWidthVisualization from 'portal-core-components/lib/components/FullWidthVisualization';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        A <tt>FullWidthVisualization</tt> instance requires a <tt>vizRef</tt> and
        children. The component acts as the container for the visualization where
        the visualization itself must be defined as a child node. The <tt>vizRef</tt> must
        be created using React&apos;s <tt>useRef</tt> hook, and in addition to being passed
        in as a prop, must be added as the <tt>ref</tt> on the child node that is the
        dynamically sized visualization element (e.g. the svg, canvas, iframe, etc.)
      </DocBlock>
      <ExampleBlock>
        <FullWidthVisualization vizRef={myVizRefs[0]}>
          <div ref={myVizRefs[0]} className={classes.viz_0} />
        </FullWidthVisualization>
      </ExampleBlock>
      <CodeBlock>
        {`
import { useRef } from 'react';

const myVizRef = useRef(null);

<FullWidthVisualization vizRef={myVizRef}>
  <div ref={myVizRef} />
</FullWidthVisualization>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Additional Children</Typography>

      <DocBlock>
        Children in the <tt>FullWidthVisualization</tt> component can be anything, as
        long as one child node (arbitrarily deeply nested) is referenced by the <tt>vizRef</tt> ref.
        Ultimately the node rendered containing the children is a <tt>&lt;div&gt;</tt> with
        100% width, so treat it as such when including other content.
      </DocBlock>
      <ExampleBlock>
        <FullWidthVisualization vizRef={myVizRefs[1]}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum,
            sapien id accumsan aliquam, nisl leo vulputate lorem, ac vestibulum sapien
            nibh ut sapien. Aenean bibendum risus nisl, vel facilisis ex pellentesque in.
          </p>
          <div ref={myVizRefs[1]} className={classes.viz_1} />
          <hr />
          <p>Some more content that comes after...</p>
        </FullWidthVisualization>
      </ExampleBlock>
      <CodeBlock>
        {`
import { useRef } from 'react';

const myVizRef = useRef(null);

<FullWidthVisualization vizRef={myVizRef}>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum,
    sapien id accumsan aliquam, nisl leo vulputate lorem, ac vestibulum sapien
    nibh ut sapien. Aenean bibendum risus nisl, vel facilisis ex pellentesque in.
  </p>
  <div ref={myVizRef} />
  <hr />
  <p>Some more content that comes after...</p>
</FullWidthVisualization>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Minimum Width</Typography>

      <DocBlock>
        The optional <tt>minWidth</tt> prop keeps the width of the visualization from
        dropping below a threshold even if the container does.
      </DocBlock>
      <ExampleBlock>
        <FullWidthVisualization vizRef={myVizRefs[2]} minWidth={600}>
          <div ref={myVizRefs[2]} className={classes.viz_2} />
        </FullWidthVisualization>
      </ExampleBlock>
      <CodeBlock>
        {`
import { useRef } from 'react';

const myVizRef = useRef(null);

<FullWidthVisualization vizRef={myVizRef} minWidth={600}>
  <div ref={myVizRef} />
</FullWidthVisualization>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Deriving Height From Width</Typography>

      <DocBlock>
        Some visualizations may need to have a dynamic height that takes into account the
        current width (for example, maintaining a fixe aspect ratio). The width dimension is
        controlled by hooks and state inside the <tt>FullWidthVisualization</tt>, but by
        default height is not. The <tt>deriveHeightFromWidth</tt> prop allows for passing
        a function that takes width as its only argument to also take control of height as
        the width changes.
      </DocBlock>
      <DocBlock>
        The <tt>deriveHeightFromWidth</tt> prop can also be set to <tt>&quot;auto&quot;</tt> to hand
        off height calculation to internal logic. This logic will maintain an aspect ratio matching
        the viewport size at discrete breakpoints. For example a small viewport size (mobile screen)
        will see a 1:1 (square) aspect ratio whereas a large viewport size will see a 16:9
        (widescreen) aspect ratio.
      </DocBlock>
      <DocBlock>
        If the <tt>deriveHeightFromWidth</tt> prop is omitted the height must be defined in the
        styles/classes on the component.
      </DocBlock>
      <ExampleBlock>
        <FullWidthVisualization
          vizRef={myVizRefs[3]}
          deriveHeightFromWidth={width => Math.floor(width / 2)}
        >
          <div ref={myVizRefs[3]} className={classes.viz_3} />
        </FullWidthVisualization>
      </ExampleBlock>
      <CodeBlock>
        {`
import { useRef } from 'react';

const myVizRef = useRef(null);

// Maintain a fixed aspect ratio of 2:1
const getHeight = width => Math.floor(width / 2);

<FullWidthVisualization vizRef={myVizRef} deriveHeightFromWidth={getHeight}>
  <div ref={myVizRef} />
</FullWidthVisualization>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Passing a Redraw Handler</Typography>

      <DocBlock>
        Some visualizations may need to redraw / rerender themselves as their width
        changes. Since width is handled by the <tt>FullWidthVisualization</tt> component
        it will need access to the redraw handler. Pass it in using the <tt>handleRedraw</tt> prop
        to ensure that logic gets triggered every time the width changes.
      </DocBlock>
      <DocBlock>
        Note that <tt>FullWidthVisualization</tt> has logic built in to avoid unnecessary redraws
        when the visualization is not rendered in the DOM. This can be useful, say, when many
        full-width visualizations appear on a page and which ones show at any given time are
        controlled by state changes.
      </DocBlock>
      <ExampleBlock>
        <div style={{ width: '100%' }}>
          <div style={{ display: vizHidden ? 'none' : 'block' }}>
            <FullWidthVisualization
              vizRef={myVizRefs[4]}
              handleRedraw={() => setRedraws(redraws + 1)}
            >
              <div ref={myVizRefs[4]} className={classes.viz_4}>
                {`Redraws: ${redraws}`}
              </div>
            </FullWidthVisualization>
          </div>
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 8 }}
            onClick={() => setVizHidden(!vizHidden)}
          >
            Toggle Display
          </Button>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
import { useRef, useState } from 'react';

import Typography from '@material-ui/core/Typography';

export default function MyVizApp() {
  const myVizRef = useRef(null);
  const [vizHidden, setVizHidden] = useState(false);
  const [redraws, setRedraws] = useState(0);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: vizHidden ? 'none' : 'block' }}>
        <FullWidthVisualization
          vizRef={myVizRef}
          handleRedraw={() => setRedraws(redraws + 1)}
        >
          <div ref={myVizRef}>
            {\`Redraws: $\{redraws}\`}
          </div>
        </FullWidthVisualization>
      </div>
      <Button
        color="primary"
        variant="contained"
        style={{ marginTop: 8 }}
        onClick={() => setVizHidden(!vizHidden)}
      >
        Toggle Display
      </Button>
    </div>
  );
}
        `}
      </CodeBlock>
    </React.Fragment>
  );
}
