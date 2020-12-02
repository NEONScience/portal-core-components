import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { useId } from 'react-id-generator';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
    marginBottom: theme.spacing(0.5),
    backgroundColor: '#fff',
  },
  descriptionContainer: {
    marginTop: theme.spacing(0.5),
  },
  descriptionFlexInnerContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
    marginTop: theme.spacing(1),
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
  menuItemSubtitle: {
    color: theme.palette.grey[400],
  },
  horizontalFlex: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  horizontalDescriptions: {
    marginLeft: Theme.spacing(3),
    '& > div:first-child': {
      marginTop: '-2px !important',
    },
  },
}));

const UNSPECIFIED_NAME = 'Latest and Provisional';
const UNSPECIFIED_DESCRIPTION = 'Data in the latest release in addition to provisional data (not yet in any release)';
const DOI_TITLE = 'Digital Object Identifier (DOI) - A citable permanent link to this this data product release';

const formatGenerationDate = (generationDate) => {
  const generationMoment = moment(generationDate);
  return generationMoment ? generationMoment.format('MMMM D, YYYY') : null;
};

const ReleaseFilter = (props) => {
  const classes = useStyles(Theme);
  const {
    excludeNullRelease,
    horizontal,
    maxWidth,
    nullReleaseProductCount,
    onChange,
    releases: releasesProp,
    selected,
    showDoi,
    showGenerationDate,
    showProductCount,
    skeleton,
    title,
    ...otherProps
  } = props;

  const [instanceId] = useId();
  const inputId = `release-filter-input-${instanceId}`;
  const labelId = `release-filter-label-${instanceId}`;

  const releases = [...releasesProp || []].sort(
    (a, b) => (a.generationDate > b.generationDate ? -1 : 1),
  );

  // SANITY CHECK: Render nothing if there are no releases and null release is excluded
  const optionCount = releases.length + (excludeNullRelease ? 0 : 1);
  if (!optionCount) { return null; }

  const findReleaseObject = release => releases.find(entry => entry.release === release) || null;
  const findRelease = release => (findReleaseObject(release) || {}).release || null;
  const getProductCount = (release) => {
    if (!release) { return null; }
    if (Array.isArray(release.dataProducts)) {
      return release.dataProducts.length;
    }
    if (Array.isArray(release.dataProductCodes)) {
      return release.dataProductCodes.length;
    }
    return null;
  };

  let selectedRelease = findRelease(selected);
  if (!selectedRelease && excludeNullRelease) { selectedRelease = releases[0].release; }
  const selectedReleaseObject = findReleaseObject(selectedRelease);

  const handleChange = (newRelease) => {
    const validatedNewRelease = newRelease === UNSPECIFIED_NAME ? null : findRelease(newRelease);
    if (validatedNewRelease === selectedRelease) { return; }
    onChange(validatedNewRelease);
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

  const titleNode = !title ? null : (
    <Typography variant="h5" component="h3" className={classes.title} id={labelId}>
      {title}
    </Typography>
  );

  // Render skeleton
  if (skeleton) {
    const skeletonStyle = { marginBottom: Theme.spacing(1) };
    return (
      <div {...(otherProps || {})} style={{ maxWidth: `${maxWidth}px`, overflow: 'hidden' }}>
        {titleNode}
        <Skeleton variant="rect" width={maxWidth} height={36} style={skeletonStyle} />
        <Skeleton width="70%" height={16} style={skeletonStyle} />
      </div>
    );
  }

  // Unspecified Node
  const unspecifiedNode = selectedRelease !== null ? null : (
    <div className={classes.descriptionContainer}>
      <Typography variant="caption" className={classes.description}>
        {UNSPECIFIED_DESCRIPTION}
      </Typography>
    </div>
  );

  // Generation Date Node
  let generationDateNode = null;
  if (showGenerationDate && selectedRelease !== null) {
    generationDateNode = (
      <div className={classes.descriptionContainer}>
        <Typography variant="caption" className={classes.description}>
          {`Generated: ${formatGenerationDate(selectedReleaseObject.generationDate)}`}
        </Typography>
      </div>
    );
  }

  // Product Count Node
  let productCountNode = null;
  if (showProductCount) {
    if (selectedRelease === null) {
      productCountNode = nullReleaseProductCount === null ? null : (
        <div className={classes.descriptionContainer}>
          <Typography variant="caption" className={classes.description}>
            {`${nullReleaseProductCount} data products`}
          </Typography>
        </div>
      );
    } else {
      const productCount = getProductCount(selectedReleaseObject);
      productCountNode = (
        <div className={classes.descriptionContainer}>
          <Typography variant="caption" className={classes.description}>
            {productCount !== null ? `${productCount} data products` : 'Unknown data product count'}
          </Typography>
        </div>
      );
    }
  }

  // DOI Node
  let doiNode = null;
  if (showDoi && selectedRelease !== null) {
    doiNode = (
      <div className={classes.descriptionContainer}>
        <div className={classes.descriptionFlexInnerContainer}>
          <Typography
            variant="caption"
            title={DOI_TITLE}
            className={classes.description}
            style={{ marginRight: '4px' }}
          >
            DOI:
          </Typography>
          <Typography
            variant="caption"
            aria-label="doi"
            className={classes.description}
            style={{ overflowWrap: 'anywhere' }}
          >
            {selectedReleaseObject.url}
          </Typography>
        </div>
        <CopyToClipboard text={selectedReleaseObject.url}>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            className={classes.copyButton}
            title={`Copy DOI: ${selectedReleaseObject.url}`}
          >
            <CopyIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
            Copy DOI
          </Button>
        </CopyToClipboard>
      </div>
    );
  }

  // Select Node
  const menuItemSubtitleProps = {
    display: 'block',
    variant: 'caption',
    className: classes.menuItemSubtitle,
  };
  const selectNode = (
    <Select
      data-selenium="release-filter"
      value={selectedRelease || UNSPECIFIED_NAME}
      onChange={event => handleChange(event.target.value)}
      input={input}
      aria-labelledby={labelId}
      renderValue={value => value}
      disabled={optionCount < 2}
    >
      {excludeNullRelease ? null : (
        <MenuItem value={UNSPECIFIED_NAME}>
          <div>
            <Typography display="block">
              {UNSPECIFIED_NAME}
            </Typography>
            <Typography {...menuItemSubtitleProps}>
              {UNSPECIFIED_DESCRIPTION}
            </Typography>
            {!showProductCount || nullReleaseProductCount === null ? null : (
              <Typography {...menuItemSubtitleProps}>
                {`${nullReleaseProductCount} data products`}
              </Typography>
            )}
          </div>
        </MenuItem>
      )}
      {releases.map((entry) => {
        const { release, generationDate } = entry;
        const productCount = getProductCount(entry);
        const productCountSubtitle = productCount !== null
          ? `${productCount} data products`
          : 'Unknown data product count';
        return (
          <MenuItem key={release} value={release}>
            <div>
              <Typography display="block">
                {release}
              </Typography>
              {!showGenerationDate ? null : (
                <Typography {...menuItemSubtitleProps}>
                  {`Generated: ${formatGenerationDate(generationDate)}`}
                </Typography>
              )}
              {!showProductCount ? null : (
                <Typography {...menuItemSubtitleProps}>
                  {productCountSubtitle}
                </Typography>
              )}
            </div>
          </MenuItem>
        );
      })}
    </Select>
  );

  // Final Render
  return horizontal ? (
    <div {...otherProps}>
      <div>
        {titleNode}
      </div>
      <div className={classes.horizontalFlex}>
        <div style={maxWidth ? { width: `${maxWidth}px` } : {}}>
          {selectNode}
        </div>
        <div className={classes.horizontalDescriptions}>
          {unspecifiedNode}
          {generationDateNode}
          {productCountNode}
          {doiNode}
        </div>
      </div>
    </div>
  ) : (
    <div {...otherProps} style={{ width: '100%', ...maxWidthStyle }}>
      {titleNode}
      {selectNode}
      {unspecifiedNode}
      {generationDateNode}
      {productCountNode}
      {doiNode}
    </div>
  );
};

ReleaseFilter.propTypes = {
  excludeNullRelease: PropTypes.bool,
  horizontal: PropTypes.bool,
  maxWidth: PropTypes.number,
  nullReleaseProductCount: PropTypes.number,
  onChange: PropTypes.func,
  releases: PropTypes.arrayOf(
    PropTypes.shape({
      release: PropTypes.string.isRequired,
      generationDate: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
  ),
  selected: PropTypes.string,
  showDoi: PropTypes.bool,
  showGenerationDate: PropTypes.bool,
  showProductCount: PropTypes.bool,
  skeleton: PropTypes.bool,
  title: PropTypes.string,
};

ReleaseFilter.defaultProps = {
  excludeNullRelease: false,
  horizontal: false,
  maxWidth: 236,
  nullReleaseProductCount: null,
  onChange: () => {},
  releases: [],
  selected: null,
  showDoi: false,
  showGenerationDate: false,
  showProductCount: false,
  skeleton: false,
  title: 'Release',
};

const WrappedReleaseFilter = Theme.getWrappedComponent(ReleaseFilter);

export default WrappedReleaseFilter;
