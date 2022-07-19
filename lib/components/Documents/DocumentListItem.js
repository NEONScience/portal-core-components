"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _ListItemSecondaryAction = _interopRequireDefault(require("@material-ui/core/ListItemSecondaryAction"));

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _styles = require("@material-ui/core/styles");

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));

var _typeUtil = require("../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      listItem: {
        paddingLeft: muiTheme.spacing(1),
        '& p': {
          marginTop: muiTheme.spacing(0.5),
          '& > span > span': {
            whiteSpace: 'nowrap'
          }
        }
      },
      listItemSecondarySpacer: {
        margin: muiTheme.spacing(0, 2),
        color: muiTheme.palette.grey[200]
      },
      listItemIcon: {
        minWidth: muiTheme.spacing(4),
        marginRight: muiTheme.spacing(1)
      }
    })
  );
});

var DocumentListItem = function DocumentListItem(props) {
  var classes = useStyles(_Theme.default);
  var atXs = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('xs'));
  var id = props.id,
      document = props.document,
      makeDownloadableLink = props.makeDownloadableLink;

  if (!document) {
    return null;
  }

  var apiPath = _DocumentService.default.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(document.name) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(document.name);

  var documentType = _DocumentService.default.getDefaultDocumentTypeListItemDef();

  if (typeof document.type === 'string') {
    var matchKey = _DocumentService.default.getDocumentTypeListItemDefKeys().find(function (key) {
      return _DocumentService.default.getDocumentTypeListItemDefs()[key].match(document.type);
    });

    if (matchKey) {
      documentType = _DocumentService.default.getDocumentTypeListItemDefs()[matchKey];
    }
  }

  var _documentType = documentType,
      typeTitle = _documentType.title,
      TypeIcon = _documentType.Icon;
  var typeTitleString = typeTitle(document.type);
  var primary = (0, _typeUtil.isStringNonEmpty)(document.description) ? document.description : /*#__PURE__*/_react.default.createElement("i", null, "No description");

  var spacer = /*#__PURE__*/_react.default.createElement("span", {
    className: classes.listItemSecondarySpacer
  }, "|");

  var typeAndSize = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    title: "file type: ".concat(typeTitleString)
  }, typeTitleString), !document.size ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, spacer, /*#__PURE__*/_react.default.createElement("span", {
    title: "file size: ".concat(_DocumentService.default.formatBytes(document.size))
  }, _DocumentService.default.formatBytes(document.size))));

  var fileNumber = /*#__PURE__*/_react.default.createElement("span", {
    title: "file number: ".concat(document.name)
  }, document.name);

  var secondary = atXs ? /*#__PURE__*/_react.default.createElement("span", null, fileNumber, /*#__PURE__*/_react.default.createElement("br", null), typeAndSize) : /*#__PURE__*/_react.default.createElement("span", null, typeAndSize, spacer, fileNumber);
  return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    key: id,
    className: classes.listItem,
    component: makeDownloadableLink ? 'a' : 'div',
    href: makeDownloadableLink ? apiPath : undefined,
    title: makeDownloadableLink ? "Click to download ".concat(document.name) : "".concat(document.name) // @ts-ignore
    ,
    button: makeDownloadableLink
  }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, {
    className: classes.listItemIcon
  }, /*#__PURE__*/_react.default.createElement(TypeIcon, null)), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    primary: primary,
    secondary: secondary
  }), !makeDownloadableLink ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null) : /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "outlined",
    onClick: function onClick() {
      window.location.href = apiPath;
    }
  }, "Download")));
};

var _default = DocumentListItem;
exports.default = _default;