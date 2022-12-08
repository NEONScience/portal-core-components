import React, { useState } from 'react';

import lzw from 'node-lzw';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import MobileStepper from '@material-ui/core/MobileStepper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CircleStarIcon from '@material-ui/icons/Stars';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import WarningIcon from '@material-ui/icons/Warning';

import DialogBase from '../DialogBase/DialogBase';
import DownloadStepForm from '../DownloadStepForm/DownloadStepForm';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import DataThemeIcon from '../DataThemeIcon/DataThemeIcon';
import ExternalHost from '../ExternalHost/ExternalHost';
import ExternalHostInfo from '../ExternalHostInfo/ExternalHostInfo';
import NeonContext from '../NeonContext/NeonContext';
import Theme, { COLORS } from '../Theme/Theme';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';

import RouteService from '../../service/RouteService';
import {
  buildManifestConfig,
  buildManifestRequestBody,
  downloadManifest,
  downloadAopManifest,
  formatBytes,
  DOWNLOAD_SIZE_WARN,
} from '../../util/manifestUtil';

const useStyles = (belowSm, belowSmMd) => makeStyles((theme) => ({
  stepChip: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    fontWeight: 600,
  },
  productCodeChip: {
    color: theme.palette.grey[400],
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    cursor: 'help',
    height: '26px',
    margin: theme.spacing(-0.5, 1.5, 0, 0),
  },
  releaseChip: {
    color: Theme.colors.BROWN[500],
    border: `1px solid ${Theme.colors.BROWN[500]}`,
    backgroundColor: Theme.colors.BROWN[100],
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'help',
    '& svg': {
      margin: theme.spacing(0, -0.5, 0, 0.75),
    },
    height: belowSmMd && !belowSm ? 'auto' : undefined,
    padding: belowSmMd && !belowSm ? '5px 0px' : undefined,
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  endFlex: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  completedInactive: {
    '& svg': {
      opacity: 0.5,
    },
  },
  summaryIcon: {
    fontSize: '30px',
    color: theme.palette.primary.main,
  },
  summaryIconTitleMarker: {
    fontSize: '38px',
    color: theme.palette.primary.main,
    margin: '-2px 6px -2px -4px',
  },
  callout: {
    backgroundColor: COLORS.GOLD[300],
    margin: Theme.spacing(0.5, 0, 2, 0),
  },
  calloutIcon: {
    color: COLORS.GOLD[800],
    marginRight: theme.spacing(2),
  },
  gtmCaptureButton: {
    '& span': {
      pointerEvents: 'none',
    },
  },
}));

const useDialogBaseStyles = (belowSm) => makeStyles((theme) => ({
  contentPaper: {
    margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
    padding: theme.spacing(3),
    minWidth: '340px',
  },
}));

export default function DownloadDataDialog() {
  const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
  const belowSmMd = useMediaQuery('(max-width: 750px)');
  const classes = useStyles(belowSm, belowSmMd)(Theme);
  const dialogBaseClasses = useDialogBaseStyles(belowSm)(Theme);

  /**
     State (from DownloadDataContext)
  */
  const [
    {
      dialogOpen,
      productData,
      manifest,
      requiredSteps,
      allStepsComplete,
      fromManifest,
      fromAOPManifest,
      documentation,
      s3Files,
      release,
      latestRelease,
      sites,
      dateRange,
      packageType,
    },
    dispatch,
  ] = DownloadDataContext.useDownloadDataState();

  /**
     State (from NeonContext)
  */
  const [{
    auth: {
      isAuthenticated,
    },
  }] = NeonContext.useNeonContextState();

  /**
     State (local)
  */
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [downloadExecuted, setDownloadExecuted] = useState(false);

  /**
     Size estimate getter (in bytes)
  */
  const getSizeEstimateBytes = () => (
    (fromAOPManifest ? s3Files.totalSize : manifest.sizeEstimate) || 0
  );

  /**
     External Host
  */
  const externalHost = ExternalHost.getByProductCode(productData.productCode);
  const renderExternalHostInfo = () => {
    if (!externalHost || externalHost.hostType === ExternalHost.HOST_TYPES.EXCLUSIVE_DATA) {
      return null;
    }
    const availableSiteCodes = (productData.siteCodes || []).map((site) => site.siteCode);
    return (
      <ExternalHostInfo
        data-selenium="download-data-dialog.external-host-info"
        productCode={productData.productCode}
        siteCodes={availableSiteCodes}
        expandable
      />
    );
  };

  /**
     Step content
  */
  const { ALL_STEPS } = DownloadDataContext;
  const getStep = (idx = 0) => {
    if (!requiredSteps[idx]) { return {}; }
    return ALL_STEPS[requiredSteps[idx].key];
  };

  /**
     Handlers
  */
  const changeToStep = (stepIdx) => {
    setActiveStepIndex(stepIdx);
  };

  const changeToNextUncompletedStep = () => {
    const lastStepIndex = requiredSteps.length - 1;
    const summaryIndex = requiredSteps[lastStepIndex].key === 'summary'
      ? lastStepIndex
      : null;
    const allIncompleteSteps = Object.keys(requiredSteps)
      .map((idx) => parseInt(idx, 10))
      .filter((idx) => (
        idx !== activeStepIndex && idx !== summaryIndex && !requiredSteps[idx].isComplete
      ));
    if (activeStepIndex === lastStepIndex) { return null; }
    if (!allIncompleteSteps.length) {
      return summaryIndex ? changeToStep(summaryIndex) : null;
    }
    // There is at least one incomplete step.
    // If any steps are after the current active step (OTHER than summary), go there first.
    // If not then take the first incomplete step in the list.
    const laterIncompleteSteps = allIncompleteSteps
      .filter((idx) => idx !== summaryIndex && idx > activeStepIndex);
    return changeToStep(
      laterIncompleteSteps.length
        ? laterIncompleteSteps[0]
        : allIncompleteSteps[0],
    );
  };

  const handleCancel = () => {
    dispatch({ type: 'setDialogOpen', open: false });
  };

  const handleDownload = () => {
    setDownloadExecuted(true);
    const manifestSelection = {
      productData,
      release,
      sites,
      dateRange,
      documentation,
      packageType,
    };
    if (fromAOPManifest) {
      const config = buildManifestConfig(manifestSelection, null, true);
      return downloadAopManifest(config, s3Files, documentation.value);
    }
    if (manifest.status !== 'fetched' || !manifest.body || !manifest.body.data) { return null; }
    const config = buildManifestConfig(manifestSelection);
    const manifestBody = buildManifestRequestBody(config);
    return downloadManifest(manifestBody);
  };

  /**
     Render functions
  */
  const renderSizeEstimate = () => {
    const alignRight = { style: { textAlign: 'right' } };
    const subtitleStyle = {
      style: { lineHeight: '1rem', fontSize: '0.9rem', marginBottom: '4px' },
    };
    if (
      (fromManifest && manifest.status === 'awaitingFetchCall')
      || (fromAOPManifest && !s3Files.isValid)
    ) { return ''; }
    if (fromManifest && manifest.status === 'fetching') {
      return belowSm ? (
        <div className={classes.startFlex}>
          <Typography variant="body2">Estimating size...</Typography>
          <CircularProgress size={16} style={{ marginLeft: Theme.spacing(1) }} />
        </div>
      ) : (
        <div {...alignRight}>
          <Typography variant="subtitle1" {...subtitleStyle}>Estimating size...</Typography>
          <LinearProgress style={{ marginTop: Theme.spacing(1.5) }} />
        </div>
      );
    }
    if (
      (fromManifest && manifest.status === 'fetched' && manifest.sizeEstimate > 0)
      || (fromAOPManifest && s3Files.isValid)
    ) {
      const bytes = getSizeEstimateBytes();
      const uncompressed = fromAOPManifest ? ' (uncompressed)' : '';
      let estimateColor = bytes > DOWNLOAD_SIZE_WARN ? COLORS.GOLD[300] : 'inherit';
      const estimateIcon = bytes > DOWNLOAD_SIZE_WARN
        ? <WarningIcon style={{ marginRight: '8px', marginBottom: '-5px' }} />
        : null;
      /* eslint-disable react/jsx-one-expression-per-line */
      if (belowSm) {
        estimateColor = bytes > DOWNLOAD_SIZE_WARN ? COLORS.GOLD[500] : 'inherit';
        return (
          <Typography variant="body2">
            Estimated size{uncompressed}:&nbsp;
            <span style={{ fontWeight: 700, color: estimateColor }}>
              {estimateIcon}
              {formatBytes(bytes)}
            </span>
          </Typography>
        );
      }
      return (
        <div {...alignRight}>
          <Typography variant="subtitle1" {...subtitleStyle}>Estimated size{uncompressed}</Typography>
          <Typography variant="h5" style={{ color: estimateColor }}>
            {estimateIcon}
            {formatBytes(bytes)}
          </Typography>
        </div>
      );
      /* eslint-enable react/jsx-one-expression-per-line */
    }
    if ((fromManifest
        && (manifest.status === 'fetched' || manifest.status === 'no-data')
        && !(manifest.sizeEstimate > 0))
      || (fromAOPManifest && !(s3Files.totalSize > 0))
    ) {
      return (
        <Typography variant="body2" color="error">
          No data selected
        </Typography>
      );
    }
    if ((fromManifest && (manifest.status === 'error'))
      || (fromAOPManifest && !s3Files.isValid)
    ) {
      return (
        <Typography variant="body2" color="error">
          Unable to estimate size
        </Typography>
      );
    }
    return null;
  };

  const renderDownloadSizeWarning = () => {
    const bytes = getSizeEstimateBytes();
    if (bytes < DOWNLOAD_SIZE_WARN) { return null; }
    const formattedBytes = formatBytes(bytes);
    return (
      <Card className={classes.callout}>
        <CardContent className={classes.startFlex}>
          <WarningIcon fontSize="large" className={classes.calloutIcon} />
          <div>
            {/* eslint-disable react/jsx-one-expression-per-line */}
            <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
              Be sure you have at least {formattedBytes} of free disk space
              for this download!
            </Typography>
            <Typography variant="body1">
              If needed, you can reduce the download size by selecting fewer sites
              or a more restrictive date range.
            </Typography>
            {/* eslint-enable react/jsx-one-expression-per-line */}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFileType = () => {
    if (!fromManifest) { return null; }
    if ((manifest.status !== 'fetched')
      || ((manifest.status === 'fetched') && !(manifest.sizeEstimate > 0))
    ) {
      return (
        <Typography variant="body2" data-selenium="download-data-dialog.file-type">
          File Type:&nbsp;
          <b>Not available</b>
        </Typography>
      );
    }
    // TODO: Do other file types ever come back in the manifest response?
    const fileTypes = {
      'application/zip': 'ZIP (Compressed Text)',
    };
    const mimeType = manifest.body && manifest.body.data
      && manifest.body.data.mimeType ? manifest.body.data.mimeType : null;
    const fileTypeText = Object.keys(fileTypes).includes(mimeType)
      ? fileTypes[mimeType]
      : 'Unknown';
    return (
      <Typography variant="body2" data-selenium="download-data-dialog.file-type">
        File Type:&nbsp;
        <b>{fileTypeText}</b>
      </Typography>
    );
  };

  // Not the same as the Download Data Button component!
  // This entire dialog component is launched by the Download Data Button component.
  // The button rendered here looks the same but only appears inside the dialog,
  // and actually executes the download (provided the context is in a complete state).
  const renderDownloadButton = () => {
    let disabled = true;
    let buttonText = 'Download Data';
    const iconProps = {
      style: { marginLeft: Theme.spacing(1) },
    };
    let icon = <DownloadIcon {...iconProps} />;
    if (allStepsComplete) {
      if (fromAOPManifest) {
        disabled = false;
      }
      if (fromManifest) {
        switch (manifest.status) {
          case 'fetched':
            disabled = !(manifest.sizeEstimate > 0);
            break;
          case 'fetching':
            buttonText = 'Fetching File List...';
            icon = <CircularProgress size={16} color="inherit" {...iconProps} />;
            break;
          case 'error':
            buttonText = 'Download Unavailable';
            icon = <ErrorIcon {...iconProps} />;
            break;
          case 'awaitingFetchCall':
            break;
          case 'no-data':
          case 'invalid-config':
          default:
            buttonText = 'Download Unavailable';
            break;
        }
      }
    }
    let appliedDownloadButtonStyle = {
      whiteSpace: 'nowrap',
    };
    if (belowSmMd) {
      appliedDownloadButtonStyle = {
        ...appliedDownloadButtonStyle,
        width: '100%',
      };
    }
    return (
      <Button
        fullWidth={belowSm}
        data-selenium="download-data-dialog.download-button"
        data-gtm="download-data-dialog.download-button"
        size="large"
        color="primary"
        variant="contained"
        onClick={handleDownload}
        style={appliedDownloadButtonStyle}
        disabled={disabled}
        className={classes.gtmCaptureButton}
      >
        {buttonText}
        {icon}
      </Button>
    );
  };

  const renderAuthSuggestion = () => {
    if (isAuthenticated) { return null; }
    /* eslint-disable react/jsx-one-expression-per-line */
    const authStyles = { color: COLORS.GOLD[800], textAlign: 'right' };
    return (
      <div style={{ textAlign: 'right' }}>
        <Typography
          variant="body2"
          style={{
            ...authStyles,
            marginTop: Theme.spacing(1),
            fontWeight: 600,
          }}
        >
          Consider signing in or creating an account before proceeding.
        </Typography>
        <Typography
          variant="body2"
          style={{
            ...authStyles,
            fontStyle: 'italic',
            fontSize: '0.8rem',
          }}
        >
          <Link target="_new" href={RouteService.getUserAccountsPath()}>Learn</Link> the benefits of having an account.
        </Typography>
        <NeonSignInButton />
      </div>
    );
    /* eslint-enable react/jsx-one-expression-per-line */
  };

  const renderDownloadButtonStepNote = () => {
    const showDownloadButton = fromManifest || fromAOPManifest;
    if (!showDownloadButton) { return null; }
    const completableSteps = requiredSteps.filter((step) => step.key !== 'summary');
    const completedSteps = requiredSteps.filter((step) => (
      step.key !== 'summary' && step.isComplete
    ));
    const noDataAvailable = (fromManifest
        && (manifest.status === 'fetched' || manifest.status === 'no-data')
        && !(manifest.sizeEstimate > 0))
      || (fromAOPManifest && !(s3Files.totalSize > 0));
    if (!allStepsComplete) {
      return (
        <Typography variant="body2" style={{ marginTop: Theme.spacing(2), textAlign: 'right' }}>
          {`Complete all steps to enable download. ${completedSteps.length} of ${completableSteps.length} completed.`}
        </Typography>
      );
    }
    return (
      <Typography variant="body2" style={{ marginTop: Theme.spacing(2), textAlign: 'right' }}>
        {noDataAvailable ? 'No data selected.' : 'All steps completed.'}
      </Typography>
    );
  };

  const renderActions = () => {
    const divClass = belowSm ? classes.startFlex : classes.endFlex;
    const showDownloadButton = fromManifest || fromAOPManifest;
    if (belowSm) {
      return (
        <div>
          <Grid container spacing={2}>
            {showDownloadButton ? (
              <Grid item xs={12} sm={12} md={8}>
                {renderDownloadButton()}
              </Grid>
            ) : null}
            <Grid item xs={12} sm={12} md={showDownloadButton ? 4 : 12}>
              <Button
                fullWidth
                data-selenium="download-data-dialog.cancel-button"
                data-gtm="download-data-dialog.cancel-button"
                size="large"
                color="primary"
                variant="outlined"
                onClick={handleCancel}
                style={{ marginRight: Theme.spacing(showDownloadButton ? 1 : 0) }}
                className={classes.gtmCaptureButton}
              >
                {showDownloadButton ? 'Cancel' : 'Done'}
              </Button>
            </Grid>
          </Grid>
          <div className={divClass} style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            {renderDownloadButtonStepNote()}
            {renderAuthSuggestion()}
          </div>
        </div>
      );
    }
    let appliedActionsContainerStyles = {};
    let appliedDismissActionStyle = {
      marginRight: Theme.spacing(showDownloadButton ? 1 : 0),
    };
    if (showDownloadButton && belowSmMd) {
      appliedActionsContainerStyles = {
        flexDirection: 'column-reverse',
        width: '100%',
      };
      appliedDismissActionStyle = {
        marginRight: '0px',
        marginTop: '10px',
        width: '100%',
      };
    }
    return (
      <div className={divClass} style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className={divClass} style={appliedActionsContainerStyles}>
          <Button
            data-selenium="download-data-dialog.cancel-button"
            data-gtm="download-data-dialog.cancel-button"
            size="large"
            color="primary"
            variant="outlined"
            onClick={handleCancel}
            style={appliedDismissActionStyle}
            className={classes.gtmCaptureButton}
          >
            {showDownloadButton ? 'Cancel' : 'Done'}
          </Button>
          {showDownloadButton ? renderDownloadButton() : null}
        </div>
        {renderDownloadButtonStepNote()}
        {renderAuthSuggestion()}
      </div>
    );
  };

  const renderStepNavButtons = () => (
    <div style={{ whiteSpace: 'nowrap' }}>
      <Button
        data-selenium="download-data-dialog.step-nav-button.previous"
        variant="outlined"
        aria-label="Previous"
        disabled={activeStepIndex === 0}
        onClick={() => changeToStep(activeStepIndex - 1)}
        startIcon={<LeftIcon />}
      >
        {belowSm ? null : 'Back'}
      </Button>
      <Button
        data-selenium="download-data-dialog.step-nav-button.next"
        variant="outlined"
        aria-label="Next"
        disabled={activeStepIndex === requiredSteps.length - 1}
        style={{ marginLeft: Theme.spacing(1) }}
        onClick={() => changeToStep(activeStepIndex + 1)}
        endIcon={<RightIcon />}
      >
        {belowSm ? null : 'Next'}
      </Button>
    </div>
  );

  const renderStepper = () => {
    if (requiredSteps.length < 2) { return null; }
    if (belowSm) {
      const maxSteps = requiredSteps.length;
      const buttonProps = {
        size: 'small',
        color: 'primary',
        variant: 'contained',
      };
      const handleBack = () => changeToStep(activeStepIndex - 1);
      const handleNext = () => changeToStep(activeStepIndex + 1);
      return (
        <>
          <MobileStepper
            steps={maxSteps}
            variant="dots"
            activeStep={activeStepIndex}
            backButton={(
              <Button
                {...buttonProps}
                onClick={handleBack}
                disabled={activeStepIndex === 0}
              >
                {Theme.direction === 'rtl' ? <RightIcon /> : <LeftIcon />}
                Back
              </Button>
            )}
            nextButton={(
              <Button
                {...buttonProps}
                onClick={handleNext}
                disabled={activeStepIndex === maxSteps - 1}
              >
                Next
                {Theme.direction === 'rtl' ? <LeftIcon /> : <RightIcon />}
              </Button>
            )}
          />
          <Divider />
        </>
      );
    }
    return (
      <>
        <Stepper nonLinear data-selenium="download-data-dialog.stepper">
          {requiredSteps.map((step, index) => {
            const { label } = getStep(index);
            const buttonProps = {
              onClick: () => changeToStep(index),
            };
            if (step.isComplete === true && activeStepIndex !== index) {
              buttonProps.className = classes.completedInactive;
            }
            if (step.key === 'summary') {
              buttonProps.icon = (
                <CircleStarIcon
                  className={classes.summaryIcon}
                  style={{ opacity: activeStepIndex === index ? 1 : 0.5 }}
                />
              );
            }
            return (
              <Step
                key={label}
                active={activeStepIndex === index}
                completed={step.isComplete === true}
              >
                <StepButton {...buttonProps}>
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <Divider />
      </>
    );
  };

  const renderActiveStep = () => {
    if (!requiredSteps.length) { return null; }
    if (requiredSteps.length < 2) {
      return (
        <>
          {getStep(activeStepIndex).title ? (
            <div style={{ marginTop: Theme.spacing(3) }}>
              <Typography variant="h5" style={{ flexGrow: 1 }}>
                {getStep(activeStepIndex).title}
              </Typography>
            </div>
          ) : null}
          <div style={{ margin: Theme.spacing(3, belowSm ? 0 : 5) }}>
            <DownloadStepForm stepKey={requiredSteps[activeStepIndex].key} />
          </div>
        </>
      );
    }
    const titleMarker = requiredSteps[activeStepIndex].key === 'summary'
      ? <CircleStarIcon className={classes.summaryIconTitleMarker} />
      : <Chip color="primary" label={activeStepIndex + 1} className={classes.stepChip} />;
    return (
      <>
        <div className={classes.startFlex} style={{ marginTop: Theme.spacing(3) }}>
          {titleMarker}
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {getStep(activeStepIndex).title}
          </Typography>
          {belowSm ? null : renderStepNavButtons()}
        </div>
        <div style={{ margin: Theme.spacing(2, belowSm ? 0 : 5) }}>
          <DownloadStepForm
            stepKey={requiredSteps[activeStepIndex].key}
            changeToStep={changeToStep}
            changeToNextUncompletedStep={changeToNextUncompletedStep}
            renderDownloadButton={renderDownloadButton}
          />
        </div>
      </>
    );
  };

  // Google Tag Manager variables
  const getStepsCompleted = () => requiredSteps
    .filter((step) => step.isComplete === true)
    .map((step) => step.key);
  const getStepsNotCompleted = () => requiredSteps
    .filter((step) => step.isComplete === false)
    .map((step) => step.key);
  const getStepCompletionPercentage = () => {
    const completed = getStepsCompleted();
    const notCompleted = getStepsNotCompleted();
    const total = completed.length + notCompleted.length;
    return total ? (completed.length / total) * 100 : 0;
  };
  const getLZWCompressedConfig = () => {
    if (!allStepsComplete) { return ''; }
    // The subset of possible steps we actually want to persist in the GA event
    const eventSteps = ['sites', 'dateRange'];
    if (requiredSteps.some((step) => step.key === 'documentation')) {
      eventSteps.push('documentation');
    }
    if (requiredSteps.some((step) => step.key === 'packageType')) {
      eventSteps.push('packageType');
    }
    // Build the config for reporting
    const eventValues = {
      sites, dateRange, documentation, packageType,
    };
    const eventConfig = { productCode: productData.productCode };
    eventSteps.forEach((step) => { eventConfig[step] = eventValues[step].value; });
    // Stringify, compress, and return
    return lzw.encode(JSON.stringify(eventConfig));
  };
  const renderGtmTags = () => (
    <>
      {/* Google Tag Manager elements to track download progress */}
      <input type="hidden" data-gtm="download-data-dialog.product-code" value={productData.productCode} />
      <input type="hidden" data-gtm="download-data-dialog.size-estimate-bytes" value={getSizeEstimateBytes()} />
      <input type="hidden" data-gtm="download-data-dialog.steps-completed" value={getStepsCompleted().join(', ')} />
      <input type="hidden" data-gtm="download-data-dialog.steps-not-completed" value={getStepsNotCompleted().join(', ')} />
      <input type="hidden" data-gtm="download-data-dialog.step-completion-percentage" value={getStepCompletionPercentage()} />
      <input type="hidden" data-gtm="download-data-dialog.download-executed" value={downloadExecuted ? 1 : 0} />
      <input type="hidden" data-gtm="download-data-dialog.lzw-compressed-config" value={getLZWCompressedConfig()} />
      {/* end Google Tag Manager elements */}
    </>
  );

  const releaseTooltip = release.value === null
    ? `You are downloading only the latest released and provisional data (release: ${latestRelease || 'unknown'}).`
    : `You are downloading product data only from the ${release.value} release (no provisional data will be included).`;
  const releaseChipLabel = release.value === null
    ? 'Latest released and provisional data'
    : `Release: ${release.value}`;
  const releaseChipLabelStyle = belowSmMd && !belowSm ? { whiteSpace: 'break-spaces' } : {};
  return (
    <DialogBase
      data-selenium="download-data-dialog"
      open={dialogOpen}
      onClose={handleCancel}
      customClasses={dialogBaseClasses}
      title={fromManifest || fromAOPManifest ? 'Configure Data for Download' : 'Download Data from External Host'}
      closeButtonProps={{
        'data-gtm': 'download-data-dialog.cancel-button',
        className: classes.gtmCaptureButton,
      }}
      toolbarChildren={fromManifest || fromAOPManifest ? (
        <Hidden xsDown>
          <div data-selenium="download-data-dialog.size-estimate">
            {renderSizeEstimate()}
          </div>
        </Hidden>
      ) : null}
    >
      {renderGtmTags()}
      <Grid container spacing={2} alignItems="flex-start" style={{ marginBottom: Theme.spacing(2) }}>
        <Grid item xs={12} sm={6} md={6} lg={8} data-selenium="download-data-dialog.product-info">
          <Typography variant="h5" style={{ marginBottom: Theme.spacing(1.5) }}>
            {productData.productName}
          </Typography>
          <div className={classes.startFlex} style={{ marginBottom: Theme.spacing(1.5) }}>
            <Tooltip
              placement="right"
              title="The unique identifier for this data product independent of release"
            >
              <Chip label={productData.productCode} className={classes.productCodeChip} />
            </Tooltip>
            {(productData.themes || []).map((dataTheme) => (
              <div key={dataTheme} style={{ marginLeft: Theme.spacing(1.5) }}>
                <DataThemeIcon size={3} theme={dataTheme} />
              </div>
            ))}
          </div>
          <div>
            <Tooltip placement="bottom-start" title={releaseTooltip}>
              <Chip
                label={(
                  <div className={classes.startFlex} style={releaseChipLabelStyle}>
                    {releaseChipLabel}
                    <InfoIcon fontSize="small" />
                  </div>
                )}
                className={classes.releaseChip}
              />
            </Tooltip>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          {fromManifest || fromAOPManifest ? (
            <Hidden smUp>
              <div style={{ marginBottom: Theme.spacing(2) }}>
                {renderFileType()}
                <div data-selenium="download-data-dialog.size-estimate">
                  {renderSizeEstimate()}
                </div>
              </div>
            </Hidden>
          ) : null}
          {renderActions()}
          {fromManifest || fromAOPManifest ? (
            <Hidden xsDown>
              <div style={{ marginTop: Theme.spacing(1), textAlign: 'right' }}>
                {renderFileType()}
              </div>
            </Hidden>
          ) : null}
        </Grid>
      </Grid>
      {renderExternalHostInfo()}
      {renderDownloadSizeWarning()}
      {getSizeEstimateBytes() < DOWNLOAD_SIZE_WARN ? <Divider /> : null}
      {renderStepper()}
      {renderActiveStep()}
    </DialogBase>
  );
}
