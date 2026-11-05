import React from 'react';

import Typography from '@mui/material/Typography';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  // Takes the deep brown of the Drupal footer
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5, 2),
    backgroundColor: COLORS.BROWN[800],
    color: COLORS.GREY[50],
    // Aligns with the header toolbar gutters
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2.5, 3),
    },
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
  version: {
    padding: theme.spacing(0.25, 1),
    border: `1px solid ${COLORS.GOLD[300]}66`,
    borderRadius: '999px',
    backgroundColor: `${COLORS.GOLD[300]}14`,
    color: COLORS.GOLD[300],
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    fontVariantNumeric: 'tabular-nums',
  },
}));

export interface AutonomousFooterProps {
  // Name of the application, defaults to the application name
  title?: string;
  // Version of the application, defaults to the application version
  version?: string;
  minWidth?: string;
}

const AutonomousFooter: React.FC<AutonomousFooterProps> = (
  props: AutonomousFooterProps,
): React.JSX.Element => {
  const {
    title = NeonEnvironment.getReactAppName(),
    version = NeonEnvironment.getReactAppVersion(),
    minWidth,
  }: AutonomousFooterProps = props;
  const { classes } = useStyles();
  return (
    <footer
      className={classes.footer}
      style={minWidth ? { minWidth } : undefined}
      data-selenium="neon-footer.autonomous"
    >
      <Typography component="span" className={classes.title}>
        {title}
      </Typography>
      {!version ? null : (
        <span className={classes.version}>
          {`v${version}`}
        </span>
      )}
    </footer>
  );
};

export default AutonomousFooter;
