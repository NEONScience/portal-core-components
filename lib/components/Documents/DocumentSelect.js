"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _InputLabel = _interopRequireDefault(require("@material-ui/core/InputLabel"));
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
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      container: {
        width: '100%'
      },
      selectContainer: {
        width: '100%',
        padding: muiTheme.spacing(3, 0)
      },
      selectFormControl: {
        width: '100%'
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
  }, /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    variant: "outlined",
    className: classes.selectFormControl
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    htmlFor: "document-select-input"
  }, "Select Document to View"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    fullWidth: true,
    id: "document-select",
    inputProps: {
      name: 'Select Document to View',
      id: 'document-select-input'
    },
    label: "Select Document to View",
    "aria-labelledby": "document-select-label",
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
  })))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, renderSelectedDocument())));
};
var WrappedDocumentSelect = _Theme.default.getWrappedComponent(DocumentSelect);
var _default = WrappedDocumentSelect;
exports.default = _default;