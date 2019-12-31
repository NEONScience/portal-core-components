// Primary lib exports (those documented with a StyleGuide)
import { AopDataViewer } from './components/AopDataViewer';
import { DataProductAvailability } from './components/DataProductAvailability';
import { DataThemeIcon } from './components/DataThemeIcon';
import { DownloadDataButton } from './components/DownloadDataButton';
import { DownloadDataContext } from './components/DownloadDataContext';
import { NeonEnvironment } from './components/NeonEnvironment';
import { NeonPage } from './components/NeonPage';
import { SiteChip } from './components/SiteChip';
import { Theme } from './components/Theme';

// Secondary lib exports (everything else, including legacy stuff that may
// not need to be exported anymore)
import { DownloadStepForm } from './components/DownloadStepForm';
import { ExternalHost } from './components/ExternalHost';
import { ExternalHostInfo } from './components/ExternalHostInfo';
import { ExternalHostProductSpecificLinks } from './components/ExternalHostProductSpecificLinks';
import { FullWidthVisualization } from './components/FullWidthVisualization';

import { NeonAuthLogin } from './components/NeonAuthLogin';
import { NeonAuthLogout } from './components/NeonAuthLogout';
import { NeonAuthRoot } from './components/NeonAuthRoot';

import { NeonFooter } from './components/NeonFooter';
import { NeonHeader } from './components/NeonHeader';
import { NeonMenu } from './components/NeonMenu';
import { NeonUtilityBar } from './components/NeonUtilityBar';

import { DialogBase } from './components/DialogBase';
import { PopupBase } from './components/PopupBase';
import { PopupLoading } from './components/PopupLoading';

// Static JSON exports
import sitesJSON from './static/sites/sites.json';
import statesJSON from './static/states/states.json';
import domainsJSON from './static/domains/domains.json';
import bundlesJSON from './static/bundles/bundles.json';

export {
  // Primaries
  AopDataViewer,
  DataProductAvailability,
  DataThemeIcon,
  DownloadDataButton,
  DownloadDataContext,
  FullWidthVisualization,
  NeonEnvironment,
  NeonPage,
  SiteChip,
  Theme,
  // Secondaries
  DownloadStepForm,
  ExternalHost,
  ExternalHostInfo,
  ExternalHostProductSpecificLinks,
  NeonAuthLogin,
  NeonAuthLogout,
  NeonAuthRoot,
  NeonFooter,
  NeonHeader,
  NeonMenu,
  NeonUtilityBar,
  PopupBase,
  DialogBase,
  PopupLoading,
  // Static JSON
  sitesJSON,
  statesJSON,
  domainsJSON,
  bundlesJSON,
};

export default NeonPage;
