import React, { useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
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
import ListItemIcon from '@material-ui/core/ListItemIcon';

import HomeIcon from '@material-ui/icons/Home';
import ComponentIcon from '@material-ui/icons/ViewModule';

import NeonPage from './lib_components/components/NeonPage/NeonPage';
import Theme from './lib_components/components/Theme/Theme';

import Home from './components/Home';
import BasicComponents from './components/BasicComponents';
import AopDataViewerStyleGuide from './lib_components/components/AopDataViewer/StyleGuide';
import DataProductAvailabilityStyleGuide from './lib_components/components/DataProductAvailability/StyleGuide';
import DataThemeIconStyleGuide from './lib_components/components/DataThemeIcon/StyleGuide';
import DownloadDataButtonStyleGuide from './lib_components/components/DownloadDataButton/StyleGuide';
import DownloadDataContextStyleGuide from './lib_components/components/DownloadDataContext/StyleGuide';
import ExternalHostInfoStyleGuide from './lib_components/components/ExternalHostInfo/StyleGuide';
import FullWidthVisualizationStyleGuide from './lib_components/components/FullWidthVisualization/StyleGuide';
import NeonContextStyleGuide from './lib_components/components/NeonContext/StyleGuide';
import NeonEnvironmentStyleGuide from './lib_components/components/NeonEnvironment/StyleGuide';
import NeonGraphQLStyleGuide from './lib_components/components/NeonGraphQL/StyleGuide';
import NeonPageStyleGuide from './lib_components/components/NeonPage/StyleGuide';
import SiteChipStyleGuide from './lib_components/components/SiteChip/StyleGuide';
import SiteMapStyleGuide from './lib_components/components/SiteMap/StyleGuide';
import StoryMapStyleGuide from './lib_components/components/StoryMap/StyleGuide';
import ThemeStyleGuide from './lib_components/components/Theme/StyleGuide';
import TimeSeriesViewerStyleGuide from './lib_components/components/TimeSeriesViewer/StyleGuide';

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
    name: 'External Host Info',
    hash: '#ExternalHostInfo',
    component: ExternalHostInfoStyleGuide,
  },
  {
    name: 'Full Width Visualization',
    hash: '#FullWidthVisualization',
    component: FullWidthVisualizationStyleGuide,
  },
  {
    name: 'Neon Context',
    hash: '#NeonContext',
    component: NeonContextStyleGuide,
  },
  {
    name: 'Neon GraphQL',
    hash: '#NeonGraphQL',
    component: NeonGraphQLStyleGuide,
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
    name: 'Site Map',
    hash: '#SiteMap',
    component: SiteMapStyleGuide,
  },
  {
    name: 'Story Map',
    hash: '#StoryMap',
    component: StoryMapStyleGuide,
  },
  {
    name: 'Theme',
    hash: '#Theme',
    component: ThemeStyleGuide,
  },
  {
    name: 'Time Series Viewer',
    hash: '#TimeSeriesViewer',
    component: TimeSeriesViewerStyleGuide,
  },
];

const getHashIndex = hash => (
  hash === '#BasicComponents'
    ? -2
    : components.findIndex(component => component.hash === hash)
);

const intialSelectedIndex = getHashIndex(document.location.hash);

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(intialSelectedIndex);
  const [collapsibleNavExpanded, setCollapsibleNavExpanded] = useState(false);

  useEffect(() => {
    if (selectedIndex === -1) {
      document.location.hash = '';
    } else if (selectedIndex === -2) {
      document.location.hash = 'BasicComponents';
    } else if (document.location.hash !== components[selectedIndex].hash) {
      document.location.hash = components[selectedIndex].hash;
    }
  });

  const handleToggleExpand = (event, newExpanded) => {
    setCollapsibleNavExpanded(newExpanded);
  };

  const handleListItemClick = (event, index) => {
    if (collapsibleNavExpanded) { handleToggleExpand({}, false); }
    setSelectedIndex(index);
  };

  const onClickHash = (hash) => {
    if (collapsibleNavExpanded) { handleToggleExpand({}, false); }
    setSelectedIndex(getHashIndex(hash));
  };

  const CurrentComponent = selectedIndex < 0 ? null : components[selectedIndex].component;

  const renderCurrentComponent = () => {
    if (selectedIndex === -1) {
      return (
        <Paper style={{ padding: Theme.spacing(3) }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Welcome
          </Typography>
          <Home onClickHash={onClickHash} />
        </Paper>
      );
    }
    if (selectedIndex === -2) {
      return (
        <Paper style={{ padding: Theme.spacing(3) }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Basic Components
          </Typography>
          <BasicComponents onClickHash={onClickHash} />
        </Paper>
      );
    }
    return (
      <Paper style={{ padding: Theme.spacing(3) }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {components[selectedIndex].name}
        </Typography>
        <CurrentComponent onClickHash={onClickHash} />
      </Paper>
    );
  };

  const renderNavList = () => (
    <React.Fragment>
      <List component="nav" style={{ padding: '0' }}>
        <ListItem
          button
          key="home"
          selected={selectedIndex === -1}
          onClick={event => handleListItemClick(event, -1)}
        >
          <ListItemIcon style={{ minWidth: '36px' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </List>
      <List component="nav" style={{ padding: '0' }}>
        <ListItem
          button
          key="basicComponents"
          selected={selectedIndex === -2}
          onClick={event => handleListItemClick(event, -2)}
        >
          <ListItemIcon style={{ minWidth: '36px' }}>
            <ComponentIcon />
          </ListItemIcon>
          <ListItemText primary="Basic Components" />
        </ListItem>
      </List>
      <Divider />
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
    </React.Fragment>
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
      <ExpansionPanelDetails style={{ display: 'inherit', marginTop: Theme.spacing(-2) }}>
        {renderNavList()}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  return (
    <NeonPage title="Portal Core Components" useCoreAuth>
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
