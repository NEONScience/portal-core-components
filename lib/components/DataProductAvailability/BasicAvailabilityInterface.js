import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import AscIcon from '@mui/icons-material/KeyboardArrowDown';
import DescIcon from '@mui/icons-material/KeyboardArrowUp';
import ClickIcon from '@mui/icons-material/TouchApp';
import DragIcon from '@mui/icons-material/VerticalAlignCenter';
import PanIcon from '@mui/icons-material/PanTool';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import NeonContext from '../NeonContext/NeonContext';
import MapSelectionButton from '../MapSelectionButton/MapSelectionButton';
import SiteChip from '../SiteChip/SiteChip';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import AvailabilityPending from './AvailabilityPending';
import BasicAvailabilityGrid from './BasicAvailabilityGrid';
import BasicAvailabilityKey from './BasicAvailabilityKey';
import { SVG, TIME, AvailabilityPropTypes } from './AvailabilityUtils';
import { SvgDefs } from './AvailabilitySvgComponents';
/**
   Setup: CSS classes
*/ const useStyles = makeStyles((theme)=>({
        svg: {
            minWidth: `${SVG.MIN_WIDTH}px`,
            minHeight: `${SVG.MIN_HEIGHT}px`
        },
        topFormHeader: {
            display: 'flex',
            alignItems: 'center'
        },
        h5Small: {
            fontSize: '1.075rem'
        },
        h6Small: {
            fontSize: '0.95rem'
        },
        xsSelect: {
            height: theme.spacing(4),
            '& div': {
                padding: Theme.spacing(1, 3, 1, 1.5)
            }
        },
        sortSelect: {
            height: theme.spacing(4),
            '& div': {
                paddingRight: Theme.spacing(4.5)
            },
            marginRight: theme.spacing(2)
        },
        helpIcon: {
            color: theme.palette.grey[300],
            marginRight: theme.spacing(1)
        },
        helpGridContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            padding: '16px 16px 8px 16px !important'
        },
        helpGrid: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: theme.spacing(1),
            marginRight: theme.spacing(1)
        }
    }));
const useSiteChipStyles = makeStyles((theme)=>({
        deleteIcon: {
            marginLeft: theme.spacing(-0.25)
        }
    }));
const defaultProps = {
    siteCodes: [],
    dataProducts: [],
    view: null,
    sortMethod: null,
    sortDirection: 'ASC',
    disableSelection: false,
    delineateRelease: false,
    availabilityStatusType: null
};
/**
   Main Function
*/ const BasicAvailabilityInterface = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const atXs = useMediaQuery(Theme.breakpoints.only('xs'));
    const atSm = useMediaQuery(Theme.breakpoints.only('sm'));
    const siteChipClasses = useSiteChipStyles(Theme);
    const { dataProducts, ...other } = props;
    const [{ data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError }] = NeonContext.useNeonContextState();
    const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
    /**
     Sort methods and directions
  */ const SORT_METHODS = useMemo(()=>({
            states: {
                label: 'by State',
                getSortFunction: (ret)=>(a, b)=>{
                        const aState = allStates[allSites[a].stateCode].name;
                        const bState = allStates[allSites[b].stateCode].name;
                        if (aState === bState) {
                            return a < b ? ret[0] : ret[1];
                        }
                        return aState < bState ? ret[0] : ret[1];
                    }
            },
            domains: {
                label: 'by Domain',
                getSortFunction: (ret)=>(a, b)=>{
                        const aDomain = allSites[a].domainCode;
                        const bDomain = allSites[b].domainCode;
                        if (aDomain === bDomain) {
                            return a < b ? ret[0] : ret[1];
                        }
                        return aDomain < bDomain ? ret[0] : ret[1];
                    }
            },
            sites: {
                label: 'by Site',
                getSortFunction: (ret)=>(a, b)=>a < b ? ret[0] : ret[1]
            }
        }), [
        allStates,
        allSites
    ]);
    const SORT_DIRECTIONS = [
        'ASC',
        'DESC'
    ];
    const PRODUCT_LOOKUP = useMemo(()=>{
        const lookup = {};
        dataProducts.forEach((product)=>{
            lookup[product.dataProductCode] = product.dataProductTitle;
        });
        return lookup;
    }, [
        dataProducts
    ]);
    /**
     State: Views
     Contain and sort the availability data.
     Afford different methods for presenting/grouping data along the y-axis (geospatial)
  */ const views = useMemo(()=>({
            summary: {
                view: 'summary',
                name: 'Summary',
                selectable: true,
                getLabel: {
                    text: ()=>'ALL ',
                    title: ()=>'All Sites'
                }
            },
            sites: {
                view: 'sites',
                name: 'Site',
                selectable: true,
                getLabel: {
                    text: (key)=>key,
                    title: (key)=>allSites[key].description
                }
            },
            states: {
                view: 'states',
                name: 'State',
                selectable: true,
                getLabel: {
                    text: (key)=>` ${key} `,
                    title: (key)=>allStates[key].name
                }
            },
            domains: {
                view: 'domains',
                name: 'Domain',
                selectable: true,
                getLabel: {
                    text: (key)=>`${key} `,
                    title: (key)=>allDomains[key].name
                }
            },
            ungrouped: {
                view: 'ungrouped',
                name: 'Ungrouped',
                selectable: false,
                getLabel: {
                    text: (key)=>`${allSites[key].stateCode}-${allSites[key].domainCode}-${key}`,
                    title: (key)=>{
                        const siteTitle = allSites[key].description;
                        const domainTitle = allDomains[allSites[key].domainCode].name;
                        const stateTitle = allStates[allSites[key].stateCode].name;
                        return `${stateTitle} - ${domainTitle} - ${siteTitle}`;
                    }
                }
            },
            products: {
                view: 'products',
                name: 'Product',
                selectable: false,
                getLabel: {
                    text: (key)=>key,
                    title: (key)=>PRODUCT_LOOKUP[key]
                }
            }
        }), [
        allDomains,
        allStates,
        allSites,
        PRODUCT_LOOKUP
    ]);
    const selectableViewKeys = Object.keys(views).filter((key)=>views[key].selectable);
    /**
     State: Context-Derived Stuff
  */ const [{ downloadContextIsActive, requiredSteps, productData, sites, dateRange, availabilityView: contextView, availabilitySortMethod: contextSortMethod, availabilitySortDirection: contextSortDirection }, dispatchSelection] = DownloadDataContext.useDownloadDataState();
    const { disableSelection, delineateRelease, availabilityStatusType } = props;
    const selectionEnabled = !disableSelection && requiredSteps.some((step)=>step.key === 'sitesAndDateRange');
    /**
     State: Current View
     View mode can be set from the view prop or pulled from a download context.
     Prop overrides context. If neither are set then default to 'sites' if selection
     is currently enabled and 'summary' if not.
  */ const { view: propsView } = props;
    let initialView = propsView;
    if (!initialView) {
        initialView = contextView;
    }
    if (!initialView) {
        initialView = selectionEnabled ? 'sites' : 'summary';
    }
    const [currentView, setCurrentView] = useState(initialView);
    /**
     State: Current Sort Method and Sort Direction
     Only applies for "ungrouped" view mode.
  */ const { sortMethod: propsSortMethod, sortDirection: propsSortDirection } = props;
    let initialSortMethod = propsSortMethod;
    if (!initialSortMethod) {
        initialSortMethod = contextSortMethod;
    }
    if (!initialSortMethod) {
        initialSortMethod = 'states';
    }
    let initialSortDirection = propsSortDirection;
    if (!initialSortDirection) {
        initialSortDirection = contextSortDirection;
    }
    if (!initialSortDirection) {
        initialSortDirection = 'ASC';
    }
    const [currentSortMethod, setCurrentSortMethod] = useState(initialSortMethod);
    const [currentSortDirection, setCurrentSortDirection] = useState(initialSortDirection);
    const setSitesValue = useCallback((sitesValue)=>dispatchSelection({
            type: 'setValidatableValue',
            key: 'sites',
            value: sitesValue
        }), [
        dispatchSelection
    ]);
    const setDateRangeValue = useCallback((dateRangeValue)=>dispatchSelection({
            type: 'setValidatableValue',
            key: 'dateRange',
            value: dateRangeValue
        }), [
        dispatchSelection
    ]);
    /**
     Handlers
  */ const handleSelectAllSites = ()=>{
        setSitesValue(sites.validValues);
    };
    const handleSelectNoneSites = ()=>{
        setSitesValue([]);
    };
    const handleSelectAllDateRange = (inValidValues)=>{
        setDateRangeValue(inValidValues);
    };
    const handleSelectLatestYearDateRange = (inDateRange)=>{
        const start = TIME.getYearMonthMoment(inDateRange.validValues[1]).subtract(11, 'months').format('YYYY-MM');
        setDateRangeValue([
            start < inDateRange.validValues[0] ? inDateRange.validValues[0] : start,
            inDateRange.validValues[1]
        ]);
    };
    const handleChangeStartDate = (inDateRange, newStartDate)=>{
        setDateRangeValue([
            newStartDate.format('YYYY-MM'),
            inDateRange.value[1]
        ]);
    };
    const handleChangeEndDate = (inDateRange, newEndDate)=>{
        setDateRangeValue([
            inDateRange.value[0],
            newEndDate.format('YYYY-MM')
        ]);
    };
    const handleChangeView = (event, newView)=>{
        if (!selectableViewKeys.includes(newView) || currentView === newView) {
            return;
        }
        if (downloadContextIsActive) {
            dispatchSelection({
                type: 'setAvailabilityView',
                value: newView
            });
        }
        setCurrentView(newView);
    };
    const handleChangeSortMethod = (event)=>{
        const newSortMethod = event.target.value;
        if (!Object.keys(SORT_METHODS).includes(newSortMethod) || currentSortMethod === newSortMethod) {
            return;
        }
        if (downloadContextIsActive) {
            dispatchSelection({
                type: 'setAvailabilitySortMethod',
                value: newSortMethod
            });
        }
        setCurrentSortMethod(newSortMethod);
    };
    const handleChangeSortDirection = (event, newSortDirection)=>{
        if (!SORT_DIRECTIONS.includes(newSortDirection) || currentSortDirection === newSortDirection) {
            return;
        }
        if (downloadContextIsActive) {
            dispatchSelection({
                type: 'setAvailabilitySortDirection',
                value: newSortDirection
            });
        }
        setCurrentSortDirection(newSortDirection);
    };
    /**
     Product Data: Map to Views
     Statically loaded in via props or pulled from context. If both, props wins.
     Should not change in render lifecycle.
     Create mappings of the shape row => year-month => status for
     all aggregation views.
     TODO: Add other statuses. Currently the only status is "available".
  */ const { siteCodes: propsSiteCodes } = props;
    const { siteCodes: contextSiteCodes } = productData;
    const siteCodes = useMemo(()=>{
        let computedSiteCodes = [];
        if (propsSiteCodes && propsSiteCodes.length) {
            computedSiteCodes = propsSiteCodes;
        } else if (contextSiteCodes && contextSiteCodes.length) {
            computedSiteCodes = contextSiteCodes;
        }
        return computedSiteCodes;
    }, [
        propsSiteCodes,
        contextSiteCodes
    ]);
    const viewData = useMemo(()=>{
        const newViewData = {};
        Object.keys(views).forEach((key)=>{
            newViewData[key] = {
                rows: {}
            };
            if (key === 'summary') {
                newViewData[key].rows.summary = {};
            }
        });
        siteCodes.forEach((site)=>{
            const { siteCode, availableMonths, availableReleases } = site;
            if (!allSites[siteCode]) {
                return;
            }
            const { stateCode, domainCode } = allSites[siteCode];
            if (!downloadContextIsActive) {
                sites.validValues.push(siteCode);
            }
            let provAvailableMonths = [];
            if (delineateRelease && Array.isArray(availableReleases)) {
                const provRelease = availableReleases.find((value)=>value.release === 'PROVISIONAL');
                if (provRelease) {
                    provAvailableMonths = provRelease.availableMonths;
                }
            }
            newViewData.sites.rows[siteCode] = {};
            newViewData.states.rows[stateCode] = newViewData.states.rows[stateCode] || {};
            newViewData.domains.rows[domainCode] = newViewData.domains.rows[domainCode] || {};
            availableMonths.forEach((month)=>{
                let status = availabilityStatusType || 'available';
                if (delineateRelease && provAvailableMonths && provAvailableMonths.length > 0) {
                    if (provAvailableMonths.includes(month)) {
                        status = 'available-provisional';
                    }
                }
                if (!newViewData.summary.rows.summary[month]) {
                    newViewData.summary.rows.summary[month] = new Set();
                }
                if (!newViewData.sites.rows[siteCode][month]) {
                    newViewData.sites.rows[siteCode][month] = new Set();
                }
                if (!newViewData.states.rows[stateCode][month]) {
                    newViewData.states.rows[stateCode][month] = new Set();
                }
                if (!newViewData.domains.rows[domainCode][month]) {
                    newViewData.domains.rows[domainCode][month] = new Set();
                }
                newViewData.summary.rows.summary[month].add(status);
                newViewData.sites.rows[siteCode][month].add(status);
                newViewData.states.rows[stateCode][month].add(status);
                newViewData.domains.rows[domainCode][month].add(status);
            });
        });
        dataProducts.forEach((product)=>{
            const { dataProductCode, availableMonths, availableReleases } = product;
            let provAvailableMonths = [];
            if (delineateRelease && Array.isArray(availableReleases)) {
                const provRelease = availableReleases.find((value)=>value.release === 'PROVISIONAL');
                if (provRelease) {
                    provAvailableMonths = provRelease.availableMonths;
                }
            }
            newViewData.products.rows[dataProductCode] = {};
            availableMonths.forEach((month)=>{
                let status = availabilityStatusType || 'available';
                if (delineateRelease && provAvailableMonths && provAvailableMonths.length > 0) {
                    if (provAvailableMonths.includes(month)) {
                        status = 'available-provisional';
                    }
                }
                if (!newViewData.products.rows[dataProductCode][month]) {
                    newViewData.products.rows[dataProductCode][month] = new Set();
                }
                newViewData.products.rows[dataProductCode][month].add(status);
            });
        });
        newViewData.ungrouped.rows = newViewData.sites.rows;
        return newViewData;
    }, [
        views,
        siteCodes,
        dataProducts,
        allSites,
        downloadContextIsActive,
        availabilityStatusType,
        delineateRelease,
        sites.validValues
    ]);
    const appliedDateRange = useMemo(()=>{
        if (!downloadContextIsActive) {
            const summaryMonths = Object.keys(viewData.summary.rows.summary).sort();
            const summaryDateRange = {
                ...dateRange
            };
            // eslint-disable-next-line prefer-destructuring
            summaryDateRange.validValues[0] = summaryMonths[0];
            summaryDateRange.validValues[1] = summaryMonths.pop();
            return summaryDateRange;
        }
        return {
            ...dateRange
        };
    }, [
        viewData,
        downloadContextIsActive,
        dateRange
    ]);
    const sortedSites = useMemo(()=>{
        if (currentView !== 'ungrouped') {
            return [];
        }
        // NOTE - these returns are backwards because the rendering in the chart is bottom-up
        // (though of course a user will read it top-down).
        const sortReturns = [
            currentSortDirection === 'ASC' ? 1 : -1,
            currentSortDirection === 'ASC' ? -1 : 1
        ];
        const calcSortedSites = Object.keys(viewData.ungrouped.rows);
        calcSortedSites.sort(SORT_METHODS[currentSortMethod].getSortFunction(sortReturns));
        return calcSortedSites;
    }, [
        currentView,
        currentSortDirection,
        currentSortMethod,
        viewData,
        SORT_METHODS
    ]);
    /**
     Redraw setup
  */ const svgRef = useRef(null);
    const handleSvgRedraw = useCallback(()=>{
        BasicAvailabilityGrid({
            view: views[currentView],
            data: viewData[currentView],
            svgRef,
            allSites,
            sites,
            sortedSites,
            setSitesValue,
            dateRange: appliedDateRange,
            setDateRangeValue,
            selectionEnabled
        });
    }, [
        svgRef,
        views,
        viewData,
        currentView,
        allSites,
        sites,
        sortedSites,
        setSitesValue,
        appliedDateRange,
        setDateRangeValue,
        selectionEnabled
    ]);
    useLayoutEffect(()=>{
        handleSvgRedraw();
    }, [
        handleSvgRedraw
    ]);
    let justify = 'end';
    if (currentView === 'ungrouped') {
        justify = atXs || atSm ? 'start' : 'end';
    } else {
        justify = atXs ? 'start' : 'end';
    }
    const optionDivStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: `flex-${justify}`
    };
    /**
     Render: NeonContext-related Loading and Error States
  */ if (!neonContextIsFinal || neonContextHasError) {
        const message = currentView === 'products' ? 'Loading Products...' : 'Loading Sites...';
        return /*#__PURE__*/ _jsx(AvailabilityPending, {
            message: message
        });
    }
    /**
     Render: View Options
  */ const renderViewOptions = ()=>/*#__PURE__*/ _jsxs("div", {
            style: optionDivStyle,
            "data-selenium": "data-product-availability.view-options",
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "h6",
                    className: classes.h6Small,
                    style: {
                        marginRight: Theme.spacing(1.5),
                        whiteSpace: 'nowrap'
                    },
                    children: "View By:"
                }),
                /*#__PURE__*/ _jsx(Box, {
                    sx: {
                        display: {
                            sm: 'none',
                            md: 'block'
                        }
                    },
                    children: /*#__PURE__*/ _jsx(ToggleButtonGroup, {
                        exclusive: true,
                        color: "primary",
                        variant: "outlined",
                        size: "small",
                        value: currentView,
                        onChange: handleChangeView,
                        children: selectableViewKeys.map((key)=>/*#__PURE__*/ _jsx(ToggleButton, {
                                value: key,
                                size: "small",
                                children: views[key].name
                            }, key))
                    })
                }, "viewMdUp"),
                /*#__PURE__*/ _jsx(Box, {
                    sx: {
                        display: {
                            sn: 'block',
                            md: 'none'
                        }
                    },
                    children: /*#__PURE__*/ _jsx(FormControl, {
                        variant: "filled",
                        children: /*#__PURE__*/ _jsx(Select, {
                            value: currentView,
                            onChange: (event)=>handleChangeView(event, event.target.value),
                            input: /*#__PURE__*/ _jsx(OutlinedInput, {
                                size: "small",
                                className: selectionEnabled ? null : classes.xsSelect
                            }),
                            variant: "filled",
                            children: selectableViewKeys.map((key)=>/*#__PURE__*/ _jsx(MenuItem, {
                                    value: key,
                                    children: views[key].name
                                }, key))
                        })
                    })
                })
            ]
        });
    /**
     Render: Sort Options
  */ const renderSortOptions = ()=>/*#__PURE__*/ _jsxs("div", {
            style: optionDivStyle,
            "data-selenium": "data-product-availability.sort-options",
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "h6",
                    className: classes.h6Small,
                    style: {
                        marginRight: Theme.spacing(1.5),
                        whiteSpace: 'nowrap'
                    },
                    children: "Sort By:"
                }),
                /*#__PURE__*/ _jsxs("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end'
                    },
                    children: [
                        /*#__PURE__*/ _jsx(FormControl, {
                            variant: "outlined",
                            children: /*#__PURE__*/ _jsx(Select, {
                                value: currentSortMethod,
                                "aria-label": "Sort Method",
                                className: classes.sortSelect,
                                onChange: handleChangeSortMethod,
                                "data-selenium": "data-product-availability.sort-options.method",
                                children: Object.keys(SORT_METHODS).map((method)=>/*#__PURE__*/ _jsx(MenuItem, {
                                        value: method,
                                        children: SORT_METHODS[method].label
                                    }, method))
                            })
                        }),
                        /*#__PURE__*/ _jsxs(ToggleButtonGroup, {
                            exclusive: true,
                            size: "small",
                            value: currentSortDirection,
                            onChange: handleChangeSortDirection,
                            "data-selenium": "data-product-availability.sort-options.direction",
                            children: [
                                /*#__PURE__*/ _jsx(ToggleButton, {
                                    value: SORT_DIRECTIONS[0],
                                    title: "Sort Ascending (A-Z)",
                                    "aria-label": "Sort Ascending (A-Z)",
                                    children: /*#__PURE__*/ _jsx(AscIcon, {
                                        fontSize: "small"
                                    })
                                }, SORT_DIRECTIONS[0]),
                                /*#__PURE__*/ _jsx(ToggleButton, {
                                    value: SORT_DIRECTIONS[1],
                                    title: "Sort Descending (Z-A)",
                                    "aria-label": "Sort Descending (Z-A)",
                                    children: /*#__PURE__*/ _jsx(DescIcon, {
                                        fontSize: "small"
                                    })
                                }, SORT_DIRECTIONS[1])
                            ]
                        })
                    ]
                })
            ]
        });
    /**
     Render: View Controls
  */ const renderViewControls = ()=>{
        if (currentView === 'products') {
            return /*#__PURE__*/ _jsx(Grid, {
                item: true,
                xs: 12
            });
        }
        return /*#__PURE__*/ _jsx(Grid, {
            item: true,
            xs: 12,
            sm: currentView === 'ungrouped' ? 12 : 5,
            md: 6,
            children: currentView === 'ungrouped' ? renderSortOptions() : renderViewOptions()
        });
    };
    /**
     Render: Key
  */ const renderKey = ()=>{
        let smWidth = currentView === 'ungrouped' ? 12 : 7;
        let mdWidth = 6;
        if (currentView === 'products') {
            smWidth = 12;
            mdWidth = 12;
        }
        return /*#__PURE__*/ _jsx(Grid, {
            item: true,
            xs: 12,
            sm: smWidth,
            md: mdWidth,
            style: {
                display: 'flex',
                alignItems: 'center'
            },
            children: /*#__PURE__*/ _jsx(BasicAvailabilityKey, {
                orientation: currentView === 'products' ? 'horizontal' : '',
                selectionEnabled: selectionEnabled,
                delineateRelease: delineateRelease,
                availabilityStatusType: availabilityStatusType,
                style: {
                    flexGrow: 1
                }
            })
        });
    };
    /**
     Render: Selection
  */ const renderSelection = ()=>{
        const sitesPlural = sites.value.length > 1 ? 's' : '';
        const siteChipLabel = `${sites.value.length} site${sitesPlural}`;
        const siteChipProps = {
            size: 'large',
            color: 'primary',
            classes: siteChipClasses,
            label: sites.value.length ? siteChipLabel : 'no sites selected',
            variant: sites.value.length ? 'default' : 'outlined',
            onDelete: sites.value.length ? handleSelectNoneSites : null
        };
        const selectionButtonProps = {
            size: 'small',
            color: 'primary',
            variant: 'outlined'
        };
        const datePickerContainerStyleProps = {
            marginTop: '8px',
            marginBottom: '4px'
        };
        const datePickerProps = {
            inputVariant: 'outlined',
            margin: 'dense',
            views: [
                'month',
                'year'
            ],
            openTo: 'month'
        };
        return /*#__PURE__*/ _jsxs(Grid, {
            container: true,
            spacing: 3,
            children: [
                /*#__PURE__*/ _jsxs(Grid, {
                    item: true,
                    xs: 12,
                    sm: 5,
                    md: 6,
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                            className: classes.topFormHeader,
                            children: /*#__PURE__*/ _jsx(Typography, {
                                variant: "h6",
                                className: classes.h6Small,
                                children: "Sites"
                            })
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            style: {
                                marginTop: Theme.spacing(1),
                                marginBottom: Theme.spacing(1.5)
                            },
                            children: /*#__PURE__*/ _jsx(SiteChip, {
                                ...siteChipProps
                            })
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex'
                            },
                            children: [
                                /*#__PURE__*/ _jsx(Button, {
                                    ...selectionButtonProps,
                                    "data-selenium": "data-product-availability.select-all-sites-button",
                                    onClick: handleSelectAllSites,
                                    children: "Select All Sites"
                                }),
                                /*#__PURE__*/ _jsx(MapSelectionButton, {
                                    selection: "SITES",
                                    selectedItems: sites.value,
                                    validItems: sites.validValues,
                                    buttonProps: {
                                        ...selectionButtonProps,
                                        style: {
                                            marginLeft: Theme.spacing(1)
                                        }
                                    },
                                    "data-selenium": "data-product-availability.map-button",
                                    onSave: (newSites)=>{
                                        setSitesValue(Array.from(newSites));
                                    }
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs(Grid, {
                    item: true,
                    xs: 12,
                    sm: 7,
                    md: 6,
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h6",
                            className: classes.h6Small,
                            children: "Date Range"
                        }),
                        /*#__PURE__*/ _jsx(LocalizationProvider, {
                            dateAdapter: AdapterMoment,
                            children: /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    display: 'flex',
                                    flexWrap: 'nowrap'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        style: {
                                            ...datePickerContainerStyleProps,
                                            marginRight: Theme.spacing(1.5)
                                        },
                                        children: /*#__PURE__*/ _jsx(DatePicker, {
                                            ...datePickerProps,
                                            label: "Start",
                                            "data-selenium": "data-product-availability.date-range-start",
                                            orientation: "portrait",
                                            value: TIME.getYearMonthMoment(appliedDateRange.value[0]),
                                            onChange: (newDate)=>handleChangeStartDate(appliedDateRange, newDate),
                                            minDate: TIME.getYearMonthMoment(appliedDateRange.validValues[0]),
                                            maxDate: TIME.getYearMonthMoment(appliedDateRange.value[1]),
                                            slotProps: {
                                                textField: {
                                                    size: 'small'
                                                }
                                            }
                                        })
                                    }),
                                    /*#__PURE__*/ _jsx("div", {
                                        style: datePickerContainerStyleProps,
                                        children: /*#__PURE__*/ _jsx(DatePicker, {
                                            ...datePickerProps,
                                            label: "End",
                                            "data-selenium": "data-product-availability.date-range-end",
                                            orientation: "portrait",
                                            value: TIME.getYearMonthMoment(appliedDateRange.value[1]),
                                            onChange: (newDate)=>handleChangeEndDate(appliedDateRange, newDate),
                                            minDate: TIME.getYearMonthMoment(appliedDateRange.value[0]),
                                            maxDate: TIME.getYearMonthMoment(appliedDateRange.validValues[1]),
                                            slotProps: {
                                                textField: {
                                                    size: 'small'
                                                }
                                            }
                                        })
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex',
                                marginTop: Theme.spacing(1)
                            },
                            children: [
                                /*#__PURE__*/ _jsx(Button, {
                                    ...selectionButtonProps,
                                    "data-selenium": "data-product-availability.all-years-button",
                                    onClick: ()=>handleSelectAllDateRange(appliedDateRange.validValues),
                                    children: "Select All Years"
                                }),
                                /*#__PURE__*/ _jsx(Button, {
                                    ...selectionButtonProps,
                                    "data-selenium": "data-product-availability.latest-year-button",
                                    onClick: ()=>handleSelectLatestYearDateRange(appliedDateRange),
                                    style: {
                                        marginLeft: Theme.spacing(1)
                                    },
                                    children: "Select Latest Year"
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    style: {
                        marginBottom: Theme.spacing(1)
                    },
                    children: /*#__PURE__*/ _jsx(Card, {
                        children: /*#__PURE__*/ _jsxs(CardContent, {
                            className: classes.helpGridContainer,
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: classes.helpGrid,
                                    children: [
                                        /*#__PURE__*/ _jsx(PanIcon, {
                                            className: classes.helpIcon
                                        }),
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "body1",
                                            component: "div",
                                            style: {
                                                flexGrow: 1
                                            },
                                            children: "Drag the grid to pan across time"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: classes.helpGrid,
                                    children: [
                                        /*#__PURE__*/ _jsx(ClickIcon, {
                                            className: classes.helpIcon
                                        }),
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "body1",
                                            component: "div",
                                            style: {
                                                flexGrow: 1
                                            },
                                            children: "Click rows to select sites"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: classes.helpGrid,
                                    children: [
                                        /*#__PURE__*/ _jsx(DragIcon, {
                                            className: classes.helpIcon,
                                            style: {
                                                transform: 'rotate(90deg)'
                                            }
                                        }),
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "body1",
                                            component: "div",
                                            style: {
                                                flexGrow: 1
                                            },
                                            children: "Drag selection edges to adjust dates"
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                })
            ]
        });
    };
    /**
     Render: Final Component
  */ const currentRows = viewData[currentView].rows;
    const currentRowCount = Object.keys(currentRows).length;
    const svgHeight = SVG.CELL_PADDING + (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (currentRowCount + 1);
    return /*#__PURE__*/ _jsxs(FullWidthVisualization, {
        vizRef: svgRef,
        minWidth: SVG.MIN_WIDTH,
        handleRedraw: handleSvgRedraw,
        "data-selenium": "data-product-availability",
        ...other,
        children: [
            /*#__PURE__*/ _jsx(SvgDefs, {}),
            /*#__PURE__*/ _jsxs(Grid, {
                container: true,
                spacing: 2,
                direction: "row-reverse",
                style: {
                    marginBottom: Theme.spacing(1)
                },
                children: [
                    selectionEnabled ? /*#__PURE__*/ _jsx(Grid, {
                        item: true,
                        xs: 12,
                        sm: 12,
                        children: renderSelection()
                    }) : null,
                    renderViewControls(),
                    renderKey()
                ]
            }),
            /*#__PURE__*/ _jsx("svg", {
                id: uniqueId('dpa-'),
                ref: svgRef,
                height: svgHeight,
                className: classes.svg
            })
        ]
    });
};
BasicAvailabilityInterface.propTypes = {
    siteCodes: AvailabilityPropTypes.basicSiteCodes,
    dataProducts: AvailabilityPropTypes.dataProducts,
    view: PropTypes.oneOf([
        'summary',
        'sites',
        'states',
        'domains',
        'ungrouped',
        'products'
    ]),
    sortMethod: PropTypes.oneOf([
        'sites',
        'states',
        'domains'
    ]),
    sortDirection: PropTypes.oneOf([
        'ASC',
        'DESC'
    ]),
    disableSelection: PropTypes.bool,
    delineateRelease: PropTypes.bool,
    availabilityStatusType: PropTypes.oneOf([
        'available',
        'tombstoned'
    ])
};
export default BasicAvailabilityInterface;
