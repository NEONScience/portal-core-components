import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import lzw from 'node-lzw';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import MobileStepper from '@mui/material/MobileStepper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircleStarIcon from '@mui/icons-material/Stars';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';
import WarningIcon from '@mui/icons-material/Warning';
import DialogBase from '../DialogBase/DialogBase';
import DownloadStepForm from '../DownloadStepForm/DownloadStepForm';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import DataThemeIcon from '../DataThemeIcon/DataThemeIcon';
import ExternalHost from '../ExternalHost/ExternalHost';
import ExternalHostInfo from '../ExternalHostInfo/ExternalHostInfo';
import NeonContext from '../NeonContext/NeonContext';
import ReleaseChip from '../Chip/ReleaseChip';
import Theme, { COLORS } from '../Theme/Theme';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { buildManifestConfig, buildManifestRequestBody, downloadManifest, downloadAopManifest, formatBytes, DOWNLOAD_SIZE_WARN } from '../../util/manifestUtil';
const useStyles = (belowSm, belowSmMd)=>makeStyles((theme)=>({
            stepChip: {
                marginRight: theme.spacing(1),
                fontSize: '1rem',
                fontWeight: 600
            },
            productCodeChip: {
                color: theme.palette.grey[400],
                border: `1px solid ${theme.palette.grey[400]}`,
                backgroundColor: theme.palette.grey[100],
                fontWeight: 600,
                cursor: 'help',
                height: '26px',
                margin: theme.spacing(-0.5, 1.5, 0, 0)
            },
            releaseChip: {
                color: Theme.colors.LIGHT_BLUE[600],
                border: `1px solid ${Theme.colors.LIGHT_BLUE[600]}`,
                backgroundColor: Theme.colors.LIGHT_BLUE[50],
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'help',
                height: belowSmMd && !belowSm ? 'auto' : undefined,
                padding: theme.spacing(2, 1, 2, 1)
            },
            startFlex: {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
            },
            endFlex: {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            },
            completedInactive: {
                '& svg': {
                    opacity: 0.5
                }
            },
            summaryIcon: {
                fontSize: '30px',
                color: theme.palette.primary.main
            },
            summaryIconTitleMarker: {
                fontSize: '38px',
                color: theme.palette.primary.main,
                margin: '-2px 6px -2px -4px'
            },
            callout: {
                backgroundColor: COLORS.GOLD[300],
                margin: Theme.spacing(0.5, 0, 2, 0)
            },
            calloutIcon: {
                color: COLORS.GOLD[800],
                marginRight: theme.spacing(2)
            },
            gtmCaptureButton: {
                '& span': {
                    pointerEvents: 'none'
                }
            }
        }));
const useDialogBaseStyles = (belowSm)=>makeStyles((theme)=>({
            contentPaper: {
                margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
                padding: theme.spacing(3),
                minWidth: '340px'
            }
        }));
export default function DownloadDataDialog() {
    const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
    const belowSmMd = useMediaQuery('(max-width: 750px)');
    const belowSmMdStepper = useMediaQuery('(max-width: 700px)');
    const belowMdStepper = useMediaQuery('(max-width: 800px)');
    const classes = useStyles(belowSm, belowSmMd)(Theme);
    const dialogBaseClasses = useDialogBaseStyles(belowSm)(Theme);
    /**
     State (from DownloadDataContext)
  */ const [{ dialogOpen, productData, manifest, requiredSteps, allStepsComplete, fromManifest, fromAOPManifest, documentation, s3Files, release, latestRelease, sites, dateRange, packageType, provisionalData }, dispatch] = DownloadDataContext.useDownloadDataState();
    /**
     State (from NeonContext)
  */ const [{ auth: { isAuthenticated } }] = NeonContext.useNeonContextState();
    /**
     State (local)
  */ const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [downloadExecuted, setDownloadExecuted] = useState(false);
    /**
     Size estimate getter (in bytes)
  */ const getSizeEstimateBytes = ()=>(fromAOPManifest ? s3Files.totalSize : manifest.sizeEstimate) || 0;
    /**
     External Host
  */ const externalHost = ExternalHost.getByProductCode(productData.productCode);
    const renderExternalHostInfo = ()=>{
        if (!externalHost || externalHost.hostType === ExternalHost.HOST_TYPES.EXCLUSIVE_DATA) {
            return null;
        }
        const availableSiteCodes = (productData.siteCodes || []).map((site)=>site.siteCode);
        return /*#__PURE__*/ _jsx(ExternalHostInfo, {
            "data-selenium": "download-data-dialog.external-host-info",
            productCode: productData.productCode,
            siteCodes: availableSiteCodes,
            expandable: true
        });
    };
    /**
     Step content
  */ const { ALL_STEPS } = DownloadDataContext;
    const getStep = (idx = 0)=>{
        if (!requiredSteps[idx]) {
            return {};
        }
        return ALL_STEPS[requiredSteps[idx].key];
    };
    /**
     Handlers
  */ const changeToStep = (stepIdx)=>{
        setActiveStepIndex(stepIdx);
    };
    const changeToNextUncompletedStep = ()=>{
        const lastStepIndex = requiredSteps.length - 1;
        const summaryIndex = requiredSteps[lastStepIndex].key === 'summary' ? lastStepIndex : null;
        const allIncompleteSteps = Object.keys(requiredSteps).map((idx)=>parseInt(idx, 10)).filter((idx)=>idx !== activeStepIndex && idx !== summaryIndex && !requiredSteps[idx].isComplete);
        if (activeStepIndex === lastStepIndex) {
            return null;
        }
        if (!allIncompleteSteps.length) {
            return summaryIndex ? changeToStep(summaryIndex) : null;
        }
        // There is at least one incomplete step.
        // If any steps are after the current active step (OTHER than summary), go there first.
        // If not then take the first incomplete step in the list.
        const laterIncompleteSteps = allIncompleteSteps.filter((idx)=>idx !== summaryIndex && idx > activeStepIndex);
        return changeToStep(laterIncompleteSteps.length ? laterIncompleteSteps[0] : allIncompleteSteps[0]);
    };
    const handleCancel = ()=>{
        dispatch({
            type: 'setDialogOpen',
            open: false
        });
    };
    const handleDownload = ()=>{
        setDownloadExecuted(true);
        const manifestSelection = {
            productData,
            release,
            sites,
            dateRange,
            documentation,
            packageType,
            provisionalData
        };
        if (fromAOPManifest) {
            const config = buildManifestConfig(manifestSelection, null, true);
            return downloadAopManifest(config, s3Files, documentation.value);
        }
        if (manifest.status !== 'fetched' || !manifest.body || !manifest.body.data) {
            return null;
        }
        const config = buildManifestConfig(manifestSelection);
        const manifestBody = buildManifestRequestBody(config);
        return downloadManifest(manifestBody);
    };
    /**
     Render functions
  */ const renderSizeEstimate = ()=>{
        const alignRight = {
            style: {
                textAlign: 'right'
            }
        };
        const subtitleStyle = {
            style: {
                lineHeight: '1rem',
                fontSize: '0.9rem',
                marginBottom: '4px'
            }
        };
        if (fromManifest && manifest.status === 'awaitingFetchCall' || fromAOPManifest && !s3Files.isValid) {
            return '';
        }
        if (fromManifest && manifest.status === 'fetching') {
            return belowSm ? /*#__PURE__*/ _jsxs("div", {
                className: classes.startFlex,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        children: "Estimating size..."
                    }),
                    /*#__PURE__*/ _jsx(CircularProgress, {
                        size: 16,
                        style: {
                            marginLeft: Theme.spacing(1)
                        }
                    })
                ]
            }) : /*#__PURE__*/ _jsxs("div", {
                ...alignRight,
                children: [
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "subtitle1",
                        ...subtitleStyle,
                        children: "Estimating size..."
                    }),
                    /*#__PURE__*/ _jsx(LinearProgress, {
                        style: {
                            marginTop: Theme.spacing(1.5)
                        }
                    })
                ]
            });
        }
        if (fromManifest && manifest.status === 'fetched' && manifest.sizeEstimate > 0 || fromAOPManifest && s3Files.isValid) {
            const bytes = getSizeEstimateBytes();
            const uncompressed = fromAOPManifest ? ' (uncompressed)' : '';
            let estimateColor = bytes > DOWNLOAD_SIZE_WARN ? COLORS.GOLD[300] : 'inherit';
            const estimateIcon = bytes > DOWNLOAD_SIZE_WARN ? /*#__PURE__*/ _jsx(WarningIcon, {
                style: {
                    marginRight: '8px',
                    marginBottom: '-5px'
                }
            }) : null;
            /* eslint-disable react/jsx-one-expression-per-line */ if (belowSm) {
                estimateColor = bytes > DOWNLOAD_SIZE_WARN ? COLORS.GOLD[500] : 'inherit';
                return /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    children: [
                        "Estimated size",
                        uncompressed,
                        ": ",
                        /*#__PURE__*/ _jsxs("span", {
                            style: {
                                fontWeight: 700,
                                color: estimateColor
                            },
                            children: [
                                estimateIcon,
                                formatBytes(bytes)
                            ]
                        })
                    ]
                });
            }
            return /*#__PURE__*/ _jsxs("div", {
                ...alignRight,
                children: [
                    /*#__PURE__*/ _jsxs(Typography, {
                        variant: "subtitle1",
                        ...subtitleStyle,
                        children: [
                            "Estimated size",
                            uncompressed
                        ]
                    }),
                    /*#__PURE__*/ _jsxs(Typography, {
                        variant: "h5",
                        style: {
                            color: estimateColor
                        },
                        children: [
                            estimateIcon,
                            formatBytes(bytes)
                        ]
                    })
                ]
            });
        /* eslint-enable react/jsx-one-expression-per-line */ }
        if (fromManifest && (manifest.status === 'fetched' || manifest.status === 'no-data') && !(manifest.sizeEstimate > 0) || fromAOPManifest && !(s3Files.totalSize > 0)) {
            const hasProvisionalDataStep = requiredSteps.some((step)=>step.key === 'provisionalData');
            const excludeProvisionalData = hasProvisionalDataStep && provisionalData.value === 'exclude';
            const showNoReleaseData = hasProvisionalDataStep && excludeProvisionalData;
            return /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                color: "error",
                children: showNoReleaseData ? 'No release data selected' : 'No data selected'
            });
        }
        if (fromManifest && manifest.status === 'error' || fromAOPManifest && !s3Files.isValid) {
            return /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                color: "error",
                children: "Unable to estimate size"
            });
        }
        return null;
    };
    const renderDownloadSizeWarning = ()=>{
        const bytes = getSizeEstimateBytes();
        if (bytes < DOWNLOAD_SIZE_WARN) {
            return null;
        }
        const formattedBytes = formatBytes(bytes);
        return /*#__PURE__*/ _jsx(Card, {
            className: classes.callout,
            children: /*#__PURE__*/ _jsxs(CardContent, {
                className: classes.startFlex,
                children: [
                    /*#__PURE__*/ _jsx(WarningIcon, {
                        fontSize: "large",
                        className: classes.calloutIcon
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsxs(Typography, {
                                variant: "subtitle1",
                                style: {
                                    fontWeight: 600
                                },
                                children: [
                                    "Be sure you have at least ",
                                    formattedBytes,
                                    " of free disk space for this download!"
                                ]
                            }),
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "body1",
                                children: "If needed, you can reduce the download size by selecting fewer sites or a more restrictive date range."
                            })
                        ]
                    })
                ]
            })
        });
    };
    const renderFileType = ()=>{
        if (!fromManifest) {
            return null;
        }
        if (manifest.status !== 'fetched' || manifest.status === 'fetched' && !(manifest.sizeEstimate > 0)) {
            return /*#__PURE__*/ _jsxs(Typography, {
                variant: "body2",
                "data-selenium": "download-data-dialog.file-type",
                children: [
                    "File Type: ",
                    /*#__PURE__*/ _jsx("b", {
                        children: "Not available"
                    })
                ]
            });
        }
        // TODO: Do other file types ever come back in the manifest response?
        const fileTypes = {
            'application/zip': 'ZIP (Compressed Text)'
        };
        const mimeType = manifest.body && manifest.body.data && manifest.body.data.mimeType ? manifest.body.data.mimeType : null;
        const fileTypeText = Object.keys(fileTypes).includes(mimeType) ? fileTypes[mimeType] : 'Unknown';
        return /*#__PURE__*/ _jsxs(Typography, {
            variant: "body2",
            "data-selenium": "download-data-dialog.file-type",
            children: [
                "File Type: ",
                /*#__PURE__*/ _jsx("b", {
                    children: fileTypeText
                })
            ]
        });
    };
    // Not the same as the Download Data Button component!
    // This entire dialog component is launched by the Download Data Button component.
    // The button rendered here looks the same but only appears inside the dialog,
    // and actually executes the download (provided the context is in a complete state).
    const renderDownloadButton = ()=>{
        let disabled = true;
        let buttonText = 'Download Data';
        const iconProps = {
            style: {
                marginLeft: Theme.spacing(1)
            }
        };
        let icon = /*#__PURE__*/ _jsx(DownloadIcon, {
            ...iconProps
        });
        if (allStepsComplete) {
            if (fromAOPManifest) {
                disabled = false;
            }
            if (fromManifest) {
                switch(manifest.status){
                    case 'fetched':
                        disabled = !(manifest.sizeEstimate > 0);
                        break;
                    case 'fetching':
                        buttonText = 'Fetching File List...';
                        icon = /*#__PURE__*/ _jsx(CircularProgress, {
                            size: 16,
                            color: "inherit",
                            ...iconProps
                        });
                        break;
                    case 'error':
                        buttonText = 'Download Unavailable';
                        icon = /*#__PURE__*/ _jsx(ErrorIcon, {
                            ...iconProps
                        });
                        break;
                    case 'awaitingFetchCall':
                        break;
                    case 'no-data':
                    case 'invalid-config':
                    default:
                        buttonText = 'Download Unavailable';
                        break;
                }
            }
        }
        let appliedDownloadButtonStyle = {
            whiteSpace: 'nowrap'
        };
        if (belowSmMd) {
            appliedDownloadButtonStyle = {
                ...appliedDownloadButtonStyle,
                width: '100%'
            };
        }
        return /*#__PURE__*/ _jsxs(Button, {
            fullWidth: belowSm,
            "data-selenium": "download-data-dialog.download-button",
            "data-gtm": "download-data-dialog.download-button",
            size: "large",
            color: "primary",
            variant: "contained",
            onClick: handleDownload,
            style: appliedDownloadButtonStyle,
            disabled: disabled,
            className: classes.gtmCaptureButton,
            children: [
                buttonText,
                icon
            ]
        });
    };
    const renderAuthSuggestion = ()=>{
        if (isAuthenticated) {
            return null;
        }
        /* eslint-disable react/jsx-one-expression-per-line */ const authStyles = {
            color: COLORS.GOLD[800],
            textAlign: 'right'
        };
        return /*#__PURE__*/ _jsxs("div", {
            style: {
                textAlign: 'right'
            },
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "body2",
                    style: {
                        ...authStyles,
                        marginTop: Theme.spacing(1),
                        fontWeight: 600
                    },
                    children: "Consider signing in or creating an account before proceeding."
                }),
                /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    style: {
                        ...authStyles,
                        fontStyle: 'italic',
                        fontSize: '0.8rem'
                    },
                    children: [
                        /*#__PURE__*/ _jsx(Link, {
                            target: "_new",
                            href: RouteService.getUserAccountsPath(),
                            children: "Learn"
                        }),
                        " the benefits of having an account."
                    ]
                }),
                /*#__PURE__*/ _jsx(NeonSignInButton, {})
            ]
        });
    /* eslint-enable react/jsx-one-expression-per-line */ };
    const renderDownloadButtonStepNote = ()=>{
        const showDownloadButton = fromManifest || fromAOPManifest;
        if (!showDownloadButton) {
            return null;
        }
        const completableSteps = requiredSteps.filter((step)=>step.key !== 'summary');
        const completedSteps = requiredSteps.filter((step)=>step.key !== 'summary' && step.isComplete);
        const noDataAvailable = fromManifest && (manifest.status === 'fetched' || manifest.status === 'no-data') && !(manifest.sizeEstimate > 0) || fromAOPManifest && !(s3Files.totalSize > 0);
        if (!allStepsComplete) {
            return /*#__PURE__*/ _jsx(Typography, {
                variant: "body2",
                style: {
                    marginTop: Theme.spacing(2),
                    textAlign: 'right'
                },
                children: `Complete all steps to enable download. ${completedSteps.length} of ${completableSteps.length} completed.`
            });
        }
        return /*#__PURE__*/ _jsx(Typography, {
            variant: "body2",
            style: {
                marginTop: Theme.spacing(2),
                textAlign: 'right'
            },
            children: noDataAvailable ? 'No data selected.' : 'All steps completed.'
        });
    };
    const renderActions = ()=>{
        const divClass = belowSm ? classes.startFlex : classes.endFlex;
        const showDownloadButton = fromManifest || fromAOPManifest;
        if (belowSm) {
            return /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsxs(Grid, {
                        container: true,
                        spacing: 2,
                        children: [
                            showDownloadButton ? /*#__PURE__*/ _jsx(Grid, {
                                item: true,
                                xs: 12,
                                sm: 12,
                                md: 8,
                                children: renderDownloadButton()
                            }) : null,
                            /*#__PURE__*/ _jsx(Grid, {
                                item: true,
                                xs: 12,
                                sm: 12,
                                md: showDownloadButton ? 4 : 12,
                                children: /*#__PURE__*/ _jsx(Button, {
                                    fullWidth: true,
                                    "data-selenium": "download-data-dialog.cancel-button",
                                    "data-gtm": "download-data-dialog.cancel-button",
                                    size: "large",
                                    color: "primary",
                                    variant: "outlined",
                                    onClick: handleCancel,
                                    style: {
                                        marginRight: Theme.spacing(showDownloadButton ? 1 : 0)
                                    },
                                    className: classes.gtmCaptureButton,
                                    children: showDownloadButton ? 'Cancel' : 'Done'
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: divClass,
                        style: {
                            flexDirection: 'column',
                            alignItems: 'flex-end'
                        },
                        children: [
                            renderDownloadButtonStepNote(),
                            renderAuthSuggestion()
                        ]
                    })
                ]
            });
        }
        let appliedActionsContainerStyles = {};
        let appliedDismissActionStyle = {
            marginRight: Theme.spacing(showDownloadButton ? 1 : 0)
        };
        if (showDownloadButton && belowSmMd) {
            appliedActionsContainerStyles = {
                flexDirection: 'column-reverse',
                width: '100%'
            };
            appliedDismissActionStyle = {
                marginRight: '0px',
                marginTop: '10px',
                width: '100%'
            };
        }
        return /*#__PURE__*/ _jsxs("div", {
            className: divClass,
            style: {
                flexDirection: 'column',
                alignItems: 'flex-end'
            },
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: divClass,
                    style: appliedActionsContainerStyles,
                    children: [
                        /*#__PURE__*/ _jsx(Button, {
                            "data-selenium": "download-data-dialog.cancel-button",
                            "data-gtm": "download-data-dialog.cancel-button",
                            size: "large",
                            color: "primary",
                            variant: "outlined",
                            onClick: handleCancel,
                            style: appliedDismissActionStyle,
                            className: classes.gtmCaptureButton,
                            children: showDownloadButton ? 'Cancel' : 'Done'
                        }),
                        showDownloadButton ? renderDownloadButton() : null
                    ]
                }),
                renderDownloadButtonStepNote(),
                renderAuthSuggestion()
            ]
        });
    };
    const renderStepNavButtons = ()=>/*#__PURE__*/ _jsxs("div", {
            style: {
                whiteSpace: 'nowrap'
            },
            children: [
                /*#__PURE__*/ _jsx(Button, {
                    "data-selenium": "download-data-dialog.step-nav-button.previous",
                    variant: "outlined",
                    "aria-label": "Previous",
                    disabled: activeStepIndex === 0,
                    onClick: ()=>changeToStep(activeStepIndex - 1),
                    startIcon: /*#__PURE__*/ _jsx(LeftIcon, {}),
                    children: belowSm ? null : 'Back'
                }),
                /*#__PURE__*/ _jsx(Button, {
                    "data-selenium": "download-data-dialog.step-nav-button.next",
                    variant: "outlined",
                    "aria-label": "Next",
                    disabled: activeStepIndex === requiredSteps.length - 1,
                    style: {
                        marginLeft: Theme.spacing(1)
                    },
                    onClick: ()=>changeToStep(activeStepIndex + 1),
                    endIcon: /*#__PURE__*/ _jsx(RightIcon, {}),
                    children: belowSm ? null : 'Next'
                })
            ]
        });
    const renderStepper = ()=>{
        if (requiredSteps.length < 2) {
            return null;
        }
        const hideLabel = requiredSteps.length > 5 && belowMdStepper || requiredSteps.length <= 5 && belowSmMdStepper;
        if (belowSm) {
            const maxSteps = requiredSteps.length;
            const buttonProps = {
                size: 'small',
                color: 'primary',
                variant: 'contained'
            };
            const handleBack = ()=>changeToStep(activeStepIndex - 1);
            const handleNext = ()=>changeToStep(activeStepIndex + 1);
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(MobileStepper, {
                        steps: maxSteps,
                        variant: "dots",
                        activeStep: activeStepIndex,
                        backButton: /*#__PURE__*/ _jsxs(Button, {
                            ...buttonProps,
                            onClick: handleBack,
                            disabled: activeStepIndex === 0,
                            children: [
                                Theme.direction === 'rtl' ? /*#__PURE__*/ _jsx(RightIcon, {}) : /*#__PURE__*/ _jsx(LeftIcon, {}),
                                "Back"
                            ]
                        }),
                        nextButton: /*#__PURE__*/ _jsxs(Button, {
                            ...buttonProps,
                            onClick: handleNext,
                            disabled: activeStepIndex === maxSteps - 1,
                            children: [
                                "Next",
                                Theme.direction === 'rtl' ? /*#__PURE__*/ _jsx(LeftIcon, {}) : /*#__PURE__*/ _jsx(RightIcon, {})
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Divider, {})
                ]
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(Stepper, {
                    nonLinear: true,
                    "data-selenium": "download-data-dialog.stepper",
                    children: requiredSteps.map((step, index)=>{
                        const { label } = getStep(index);
                        const buttonProps = {
                            onClick: ()=>changeToStep(index)
                        };
                        if (step.isComplete === true && activeStepIndex !== index) {
                            buttonProps.className = classes.completedInactive;
                        }
                        if (step.key === 'summary') {
                            buttonProps.icon = /*#__PURE__*/ _jsx(CircleStarIcon, {
                                className: classes.summaryIcon,
                                style: {
                                    opacity: activeStepIndex === index ? 1 : 0.5
                                }
                            });
                        }
                        return /*#__PURE__*/ _jsx(Tooltip, {
                            placement: "top",
                            title: label,
                            children: /*#__PURE__*/ _jsx(Step, {
                                active: activeStepIndex === index,
                                completed: step.isComplete === true,
                                children: /*#__PURE__*/ _jsx(StepButton, {
                                    ...buttonProps,
                                    children: hideLabel ? null : label
                                })
                            }, label)
                        }, label);
                    })
                }),
                /*#__PURE__*/ _jsx(Divider, {})
            ]
        });
    };
    const renderActiveStep = ()=>{
        if (!requiredSteps.length) {
            return null;
        }
        if (requiredSteps.length < 2) {
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    getStep(activeStepIndex).title ? /*#__PURE__*/ _jsx("div", {
                        style: {
                            marginTop: Theme.spacing(3)
                        },
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "h5",
                            style: {
                                flexGrow: 1
                            },
                            children: getStep(activeStepIndex).title
                        })
                    }) : null,
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            margin: Theme.spacing(3, belowSm ? 0 : 5)
                        },
                        children: /*#__PURE__*/ _jsx(DownloadStepForm, {
                            stepKey: requiredSteps[activeStepIndex].key
                        })
                    })
                ]
            });
        }
        const titleMarker = requiredSteps[activeStepIndex].key === 'summary' ? /*#__PURE__*/ _jsx(CircleStarIcon, {
            className: classes.summaryIconTitleMarker
        }) : /*#__PURE__*/ _jsx(Chip, {
            color: "primary",
            label: activeStepIndex + 1,
            className: classes.stepChip
        });
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.startFlex,
                    style: {
                        marginTop: Theme.spacing(3)
                    },
                    children: [
                        titleMarker,
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h5",
                            style: {
                                flexGrow: 1
                            },
                            children: getStep(activeStepIndex).title
                        }),
                        belowSm ? null : renderStepNavButtons()
                    ]
                }),
                /*#__PURE__*/ _jsx("div", {
                    style: {
                        margin: Theme.spacing(2, belowSm ? 0 : 5)
                    },
                    children: /*#__PURE__*/ _jsx(DownloadStepForm, {
                        stepKey: requiredSteps[activeStepIndex].key,
                        changeToStep: changeToStep,
                        changeToNextUncompletedStep: changeToNextUncompletedStep,
                        renderDownloadButton: renderDownloadButton
                    })
                })
            ]
        });
    };
    // Google Tag Manager variables
    const getStepsCompleted = ()=>requiredSteps.filter((step)=>step.isComplete === true).map((step)=>step.key);
    const getStepsNotCompleted = ()=>requiredSteps.filter((step)=>step.isComplete === false).map((step)=>step.key);
    const getStepCompletionPercentage = ()=>{
        const completed = getStepsCompleted();
        const notCompleted = getStepsNotCompleted();
        const total = completed.length + notCompleted.length;
        return total ? completed.length / total * 100 : 0;
    };
    const getLZWCompressedConfig = ()=>{
        if (!allStepsComplete) {
            return '';
        }
        // The subset of possible steps we actually want to persist in the GA event
        const eventSteps = [
            'sites',
            'dateRange'
        ];
        if (requiredSteps.some((step)=>step.key === 'documentation')) {
            eventSteps.push('documentation');
        }
        if (requiredSteps.some((step)=>step.key === 'packageType')) {
            eventSteps.push('packageType');
        }
        if (requiredSteps.some((step)=>step.key === 'provisionalData')) {
            eventSteps.push('provisionalData');
        }
        // Build the config for reporting
        const eventValues = {
            sites,
            dateRange,
            documentation,
            packageType,
            provisionalData
        };
        const eventConfig = {
            productCode: productData.productCode
        };
        eventSteps.forEach((step)=>{
            eventConfig[step] = eventValues[step].value;
        });
        // Stringify, compress, and return
        return lzw.encode(JSON.stringify(eventConfig));
    };
    const renderGtmTags = ()=>/*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.product-code",
                    value: productData.productCode
                }),
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.size-estimate-bytes",
                    value: getSizeEstimateBytes()
                }),
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.steps-completed",
                    value: getStepsCompleted().join(', ')
                }),
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.steps-not-completed",
                    value: getStepsNotCompleted().join(', ')
                }),
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.step-completion-percentage",
                    value: getStepCompletionPercentage()
                }),
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.download-executed",
                    value: downloadExecuted ? 1 : 0
                }),
                /*#__PURE__*/ _jsx("input", {
                    type: "hidden",
                    "data-gtm": "download-data-dialog.lzw-compressed-config",
                    value: getLZWCompressedConfig()
                })
            ]
        });
    const releaseTooltip = release.value === null ? `You are downloading only the latest released and provisional data (release: ${latestRelease || 'unknown'}).` : `You are downloading product data only from the ${release.value} release (no provisional data will be included).`;
    const releaseChipLabel = release.value === null ? 'Latest released and provisional data' : `Release: ${release.value}`;
    const releaseChipLabelStyle = belowSmMd && !belowSm ? {
        whiteSpace: 'break-spaces'
    } : {};
    return /*#__PURE__*/ _jsxs(DialogBase, {
        "data-selenium": "download-data-dialog",
        open: dialogOpen,
        onClose: handleCancel,
        customClasses: dialogBaseClasses,
        title: fromManifest || fromAOPManifest ? 'Configure Data for Download' : 'Download Data from External Host',
        closeButtonProps: {
            'data-gtm': 'download-data-dialog.cancel-button',
            className: classes.gtmCaptureButton
        },
        toolbarChildren: fromManifest || fromAOPManifest ? /*#__PURE__*/ _jsx(Box, {
            sx: {
                display: {
                    xs: 'none',
                    sm: 'block'
                }
            },
            children: /*#__PURE__*/ _jsx("div", {
                "data-selenium": "download-data-dialog.size-estimate",
                children: renderSizeEstimate()
            })
        }) : null,
        children: [
            renderGtmTags(),
            /*#__PURE__*/ _jsxs(Grid, {
                container: true,
                spacing: 2,
                alignItems: "flex-start",
                style: {
                    marginBottom: Theme.spacing(3)
                },
                children: [
                    /*#__PURE__*/ _jsxs(Grid, {
                        item: true,
                        xs: 12,
                        sm: 6,
                        md: 6,
                        lg: 8,
                        "data-selenium": "download-data-dialog.product-info",
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                variant: "h5",
                                style: {
                                    marginBottom: Theme.spacing(1.5)
                                },
                                children: productData.productName
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: classes.startFlex,
                                style: {
                                    marginBottom: Theme.spacing(1.5)
                                },
                                children: [
                                    /*#__PURE__*/ _jsx(Tooltip, {
                                        placement: "right",
                                        title: "The unique identifier for this data product independent of release",
                                        children: /*#__PURE__*/ _jsx(Chip, {
                                            label: productData.productCode,
                                            className: classes.productCodeChip
                                        })
                                    }),
                                    (productData.themes || []).map((dataTheme)=>/*#__PURE__*/ _jsx("div", {
                                            style: {
                                                marginLeft: Theme.spacing(1.5)
                                            },
                                            children: /*#__PURE__*/ _jsx(DataThemeIcon, {
                                                size: 3,
                                                theme: dataTheme
                                            })
                                        }, dataTheme))
                                ]
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                children: /*#__PURE__*/ _jsx(ReleaseChip, {
                                    chipLabel: /*#__PURE__*/ _jsx("span", {
                                        style: releaseChipLabelStyle,
                                        children: releaseChipLabel
                                    }),
                                    classes: {
                                        chip: classes.releaseChip
                                    },
                                    tooltipTitle: releaseTooltip,
                                    tooltipProps: {
                                        placement: 'bottom-start'
                                    }
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs(Grid, {
                        item: true,
                        xs: 12,
                        sm: 6,
                        md: 6,
                        lg: 4,
                        children: [
                            fromManifest || fromAOPManifest ? /*#__PURE__*/ _jsx(Box, {
                                sx: {
                                    display: {
                                        xs: 'block',
                                        sm: 'none'
                                    }
                                },
                                children: /*#__PURE__*/ _jsxs("div", {
                                    style: {
                                        marginBottom: Theme.spacing(2)
                                    },
                                    children: [
                                        renderFileType(),
                                        /*#__PURE__*/ _jsx("div", {
                                            "data-selenium": "download-data-dialog.size-estimate",
                                            children: renderSizeEstimate()
                                        })
                                    ]
                                })
                            }) : null,
                            renderActions(),
                            fromManifest || fromAOPManifest ? /*#__PURE__*/ _jsx(Box, {
                                sx: {
                                    display: {
                                        xs: 'none',
                                        sm: 'block'
                                    }
                                },
                                children: /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        marginTop: Theme.spacing(1),
                                        textAlign: 'right'
                                    },
                                    children: renderFileType()
                                })
                            }) : null
                        ]
                    })
                ]
            }),
            renderExternalHostInfo(),
            renderDownloadSizeWarning(),
            getSizeEstimateBytes() < DOWNLOAD_SIZE_WARN ? /*#__PURE__*/ _jsx(Divider, {}) : null,
            renderStepper(),
            renderActiveStep()
        ]
    });
}
