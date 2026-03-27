import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import CopyIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import Theme from '../Theme/Theme';
import RouteService from '../../service/RouteService';
import ReleaseService from '../../service/ReleaseService';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles((theme)=>({
        title: {
            fontWeight: 500
        },
        titleContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: theme.spacing(1)
        },
        selectInput: {
            width: '100%',
            marginBottom: theme.spacing(0.5),
            backgroundColor: '#fff'
        },
        descriptionContainer: {
            marginTop: theme.spacing(0.5)
        },
        releaseLinkDescriptionContainer: {
            marginTop: theme.spacing(0.7)
        },
        releaseLinkAltDescriptionContainer: {
            marginTop: theme.spacing(1.2)
        },
        descriptionFlexInnerContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        description: {
            display: 'block',
            color: theme.palette.grey[400],
            overflowWrap: 'break-word'
        },
        descriptionLabel: {
            fontWeight: 700,
            color: theme.palette.grey[400],
            marginRight: theme.spacing(1)
        },
        copyButton: {
            marginTop: theme.spacing(1),
            backgroundColor: '#fff',
            '& svg': {
                width: '0.9rem',
                height: '0.9rem'
            }
        },
        copyButtonAdornment: {
            padding: Theme.spacing(1.25, 1),
            backgroundColor: '#fff',
            marginRight: Theme.spacing(-1.75),
            '& svg': {
                width: '0.9rem',
                height: '0.9rem'
            }
        },
        menuItemSubtitle: {
            color: theme.palette.grey[400]
        },
        horizontalFlex: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        horizontalDescriptions: {
            marginLeft: Theme.spacing(3),
            '& > div:first-child': {
                marginTop: '-2px !important'
            }
        },
        releaseLinkButton: {
            width: '100%'
        }
    }));
const UNSPECIFIED_NAME = 'Latest and Provisional';
const UNSPECIFIED_DESCRIPTION = 'Data in the latest release in addition to provisional data (not yet in any release)';
const DOI_TITLE = 'Digital Object Identifier (DOI) - A citable permanent link to this this data product release';
const formatGenerationDate = (generationDate)=>{
    const generationMoment = moment.utc(generationDate);
    return generationMoment.isValid() ? generationMoment.format('MMMM D, YYYY') : null;
};
const defaultProps = {
    excludeNullRelease: false,
    horizontal: false,
    maxWidth: null,
    nullReleaseProductCount: null,
    onChange: ()=>{},
    releases: [],
    selected: null,
    showDoi: false,
    showGenerationDate: false,
    showProductCount: false,
    showReleaseLink: false,
    releaseLinkDisplayType: 'Button',
    skeleton: false,
    title: 'Release'
};
const ReleaseFilter = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { excludeNullRelease, horizontal, maxWidth, nullReleaseProductCount, onChange, releases: releasesProp, selected, showDoi, showGenerationDate, showProductCount, showReleaseLink, releaseLinkDisplayType, skeleton, title, ...otherProps } = props;
    const instanceId = useId();
    const inputId = `release-filter-input-${instanceId}`;
    const labelId = `release-filter-label-${instanceId}`;
    const releases = [
        ...releasesProp
    ].sort((a, b)=>a.generationDate > b.generationDate ? -1 : 1);
    // SANITY CHECK: Render nothing if there are no releases and null release is excluded
    const optionCount = releases.length + (excludeNullRelease ? 0 : 1);
    if (!optionCount) {
        return null;
    }
    const findReleaseObject = (release)=>releases.find((r)=>r.release === release) || null;
    const findRelease = (release)=>(findReleaseObject(release) || {}).release || null;
    const getProductCount = (release)=>{
        if (Array.isArray(release.dataProducts)) {
            return release.dataProducts.length;
        }
        if (Array.isArray(release.dataProductCodes)) {
            return release.dataProductCodes.length;
        }
        return null;
    };
    let selectedRelease = findRelease(selected);
    if (!selectedRelease && excludeNullRelease) {
        selectedRelease = releases[0].release;
    }
    const selectedReleaseObject = findReleaseObject(selectedRelease);
    const handleChange = (newRelease)=>{
        const validatedNewRelease = newRelease === UNSPECIFIED_NAME ? null : findRelease(newRelease);
        if (validatedNewRelease === selectedRelease) {
            return;
        }
        onChange(validatedNewRelease);
    };
    const maxWidthStyle = maxWidth ? {
        maxWidth: `${maxWidth}px`
    } : {
        width: '100%'
    };
    const input = /*#__PURE__*/ _jsx(OutlinedInput, {
        id: inputId,
        name: inputId,
        size: "small",
        className: classes.selectInput,
        style: maxWidthStyle
    });
    const releasesLink = /*#__PURE__*/ _jsx(Link, {
        href: RouteService.getDataRevisionsReleasePath(),
        target: "_blank",
        children: "Data Product Revisions and Releases"
    });
    /* eslint-disable react/jsx-one-expression-per-line */ const tooltip = /*#__PURE__*/ _jsxs("div", {
        children: [
            "A data release is a set of data files that is static (unchanging), always available to end users, and citable. See ",
            releasesLink,
            " for more details."
        ]
    });
    /* eslint-enable react/jsx-one-expression-per-line */ const titleNode = !title ? null : /*#__PURE__*/ _jsxs("div", {
        className: classes.titleContainer,
        children: [
            /*#__PURE__*/ _jsx(Typography, {
                variant: "h5",
                component: "h3",
                className: classes.title,
                id: labelId,
                children: title
            }),
            /*#__PURE__*/ _jsx(Tooltip, {
                placement: "right",
                title: tooltip,
                children: /*#__PURE__*/ _jsx(IconButton, {
                    size: "small",
                    "aria-label": tooltip,
                    style: {
                        marginLeft: Theme.spacing(0.5)
                    },
                    children: /*#__PURE__*/ _jsx(InfoIcon, {
                        fontSize: "small"
                    })
                })
            })
        ]
    });
    // Render skeleton
    if (skeleton) {
        const skeletonStyle = {
            marginBottom: Theme.spacing(1)
        };
        return /*#__PURE__*/ _jsxs("div", {
            ...otherProps,
            style: {
                ...maxWidthStyle,
                overflow: 'hidden'
            },
            children: [
                titleNode,
                /*#__PURE__*/ _jsx(Skeleton, {
                    variant: "rectangular",
                    width: maxWidth || '100%',
                    height: 36,
                    style: skeletonStyle
                }),
                /*#__PURE__*/ _jsx(Skeleton, {
                    width: "70%",
                    height: 16,
                    style: skeletonStyle
                })
            ]
        });
    }
    // Unspecified Node
    const unspecifiedNode = selectedRelease !== null ? null : /*#__PURE__*/ _jsx("div", {
        className: classes.descriptionContainer,
        children: /*#__PURE__*/ _jsx(Typography, {
            variant: "caption",
            className: classes.description,
            children: UNSPECIFIED_DESCRIPTION
        })
    });
    // Generation Date Node
    let generationDateNode = null;
    if (showGenerationDate && selectedRelease !== null) {
        generationDateNode = /*#__PURE__*/ _jsx("div", {
            className: classes.descriptionContainer,
            children: /*#__PURE__*/ _jsx(Typography, {
                variant: "caption",
                className: classes.description,
                children: `Generated: ${formatGenerationDate(selectedReleaseObject.generationDate)}`
            })
        });
    }
    // Product Count Node
    let productCountNode = null;
    if (showProductCount) {
        if (selectedRelease === null) {
            productCountNode = nullReleaseProductCount === null ? null : /*#__PURE__*/ _jsx("div", {
                className: classes.descriptionContainer,
                children: /*#__PURE__*/ _jsx(Typography, {
                    variant: "caption",
                    className: classes.description,
                    children: `${nullReleaseProductCount} data products`
                })
            });
        } else {
            const productCount = getProductCount(selectedReleaseObject);
            productCountNode = /*#__PURE__*/ _jsx("div", {
                className: classes.descriptionContainer,
                children: /*#__PURE__*/ _jsx(Typography, {
                    variant: "caption",
                    className: classes.description,
                    children: productCount !== null ? `${productCount} data products` : 'Unknown data product count'
                })
            });
        }
    }
    let releaseLinkNode = null;
    if (showReleaseLink && !ReleaseService.isLatestNonProv(selectedRelease)) {
        let appliedRelease = null;
        const hasSelectedRelease = selectedRelease !== null;
        if (!hasSelectedRelease) {
            appliedRelease = ReleaseService.getMostRecentReleaseTag(releases);
        } else {
            appliedRelease = selectedRelease;
        }
        if (appliedRelease !== null) {
            const releaseLinkTooltip = 'Click to view general information about all data products in the ' + `${appliedRelease} release`;
            switch(releaseLinkDisplayType){
                case 'Link':
                    releaseLinkNode = /*#__PURE__*/ _jsx("div", {
                        className: classes.releaseLinkDescriptionContainer,
                        children: /*#__PURE__*/ _jsx(Link, {
                            href: RouteService.getReleaseDetailPath(appliedRelease),
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: appliedRelease
                        })
                    });
                    break;
                case 'Button':
                default:
                    releaseLinkNode = /*#__PURE__*/ _jsx("div", {
                        className: classes.releaseLinkAltDescriptionContainer,
                        children: /*#__PURE__*/ _jsx(Tooltip, {
                            placement: "right",
                            title: releaseLinkTooltip,
                            children: /*#__PURE__*/ _jsx(Button, {
                                href: RouteService.getReleaseDetailPath(appliedRelease),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                variant: "outlined",
                                className: classes.releaseLinkButton,
                                endIcon: /*#__PURE__*/ _jsx(InfoIcon, {}),
                                children: "Release Details"
                            })
                        })
                    });
                    break;
            }
        }
    }
    // DOI Node
    let doiNode = null;
    if (showDoi && selectedRelease !== null) {
        const doiUrl = (selectedReleaseObject.productDoi || {}).url || null;
        doiNode = /*#__PURE__*/ _jsxs("div", {
            className: classes.descriptionContainer,
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.descriptionFlexInnerContainer,
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "caption",
                            title: DOI_TITLE,
                            className: classes.description,
                            style: {
                                marginRight: '4px'
                            },
                            children: "DOI:"
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "caption",
                            "aria-label": "doi",
                            className: classes.description,
                            style: {
                                overflowWrap: 'anywhere'
                            },
                            children: doiUrl || /*#__PURE__*/ _jsx("i", {
                                children: "none"
                            })
                        })
                    ]
                }),
                !doiUrl ? null : /*#__PURE__*/ _jsx(CopyToClipboard, {
                    text: doiUrl,
                    children: /*#__PURE__*/ _jsxs(Button, {
                        color: "primary",
                        variant: "outlined",
                        size: "small",
                        className: classes.copyButton,
                        title: `Copy DOI: ${doiUrl}`,
                        children: [
                            /*#__PURE__*/ _jsx(CopyIcon, {
                                fontSize: "small",
                                style: {
                                    marginRight: Theme.spacing(1)
                                }
                            }),
                            "Copy DOI"
                        ]
                    })
                })
            ]
        });
    }
    // Select Node
    const menuItemSubtitleProps = {
        display: 'block',
        variant: 'caption',
        className: classes.menuItemSubtitle
    };
    const selectNode = /*#__PURE__*/ _jsxs(Select, {
        "data-selenium": "release-filter",
        value: selectedRelease || UNSPECIFIED_NAME,
        onChange: (event)=>handleChange(event.target.value),
        input: input,
        "aria-labelledby": labelId,
        renderValue: (value)=>value,
        disabled: optionCount < 2,
        children: [
            excludeNullRelease ? null : /*#__PURE__*/ _jsx(MenuItem, {
                value: UNSPECIFIED_NAME,
                children: /*#__PURE__*/ _jsxs("div", {
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            display: "block",
                            children: UNSPECIFIED_NAME
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            ...menuItemSubtitleProps,
                            children: UNSPECIFIED_DESCRIPTION
                        }),
                        !showProductCount || nullReleaseProductCount === null ? null : /*#__PURE__*/ _jsx(Typography, {
                            ...menuItemSubtitleProps,
                            children: `${nullReleaseProductCount} data products`
                        })
                    ]
                })
            }),
            releases.map((entry)=>{
                const { release, generationDate } = entry;
                const productCount = getProductCount(entry);
                const productCountSubtitle = productCount !== null ? `${productCount} data products` : 'Unknown data product count';
                return /*#__PURE__*/ _jsx(MenuItem, {
                    value: release,
                    children: /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx(Typography, {
                                display: "block",
                                children: release
                            }),
                            !showGenerationDate ? null : /*#__PURE__*/ _jsx(Typography, {
                                ...menuItemSubtitleProps,
                                children: `Generated: ${formatGenerationDate(generationDate)}`
                            }),
                            !showProductCount ? null : /*#__PURE__*/ _jsx(Typography, {
                                ...menuItemSubtitleProps,
                                children: productCountSubtitle
                            })
                        ]
                    })
                }, release);
            })
        ]
    });
    // Final Render
    return horizontal ? /*#__PURE__*/ _jsxs("div", {
        ...otherProps,
        children: [
            /*#__PURE__*/ _jsx("div", {
                children: titleNode
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: classes.horizontalFlex,
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        style: maxWidth ? {
                            width: `${maxWidth}px`
                        } : {},
                        children: selectNode
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: classes.horizontalDescriptions,
                        children: [
                            unspecifiedNode,
                            generationDateNode,
                            productCountNode,
                            releaseLinkNode,
                            doiNode
                        ]
                    })
                ]
            })
        ]
    }) : /*#__PURE__*/ _jsxs("div", {
        ...otherProps,
        style: {
            width: '100%',
            ...maxWidthStyle
        },
        children: [
            titleNode,
            selectNode,
            unspecifiedNode,
            generationDateNode,
            productCountNode,
            releaseLinkNode,
            doiNode
        ]
    });
};
ReleaseFilter.propTypes = {
    excludeNullRelease: PropTypes.bool,
    horizontal: PropTypes.bool,
    maxWidth: PropTypes.number,
    nullReleaseProductCount: PropTypes.number,
    onChange: PropTypes.func,
    releases: PropTypes.arrayOf(PropTypes.shape({
        release: PropTypes.string.isRequired,
        generationDate: PropTypes.string,
        url: PropTypes.string,
        productDoi: PropTypes.shape({
            generationDate: PropTypes.string,
            url: PropTypes.string.isRequired
        })
    })),
    selected: PropTypes.string,
    showDoi: PropTypes.bool,
    showGenerationDate: PropTypes.bool,
    showProductCount: PropTypes.bool,
    showReleaseLink: PropTypes.bool,
    releaseLinkDisplayType: PropTypes.oneOf([
        'Link',
        'Button'
    ]),
    skeleton: PropTypes.bool,
    title: PropTypes.string
};
const WrappedReleaseFilter = Theme.getWrappedComponent(ReleaseFilter);
export default WrappedReleaseFilter;
