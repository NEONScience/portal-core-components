import React from 'react';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import ReleaseChip from '@/components/Chip/ReleaseChip';
import Theme from '@/components/Theme/Theme';
import { NeonTheme } from '@/components/Theme/types';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

const useStyles = makeStyles((theme: NeonTheme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  paper: {
    width: '100%',
    padding: Theme.spacing(3),
  },
  releaseChip: {
    color: theme.colors.BROWN[600],
    border: `1px solid ${theme.colors.BROWN[600]}`,
    backgroundColor: theme.colors.BROWN[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipIcon: {
    color: theme.colors.BROWN[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipBlue: {
    color: theme.colors.NEON_BLUE[600],
    border: `1px solid ${theme.colors.NEON_BLUE[600]}`,
    backgroundColor: theme.colors.NEON_BLUE[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBlueIcon: {
    color: theme.colors.NEON_BLUE[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGreen: {
    color: theme.colors.GREEN[600],
    border: `1px solid ${theme.colors.GREEN[600]}`,
    backgroundColor: theme.colors.GREEN[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGreenIcon: {
    color: theme.colors.GREEN[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGold: {
    color: theme.colors.GOLD[600],
    border: `1px solid ${theme.colors.GOLD[600]}`,
    backgroundColor: theme.colors.GOLD[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGoldIcon: {
    color: theme.colors.GOLD[600],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseIconDefaultDark: {
    color: theme.colors.LIGHT_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipDefaultDark: {
    color: theme.colors.LIGHT_BLUE[800],
    border: `1px solid ${theme.colors.LIGHT_BLUE[800]}`,
    backgroundColor: theme.colors.LIGHT_BLUE[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDark: {
    color: theme.colors.BROWN[700],
    border: `1px solid ${theme.colors.BROWN[700]}`,
    backgroundColor: theme.colors.BROWN[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDarkIcon: {
    color: theme.colors.BROWN[700],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipBlueDark: {
    color: theme.colors.NEON_BLUE[800],
    border: `1px solid ${theme.colors.NEON_BLUE[800]}`,
    backgroundColor: theme.colors.NEON_BLUE[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBlueDarkIcon: {
    color: theme.colors.NEON_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGreenDark: {
    color: theme.colors.GREEN[800],
    border: `1px solid ${theme.colors.GREEN[800]}`,
    backgroundColor: theme.colors.GREEN[200],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGreenDarkIcon: {
    color: theme.colors.GREEN[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGoldDark: {
    color: theme.colors.GOLD[800],
    border: `1px solid ${theme.colors.GOLD[800]}`,
    backgroundColor: theme.colors.GOLD[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGoldDarkIcon: {
    color: theme.colors.GOLD[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseIconDefaultDarkContrast: {
    color: theme.colors.LIGHT_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipDefaultDarkContrast: {
    color: theme.colors.LIGHT_BLUE[800],
    border: `1px solid ${theme.colors.LIGHT_BLUE[300]}`,
    backgroundColor: theme.colors.LIGHT_BLUE[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDarkContrast: {
    color: theme.colors.BROWN[700],
    border: `1px solid ${theme.colors.BROWN[300]}`,
    backgroundColor: theme.colors.BROWN[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBrownDarkContrastIcon: {
    color: theme.colors.BROWN[700],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipBlueDarkContrast: {
    color: theme.colors.NEON_BLUE[800],
    border: `1px solid ${theme.colors.NEON_BLUE[400]}`,
    backgroundColor: theme.colors.NEON_BLUE[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipBlueDarkContrastIcon: {
    color: theme.colors.NEON_BLUE[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGreenDarkContrast: {
    color: theme.colors.GREEN[800],
    border: `1px solid ${theme.colors.GREEN[500]}`,
    backgroundColor: theme.colors.GREEN[100],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGreenDarkContrastIcon: {
    color: theme.colors.GREEN[800],
    fontSize: '1em',
    marginRight: theme.spacing(1),
  },
  releaseChipGoldDarkContrast: {
    color: theme.colors.GOLD[800],
    border: `1px solid ${theme.colors.GOLD[400]}`,
    backgroundColor: theme.colors.GOLD[50],
    fontWeight: 600,
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    cursor: 'help',
  },
  releaseChipGoldDarkContrastIcon: {
    color: theme.colors.GOLD[800],
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
  const classes = useStyles(Theme);
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
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChip,
              icon: classes.releaseChipIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBlue,
              icon: classes.releaseChipBlueIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGreen,
              icon: classes.releaseChipGreenIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGold,
              icon: classes.releaseChipGoldIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
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
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBrownDark,
              icon: classes.releaseChipBrownDarkIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBlueDark,
              icon: classes.releaseChipBlueDarkIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGreenDark,
              icon: classes.releaseChipGreenDarkIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGoldDark,
              icon: classes.releaseChipGoldDarkIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
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
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBrownDarkContrast,
              icon: classes.releaseChipBrownDarkContrastIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipBlueDarkContrast,
              icon: classes.releaseChipBlueDarkContrastIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGreenDarkContrast,
              icon: classes.releaseChipGreenDarkContrastIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
            )}
          />
          <ReleaseChip
            chipLabel="RELEASE-2023"
            classes={{
              chip: classes.releaseChipGoldDarkContrast,
              icon: classes.releaseChipGoldDarkContrastIcon,
            }}
            tooltipTitle={(
              /* eslint-disable react/jsx-one-expression-per-line */
              <span>
                Availability and metadata shown is for
                the <b>RELEASE-2023</b> release of this product
              </span>
              /* eslint-enable react/jsx-one-expression-per-line */
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
