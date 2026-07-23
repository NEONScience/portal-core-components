import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useReducer } from 'react';
import moment from 'moment';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import SummaryIcon from '@mui/icons-material/Toc';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import SitesIcon from '@mui/icons-material/Place';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SaeDataViewerBokehPlotContainer from './SaeDataViewerBokehPlotContainer';
import SaeDataViewerLimitedCard from './SaeDataViewerLimitedCard';
import SaeDataViewerDatePicker from './SaeDataViewerDatePicker';
import SaeDataViewerProducts from './SaeDataViewerProducts';
import SaeDataViewerSites from './SaeDataViewerSites';
import SaeDataViewerContext, { SAE_BUNDLE_PRODUCT_CODE } from './SaeDataViewerContext';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { COLORS } from '../Theme/Theme';
import { isStringNonEmpty } from '../../util/typeUtil';
const VERTICAL_TABS_WIDTH = 150;
const useStyles = makeStyles()((theme)=>({
        tabsContainer: {
            display: 'flex',
            margin: theme.spacing(0, -0.5, -0.5, -0.5),
            borderBottom: `1.5px solid ${COLORS.GREY[200]}`,
            // Optionally set the vertical tabs to fill the allotted height
            // which requires setting a fixed height for it to fill
            // height: '320px',
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
            marginBottom: theme.spacing(2),
            padding: theme.spacing(0, 0.5, 0.5, 0.5),
            borderWidth: '1.5px',
            borderTopWidth: '0px'
        },
        bokehPlotContainer: {
            margin: theme.spacing(0, 2, 2, 2)
        },
        limitedCardContainer: {
            margin: theme.spacing(0, 0, 2, 0)
        },
        summaryDiv: {
            marginBottom: theme.spacing(1)
        }
    }));
const useTabsStyles = makeStyles()((theme)=>({
        scroller: {
            [theme.breakpoints.up('md')]: {
                backgroundColor: theme.palette.grey[100]
            }
        }
    }));
const useTabStyles = makeStyles()((theme)=>({
        root: {
            [theme.breakpoints.up('md')]: {
                marginLeft: '-1.5px',
                '&:is(button:first-of-type)': {
                    marginBottom: '-0.5px',
                    borderTopLeftRadius: '4px'
                },
                '&:not(button:first-of-type)': {
                    marginTop: '-1.5px'
                }
            },
            [theme.breakpoints.down('md')]: {
                paddingRight: theme.spacing(2.5),
                '&:not(button:first-of-type)': {
                    marginLeft: '-1.5px'
                }
            },
            minWidth: 'inherit !important',
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
const SaeDataViewerSummary = ()=>{
    const { classes, theme } = useStyles();
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const { saeProduct, site, startDate, endDate } = state;
    const skeletonProps = {
        height: 10,
        style: {
            marginTop: '4px',
            marginBottom: '12px'
        }
    };
    // Product
    const productSummaryTitle = /*#__PURE__*/ _jsxs("div", {
        style: {
            marginRight: theme.spacing(1)
        },
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "subtitle2",
                children: "Data Product"
            }),
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                children: saeProduct.name
            })
        ]
    });
    let productsSummary = /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: 200
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: "100%"
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: "100%"
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: 125
            })
        ]
    });
    if (saeProduct.productData) {
        productsSummary = Object.keys(saeProduct.productData).map((productCode)=>{
            const productHref = RouteService.getProductDetailPath(productCode);
            const coercedData = saeProduct.productData;
            const currentProductData = coercedData[productCode];
            return /*#__PURE__*/ _jsxs("div", {
                style: {
                    marginTop: theme.spacing(1)
                },
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            marginRight: theme.spacing(1)
                        },
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            children: /*#__PURE__*/ _jsx(Link, {
                                href: productHref,
                                target: "_blank",
                                style: {
                                    fontWeight: 600
                                },
                                children: `${currentProductData.productName} - (${currentProductData.productCode})`
                            })
                        })
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            children: currentProductData.productDescription
                        })
                    })
                ]
            }, productCode);
        });
    }
    const releaseRevisionsLink = /*#__PURE__*/ _jsx(Link, {
        target: "_blank",
        href: RouteService.getDataRevisionsReleasePath(),
        children: "official data release page"
    });
    const releaseSummary = /*#__PURE__*/ _jsxs(Typography, {
        variant: "body2",
        children: [
            "Provisional Data may be used. For formally released data, please see",
            ' ',
            releaseRevisionsLink,
            "."
        ]
    });
    // Site
    const siteSummary = /*#__PURE__*/ _jsx(Typography, {
        variant: "body2",
        children: site
    });
    // Date Range
    let dateRangeSummary = /*#__PURE__*/ _jsx(Skeleton, {
        ...skeletonProps,
        width: 300
    });
    const dateRange = [
        startDate,
        endDate
    ];
    if (dateRange[0] && dateRange[1]) {
        const pluralize = (val, unit)=>val === 1 ? `${val} ${unit}` : `${val} ${unit}s`;
        const startMoment = moment(dateRange[0]);
        const endMoment = moment(dateRange[1]);
        const days = Math.ceil(endMoment.diff(startMoment, 'days', true)) + 1;
        const years = Math.floor(days / 365);
        let diff = `${pluralize(days, 'day')}`;
        if (years > 0) {
            diff = !(days % 365) ? `${pluralize(years, 'year')}` : `${pluralize(years, 'year')}, ${pluralize(days % 365, 'day')}`;
        }
        dateRangeSummary = /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            children: `${startMoment.format('MMM D, YYYY')} - ${endMoment.format('MMM D, YYYY')} (${diff})`
        });
    }
    // Variables
    const renderVariableInfo = ()=>{
        const label = saeProduct.variables.length <= 1 ? 'Variable:' : 'Variables:';
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "subtitle2",
                    children: label
                }),
                /*#__PURE__*/ _jsx("div", {
                    children: saeProduct.variables.map((variable)=>/*#__PURE__*/ _jsx("div", {
                            children: /*#__PURE__*/ _jsx(Typography, {
                                variant: "body2",
                                children: `${variable.name} (${variable.units})`
                            })
                        }, variable.name))
                })
            ]
        });
    };
    return /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: classes.summaryDiv,
                children: [
                    productSummaryTitle,
                    productsSummary
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
                        children: "Site"
                    }),
                    siteSummary
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
            /*#__PURE__*/ _jsx("div", {
                className: classes.summaryDiv,
                children: renderVariableInfo()
            })
        ]
    });
};
const TAB_IDS = {
    SUMMARY: 'SUMMARY',
    PRODUCTS: 'PRODUCTS',
    SITES: 'SITES',
    DATE_RANGE: 'DATE_RANGE'
};
const TABS = {
    [TAB_IDS.SUMMARY]: {
        label: 'SUMMARY',
        ariaLabel: 'Summary',
        Icon: SummaryIcon,
        Component: ()=>/*#__PURE__*/ _jsx(SaeDataViewerSummary, {})
    },
    [TAB_IDS.PRODUCTS]: {
        label: 'DATA PRODUCT',
        ariaLabel: 'Data Product',
        Icon: DatasetIcon,
        Component: ()=>/*#__PURE__*/ _jsx(SaeDataViewerProducts, {})
    },
    [TAB_IDS.SITES]: {
        label: 'SITE',
        ariaLabel: 'Site',
        Icon: SitesIcon,
        Component: ()=>/*#__PURE__*/ _jsx(SaeDataViewerSites, {})
    },
    [TAB_IDS.DATE_RANGE]: {
        label: 'DATE RANGE',
        ariaLabel: 'Date Range',
        Icon: DateRangeIcon,
        Component: ()=>/*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "h6",
                        gutterBottom: true,
                        children: "Select by Date Range"
                    }),
                    /*#__PURE__*/ _jsx(SaeDataViewerDatePicker, {})
                ]
            })
    }
};
const DEFAULT_STATE = {
    selectedTab: 'SUMMARY'
};
const containerReducer = (state, action)=>{
    const newState = {
        ...state
    };
    switch(action.type){
        case 'resetState':
            newState.selectedTab = action.selectedTab;
            return newState;
        case 'setSelectedTab':
            newState.selectedTab = action.selectedTab;
            return newState;
        default:
            return state;
    }
};
const SaeDataViewerContainer = ()=>{
    const { classes, theme } = useStyles();
    const { classes: tabClasses } = useTabStyles();
    const { classes: tabsClasses } = useTabsStyles();
    const belowMd = useMediaQuery(theme.breakpoints.down('md'));
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const [containerState, containerDispatch] = useReducer(containerReducer, DEFAULT_STATE);
    const { selectedTab } = containerState;
    const { initProps: { productCode: propProductcode } } = state;
    const setSelectedTab = useCallback((cbSelectedTab)=>{
        containerDispatch({
            type: 'setSelectedTab',
            selectedTab: cbSelectedTab
        });
    }, [
        containerDispatch
    ]);
    const activeTabKeys = [
        TAB_IDS.SUMMARY
    ];
    if (isStringNonEmpty(propProductcode)) {
        const isBundledProduct = propProductcode?.localeCompare(SAE_BUNDLE_PRODUCT_CODE) === 0;
        if (isBundledProduct) {
            activeTabKeys.push(TAB_IDS.PRODUCTS);
        }
    }
    activeTabKeys.push(TAB_IDS.SITES);
    activeTabKeys.push(TAB_IDS.DATE_RANGE);
    const renderTabs = ()=>/*#__PURE__*/ _jsx(Tabs, {
            orientation: belowMd ? 'horizontal' : 'vertical',
            scrollButtons: belowMd ? true : 'auto',
            variant: "scrollable",
            value: selectedTab,
            className: belowMd ? classes.tabsHorizontal : classes.tabsVertical,
            classes: tabsClasses,
            "aria-label": "SAE Data Viewer Controls",
            onChange: (event, newTab)=>{
                setSelectedTab(newTab);
            },
            slotProps: {
                indicator: {
                    style: {
                        display: 'none'
                    }
                }
            },
            children: activeTabKeys.map((tabId)=>{
                const { label, ariaLabel, Icon: TabIcon } = TABS[tabId];
                return /*#__PURE__*/ _jsx(Tab, {
                    value: tabId,
                    label: label,
                    "aria-label": ariaLabel || label,
                    icon: /*#__PURE__*/ _jsx(TabIcon, {}),
                    classes: tabClasses,
                    id: `sae-data-viewer-tab-${tabId}`,
                    "aria-controls": `sae-data-viewer-tabpanel-${tabId}`
                }, tabId);
            })
        });
    const renderTabPanels = ()=>/*#__PURE__*/ _jsx("div", {
            className: classes.tabPanels,
            children: activeTabKeys.map((tabId)=>{
                const { Component: TabComponent } = TABS[tabId];
                return /*#__PURE__*/ _jsx("div", {
                    role: "tabpanel",
                    id: `sae-data-viewer-tabpanel-${tabId}`,
                    "aria-labelledby": `sae-data-viewer-tab-${tabId}`,
                    style: {
                        display: selectedTab === tabId ? 'block' : 'none'
                    },
                    className: classes.tabPanelContainer,
                    children: /*#__PURE__*/ _jsx(TabComponent, {})
                }, tabId);
            })
        });
    return /*#__PURE__*/ _jsxs("div", {
        style: {
            width: '100%'
        },
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: classes.limitedCardContainer,
                children: /*#__PURE__*/ _jsx(SaeDataViewerLimitedCard, {})
            }),
            /*#__PURE__*/ _jsxs(Card, {
                className: classes.graphContainer,
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.tabsContainer,
                        children: [
                            renderTabs(),
                            renderTabPanels()
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: classes.bokehPlotContainer,
                        children: /*#__PURE__*/ _jsx(SaeDataViewerBokehPlotContainer, {})
                    })
                ]
            })
        ]
    });
};
export default SaeDataViewerContainer;
