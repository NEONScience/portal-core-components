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
import IconButton from '@material-ui/core/IconButton';
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
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme, { COLORS } from '../Theme/Theme';

import {
  buildManifestConfig,
  buildManifestRequestBody,
  downloadManifest,
  downloadAopManifest,
  formatBytes,
  DOWNLOAD_SIZE_WARN,
} from '../../util/manifestUtil';

const useStyles = makeStyles(theme => ({
  stepChip: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    fontWeight: 600,
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
  releaseTitle: {
    color: COLORS.BROWN[500],
    fontSize: '1.1rem',
  },
  tooltip: {
    marginLeft: theme.spacing(0.5),
  },
  iconButton: {
    marginTop: theme.spacing(-0.25),
  },
}));

export default function DownloadDataDialog() {
  const classes = useStyles(Theme);
  const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));

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
    const availableSiteCodes = (productData.siteCodes || []).map(site => site.siteCode);
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
      .map(idx => parseInt(idx, 10))
      .filter(idx => (
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
      .filter(idx => idx !== summaryIndex && idx > activeStepIndex);
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
      const config = buildManifestConfig(manifestSelection, '', true);
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
    return (
      <Typography variant="body2" color="error">
        Unable to estimate size
      </Typography>
    );
  };

  const renderDownloadSizeWarning = () => {
    const bytes = getSizeEstimateBytes();
    if (bytes < DOWNLOAD_SIZE_WARN) { return null; }
    const formattedBytes = formatBytes(bytes);
    const aopHardDriveLink = (
      <Link
        target="_blank"
        href="https://www.neonscience.org/data-collection/airborne-remote-sensing/aop-data-hard-drive-request"
      >
        AOP Data to Hard Drive Request
      </Link>
    );
    const aopBlurb = (
      <React.Fragment>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        An alternate way to obtain lots of AOP data is to submit an {aopHardDriveLink}.
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </React.Fragment>
    );
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
              or a more restrictive date range. {fromAOPManifest ? aopBlurb : null}
            </Typography>
            {/* eslint-enable react/jsx-one-expression-per-line */}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFileType = () => {
    if (manifest.status !== 'fetched') { return null; }
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
            disabled = false;
            break;
          case 'fetching':
            buttonText = 'Fetching File List...';
            icon = <CircularProgress size={16} color="inherit" {...iconProps} />;
            break;
          default:
            buttonText = 'Download Unavailable';
            icon = <ErrorIcon {...iconProps} />;
            break;
        }
      }
    }
    return (
      <Button
        data-selenium="download-data-dialog.download-button"
        data-gtm="download-data-dialog.download-button"
        size="large"
        color="primary"
        variant="contained"
        onClick={handleDownload}
        style={{ whiteSpace: 'nowrap' }}
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
    const signInLink = (
      <Link target="_new" href={NeonEnvironment.getFullAuthPath('login')}>signing in</Link>
    );
    const benefitsLink = (
      <Link target="_new" href="https://www.neonscience.org/about/user-accounts">here</Link>
    );
    /* eslint-disable react/jsx-one-expression-per-line */
    const authStyles = { color: COLORS.GOLD[800], textAlign: 'right', whiteSpace: 'nowrap' };
    return (
      <React.Fragment>
        <Typography
          variant="body2"
          style={{
            ...authStyles,
            marginTop: Theme.spacing(1),
            fontWeight: 600,
          }}
        >
          Have an account? Consider {signInLink} before proceeding.
        </Typography>
        <Typography
          variant="body2"
          style={{
            ...authStyles,
            fontStyle: 'italic',
            fontSize: '0.8rem',
          }}
        >
          Learn more about the benefits of signing in {benefitsLink}.
        </Typography>
      </React.Fragment>
    );
    /* eslint-enable react/jsx-one-expression-per-line */
  };

  const renderActions = () => {
    const divClass = belowSm ? classes.startFlex : classes.endFlex;
    const showDownloadButton = fromManifest || fromAOPManifest;
    return (
      <div className={divClass} style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className={divClass}>
          <Button
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
          {showDownloadButton ? renderDownloadButton() : null}
        </div>
        {showDownloadButton && !allStepsComplete ? (
          <Typography variant="body2" style={{ marginTop: Theme.spacing(1) }}>
            Complete all steps to enable download
          </Typography>
        ) : null}
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
        <React.Fragment>
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
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const renderActiveStep = () => {
    if (!requiredSteps.length) { return null; }
    if (requiredSteps.length < 2) {
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    }
    const titleMarker = requiredSteps[activeStepIndex].key === 'summary'
      ? <CircleStarIcon className={classes.summaryIconTitleMarker} />
      : <Chip color="primary" label={activeStepIndex + 1} className={classes.stepChip} />;
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  // Google Tag Manager variables
  const getStepsCompleted = () => requiredSteps
    .filter(step => step.isComplete === true)
    .map(step => step.key);
  const getStepsNotCompleted = () => requiredSteps
    .filter(step => step.isComplete === false)
    .map(step => step.key);
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
    if (requiredSteps.some(step => step.key === 'documentation')) {
      eventSteps.push('documentation');
    }
    if (requiredSteps.some(step => step.key === 'packageType')) {
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
    <React.Fragment>
      {/* Google Tag Manager elements to track download progress */}
      <input type="hidden" data-gtm="download-data-dialog.product-code" value={productData.productCode} />
      <input type="hidden" data-gtm="download-data-dialog.size-estimate-bytes" value={getSizeEstimateBytes()} />
      <input type="hidden" data-gtm="download-data-dialog.steps-completed" value={getStepsCompleted().join(', ')} />
      <input type="hidden" data-gtm="download-data-dialog.steps-not-completed" value={getStepsNotCompleted().join(', ')} />
      <input type="hidden" data-gtm="download-data-dialog.step-completion-percentage" value={getStepCompletionPercentage()} />
      <input type="hidden" data-gtm="download-data-dialog.download-executed" value={downloadExecuted ? 1 : 0} />
      <input type="hidden" data-gtm="download-data-dialog.lzw-compressed-config" value={getLZWCompressedConfig()} />
      {/* end Google Tag Manager elements */}
    </React.Fragment>
  );

  const releaseTooltip = release.value === null
    ? `You are downloading only the latest released and provisional data (release: ${latestRelease || 'unknown'}).`
    : `You are downloading product data only from the ${release.value} release (no provisional data will be included).`;
  return (
    <DialogBase
      data-selenium="download-data-dialog"
      open={dialogOpen}
      onClose={handleCancel}
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
        <Grid item xs={12} sm={6} md={8} data-selenium="download-data-dialog.product-info">
          <Typography variant="h5" style={{ marginBottom: Theme.spacing(1) }}>
            {productData.productName}
          </Typography>
          <div className={classes.startFlex} style={{ marginBottom: Theme.spacing(1) }}>
            {(productData.themes || []).map(dataTheme => (
              <div key={dataTheme} style={{ marginRight: Theme.spacing(1) }}>
                <DataThemeIcon size={3} theme={dataTheme} />
              </div>
            ))}
            <Typography variant="subtitle2">
              {productData.productCode}
            </Typography>
          </div>
          <div className={classes.startFlex}>
            <Typography variant="subtitle2" className={classes.releaseTitle}>
              {release.value === null ? (
                'Latest released and provisional data'
              ) : (
                `Release: ${release.value}`
              )}
            </Typography>
            <Tooltip
              placement="right"
              title={releaseTooltip}
              className={classes.tooltip}
            >
              <IconButton size="small" className={classes.iconButton} aria-label={releaseTooltip}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
