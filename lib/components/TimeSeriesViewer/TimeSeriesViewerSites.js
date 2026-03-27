import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/forbid-prop-types */ import React, { useState, useLayoutEffect, useCallback, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import ClearIcon from '@mui/icons-material/Clear';
import ElevationIcon from '@mui/icons-material/Terrain';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import LocationIcon from '@mui/icons-material/MyLocation';
import NoneIcon from '@mui/icons-material/NotInterested';
import SearchIcon from '@mui/icons-material/Search';
import SelectIcon from '@mui/icons-material/TouchApp';
import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import MapSelectionButton from '../MapSelectionButton/MapSelectionButton';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
import iconCoreTerrestrialSVG from '../SiteMap/svg/icon-site-core-terrestrial.svg';
import iconCoreAquaticSVG from '../SiteMap/svg/icon-site-core-aquatic.svg';
import iconGradientTerrestrialSVG from '../SiteMap/svg/icon-site-gradient-terrestrial.svg';
import iconGradientAquaticSVG from '../SiteMap/svg/icon-site-gradient-aquatic.svg';
import TimeSeriesViewerContext, { TabComponentPropTypes, POINTS_PERFORMANCE_LIMIT, MAX_NUM_SITES_SELECTABLE } from './TimeSeriesViewerContext';
const ucWord = (word)=>`${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
const ICON_SVGS = {
    CORE: {
        AQUATIC: iconCoreAquaticSVG,
        TERRESTRIAL: iconCoreTerrestrialSVG
    },
    GRADIENT: {
        AQUATIC: iconGradientAquaticSVG,
        TERRESTRIAL: iconGradientTerrestrialSVG
    }
};
/**
   Classes and Styles
*/ const useStyles = makeStyles((theme)=>({
        root: {
            flexGrow: 1,
            width: '100%'
        },
        input: {
            display: 'flex',
            padding: '2px',
            height: 'auto'
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center',
            overflow: 'hidden'
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2)
        },
        placeholder: {
            position: 'absolute',
            left: 2,
            bottom: 6,
            fontSize: 16
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0
        },
        divider: {
            height: theme.spacing(2)
        },
        optionSubtitle: {
            fontSize: '0.75rem',
            color: Theme.palette.grey[500]
        },
        sitesContainer: {
            display: 'flex',
            alignContent: 'flex-start',
            flexFlow: 'row wrap'
        },
        siteCard: {
            width: '100%',
            padding: theme.spacing(1.5, 2, 1.5, 2),
            backgroundColor: theme.palette.grey[50],
            marginTop: theme.spacing(3)
        },
        siteTitleContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Theme.spacing(1.5)
        },
        siteDetailsRow: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'space-between'
        },
        siteDetailsColumn: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: Theme.spacing(0.5)
        },
        siteDetail: {
            marginBottom: Theme.spacing(1),
            marginRight: Theme.spacing(4)
        },
        noneIcon: {
            color: theme.palette.grey[400],
            marginRight: theme.spacing(0.5),
            fontSize: '1rem'
        },
        noneLabel: {
            color: theme.palette.grey[400]
        },
        positionsTitleContainer: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: theme.spacing(2)
        },
        positionsCardContainer: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
        },
        positionCard: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: theme.spacing(1, 2, 1, 0.5),
            backgroundColor: theme.palette.grey[100],
            marginTop: theme.spacing(1.5),
            marginRight: theme.spacing(1.5),
            width: '100%',
            maxWidth: '800px'
        },
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
        }
    }));
const selectStyles = {
    input: (base)=>({
            ...base,
            color: Theme.palette.text.primary,
            '& input': {
                font: 'inherit'
            }
        }),
    clearIndicator: (base)=>({
            ...base,
            display: 'none'
        }),
    indicatorSeparator: (base)=>({
            ...base,
            display: 'none'
        }),
    dropdownIndicator: (base)=>({
            ...base,
            cursor: 'pointer'
        }),
    groupHeading: (base)=>({
            ...base,
            fontSize: '1rem',
            fontWeight: 600,
            color: Theme.palette.primary.main
        })
};
/**
   Common React-Select Components - used by both site-specific and position-specific react-selects
*/ const inputComponent = /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx("div", {
        ref: ref,
        ...props
    }));
function ValueContainer(props) {
    const { selectProps, children } = props;
    const { valueContainer } = selectProps.classes;
    return /*#__PURE__*/ _jsx("div", {
        className: valueContainer,
        children: children
    });
}
ValueContainer.propTypes = {
    children: PropTypes.node.isRequired,
    selectProps: PropTypes.object.isRequired
};
function Menu(props) {
    const { selectProps, innerProps, children } = props;
    const { paper } = selectProps.classes;
    return /*#__PURE__*/ _jsx(Paper, {
        square: true,
        className: paper,
        ...innerProps,
        children: children
    });
}
Menu.propTypes = {
    children: PropTypes.element.isRequired,
    innerProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired
};
/**
   Common React-Select PropTypes - used by both site-specific and position-specific components
*/ const ControlPropTypes = {
    children: PropTypes.node.isRequired,
    innerProps: PropTypes.shape({
        onMouseDown: PropTypes.func.isRequired
    }).isRequired,
    innerRef: PropTypes.oneOfType([
        PropTypes.oneOf([
            null
        ]),
        PropTypes.func,
        PropTypes.shape({
            current: PropTypes.any.isRequired
        })
    ]).isRequired,
    selectProps: PropTypes.object.isRequired
};
const OptionPropTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
        key: PropTypes.string,
        onClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseOver: PropTypes.func,
        tabIndex: PropTypes.number.isRequired
    }),
    innerRef: PropTypes.oneOfType([
        PropTypes.oneOf([
            null
        ]),
        PropTypes.func,
        PropTypes.shape({
            current: PropTypes.any.isRequired
        })
    ]),
    isFocused: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    data: PropTypes.object.isRequired
};
const OptionDefaultProps = {
    children: null,
    innerProps: null,
    innerRef: null,
    isDisabled: false
};
const positionsDescription = `
  Positions are distinct physical sensor locations at a given site. The x, y, and z coordinates
  describe where the sensor is located relative to the ground-level reference location.
  Positions may change over time.
`;
const positionsSeriesDescription = `
  Each position selected will become a distinct series in the chart for each variable (example: 2
  positions × 3 variables = 6 distinct series).
`;
const positionHistoryButtonDefaultProps = {
    fullWidth: false
};
/**
   PositionHistoryButton - button that opens a dialog to show all history for a given position
*/ function PositionHistoryButton(inProps) {
    const props = resolveProps(positionHistoryButtonDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { siteCode, position, history, fullWidth } = props;
    const disabled = history.length < 2;
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    if (disabled) {
        return /*#__PURE__*/ _jsx(Button, {
            fullWidth: fullWidth,
            size: "small",
            variant: "outlined",
            title: "This position has had no changes to physical locations since its creation",
            startIcon: /*#__PURE__*/ _jsx(HistoryIcon, {}),
            disabled: true,
            children: "No History"
        });
    }
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Button, {
                fullWidth: fullWidth,
                size: "small",
                variant: "outlined",
                onClick: ()=>{
                    setHistoryDialogOpen(true);
                },
                title: "Click to show all changes to physical locations for this position over time",
                startIcon: /*#__PURE__*/ _jsx(HistoryIcon, {}),
                children: `History (${history.length})`
            }),
            /*#__PURE__*/ _jsxs(Dialog, {
                open: historyDialogOpen,
                onClose: ()=>{
                    setHistoryDialogOpen(false);
                },
                scroll: "paper",
                "aria-labelledby": "position-history-dialog-title",
                "aria-describedby": "position-history-dialog-description",
                children: [
                    /*#__PURE__*/ _jsx(DialogTitle, {
                        id: "position-history-dialog-title",
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "h6",
                            id: "position-history-dialog-title",
                            children: `Position History: ${siteCode} - ${position}`
                        })
                    }),
                    /*#__PURE__*/ _jsxs(DialogContent, {
                        dividers: true,
                        children: [
                            /*#__PURE__*/ _jsx(DialogContentText, {
                                id: "position-history-dialog-description",
                                tabIndex: -1,
                                variant: "body2",
                                children: `${positionsDescription} The table below shows changes to the physical location of this position since its creation.`
                            }),
                            /*#__PURE__*/ _jsx(TableContainer, {
                                children: /*#__PURE__*/ _jsxs(Table, {
                                    className: classes.table,
                                    "aria-label": "simple table",
                                    children: [
                                        /*#__PURE__*/ _jsx(TableHead, {
                                            children: /*#__PURE__*/ _jsxs(TableRow, {
                                                style: {
                                                    backgroundColor: Theme.palette.grey[50]
                                                },
                                                children: [
                                                    /*#__PURE__*/ _jsx(TableCell, {
                                                        children: "Start Date"
                                                    }),
                                                    /*#__PURE__*/ _jsx(TableCell, {
                                                        children: "End Date"
                                                    }),
                                                    /*#__PURE__*/ _jsx(TableCell, {
                                                        align: "right",
                                                        children: "x"
                                                    }),
                                                    /*#__PURE__*/ _jsx(TableCell, {
                                                        align: "right",
                                                        children: "y"
                                                    }),
                                                    /*#__PURE__*/ _jsx(TableCell, {
                                                        align: "right",
                                                        children: "z"
                                                    }),
                                                    /*#__PURE__*/ _jsx(TableCell, {
                                                        align: "right",
                                                        children: "Elevation"
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(TableBody, {
                                            children: history.map((row, idx)=>{
                                                const { sensorStartDateTime = '', sensorEndDateTime: rawEnd = '', xOffset, yOffset, zOffset, referenceLocationElevation } = row;
                                                const hasReferenceElevation = exists(referenceLocationElevation) && !Number.isNaN(referenceLocationElevation);
                                                const hasXOffset = exists(xOffset) && !Number.isNaN(xOffset);
                                                const hasYOffset = exists(yOffset) && !Number.isNaN(yOffset);
                                                const hasZOffset = exists(zOffset) && !Number.isNaN(zOffset);
                                                const parsedReferenceElevation = hasReferenceElevation ? referenceLocationElevation : NaN;
                                                const parsedXOffset = hasXOffset ? xOffset : NaN;
                                                const parsedYOffset = hasYOffset ? yOffset : NaN;
                                                const parsedZOffset = hasZOffset ? zOffset : NaN;
                                                let elevation = 'unknown';
                                                if (!Number.isNaN(parsedReferenceElevation)) {
                                                    if (!Number.isNaN(parsedZOffset)) {
                                                        elevation = `${(parsedReferenceElevation + parsedZOffset).toFixed(2).toString()}m`;
                                                    } else {
                                                        elevation = `${parsedReferenceElevation}m`;
                                                    }
                                                }
                                                const displayXOffset = hasXOffset ? `${xOffset}m` : '--';
                                                const displayYOffset = hasYOffset ? `${yOffset}m` : '--';
                                                const displayZOffset = hasZOffset ? `${zOffset}m` : '--';
                                                const end = rawEnd === '' ? 'Current' : rawEnd;
                                                const cellStyle = idx !== history.length - 1 ? {} : {
                                                    fontWeight: '600',
                                                    borderBottom: 'none'
                                                };
                                                const key = `${sensorStartDateTime}${end}${parsedXOffset}${parsedYOffset}${parsedZOffset}`;
                                                return /*#__PURE__*/ _jsxs(TableRow, {
                                                    children: [
                                                        /*#__PURE__*/ _jsx(TableCell, {
                                                            component: "th",
                                                            scope: "row",
                                                            style: cellStyle,
                                                            children: sensorStartDateTime
                                                        }),
                                                        /*#__PURE__*/ _jsx(TableCell, {
                                                            component: "th",
                                                            scope: "row",
                                                            style: cellStyle,
                                                            children: end
                                                        }),
                                                        /*#__PURE__*/ _jsx(TableCell, {
                                                            align: "right",
                                                            style: cellStyle,
                                                            children: displayXOffset
                                                        }),
                                                        /*#__PURE__*/ _jsx(TableCell, {
                                                            align: "right",
                                                            style: cellStyle,
                                                            children: displayYOffset
                                                        }),
                                                        /*#__PURE__*/ _jsx(TableCell, {
                                                            align: "right",
                                                            style: cellStyle,
                                                            children: displayZOffset
                                                        }),
                                                        /*#__PURE__*/ _jsx(TableCell, {
                                                            align: "right",
                                                            style: cellStyle,
                                                            children: elevation
                                                        })
                                                    ]
                                                }, key);
                                            })
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx(DialogActions, {
                        children: /*#__PURE__*/ _jsx(Button, {
                            onClick: ()=>{
                                setHistoryDialogOpen(false);
                            },
                            color: "primary",
                            variant: "outlined",
                            children: "Return"
                        })
                    })
                ]
            })
        ]
    });
}
PositionHistoryButton.propTypes = {
    siteCode: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
    history: PropTypes.arrayOf(PropTypes.shape({
        horVer: PropTypes.string.isRequired,
        azimuth: PropTypes.number,
        pitch: PropTypes.number,
        roll: PropTypes.number,
        sensorStartDateTime: PropTypes.string,
        sensorEndDateTime: PropTypes.string,
        xOffset: PropTypes.number,
        yOffset: PropTypes.number,
        zOffset: PropTypes.number,
        referenceLocationStartDateTime: PropTypes.string,
        referenceLocationEndDateTime: PropTypes.string,
        referenceLocationLatitude: PropTypes.number,
        referenceLocationLongitude: PropTypes.number,
        referenceLocationElevation: PropTypes.number
    })).isRequired
};
const POSITION_DETAIL_COMPONENT_XS_UPPER = 300;
const POSITION_DETAIL_COMPONENT_MD_LOWER = 600;
const positionDetailDefaultProps = {
    wide: false
};
/**
   PositionDetail - Component to display neatly-formatted position content
*/ function PositionDetail(inProps) {
    const props = resolveProps(positionDetailDefaultProps, inProps);
    const { siteCode, position, wide } = props;
    const classes = useStyles(Theme);
    const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const containerRef = useRef(undefined);
    const [componentWidth, setComponentWidth] = useState(0);
    let atComponentXs = false;
    let atComponentMd = false;
    if (componentWidth > 0) {
        atComponentXs = componentWidth <= POSITION_DETAIL_COMPONENT_XS_UPPER;
        atComponentMd = componentWidth > POSITION_DETAIL_COMPONENT_MD_LOWER;
    }
    const handleResizeCb = useCallback(()=>{
        const container = containerRef.current;
        if (!container) {
            return;
        }
        if (container.clientWidth === componentWidth) {
            return;
        }
        setComponentWidth(container.clientWidth);
    }, [
        containerRef,
        componentWidth,
        setComponentWidth
    ]);
    useLayoutEffect(()=>{
        const element = containerRef.current;
        if (!element) {
            return ()=>{};
        }
        handleResizeCb();
        if (typeof ResizeObserver !== 'function') {
            window.addEventListener('resize', handleResizeCb);
            return ()=>{
                window.removeEventListener('resize', handleResizeCb);
            };
        }
        let resizeObserver = new ResizeObserver(handleResizeCb);
        resizeObserver.observe(element);
        return ()=>{
            if (!resizeObserver) {
                return;
            }
            resizeObserver.disconnect();
            resizeObserver = null;
        };
    }, [
        containerRef,
        handleResizeCb
    ]);
    if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body1",
            children: position
        });
    }
    const { history } = state.product.sites[siteCode].positions[position];
    const current = history.length - 1 || 0;
    const { sensorName, sensorDescription, referenceLocationName, referenceLocationDescription, referenceLocationElevation, xOffset, yOffset, zOffset } = history[current] || {};
    const hasReferenceElevation = exists(referenceLocationElevation) && !Number.isNaN(referenceLocationElevation);
    const hasXOffset = exists(xOffset) && !Number.isNaN(xOffset);
    const hasYOffset = exists(yOffset) && !Number.isNaN(yOffset);
    const hasZOffset = exists(zOffset) && !Number.isNaN(zOffset);
    const parsedReferenceElevation = hasReferenceElevation ? referenceLocationElevation : NaN;
    const parsedZOffset = hasZOffset ? zOffset : NaN;
    const displayXOffset = hasXOffset ? `${xOffset}m` : '--';
    const displayYOffset = hasYOffset ? `${yOffset}m` : '--';
    const displayZOffset = hasZOffset ? `${zOffset}m` : '--';
    let elevation = '--';
    if (!Number.isNaN(parsedReferenceElevation)) {
        if (!Number.isNaN(parsedZOffset)) {
            elevation = `${(parsedReferenceElevation + parsedZOffset).toFixed(2).toString()}m`;
        } else {
            elevation = `${parsedReferenceElevation}m`;
        }
    }
    const fadeStyle = {
        color: Theme.palette.grey[500]
    };
    const axisStyle = {
        marginRight: Theme.spacing(1),
        fontWeight: 600
    };
    const renderDescription = ()=>{
        const hasName = isStringNonEmpty(sensorName);
        const hasDescription = isStringNonEmpty(sensorDescription);
        const hasReferenceName = isStringNonEmpty(referenceLocationName);
        const hasReferenceDescription = isStringNonEmpty(referenceLocationDescription);
        const appliedName = hasName ? sensorName : 'N/A';
        const appliedDescription = hasDescription ? sensorDescription : 'N/A';
        const includeReference = hasReferenceName || hasReferenceDescription;
        const appliedReferenceName = hasReferenceName ? referenceLocationName : 'N/A';
        const appliedReferenceDescription = hasReferenceDescription ? referenceLocationDescription : 'N/A';
        return wide ? /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: classes.startFlex,
                    style: {
                        ...fadeStyle,
                        marginRight: Theme.spacing(3),
                        marginTop: Theme.spacing(0.5)
                    },
                    children: /*#__PURE__*/ _jsxs(Typography, {
                        variant: "caption",
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                style: {
                                    fontWeight: 600
                                },
                                children: "Location: "
                            }),
                            `${appliedDescription} (${appliedName})`
                        ]
                    })
                }),
                !includeReference ? null : /*#__PURE__*/ _jsx("div", {
                    className: classes.startFlex,
                    style: {
                        ...fadeStyle,
                        marginRight: Theme.spacing(3)
                    },
                    children: /*#__PURE__*/ _jsxs(Typography, {
                        variant: "caption",
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                style: {
                                    fontWeight: 600
                                },
                                children: "Reference Location: "
                            }),
                            `${appliedReferenceDescription} (${appliedReferenceName})`
                        ]
                    })
                })
            ]
        }) : /*#__PURE__*/ _jsxs("div", {
            style: {
                marginRight: Theme.spacing(3),
                marginTop: Theme.spacing(0.5)
            },
            children: [
                /*#__PURE__*/ _jsx("div", {
                    children: /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        style: {
                            fontWeight: 600
                        },
                        children: "Location:"
                    })
                }),
                /*#__PURE__*/ _jsx("div", {
                    style: {
                        ...fadeStyle
                    },
                    children: /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        children: `${appliedDescription} (${appliedName})`
                    })
                }),
                !includeReference ? null : /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                            children: /*#__PURE__*/ _jsx(Typography, {
                                variant: "body2",
                                style: {
                                    fontWeight: 600
                                },
                                children: "Reference Location:"
                            })
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            style: {
                                ...fadeStyle
                            },
                            children: /*#__PURE__*/ _jsx(Typography, {
                                variant: "body2",
                                children: `${appliedReferenceDescription} (${appliedReferenceName})`
                            })
                        })
                    ]
                })
            ]
        });
    };
    let positionContainerStyle = {
        alignItems: 'center',
        justifyContent: 'space-between'
    };
    let positionSectionsContainerStyle = {
        display: 'flex',
        flexDirection: 'column'
    };
    let historyButtonContainerStyle = {
        textAlign: 'right'
    };
    if (atComponentXs) {
        positionContainerStyle = {
            ...positionContainerStyle,
            alignItems: 'flex-start',
            flexDirection: 'column'
        };
        historyButtonContainerStyle = {
            ...historyButtonContainerStyle,
            textAlign: 'unset',
            marginTop: Theme.spacing(1),
            width: '100%'
        };
    }
    if (atComponentMd) {
        positionSectionsContainerStyle = {
            ...positionSectionsContainerStyle,
            flexDirection: 'row'
        };
    }
    return wide ? /*#__PURE__*/ _jsxs("div", {
        ref: containerRef,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: classes.startFlex,
                style: {
                    alignItems: 'flex-end'
                },
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body1",
                        style: {
                            fontWeight: 600,
                            marginRight: Theme.spacing(3)
                        },
                        children: position
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.startFlex,
                        style: {
                            alignItems: 'center',
                            ...fadeStyle
                        },
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "body2",
                                children: "Elevation:"
                            }),
                            /*#__PURE__*/ _jsx(ElevationIcon, {
                                fontSize: "small",
                                style: {
                                    margin: Theme.spacing(0, 0.5, 0, 1)
                                }
                            }),
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "body2",
                                children: elevation
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: classes.startFlex,
                children: /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    children: [
                        /*#__PURE__*/ _jsx("span", {
                            style: {
                                ...axisStyle
                            },
                            children: "x / y / z:"
                        }),
                        `${displayXOffset} / ${displayYOffset} / ${displayZOffset}`
                    ]
                })
            }),
            renderDescription()
        ]
    }) : /*#__PURE__*/ _jsxs("div", {
        ref: containerRef,
        className: classes.startFlex,
        style: positionContainerStyle,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                style: positionSectionsContainerStyle,
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.startFlex,
                        style: {
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginRight: Theme.spacing(3)
                                },
                                children: [
                                    /*#__PURE__*/ _jsx(Typography, {
                                        variant: "body1",
                                        style: {
                                            fontWeight: 600
                                        },
                                        children: position
                                    }),
                                    /*#__PURE__*/ _jsx(Typography, {
                                        variant: "body2",
                                        style: {
                                            ...fadeStyle
                                        },
                                        children: "Elevation:"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ _jsx(ElevationIcon, {
                                                fontSize: "small",
                                                style: {
                                                    marginRight: Theme.spacing(0.5),
                                                    ...fadeStyle
                                                }
                                            }),
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "body2",
                                                style: {
                                                    ...fadeStyle
                                                },
                                                children: elevation
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                style: {
                                    marginRight: Theme.spacing(3)
                                },
                                children: /*#__PURE__*/ _jsxs(Typography, {
                                    variant: "body2",
                                    children: [
                                        /*#__PURE__*/ _jsx("span", {
                                            style: {
                                                ...axisStyle
                                            },
                                            children: "x:"
                                        }),
                                        `${displayXOffset}`,
                                        /*#__PURE__*/ _jsx("br", {}),
                                        /*#__PURE__*/ _jsx("span", {
                                            style: {
                                                ...axisStyle
                                            },
                                            children: "y:"
                                        }),
                                        `${displayYOffset}`,
                                        /*#__PURE__*/ _jsx("br", {}),
                                        /*#__PURE__*/ _jsx("span", {
                                            style: {
                                                ...axisStyle
                                            },
                                            children: "z:"
                                        }),
                                        `${displayZOffset}`
                                    ]
                                })
                            })
                        ]
                    }),
                    renderDescription()
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                style: historyButtonContainerStyle,
                children: /*#__PURE__*/ _jsx(PositionHistoryButton, {
                    siteCode: siteCode,
                    position: position,
                    history: history,
                    fullWidth: atComponentXs
                })
            })
        ]
    });
}
PositionDetail.propTypes = {
    siteCode: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    wide: PropTypes.bool
};
const selectedPositionDefaultProps = {
    disabled: false
};
/**
   Selected Position - Component for a single deletable position paper to show within a SelectedSite
*/ function SelectedPosition(inProps) {
    const props = resolveProps(selectedPositionDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { siteCode, position, disabled } = props;
    const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    return /*#__PURE__*/ _jsxs(Card, {
        variant: "outlined",
        className: classes.positionCard,
        children: [
            /*#__PURE__*/ _jsx(IconButton, {
                "aria-label": `remove position ${position} from ${siteCode}`,
                disabled: disabled,
                style: {
                    marginLeft: Theme.spacing(1),
                    marginRight: Theme.spacing(1)
                },
                onClick: ()=>{
                    if (disabled) {
                        return;
                    }
                    const selectedSiteIdx = state.selection.sites.findIndex((site)=>site.siteCode === siteCode);
                    const positions = state.selection.sites[selectedSiteIdx].positions.filter((p)=>p !== position);
                    dispatch({
                        type: 'selectSitePositions',
                        positions,
                        siteCode
                    });
                },
                size: "large",
                children: /*#__PURE__*/ _jsx(ClearIcon, {
                    fontSize: "small"
                })
            }),
            /*#__PURE__*/ _jsx("div", {
                style: {
                    flexGrow: 1
                },
                children: /*#__PURE__*/ _jsx(PositionDetail, {
                    siteCode: siteCode,
                    position: position
                })
            })
        ]
    }, position);
}
SelectedPosition.propTypes = {
    siteCode: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};
/**
   SelectPositionsButton - button that opens a dialog for position selection
*/ function SelectPositionsButton(props) {
    const { selectedSite } = props;
    const { siteCode, positions: selectedPositions } = selectedSite;
    const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const availablePositions = state.product.sites[siteCode] ? Object.keys(state.product.sites[siteCode].positions) : [];
    availablePositions.sort();
    const [selectDialogOpen, setSelectDialogOpen] = useState(false);
    // Local state for position selections so that no fetches are fired until the dialog is submitted
    const [localSelectedPositions, setLocalSelectedPositions] = useState(selectedPositions);
    const togglePosition = (position)=>{
        if (localSelectedPositions.includes(position)) {
            setLocalSelectedPositions(localSelectedPositions.filter((p)=>p !== position));
        } else {
            setLocalSelectedPositions([
                ...localSelectedPositions,
                position
            ]);
        }
    };
    const handleApply = ()=>{
        if (!localSelectedPositions.length) {
            return;
        }
        setSelectDialogOpen(false);
        dispatch({
            type: 'selectSitePositions',
            siteCode,
            positions: localSelectedPositions
        });
    };
    const checkIsApplyButtonDisabled = (checkSelectedPositions)=>{
        // Include positions from currently selected state.selection, exclude current site
        // from position selection determination as it is currently being modified prior
        // to committing to state, account for current site by inspecting the state
        // of the currently selected positions for this site.
        const currentSelectedPositions = TimeSeriesViewerContext.getPositionCount(state.selection.sites, siteCode);
        const allCurrentPositions = checkSelectedPositions.length + currentSelectedPositions;
        const numPointsAllPositions = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state, allCurrentPositions);
        let isDisabled = false;
        if (!checkSelectedPositions.length) {
            isDisabled = true;
        } else if (numPointsAllPositions > POINTS_PERFORMANCE_LIMIT) {
            isDisabled = true;
        }
        return isDisabled;
    };
    const isDisabled = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state) > POINTS_PERFORMANCE_LIMIT;
    const isApplyButtonDisabled = checkIsApplyButtonDisabled(localSelectedPositions) && localSelectedPositions.length > 0;
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Button, {
                size: "small",
                variant: "outlined",
                startIcon: /*#__PURE__*/ _jsx(SelectIcon, {}),
                style: {
                    marginLeft: Theme.spacing(4)
                },
                disabled: isDisabled,
                onClick: ()=>{
                    setLocalSelectedPositions(selectedPositions);
                    setSelectDialogOpen(true);
                },
                children: "Select Positions…"
            }),
            /*#__PURE__*/ _jsxs(Dialog, {
                open: selectDialogOpen,
                onClose: ()=>{
                    setSelectDialogOpen(false);
                },
                scroll: "paper",
                "aria-labelledby": "add-positions-dialog-title",
                "aria-describedby": "add-positions-dialog-description",
                children: [
                    /*#__PURE__*/ _jsx(DialogTitle, {
                        id: "add-positions-dialog-title",
                        children: /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ _jsx(Typography, {
                                    variant: "h6",
                                    id: "add-positions-dialog-title",
                                    children: "Select Positions"
                                }),
                                /*#__PURE__*/ _jsxs(Typography, {
                                    variant: "subtitle2",
                                    color: !localSelectedPositions.length ? 'error' : 'textPrimary',
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: [
                                        `${localSelectedPositions.length} of ${availablePositions.length} selected`,
                                        /*#__PURE__*/ _jsx("br", {}),
                                        /*#__PURE__*/ _jsx("span", {
                                            style: {
                                                fontWeight: 300,
                                                color: Theme.palette.grey[500],
                                                fontStyle: 'italic'
                                            },
                                            children: "at least one is required"
                                        }),
                                        /*#__PURE__*/ _jsx("br", {}),
                                        /*#__PURE__*/ _jsx("span", {
                                            style: {
                                                fontWeight: 300,
                                                fontStyle: 'italic',
                                                visibility: isApplyButtonDisabled ? 'visible' : 'hidden'
                                            },
                                            className: "MuiTypography-colorError",
                                            children: "Number of positions selected may cause performance issues"
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsxs(DialogContent, {
                        dividers: true,
                        children: [
                            /*#__PURE__*/ _jsxs(DialogContentText, {
                                id: "add-positions-dialog-description",
                                tabIndex: -1,
                                variant: "body2",
                                children: [
                                    positionsDescription,
                                    /*#__PURE__*/ _jsx("br", {}),
                                    /*#__PURE__*/ _jsx("br", {}),
                                    positionsSeriesDescription
                                ]
                            }),
                            /*#__PURE__*/ _jsx(List, {
                                children: availablePositions.map((position)=>{
                                    const labelId = `position-list-label-${position}`;
                                    return /*#__PURE__*/ _jsxs(ListItem, {
                                        role: undefined,
                                        dense: true,
                                        button: true,
                                        onClick: ()=>{
                                            togglePosition(position);
                                        },
                                        children: [
                                            /*#__PURE__*/ _jsx(ListItemIcon, {
                                                children: /*#__PURE__*/ _jsx(Checkbox, {
                                                    edge: "start",
                                                    checked: localSelectedPositions.includes(position),
                                                    tabIndex: -1,
                                                    disableRipple: true,
                                                    inputProps: {
                                                        'aria-labelledby': labelId
                                                    }
                                                })
                                            }),
                                            /*#__PURE__*/ _jsx(ListItemText, {
                                                id: labelId,
                                                primary: /*#__PURE__*/ _jsx(PositionDetail, {
                                                    siteCode: siteCode,
                                                    position: position,
                                                    wide: true
                                                })
                                            })
                                        ]
                                    }, position);
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs(DialogActions, {
                        children: [
                            /*#__PURE__*/ _jsx(Button, {
                                onClick: ()=>{
                                    setSelectDialogOpen(false);
                                },
                                variant: "outlined",
                                children: "Cancel"
                            }),
                            /*#__PURE__*/ _jsx(Button, {
                                onClick: handleApply,
                                variant: "contained",
                                disabled: checkIsApplyButtonDisabled(localSelectedPositions),
                                children: "Apply"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
SelectPositionsButton.propTypes = {
    selectedSite: PropTypes.shape({
        siteCode: PropTypes.string.isRequired,
        positions: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
};
/**
   SitesControl - Component for the top-level Sites search field
*/ function SitesControl(props) {
    const { children, innerProps, innerRef, selectProps: { TextFieldProps } } = props;
    const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const numPoints = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state);
    const labelText = numPoints > POINTS_PERFORMANCE_LIMIT ? 'Add Sites (disabled)' : 'Add Sites';
    return /*#__PURE__*/ _jsx(TextField, {
        fullWidth: true,
        label: labelText,
        variant: "outlined",
        InputProps: {
            inputComponent,
            inputProps: {
                ref: innerRef,
                children,
                ...innerProps
            },
            endAdornment: /*#__PURE__*/ _jsx(InputAdornment, {
                position: "end",
                children: /*#__PURE__*/ _jsx(SearchIcon, {
                    color: "disabled"
                })
            })
        },
        ...TextFieldProps
    });
}
SitesControl.propTypes = ControlPropTypes;
const siteOptionDefaultProps = OptionDefaultProps;
/**
   SiteOption - Component for a single site as it appears in the drop-down menu
*/ function SiteOption(inProps) {
    const props = resolveProps(siteOptionDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { innerRef, isFocused, isDisabled, innerProps, data } = props;
    const { siteCode, description, type, terrain, domainCode, domainName, stateCode, latitude, longitude } = data;
    const terrainTypeTitle = `${ucWord(terrain)} ${ucWord(type)}`;
    let optionContent = /*#__PURE__*/ _jsx(Typography, {
        variant: "body1",
        gutterBottom: true,
        children: siteCode
    });
    if (stateCode) {
        const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
        optionContent = /*#__PURE__*/ _jsxs("div", {
            className: classes.startFlex,
            children: [
                iconSvg ? /*#__PURE__*/ _jsx("img", {
                    src: iconSvg.src,
                    alt: terrainTypeTitle,
                    title: terrainTypeTitle,
                    width: Theme.spacing(3),
                    height: Theme.spacing(3),
                    style: {
                        marginRight: Theme.spacing(1.5),
                        marginTop: Theme.spacing(0.5),
                        flexGrow: 0
                    }
                }) : null,
                /*#__PURE__*/ _jsxs("div", {
                    style: {
                        flexGrow: 1
                    },
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "body1",
                            children: `${siteCode} - ${description}, ${stateCode}`
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            className: classes.optionSubtitle,
                            gutterBottom: true,
                            children: `${terrainTypeTitle} - Domain ${domainCode} (${domainName}) - Lat/Lon: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        })
                    ]
                })
            ]
        });
    }
    return /*#__PURE__*/ _jsx(MenuItem, {
        ref: innerRef,
        selected: isFocused && !isDisabled,
        component: "div",
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: isDisabled ? 'not-allowed' : 'pointer'
        },
        ...innerProps,
        children: optionContent
    }, siteCode);
}
SiteOption.propTypes = OptionPropTypes;
const selectedSiteDefaultProps = {
    disabled: false
};
/**
   Selected Site - Component for a single deletable site paper to show below the search box
*/ function SelectedSite(inProps) {
    const props = resolveProps(selectedSiteDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { site, disabled, setSelectedTab, TAB_IDS } = props;
    const { siteCode, positions } = site;
    const [{ data: neonContextData }] = NeonContext.useNeonContextState();
    const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
    const [, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    // style={{ fontSize: '0.8rem', fontWeight: 600 }}
    const dateRangeTabButton = /*#__PURE__*/ _jsx(Button, {
        size: "small",
        color: "secondary",
        onClick: ()=>{
            setSelectedTab(TAB_IDS.DATE_RANGE);
        },
        style: {
            padding: '0px 2px',
            marginTop: '-4px',
            fontStyle: 'italic'
        },
        children: "Date Range"
    });
    const removeSiteButton = /*#__PURE__*/ _jsx(Button, {
        size: "small",
        variant: "outlined",
        onClick: ()=>{
            if (disabled) {
                return;
            }
            dispatch({
                type: 'selectRemoveSite',
                siteCode
            });
        },
        style: {
            minWidth: Theme.spacing(13),
            whiteSpace: 'nowrap'
        },
        disabled: disabled,
        startIcon: /*#__PURE__*/ _jsx(ClearIcon, {}),
        children: "Remove Site"
    });
    let selectedSiteContent = /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body1",
                gutterBottom: true,
                children: `${siteCode} (loading site details…)`
            }),
            removeSiteButton
        ]
    });
    if (allSites[siteCode]) {
        const { description, type, terrain, domainCode, stateCode, latitude, longitude } = allSites[siteCode];
        let typeTitle = 'Core';
        let typeSubtitle = 'fixed location';
        if (type === 'GRADIENT') {
            typeTitle = 'Gradient';
            typeSubtitle = 'gradient location';
        }
        let terrainTitle = 'Terrestrial';
        let terrainSubtitle = 'land-based';
        if (terrain === 'AQUATIC') {
            terrainTitle = 'Aquatic';
            terrainSubtitle = 'water-based';
        }
        const terrainTypeTitle = `${terrainTitle} ${typeTitle}`;
        const terrainTypeSubtitle = `${terrainSubtitle}; ${typeSubtitle}`;
        const domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
        const stateName = allStates[stateCode] ? allStates[stateCode].name : null;
        const stateFieldTitle = stateCode === 'PR' ? 'Territory' : 'State';
        const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
        const terrainIcon = iconSvg ? /*#__PURE__*/ _jsx("img", {
            src: iconSvg.src,
            alt: terrainTypeTitle,
            title: terrainTypeTitle,
            width: Theme.spacing(4),
            height: Theme.spacing(4),
            style: {
                marginRight: Theme.spacing(1),
                flexGrow: 0
            }
        }) : null;
        selectedSiteContent = /*#__PURE__*/ _jsxs("div", {
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.siteTitleContainer,
                    children: [
                        terrainIcon,
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h6",
                            style: {
                                lineHeight: '1.4rem',
                                flexGrow: 1
                            },
                            children: `${description} (${siteCode})`
                        }),
                        removeSiteButton
                    ]
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.siteDetailsRow,
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: classes.siteDetailsColumn,
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: classes.siteDetail,
                                    children: [
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "subtitle2",
                                            children: terrainTypeTitle
                                        }),
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "body2",
                                            style: {
                                                fontSize: '0.8rem'
                                            },
                                            children: /*#__PURE__*/ _jsx("i", {
                                                children: terrainTypeSubtitle
                                            })
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: classes.siteDetail,
                                    children: /*#__PURE__*/ _jsxs("div", {
                                        className: classes.startFlex,
                                        style: {
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ _jsx(CopyToClipboard, {
                                                text: `${latitude} ${longitude}`,
                                                children: /*#__PURE__*/ _jsx(Tooltip, {
                                                    title: "Latitude / Longitude (click to copy)",
                                                    children: /*#__PURE__*/ _jsx(IconButton, {
                                                        size: "small",
                                                        style: {
                                                            marginRight: Theme.spacing(0.5)
                                                        },
                                                        "aria-label": "Latitude / Longitude (click to copy)",
                                                        children: /*#__PURE__*/ _jsx(LocationIcon, {})
                                                    })
                                                })
                                            }),
                                            /*#__PURE__*/ _jsxs(Typography, {
                                                variant: "caption",
                                                "aria-label": "Latitude / Longitude",
                                                style: {
                                                    fontFamily: 'monospace',
                                                    textAlign: 'right',
                                                    fontSize: '0.85rem'
                                                },
                                                children: [
                                                    latitude,
                                                    /*#__PURE__*/ _jsx("br", {}),
                                                    longitude
                                                ]
                                            })
                                        ]
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: classes.siteDetailsColumn,
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: classes.siteDetail,
                                    children: [
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "subtitle2",
                                            children: stateFieldTitle
                                        }),
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "body2",
                                            children: stateName
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: classes.siteDetail,
                                    children: [
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "subtitle2",
                                            children: "Domain"
                                        }),
                                        /*#__PURE__*/ _jsx(Typography, {
                                            variant: "body2",
                                            children: `${domainCode} - ${domainName}`
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }
    return /*#__PURE__*/ _jsxs(Card, {
        variant: "outlined",
        className: classes.siteCard,
        children: [
            selectedSiteContent,
            positions.length ? /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.positionsTitleContainer,
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "subtitle2",
                                children: "Position(s)"
                            }),
                            /*#__PURE__*/ _jsx(Tooltip, {
                                title: /*#__PURE__*/ _jsxs(_Fragment, {
                                    children: [
                                        positionsDescription,
                                        /*#__PURE__*/ _jsx("br", {}),
                                        /*#__PURE__*/ _jsx("br", {}),
                                        positionsSeriesDescription
                                    ]
                                }),
                                children: /*#__PURE__*/ _jsx(IconButton, {
                                    size: "small",
                                    style: {
                                        marginLeft: Theme.spacing(1)
                                    },
                                    children: /*#__PURE__*/ _jsx(InfoIcon, {
                                        fontSize: "small"
                                    })
                                })
                            }),
                            /*#__PURE__*/ _jsx(SelectPositionsButton, {
                                selectedSite: site
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: classes.positionsCardContainer,
                        children: positions.map((position)=>/*#__PURE__*/ _jsx(SelectedPosition, {
                                siteCode: siteCode,
                                position: position,
                                disabled: positions.length < 2
                            }, position))
                    })
                ]
            }) : /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.startFlex,
                        style: {
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ _jsx(NoneIcon, {
                                className: classes.noneIcon
                            }),
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "body1",
                                className: classes.noneLabel,
                                style: {
                                    fontWeight: 600
                                },
                                children: "No Positions Available."
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        className: classes.noneLabel,
                        style: {
                            fontSize: '0.8rem'
                        },
                        children: /*#__PURE__*/ _jsxs("i", {
                            children: [
                                "This site has no available data for the current selected date range, and thus no positions. See ",
                                dateRangeTabButton,
                                " to compare selection with availability."
                            ]
                        })
                    })
                ]
            })
        ]
    }, siteCode);
}
SelectedSite.propTypes = {
    site: PropTypes.shape({
        siteCode: PropTypes.string.isRequired,
        positions: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    disabled: PropTypes.bool,
    ...TabComponentPropTypes
};
/**
   Complete Select for Sites
*/ const SitesSelectComponents = {
    Control: SitesControl,
    Option: SiteOption,
    Menu,
    ValueContainer,
    Placeholder: ()=>null,
    MultiValue: ()=>null,
    IndicatorsContainer: ()=>null
};
const SitesSelect = ()=>{
    const classes = useStyles(Theme);
    const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const [{ data: neonContextData }] = NeonContext.useNeonContextState();
    const { states: allStates, sites: allSites, domains: allDomains } = neonContextData;
    // Build list of selectable sites grouped by US state
    const selectableSiteCodes = Object.keys(state.product.sites);
    let selectableSitesCount = 0;
    const selectableSites = Object.keys(allStates).map((stateCode)=>({
            label: allStates[stateCode].name,
            stateCode,
            options: []
        }));
    Object.keys(state.product.sites).filter((siteCode)=>selectableSiteCodes.includes(siteCode)).forEach((siteCode)=>{
        const groupIdx = selectableSites.findIndex((group)=>allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode);
        if (groupIdx === -1) {
            return;
        }
        const domain = allDomains[allSites[siteCode].domainCode] || {};
        const usState = allStates[allSites[siteCode].stateCode] || {};
        const search = [
            siteCode,
            allSites[siteCode].description,
            allSites[siteCode].domainCode,
            allSites[siteCode].stateCode,
            allSites[siteCode].type,
            allSites[siteCode].terrain,
            domain.name || '',
            usState.name || ''
        ].join(' ').toLowerCase();
        selectableSites[groupIdx].options.push({
            value: siteCode,
            domainName: domain.name || null,
            ...allSites[siteCode],
            search
        });
        selectableSitesCount += 1;
    });
    const selectedSites = state.selection.sites.map((site)=>site.siteCode).filter((siteCode)=>selectableSiteCodes.includes(siteCode));
    if (!selectableSitesCount) {
        return null;
    }
    const numPoints = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state);
    const isDisabled = numPoints > POINTS_PERFORMANCE_LIMIT;
    return /*#__PURE__*/ _jsx(NoSsr, {
        children: /*#__PURE__*/ _jsx("div", {
            style: {
                flex: 1
            },
            children: /*#__PURE__*/ _jsx(Select, {
                isMulti: true,
                isSearchable: true,
                isDisabled: isDisabled,
                clearable: false,
                classes: classes,
                styles: selectStyles,
                "aria-label": "Add Sites",
                "data-gtm": "time-series-viewer.add-sites",
                options: selectableSites,
                components: SitesSelectComponents,
                value: selectedSites,
                controlShouldRenderValue: false,
                filterOption: (option, searchText)=>option.data.search.includes(searchText.toLowerCase()),
                onChange: (value, change)=>{
                    if (change.action !== 'select-option') {
                        return;
                    }
                    dispatch({
                        type: 'selectAddSite',
                        siteCode: change.option.siteCode
                    });
                }
            })
        })
    });
};
/**
   Primary Component
*/ export default function TimeSeriesViewerSites(props) {
    const classes = useStyles(Theme);
    const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const [{ data: neonContextData }] = NeonContext.useNeonContextState();
    const { sites: allSites } = neonContextData;
    if (!state.selection.sites.length || !Object.keys(allSites).length) {
        return /*#__PURE__*/ _jsx(Skeleton, {
            variant: "rectangular",
            width: "100%",
            height: 56
        });
    }
    const calcUpperSelectionLimit = ()=>{
        let upperLimit = 0;
        const currentPositionCount = TimeSeriesViewerContext.getPositionCount(state.selection.sites);
        for(let numNewPos = 1; numNewPos <= MAX_NUM_SITES_SELECTABLE; numNewPos += 1){
            const numNewPositions = currentPositionCount + numNewPos;
            const numPoints = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state, numNewPositions);
            if (numPoints < POINTS_PERFORMANCE_LIMIT) {
                upperLimit = numNewPos;
            }
        }
        return upperLimit;
    };
    const selectedItems = state.selection.sites.map((site)=>site.siteCode);
    const numPoints = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state);
    const isDisabled = numPoints > POINTS_PERFORMANCE_LIMIT;
    const upperLimit = Math.min(calcUpperSelectionLimit() + selectedItems.length, MAX_NUM_SITES_SELECTABLE);
    return /*#__PURE__*/ _jsxs("div", {
        className: classes.root,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx(SitesSelect, {}),
                    /*#__PURE__*/ _jsx(MapSelectionButton, {
                        selection: "SITES",
                        selectionLimit: [
                            1,
                            upperLimit
                        ],
                        selectedItems: selectedItems,
                        validItems: Object.keys(state.product.sites),
                        buttonProps: {
                            style: {
                                size: 'large',
                                marginLeft: Theme.spacing(1.5)
                            },
                            disabled: isDisabled
                        },
                        onSave: (newSites)=>{
                            dispatch({
                                type: 'updateSelectedSites',
                                siteCodes: newSites
                            });
                        }
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: classes.sitesContainer,
                children: state.selection.sites.map((site)=>/*#__PURE__*/ _jsx(SelectedSite, {
                        site: site,
                        disabled: state.selection.sites.length < 2,
                        ...props
                    }, site.siteCode))
            })
        ]
    });
}
TimeSeriesViewerSites.propTypes = TabComponentPropTypes;
// Additional items exported for unit testing
export const getTestableItems = ()=>process.env.NODE_ENV !== 'test' ? {} : {
        ucWord,
        PositionHistoryButton,
        PositionDetail,
        SelectedPosition,
        SelectPositionsButton,
        SitesControl,
        SiteOption,
        SelectedSite
    };
