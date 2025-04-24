"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _List = _interopRequireDefault(require("@material-ui/core/List"));
var _styles = require("@material-ui/core/styles");
var _DocumentListItem = _interopRequireDefault(require("./DocumentListItem"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));
var _typeUtil = require("../../util/typeUtil");
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.container
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "No Documents",
      message: "No documents available to display"
    }));
  }
  const renderDocuments = () => documents.map((document, index) => /*#__PURE__*/_react.default.createElement(_DocumentListItem.default, {
    key: document.name,
    id: index,
    document: document,
    makeDownloadableLink: makeDownloadableLink === true,
    enableDownloadButton: enableDownloadButton,
    fetchVariants: fetchVariants,
    enableVariantChips: enableVariantChips
  }));
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_List.default, {
    dense: true,
    className: classes.list
  }, renderDocuments()));
};
const WrappedDocumentList = _Theme.default.getWrappedComponent(DocumentList);
var _default = exports.default = WrappedDocumentList;