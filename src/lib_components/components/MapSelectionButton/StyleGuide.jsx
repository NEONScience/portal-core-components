/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid, react/no-unescaped-entities, max-len */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import { FEATURE_TYPES } from '../SiteMap/SiteMapUtils';

import MapSelectionButton from './MapSelectionButton';

import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const buttonApiLink = <Link href="https://material-ui.com/api/button/">Material UI Button</Link>;
const tooltipApiLink = <Link href="https://material-ui.com/api/tooltip/">Material UI Tooltip</Link>;

const propRows = [
  {
    name: 'buttonProps',
    type: 'object',
    default: 'null',
    description: (
      <p>
        An object of {buttonApiLink} props to apply to the button. Applied after all hard-coded
        props except for <tt>onClick</tt> (meaning all other props can be overridden).
      </p>
    ),
  },
  {
    name: 'dialogTitle',
    type: 'string',
    default: 'null',
    description: (
      <p>
        The title that will appear at the top of the dialog. If not defined a generic title will be
        produced taking into account the value of <tt>selectionLimit</tt>.
      </p>
    ),
  },
  {
    name: 'icon',
    type: 'boolean',
    default: 'true',
    description: (
      <p>
        Whether to include the globe icon for the button.
      </p>
    ),
  },
  {
    name: 'label',
    type: 'string',
    default: '"map"',
    description: (
      <p>
        The label that will appear on the button.
      </p>
    ),
  },
  {
    name: 'onSave',
    type: 'function',
    default: 'null',
    description: (
      <p>
        A function that fires when the selection is committed. Does not fire on every change, only
        when the workflow is complete and the user clicks Save on a valid selection. It should take
        one argument representing the updated selection as a Set (not an array).
      </p>
    ),
  },
  {
    name: 'selectedItems',
    type: 'array of strings',
    default: '[]',
    examples: (
      <div>
        <tt>['ABBY', 'WREF', 'CPER']</tt>
        <br />
        <tt>['JORN']</tt>
      </div>
    ),
    description: (
      <p>
        Array of strings representing IDs of selectable items to show already selected when the
        SiteMap initializes. For example, if <tt>selection</tt> is <tt>"SITES"</tt> then this prop
        should contain siteCode strings.
      </p>
    ),
  },
  {
    name: 'selection',
    type: (
      <div>
        string, one of:
        {Object.keys(FEATURE_TYPES).filter((k) => FEATURE_TYPES[k].selectable).map((k) => (
          <div key={k} style={{ marginTop: '8px' }}>
            <tt>{`"${k}"`}</tt>
          </div>
        ))}
      </div>
    ),
    default: 'n/a (required)',
    description: (
      <p>
        <b>Required</b> string representing the feature type to be selectable in the map. All map
        features are grouped into types, and certain types are selectable.
      </p>
    ),
  },
  {
    name: 'selectionLimit',
    type: 'number or array of exactly two numbers',
    default: 'null',
    examples: (
      <div>
        <tt>3</tt>
        <br />
        <tt>[1, 5]</tt>
      </div>
    ),
    description: (
      <>
        <p>
          When selection is active and this prop is null there are no limits on what constitutes a
          valid selection (as long as at least one selectable item is selected). When not null this
          prop enforces limits on that validity.
        </p>
        <p>
          A numeric value will set a discrete selection limit (e.g. a value of <tt>3</tt> means
          that <i>exactly</i> three items must be selected to be valid). An array of two values
          sets a range (e.g. <tt>[1, 5]</tt> will consider a selection anywhere from one item up
          to five items to be valid).
        </p>
        <p>
          For all numeric values for this prop only non-zero positive integers are allowed. For an
          array of two numbers the second number must be greater than (and not equal two) the first.
        </p>
      </>
    ),
  },
  {
    name: 'siteMapProps',
    type: 'object',
    default: 'null',
    description: (
      <p>
        An object of props to apply to the <Link href="#SiteMap">Site Map</Link>. Use this to
        control additional settings on the embedded SiteMap such as location, zoom, etc. This object
        is spread onto the embedded Site Map <i>before</i> the other named SiteMap props are
        applied, so any named SiteMap props (<tt>selectionLimit</tt>, <tt>validItems</tt>,
        and <tt>selectionLimit</tt>) will defer to the top-level definition.
      </p>
    ),
  },
  {
    name: 'tooltipProps',
    type: 'object',
    default: 'null',
    description: (
      <p>
        An object of {tooltipApiLink} props to apply to the tooltip surrouning the button. Applied
        after hard-coded props so all props can be overridden.
      </p>
    ),
  },
  {
    name: 'validItems',
    type: 'array of strings',
    default: '[]',
    examples: (
      <div>
        <tt>['ABBY', 'WREF', 'CPER']</tt>
        <br />
        <tt>['JORN']</tt>
      </div>
    ),
    description: (
      <p>
        Array of strings representing IDs of selectable items. If non-empty this will be interpreted
        as a subset of the set of all items for the selectable type that are enabled for selection.
        Any items not represented in <tt>validItems</tt> will appear ghosted and will not be
        selectable.
      </p>
    ),
  },
];

const MyComponent = () => {
  const [selection, setSelection] = useState(new Set());
  return (
    <div>
      <h3>{`Selected Sites (${selection.size})`}</h3>
      <div>
        {!selection.size ? <i>none</i> : [...selection].join(', ')}
      </div>
      <br />
      <MapSelectionButton
        selection="SITES"
        label="Select Sites"
        selectedItems={[...selection]}
        onSave={(newSelection) => { setSelection(newSelection); }}
      />
    </div>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <>

      <DocBlock>
        A button to launch the <Link href="#SiteMap">Site Map</Link> in a full screen
        selection-mode dialog.
      </DocBlock>
      <CodeBlock>
        {`
import MapSelectionButton from 'portal-core-components/lib/components/MapSelectionButton';
        `}
      </CodeBlock>

      <Typography variant="h4" component="h2" gutterBottom>Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} />
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        The Map Selection Button takes on many of the selection-related props of the Site Map (which
        are passed directly through to the embedded Site Map component). It is effectively a button
        with an attached dialog to launch the selected workflow. The examples below demonstrate
        different seed props.
      </DocBlock>
      <ExampleBlock>
        <MapSelectionButton
          selection="SITES"
          selectedItems={['RMNP', 'REDB']}
        />
        <MapSelectionButton
          selection="SITES"
          label="Select a site from D07"
          dialogTitle="Select a site from D07"
          selectionLimit={1}
          validItems={['GRSM', 'LECO', 'MLBS', 'ORNL', 'WALK']}
          siteMapProps={{ location: 'D07' }}
          tooltipProps={{
            title: 'Select exactly one site from Domain D07',
            'aria-label': 'Select exactly one site from Domain D07',
          }}
        />
        <MapSelectionButton
          selection="SITES"
          label="Select up to 4 sites"
          dialogTitle="Select up to 4 sites"
          selectionLimit={[1, 4]}
          icon={false}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
<MapSelectionButton
  selection="SITES"
  selectedItems={['RMNP', 'REDB']}
/>

<MapSelectionButton
  selection="SITES"
  label="Select a site from D07"
  dialogTitle="Select a site from D07"
  selectionLimit={1}
  validItems={['GRSM', 'LECO', 'MLBS', 'ORNL', 'WALK']}
  siteMapProps={{ location: 'D07' }}
  tooltipProps={{
    title: 'Select exactly one site from Domain D07',
    'aria-label': 'Select exactly one site from Domain D07',
  }}
/>

<MapSelectionButton
  selection="SITES"
  label="Select up to 4 sites"
  dialogTitle="Select up to 4 sites"
  selectionLimit={[1, 4]}
  icon={false}
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Saving Changes</Typography>

      <DocBlock>
        Unlike the Site Map component the Map Selection Button component supports an <tt>onSave</tt> method.
        This function will only fire when the Save button is clicked, which is only possible with a
        valid selection. This is the primary mechanism of exporting a selection.
      </DocBlock>
      <ExampleBlock>
        <MyComponent />
      </ExampleBlock>
      <CodeBlock>
        {`
import React, { useState } from 'react';
import MapSelectionButton from 'portal-core-components/lib/components/MapSelectionButton';

const MyComponent = () => {
  const [selection, setSelection] = useState(new Set());
  return (
    <div>
      <h3>{\`Selected Sites ($\{selection.size})\`}</h3>
      <div>
        {!selection.size ? <i>none</i> : [...selection].join(', ')}
      </div>
      <br />
      <MapSelectionButton
        selection="SITES"
        label="Select Sites"
        selectedItems={[...selection]}
        onSave={(newSelection) => { setSelection(newSelection); }}
      />
    </div>
  );
};

<MyComponent />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Selecting States and/or Domains</Typography>

      <DocBlock>
        Passing an alternate feature type of <tt>"STATES"</tt> or <tt>"DOMAINS"</tt> for
        the <tt>selection</tt> prop will put the map into selection mode for that type. As all other
        props pertaining to valid items, existing selection, and selection limits are all
        type-agnostic they should all work as expected.
      </DocBlock>
      <ExampleBlock>
        <MapSelectionButton
          selection="STATES"
          label="Select between 2 and 7 states"
          selectedItems={['CO', 'UT', 'AZ', 'NM']}
          selectionLimit={[2, 7]}
        />
        <MapSelectionButton
          selection="DOMAINS"
          label="Select a domain in the Eastern US"
          validItems={['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08']}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
<MapSelectionButton
  selection="STATES"
  label="Select between 2 and 7 states"
  selectedItems={['CO', 'UT', 'AZ', 'NM']}
  selectionLimit={[2, 7]}
/>

<MapSelectionButton
  selection="DOMAINS"
  label="Select a domain in the Eastern US"
  validItems={['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08']}
/>
        `}
      </CodeBlock>

    </>
  );
}
