"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _styles = require("@material-ui/core/styles");

var _DocumentListItem = _interopRequireDefault(require("./DocumentListItem"));

var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));

var _DocumentViewer = _interopRequireDefault(require("./DocumentViewer"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));

var _typeUtil = require("../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      container: {
        width: '100%'
      },
      selectContainer: {
        width: '100%',
        padding: muiTheme.spacing(3, 0)
      }
    })
  );
});

var DocumentSelect = function DocumentSelect(props) {
  var classes = useStyles(_Theme.default);
  var documents = props.documents;
  var hasDocuments = (0, _typeUtil.existsNonEmpty)(documents);
  var initialValue = '';

  if (hasDocuments) {
    initialValue = documents[0].name;
  }

  var _useState = (0, _react.useState)(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      selectedDoc = _useState2[0],
      setSelectedDoc = _useState2[1];

  if (!hasDocuments) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.container
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "No Documents",
      message: "No documents available to display"
    }));
  }

  var renderSelectedDocument = function renderSelectedDocument() {
    var matchedDoc = documents.find(function (doc) {
      return (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.name) && doc.name.localeCompare(selectedDoc) === 0;
    });

    if (!(0, _typeUtil.exists)(matchedDoc)) {
      return /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
        title: "Document Not Found",
        message: "Document could not be found"
      });
    }

    var coercedMatchedDoc = matchedDoc;
    var fullUrlPath = _DocumentService.default.isQuickStartGuide(coercedMatchedDoc) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides')) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'));
    return /*#__PURE__*/_react.default.createElement(_DocumentViewer.default, {
      document: coercedMatchedDoc,
      width: 600,
      fullUrlPath: fullUrlPath
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.container
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.default.createElement(_Select.default, {
    fullWidth: true,
    id: "document-select",
    "aria-labelledby": "document-select-label",
    variant: "outlined",
    value: selectedDoc,
    onChange: function onChange(event) {
      var nextDoc = documents.find(function (doc) {
        return doc.name.localeCompare(event.target.value) === 0;
      });

      if ((0, _typeUtil.exists)(nextDoc)) {
        setSelectedDoc(nextDoc.name);
      }
    }
  }, documents.map(function (doc, index) {
    return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: doc.name,
      value: doc.name
    }, /*#__PURE__*/_react.default.createElement(_DocumentListItem.default, {
      id: index,
      document: doc,
      makeDownloadableLink: false
    }));
  }))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, renderSelectedDocument())));
};

var _default = DocumentSelect;
exports.default = _default;