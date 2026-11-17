import React, { useId, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { keyframes } from 'tss-react';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import MinimizeIcon from '@mui/icons-material/Remove';

import DownloadProgressStatusIcon from './DownloadProgressStatusIcon';
import ErrorCard from '../Card/ErrorCard';
import ReleaseChip from '../Chip/ReleaseChip';
import SiteChip from '../SiteChip/SiteChip';
import WarningCard from '../Card/WarningCard';
import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { useDownloadProgressActions, useDownloadProgressState } from './DownloadProgressContext';
import {
  DownloadStatusNoticeType,
  displayBytes,
  getAnnouncement,
  getDescription,
  getElapsedTime,
  getStatusNotice,
  getTimeRemaining,
  getTitle,
  getZipFileDisplayName,
  pluralizeFiles,
} from './downloadProgressText';
import { Nullable } from '../../types/core';
import {
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressTracking,
  DownloadSummary,
} from '../../types/downloadProgress';
import {
  formatRate,
  isActivePhase,
  isDismissible,
  isTerminalPhase,
} from '../../util/downloadProgressUtil';
import { saveFailedFilesReport } from '../../util/downloadReportUtil';

// The most site chips shown before summarizing the remaining sites
const MAX_SITE_CHIPS = 8;
const STRIPE_SIZE = 20;

const stripes = keyframes`
  from {
    background-position: 0 0;
  }
  to {
    background-position: ${STRIPE_SIZE}px 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  paper: {
    overflowX: 'hidden',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(2.5, 3),
    backgroundColor: theme.palette.grey[50],
  },
  titleText: {
    flexGrow: 1,
    minWidth: 0,
    paddingTop: theme.spacing(0.5),
  },
  title: {
    fontWeight: 600,
    lineHeight: 1.3,
  },
  description: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    overflowWrap: 'anywhere',
  },
  titleButton: {
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(-1.5),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5),
    padding: theme.spacing(2.5, 3, 3, 3),
  },
  progressHeadline: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  percent: {
    fontSize: '2.75rem',
    fontWeight: 600,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: theme.palette.secondary.main,
  },
  percentSign: {
    fontSize: '1.5rem',
    marginLeft: '2px',
    color: theme.palette.text.secondary,
  },
  percentCompleted: {
    color: COLORS.GREEN[700],
  },
  indeterminateLabel: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
  },
  fileCount: {
    color: theme.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
  },
  progressRoot: {
    height: '10px',
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[100],
  },
  progressBar: {
    borderRadius: '5px',
    backgroundColor: theme.palette.primary.main,
  },
  progressBarStreaming: {
    backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.18) 25%, transparent 25%, '
      + 'transparent 50%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.18) 75%, '
      + 'transparent 75%, transparent)',
    backgroundSize: `${STRIPE_SIZE}px ${STRIPE_SIZE}px`,
    animation: `${stripes} 1s linear infinite`,
    [REDUCED_MOTION]: {
      animation: 'none',
    },
  },
  progressBarCompleted: {
    backgroundColor: COLORS.GREEN[600],
  },
  progressBarStopped: {
    backgroundColor: theme.palette.grey[300],
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: theme.spacing(1),
    },
  },
  statLabel: {
    display: 'block',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontSize: '0.6875rem',
    fontWeight: 600,
  },
  statValue: {
    display: 'block',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    // Reserves two lines so values that wrap in the narrow columns, such as the time taken,
    // don't change the dialog height as they update
    minHeight: `calc(2em * ${theme.typography.body2.lineHeight})`,
    [theme.breakpoints.only('xs')]: {
      minHeight: 0,
    },
  },
  currentFile: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 1.5),
    backgroundColor: theme.palette.grey[50],
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
  currentFileLabel: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
  },
  currentFileName: {
    minWidth: 0,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: '0.8125rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    animation: `${fadeIn} 250ms ease-out`,
    [REDUCED_MOTION]: {
      animation: 'none',
    },
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1.5),
    color: theme.palette.text.secondary,
  },
  // Overrides the card callouts to space them with the rest of the dialog content
  warningCallout: {
    margin: 0,
    backgroundColor: theme.colors.BROWN[50],
    borderColor: theme.colors.BROWN[300],
  },
  errorCallout: {
    margin: 0,
    backgroundColor: theme.colors.RED[50],
    borderColor: theme.colors.RED[300],
  },
  // Keeps the card icon at the top of content that expands
  warningCalloutIconTop: {
    alignSelf: 'flex-start',
    color: theme.colors.BROWN[300],
    marginRight: theme.spacing(2),
  },
  failedFilesActions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(1),
    margin: theme.spacing(0.5, 0, 0, -0.5),
  },
  failedList: {
    margin: theme.spacing(1, 0, 0, 0),
    paddingLeft: theme.spacing(2.5),
    maxHeight: '160px',
    overflowY: 'auto',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: '0.75rem',
    overflowWrap: 'anywhere',
  },
  summary: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[100]}`,
    backgroundColor: COLORS.GREY[50],
  },
  summaryHeading: {
    display: 'block',
    color: theme.palette.text.secondary,
    fontWeight: 600,
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),
  },
  summaryList: {
    display: 'grid',
    gridTemplateColumns: 'max-content minmax(0, 1fr)',
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(1),
    alignItems: 'center',
    margin: 0,
    [theme.breakpoints.only('xs')]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: theme.spacing(0.25),
    },
  },
  summaryTerm: {
    color: theme.palette.text.secondary,
    fontSize: '0.8125rem',
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(1),
    },
  },
  summaryValue: {
    margin: 0,
    minWidth: 0,
    fontSize: '0.875rem',
    overflowWrap: 'anywhere',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  productCodeChip: {
    color: theme.palette.grey[400],
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    height: '22px',
  },
  releaseChip: {
    color: COLORS.LIGHT_BLUE[600],
    border: `1px solid ${COLORS.LIGHT_BLUE[600]}`,
    backgroundColor: COLORS.LIGHT_BLUE[50],
    fontWeight: 600,
    cursor: 'help',
  },
  moreChip: {
    cursor: 'help',
  },
  monospace: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: '0.8125rem',
  },
  actions: {
    padding: theme.spacing(1.5, 3),
    gap: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    border: 0,
  },
}));

type Classes = ReturnType<typeof useStyles>['classes'];

const renderStat = (classes: Classes, label: string, value: string): React.JSX.Element => (
  <div>
    <Typography component="span" className={classes.statLabel}>{label}</Typography>
    <Typography component="span" variant="body2" className={classes.statValue}>{value}</Typography>
  </div>
);

const renderSummaryRow = (
  classes: Classes,
  term: string,
  value: React.ReactNode,
): React.JSX.Element => (
  <React.Fragment key={term}>
    <dt className={classes.summaryTerm}>{term}</dt>
    <dd className={classes.summaryValue}>{value}</dd>
  </React.Fragment>
);

const renderSites = (classes: Classes, sites: string[]): React.ReactNode => {
  const shownSites = sites.slice(0, MAX_SITE_CHIPS);
  const remainingSites = sites.slice(MAX_SITE_CHIPS);
  return (
    <div className={classes.chips}>
      {shownSites.map((site: string) => (
        <SiteChip key={site} label={site} size="small" />
      ))}
      {(remainingSites.length <= 0) ? null : (
        <Tooltip title={remainingSites.join(', ')}>
          <Chip
            size="small"
            variant="outlined"
            className={classes.moreChip}
            label={`+${remainingSites.length} more`}
          />
        </Tooltip>
      )}
    </div>
  );
};

const renderSummary = (
  classes: Classes,
  summary: DownloadSummary,
  zipFileName: Nullable<string>,
): React.JSX.Element => {
  const includedText = (included: boolean): string => (included ? 'Included' : 'Excluded');
  const productValue: React.JSX.Element = (
    <div className={classes.chips}>
      <span>{summary.productName}</span>
      {(!summary.productCode || (summary.productCode === summary.productName)) ? null : (
        <Chip size="small" label={summary.productCode} className={classes.productCodeChip} />
      )}
    </div>
  );
  const releaseValue: React.JSX.Element = (
    <ReleaseChip
      chipLabel={summary.releaseLabel}
      classes={{ chip: classes.releaseChip }}
      tooltipTitle={summary.release
        ? `Data from the ${summary.release} release`
        : 'The latest released and provisional data'}
    />
  );
  const rows: React.JSX.Element[] = [
    renderSummaryRow(classes, 'Product', productValue),
    renderSummaryRow(classes, 'Release', releaseValue),
  ];
  if (summary.sites.length > 0) {
    rows.push(renderSummaryRow(classes, 'Sites', renderSites(classes, summary.sites)));
  }
  if (summary.dateRangeLabel) {
    rows.push(renderSummaryRow(classes, 'Date range', summary.dateRangeLabel));
  }
  if (summary.packageType) {
    const packageType = `${summary.packageType.charAt(0).toUpperCase()}`
      + `${summary.packageType.substring(1)}`;
    rows.push(renderSummaryRow(classes, 'Package', packageType));
  }
  if (summary.includeDocumentation !== null) {
    rows.push(renderSummaryRow(
      classes,
      'Documentation',
      includedText(summary.includeDocumentation === true),
    ));
  }
  if (summary.includeProvisionalData !== null) {
    rows.push(renderSummaryRow(
      classes,
      'Provisional data',
      includedText(summary.includeProvisionalData === true),
    ));
  }
  if (typeof summary.fileCount === 'number') {
    rows.push(renderSummaryRow(classes, 'Files', pluralizeFiles(summary.fileCount)));
  }
  if (summary.estimatedBytes > 0) {
    const uncompressed = summary.isEstimateUncompressed ? ' (uncompressed)' : '';
    rows.push(renderSummaryRow(
      classes,
      'Estimated size',
      `${displayBytes(summary.estimatedBytes)}${uncompressed}`,
    ));
  }
  const fileName = getZipFileDisplayName(zipFileName);
  if (fileName) {
    rows.push(renderSummaryRow(
      classes,
      'File name',
      <span className={classes.monospace}>{fileName}</span>,
    ));
  }
  return (
    <section className={classes.summary} aria-label="Download summary">
      <Typography variant="overline" component="h3" className={classes.summaryHeading}>
        What you&apos;re downloading
      </Typography>
      <dl className={classes.summaryList}>
        {rows}
      </dl>
    </section>
  );
};

export interface DownloadProgressDialogViewProps {
  state: DownloadProgressState;
  onMinimize: () => void;
  onDismiss: () => void;
}

/**
 * Dialog presenting the status and progress of a download
 */
export const DownloadProgressDialogView: React.FC<DownloadProgressDialogViewProps> = (
  props: DownloadProgressDialogViewProps,
): React.JSX.Element => {
  const { state, onMinimize, onDismiss }: DownloadProgressDialogViewProps = props;
  const theme = useTheme();
  const belowSm = useMediaQuery(theme.breakpoints.only('xs'));
  const { classes, cx } = useStyles();
  const titleSectionId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const failedFilesId = useId();
  const [dismissing, setDismissing] = useState<boolean>(false);
  const [showFailedFiles, setShowFailedFiles] = useState<boolean>(false);

  const { phase, tracking, summary } = state;
  const active = isActivePhase(phase);
  const terminal = isTerminalPhase(phase);
  const dismissible = isDismissible(state);
  const unavailable = active && (tracking === DownloadProgressTracking.UNAVAILABLE);
  const streaming = (phase === DownloadProgressPhase.STREAMING)
    || (phase === DownloadProgressPhase.FINALIZING);
  const determinate = (state.percent !== null) && !unavailable;
  const processedBytes = state.bytesSent + state.bytesSkipped;

  // The dialog closes before the download is dismissed so it can transition out
  const beginDismiss = (): void => setDismissing(true);
  const handleExited = (): void => {
    if (dismissing) onDismiss();
  };
  const handleClose = (): void => {
    if (terminal) {
      beginDismiss();
      return;
    }
    onMinimize();
  };
  // Clicking outside the dialog doesn't close it, so the download isn't put away by accident
  const handleDialogClose: DialogProps['onClose'] = (event, reason): void => {
    if (reason === 'backdropClick') return;
    handleClose();
  };

  const renderProgressBar = (): React.JSX.Element => {
    const barClassName = cx(
      classes.progressBar,
      (phase === DownloadProgressPhase.STREAMING) && classes.progressBarStreaming,
      (phase === DownloadProgressPhase.COMPLETED) && classes.progressBarCompleted,
      ((phase === DownloadProgressPhase.FAILED) || (phase === DownloadProgressPhase.CANCELED))
        && classes.progressBarStopped,
    );
    return (
      <LinearProgress
        variant={determinate ? 'determinate' : 'indeterminate'}
        value={determinate ? (state.percent as number) : undefined}
        classes={{ root: classes.progressRoot, bar: barClassName }}
        aria-labelledby={titleId}
        data-selenium="download-progress-dialog.progress-bar"
      />
    );
  };

  const renderHeadline = (): React.JSX.Element => {
    let fileCount: string | null = null;
    if ((typeof state.totalFiles === 'number') && (state.totalFiles > 0)) {
      const processedFiles = Math.min(state.filesCompleted + state.filesFailed, state.totalFiles);
      fileCount = `${processedFiles.toLocaleString()} of ${pluralizeFiles(state.totalFiles)}`;
    }
    return (
      <div className={classes.progressHeadline}>
        {determinate ? (
          <Typography
            component="p"
            className={cx(
              classes.percent,
              (phase === DownloadProgressPhase.COMPLETED) && classes.percentCompleted,
            )}
            data-selenium="download-progress-dialog.percent"
          >
            {state.percent}
            <span className={classes.percentSign}>%</span>
          </Typography>
        ) : (
          <Typography component="p" variant="subtitle1" className={classes.indeterminateLabel}>
            {unavailable ? 'Download in progress' : 'Getting ready…'}
          </Typography>
        )}
        {!fileCount ? null : (
          <Typography variant="body2" className={classes.fileCount}>{fileCount}</Typography>
        )}
      </div>
    );
  };

  const renderStats = (): React.JSX.Element | null => {
    if (!streaming && (phase !== DownloadProgressPhase.COMPLETED)) return null;
    const processed = ((typeof state.totalBytes === 'number') && (state.totalBytes > 0))
      ? `${displayBytes(processedBytes)} of ${displayBytes(state.totalBytes)}`
      : displayBytes(processedBytes);
    if (phase === DownloadProgressPhase.COMPLETED) {
      return (
        <div className={classes.stats}>
          {renderStat(classes, 'Processed', displayBytes(processedBytes))}
          {renderStat(classes, 'Files', (typeof state.totalFiles === 'number')
            ? state.filesCompleted.toLocaleString()
            : '—')}
          {renderStat(classes, 'Time taken', getElapsedTime(state) || '—')}
        </div>
      );
    }
    return (
      <div className={classes.stats}>
        {renderStat(classes, 'Processed', processed)}
        {renderStat(classes, 'Speed', formatRate(state.rate) || '—')}
        {renderStat(classes, 'Time remaining', getTimeRemaining(state))}
      </div>
    );
  };

  const renderCurrentFile = (): React.JSX.Element | null => {
    if ((phase !== DownloadProgressPhase.STREAMING) || !state.currentFile || unavailable) {
      return null;
    }
    return (
      <div className={classes.currentFile}>
        <Typography variant="body2" component="span" className={classes.currentFileLabel}>
          Downloading
        </Typography>
        <Tooltip title={state.currentFile} placement="bottom-start">
          <span
            key={state.currentFile}
            className={classes.currentFileName}
            data-selenium="download-progress-dialog.current-file"
          >
            {state.currentFile}
          </span>
        </Tooltip>
      </div>
    );
  };

  const renderHint = (): React.JSX.Element | null => {
    const connecting = active
      && (tracking === DownloadProgressTracking.CONNECTING)
      && (phase === DownloadProgressPhase.STARTED);
    if (!connecting) return null;
    return (
      <Typography variant="body2" component="div" className={classes.hint}>
        <CircularProgress size={14} color="inherit" />
        <span>Connecting for live updates…</span>
      </Typography>
    );
  };

  // Calls attention to a download that failed or needs attention
  const renderStatusNotice = (): React.JSX.Element | null => {
    const notice = getStatusNotice(state);
    if (!notice) return null;
    const message: string | undefined = notice.message || undefined;
    return (
      <div data-selenium="download-progress-dialog.status-notice">
        {(notice.type === DownloadStatusNoticeType.ERROR) ? (
          <ErrorCard
            title={notice.title}
            message={message}
            classes={{ callout: classes.errorCallout }}
          />
        ) : (
          <WarningCard
            title={notice.title}
            message={message}
            classes={{ callout: classes.warningCallout }}
          />
        )}
      </div>
    );
  };

  const renderFailedFiles = (): React.JSX.Element | null => {
    if ((phase !== DownloadProgressPhase.COMPLETED) || (state.filesFailed <= 0)) return null;
    const failedFiles = Array.from(new Set(state.failedFiles));
    const moreCount = state.filesFailed - failedFiles.length;
    const failedFilesContent: React.JSX.Element = (
      <div>
        <Typography variant="subtitle2" component="p">
          {`${pluralizeFiles(state.filesFailed)} couldn't be included in your download`}
        </Typography>
        <Typography variant="body2">
          They may be temporarily unavailable. Try downloading them again later, or download the
          list to get each file individually.
        </Typography>
        <div className={classes.failedFilesActions}>
          {(failedFiles.length <= 0) ? null : (
            <Button
              size="small"
              onClick={() => setShowFailedFiles(!showFailedFiles)}
              aria-expanded={showFailedFiles}
              aria-controls={failedFilesId}
            >
              {showFailedFiles ? 'Hide files' : 'Show files'}
            </Button>
          )}
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => saveFailedFilesReport(state)}
            aria-label="Download list of files not included, as JSON"
            data-selenium="download-progress-dialog.failed-files-report"
          >
            Download list
          </Button>
        </div>
        {(failedFiles.length <= 0) ? null : (
          <Collapse in={showFailedFiles} id={failedFilesId}>
            <ul className={classes.failedList}>
              {failedFiles.map((fileName: string) => (
                <li key={fileName}>{fileName}</li>
              ))}
              {(moreCount <= 0) ? null : (
                <li key="more">{`and ${pluralizeFiles(moreCount)} more`}</li>
              )}
            </ul>
          </Collapse>
        )}
      </div>
    );
    return (
      <div data-selenium="download-progress-dialog.failed-files">
        <WarningCard
          titleContent={failedFilesContent}
          classes={{
            callout: classes.warningCallout,
            calloutIcon: classes.warningCalloutIconTop,
          }}
        />
      </div>
    );
  };

  const renderProgressArea = (): React.JSX.Element | null => {
    const stopped = (phase === DownloadProgressPhase.FAILED)
      || (phase === DownloadProgressPhase.CANCELED);
    if (stopped && (processedBytes <= 0)) return null;
    return (
      <div>
        {renderHeadline()}
        {renderProgressBar()}
        {renderStats()}
        {renderCurrentFile()}
        {renderHint()}
      </div>
    );
  };

  const renderActions = (): React.JSX.Element => {
    if (terminal) {
      return (
        <Button
          key="close"
          variant="contained"
          color="primary"
          onClick={beginDismiss}
          autoFocus
          data-selenium="download-progress-dialog.close-button"
          data-gtm="download-progress-dialog.close-button"
        >
          Close
        </Button>
      );
    }
    return (
      <>
        {!dismissible ? null : (
          <Button
            key="dismiss"
            variant="text"
            color="primary"
            onClick={beginDismiss}
            data-selenium="download-progress-dialog.dismiss-button"
            data-gtm="download-progress-dialog.dismiss-button"
          >
            Dismiss
          </Button>
        )}
        <Button
          key="minimize"
          variant="contained"
          color="primary"
          onClick={onMinimize}
          data-selenium="download-progress-dialog.minimize-button"
          data-gtm="download-progress-dialog.minimize-button"
        >
          Continue in background
        </Button>
      </>
    );
  };

  const closeLabel = terminal ? 'Close' : 'Minimize';
  const closeAction = terminal ? 'close' : 'minimize';
  return (
    <Dialog
      open={state.expanded && !dismissing}
      onClose={handleDialogClose}
      fullScreen={belowSm}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      style={{ zIndex: theme.zIndex.modal + 2 }}
      slotProps={{
        paper: { className: classes.paper },
        transition: { onExited: handleExited },
      }}
      data-selenium="download-progress-dialog"
    >
      <DialogTitle id={titleSectionId} component="div" className={classes.titleSection}>
        <DownloadProgressStatusIcon phase={phase} tracking={tracking} />
        <div className={classes.titleText}>
          <Typography variant="h5" component="h2" id={titleId} className={classes.title}>
            {getTitle(state)}
          </Typography>
          <Typography variant="body2" id={descriptionId} className={classes.description}>
            {getDescription(state)}
          </Typography>
        </div>
        <Tooltip title={closeLabel}>
          <IconButton
            aria-label={`${closeLabel} download progress`}
            onClick={handleClose}
            className={classes.titleButton}
            data-selenium={`download-progress-dialog.${closeAction}-icon-button`}
            data-gtm={`download-progress-dialog.${closeAction}-button`}
          >
            {terminal ? <CloseIcon /> : <MinimizeIcon />}
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        {renderProgressArea()}
        {renderStatusNotice()}
        {renderFailedFiles()}
        {!summary ? null : renderSummary(classes, summary, state.zipFileName)}
      </DialogContent>
      <DialogActions className={classes.actions}>
        {renderActions()}
      </DialogActions>
      <span className={classes.visuallyHidden} role="status" aria-live="polite">
        {getAnnouncement(state)}
      </span>
    </Dialog>
  );
};

/**
 * Dialog presenting the status and progress of the download tracked by the provider
 */
const DownloadProgressDialog: React.FC = (): React.JSX.Element | null => {
  const state = useDownloadProgressState();
  const actions = useDownloadProgressActions();
  if (!actions || (state.phase === DownloadProgressPhase.IDLE)) return null;
  return (
    <DownloadProgressDialogView
      // Resets the local state of the dialog for each download
      key={state.downloadId || 'download'}
      state={state}
      onMinimize={actions.minimize}
      onDismiss={actions.dismiss}
    />
  );
};

export default DownloadProgressDialog;
