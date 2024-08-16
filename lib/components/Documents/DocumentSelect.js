"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _InputLabel = _interopRequireDefault(require("@mui/material/InputLabel"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
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
    width: '100%'
  },
  selectContainer: {
    width: '100%',
    padding: muiTheme.spacing(3, 0)
  },
  selectFormControl: {
    width: '100%'
  }
}));
const DocumentSelect = props => {
  const classes = useStyles(_Theme.default);
  const {
    documents
  } = props;
  const hasDocuments = (0, _typeUtil.existsNonEmpty)(documents);
  let initialValue = '';
  if (hasDocuments) {
    initialValue = documents[0].name;
  }
  const [selectedDoc, setSelectedDoc] = (0, _react.useState)(initialValue);
  if (!hasDocuments) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.container,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_WarningCard.default, {
        title: "No Documents",
        message: "No documents available to display"
      })
    });
  }
  const renderSelectedDocument = () => {
    const matchedDoc = documents.find(doc => (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.name) && doc.name.localeCompare(selectedDoc) === 0);
    if (!(0, _typeUtil.exists)(matchedDoc)) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_WarningCard.default, {
        title: "Document Not Found",
        message: "Document could not be found"
      });
    }
    const coercedMatchedDoc = matchedDoc;
    const fullUrlPath = _DocumentService.default.isQuickStartGuide(coercedMatchedDoc) ? `${_NeonEnvironment.default.getFullApiPath('quickStartGuides')}` : `${_NeonEnvironment.default.getFullApiPath('documents')}`;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_DocumentViewer.default, {
      document: coercedMatchedDoc,
      width: 600,
      fullUrlPath: fullUrlPath
    });
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.container,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 3,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_FormControl.default, {
          variant: "outlined",
          className: classes.selectFormControl,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_InputLabel.default, {
            htmlFor: "document-select-input",
            children: "Select Document to View"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
            fullWidth: true,
            id: "document-select",
            inputProps: {
              name: 'Select Document to View',
              id: 'document-select-input'
            },
            label: "Select Document to View",
            "aria-labelledby": "document-select-label",
            value: selectedDoc,
            onChange: (event, child) => {
              const nextDoc = documents.find(doc => doc.name.localeCompare(event.target.value) === 0);
              if ((0, _typeUtil.exists)(nextDoc)) {
                setSelectedDoc(nextDoc.name);
              }
            },
            children: documents.map((doc, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
              value: doc.name,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_DocumentListItem.default, {
                id: index,
                document: doc,
                makeDownloadableLink: false
              })
            }, doc.name))
          })]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        children: renderSelectedDocument()
      })]
    })
  });
};
const WrappedDocumentSelect = _Theme.default.getWrappedComponent(DocumentSelect);
var _default = exports.default = WrappedDocumentSelect;