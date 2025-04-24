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
var _styles = require("@material-ui/core/styles");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));
var _Select = _interopRequireDefault(require("@material-ui/core/Select"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _Assignment = _interopRequireDefault(require("@material-ui/icons/Assignment"));
var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _ReleaseService = _interopRequireDefault(require("../../service/ReleaseService"));
const _excluded = ["excludeNullRelease", "horizontal", "maxWidth", "nullReleaseProductCount", "onChange", "releases", "selected", "showDoi", "showGenerationDate", "showProductCount", "showReleaseLink", "releaseLinkDisplayType", "skeleton", "title"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
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
      title
    } = props,
    otherProps = _objectWithoutPropertiesLoose(props, _excluded);
  const [instanceId] = (0, _reactIdGenerator.useId)();
  const inputId = "release-filter-input-".concat(instanceId);
  const labelId = "release-filter-label-".concat(instanceId);
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
    maxWidth: "".concat(maxWidth, "px")
  } : {
    width: '100%'
  };
  const input = /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    margin: "dense",
    className: classes.selectInput,
    style: maxWidthStyle
  });
  const releasesLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    href: _RouteService.default.getDataRevisionsReleasePath(),
    target: "_blank"
  }, "Data Product Revisions and Releases");
  /* eslint-disable react/jsx-one-expression-per-line */
  const tooltip = /*#__PURE__*/_react.default.createElement("div", null, "A data release is a set of data files that is static (unchanging), always available to end users, and citable. See ", releasesLink, " for more details.");
  /* eslint-enable react/jsx-one-expression-per-line */
  const titleNode = !title ? null : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.titleContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    component: "h3",
    className: classes.title,
    id: labelId
  }, title), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: tooltip,
    interactive: true
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    size: "small",
    "aria-label": tooltip,
    style: {
      marginLeft: _Theme.default.spacing(0.5)
    }
  }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
    fontSize: "small"
  }))));

  // Render skeleton
  if (skeleton) {
    const skeletonStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps, {
      style: _extends({}, maxWidthStyle, {
        overflow: 'hidden'
      })
    }), titleNode, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: maxWidth || '100%',
      height: 36,
      style: skeletonStyle
    }), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      width: "70%",
      height: 16,
      style: skeletonStyle
    }));
  }

  // Unspecified Node
  const unspecifiedNode = selectedRelease !== null ? null : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.descriptionContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.description
  }, UNSPECIFIED_DESCRIPTION));

  // Generation Date Node
  let generationDateNode = null;
  if (showGenerationDate && selectedRelease !== null) {
    generationDateNode = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.descriptionContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      className: classes.description
    }, "Generated: ".concat(formatGenerationDate(selectedReleaseObject.generationDate))));
  }

  // Product Count Node
  let productCountNode = null;
  if (showProductCount) {
    if (selectedRelease === null) {
      productCountNode = nullReleaseProductCount === null ? null : /*#__PURE__*/_react.default.createElement("div", {
        className: classes.descriptionContainer
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        className: classes.description
      }, "".concat(nullReleaseProductCount, " data products")));
    } else {
      const productCount = getProductCount(selectedReleaseObject);
      productCountNode = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.descriptionContainer
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        className: classes.description
      }, productCount !== null ? "".concat(productCount, " data products") : 'Unknown data product count'));
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
      const releaseLinkTooltip = 'Click to view general information about all data products in the ' + "".concat(appliedRelease, " release");
      switch (releaseLinkDisplayType) {
        case 'Link':
          releaseLinkNode = /*#__PURE__*/_react.default.createElement("div", {
            className: classes.releaseLinkDescriptionContainer
          }, /*#__PURE__*/_react.default.createElement(_Link.default, {
            href: _RouteService.default.getReleaseDetailPath(appliedRelease),
            target: "_blank",
            rel: "noopener noreferrer"
          }, appliedRelease));
          break;
        case 'Button':
        default:
          releaseLinkNode = /*#__PURE__*/_react.default.createElement("div", {
            className: classes.releaseLinkAltDescriptionContainer
          }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
            placement: "right",
            title: releaseLinkTooltip
          }, /*#__PURE__*/_react.default.createElement(_Button.default, {
            href: _RouteService.default.getReleaseDetailPath(appliedRelease),
            target: "_blank",
            rel: "noopener noreferrer",
            variant: "outlined",
            className: classes.releaseLinkButton,
            endIcon: /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, null)
          }, "Release Details")));
          break;
      }
    }
  }

  // DOI Node
  let doiNode = null;
  if (showDoi && selectedRelease !== null) {
    const doiUrl = (selectedReleaseObject.productDoi || {}).url || null;
    doiNode = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.descriptionContainer
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.descriptionFlexInnerContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      title: DOI_TITLE,
      className: classes.description,
      style: {
        marginRight: '4px'
      }
    }, "DOI:"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": "doi",
      className: classes.description,
      style: {
        overflowWrap: 'anywhere'
      }
    }, doiUrl || /*#__PURE__*/_react.default.createElement("i", null, "none"))), !doiUrl ? null : /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: doiUrl
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      color: "primary",
      variant: "outlined",
      size: "small",
      className: classes.copyButton,
      title: "Copy DOI: ".concat(doiUrl)
    }, /*#__PURE__*/_react.default.createElement(_Assignment.default, {
      fontSize: "small",
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }), "Copy DOI")));
  }

  // Select Node
  const menuItemSubtitleProps = {
    display: 'block',
    variant: 'caption',
    className: classes.menuItemSubtitle
  };
  const selectNode = /*#__PURE__*/_react.default.createElement(_Select.default, {
    "data-selenium": "release-filter",
    value: selectedRelease || UNSPECIFIED_NAME,
    onChange: event => handleChange(event.target.value),
    input: input,
    "aria-labelledby": labelId,
    renderValue: value => value,
    disabled: optionCount < 2
  }, excludeNullRelease ? null : /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: UNSPECIFIED_NAME
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    display: "block"
  }, UNSPECIFIED_NAME), /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, UNSPECIFIED_DESCRIPTION), !showProductCount || nullReleaseProductCount === null ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, "".concat(nullReleaseProductCount, " data products")))), releases.map(entry => {
    const {
      release,
      generationDate
    } = entry;
    const productCount = getProductCount(entry);
    const productCountSubtitle = productCount !== null ? "".concat(productCount, " data products") : 'Unknown data product count';
    return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: release,
      value: release
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      display: "block"
    }, release), !showGenerationDate ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, "Generated: ".concat(formatGenerationDate(generationDate))), !showProductCount ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, productCountSubtitle)));
  }));

  // Final Render
  return horizontal ? /*#__PURE__*/_react.default.createElement("div", otherProps, /*#__PURE__*/_react.default.createElement("div", null, titleNode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.horizontalFlex
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: maxWidth ? {
      width: "".concat(maxWidth, "px")
    } : {}
  }, selectNode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.horizontalDescriptions
  }, unspecifiedNode, generationDateNode, productCountNode, releaseLinkNode, doiNode))) : /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps, {
    style: _extends({
      width: '100%'
    }, maxWidthStyle)
  }), titleNode, selectNode, unspecifiedNode, generationDateNode, productCountNode, releaseLinkNode, doiNode);
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