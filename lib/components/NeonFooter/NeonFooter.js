'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonFooter;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./NeonFooter.css');

var _styles = require('@material-ui/core/styles');

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Hidden = require('@material-ui/core/Hidden');

var _Hidden2 = _interopRequireDefault(_Hidden);

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Container = require('@material-ui/core/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _logoFooter = require('./images/logo--footer.png');

var _logoFooter2 = _interopRequireDefault(_logoFooter);

var _socialNewsletter = require('./images/social--newsletter.png');

var _socialNewsletter2 = _interopRequireDefault(_socialNewsletter);

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
  var classes = useStyles(_Theme2.default);
  var year = new Date().getFullYear();
  var copyrightDisplay = '\xA9 ' + year.toString() + ' Battelle';
  var bottomCaption = '\nThe National Ecological Observatory Network is a major facility fully funded by\nthe National Science Foundation. Any opinions, findings and conclusions or\nrecommendations expressed in this material do not necessarily reflect the views\nof the National Science Foundation.\n';
  return _react2.default.createElement(
    'div',
    { className: classes.box, 'data-selenium': 'neon-footer' },
    _react2.default.createElement(_Divider2.default, null),
    _react2.default.createElement(
      _Container2.default,
      { className: classes.container },
      _react2.default.createElement(
        _Hidden2.default,
        { mdUp: true },
        _react2.default.createElement(
          _Grid2.default,
          { container: true, spacing: 2 },
          _react2.default.createElement(
            _Grid2.default,
            { item: true, xs: 6 },
            _react2.default.createElement(
              _Container2.default,
              { style: { padding: _Theme2.default.spacing(2, 0) } },
              _react2.default.createElement(
                _Link2.default,
                {
                  className: classes.footerTextLink,
                  title: 'Sign up for the NEON Newsletter',
                  href: 'http://visitor.r20.constantcontact.com/manage/optin?v=001VGGvr8xQIKjYc_kFiPLlwv2eCR5mvCy-l84uOGp_mC-N67a0MgiOjSJIWa1ZibyTJYm9YZbvasF-RX5OWfNMI7gIq2IjIF6fDARps7B---g%3D',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                _react2.default.createElement('img', {
                  title: 'Sign up for the NEON Newsletter',
                  alt: 'Sign up for the NEON Newsletter',
                  src: _socialNewsletter2.default,
                  className: classes.newsletterIcon
                }),
                'Newsletter'
              )
            )
          ),
          _react2.default.createElement(
            _Grid2.default,
            { item: true, xs: 6 },
            _react2.default.createElement(
              _Container2.default,
              { className: classes.smContainer },
              _react2.default.createElement(
                _Link2.default,
                {
                  className: classes.linkIcon,
                  title: 'Facebook',
                  href: 'https://www.facebook.com/NEONScienceData',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                _react2.default.createElement('i', { className: 'fa fa-facebook-square fa-2x fa-fw' })
              ),
              _react2.default.createElement(
                _Link2.default,
                {
                  className: classes.linkIcon,
                  title: 'Twitter',
                  href: 'https://twitter.com/NEON_Sci',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                _react2.default.createElement('i', { className: 'fa fa-twitter-square fa-2x fa-fw' })
              ),
              _react2.default.createElement(
                _Link2.default,
                {
                  className: classes.linkIcon,
                  title: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/neon-science/',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                _react2.default.createElement('i', { className: 'fa fa-linkedin-square fa-2x fa-fw' })
              ),
              _react2.default.createElement(
                _Link2.default,
                {
                  className: classes.linkIcon,
                  title: 'YouTube',
                  href: 'https://www.youtube.com/neonscience',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                _react2.default.createElement('i', { className: 'fa fa-youtube-square fa-2x fa-fw' })
              )
            )
          )
        ),
        _react2.default.createElement(_Divider2.default, null),
        _react2.default.createElement(
          _Container2.default,
          { className: classes.smContainer },
          _react2.default.createElement(
            _Link2.default,
            { className: classes.footerTextLink, href: 'http://www.neonscience.org/about/contact' },
            'Contact'
          ),
          _react2.default.createElement(
            _Link2.default,
            { className: classes.footerTextLink, href: 'http://www.neonscience.org/opportunities/careers' },
            'Careers'
          ),
          _react2.default.createElement(
            _Link2.default,
            { className: classes.footerTextLink, href: 'http://www.neonscience.org/about/faq' },
            'FAQ'
          ),
          _react2.default.createElement(
            _Link2.default,
            { className: classes.footerTextLink, href: 'http://www.neonscience.org/about/contact/media' },
            'Media'
          ),
          _react2.default.createElement(
            _Link2.default,
            { className: classes.footerTextLink, href: 'http://www.neonscience.org/about/terms-use' },
            'Terms of Use'
          )
        ),
        _react2.default.createElement(
          _Container2.default,
          { className: classes.smCaption },
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'caption' },
            bottomCaption
          )
        ),
        _react2.default.createElement(
          _Container2.default,
          { className: classes.smCopyright },
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'caption' },
            copyrightDisplay
          ),
          _react2.default.createElement('img', {
            src: _logoFooter2.default,
            style: { maxHeight: _Theme2.default.spacing(2) },
            title: 'Proudly operated by Battelle',
            alt: 'Proudly operated by Battelle'
          })
        )
      ),
      _react2.default.createElement(
        _Hidden2.default,
        { smDown: true },
        _react2.default.createElement(
          'div',
          { className: 'neon-footer' },
          _react2.default.createElement('img', {
            src: _logoFooter2.default,
            className: 'neon-footer__logo--footer',
            title: 'Proudly operated by Battelle',
            alt: 'Proudly operated by Battelle'
          }),
          _react2.default.createElement(
            'div',
            { className: 'neon-footer__box neon-footer__div--social' },
            _react2.default.createElement(
              'a',
              {
                title: 'Sign up for our Newsletter',
                className: 'neon-footer__social--logo neon-footer__neon-logo',
                href: 'http://visitor.r20.constantcontact.com/manage/optin?v=001VGGvr8xQIKjYc_kFiPLlwv2eCR5mvCy-l84uOGp_mC-N67a0MgiOjSJIWa1ZibyTJYm9YZbvasF-RX5OWfNMI7gIq2IjIF6fDARps7B---g%3D',
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              'Sign Up for Our Newsletter'
            ),
            _react2.default.createElement(
              'a',
              {
                title: 'Facebook',
                className: 'neon-footer__social--logo neon-footer__facebook',
                href: 'https://www.facebook.com/NEONScienceData',
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              'Facebook'
            ),
            _react2.default.createElement(
              'a',
              {
                title: 'Twitter',
                className: 'neon-footer__social--logo neon-footer__twitter',
                href: 'https://twitter.com/NEON_Sci',
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              'Twitter'
            ),
            _react2.default.createElement(
              'a',
              {
                title: 'LinkedIn',
                className: 'neon-footer__social--logo neon-footer__linkedin',
                href: 'https://www.linkedin.com/company/neon-science/',
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              'LinkedIn'
            ),
            _react2.default.createElement(
              'a',
              {
                title: 'YouTube',
                className: 'neon-footer__logo--social neon-footer__youtube',
                href: 'https://www.youtube.com/neonscience',
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              'YouTube'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'neon-footer__box neon-footer__div--contact' },
            _react2.default.createElement(
              'a',
              {
                className: 'neon-footer__link--contact',
                href: 'http://www.neonscience.org/about/contact'
              },
              'Contact'
            ),
            _react2.default.createElement(
              'a',
              {
                className: 'neon-footer__link--contact',
                href: 'http://www.neonscience.org/opportunities/careers'
              },
              'Careers'
            ),
            _react2.default.createElement(
              'a',
              {
                className: 'neon-footer__link--contact',
                href: 'http://www.neonscience.org/about/faq'
              },
              'FAQ'
            ),
            _react2.default.createElement(
              'a',
              {
                className: 'neon-footer__link--contact',
                href: 'http://www.neonscience.org/about/contact/media'
              },
              'Media'
            ),
            _react2.default.createElement(
              'a',
              {
                className: 'neon-footer__link--contact',
                href: 'http://www.neonscience.org/about/terms-use'
              },
              'Terms of Use'
            ),
            _react2.default.createElement('div', { className: 'neon-footer__icon--tower' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'neon-footer__box neon-footer__text--nsf' },
            _react2.default.createElement(
              'div',
              { className: 'neon-footer__span--nsf-text' },
              bottomCaption
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'neon-footer__box neon-footer__text--battelle' },
            copyrightDisplay
          )
        )
      )
    )
  );
}