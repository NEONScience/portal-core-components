import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import MomentUtils from '@date-io/moment';
import moment from 'moment';

import { SvgDefs } from '../DataProductAvailability/AvailabilitySvgComponents';
import { SVG } from '../DataProductAvailability/AvailabilityUtils';
import BasicAvailabilityGrid from '../DataProductAvailability/BasicAvailabilityGrid';
import BasicAvailabilityKey from '../DataProductAvailability/BasicAvailabilityKey';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import NeonContext from '../NeonContext/NeonContext';
import ReleaseService from '../../service/ReleaseService';
import Theme from '../Theme/Theme';

import TimeSeriesViewerContext, {
  POINTS_PERFORMANCE_LIMIT,
} from './TimeSeriesViewerContext';

const getYearMonthMoment = (yearMonth, day = 15) => (
  moment(`${yearMonth}-${day.toString().padStart(2, '0')}`)
);

const svgMinWidth = (SVG.CELL_WIDTH + SVG.CELL_PADDING) * SVG.MIN_CELLS
  + Math.floor(SVG.MIN_CELLS / 12) * SVG.YEAR_PADDING;
const svgMinHeight = (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (SVG.MIN_ROWS + 1);
const useStyles = makeStyles(() => ({
  svg: {
    minWidth: `${svgMinWidth}px`,
    minHeight: `${svgMinHeight}px`,
  },
  optionsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  optionContainer: {
    marginRight: Theme.spacing(5),
    flexGrow: 1,
    flexBasis: 0.5,
  },
  slider: {
    minWidth: Theme.spacing(40),
    width: `calc(100% - ${Theme.spacing(6)}px)`,
    marginLeft: Theme.spacing(3),
    marginBottom: Theme.spacing(4),
  },
}));

const TimeSeriesViewerDateRange = (props) => {
  const classes = useStyles(Theme);
  const { dateRangeSliderRef } = props;
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites } = neonContextData;
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const { dateRange: currentRange } = state.selection;
  let selectableRange = state.product.dateRange;
  const displayRange = state.product.continuousDateRange;
  const displayMin = 0;
  const displayMax = displayRange.length - 1;
  let sliderMin = displayRange.indexOf(selectableRange[0]);
  let sliderMax = displayRange.indexOf(selectableRange[1]);

  const [activelySelectingDateRange, setActivelySelectingDateRange] = useState([...currentRange]);
  const [activelySelecting, setActivelySelecting] = useState(false);
  const sliderValue = activelySelectingDateRange.map((v, i) => (
    displayRange.indexOf(activelySelectingDateRange[i] || currentRange[i])
  ));
  useEffect(() => {
    if ((
      currentRange[0] !== activelySelectingDateRange[0]
        || currentRange[1] !== activelySelectingDateRange[1]
    ) && !activelySelecting) {
      setActivelySelectingDateRange([...currentRange]);
    }
  }, [
    activelySelecting,
    activelySelectingDateRange,
    setActivelySelectingDateRange,
    currentRange,
  ]);

  // check currentRange to make sure values don't exceed points allowed
  const pointsAvailable = POINTS_PERFORMANCE_LIMIT - TimeSeriesViewerContext
    .calcPredictedPointsByDateRange(state, currentRange[0], currentRange[1]);
  const pointsPerMonth = TimeSeriesViewerContext
    .calcPredictedPointsByDateRange(state, '2024-01', '2024-01');
  const monthsAvailable = Math.floor(pointsAvailable / pointsPerMonth);

  if (monthsAvailable < displayRange.length) {
    sliderMin = Math.max(
      displayRange.indexOf(selectableRange[0]),
      displayRange.indexOf(currentRange[0]) - monthsAvailable,
    );
    sliderMax = Math.min(
      displayRange.indexOf(selectableRange[1]),
      displayRange.indexOf(currentRange[1]) + monthsAvailable,
    );
    selectableRange = [displayRange[sliderMin], displayRange[sliderMax]];
  }

  // Derive site and availability values for the AvailabilityGrid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availabilityDateRange = { value: currentRange, validValues: selectableRange };
  const selectedSites = state.selection.sites.map((site) => site.siteCode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availabilitySites = { value: selectedSites, validValues: selectedSites };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availabilityData = {
    view: 'sites',
    name: 'Site',
    selectable: true,
    rows: {},
    getLabel: {
      text: (key) => key,
      title: (key) => (allSites[key] ? allSites[key].description : key),
    },
  };
  selectedSites.forEach((siteCode) => {
    let provAvailableMonths = [];
    const avaReleases = state.product.sites[siteCode].availableReleases;
    if (Array.isArray(avaReleases)) {
      const provRelease = avaReleases.find((value) => value.release === 'PROVISIONAL');
      if (provRelease) {
        provAvailableMonths = provRelease.availableMonths;
      }
    }
    availabilityData.rows[siteCode] = {};
    state.product.sites[siteCode].availableMonths.forEach((month) => {
      let status = 'available';
      if (provAvailableMonths && (provAvailableMonths.length > 0)) {
        if (provAvailableMonths.includes(month)) {
          status = 'available-provisional';
        }
      }
      if (!availabilityData.rows[siteCode][month]) {
        availabilityData.rows[siteCode][month] = new Set();
      }
      availabilityData.rows[siteCode][month].add(status);
    });
  });
  const svgHeight = SVG.CELL_PADDING
    + (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (selectedSites.length + 1);

  // Set up AvailabilityGrid
  const setDateRangeValue = useCallback((dateRange) => dispatch({
    type: 'selectDateRange',
    dateRange,
  }), [dispatch]);
  const svgRef = useRef(null);
  const handleSvgRedraw = useCallback(() => {
    BasicAvailabilityGrid({
      data: availabilityData,
      svgRef,
      allSites,
      sites: availabilitySites,
      dateRange: availabilityDateRange,
      setDateRangeValue,
    });
  }, [
    svgRef,
    allSites,
    availabilityData,
    availabilitySites,
    availabilityDateRange,
    setDateRangeValue,
  ]);
  useEffect(() => {
    handleSvgRedraw();
  });

  // Render nothing if no selectable range is available or no sites are yet selected
  if (!displayRange.length || !selectedSites.length) {
    return (
      <div>
        <Skeleton variant="rect" width="100%" height={56} />
        <br />
        <div style={{ display: 'flex', marginBottom: Theme.spacing(3) }}>
          <Skeleton variant="rect" width="100%" height={40} />
          <div style={{ width: '40px' }} />
          <Skeleton variant="rect" width="100%" height={40} />
        </div>
        <Skeleton variant="rect" width={300} height={28} />
        <br />
        <Skeleton variant="rect" width="100%" height={80} />
      </div>
    );
  }

  const marks = [{
    value: displayMin,
    label: displayRange[displayMin].substring(0, 4),
  }];
  const yearsInSlider = Math.floor(displayRange.length / 12);
  const innerMark = Math.ceil(yearsInSlider / Math.ceil(yearsInSlider % 3 ? 2 : 3));
  for (let y = 1; y < yearsInSlider; y += 1) {
    marks.push({
      value: 12 * y,
      label: (y === innerMark || y === innerMark * 2)
        ? displayRange[12 * y].substring(0, 4)
        : null,
    });
  }
  marks.push({
    value: displayMax,
    label: displayRange[displayMax].substring(0, 4),
  });

  const handleChangeDatePicker = (rangeIndex, value) => {
    // Confirm arguments are sane
    const formattedValue = value.format('YYYY-MM');
    const newSliderValue = displayRange.indexOf(formattedValue);
    if (!formattedValue || ![0, 1].includes(rangeIndex) || newSliderValue === -1) { return; }
    // Generate new selected dateRange bounded by min/max
    const dateRange = [
      currentRange[0] === null ? displayRange[sliderMin] : currentRange[0],
      currentRange[1] === null ? displayRange[sliderMax] : currentRange[1],
    ];
    dateRange[rangeIndex] = formattedValue;
    dispatch({ type: 'selectDateRange', dateRange });
  };

  const uniqueSliderMarks = (new Set((marks || []).map((m) => m.value))).size;
  const renderedSlider = uniqueSliderMarks <= 1 ? null : (
    <Slider
      data-selenium="time-series-viewer.date-range.slider"
      className={classes.slider}
      ref={dateRangeSliderRef}
      value={sliderValue}
      valueLabelDisplay="auto"
      min={displayMin}
      max={displayMax}
      marks={marks}
      valueLabelFormat={(x) => displayRange[x]}
      onMouseDown={() => { setActivelySelecting(true); }}
      onChange={(event, values) => {
        setActivelySelectingDateRange([
          Math.max(values[0], sliderMin),
          Math.min(values[1], sliderMax),
        ].map((x) => displayRange[x]));
      }}
      onChangeCommitted={(event, values) => {
        setActivelySelecting(false);
        dispatch({
          type: 'selectDateRange',
          dateRange: [
            Math.max(values[0], sliderMin),
            Math.min(values[1], sliderMax),
          ].map((x) => displayRange[x]),
        });
      }}
    />
  );

  return (
    <div className={classes.optionsContainer}>
      <div className={classes.optionContainer}>
        <Typography variant="h6" gutterBottom>Select by Date</Typography>
        <div style={{ marginBottom: Theme.spacing(2) }}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.optionsContainer} style={{ marginBottom: Theme.spacing(3) }}>
              <div style={{ marginRight: Theme.spacing(3) }}>
                <DatePicker
                  data-selenium="time-series-viewer.date-range.start-input"
                  inputVariant="outlined"
                  margin="dense"
                  orientation="portrait"
                  value={getYearMonthMoment(currentRange[0] || displayRange[sliderMin])}
                  onChange={(value) => handleChangeDatePicker(0, value)}
                  views={['month', 'year']}
                  label="Start"
                  openTo="month"
                  minDate={getYearMonthMoment(displayRange[sliderMin], 10)}
                  maxDate={getYearMonthMoment(currentRange[1] || displayRange[sliderMax], 20)}
                />
              </div>
              <div>
                <DatePicker
                  data-selenium="time-series-viewer.date-range.end-input"
                  inputVariant="outlined"
                  margin="dense"
                  orientation="portrait"
                  value={getYearMonthMoment(currentRange[1] || displayRange[sliderMax])}
                  onChange={(value) => handleChangeDatePicker(1, value)}
                  views={['month', 'year']}
                  label="End"
                  openTo="month"
                  minDate={getYearMonthMoment(currentRange[0] || displayRange[sliderMin], 10)}
                  maxDate={getYearMonthMoment(displayRange[sliderMax], 20)}
                />
              </div>
            </div>
          </MuiPickersUtilsProvider>
          {renderedSlider}
        </div>
      </div>
      <div className={classes.optionContainer} style={{ minWidth: Theme.spacing(50) }}>
        <SvgDefs />
        <Typography variant="h6" gutterBottom>Select by Data Product Availability</Typography>
        <FullWidthVisualization
          vizRef={svgRef}
          handleRedraw={handleSvgRedraw}
        >
          <svg
            ref={svgRef}
            height={svgHeight}
            className={classes.svg}
          />
        </FullWidthVisualization>
        <BasicAvailabilityKey
          style={{ flexGrow: 1 }}
          delineateRelease={ReleaseService.determineDelineateAvaRelease(state.release)}
        />
      </div>
    </div>
  );
};

export default TimeSeriesViewerDateRange;

TimeSeriesViewerDateRange.propTypes = {
  dateRangeSliderRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};
