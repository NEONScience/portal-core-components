"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _List = _interopRequireDefault(require("@mui/material/List"));
var _styles = require("@mui/styles");
var _DocumentListItem = _interopRequireDefault(require("./DocumentListItem"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  list: {
    paddingTop: muiTheme.spacing(0)
  }
}));
const DocumentList = props => {
  const classes = useStyles(_Theme.default);
  const {
    documents,
    makeDownloadableLink,
    enableDownloadButton,
    fetchVariants,
    enableVariantChips
  } = props;
  if (!(0, _typeUtil.existsNonEmpty)(documents)) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.container,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_WarningCard.default, {
        title: "No Documents",
        message: "No documents available to display"
      })
    });
  }
  const renderDocuments = () => documents.map((document, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_DocumentListItem.default, {
    id: index,
    document: document,
    makeDownloadableLink: makeDownloadableLink === true,
    enableDownloadButton: enableDownloadButton,
    fetchVariants: fetchVariants,
    enableVariantChips: enableVariantChips
  }, document.name));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_List.default, {
      dense: true,
      className: classes.list,
      children: renderDocuments()
    })
  });
};
const WrappedDocumentList = _Theme.default.getWrappedComponent(DocumentList);
var _default = exports.default = WrappedDocumentList;