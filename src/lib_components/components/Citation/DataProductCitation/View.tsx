/* eslint-disable react/jsx-fragments */
import React from 'react';
import dateFormat from 'dateformat';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Variant } from '@material-ui/core/styles/createTypography';

import CopyIcon from '@material-ui/icons/Assignment';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import QuoteIcon from '@material-ui/icons/FormatQuote';

import DataProductCitationContext from './Context';
import ErrorCard from '../../Card/ErrorCard';
import WarningCard from '../../Card/WarningCard';
import Theme from '../../Theme/Theme';

import { CONTEXT_STATUS } from './State';

import BundleService from '../../../service/BundleService';
import DataCiteService, {
  CitationDownloadType,
} from '../../../service/DataCiteService';
import RouteService from '../../../service/RouteService';
import { exists, isStringNonEmpty } from '../../../util/typeUtil';

import { NeonTheme } from '../../Theme/types';
import { Nullable } from '../../../types/core';

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

export interface CitationTextOnlyProps {
  variant?: Variant | undefined;
  cssClass?: string;
}

interface DataProductCitationViewProps {
  showQuoteIcon?: boolean;
  disableConditional?: boolean;
  disableSkeleton?: boolean;
  showTextOnly?: boolean;
  textOnlyProps?: CitationTextOnlyProps;
}

const DataProductCitationView: React.FC<DataProductCitationViewProps> = (
  props: DataProductCitationViewProps,
): JSX.Element => {
  const {
    showQuoteIcon,
    disableConditional,
    disableSkeleton,
    showTextOnly,
    textOnlyProps,
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

  const {
    release: currentReleaseTag,
    bundle,
    component: {
      status,
    },
    data: {
      product: baseProduct,
      productReleases,
      bundleParents,
      bundleParentReleases,
      releases,
    },
    neonContextState: {
      data: {
        bundles: bundlesCtx,
      },
    },
  } = state;

  switch (status) {
    case CONTEXT_STATUS.INITIALIZING:
    case CONTEXT_STATUS.FETCHING:
    case CONTEXT_STATUS.HAS_FETCHES_TO_TRIGGER:
      if (disableSkeleton) {
        return (<React.Fragment />);
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
    case CONTEXT_STATUS.ERROR:
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ErrorCard title="Data Product Citation Generation Error" />
          </Grid>
        </Grid>
      );
    case CONTEXT_STATUS.READY:
    default:
      break;
  }

  const latestRelease = (releases && releases.length)
    ? releases.find((r: any) => r.showCitation)
    : null;

  const hasBundleCode = (bundle.parentCodes.length > 0) && isStringNonEmpty(bundle.doiProductCode);
  const bundleParentCode = hasBundleCode
    ? bundle.doiProductCode
    : null;

  const citableBaseProduct = hasBundleCode
    ? bundleParents[bundleParentCode] || baseProduct
    : baseProduct;

  /**
   * Determines if the latest release has a bundle defined for this product
   * @returns True if the latest release has a bundle defined for this product
   */
  const hasLatestBundleRelease = () => {
    if (!bundleParentReleases || !bundleParentCode) {
      return false;
    }
    const latestReleaseTag = (latestRelease || {}).release;
    if (!latestReleaseTag) {
      return false;
    }
    return BundleService.isProductInBundle(
      bundlesCtx,
      latestReleaseTag,
      baseProduct.productCode,
    );
  };

  let citableReleaseProduct: Nullable<any> = null;
  const citationReleaseTag = currentReleaseTag || (latestRelease || {}).release || null;
  if (citationReleaseTag) {
    // If we're referencing latest release and provisional, and there isn't a bundle
    // defined for the latest release, use base product for release citation
    if (!currentReleaseTag && !hasLatestBundleRelease()) {
      citableReleaseProduct = baseProduct;
    } else {
      // When a bundled product code is available for the given release,
      // get the product for the parent code and release.
      // Otherwise, the citable product is the current product for the specified
      // release when available.
      citableReleaseProduct = bundleParentCode
        ? (bundleParentReleases[bundleParentCode] || {})[citationReleaseTag] || null
        : productReleases[citationReleaseTag] || null;
    }
  }

  let bundleParentLink: JSX.Element|null = null;
  if (bundleParentCode) {
    const bundleParentName = currentReleaseTag && citableReleaseProduct
      ? citableReleaseProduct.productName
      : citableBaseProduct.productName;
    let bundleParentHref = RouteService.getProductDetailPath(bundleParentCode);
    if (currentReleaseTag) {
      bundleParentHref = RouteService.getProductDetailPath(bundleParentCode, currentReleaseTag);
    }
    bundleParentLink = (
      <Link href={bundleParentHref}>
        {`${bundleParentName} (${bundleParentCode})`}
      </Link>
    );
  }

  const dataPolicyLink = (
    <Link href={RouteService.getDataPoliciesCitationPath()}>
      Data Policies &amp; Citation Guidelines
    </Link>
  );

  const getReleaseObject = (release: any) => (
    !release || release === 'provisional' ? null : (
      releases.find((r: any) => r.release === release)
    )
  );

  const currentReleaseObject = getReleaseObject(currentReleaseTag);
  const hideCitation = currentReleaseObject && !currentReleaseObject.showCitation;

  const getReleaseDoi = (release: any) => {
    const releaseObject = getReleaseObject(release);
    return releaseObject && releaseObject.productDoi && releaseObject.productDoi.url
      ? releaseObject.productDoi.url
      : null;
  };

  const getCitationText = (product: any, release: any) => {
    if (!product) { return null; }
    const releaseObject = getReleaseObject(release);
    const citationDoi = (
      releaseObject && releaseObject.productDoi && releaseObject.productDoi.url
        ? releaseObject.productDoi.url
        : null
    );
    const now = new Date();
    const today = dateFormat(now, 'mmmm d, yyyy');
    const neon = 'NEON (National Ecological Observatory Network)';
    const productName = releaseObject === null
      ? `${product.productName} (${product.productCode})`
      : `${product.productName}, ${release} (${product.productCode})`;
    const doiText = citationDoi ? `. ${citationDoi}` : '';
    const url = RouteService.getDataProductCitationDownloadUrl();
    const accessed = releaseObject === null
      ? `${url} (accessed ${today})`
      : `Dataset accessed from ${url} on ${today}`;
    return `${neon}. ${productName}${doiText}. ${accessed}`;
  };

  // Click handler for initiating a citation download
  const handleDownloadCitation = (release: any, format: any) => {
    const provisional = release === 'provisional';
    const citationProduct = provisional ? citableBaseProduct : citableReleaseProduct;
    // Release: fetch content from DataCite API to pipe into download
    const fullDoi = getReleaseDoi(release);
    DataCiteService.downloadCitation(
      format,
      CitationDownloadType.DATA_PRODUCT,
      citationProduct,
      fullDoi,
      release,
    );
  };

  const renderCitationBlurb = () => {
    if (showTextOnly) {
      return (<React.Fragment />);
    }
    let showCitationBlurb = true;
    if (isStringNonEmpty(currentReleaseTag)) {
      showCitationBlurb = getReleaseDoi(currentReleaseTag) !== null;
    }
    if (!showCitationBlurb) {
      return (<React.Fragment />);
    }
    const quoteIcon: JSX.Element|null = showQuoteIcon
      ? (<QuoteIcon fontSize="large" className={classes.calloutIcon} />)
      : null;
    return (
      <div className={classes.citationUseFlexContainer}>
        {quoteIcon}
        <Typography variant="subtitle2" className={classes.citationUseText}>
          {(
            currentReleaseTag || latestRelease === null
              ? 'Please use this citation in your publications. '
              : 'Please use the appropriate citation(s) from below in your publications. If using both provisional and release data please include both citations. '
          )}
          {/* eslint-disable react/jsx-one-expression-per-line */}
          See {dataPolicyLink} for more info.
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </Typography>
      </div>
    );
  };

  const renderBundleParentLink = () => (
    !bundleParentLink ? null : (
      <Card
        className={showTextOnly
          ? classes.bundleParentBlurbCardTextOnly
          : classes.bundleParentBlurbCard}
      >
        <CardContent className={classes.bundleParentBlurbCardContent}>
          <Typography variant="body2" color="textSecondary" className={classes.bundleParentBlurb}>
            {/* eslint-disable react/jsx-one-expression-per-line, max-len */}
            <b>Note:</b> This product is bundled into {bundleParentLink}.
            The {currentReleaseTag || !latestRelease ? 'citation below refers' : 'citations below refer'} to
            that product as this sub-product is not directly citable.
            {/* eslint-enable react/jsx-one-expression-per-line, max-len */}
          </Typography>
        </CardContent>
      </Card>
    )
  );

  const renderCitationCard = (release: any, conditional = false) => {
    const provisional = (release === 'provisional') || hideCitation;
    const citationProduct = provisional ? citableBaseProduct : citableReleaseProduct;
    if (!citationProduct) { return null; }
    const downloadEnabled = provisional || getReleaseDoi(release) !== null;
    if (!downloadEnabled) {
      return (
        <WarningCard
          title="Data Product Citation Not Available"
          message="A citation is not available for the specified data product and release."
        />
      );
    }
    let conditionalText = null;
    let citationClassName = classes.citationText;
    if (conditional && !disableConditional) {
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
    const citationText = getCitationText(citationProduct, release);
    if (showTextOnly) {
      return (
        <>
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
        </>
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
            <CopyToClipboard text={citationText || ''}>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                className={classes.cardButton}
              >
                <CopyIcon fontSize="small" className={classes.cardButtonIcon} />
                Copy
              </Button>
            </CopyToClipboard>
          </Tooltip>
          {DataCiteService.getDataProductFormats().map((format) => (
            <Tooltip
              key={format.shortName}
              placement="bottom-start"
              title={(
                downloadEnabled
                  ? `Click to download the ${citationProduct.productCode}/${release} citation as a file in ${format.longName} format`
                  : 'Citation format downloads are not available because this product release has no DOI'
              )}
            >
              <span style={downloadEnabled ? {} : { cursor: 'no-drop' }}>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  className={classes.cardButton}
                  onClick={() => { handleDownloadCitation(release, format.shortName); }}
                  disabled={!downloadEnabled}
                >
                  <DownloadIcon fontSize="small" className={classes.cardButtonIcon} />
                  {`Download (${format.shortName})`}
                </Button>
              </span>
            </Tooltip>
          ))}
        </CardActions>
      </Card>
    );
  };

  return (
    <div>
      {renderCitationBlurb()}
      {renderBundleParentLink()}
      {currentReleaseTag ? (
        renderCitationCard(currentReleaseTag)
      ) : (
        <>
          {renderCitationCard('provisional', latestRelease !== null)}
          {latestRelease && !disableConditional
            ? renderCitationCard(latestRelease.release, true)
            : null}
        </>
      )}
    </div>
  );
};

DataProductCitationView.defaultProps = {
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined,
};

export default DataProductCitationView;
