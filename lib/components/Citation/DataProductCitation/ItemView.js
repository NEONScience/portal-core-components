import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/jsx-fragments */ import React, { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@mui/styles';
import Alert from '@mui/lab/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CopyIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import BundleContentBuilder from '../../Bundles/BundleContentBuilder';
import DataProductBundleCard from '../../Bundles/DataProductBundleCard';
import ReleaseNoticeCard from '../../Card/ReleaseNoticeCard';
import CitationService from '../../../service/CitationService';
import DataCiteService, { CitationDownloadType } from '../../../service/DataCiteService';
import RouteService from '../../../service/RouteService';
import Theme from '../../Theme/Theme';
import { withDefaultProps } from '../../../util/defaultProps';
import { PROVISIONAL_RELEASE } from '../../../service/ReleaseService';
import { exists, isStringNonEmpty } from '../../../util/typeUtil';
import ActionCreator from './Actions';
import DataProductCitationContext from './Context';
import Service from './Service';
import { FetchStatus } from './State';
import { DisplayType } from './ViewState';
const useStyles = makeStyles((theme)=>({
        cardActions: {
            flexWrap: 'wrap',
            marginTop: theme.spacing(-1),
            '&> *': {
                marginLeft: '0px !important',
                marginTop: theme.spacing(1)
            },
            '&> :not(:last-child)': {
                marginRight: theme.spacing(1)
            }
        },
        cardButton: {
            padding: '5px 10px',
            backgroundColor: '#fff',
            whiteSpace: 'nowrap'
        },
        cardButtonIcon: {
            marginRight: theme.spacing(1)
        },
        citationCard: {
            marginTop: theme.spacing(2)
        },
        citationText: {
            fontFamily: 'monospace'
        },
        citationTextOnly: {
            color: theme.palette.grey[400]
        },
        citationTextWithQualifier: {
            marginTop: theme.spacing(1.5),
            fontFamily: 'monospace'
        },
        bundleTextOnlySpacer: {
            marginBottom: theme.spacing(2)
        },
        tombstoneBlurb: {
            fontSize: '0.8rem'
        },
        noticeCardDivider: {
            margin: theme.spacing(0, 0, 2, 0)
        }
    }));
const defaultProps = {
    showQuoteIcon: false,
    disableConditional: false,
    disableSkeleton: false,
    showTextOnly: false,
    textOnlyProps: undefined
};
const DataProductCitationItemView = (props)=>{
    const { showTextOnly, textOnlyProps, citationItem, viewState, hasManyParents } = props;
    const classes = useStyles(Theme);
    const dispatch = DataProductCitationContext.useDataProductCitationContextDispatch();
    let appliedTextOnly = {
        variant: 'caption',
        cssClass: classes.citationTextOnly
    };
    if (exists(textOnlyProps)) {
        appliedTextOnly = textOnlyProps;
    }
    const { displayType, isTombstoned, releases, citationDownloadsFetchStatus } = viewState;
    const { releaseObject, doiUrl, citableBaseProduct, citableReleaseProduct, bundleParentCode } = citationItem;
    const handleResetCitationDownloadsCb = useCallback((provisionalCb, productCode)=>{
        Service.handleResetCitationDownloads(citationDownloadsFetchStatus, provisionalCb, productCode, dispatch);
    }, [
        dispatch,
        citationDownloadsFetchStatus
    ]);
    const handleCitationDownloadCb = useCallback((citationProduct, releaseCb, formatCb, provisionalCb = true)=>{
        const coercedTarget = {
            ...citationProduct
        };
        const key = Service.buildCitationDownloadKey(citationProduct, releaseCb, formatCb, provisionalCb);
        let fullDoi = Service.getReleaseDoi(releases, releaseCb);
        if (isStringNonEmpty(fullDoi) && isStringNonEmpty(doiUrl) && fullDoi !== doiUrl) {
            // In the case of multiple citations for a single product, we want to resolve
            // to the specified DOI URL for this citation, but adhere to pulling
            // from the set of releases in all other cases and to confirm a valid
            // release is present.
            fullDoi = doiUrl;
        }
        handleResetCitationDownloadsCb(provisionalCb, citationProduct.productCode);
        if (dispatch) {
            dispatch(ActionCreator.fetchCitationDownloadStarted(key));
        }
        DataCiteService.downloadCitation(formatCb, CitationDownloadType.DATA_PRODUCT, coercedTarget, fullDoi, releaseCb, (data)=>{
            if (dispatch) {
                dispatch(ActionCreator.fetchCitationDownloadSucceeded(key));
            }
        }, (error)=>{
            if (dispatch) {
                dispatch(ActionCreator.fetchCitationDownloadFailed(key, 'Citation download failed'));
            }
        });
    }, [
        dispatch,
        releases,
        doiUrl,
        handleResetCitationDownloadsCb
    ]);
    const renderTombstoneNotice = ()=>{
        if (!isTombstoned) {
            return null;
        }
        const citationRelease = releaseObject;
        let doiDisplay = ' ';
        if (citationRelease.productDoi.url) {
            const doiId = citationRelease.productDoi.url.split('/').slice(-2).join('/');
            doiDisplay = ` (DOI:${doiId}) `;
        }
        let latestAvailableReleaseBlurb = null;
        if (citableBaseProduct?.releases && citableBaseProduct?.releases.length > 0) {
            const latestAvailableProductRelease = citableBaseProduct?.releases[0];
            if (latestAvailableProductRelease.release.localeCompare(citationRelease.release) !== 0) {
                const dataProductDetailLink = /*#__PURE__*/ _jsx(Link, {
                    href: RouteService.getProductDetailPath(citableBaseProduct.productCode),
                    children: "newer release"
                });
                latestAvailableReleaseBlurb = /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        "has been replaced by a ",
                        dataProductDetailLink,
                        " and "
                    ]
                });
            }
        }
        const contactUsLink = /*#__PURE__*/ _jsx(Link, {
            href: RouteService.getContactUsPath(),
            children: "Contact Us"
        });
        const tombstoneNote = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("b", {
                    children: citationRelease.release
                }),
                " of this data product",
                doiDisplay,
                " ",
                latestAvailableReleaseBlurb,
                "is no longer available for download. If this specific release is needed for research purposes, please fill out the ",
                contactUsLink,
                " form."
            ]
        });
        return /*#__PURE__*/ _jsx(ReleaseNoticeCard, {
            messageContent: /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(Divider, {
                        className: classes.noticeCardDivider
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        color: "textPrimary",
                        className: classes.tombstoneBlurb,
                        children: tombstoneNote
                    })
                ]
            })
        });
    };
    const renderBundleParentLink = ()=>{
        if (!isStringNonEmpty(bundleParentCode) || hasManyParents) {
            return null;
        }
        const isReleaseDisplay = displayType === DisplayType.RELEASE;
        const bundleParentName = isReleaseDisplay ? citableReleaseProduct.productName : citableBaseProduct.productName;
        let titleContent;
        const dataProductLike = {
            productCode: bundleParentCode,
            productName: bundleParentName
        };
        const appliedRelease = isReleaseDisplay ? releaseObject.release : undefined;
        if (isReleaseDisplay) {
            titleContent = BundleContentBuilder.buildDefaultTitleContent(dataProductLike, appliedRelease);
        } else {
            titleContent = BundleContentBuilder.buildDefaultTitleContent(dataProductLike);
        }
        const subTitleContent = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                "The ",
                isReleaseDisplay ? 'citation below refers' : 'citations below refer',
                " to that data product as this data product is not directly citable."
            ]
        });
        return /*#__PURE__*/ _jsx("div", {
            className: showTextOnly ? classes.bundleTextOnlySpacer : undefined,
            children: /*#__PURE__*/ _jsx(DataProductBundleCard, {
                isSplit: hasManyParents,
                titleContent: titleContent,
                subTitleContent: subTitleContent
            })
        });
    };
    const renderCitationCard = (release, conditional = false, provisional = false)=>{
        const citationProduct = provisional ? citableBaseProduct : citableReleaseProduct;
        let conditionalText = null;
        let citationClassName = classes.citationText;
        if (conditional) {
            const provReleaseText = provisional ? 'If Provisional data are used, include:' : 'If Released data are used, include:';
            if (showTextOnly) {
                conditionalText = /*#__PURE__*/ _jsx(Typography, {
                    variant: appliedTextOnly.variant,
                    component: "h6",
                    className: appliedTextOnly.cssClass,
                    children: provReleaseText
                });
            } else {
                conditionalText = /*#__PURE__*/ _jsx(Typography, {
                    variant: "body1",
                    component: "h6",
                    children: provReleaseText
                });
            }
            citationClassName = classes.citationTextWithQualifier;
        }
        let citationReleaseObject = null;
        if (!provisional) {
            citationReleaseObject = releaseObject;
        }
        const citationText = CitationService.buildDataProductCitationText(citationProduct, citationReleaseObject);
        if (showTextOnly) {
            return /*#__PURE__*/ _jsxs("div", {
                children: [
                    conditionalText,
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: appliedTextOnly.variant,
                        component: "h6",
                        className: appliedTextOnly.cssClass,
                        children: citationText
                    })
                ]
            });
        }
        const isSectionDownloading = Service.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, FetchStatus.FETCHING);
        let downloadStatus;
        if (Service.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, FetchStatus.ERROR)) {
            downloadStatus = /*#__PURE__*/ _jsx(Alert, {
                severity: "error",
                onClose: ()=>handleResetCitationDownloadsCb(provisional, citationProduct.productCode),
                children: "Citation download encountered a problem"
            });
        } else if (Service.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, FetchStatus.SUCCESS)) {
            downloadStatus = /*#__PURE__*/ _jsx(Alert, {
                severity: "success",
                onClose: ()=>handleResetCitationDownloadsCb(provisional, citationProduct.productCode),
                children: "Citation downloaded"
            });
        }
        return /*#__PURE__*/ _jsxs(Card, {
            className: classes.citationCard,
            children: [
                /*#__PURE__*/ _jsxs(CardContent, {
                    children: [
                        conditionalText,
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "body1",
                            className: citationClassName,
                            children: citationText
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs(CardActions, {
                    className: classes.cardActions,
                    children: [
                        /*#__PURE__*/ _jsx(CopyToClipboard, {
                            text: citationText,
                            children: /*#__PURE__*/ _jsx(Tooltip, {
                                placement: "bottom-start",
                                title: "Click to copy the above plain text citation to the clipboard",
                                children: /*#__PURE__*/ _jsx(Button, {
                                    size: "small",
                                    color: "primary",
                                    variant: "outlined",
                                    startIcon: /*#__PURE__*/ _jsx(CopyIcon, {
                                        fontSize: "small",
                                        className: classes.cardButtonIcon
                                    }),
                                    className: classes.cardButton,
                                    children: "Copy"
                                })
                            })
                        }),
                        DataCiteService.getDataProductFormats().map((format)=>{
                            const key = Service.buildCitationDownloadKey(citationProduct, release, format.shortName, provisional);
                            const isDownloading = !exists(citationDownloadsFetchStatus[key]) ? false : citationDownloadsFetchStatus[key].status === FetchStatus.FETCHING;
                            return /*#__PURE__*/ _jsx(Tooltip, {
                                placement: "bottom-start",
                                title: `Click to download the ${citationProduct.productCode}/${release} citation as a ` + `file in ${format.longName} format`,
                                children: /*#__PURE__*/ _jsx("span", {
                                    children: /*#__PURE__*/ _jsx(Button, {
                                        size: "small",
                                        color: "primary",
                                        variant: "outlined",
                                        className: classes.cardButton,
                                        disabled: isDownloading || isSectionDownloading,
                                        startIcon: isDownloading ? /*#__PURE__*/ _jsx(CircularProgress, {
                                            size: 18,
                                            className: classes.cardButtonIcon
                                        }) : /*#__PURE__*/ _jsx(DownloadIcon, {
                                            fontSize: "small",
                                            className: classes.cardButtonIcon
                                        }),
                                        onClick: ()=>{
                                            handleCitationDownloadCb(citationProduct, release, format.shortName, provisional);
                                        },
                                        children: `Download (${format.shortName})`
                                    })
                                })
                            }, format.shortName);
                        })
                    ]
                }),
                downloadStatus
            ]
        });
    };
    let citationCard;
    switch(displayType){
        case DisplayType.CONDITIONAL:
            citationCard = /*#__PURE__*/ _jsxs(React.Fragment, {
                children: [
                    renderCitationCard(PROVISIONAL_RELEASE, true, true),
                    renderCitationCard(releaseObject.release, true, false)
                ]
            });
            break;
        case DisplayType.PROVISIONAL:
            citationCard = /*#__PURE__*/ _jsx(React.Fragment, {
                children: renderCitationCard(PROVISIONAL_RELEASE, false, true)
            });
            break;
        case DisplayType.RELEASE:
            citationCard = /*#__PURE__*/ _jsx(React.Fragment, {
                children: renderCitationCard(releaseObject.release, false, false)
            });
            break;
        case DisplayType.NOT_AVAILABLE:
        default:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
    }
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            renderTombstoneNotice(),
            renderBundleParentLink(),
            citationCard
        ]
    });
};
export default withDefaultProps(DataProductCitationItemView, defaultProps);
