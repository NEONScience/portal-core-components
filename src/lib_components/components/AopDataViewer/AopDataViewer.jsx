import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { of, map, catchError } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import dateFormat from 'dateformat';

import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import SnackbarContent from '@mui/material/SnackbarContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import BackYearIcon from '@mui/icons-material/KeyboardArrowLeft';
import ForwardYearIcon from '@mui/icons-material/KeyboardArrowRight';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningIcon from '@mui/icons-material/Warning';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import MapSelectionButton from '../MapSelectionButton/MapSelectionButton';

const MIN_IFRAME_WIDTH = 240;

/**
   Setup: CSS classes
*/
const useStyles = makeStyles((theme) => ({
  selectionForm: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  iframe: {
    minWidth: `${MIN_IFRAME_WIDTH}px`,
    minHeight: `${MIN_IFRAME_WIDTH}px`,
    border: `1px solid ${theme.palette.grey[700]}`,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  label: {
    color: theme.palette.grey[500],
    fontSize: '0.9rem',
    marginBottom: theme.spacing(0.5),
  },
  optgroup: {
    fontWeight: Theme.typography.fontWeightMedium,
  },
  tooltipIconButton: {
    marginTop: theme.spacing(-0.5),
    marginLeft: theme.spacing(0.5),
  },
  openInNewLink: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(0.5),
    fontSize: '0.8rem',
  },
  openInNewIcon: {
    fontSize: '0.95rem',
    margin: theme.spacing(0, 0.5, -0.25, 0),
  },
}));

/**
   Function: Parse the response from the Visus API from its original shape
   into an object keyed by sites each containing an object keyed by years
   each containing an array of flights. Each flight contains the month and URL.
*/
/* eslint-disable no-param-reassign, function-paren-newline */
const parseFetchResponse = (response) => response.data.siteCodes.reduce(
  (obj, site) => {
    obj[site.siteCode] = site.availableMonths.reduce(
      (siteObj, yearMonth, idx) => {
        const year = parseInt(yearMonth.substr(0, 4), 10);
        const month = yearMonth.substr(5, 2);
        if (!siteObj[year]) { siteObj[year] = []; }
        siteObj[year].push({
          month,
          url: site.availableDataUrls[idx],
        });
        return siteObj;
      }, {},
    );
    return obj;
  }, {},
);
/* eslint-enable no-param-reassign, function-paren-newline */

/**
   Functions to get slider marks and bounds
   Limit slider marks to one per year where the year is the slider value
*/
const getCurrentSliderMarks = (currentYears) => Array.from(
  new Set(
    Object.keys(currentYears || {})
      .sort()
      .map((year) => ({ label: year, value: year })),
  ),
);

const getCurrentSliderBounds = (currentYears) => {
  const years = Object.keys(currentYears).sort();
  if (years < 2) { return null; }
  return {
    min: parseInt(years[0], 10) - 1,
    max: parseInt(years[years.length - 1], 10) + 1,
  };
};

/**
   Main Function
*/
const AopDataViewer = (props) => {
  const classes = useStyles(Theme);
  const {
    productCode,
    showTitle,
    fillContainer,
    showOpenInNewWindow,
  } = props;

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites, states } = neonContextData;

  const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
  const atSm = useMediaQuery(Theme.breakpoints.only('sm'));

  /**
     Getters for site description and data set title
  */
  const getSiteDescription = (site, includeState = true) => {
    if (sites[site]) {
      const state = includeState ? `, ${sites[site].stateCode}` : '';
      return `${sites[site].description}${state}`;
    }
    return null;
  };

  const getDataSetTitle = (selection, data) => {
    if (!selection || !data) { return ''; }
    const { site, year, flight } = selection;
    if (!site || !year || !flight) { return ''; }
    const flightIdx = flight - 1;
    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) { return ''; }
    const parts = {
      site: getSiteDescription(site),
      date: dateFormat(new Date(`${year}-${data[site][year][flightIdx].month}-02`), 'mmmm yyyy'),
      flight: `Flight ${flight}/${data[site][year].length}`,
    };
    return `${parts.site} -- ${parts.date} -- ${parts.flight}`;
  };

  /**
     State: data
     Object, keyed by site code and then year, with each year containing an array of flight objects.
  */
  const [data, setData] = useState({});

  /**
     State: iFrame Width
     Keep iFrame width in state to trigger re-renders as necessary on resize, including
     keeping the component at its maximum width at all times and with an appropriate
     aspect ratio given the width.
  */
  const iframeRef = useRef(null);

  /**
     State: currentSelection
     Object containing current site, year, and flight to show in the iframe
  */
  const { initialSite, initialYear, initialFlight } = props;
  const initialCurrentSelection = {
    site: initialSite || null,
    year: initialYear || null,
    flight: initialFlight || null,
    sliderMarks: [],
    sliderBounds: { min: 2010, max: 2050 },
  };
  const [currentSelection, setCurrentSelection] = useState(initialCurrentSelection);
  const handleSiteChange = useCallback((site = null) => {
    if (!data || !Object.keys(data).length) { return; }
    let newSite = site;
    if (site === null) {
      newSite = initialSite || Object.keys(data)[0];
    }
    if (!data[newSite] || !Object.keys(data[newSite]).length) { return; }
    let newYear = parseInt(Object.keys(data[newSite]).sort().reverse()[0], 10);
    if (site === null && initialYear && data[newSite][initialYear]) {
      newYear = initialYear;
    }
    if (!data[newSite][newYear].length) { return; }
    let newFlight = data[newSite][newYear].length;
    if (site === null && initialFlight && data[newSite][newYear][initialFlight - 1]) {
      newFlight = initialFlight;
    }
    setCurrentSelection({
      site: newSite,
      year: newYear,
      flight: newFlight,
      sliderMarks: getCurrentSliderMarks(data[newSite]),
      sliderBounds: getCurrentSliderBounds(data[newSite]),
    });
  }, [initialSite, initialYear, initialFlight, data]);
  const handleSliderChange = (year) => {
    const validYears = Object.keys(data[currentSelection.site]).map((y) => parseInt(y, 10));
    if (!year || !validYears.includes(year) || year === currentSelection.year) { return; }
    const flight = data[currentSelection.site][year].length;
    setCurrentSelection((previousCurrentSelection) => ({
      ...previousCurrentSelection,
      year,
      flight,
    }));
  };
  const handleSliderButtonClick = (direction) => {
    if (!['next', 'previous'].includes(direction)) { return; }
    const validYears = Object.keys(data[currentSelection.site]).map((y) => parseInt(y, 10));
    const currentYearIdx = validYears.indexOf(currentSelection.year);
    const nudge = direction === 'next' ? 1 : -1;
    const newYear = validYears[currentYearIdx + nudge];
    if (!newYear) { return; }
    handleSliderChange(newYear);
  };
  const handleFlightChange = (flight) => {
    if (Number.isNaN(flight) || !data[currentSelection.site][currentSelection.year][flight - 1]) {
      return;
    }
    setCurrentSelection((previousCurrentSelection) => ({
      ...previousCurrentSelection,
      flight,
    }));
  };
  const getCurrentIframeSrc = () => {
    const { site, year, flight } = currentSelection;
    if (!site || !year || !flight) { return ''; }
    const flightIdx = flight - 1;
    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) { return ''; }
    const yearData = data[site][year];
    if (!yearData[flightIdx].month) { return ''; }
    const yearFlightMonth = yearData[flightIdx].month;
    const currentDataUrl = data[site][year][flightIdx].url;
    const queryParams = `&dataproduct=${productCode}&site=${site}&month=${year}-${yearFlightMonth}`;
    const appliedDataUrl = `${currentDataUrl}${queryParams}`;
    const title = encodeURIComponent(getDataSetTitle(currentSelection, data));
    return `${NeonEnvironment.getVisusIframeBaseUrl()}?${appliedDataUrl}&title=${title}`;
  };

  /**
     State: fetchCalled, fetchSucceeded, and fetchFailed
     Booleans for whether the initial data availability fetch has been called,
     whether it has completed (resolved OK or with an error), and whether it failed.
  */
  const [fetchCalled, setFetchCalled] = useState(false);
  const [fetchSucceeded, setFetchSucceeded] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  /**
     Effect: fetch and parse available data
  */
  const handleFetchProductByCode = useCallback(() => ajax({
    method: 'GET',
    url: `${NeonEnvironment.getVisusProductsBaseUrl()}/${productCode}`,
    crossDomain: true,
  }).pipe(
    map((response) => {
      if (!response
          || !response.response
          || !response.response.data
          || !response.response.data.siteCodes
          || (response.response.data.siteCodes.length <= 0)) {
        throw Error('Product response contained no data');
      }
      setData(parseFetchResponse(response.response));
      setFetchSucceeded(true);
    }),
    catchError(() => {
      setFetchFailed(true);
      return of('Product not found');
    }),
  ).subscribe(), [productCode]);

  useEffect(() => {
    if (!fetchCalled) {
      handleFetchProductByCode();
      setFetchCalled(true);
    }
    if (fetchSucceeded && (!currentSelection.site || !currentSelection.sliderMarks.length)) {
      handleSiteChange();
    }
  }, [fetchCalled, fetchSucceeded, currentSelection, handleFetchProductByCode, handleSiteChange]);

  const renderSiteSelect = () => {
    const sitesByStateName = {};
    Object.keys(data).forEach((site) => {
      if (!sites[site]) { return; }
      const stateName = states[sites[site].stateCode].name;
      if (!sitesByStateName[stateName]) { sitesByStateName[stateName] = []; }
      sitesByStateName[stateName].push(site);
    });
    const menuItems = Object.keys(sitesByStateName)
      .sort()
      .flatMap((stateName) => [
        <MenuItem
          key={stateName}
          value={stateName}
          className={classes.optgroup}
          style={{ opacity: 1 }}
          disabled
        >
          {stateName}
        </MenuItem>,
      ].concat(sitesByStateName[stateName].map((site) => (
        <MenuItem key={site} value={site}>
          <div>
            <Typography display="block">
              {site}
            </Typography>
            <Typography display="block" variant="caption">
              {getSiteDescription(site, false)}
            </Typography>
          </div>
        </MenuItem>
      ))));
    return (
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <MapSelectionButton
          selection="SITES"
          selectionLimit={1}
          selectedItems={currentSelection.site ? [currentSelection.site] : []}
          validItems={Object.keys(data)}
          buttonProps={{ style: { marginRight: Theme.spacing(1) } }}
          onSave={(newSites) => { handleSiteChange([...newSites][0]); }}
          icon={!atSm}
        />
        <Select
          data-selenium="aop-data-viewer.site-select"
          value={currentSelection.site || ''}
          onChange={(event) => handleSiteChange(event.target.value)}
          input={<OutlinedInput name="site" id="site" margin="dense" />}
          aria-labelledby="site-label"
          renderValue={(value) => value}
        >
          {menuItems}
        </Select>
      </div>
    );
  };

  const renderYearSlider = () => {
    if (!currentSelection.year) { return null; }
    return (
      <div style={{ width: '100%', display: 'flex' }}>
        <div style={{ flexGrow: 0 }}>
          <IconButton
            data-selenium="aop-data-viewer.previous-year-button"
            size="small"
            color="primary"
            aria-label="previous year"
            style={{ marginRight: Theme.spacing(0.5) }}
            onClick={() => handleSliderButtonClick('previous')}
            disabled={currentSelection.year === currentSelection.sliderBounds.min + 1}
          >
            <BackYearIcon />
          </IconButton>
        </div>
        <div style={{ flexGrow: 1 }}>
          <Slider
            data-selenium="aop-data-viewer.year-slider"
            value={currentSelection.year}
            step={null}
            marks={currentSelection.sliderMarks}
            min={currentSelection.sliderBounds.min}
            max={currentSelection.sliderBounds.max}
            aria-labelledby="year-label"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value}
            onChange={(event, newYear) => handleSliderChange(parseInt(newYear, 10))}
          />
        </div>
        <div style={{ flexGrow: 0 }}>
          <IconButton
            data-selenium="aop-data-viewer.next-year-button"
            size="small"
            color="primary"
            aria-label="next year"
            style={{ marginLeft: Theme.spacing(0.5) }}
            onClick={() => handleSliderButtonClick('next')}
            disabled={currentSelection.year === currentSelection.sliderBounds.max - 1}
          >
            <ForwardYearIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  const renderFlightSelect = () => {
    const { site, year, flight } = currentSelection;
    if (!flight || !data[site] || !data[site][year] || !data[site][year].length) { return null; }
    const total = data[site][year].length;
    const getFlightLabel = (flightNumber, month) => (
      `${flightNumber}/${total} (${dateFormat(new Date(`2000-${month}-02`), 'mmmm')})`
    );
    return (
      <Select
        data-selenium="aop-data-viewer.flight-select"
        value={flight}
        onChange={(event) => handleFlightChange(parseInt(event.target.value, 10))}
        input={<OutlinedInput name="flight" id="flight" margin="dense" />}
        aria-labelledby="flight-label"
        renderValue={(value) => getFlightLabel(value, data[site][year][value - 1].month)}
        disabled={total === 1}
      >
        {data[site][year].map((f, idx) => (
          <MenuItem key={`${f.url}`} value={idx + 1}>
            {getFlightLabel(idx + 1, f.month)}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const renderInputLabel = (input, tooltip = null) => (
    <Typography className={classes.label} id={`${input}-label`}>
      {`${input.substr(0, 1).toUpperCase()}${input.substr(1)}`}
      {tooltip ? (
        <Tooltip placement="right" title={tooltip}>
          <IconButton size="small" className={classes.tooltipIconButton} aria-label={tooltip}>
            <InfoIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Typography>
  );

  const tooltips = {
    site: 'Use the map or the menu below to select a site to display. Only one site can be viewed at a time.',
    year: 'This slider can be used to move back and forth through time for a given site.',
    flight: 'Most sites are visited once per year, but sometimes subsequent flights are necessary to get complete data for that year. If more than one flight is available for a given site/year then this field can be used to select particular flights of interest.',
  };
  const visusLink = (
    <Link
      href="https://visus.org/"
      target="_blank"
      data-external="VISUS"
      rel="noopener noreferrer"
    >
      Visus Project at the Univeristy of Utah
    </Link>
  );
  const renderSelectionForm = () => (
    <form className={classes.selectionForm} autoComplete="off">
      {showTitle ? (
        <Typography variant="h5" gutterBottom>
          AOP Data Viewer
        </Typography>
      ) : null}
      <Typography variant="caption" gutterBottom>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        This viewer allows for interactive exploration of remotely sensed data
        from the Airborne Observation Platform (AOP). Change the field site and
        flight for this data product using the tools below to stream different
        data into view. Pan and zoom in the view to stream higher resolution
        imagery. This pilot data viewer is provided through a collaboration with
        the {visusLink} and more updates are planned for the future.
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </Typography>
      <Divider className={classes.divider} />
      {belowSm
        ? (
          <>
            <Grid container spacing={2} justifyContent="center" style={{ marginBottom: Theme.spacing(1) }}>
              <Grid item xs={2}>{renderInputLabel('site', tooltips.site)}</Grid>
              <Grid item xs={10}>
                {renderSiteSelect()}
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" style={{ marginBottom: Theme.spacing(1) }}>
              <Grid item xs={2}>{renderInputLabel('year', tooltips.year)}</Grid>
              <Grid item xs={10}>{renderYearSlider()}</Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" style={{ marginBottom: Theme.spacing(1) }}>
              <Grid item xs={2}>{renderInputLabel('flight', tooltips.flight)}</Grid>
              <Grid item xs={10}>{renderFlightSelect()}</Grid>
            </Grid>
          </>
        ) : (
          <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ flexGrow: 0 }}>
              {renderInputLabel('site', tooltips.site)}
              {renderSiteSelect()}
            </div>
            <div style={{ flexGrow: 1, margin: Theme.spacing(0, 2) }}>
              {renderInputLabel('year', tooltips.year)}
              {renderYearSlider()}
            </div>
            <div style={{ flexGrow: 0 }}>
              {renderInputLabel('flight', tooltips.flight)}
              {renderFlightSelect()}
            </div>
          </div>
        )}
    </form>
  );

  if (fetchFailed) {
    return (
      <div className={classes.iframeContainer}>
        <SnackbarContent
          style={{ backgroundColor: Theme.palette.error.main }}
          message={(
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon style={{ marginRight: Theme.spacing(1) }} />
              AOP Data Viewer is not available for this data product.
            </span>
          )}
        />
      </div>
    );
  }

  const srcUrl = getCurrentIframeSrc();

  return (
    <FullWidthVisualization
      vizRef={iframeRef}
      minWidth={MIN_IFRAME_WIDTH}
      allowHeightResize={fillContainer}
      deriveHeightFromWidth={!fillContainer ? 'auto' : (width, container, viz) => (
        (container.clientHeight - viz.offsetTop) - 10
      )}
      containerStyle={!fillContainer ? null : {
        minWidth: `${MIN_IFRAME_WIDTH}px`,
        position: 'absolute',
        top: Theme.spacing(3),
        left: Theme.spacing(3),
        right: Theme.spacing(3),
        bottom: Theme.spacing(3),
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
      data-selenium="aop-data-viewer"
    >
      {renderSelectionForm()}
      <iframe
        src={srcUrl}
        title={getDataSetTitle(currentSelection)}
        ref={iframeRef}
        scrolling="no"
        className={classes.iframe}
      />
      {!showOpenInNewWindow ? null : (
        <Link
          href={srcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.openInNewLink}
        >
          <OpenInNewIcon className={classes.openInNewIcon} />
          Open in New Window
        </Link>
      )}
    </FullWidthVisualization>
  );
};

AopDataViewer.propTypes = {
  productCode: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  initialSite: PropTypes.string,
  initialYear: PropTypes.number,
  initialFlight: PropTypes.number,
  fillContainer: PropTypes.bool,
  showOpenInNewWindow: PropTypes.bool,
};

AopDataViewer.defaultProps = {
  showTitle: true,
  initialSite: null,
  initialYear: null,
  initialFlight: null,
  fillContainer: false,
  showOpenInNewWindow: false,
};

const WrappedAopDataViewer = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(AopDataViewer),
);

export default WrappedAopDataViewer;
