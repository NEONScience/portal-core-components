import React from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Skeleton from '@mui/lab/Skeleton';
import Typography from '@mui/material/Typography';

import QuoteIcon from '@mui/icons-material/FormatQuote';

import BundleContentBuilder from '../../Bundles/BundleContentBuilder';
import DataProductBundleCard from '../../Bundles/DataProductBundleCard';
import ErrorCard from '../../Card/ErrorCard';
import WarningCard from '../../Card/WarningCard';
import Theme from '../../Theme/Theme';

import RouteService from '../../../service/RouteService';
import { NeonTheme } from '../../Theme/types';
import { Nullable } from '../../../types/core';
import {
  exists,
  existsNonEmpty,
  isStringNonEmpty,
} from '../../../util/typeUtil';

import DataProductCitationContext from './Context';
import DataProductCitationItemView from './ItemView';
import Service from './Service';
import {
  CitationRelease,
  ContextDataProduct,
  ContextStatus,
} from './State';
import {
  DataProductCitationViewState,
  DataProductCitationViewProps,
  DisplayType,
  CitationTextOnlyProps,
  DataProductCitationItem,
} from './ViewState';

const useStyles = makeStyles((theme: NeonTheme) => ({
  citationTextOnly: {
    color: theme.palette.grey[400],
  },
  calloutIcon: {
    color: theme.palette.grey[300],
    marginRight: theme.spacing(2),
  },
  citationUseFlexContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  citationUseText: {
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const DataProductCitationView: React.FC<DataProductCitationViewProps> = (
  props: DataProductCitationViewProps,
): React.JSX.Element => {
  const {
    showQuoteIcon,
    disableSkeleton,
    showTextOnly,
    textOnlyProps,
    showManyParents,
  }: DataProductCitationViewProps = props;
  const classes = useStyles(Theme);
  const state = DataProductCitationContext.useDataProductCitationContextState();

  let appliedTextOnly: CitationTextOnlyProps = {
    variant: 'caption',
    cssClass: classes.citationTextOnly,
  };
  if (exists(textOnlyProps)) {
    appliedTextOnly = textOnlyProps as CitationTextOnlyProps;
  }

  const viewState: DataProductCitationViewState = Service.useViewState(state, props);
  const {
    status,
    displayType,
    citationItems,
  }: DataProductCitationViewState = viewState;
  const bundleParentCodes: Record<string, Record<string, Nullable<string>>> = {};
  const hasManyParents = (citationItems.length > 1);
  citationItems.forEach((item: DataProductCitationItem): void => {
    if (!exists(item) || !isStringNonEmpty(item.bundleParentCode)) {
      return;
    }
    const key = `${item.bundleParentCode}:${item.releaseObject?.release}`;
    if (!exists(bundleParentCodes[key])) {
      bundleParentCodes[key] = {
        productCode: item.bundleParentCode as string,
        release: item.releaseObject?.release || null,
      };
    }
  });

  const renderSkeleton = (): React.JSX.Element => {
    if (disableSkeleton) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return (<></>);
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        {!showTextOnly ? (
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={180} />
          </Grid>
        ) : null}
      </Grid>
    );
  };
  const renderError = (): React.JSX.Element => {
    const errorTitle = 'Data Product Citation Generation Error';
    if (showTextOnly) {
      return (
        <Typography
          variant={appliedTextOnly.variant}
          component="h6"
          className={appliedTextOnly.cssClass}
        >
          {errorTitle}
        </Typography>
      );
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ErrorCard title={errorTitle} />
        </Grid>
      </Grid>
    );
  };

  const renderNotAvailable = (): React.JSX.Element => {
    const errorTitle = 'Data Product Citation Not Available';
    const errorMessage = 'A citation is not available for the specified data product and release.';
    if (showTextOnly) {
      return (
        <div>
          <Typography
            variant={appliedTextOnly.variant}
            component="h6"
            className={appliedTextOnly.cssClass}
          >
            {`${errorTitle}: ${errorMessage}`}
          </Typography>
        </div>
      );
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WarningCard title={errorTitle} message={errorMessage} />
        </Grid>
      </Grid>
    );
  };

  const renderCitationBlurb = (): Nullable<React.JSX.Element> => {
    if (showTextOnly) {
      return null;
    }
    const showNonConditionalBlurb: boolean = [
      DisplayType.RELEASE,
      DisplayType.PROVISIONAL,
    ].includes(displayType);
    const quoteIcon: Nullable<React.JSX.Element> = showQuoteIcon
      ? (<QuoteIcon fontSize="large" className={classes.calloutIcon} />)
      : null;
    let blurb = 'Please use the appropriate citation(s) from below in your publications. '
      + 'If using both provisional and release data please include both citations. ';
    if (showNonConditionalBlurb) {
      blurb = 'Please use this citation in your publications. ';
    }
    const dataPolicyLink: React.JSX.Element = (
      <Link href={RouteService.getDataPoliciesCitationPath()}>
        Data Policies &amp; Citation Guidelines
      </Link>
    );
    return (
      <div className={classes.citationUseFlexContainer}>
        {quoteIcon}
        <Typography variant="subtitle2" className={classes.citationUseText}>
          {blurb}
          {/* eslint-disable react/jsx-one-expression-per-line */}
          See {dataPolicyLink} for more info.
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </Typography>
      </div>
    );
  };

  const renderBundleParentsCard = (): Nullable<React.JSX.Element> => {
    const filteredCitationItems: DataProductCitationItem[] = citationItems
      .filter((item: DataProductCitationItem): boolean => (
        exists(item)
          && exists(item.citableBaseProduct)
          && exists(item.citableReleaseProduct)
          && isStringNonEmpty(item.bundleParentCode)
          && exists(item.releaseObject)
      ));
    if (!existsNonEmpty(filteredCitationItems) || (filteredCitationItems.length <= 1)) {
      return null;
    }
    const isReleaseDisplay = (displayType === DisplayType.RELEASE);
    const bundleNoteTerminalChar = !showManyParents
      ? '.'
      : ':';
    const titleContent: React.JSX.Element = BundleContentBuilder.buildDefaultSplitTitleContent(
      isReleaseDisplay,
      bundleNoteTerminalChar,
    );
    const detailContent = !showManyParents ? undefined : (
      <ul style={{ margin: Theme.spacing(1, 0) }}>
        {filteredCitationItems.map((item: DataProductCitationItem): React.JSX.Element => {
          const bundleParentName: string = isReleaseDisplay
            ? (item.citableReleaseProduct as ContextDataProduct).productName
            : (item.citableBaseProduct as ContextDataProduct).productName;
          let bundleParentHref: string = RouteService.getProductDetailPath(
            item.bundleParentCode as string,
          );
          if (isReleaseDisplay) {
            bundleParentHref = RouteService.getProductDetailPath(
              item.bundleParentCode as string,
              (item.releaseObject as CitationRelease).release as string,
            );
          }
          return (
            <li key={bundleParentHref}>
              <Link href={bundleParentHref} target="_blank">
                {`${bundleParentName} (${item.bundleParentCode})`}
              </Link>
            </li>
          );
        })}
      </ul>
    );
    let subTitleContent = !showManyParents ? undefined : (
      <>Use either or both citations as appropriate.</>
    );
    if (showManyParents && (filteredCitationItems.length > 2)) {
      subTitleContent = (
        <>Use citations as appropriate.</>
      );
    }
    return (
      <div className={classes.itemContainer}>
        <DataProductBundleCard
          isSplit={hasManyParents}
          titleContent={titleContent}
          detailContent={detailContent}
          subTitleContent={subTitleContent}
        />
      </div>
    );
  };

  const renderItems = (): React.JSX.Element[] => (
    citationItems.map((item: DataProductCitationItem, index: number): React.JSX.Element => (
      <div
        className={classes.itemContainer}
        // eslint-disable-next-line react/no-array-index-key
        key={`DataProductCitationItemKey-${item.doiUrl || index}`}
      >
        <DataProductCitationItemView
          {...props}
          citationItem={item}
          viewState={viewState}
          hasManyParents={hasManyParents}
        />
      </div>
    ))
  );

  const renderCitationDisplay = (): React.JSX.Element => {
    switch (displayType) {
      case DisplayType.CONDITIONAL:
      case DisplayType.PROVISIONAL:
      case DisplayType.RELEASE:
        break;
      case DisplayType.NOT_AVAILABLE:
        return renderNotAvailable();
      default:
        // Invalid state, return error state.
        return renderError();
    }
    return (
      <div>
        {renderCitationBlurb()}
        {renderBundleParentsCard()}
        {renderItems()}
      </div>
    );
  };

  switch (status) {
    case ContextStatus.INITIALIZING:
    case ContextStatus.FETCHING:
    case ContextStatus.HAS_FETCHES_TO_TRIGGER:
      return renderSkeleton();
    case ContextStatus.ERROR:
      return renderError();
    case ContextStatus.READY:
    default:
      break;
  }
  return renderCitationDisplay();
};

DataProductCitationView.defaultProps = {
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined,
  showManyParents: true,
};

export default DataProductCitationView;
