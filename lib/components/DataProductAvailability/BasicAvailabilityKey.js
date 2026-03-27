import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/HelpOutline';
import { SVG, VALID_ENHANCED_STATUSES } from './AvailabilityUtils';
import { JsxCell } from './AvailabilitySvgComponents';
import Theme, { COLORS } from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import { exists } from '../../util/typeUtil';
const useStyles = makeStyles((theme)=>({
        legendContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: theme.spacing(1),
            width: '100%'
        },
        legendTitle: {
            fontSize: '0.95rem',
            display: 'inline-flex'
        },
        legendTitleIcon: {
            marginTop: theme.spacing(-0.25)
        },
        legendTitleContainer: {
            margin: theme.spacing(-1, 1, 0.5, 0)
        },
        legendElement: {
            margin: theme.spacing(0, 0, 0, 0)
        },
        legendElementText: {
            textAnchor: 'start',
            whiteSpace: 'pre',
            fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
            fontWeight: 400,
            fontSize: `${SVG.LABEL_FONT_SIZE}px`,
            fill: Theme.palette.grey[700]
        }
    }));
const CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL = 250;
const CONTAINER_WIDTH_BREAKPOINT_XS = 360;
const CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION = 200;
const CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION = 425;
const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';
const statusLegendElementDefaultProps = {
    status: null,
    dialog: false
};
const StatusLegendElement = (inProps)=>{
    const props = resolveProps(statusLegendElementDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { status, dialog } = props;
    if (!exists(status) || !VALID_ENHANCED_STATUSES[status]) {
        return null;
    }
    const statusSvgHeight = SVG.CELL_HEIGHT + 2;
    const labelLetterWidth = 8;
    const labelY = SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 2;
    const statusLabelX = SVG.CELL_WIDTH + 2 * SVG.CELL_PADDING;
    const { title, description } = VALID_ENHANCED_STATUSES[status];
    const statusSvgWidth = title.length * labelLetterWidth + statusLabelX;
    return dialog ? /*#__PURE__*/ _jsxs("div", {
        style: {
            marginBottom: Theme.spacing(2.5)
        },
        children: [
            /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx("svg", {
                        width: Math.ceil(SVG.CELL_WIDTH * 1.25),
                        height: Math.ceil(SVG.CELL_HEIGHT * 1.25),
                        viewBox: `0 0 ${SVG.CELL_WIDTH} ${SVG.CELL_HEIGHT}`,
                        style: {
                            marginRight: Theme.spacing(1)
                        },
                        children: /*#__PURE__*/ _jsx(JsxCell, {
                            status: status
                        })
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        style: {
                            fontSize: '0.95rem',
                            marginTop: '2px'
                        },
                        children: title
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                children: description
            })
        ]
    }) : /*#__PURE__*/ _jsx("div", {
        className: classes.legendElement,
        title: description,
        children: /*#__PURE__*/ _jsxs("svg", {
            width: statusSvgWidth,
            height: statusSvgHeight,
            children: [
                /*#__PURE__*/ _jsx(JsxCell, {
                    status: status
                }),
                /*#__PURE__*/ _jsx("text", {
                    className: classes.legendElementText,
                    x: statusLabelX,
                    y: labelY,
                    children: title
                })
            ]
        })
    });
};
StatusLegendElement.propTypes = {
    status: PropTypes.oneOf(Object.keys(VALID_ENHANCED_STATUSES)),
    dialog: PropTypes.bool
};
const selectionLegendElementDefaultProps = {
    dialog: false
};
const SelectionLegendElement = (inProps)=>{
    const props = resolveProps(selectionLegendElementDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { variant, dialog } = props;
    if (![
        'all',
        'some'
    ].includes(variant)) {
        return null;
    }
    const statusSvgHeight = SVG.CELL_HEIGHT + 2;
    const labelLetterWidth = 8;
    const labelY = SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 2;
    const selectionSvgHeight = SVG.CELL_HEIGHT + 2;
    const label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
    const fill = variant === 'all' ? Theme.palette.primary.main : COLORS.LIGHT_BLUE[200];
    const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
    const selectionWidth = 30;
    const selectionLabelX = selectionWidth + 3 * SVG.CELL_PADDING;
    const selectionSvgWidth = label.length * labelLetterWidth + selectionLabelX;
    const handleAttribs = {
        width: SVG.DATE_RANGE_HANDLE_WIDTH,
        height: SVG.CELL_HEIGHT,
        fill: COLORS.LIGHT_BLUE[300],
        stroke: Theme.palette.primary.main,
        strokeWidth: 1.5
    };
    const graphic = /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx("rect", {
                x: 0.5,
                y: 1.5,
                width: selectionWidth,
                height: SVG.CELL_HEIGHT - 2,
                fill: fill
            }),
            /*#__PURE__*/ _jsx("rect", {
                x: 0.5,
                y: 0.5,
                ...handleAttribs
            }),
            /*#__PURE__*/ _jsx("rect", {
                x: selectionWidth - SVG.DATE_RANGE_HANDLE_WIDTH,
                y: 0.5,
                ...handleAttribs
            })
        ]
    });
    return dialog ? /*#__PURE__*/ _jsxs("div", {
        style: {
            marginBottom: Theme.spacing(2)
        },
        children: [
            /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx("svg", {
                        width: Math.ceil(selectionWidth * 1.25),
                        height: Math.ceil(selectionSvgHeight * 1.25),
                        viewBox: `0 0 ${selectionWidth} ${selectionSvgHeight}`,
                        style: {
                            marginRight: Theme.spacing(1)
                        },
                        children: graphic
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        style: {
                            fontSize: '1.05rem'
                        },
                        children: label
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                children: description
            })
        ]
    }) : /*#__PURE__*/ _jsx("div", {
        className: classes.legendElement,
        title: description,
        children: /*#__PURE__*/ _jsxs("svg", {
            width: selectionSvgWidth,
            height: statusSvgHeight,
            children: [
                graphic,
                /*#__PURE__*/ _jsx("text", {
                    className: classes.legendElementText,
                    x: selectionLabelX,
                    y: labelY,
                    children: label
                })
            ]
        })
    });
};
SelectionLegendElement.propTypes = {
    variant: PropTypes.oneOf([
        'all',
        'some'
    ]).isRequired,
    dialog: PropTypes.bool
};
const legendDialogDefaultProps = {
    selectionEnabled: false,
    delineateRelease: false,
    availabilityStatusType: 'available'
};
const LegendDialog = (inProps)=>{
    const props = resolveProps(legendDialogDefaultProps, inProps);
    const { dialogOpen, setDialogOpen, selectionEnabled, delineateRelease, availabilityStatusType } = props;
    return /*#__PURE__*/ _jsxs(Dialog, {
        open: dialogOpen,
        maxWidth: "md",
        onClose: ()=>setDialogOpen(false),
        "aria-labelledby": "availability-key-dialog-title",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ _jsx(DialogTitle, {
                        id: "availability-key-dialog-title",
                        children: /*#__PURE__*/ _jsx("span", {
                            style: {
                                fontSize: '1.4rem',
                                fontWeight: '600'
                            },
                            children: "Data Availability Chart Key"
                        })
                    }),
                    /*#__PURE__*/ _jsx(IconButton, {
                        title: "Close",
                        "aria-label": "Close",
                        onClick: ()=>setDialogOpen(false),
                        style: {
                            marginRight: Theme.spacing(1)
                        },
                        size: "large",
                        children: /*#__PURE__*/ _jsx(CloseIcon, {
                            fontSize: "inherit"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(DialogContent, {
                dividers: true,
                children: /*#__PURE__*/ _jsxs(Grid, {
                    container: true,
                    spacing: 2,
                    children: [
                        /*#__PURE__*/ _jsx(Grid, {
                            item: true,
                            xs: 12,
                            sm: 6,
                            children: /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: availabilityStatusType,
                                dialog: true
                            })
                        }),
                        !delineateRelease ? null : /*#__PURE__*/ _jsx(Grid, {
                            item: true,
                            xs: 12,
                            sm: 6,
                            children: /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: "available-provisional",
                                dialog: true
                            })
                        }),
                        /*#__PURE__*/ _jsx(Grid, {
                            item: true,
                            xs: 12,
                            sm: 6,
                            children: /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: "not available",
                                dialog: true
                            })
                        }),
                        !delineateRelease ? null : /*#__PURE__*/ _jsx(Grid, {
                            item: true,
                            xs: 12,
                            sm: 6,
                            children: /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: "mixed-available-provisional",
                                dialog: true
                            })
                        }),
                        !selectionEnabled ? null : /*#__PURE__*/ _jsxs(_Fragment, {
                            children: [
                                /*#__PURE__*/ _jsx(Grid, {
                                    item: true,
                                    xs: 12,
                                    sm: 6,
                                    children: /*#__PURE__*/ _jsx(SelectionLegendElement, {
                                        variant: "all",
                                        dialog: true
                                    })
                                }),
                                /*#__PURE__*/ _jsx(Grid, {
                                    item: true,
                                    xs: 12,
                                    sm: 6,
                                    children: /*#__PURE__*/ _jsx(SelectionLegendElement, {
                                        variant: "some",
                                        dialog: true
                                    })
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
};
LegendDialog.propTypes = {
    dialogOpen: PropTypes.bool.isRequired,
    setDialogOpen: PropTypes.func.isRequired,
    selectionEnabled: PropTypes.bool,
    delineateRelease: PropTypes.bool,
    availabilityStatusType: PropTypes.oneOf([
        'available',
        'tombstoned'
    ])
};
const basicAvailabilityKeyDefaultProps = {
    selectionEnabled: false,
    delineateRelease: false,
    availabilityStatusType: 'available',
    dialogOnly: false
};
const BasicAvailabilityKey = (inProps)=>{
    const props = resolveProps(basicAvailabilityKeyDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { selectionEnabled, delineateRelease, availabilityStatusType, dialogOnly } = props;
    const appliedAvaStatusType = !exists(availabilityStatusType) ? 'available' : availabilityStatusType;
    const containerRef = useRef(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [componentWidth, setComponentWidth] = useState(0);
    let atContainerWidthXsFlexCol = false;
    let atContainerWidthXs = false;
    let atContainerWidthSelectionXs = false;
    let atContainerWidthSelectionSm = false;
    if (componentWidth > 0) {
        atContainerWidthXsFlexCol = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL;
        atContainerWidthXs = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS;
        atContainerWidthSelectionXs = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION;
        atContainerWidthSelectionSm = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION;
    }
    const containerStyleProps = atContainerWidthXsFlexCol ? {
        flexDirection: 'column'
    } : {};
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
    const renderLegendItems = ()=>{
        if (dialogOnly) return null;
        if (selectionEnabled) {
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: appliedAvaStatusType,
                                dialog: false
                            }),
                            !delineateRelease ? null : /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: "available-provisional",
                                dialog: false
                            }),
                            /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: "not available",
                                dialog: false
                            }),
                            !delineateRelease ? null : /*#__PURE__*/ _jsx(StatusLegendElement, {
                                status: "mixed-available-provisional",
                                dialog: false
                            })
                        ]
                    }),
                    !selectionEnabled ? null : /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx(SelectionLegendElement, {
                                variant: "all",
                                dialog: false
                            }),
                            /*#__PURE__*/ _jsx(SelectionLegendElement, {
                                variant: "some",
                                dialog: false
                            })
                        ]
                    })
                ]
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    children: [
                        /*#__PURE__*/ _jsx(StatusLegendElement, {
                            status: appliedAvaStatusType,
                            dialog: false
                        }),
                        !delineateRelease ? null : /*#__PURE__*/ _jsx(StatusLegendElement, {
                            status: "available-provisional",
                            dialog: false
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("div", {
                    children: [
                        /*#__PURE__*/ _jsx(StatusLegendElement, {
                            status: "not available",
                            dialog: false
                        }),
                        !delineateRelease ? null : /*#__PURE__*/ _jsx(StatusLegendElement, {
                            status: "mixed-available-provisional",
                            dialog: false
                        })
                    ]
                })
            ]
        });
    };
    const renderLegendItemsContainer = ()=>{
        if (dialogOnly || atContainerWidthSelectionXs) return null;
        if (selectionEnabled) {
            if (atContainerWidthSelectionSm) {
                // If at sm selection container width, wrap in containing div
                // to display all statuses vertically in single row
                return /*#__PURE__*/ _jsx("div", {
                    children: renderLegendItems()
                });
            }
            return renderLegendItems();
        }
        // If at xs container width, wrap in containing div
        // to display all statuses vertically in single row
        if (atContainerWidthXs) {
            return /*#__PURE__*/ _jsx("div", {
                children: renderLegendItems()
            });
        }
        return renderLegendItems();
    };
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxs("div", {
                ref: containerRef,
                className: classes.legendContainer,
                style: containerStyleProps,
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.legendTitleContainer,
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "h6",
                                className: classes.legendTitle,
                                children: "Key:"
                            }),
                            /*#__PURE__*/ _jsx(IconButton, {
                                size: "small",
                                color: "primary",
                                title: "Help - Data Availability Chart Key",
                                "aria-label": "Help - Data Availability Chart Key",
                                onClick: ()=>setDialogOpen(true),
                                className: classes.legendTitleIcon,
                                children: /*#__PURE__*/ _jsx(HelpIcon, {
                                    fontSize: "small"
                                })
                            })
                        ]
                    }),
                    renderLegendItemsContainer()
                ]
            }),
            /*#__PURE__*/ _jsx(LegendDialog, {
                dialogOpen: dialogOpen,
                setDialogOpen: setDialogOpen,
                selectionEnabled: selectionEnabled,
                delineateRelease: delineateRelease,
                availabilityStatusType: appliedAvaStatusType
            })
        ]
    });
};
BasicAvailabilityKey.propTypes = {
    selectionEnabled: PropTypes.bool,
    delineateRelease: PropTypes.bool,
    availabilityStatusType: PropTypes.oneOf([
        'available',
        'tombstoned'
    ]),
    dialogOnly: PropTypes.bool
};
export default BasicAvailabilityKey;
