/* eslint react/jsx-one-expression-per-line: 0 */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import AopGEEDataViewer from './AopGEEDataViewer';
import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  title: {
    fontWeight: 500,
    marginBottom: '8px',
  },
}));

const state = {
  states: [true, false, 'bogus'],
};

const AopGeeViewerDemo = (): JSX.Element => {
  const classes = useStyles(Theme);
  const [selectedState, setSelectedState] = useState(false);
  const handleChange = (event: any) => {
    setSelectedState(event.target.value);
  };
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            id="full-width-select-label"
            className={classes.title}
          >
            Is Full Width
          </Typography>
          <Select
            id="aop-viewer-width-select"
            aria-labelledby="full-width-select-label"
            variant="outlined"
            value={selectedState}
            onChange={handleChange}
            style={{ width: 'fit-content', marginBottom: '32px' }}
          >
            {state.states.map((val: any) => ((
              <MenuItem key={val} value={val}>
                {`${val}`}
              </MenuItem>
            )))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <AopGEEDataViewer isFullWidth={selectedState} />
        </Grid>
      </Grid>
    </div>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <>
      <DocBlock>
        Button to launch an interactive visualization of AOP data using Google Earth Engine
        in a new window or tab.
      </DocBlock>
      <CodeBlock>
        {`
import AopGEEDataViewer from 'portal-core-components/lib/components/AopGEEDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        The AOP GEE Data Viewer button checks for mobile or desktop device and openes
        the corresponding GEE Viewer in a new window or tab. It defaults to taking up
        the full width unless isFullWidth is set to false in which case it fits contents.
      </DocBlock>
      <ExampleBlock>
        <AopGEEDataViewer isFullWidth={false} />
      </ExampleBlock>
      <CodeBlock>
        {`
<AopGEEDataViewer isFullWidth={false} />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Demo</Typography>
      <ExampleBlock>
        <AopGeeViewerDemo />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Failure State</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        Any invalid paramaters to the component are ignored and no parameters can be passed to
        the Google earth Engine at this time so failures only happen
        when the Google earth Engine has issues or the link changes.
      </DocBlock>
    </>
  );
}
