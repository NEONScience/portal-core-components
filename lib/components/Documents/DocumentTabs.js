"use strict";

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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useStyles = (0, _styles.makeStyles)(muiTheme =>
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
}));
const useTabsStyles = (0, _styles.makeStyles)(muiTheme =>
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
}));
const useTabStyles = (0, _styles.makeStyles)(muiTheme =>
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
}));
const DocumentTabs = props => {
  const classes = useStyles(_Theme.default);
  const tabClasses = useTabStyles(_Theme.default);
  const tabsClasses = useTabsStyles(_Theme.default);
  const {
    documents
  } = props;
  const initialTabIdx = 0;
  const [selectedTab, setSelectedTab] = (0, _react.useState)(initialTabIdx);
  if (!(0, _typeUtil.existsNonEmpty)(documents)) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.container
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "No Documents",
      message: "No documents available to display"
    }));
  }
  const docTabs = documents.map((doc, index) => ({
    document: doc,
    index
  }));
  const renderTabs = () => /*#__PURE__*/_react.default.createElement(_Tabs.default, {
    orientation: "horizontal",
    scrollButtons: "on",
    variant: "scrollable",
    value: selectedTab,
    "aria-label": "Document Tabs",
    classes: tabsClasses,
    onChange: (event, newTab) => {
      setSelectedTab(newTab);
    },
    TabIndicatorProps: {
      style: {
        display: 'none'
      }
    }
  }, docTabs.map(docTab => /*#__PURE__*/_react.default.createElement(_Tab.default, {
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
  })));
  const renderTabContent = documentTab => {
    const {
      document,
      index
    } = documentTab;
    const fullUrlPath = _DocumentService.default.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides')) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'));
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
  const renderTabPanels = () => /*#__PURE__*/_react.default.createElement("div", {
    className: classes.tabPanels
  }, docTabs.map(docTab => renderTabContent(docTab)));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.container
  }, renderTabs(), renderTabPanels());
};
const WrappedDocumentTabs = _Theme.default.getWrappedComponent(DocumentTabs);
var _default = exports.default = WrappedDocumentTabs;