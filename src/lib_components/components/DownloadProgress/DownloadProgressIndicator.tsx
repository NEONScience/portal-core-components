import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { useTheme } from '@mui/material/styles';
import { keyframes } from 'tss-react';

import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import ExpandIcon from '@mui/icons-material/OpenInFull';

import DownloadProgressStatusIcon from './DownloadProgressStatusIcon';
import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { useDownloadProgressActions, useDownloadProgressState } from './DownloadProgressContext';
import {
  applyDownloadProgressTrayZIndex,
  getDownloadProgressTray,
  subscribeDownloadProgressTray,
} from './downloadProgressTray';
import { getShortStatus, getTitle } from './downloadProgressText';
import {
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressTracking,
} from '../../types/downloadProgress';
import { isActivePhase, isDismissible } from '../../util/downloadProgressUtil';

const RING_SIZE = 40;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const useStyles = makeStyles()((theme: NeonTheme) => ({
  card: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '340px',
    maxWidth: '100%',
    padding: theme.spacing(1, 0.5, 1, 1.5),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    animation: `${slideIn} 300ms cubic-bezier(0.22, 1, 0.36, 1)`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  cardCompleted: {
    borderLeftColor: COLORS.GREEN[600],
  },
  cardFailed: {
    borderLeftColor: COLORS.RED[700],
  },
  cardMuted: {
    borderLeftColor: theme.palette.grey[300],
  },
  ring: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: `${RING_SIZE}px`,
    height: `${RING_SIZE}px`,
  },
  ringTrack: {
    position: 'absolute',
    inset: 0,
    color: theme.palette.grey[100],
  },
  ringValue: {
    position: 'absolute',
    inset: 0,
  },
  ringLabel: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    color: theme.palette.secondary.main,
  },
  main: {
    flexGrow: 1,
    minWidth: 0,
    display: 'block',
    textAlign: 'left',
    padding: theme.spacing(0.5),
    '&.Mui-focusVisible': {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  },
  title: {
    display: 'block',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  status: {
    display: 'block',
    color: theme.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
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

export interface DownloadProgressIndicatorViewProps {
  state: DownloadProgressState;
  onExpand: () => void;
  onDismiss: () => void;
}

/**
 * Compact presentation of a minimized download
 */
export const DownloadProgressIndicatorView: React.FC<DownloadProgressIndicatorViewProps> = (
  props: DownloadProgressIndicatorViewProps,
): React.JSX.Element => {
  const { state, onExpand, onDismiss }: DownloadProgressIndicatorViewProps = props;
  const { classes, cx } = useStyles();
  const { phase, tracking, summary } = state;
  const active = isActivePhase(phase);
  const unavailable = active && (tracking === DownloadProgressTracking.UNAVAILABLE);
  const dismissible = isDismissible(state);
  const productName = (summary && (summary.productName || summary.productCode)) || 'Data download';
  const status = getShortStatus(state);

  const renderLeading = (): React.JSX.Element => {
    if (!active || unavailable) {
      return <DownloadProgressStatusIcon phase={phase} tracking={tracking} size="small" />;
    }
    if (state.percent === null) {
      return (
        <span className={classes.ring}>
          <CircularProgress size={RING_SIZE - 8} thickness={4} aria-hidden="true" />
        </span>
      );
    }
    return (
      <span className={classes.ring} aria-hidden="true">
        <CircularProgress
          variant="determinate"
          value={100}
          size={RING_SIZE}
          thickness={4}
          className={classes.ringTrack}
        />
        <CircularProgress
          variant="determinate"
          value={state.percent}
          size={RING_SIZE}
          thickness={4}
          className={classes.ringValue}
        />
        <span className={classes.ringLabel}>{`${state.percent}%`}</span>
      </span>
    );
  };

  // Only status changes are announced, rather than every progress update
  const announcement = (active && !unavailable) ? '' : `${getTitle(state)}: ${productName}`;
  return (
    <Paper
      elevation={6}
      className={cx(
        classes.card,
        (phase === DownloadProgressPhase.COMPLETED) && classes.cardCompleted,
        (phase === DownloadProgressPhase.FAILED) && classes.cardFailed,
        ((phase === DownloadProgressPhase.CANCELED) || unavailable) && classes.cardMuted,
      )}
      data-selenium="download-progress-indicator"
    >
      {renderLeading()}
      <ButtonBase
        className={classes.main}
        onClick={onExpand}
        aria-label={`Show download progress for ${productName}. ${status}`}
        data-gtm="download-progress-indicator.expand-button"
      >
        <Typography variant="subtitle2" component="span" noWrap className={classes.title}>
          {productName}
        </Typography>
        <Typography variant="caption" component="span" noWrap className={classes.status}>
          {status}
        </Typography>
      </ButtonBase>
      <Tooltip title="Show details">
        <IconButton
          size="small"
          onClick={onExpand}
          aria-label="Show download details"
          data-selenium="download-progress-indicator.expand-button"
          data-gtm="download-progress-indicator.expand-button"
        >
          <ExpandIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {!dismissible ? null : (
        <Tooltip title="Dismiss">
          <IconButton
            size="small"
            onClick={onDismiss}
            aria-label="Dismiss download"
            data-selenium="download-progress-indicator.dismiss-button"
            data-gtm="download-progress-indicator.dismiss-button"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <span className={classes.visuallyHidden} role="status">
        {announcement}
      </span>
    </Paper>
  );
};

/**
 * Minimized presentation of the download tracked by the provider, shown in a tray
 * shared with the minimized downloads of other providers on the page
 */
const DownloadProgressIndicator: React.FC = (): React.JSX.Element | null => {
  const theme = useTheme();
  const state = useDownloadProgressState();
  const actions = useDownloadProgressActions();
  const tray = useSyncExternalStore<HTMLElement | null | undefined>(
    subscribeDownloadProgressTray,
    getDownloadProgressTray,
  );
  const trayZIndex = theme.zIndex.modal + 1;
  useEffect(() => {
    if (!tray) return;
    // Shown above dialogs, including the download configuration dialog
    applyDownloadProgressTrayZIndex(trayZIndex);
  }, [tray, trayZIndex]);
  if (!actions || !tray || state.expanded || (state.phase === DownloadProgressPhase.IDLE)) {
    return null;
  }
  return createPortal(
    <DownloadProgressIndicatorView
      state={state}
      onExpand={actions.expand}
      onDismiss={actions.dismiss}
    />,
    tray,
  );
};

export default DownloadProgressIndicator;
