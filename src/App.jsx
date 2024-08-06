import React, { Suspense } from 'react';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/lab/Skeleton';
import HomeIcon from '@mui/icons-material/Home';
import BasicComponentsIcon from '@mui/icons-material/ViewModule';

import NeonPage from './lib_components/components/NeonPage/NeonPage';
import NeonRouter from './lib_components/components/NeonRouter/NeonRouter';

import Home from './components/Home';
import NeonEnvironment from './lib_components/components/NeonEnvironment/NeonEnvironment';
import { isStringNonEmpty } from './lib_components/util/typeUtil';

const BasicComponents = React.lazy(
  () => import('./components/BasicComponents'),
);
const AopDataViewerStyleGuide = React.lazy(
  () => import('./lib_components/components/AopDataViewer/StyleGuide'),
);
const CardStyleGuide = React.lazy(
  () => import('./lib_components/components/Card/StyleGuide'),
);
const ChipStyleGuide = React.lazy(
  () => import('./lib_components/components/Chip/StyleGuide'),
);
const CitationsStyleGuide = React.lazy(
  () => import('./lib_components/components/Citation/StyleGuide'),
);
const DataProductAvailabilityStyleGuide = React.lazy(
  () => import('./lib_components/components/DataProductAvailability/StyleGuide'),
);
const DataThemeIconStyleGuide = React.lazy(
  () => import('./lib_components/components/DataThemeIcon/StyleGuide'),
);
const DocumentsStyleGuide = React.lazy(
  () => import('./lib_components/components/Documents/StyleGuide'),
);
const DownloadDataButtonStyleGuide = React.lazy(
  () => import('./lib_components/components/DownloadDataButton/StyleGuide'),
);
const DownloadDataContextStyleGuide = React.lazy(
  () => import('./lib_components/components/DownloadDataContext/StyleGuide'),
);
const ExternalHostInfoStyleGuide = React.lazy(
  () => import('./lib_components/components/ExternalHostInfo/StyleGuide'),
);
const FullWidthVisualizationStyleGuide = React.lazy(
  () => import('./lib_components/components/FullWidthVisualization/StyleGuide'),
);
const MapSelectionButtonStyleGuide = React.lazy(
  () => import('./lib_components/components/MapSelectionButton/StyleGuide'),
);
const NeonAuthStyleGuide = React.lazy(
  () => import('./lib_components/components/NeonAuth/StyleGuide'),
);
const NeonContextStyleGuide = React.lazy(
  () => import('./lib_components/components/NeonContext/StyleGuide'),
);
const NeonEnvironmentStyleGuide = React.lazy(
  () => import('./lib_components/components/NeonEnvironment/StyleGuide'),
);
const NeonGraphQLStyleGuide = React.lazy(
  () => import('./lib_components/components/NeonGraphQL/StyleGuide'),
);
const NeonPageStyleGuide = React.lazy(
  () => import('./lib_components/components/NeonPage/StyleGuide'),
);
const ReleaseFilterStyleGuide = React.lazy(
  () => import('./lib_components/components/ReleaseFilter/StyleGuide'),
);
const SiteChipStyleGuide = React.lazy(
  () => import('./lib_components/components/SiteChip/StyleGuide'),
);
const SiteMapStyleGuide = React.lazy(
  () => import('./lib_components/components/SiteMap/StyleGuide'),
);
const StoryMapStyleGuide = React.lazy(
  () => import('./lib_components/components/StoryMap/StyleGuide'),
);
const ThemeStyleGuide = React.lazy(
  () => import('./lib_components/components/Theme/StyleGuide'),
);
const TimeSeriesViewerStyleGuide = React.lazy(
  () => import('./lib_components/components/TimeSeriesViewer/StyleGuide'),
);

const SuspenseFallback = () => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Skeleton variant="text" width="50%" height={32} />
      <br />
      <Skeleton variant="rectangular" width="100%" height={100} />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="text" width="25%" height={48} />
      <br />
      <Skeleton variant="text" width="100%" height={24} />
      <Skeleton variant="text" width="100%" height={24} />
      <Skeleton variant="text" width="100%" height={24} />
      <br />
      <Skeleton variant="rectangular" width="100%" height={100} />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" width="100%" height={400} />
    </Grid>
  </Grid>
);

const sidebarLinks = [
  {
    name: 'Home',
    pageTitle: 'Core Components',
    icon: HomeIcon,
    component: Home,
  },
  {
    name: 'Basic Components',
    hash: '#BasicComponents',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <BasicComponents />
      </Suspense>
    ),
    icon: BasicComponentsIcon,
  },
  {
    name: 'AOP Data Viewer',
    hash: '#AopDataViewer',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <AopDataViewerStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Cards',
    hash: '#Cards',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <CardStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Chips',
    hash: '#Chips',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <ChipStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Citations',
    hash: '#Citations',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <CitationsStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Data Product Availability',
    hash: '#DataProductAvailability',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <DataProductAvailabilityStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Data Theme Icon',
    hash: '#DataThemeIcon',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <DataThemeIconStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Documents',
    hash: '#Documents',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <DocumentsStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Download Data Button',
    hash: '#DownloadDataButton',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <DownloadDataButtonStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Download Data Context',
    hash: '#DownloadDataContext',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <DownloadDataContextStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'External Host Info',
    hash: '#ExternalHostInfo',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <ExternalHostInfoStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Full Width Visualization',
    hash: '#FullWidthVisualization',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <FullWidthVisualizationStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Map Selection Button',
    hash: '#MapSelectionButton',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <MapSelectionButtonStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Neon Authentication',
    hash: '#NeonAuth',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <NeonAuthStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Neon Context',
    hash: '#NeonContext',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <NeonContextStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Neon GraphQL',
    hash: '#NeonGraphQL',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <NeonGraphQLStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Neon Environment',
    hash: '#NeonEnvironment',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <NeonEnvironmentStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Neon Page',
    hash: '#NeonPage',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <NeonPageStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Release Filter',
    hash: '#ReleaseFilter',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <ReleaseFilterStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Site Chip',
    hash: '#SiteChip',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <SiteChipStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Site Map',
    hash: '#SiteMap',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <SiteMapStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Story Map',
    hash: '#StoryMap',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <StoryMapStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Theme',
    hash: '#Theme',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <ThemeStyleGuide />
      </Suspense>
    ),
  },
  {
    name: 'Time Series Viewer',
    hash: '#TimeSeriesViewer',
    component: () => (
      <Suspense fallback={<SuspenseFallback />}>
        <TimeSeriesViewerStyleGuide />
      </Suspense>
    ),
  },
];

export default function App() {
  let sidebarSubtitle = null;
  const appVersion = NeonEnvironment.getReactAppVersion();
  if (isStringNonEmpty(appVersion)) {
    sidebarSubtitle = `version ${appVersion}`;
  }
  return (
    <NeonRouter>
      <NeonPage
        title="NEON Data Portal Core Components"
        outerPageContainerMaxWidth="3000px"
        sidebarSubtitle={sidebarSubtitle}
        sidebarLinks={sidebarLinks}
        sidebarLinksAsStandaloneChildren
        useCoreAuth
      >
        <Home />
      </NeonPage>
    </NeonRouter>
  );
}
