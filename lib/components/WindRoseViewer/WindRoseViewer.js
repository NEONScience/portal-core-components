import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useCallback, useRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { arc, stack } from 'd3-shape';
import { max, range } from 'd3-array';
import { axisLeft } from 'd3-axis';
import Provider, { ActionCreator, useDispatchContext, useStateContext } from './Context';
import { VELOCITY_BINS, WIND_ROSE_CHANGE_TYPE, DIRECTION_BIN_LOOKUP } from './windRoseUtil';
import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { AsyncStateType } from '../../types/asyncFlow';
import { resolveProps } from '../../util/defaultProps';
import './styles.css';
const useStyles = makeStyles((theme)=>({
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
const DIRECTION_LABEL_MODE = "DIRECTION";
const FREQUENCY_LABEL_MODE = "PERCENTAGE";
const getDirectionLabel = (mode, d)=>{
    switch(mode){
        case "ANGLE":
            return `${DIRECTION_BIN_LOOKUP[d.angle].angle}${DEGREE_SYMBOL_UNICODE}`;
        case "DIRECTION":
        default:
            return `${DIRECTION_BIN_LOOKUP[d.angle].direction}`;
    }
};
const getFrequencyLabel = (mode, d, totalSamples)=>{
    switch(mode){
        case "COUNT":
            return `${d}`;
        case "PERCENTAGE":
        default:
            return `${(d / totalSamples * 100.0).toFixed(0)}%`;
    }
};
const WindRose = ()=>{
    const theme = useTheme();
    const classes = useStyles(theme);
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const { fetchState, dataStateMessage, data: { dailyBins, current: currentChartData } } = state;
    let appliedStatusType = AsyncStateType.IDLE;
    const { data: dataFetchState } = fetchState;
    if (exists(dataFetchState)) {
        const { status: dataFetchStatus } = dataFetchState;
        appliedStatusType = dataFetchStatus;
    }
    const svgRef = useRef(null);
    const dayLabelRef = useRef(null);
    const renderWindRoseChart = useCallback((data)=>{
        if (!svgRef.current) {
            return;
        }
        svgRef.current.innerHTML = '';
        if (!data || Object.keys(data).length <= 0) {
            return;
        }
        const width = 1000;
        const height = 680;
        const svg = select(svgRef.current).attr('viewBox', `0 0 ${width.toString()} ${height.toString()}`);
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
        const defaultRange = [
            '#4242f4',
            '#42c5f4',
            '#42f4ce',
            '#42f456',
            '#adf442',
            '#f4e242',
            '#f4a142',
            '#f44242',
            '#ff00ff'
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
        const angle = scaleLinear().range([
            0,
            2 * Math.PI
        ]);
        const radius = scaleLinear().range([
            innerRadius,
            outerRadius
        ]);
        const x = scaleBand().range([
            0,
            2 * Math.PI
        ]).align(0);
        const y = scaleLinear().range([
            innerRadius,
            outerRadius
        ]);
        const z = scaleOrdinal().range(defaultRange);
        const dataColumns = [
            'angle'
        ];
        VELOCITY_BINS.forEach((bin)=>{
            dataColumns.push(bin);
        });
        x.domain(data.map((d)=>d.angle));
        y.domain([
            0,
            max(data, (d)=>d.total)
        ]);
        z.domain(dataColumns.slice(1));
        // Extend the domain slightly to match the range of [0, 2π].
        angle.domain([
            0,
            max(data, (d, i)=>i + 1)
        ]);
        radius.domain([
            0,
            max(data, (d)=>d.y0 + d.y)
        ]);
        const yAxisRadialData = stack().keys(dataColumns.slice(1))(data);
        const angleOffset = -360.0 / data.length / 2.0;
        const arcPath = arc().innerRadius((d)=>y(d[0])).outerRadius((d)=>y(d[1])).startAngle((d)=>x(d.data.angle)).endAngle((d)=>x(d.data.angle) + x.bandwidth()).padAngle(0.01).padRadius(100);
        g.append('g').selectAll('g').data(yAxisRadialData).enter().append('g').attr('fill', (d)=>z(d.key)).selectAll('path').data((d)=>d).enter().append('path').attr('d', arcPath).attr('transform', ()=>`rotate(${angleOffset})`);
        const label = g.append('g').selectAll('g').data(data).enter().append('g').attr('text-anchor', 'middle').attr('transform', (d)=>`rotate(${(x(d.angle) + x.bandwidth() / 2) * 180 / Math.PI - (90 - angleOffset)})` + `translate(${outerRadius + 30}, 0)`);
        label.append('text').attr('transform', (d)=>(x(d.angle) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? 'rotate(90)translate(0, 10)' : 'rotate(-90)translate(0, 0)').text((d)=>getDirectionLabel(DIRECTION_LABEL_MODE, d)).style('font-size', 14);
        // Draw polar axis with inner and outer bounds
        g.selectAll('.axis-bounds').data([
            innerRadius - 1,
            outerRadius + 10
        ]).enter().append('g').attr('class', 'axis-bounds').append('circle').attr('fill', 'none').attr('stroke', 'rgba(0, 0, 0, 0.5)').attr('r', (d)=>d);
        const axisDataRange = range(angle.domain()[1]);
        const polarAxisRange = radius.copy().range([
            -1 * innerRadius,
            -1 * (outerRadius + 10)
        ]);
        const polarAxis = axisLeft(polarAxisRange).tickSizeOuter(0);
        g.selectAll('.axis').data(axisDataRange).enter().append('g').attr('class', 'axis').attr('color', 'rgba(0, 0, 0, 0.5)').attr('transform', (d)=>`rotate(${angle(d) * 180 / Math.PI})`).call(polarAxis);
        const yAxis = g.append('g').attr('text-anchor', 'middle');
        const totalSamples = data.map((d)=>d.total).reduce((prevValue, currentValue)=>prevValue + currentValue, 0);
        const frequencies = y.ticks(6).slice(1);
        const yTick = yAxis.selectAll('g').data(frequencies).enter().append('g');
        yTick.append('circle').attr('fill', 'none').attr('stroke', 'gray').attr('stroke-dasharray', '4,4').attr('r', y);
        yTick.append('text').attr('y', (d)=>-1 * y(d)).attr('dy', `${-1 * 0.35}em`).attr('x', ()=>-1 * 10)// .text(y.tickFormat(format('.00s'))
        .text((d)=>getFrequencyLabel(FREQUENCY_LABEL_MODE, d, totalSamples)).style('font-size', 14).style('font-weight', 'bold');
        const legend = svg.append('g').attr('transform', `translate(${width / 2 + 60}, ${height / 2})`).selectAll('g').data(dataColumns.slice(1).reverse()).enter().append('g')// .attr('transform', function(d, i) {
        //   return 'translate(-40,' + (i - (dataColumns.length - 1) / 2) * 20 + ')';
        // });
        .attr('transform', (d, i)=>`translate(${outerRadius}, ${-1 * outerRadius + 60 + (i - (dataColumns.length - 1) / 2) * 20})`);
        legend.append('rect').attr('width', 18).attr('height', 18).attr('fill', z);
        legend.append('text').attr('x', 24).attr('y', 9).attr('dy', '0.35em').text((d)=>`${d} m/s`).style('font-size', 14).style('font-weight', 'bold');
    }, []);
    useEffect(()=>{
        renderWindRoseChart(currentChartData);
    }, [
        renderWindRoseChart,
        currentChartData
    ]);
    const loadingContainerStyle = {
        top: '30%',
        left: '36%'
    };
    let chartContainerStyle = {
        width: '90%'
    };
    let display = null;
    switch(appliedStatusType){
        case AsyncStateType.WORKING:
            chartContainerStyle = {
                display: 'none',
                width: '1000px',
                float: 'right'
            };
            display = /*#__PURE__*/ _jsx("div", {
                className: "loading-container-background",
                style: loadingContainerStyle,
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "loading-container",
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                            children: "Generating wind rose..."
                        }),
                        /*#__PURE__*/ _jsx("i", {
                            className: "fa fa-circle-o-notch fa-spin fa-2x fa-fw"
                        })
                    ]
                })
            });
            break;
        case AsyncStateType.FAILED:
            chartContainerStyle = {
                display: 'none',
                width: '1000px',
                float: 'right'
            };
            display = /*#__PURE__*/ _jsx("div", {
                className: "loading-container-background",
                style: loadingContainerStyle,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "loading-container",
                    children: /*#__PURE__*/ _jsx("div", {
                        children: /*#__PURE__*/ _jsx("p", {
                            children: "No wind rose data available for specified parameters"
                        })
                    })
                })
            });
            break;
        case AsyncStateType.FULLFILLED:
            if (!currentChartData) {
                chartContainerStyle = {
                    display: 'none',
                    width: '1000px',
                    float: 'right'
                };
                let dataMessage = /*#__PURE__*/ _jsx("p", {
                    children: "No wind rose data available"
                });
                if (dataStateMessage) {
                    const message = `  ${dataStateMessage}`;
                    dataMessage = /*#__PURE__*/ _jsxs("p", {
                        children: [
                            "No wind rose data available.",
                            message
                        ]
                    });
                }
                display = /*#__PURE__*/ _jsx("div", {
                    className: "loading-container-background",
                    style: loadingContainerStyle,
                    children: /*#__PURE__*/ _jsx("div", {
                        className: "loading-container loading-container-failed",
                        children: /*#__PURE__*/ _jsx("div", {
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
        slider = /*#__PURE__*/ _jsx(Slider, {
            orientation: "vertical",
            defaultValue: 0,
            min: -1 * num + 1,
            max: 0,
            marks: dailyBinKeys.map((binKey, index)=>({
                    value: -1 * index,
                    label: binKey
                })),
            valueLabelDisplay: "auto",
            valueLabelFormat: (value)=>dailyBinKeys[-1 * value],
            classes: {
                thumb: classes.sliderThumbRoot
            },
            onChange: (event, newValue)=>{
                if (dayLabelRef.current) {
                    const newSliderLabel = dailyBinKeys[-1 * newValue];
                    dayLabelRef.current.innerHTML = newSliderLabel;
                    renderWindRoseChart(dailyBins[newSliderLabel]);
                }
            }
        });
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "wind-rose-container",
        children: [
            display,
            /*#__PURE__*/ _jsx("div", {
                style: sliderLabelStyle,
                children: /*#__PURE__*/ _jsx("label", {
                    ref: dayLabelRef,
                    children: sliderLabel
                })
            }),
            /*#__PURE__*/ _jsx("div", {
                style: sliderContainerStyle,
                children: slider
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "svg-responsive-container",
                style: chartContainerStyle,
                children: /*#__PURE__*/ _jsx("svg", {
                    ref: svgRef,
                    className: "svg-responsive",
                    preserveAspectRatio: "xMinYMin meet"
                })
            })
        ]
    });
};
const WindRoseViewer = ()=>{
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const theme = useTheme();
    const { product, productCode, release, fetchState, siteOptions, monthOptions, positionOptions, query } = state;
    if (!exists(product)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return /*#__PURE__*/ _jsx(_Fragment, {});
    }
    const { product: productFetchState } = fetchState;
    if (!exists(productFetchState)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return /*#__PURE__*/ _jsx(_Fragment, {});
    }
    const { status: productFetchStateStatus } = productFetchState;
    let selectorsEnabled = false;
    switch(productFetchStateStatus){
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
    if (siteOptions && siteOptions.length > 0) {
        siteSelector = /*#__PURE__*/ _jsxs("div", {
            className: "wind-rose-selector-container",
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: "wind-rose-selector-label",
                    children: "Site:"
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "wind-rose-selector wind-rose-selector-sites",
                    children: /*#__PURE__*/ _jsx(Select, {
                        disabled: !selectorsEnabled,
                        value: query.sites[0],
                        onChange: (event)=>{
                            dispatch(ActionCreator.fetchWindRose(product, release, {
                                ...query,
                                changeType: WIND_ROSE_CHANGE_TYPE.SITE,
                                sites: [
                                    event.target.value
                                ]
                            }));
                        },
                        children: siteOptions.map((siteOption)=>/*#__PURE__*/ _jsx(MenuItem, {
                                value: siteOption.value,
                                children: siteOption.label
                            }, siteOption.value))
                    })
                })
            ]
        });
    }
    if (monthOptions && monthOptions.length > 0) {
        monthSelector = /*#__PURE__*/ _jsxs("div", {
            className: "wind-rose-selector-container",
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: "wind-rose-selector-label",
                    children: "Month:"
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "wind-rose-selector wind-rose-selector-month",
                    children: /*#__PURE__*/ _jsx(Select, {
                        disabled: !selectorsEnabled,
                        value: query.months[0],
                        onChange: (event)=>{
                            dispatch(ActionCreator.fetchWindRose(product, release, {
                                ...query,
                                changeType: WIND_ROSE_CHANGE_TYPE.MONTH,
                                months: [
                                    event.target.value
                                ]
                            }));
                        },
                        children: monthOptions.map((monthOption)=>/*#__PURE__*/ _jsx(MenuItem, {
                                value: monthOption.value,
                                children: monthOption.label
                            }, monthOption.value))
                    })
                })
            ]
        });
    }
    if (positionOptions && positionOptions.length > 0) {
        const positionsValue = query.positions.map((position)=>`(${position.horizontal}, ${position.vertical})`);
        positionSelector = /*#__PURE__*/ _jsx("div", {
            className: "wind-rose-selector-container-positions",
            children: /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "wind-rose-selector-label-positions",
                        children: "Positions:"
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "wind-rose-selector wind-rose-selector-positions",
                        children: /*#__PURE__*/ _jsx(Select, {
                            multiple: true,
                            disabled: !selectorsEnabled,
                            value: positionsValue,
                            onChange: (event)=>{
                                const selectedPositionOptions = positionOptions.filter((value)=>event.target.value.includes(value.value)).map((value)=>value.position);
                                dispatch(ActionCreator.fetchWindRose(product, release, {
                                    ...query,
                                    changeType: WIND_ROSE_CHANGE_TYPE.POSITIONS,
                                    positions: selectedPositionOptions
                                }));
                            },
                            children: positionOptions.map((positionOption)=>/*#__PURE__*/ _jsx(MenuItem, {
                                    value: positionOption.value,
                                    children: positionOption.label
                                }, positionOption.value))
                        })
                    })
                ]
            }, "position-si")
        });
    }
    const renderSelectors = ()=>/*#__PURE__*/ _jsxs("div", {
            className: "popup-wind-rose__row",
            children: [
                siteSelector,
                monthSelector,
                positionSelector
            ]
        });
    const renderTitle = ()=>{
        const productTitle = `${product?.productName} (${productCode})`;
        let releaseTitle = '';
        if (isStringNonEmpty(release)) {
            releaseTitle = ` , ${release}`;
        }
        return `${productTitle}${releaseTitle}`;
    };
    return /*#__PURE__*/ _jsx("div", {
        className: "popup__wind-rose__container",
        children: /*#__PURE__*/ _jsxs("div", {
            className: "popup-wind-rose",
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: "popup-wind-rose__row",
                    children: /*#__PURE__*/ _jsx("div", {
                        className: "popup-wind-rose__name",
                        children: renderTitle()
                    })
                }),
                renderSelectors(),
                /*#__PURE__*/ _jsx("div", {
                    className: "popup-wind-rose__row",
                    children: /*#__PURE__*/ _jsx(WindRose, {})
                })
            ]
        })
    });
};
const windRoseViewerDefaultProps = {
    productCode: null,
    release: undefined
};
const WindRoseViewerContainer = (inProps)=>{
    const props = resolveProps(windRoseViewerDefaultProps, inProps);
    const { productCode, release } = props;
    return /*#__PURE__*/ _jsx(ComponentErrorBoundary, {
        onReset: ()=>{},
        children: /*#__PURE__*/ _jsx(Provider, {
            productCode: productCode,
            release: release,
            children: /*#__PURE__*/ _jsx(WindRoseViewer, {})
        })
    });
};
const WrappedWindRoseViewerContainer = Theme.getWrappedComponent(NeonContext.getWrappedComponent(WindRoseViewerContainer));
export default WrappedWindRoseViewerContainer;
