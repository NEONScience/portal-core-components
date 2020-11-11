/* eslint no-unused-vars: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useId } from 'react-id-generator';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import CopyIcon from '@material-ui/icons/Assignment';

import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  selectInput: {
    width: '100%',
  },
  doiInput: {
    width: '100%',
    marginTop: theme.spacing(1),
    '& input': {
      backgroundColor: '#fff',
      padding: '10.5px',
      borderLeft: `1px solid ${theme.palette.grey[300]}`,
    },
  },
  doiLabel: {
    '& > p': {
      fontWeight: 700,
      color: theme.palette.grey[400],
    },
    backgroundColor: theme.palette.grey[100],
  },
  descriptionContainer: {
    marginTop: theme.spacing(1),
  },
  descriptionFlexInnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
  },
  description: {
    display: 'block',
    color: theme.palette.grey[400],
    overflowWrap: 'break-word',
  },
  descriptionLabel: {
    fontWeight: 700,
    color: theme.palette.grey[400],
    marginRight: theme.spacing(1),
  },
  copyButton: {
    backgroundColor: '#fff',
    '& svg': {
      width: '0.9rem',
      height: '0.9rem',
    },
  },
  copyButtonAdornment: {
    padding: Theme.spacing(1.25, 1),
    backgroundColor: '#fff',
    marginRight: Theme.spacing(-1.75),
    '& svg': {
      width: '0.9rem',
      height: '0.9rem',
    },
  },
}));

const UNSPECIFIED = 'n/a';

const ReleaseFilter = (props) => {
  const classes = useStyles(Theme);
  const {
    maxWidth,
    onChange,
    releases: releasesProp,
    selected,
    skeleton,
    title,
    ...otherProps
  } = props;

  const [instanceId] = useId();
  const inputId = `release-filter-input-${instanceId}`;
  const labelId = `release-filter-label-${instanceId}`;

  const releases = [...releasesProp || []];
  releases.sort((a, b) => a.name > b.name);
  releases.unshift({
    name: UNSPECIFIED,
    doi: null,
    description: 'No release specified - show all released and provisional data',
  });

  const findRelease = name => releases.find(release => release.name === name) || releases[0];

  const initialRelease = findRelease(selected);
  const [selectedRelease, setSelectedRelease] = useState(initialRelease.name);
  const currentRelease = findRelease(selectedRelease);

  const handleChange = (newReleaseName) => {
    const newRelease = findRelease(newReleaseName);
    setSelectedRelease(newRelease.name);
    onChange(newRelease.name);
  };

  const maxWidthStyle = maxWidth ? { maxWidth: `${maxWidth}px` } : {};

  const input = (
    <OutlinedInput
      id={inputId}
      name={inputId}
      margin="dense"
      className={classes.selectInput}
      style={maxWidthStyle}
    />
  );

  const titleNode = (
    <Typography variant="h5" component="h3" className={classes.title} id={labelId}>
      {title}
    </Typography>
  );

  if (skeleton) {
    const skeletonStyle = { marginBottom: Theme.spacing(1) };
    return (
      <div {...(otherProps || {})} style={{ maxWidth: `${maxWidth}px` }}>
        {titleNode}
        <Skeleton variant="rect" width={maxWidth} height={36} style={skeletonStyle} />
        <Skeleton width="70%" height={16} style={skeletonStyle} />
      </div>
    );
  }

  let descriptionNode = null;
  const doiTitle = "Digital Object Identifier - A citable permanent link to this this data product release";
  if (currentRelease.doi) {
    /*
    descriptionNode = (
      <OutlinedInput
        margin="dense"
        title={currentRelease.doi}
        value={currentRelease.doi}
        className={classes.doiInput}
        startAdornment={(
          <InputAdornment position="start" className={classes.doiLabel}>
            DOI:
          </InputAdornment>
        )}
        endAdornment={(
          <InputAdornment position="end" style={{ marginLeft: '0px' }}>
            <CopyToClipboard text={currentRelease.doi}>
              <Button
                color="primary"
                variant="outlined"
                size="small"
                className={classes.copyButtonAdornment}
              >
                <CopyIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
                Copy
              </Button>
            </CopyToClipboard>
          </InputAdornment>
        )}
        inputProps={{
          'aria-label': 'weight',
        }}
        labelWidth={0}
        style={maxWidthStyle}
      />
    );
    */
    descriptionNode = (
      <div className={classes.descriptionContainer}>
        <div className={classes.descriptionFlexInnerContainer}>
          <Typography
            variant="subtitle2"
            className={classes.descriptionLabel}
            title={doiTitle}
          >
            DOI
          </Typography>
          <CopyToClipboard text={currentRelease.doi}>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              className={classes.copyButton}
              title={`Copy DOI: ${currentRelease.doi}`}
            >
              <CopyIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
              Copy
            </Button>
          </CopyToClipboard>
        </div>
        <Typography variant="caption" aria-label="doi" className={classes.description}>
          {currentRelease.doi}
        </Typography>
      </div>
    );
  } else if (currentRelease.description) {
    descriptionNode = (
      <div className={classes.descriptionContainer}>
        <Typography variant="caption" className={classes.description}>
          {currentRelease.description}
        </Typography>
      </div>
    );
  }

  return (
    <div {...otherProps} style={{ width: '100%', ...maxWidthStyle }}>
      {titleNode}
      <Select
        data-selenium="release-filter"
        value={selectedRelease}
        onChange={event => handleChange(event.target.value)}
        input={input}
        aria-labelledby={labelId}
        renderValue={value => value}
        disabled={releases.length <= 1}
      >
        {releases.map((release) => {
          const { name, doi, description } = release;
          return (
            <MenuItem key={name} value={name}>
              <div>
                <Typography display="block">
                  {name}
                </Typography>
                <Typography display="block" variant="caption">
                  {description || `DOI: ${doi}`}
                </Typography>
              </div>
            </MenuItem>
          );
        })}
      </Select>
      {descriptionNode}
    </div>
  );
};

ReleaseFilter.propTypes = {
  maxWidth: PropTypes.number,
  onChange: PropTypes.func,
  releases: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      doi: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  selected: PropTypes.string,
  skeleton: PropTypes.bool,
  title: PropTypes.string,
};

ReleaseFilter.defaultProps = {
  maxWidth: null,
  onChange: () => {},
  releases: [],
  selected: null,
  skeleton: false,
  title: 'Release',
};

const WrappedReleaseFilter = Theme.getWrappedComponent(ReleaseFilter);

export default WrappedReleaseFilter;
