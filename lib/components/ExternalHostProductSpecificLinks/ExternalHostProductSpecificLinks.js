import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import ExternalHost from '../ExternalHost/ExternalHost';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles((theme)=>({
        siteLinksContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: theme.spacing(3)
        },
        siteLinksLoadingContainer: {
            marginTop: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        ulLinkList: {
            paddingLeft: theme.spacing(2),
            margin: theme.spacing(0.5, 0),
            fontSize: '0.85rem',
            '& > li': {
                marginBottom: theme.spacing(0.5)
            }
        }
    }));
const defaultProps = {
    productCode: null,
    siteCodes: null
};
export default function ExternalHostProductSpecificLinks(inProps) {
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { productCode, siteCodes } = props;
    const [{ data: neonContextData, isFinal: neonContextIsFinal }] = NeonContext.useNeonContextState();
    const { sites: allSites, states: allStates } = neonContextData;
    const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
    const belowMd = useMediaQuery(Theme.breakpoints.down('ms'));
    const belowLg = useMediaQuery(Theme.breakpoints.down('lg'));
    const externalHost = ExternalHost.getByProductCode(productCode);
    if (!externalHost || !Object.keys(ExternalHost.LINK_TYPES).includes(externalHost.linkType)) {
        return null;
    }
    let columnBasis = '25%';
    if (belowLg) {
        columnBasis = '33.33%';
    }
    if (belowMd) {
        columnBasis = '50%';
    }
    if (belowSm) {
        columnBasis = '100%';
    }
    const listDivStyle = {
        flex: `1 0 ${columnBasis}`,
        padding: Theme.spacing(0, 2, 2, 0)
    };
    const renderLinksByProduct = ()=>{
        if (typeof externalHost.getProductLinks !== 'function') {
            return null;
        }
        return /*#__PURE__*/ _jsx("ul", {
            style: {
                marginTop: Theme.spacing(3),
                marginBottom: Theme.spacing(0.75)
            },
            children: (externalHost.getProductLinks(productCode) || []).map((link)=>/*#__PURE__*/ _jsx("li", {
                    children: link.node
                }, link.key))
        });
    };
    const renderLinksBySite = ()=>{
        if (typeof externalHost.getSiteLink !== 'function') {
            return null;
        }
        // What sites are available? If a list was not provided then show them all.
        const filterByAvailability = Array.isArray(siteCodes) && siteCodes.length;
        let availableSites = allSites;
        if (filterByAvailability) {
            availableSites = Object.fromEntries(siteCodes.map((siteCode)=>[
                    siteCode,
                    allSites[siteCode]
                ]));
        }
        // Sites still loading; render loading message
        if (!neonContextIsFinal) {
            return /*#__PURE__*/ _jsxs("div", {
                className: classes.siteLinksLoadingContainer,
                children: [
                    /*#__PURE__*/ _jsx(CircularProgress, {
                        size: 36,
                        style: {
                            margin: Theme.spacing(4, 0)
                        }
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body1",
                        style: {
                            marginBottom: Theme.spacing(4)
                        },
                        children: "Loading sites..."
                    })
                ]
            });
        }
        // Sites failed to load; render failure
        if (!Object.keys(allSites).length) {
            return /*#__PURE__*/ _jsxs("div", {
                className: classes.siteLinksLoadingContainer,
                children: [
                    /*#__PURE__*/ _jsx(WarningIcon, {
                        fontSize: "large",
                        style: {
                            margin: Theme.spacing(4, 0),
                            color: Theme.palette.error.main
                        }
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body1",
                        style: {
                            marginBottom: Theme.spacing(4)
                        },
                        children: "Sites failed to load."
                    })
                ]
            });
        }
        // Sites loaded; build a structure of available sites grouped by state and render links as such
        const sitesByStateName = {};
        Object.keys(availableSites).sort().forEach((siteCode)=>{
            const stateName = allStates[allSites[siteCode].stateCode].name;
            if (!sitesByStateName[stateName]) {
                sitesByStateName[stateName] = [];
            }
            sitesByStateName[stateName].push(siteCode);
        });
        return /*#__PURE__*/ _jsx("div", {
            className: classes.siteLinksContainer,
            children: Object.keys(sitesByStateName).sort().map((stateName)=>{
                const links = sitesByStateName[stateName].filter((siteCode)=>!filterByAvailability || siteCodes.includes(siteCode)).map((siteCode)=>({
                        siteCode,
                        link: externalHost.getSiteLink(allSites, siteCode, productCode)
                    })).filter((entry)=>entry.link !== null);
                if (!links.length) {
                    return null;
                }
                return /*#__PURE__*/ _jsxs("div", {
                    style: listDivStyle,
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "subtitle2",
                            children: stateName
                        }, stateName),
                        /*#__PURE__*/ _jsx("ul", {
                            className: classes.ulLinkList,
                            children: links.map((entry)=>/*#__PURE__*/ _jsx("li", {
                                    children: entry.link
                                }, entry.siteCode))
                        })
                    ]
                }, stateName);
            })
        });
    };
    switch(externalHost.linkType){
        case ExternalHost.LINK_TYPES.BY_PRODUCT:
            return renderLinksByProduct();
        case ExternalHost.LINK_TYPES.BY_SITE:
            return renderLinksBySite();
        default:
            return null;
    }
}
ExternalHostProductSpecificLinks.propTypes = {
    productCode: PropTypes.string,
    siteCodes: PropTypes.arrayOf(PropTypes.string)
};
