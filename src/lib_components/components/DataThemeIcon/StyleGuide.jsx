/* eslint react/jsx-one-expression-per-line: 0 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DataThemeIcon from './DataThemeIcon';
import Theme from '../Theme/Theme';

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
        A set of five scalable icons representing the different NEON Data Themes.
      </DocBlock>
      <CodeBlock>
        {`
import DataThemeIcon from 'portal-core-components/lib/components/DataThemeIcon';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        Use the <tt>theme</tt> prop to specify the theme.
      </DocBlock>
      <ExampleBlock>
        <DataThemeIcon theme="atmosphere" />
        <DataThemeIcon theme="biogeochemistry" />
        <DataThemeIcon theme="ecohydrology" />
        <DataThemeIcon theme="landcover" />
        <DataThemeIcon theme="organisms" />
      </ExampleBlock>
      <CodeBlock>
        {`
<DataThemeIcon theme="atmosphere" />
<DataThemeIcon theme="biogeochemistry" />
<DataThemeIcon theme="ecohydrology" />
<DataThemeIcon theme="landcover" />
<DataThemeIcon theme="organisms" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Aliases</Typography>

      <DocBlock>
        Multiple aliases for the same theme are supported by the <tt>theme</tt> prop.
        The idea is, in lieu of theme IDs, to be able to feed in any string found
        in the wild to represent the theme and things should <i>just work</i>.
      </DocBlock>
      <ExampleBlock>
        <DataThemeIcon theme="landuse" />
        <DataThemeIcon theme="landcover" />
        <DataThemeIcon theme="Land Use, Land Cover, and Land Processes" />
      </ExampleBlock>
      <CodeBlock>
        {`
<DataThemeIcon theme="landuse" />
<DataThemeIcon theme="landcover" />
<DataThemeIcon theme="Land Use, Land Cover, and Land Processes" />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Size</Typography>

      <DocBlock>
        Use the <tt>size</tt> prop to scale the icon to any size relative to the
        standard <tt>theme.spacing</tt> unit (1 unit  = 8px). The default size is
        5 units, or 40 pixels.
      </DocBlock>
      <ExampleBlock>
        <DataThemeIcon theme="atmosphere" size={3} />
        <DataThemeIcon theme="atmosphere" />
        <DataThemeIcon theme="atmosphere" size={8} />
        <DataThemeIcon theme="atmosphere" size={20} />
      </ExampleBlock>
      <CodeBlock>
        {`
<DataThemeIcon theme="atmosphere" size={3} />
<DataThemeIcon theme="atmosphere" />
<DataThemeIcon theme="atmosphere" size={8} />
<DataThemeIcon theme="atmosphere" size={20} />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Avatar</Typography>

      <DocBlock>
        Use the <tt>avatar</tt> prop to toggle rendering as a Material UI Avatar
        instead of a standalone image. This renders the icon as a circle.
      </DocBlock>
      <ExampleBlock>
        <DataThemeIcon theme="atmosphere" size={3} avatar />
        <DataThemeIcon theme="biogeochemistry" size={6} avatar />
        <DataThemeIcon theme="ecohydrology" size={9} avatar />
        <DataThemeIcon theme="landcover" size={12} avatar />
        <DataThemeIcon theme="organisms" size={15} avatar />
      </ExampleBlock>
      <CodeBlock>
        {`
<DataThemeIcon theme="atmosphere" size={3} avatar />
<DataThemeIcon theme="biogeochemistry" size={6} avatar />
<DataThemeIcon theme="ecohydrology" size={9} avatar />
<DataThemeIcon theme="landcover" size={12} avatar />
<DataThemeIcon theme="organisms" size={15} avatar />
        `}
      </CodeBlock>
    </React.Fragment>
  );
}
