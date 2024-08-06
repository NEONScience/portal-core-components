import React, { useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Theme as MuiTheme } from '@mui/material';
import {
  makeStyles,
  createStyles,
} from '@mui/styles';

import DocumentListItem from './DocumentListItem';
import DocumentService from '../../service/DocumentService';
import DocumentViewer from './DocumentViewer';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { StylesHook } from '../../types/muiTypes';
import { NeonDocument } from '../../types/neonApi';
import { existsNonEmpty } from '../../util/typeUtil';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      margin: muiTheme.spacing(0, -0.5, -0.5, -0.5),
      flexDirection: 'column',
    },
    tabPanels: {
      width: '100%',
      backgroundColor: '#fff',
    },
    tabContentContainer: {
      width: '100%',
      padding: muiTheme.spacing(3, 3, 3, 3),
    },
  })) as StylesHook;

const useTabsStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    scroller: {
      backgroundColor: muiTheme.palette.grey[200],
    },
    scrollButtons: {
      '&.Mui-disabled': {
        opacity: 0.6,
      },
    },
  })) as StylesHook;

const useTabStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    root: {
      textTransform: 'none',
      opacity: 1,
      maxWidth: 464,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': {
        margin: `${muiTheme.spacing(0, 1, 0, 0)} !important`,
      },
    },
    selected: {
      borderBottom: 'none',
    },
  })) as StylesHook;

interface DocumentTabModel {
  index: number;
  document: NeonDocument;
}

export interface DocumentTabsProps {
  documents: NeonDocument[];
}

const DocumentTabs: React.FC<DocumentTabsProps> = (props: DocumentTabsProps): React.JSX.Element => {
  const classes = useStyles(Theme);
  const tabClasses = useTabStyles(Theme);
  const tabsClasses = useTabsStyles(Theme);
  const { documents }: DocumentTabsProps = props;

  const initialTabIdx = 0;
  const [
    selectedTab,
    setSelectedTab,
  ]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(initialTabIdx);

  if (!existsNonEmpty(documents)) {
    return (
      <div className={classes.container}>
        <WarningCard
          title="No Documents"
          message="No documents available to display"
        />
      </div>
    );
  }

  const docTabs: DocumentTabModel[] = documents.map(
    (doc: NeonDocument, index: number): DocumentTabModel => ({
      document: doc,
      index,
    }),
  );

  const renderTabs = (): React.JSX.Element => ((
    <Tabs
      orientation="horizontal"
      scrollButtons
      variant="scrollable"
      value={selectedTab}
      aria-label="Document Tabs"
      classes={tabsClasses}
      onChange={(event, newTab) => { setSelectedTab(newTab); }}
      TabIndicatorProps={{ style: { display: 'none' } }}
      allowScrollButtonsMobile
    >
      {docTabs.map((docTab: DocumentTabModel): React.JSX.Element => ((
        <Tab
          key={docTab.index}
          value={docTab.index}
          label={(
            <DocumentListItem
              id={docTab.index}
              document={docTab.document}
              makeDownloadableLink={false}
            />
          )}
          aria-label={docTab.document.name}
          classes={tabClasses}
          id={`document-tabs-tab-${docTab.index}`}
          aria-controls={`document-tabs-tabpanel-${docTab.index}`}
        />
      )))}
    </Tabs>
  ));

  const renderTabContent = (documentTab: DocumentTabModel): React.JSX.Element => {
    const { document, index }: DocumentTabModel = documentTab;
    const fullUrlPath = DocumentService.isQuickStartGuide(document)
      ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}`
      : `${NeonEnvironment.getFullApiPath('documents')}`;
    return (
      <div
        key={index}
        role="tabpanel"
        id={`document-tabs-tabpanel-${index}`}
        aria-labelledby={`document-tabs-tab-${index}`}
        style={{ display: selectedTab === index ? 'block' : 'none' }}
        className={classes.tabContentContainer}
      >
        {selectedTab !== index ? null : (
          <DocumentViewer document={document} width={600} fullUrlPath={fullUrlPath} />
        )}
      </div>
    );
  };

  const renderTabPanels = (): React.JSX.Element => (
    <div className={classes.tabPanels}>
      {docTabs.map((docTab: DocumentTabModel): React.JSX.Element => renderTabContent(docTab))}
    </div>
  );

  return (
    <div className={classes.container}>
      {renderTabs()}
      {renderTabPanels()}
    </div>
  );
};

const WrappedDocumentTabs = (Theme as any).getWrappedComponent(DocumentTabs);

export default WrappedDocumentTabs;
