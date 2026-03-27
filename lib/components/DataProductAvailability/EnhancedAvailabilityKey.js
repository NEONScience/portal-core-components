import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/HelpOutline';
import { SVG, VALID_ENHANCED_STATUSES } from './AvailabilityUtils';
import { JsxCell } from './AvailabilitySvgComponents';
import Theme, { COLORS } from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
/**
   Setup: CSS classes
*/ const useStyles = makeStyles((theme)=>({
        keyContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexWrap: 'wrap'
        },
        keyElement: {
            cursor: 'help',
            margin: theme.spacing(0, 3, 0.25, 0)
        },
        keyElementText: {
            textAnchor: 'start',
            whiteSpace: 'pre',
            fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
            fontWeight: 400,
            fontSize: `${SVG.LABEL_FONT_SIZE}px`,
            fill: Theme.palette.grey[700]
        },
        h6Small: {
            fontSize: '0.95rem'
        }
    }));
const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';
const defaultProps = {
    selectionEnabled: false,
    rollUpPresent: false
};
/**
   Main Function
*/ export default function EnhancedAvailabilityKey(inProps) {
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { selectionEnabled, rollUpPresent } = props;
    const statusSvgHeight = SVG.CELL_HEIGHT + 2;
    const labelLetterWidth = 8;
    const labelY = SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1;
    const statusLabelX = SVG.CELL_WIDTH + 2 * SVG.CELL_PADDING;
    // Let each element in the key be clickable to open the help dialog.
    // This is in addition to the help button, but we should still provide aria attributes.
    const dialogOpenerProps = {
        role: 'button',
        onClick: ()=>setDialogOpen(true)
    };
    const statusSvgs = {};
    Object.keys(VALID_ENHANCED_STATUSES).forEach((status)=>{
        const { title: label, description } = VALID_ENHANCED_STATUSES[status];
        const statusSvgWidth = label.length * labelLetterWidth + statusLabelX;
        statusSvgs[status] = /*#__PURE__*/ _jsx("div", {
            className: classes.keyElement,
            title: description,
            ...dialogOpenerProps,
            children: /*#__PURE__*/ _jsxs("svg", {
                width: statusSvgWidth,
                height: statusSvgHeight,
                children: [
                    /*#__PURE__*/ _jsx(JsxCell, {
                        status: status
                    }),
                    /*#__PURE__*/ _jsx("text", {
                        className: classes.keyElementText,
                        x: statusLabelX,
                        y: labelY,
                        children: label
                    })
                ]
            })
        });
    });
    const renderSelectionElement = (variant, inDialog = false)=>{
        if (![
            'all',
            'some'
        ].includes(variant)) {
            return null;
        }
        const selectionSvgHeight = SVG.CELL_HEIGHT + 2;
        const label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
        const fill = variant === 'all' ? Theme.palette.primary.main : 'url(#partialSelectionPattern)';
        const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
        const selectionWidth = 45;
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
        return inDialog ? /*#__PURE__*/ _jsxs("div", {
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
            className: classes.keyElement,
            title: description,
            ...dialogOpenerProps,
            children: /*#__PURE__*/ _jsxs("svg", {
                width: selectionSvgWidth,
                height: statusSvgHeight,
                children: [
                    graphic,
                    /*#__PURE__*/ _jsx("text", {
                        className: classes.keyElementText,
                        x: selectionLabelX,
                        y: labelY,
                        children: label
                    })
                ]
            })
        });
    };
    const renderDialog = ()=>{
        const renderStatus = (status)=>{
            const { title, description } = VALID_ENHANCED_STATUSES[status];
            return /*#__PURE__*/ _jsxs("div", {
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
            });
        };
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
                /*#__PURE__*/ _jsxs(DialogContent, {
                    style: {
                        marginBottom: Theme.spacing(2)
                    },
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start'
                            },
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    style: {
                                        flex: '50%',
                                        marginRight: Theme.spacing(2)
                                    },
                                    children: [
                                        renderStatus('available'),
                                        renderStatus('being processed'),
                                        renderStatus('expected'),
                                        renderStatus('not expected')
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    style: {
                                        flex: '50%'
                                    },
                                    children: [
                                        renderStatus('not available'),
                                        renderStatus('not collected'),
                                        renderStatus('delayed'),
                                        renderStatus('tentative')
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        flex: '50%',
                                        marginRight: Theme.spacing(2)
                                    },
                                    children: renderStatus('mixed some availability')
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        flex: '50%'
                                    },
                                    children: renderStatus('mixed no availability')
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        flex: '50%',
                                        marginRight: Theme.spacing(2)
                                    },
                                    children: renderSelectionElement('all', true)
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        flex: '50%'
                                    },
                                    children: renderSelectionElement('some', true)
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    };
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: classes.keyContainer,
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "h6",
                                className: classes.h6Small,
                                style: {
                                    margin: Theme.spacing(-0.75, 3, 0.5, 0)
                                },
                                children: "Key:"
                            }),
                            /*#__PURE__*/ _jsx(IconButton, {
                                size: "small",
                                color: "primary",
                                title: "Help - Data Availability Chart Key",
                                "aria-label": "Help - Data Availability Chart Key",
                                onClick: ()=>setDialogOpen(true),
                                style: {
                                    marginLeft: '-3px'
                                },
                                children: /*#__PURE__*/ _jsx(HelpIcon, {
                                    fontSize: "inherit"
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            statusSvgs.available,
                            statusSvgs['being processed'],
                            statusSvgs.expected,
                            statusSvgs['not expected']
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            statusSvgs['not available'],
                            statusSvgs['not collected'],
                            statusSvgs.delayed,
                            statusSvgs.tentative
                        ]
                    }),
                    !(selectionEnabled || rollUpPresent) ? null : /*#__PURE__*/ _jsxs("div", {
                        children: [
                            !rollUpPresent ? null : /*#__PURE__*/ _jsxs(_Fragment, {
                                children: [
                                    statusSvgs['mixed some availability'],
                                    statusSvgs['mixed no availability']
                                ]
                            }),
                            !selectionEnabled ? null : /*#__PURE__*/ _jsxs(_Fragment, {
                                children: [
                                    renderSelectionElement('all'),
                                    renderSelectionElement('some')
                                ]
                            })
                        ]
                    })
                ]
            }),
            renderDialog()
        ]
    });
}
EnhancedAvailabilityKey.propTypes = {
    selectionEnabled: PropTypes.bool,
    rollUpPresent: PropTypes.bool
};
