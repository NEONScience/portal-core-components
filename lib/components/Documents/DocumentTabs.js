"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Tab = _interopRequireDefault(require("@mui/material/Tab"));
var _Tabs = _interopRequireDefault(require("@mui/material/Tabs"));
var _styles = require("@mui/styles");
var _DocumentListItem = _interopRequireDefault(require("./DocumentListItem"));
var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));
var _DocumentViewer = _interopRequireDefault(require("./DocumentViewer"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
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
      margin: `${muiTheme.spacing(0, 1, 0, 0)} !important`
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.container,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_WarningCard.default, {
        title: "No Documents",
        message: "No documents available to display"
      })
    });
  }
  const docTabs = documents.map((doc, index) => ({
    document: doc,
    index
  }));
  const renderTabs = () => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tabs.default, {
    orientation: "horizontal",
    scrollButtons: true,
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
    },
    allowScrollButtonsMobile: true,
    children: docTabs.map(docTab => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tab.default, {
      value: docTab.index,
      label: /*#__PURE__*/(0, _jsxRuntime.jsx)(_DocumentListItem.default, {
        id: docTab.index,
        document: docTab.document,
        makeDownloadableLink: false
      }),
      "aria-label": docTab.document.name,
      classes: tabClasses,
      id: `document-tabs-tab-${docTab.index}`,
      "aria-controls": `document-tabs-tabpanel-${docTab.index}`
    }, docTab.index))
  });
  const renderTabContent = documentTab => {
    const {
      document,
      index
    } = documentTab;
    const fullUrlPath = _DocumentService.default.isQuickStartGuide(document) ? `${_NeonEnvironment.default.getFullApiPath('quickStartGuides')}` : `${_NeonEnvironment.default.getFullApiPath('documents')}`;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      role: "tabpanel",
      id: `document-tabs-tabpanel-${index}`,
      "aria-labelledby": `document-tabs-tab-${index}`,
      style: {
        display: selectedTab === index ? 'block' : 'none'
      },
      className: classes.tabContentContainer,
      children: selectedTab !== index ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_DocumentViewer.default, {
        document: document,
        width: 600,
        fullUrlPath: fullUrlPath
      })
    }, index);
  };
  const renderTabPanels = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.tabPanels,
    children: docTabs.map(docTab => renderTabContent(docTab))
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.container,
    children: [renderTabs(), renderTabPanels()]
  });
};
const WrappedDocumentTabs = _Theme.default.getWrappedComponent(DocumentTabs);
var _default = exports.default = WrappedDocumentTabs;