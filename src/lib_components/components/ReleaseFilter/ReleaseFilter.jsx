/* eslint no-unused-vars: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useId } from 'react-id-generator';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  input: {
    width: '100%',
  },
  description: {
    display: 'block',
    marginTop: theme.spacing(1),
    color: theme.palette.grey[400],
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

  const releases = [...releasesProp];
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

  const input = (
    <OutlinedInput
      id={inputId}
      name={inputId}
      margin="dense"
      className={classes.input}
      style={{ width: `${maxWidth}px` }}
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

  return (
    <div {...otherProps} style={{ maxWidth: `${maxWidth}px` }}>
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
      <Typography variant="caption" className={classes.description}>
        {currentRelease.description || `DOI: ${currentRelease.doi || 'n/a'}`}
      </Typography>
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
  ).isRequired,
  selected: PropTypes.string,
  skeleton: PropTypes.bool,
  title: PropTypes.string,
};

ReleaseFilter.defaultProps = {
  maxWidth: 300,
  onChange: () => {},
  selected: null,
  skeleton: false,
  title: 'Release',
};

const WrappedReleaseFilter = Theme.getWrappedComponent(ReleaseFilter);

export default WrappedReleaseFilter;
