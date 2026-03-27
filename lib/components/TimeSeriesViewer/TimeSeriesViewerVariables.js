import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/forbid-prop-types */ import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import NoSsr from '@mui/material/NoSsr';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from '@mui/material/MenuItem';
import NoneIcon from '@mui/icons-material/NotInterested';
import SearchIcon from '@mui/icons-material/Search';
import SelectAllIcon from '@mui/icons-material/DoneAll';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import TimeSeriesViewerContext, { POINTS_PERFORMANCE_LIMIT } from './TimeSeriesViewerContext';
const useStyles = makeStyles((theme)=>({
        root: {
            flexGrow: 1
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
            color: Theme.palette.grey[400]
        },
        variableCard: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: theme.spacing(1, 3, 1, 1),
            width: 'fit-content',
            backgroundColor: theme.palette.grey[50],
            marginRight: theme.spacing(2)
        },
        variableCardContainer: {
            lineHeight: '7em',
            marginTop: theme.spacing(2)
        },
        noneContainer: {
            color: theme.palette.grey[400],
            display: 'flex',
            alignItems: 'flex-start'
        },
        noneIcon: {
            color: theme.palette.grey[400],
            margin: theme.spacing(0.375, 0.5, 0, 0),
            fontSize: '1rem'
        },
        noneLabel: {
            fontSize: '0.95rem'
        },
        qualityFlagsContainer: {
            marginTop: theme.spacing(2)
        },
        qualityFlagsHeading: {
            fontWeight: 600,
            marginBottom: Theme.spacing(0.5)
        },
        qualityFlagsButtons: {
            marginBottom: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
        }
    }));
const ucWord = (word)=>`${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
const inputComponent = /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx("div", {
        ref: ref,
        ...props
    }));
function Control(props) {
    const { children, innerProps, innerRef, selectProps: { TextFieldProps } } = props;
    const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const numPoints = TimeSeriesViewerContext.calcPredictedPointsForNewVariable(state);
    const labelText = numPoints > POINTS_PERFORMANCE_LIMIT ? 'Add Variables (disabled)' : 'Add Variables';
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
Control.propTypes = {
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
const optionDefaultProps = {
    children: null,
    innerProps: null,
    innerRef: null,
    isDisabled: false
};
function Option(inProps) {
    const props = resolveProps(optionDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { innerRef, isFocused, isDisabled, innerProps, data } = props;
    const { value, units, description } = data;
    const textStyle = isDisabled ? {
        color: Theme.palette.grey[200]
    } : {};
    return /*#__PURE__*/ _jsxs(MenuItem, {
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
        children: [
            /*#__PURE__*/ _jsxs(Typography, {
                variant: "body1",
                style: {
                    ...textStyle
                },
                children: [
                    value,
                    /*#__PURE__*/ _jsx("span", {
                        className: classes.optionSubtitle,
                        style: {
                            ...textStyle,
                            marginLeft: '8px'
                        },
                        children: `(${units})`
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                className: classes.optionSubtitle,
                style: {
                    ...textStyle
                },
                children: description
            })
        ]
    }, value);
}
Option.propTypes = {
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
const components = {
    Control,
    Menu,
    Option,
    ValueContainer,
    Placeholder: ()=>null,
    MultiValue: ()=>null,
    IndicatorsContainer: ()=>null
};
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
   Quality Flags
*/ const QualityFlags = ()=>{
    const classes = useStyles(Theme);
    const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const { availableQualityFlags } = state;
    const { qualityFlags: selectedQualityFlags } = state.selection;
    const toggleFlag = (qualityFlag)=>(event)=>{
            dispatch({
                type: 'selectToggleQualityFlag',
                qualityFlag,
                selected: event.target.checked
            });
        };
    if (!availableQualityFlags.size) {
        return /*#__PURE__*/ _jsxs("div", {
            className: classes.noneContainer,
            children: [
                /*#__PURE__*/ _jsx(NoneIcon, {
                    className: classes.noneIcon
                }),
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "body1",
                    className: classes.noneLabel,
                    children: "No Quality Flags Available"
                })
            ]
        });
    }
    const organizedQualityFlags = {
        basic: [],
        expanded: []
    };
    Array.from(availableQualityFlags).forEach((qf)=>{
        if (!state.variables[qf]) {
            return;
        }
        const { downloadPkg } = state.variables[qf];
        organizedQualityFlags[downloadPkg].push(qf);
    });
    organizedQualityFlags.basic.sort();
    organizedQualityFlags.expanded.sort();
    const downloadPkgs = [
        'basic',
        'expanded'
    ];
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            availableQualityFlags.size > 1 ? /*#__PURE__*/ _jsxs("div", {
                className: classes.qualityFlagsButtons,
                children: [
                    /*#__PURE__*/ _jsx(Button, {
                        size: "small",
                        variant: "outlined",
                        onClick: ()=>{
                            dispatch({
                                type: 'selectNoneQualityFlags'
                            });
                        },
                        startIcon: /*#__PURE__*/ _jsx(ClearIcon, {}),
                        style: {
                            marginRight: Theme.spacing(2)
                        },
                        children: "Select None"
                    }),
                    /*#__PURE__*/ _jsx(Button, {
                        size: "small",
                        variant: "outlined",
                        onClick: ()=>{
                            dispatch({
                                type: 'selectAllQualityFlags'
                            });
                        },
                        startIcon: /*#__PURE__*/ _jsx(SelectAllIcon, {}),
                        children: `Select All (${availableQualityFlags.size})`
                    })
                ]
            }) : null,
            /*#__PURE__*/ _jsx(FormGroup, {
                children: downloadPkgs.map((downloadPkg)=>/*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "subtitle2",
                                children: ucWord(downloadPkg)
                            }),
                            !organizedQualityFlags[downloadPkg].length ? /*#__PURE__*/ _jsx(Typography, {
                                variant: "body2",
                                className: classes.noneLabel,
                                children: `No ${downloadPkg} quality flags available`
                            }) : /*#__PURE__*/ _jsx(_Fragment, {
                                children: organizedQualityFlags[downloadPkg].map((qf)=>{
                                    const checked = selectedQualityFlags.includes(qf);
                                    const captionStyle = {
                                        display: 'block',
                                        color: Theme.palette.grey[400]
                                    };
                                    return /*#__PURE__*/ _jsx(FormControlLabel, {
                                        style: {
                                            alignItems: 'flex-start',
                                            marginBottom: Theme.spacing(1)
                                        },
                                        control: /*#__PURE__*/ _jsx(Checkbox, {
                                            value: qf,
                                            color: "primary",
                                            checked: checked,
                                            onChange: toggleFlag(qf)
                                        }),
                                        label: /*#__PURE__*/ _jsx("div", {
                                            style: {
                                                paddingTop: Theme.spacing(0.5)
                                            },
                                            children: /*#__PURE__*/ _jsxs(Typography, {
                                                variant: "body2",
                                                children: [
                                                    qf,
                                                    /*#__PURE__*/ _jsx(Typography, {
                                                        variant: "caption",
                                                        style: captionStyle,
                                                        children: state.variables[qf].description
                                                    })
                                                ]
                                            })
                                        })
                                    }, qf);
                                })
                            })
                        ]
                    }, downloadPkg))
            })
        ]
    });
};
export default function TimeSeriesViewerVariables() {
    const classes = useStyles(Theme);
    const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const selectedVariables = state.selection.variables.map((variable)=>({
            ...state.variables[variable],
            value: variable
        }));
    const selectedUnits = Array.from(state.selection.variables.reduce((units, variable)=>{
        if (state.variables[variable]) {
            units.add(state.variables[variable].units);
        }
        return units;
    }, new Set()));
    const selectableVariables = [
        {
            label: 'Basic Variables',
            options: []
        },
        {
            label: 'Expanded Variables',
            options: []
        }
    ];
    let selectableVariablesCount = 0;
    Object.keys(state.variables).filter((variable)=>state.variables[variable].isSelectable).forEach((variable)=>{
        const groupIdx = state.variables[variable].downloadPkg === 'basic' ? 0 : 1;
        const isDisabled = selectedUnits.length === 2 && !selectedUnits.includes(state.variables[variable].units);
        selectableVariables[groupIdx].options.push({
            ...state.variables[variable],
            value: variable,
            isDisabled
        });
        selectableVariablesCount += 1;
    });
    if (!selectableVariablesCount) {
        return /*#__PURE__*/ _jsx(Skeleton, {
            variant: "rectangular",
            width: "100%",
            height: 56
        });
    }
    const isDisabled = TimeSeriesViewerContext.calcPredictedPointsForNewVariable(state) > POINTS_PERFORMANCE_LIMIT;
    return /*#__PURE__*/ _jsxs("div", {
        className: classes.root,
        children: [
            /*#__PURE__*/ _jsx(NoSsr, {
                children: /*#__PURE__*/ _jsx(Select, {
                    isMulti: true,
                    isSearchable: true,
                    blurInputOnSelect: "true",
                    isDisabled: isDisabled,
                    clearable: false,
                    classes: classes,
                    styles: selectStyles,
                    "aria-label": "Add Variables",
                    "data-gtm": "time-series-viewer.add-variables",
                    options: selectableVariables,
                    components: components,
                    value: selectedVariables,
                    controlShouldRenderValue: false,
                    filterOption: (option, searchText)=>option.data.value.toLowerCase().includes(searchText.toLowerCase()) || option.data.units.toLowerCase().includes(searchText.toLowerCase()) || option.data.description.toLowerCase().includes(searchText.toLowerCase()),
                    onChange: (value)=>{
                        if (!value) {
                            return;
                        }
                        dispatch({
                            type: 'selectVariables',
                            variables: value.map((v)=>v.value)
                        });
                    }
                })
            }),
            /*#__PURE__*/ _jsx("div", {
                className: classes.variableCardContainer,
                children: state.selection.variables.map((variable)=>{
                    const { units, description } = state.variables[variable];
                    return /*#__PURE__*/ _jsxs(Card, {
                        variant: "outlined",
                        className: classes.variableCard,
                        children: [
                            /*#__PURE__*/ _jsx(IconButton, {
                                "aria-label": `remove variable ${variable}`,
                                disabled: state.selection.variables.length < 2,
                                style: {
                                    marginRight: Theme.spacing(1)
                                },
                                onClick: ()=>{
                                    dispatch({
                                        type: 'selectVariables',
                                        variables: state.selection.variables.filter((v)=>v !== variable)
                                    });
                                },
                                size: "large",
                                children: /*#__PURE__*/ _jsx(ClearIcon, {
                                    fontSize: "small"
                                })
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    flexGrow: 1
                                },
                                children: [
                                    /*#__PURE__*/ _jsxs(Typography, {
                                        variant: "body1",
                                        children: [
                                            variable,
                                            /*#__PURE__*/ _jsx("span", {
                                                className: classes.optionSubtitle,
                                                style: {
                                                    marginLeft: '8px'
                                                },
                                                children: `(${units})`
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsx(Typography, {
                                        variant: "body2",
                                        className: classes.optionSubtitle,
                                        gutterBottom: true,
                                        children: description
                                    })
                                ]
                            })
                        ]
                    }, variable);
                })
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.qualityFlagsContainer,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle1",
                        className: classes.qualityFlagsHeading,
                        children: "Quality Flags"
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "caption",
                        style: {
                            color: Theme.palette.grey[400]
                        },
                        children: "Enabling one or more quality flags will highlight regions on the chart to illustrate the results of data quality tests."
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            width: '100%',
                            marginTop: Theme.spacing(1)
                        },
                        children: /*#__PURE__*/ _jsx(QualityFlags, {})
                    })
                ]
            })
        ]
    });
}
