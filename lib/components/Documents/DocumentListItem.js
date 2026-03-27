import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useReducer, useEffect, useCallback, useRef, useLayoutEffect, useState } from 'react';
import { of, map, catchError } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles, createStyles } from '@mui/styles';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import NeonApi from '../NeonApi';
import SplitButton from '../Button/SplitButton';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import DocumentParser from '../../parser/DocumentParser';
import DocumentService from '../../service/DocumentService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
const COMPONENT_XS_UPPER = 480;
const COMPONENT_SM_UPPER = 805;
const useStyles = makeStyles((muiTheme)=>createStyles({
        listItemContainer: {
            display: 'flex',
            overflow: 'auto'
        },
        listItem: {
            display: 'flex',
            wordBreak: 'break-word',
            paddingLeft: muiTheme.spacing(1),
            '& p': {
                marginTop: muiTheme.spacing(0.5),
                '& > span > span': {
                    whiteSpace: 'nowrap'
                }
            }
        },
        listItemSecondarySpacer: {
            margin: muiTheme.spacing(0, 2),
            color: muiTheme.palette.grey[200]
        },
        listItemIcon: {
            minWidth: muiTheme.spacing(4),
            marginRight: muiTheme.spacing(1)
        },
        fileTypeChip: {
            marginRight: '5px',
            '&:last-child': {
                marginRight: '0px'
            }
        },
        fileTypeChipSelected: {
            marginRight: '5px',
            fontWeight: 500
        },
        variantFetchingLabel: {
            lineHeight: '24px'
        },
        variantFetchingProgress: {
            marginRight: '36px',
            marginLeft: '36px'
        },
        downloadErrorContainer: {
            marginTop: muiTheme.spacing(2)
        }
    }));
const useListItemSecondaryActionStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            position: 'unset',
            transform: 'unset',
            top: 'unset',
            right: 'unset',
            whiteSpace: 'nowrap'
        }
    }));
var ActionTypes = /*#__PURE__*/ function(ActionTypes) {
    ActionTypes["FETCH_VARIANTS_STARTED"] = "FETCH_VARIANTS_STARTED";
    ActionTypes["FETCH_VARIANTS_FAILED"] = "FETCH_VARIANTS_FAILED";
    ActionTypes["FETCH_VARIANTS_SUCCEEDED"] = "FETCH_VARIANTS_SUCCEEDED";
    ActionTypes["SET_SELECTED_VARIANT"] = "SET_SELECTED_VARIANT";
    ActionTypes["DOWNLOAD_IDLE"] = "DOWNLOAD_IDLE";
    ActionTypes["DOWNLOAD_STARTED"] = "DOWNLOAD_STARTED";
    ActionTypes["DOWNLOAD_FAILED"] = "DOWNLOAD_FAILED";
    return ActionTypes;
}(ActionTypes || {});
const ActionCreator = {
    fetchVariantsStarted: ()=>({
            type: "FETCH_VARIANTS_STARTED"
        }),
    fetchVariantsFailed: (error)=>({
            type: "FETCH_VARIANTS_FAILED",
            error
        }),
    fetchVariantsSucceeded: (variants)=>({
            type: "FETCH_VARIANTS_SUCCEEDED",
            variants
        }),
    setSelectedVariant: (variant)=>({
            type: "SET_SELECTED_VARIANT",
            variant
        }),
    downloadIdle: ()=>({
            type: "DOWNLOAD_IDLE"
        }),
    downloadStarted: ()=>({
            type: "DOWNLOAD_STARTED"
        }),
    downloadFailed: ()=>({
            type: "DOWNLOAD_FAILED"
        })
};
var FetchStatus = /*#__PURE__*/ function(FetchStatus) {
    FetchStatus["AWAITING_CALL"] = "AWAITING_CALL";
    FetchStatus["FETCHING"] = "FETCHING";
    FetchStatus["ERROR"] = "ERROR";
    FetchStatus["SUCCESS"] = "SUCCESS";
    FetchStatus["IDLE"] = "IDLE";
    return FetchStatus;
}(FetchStatus || {});
const DEFAULT_STATE = {
    fetchVariants: {
        status: "IDLE",
        error: null
    },
    variants: [],
    selectedVariant: null,
    downloadStatus: "IDLE"
};
const documentListItemReducer = (state, action)=>{
    const newState = {
        ...state
    };
    let fetchVariantFailedAction;
    let fetchVariantSucceededAction;
    let setSelectedVariantAction;
    switch(action.type){
        case "FETCH_VARIANTS_STARTED":
            newState.fetchVariants.status = "FETCHING";
            return newState;
        case "FETCH_VARIANTS_FAILED":
            fetchVariantFailedAction = action;
            newState.fetchVariants.status = "ERROR";
            newState.fetchVariants.error = fetchVariantFailedAction.error;
            return newState;
        case "FETCH_VARIANTS_SUCCEEDED":
            fetchVariantSucceededAction = action;
            newState.fetchVariants.status = "SUCCESS";
            newState.variants = fetchVariantSucceededAction.variants;
            if (!exists(newState.selectedVariant) && existsNonEmpty(newState.variants)) {
                // eslint-disable-next-line prefer-destructuring
                newState.selectedVariant = newState.variants[0];
            }
            return newState;
        case "SET_SELECTED_VARIANT":
            setSelectedVariantAction = action;
            newState.selectedVariant = setSelectedVariantAction.variant;
            return newState;
        case "DOWNLOAD_IDLE":
            newState.downloadStatus = "IDLE";
            return newState;
        case "DOWNLOAD_STARTED":
            newState.downloadStatus = "FETCHING";
            return newState;
        case "DOWNLOAD_FAILED":
            newState.downloadStatus = "ERROR";
            return newState;
        default:
            return newState;
    }
};
const DocumentListItem = (props)=>{
    const { id, document, makeDownloadableLink, enableDownloadButton, fetchVariants, enableVariantChips, containerComponent } = props;
    const classes = useStyles(Theme);
    const listItemSecondaryActionClasses = useListItemSecondaryActionStyles(Theme);
    // eslint-disable-next-line max-len
    const containerRef = useRef(undefined);
    const [componentWidth, setComponentWidth] = useState(0);
    let atComponentXs = false;
    let atComponentSm = false;
    if (componentWidth > 0) {
        atComponentXs = componentWidth <= COMPONENT_XS_UPPER;
        atComponentSm = componentWidth >= COMPONENT_XS_UPPER && componentWidth < COMPONENT_SM_UPPER;
    }
    const [state, dispatch] = useReducer(documentListItemReducer, cloneDeep(DEFAULT_STATE));
    const { fetchVariants: { status: fetchVariantStatus }, variants: stateVariants, selectedVariant: stateSelectedVariant, downloadStatus } = state;
    const hasDocument = exists(document);
    const hasProvidedVariants = hasDocument && existsNonEmpty(document.variants);
    const isQsg = DocumentService.isQuickStartGuide(document);
    const appliedFetchVariants = !hasProvidedVariants && fetchVariants === true;
    const requireVariantFetch = isQsg && appliedFetchVariants && fetchVariantStatus === "IDLE";
    useEffect(()=>{
        if (!hasDocument || !requireVariantFetch) {
            return;
        }
        const qsgParsedName = DocumentService.parseQuickStartGuideName(document.name);
        if (!exists(qsgParsedName)) {
            return;
        }
        const coercedParsedName = qsgParsedName;
        const variantObs = NeonApi.getQuickStartGuideDetailObservable(coercedParsedName.matchedName, coercedParsedName.matchedVersion).pipe(map((response)=>{
            if (!exists(response) || !exists(response.data)) {
                dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
                return of(false);
            }
            const qsgResponse = DocumentParser.parseQuickStartGuideVersionResponse(response);
            if (!exists(qsgResponse)) {
                dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
                return of(false);
            }
            const coercedQsgDocumentResponse = qsgResponse;
            const qsgDocuments = coercedQsgDocumentResponse.documents;
            const variantDocuments = DocumentService.transformQuickStartGuideDocuments(qsgDocuments);
            if (!existsNonEmpty(variantDocuments)) {
                dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
                return of(false);
            }
            dispatch(ActionCreator.fetchVariantsSucceeded(variantDocuments));
            return of(true);
        }), catchError((error)=>{
            dispatch(ActionCreator.fetchVariantsFailed(error));
            return of(false);
        }));
        dispatch(ActionCreator.fetchVariantsStarted());
        variantObs.subscribe();
    }, [
        hasDocument,
        requireVariantFetch,
        document
    ]);
    const handleSelectedVariantChanged = useCallback((selectedVariantCb)=>{
        dispatch(ActionCreator.setSelectedVariant(selectedVariantCb));
    }, [
        dispatch
    ]);
    const handleDownloadIdle = useCallback(()=>{
        dispatch(ActionCreator.downloadIdle());
    }, [
        dispatch
    ]);
    const handleDownloadStarted = useCallback(()=>{
        dispatch(ActionCreator.downloadStarted());
    }, [
        dispatch
    ]);
    const handleDownloadFailed = useCallback(()=>{
        dispatch(ActionCreator.downloadFailed());
    }, [
        dispatch
    ]);
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
    if (!hasDocument) {
        return null;
    }
    const isFetchingVariants = fetchVariantStatus === "FETCHING";
    const appliedDocument = exists(stateSelectedVariant) ? stateSelectedVariant : document;
    const appliedVariants = appliedFetchVariants ? stateVariants : document.variants;
    const hasAppliedVariants = existsNonEmpty(appliedVariants);
    const isDownloading = downloadStatus === "FETCHING";
    const isDownloadError = downloadStatus === "ERROR";
    const documentType = DocumentService.resolveDocumentType(appliedDocument);
    const { title: typeTitle, Icon: TypeIcon } = documentType;
    const typeTitleString = typeTitle(appliedDocument.type);
    const primary = isStringNonEmpty(appliedDocument.description) ? appliedDocument.description : /*#__PURE__*/ _jsx("i", {
        children: "No description"
    });
    const spacer = /*#__PURE__*/ _jsx("span", {
        className: classes.listItemSecondarySpacer,
        children: "|"
    });
    const renderTypes = ()=>{
        if (!(enableVariantChips === true)) {
            return /*#__PURE__*/ _jsx("span", {
                title: `file type: ${typeTitleString}`,
                children: typeTitleString
            });
        }
        if (isFetchingVariants) {
            return /*#__PURE__*/ _jsx(Typography, {
                variant: "caption",
                className: classes.variantFetchingLabel,
                children: "Determining variants..."
            });
        }
        if (!hasAppliedVariants) {
            return /*#__PURE__*/ _jsx(Chip, {
                variant: undefined,
                className: classes.fileTypeChipSelected,
                style: {
                    marginRight: '0px'
                },
                component: "span",
                size: "small",
                label: typeTitleString
            }, appliedDocument.name);
        }
        return /*#__PURE__*/ _jsx(_Fragment, {
            children: appliedVariants.map((variant, index)=>{
                const variantTypeTitleString = DocumentService.getDocumentTypeTitle(variant);
                const isSelected = appliedDocument.name === variant.name;
                const isLast = index === appliedVariants.length - 1;
                return /*#__PURE__*/ _jsx(Chip, {
                    variant: isSelected ? undefined : 'outlined',
                    className: isSelected ? classes.fileTypeChipSelected : classes.fileTypeChip,
                    style: {
                        marginRight: isLast ? '0px' : undefined
                    },
                    component: "span",
                    size: "small",
                    label: variantTypeTitleString,
                    disabled: isDownloading || isDownloadError,
                    onClick: (event)=>{
                        handleSelectedVariantChanged(variant);
                    }
                }, variant.name);
            })
        });
    };
    const renderSecondaryItem = ()=>{
        let sizeDisplay = /*#__PURE__*/ _jsx("span", {
            children: /*#__PURE__*/ _jsx("i", {
                children: "n/a"
            })
        });
        if (appliedDocument.size) {
            sizeDisplay = /*#__PURE__*/ _jsx("span", {
                title: `file size: ${DocumentService.formatBytes(appliedDocument.size)}`,
                children: DocumentService.formatBytes(appliedDocument.size)
            });
        }
        const fileNumber = /*#__PURE__*/ _jsx("span", {
            style: {
                whiteSpace: 'break-spaces'
            },
            title: `file number: ${appliedDocument.name}`,
            children: appliedDocument.name
        });
        if (atComponentSm || atComponentXs) {
            if (hasAppliedVariants) {
                return /*#__PURE__*/ _jsxs("span", {
                    children: [
                        fileNumber,
                        /*#__PURE__*/ _jsx("span", {
                            style: {
                                height: '5px',
                                display: 'block'
                            }
                        }),
                        renderTypes(),
                        /*#__PURE__*/ _jsx("span", {
                            style: {
                                height: '5px',
                                display: 'block'
                            }
                        }),
                        sizeDisplay
                    ]
                });
            }
            return /*#__PURE__*/ _jsxs("span", {
                children: [
                    fileNumber,
                    /*#__PURE__*/ _jsx("span", {
                        style: {
                            height: '5px',
                            display: 'block'
                        }
                    }),
                    renderTypes(),
                    spacer,
                    sizeDisplay
                ]
            });
        }
        return /*#__PURE__*/ _jsxs("span", {
            children: [
                renderTypes(),
                spacer,
                sizeDisplay,
                spacer,
                fileNumber
            ]
        });
    };
    const renderAction = ()=>{
        if (!(enableDownloadButton === true)) return null;
        if (isFetchingVariants) {
            return /*#__PURE__*/ _jsx(ListItemSecondaryAction, {
                classes: listItemSecondaryActionClasses,
                children: /*#__PURE__*/ _jsx(CircularProgress, {
                    size: 36,
                    className: classes.variantFetchingProgress
                })
            });
        }
        if (atComponentXs) {
            return /*#__PURE__*/ _jsx(ListItemSecondaryAction, {
                classes: listItemSecondaryActionClasses,
                children: /*#__PURE__*/ _jsx(Tooltip, {
                    placement: "top",
                    title: `Download ${appliedDocument.name}`,
                    children: /*#__PURE__*/ _jsx("div", {
                        children: /*#__PURE__*/ _jsx(IconButton, {
                            color: "primary",
                            disabled: isDownloading || isDownloadError,
                            onClick: ()=>{
                                handleDownloadStarted();
                                DocumentService.downloadDocument(appliedDocument, (downloadDoc)=>handleDownloadIdle(), (downloadDoc)=>handleDownloadFailed());
                            },
                            size: "large",
                            children: isDownloading ? /*#__PURE__*/ _jsx(CircularProgress, {
                                size: 18
                            }) : /*#__PURE__*/ _jsx(DownloadIcon, {
                                fontSize: "small"
                            })
                        })
                    })
                })
            });
        }
        const button = !hasAppliedVariants ? /*#__PURE__*/ _jsx(Button, {
            variant: "outlined",
            disabled: isDownloading || isDownloadError,
            startIcon: isDownloading ? /*#__PURE__*/ _jsx(CircularProgress, {
                size: 18
            }) : /*#__PURE__*/ _jsx(DownloadIcon, {
                fontSize: "small"
            }),
            onClick: ()=>{
                handleDownloadStarted();
                DocumentService.downloadDocument(appliedDocument, (downloadDoc)=>handleDownloadIdle(), (downloadDoc)=>handleDownloadFailed());
            },
            children: "Download"
        }) : /*#__PURE__*/ _jsx(SplitButton, {
            name: `${appliedDocument.name}-document-list-item-download-split-button`,
            selectedOption: `${typeTitleString}`,
            selectedOptionDisplayCallback: (selectedOption)=>`Download ${selectedOption}`,
            options: appliedVariants.map((variant)=>DocumentService.getDocumentTypeTitle(variant)),
            onClick: (option)=>{
                const nextSelectedVariant = DocumentService.findFirstByDocumentTypeTitle(appliedVariants, option);
                if (exists(nextSelectedVariant)) {
                    const coercedDownloadVariant = nextSelectedVariant;
                    handleDownloadStarted();
                    DocumentService.downloadDocument(coercedDownloadVariant, (downloadDoc)=>handleDownloadIdle(), (downloadDoc)=>handleDownloadFailed());
                }
            },
            onChange: (option)=>{
                const nextSelectedVariant = DocumentService.findFirstByDocumentTypeTitle(appliedVariants, option);
                if (exists(nextSelectedVariant)) {
                    handleSelectedVariantChanged(nextSelectedVariant);
                }
            },
            buttonGroupProps: {
                size: 'small',
                variant: 'outlined',
                color: 'primary'
            },
            buttonMenuProps: {
                size: 'small',
                color: 'primary',
                disabled: isDownloading || isDownloadError
            },
            buttonProps: {
                size: 'small',
                color: 'primary',
                disabled: isDownloading || isDownloadError,
                startIcon: isDownloading ? /*#__PURE__*/ _jsx(CircularProgress, {
                    size: 18
                }) : /*#__PURE__*/ _jsx(DownloadIcon, {
                    fontSize: "small"
                })
            }
        });
        return /*#__PURE__*/ _jsx(ListItemSecondaryAction, {
            classes: listItemSecondaryActionClasses,
            children: button
        });
    };
    const renderDownloadError = ()=>{
        if (!isDownloadError) return null;
        return /*#__PURE__*/ _jsx("div", {
            className: classes.downloadErrorContainer,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: `Document download is currently unavailable for "${appliedDocument.name}."`,
                onActionClick: ()=>handleDownloadIdle()
            })
        });
    };
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxs(ListItem, {
                ref: containerRef,
                className: classes.listItem,
                component: "div",
                ContainerComponent: containerComponent,
                ContainerProps: {
                    className: classes.listItemContainer
                },
                title: makeDownloadableLink ? `Click to download ${document.name}` : undefined,
                button: makeDownloadableLink,
                onClick: !makeDownloadableLink ? undefined : ()=>{
                    handleDownloadStarted();
                    DocumentService.downloadDocument(appliedDocument, (downloadDoc)=>handleDownloadIdle(), (downloadDoc)=>handleDownloadFailed());
                },
                children: [
                    /*#__PURE__*/ _jsx(ListItemIcon, {
                        className: classes.listItemIcon,
                        children: /*#__PURE__*/ _jsx(TypeIcon, {})
                    }),
                    /*#__PURE__*/ _jsx(ListItemText, {
                        primary: primary,
                        secondary: renderSecondaryItem()
                    }),
                    renderAction()
                ]
            }, id),
            renderDownloadError()
        ]
    });
};
const WrappedDocumentListItem = Theme.getWrappedComponent(DocumentListItem);
export default WrappedDocumentListItem;
