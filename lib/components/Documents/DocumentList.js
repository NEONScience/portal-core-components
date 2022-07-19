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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      list: {
        paddingTop: muiTheme.spacing(0)
      }
    })
  );
});

var DocumentList = function DocumentList(props) {
  var classes = useStyles(_Theme.default);
  var documents = props.documents;

  if (!(0, _typeUtil.existsNonEmpty)(documents)) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.container
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "No Documents",
      message: "No documents available to display"
    }));
  }

  var renderDocuments = function renderDocuments() {
    return documents.map(function (document, index) {
      return /*#__PURE__*/_react.default.createElement(_DocumentListItem.default, {
        key: document.name,
        makeDownloadableLink: true,
        id: index,
        document: document
      });
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_List.default, {
    dense: true,
    className: classes.list
  }, renderDocuments()));
};

var _default = DocumentList;
exports.default = _default;