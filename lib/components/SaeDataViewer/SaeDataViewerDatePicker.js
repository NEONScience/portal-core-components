import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useEffect, useState, useRef, useReducer, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TodayIcon from '@mui/icons-material/Today';
import moment from 'moment';
import SaeDataViewerContext from './SaeDataViewerContext';
import { makeStyles } from '../Theme/makeStyles';
import { exists } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
export var DateSelectionType = /*#__PURE__*/ function(DateSelectionType) {
    DateSelectionType["RANGE"] = "RANGE";
    DateSelectionType["SINGLE"] = "SINGLE";
    return DateSelectionType;
}({});
const useStyles = makeStyles()((theme)=>({
        slider: {
            width: `calc(100% - ${theme.spacing(6)})`,
            marginLeft: theme.spacing(3),
            marginBottom: theme.spacing(5.5)
        },
        datePickerInput: {
            backgroundColor: '#fff',
            width: '100%'
        },
        toggleButtonGroupContainer: {
            margin: theme.spacing(2, 0, 3, 0)
        },
        dateRangeSubtitle: {
            fontSize: '0.725rem',
            color: theme.palette.grey[400],
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(2)
        },
        dateSelectionGroup: {
            width: '100%'
        },
        dateSelectionIcon: {
            marginRight: theme.spacing(1)
        },
        dateSelectionToggleButton: {
            flex: 1
        }
    }));
const useToggleButtonStyles = makeStyles()((theme, { useDefault = true })=>({
        root: {
            color: useDefault ? theme.colors.LIGHT_BLUE[500] : theme.colors.GREY[500],
            borderColor: useDefault ? theme.colors.LIGHT_BLUE[500] : theme.colors.GREY[500],
            '&:hover, &:active': {
                color: useDefault ? theme.colors.LIGHT_BLUE[400] : theme.colors.GREY[300],
                borderColor: useDefault ? theme.colors.LIGHT_BLUE[400] : theme.colors.GREY[300]
            },
            '&.MuiToggleButton-root.Mui-selected': {
                color: `${useDefault ? '#fff' : 'rgba(0, 0, 0, 1)'} !important`,
                backgroundColor: `${useDefault ? theme.colors.LIGHT_BLUE[500] : '#bcc0bf'} !important`
            }
        }
    }));
const getContinuousDatesArray = (minDate, maxDate)=>{
    const startMoment = moment(minDate);
    const endMoment = moment(maxDate);
    const continuousRange = [];
    let days = 0;
    const MAX_DAYS = 29200; // If we're going more than 80 years then maybe something is wrong?
    while(startMoment.isSameOrBefore(endMoment) && days < MAX_DAYS){
        continuousRange.push(startMoment.format('YYYY-MM-DD'));
        startMoment.add(1, 'days');
        days += 1;
    }
    return continuousRange;
};
const handleNudgeDateRange = (minDate, startDate, maxDate, endDate)=>{
    let newStartDate = startDate;
    let newEndDate = endDate;
    if (startDate.getTime() === endDate.getTime()) {
        if (startDate.getTime() === minDate.getTime()) {
            newStartDate = startDate;
            newEndDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
        } else if (endDate.getTime() === maxDate.getTime()) {
            newStartDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 1);
            newEndDate = endDate;
        } else {
            newStartDate = startDate;
            newEndDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
        }
    }
    return [
        newStartDate,
        newEndDate
    ];
};
const formatMomentDate = (date)=>moment(date).format('YYYY-MM-DD');
const datePickerReducer = (state, action)=>{
    const newState = {
        ...state
    };
    switch(action.type){
        case 'setActivelySelectingDateRange':
            newState.activelySelectingDateRange = action.activelySelectingDateRange;
            return newState;
        default:
            return state;
    }
};
const defaultProps = {
    sidebarMode: false
};
const SaeDataViewerDatePicker = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { sidebarMode } = props;
    const { classes, theme } = useStyles();
    const { classes: toggleButtonClasses } = useToggleButtonStyles({
        useDefault: true
    });
    const dateRangeSliderRef = useRef(null);
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
    const { startDate, endDate, controlsState: { minDate, maxDate } } = state;
    const appliedSidebarMode = sidebarMode === true;
    const sliderDateValues = useMemo(()=>getContinuousDatesArray(minDate, maxDate), [
        minDate,
        maxDate
    ]);
    const sliderMin = 0;
    const sliderMax = sliderDateValues.length - 1;
    const initialState = {
        activelySelectingDateRange: [
            startDate,
            endDate
        ]
    };
    const [datePickerState, datePickerDispatch] = useReducer(datePickerReducer, initialState);
    const [activelySelecting, setActivelySelecting] = useState(false);
    const [dateSelectionType, setDateSelectionType] = useState("RANGE");
    const sliderValue = datePickerState.activelySelectingDateRange.map((activeSelectingDate, i)=>{
        if (activeSelectingDate) {
            return sliderDateValues.indexOf(formatMomentDate(activeSelectingDate));
        }
        const selectedDate = i === 0 ? startDate : endDate;
        return sliderDateValues.indexOf(formatMomentDate(selectedDate));
    });
    useEffect(()=>{
        if ((startDate !== datePickerState.activelySelectingDateRange[0] || endDate !== datePickerState.activelySelectingDateRange[1]) && !activelySelecting) {
            const action = {
                type: 'setActivelySelectingDateRange',
                activelySelectingDateRange: [
                    startDate,
                    endDate
                ]
            };
            datePickerDispatch(action);
        }
    }, [
        activelySelecting,
        datePickerState,
        datePickerDispatch,
        startDate,
        endDate
    ]);
    const marks = [
        {
            value: sliderMin,
            label: sliderDateValues[sliderMin].substring(0, 4)
        }
    ];
    const yearsInSlider = Math.floor(sliderDateValues.length / 365);
    if (yearsInSlider <= 3) {
        const numInnerMarks = 4;
        const sliderMarkModulo = Math.ceil(sliderDateValues.length / numInnerMarks);
        for(let y = 1; y <= numInnerMarks; y += 1){
            marks.push({
                value: y * sliderMarkModulo,
                label: ''
            });
        }
    } else {
        const innerMark = Math.ceil(yearsInSlider / Math.ceil(yearsInSlider % 3 ? 2 : 3));
        for(let y = 1; y < yearsInSlider; y += 1){
            marks.push({
                value: 365 * y,
                label: y === innerMark || y === innerMark * 2 ? sliderDateValues[365 * y].substring(0, 4) : ''
            });
        }
    }
    marks.push({
        value: sliderMax,
        label: sliderDateValues[sliderMax].substring(0, 4)
    });
    const handleDateSelectionTypeChange = useCallback((cbDateSelectionType, cbMinDate, cbStartDate, cbMaxDate, cbEndDate)=>{
        if (cbDateSelectionType === "RANGE") {
            const [newStartDate, newEndDate] = handleNudgeDateRange(cbMinDate, cbStartDate, cbMaxDate, cbEndDate);
            const hasChanges = cbStartDate.getTime() !== newStartDate.getTime() || cbEndDate.getTime() !== newEndDate.getTime();
            if (hasChanges && dispatch) {
                dispatch({
                    type: 'setSelectedDateRange',
                    startDate: newStartDate,
                    endDate: newEndDate
                });
            }
        }
        setDateSelectionType(cbDateSelectionType);
    }, [
        dispatch,
        setDateSelectionType
    ]);
    const handleDateRangeChange = useCallback((cbStartDate, cbEndDate)=>{
        if (dispatch) {
            dispatch({
                type: 'setSelectedDateRange',
                startDate: cbStartDate,
                endDate: cbEndDate
            });
        }
    }, [
        dispatch
    ]);
    const renderSlider = ()=>{
        if (dateSelectionType !== "RANGE") {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsx(Slider, {
            "data-selenium": "sae-data-viewer.date-range.slider",
            className: classes.slider,
            ref: dateRangeSliderRef,
            value: sliderValue,
            valueLabelDisplay: "auto",
            min: sliderMin,
            max: sliderMax,
            marks: marks,
            valueLabelFormat: (x)=>sliderDateValues[x],
            onPointerDown: ()=>{
                setActivelySelecting(true);
            },
            onChange: (event, values)=>{
                const sliderRange = [
                    Math.max(values[0], sliderMin),
                    Math.min(values[1], sliderMax)
                ];
                const mappedDisplayRange = sliderRange.map((x)=>moment(sliderDateValues[x]).toDate());
                const action = {
                    type: 'setActivelySelectingDateRange',
                    activelySelectingDateRange: mappedDisplayRange
                };
                datePickerDispatch(action);
            },
            onChangeCommitted: (event, values)=>{
                setActivelySelecting(false);
                if (dispatch) {
                    const dateRange = [
                        Math.max(values[0], sliderMin),
                        Math.min(values[1], sliderMax)
                    ].map((x)=>moment(sliderDateValues[x]).toDate());
                    const [newStartDate, newEndDate] = handleNudgeDateRange(minDate, dateRange[0], maxDate, dateRange[1]);
                    handleDateRangeChange(newStartDate, newEndDate);
                }
            }
        });
    };
    const renderDatePickers = ()=>{
        const mainPickerMaxDate = dateSelectionType === "RANGE" ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 1) : maxDate;
        // eslint-disable-next-line react/jsx-no-useless-fragment
        let secondaryPicker = /*#__PURE__*/ _jsx(_Fragment, {});
        const isRange = dateSelectionType === "RANGE";
        if (isRange) {
            const secondaryMinDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
            secondaryPicker = /*#__PURE__*/ _jsx(Grid, {
                size: {
                    xs: 12,
                    md: appliedSidebarMode ? 12 : 6
                },
                children: /*#__PURE__*/ _jsx(DatePicker, {
                    "data-selenium": "sae-data-viewer.date-range.end-input",
                    orientation: "portrait",
                    format: "MMM D, YYYY",
                    value: moment(endDate),
                    onChange: (value)=>{
                        handleDateRangeChange(startDate, moment(value).toDate());
                    },
                    views: [
                        'day'
                    ],
                    label: "End",
                    openTo: "day",
                    minDate: moment(secondaryMinDate),
                    maxDate: moment(maxDate),
                    slotProps: {
                        textField: {
                            className: classes.datePickerInput,
                            readOnly: true,
                            variant: 'outlined',
                            margin: 'dense',
                            size: 'small'
                        }
                    }
                })
            });
        }
        return /*#__PURE__*/ _jsx(LocalizationProvider, {
            dateAdapter: AdapterMoment,
            children: /*#__PURE__*/ _jsxs(Grid, {
                container: true,
                spacing: 2,
                children: [
                    /*#__PURE__*/ _jsx(Grid, {
                        size: {
                            xs: 12,
                            md: appliedSidebarMode || !isRange ? 12 : 6
                        },
                        children: /*#__PURE__*/ _jsx(DatePicker, {
                            "data-selenium": "sae-data-viewer.date-range.start-input",
                            orientation: "portrait",
                            format: "MMM D, YYYY",
                            value: moment(startDate),
                            onChange: (value)=>{
                                if (dateSelectionType === "SINGLE") {
                                    handleDateRangeChange(moment(value).toDate(), moment(value).toDate());
                                } else {
                                    handleDateRangeChange(moment(value).toDate(), endDate);
                                }
                            },
                            views: [
                                'day'
                            ],
                            label: dateSelectionType === "RANGE" ? 'Start' : 'Date',
                            openTo: "day",
                            minDate: moment(minDate),
                            maxDate: moment(mainPickerMaxDate),
                            slotProps: {
                                textField: {
                                    className: classes.datePickerInput,
                                    readOnly: true,
                                    variant: 'outlined',
                                    margin: 'dense',
                                    size: 'small'
                                }
                            }
                        })
                    }),
                    secondaryPicker
                ]
            })
        });
    };
    return /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "caption",
                className: classes.dateRangeSubtitle,
                gutterBottom: true,
                children: "Toggle between selecting by date range or by a single date"
            }),
            /*#__PURE__*/ _jsx("div", {
                className: classes.toggleButtonGroupContainer,
                children: /*#__PURE__*/ _jsxs(ToggleButtonGroup, {
                    exclusive: true,
                    size: "small",
                    className: classes.dateSelectionGroup,
                    value: dateSelectionType,
                    onChange: (event, value)=>{
                        if (!exists(value)) {
                            return;
                        }
                        handleDateSelectionTypeChange(value, minDate, startDate, maxDate, endDate);
                    },
                    children: [
                        /*#__PURE__*/ _jsxs(ToggleButton, {
                            value: "RANGE",
                            className: classes.dateSelectionToggleButton,
                            classes: toggleButtonClasses,
                            children: [
                                /*#__PURE__*/ _jsx(DateRangeIcon, {
                                    className: classes.dateSelectionIcon
                                }),
                                "Date Range"
                            ]
                        }),
                        /*#__PURE__*/ _jsxs(ToggleButton, {
                            value: "SINGLE",
                            className: classes.dateSelectionToggleButton,
                            classes: toggleButtonClasses,
                            children: [
                                /*#__PURE__*/ _jsx(TodayIcon, {
                                    className: classes.dateSelectionIcon
                                }),
                                "Single Date"
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsxs("div", {
                style: {
                    marginBottom: theme.spacing(2)
                },
                children: [
                    renderSlider(),
                    renderDatePickers()
                ]
            })
        ]
    });
};
export default SaeDataViewerDatePicker;
