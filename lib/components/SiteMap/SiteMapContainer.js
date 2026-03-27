import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import HelpIcon from '@mui/icons-material/HelpOutline';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandUpIcon from '@mui/icons-material/ExpandLess';
import ExpandDownIcon from '@mui/icons-material/ExpandMore';
import HideIcon from '@mui/icons-material/VisibilityOff';
import ShowIcon from '@mui/icons-material/Visibility';
import DownArrowIcon from '@mui/icons-material/ArrowDropDown';
import LeftArrowIcon from '@mui/icons-material/ArrowLeft';
import VertResizeIcon from '@mui/icons-material/Height';
import LegendIcon from '@mui/icons-material/Toc';
import UnselectableIcon from '@mui/icons-material/NotInterested';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import NoneSelectedIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import SiteMapContext from './SiteMapContext';
import SiteMapLeaflet from './SiteMapLeaflet';
import SiteMapTable from './SiteMapTable';
import { VIEWS, FEATURES, FEATURE_TYPES, FEATURE_DATA_SOURCES, MIN_CONTAINER_HEIGHT, OVERLAYS, OVERLAY_GROUPS, getDynamicAspectRatio } from './SiteMapUtils';
const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = makeStyles((theme)=>({
        ':root': {
            fontSize: '24px'
        },
        outerContainer: {
            zIndex: 0,
            width: '100%',
            position: 'relative'
        },
        contentContainer: {
            width: '100%',
            height: '0px',
            position: 'relative',
            backgroundColor: Theme.colors.NEON_BLUE[200],
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            boxShadow
        },
        contentPaper: {
            position: 'absolute',
            width: '70%',
            top: '50%',
            transform: 'translate(0%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(3),
            borderRadius: '2px'
        },
        legendContainer: {
            backgroundColor: theme.palette.grey[100],
            height: 'calc(100% - 84px)',
            borderBottomLeftRadius: '4px',
            borderTopLeftRadius: '4px',
            position: 'absolute',
            zIndex: 1000,
            top: '48px',
            right: '0px',
            boxShadow: '-3px 0 5px 0px rgba(0,0,0,0.5)',
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflowY: 'auto',
            '& span.MuiCheckbox-root': {
                marginLeft: '-9px'
            }
        },
        legendContainerFullscreen: {
            top: '56px',
            height: 'calc(100% - 92px)'
        },
        legendDivider: {
            width: '100%',
            borderBottomColor: theme.palette.grey[300],
            borderWidth: '0px 0px 1px 0px',
            margin: theme.spacing(2.5, 0)
        },
        legendSection: {
            width: '100%'
        },
        legendSectionTitleContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
        },
        legendSectionTitle: {
            fontWeight: 600
        },
        featureIcon: {
            width: '28px',
            height: '28px',
            marginRight: theme.spacing(1)
        },
        legendOptionFormControlLabel: {
            width: '100%',
            paddingRight: theme.spacing(1),
            margin: 0,
            '& > span:nth-child(2)': {
                width: '100%'
            },
            '&:hover, &:focus': {
                backgroundColor: theme.palette.grey[100]
            }
        },
        legendOptionLabel: {
            display: 'flex',
            alignItems: 'center'
        },
        resizeButton: {
            backgroundColor: '#fff',
            position: 'absolute',
            zIndex: 999,
            bottom: '0px',
            right: '0px',
            width: '26px',
            height: '26px',
            padding: 'unset',
            borderRadius: '2px 0px 2px 0px',
            border: `1px solid ${Theme.colors.LIGHT_BLUE[500]}`,
            cursor: 'grab',
            '&:hover, &:active': {
                color: Theme.colors.LIGHT_BLUE[400],
                borderColor: Theme.colors.LIGHT_BLUE[400],
                backgroundColor: theme.palette.grey[50]
            },
            '&:active': {
                cursor: 'row-resize !important'
            },
            '& svg': {
                fontSize: '17px !important'
            }
        },
        resizeBorder: {
            position: 'absolute',
            border: `3px solid ${Theme.colors.LIGHT_BLUE[500]}`,
            top: '0px',
            left: '0px',
            width: '100%',
            zIndex: 998,
            display: 'none'
        },
        viewLegendButtonsContainer: {
            display: 'flex',
            position: 'absolute',
            zIndex: 401,
            top: '0px',
            right: '0px'
        },
        viewLegendButtonsContainerFullscreen: {
            top: '8px',
            right: '8px'
        },
        mapTableToggleButtonGroup: {
            borderRadius: '0px 0px 2px 2px',
            backgroundColor: 'white',
            '& button': {
                borderTopLeftRadius: '0px !important',
                borderTopRightRadius: '0px !important'
            }
        },
        mapTableToggleButtonGroupFullscreen: {
            borderRadius: '2px',
            backgroundColor: 'white'
        },
        legendButton: {
            border: `1px solid ${Theme.palette.primary.main}`,
            borderRadius: '0px 0px 0px 2px'
        },
        legendButtonFullscreen: {
            border: `1px solid ${Theme.palette.primary.main}`
        },
        unselectablesButton: {
            border: `1px solid ${Theme.palette.primary.main}`,
            borderRadius: '0px 0px 2px 2px'
        },
        unselectablesButtonFullscreen: {
            border: `1px solid ${Theme.palette.primary.main}`
        },
        selectionSummaryContainer: {
            position: 'absolute',
            left: '8px',
            bottom: '8px',
            zIndex: 400
        },
        selectionSummary: {
            position: 'absolute',
            bottom: theme.spacing(6),
            overflowY: 'auto',
            borderRadius: theme.spacing(2.5),
            '& .MuiListItemText-primary': {
                fontWeight: 600
            },
            '& .MuiListItem-secondaryAction': {
                paddingRight: theme.spacing(9)
            },
            '& .MuiListItemIcon-root': {
                minWidth: 'unset'
            },
            '& .MuiListItemSecondaryAction-root': {
                right: theme.spacing(3)
            }
        },
        selectionSummaryValid: {
            border: `1px solid ${theme.palette.secondary.main}`,
            backgroundColor: theme.palette.grey[50]
        },
        selectionSummaryInvalid: {
            border: `1px solid ${theme.palette.error.light}`,
            backgroundColor: theme.palette.error.light
        },
        summaryFeatureIcon: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight: theme.spacing(1.5),
            filter: 'drop-shadow(0px 0px 1.5px #000000bb)'
        },
        selectionChip: {
            opacity: 1,
            fontSize: theme.spacing(2),
            height: theme.spacing(5),
            borderRadius: theme.spacing(2.5),
            padding: theme.spacing(0, 1),
            '& .MuiChip-label': {
                padding: theme.spacing(0, 2)
            }
        },
        selectionChipError: {
            backgroundColor: theme.palette.error.light,
            fontWeight: 600,
            '& .MuiChip-icon': {
                color: theme.palette.error.dark
            }
        },
        overlayLegendContainer: {
            margin: theme.spacing(0.5, 0, 2, 3.5)
        },
        overlayLegendItem: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
            cursor: 'help'
        },
        overlayLegendSwatch: {
            width: '36px',
            height: '12px',
            border: '1px solid black',
            marginRight: theme.spacing(1.5),
            marginBottom: '-1px',
            display: 'inline-block'
        },
        overlayLegendItemTooltipTitle: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px'
        },
        overlayLegendCategory: {
            marginBottom: '6px',
            '& span.MuiTypography-caption': {
                fontWeight: 600
            }
        }
    }));
const defaultProps = {
    unusableVerticalSpace: 0,
    mapUniqueId: 0
};
const SiteMapContainer = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { unusableVerticalSpace = 0, mapUniqueId } = props;
    const [neonContextState] = NeonContext.useNeonContextState();
    const [state, dispatch] = SiteMapContext.useSiteMapContext();
    const isLoading = state.overallFetch.expected !== state.overallFetch.completed;
    const progressId = `sitemap-progress-${uniqueId()}`;
    const { filters, fullscreen, aspectRatio, featureData, view: { current: view }, table: { fullHeight: tableFullHeight }, selection: { set: selection, active: selectionActive, validSet: selectableItems, valid: selectionValid, limit: selectionLimit, hideUnselectable, showSummary }, manualLocationData } = state;
    const contentDivProps = {
        className: classes.contentContainer,
        style: tableFullHeight ? {
            height: 'auto',
            overflow: 'auto'
        } : {
            paddingBottom: `${(aspectRatio.currentValue || 0.75) * 100}%`
        }
    };
    const legendRef = useRef(null);
    const containerDivRef = useRef(null);
    const contentDivRef = useRef(null);
    const resizeBorderRef = useRef(null);
    const resizeButtonRef = useRef(null);
    const belowMd = useMediaQuery(Theme.breakpoints.down('md'));
    /**
     Vertical Resize Hooks
  */ const [resizeDragging, setResizeDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(null);
    const dragDeltaY = useRef(null);
    const resizeVerticallyDragStart = useCallback((event)=>{
        if (!resizeBorderRef.current || !contentDivRef.current) {
            return;
        }
        setDragStartY(event.clientY);
        setResizeDragging(true);
        dragDeltaY.current = 0;
        resizeBorderRef.current.style.display = 'block';
        resizeBorderRef.current.style.height = `${contentDivRef.current.clientHeight}px`;
    }, [
        setDragStartY,
        setResizeDragging,
        dragDeltaY
    ]);
    const resizeVerticallyDrag = useCallback((event)=>{
        if (!resizeDragging || !resizeBorderRef.current || dragStartY === null || event.clientY === 0) {
            return;
        }
        dragDeltaY.current = event.clientY - dragStartY;
        const newHeight = Math.max(contentDivRef.current.clientHeight + dragDeltaY.current, MIN_CONTAINER_HEIGHT);
        resizeBorderRef.current.style.height = `${newHeight}px`;
    }, [
        resizeDragging,
        dragStartY,
        dragDeltaY
    ]);
    const resizeVerticallyDragEnd = useCallback(()=>{
        const finalHeight = Math.max(contentDivRef.current.clientHeight + dragDeltaY.current, MIN_CONTAINER_HEIGHT);
        setDragStartY(null);
        setResizeDragging(false);
        dragDeltaY.current = null;
        resizeBorderRef.current.style.display = 'none';
        resizeButtonRef.current.blur();
        const newAspectRatio = finalHeight / aspectRatio.widthReference;
        dispatch({
            type: 'setAspectRatio',
            aspectRatio: newAspectRatio,
            widthReference: aspectRatio.widthReference
        });
    }, [
        aspectRatio.widthReference,
        dispatch,
        setDragStartY,
        setResizeDragging,
        dragDeltaY
    ]);
    /**
     Effect - Register event listener to dynamically adjust aspect ratio from viewport dimensions
  */ useLayoutEffect(()=>{
        const handleResize = debounce(()=>{
            let newAspectRatio = aspectRatio.isDynamic ? getDynamicAspectRatio(unusableVerticalSpace) : aspectRatio.currentValue;
            if (fullscreen && containerDivRef.current && contentDivRef.current) {
                const boundingClientRect = contentDivRef.current.getBoundingClientRect();
                const targetHeight = Math.max(window.innerHeight - boundingClientRect.y - 1, 0);
                const targetWidth = boundingClientRect.height + boundingClientRect.y > window.innerHeight ? window.innerWidth : contentDivRef.current.clientWidth;
                newAspectRatio = targetHeight / targetWidth;
                containerDivRef.current.style.height = `calc(100vh - ${boundingClientRect.y}px)`;
                containerDivRef.current.style.overflowY = 'hidden';
            }
            dispatch({
                type: 'setAspectRatio',
                aspectRatio: newAspectRatio,
                widthReference: contentDivRef.current ? contentDivRef.current.clientWidth : 0
            });
        }, 10);
        if ((!aspectRatio.isDynamic || aspectRatio.currentValue !== null) && !fullscreen) {
            return ()=>{};
        }
        handleResize();
        if ((!aspectRatio.isDynamic || aspectRatio.resizeEventListenerInitialized) && !fullscreen) {
            return ()=>{};
        }
        window.addEventListener('resize', handleResize);
        dispatch({
            type: 'setAspectRatioResizeEventListenerInitialized'
        });
        return ()=>{
            window.removeEventListener('resize', handleResize);
        };
    }, [
        unusableVerticalSpace,
        aspectRatio,
        fullscreen,
        dispatch
    ]);
    /**
     Effect - Monitor all click events and close the legend pane if open and clicked outside
     and not in the content area (map or table)
  */ useEffect(()=>{
        if (!state.filters.legendOpen || !legendRef.current) {
            return ()=>{};
        }
        const handleClick = (event)=>{
            if (legendRef.current && !legendRef.current.contains(event.target) && contentDivRef.current && !contentDivRef.current.contains(event.target)) {
                dispatch({
                    type: 'setLegendOpen',
                    open: false
                });
            }
        };
        document.addEventListener('click', handleClick);
        return ()=>{
            document.removeEventListener('click', handleClick);
        };
    }, [
        state.filters.legendOpen,
        legendRef,
        contentDivRef,
        dispatch
    ]);
    /**
     Effect - If NeonContext Data is now available and has not been hydrated into state then do so.
  */ useEffect(()=>{
        if (state.neonContextHydrated || !(neonContextState.isFinal && !neonContextState.hasError)) {
            return;
        }
        dispatch({
            type: 'hydrateNeonContextData',
            neonContextData: neonContextState.data
        });
    }, [
        state.neonContextHydrated,
        neonContextState.isFinal,
        neonContextState.hasError,
        neonContextState.data,
        dispatch
    ]);
    const containerProps = {
        ref: containerDivRef,
        className: classes.outerContainer,
        'aria-busy': isLoading ? 'true' : 'false',
        'data-selenium': 'siteMap-container',
        id: mapUniqueId
    };
    /**
     Render - Loading Sites
  */ if (!neonContextState.isFinal) {
        return /*#__PURE__*/ _jsx("div", {
            ...containerProps,
            children: /*#__PURE__*/ _jsx("div", {
                ref: contentDivRef,
                ...contentDivProps,
                children: /*#__PURE__*/ _jsxs(Paper, {
                    className: classes.contentPaper,
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h6",
                            component: "h3",
                            gutterBottom: true,
                            children: "Loading Sites..."
                        }),
                        /*#__PURE__*/ _jsx(CircularProgress, {})
                    ]
                })
            })
        });
    }
    /**
     Render - Error (sites did not loaded)
  */ if (neonContextState.hasError) {
        return /*#__PURE__*/ _jsx("div", {
            ...containerProps,
            children: /*#__PURE__*/ _jsx("div", {
                ref: contentDivRef,
                ...contentDivProps,
                children: /*#__PURE__*/ _jsxs(Paper, {
                    className: classes.contentPaper,
                    children: [
                        /*#__PURE__*/ _jsx(WarningIcon, {
                            fontSize: "large",
                            color: "error"
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h6",
                            component: "h3",
                            style: {
                                marginTop: Theme.spacing(1)
                            },
                            children: `Unable to load sites: ${neonContextState.fetches.sites.error}`
                        })
                    ]
                })
            })
        });
    }
    /**
     Render - Map/Table Toggle Button Group
  */ const renderMapTableToggleButtonGroup = ()=>{
        if (state.view.current === VIEWS.SPLIT) {
            return null;
        }
        const viewTooltips = {
            [VIEWS.MAP]: 'Show the observatory map',
            [VIEWS.TABLE]: 'Show a table of all locations currently visible in the map'
        };
        return /*#__PURE__*/ _jsx(ToggleButtonGroup, {
            exclusive: true,
            color: "primary",
            variant: "outlined",
            value: view,
            onChange: (event, newView)=>dispatch({
                    type: 'setView',
                    view: newView
                }),
            className: fullscreen ? classes.mapTableToggleButtonGroupFullscreen : classes.mapTableToggleButtonGroup,
            children: Object.keys(VIEWS).filter((key)=>key !== VIEWS.SPLIT).map((key)=>/*#__PURE__*/ _jsx(Tooltip, {
                    title: viewTooltips[key],
                    enterDelay: 500,
                    enterNextDelay: 200,
                    placement: fullscreen ? 'bottom-end' : 'top-end',
                    children: /*#__PURE__*/ _jsx(ToggleButton, {
                        value: key,
                        selected: state.view.current === key,
                        "data-selenium": `sitemap-viewButton-${key}`,
                        children: key
                    })
                }, key))
        });
    };
    /**
     Render - Legend Button
  */ const renderLegendButton = ()=>{
        const buttonStyle = filters.legendOpen ? {} : {
            backgroundColor: 'white'
        };
        return /*#__PURE__*/ _jsx("div", {
            style: {
                borderRadius: '2px',
                marginLeft: Theme.spacing(1)
            },
            children: /*#__PURE__*/ _jsx(Tooltip, {
                enterDelay: 500,
                enterNextDelay: 200,
                title: `${filters.legendOpen ? 'Hide' : 'Show'} the legend`,
                placement: fullscreen ? 'bottom-end' : 'top-end',
                children: /*#__PURE__*/ _jsx(Button, {
                    color: "primary",
                    style: buttonStyle,
                    variant: filters.legendOpen ? 'contained' : 'outlined',
                    endIcon: filters.legendOpen ? /*#__PURE__*/ _jsx(ExpandUpIcon, {}) : /*#__PURE__*/ _jsx(ExpandDownIcon, {}),
                    "data-selenium": "sitemap-legendButton",
                    className: fullscreen ? classes.legendButtonFullscreen : classes.legendButton,
                    onClick: ()=>{
                        dispatch({
                            type: 'setLegendOpen',
                            open: !filters.legendOpen
                        });
                    },
                    children: belowMd ? /*#__PURE__*/ _jsx(LegendIcon, {
                        style: {
                            fontSize: '20px'
                        }
                    }) : 'Legend'
                })
            })
        });
    };
    /**
     Render - Unselectables Button
  */ const renderUnselectablesButton = ()=>{
        if (!selectionActive || !selectableItems) {
            return null;
        }
        const buttonStyle = hideUnselectable ? {
            backgroundColor: 'white'
        } : {};
        const items = selectionActive.toLowerCase().replace('_', '');
        const title = `Click to ${hideUnselectable ? 'show' : 'hide'} ${items} that are not selectable`;
        return /*#__PURE__*/ _jsx("div", {
            style: {
                borderRadius: '2px',
                marginRight: Theme.spacing(1)
            },
            children: /*#__PURE__*/ _jsx(Tooltip, {
                enterDelay: 500,
                enterNextDelay: 200,
                title: title,
                placement: fullscreen ? 'bottom-end' : 'top-end',
                children: /*#__PURE__*/ _jsx(Button, {
                    color: "primary",
                    style: buttonStyle,
                    variant: hideUnselectable ? 'outlined' : 'contained',
                    startIcon: hideUnselectable ? /*#__PURE__*/ _jsx(HideIcon, {}) : /*#__PURE__*/ _jsx(ShowIcon, {}),
                    "data-selenium": "sitemap-unselectablesButton",
                    "aria-label": title,
                    className: fullscreen ? classes.unselectablesButtonFullscreen : classes.unselectablesButton,
                    onClick: ()=>{
                        dispatch({
                            type: 'setHideUnselectable',
                            hideUnselectable: !hideUnselectable
                        });
                    },
                    children: belowMd ? /*#__PURE__*/ _jsx(UnselectableIcon, {
                        style: {
                            fontSize: '20px'
                        }
                    }) : 'Unselectable'
                })
            })
        });
    };
    /**
     Helper Functions - Selection Summary
  */ const getSelectedItemFeatureKey = (item)=>{
        if (!selectionActive) {
            return null;
        }
        return Object.keys(featureData[selectionActive]).find((key)=>Object.keys(featureData[selectionActive][key]).includes(item)) || null;
    };
    const getSelectedItemIcon = (item)=>{
        if (!selectionActive) {
            return null;
        }
        const featureKey = getSelectedItemFeatureKey(item);
        if (!featureKey) {
            return null;
        }
        return FEATURES[featureKey].iconSvg || null;
    };
    const getSelectedItemDescription = (item)=>{
        if (!selectionActive) {
            return null;
        }
        const featureKey = getSelectedItemFeatureKey(item);
        if (!featureKey) {
            return null;
        }
        switch(selectionActive){
            case FEATURE_TYPES.SITES.KEY:
                return featureData[selectionActive][featureKey][item].description;
            case FEATURE_TYPES.STATES.KEY:
            case FEATURE_TYPES.DOMAINS.KEY:
                return featureData[selectionActive][featureKey][item].name;
            default:
                return null;
        }
    };
    /**
     Render - Selection Summary
  */ const renderSelectionSummary = ()=>{
        if (!selectionActive) {
            return null;
        }
        const unit = FEATURE_TYPES[selectionActive].unit || '';
        const units = FEATURE_TYPES[selectionActive].units || '';
        const plural = selection.size !== 1;
        const title = `${selection.size ? selection.size.toString() : 'No'} ${plural ? units : unit} selected`;
        let icon = /*#__PURE__*/ _jsx(NoneSelectedIcon, {});
        let color = 'default';
        // eslint-disable-next-line no-undef-init
        let backgroundColor = undefined;
        if (selection.size) {
            if (selectionValid) {
                icon = /*#__PURE__*/ _jsx(DoneIcon, {});
                color = 'secondary';
                backgroundColor = Theme.palette.secondary.main;
            } else {
                icon = /*#__PURE__*/ _jsx(ErrorIcon, {});
            }
        }
        let limit = null;
        if (Number.isFinite(selectionLimit)) {
            limit = `${selectionLimit} required`;
        }
        if (Array.isArray(selectionLimit)) {
            if (selectionLimit[0] === 1) {
                limit = `select up to ${selectionLimit[1]}`;
            } else {
                limit = `min ${selectionLimit[0]}; max ${selectionLimit[1]}`;
            }
        }
        const summaryContainerStyle = {};
        if (view === VIEWS.MAP) {
            summaryContainerStyle.left = '108px';
        }
        const chipClassName = !selection.size || selectionValid ? classes.selectionChip : `${classes.selectionChip} ${classes.selectionChipError}`;
        const otherChipStyles = {};
        if (backgroundColor) {
            otherChipStyles.backgroundColor = backgroundColor;
        }
        const summaryValidClass = selection.size && selectionValid ? classes.selectionSummaryValid : classes.selectionSummaryInvalid;
        const summaryClass = `${classes.selectionSummary} ${summaryValidClass}`;
        let maxHeight = 72 * 3;
        if (contentDivRef && contentDivRef.current) {
            maxHeight = Math.max((contentDivRef.current.clientHeight || 0) - 72 * 2, 72 * 3);
            maxHeight -= maxHeight % 72;
        }
        maxHeight = Math.min(maxHeight, selection.size * 72);
        const summaryStyle = {
            maxHeight: `${maxHeight + 1}px`
        };
        return /*#__PURE__*/ _jsxs("div", {
            className: classes.selectionSummaryContainer,
            style: summaryContainerStyle,
            children: [
                /*#__PURE__*/ _jsx(Zoom, {
                    in: showSummary,
                    mountOnEnter: true,
                    unmountOnExit: true,
                    children: /*#__PURE__*/ _jsx("div", {
                        className: summaryClass,
                        style: summaryStyle,
                        children: /*#__PURE__*/ _jsx(List, {
                            dense: true,
                            children: [
                                ...selection
                            ].sort().map((selectedItem)=>{
                                const src = getSelectedItemIcon(selectedItem);
                                const remove = `Remove ${selectedItem} from selection`;
                                return /*#__PURE__*/ _jsxs(ListItem, {
                                    children: [
                                        !src ? null : /*#__PURE__*/ _jsx(ListItemIcon, {
                                            children: /*#__PURE__*/ _jsx("img", {
                                                alt: selectedItem,
                                                src: src,
                                                className: classes.summaryFeatureIcon
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(ListItemText, {
                                            primary: selectedItem,
                                            secondary: getSelectedItemDescription(selectedItem)
                                        }),
                                        /*#__PURE__*/ _jsx(ListItemSecondaryAction, {
                                            children: /*#__PURE__*/ _jsx(Tooltip, {
                                                title: remove,
                                                enterDelay: 500,
                                                enterNextDelay: 200,
                                                placement: "right",
                                                children: /*#__PURE__*/ _jsx(IconButton, {
                                                    edge: "end",
                                                    "aria-label": remove,
                                                    onClick: ()=>dispatch({
                                                            type: 'toggleItemSelected',
                                                            item: selectedItem
                                                        }),
                                                    size: "large",
                                                    children: /*#__PURE__*/ _jsx(DeleteIcon, {})
                                                })
                                            })
                                        })
                                    ]
                                }, selectedItem);
                            })
                        })
                    })
                }),
                /*#__PURE__*/ _jsx(Chip, {
                    icon: icon,
                    color: color,
                    label: limit ? `${title} (${limit})` : title,
                    "aria-label": "Current selection status",
                    className: chipClassName,
                    style: otherChipStyles,
                    onClick: ()=>dispatch({
                            type: 'toggleSelectionSummary',
                            showSummary: !showSummary
                        }),
                    deleteIcon: /*#__PURE__*/ _jsx(Tooltip, {
                        enterDelay: 500,
                        enterNextDelay: 200,
                        title: "Deselect all",
                        children: /*#__PURE__*/ _jsx(CancelIcon, {})
                    }),
                    onDelete: selection.size ? ()=>dispatch({
                            type: 'updateSelectionSet',
                            selection: new Set()
                        }) : ()=>{}
                })
            ]
        });
    };
    /**
     Render - Vertical resize Elements
  */ const renderVerticalResizeButton = ()=>{
        if (fullscreen || view === VIEWS.TABLE && tableFullHeight) {
            return null;
        }
        return /*#__PURE__*/ _jsx(Tooltip, {
            placement: "left",
            enterDelay: 500,
            enterNextDelay: 200,
            title: `Resize ${view === VIEWS.TABLE ? 'table' : 'map'} vertically`,
            children: /*#__PURE__*/ _jsx(IconButton, {
                draggable: true,
                type: "button",
                ref: resizeButtonRef,
                className: classes.resizeButton,
                onDragStart: resizeVerticallyDragStart,
                onDrag: resizeVerticallyDrag,
                onDragEnd: resizeVerticallyDragEnd,
                size: "large",
                children: /*#__PURE__*/ _jsx(VertResizeIcon, {
                    fontSize: "small"
                })
            })
        });
    };
    /**
     Render - Single Feature Option
  */ const renderFeatureOption = (key)=>{
        if (!FEATURES[key]) {
            return null;
        }
        const feature = FEATURES[key];
        const { name: featureName, iconSvg, featureShape, style: featureStyle = {}, description, descriptionFromParentDataFeatureKey, parentDataFeatureKey, dataSource } = feature;
        // Special case: do not include any features with a dataSource of MANUAL_LOCATIONS if
        // manualLocationData is not also defined
        if (dataSource === FEATURE_DATA_SOURCES.MANUAL_LOCATIONS && !manualLocationData) {
            return null;
        }
        const handleChange = (event)=>{
            dispatch({
                type: 'setLegendFeatureOptionVisibility',
                feature: key,
                visible: event.target.checked
            });
        };
        let icon = null;
        if (iconSvg) {
            icon = /*#__PURE__*/ _jsx("img", {
                alt: featureName,
                src: iconSvg,
                className: classes.featureIcon
            });
        } else if (featureShape === 'Circle') {
            const circleProps = {
                cx: 14,
                cy: 14,
                r: 8,
                style: {
                    fill: featureStyle.color ? `${featureStyle.color}88` : 'none',
                    stroke: featureStyle.color || null,
                    strokeWidth: 3
                }
            };
            icon = /*#__PURE__*/ _jsx("svg", {
                width: "28",
                height: "28",
                className: classes.featureIcon,
                children: /*#__PURE__*/ _jsx("circle", {
                    ...circleProps
                })
            });
        } else if (featureShape === 'Polyline') {
            const polylineProps = {
                points: '1.5,21.5 15,18.5 13,9.5 26.5,6.5',
                style: {
                    fill: 'none',
                    stroke: featureStyle.color || null,
                    strokeWidth: 3,
                    strokeLinejoin: 'bevel'
                }
            };
            icon = /*#__PURE__*/ _jsx("svg", {
                width: "28",
                height: "28",
                className: classes.featureIcon,
                children: /*#__PURE__*/ _jsx("polyline", {
                    ...polylineProps
                })
            });
        } else if (featureShape === 'Polygon') {
            const rectProps = {
                width: 25,
                height: 15,
                x: 1.5,
                y: 6.5,
                rx: 3,
                style: {
                    fill: featureStyle.color || null,
                    stroke: featureStyle.color || null,
                    strokeWidth: 2.5,
                    fillOpacity: 0.2,
                    strokeOpacity: 0.85,
                    strokeLinecap: 'round',
                    strokeDasharray: featureStyle.dashArray || null
                }
            };
            icon = /*#__PURE__*/ _jsx("svg", {
                width: "28",
                height: "28",
                className: classes.featureIcon,
                children: /*#__PURE__*/ _jsx("rect", {
                    ...rectProps
                })
            });
        }
        let allChildren = [];
        let visibleChildren = [];
        let indeterminate = false;
        let collapsed = false;
        let label = null;
        let tooltip = null;
        if (description) {
            tooltip = description;
        }
        if (descriptionFromParentDataFeatureKey && parentDataFeatureKey && FEATURES[parentDataFeatureKey]) {
            tooltip = FEATURES[parentDataFeatureKey].description || null;
        }
        if (feature.type === FEATURE_TYPES.GROUP.KEY) {
            collapsed = state.filters.features.collapsed.has(key);
            const collapseTitle = `${collapsed ? 'Expand' : 'Collapse'} ${feature.name}`;
            allChildren = Object.keys(FEATURES).filter((f)=>FEATURES[f].parent === key);
            allChildren.sort((a, b)=>{
                const { type: aType, name: aName } = FEATURES[a];
                const { type: bType, name: bName } = FEATURES[b];
                if (aType !== bType && (aType === FEATURE_TYPES.GROUP.KEY || bType === FEATURE_TYPES.GROUP.KEY)) {
                    return bType === FEATURE_TYPES.GROUP.KEY ? -1 : 1;
                }
                return aName < bName ? -1 : 1;
            });
            visibleChildren = allChildren.filter((f)=>state.filters.features.visible[f]);
            indeterminate = visibleChildren.length > 0 && visibleChildren.length < allChildren.length;
            label = /*#__PURE__*/ _jsxs("div", {
                className: classes.legendOptionLabel,
                style: {
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        style: {
                            fontWeight: 500
                        },
                        children: feature.name
                    }),
                    /*#__PURE__*/ _jsx(Tooltip, {
                        title: collapseTitle,
                        enterDelay: 500,
                        enterNextDelay: 200,
                        children: /*#__PURE__*/ _jsx(IconButton, {
                            size: "small",
                            "aria-label": collapseTitle,
                            style: {
                                margin: Theme.spacing(0, -2, 0, 1)
                            },
                            onClick: (event)=>{
                                event.preventDefault();
                                // We use setTimeout here so the icon doesn't change before the click event bubbles.
                                // Without it the target of the click event is an SVG that no longer exists in the
                                // DOM tree (thus not contained in the features container, thus seen as a click
                                // outside that will close the features container, when we know it's not).
                                window.setTimeout(()=>{
                                    dispatch({
                                        type: `setLegendFeatureOption${collapsed ? 'Expanded' : 'Collapsed'}`,
                                        feature: key
                                    });
                                }, 0);
                            },
                            children: collapsed ? /*#__PURE__*/ _jsx(LeftArrowIcon, {
                                fontSize: "inherit"
                            }) : /*#__PURE__*/ _jsx(DownArrowIcon, {
                                fontSize: "inherit"
                            })
                        })
                    })
                ]
            });
        } else {
            label = /*#__PURE__*/ _jsxs("div", {
                className: classes.legendOptionLabel,
                children: [
                    icon,
                    /*#__PURE__*/ _jsx("span", {
                        children: feature.name
                    })
                ]
            });
        }
        const formControl = /*#__PURE__*/ _jsx(FormControlLabel, {
            label: label,
            "aria-label": tooltip,
            className: classes.legendOptionFormControlLabel,
            control: /*#__PURE__*/ _jsx(Checkbox, {
                checked: state.filters.features.visible[key],
                onChange: handleChange,
                color: "primary",
                indeterminate: indeterminate
            })
        }, key);
        return /*#__PURE__*/ _jsxs("div", {
            style: {
                width: '100%'
            },
            children: [
                tooltip ? /*#__PURE__*/ _jsx(Tooltip, {
                    title: tooltip,
                    enterDelay: 500,
                    enterNextDelay: 200,
                    placement: "bottom-start",
                    children: formControl
                }) : formControl,
                !allChildren.length ? null : /*#__PURE__*/ _jsx("div", {
                    style: {
                        marginLeft: Theme.spacing(3),
                        display: collapsed ? 'none' : 'block'
                    },
                    children: allChildren.filter((f)=>state.filters.features.available[f]).map(renderFeatureOption)
                })
            ]
        }, key);
    };
    /**
     Render - Single Overlay Legend
  */ const renderOverlayLegend = (legend)=>{
        const renderItem = (legendKey)=>{
            const { name: itemName, color: itemColor, description: itemDescription } = legend[legendKey];
            const swatch = /*#__PURE__*/ _jsx("div", {
                className: classes.overlayLegendSwatch,
                style: {
                    backgroundColor: itemColor
                }
            });
            const itemLabel = /*#__PURE__*/ _jsxs("div", {
                className: classes.overlayLegendItem,
                children: [
                    swatch,
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "caption",
                        children: itemName
                    })
                ]
            }, legendKey);
            return itemDescription ? /*#__PURE__*/ _jsx(Tooltip, {
                title: /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: classes.overlayLegendItemTooltipTitle,
                            children: [
                                swatch,
                                /*#__PURE__*/ _jsx("b", {
                                    children: itemName
                                })
                            ]
                        }),
                        itemDescription
                    ]
                }),
                enterDelay: 500,
                enterNextDelay: 200,
                placement: "left",
                children: itemLabel
            }, legendKey) : itemLabel;
        };
        if (!Object.keys(legend).some((legendKey)=>legend[legendKey].category)) {
            return /*#__PURE__*/ _jsx("div", {
                className: classes.overlayLegendContainer,
                children: Object.keys(legend).map(renderItem)
            });
        }
        const otherCategory = 'Other';
        const categories = Object.keys(legend).reduce((acc, cur)=>{
            acc.add(legend[cur].category || otherCategory);
            return acc;
        }, new Set());
        return /*#__PURE__*/ _jsx("div", {
            className: classes.overlayLegendContainer,
            children: Array.from(categories).map((category, idx)=>/*#__PURE__*/ _jsxs(React.Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                            className: classes.overlayLegendCategory,
                            style: {
                                marginTop: idx ? '8px' : '0px'
                            },
                            children: /*#__PURE__*/ _jsx(Typography, {
                                variant: "caption",
                                children: category
                            })
                        }),
                        Object.keys(legend).filter((legendKey)=>legend[legendKey].category === category || !legend[legendKey].category && category === otherCategory).map(renderItem)
                    ]
                }, category))
        });
    };
    /**
     Render - Single Overlay Option
  */ const renderOverlayOption = (key)=>{
        const { title, description: tooltip, legend } = OVERLAYS[key];
        const handleChange = (event)=>{
            dispatch({
                type: 'setMapOverlayVisibility',
                overlay: key,
                visible: event.target.checked
            });
        };
        let collapsed = true;
        let label = null;
        if (legend) {
            collapsed = !state.filters.overlays.expanded.has(key);
            const collapseTitle = `${collapsed ? 'Expand' : 'Collapse'} ${title} Legend`;
            label = /*#__PURE__*/ _jsxs("div", {
                className: classes.legendOptionLabel,
                style: {
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        style: {
                            fontWeight: 500
                        },
                        children: title
                    }),
                    /*#__PURE__*/ _jsx(Tooltip, {
                        title: collapseTitle,
                        enterDelay: 500,
                        enterNextDelay: 200,
                        placement: "top",
                        children: /*#__PURE__*/ _jsx(IconButton, {
                            size: "small",
                            "aria-label": collapseTitle,
                            style: {
                                margin: Theme.spacing(0, -2, 0, 1)
                            },
                            onClick: (event)=>{
                                event.preventDefault();
                                // We use setTimeout here so the icon doesn't change before the click event bubbles.
                                // Without it the target of the click event is an SVG that no longer exists in the
                                // DOM tree (thus not contained in the features container, thus seen as a click
                                // outside that will close the features container, when we know it's not).
                                window.setTimeout(()=>{
                                    dispatch({
                                        type: `setLegendOverlayOption${collapsed ? 'Expanded' : 'Collapsed'}`,
                                        overlay: key
                                    });
                                }, 0);
                            },
                            children: collapsed ? /*#__PURE__*/ _jsx(LeftArrowIcon, {
                                fontSize: "inherit"
                            }) : /*#__PURE__*/ _jsx(DownArrowIcon, {
                                fontSize: "inherit"
                            })
                        })
                    })
                ]
            });
        } else {
            label = /*#__PURE__*/ _jsx("div", {
                className: classes.legendOptionLabel,
                children: /*#__PURE__*/ _jsx("span", {
                    children: title
                })
            });
        }
        const formControl = /*#__PURE__*/ _jsx(FormControlLabel, {
            label: label,
            "aria-label": tooltip,
            className: classes.legendOptionFormControlLabel,
            control: /*#__PURE__*/ _jsx(Checkbox, {
                checked: state.map.overlays.has(key),
                onChange: handleChange,
                color: "primary"
            })
        }, key);
        return /*#__PURE__*/ _jsxs("div", {
            style: {
                width: '100%'
            },
            children: [
                tooltip ? /*#__PURE__*/ _jsx(Tooltip, {
                    title: tooltip,
                    enterDelay: 500,
                    enterNextDelay: 200,
                    placement: "bottom-start",
                    children: formControl
                }) : formControl,
                collapsed || !legend ? null : renderOverlayLegend(legend)
            ]
        }, key);
    };
    /**
     Render - Legend - NEON Observatory Features
  */ const renderLegendNEONObservatoryFeatures = ()=>/*#__PURE__*/ _jsxs("div", {
            className: classes.legendSection,
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: classes.legendSectionTitleContainer,
                    children: /*#__PURE__*/ _jsx(Typography, {
                        variant: "h6",
                        className: classes.legendSectionTitle,
                        children: "NEON Observatory Features"
                    })
                }),
                Object.keys(FEATURES).filter((f)=>state.filters.features.available[f] && !FEATURES[f].parent).filter((f)=>!FEATURES[f].generalLegendGroup).map(renderFeatureOption)
            ]
        });
    /**
     Render - Legend - Overlays
  */ const renderLegendOverlays = ()=>/*#__PURE__*/ _jsx(_Fragment, {
            children: Object.keys(OVERLAY_GROUPS).map((groupKey)=>{
                const { title, description } = OVERLAY_GROUPS[groupKey];
                return /*#__PURE__*/ _jsxs("div", {
                    className: classes.legendSection,
                    children: [
                        /*#__PURE__*/ _jsx("hr", {
                            className: classes.legendDivider
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: classes.legendSectionTitleContainer,
                            children: [
                                /*#__PURE__*/ _jsx(Typography, {
                                    variant: "h6",
                                    className: classes.legendSectionTitle,
                                    children: title
                                }),
                                !description ? null : /*#__PURE__*/ _jsx(Tooltip, {
                                    title: description,
                                    children: /*#__PURE__*/ _jsx(IconButton, {
                                        size: "small",
                                        style: {
                                            margin: Theme.spacing(0, -0.75, 0, 1)
                                        },
                                        "aria-label": `${title} layer group description`,
                                        children: /*#__PURE__*/ _jsx(HelpIcon, {
                                            style: {
                                                fontSize: '1rem'
                                            }
                                        })
                                    })
                                })
                            ]
                        }),
                        Object.keys(OVERLAYS).filter((o)=>OVERLAYS[o].group === groupKey).map(renderOverlayOption)
                    ]
                }, groupKey);
            })
        });
    /**
     Render - Legend - General Features
  */ const renderLegendGeneralFeatures = ()=>/*#__PURE__*/ _jsxs("div", {
            className: classes.legendSection,
            children: [
                /*#__PURE__*/ _jsx("hr", {
                    className: classes.legendDivider
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: classes.legendSectionTitleContainer,
                    children: /*#__PURE__*/ _jsx(Typography, {
                        variant: "h6",
                        className: classes.legendSectionTitle,
                        children: "General Features"
                    })
                }),
                Object.keys(FEATURES).filter((f)=>state.filters.features.available[f] && !FEATURES[f].parent).filter((f)=>FEATURES[f].generalLegendGroup).map(renderFeatureOption)
            ]
        });
    /**
     Render - Full Component
  */ let legendContainerClassName = classes.legendContainer;
    let viewLegendButtonsContainerClassName = classes.viewLegendButtonsContainer;
    if (fullscreen) {
        legendContainerClassName = `${classes.legendContainer} ${classes.legendContainerFullscreen}`;
        viewLegendButtonsContainerClassName = `${classes.viewLegendButtonsContainer} ${classes.viewLegendButtonsContainerFullscreen}`;
    }
    return /*#__PURE__*/ _jsxs("div", {
        ...containerProps,
        "aria-describedby": progressId,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                ref: contentDivRef,
                ...contentDivProps,
                children: [
                    view === VIEWS.MAP || view === VIEWS.SPLIT ? /*#__PURE__*/ _jsx(SiteMapLeaflet, {}) : null,
                    view === VIEWS.TABLE ? /*#__PURE__*/ _jsx(SiteMapTable, {}) : null,
                    renderVerticalResizeButton(),
                    /*#__PURE__*/ _jsxs("div", {
                        ref: legendRef,
                        className: legendContainerClassName,
                        style: {
                            display: state.filters.legendOpen ? 'flex' : 'none'
                        },
                        children: [
                            renderLegendNEONObservatoryFeatures(),
                            renderLegendOverlays(),
                            renderLegendGeneralFeatures()
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: viewLegendButtonsContainerClassName,
                        children: [
                            renderUnselectablesButton(),
                            renderMapTableToggleButtonGroup(),
                            renderLegendButton()
                        ]
                    }),
                    renderSelectionSummary()
                ]
            }),
            fullscreen ? null : /*#__PURE__*/ _jsx("div", {
                ref: resizeBorderRef,
                className: classes.resizeBorder
            }),
            view === VIEWS.SPLIT ? /*#__PURE__*/ _jsx(SiteMapTable, {}) : null
        ]
    });
};
SiteMapContainer.propTypes = {
    unusableVerticalSpace: PropTypes.number,
    mapUniqueId: PropTypes.number
};
export default SiteMapContainer;
