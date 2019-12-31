import React, { useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import NeonPage from './lib_components/components/NeonPage/NeonPage';
import Theme from './lib_components/components/Theme/Theme';

import AopDataViewerStyleGuide from './lib_components/components/AopDataViewer/StyleGuide';
import DataProductAvailabilityStyleGuide from './lib_components/components/DataProductAvailability/StyleGuide';
import DataThemeIconStyleGuide from './lib_components/components/DataThemeIcon/StyleGuide';
import DownloadDataButtonStyleGuide from './lib_components/components/DownloadDataButton/StyleGuide';
import DownloadDataContextStyleGuide from './lib_components/components/DownloadDataContext/StyleGuide';
import FullWidthVisualizationStyleGuide from './lib_components/components/FullWidthVisualization/StyleGuide';
import NeonEnvironmentStyleGuide from './lib_components/components/NeonEnvironment/StyleGuide';
import NeonPageStyleGuide from './lib_components/components/NeonPage/StyleGuide';
import SiteChipStyleGuide from './lib_components/components/SiteChip/StyleGuide';
import ThemeStyleGuide from './lib_components/components/Theme/StyleGuide';

const components = [
  {
    name: 'AOP Data Viewer',
    hash: '#AopDataViewer',
    component: AopDataViewerStyleGuide,
  },
  {
    name: 'Data Product Availability',
    hash: '#DataProductAvailability',
    component: DataProductAvailabilityStyleGuide,
  },
  {
    name: 'Data Theme Icon',
    hash: '#DataThemeIcon',
    component: DataThemeIconStyleGuide,
  },
  {
    name: 'Download Data Button',
    hash: '#DownloadDataButton',
    component: DownloadDataButtonStyleGuide,
  },
  {
    name: 'Download Data Context',
    hash: '#DownloadDataContext',
    component: DownloadDataContextStyleGuide,
  },
  {
    name: 'Full Width Visualization',
    hash: '#FullWidthVisualization',
    component: FullWidthVisualizationStyleGuide,
  },
  {
    name: 'Neon Environment',
    hash: '#NeonEnvironment',
    component: NeonEnvironmentStyleGuide,
  },
  {
    name: 'Neon Page',
    hash: '#NeonPage',
    component: NeonPageStyleGuide,
  },
  {
    name: 'Site Chip',
    hash: '#SiteChip',
    component: SiteChipStyleGuide,
  },
  {
    name: 'Theme',
    hash: '#Theme',
    component: ThemeStyleGuide,
  },
];

const getHashIndex = hash => Math.max(
  components.findIndex(component => component.hash === hash),
  0,
);

const intialSelectedIndex = getHashIndex(document.location.hash);

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(intialSelectedIndex);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const onClickHash = (hash) => {
    setSelectedIndex(getHashIndex(hash));
  };

  useEffect(() => {
    if (document.location.hash !== components[selectedIndex].hash) {
      document.location.hash = components[selectedIndex].hash;
    }
  });

  const [collapsibleNavExpanded, setCollapsibleNavExpanded] = useState(false);
  const handleToggleExpand = (event, newExpanded) => {
    setCollapsibleNavExpanded(newExpanded);
  };

  const CurrentComponent = components[selectedIndex].component;

  const renderCurrentComponent = () => (
    <Paper style={{ padding: Theme.spacing(3) }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {components[selectedIndex].name}
      </Typography>
      <CurrentComponent onClickHash={onClickHash} />
    </Paper>
  );

  const renderNavList = () => (
    <List component="nav" style={{ padding: '0' }}>
      {components.map((component, index) => (
        <ListItem
          button
          key={component.name}
          selected={selectedIndex === index}
          onClick={event => handleListItemClick(event, index)}
        >
          <ListItemText primary={component.name} />
        </ListItem>
      ))}
    </List>
  );

  const renderStandardNav = () => (
    <Paper>
      {renderNavList()}
    </Paper>
  );

  const renderCollapsibleNav = () => (
    <ExpansionPanel
      expanded={collapsibleNavExpanded}
      onChange={handleToggleExpand}
      TransitionProps={{ timeout: 0 }}
      style={{ marginBottom: Theme.spacing(1) }}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5">Contents</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {renderNavList()}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  return (
    <NeonPage title="Portal Core Components">
      <Hidden smDown>
        <Grid container spacing={2}>
          <Grid item sm={9}>{renderCurrentComponent()}</Grid>
          <Grid item sm={3}>{renderStandardNav()}</Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        {renderCollapsibleNav()}
        {renderCurrentComponent()}
      </Hidden>
    </NeonPage>
  );
}
