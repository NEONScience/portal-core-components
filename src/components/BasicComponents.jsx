/* eslint react/jsx-one-expression-per-line: 0, max-len: 0 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';

import DocBlock from './DocBlock';

import Theme from '../lib_components/components/Theme/Theme';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(4),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(4),
    },
  },
}));

export default function BasicComponents() {
  const classes = useStyles(Theme);
  const styleGuideUrl = 'https://www.figma.com/proto/Oppe8meMyYmzaSeEpXeSfZ/NEON---Styleguide?node-id=736%3A3056&scaling=scale-down-width';

  return (
    <React.Fragment>

      <DocBlock>
        This page contains examples of all stock Material UI components with NEON Theme style
        overrides for parity with the <Link href={styleGuideUrl}>NEON Drupal Style Guide</Link>.
      </DocBlock>

      {/* Button */}
      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Button</Typography>

      <div className={classes.row}>
        <Button size="small">
          Text
        </Button>
        <Button size="medium">
          Text
        </Button>
        <Button size="large">
          Text
        </Button>
        <Button size="small" disabled>
          Text
        </Button>
        <Button size="medium" disabled>
          Text
        </Button>
        <Button size="large" disabled>
          Text
        </Button>
      </div>
      <div className={classes.row}>
        <Button variant="outlined" size="small" startIcon={<LeftIcon />}>
          Outlined
        </Button>
        <Button variant="outlined" size="medium" startIcon={<LeftIcon />}>
          Outlined
        </Button>
        <Button variant="outlined" size="large" startIcon={<LeftIcon />}>
          Outlined
        </Button>
        <Button variant="outlined" size="small" disabled>
          Outlined
        </Button>
        <Button variant="outlined" size="medium" disabled>
          Outlined
        </Button>
        <Button variant="outlined" size="large" disabled>
          Outlined
        </Button>
      </div>
      <div className={classes.row}>
        <Button variant="contained" size="small" endIcon={<RightIcon />}>
          Contained
        </Button>
        <Button variant="contained" size="medium" endIcon={<RightIcon />}>
          Contained
        </Button>
        <Button variant="contained" size="large" endIcon={<RightIcon />}>
          Contained
        </Button>
        <Button variant="contained" size="small" disabled>
          Contained
        </Button>
        <Button variant="contained" size="medium" disabled>
          Contained
        </Button>
        <Button variant="contained" size="large" disabled>
          Contained
        </Button>
      </div>
      <div className={classes.row}>
        <IconButton size="small">
          <InfoIcon />
        </IconButton>
        <IconButton size="small" disabled>
          <CloseIcon />
        </IconButton>
        <IconButton>
          <InfoIcon />
        </IconButton>
        <IconButton disabled>
          <CloseIcon />
        </IconButton>
      </div>

      {/* Card */}
      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Card</Typography>

      <div className={classes.row}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Callout
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              The styleguide refers to it as a Callout; Material UI uses Card. Same thing.
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined">
              Share
            </Button>
            <Button variant="outlined">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </div>
      <div className={classes.row}>
        <Card>
          <CardContent style={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon
              fontSize="large"
              style={{ color: Theme.palette.grey[300], marginRight: Theme.spacing(2) }}
            />
            <Typography variant="body2" component="p">
              Some info that is important to know about
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* ToggleButton */}
      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>ToggleButton</Typography>

      <div className={classes.row}>
        <ToggleButtonGroup size="small" value="one">
          <ToggleButton value="one">One</ToggleButton>
          <ToggleButton value="two">Two</ToggleButton>
          <ToggleButton value="three">Three</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup value="two">
          <ToggleButton value="one">One</ToggleButton>
          <ToggleButton value="two">Two</ToggleButton>
          <ToggleButton value="three">Three</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="large" value="three">
          <ToggleButton value="one">One</ToggleButton>
          <ToggleButton value="two">Two</ToggleButton>
          <ToggleButton value="three">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>

    </React.Fragment>
  );
}
