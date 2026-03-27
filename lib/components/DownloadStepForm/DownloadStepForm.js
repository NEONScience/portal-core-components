import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import FileIcon from '@mui/icons-material/Description';
import SelectAllIcon from '@mui/icons-material/DoneAll';
import SelectNoneIcon from '@mui/icons-material/Clear';
import SelectFilteredIcon from '@mui/icons-material/FilterList';
import ClearFiltersIcon from '@mui/icons-material/DeleteSweep';
import WarningIcon from '@mui/icons-material/Warning';
import ExploreIcon from '@mui/icons-material/Explore';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import moment from 'moment';
import MaterialTable, { MTableToolbar, MTableFilterRow } from 'material-table';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import CustomComponentFallback from '../Error/CustomComponentFallback';
import DataProductCitation from '../Citation/DataProductCitation';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import DataProductAvailability from '../DataProductAvailability/DataProductAvailability';
import InfoMessageCard from '../Card/InfoMessageCard';
import ExternalHost from '../ExternalHost/ExternalHost';
import ExternalHostProductSpecificLinks from '../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks';
import MaterialTableIcons from '../MaterialTableIcons/MaterialTableIcons';
import SiteChip from '../SiteChip/SiteChip';
import Theme, { COLORS } from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import ReleaseService from '../../service/ReleaseService';
import RouteService from '../../service/RouteService';
import { formatBytes, MAX_POST_BODY_SIZE } from '../../util/manifestUtil';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((theme)=>({
        copyButton: {
            marginLeft: theme.spacing(2)
        },
        fileTable: {
            position: 'relative',
            '& td': {
                whiteSpace: 'nowrap'
            },
            '& label + .MuiInput-formControl': {
                marginTop: '0px'
            }
        },
        formControlBold: {
            '& span': {
                fontWeight: 600
            }
        },
        loadingOverlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            top: 0,
            left: 0,
            zIndex: 10,
            paddingTop: theme.spacing(14),
            backgroundColor: 'rgba(255, 255, 255, 0.75)'
        },
        calloutIcon: {
            color: theme.palette.grey[300],
            marginRight: theme.spacing(2)
        },
        radio: {
            marginBottom: theme.spacing(1)
        },
        radioLabel: {
            marginTop: theme.spacing(1.5)
        },
        showColumnsLabel: {
            backgroundColor: theme.palette.grey[50],
            '& span': {
                color: '#000'
            }
        },
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        stepSummary: {
            marginBottom: theme.spacing(3)
        },
        stepSummaryHeader: {
            userSelect: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: theme.spacing(1)
        },
        stepSummaryContent: {
            marginLeft: theme.spacing(4.25)
        },
        summaryChip: {
            cursor: 'pointer',
            marginTop: theme.spacing(0.25),
            marginRight: theme.spacing(1),
            fontSize: '1rem',
            fontWeight: 600,
            height: theme.spacing(3),
            '& span': {
                padding: theme.spacing(0, 1)
            }
        },
        summaryText: {
            fontSize: '1.2rem'
        },
        summaryTextIncomplete: {
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: theme.palette.error.main
        },
        markdownWrapper: {
            '& p': {
                margin: 0
            }
        }
    }));
const textComponentDefaultProps = {
    content: null
};
const TextComponent = (inProps)=>{
    const props = resolveProps(textComponentDefaultProps, inProps);
    const { content } = props;
    return /*#__PURE__*/ _jsx(Typography, {
        variant: "body2",
        component: "p",
        children: content
    });
};
TextComponent.propTypes = {
    content: PropTypes.string
};
const MarkdownFallbackComponent = (props)=>/*#__PURE__*/ _jsx(CustomComponentFallback, {
        // eslint-disable-next-line react/no-unstable-nested-components
        FallbackComponent: ()=>/*#__PURE__*/ _jsx(TextComponent, {
                ...props
            })
    });
const dataUsageAndCitationPoliciesLink = /*#__PURE__*/ _jsx(Link, {
    target: "_blank",
    href: RouteService.getDataPoliciesPath(),
    "data-gtm": "download-data-dialog.policies-link",
    children: "Data Usage and Citation Policies"
});
const renderStepSummary = {
    sitesAndDateRange: (classes, state)=>{
        const { value: sites } = state.sites;
        const { value: dateRange } = state.dateRange;
        const sitesPlural = sites.length > 1 ? 's' : '';
        const getYearMonthMoment = (yearMonth)=>moment(`${yearMonth}-01`);
        const startDateRange = `${getYearMonthMoment(dateRange[0]).format('MMM YYYY')}`;
        const endDateRange = `${getYearMonthMoment(dateRange[1]).format('MMM YYYY')}`;
        const humanDateRange = `${startDateRange} - ${endDateRange}`;
        const siteChipLabel = `${sites.length} site${sitesPlural} — ${humanDateRange}`;
        return /*#__PURE__*/ _jsx(SiteChip, {
            size: "large",
            variant: "default",
            label: siteChipLabel
        });
    },
    documentation: (classes, state)=>{
        const { value: documentation } = state.documentation;
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            className: classes.summaryText,
            children: `${documentation.charAt(0).toUpperCase()}${documentation.substring(1)}`
        });
    },
    packageType: (classes, state)=>{
        const { value: packageType } = state.packageType;
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            className: classes.summaryText,
            children: `${packageType.charAt(0).toUpperCase()}${packageType.substring(1)}`
        });
    },
    provisionalData: (classes, state)=>{
        const { value: provisionalData } = state.provisionalData;
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            className: classes.summaryText,
            children: `${provisionalData.charAt(0).toUpperCase()}${provisionalData.substring(1)}`
        });
    },
    s3Files: (classes, state)=>{
        const { value: files, totalSize } = state.s3Files;
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            className: classes.summaryText,
            children: `${files.length} file${files.length === 1 ? '' : 's'} (${formatBytes(totalSize)} uncompressed)`
        });
    }
};
const downloadStepFormDefaultProps = {
    changeToStep: ()=>{},
    changeToNextUncompletedStep: ()=>{},
    renderDownloadButton: ()=>null
};
const DownloadStepForm = (inProps)=>{
    const props = resolveProps(downloadStepFormDefaultProps, inProps);
    const classes = useStyles(Theme);
    const { stepKey, changeToStep, changeToNextUncompletedStep, renderDownloadButton } = props;
    const [state, dispatch] = DownloadDataContext.useDownloadDataState();
    const { release } = state;
    const delineateAvaRelease = ReleaseService.determineDelineateAvaRelease(release.value);
    // Effect to keep focus on the file name search field if it was the last filter updated
    useEffect(()=>{
        if (state.s3Files.lastFilterChanged !== 'name') {
            return;
        }
        const mTable = document.querySelector('#s3Files-selection-table-container');
        if (!mTable) {
            return;
        }
        const nameSearch = mTable.querySelector('input[type="search"]');
        if (!nameSearch) {
            return;
        }
        nameSearch.focus();
    });
    const setState = (stateKey, newValue)=>dispatch({
            type: 'setValidatableValue',
            key: stateKey,
            value: newValue
        });
    const renderSitesAndDateRangeStep = ()=>{
        const { requiredSteps, provisionalData } = state;
        const hasProvisionalDataStep = requiredSteps.some((step)=>step.key === 'provisionalData');
        const excludeProvisionalData = hasProvisionalDataStep && provisionalData.value === 'exclude';
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                !excludeProvisionalData ? null : /*#__PURE__*/ _jsx(InfoMessageCard, {
                    title: "Provisional Data",
                    messageContent: /*#__PURE__*/ _jsx(Typography, {
                        variant: "body1",
                        children: "Provisional data are currently being excluded from the download package. To make those data available, include those data from within the Provisional Data step."
                    })
                }),
                /*#__PURE__*/ _jsx(DataProductAvailability, {
                    "data-selenium": "download-data-dialog.step-form.sites-and-date-range",
                    delineateRelease: delineateAvaRelease
                })
            ]
        });
    };
    const renderDocumentationStep = ()=>{
        const neonFaqLink = /*#__PURE__*/ _jsx(Link, {
            target: "_blank",
            href: RouteService.getFaqPath(),
            "data-gtm": "download-data-dialog.neon-faq-link",
            children: "NEON FAQ"
        });
        const knbLink = ExternalHost.renderExternalHostLink('https://eml.ecoinformatics.org', 'KNB', 'KNB', state.productData.productCode);
        const { value, validValues } = state.documentation;
        return /*#__PURE__*/ _jsxs(Grid, {
            container: true,
            spacing: 2,
            alignItems: "flex-start",
            "data-selenium": "download-data-dialog.step-form.documentation",
            children: [
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: /*#__PURE__*/ _jsx(FormControl, {
                        component: "fieldset",
                        children: /*#__PURE__*/ _jsxs(RadioGroup, {
                            "aria-label": "Documentation",
                            name: "documentation",
                            value: value || '',
                            onChange: (e)=>{
                                setState('documentation', e.target.value);
                                changeToNextUncompletedStep();
                            },
                            children: [
                                /*#__PURE__*/ _jsx(FormControlLabel, {
                                    className: classes.radio,
                                    value: validValues[0],
                                    control: /*#__PURE__*/ _jsx(Radio, {}),
                                    label: /*#__PURE__*/ _jsxs("div", {
                                        className: classes.radioLabel,
                                        children: [
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "h6",
                                                children: "Include"
                                            }),
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "body2",
                                                children: "Include relevant documents for this Data Product"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ _jsx(FormControlLabel, {
                                    className: classes.radio,
                                    value: validValues[1],
                                    control: /*#__PURE__*/ _jsx(Radio, {}),
                                    label: /*#__PURE__*/ _jsxs("div", {
                                        className: classes.radioLabel,
                                        children: [
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "h6",
                                                children: "Exclude"
                                            }),
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "body2",
                                                children: "Data only, no relevant documents for this Data Product"
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    })
                }),
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: /*#__PURE__*/ _jsx(Card, {
                        style: {
                            marginTop: Theme.spacing(1.5)
                        },
                        children: /*#__PURE__*/ _jsxs(CardContent, {
                            className: classes.startFlex,
                            children: [
                                /*#__PURE__*/ _jsx(InfoIcon, {
                                    fontSize: "large",
                                    className: classes.calloutIcon
                                }),
                                /*#__PURE__*/ _jsxs(Typography, {
                                    variant: "body1",
                                    children: [
                                        "EML files for this Data Product are included in all downloads. Learn more about EML files in the ",
                                        neonFaqLink,
                                        " and at ",
                                        knbLink,
                                        "."
                                    ]
                                })
                            ]
                        })
                    })
                })
            ]
        });
    };
    const renderProvisionalDataStep = ()=>{
        const neonDataRevisionReleaseLink = /*#__PURE__*/ _jsx(Link, {
            target: "_blank",
            href: RouteService.getDataRevisionsReleasePath(),
            "data-gtm": "download-data-dialog.neon-data-revisions-releases-link",
            children: "NEON Data Revisions and Releases"
        });
        const { value, validValues } = state.provisionalData;
        return /*#__PURE__*/ _jsxs(Grid, {
            container: true,
            spacing: 2,
            alignItems: "flex-start",
            "data-selenium": "download-data-dialog.step-form.provisional-data",
            children: [
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: /*#__PURE__*/ _jsx(FormControl, {
                        component: "fieldset",
                        children: /*#__PURE__*/ _jsxs(RadioGroup, {
                            "aria-label": "Provisional Data",
                            name: "provisional-data",
                            value: value || '',
                            onChange: (e)=>{
                                setState('provisionalData', e.target.value);
                                changeToNextUncompletedStep();
                            },
                            children: [
                                /*#__PURE__*/ _jsx(FormControlLabel, {
                                    className: classes.radio,
                                    value: validValues[0],
                                    control: /*#__PURE__*/ _jsx(Radio, {}),
                                    label: /*#__PURE__*/ _jsxs("div", {
                                        className: classes.radioLabel,
                                        children: [
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "h6",
                                                children: "Include"
                                            }),
                                            /*#__PURE__*/ _jsxs(Typography, {
                                                variant: "body2",
                                                children: [
                                                    "Include provisional data in this download package (",
                                                    /*#__PURE__*/ _jsx("b", {
                                                        children: "Warning:"
                                                    }),
                                                    " subject to change and not reproducible)"
                                                ]
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ _jsx(FormControlLabel, {
                                    className: classes.radio,
                                    value: validValues[1],
                                    control: /*#__PURE__*/ _jsx(Radio, {}),
                                    label: /*#__PURE__*/ _jsxs("div", {
                                        className: classes.radioLabel,
                                        children: [
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "h6",
                                                children: "Exclude"
                                            }),
                                            /*#__PURE__*/ _jsx(Typography, {
                                                variant: "body2",
                                                children: "Release data only, no provisional data included in this download package"
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    })
                }),
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: /*#__PURE__*/ _jsx(Card, {
                        style: {
                            marginTop: Theme.spacing(1.5)
                        },
                        children: /*#__PURE__*/ _jsxs(CardContent, {
                            className: classes.startFlex,
                            children: [
                                /*#__PURE__*/ _jsx(InfoIcon, {
                                    fontSize: "large",
                                    className: classes.calloutIcon
                                }),
                                /*#__PURE__*/ _jsxs(Typography, {
                                    variant: "body1",
                                    children: [
                                        "Learn more about data product revisions, releases and provisional data at ",
                                        neonDataRevisionReleaseLink,
                                        "."
                                    ]
                                })
                            ]
                        })
                    })
                })
            ]
        });
    };
    const renderS3FilesStep = ()=>{
        const { s3FileFetches, s3FileFetchProgress, requiredSteps, provisionalData } = state;
        const { value: selection, validValues, valueLookups, totalSize, estimatedPostSize, filters, filteredFileCount, visibleColumns, maxNumFilesSelected } = state.s3Files;
        const isLoading = Object.keys(s3FileFetches).some((key)=>[
                'awaitingFetchCall',
                'fetching'
            ].includes(s3FileFetches[key]));
        const hasProvisionalDataStep = requiredSteps.some((step)=>step.key === 'provisionalData');
        const excludeProvisionalData = hasProvisionalDataStep && provisionalData.value === 'exclude';
        let appliedValidValues = validValues;
        let areProvDataExcluded = false;
        if (excludeProvisionalData) {
            appliedValidValues = appliedValidValues.filter((value)=>{
                const includeValue = isStringNonEmpty(value.release) && !ReleaseService.isNonRelease(value.release);
                if (!includeValue) {
                    areProvDataExcluded = true;
                }
                return includeValue;
            });
        }
        const allowSelectAll = appliedValidValues.length <= maxNumFilesSelected;
        const allowSelectFiltered = filteredFileCount <= maxNumFilesSelected;
        const columns = [
            {
                title: 'Site',
                field: 'site',
                lookup: valueLookups.site,
                defaultFilter: filters.site || [],
                hidden: !visibleColumns.includes('site'),
                render: (row)=>row.site
            },
            {
                title: 'Date',
                field: 'yearMonth',
                lookup: valueLookups.yearMonth,
                defaultFilter: filters.yearMonth || [],
                hidden: !visibleColumns.includes('date'),
                render: (row)=>row.yearMonth
            },
            {
                title: 'Visit',
                field: 'visit',
                lookup: valueLookups.visit,
                defaultFilter: filters.visit || [],
                hidden: !visibleColumns.includes('visit'),
                render: (row)=>row.visit
            },
            {
                title: 'Name',
                field: 'name',
                defaultFilter: filters.name || '',
                hidden: !visibleColumns.includes('name'),
                render: (row)=>row.name
            },
            {
                title: 'Type',
                field: 'type',
                lookup: valueLookups.type,
                defaultFilter: filters.type || [],
                hidden: !visibleColumns.includes('type'),
                render: (row)=>row.type
            },
            {
                title: 'Size',
                field: 'size',
                filtering: false,
                removable: false,
                render: (row)=>formatBytes(row.size)
            }
        ];
        const debouncedFilterDispatch = debounce((filter, value)=>{
            dispatch({
                type: 'setS3FilesFilterValue',
                filter,
                value
            });
        }, 200);
        const noFiltersApplied = Object.keys(filters).every((col)=>!filters[col].length);
        /* eslint-disable react/jsx-one-expression-per-line */ const postSizeError = estimatedPostSize >= MAX_POST_BODY_SIZE ? /*#__PURE__*/ _jsx(Grid, {
            item: true,
            xs: 12,
            children: /*#__PURE__*/ _jsx(Card, {
                style: {
                    marginBottom: Theme.spacing(2),
                    backgroundColor: COLORS.GOLD[300]
                },
                children: /*#__PURE__*/ _jsxs(CardContent, {
                    className: classes.startFlex,
                    style: {
                        justifyContent: 'center'
                    },
                    children: [
                        /*#__PURE__*/ _jsx(WarningIcon, {
                            fontSize: "large",
                            className: classes.calloutIcon,
                            style: {
                                color: COLORS.GOLD[800]
                            }
                        }),
                        /*#__PURE__*/ _jsxs(Typography, {
                            variant: "body1",
                            children: [
                                "Too many files requested! Current selection will make an estimated ",
                                /*#__PURE__*/ _jsx("b", {
                                    children: formatBytes(estimatedPostSize)
                                }),
                                " request; max size is ",
                                /*#__PURE__*/ _jsx("b", {
                                    children: formatBytes(MAX_POST_BODY_SIZE)
                                }),
                                ". Please select fewer files in order to proceed."
                            ]
                        })
                    ]
                })
            })
        }) : null;
        /* eslint-disable react/jsx-one-expression-per-line */ const tooManyFilesWarning = !allowSelectAll && !allowSelectFiltered ? /*#__PURE__*/ _jsx(Grid, {
            item: true,
            xs: 12,
            children: /*#__PURE__*/ _jsx(Card, {
                style: {
                    marginBottom: Theme.spacing(2),
                    backgroundColor: COLORS.GOLD[300]
                },
                children: /*#__PURE__*/ _jsxs(CardContent, {
                    className: classes.startFlex,
                    style: {
                        justifyContent: 'center'
                    },
                    children: [
                        /*#__PURE__*/ _jsx(WarningIcon, {
                            fontSize: "large",
                            className: classes.calloutIcon,
                            style: {
                                color: COLORS.GOLD[800]
                            }
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "body1",
                            children: "Too many files available for bulk selection. Please narrow your selection by selecting fewer sites, a more restrictive date range, or a more restrictive set of filters."
                        })
                    ]
                })
            })
        }) : null;
        const filterButtonLoadingLabel = ` (${isLoading ? '…' : filteredFileCount})`;
        const filterButtonLabel = noFiltersApplied ? '' : filterButtonLoadingLabel;
        const components = {
            Container: Box,
            Toolbar: (toolbarProps)=>/*#__PURE__*/ _jsxs(Grid, {
                    container: true,
                    spacing: 2,
                    alignItems: "flex-start",
                    style: {
                        marginBottom: '24px'
                    },
                    children: [
                        /*#__PURE__*/ _jsxs(Grid, {
                            item: true,
                            xs: 12,
                            md: 6,
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        marginBottom: Theme.spacing(1)
                                    },
                                    children: /*#__PURE__*/ _jsxs(ToggleButtonGroup, {
                                        size: "small",
                                        value: visibleColumns,
                                        onChange: (event, newVisibleColumns)=>dispatch({
                                                type: 'setS3FilesVisibleColumns',
                                                visibleColumns: newVisibleColumns
                                            }),
                                        "aria-label": "show and hide columns",
                                        "data-selenium": "download-data-dialog.s3-files.show-hide-columns-button-group",
                                        children: [
                                            /*#__PURE__*/ _jsx(ToggleButton, {
                                                value: "label",
                                                className: classes.showColumnsLabel,
                                                disabled: true,
                                                children: "Show Columns:"
                                            }),
                                            /*#__PURE__*/ _jsx(ToggleButton, {
                                                value: "site",
                                                children: "Site"
                                            }),
                                            /*#__PURE__*/ _jsx(ToggleButton, {
                                                value: "visit",
                                                children: "Visit"
                                            }),
                                            /*#__PURE__*/ _jsx(ToggleButton, {
                                                value: "date",
                                                children: "Date"
                                            }),
                                            /*#__PURE__*/ _jsx(ToggleButton, {
                                                value: "name",
                                                children: "Name"
                                            }),
                                            /*#__PURE__*/ _jsx(ToggleButton, {
                                                value: "type",
                                                children: "Type"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    style: {
                                        marginBottom: Theme.spacing(1)
                                    },
                                    children: [
                                        /*#__PURE__*/ _jsxs(Button, {
                                            "data-selenium": "download-data-dialog.s3-files.select-all-button",
                                            size: "small",
                                            color: "primary",
                                            variant: "outlined",
                                            onClick: ()=>{
                                                dispatch({
                                                    type: 'setS3FilesValueSelectAll'
                                                });
                                            },
                                            disabled: isLoading || !appliedValidValues.length || !allowSelectAll,
                                            style: {
                                                whiteSpace: 'nowrap'
                                            },
                                            children: [
                                                /*#__PURE__*/ _jsx(SelectAllIcon, {
                                                    fontSize: "small",
                                                    style: {
                                                        marginRight: Theme.spacing(1)
                                                    }
                                                }),
                                                "Select All (",
                                                isLoading ? '…' : appliedValidValues.length,
                                                ")"
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs(Button, {
                                            "data-selenium": "download-data-dialog.s3-files.select-none-button",
                                            size: "small",
                                            color: "primary",
                                            variant: "outlined",
                                            onClick: ()=>{
                                                dispatch({
                                                    type: 'setS3FilesValueSelectNone'
                                                });
                                            },
                                            disabled: isLoading || !appliedValidValues.length,
                                            style: {
                                                marginLeft: Theme.spacing(1),
                                                whiteSpace: 'nowrap'
                                            },
                                            children: [
                                                /*#__PURE__*/ _jsx(SelectNoneIcon, {
                                                    fontSize: "small",
                                                    style: {
                                                        marginRight: Theme.spacing(1)
                                                    }
                                                }),
                                                "Select None"
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsxs(Button, {
                                            "data-selenium": "download-data-dialog.s3-files.select-filtered-button",
                                            size: "small",
                                            color: "primary",
                                            variant: "outlined",
                                            onClick: ()=>{
                                                dispatch({
                                                    type: 'setS3FilesValueSelectFiltered'
                                                });
                                            },
                                            disabled: noFiltersApplied || isLoading || !allowSelectFiltered,
                                            style: {
                                                whiteSpace: 'nowrap'
                                            },
                                            children: [
                                                /*#__PURE__*/ _jsx(SelectFilteredIcon, {
                                                    fontSize: "small",
                                                    style: {
                                                        marginRight: Theme.spacing(1)
                                                    }
                                                }),
                                                "Select Filtered",
                                                filterButtonLabel
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs(Button, {
                                            "data-selenium": "download-data-dialog.s3-files.clear-filters-button",
                                            size: "small",
                                            color: "primary",
                                            variant: "outlined",
                                            disabled: noFiltersApplied || isLoading,
                                            onClick: ()=>{
                                                dispatch({
                                                    type: 'clearS3FilesFilterValues'
                                                });
                                            },
                                            style: {
                                                marginLeft: Theme.spacing(1),
                                                whiteSpace: 'nowrap'
                                            },
                                            children: [
                                                /*#__PURE__*/ _jsx(ClearFiltersIcon, {
                                                    fontSize: "small",
                                                    style: {
                                                        marginRight: Theme.spacing(1)
                                                    }
                                                }),
                                                "Clear Filters"
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx(Grid, {
                            item: true,
                            xs: 12,
                            md: 6,
                            children: /*#__PURE__*/ _jsx(MTableToolbar, {
                                ...toolbarProps
                            })
                        }),
                        postSizeError,
                        tooManyFilesWarning,
                        !excludeProvisionalData || !areProvDataExcluded ? null : /*#__PURE__*/ _jsx("div", {
                            style: {
                                marginLeft: '8px',
                                marginRight: '8px',
                                width: '100%'
                            },
                            children: /*#__PURE__*/ _jsx(InfoMessageCard, {
                                title: "Provisional Data",
                                messageContent: /*#__PURE__*/ _jsx(Typography, {
                                    variant: "body1",
                                    children: "Provisional data are currently being excluded from selection. To make those data available for selection, include those data from within the Provisional Data step."
                                })
                            })
                        })
                    ]
                }),
            FilterRow: (filterRowProps)=>/*#__PURE__*/ _jsx(MTableFilterRow, {
                    ...filterRowProps,
                    onFilterChanged: (columnId, value)=>{
                        const { onFilterChanged } = filterRowProps;
                        onFilterChanged(columnId, value);
                        const filter = columns[columnId].field;
                        const current = filters[filter];
                        if (filter === 'name' && value !== current) {
                            debouncedFilterDispatch(filter, value);
                            return;
                        }
                        if (current && (value.length !== current.length || value.some((v)=>!current.includes(v)))) {
                            dispatch({
                                type: 'setS3FilesFilterValue',
                                filter,
                                value
                            });
                        }
                    }
                })
        };
        /* eslint-enable react/jsx-one-expression-per-line */ const localization = {
            pagination: {
                labelRowsSelect: 'files'
            },
            toolbar: {
                nRowsSelected: `{0} file${selection.length === 1 ? '' : 's'} selected (${formatBytes(totalSize)} uncompressed)`
            },
            body: {
                emptyDataSourceMessage: 'No files to display. Select more sites, broaden date range, or broaden search / filters.'
            }
        };
        return appliedValidValues.length || isLoading ? /*#__PURE__*/ _jsxs("div", {
            className: classes.fileTable,
            id: "s3Files-selection-table-container",
            children: [
                /*#__PURE__*/ _jsx(MaterialTable, {
                    icons: MaterialTableIcons,
                    components: components,
                    columns: columns,
                    data: appliedValidValues,
                    localization: localization,
                    options: {
                        selection: true,
                        showSelectAllCheckbox: false,
                        padding: 'dense',
                        filtering: true,
                        columnsButton: false,
                        pageSize: 10,
                        pageSizeOptions: [
                            5,
                            10,
                            50,
                            100
                        ],
                        showTitle: false,
                        search: false,
                        isLoading
                    },
                    onSelectionChange: (rows, file)=>{
                        dispatch({
                            type: 'setIndividualS3FileSelected',
                            url: file.url,
                            selected: file.tableData.checked
                        });
                    }
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.loadingOverlay,
                    style: {
                        display: isLoading ? 'block' : 'none'
                    },
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h6",
                            style: {
                                marginBottom: Theme.spacing(4)
                            },
                            children: `Loading files (${Math.floor(s3FileFetchProgress || 0)}%)...`
                        }),
                        /*#__PURE__*/ _jsx(CircularProgress, {
                            variant: "determinate",
                            value: s3FileFetchProgress
                        })
                    ]
                })
            ]
        }) : /*#__PURE__*/ _jsx(Typography, {
            variant: "subtitle1",
            style: {
                marginTop: Theme.spacing(3)
            },
            children: "Select sites and date range in order to generate a list of files to choose from."
        });
    };
    const renderPackageTypeStep = ()=>{
        const { value, validValues } = state.packageType;
        let { productBasicDescription, productExpandedDescription } = state.productData;
        if (!productBasicDescription) {
            productBasicDescription = 'Includes the data product, summary statistics, expanded uncertainty, and final quality flag';
        }
        if (!productExpandedDescription) {
            productExpandedDescription = 'Includes the basic package information plus quality metrics for all of the quality assessment and quality control analysis';
        }
        return /*#__PURE__*/ _jsx(FormControl, {
            "data-selenium": "download-data-dialog.step-form.package-type",
            component: "fieldset",
            children: /*#__PURE__*/ _jsxs(RadioGroup, {
                "aria-label": "Package Type",
                name: "package-type",
                value: value || '',
                onChange: (e)=>{
                    setState('packageType', e.target.value);
                    changeToNextUncompletedStep();
                },
                children: [
                    /*#__PURE__*/ _jsx(FormControlLabel, {
                        className: classes.radio,
                        value: validValues[0],
                        control: /*#__PURE__*/ _jsx(Radio, {}),
                        label: /*#__PURE__*/ _jsxs("div", {
                            className: classes.radioLabel,
                            children: [
                                /*#__PURE__*/ _jsx(Typography, {
                                    variant: "h6",
                                    children: "Basic"
                                }),
                                /*#__PURE__*/ _jsx(ComponentErrorBoundary, {
                                    fallbackComponent: ()=>/*#__PURE__*/ _jsx(MarkdownFallbackComponent, {
                                            content: productBasicDescription
                                        }),
                                    onReset: ()=>{},
                                    children: /*#__PURE__*/ _jsx(Markdown, {
                                        remarkPlugins: [
                                            remarkGfm
                                        ],
                                        className: `${classes.markdownWrapper} MuiTypography-root MuiTypography-body2`,
                                        children: productBasicDescription
                                    })
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(FormControlLabel, {
                        className: classes.radio,
                        value: validValues[1],
                        control: /*#__PURE__*/ _jsx(Radio, {}),
                        label: /*#__PURE__*/ _jsxs("div", {
                            className: classes.radioLabel,
                            children: [
                                /*#__PURE__*/ _jsx(Typography, {
                                    variant: "h6",
                                    children: "Expanded"
                                }),
                                /*#__PURE__*/ _jsx(ComponentErrorBoundary, {
                                    fallbackComponent: ()=>/*#__PURE__*/ _jsx(MarkdownFallbackComponent, {
                                            content: productExpandedDescription
                                        }),
                                    onReset: ()=>{},
                                    children: /*#__PURE__*/ _jsx(Markdown, {
                                        remarkPlugins: [
                                            remarkGfm
                                        ],
                                        className: `${classes.markdownWrapper} MuiTypography-root MuiTypography-body2`,
                                        children: productExpandedDescription
                                    })
                                })
                            ]
                        })
                    })
                ]
            })
        });
    };
    const renderExternalExclusiveStep = ()=>{
        const externalHost = ExternalHost.getByProductCode(state.productData.productCode);
        if (!externalHost) {
            return null;
        }
        const hostLink = externalHost.renderLink(state.productData.productCode);
        const availableSiteCodes = (state.productData.siteCodes || []).map((site)=>site.siteCode);
        const externalHostProduct = ExternalHost.getProductSpecificInfo(state.productData.productCode);
        const allowNoAvailability = exists(externalHostProduct) && externalHostProduct.allowNoAvailability === true;
        const noData = !existsNonEmpty(availableSiteCodes);
        const noLinks = allowNoAvailability && noData;
        let blurb;
        if (noLinks) {
            blurb = /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    "Data for this product is not currently available for download through the NEON Data Portal. Please use this link to access data for this product for a particular site from ",
                    hostLink,
                    "."
                ]
            });
        } else {
            blurb = /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    "Data for this product is not currently available for download through the NEON Data Portal. Please use the links below to access data for this product for a particular site from the ",
                    hostLink,
                    "."
                ]
            });
        }
        return /*#__PURE__*/ _jsxs("div", {
            "data-selenium": `download-data-dialog.step-form.external-links.${externalHost.id.toLowerCase()}`,
            children: [
                /*#__PURE__*/ _jsx(InfoMessageCard, {
                    title: "External Host",
                    messageContent: /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle2",
                        children: blurb
                    })
                }),
                noLinks ? null : /*#__PURE__*/ _jsx(ExternalHostProductSpecificLinks, {
                    productCode: state.productData.productCode,
                    siteCodes: availableSiteCodes
                })
            ]
        });
    };
    const renderPoliciesStep = ()=>{
        const { value: agreed } = state.policies;
        const checkbox = /*#__PURE__*/ _jsx(Checkbox, {
            color: "primary",
            value: "policies",
            checked: agreed,
            disabled: agreed,
            onChange: ()=>{
                setState('policies', true);
                changeToNextUncompletedStep();
            }
        });
        /* eslint-disable react/jsx-one-expression-per-line */ return /*#__PURE__*/ _jsxs("div", {
            "data-selenium": "download-data-dialog.step-form.policies",
            children: [
                /*#__PURE__*/ _jsxs(Typography, {
                    variant: "subtitle1",
                    gutterBottom: true,
                    children: [
                        "In order to proceed to download NEON data you must agree to the ",
                        dataUsageAndCitationPoliciesLink,
                        "."
                    ]
                }),
                /*#__PURE__*/ _jsx(FormControlLabel, {
                    control: checkbox,
                    className: classes.formControlBold,
                    label: "I agree to the NEON Data Usage and Citation Policies."
                })
            ]
        });
    /* eslint-enable react/jsx-one-expression-per-line */ };
    const renderSummaryStep = ()=>{
        const stepSummary = /*#__PURE__*/ _jsxs("div", {
            "data-selenium": "download-data-dialog.step-form.summary",
            children: [
                state.requiredSteps.map((step, index)=>{
                    if ([
                        'summary',
                        'policies'
                    ].includes(step.key)) {
                        return null;
                    }
                    const { isComplete } = state.requiredSteps[index];
                    return /*#__PURE__*/ _jsxs("div", {
                        className: classes.stepSummary,
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                role: "button",
                                tabIndex: 0,
                                className: classes.stepSummaryHeader,
                                onClick: ()=>changeToStep(index),
                                onKeyPress: ()=>changeToStep(index),
                                children: [
                                    /*#__PURE__*/ _jsx(Chip, {
                                        color: isComplete ? 'primary' : 'default',
                                        label: index + 1,
                                        className: classes.summaryChip
                                    }),
                                    /*#__PURE__*/ _jsx(Typography, {
                                        variant: "h6",
                                        style: {
                                            flexGrow: 1
                                        },
                                        children: DownloadDataContext.ALL_STEPS[step.key].label
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: classes.stepSummaryContent,
                                children: isComplete ? renderStepSummary[step.key](classes, state) : /*#__PURE__*/ _jsx(Typography, {
                                    variant: "body2",
                                    className: classes.summaryTextIncomplete,
                                    children: "Incomplete"
                                })
                            })
                        ]
                    }, step.key);
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: classes.stepSummary,
                    children: renderDownloadButton()
                }, "download")
            ]
        });
        const downloadAndExploreLink = /*#__PURE__*/ _jsx(Link, {
            target: "_blank",
            href: RouteService.getDownloadExplorePath(),
            "data-gtm": "download-data-dialog.download-and-explore-link",
            children: "Download and Explore NEON Data"
        });
        const downloadAndExploreCallout = /*#__PURE__*/ _jsx(Card, {
            style: {
                margin: Theme.spacing(0.5, 0, 3, 0)
            },
            "data-selenium": "download-data-dialog.step-form.summary.download-and-explore",
            children: /*#__PURE__*/ _jsxs(CardContent, {
                className: classes.startFlex,
                children: [
                    /*#__PURE__*/ _jsx(ExploreIcon, {
                        fontSize: "large",
                        className: classes.calloutIcon
                    }),
                    /*#__PURE__*/ _jsxs(Typography, {
                        variant: "subtitle2",
                        children: [
                            "Tip: Check out our ",
                            downloadAndExploreLink,
                            " tutorial. This tutorial will explain how our neonUtilities package can be used to unzip and join data tables with just a few lines of code."
                        ]
                    })
                ]
            })
        });
        const fileNamingConventionsLink = /*#__PURE__*/ _jsx(Link, {
            target: "_blank",
            href: RouteService.getFileNamingConventionsPath(),
            "data-gtm": "download-data-dialog.file-naming-conventions-link",
            children: "NEON File Naming Conventions"
        });
        const fileNamingCallout = /*#__PURE__*/ _jsx(Card, {
            style: {
                margin: Theme.spacing(0.5, 0, 3, 0)
            },
            "data-selenium": "download-data-dialog.step-form.summary.file-naming",
            children: /*#__PURE__*/ _jsxs(CardContent, {
                className: classes.startFlex,
                children: [
                    /*#__PURE__*/ _jsx(FileIcon, {
                        fontSize: "large",
                        className: classes.calloutIcon
                    }),
                    /*#__PURE__*/ _jsxs(Typography, {
                        variant: "subtitle2",
                        children: [
                            "Files in this download will follow ",
                            fileNamingConventionsLink,
                            "."
                        ]
                    })
                ]
            })
        });
        let citationProductCode = '';
        let citationRelease;
        if (exists(state.productData) && isStringNonEmpty(state.productData.productCode)) {
            citationProductCode = state.productData.productCode;
        }
        if (exists(state.release) && isStringNonEmpty(state.release.value)) {
            citationRelease = state.release.value;
        }
        const citationCallout = /*#__PURE__*/ _jsx(Card, {
            style: {
                margin: Theme.spacing(0.5, 0, 3, 0)
            },
            "data-selenium": "download-data-dialog.step-form.summary.citation",
            children: /*#__PURE__*/ _jsx(CardContent, {
                children: /*#__PURE__*/ _jsx(DataProductCitation, {
                    showQuoteIcon: true,
                    productCode: citationProductCode,
                    release: citationRelease
                })
            })
        });
        return /*#__PURE__*/ _jsxs(Grid, {
            container: true,
            spacing: 2,
            alignItems: "flex-start",
            children: [
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: stepSummary
                }),
                /*#__PURE__*/ _jsxs(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: [
                        downloadAndExploreCallout,
                        fileNamingCallout,
                        citationCallout
                    ]
                })
            ]
        });
    };
    const renderStepForm = ()=>{
        switch(stepKey){
            case 'sitesAndDateRange':
                return renderSitesAndDateRangeStep();
            case 'documentation':
                return renderDocumentationStep();
            case 'provisionalData':
                return renderProvisionalDataStep();
            case 's3Files':
                return renderS3FilesStep();
            case 'packageType':
                return renderPackageTypeStep();
            case 'externalExclusive':
                return renderExternalExclusiveStep();
            case 'policies':
                return renderPoliciesStep();
            case 'summary':
                return renderSummaryStep();
            default:
                return null;
        }
    };
    return renderStepForm();
};
DownloadStepForm.propTypes = {
    stepKey: PropTypes.oneOf(Object.keys(DownloadDataContext.ALL_STEPS)).isRequired,
    changeToStep: PropTypes.func,
    changeToNextUncompletedStep: PropTypes.func,
    renderDownloadButton: PropTypes.func
};
export default DownloadStepForm;
