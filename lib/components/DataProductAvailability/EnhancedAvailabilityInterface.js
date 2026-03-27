import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { makeStyles } from '@mui/styles';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import AscIcon from '@mui/icons-material/KeyboardArrowDown';
import DescIcon from '@mui/icons-material/KeyboardArrowUp';
import AvailabilityContext from './AvailabilityContext';
import AvailabilityPending from './AvailabilityPending';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import EnhancedAvailabilityKey from './EnhancedAvailabilityKey';
import EnhancedAvailabilityGrid from './EnhancedAvailabilityGrid';
import { SVG, AvailabilityPropTypes } from './AvailabilityUtils';
import { SvgDefs } from './AvailabilitySvgComponents';
const preStyle = {
    width: '100%',
    height: '50vh',
    overflowY: 'scroll',
    padding: '2px',
    border: '1px dotted black'
};
/**
   Setup: CSS classes
*/ const useStyles = makeStyles((theme)=>({
        svg: {
            minWidth: `${SVG.MIN_WIDTH}px`,
            minHeight: `${SVG.MIN_HEIGHT}px`
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
        viewAndSortOptionsContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: theme.spacing(3)
        }
    }));
const defaultProps = {
    sites: [],
    view: null,
    table: 'ALL',
    sortMethod: null,
    sortDirection: 'ASC',
    disableSelection: false
};
const EnhancedAvailabilityInterface = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { sites: availabilitySites, ...other } = props;
    const classes = useStyles(Theme);
    const [{ isFinal: neonContextIsFinal, hasError: neonContextHasError }] = NeonContext.useNeonContextState();
    const { SORT_DIRECTIONS, useAvailabilityState } = AvailabilityContext;
    const [availabilityState, availabilityDispatch] = useAvailabilityState();
    const { rows, rowLabels, rowTitles, tables, breakouts, validBreakouts, sortDirection } = availabilityState;
    /**
     Context-Derived Stuff
  */ const selectionEnabled = false;
    /**
     Redraw setup
  */ const svgRef = useRef(null);
    const handleSvgRedraw = useCallback(()=>{
        if (!rowLabels.length) {
            return;
        }
        EnhancedAvailabilityGrid({
            rows,
            rowLabels,
            rowTitles,
            svgRef,
            selectionEnabled
        });
    }, [
        svgRef,
        rows,
        rowLabels,
        rowTitles,
        selectionEnabled
    ]);
    useEffect(()=>{
        handleSvgRedraw();
    });
    /*
  let justify = 'end';
  if (currentView === 'ungrouped') {
    justify = atXs || atSm ? 'start' : 'end';
  } else {
    justify = atXs ? 'start' : 'end';
  }
  */ const optionDivStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    };
    /**
     Render: NeonContext-related Loading and Error States
  */ if (!neonContextIsFinal || neonContextHasError) {
        return /*#__PURE__*/ _jsx(AvailabilityPending, {});
    }
    /**
     Render: Breakout Options
  */ const renderBreakoutOptions = ()=>{
        const handleChangeBreakouts = (event, newBreakouts)=>{
            availabilityDispatch({
                type: 'setBreakouts',
                breakouts: newBreakouts
            });
        };
        return /*#__PURE__*/ _jsxs("div", {
            style: {
                ...optionDivStyle,
                marginRight: Theme.spacing(3)
            },
            "data-selenium": "data-product-availability.breakout-options",
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
                /*#__PURE__*/ _jsx(ToggleButtonGroup, {
                    color: "primary",
                    variant: "outlined",
                    size: "small",
                    value: breakouts,
                    onChange: handleChangeBreakouts,
                    children: validBreakouts.map((key)=>/*#__PURE__*/ _jsx(ToggleButton, {
                            value: key,
                            size: "small",
                            children: key
                        }, key))
                })
            ]
        });
    };
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
                            children: /*#__PURE__*/ _jsxs(Select, {
                                value: breakouts.length ? breakouts[0] : 'n/a',
                                "aria-label": "Sort By",
                                className: classes.sortSelect,
                                onChange: (event)=>{
                                    availabilityDispatch({
                                        type: 'setSortMethod',
                                        method: event.target.value
                                    });
                                },
                                "data-selenium": "data-product-availability.sort-options.method",
                                children: [
                                    /*#__PURE__*/ _jsx(MenuItem, {
                                        value: "n/a",
                                        disabled: true,
                                        children: "--"
                                    }, "--"),
                                    validBreakouts.map((method)=>/*#__PURE__*/ _jsx(MenuItem, {
                                            value: method,
                                            children: `${method.substr(0, 1).toUpperCase()}${method.substr(1)}`
                                        }, method))
                                ]
                            })
                        }),
                        /*#__PURE__*/ _jsxs(ToggleButtonGroup, {
                            exclusive: true,
                            size: "small",
                            value: breakouts.length ? sortDirection : null,
                            onChange: (event, newSortDirection)=>{
                                availabilityDispatch({
                                    type: 'setSortDirection',
                                    direction: newSortDirection
                                });
                            },
                            "data-selenium": "data-product-availability.sort-options.direction",
                            children: [
                                /*#__PURE__*/ _jsx(ToggleButton, {
                                    value: SORT_DIRECTIONS.ASC,
                                    style: breakouts.length ? null : {
                                        borderColor: 'unset'
                                    },
                                    disabled: !breakouts.length,
                                    title: "Sort Ascending (A-Z)",
                                    "aria-label": "Sort Ascending (A-Z)",
                                    children: /*#__PURE__*/ _jsx(AscIcon, {
                                        fontSize: "small"
                                    })
                                }, SORT_DIRECTIONS.ASC),
                                /*#__PURE__*/ _jsx(ToggleButton, {
                                    value: SORT_DIRECTIONS.DESC,
                                    style: breakouts.length ? null : {
                                        borderColor: 'unset'
                                    },
                                    disabled: !breakouts.length,
                                    title: "Sort Descending (Z-A)",
                                    "aria-label": "Sort Descending (Z-A)",
                                    children: /*#__PURE__*/ _jsx(DescIcon, {
                                        fontSize: "small"
                                    })
                                }, SORT_DIRECTIONS.DESC)
                            ]
                        })
                    ]
                })
            ]
        });
    /**
     Main Render
  */ const svgHeight = SVG.CELL_PADDING + (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (rowLabels.length + 1);
    const rollUpPresent = !(breakouts.includes('sites') && breakouts.includes('tables'));
    return /*#__PURE__*/ _jsxs(FullWidthVisualization, {
        vizRef: svgRef,
        minWidth: SVG.MIN_WIDTH,
        handleRedraw: handleSvgRedraw,
        "data-selenium": "data-product-availability",
        ...other,
        children: [
            /*#__PURE__*/ _jsx(SvgDefs, {}),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.viewAndSortOptionsContainer,
                children: [
                    renderBreakoutOptions(),
                    renderSortOptions()
                ]
            }),
            /*#__PURE__*/ _jsx(EnhancedAvailabilityKey, {
                selectionEnabled: true,
                rollUpPresent: rollUpPresent
            }),
            /*#__PURE__*/ _jsx("br", {}),
            /*#__PURE__*/ _jsx("svg", {
                id: uniqueId('dpa-'),
                ref: svgRef,
                height: svgHeight,
                className: classes.svg
            }),
            /*#__PURE__*/ _jsx("br", {}),
            /*#__PURE__*/ _jsx("br", {}),
            /*#__PURE__*/ _jsx("br", {}),
            /*#__PURE__*/ _jsx("pre", {
                style: preStyle,
                children: JSON.stringify(tables, null, 2)
            })
        ]
    });
};
EnhancedAvailabilityInterface.propTypes = {
    sites: AvailabilityPropTypes.enhancedSites,
    view: PropTypes.oneOf([
        'summary',
        'sites',
        'states',
        'domains',
        'ungrouped'
    ]),
    table: PropTypes.string,
    sortMethod: PropTypes.oneOf([
        'sites',
        'states',
        'domains'
    ]),
    sortDirection: PropTypes.oneOf([
        'ASC',
        'DESC'
    ]),
    disableSelection: PropTypes.bool
};
export default EnhancedAvailabilityInterface;
