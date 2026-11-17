import React from 'react';

import { alpha } from '@mui/material/styles';
import { keyframes } from 'tss-react';

import CancelIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownloadOutlined';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import DownloadingIcon from '@mui/icons-material/Downloading';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import PackageIcon from '@mui/icons-material/Inventory2Outlined';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import {
  DownloadProgressPhase,
  DownloadProgressTracking,
} from '../../types/downloadProgress';
import { isActivePhase } from '../../util/downloadProgressUtil';

const EASE_OUT_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.45, 0, 0.55, 1)';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha(COLORS.LIGHT_BLUE[500], 0.4)};
  }
  70% {
    box-shadow: 0 0 0 14px ${alpha(COLORS.LIGHT_BLUE[500], 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha(COLORS.LIGHT_BLUE[500], 0)};
  }
`;

const bob = keyframes`
  0%, 100% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(3px);
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ringBurst = keyframes`
  from {
    opacity: 0.6;
    transform: scale(0.7);
  }
  to {
    opacity: 0;
    transform: scale(1.6);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-3px);
  }
  40%, 80% {
    transform: translateX(3px);
  }
`;

const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: '50%',
    color: COLORS.LIGHT_BLUE[500],
    backgroundColor: COLORS.LIGHT_BLUE[50],
  },
  large: {
    width: '56px',
    height: '56px',
    '& svg': {
      fontSize: '2rem',
    },
  },
  small: {
    width: '36px',
    height: '36px',
    '& svg': {
      fontSize: '1.25rem',
    },
  },
  pulsing: {
    animation: `${pulse} 2s ${EASE_IN_OUT} infinite`,
    [REDUCED_MOTION]: {
      animation: 'none',
    },
  },
  bobbing: {
    '& svg': {
      animation: `${bob} 1.4s ${EASE_IN_OUT} infinite`,
      [REDUCED_MOTION]: {
        animation: 'none',
      },
    },
  },
  completed: {
    color: COLORS.GREEN[600],
    backgroundColor: COLORS.GREEN[50],
    '& svg': {
      animation: `${popIn} 400ms ${EASE_OUT_BACK} both`,
      [REDUCED_MOTION]: {
        animation: 'none',
      },
    },
    // Soft ring that bursts out as the check pops in
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      border: `2px solid ${COLORS.GREEN[400]}`,
      opacity: 0,
      animation: `${ringBurst} 700ms ease-out 150ms`,
      [REDUCED_MOTION]: {
        animation: 'none',
      },
    },
  },
  failed: {
    color: COLORS.RED[700],
    backgroundColor: COLORS.RED[50],
    animation: `${shake} 450ms ${EASE_IN_OUT} 1`,
    [REDUCED_MOTION]: {
      animation: 'none',
    },
  },
  canceled: {
    color: theme.palette.grey[500],
    backgroundColor: theme.palette.grey[50],
  },
  unavailable: {
    color: COLORS.NEON_BLUE[500],
    backgroundColor: COLORS.NEON_BLUE[50],
  },
}));

export interface DownloadProgressStatusIconProps {
  phase: DownloadProgressPhase;
  tracking: DownloadProgressTracking;
  size?: 'small' | 'large';
}

/**
 * Animated icon representing the status of a download
 */
const DownloadProgressStatusIcon: React.FC<DownloadProgressStatusIconProps> = (
  props: DownloadProgressStatusIconProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const { phase, tracking, size = 'large' }: DownloadProgressStatusIconProps = props;
  let icon: React.JSX.Element;
  let stateClass: string;
  if (isActivePhase(phase) && (tracking === DownloadProgressTracking.UNAVAILABLE)) {
    icon = <DownloadingIcon />;
    stateClass = classes.unavailable;
  } else {
    switch (phase) {
      case DownloadProgressPhase.PREPARING:
      case DownloadProgressPhase.FINALIZING:
        icon = <PackageIcon />;
        stateClass = classes.pulsing;
        break;
      case DownloadProgressPhase.STREAMING:
        icon = <DownloadIcon />;
        stateClass = classes.bobbing;
        break;
      case DownloadProgressPhase.COMPLETED:
        icon = <CheckCircleIcon />;
        stateClass = classes.completed;
        break;
      case DownloadProgressPhase.FAILED:
        icon = <ErrorIcon />;
        stateClass = classes.failed;
        break;
      case DownloadProgressPhase.CANCELED:
        icon = <CancelIcon />;
        stateClass = classes.canceled;
        break;
      default:
        icon = <CloudDownloadIcon />;
        stateClass = classes.pulsing;
        break;
    }
  }
  return (
    <span
      className={cx(classes.root, (size === 'small') ? classes.small : classes.large, stateClass)}
      aria-hidden="true"
      data-selenium="download-progress-status-icon"
      data-phase={phase}
    >
      {icon}
    </span>
  );
};

export default DownloadProgressStatusIcon;
