import React, {
  useEffect,
  useCallback,
  useRef,
  Dispatch,
} from 'react';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { select } from 'd3-selection';
import {
  scaleLinear,
  scaleBand,
  scaleOrdinal,
  type NumberValue,
  type ScaleLinear,
} from 'd3-scale';
import { arc, stack } from 'd3-shape';
import { max, range } from 'd3-array';
import { Axis, axisLeft } from 'd3-axis';

import Provider, {
  ActionCreator,
  FetchStatusState,
  useDispatchContext,
  useStateContext,
  WindRoseViewerState,
} from './Context';
import {
  VELOCITY_BINS,
  WIND_ROSE_CHANGE_TYPE,
  DIRECTION_BIN_LOOKUP,
} from './windRoseUtil';

import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';
import {
  AnyAction,
  Nullable,
  Undef,
  UnknownRecord,
} from '../../types/core';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { AsyncStateType } from '../../types/asyncFlow';
import { resolveProps } from '../../util/defaultProps';

import './styles.css';

const useStyles = makeStyles((theme: NeonTheme) => ({
  container: {
    width: '100%',
  },
  sliderThumbRoot: {
    '& .MuiSlider-valueLabel': {
      right: 'unset',
      top: 'unset',
      transform: 'translate(45%, -95%) scale(0)',
      transformOrigin: 'center',
    },
    '& .MuiSlider-valueLabelOpen': {
      transform: 'translate(45%, -95%) scale(1)',
    },
  },
}));

const DEGREE_SYMBOL_UNICODE = '\u00B0';

const enum DirectionLabelMode {
  ANGLE = 'ANGLE',
  DIRECTION = 'DIRECTION',
}

const DIRECTION_LABEL_MODE: DirectionLabelMode = DirectionLabelMode.DIRECTION;

const enum FrequencyLabelMode {
  COUNT = 'COUNT',
  PERCENTAGE = 'PERCENTAGE',
}

const FREQUENCY_LABEL_MODE: FrequencyLabelMode = FrequencyLabelMode.PERCENTAGE;

const getDirectionLabel = (mode: DirectionLabelMode, d: any): string => {
  switch (mode) {
    case DirectionLabelMode.ANGLE:
      return `${(DIRECTION_BIN_LOOKUP as DirectionBinLookupType)[d.angle].angle}${DEGREE_SYMBOL_UNICODE}`;
    case DirectionLabelMode.DIRECTION:
    default:
      return `${(DIRECTION_BIN_LOOKUP as DirectionBinLookupType)[d.angle].direction}`;
  }
};

const getFrequencyLabel = (mode: FrequencyLabelMode, d: number, totalSamples: number): string => {
  switch (mode) {
    case FrequencyLabelMode.COUNT:
      return `${d}`;
    case FrequencyLabelMode.PERCENTAGE:
    default:
      return `${((d / totalSamples) * 100.0).toFixed(0)}%`;
  }
};

interface DirectionDefinition {
  angle: number;
  direction: string;
}
type DirectionBinLookupType = Record<number, DirectionDefinition>;

const WindRose: React.FC = (): React.JSX.Element => {
  const theme: NeonTheme = useTheme();
  const classes = useStyles(theme);
  const state: WindRoseViewerState = useStateContext();
  const dispatch: Dispatch<AnyAction> = useDispatchContext();
  const {
    fetchState,
    dataStateMessage,
    data: {
      dailyBins,
      current: currentChartData,
    },
  } = state;
  let appliedStatusType = AsyncStateType.IDLE;
  const { data: dataFetchState } = fetchState;
  if (exists(dataFetchState)) {
    const { status: dataFetchStatus } = dataFetchState as FetchStatusState;
    appliedStatusType = dataFetchStatus;
  }
  const svgRef = useRef<SVGSVGElement>(null);
  const dayLabelRef = useRef<HTMLLabelElement>(null);
  const renderWindRoseChart = useCallback((data: []) => {
    if (!svgRef.current) {
      return;
    }
    svgRef.current.innerHTML = '';
    if (!data || (Object.keys(data).length <= 0)) {
      return;
    }
    const width = 1000;
    const height = 680;
    const svg = select(svgRef.current)
      .attr('viewBox', `0 0 ${width.toString()} ${height.toString()}`);
    const margin = {
      top: 40,
      right: 80,
      bottom: 60,
      left: 40,
    };
    const innerRadius = 20;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const outerRadius = (Math.min(chartWidth, chartHeight) / 2);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const defaultRange = [
      '#4242f4',
      '#42c5f4',
      '#42f4ce',
      '#42f456',
      '#adf442',
      '#f4e242',
      '#f4a142',
      '#f44242',
      '#ff00ff',
    ];
    // const defaultRange = [
    //   '#1A237E',
    //   '#64B5F6',
    //   '#80DEEA',
    //   '#42f456',
    //   '#adf442',
    //   '#f4e242',
    //   '#f4a142',
    //   '#f44242',
    //   '#ff00ff'
    // ];

    const angle = scaleLinear()
      .range([0, 2 * Math.PI]);
    const radius = scaleLinear()
      .range([innerRadius, outerRadius]);
    const x = scaleBand()
      .range([0, 2 * Math.PI])
      .align(0);
    const y = scaleLinear()
      .range([innerRadius, outerRadius]);
    const z = scaleOrdinal()
      .range(defaultRange);

    const dataColumns = ['angle'];
    VELOCITY_BINS.forEach((bin) => { dataColumns.push(bin); });

    x.domain(data.map((d: any) => d.angle));
    y.domain([0, max(data, (d: any) => d.total)]);
    z.domain(dataColumns.slice(1));

    // Extend the domain slightly to match the range of [0, 2π].
    angle.domain([0, max(data, (d: any, i: any) => i + 1)]);
    radius.domain([0, max(data, (d: any) => d.y0 + d.y)]);
    const yAxisRadialData = stack().keys(dataColumns.slice(1))(data);

    const angleOffset = -360.0 / data.length / 2.0;
    const arcPath = arc()
      .innerRadius((d: any): number => y(d[0]))
      .outerRadius((d: any): number => y(d[1]))
      .startAngle((d: any): number => x(d.data.angle) as number)
      .endAngle((d: any): number => x(d.data.angle) as number + x.bandwidth())
      .padAngle(0.01)
      .padRadius(100);
    g.append('g')
      .selectAll('g')
      .data(yAxisRadialData)
      .enter()
      .append('g')
      .attr('fill', (d: any): string => z(d.key) as string)
      .selectAll('path')
      .data((d: any) => d)
      .enter()
      .append('path')
      // @ts-ignore
      .attr('d', arcPath)
      .attr('transform', () => `rotate(${angleOffset})`);

    const label = g.append('g')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('text-anchor', 'middle')
      .attr('transform', (d: any): string => (
        `rotate(${(((x(d.angle) as number + x.bandwidth() / 2) * 180) / Math.PI - (90 - angleOffset))})`
        + `translate(${(outerRadius + 30)}, 0)`
      ));

    label.append('text')
      .attr('transform', (d: any) => (
        (x(d.angle) as number + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
          ? 'rotate(90)translate(0, 10)'
          : 'rotate(-90)translate(0, 0)'
      ))
      .text((d: any) => getDirectionLabel(DIRECTION_LABEL_MODE, d))
      .style('font-size', 14);

    // Draw polar axis with inner and outer bounds
    g.selectAll('.axis-bounds')
      .data([innerRadius - 1, outerRadius + 10])
      .enter()
      .append('g')
      .attr('class', 'axis-bounds')
      .append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 0, 0, 0.5)')
      .attr('r', (d: any) => d);

    const axisDataRange: number[] = range(angle.domain()[1]);
    const polarAxisRange: ScaleLinear<number, number, never> = radius.copy()
      .range([(-1) * innerRadius, (-1) * (outerRadius + 10)]);
    const polarAxis: Axis<NumberValue> = axisLeft(polarAxisRange)
      .tickSizeOuter(0);
    g.selectAll('.axis')
      .data(axisDataRange)
      .enter()
      .append('g')
      .attr('class', 'axis')
      .attr('color', 'rgba(0, 0, 0, 0.5)')
      .attr('transform', (d: any) => `rotate(${(angle(d) * 180) / Math.PI})`)
      .call(polarAxis);

    const yAxis = g.append('g')
      .attr('text-anchor', 'middle');

    const totalSamples = data.map((d: any): number => d.total)
      .reduce(
        (prevValue: number, currentValue: number) => prevValue + currentValue,
        0,
      );
    const frequencies: number[] = y.ticks(6).slice(1);
    const yTick = yAxis
      .selectAll('g')
      .data(frequencies)
      .enter()
      .append('g');

    yTick.append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-dasharray', '4,4')
      .attr('r', y);

    yTick.append('text')
      .attr('y', (d: number) => (-1) * y(d))
      .attr('dy', `${(-1) * 0.35}em`)
      .attr('x', () => (-1) * 10)
      // .text(y.tickFormat(format('.00s'))
      .text((d: number) => getFrequencyLabel(FREQUENCY_LABEL_MODE, d, totalSamples))
      .style('font-size', 14)
      .style('font-weight', 'bold');

    const legend = svg.append('g')
      .attr('transform', `translate(${(width / 2) + 60}, ${height / 2})`)
      .selectAll('g')
      .data(dataColumns.slice(1).reverse())
      .enter()
      .append('g')
      // .attr('transform', function(d, i) {
      //   return 'translate(-40,' + (i - (dataColumns.length - 1) / 2) * 20 + ')';
      // });
      .attr('transform', (d, i) => (
        `translate(${outerRadius}, ${((-1) * outerRadius + 60 + (i - (dataColumns.length - 1) / 2) * 20)})`
      ));

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      // @ts-ignore
      .attr('fill', z);

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text((d: string) => `${d} m/s`)
      .style('font-size', 14)
      .style('font-weight', 'bold');
  }, []);

  useEffect(() => {
    renderWindRoseChart(currentChartData as []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChartData]);

  const loadingContainerStyle = {
    top: '30%',
    left: '36%',
  };
  let chartContainerStyle: any = {
    width: '90%',
  };

  let display = null;
  switch (appliedStatusType) {
    case AsyncStateType.WORKING:
      chartContainerStyle = {
        display: 'none',
        width: '1000px',
        float: 'right',
      };
      display = (
        <div className="loading-container-background" style={loadingContainerStyle}>
          <div className="loading-container">
            <div>Generating wind rose...</div>
            <i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw" />
          </div>
        </div>
      );
      break;
    case AsyncStateType.FAILED:
      chartContainerStyle = {
        display: 'none',
        width: '1000px',
        float: 'right',
      };
      display = (
        <div className="loading-container-background" style={loadingContainerStyle}>
          <div className="loading-container">
            <div>
              <p>
                No wind rose data available for specified parameters
              </p>
            </div>
          </div>
        </div>
      );
      break;
    case AsyncStateType.FULLFILLED:
      if (!currentChartData) {
        chartContainerStyle = {
          display: 'none',
          width: '1000px',
          float: 'right',
        };
        let dataMessage = (
          <p>
            No wind rose data available
          </p>
        );
        if (dataStateMessage) {
          const message = `  ${dataStateMessage}`;
          dataMessage = (
            <p>
              No wind rose data available.
              {message}
            </p>
          );
        }
        display = (
          <div className="loading-container-background" style={loadingContainerStyle}>
            <div className="loading-container loading-container-failed">
              <div>
                {dataMessage}
              </div>
            </div>
          </div>
        );
      }
      break;
    default:
      break;
  }

  let sliderLabel = '';
  const sliderLabelStyle = {
    marginTop: '20px',
  };
  let slider = null;
  let sliderContainerStyle = {};
  const dailyBinKeys = Object.keys(dailyBins);
  if (dailyBinKeys.length > 0) {
    sliderContainerStyle = {
      display: 'inline-block',
      height: '480px',
      marginTop: '20px',
      // marginLeft: '40px',
      float: 'left',
    };
    sliderLabel = dailyBinKeys[0] as string;
    const num = dailyBinKeys.length;
    slider = (
      <Slider
        orientation="vertical"
        defaultValue={0}
        min={((-1) * num) + 1}
        max={0}
        marks={dailyBinKeys.map((binKey: string, index: number) => (
          { value: (-1) * index, label: binKey }
        ))}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => dailyBinKeys[(-1) * (value as number)]}
        classes={{
          thumb: classes.sliderThumbRoot,
        }}
        onChange={(event, newValue) => {
          if (dayLabelRef.current) {
            const newSliderLabel = dailyBinKeys[(-1) * (newValue as number)] as string;
            dayLabelRef.current.innerHTML = newSliderLabel;
            renderWindRoseChart(dailyBins[newSliderLabel as any] as []);
          }
        }}
      />
    );
  }
  return (
    <div className="wind-rose-container">
      {display}
      <div style={sliderLabelStyle}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label ref={dayLabelRef}>
          {sliderLabel}
        </label>
      </div>
      <div style={sliderContainerStyle}>
        {slider}
      </div>
      <div className="svg-responsive-container" style={chartContainerStyle}>
        <svg
          ref={svgRef}
          className="svg-responsive"
          preserveAspectRatio="xMinYMin meet"
        />
      </div>
    </div>
  );
};

const WindRoseViewer: React.FC = (): React.JSX.Element => {
  const state: WindRoseViewerState = useStateContext();
  const dispatch: Dispatch<AnyAction> = useDispatchContext();
  const theme: NeonTheme = useTheme();
  const {
    product,
    productCode,
    release,
    fetchState,
    siteOptions,
    monthOptions,
    positionOptions,
    query,
  } = state;
  if (!exists(product)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  const { product: productFetchState } = fetchState;
  if (!exists(productFetchState)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  const { status: productFetchStateStatus } = productFetchState as FetchStatusState;
  let selectorsEnabled = false;
  switch (productFetchStateStatus) {
    case AsyncStateType.FULLFILLED:
    case AsyncStateType.FAILED:
      selectorsEnabled = true;
      break;
    case AsyncStateType.WORKING:
    default:
      break;
  }
  let siteSelector = null;
  let monthSelector = null;
  let positionSelector = null;
  if (siteOptions && (siteOptions.length > 0)) {
    siteSelector = (
      <div className="wind-rose-selector-container">
        <div className="wind-rose-selector-label">
          Site:
        </div>
        <div className="wind-rose-selector wind-rose-selector-sites">
          <Select
            disabled={!selectorsEnabled}
            value={query.sites[0]}
            onChange={(event: SelectChangeEvent<string>) => {
              dispatch(ActionCreator.fetchWindRose(
                product as UnknownRecord,
                release,
                {
                  ...query,
                  changeType: WIND_ROSE_CHANGE_TYPE.SITE,
                  sites: [event.target.value as string],
                },
              ));
            }}
          >
            {siteOptions.map((siteOption) => ((
              <MenuItem key={siteOption.value} value={siteOption.value}>
                {siteOption.label}
              </MenuItem>
            )))}
          </Select>
        </div>
      </div>
    );
  }
  if (monthOptions && (monthOptions.length > 0)) {
    monthSelector = (
      <div className="wind-rose-selector-container">
        <div className="wind-rose-selector-label">
          Month:
        </div>
        <div className="wind-rose-selector wind-rose-selector-month">
          <Select
            disabled={!selectorsEnabled}
            value={query.months[0]}
            onChange={(event: SelectChangeEvent<string>) => {
              dispatch(ActionCreator.fetchWindRose(
                product as UnknownRecord,
                release,
                {
                  ...query,
                  changeType: WIND_ROSE_CHANGE_TYPE.MONTH,
                  months: [event.target.value as string],
                },
              ));
            }}
          >
            {monthOptions.map((monthOption) => ((
              <MenuItem key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </MenuItem>
            )))}
          </Select>
        </div>
      </div>
    );
  }

  if (positionOptions && (positionOptions.length > 0)) {
    const positionsValue = query.positions.map((position: any) => (
      `(${position.horizontal}, ${position.vertical})`
    ));
    positionSelector = (
      <div className="wind-rose-selector-container-positions">
        <div key="position-si">
          <div className="wind-rose-selector-label-positions">
            Positions:
          </div>
          <div className="wind-rose-selector wind-rose-selector-positions">
            <Select
              multiple
              disabled={!selectorsEnabled}
              value={positionsValue as any}
              onChange={(event: SelectChangeEvent<any[]>) => {
                const selectedPositionOptions = positionOptions
                  .filter((value) => (event.target.value as any[]).includes(value.value))
                  .map((value) => value.position);
                dispatch(ActionCreator.fetchWindRose(
                  product as UnknownRecord,
                  release,
                  {
                    ...query,
                    changeType: WIND_ROSE_CHANGE_TYPE.POSITIONS,
                    positions: selectedPositionOptions,
                  },
                ));
              }}
            >
              {positionOptions.map((positionOption) => ((
                <MenuItem key={positionOption.value} value={positionOption.value}>
                  {positionOption.label}
                </MenuItem>
              )))}
            </Select>
          </div>
        </div>
      </div>
    );
  }

  const renderSelectors = (): React.JSX.Element => ((
    <div className="popup-wind-rose__row">
      {siteSelector}
      {monthSelector}
      {positionSelector}
    </div>
  ));
  const renderTitle = (): string => {
    const productTitle = `${product?.productName} (${productCode})`;
    let releaseTitle = '';
    if (isStringNonEmpty(release)) {
      releaseTitle = ` , ${release}`;
    }
    return `${productTitle}${releaseTitle}`;
  };
  return (
    <div className="popup__wind-rose__container">
      <div className="popup-wind-rose">
        <div className="popup-wind-rose__row">
          <div className="popup-wind-rose__name">
            {renderTitle()}
          </div>
        </div>
        {renderSelectors()}
        <div className="popup-wind-rose__row">
          <WindRose />
        </div>
      </div>
    </div>
  );
};

interface WindRoseViewerProps {
  productCode: Nullable<string>;
  release: Undef<string>;
}
const windRoseViewerDefaultProps: WindRoseViewerProps = {
  productCode: null,
  release: undefined,
};

const WindRoseViewerContainer: React.FC<WindRoseViewerProps> = (
  inProps: WindRoseViewerProps,
): React.JSX.Element => {
  const props = resolveProps(windRoseViewerDefaultProps, inProps) as WindRoseViewerProps;
  const { productCode, release }: WindRoseViewerProps = props;
  return (
    <ComponentErrorBoundary onReset={() => { /* noop for boundary reset */ }}>
      <Provider productCode={productCode} release={release}>
        <WindRoseViewer />
      </Provider>
    </ComponentErrorBoundary>
  );
};

const WrappedWindRoseViewerContainer = (Theme as any).getWrappedComponent(
  NeonContext.getWrappedComponent(WindRoseViewerContainer),
);

export default WrappedWindRoseViewerContainer;
