import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import QuoteIcon from '@mui/icons-material/FormatQuote';
import BundleContentBuilder from '../../Bundles/BundleContentBuilder';
import DataProductBundleCard from '../../Bundles/DataProductBundleCard';
import ErrorCard from '../../Card/ErrorCard';
import WarningCard from '../../Card/WarningCard';
import Theme from '../../Theme/Theme';
import RouteService from '../../../service/RouteService';
import { withDefaultProps } from '../../../util/defaultProps';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../../util/typeUtil';
import DataProductCitationContext from './Context';
import DataProductCitationItemView from './ItemView';
import Service from './Service';
import { ContextStatus } from './State';
import { DisplayType } from './ViewState';
const useStyles = makeStyles((theme)=>({
        citationTextOnly: {
            color: theme.palette.grey[400]
        },
        calloutIcon: {
            color: theme.palette.grey[300],
            marginRight: theme.spacing(2)
        },
        citationUseFlexContainer: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: theme.spacing(3)
        },
        citationUseText: {
            flexGrow: 1
        },
        itemContainer: {
            marginBottom: theme.spacing(2)
        }
    }));
export const defaultProps = {
    showQuoteIcon: false,
    disableConditional: false,
    disableSkeleton: false,
    showTextOnly: false,
    textOnlyProps: undefined,
    showManyParents: true
};
const DataProductCitationView = (props)=>{
    const { showQuoteIcon, disableSkeleton, showTextOnly, textOnlyProps, showManyParents } = props;
    const classes = useStyles(Theme);
    const state = DataProductCitationContext.useDataProductCitationContextState();
    let appliedTextOnly = {
        variant: 'caption',
        cssClass: classes.citationTextOnly
    };
    if (exists(textOnlyProps)) {
        appliedTextOnly = textOnlyProps;
    }
    const viewState = Service.useViewState(state, props);
    const { status, displayType, citationItems } = viewState;
    const bundleParentCodes = {};
    const hasManyParents = citationItems.length > 1;
    citationItems.forEach((item)=>{
        if (!exists(item) || !isStringNonEmpty(item.bundleParentCode)) {
            return;
        }
        const key = `${item.bundleParentCode}:${item.releaseObject?.release}`;
        if (!exists(bundleParentCodes[key])) {
            bundleParentCodes[key] = {
                productCode: item.bundleParentCode,
                release: item.releaseObject?.release || null
            };
        }
    });
    const renderSkeleton = ()=>{
        if (disableSkeleton) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsxs(Grid, {
            container: true,
            spacing: 2,
            children: [
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: /*#__PURE__*/ _jsx(Skeleton, {
                        variant: "rectangular",
                        width: "100%",
                        height: 40
                    })
                }),
                !showTextOnly ? /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: /*#__PURE__*/ _jsx(Skeleton, {
                        variant: "rectangular",
                        width: "100%",
                        height: 180
                    })
                }) : null
            ]
        });
    };
    const renderError = ()=>{
        const errorTitle = 'Data Product Citation Generation Error';
        if (showTextOnly) {
            return /*#__PURE__*/ _jsx(Typography, {
                variant: appliedTextOnly.variant,
                component: "h6",
                className: appliedTextOnly.cssClass,
                children: errorTitle
            });
        }
        return /*#__PURE__*/ _jsx(Grid, {
            container: true,
            spacing: 2,
            children: /*#__PURE__*/ _jsx(Grid, {
                item: true,
                xs: 12,
                children: /*#__PURE__*/ _jsx(ErrorCard, {
                    title: errorTitle
                })
            })
        });
    };
    const renderNotAvailable = ()=>{
        const errorTitle = 'Data Product Citation Not Available';
        const errorMessage = 'A citation is not available for the specified data product and release.';
        if (showTextOnly) {
            return /*#__PURE__*/ _jsx("div", {
                children: /*#__PURE__*/ _jsx(Typography, {
                    variant: appliedTextOnly.variant,
                    component: "h6",
                    className: appliedTextOnly.cssClass,
                    children: `${errorTitle}: ${errorMessage}`
                })
            });
        }
        return /*#__PURE__*/ _jsx(Grid, {
            container: true,
            spacing: 2,
            children: /*#__PURE__*/ _jsx(Grid, {
                item: true,
                xs: 12,
                children: /*#__PURE__*/ _jsx(WarningCard, {
                    title: errorTitle,
                    message: errorMessage
                })
            })
        });
    };
    const renderCitationBlurb = ()=>{
        if (showTextOnly) {
            return null;
        }
        const showNonConditionalBlurb = [
            DisplayType.RELEASE,
            DisplayType.PROVISIONAL
        ].includes(displayType);
        const quoteIcon = showQuoteIcon ? /*#__PURE__*/ _jsx(QuoteIcon, {
            fontSize: "large",
            className: classes.calloutIcon
        }) : null;
        let blurb = 'Please use the appropriate citation(s) from below in your publications. ' + 'If using both provisional and release data please include both citations. ';
        if (showNonConditionalBlurb) {
            blurb = 'Please use this citation in your publications. ';
        }
        const dataPolicyLink = /*#__PURE__*/ _jsx(Link, {
            href: RouteService.getDataPoliciesCitationPath(),
            children: "Data Policies & Citation Guidelines"
        });
        return /*#__PURE__*/ _jsxs("div", {
            className: classes.citationUseFlexContainer,
            children: [
                quoteIcon,
                /*#__PURE__*/ _jsxs(Typography, {
                    variant: "subtitle2",
                    className: classes.citationUseText,
                    children: [
                        blurb,
                        "See ",
                        dataPolicyLink,
                        " for more info."
                    ]
                })
            ]
        });
    };
    const renderBundleParentsCard = ()=>{
        const filteredCitationItems = citationItems.filter((item)=>exists(item) && exists(item.citableBaseProduct) && exists(item.citableReleaseProduct) && isStringNonEmpty(item.bundleParentCode) && exists(item.releaseObject));
        if (!existsNonEmpty(filteredCitationItems) || filteredCitationItems.length <= 1) {
            return null;
        }
        const isReleaseDisplay = displayType === DisplayType.RELEASE;
        const bundleNoteTerminalChar = !showManyParents ? '.' : ':';
        const titleContent = BundleContentBuilder.buildDefaultSplitTitleContent(isReleaseDisplay, bundleNoteTerminalChar);
        const detailContent = !showManyParents ? undefined : /*#__PURE__*/ _jsx("ul", {
            style: {
                margin: Theme.spacing(1, 0)
            },
            children: filteredCitationItems.map((item)=>{
                const bundleParentName = isReleaseDisplay ? item.citableReleaseProduct.productName : item.citableBaseProduct.productName;
                let bundleParentHref = RouteService.getProductDetailPath(item.bundleParentCode);
                if (isReleaseDisplay) {
                    bundleParentHref = RouteService.getProductDetailPath(item.bundleParentCode, item.releaseObject.release);
                }
                return /*#__PURE__*/ _jsx("li", {
                    children: /*#__PURE__*/ _jsx(Link, {
                        href: bundleParentHref,
                        target: "_blank",
                        children: `${bundleParentName} (${item.bundleParentCode})`
                    })
                }, bundleParentHref);
            })
        });
        let subTitleContent = !showManyParents ? undefined : /*#__PURE__*/ _jsx(_Fragment, {
            children: "Use either or both citations as appropriate."
        });
        if (showManyParents && filteredCitationItems.length > 2) {
            subTitleContent = /*#__PURE__*/ _jsx(_Fragment, {
                children: "Use citations as appropriate."
            });
        }
        return /*#__PURE__*/ _jsx("div", {
            className: classes.itemContainer,
            children: /*#__PURE__*/ _jsx(DataProductBundleCard, {
                isSplit: hasManyParents,
                titleContent: titleContent,
                detailContent: detailContent,
                subTitleContent: subTitleContent
            })
        });
    };
    const renderItems = ()=>citationItems.map((item, index)=>/*#__PURE__*/ _jsx("div", {
                className: classes.itemContainer,
                children: /*#__PURE__*/ _jsx(DataProductCitationItemView, {
                    ...props,
                    citationItem: item,
                    viewState: viewState,
                    hasManyParents: hasManyParents
                })
            }, `DataProductCitationItemKey-${item.doiUrl || index}`));
    const renderCitationDisplay = ()=>{
        switch(displayType){
            case DisplayType.CONDITIONAL:
            case DisplayType.PROVISIONAL:
            case DisplayType.RELEASE:
                break;
            case DisplayType.NOT_AVAILABLE:
                return renderNotAvailable();
            default:
                // Invalid state, return error state.
                return renderError();
        }
        return /*#__PURE__*/ _jsxs("div", {
            children: [
                renderCitationBlurb(),
                renderBundleParentsCard(),
                renderItems()
            ]
        });
    };
    switch(status){
        case ContextStatus.INITIALIZING:
        case ContextStatus.FETCHING:
        case ContextStatus.HAS_FETCHES_TO_TRIGGER:
            return renderSkeleton();
        case ContextStatus.ERROR:
            return renderError();
        case ContextStatus.READY:
        default:
            break;
    }
    return renderCitationDisplay();
};
export default withDefaultProps(DataProductCitationView, defaultProps);
