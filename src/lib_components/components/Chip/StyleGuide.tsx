import React from 'react';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';

import ReleaseChip from '@/components/Chip/ReleaseChip';
import Theme from '@/components/Theme/Theme';
import { NeonTheme } from '@/components/Theme/types';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

const useStyles = makeStyles()((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  paper: {
    width: '100%',
    padding: Theme.spacing(3),
  },
  releaseChip: {
    color: (theme as NeonTheme).colors.BROWN[600],
    border: `1px solid ${(theme as NeonTheme).colors.BROWN[600]}`,
    backgroundColor: (theme as NeonTheme).colors.BROWN[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipIcon: {
    color: (theme as NeonTheme).colors.BROWN[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipBlue: {
    color: (theme as NeonTheme).colors.NEON_BLUE[600],
    border: `1px solid ${(theme as NeonTheme).colors.NEON_BLUE[600]}`,
    backgroundColor: (theme as NeonTheme).colors.NEON_BLUE[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBlueIcon: {
    color: (theme as NeonTheme).colors.NEON_BLUE[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGreen: {
    color: (theme as NeonTheme).colors.GREEN[600],
    border: `1px solid ${(theme as NeonTheme).colors.GREEN[600]}`,
    backgroundColor: (theme as NeonTheme).colors.GREEN[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGreenIcon: {
    color: (theme as NeonTheme).colors.GREEN[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGold: {
    color: (theme as NeonTheme).colors.GOLD[600],
    border: `1px solid ${(theme as NeonTheme).colors.GOLD[600]}`,
    backgroundColor: (theme as NeonTheme).colors.GOLD[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGoldIcon: {
    color: (theme as NeonTheme).colors.GOLD[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseIconDefaultDark: {
    color: (theme as NeonTheme).colors.LIGHT_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipDefaultDark: {
    color: (theme as NeonTheme).colors.LIGHT_BLUE[800],
    border: `1px solid ${(theme as NeonTheme).colors.LIGHT_BLUE[800]}`,
    backgroundColor: (theme as NeonTheme).colors.LIGHT_BLUE[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDark: {
    color: (theme as NeonTheme).colors.BROWN[700],
    border: `1px solid ${(theme as NeonTheme).colors.BROWN[700]}`,
    backgroundColor: (theme as NeonTheme).colors.BROWN[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDarkIcon: {
    color: (theme as NeonTheme).colors.BROWN[700],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipBlueDark: {
    color: (theme as NeonTheme).colors.NEON_BLUE[800],
    border: `1px solid ${(theme as NeonTheme).colors.NEON_BLUE[800]}`,
    backgroundColor: (theme as NeonTheme).colors.NEON_BLUE[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBlueDarkIcon: {
    color: (theme as NeonTheme).colors.NEON_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGreenDark: {
    color: (theme as NeonTheme).colors.GREEN[800],
    border: `1px solid ${(theme as NeonTheme).colors.GREEN[800]}`,
    backgroundColor: (theme as NeonTheme).colors.GREEN[200],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGreenDarkIcon: {
    color: (theme as NeonTheme).colors.GREEN[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGoldDark: {
    color: (theme as NeonTheme).colors.GOLD[800],
    border: `1px solid ${(theme as NeonTheme).colors.GOLD[800]}`,
    backgroundColor: (theme as NeonTheme).colors.GOLD[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGoldDarkIcon: {
    color: (theme as NeonTheme).colors.GOLD[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseIconDefaultDarkContrast: {
    color: (theme as NeonTheme).colors.LIGHT_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipDefaultDarkContrast: {
    color: (theme as NeonTheme).colors.LIGHT_BLUE[800],
    border: `1px solid ${(theme as NeonTheme).colors.LIGHT_BLUE[300]}`,
    backgroundColor: (theme as NeonTheme).colors.LIGHT_BLUE[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDarkContrast: {
    color: (theme as NeonTheme).colors.BROWN[700],
    border: `1px solid ${(theme as NeonTheme).colors.BROWN[300]}`,
    backgroundColor: (theme as NeonTheme).colors.BROWN[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDarkContrastIcon: {
    color: (theme as NeonTheme).colors.BROWN[700],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipBlueDarkContrast: {
    color: (theme as NeonTheme).colors.NEON_BLUE[800],
    border: `1px solid ${(theme as NeonTheme).colors.NEON_BLUE[400]}`,
    backgroundColor: (theme as NeonTheme).colors.NEON_BLUE[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBlueDarkContrastIcon: {
    color: (theme as NeonTheme).colors.NEON_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGreenDarkContrast: {
    color: (theme as NeonTheme).colors.GREEN[800],
    border: `1px solid ${(theme as NeonTheme).colors.GREEN[500]}`,
    backgroundColor: (theme as NeonTheme).colors.GREEN[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGreenDarkContrastIcon: {
    color: (theme as NeonTheme).colors.GREEN[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGoldDarkContrast: {
    color: (theme as NeonTheme).colors.GOLD[800],
    border: `1px solid ${(theme as NeonTheme).colors.GOLD[400]}`,
    backgroundColor: (theme as NeonTheme).colors.GOLD[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGoldDarkContrastIcon: {
    color: (theme as NeonTheme).colors.GOLD[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
}));

const propRows = [
  {
    name: 'chipLabel',
    type: 'string',
    description: (
      <p>
        The label to display on the chip.
      </p>
    ),
  },
  {
    name: 'tooltipTitle',
    type: 'ReactNode',
    description: (
      <p>
        The content to display within the tooltip.
      </p>
    ),
  },
];

export default function StyleGuide() {
  const { classes } = useStyles();
  return (
    <>
      <DocBlock>
        A set of components for utilizing chips.
      </DocBlock>
      <CodeBlock>
        {`
import ReleaseChip from 'portal-core-components/lib/components/Chip/ReleaseChip';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>
        Example Release Chip
      </Typography>
      <DocBlock>
        Displays a release chip.
      </DocBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <ReleaseChip
            chipLabel="RELEASE-2023"
            chipStyle={{
              marginLeft: Theme.spacing(1.5),
              marginBottom: Theme.spacing(2),
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChip,
              icon: classes.releaseChipIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBlue,
              icon: classes.releaseChipBlueIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGreen,
              icon: classes.releaseChipGreenIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGold,
              icon: classes.releaseChipGoldIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
        </Paper>
      </ExampleBlock>

      <ExampleBlock>
        <Paper className={classes.paper}>
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipDefaultDark,
              icon: classes.releaseIconDefaultDark,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBrownDark,
              icon: classes.releaseChipBrownDarkIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBlueDark,
              icon: classes.releaseChipBlueDarkIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGreenDark,
              icon: classes.releaseChipGreenDarkIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGoldDark,
              icon: classes.releaseChipGoldDarkIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
        </Paper>
      </ExampleBlock>

      <ExampleBlock>
        <Paper className={classes.paper}>
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipDefaultDarkContrast,
              icon: classes.releaseIconDefaultDarkContrast,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBrownDarkContrast,
              icon: classes.releaseChipBrownDarkContrastIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBlueDarkContrast,
              icon: classes.releaseChipBlueDarkContrastIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGreenDarkContrast,
              icon: classes.releaseChipGreenDarkContrastIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGoldDarkContrast,
              icon: classes.releaseChipGoldDarkContrastIcon,
            }}
            tooltipTitle={(
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
            )}
          />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>Card Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} />
      </DocBlock>
    </>
  );
}
