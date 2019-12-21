/* eslint react/jsx-one-expression-per-line: 0 */

import { map, catchError } from 'rxjs/operators';

import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
// import ExampleBlock from '../../../components/ExampleBlock';

import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import Theme from './Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide(props) {
  NeonGraphQL.getAllDataProducts().pipe(
    map((response) => { console.log('SUCCESS', response); }),
    catchError((error) => { console.log('ERROR', error); }),
  ).subscribe();

  const classes = useStyles(Theme);
  const { onClickHash } = props;
  const styleGuideUrl = 'https://raw.githubusercontent.com/NEONScience/portal-core-components/master/reference/NSF-NEON-BRAND.GUIDELINES.pdf';

  return (
    <React.Fragment>

      <DocBlock>
        A Material UI Theme based on the NEON Style Guide.
      </DocBlock>
      <CodeBlock>
        {`
import { Theme } from 'portal-core-components';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        Material UI themes contain values, functions, and data structures that
        drive all CSS generation for a given page. NEON uses a theme with a few
        customizations on top of Material&apos;s defaults in order to follow the &nbsp;
        <Link href={styleGuideUrl}>NEON Style Guide</Link>. See&nbsp;
        <Link href="https://material-ui.com/customization/themes/">Material UI Themes</Link>
        &nbsp;for additional context.
      </DocBlock>
      <DocBlock>
        Note when using the&nbsp;
        <Link href="#NeonPage" onClick={() => onClickHash('#NeonPage')}>Neon Page Component</Link>
        &nbsp;the theme will automatically be injected into the page such that all
        components used in the page will have the them applied. When building custom
        classes and styles within a component&apos;s JSX, however, it may be helpful
        to pull in the Theme to get commonly used CSS values, like sizing units
        and colors.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Sizing</Typography>

      <DocBlock>
        Use <tt>theme.sizing()</tt> to generate sizes for padding, margins, element
        dimensions, etc. This is a standard Material UI Theme function that will
        generate the appropriate CSS value string given one or more number inputs.
        It allows a developer to think in <i>units</i>, where one unit is 8 pixels
        (effectively snapping all page elements to an 8 pixel grid) if only whole
        numbers are used.
      </DocBlock>
      <CodeBlock>
        {`
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from 'portal-core-components';

const useStyles = makeStyles(theme => ({
  myCssClass: {
    padding: theme.spacing(3, 4),
    marginBottom: theme.spacing(2),
  },
};

const myComponent = () => {
  const classes = useStyles(Theme);
  return (
    <BaseComponent className={classes.myCssClass} />
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Color Palettes</Typography>
      <DocBlock>
        Use <tt>theme.palette</tt> to get predefined color values that conform to
        the NEON Style Guide.&nbsp;
        <b>One should never need to hard-code hex values in components.</b>
        &nbsp;These are the colors currently defined in the theme:
      </DocBlock>
      <CodeBlock>
        {`
${JSON.stringify(Theme.palette, null, 2)}

`}
      </CodeBlock>
      <DocBlock>
        Here is an example approach to using values in <tt>theme.palette</tt> to
        build custom classes for a component:
      </DocBlock>
      <CodeBlock>
        {`
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from 'portal-core-components';

const useStyles = makeStyles(theme => ({
  myCssClass: {
    backgroundColor: theme.palette.grey[50],
    border: \`1px solid $\{theme.palette.primary.main}\`,
  },
};

const myComponent = () => {
  const classes = useStyles(Theme);
  return (
    <BaseComponent className={classes.myCssClass} />
  );
}
        `}
      </CodeBlock>

    </React.Fragment>
  );
}

StyleGuide.propTypes = {
  onClickHash: PropTypes.func.isRequired,
};
