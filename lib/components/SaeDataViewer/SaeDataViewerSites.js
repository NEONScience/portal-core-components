import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import NeonContext from '../NeonContext/NeonContext';
import MapSelectionButton from '../MapSelectionButton/MapSelectionButton';
import SaeDataViewerContext from './SaeDataViewerContext';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import iconCoreTerrestrialSVG from '../SiteMap/svg/icon-site-core-terrestrial.svg';
import iconCoreAquaticSVG from '../SiteMap/svg/icon-site-core-aquatic.svg';
import iconGradientTerrestrialSVG from '../SiteMap/svg/icon-site-gradient-terrestrial.svg';
import iconGradientAquaticSVG from '../SiteMap/svg/icon-site-gradient-aquatic.svg';
const MAX_NUM_SITES_SELECTABLE = 1;
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
const useStyles = makeStyles()((theme)=>({
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
            color: theme.palette.grey[500]
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
            marginBottom: theme.spacing(1.5)
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
            marginBottom: theme.spacing(0.5)
        },
        siteDetail: {
            marginBottom: theme.spacing(1),
            marginRight: theme.spacing(4)
        },
        noneIcon: {
            color: theme.palette.grey[400],
            marginRight: theme.spacing(0.5),
            fontSize: '1rem'
        },
        noneLabel: {
            color: theme.palette.grey[400]
        },
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
        }
    }));
const buildSelectStyles = (theme)=>({
        input: (base)=>({
                ...base,
                color: theme.palette.text.primary,
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
                color: theme.palette.primary.main
            })
    });
const InputComponent = /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx("div", {
        ref: ref,
        ...props
    }));
const ValueContainer = (props)=>{
    const { classes } = useStyles();
    const { children } = props;
    return /*#__PURE__*/ _jsx("div", {
        className: classes.valueContainer,
        children: children
    });
};
const Menu = (props)=>{
    const { classes } = useStyles();
    const { innerProps, children } = props;
    return /*#__PURE__*/ _jsx(Paper, {
        square: true,
        className: classes.paper,
        ...innerProps,
        children: children
    });
};
const SitesControl = (props)=>{
    const { children, innerProps, innerRef } = props;
    return /*#__PURE__*/ _jsx(TextField, {
        fullWidth: true,
        label: "Select Site",
        variant: "outlined",
        slotProps: {
            input: {
                inputComponent: InputComponent,
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
            }
        }
    });
};
const siteOptionDefaultProps = {
    isDisabled: false,
    isSelected: false,
    isFocused: false
};
const SiteOption = (inProps)=>{
    const props = resolveProps(siteOptionDefaultProps, inProps);
    const { classes, theme } = useStyles();
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
                    width: theme.spacing(3),
                    height: theme.spacing(3),
                    style: {
                        marginRight: theme.spacing(1.5),
                        marginTop: theme.spacing(0.5),
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
    // Note: wrapping each of these MenuItem elements in a MenuList
    // is a workaround for no longer being able to utilize the MenuItem
    // component as a standalone component outside of a Menu or MenuList.
    // The MenuItem brings along desired characteristics for selection
    // interactions.
    return /*#__PURE__*/ _jsx(MenuList, {
        style: {
            padding: 0,
            margin: 0
        },
        children: /*#__PURE__*/ _jsx(MenuItem, {
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
        }, siteCode)
    });
};
const SelectedSite = (props)=>{
    const { classes, theme } = useStyles();
    const { site: siteCode } = props;
    const [{ data: neonContextData }] = NeonContext.useNeonContextState();
    const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
    let selectedSiteContent = /*#__PURE__*/ _jsx("div", {
        children: /*#__PURE__*/ _jsx(Typography, {
            variant: "body1",
            gutterBottom: true,
            children: `${siteCode} (loading site details…)`
        })
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
            width: theme.spacing(4),
            height: theme.spacing(4),
            style: {
                marginRight: theme.spacing(1),
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
                        })
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
                                                            marginRight: theme.spacing(0.5)
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
    return /*#__PURE__*/ _jsx(Card, {
        variant: "outlined",
        className: classes.siteCard,
        children: selectedSiteContent
    }, siteCode);
};
const SitesSelectComponents = {
    Control: SitesControl,
    Option: SiteOption,
    Menu,
    ValueContainer,
    Placeholder: ()=>null,
    MultiValue: ()=>null,
    IndicatorsContainer: ()=>null
};
const SitesSelect = ()=>{
    const { theme } = useStyles();
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
    const [{ data: neonContextData }] = NeonContext.useNeonContextState();
    const { states: allStates, sites: allSites, domains: allDomains } = neonContextData;
    // Build list of selectable sites grouped by US state
    const selectableSiteCodes = state.controlsState.sites;
    let selectableSitesCount = 0;
    const selectableGroups = Object.keys(allStates).map((stateCode)=>({
            label: allStates[stateCode].name,
            stateCode,
            options: []
        }));
    const allOptions = [];
    state.controlsState.sites.filter((siteCode)=>selectableSiteCodes.includes(siteCode)).forEach((siteCode)=>{
        const groupIdx = selectableGroups.findIndex((group)=>allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode);
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
        const option = {
            value: siteCode,
            domainName: domain.name || null,
            ...allSites[siteCode],
            search
        };
        selectableGroups[groupIdx].options.push(option);
        allOptions.push(option);
        selectableSitesCount += 1;
    });
    const selectedSiteOption = allOptions.find((option)=>option.siteCode.localeCompare(state.site) === 0);
    if (!selectableSitesCount) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return /*#__PURE__*/ _jsx(_Fragment, {});
    }
    return /*#__PURE__*/ _jsx(NoSsr, {
        children: /*#__PURE__*/ _jsx("div", {
            style: {
                flex: 1
            },
            children: /*#__PURE__*/ _jsx(Select, {
                isSearchable: true,
                isClearable: false,
                styles: buildSelectStyles(theme),
                "aria-label": "Select Site",
                "data-gtm": "sae-data-viewer.select-site",
                options: selectableGroups,
                components: SitesSelectComponents,
                value: selectedSiteOption,
                controlShouldRenderValue: false,
                filterOption: (option, searchText)=>{
                    if (option.data) {
                        return option.data.search.includes(searchText.toLowerCase());
                    }
                    return false;
                },
                onChange: (value, change)=>{
                    if (change.action !== 'select-option') {
                        return;
                    }
                    if (dispatch && value) {
                        const singleValue = value;
                        if (singleValue) {
                            dispatch({
                                type: 'setSelectedSite',
                                site: singleValue.siteCode
                            });
                        }
                    }
                }
            })
        })
    });
};
const SaeDataViewerSites = ()=>{
    const { classes, theme } = useStyles();
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
    const [{ data: neonContextData }] = NeonContext.useNeonContextState();
    const { sites: allSites } = neonContextData;
    if (!state.site || !Object.keys(allSites).length) {
        return /*#__PURE__*/ _jsx(Skeleton, {
            variant: "rectangular",
            width: "100%",
            height: 56
        });
    }
    const selectedItems = [
        state.site
    ];
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
                            MAX_NUM_SITES_SELECTABLE
                        ],
                        selectedItems: selectedItems,
                        validItems: state.controlsState.sites,
                        buttonProps: {
                            style: {
                                size: 'large',
                                marginLeft: theme.spacing(1.5)
                            }
                        },
                        onSave: (newSites)=>{
                            if (dispatch && newSites.size > 0) {
                                dispatch({
                                    type: 'setSelectedSite',
                                    site: newSites.values().next().value
                                });
                            }
                        }
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: classes.sitesContainer,
                children: selectedItems.map((siteCode)=>/*#__PURE__*/ _jsx(SelectedSite, {
                        site: siteCode
                    }, siteCode))
            })
        ]
    });
};
export default SaeDataViewerSites;
