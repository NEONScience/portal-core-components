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

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Assignment = _interopRequireDefault(require("@material-ui/icons/Assignment"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    title: {
      fontWeight: 500,
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
      justifyContent: 'space-between'
    },
    horizontalDescriptions: {
      marginLeft: _Theme.default.spacing(3),
      '& > div:first-child': {
        marginTop: '-2px !important'
      }
    }
  };
});
var UNSPECIFIED_NAME = 'n/a';
var UNSPECIFIED_DESCRIPTION = 'Latest released and provisional data';
var DOI_TITLE = 'Digital Object Identifier (DOI) - A citable permanent link to this this data product release';

var formatGenerationDate = function formatGenerationDate(generationDate) {
  var generationMoment = (0, _moment.default)(generationDate);
  return generationMoment ? generationMoment.format('MMMM D, YYYY') : null;
};

var ReleaseFilter = function ReleaseFilter(props) {
  var classes = useStyles(_Theme.default);

  var excludeNullRelease = props.excludeNullRelease,
      horizontal = props.horizontal,
      maxWidth = props.maxWidth,
      nullReleaseProductCount = props.nullReleaseProductCount,
      onChange = props.onChange,
      releasesProp = props.releases,
      selected = props.selected,
      showDoi = props.showDoi,
      showGenerationDate = props.showGenerationDate,
      showProductCount = props.showProductCount,
      skeleton = props.skeleton,
      title = props.title,
      otherProps = _objectWithoutProperties(props, ["excludeNullRelease", "horizontal", "maxWidth", "nullReleaseProductCount", "onChange", "releases", "selected", "showDoi", "showGenerationDate", "showProductCount", "skeleton", "title"]);

  var _useId = (0, _reactIdGenerator.useId)(),
      _useId2 = _slicedToArray(_useId, 1),
      instanceId = _useId2[0];

  var inputId = "release-filter-input-".concat(instanceId);
  var labelId = "release-filter-label-".concat(instanceId);

  var releases = _toConsumableArray(releasesProp || []).sort(function (a, b) {
    return a.generationDate > b.generationDate ? -1 : 1;
  }); // SANITY CHECK: Render nothing if there are no releases and null release is excluded


  var optionCount = releases.length + (excludeNullRelease ? 0 : 1);

  if (!optionCount) {
    return null;
  }

  var findReleaseObject = function findReleaseObject(release) {
    return releases.find(function (entry) {
      return entry.release === release;
    }) || null;
  };

  var findRelease = function findRelease(release) {
    return (findReleaseObject(release) || {}).release || null;
  };

  var getProductCount = function getProductCount(release) {
    if (!release) {
      return null;
    }

    if (Array.isArray(release.dataProducts)) {
      return release.dataProducts.length;
    }

    if (Array.isArray(release.dataProductCodes)) {
      return release.dataProductCodes.length;
    }

    return null;
  };

  var selectedRelease = findRelease(selected);

  if (!selectedRelease && excludeNullRelease) {
    selectedRelease = releases[0].release;
  }

  var selectedReleaseObject = findReleaseObject(selectedRelease);

  var handleChange = function handleChange(newRelease) {
    var validatedNewRelease = newRelease === UNSPECIFIED_NAME ? null : findRelease(newRelease);

    if (validatedNewRelease === selectedRelease) {
      return;
    }

    onChange(validatedNewRelease);
  };

  var maxWidthStyle = maxWidth ? {
    maxWidth: "".concat(maxWidth, "px")
  } : {};

  var input = /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    margin: "dense",
    className: classes.selectInput,
    style: maxWidthStyle
  });

  var titleNode = !title ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    component: "h3",
    className: classes.title,
    id: labelId
  }, title); // Render skeleton

  if (skeleton) {
    var skeletonStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps || {}, {
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        overflow: 'hidden'
      }
    }), titleNode, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: maxWidth,
      height: 36,
      style: skeletonStyle
    }), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      width: "70%",
      height: 16,
      style: skeletonStyle
    }));
  } // Unspecified Node


  var unspecifiedNode = selectedRelease !== null ? null : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.descriptionContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.description
  }, UNSPECIFIED_DESCRIPTION)); // Generation Date Node

  var generationDateNode = null;

  if (showGenerationDate && selectedRelease !== null) {
    generationDateNode = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.descriptionContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      className: classes.description
    }, "Generated: ".concat(formatGenerationDate(selectedReleaseObject.generationDate))));
  } // Product Count Node


  var productCountNode = null;

  if (showProductCount) {
    if (selectedRelease === null) {
      productCountNode = nullReleaseProductCount === null ? null : /*#__PURE__*/_react.default.createElement("div", {
        className: classes.descriptionContainer
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        className: classes.description
      }, "".concat(nullReleaseProductCount, " data products")));
    } else {
      var productCount = getProductCount(selectedReleaseObject);
      productCountNode = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.descriptionContainer
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        className: classes.description
      }, productCount !== null ? "".concat(productCount, " data products") : 'Unknown data product count'));
    }
  } // DOI Node


  var doiNode = null;

  if (showDoi && selectedRelease !== null) {
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
    }, selectedReleaseObject.url)), /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: selectedReleaseObject.url
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      color: "primary",
      variant: "outlined",
      size: "small",
      className: classes.copyButton,
      title: "Copy DOI: ".concat(selectedReleaseObject.url)
    }, /*#__PURE__*/_react.default.createElement(_Assignment.default, {
      fontSize: "small",
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }), "Copy DOI")));
  } // Select Node


  var menuItemSubtitleProps = {
    display: 'block',
    variant: 'caption',
    className: classes.menuItemSubtitle
  };

  var selectNode = /*#__PURE__*/_react.default.createElement(_Select.default, {
    "data-selenium": "release-filter",
    value: selectedRelease || UNSPECIFIED_NAME,
    onChange: function onChange(event) {
      return handleChange(event.target.value);
    },
    input: input,
    "aria-labelledby": labelId,
    renderValue: function renderValue(value) {
      return value;
    },
    disabled: optionCount < 2
  }, excludeNullRelease ? null : /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: UNSPECIFIED_NAME
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    display: "block"
  }, UNSPECIFIED_NAME), /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, UNSPECIFIED_DESCRIPTION), !showProductCount || nullReleaseProductCount === null ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, "".concat(nullReleaseProductCount, " data products")))), releases.map(function (entry) {
    var release = entry.release,
        generationDate = entry.generationDate;
    var productCount = getProductCount(entry);
    var productCountSubtitle = productCount !== null ? "".concat(productCount, " data products") : 'Unknown data product count';
    return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: release,
      value: release
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      display: "block"
    }, release), !showGenerationDate ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, "Generated: ".concat(formatGenerationDate(generationDate))), !showProductCount ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, menuItemSubtitleProps, productCountSubtitle)));
  })); // Final Render


  return horizontal ? /*#__PURE__*/_react.default.createElement("div", otherProps, /*#__PURE__*/_react.default.createElement("div", null, titleNode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.horizontalFlex
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: maxWidth ? {
      width: "".concat(maxWidth, "px")
    } : {}
  }, selectNode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.horizontalDescriptions
  }, unspecifiedNode, generationDateNode, productCountNode, doiNode))) : /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps, {
    style: _extends({
      width: '100%'
    }, maxWidthStyle)
  }), titleNode, selectNode, unspecifiedNode, generationDateNode, productCountNode, doiNode);
};

ReleaseFilter.propTypes = {
  excludeNullRelease: _propTypes.default.bool,
  horizontal: _propTypes.default.bool,
  maxWidth: _propTypes.default.number,
  nullReleaseProductCount: _propTypes.default.number,
  onChange: _propTypes.default.func,
  releases: _propTypes.default.arrayOf(_propTypes.default.shape({
    release: _propTypes.default.string.isRequired,
    generationDate: _propTypes.default.string.isRequired,
    url: _propTypes.default.string
  })),
  selected: _propTypes.default.string,
  showDoi: _propTypes.default.bool,
  showGenerationDate: _propTypes.default.bool,
  showProductCount: _propTypes.default.bool,
  skeleton: _propTypes.default.bool,
  title: _propTypes.default.string
};
ReleaseFilter.defaultProps = {
  excludeNullRelease: false,
  horizontal: false,
  maxWidth: 236,
  nullReleaseProductCount: null,
  onChange: function onChange() {},
  releases: [],
  selected: null,
  showDoi: false,
  showGenerationDate: false,
  showProductCount: false,
  skeleton: false,
  title: 'Release'
};

var WrappedReleaseFilter = _Theme.default.getWrappedComponent(ReleaseFilter);

var _default = WrappedReleaseFilter;
exports.default = _default;