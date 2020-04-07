"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonFooter;

var _react = _interopRequireDefault(require("react"));

require("./NeonFooter.css");

var _styles = require("@material-ui/core/styles");

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Container = _interopRequireDefault(require("@material-ui/core/Container"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _logoFooter = _interopRequireDefault(require("./images/logo--footer.png"));

var _socialNewsletter = _interopRequireDefault(require("./images/social--newsletter.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('font-awesome/css/font-awesome.min.css');

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    box: {
      padding: theme.spacing(0),
      margin: theme.spacing(0)
    },
    container: {
      padding: theme.spacing(1, 4),
      backgroundColor: '#fff',
      boxShadow: '0 50vh 0 50vh #fff'
    },
    smContainer: {
      padding: theme.spacing(2, 0),
      display: 'flex',
      justifyContent: 'space-around'
    },
    smCaption: {
      padding: theme.spacing(0),
      marginBottom: theme.spacing(2),
      color: theme.palette.grey[300],
      textAlign: 'justify'
    },
    smCopyright: {
      padding: theme.spacing(0),
      color: theme.palette.grey[300],
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    linkIcon: {
      color: theme.palette.grey[200],
      '&:hover, &:focus': {
        color: theme.palette.grey[500]
      }
    },
    newsletterIcon: {
      verticalAlign: 'middle',
      marginRight: theme.spacing(1),
      opacity: 0.6,
      '&:hover, &:focus': {
        opacity: 1
      }
    },
    footerTextLink: {
      color: '#00a1b1'
    }
  };
});

function NeonFooter() {
  var classes = useStyles(_Theme.default);
  var year = new Date().getFullYear();
  var copyrightDisplay = "\xA9 ".concat(year.toString(), " Battelle");
  var bottomCaption = "\nThe National Ecological Observatory Network is a major facility fully funded by\nthe National Science Foundation. Any opinions, findings and conclusions or\nrecommendations expressed in this material do not necessarily reflect the views\nof the National Science Foundation.\n";
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.box,
    "data-selenium": "neon-footer"
  }, /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.container
  }, /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    mdUp: true
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 6
  }, /*#__PURE__*/_react.default.createElement(_Container.default, {
    style: {
      padding: _Theme.default.spacing(2, 0)
    }
  }, /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.footerTextLink,
    title: "Sign up for the NEON Newsletter",
    href: "http://visitor.r20.constantcontact.com/manage/optin?v=001VGGvr8xQIKjYc_kFiPLlwv2eCR5mvCy-l84uOGp_mC-N67a0MgiOjSJIWa1ZibyTJYm9YZbvasF-RX5OWfNMI7gIq2IjIF6fDARps7B---g%3D",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement("img", {
    title: "Sign up for the NEON Newsletter",
    alt: "Sign up for the NEON Newsletter",
    src: _socialNewsletter.default,
    className: classes.newsletterIcon
  }), "Newsletter"))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 6
  }, /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.smContainer
  }, /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.linkIcon,
    title: "Facebook",
    href: "https://www.facebook.com/NEONScienceData",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-facebook-square fa-2x fa-fw"
  })), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.linkIcon,
    title: "Twitter",
    href: "https://twitter.com/NEON_Sci",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-twitter-square fa-2x fa-fw"
  })), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.linkIcon,
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/neon-science/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-linkedin-square fa-2x fa-fw"
  })), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.linkIcon,
    title: "YouTube",
    href: "https://www.youtube.com/neonscience",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-youtube-square fa-2x fa-fw"
  }))))), /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.smContainer
  }, /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.footerTextLink,
    href: "http://www.neonscience.org/about/contact"
  }, "Contact"), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.footerTextLink,
    href: "http://www.neonscience.org/opportunities/careers"
  }, "Careers"), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.footerTextLink,
    href: "http://www.neonscience.org/about/faq"
  }, "FAQ"), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.footerTextLink,
    href: "http://www.neonscience.org/about/contact/media"
  }, "Media"), /*#__PURE__*/_react.default.createElement(_Link.default, {
    className: classes.footerTextLink,
    href: "http://www.neonscience.org/about/terms-use"
  }, "Terms of Use")), /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.smCaption
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption"
  }, bottomCaption)), /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.smCopyright
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption"
  }, copyrightDisplay), /*#__PURE__*/_react.default.createElement("img", {
    src: _logoFooter.default,
    style: {
      maxHeight: _Theme.default.spacing(2)
    },
    title: "Proudly operated by Battelle",
    alt: "Proudly operated by Battelle"
  }))), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    smDown: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _logoFooter.default,
    className: "neon-footer__logo--footer",
    title: "Proudly operated by Battelle",
    alt: "Proudly operated by Battelle"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer__box neon-footer__div--social"
  }, /*#__PURE__*/_react.default.createElement("a", {
    title: "Sign up for our Newsletter",
    className: "neon-footer__social--logo neon-footer__neon-logo",
    href: "http://visitor.r20.constantcontact.com/manage/optin?v=001VGGvr8xQIKjYc_kFiPLlwv2eCR5mvCy-l84uOGp_mC-N67a0MgiOjSJIWa1ZibyTJYm9YZbvasF-RX5OWfNMI7gIq2IjIF6fDARps7B---g%3D",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Sign Up for Our Newsletter"), /*#__PURE__*/_react.default.createElement("a", {
    title: "Facebook",
    className: "neon-footer__social--logo neon-footer__facebook",
    href: "https://www.facebook.com/NEONScienceData",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Facebook"), /*#__PURE__*/_react.default.createElement("a", {
    title: "Twitter",
    className: "neon-footer__social--logo neon-footer__twitter",
    href: "https://twitter.com/NEON_Sci",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Twitter"), /*#__PURE__*/_react.default.createElement("a", {
    title: "LinkedIn",
    className: "neon-footer__social--logo neon-footer__linkedin",
    href: "https://www.linkedin.com/company/neon-science/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "LinkedIn"), /*#__PURE__*/_react.default.createElement("a", {
    title: "YouTube",
    className: "neon-footer__logo--social neon-footer__youtube",
    href: "https://www.youtube.com/neonscience",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "YouTube")), /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer__box neon-footer__div--contact"
  }, /*#__PURE__*/_react.default.createElement("a", {
    className: "neon-footer__link--contact",
    href: "http://www.neonscience.org/about/contact"
  }, "Contact"), /*#__PURE__*/_react.default.createElement("a", {
    className: "neon-footer__link--contact",
    href: "http://www.neonscience.org/opportunities/careers"
  }, "Careers"), /*#__PURE__*/_react.default.createElement("a", {
    className: "neon-footer__link--contact",
    href: "http://www.neonscience.org/about/faq"
  }, "FAQ"), /*#__PURE__*/_react.default.createElement("a", {
    className: "neon-footer__link--contact",
    href: "http://www.neonscience.org/about/contact/media"
  }, "Media"), /*#__PURE__*/_react.default.createElement("a", {
    className: "neon-footer__link--contact",
    href: "http://www.neonscience.org/about/terms-use"
  }, "Terms of Use"), /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer__icon--tower"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer__box neon-footer__text--nsf"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer__span--nsf-text"
  }, bottomCaption)), /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-footer__box neon-footer__text--battelle"
  }, copyrightDisplay)))));
}