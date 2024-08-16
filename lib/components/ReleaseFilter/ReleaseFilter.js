"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _reactIdGenerator = require("react-id-generator");
var _reactCopyToClipboard = require("react-copy-to-clipboard");
var _styles = require("@mui/styles");
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _OutlinedInput = _interopRequireDefault(require("@mui/material/OutlinedInput"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Skeleton = _interopRequireDefault(require("@mui/lab/Skeleton"));
var _Assignment = _interopRequireDefault(require("@mui/icons-material/Assignment"));
var _InfoOutlined = _interopRequireDefault(require("@mui/icons-material/InfoOutlined"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _ReleaseService = _interopRequireDefault(require("../../service/ReleaseService"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
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
    padding: _Theme.default.spacing(1.25, 1),
    backgroundColor: '#fff',
    marginRight: _Theme.default.spacing(-1.75),
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
    marginLeft: _Theme.default.spacing(3),
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
const formatGenerationDate = generationDate => {
  const generationMoment = _moment.default.utc(generationDate);
  return generationMoment.isValid() ? generationMoment.format('MMMM D, YYYY') : null;
};
const ReleaseFilter = props => {
  const classes = useStyles(_Theme.default);
  const {
    excludeNullRelease,
    horizontal,
    maxWidth,
    nullReleaseProductCount,
    onChange,
    releases: releasesProp,
    selected,
    showDoi,
    showGenerationDate,
    showProductCount,
    showReleaseLink,
    releaseLinkDisplayType,
    skeleton,
    title,
    ...otherProps
  } = props;
  const [instanceId] = (0, _reactIdGenerator.useId)();
  const inputId = `release-filter-input-${instanceId}`;
  const labelId = `release-filter-label-${instanceId}`;
  const releases = [...releasesProp].sort((a, b) => a.generationDate > b.generationDate ? -1 : 1);

  // SANITY CHECK: Render nothing if there are no releases and null release is excluded
  const optionCount = releases.length + (excludeNullRelease ? 0 : 1);
  if (!optionCount) {
    return null;
  }
  const findReleaseObject = release => releases.find(r => r.release === release) || null;
  const findRelease = release => (findReleaseObject(release) || {}).release || null;
  const getProductCount = release => {
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
  const handleChange = newRelease => {
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
  const input = /*#__PURE__*/(0, _jsxRuntime.jsx)(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    margin: "dense",
    className: classes.selectInput,
    style: maxWidthStyle
  });
  const releasesLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
    href: _RouteService.default.getDataRevisionsReleasePath(),
    target: "_blank",
    children: "Data Product Revisions and Releases"
  });
  /* eslint-disable react/jsx-one-expression-per-line */
  const tooltip = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: ["A data release is a set of data files that is static (unchanging), always available to end users, and citable. See ", releasesLink, " for more details."]
  });
  /* eslint-enable react/jsx-one-expression-per-line */
  const titleNode = !title ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.titleContainer,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "h5",
      component: "h3",
      className: classes.title,
      id: labelId,
      children: title
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      placement: "right",
      title: tooltip,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        size: "small",
        "aria-label": tooltip,
        style: {
          marginLeft: _Theme.default.spacing(0.5)
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {
          fontSize: "small"
        })
      })
    })]
  });

  // Render skeleton
  if (skeleton) {
    const skeletonStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      ...otherProps,
      style: {
        ...maxWidthStyle,
        overflow: 'hidden'
      },
      children: [titleNode, /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
        variant: "rectangular",
        width: maxWidth || '100%',
        height: 36,
        style: skeletonStyle
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
        width: "70%",
        height: 16,
        style: skeletonStyle
      })]
    });
  }

  // Unspecified Node
  const unspecifiedNode = selectedRelease !== null ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.descriptionContainer,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "caption",
      className: classes.description,
      children: UNSPECIFIED_DESCRIPTION
    })
  });

  // Generation Date Node
  let generationDateNode = null;
  if (showGenerationDate && selectedRelease !== null) {
    generationDateNode = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.descriptionContainer,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
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
      productCountNode = nullReleaseProductCount === null ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.descriptionContainer,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          className: classes.description,
          children: `${nullReleaseProductCount} data products`
        })
      });
    } else {
      const productCount = getProductCount(selectedReleaseObject);
      productCountNode = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.descriptionContainer,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          className: classes.description,
          children: productCount !== null ? `${productCount} data products` : 'Unknown data product count'
        })
      });
    }
  }
  let releaseLinkNode = null;
  if (showReleaseLink && !_ReleaseService.default.isLatestNonProv(selectedRelease)) {
    let appliedRelease = null;
    const hasSelectedRelease = selectedRelease !== null;
    if (!hasSelectedRelease) {
      appliedRelease = _ReleaseService.default.getMostRecentReleaseTag(releases);
    } else {
      appliedRelease = selectedRelease;
    }
    if (appliedRelease !== null) {
      const releaseLinkTooltip = 'Click to view general information about all data products in the ' + `${appliedRelease} release`;
      switch (releaseLinkDisplayType) {
        case 'Link':
          releaseLinkNode = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: classes.releaseLinkDescriptionContainer,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
              href: _RouteService.default.getReleaseDetailPath(appliedRelease),
              target: "_blank",
              rel: "noopener noreferrer",
              children: appliedRelease
            })
          });
          break;
        case 'Button':
        default:
          releaseLinkNode = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: classes.releaseLinkAltDescriptionContainer,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
              placement: "right",
              title: releaseLinkTooltip,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
                href: _RouteService.default.getReleaseDetailPath(appliedRelease),
                target: "_blank",
                rel: "noopener noreferrer",
                variant: "outlined",
                className: classes.releaseLinkButton,
                endIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {}),
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
    doiNode = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.descriptionContainer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.descriptionFlexInnerContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          title: DOI_TITLE,
          className: classes.description,
          style: {
            marginRight: '4px'
          },
          children: "DOI:"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          "aria-label": "doi",
          className: classes.description,
          style: {
            overflowWrap: 'anywhere'
          },
          children: doiUrl || /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
            children: "none"
          })
        })]
      }), !doiUrl ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactCopyToClipboard.CopyToClipboard, {
        text: doiUrl,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Button.default, {
          color: "primary",
          variant: "outlined",
          size: "small",
          className: classes.copyButton,
          title: `Copy DOI: ${doiUrl}`,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Assignment.default, {
            fontSize: "small",
            style: {
              marginRight: _Theme.default.spacing(1)
            }
          }), "Copy DOI"]
        })
      })]
    });
  }

  // Select Node
  const menuItemSubtitleProps = {
    display: 'block',
    variant: 'caption',
    className: classes.menuItemSubtitle
  };
  const selectNode = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Select.default, {
    "data-selenium": "release-filter",
    value: selectedRelease || UNSPECIFIED_NAME,
    onChange: event => handleChange(event.target.value),
    input: input,
    "aria-labelledby": labelId,
    renderValue: value => value,
    disabled: optionCount < 2,
    children: [excludeNullRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
      value: UNSPECIFIED_NAME,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          display: "block",
          children: UNSPECIFIED_NAME
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          ...menuItemSubtitleProps,
          children: UNSPECIFIED_DESCRIPTION
        }), !showProductCount || nullReleaseProductCount === null ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          ...menuItemSubtitleProps,
          children: `${nullReleaseProductCount} data products`
        })]
      })
    }), releases.map(entry => {
      const {
        release,
        generationDate
      } = entry;
      const productCount = getProductCount(entry);
      const productCountSubtitle = productCount !== null ? `${productCount} data products` : 'Unknown data product count';
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
        value: release,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            display: "block",
            children: release
          }), !showGenerationDate ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            ...menuItemSubtitleProps,
            children: `Generated: ${formatGenerationDate(generationDate)}`
          }), !showProductCount ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            ...menuItemSubtitleProps,
            children: productCountSubtitle
          })]
        })
      }, release);
    })]
  });

  // Final Render
  return horizontal ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    ...otherProps,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: titleNode
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.horizontalFlex,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: maxWidth ? {
          width: `${maxWidth}px`
        } : {},
        children: selectNode
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.horizontalDescriptions,
        children: [unspecifiedNode, generationDateNode, productCountNode, releaseLinkNode, doiNode]
      })]
    })]
  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    ...otherProps,
    style: {
      width: '100%',
      ...maxWidthStyle
    },
    children: [titleNode, selectNode, unspecifiedNode, generationDateNode, productCountNode, releaseLinkNode, doiNode]
  });
};
ReleaseFilter.propTypes = {
  excludeNullRelease: _propTypes.default.bool,
  horizontal: _propTypes.default.bool,
  maxWidth: _propTypes.default.number,
  nullReleaseProductCount: _propTypes.default.number,
  onChange: _propTypes.default.func,
  releases: _propTypes.default.arrayOf(_propTypes.default.shape({
    release: _propTypes.default.string.isRequired,
    generationDate: _propTypes.default.string,
    url: _propTypes.default.string,
    productDoi: _propTypes.default.shape({
      generationDate: _propTypes.default.string,
      url: _propTypes.default.string.isRequired
    })
  })),
  selected: _propTypes.default.string,
  showDoi: _propTypes.default.bool,
  showGenerationDate: _propTypes.default.bool,
  showProductCount: _propTypes.default.bool,
  showReleaseLink: _propTypes.default.bool,
  releaseLinkDisplayType: _propTypes.default.oneOf(['Link', 'Button']),
  skeleton: _propTypes.default.bool,
  title: _propTypes.default.string
};
ReleaseFilter.defaultProps = {
  excludeNullRelease: false,
  horizontal: false,
  maxWidth: null,
  nullReleaseProductCount: null,
  onChange: () => {},
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
const WrappedReleaseFilter = _Theme.default.getWrappedComponent(ReleaseFilter);
var _default = exports.default = WrappedReleaseFilter;