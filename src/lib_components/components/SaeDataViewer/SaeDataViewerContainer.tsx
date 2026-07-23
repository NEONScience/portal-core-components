import React, { useCallback, useReducer } from 'react';

import moment from 'moment';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

import SummaryIcon from '@mui/icons-material/Toc';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import SitesIcon from '@mui/icons-material/Place';
import DateRangeIcon from '@mui/icons-material/DateRange';

import SaeDataViewerBokehPlotContainer from './SaeDataViewerBokehPlotContainer';
import SaeDataViewerLimitedCard from './SaeDataViewerLimitedCard';
import SaeDataViewerDatePicker from './SaeDataViewerDatePicker';
import SaeDataViewerProducts from './SaeDataViewerProducts';
import SaeDataViewerSites from './SaeDataViewerSites';
import SaeDataViewerContext, {
  SAE_BUNDLE_PRODUCT_CODE,
  SaeDataProductData,
  SaeDataProductVariable,
  SaeDataViewerContextState,
} from './SaeDataViewerContext';

import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { COLORS } from '../Theme/Theme';
import { isStringNonEmpty } from '../../util/typeUtil';
import { AnyAction } from '../../types/core';

const VERTICAL_TABS_WIDTH = 150;

const useStyles = makeStyles()((theme: NeonTheme) => ({
  tabsContainer: {
    display: 'flex',
    margin: theme.spacing(0, -0.5, -0.5, -0.5),
    borderBottom: `1.5px solid ${COLORS.GREY[200]}`,
    // Optionally set the vertical tabs to fill the allotted height
    // which requires setting a fixed height for it to fill
    // height: '320px',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  tabsVertical: {
    width: `${VERTICAL_TABS_WIDTH}px`,
    // Optionally set the vertical tabs to fill the allotted height
    // '& .MuiTabs-vertical': {
    //   height: '100%',
    //   flexDirection: 'column',
    // },
    // '& button.MuiTab-root': {
    //   flexGrow: 1,
    // },
  },
  tabsHorizontal: {
    flexShrink: 0,
  },
  tabPanels: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${VERTICAL_TABS_WIDTH}px)`,
      borderTop: `1.5px solid ${COLORS.GREY[200]}`,
    },
  },
  tabPanelContainer: {
    padding: theme.spacing(2.5),
    width: '100%',
  },
  graphContainer: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 0.5, 0.5, 0.5),
    borderWidth: '1.5px',
    borderTopWidth: '0px',
  },
  bokehPlotContainer: {
    margin: theme.spacing(0, 2, 2, 2),
  },
  limitedCardContainer: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  summaryDiv: {
    marginBottom: theme.spacing(1),
  },
}));

const useTabsStyles = makeStyles()((theme: NeonTheme) => ({
  scroller: {
    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.grey[100],
    },
  },
}));

const useTabStyles = makeStyles()((theme: NeonTheme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      marginLeft: '-1.5px',
      '&:is(button:first-of-type)': {
        marginBottom: '-0.5px',
        borderTopLeftRadius: '4px',
      },
      '&:not(button:first-of-type)': {
        marginTop: '-1.5px',
      },
    },
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(2.5),
      '&:not(button:first-of-type)': {
        marginLeft: '-1.5px',
      },
    },
    minWidth: 'inherit !important',
    textTransform: 'none',
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      margin: `${theme.spacing(0, 1, 0, 0)} !important`,
    },
  },
  labelIcon: {
    minHeight: theme.spacing(8),
    minWidth: theme.spacing(15),
    [theme.breakpoints.down('md')]: {
      minHeight: theme.spacing(6),
      minWidth: theme.spacing(17),
    },
  },
  selected: {
    [theme.breakpoints.down('md')]: {
      borderBottom: 'none',
    },
    [theme.breakpoints.up('md')]: {
      borderRight: 'none',
      marginLeft: '0px',
    },
  },
}));

const SaeDataViewerSummary: React.FC = (): React.JSX.Element => {
  const { classes, theme } = useStyles();
  const state: SaeDataViewerContextState = SaeDataViewerContext.useSaeDataViewerContextState();

  const {
    saeProduct,
    site,
    startDate,
    endDate,
  } = state;

  const skeletonProps = {
    height: 10,
    style: { marginTop: '4px', marginBottom: '12px' },
  };

  // Product
  const productSummaryTitle = (
    <div style={{ marginRight: theme.spacing(1) }}>
      <Typography variant="subtitle2">Data Product</Typography>
      <Typography variant="body2">
        {saeProduct.name}
      </Typography>
    </div>
  );
  let productsSummary: React.JSX.Element|React.JSX.Element[] = (
    <div>
      <Skeleton variant="rectangular" {...skeletonProps} width={200} />
      <Skeleton variant="rectangular" {...skeletonProps} width="100%" />
      <Skeleton variant="rectangular" {...skeletonProps} width="100%" />
      <Skeleton variant="rectangular" {...skeletonProps} width={125} />
    </div>
  );
  if (saeProduct.productData) {
    productsSummary = Object.keys(saeProduct.productData)
      .map((productCode: string): React.JSX.Element => {
        const productHref = RouteService.getProductDetailPath(productCode);
        const coercedData = saeProduct.productData as Record<string, SaeDataProductData>;
        const currentProductData: SaeDataProductData = coercedData[productCode];
        return (
          <div key={productCode} style={{ marginTop: theme.spacing(1) }}>
            <div style={{ marginRight: theme.spacing(1) }}>
              <Typography variant="body2">
                <Link href={productHref} target="_blank" style={{ fontWeight: 600 }}>
                  {`${currentProductData.productName} - (${currentProductData.productCode})`}
                </Link>
              </Typography>
            </div>
            <div>
              <Typography variant="body2">
                {currentProductData.productDescription}
              </Typography>
            </div>
          </div>
        );
      });
  }

  const releaseRevisionsLink = (
    <Link
      target="_blank"
      href={RouteService.getDataRevisionsReleasePath()}
    >
      official data release page
    </Link>
  );
  const releaseSummary = (
    <Typography variant="body2">
      Provisional Data may be used. For formally released data, please see
      {/* eslint-disable react/jsx-one-expression-per-line */ }
      {' '}{releaseRevisionsLink}.
    </Typography>
  );

  // Site
  const siteSummary = (
    <Typography variant="body2">
      {site}
    </Typography>
  );

  // Date Range
  let dateRangeSummary = <Skeleton {...skeletonProps} width={300} />;
  const dateRange = [startDate, endDate];
  if (dateRange[0] && dateRange[1]) {
    const pluralize = (val: number, unit: string) => (val === 1 ? `${val} ${unit}` : `${val} ${unit}s`);
    const startMoment = moment(dateRange[0]);
    const endMoment = moment(dateRange[1]);
    const days = Math.ceil(endMoment.diff(startMoment, 'days', true)) + 1;
    const years = Math.floor(days / 365);
    let diff = `${pluralize(days, 'day')}`;
    if (years > 0) {
      diff = (!(days % 365))
        ? `${pluralize(years, 'year')}`
        : `${pluralize(years, 'year')}, ${pluralize(days % 365, 'day')}`;
    }
    dateRangeSummary = (
      <Typography variant="body2">
        {`${startMoment.format('MMM D, YYYY')} - ${endMoment.format('MMM D, YYYY')} (${diff})`}
      </Typography>
    );
  }

  // Variables
  const renderVariableInfo = (): React.JSX.Element => {
    const label = saeProduct.variables.length <= 1
      ? 'Variable:'
      : 'Variables:';
    return (
      <>
        <Typography variant="subtitle2">
          {label}
        </Typography>
        <div>
          {saeProduct.variables.map((variable: SaeDataProductVariable): React.JSX.Element => ((
            <div key={variable.name}>
              <Typography variant="body2">
                {`${variable.name} (${variable.units})`}
              </Typography>
            </div>
          )))}
        </div>
      </>
    );
  };

  return (
    <div>
      <div className={classes.summaryDiv}>
        {productSummaryTitle}
        {productsSummary}
      </div>
      <div className={classes.summaryDiv}>
        <Typography variant="subtitle2">Release</Typography>
        {releaseSummary}
      </div>
      <div className={classes.summaryDiv}>
        <Typography variant="subtitle2">Site</Typography>
        {siteSummary}
      </div>
      <div className={classes.summaryDiv}>
        <Typography variant="subtitle2">Date Range</Typography>
        {dateRangeSummary}
      </div>
      <div className={classes.summaryDiv}>
        {renderVariableInfo()}
      </div>
    </div>
  );
};

const TAB_IDS = {
  SUMMARY: 'SUMMARY',
  PRODUCTS: 'PRODUCTS',
  SITES: 'SITES',
  DATE_RANGE: 'DATE_RANGE',
};
interface TabType {
  label: string;
  ariaLabel: string;
  Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
    muiName: string;
  };
  Component: React.FC;
}
type TabsType = Record<string, TabType>;
const TABS: TabsType = {
  [TAB_IDS.SUMMARY]: {
    label: 'SUMMARY',
    ariaLabel: 'Summary',
    Icon: SummaryIcon,
    Component: () => (<SaeDataViewerSummary />),
  },
  [TAB_IDS.PRODUCTS]: {
    label: 'DATA PRODUCT',
    ariaLabel: 'Data Product',
    Icon: DatasetIcon,
    Component: () => (<SaeDataViewerProducts />),
  },
  [TAB_IDS.SITES]: {
    label: 'SITE',
    ariaLabel: 'Site',
    Icon: SitesIcon,
    Component: () => (<SaeDataViewerSites />),
  },
  [TAB_IDS.DATE_RANGE]: {
    label: 'DATE RANGE',
    ariaLabel: 'Date Range',
    Icon: DateRangeIcon,
    Component: () => (
      <div>
        <Typography variant="h6" gutterBottom>Select by Date Range</Typography>
        <SaeDataViewerDatePicker />
      </div>
    ),
  },
};

interface SaeDataViewerContainerState {
  selectedTab: string;
}

const DEFAULT_STATE: SaeDataViewerContainerState = {
  selectedTab: 'SUMMARY',
};

const containerReducer = (state: SaeDataViewerContainerState, action: AnyAction) => {
  const newState = { ...state };
  switch (action.type) {
    case 'resetState':
      newState.selectedTab = action.selectedTab as string;
      return newState;
    case 'setSelectedTab':
      newState.selectedTab = action.selectedTab as string;
      return newState;
    default:
      return state;
  }
};

const SaeDataViewerContainer: React.FC = (): React.JSX.Element => {
  const { classes, theme } = useStyles();
  const { classes: tabClasses } = useTabStyles();
  const { classes: tabsClasses } = useTabsStyles();
  const belowMd = useMediaQuery(theme.breakpoints.down('md'));
  const state: SaeDataViewerContextState = SaeDataViewerContext.useSaeDataViewerContextState();
  const [containerState, containerDispatch] = useReducer(containerReducer, DEFAULT_STATE);
  const { selectedTab } = containerState;
  const { initProps: { productCode: propProductcode } }: SaeDataViewerContextState = state;

  const setSelectedTab = useCallback((cbSelectedTab: string) => {
    containerDispatch({ type: 'setSelectedTab', selectedTab: cbSelectedTab });
  }, [containerDispatch]);

  const activeTabKeys = [TAB_IDS.SUMMARY];
  if (isStringNonEmpty(propProductcode)) {
    const isBundledProduct = propProductcode?.localeCompare(SAE_BUNDLE_PRODUCT_CODE) === 0;
    if (isBundledProduct) {
      activeTabKeys.push(TAB_IDS.PRODUCTS);
    }
  }
  activeTabKeys.push(TAB_IDS.SITES);
  activeTabKeys.push(TAB_IDS.DATE_RANGE);

  const renderTabs = () => (
    <Tabs
      orientation={belowMd ? 'horizontal' : 'vertical'}
      scrollButtons={belowMd ? true : 'auto'}
      variant="scrollable"
      value={selectedTab}
      className={belowMd ? classes.tabsHorizontal : classes.tabsVertical}
      classes={tabsClasses}
      aria-label="SAE Data Viewer Controls"
      onChange={(event, newTab) => { setSelectedTab(newTab); }}
      slotProps={{
        indicator: {
          style: {
            display: 'none',
          },
        },
      }}
    >
      {activeTabKeys.map((tabId) => {
        const { label, ariaLabel, Icon: TabIcon } = TABS[tabId];
        return (
          <Tab
            key={tabId}
            value={tabId}
            label={label}
            aria-label={ariaLabel || label}
            icon={<TabIcon />}
            classes={tabClasses}
            id={`sae-data-viewer-tab-${tabId}`}
            aria-controls={`sae-data-viewer-tabpanel-${tabId}`}
          />
        );
      })}
    </Tabs>
  );

  const renderTabPanels = () => (
    <div className={classes.tabPanels}>
      {activeTabKeys.map((tabId) => {
        const { Component: TabComponent } = TABS[tabId];
        return (
          <div
            key={tabId}
            role="tabpanel"
            id={`sae-data-viewer-tabpanel-${tabId}`}
            aria-labelledby={`sae-data-viewer-tab-${tabId}`}
            style={{ display: selectedTab === tabId ? 'block' : 'none' }}
            className={classes.tabPanelContainer}
          >
            <TabComponent />
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div className={classes.limitedCardContainer}>
        <SaeDataViewerLimitedCard />
      </div>
      <Card className={classes.graphContainer}>
        <div className={classes.tabsContainer}>
          {renderTabs()}
          {renderTabPanels()}
        </div>
        <div className={classes.bokehPlotContainer}>
          <SaeDataViewerBokehPlotContainer />
        </div>
      </Card>
    </div>
  );
};

export default SaeDataViewerContainer;
