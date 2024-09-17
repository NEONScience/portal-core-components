"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _Slider = _interopRequireDefault(require("@mui/material/Slider"));
var _styles = require("@mui/material/styles");
var _styles2 = require("@mui/styles");
var _d3Selection = require("d3-selection");
var _d3Scale = require("d3-scale");
var _d3Shape = require("d3-shape");
var _d3Array = require("d3-array");
var _d3Axis = require("d3-axis");
var _Context = _interopRequireWildcard(require("./Context"));
var _windRoseUtil = require("./windRoseUtil");
var _ComponentErrorBoundary = _interopRequireDefault(require("../Error/ComponentErrorBoundary"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _asyncFlow = require("../../types/asyncFlow");
var _defaultProps = require("../../util/defaultProps");
require("./styles.css");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useStyles = (0, _styles2.makeStyles)(theme => ({
  container: {
    width: '100%'
  },
  sliderThumbRoot: {
    '& .MuiSlider-valueLabel': {
      right: 'unset',
      top: 'unset',
      transform: 'translate(45%, -95%) scale(0)',
      transformOrigin: 'center'
    },
    '& .MuiSlider-valueLabelOpen': {
      transform: 'translate(45%, -95%) scale(1)'
    }
  }
}));
const DEGREE_SYMBOL_UNICODE = '\u00B0';
var DirectionLabelMode = /*#__PURE__*/function (DirectionLabelMode) {
  DirectionLabelMode["ANGLE"] = "ANGLE";
  DirectionLabelMode["DIRECTION"] = "DIRECTION";
  return DirectionLabelMode;
}(DirectionLabelMode || {});
const DIRECTION_LABEL_MODE = DirectionLabelMode.DIRECTION;
var FrequencyLabelMode = /*#__PURE__*/function (FrequencyLabelMode) {
  FrequencyLabelMode["COUNT"] = "COUNT";
  FrequencyLabelMode["PERCENTAGE"] = "PERCENTAGE";
  return FrequencyLabelMode;
}(FrequencyLabelMode || {});
const FREQUENCY_LABEL_MODE = FrequencyLabelMode.PERCENTAGE;
const getDirectionLabel = (mode, d) => {
  switch (mode) {
    case DirectionLabelMode.ANGLE:
      return `${_windRoseUtil.DIRECTION_BIN_LOOKUP[d.angle].angle}${DEGREE_SYMBOL_UNICODE}`;
    case DirectionLabelMode.DIRECTION:
    default:
      return `${_windRoseUtil.DIRECTION_BIN_LOOKUP[d.angle].direction}`;
  }
};
const getFrequencyLabel = (mode, d, totalSamples) => {
  switch (mode) {
    case FrequencyLabelMode.COUNT:
      return `${d}`;
    case FrequencyLabelMode.PERCENTAGE:
    default:
      return `${(d / totalSamples * 100.0).toFixed(0)}%`;
  }
};
const WindRose = () => {
  const theme = (0, _styles.useTheme)();
  const classes = useStyles(theme);
  const state = (0, _Context.useStateContext)();
  const dispatch = (0, _Context.useDispatchContext)();
  const {
    fetchState,
    dataStateMessage,
    data: {
      dailyBins,
      current: currentChartData
    }
  } = state;
  let appliedStatusType = _asyncFlow.AsyncStateType.IDLE;
  const {
    data: dataFetchState
  } = fetchState;
  if ((0, _typeUtil.exists)(dataFetchState)) {
    const {
      status: dataFetchStatus
    } = dataFetchState;
    appliedStatusType = dataFetchStatus;
  }
  const svgRef = (0, _react.useRef)(null);
  const dayLabelRef = (0, _react.useRef)(null);
  const renderWindRoseChart = (0, _react.useCallback)(data => {
    if (!svgRef.current) {
      return;
    }
    svgRef.current.innerHTML = '';
    if (!data || Object.keys(data).length <= 0) {
      return;
    }
    const width = 1000;
    const height = 680;
    const svg = (0, _d3Selection.select)(svgRef.current).attr('viewBox', `0 0 ${width.toString()} ${height.toString()}`);
    const margin = {
      top: 40,
      right: 80,
      bottom: 60,
      left: 40
    };
    const innerRadius = 20;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2;
    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);
    const defaultRange = ['#4242f4', '#42c5f4', '#42f4ce', '#42f456', '#adf442', '#f4e242', '#f4a142', '#f44242', '#ff00ff'];
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

    const angle = (0, _d3Scale.scaleLinear)().range([0, 2 * Math.PI]);
    const radius = (0, _d3Scale.scaleLinear)().range([innerRadius, outerRadius]);
    const x = (0, _d3Scale.scaleBand)().range([0, 2 * Math.PI]).align(0);
    const y = (0, _d3Scale.scaleLinear)().range([innerRadius, outerRadius]);
    const z = (0, _d3Scale.scaleOrdinal)().range(defaultRange);
    const dataColumns = ['angle'];
    _windRoseUtil.VELOCITY_BINS.forEach(bin => {
      dataColumns.push(bin);
    });
    x.domain(data.map(d => d.angle));
    y.domain([0, (0, _d3Array.max)(data, d => d.total)]);
    z.domain(dataColumns.slice(1));

    // Extend the domain slightly to match the range of [0, 2π].
    angle.domain([0, (0, _d3Array.max)(data, (d, i) => i + 1)]);
    radius.domain([0, (0, _d3Array.max)(data, d => d.y0 + d.y)]);
    const yAxisRadialData = (0, _d3Shape.stack)().keys(dataColumns.slice(1))(data);
    const angleOffset = -360.0 / data.length / 2.0;
    const arcPath = (0, _d3Shape.arc)().innerRadius(d => y(d[0])).outerRadius(d => y(d[1])).startAngle(d => x(d.data.angle)).endAngle(d => x(d.data.angle) + x.bandwidth()).padAngle(0.01).padRadius(100);
    g.append('g').selectAll('g').data(yAxisRadialData).enter().append('g').attr('fill', d => z(d.key)).selectAll('path').data(d => d).enter().append('path')
    // @ts-ignore
    .attr('d', arcPath).attr('transform', () => `rotate(${angleOffset})`);
    const label = g.append('g').selectAll('g').data(data).enter().append('g').attr('text-anchor', 'middle').attr('transform', d => `rotate(${(x(d.angle) + x.bandwidth() / 2) * 180 / Math.PI - (90 - angleOffset)})` + `translate(${outerRadius + 30}, 0)`);
    label.append('text').attr('transform', d => (x(d.angle) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? 'rotate(90)translate(0, 10)' : 'rotate(-90)translate(0, 0)').text(d => getDirectionLabel(DIRECTION_LABEL_MODE, d)).style('font-size', 14);

    // Draw polar axis with inner and outer bounds
    g.selectAll('.axis-bounds').data([innerRadius - 1, outerRadius + 10]).enter().append('g').attr('class', 'axis-bounds').append('circle').attr('fill', 'none').attr('stroke', 'rgba(0, 0, 0, 0.5)').attr('r', d => d);
    const axisDataRange = (0, _d3Array.range)(angle.domain()[1]);
    const polarAxisRange = radius.copy().range([-1 * innerRadius, -1 * (outerRadius + 10)]);
    const polarAxis = (0, _d3Axis.axisLeft)(polarAxisRange).tickSizeOuter(0);
    g.selectAll('.axis').data(axisDataRange).enter().append('g').attr('class', 'axis').attr('color', 'rgba(0, 0, 0, 0.5)').attr('transform', d => `rotate(${angle(d) * 180 / Math.PI})`).call(polarAxis);
    const yAxis = g.append('g').attr('text-anchor', 'middle');
    const totalSamples = data.map(d => d.total).reduce((prevValue, currentValue) => prevValue + currentValue, 0);
    const frequencies = y.ticks(6).slice(1);
    const yTick = yAxis.selectAll('g').data(frequencies).enter().append('g');
    yTick.append('circle').attr('fill', 'none').attr('stroke', 'gray').attr('stroke-dasharray', '4,4').attr('r', y);
    yTick.append('text').attr('y', d => -1 * y(d)).attr('dy', `${-1 * 0.35}em`).attr('x', () => -1 * 10)
    // .text(y.tickFormat(format('.00s'))
    .text(d => getFrequencyLabel(FREQUENCY_LABEL_MODE, d, totalSamples)).style('font-size', 14).style('font-weight', 'bold');
    const legend = svg.append('g').attr('transform', `translate(${width / 2 + 60}, ${height / 2})`).selectAll('g').data(dataColumns.slice(1).reverse()).enter().append('g')
    // .attr('transform', function(d, i) {
    //   return 'translate(-40,' + (i - (dataColumns.length - 1) / 2) * 20 + ')';
    // });
    .attr('transform', (d, i) => `translate(${outerRadius}, ${-1 * outerRadius + 60 + (i - (dataColumns.length - 1) / 2) * 20})`);
    legend.append('rect').attr('width', 18).attr('height', 18)
    // @ts-ignore
    .attr('fill', z);
    legend.append('text').attr('x', 24).attr('y', 9).attr('dy', '0.35em').text(d => `${d} m/s`).style('font-size', 14).style('font-weight', 'bold');
  }, []);
  (0, _react.useEffect)(() => {
    renderWindRoseChart(currentChartData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChartData]);
  const loadingContainerStyle = {
    top: '30%',
    left: '36%'
  };
  let chartContainerStyle = {
    width: '90%'
  };
  let display = null;
  switch (appliedStatusType) {
    case _asyncFlow.AsyncStateType.WORKING:
      chartContainerStyle = {
        display: 'none',
        width: '1000px',
        float: 'right'
      };
      display = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "loading-container-background",
        style: loadingContainerStyle,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "loading-container",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            children: "Generating wind rose..."
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
            className: "fa fa-circle-o-notch fa-spin fa-2x fa-fw"
          })]
        })
      });
      break;
    case _asyncFlow.AsyncStateType.FAILED:
      chartContainerStyle = {
        display: 'none',
        width: '1000px',
        float: 'right'
      };
      display = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "loading-container-background",
        style: loadingContainerStyle,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "loading-container",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
              children: "No wind rose data available for specified parameters"
            })
          })
        })
      });
      break;
    case _asyncFlow.AsyncStateType.FULLFILLED:
      if (!currentChartData) {
        chartContainerStyle = {
          display: 'none',
          width: '1000px',
          float: 'right'
        };
        let dataMessage = /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
          children: "No wind rose data available"
        });
        if (dataStateMessage) {
          const message = `  ${dataStateMessage}`;
          dataMessage = /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
            children: ["No wind rose data available.", message]
          });
        }
        display = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "loading-container-background",
          style: loadingContainerStyle,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: "loading-container loading-container-failed",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: dataMessage
            })
          })
        });
      }
      break;
    default:
      break;
  }
  let sliderLabel = '';
  const sliderLabelStyle = {
    marginTop: '20px'
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
      float: 'left'
    };
    sliderLabel = dailyBinKeys[0];
    const num = dailyBinKeys.length;
    slider = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Slider.default, {
      orientation: "vertical",
      defaultValue: 0,
      min: -1 * num + 1,
      max: 0,
      marks: dailyBinKeys.map((binKey, index) => ({
        value: -1 * index,
        label: binKey
      })),
      valueLabelDisplay: "auto",
      valueLabelFormat: value => dailyBinKeys[-1 * value],
      classes: {
        thumb: classes.sliderThumbRoot
      },
      onChange: (event, newValue) => {
        if (dayLabelRef.current) {
          const newSliderLabel = dailyBinKeys[-1 * newValue];
          dayLabelRef.current.innerHTML = newSliderLabel;
          renderWindRoseChart(dailyBins[newSliderLabel]);
        }
      }
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "wind-rose-container",
    children: [display, /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      style: sliderLabelStyle,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        ref: dayLabelRef,
        children: sliderLabel
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      style: sliderContainerStyle,
      children: slider
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "svg-responsive-container",
      style: chartContainerStyle,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
        ref: svgRef,
        className: "svg-responsive",
        preserveAspectRatio: "xMinYMin meet"
      })
    })]
  });
};
const WindRoseViewer = () => {
  const state = (0, _Context.useStateContext)();
  const dispatch = (0, _Context.useDispatchContext)();
  const theme = (0, _styles.useTheme)();
  const {
    product,
    productCode,
    release,
    fetchState,
    siteOptions,
    monthOptions,
    positionOptions,
    query
  } = state;
  if (!(0, _typeUtil.exists)(product)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {});
  }
  const {
    product: productFetchState
  } = fetchState;
  if (!(0, _typeUtil.exists)(productFetchState)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {});
  }
  const {
    status: productFetchStateStatus
  } = productFetchState;
  let selectorsEnabled = false;
  switch (productFetchStateStatus) {
    case _asyncFlow.AsyncStateType.FULLFILLED:
    case _asyncFlow.AsyncStateType.FAILED:
      selectorsEnabled = true;
      break;
    case _asyncFlow.AsyncStateType.WORKING:
    default:
      break;
  }
  let siteSelector = null;
  let monthSelector = null;
  let positionSelector = null;
  if (siteOptions && siteOptions.length > 0) {
    siteSelector = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "wind-rose-selector-container",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "wind-rose-selector-label",
        children: "Site:"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "wind-rose-selector wind-rose-selector-sites",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
          disabled: !selectorsEnabled,
          value: query.sites[0],
          onChange: event => {
            dispatch(_Context.ActionCreator.fetchWindRose(product, release, {
              ...query,
              changeType: _windRoseUtil.WIND_ROSE_CHANGE_TYPE.SITE,
              sites: [event.target.value]
            }));
          },
          children: siteOptions.map(siteOption => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
            value: siteOption.value,
            children: siteOption.label
          }, siteOption.value))
        })
      })]
    });
  }
  if (monthOptions && monthOptions.length > 0) {
    monthSelector = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "wind-rose-selector-container",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "wind-rose-selector-label",
        children: "Month:"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "wind-rose-selector wind-rose-selector-month",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
          disabled: !selectorsEnabled,
          value: query.months[0],
          onChange: event => {
            dispatch(_Context.ActionCreator.fetchWindRose(product, release, {
              ...query,
              changeType: _windRoseUtil.WIND_ROSE_CHANGE_TYPE.MONTH,
              months: [event.target.value]
            }));
          },
          children: monthOptions.map(monthOption => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
            value: monthOption.value,
            children: monthOption.label
          }, monthOption.value))
        })
      })]
    });
  }
  if (positionOptions && positionOptions.length > 0) {
    const positionsValue = query.positions.map(position => `(${position.horizontal}, ${position.vertical})`);
    positionSelector = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "wind-rose-selector-container-positions",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "wind-rose-selector-label-positions",
          children: "Positions:"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "wind-rose-selector wind-rose-selector-positions",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
            multiple: true,
            disabled: !selectorsEnabled,
            value: positionsValue,
            onChange: event => {
              const selectedPositionOptions = positionOptions.filter(value => event.target.value.includes(value.value)).map(value => value.position);
              dispatch(_Context.ActionCreator.fetchWindRose(product, release, {
                ...query,
                changeType: _windRoseUtil.WIND_ROSE_CHANGE_TYPE.POSITIONS,
                positions: selectedPositionOptions
              }));
            },
            children: positionOptions.map(positionOption => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
              value: positionOption.value,
              children: positionOption.label
            }, positionOption.value))
          })
        })]
      }, "position-si")
    });
  }
  const renderSelectors = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "popup-wind-rose__row",
    children: [siteSelector, monthSelector, positionSelector]
  });
  const renderTitle = () => {
    const productTitle = `${product?.productName} (${productCode})`;
    let releaseTitle = '';
    if ((0, _typeUtil.isStringNonEmpty)(release)) {
      releaseTitle = ` , ${release}`;
    }
    return `${productTitle}${releaseTitle}`;
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "popup__wind-rose__container",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "popup-wind-rose",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "popup-wind-rose__row",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "popup-wind-rose__name",
          children: renderTitle()
        })
      }), renderSelectors(), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "popup-wind-rose__row",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(WindRose, {})
      })]
    })
  });
};
const windRoseViewerDefaultProps = {
  productCode: null,
  release: undefined
};
const WindRoseViewerContainer = inProps => {
  const props = (0, _defaultProps.resolveProps)(windRoseViewerDefaultProps, inProps);
  const {
    productCode,
    release
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ComponentErrorBoundary.default, {
    onReset: () => {/* noop for boundary reset */},
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Context.default, {
      productCode: productCode,
      release: release,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(WindRoseViewer, {})
    })
  });
};
const WrappedWindRoseViewerContainer = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(WindRoseViewerContainer));
var _default = exports.default = WrappedWindRoseViewerContainer;