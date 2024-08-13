/* eslint-disable react/jsx-fragments */
import React, { useCallback } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@mui/styles';
import Alert from '@mui/lab/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CopyIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/SaveAlt';

import BundleContentBuilder from '../../Bundles/BundleContentBuilder';
import DataProductBundleCard from '../../Bundles/DataProductBundleCard';
import ReleaseNoticeCard from '../../Card/ReleaseNoticeCard';
import CitationService from '../../../service/CitationService';
import DataCiteService, {
  CitationDownloadType, CitationFormat,
} from '../../../service/DataCiteService';
import RouteService from '../../../service/RouteService';
import Theme from '../../Theme/Theme';
import { PROVISIONAL_RELEASE } from '../../../service/ReleaseService';
import { exists, isStringNonEmpty } from '../../../util/typeUtil';
import { Nullable, Undef, UnknownRecord } from '../../../types/core';
import { DataProductRelease } from '../../../types/neonApi';
import { IDataProductLike } from '../../../types/internal';
import { NeonTheme } from '../../Theme/types';

import ActionCreator from './Actions';
import DataProductCitationContext from './Context';
import Service from './Service';
import {
  CitationRelease,
  ContextDataProduct,
  FetchStatus,
} from './State';
import {
  DataProductCitationViewState,
  DataProductCitationItemViewProps,
  DisplayType,
  CitationTextOnlyProps,
  DataProductCitationItem,
} from './ViewState';

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
    color: theme.palette.grey[400],
  },
  citationTextWithQualifier: {
    marginTop: theme.spacing(1.5),
    fontFamily: 'monospace',
  },
  bundleTextOnlySpacer: {
    marginBottom: theme.spacing(2),
  },
  tombstoneBlurb: {
    fontSize: '0.8rem',
  },
  noticeCardDivider: {
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

const DataProductCitationItemView: React.FC<DataProductCitationItemViewProps> = (
  props: DataProductCitationItemViewProps,
): React.JSX.Element => {
  const {
    showTextOnly,
    textOnlyProps,
    citationItem,
    viewState,
    hasManyParents,
  }: DataProductCitationItemViewProps = props;
  const classes = useStyles(Theme);
  const dispatch = DataProductCitationContext.useDataProductCitationContextDispatch();

  let appliedTextOnly: CitationTextOnlyProps = {
    variant: 'caption',
    cssClass: classes.citationTextOnly,
  };
  if (exists(textOnlyProps)) {
    appliedTextOnly = textOnlyProps as CitationTextOnlyProps;
  }

  const {
    displayType,
    isTombstoned,
    releases,
    citationDownloadsFetchStatus,
  }: DataProductCitationViewState = viewState;
  const {
    releaseObject,
    doiUrl,
    citableBaseProduct,
    citableReleaseProduct,
    bundleParentCode,
  }: DataProductCitationItem = citationItem;

  const handleResetCitationDownloadsCb = useCallback(
    (provisionalCb: boolean, productCode: string): void => {
      Service.handleResetCitationDownloads(
        citationDownloadsFetchStatus,
        provisionalCb,
        productCode,
        dispatch,
      );
    },
    [dispatch, citationDownloadsFetchStatus],
  );
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
    let fullDoi: Nullable<string> = Service.getReleaseDoi(releases, releaseCb);
    if (isStringNonEmpty(fullDoi) && isStringNonEmpty(doiUrl) && (fullDoi !== doiUrl)) {
      // In the case of multiple citations for a single product, we want to resolve
      // to the specified DOI URL for this citation, but adhere to pulling
      // from the set of releases in all other cases and to confirm a valid
      // release is present.
      fullDoi = doiUrl;
    }
    handleResetCitationDownloadsCb(provisionalCb, citationProduct.productCode);
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
  }, [dispatch, releases, doiUrl, handleResetCitationDownloadsCb]);

  const renderTombstoneNotice = (): Nullable<React.JSX.Element> => {
    if (!isTombstoned) {
      return null;
    }
    const citationRelease: CitationRelease = (releaseObject as CitationRelease);
    let doiDisplay = ' ';
    if (citationRelease.productDoi.url) {
      const doiId: string = citationRelease.productDoi.url.split('/').slice(-2).join('/');
      doiDisplay = ` (DOI:${doiId}) `;
    }
    let latestAvailableReleaseBlurb: React.JSX.Element|null = null;
    if (citableBaseProduct?.releases && (citableBaseProduct?.releases.length > 0)) {
      const latestAvailableProductRelease: DataProductRelease = citableBaseProduct?.releases[0];
      if (latestAvailableProductRelease.release.localeCompare(citationRelease.release) !== 0) {
        const dataProductDetailLink: React.JSX.Element = (
          <Link href={RouteService.getProductDetailPath(citableBaseProduct.productCode)}>
            newer release
          </Link>
        );
        latestAvailableReleaseBlurb = (
          <>
            {/* eslint-disable react/jsx-one-expression-per-line, max-len */}
            has been replaced by a {dataProductDetailLink} and&nbsp;
            {/* eslint-enable react/jsx-one-expression-per-line, max-len */}
          </>
        );
      }
    }
    const contactUsLink: React.JSX.Element = (
      <Link href={RouteService.getContactUsPath()}>
        Contact Us
      </Link>
    );
    const tombstoneNote: React.JSX.Element = (
      <>
        {/* eslint-disable react/jsx-one-expression-per-line, max-len */}
        <b>{citationRelease.release}</b> of this data product
        {doiDisplay} {latestAvailableReleaseBlurb}is no longer available for download.
        If this specific release is needed for research purposes, please fill out
        the {contactUsLink} form.
        {/* eslint-enable react/jsx-one-expression-per-line, max-len */}
      </>
    );
    return (
      <ReleaseNoticeCard
        messageContent={(
          <>
            <Divider className={classes.noticeCardDivider} />
            <Typography variant="body2" color="textPrimary" className={classes.tombstoneBlurb}>
              {tombstoneNote}
            </Typography>
          </>
        )}
      />
    );
  };

  const renderBundleParentLink = (): Nullable<React.JSX.Element> => {
    if (!isStringNonEmpty(bundleParentCode) || hasManyParents) {
      return null;
    }
    const isReleaseDisplay = (displayType === DisplayType.RELEASE);
    const bundleParentName: string = isReleaseDisplay
      ? (citableReleaseProduct as ContextDataProduct).productName
      : (citableBaseProduct as ContextDataProduct).productName;
    let titleContent;
    const dataProductLike: IDataProductLike = {
      productCode: bundleParentCode as string,
      productName: bundleParentName,
    };
    const appliedRelease: Undef<string> = isReleaseDisplay
      ? (releaseObject as CitationRelease).release as string
      : undefined;
    if (isReleaseDisplay) {
      titleContent = BundleContentBuilder.buildDefaultTitleContent(
        dataProductLike,
        appliedRelease,
      );
    } else {
      titleContent = BundleContentBuilder.buildDefaultTitleContent(dataProductLike);
    }
    const subTitleContent = (
      <>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        The {isReleaseDisplay ? 'citation below refers' : 'citations below refer'} to
        that data product as this data product is not directly citable.
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </>
    );
    return (
      <div className={showTextOnly ? classes.bundleTextOnlySpacer : undefined}>
        <DataProductBundleCard
          isSplit={hasManyParents}
          titleContent={titleContent}
          subTitleContent={subTitleContent}
        />
      </div>
    );
  };

  const renderCitationCard = (
    release: string,
    conditional = false,
    provisional = false,
  ): React.JSX.Element => {
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
      citationProduct.productCode,
      FetchStatus.FETCHING,
    );
    let downloadStatus: Nullable<React.JSX.Element>;
    if (
      Service.hasCitationDownloadStatus(
        citationDownloadsFetchStatus,
        provisional,
        citationProduct.productCode,
        FetchStatus.ERROR,
      )
    ) {
      downloadStatus = (
        <Alert
          severity="error"
          onClose={() => handleResetCitationDownloadsCb(provisional, citationProduct.productCode)}
        >
          Citation download encountered a problem
        </Alert>
      );
    } else if (
      Service.hasCitationDownloadStatus(
        citationDownloadsFetchStatus,
        provisional,
        citationProduct.productCode,
        FetchStatus.SUCCESS,
      )
    ) {
      downloadStatus = (
        <Alert
          severity="success"
          onClose={() => handleResetCitationDownloadsCb(provisional, citationProduct.productCode)}
        >
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
          <CopyToClipboard text={citationText}>
            <Tooltip
              placement="bottom-start"
              title="Click to copy the above plain text citation to the clipboard"
            >
              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<CopyIcon fontSize="small" className={classes.cardButtonIcon} />}
                className={classes.cardButton}
              >
                Copy
              </Button>
            </Tooltip>
          </CopyToClipboard>
          {DataCiteService.getDataProductFormats().map((format: CitationFormat): React.JSX.Element => {
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

  let citationCard: React.JSX.Element;
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
    default:
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
  }
  return (
    <>
      {renderTombstoneNotice()}
      {renderBundleParentLink()}
      {citationCard}
    </>
  );
};

DataProductCitationItemView.defaultProps = {
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined,
};

export default DataProductCitationItemView;
