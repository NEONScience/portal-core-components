'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _styles = require('@material-ui/core/styles');

var _styles2 = require('@material-ui/styles');

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Container = require('@material-ui/core/Container');

var _Container2 = _interopRequireDefault(_Container);

var _CssBaseline = require('@material-ui/core/CssBaseline');

var _CssBaseline2 = _interopRequireDefault(_CssBaseline);

var _Breadcrumbs = require('@material-ui/core/Breadcrumbs');

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _Paper = require('@material-ui/core/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Warning = require('@material-ui/icons/Warning');

var _Warning2 = _interopRequireDefault(_Warning);

var _Skeleton = require('@material-ui/lab/Skeleton');

var _Skeleton2 = _interopRequireDefault(_Skeleton);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _NeonHeader = require('../NeonHeader/NeonHeader');

var _NeonHeader2 = _interopRequireDefault(_NeonHeader);

var _NeonFooter = require('../NeonFooter/NeonFooter');

var _NeonFooter2 = _interopRequireDefault(_NeonFooter);

var _BrowserWarning = require('./BrowserWarning');

var _BrowserWarning2 = _interopRequireDefault(_BrowserWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  var _pageContainer;

  return {
    outerPageContainer: _defineProperty({
      position: 'relative',
      minHeight: theme.spacing(30),
      maxWidth: '2000px',
      paddingBottom: theme.spacing(3)
    }, theme.breakpoints.down('sm'), {
      paddingBottom: theme.spacing(2.5)
    }),
    pageContainer: (_pageContainer = {
      maxWidth: '2000px',
      padding: theme.spacing(3, 4)
    }, _defineProperty(_pageContainer, theme.breakpoints.down('sm'), {
      padding: theme.spacing(1.5, 2.5)
    }), _defineProperty(_pageContainer, '& a:not([class]), a[class=""]', {
      color: _Theme.COLORS.SECONDARY_BLUE[500],
      textDecoration: 'none'
    }), _defineProperty(_pageContainer, '& a:hover:not([class]), a:hover[class=""]', {
      textDecoration: 'underline'
    }), _pageContainer),
    pageOverlay: {
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      position: 'absolute',
      minHeight: theme.spacing(30),
      top: '0px',
      left: '0px',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: theme.spacing(12, 3, 3, 3),
      zIndex: 10000
    },
    pageOverlayPaper: _defineProperty({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(3),
      position: 'sticky',
      top: theme.spacing(12),
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '70%'
    }, theme.breakpoints.up('lg'), {
      width: '50%'
    }),
    pageTitle: _defineProperty({
      // The font size at larger breakpoints introduces noticeable letter spacing before
      // the first letter in the title. The negative left margins nudge it back into alignment.
      margin: theme.spacing(1, 0, 3, -0.25)
    }, theme.breakpoints.up('sm'), {
      margin: theme.spacing(1, 0, 3, -0.5)
    })
  };
});

var NeonPage = function NeonPage(props) {
  var classes = useStyles(_Theme2.default);
  var breadcrumbs = props.breadcrumbs,
      title = props.title,
      children = props.children,
      loading = props.loading,
      progress = props.progress,
      error = props.error;


  var renderTitle = function renderTitle() {
    if ((loading || error) && !title) {
      return _react2.default.createElement(_Skeleton2.default, { width: '45%', height: 24, style: { margin: _Theme2.default.spacing(2, 0, 4, 0) } });
    }
    if (!title || !title.length) {
      return null;
    }
    return _react2.default.createElement(
      _Typography2.default,
      {
        'data-selenium': 'neon-page.title',
        variant: 'h3',
        component: 'h1',
        className: classes.pageTitle
      },
      title
    );
  };

  var renderBreadcrumbs = function renderBreadcrumbs() {
    return !breadcrumbs.length ? null : _react2.default.createElement(
      _Breadcrumbs2.default,
      {
        separator: '\u203A',
        'aria-label': 'Breadcrumbs',
        variant: 'overline',
        'data-selenium': 'neon-page.breadcrumbs'
      },
      _react2.default.createElement(
        _Link2.default,
        { color: 'inherit', key: (0, _uniq2.default)(), href: '/' },
        'Home'
      ),
      breadcrumbs.map(function (breadcrumb, idx) {
        return idx !== breadcrumbs.length - 1 ? _react2.default.createElement(
          _Link2.default,
          { key: (0, _uniq2.default)(), color: 'inherit', href: breadcrumb.href },
          breadcrumb.name
        ) : _react2.default.createElement(
          _Typography2.default,
          { key: '{idx}', color: 'textPrimary' },
          breadcrumb.name
        );
      })
    );
  };

  var renderOverlay = function renderOverlay(overlayChildren) {
    return _react2.default.createElement(
      'div',
      { className: classes.pageOverlay },
      _react2.default.createElement(
        _Paper2.default,
        { className: classes.pageOverlayPaper },
        overlayChildren
      )
    );
  };

  var renderLoading = function renderLoading() {
    return !loading || error ? null : renderOverlay(_react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'h6', component: 'h3', gutterBottom: true },
        loading
      ),
      progress === null ? _react2.default.createElement(_CircularProgress2.default, null) : _react2.default.createElement(_CircularProgress2.default, { variant: 'static', value: progress })
    ));
  };

  var renderError = function renderError() {
    return !error ? null : renderOverlay(_react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(_Warning2.default, { fontSize: 'large', color: 'error' }),
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'h6', component: 'h3', style: { marginTop: _Theme2.default.spacing(1) } },
        error
      )
    ));
  };

  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      _styles2.ThemeProvider,
      { theme: _Theme2.default },
      _react2.default.createElement(_CssBaseline2.default, null),
      _react2.default.createElement(_NeonHeader2.default, null),
      _react2.default.createElement(
        _Container2.default,
        { className: classes.outerPageContainer },
        _react2.default.createElement(
          _Container2.default,
          { className: classes.pageContainer, 'data-selenium': 'neon-page.content' },
          renderBreadcrumbs(),
          renderTitle(),
          children
        ),
        renderLoading(),
        renderError(),
        _react2.default.createElement(_BrowserWarning2.default, null)
      ),
      _react2.default.createElement(_NeonFooter2.default, null)
    )
  );
};

NeonPage.propTypes = {
  breadcrumbs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    href: _propTypes2.default.string
  })),
  title: _propTypes2.default.string,
  loading: _propTypes2.default.string,
  progress: _propTypes2.default.number,
  error: _propTypes2.default.string,
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string])), _propTypes2.default.node, _propTypes2.default.string]).isRequired
};

NeonPage.defaultProps = {
  breadcrumbs: [],
  title: null,
  loading: null,
  progress: null,
  error: null
};

exports.default = NeonPage;