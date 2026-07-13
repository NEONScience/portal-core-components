import React, { useState } from 'react';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import AopGEEDataViewer from '@/components/AopGEEDataViewer/AopGEEDataViewer';
import { makeStyles } from '@/components/Theme/makeStyles';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

const useStyles = makeStyles()((theme) => ({
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

const AopGeeViewerDemo = (): React.JSX.Element => {
  const { classes } = useStyles();
  const [selectedState, setSelectedState] = useState(false);
  const handleChange = (event: any) => {
    setSelectedState(event.target.value);
  };
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
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
        <Grid size={{ xs: 12 }}>
          <AopGEEDataViewer isFullWidth={selectedState} />
        </Grid>
      </Grid>
    </div>
  );
};

export default function StyleGuide() {
  const { classes } = useStyles();

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
        Any invalid paramaters to the component are ignored and no parameters can be passed to
        the Google earth Engine at this time so failures only happen
        when the Google earth Engine has issues or the link changes.
      </DocBlock>
    </>
  );
}
