import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { makeStyles, createStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { exists } from '../../util/typeUtil';
const useStyles = (open)=>makeStyles((theme)=>// eslint-disable-next-line implicit-arrow-linebreak
        createStyles({
            leafletControlContainer: {
                zIndex: 801,
                boxShadow: 'unset',
                margin: '0px !important',
                left: '8px',
                top: '8px',
                fontFamily: theme.typography.fontFamily
            },
            controlContainer: {
                backgroundColor: '#ffffff',
                cursor: 'default',
                borderRadius: '2px',
                display: 'flex',
                zIndex: 802,
                border: open ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.colors.LIGHT_BLUE[500]}`
            },
            controlIconContainer: {
                width: '36px !important',
                height: '36px !important'
            },
            controlIcon: {
                verticalAlign: 'center'
            },
            controls: {
                padding: theme.spacing(2),
                overflowY: 'auto'
            },
            formGroupControl: {
                marginTop: '4px',
                marginBottom: '0px'
            },
            controlGroupDivider: {
                margin: '10px 0px'
            },
            groupTitle: {
                fontWeight: 600
            }
        }));
var OverlayGroupType = /*#__PURE__*/ function(OverlayGroupType) {
    OverlayGroupType["EXCLUSIVE"] = "EXCLUSIVE";
    OverlayGroupType["NON_EXCLUSIVE"] = "NON_EXCLUSIVE";
    return OverlayGroupType;
}(OverlayGroupType || {});
const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right'
};
const getControlClassFromPosition = (position)=>{
    if (!exists(position)) {
        return POSITION_CLASSES.topright;
    }
    return POSITION_CLASSES[position];
};
const LeafletGroupedLayerControl = (props)=>{
    const { position, baseLayers, checkedBaseLayer, exclusiveGroups, overlays, renderToLeafletControlContainer, onBaseLayerChange, onOverlayChange } = props;
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const classes = useStyles(open)(theme);
    const divRef = useRef(null);
    const map = useMap();
    const isPortalMode = renderToLeafletControlContainer === true;
    const controlPositionClass = getControlClassFromPosition(position);
    const containerNode = map.getContainer();
    const portalNodes = containerNode.getElementsByClassName(controlPositionClass);
    const hasPortalNode = exists(portalNodes) && portalNodes.length > 0 && exists(portalNodes[0]);
    const handleMainDivMouseEnter = ()=>{
        if (!open) {
            setOpen(true);
        }
    };
    const handleMainDivMouseLeave = ()=>{
        setOpen(false);
    };
    const handleBaseLayerChange = (event)=>{
        if (onBaseLayerChange) {
            onBaseLayerChange(event.target.value);
        }
    };
    const handleOverlayChanged = (eventOverlay, isSelected, eventGroup, groupType)=>{
        const isExclusive = groupType === "EXCLUSIVE";
        const newOverlays = (overlays || []).map((overlay)=>{
            const groupMatches = overlay.groupTitle === eventGroup;
            if (!groupMatches) {
                return overlay;
            }
            const nameMatchesSelected = overlay.name === eventOverlay.name;
            if (isExclusive) {
                // When radio selection, apply checked to matched name,
                // not checked to all others.
                return {
                    ...overlay,
                    checked: nameMatchesSelected
                };
            }
            if (nameMatchesSelected) {
                // When checkbox selection and on the selected
                // overlay, apply opposite of selected overlay checked state.
                return {
                    ...overlay,
                    checked: !isSelected
                };
            }
            // When checkbox selection and not on the selected
            // overlay, do not modify.
            return overlay;
        });
        if (onOverlayChange) {
            onOverlayChange(newOverlays);
        }
    };
    useEffect(()=>{
        if (!divRef.current) {
            return;
        }
        L.DomEvent.disableClickPropagation(divRef.current);
        L.DomEvent.disableScrollPropagation(divRef.current);
        const containerRect = map.getContainer().getBoundingClientRect();
        const divRect = divRef.current.getBoundingClientRect();
        const maxHeight = `${Math.floor((containerRect.bottom - divRect.y) * 0.95)}px`;
        divRef.current.style.maxHeight = maxHeight;
    }, [
        map,
        divRef
    ]);
    const renderBaseLayerGroup = ()=>/*#__PURE__*/ _jsxs("div", {
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    className: classes.groupTitle,
                    variant: "h6",
                    children: "Base Layers"
                }, "title-baselayer"),
                /*#__PURE__*/ _jsx(FormControl, {
                    fullWidth: true,
                    size: "small",
                    margin: "dense",
                    className: classes.formGroupControl,
                    children: /*#__PURE__*/ _jsx(RadioGroup, {
                        name: "baselayer",
                        value: checkedBaseLayer,
                        onChange: handleBaseLayerChange,
                        children: baseLayers.map((baseLayer)=>/*#__PURE__*/ _jsx(FormControlLabel, {
                                value: baseLayer.name,
                                control: /*#__PURE__*/ _jsx(Radio, {
                                    size: "small"
                                }),
                                label: baseLayer.title
                            }, `baselayer-${baseLayer.name}`))
                    })
                })
            ]
        }, "baselayer");
    const renderOverlayGroups = ()=>{
        if (!overlays || overlays.length <= 0) {
            return null;
        }
        const groups = overlays.reduce((groupAcc, overlay)=>{
            const groupKey = overlay.groupTitle;
            if (!groupAcc[groupKey]) {
                // eslint-disable-next-line no-param-reassign
                groupAcc[groupKey] = {
                    exclusive: exclusiveGroups && exclusiveGroups.includes(groupKey),
                    groupItems: []
                };
            }
            groupAcc[groupKey].groupItems.push(overlay);
            return groupAcc;
        }, {});
        const groupTitles = Array.from(new Set(overlays.map((o)=>o.groupTitle)));
        const renderedGroups = groupTitles.map((groupTitle)=>{
            const { groupItems, exclusive } = groups[groupTitle];
            const isExclusiveGroup = exclusive === true;
            const exclusiveParam = isExclusiveGroup ? "EXCLUSIVE" : "NON_EXCLUSIVE";
            let selectedOverlay;
            const groupElements = groupItems.map((overlay)=>{
                if (isExclusiveGroup && overlay.checked) {
                    selectedOverlay = overlay;
                }
                return /*#__PURE__*/ _jsx(FormControlLabel, {
                    value: isExclusiveGroup ? overlay.name : undefined,
                    label: overlay.title,
                    control: isExclusiveGroup ? /*#__PURE__*/ _jsx(Radio, {
                        size: "small"
                    }) : /*#__PURE__*/ _jsx(Checkbox, {
                        size: "small",
                        checked: overlay.checked,
                        onChange: ()=>{
                            handleOverlayChanged(overlay, overlay.checked, groupTitle, exclusiveParam);
                        }
                    })
                }, `${groupTitle}-${overlay.name}`);
            });
            const renderControlGroup = ()=>{
                if (!isExclusiveGroup) {
                    return /*#__PURE__*/ _jsx(FormGroup, {
                        className: classes.formGroupControl,
                        children: groupElements
                    });
                }
                return /*#__PURE__*/ _jsx(FormControl, {
                    fullWidth: true,
                    size: "small",
                    margin: "dense",
                    className: classes.formGroupControl,
                    children: /*#__PURE__*/ _jsx(RadioGroup, {
                        name: groupTitle,
                        value: selectedOverlay?.name || null,
                        onChange: (event)=>{
                            const nextSelected = groupItems.find((overlay)=>overlay.name === event.target.value);
                            if (nextSelected) {
                                let isSelected = false;
                                const currentSelectedName = selectedOverlay?.name || null;
                                if (currentSelectedName) {
                                    isSelected = currentSelectedName === nextSelected.name;
                                }
                                handleOverlayChanged(nextSelected, isSelected, groupTitle, exclusiveParam);
                            }
                        },
                        children: groupElements
                    })
                });
            };
            return /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        className: classes.groupTitle,
                        variant: "h6",
                        children: groupTitle
                    }),
                    renderControlGroup()
                ]
            }, groupTitle);
        });
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(Divider, {
                    className: classes.controlGroupDivider
                }),
                renderedGroups
            ]
        });
    };
    const renderContent = ()=>/*#__PURE__*/ _jsx("div", {
            className: `leaflet-control ${classes.leafletControlContainer}`,
            children: /*#__PURE__*/ _jsx("div", {
                ref: divRef,
                className: classes.controlContainer,
                onMouseEnter: handleMainDivMouseEnter,
                onMouseLeave: handleMainDivMouseLeave,
                children: !open ? // eslint-disable-next-line jsx-a11y/anchor-is-valid
                /*#__PURE__*/ _jsx(Link, {
                    className: classes.controlIconContainer,
                    component: "button",
                    children: /*#__PURE__*/ _jsx(FontAwesomeIcon, {
                        className: classes.controlIcon,
                        size: "2x",
                        icon: faLayerGroup
                    })
                }) : /*#__PURE__*/ _jsxs("div", {
                    className: classes.controls,
                    children: [
                        renderBaseLayerGroup(),
                        renderOverlayGroups()
                    ]
                })
            })
        });
    const render = ()=>{
        if (isPortalMode && hasPortalNode) {
            return /*#__PURE__*/ createPortal(renderContent(), portalNodes[0]);
        }
        return /*#__PURE__*/ _jsx("div", {
            className: controlPositionClass,
            children: renderContent()
        });
    };
    return render();
};
export default LeafletGroupedLayerControl;
