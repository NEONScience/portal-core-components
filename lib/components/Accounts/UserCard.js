"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));
var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));
var _Email = _interopRequireDefault(require("@material-ui/icons/Email"));
var _styles = require("@material-ui/core/styles");
var _moment = _interopRequireDefault(require("moment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable jsx-a11y/label-has-associated-control */

// eslint-disable-next-line no-unused-vars
const useStyles = (0, _styles.makeStyles)(theme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  cardHeaderContainer: {
    padding: '10px',
    '& label.account-title': {
      marginLeft: '20px',
      height: '68px',
      marginTop: '25px',
      fontWeight: 600,
      fontSize: '20px'
    },
    '& img.profile-image': {
      width: '120px'
    }
  },
  card: {
    margin: 'auto',
    textAlign: 'center'
  },
  profileArea: {
    '& img': {
      marginBottom: '15px',
      borderRadius: '50%',
      marginLeft: '10px',
      marginRight: '10px'
    }
  },
  profileInfoArea: {
    width: '100%',
    textAlign: 'left',
    display: 'inline-block',
    marginTop: '20px',
    '& i.fa': {
      marginRight: '10px'
    },
    '& i.fa-user': {
      verticalAlign: 'middle'
    },
    '& label': {
      fontSize: '16px',
      fontWeight: 600
    },
    '& label.label-block': {
      display: 'block',
      paddingBottom: '5px'
    },
    '& div.label-info-container': {
      padding: '10px',
      paddingTop: '20px',
      paddingLeft: '20px',
      paddingRight: '20px'
    },
    '& div.label-name-container': {
      padding: '10px'
    },
    '& label.username-label': {
      verticalAlign: 'middle'
    },
    '& label.label-normal': {
      fontSize: '14px',
      fontWeight: 'normal',
      wordBreak: 'break-all'
    }
  },
  emailChipContainer: {
    '& .MuiChip-root': {
      height: '100% !important'
    },
    '& .MuiChip-label': {
      width: '100% !important',
      wordBreak: 'break-all !important',
      whiteSpace: 'normal !important',
      padding: '6px'
    },
    '& .chip-email.MuiChip-root': {
      fontSize: '.90em !important'
    },
    '& .chip-email .MuiAvatar-root.MuiChip-avatar.MuiChip-avatarColorPrimary': {
      width: '32px !important',
      height: '32px !important'
    }
  }
}));
const UserCard = props => {
  const {
    pictureUrl,
    email,
    fullName,
    providers,
    lastLogin
  } = props;
  const classes = useStyles(_Theme.default);
  let lastLoginDisplay = null;
  if ((0, _typeUtil.exists)(lastLogin)) {
    const dateFmt = 'MMMM Do, YYYY h:mm:ss a';
    const lastLoginDate = (0, _moment.default)(new Date(lastLogin));
    lastLoginDisplay = lastLoginDate.format(dateFmt);
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.profileArea
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.card
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.cardHeaderContainer
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: pictureUrl,
    className: "profile-image",
    alt: "Profile"
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h4",
    component: "h4",
    style: {
      margin: '10px'
    }
  }, fullName)), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.emailChipContainer
  }, /*#__PURE__*/_react.default.createElement(_Chip.default, {
    avatar: /*#__PURE__*/_react.default.createElement(_Avatar.default, {
      color: "primary"
    }, /*#__PURE__*/_react.default.createElement(_Email.default, null)),
    key: email,
    label: email,
    className: "chip-email",
    color: "primary"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.profileInfoArea
  }, /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "label-info-container"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "control-label label-block"
  }, "Identity Provider"), /*#__PURE__*/_react.default.createElement("label", {
    className: "label-normal"
  }, providers)), /*#__PURE__*/_react.default.createElement("div", {
    className: "label-info-container"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "control-label label-block"
  }, "Last Login"), /*#__PURE__*/_react.default.createElement("label", {
    className: "label-normal"
  }, lastLoginDisplay)))));
};
var _default = exports.default = UserCard;