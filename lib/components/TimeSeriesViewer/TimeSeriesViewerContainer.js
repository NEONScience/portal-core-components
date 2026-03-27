import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import ErrorIcon from '@mui/icons-material/Error';
import SummaryIcon from '@mui/icons-material/Toc';
import SitesIcon from '@mui/icons-material/Place';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VariablesIcon from '@mui/icons-material/Timeline';
import AxesIcon from '@mui/icons-material/BorderInner';
import WarnIcon from '@mui/icons-material/Warning';
import ComputerIcon from '@mui/icons-material/Computer';
import ReleaseChip from '../Chip/ReleaseChip';
import Theme, { COLORS } from '../Theme/Theme';
import RouteService from '../../service/RouteService';
import TimeSeriesViewerContext, { summarizeTimeSteps, TIME_SERIES_VIEWER_STATUS_TITLES, Y_AXIS_RANGE_MODE_DETAILS, POINTS_PERFORMANCE_LIMIT } from './TimeSeriesViewerContext';
import { TIME_SERIES_VIEWER_STATUS } from './constants';
import TimeSeriesViewerSites from './TimeSeriesViewerSites';
import TimeSeriesViewerDateRange from './TimeSeriesViewerDateRange';
import TimeSeriesViewerVariables from './TimeSeriesViewerVariables';
import TimeSeriesViewerAxes from './TimeSeriesViewerAxes';
import TimeSeriesViewerGraph from './TimeSeriesViewerGraph';
// We can't rely on flex-sizing to work during resize events as some components within tabs
// won't be able to shrink correctly on resize (notably: Data Product Availability charts).
const VERTICAL_TABS_WIDTH = 150;
const useStyles = makeStyles((theme)=>({
        tabsContainer: {
            display: 'flex',
            margin: theme.spacing(0, -0.5, -0.5, -0.5),
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column'
            }
        },
        tabsVertical: {
            width: `${VERTICAL_TABS_WIDTH}px`
        },
        tabsHorizontal: {
            flexShrink: 0
        },
        tabPanels: {
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: `calc(100% - ${VERTICAL_TABS_WIDTH}px)`,
                borderTop: `1.5px solid ${COLORS.GREY[200]}`
            }
        },
        tabPanelContainer: {
            padding: theme.spacing(2.5),
            width: '100%'
        },
        graphContainer: {
            zIndex: 0,
            position: 'relative',
            marginBottom: theme.spacing(2),
            padding: theme.spacing(0.5),
            borderWidth: '1.5px'
        },
        graphOverlay: {
            display: 'block',
            position: 'absolute',
            width: 'calc(100% + 8px)',
            height: 'calc(100% + 2px)',
            textAlign: 'center',
            top: 0,
            left: 0,
            zIndex: 10,
            margin: theme.spacing(-0.5, -0.5, 0, -0.5),
            padding: theme.spacing(20, 4, 4, 4),
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            '& .MuiTypography-root': {
                boxShadow: '0px 0px 20px 25px #fff',
                backgroundColor: '#fff'
            }
        },
        titleContainer: {
            marginBottom: theme.spacing(2)
        },
        summaryDiv: {
            marginBottom: theme.spacing(1)
        },
        axisTitle: {
            fontWeight: 600,
            paddingLeft: '0px',
            paddingRight: theme.spacing(1)
        },
        axisSettings: {
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap'
        },
        axisSettingTitle: {
            textTransform: 'uppercase',
            color: theme.palette.grey[300],
            fontWeight: 700,
            fontSize: '85%',
            marginRight: Theme.spacing(1)
        },
        errorIcon: {
            color: Theme.colors.RED[400]
        },
        warningIcon: {
            color: Theme.colors.GOLD[500]
        },
        releaseChip: {
            color: Theme.colors.LIGHT_BLUE[600],
            border: `1px solid ${Theme.colors.LIGHT_BLUE[600]}`,
            backgroundColor: Theme.colors.LIGHT_BLUE[50],
            fontWeight: 600,
            cursor: 'help',
            marginTop: Theme.spacing(0.5)
        },
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        statusBar: {
            marginLeft: '-4px',
            marginRight: '-4px',
            backgroundColor: theme.palette.grey[200],
            padding: '4px 4px 4px 12px',
            '& svg': {
                verticalAlign: 'bottom',
                marginRight: '4px'
            },
            '& .warningMessage': {
                marginLeft: '20px',
                '& svg': {
                    color: Theme.colors.BROWN[300]
                }
            }
        }
    }));
const useTabsStyles = makeStyles((theme)=>({
        scroller: {
            [theme.breakpoints.up('md')]: {
                backgroundColor: theme.palette.grey[200]
            }
        }
    }));
const useTabStyles = makeStyles((theme)=>({
        root: {
            [theme.breakpoints.up('md')]: {
                marginLeft: '-1.5px',
                '&:first-child': {
                    marginBottom: '-0.5px'
                },
                '&:not(:first-child)': {
                    marginTop: '-1.5px'
                }
            },
            [theme.breakpoints.down('md')]: {
                paddingRight: theme.spacing(2.5),
                '&:not(:first-child)': {
                    marginLeft: '-1.5px'
                }
            },
            textTransform: 'none',
            opacity: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
                margin: `${theme.spacing(0, 1, 0, 0)} !important`
            }
        },
        labelIcon: {
            minHeight: theme.spacing(8),
            minWidth: theme.spacing(15),
            [theme.breakpoints.down('md')]: {
                minHeight: theme.spacing(6),
                minWidth: theme.spacing(17)
            }
        },
        selected: {
            [theme.breakpoints.down('md')]: {
                borderBottom: 'none'
            },
            [theme.breakpoints.up('md')]: {
                borderRight: 'none',
                marginLeft: '0px'
            }
        }
    }));
/**
   Summary Component
*/ export function TimeSeriesViewerSummary() {
    const classes = useStyles(Theme);
    const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const { sites, dateRange, variables, timeStep, autoTimeStep, logscale, qualityFlags, rollPeriod, yAxes } = state.selection;
    const skeletonProps = {
        variant: 'rect',
        height: 10,
        style: {
            marginTop: '4px',
            marginBottom: '12px'
        }
    };
    // Product
    const productHref = RouteService.getProductDetailPath(state.product.productCode);
    let productSummaryTitle = /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "h6",
                children: "Data Product"
            }),
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                children: state.product.productCode
            })
        ]
    });
    let productSummaryDescription = /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx(Skeleton, {
                ...skeletonProps,
                width: 200
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                ...skeletonProps,
                width: "100%"
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                ...skeletonProps,
                width: "100%"
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                ...skeletonProps,
                width: 125
            })
        ]
    });
    if (state.product.productName) {
        productSummaryTitle = /*#__PURE__*/ _jsxs("div", {
            style: {
                marginRight: Theme.spacing(1)
            },
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "subtitle2",
                    children: "Data Product"
                }),
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "body2",
                    children: /*#__PURE__*/ _jsx(Link, {
                        href: productHref,
                        target: "_blank",
                        style: {
                            fontWeight: 600
                        },
                        children: `${state.product.productName} - (${state.product.productCode})`
                    })
                })
            ]
        });
        productSummaryDescription = /*#__PURE__*/ _jsxs("div", {
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "body2",
                    children: state.product.productDescription
                }),
                state.product.productSensor ? /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    children: [
                        /*#__PURE__*/ _jsx("b", {
                            children: "Sensor:"
                        }),
                        /*#__PURE__*/ _jsx("span", {
                            style: {
                                marginLeft: Theme.spacing(0.5)
                            },
                            children: state.product.productSensor
                        })
                    ]
                }) : null
            ]
        });
    }
    // Release
    const useReleaseChip = state.release !== null;
    let latestRelease = null;
    if (state.releases && state.releases.length) {
        const sortedReleases = [
            ...state.releases
        ].sort((a, b)=>a.generationDate > b.generationDate ? -1 : 1);
        latestRelease = sortedReleases[0].release;
    }
    const latestReleaseClause = useReleaseChip ? '' : ` (release: ${latestRelease || 'unknown'})`;
    const releaseTooltip = state.release === null ? `You are viewing only the latest released and provisional data (release: ${latestRelease || 'unknown'}).` : `You are viewing product data only from the ${state.release} release (no provisional data will be included).`;
    const releaseChipLabel = state.release === null ? `Latest released and provisional data${latestReleaseClause}` : `${state.release}`;
    const releaseSummary = !useReleaseChip ? /*#__PURE__*/ _jsx(Typography, {
        variant: "body2",
        children: releaseChipLabel
    }, releaseChipLabel) : /*#__PURE__*/ _jsx("div", {
        children: /*#__PURE__*/ _jsx(ReleaseChip, {
            chipLabel: releaseChipLabel,
            classes: {
                chip: classes.releaseChip
            },
            tooltipTitle: releaseTooltip,
            tooltipProps: {
                placement: 'bottom-start'
            }
        })
    });
    // Sites
    const sitesSummary = !sites.length ? /*#__PURE__*/ _jsx(Skeleton, {
        ...skeletonProps,
        width: 175
    }) : sites.map((site)=>{
        const { siteCode, positions } = site;
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            children: `${siteCode} - ${positions.join(', ')}`
        }, siteCode);
    });
    // Date Range
    let dateRangeSummary = /*#__PURE__*/ _jsx(Skeleton, {
        ...skeletonProps,
        width: 300
    });
    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        const pluralize = (val, unit)=>val === 1 ? `${val} ${unit}` : `${val} ${unit}s`;
        const startMoment = moment(`${dateRange[0]}-15`);
        const endMoment = moment(`${dateRange[1]}-15`);
        const months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
        const years = Math.floor(months / 12);
        let diff = `${pluralize(months, 'month')}`;
        if (years > 0) {
            diff = !(months % 12) ? `${pluralize(years, 'year')}` : `${pluralize(years, 'year')}, ${pluralize(months % 12, 'month')}`;
        }
        dateRangeSummary = /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            children: `${startMoment.format('MMM YYYY')} - ${endMoment.format('MMM YYYY')} (${diff})`
        });
    }
    // Variables
    const variablesSummary = !variables.length ? /*#__PURE__*/ _jsx(Skeleton, {
        ...skeletonProps,
        width: 250
    }) : /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                children: variables.join(', ')
            }),
            qualityFlags.length > 0 ? /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                children: `Quality flags: ${qualityFlags.join(', ')}`
            }) : null
        ]
    });
    // Axes
    const axes = {
        x: [],
        y1: [],
        y2: []
    };
    const currentTimeStep = timeStep === 'auto' ? `Auto (${autoTimeStep})` : timeStep;
    axes.x.push({
        title: 'Time step',
        value: currentTimeStep
    });
    if (rollPeriod > 1 && currentTimeStep !== null) {
        axes.x.push({
            title: 'Roll period',
            value: summarizeTimeSteps(rollPeriod, currentTimeStep, false)
        });
    }
    Object.keys(yAxes).forEach((yAxis)=>{
        if (yAxes[yAxis].units !== null) {
            axes[yAxis].push({
                title: 'Scale',
                value: logscale ? 'Logarithmic' : 'Linear'
            });
            axes[yAxis].push({
                title: 'Units',
                value: yAxes[yAxis].units
            });
            const rangeMode = Y_AXIS_RANGE_MODE_DETAILS[yAxes[yAxis].rangeMode].name;
            const range = `${rangeMode} (${yAxes[yAxis].axisRange[0].toString()} - ${yAxes[yAxis].axisRange[1].toString()} ${yAxes[yAxis].units})`;
            axes[yAxis].push({
                title: 'Range',
                value: range
            });
        }
    });
    const renderAxisSetting = (setting)=>/*#__PURE__*/ _jsxs("div", {
            style: {
                marginRight: Theme.spacing(2),
                whiteSpace: 'nowrap'
            },
            children: [
                /*#__PURE__*/ _jsx("span", {
                    className: classes.axisSettingTitle,
                    children: `${setting.title}:`
                }),
                setting.value
            ]
        }, setting.title);
    const axesSummary = /*#__PURE__*/ _jsx(Table, {
        size: "small",
        children: /*#__PURE__*/ _jsxs(TableBody, {
            children: [
                /*#__PURE__*/ _jsxs(TableRow, {
                    children: [
                        /*#__PURE__*/ _jsx(TableCell, {
                            className: classes.axisTitle,
                            children: "x"
                        }),
                        /*#__PURE__*/ _jsx(TableCell, {
                            className: classes.axisSettings,
                            children: axes.x.map(renderAxisSetting)
                        })
                    ]
                }),
                !axes.y1.length ? null : /*#__PURE__*/ _jsxs(TableRow, {
                    children: [
                        /*#__PURE__*/ _jsx(TableCell, {
                            className: classes.axisTitle,
                            children: "y1"
                        }),
                        /*#__PURE__*/ _jsx(TableCell, {
                            className: classes.axisSettings,
                            children: axes.y1.map(renderAxisSetting)
                        })
                    ]
                }),
                !axes.y2.length ? null : /*#__PURE__*/ _jsxs(TableRow, {
                    children: [
                        /*#__PURE__*/ _jsx(TableCell, {
                            className: classes.axisTitle,
                            children: "y2"
                        }),
                        /*#__PURE__*/ _jsx(TableCell, {
                            className: classes.axisSettings,
                            children: axes.y2.map(renderAxisSetting)
                        })
                    ]
                })
            ]
        })
    });
    return /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    productSummaryTitle,
                    productSummaryDescription
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        children: "Release"
                    }),
                    releaseSummary
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        children: "Sites & Positions"
                    }),
                    sitesSummary
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        children: "Date Range"
                    }),
                    dateRangeSummary
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        children: "Variables"
                    }),
                    variablesSummary
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        children: "x/y Axes"
                    }),
                    axesSummary
                ]
            })
        ]
    });
}
/**
   Define Tabs
*/ const TAB_IDS = {
    SUMMARY: 'SUMMARY',
    SITES: 'SITES',
    DATE_RANGE: 'DATE_RANGE',
    VARIABLES: 'VARIABLES',
    AXES: 'AXES'
};
const TABS = {
    [TAB_IDS.SUMMARY]: {
        label: 'SUMMARY',
        ariaLabel: 'Summary',
        Icon: SummaryIcon,
        Component: TimeSeriesViewerSummary
    },
    [TAB_IDS.SITES]: {
        // eslint-disable-next-line react/jsx-one-expression-per-line
        label: /*#__PURE__*/ _jsxs("span", {
            children: [
                "SITES &",
                /*#__PURE__*/ _jsx("br", {}),
                "POSITIONS"
            ]
        }),
        ariaLabel: 'Sites and Positions',
        Icon: SitesIcon,
        Component: TimeSeriesViewerSites
    },
    [TAB_IDS.DATE_RANGE]: {
        label: 'DATE RANGE',
        ariaLabel: 'Date Range',
        Icon: DateRangeIcon,
        Component: TimeSeriesViewerDateRange
    },
    [TAB_IDS.VARIABLES]: {
        label: 'VARIABLES',
        ariaLabel: 'Variables',
        Icon: VariablesIcon,
        Component: TimeSeriesViewerVariables
    },
    [TAB_IDS.AXES]: {
        label: 'x/y AXES',
        ariaLabel: 'x/y Axes',
        Icon: AxesIcon,
        Component: TimeSeriesViewerAxes
    }
};
const DEFAULT_TAB = 'SUMMARY';
export default function TimeSeriesViewerContainer() {
    const classes = useStyles(Theme);
    const tabClasses = useTabStyles(Theme);
    const tabsClasses = useTabsStyles(Theme);
    const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const belowMd = useMediaQuery(Theme.breakpoints.down('md'));
    // console.log('TIME SERIES VIEWER STATE:', state);
    const initialTab = DEFAULT_TAB;
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const [loadedProductCode, setLoadedProductCode] = useState(state.product.productCode);
    // Effect to handle a reinitialize event from the context. We track the loaded product code
    // separate from the context product code so when the latter changes we know to reset the
    // tab to SUMMARY and completely unmount and remount the TimeSeriesGraph.
    useEffect(()=>{
        if (state.product.productCode === loadedProductCode) {
            return;
        }
        setLoadedProductCode(state.product.productCode);
        setSelectedTab(DEFAULT_TAB);
    }, [
        state.product.productCode,
        loadedProductCode,
        setSelectedTab
    ]);
    // Slider position is not controlled in state because doing so kills mouse drag performance.
    // Use a ref to deterministically set slider position for all slider-based features.
    const dateRangeSliderRef = useRef(null);
    const renderTabs = ()=>/*#__PURE__*/ _jsx(Tabs, {
            orientation: belowMd ? 'horizontal' : 'vertical',
            scrollButtons: belowMd ? true : 'auto',
            variant: "scrollable",
            value: selectedTab,
            className: belowMd ? classes.tabsHorizontal : classes.tabsVertical,
            classes: tabsClasses,
            "aria-label": "Time Series Viewer Controls",
            onChange: (event, newTab)=>{
                setSelectedTab(newTab);
            },
            TabIndicatorProps: {
                style: {
                    display: 'none'
                }
            },
            children: Object.keys(TABS).map((tabId)=>{
                const { label, ariaLabel, Icon: TabIcon } = TABS[tabId];
                return /*#__PURE__*/ _jsx(Tab, {
                    value: tabId,
                    label: label,
                    "aria-label": ariaLabel || label,
                    icon: /*#__PURE__*/ _jsx(TabIcon, {}),
                    classes: tabClasses,
                    id: `time-series-viewer-tab-${tabId}`,
                    "aria-controls": `time-series-viewer-tabpanel-${tabId}`
                }, tabId);
            })
        });
    const renderTabPanels = ()=>/*#__PURE__*/ _jsx("div", {
            className: classes.tabPanels,
            children: Object.keys(TABS).map((tabId)=>{
                const { Component: TabComponent } = TABS[tabId];
                let tabComponentProps = {
                    setSelectedTab,
                    TAB_IDS
                };
                if (tabId === TAB_IDS.DATE_RANGE) {
                    tabComponentProps = {
                        dateRangeSliderRef
                    };
                }
                return /*#__PURE__*/ _jsx("div", {
                    role: "tabpanel",
                    id: `time-series-viewer-tabpanel-${tabId}`,
                    "aria-labelledby": `time-series-viewer-tab-${tabId}`,
                    style: {
                        display: selectedTab === tabId ? 'block' : 'none'
                    },
                    className: classes.tabPanelContainer,
                    children: /*#__PURE__*/ _jsx(TabComponent, {
                        ...tabComponentProps
                    })
                }, tabId);
            })
        });
    const renderGraphOverlay = ()=>{
        const isError = state.status === TIME_SERIES_VIEWER_STATUS.ERROR;
        const isWarning = state.status === TIME_SERIES_VIEWER_STATUS.WARNING;
        const isLoading = !isError && state.status !== TIME_SERIES_VIEWER_STATUS.READY;
        if (isError || isWarning) {
            return /*#__PURE__*/ _jsxs("div", {
                className: classes.graphOverlay,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        style: {
                            marginBottom: Theme.spacing(4)
                        },
                        children: state.displayError || 'An unknown error occurred; unable to visualize data product'
                    }),
                    /*#__PURE__*/ _jsx(ErrorIcon, {
                        fontSize: "large",
                        className: classes[isError ? 'errorIcon' : 'warningIcon']
                    })
                ]
            });
        }
        const isLoadingData = isLoading && state.status === TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
        if (isLoading) {
            let title = TIME_SERIES_VIEWER_STATUS_TITLES[state.status] || 'Loading…';
            const progressProps = {
                variant: 'indeterminate'
            };
            if (isLoadingData) {
                const progress = Math.floor(state.dataFetchProgress || 0);
                progressProps.variant = 'determinate';
                progressProps.value = progress;
                title = `${title} (${progress}%)`;
            }
            return /*#__PURE__*/ _jsxs("div", {
                className: classes.graphOverlay,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        style: {
                            marginBottom: Theme.spacing(4)
                        },
                        children: title
                    }),
                    /*#__PURE__*/ _jsx(CircularProgress, {
                        ...progressProps
                    })
                ]
            });
        }
        return null;
    };
    /**
   * Function complements of Battelle ANNI
   * @param {*} numStr
   * @returns
   */ const addThousandsSeparator = (numStr)=>{
        if (!numStr) {
            return '0';
        }
        const numStrString = numStr.toString();
        const [integer, decimal] = numStrString.split('.');
        let result = '';
        let count = 0;
        // Process integer part from right to left
        // eslint-disable-next-line no-plusplus
        for(let i = integer.length - 1; i >= 0; i--){
            result = integer[i] + result;
            count += 1;
            // Add comma after every 3 digits, except at the start
            if (count % 3 === 0 && i !== 0) {
                result = `,${result}`;
            }
        }
        // Reattach decimal part if present
        return decimal ? `${result}.${decimal}` : result;
    };
    const renderStatusBar = ()=>{
        let showWarning = false;
        const pointTotal = state.status !== TIME_SERIES_VIEWER_STATUS.READY ? '--' : addThousandsSeparator(state.pointTotal);
        const numPointsPos = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state);
        const numPointsVar = TimeSeriesViewerContext.calcPredictedPointsForNewVariable(state);
        if (numPointsPos > POINTS_PERFORMANCE_LIMIT || numPointsVar > POINTS_PERFORMANCE_LIMIT) {
            showWarning = true;
        }
        return /*#__PURE__*/ _jsxs("div", {
            className: classes.statusBar,
            children: [
                /*#__PURE__*/ _jsx(ComputerIcon, {
                    fontSize: "medium"
                }),
                /*#__PURE__*/ _jsxs("span", {
                    children: [
                        /*#__PURE__*/ _jsx("b", {
                            children: "Data Points"
                        }),
                        ": "
                    ]
                }),
                pointTotal,
                /*#__PURE__*/ _jsx("span", {
                    children: " of "
                }),
                addThousandsSeparator(POINTS_PERFORMANCE_LIMIT),
                /*#__PURE__*/ _jsxs("span", {
                    className: "warningMessage",
                    style: {
                        visibility: showWarning ? 'visible' : 'hidden'
                    },
                    children: [
                        /*#__PURE__*/ _jsx(WarnIcon, {
                            fontSize: "medium"
                        }),
                        "Data point total approaching limit; some options are disabled."
                    ]
                })
            ]
        });
    };
    return /*#__PURE__*/ _jsx("div", {
        style: {
            width: '100%'
        },
        children: /*#__PURE__*/ _jsxs(Card, {
            className: classes.graphContainer,
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    style: {
                        position: 'relative'
                    },
                    children: [
                        state.product.productCode === loadedProductCode ? /*#__PURE__*/ _jsx(TimeSeriesViewerGraph, {}) : null,
                        renderGraphOverlay()
                    ]
                }),
                renderStatusBar(),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.tabsContainer,
                    children: [
                        renderTabs(),
                        renderTabPanels()
                    ]
                })
            ]
        })
    });
}
