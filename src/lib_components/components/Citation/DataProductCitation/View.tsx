/* eslint-disable react/jsx-fragments */
import React, { useCallback } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CopyIcon from '@material-ui/icons/Assignment';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import QuoteIcon from '@material-ui/icons/FormatQuote';

import DataProductCitationContext from './Context';
import Service from './Service';
import ErrorCard from '../../Card/ErrorCard';
import WarningCard from '../../Card/WarningCard';
import Theme from '../../Theme/Theme';

import CitationService from '../../../service/CitationService';
import DataCiteService, {
  CitationDownloadType, CitationFormat,
} from '../../../service/DataCiteService';
import RouteService from '../../../service/RouteService';
import { PROVISIONAL_RELEASE } from '../../../service/ReleaseService';
import { exists, isStringNonEmpty } from '../../../util/typeUtil';

import ActionCreator from './Actions';
import { NeonTheme } from '../../Theme/types';
import {
  CitationRelease,
  ContextDataProduct,
  ContextStatus,
  FetchStatus,
} from './State';
import {
  DataProductCitationViewState,
  DataProductCitationViewProps,
  DisplayType,
  CitationTextOnlyProps,
} from './ViewState';
import { Nullable, UnknownRecord } from '../../../types/core';

const useStyles = makeStyles((theme: NeonTheme) => ({
  cardActions: {
    flexWrap: 'wrap',
    marginTop: theme.spacing(-1),
    '&> *': {
      marginLeft: '0px !important',
      marginTop: theme.spacing(1),
    },
    '&> :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  cardButton: {
    padding: '5px 10px',
    backgroundColor: '#fff',
    whiteSpace: 'nowrap',
  },
  cardButtonIcon: {
    marginRight: theme.spacing(1),
  },
  citationCard: {
    marginTop: theme.spacing(2),
  },
  citationText: {
    fontFamily: 'monospace',
  },
  citationTextOnly: {
    color: Theme.palette.grey[400],
  },
  citationTextWithQualifier: {
    marginTop: theme.spacing(1.5),
    fontFamily: 'monospace',
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
  bundleParentBlurbCard: {
    backgroundColor: (Theme as NeonTheme).colors.GOLD[50],
    marginTop: theme.spacing(1),
  },
  bundleParentBlurbCardTextOnly: {
    backgroundColor: (Theme as NeonTheme).colors.GOLD[50],
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  bundleParentBlurbCardContent: {
    padding: theme.spacing(2),
    paddingBottom: '20px !important',
  },
  bundleParentBlurb: {
    fontStyle: 'italic',
    fontSize: '0.8rem',
  },
}));

const DataProductCitationView: React.FC<DataProductCitationViewProps> = (
  props: DataProductCitationViewProps,
): JSX.Element => {
  const {
    showQuoteIcon,
    disableSkeleton,
    showTextOnly,
    textOnlyProps,
  }: DataProductCitationViewProps = props;
  const classes = useStyles(Theme);
  const state = DataProductCitationContext.useDataProductCitationContextState();
  const dispatch = DataProductCitationContext.useDataProductCitationContextDispatch();

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
    releases,
    releaseObject,
    citableBaseProduct,
    citableReleaseProduct,
    bundleParentCode,
    citationDownloadsFetchStatus,
  }: DataProductCitationViewState = viewState;

  const handleResetCitationDownloadsCb = useCallback((provisionalCb: boolean): void => {
    Service.handleResetCitationDownloads(citationDownloadsFetchStatus, provisionalCb, dispatch);
  }, [dispatch, citationDownloadsFetchStatus]);
  const handleCitationDownloadCb = useCallback((
    citationProduct: ContextDataProduct,
    releaseCb: string,
    formatCb: string,
    provisionalCb = true,
  ): void => {
    const coercedTarget: UnknownRecord = {
      ...citationProduct,
    };
    const key: string = Service.buildCitationDownloadKey(
      citationProduct,
      releaseCb,
      formatCb,
      provisionalCb,
    );
    const fullDoi: Nullable<string> = Service.getReleaseDoi(releases, releaseCb);
    handleResetCitationDownloadsCb(provisionalCb);
    if (dispatch) {
      dispatch(ActionCreator.fetchCitationDownloadStarted(key));
    }
    DataCiteService.downloadCitation(
      formatCb,
      CitationDownloadType.DATA_PRODUCT,
      coercedTarget,
      fullDoi as string,
      releaseCb,
      (data: string): void => {
        if (dispatch) {
          dispatch(ActionCreator.fetchCitationDownloadSucceeded(key));
        }
      },
      (error: unknown): void => {
        if (dispatch) {
          dispatch(ActionCreator.fetchCitationDownloadFailed(key, 'Citation download failed'));
        }
      },
    );
  }, [dispatch, releases, handleResetCitationDownloadsCb]);

  const renderSkeleton = (): JSX.Element => {
    if (disableSkeleton) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return (<></>);
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Skeleton variant="rect" width="100%" height={40} />
        </Grid>
        {!showTextOnly ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={180} />
          </Grid>
        ) : null}
      </Grid>
    );
  };
  const renderError = (): JSX.Element => {
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

  const renderNotAvailable = (): JSX.Element => {
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

  const renderCitationBlurb = (): Nullable<JSX.Element> => {
    if (showTextOnly) {
      return null;
    }
    const showNonConditionalBlurb: boolean = [
      DisplayType.RELEASE,
      DisplayType.PROVISIONAL,
    ].includes(displayType);
    const quoteIcon: Nullable<JSX.Element> = showQuoteIcon
      ? (<QuoteIcon fontSize="large" className={classes.calloutIcon} />)
      : null;
    let blurb = 'Please use the appropriate citation(s) from below in your publications. '
      + 'If using both provisional and release data please include both citations. ';
    if (showNonConditionalBlurb) {
      blurb = 'Please use this citation in your publications. ';
    }
    const dataPolicyLink: JSX.Element = (
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

  const renderBundleParentLink = (): Nullable<JSX.Element> => {
    if (!isStringNonEmpty(bundleParentCode)) {
      return null;
    }
    const isReleaseDisplay = (displayType === DisplayType.RELEASE);
    const bundleParentName: string = isReleaseDisplay
      ? (citableReleaseProduct as ContextDataProduct).productName
      : (citableBaseProduct as ContextDataProduct).productName;
    let bundleParentHref: string = RouteService.getProductDetailPath(bundleParentCode as string);
    if (isReleaseDisplay) {
      bundleParentHref = RouteService.getProductDetailPath(
        bundleParentCode as string,
        (releaseObject as CitationRelease).release as string,
      );
    }
    const bundleParentLink: JSX.Element = (
      <Link href={bundleParentHref}>
        {`${bundleParentName} (${bundleParentCode})`}
      </Link>
    );
    return (
      <Card
        className={showTextOnly
          ? classes.bundleParentBlurbCardTextOnly
          : classes.bundleParentBlurbCard}
      >
        <CardContent className={classes.bundleParentBlurbCardContent}>
          <Typography variant="body2" color="textSecondary" className={classes.bundleParentBlurb}>
            {/* eslint-disable react/jsx-one-expression-per-line, max-len */}
            <b>Note:</b> This product is bundled into {bundleParentLink}.
            The {isReleaseDisplay ? 'citation below refers' : 'citations below refer'} to
            that product as this sub-product is not directly citable.
            {/* eslint-enable react/jsx-one-expression-per-line, max-len */}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderCitationCard = (
    release: string,
    conditional = false,
    provisional = false,
  ): JSX.Element => {
    const citationProduct: ContextDataProduct = provisional
      ? citableBaseProduct as ContextDataProduct
      : citableReleaseProduct as ContextDataProduct;
    let conditionalText = null;
    let citationClassName = classes.citationText;
    if (conditional) {
      const provReleaseText = provisional
        ? 'If Provisional data are used, include:'
        : 'If Released data are used, include:';
      if (showTextOnly) {
        conditionalText = (
          <Typography
            variant={appliedTextOnly.variant}
            component="h6"
            className={appliedTextOnly.cssClass}
          >
            {provReleaseText}
          </Typography>
        );
      } else {
        conditionalText = (
          <Typography variant="body1" component="h6">
            {provReleaseText}
          </Typography>
        );
      }
      citationClassName = classes.citationTextWithQualifier;
    }
    let citationReleaseObject: Nullable<CitationRelease> = null;
    if (!provisional) {
      citationReleaseObject = (releaseObject as CitationRelease);
    }
    const citationText: string = CitationService.buildDataProductCitationText(
      citationProduct,
      citationReleaseObject,
    );
    if (showTextOnly) {
      return (
        <div>
          {conditionalText}
          <Typography
            variant={appliedTextOnly.variant}
            component="h6"
            className={appliedTextOnly.cssClass}
          >
            {citationText}
          </Typography>
        </div>
      );
    }
    const isSectionDownloading: boolean = Service.hasCitationDownloadStatus(
      citationDownloadsFetchStatus,
      provisional,
      FetchStatus.FETCHING,
    );
    let downloadStatus: Nullable<JSX.Element>;
    if (
      Service.hasCitationDownloadStatus(
        citationDownloadsFetchStatus,
        provisional,
        FetchStatus.ERROR,
      )
    ) {
      downloadStatus = (
        <Alert severity="error" onClose={() => handleResetCitationDownloadsCb(provisional)}>
          Citation download encountered a problem
        </Alert>
      );
    } else if (
      Service.hasCitationDownloadStatus(
        citationDownloadsFetchStatus,
        provisional,
        FetchStatus.SUCCESS,
      )
    ) {
      downloadStatus = (
        <Alert severity="success" onClose={() => handleResetCitationDownloadsCb(provisional)}>
          Citation downloaded
        </Alert>
      );
    }
    return (
      <Card className={classes.citationCard}>
        <CardContent>
          {conditionalText}
          <Typography variant="body1" className={citationClassName}>
            {citationText}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Tooltip
            placement="bottom-start"
            title="Click to copy the above plain text citation to the clipboard"
          >
            <CopyToClipboard text={citationText}>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<CopyIcon fontSize="small" className={classes.cardButtonIcon} />}
                className={classes.cardButton}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Tooltip>
          {DataCiteService.getDataProductFormats().map((format: CitationFormat): JSX.Element => {
            const key: string = Service.buildCitationDownloadKey(
              citationProduct,
              release,
              format.shortName,
              provisional,
            );
            const isDownloading: boolean = !exists(citationDownloadsFetchStatus[key])
              ? false
              : citationDownloadsFetchStatus[key].status === FetchStatus.FETCHING;
            return (
              <Tooltip
                key={format.shortName}
                placement="bottom-start"
                title={(
                  `Click to download the ${citationProduct.productCode}/${release} citation as a `
                    + `file in ${format.longName} format`
                )}
              >
                <span>
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    className={classes.cardButton}
                    disabled={isDownloading || isSectionDownloading}
                    startIcon={isDownloading
                      ? <CircularProgress size={18} className={classes.cardButtonIcon} />
                      : <DownloadIcon fontSize="small" className={classes.cardButtonIcon} />}
                    onClick={() => {
                      handleCitationDownloadCb(
                        citationProduct,
                        release,
                        format.shortName,
                        provisional,
                      );
                    }}
                  >
                    {`Download (${format.shortName})`}
                  </Button>
                </span>
              </Tooltip>
            );
          })}
        </CardActions>
        {downloadStatus}
      </Card>
    );
  };

  const renderCitationDisplay = (): JSX.Element => {
    let citationCard: JSX.Element;
    switch (displayType) {
      case DisplayType.CONDITIONAL:
        citationCard = (
          <React.Fragment>
            {renderCitationCard(PROVISIONAL_RELEASE, true, true)}
            {renderCitationCard((releaseObject as CitationRelease).release, true, false)}
          </React.Fragment>
        );
        break;
      case DisplayType.PROVISIONAL:
        citationCard = (
          <React.Fragment>
            {renderCitationCard(PROVISIONAL_RELEASE, false, true)}
          </React.Fragment>
        );
        break;
      case DisplayType.RELEASE:
        citationCard = (
          <React.Fragment>
            {renderCitationCard((releaseObject as CitationRelease).release, false, false)}
          </React.Fragment>
        );
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
        {renderBundleParentLink()}
        {citationCard}
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
};

export default DataProductCitationView;
