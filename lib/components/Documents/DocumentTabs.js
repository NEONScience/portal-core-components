"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Tab = _interopRequireDefault(require("@material-ui/core/Tab"));
var _Tabs = _interopRequireDefault(require("@material-ui/core/Tabs"));
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
        width: '100%',
        display: 'flex',
        margin: muiTheme.spacing(0, -0.5, -0.5, -0.5),
        flexDirection: 'column'
      },
      tabPanels: {
        width: '100%',
        backgroundColor: '#fff'
      },
      tabContentContainer: {
        width: '100%',
        padding: muiTheme.spacing(3, 3, 3, 3)
      }
    })
  );
});
var useTabsStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      scroller: {
        backgroundColor: muiTheme.palette.grey[200]
      },
      scrollButtons: {
        '&.Mui-disabled': {
          opacity: 0.6
        }
      }
    })
  );
});
var useTabStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      root: {
        textTransform: 'none',
        opacity: 1,
        maxWidth: 464
      },
      wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          margin: "".concat(muiTheme.spacing(0, 1, 0, 0), " !important")
        }
      },
      selected: {
        borderBottom: 'none'
      }
    })
  );
});
var DocumentTabs = function DocumentTabs(props) {
  var classes = useStyles(_Theme.default);
  var tabClasses = useTabStyles(_Theme.default);
  var tabsClasses = useTabsStyles(_Theme.default);
  var documents = props.documents;
  var initialTabIdx = 0;
  var _useState = (0, _react.useState)(initialTabIdx),
    _useState2 = _slicedToArray(_useState, 2),
    selectedTab = _useState2[0],
    setSelectedTab = _useState2[1];
  if (!(0, _typeUtil.existsNonEmpty)(documents)) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.container
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "No Documents",
      message: "No documents available to display"
    }));
  }
  var docTabs = documents.map(function (doc, index) {
    return {
      document: doc,
      index: index
    };
  });
  var renderTabs = function renderTabs() {
    return /*#__PURE__*/_react.default.createElement(_Tabs.default, {
      orientation: "horizontal",
      scrollButtons: "on",
      variant: "scrollable",
      value: selectedTab,
      "aria-label": "Document Tabs",
      classes: tabsClasses,
      onChange: function onChange(event, newTab) {
        setSelectedTab(newTab);
      },
      TabIndicatorProps: {
        style: {
          display: 'none'
        }
      }
    }, docTabs.map(function (docTab) {
      return /*#__PURE__*/_react.default.createElement(_Tab.default, {
        key: docTab.index,
        value: docTab.index,
        label: /*#__PURE__*/_react.default.createElement(_DocumentListItem.default, {
          id: docTab.index,
          document: docTab.document,
          makeDownloadableLink: false
        }),
        "aria-label": docTab.document.name,
        classes: tabClasses,
        id: "document-tabs-tab-".concat(docTab.index),
        "aria-controls": "document-tabs-tabpanel-".concat(docTab.index)
      });
    }));
  };
  var renderTabContent = function renderTabContent(documentTab) {
    var document = documentTab.document,
      index = documentTab.index;
    var fullUrlPath = _DocumentService.default.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides')) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'));
    return /*#__PURE__*/_react.default.createElement("div", {
      key: index,
      role: "tabpanel",
      id: "document-tabs-tabpanel-".concat(index),
      "aria-labelledby": "document-tabs-tab-".concat(index),
      style: {
        display: selectedTab === index ? 'block' : 'none'
      },
      className: classes.tabContentContainer
    }, selectedTab !== index ? null : /*#__PURE__*/_react.default.createElement(_DocumentViewer.default, {
      document: document,
      width: 600,
      fullUrlPath: fullUrlPath
    }));
  };
  var renderTabPanels = function renderTabPanels() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.tabPanels
    }, docTabs.map(function (docTab) {
      return renderTabContent(docTab);
    }));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.container
  }, renderTabs(), renderTabPanels());
};
var WrappedDocumentTabs = _Theme.default.getWrappedComponent(DocumentTabs);
var _default = WrappedDocumentTabs;
exports.default = _default;