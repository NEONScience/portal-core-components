"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NeonErrorPage = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _universalCookie = _interopRequireDefault(require("universal-cookie"));
var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));
var _rxjs = require("rxjs");
var _reactErrorBoundary = require("react-error-boundary");
var _styles = require("@material-ui/core/styles");
var _styles2 = require("@material-ui/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _Backdrop = _interopRequireDefault(require("@material-ui/core/Backdrop"));
var _Breadcrumbs = _interopRequireDefault(require("@material-ui/core/Breadcrumbs"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Container = _interopRequireDefault(require("@material-ui/core/Container"));
var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));
var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));
var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _Home = _interopRequireDefault(require("@material-ui/icons/Home"));
var _Autorenew = _interopRequireDefault(require("@material-ui/icons/Autorenew"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _NeonHeader = _interopRequireDefault(require("../NeonHeader/NeonHeader"));
var _NeonFooter = _interopRequireDefault(require("../NeonFooter/NeonFooter"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _BrowserWarning = _interopRequireDefault(require("./BrowserWarning"));
var _LiferayNotifications = _interopRequireDefault(require("./LiferayNotifications"));
var _rxUtil = require("../../util/rxUtil");
var _liferayNotificationsUtil = require("../../util/liferayNotificationsUtil");
var _NSFNEONLogo = _interopRequireDefault(require("../../images/NSF-NEON-logo.png"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DRUPAL_THEME_CSS = _remoteAssetsMap.default.DRUPAL_THEME_CSS.KEY;
var cookies = new _universalCookie.default();

// Global CSS
var GlobalCss = (0, _styles.withStyles)({
  '@global': {
    code: {
      fontSize: '115%',
      padding: _Theme.default.spacing(0.25, 0.5),
      backgroundColor: 'rgba(0, 0, 0, 0.11)'
    }
  }
})(function () {
  return null;
});

// Function to determine if we're effectively scrolled to the bottom of the page. Used to set
// current sidebar link to the last one automatically when the associated content for the last link
// can't be scrolled past (i.e. is not taller than the page height less the footer height)
var isAtMaxScroll = function isAtMaxScroll() {
  var windowHeight = window.innerHeight || (document.documentElement || document.body).clientHeight;
  var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
  var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  var trackLength = documentHeight - windowHeight;
  return scrollTop / trackLength >= 0.99;
};

// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek to use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

// NOTE: because these are defined outside the ThemeProvider any theme vars must come directly from
// the Theme import, unlike most other useStyles() instances where the Theme import is passed to the
// hook as an argument.
var useStyles = function useStyles(sidebarWidth) {
  return (0, _styles.makeStyles)(function () {
    var _pageContent, _sidebarContainer, _sidebarTitle, _sidebarSubtitle, _sidebarDivider;
    return {
      outerPageContainer: _defineProperty({
        display: 'flex',
        position: 'relative',
        minHeight: _Theme.default.spacing(30),
        borderTop: '2px solid transparent',
        paddingLeft: '0px',
        paddingRight: '0px'
      }, _Theme.default.breakpoints.down('sm'), {
        paddingBottom: _Theme.default.spacing(2.5),
        flexDirection: 'column'
      }),
      pageContent: (_pageContent = {
        display: 'block',
        verticalAlign: 'top',
        position: 'relative',
        padding: _Theme.default.spacing(4, 8, 12, 8),
        width: "calc(100% - ".concat(sidebarWidth, "px)")
      }, _defineProperty(_pageContent, _Theme.default.breakpoints.down('sm'), {
        width: '100%',
        display: 'block',
        padding: _Theme.default.spacing(3, 5, 8, 5)
      }), _defineProperty(_pageContent, '& a:not([class]), a[class=""]', {
        color: _Theme.COLORS.LIGHT_BLUE[500],
        textDecoration: 'none'
      }), _defineProperty(_pageContent, '& a:hover:not([class]), a:hover[class=""]', {
        textDecoration: 'underline'
      }), _pageContent),
      breadcrumbs: _defineProperty({
        margin: _Theme.default.spacing(2, 0, 4, 0)
      }, _Theme.default.breakpoints.down('sm'), {
        margin: _Theme.default.spacing(1, 0, 2, 0)
      }),
      sidebarContainer: (_sidebarContainer = {
        display: 'block',
        verticalAlign: 'top',
        backgroundColor: _Theme.COLORS.GREY[50],
        padding: _Theme.default.spacing(5, 4)
      }, _defineProperty(_sidebarContainer, _Theme.default.breakpoints.down('sm'), {
        display: 'inline-block',
        width: '100%',
        maxHeight: 'calc(100vh - 84px)',
        padding: _Theme.default.spacing(2.5, 2),
        position: 'sticky',
        top: '-2px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
        zIndex: 2
      }), _defineProperty(_sidebarContainer, _Theme.default.breakpoints.down('xs'), {
        padding: _Theme.default.spacing(1.5)
      }), _sidebarContainer),
      sidebarInnerStickyContainer: {
        // Sticky properties injected via CSS to handle webkit position prop
        top: '40px'
      },
      sidebarTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      sidebarTitle: (_sidebarTitle = {
        fontWeight: 700
      }, _defineProperty(_sidebarTitle, _Theme.default.breakpoints.down('sm'), {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }), _defineProperty(_sidebarTitle, _Theme.default.breakpoints.only('sm'), {
        marginRight: _Theme.default.spacing(1.5)
      }), _sidebarTitle),
      sidebarSubtitle: (_sidebarSubtitle = {
        color: _Theme.COLORS.GREY[300],
        marginTop: _Theme.default.spacing(1)
      }, _defineProperty(_sidebarSubtitle, _Theme.default.breakpoints.down('sm'), {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        marginTop: '0px'
      }), _defineProperty(_sidebarSubtitle, _Theme.default.breakpoints.down('xs'), {
        display: 'none'
      }), _sidebarSubtitle),
      sidebarTitlesContainer: _defineProperty({
        minWidth: '0px',
        paddingRight: _Theme.default.spacing(1)
      }, _Theme.default.breakpoints.only('sm'), {
        display: 'flex',
        alignItems: 'baseline'
      }),
      sidebarLink: {
        cursor: 'pointer',
        display: 'block',
        fontSize: '0.9rem',
        marginBottom: '12px'
      },
      sidebarLinkCurrent: {
        fontWeight: 700,
        color: _Theme.COLORS.GREY[500],
        textDecoration: 'none',
        '&:hover': {
          transition: 'all 0.45s',
          color: _Theme.COLORS.GREY[900]
        }
      },
      sidebarLinkIcon: {
        marginBottom: '-5px',
        marginRight: '5px',
        fontSize: '1.3rem'
      },
      sidebarLinksContainer: {
        flex: '1 1 auto',
        overflowY: 'auto',
        minHeight: '0px'
      },
      sidebarDivider: (_sidebarDivider = {
        margin: '24px 0px'
      }, _defineProperty(_sidebarDivider, _Theme.default.breakpoints.down('sm'), {
        margin: '16px 0px'
      }), _defineProperty(_sidebarDivider, _Theme.default.breakpoints.down('xs'), {
        margin: '8px 0px 12px 0px'
      }), _sidebarDivider),
      backdropPaper: _defineProperty({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: '4px',
        padding: _Theme.default.spacing(3),
        position: 'sticky',
        top: _Theme.default.spacing(12),
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%'
      }, _Theme.default.breakpoints.up('lg'), {
        width: '50%'
      }),
      pageTitle: _defineProperty({
        margin: _Theme.default.spacing(3, 0, 4, 0)
      }, _Theme.default.breakpoints.up('sm'), {
        margin: _Theme.default.spacing(3, 0, 4, 0)
      }),
      pageSubtitle: {
        maxWidth: '660px',
        color: _Theme.COLORS.GREY[500],
        lineHeight: '1.5',
        fontSize: '1.1rem',
        marginTop: _Theme.default.spacing(-1),
        marginBottom: _Theme.default.spacing(4)
      },
      errorPageTitleIcon: {
        marginRight: _Theme.default.spacing(1.5),
        color: _Theme.default.palette.error.dark,
        fontSize: '2.3rem',
        marginBottom: '-3px'
      },
      errorPageCaption: {
        display: 'block',
        fontSize: '1rem',
        fontFamily: 'monospace, monospace',
        marginBottom: _Theme.default.spacing(4)
      },
      errorPageLogo: {
        height: '6em',
        marginTop: _Theme.default.spacing(3),
        marginBottom: _Theme.default.spacing(4)
      },
      dismissOverlay: {
        width: '100%',
        textAlign: 'right',
        marginTop: _Theme.default.spacing(2)
      }
    };
  });
};

/**
  NEON Error Page
  Shown as the fallback for a general error boundary around all NEON page instances
 */
var NeonErrorPage = function NeonErrorPage(props) {
  var _props$error = props.error,
    message = _props$error.message,
    stack = _props$error.stack,
    resetErrorBoundary = props.resetErrorBoundary;
  var classes = useStyles(0)();
  // eslint-disable-next-line no-console
  console.error(stack);
  return /*#__PURE__*/_react.default.createElement(_styles2.ThemeProvider, {
    theme: _Theme.default
  }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(GlobalCss, null), /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.outerPageContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.pageContent,
    "data-selenium": "neon-page.content"
  }, /*#__PURE__*/_react.default.createElement("img", {
    title: "NEON Data Portal",
    alt: "NEON Data Portal",
    className: classes.errorPageLogo,
    src: _NSFNEONLogo.default
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h3",
    component: "h1",
    className: classes.pageTitle
  }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
    className: classes.errorPageTitleIcon
  }), "Something broke."), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.errorPageCaption
  }, message)), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_Autorenew.default, null),
    variant: "outlined",
    onClick: resetErrorBoundary
  }, "Reset and Try Again"), /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_Home.default, null),
    href: "/",
    style: {
      marginLeft: _Theme.default.spacing(4)
    }
  }, "Return Home"))), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "react-page-run-time-error.stack",
    value: "".concat(stack)
  })));
};
exports.NeonErrorPage = NeonErrorPage;
NeonErrorPage.propTypes = {
  error: _propTypes.default.shape({
    message: _propTypes.default.string.isRequired,
    stack: _propTypes.default.string
  }).isRequired,
  resetErrorBoundary: _propTypes.default.func.isRequired
};
var NeonPage = function NeonPage(props) {
  var breadcrumbHomeHref = props.breadcrumbHomeHref,
    breadcrumbs = props.breadcrumbs,
    customHeader = props.customHeader,
    customFooter = props.customFooter,
    error = props.error,
    loading = props.loading,
    notification = props.notification,
    outerPageContainerMaxWidth = props.outerPageContainerMaxWidth,
    progress = props.progress,
    resetStateAfterRuntimeError = props.resetStateAfterRuntimeError,
    sidebarContent = props.sidebarContent,
    sidebarContainerClassNameProp = props.sidebarContainerClassName,
    sidebarLinks = props.sidebarLinks,
    sidebarLinksAdditionalContent = props.sidebarLinksAdditionalContent,
    sidebarLinksAsStandaloneChildrenProp = props.sidebarLinksAsStandaloneChildren,
    sidebarSubtitle = props.sidebarSubtitle,
    sidebarTitle = props.sidebarTitle,
    sidebarWidth = props.sidebarWidth,
    sidebarUnsticky = props.sidebarUnsticky,
    subtitle = props.subtitle,
    title = props.title,
    unstickyDrupalHeader = props.unstickyDrupalHeader,
    NeonContextProviderProps = props.NeonContextProviderProps,
    children = props.children;

  /**
    Sidebar Setup
  */
  // Sidebar can have content OR links, not both. If both are set then content wins.
  var hasSidebarContent = sidebarContent !== null;
  var hasSidebarLinks = !sidebarContent && Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
  var hasSidebar = hasSidebarContent || hasSidebarLinks;
  var classes = useStyles(hasSidebar ? sidebarWidth : 0)();
  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
    _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
    neonContextIsActive = _NeonContext$useNeonC2[0].isActive;
  var headerRef = (0, _react.useRef)(null);
  var contentRef = (0, _react.useRef)(null);
  var sidebarRef = (0, _react.useRef)(null);
  var sidebarLinksContainerRef = (0, _react.useRef)(null);
  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    overlayDismissed = _useState2[0],
    setOverlayDismissed = _useState2[1];

  // Boolean - whether any Drupal assets are used; only false if both header and footer are custom
  var useSomeDrupalAssets = !(customHeader && customFooter);

  /**
    Continue Sidebar Setup
  */
  // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component
  var sidebarLinksAsStandaloneChildren = hasSidebarLinks && sidebarLinksAsStandaloneChildrenProp ? sidebarLinks.every(function (link) {
    return link.component;
  }) : false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var sidebarHashMap = !hasSidebarLinks ? {} : Object.fromEntries(sidebarLinks.map(function (link, idx) {
    return [link.hash || '#', idx];
  }));
  var initialCurrentSidebarHash = hasSidebarLinks ? sidebarLinks[0].hash || '#' : '#';
  var _useState3 = (0, _react.useState)(initialCurrentSidebarHash),
    _useState4 = _slicedToArray(_useState3, 2),
    currentSidebarHash = _useState4[0],
    setCurrentSidebarHash = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    hashInitialized = _useState6[0],
    setHashInitialized = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    sidebarExpanded = _useState8[0],
    setSidebarExpanded = _useState8[1]; // for small viewports only

  // Get the vertical pixel offset for the content associated to any sidebar link by hash
  var getSidebarLinkScrollPosition = (0, _react.useCallback)(function (hash) {
    if (!hasSidebarLinks || sidebarLinksAsStandaloneChildren || !contentRef.current) {
      return -1;
    }
    var headerOffset = (headerRef.current || {}).offsetHeight || 0;
    var stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;
    if (hash === '#') {
      return 0;
    }
    var anchor = contentRef.current.querySelector(hash);
    return !anchor ? -1 : anchor.offsetTop + headerOffset - stickyOffset - _Theme.default.spacing(5);
  }, [hasSidebarLinks, sidebarLinksAsStandaloneChildren, belowMd]);

  /**
     Effect - For sidebarLinks pages, on successful load, if hash is present then update the current
  */
  (0, _react.useLayoutEffect)(function () {
    if (error || loading || !hasSidebarLinks) {
      return function () {};
    }
    var handleHashChange = function handleHashChange() {
      var hash = document.location.hash;
      if (currentSidebarHash === hash) {
        return;
      }
      setCurrentSidebarHash(hash);
      // If standard sidebar mode (scroll to content) also perform the scroll offset here
      if (!sidebarLinksAsStandaloneChildren) {
        window.setTimeout(function () {
          window.scrollTo(0, getSidebarLinkScrollPosition(hash));
        }, 0);
      }
    };
    // Handle URL-defined hash on initial load
    if (document.location.hash && !hashInitialized) {
      // Ensure the document hash maps to a defined hash or '#' at all times
      if (!Object.keys(sidebarHashMap).includes(document.location.hash)) {
        document.location.hash = '#';
      }
      handleHashChange();
      setHashInitialized(true);
    }
    // Set max-height on sidebar links container when the sidebar is sticky so the links get
    // a dedicated scrollbar instead of clipping
    if (!sidebarUnsticky && hasSidebarLinks && sidebarLinksContainerRef.current) {
      var maxHeight = window.innerHeight - sidebarLinksContainerRef.current.offsetTop - 104;
      sidebarLinksContainerRef.current.style.maxHeight = "".concat(maxHeight, "px");
    }
    // For sidebarLinksAsStandaloneChildren listen for hash changes to trigger a "redirect".
    if (sidebarLinksAsStandaloneChildren) {
      window.addEventListener('hashchange', handleHashChange);
      return function () {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
    // Set up event listener / handler for user-input scroll events for standard scrolling pages
    var handleScroll = function handleScroll() {
      var scrollBreaks = sidebarLinks.map(function (link) {
        return {
          y: getSidebarLinkScrollPosition(link.hash || '#'),
          hash: link.hash || '#'
        };
      });
      // Determine the current scrolled-to hash. If at the max scroll always go to the last hash.
      // Otherwise choose from scroll position relative to scroll breakpoints.
      var detectionBuffer = 80; // Extra pixels to highlight the next link when we're close enough
      var currentScrolledHash = isAtMaxScroll() ? scrollBreaks[scrollBreaks.length - 1].hash : scrollBreaks.reduce(function (acc, curr) {
        return curr.y !== -1 && window.scrollY >= curr.y - detectionBuffer ? curr.hash : acc;
      }, sidebarLinks[0].hash || '#');
      if (currentScrolledHash !== currentSidebarHash) {
        setCurrentSidebarHash(currentScrolledHash);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return function () {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [error, loading, sidebarLinks, sidebarHashMap, sidebarUnsticky, hasSidebarLinks, hashInitialized, setHashInitialized, currentSidebarHash, setCurrentSidebarHash, sidebarLinksContainerRef, getSidebarLinkScrollPosition, sidebarLinksAsStandaloneChildren]);

  /**
     Effect - Load Drupal CSS
  */
  var _useState9 = (0, _react.useState)(_NeonContext.FETCH_STATUS.AWAITING_CALL),
    _useState10 = _slicedToArray(_useState9, 2),
    drupalCssStatus = _useState10[0],
    setDrupalCssStatus = _useState10[1];
  (0, _react.useEffect)(function () {
    if (!useSomeDrupalAssets) {
      return;
    }
    if (drupalCssStatus !== _NeonContext.FETCH_STATUS.AWAITING_CALL) {
      return;
    }
    setDrupalCssStatus(_NeonContext.FETCH_STATUS.FETCHING);
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = _remoteAssetsMap.default[DRUPAL_THEME_CSS].url;
    link.crossOrigin = 'anonymous';
    link.onload = function () {
      setDrupalCssStatus(_NeonContext.FETCH_STATUS.SUCCESS);
    };
    link.onerror = function () {
      _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Promise.resolve().then(function () {
                  return _interopRequireWildcard(require('../../remoteAssets/drupal-theme.css'));
                });
              case 2:
                // Assume this local import worked and still report the load as successful
                // We do this because props on header and footer express whether the CSS is
                // loaded and we want to simplify that as a boolean. The header and footer
                // don't care where the CSS came from so long as it's there.
                setDrupalCssStatus(_NeonContext.FETCH_STATUS.SUCCESS);
              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    };
    document.body.appendChild(link);
  }, [useSomeDrupalAssets, drupalCssStatus, setDrupalCssStatus]);

  /**
     Liferay Notifications
   */
  var cancellationSubject$ = new _rxjs.Subject();
  var notificationDismissals = cookies.get('dismissed-notifications') || [];
  var initialFetchStatus = null;
  var initialNotifications = [];
  if (notification !== null && notification.length) {
    var notificationPropId = (0, _liferayNotificationsUtil.generateNotificationId)(notification);
    initialFetchStatus = 'success';
    initialNotifications = [{
      id: notificationPropId,
      message: notification,
      dismissed: notificationDismissals.includes(notificationPropId)
    }];
  }
  var _useState11 = (0, _react.useState)(initialFetchStatus),
    _useState12 = _slicedToArray(_useState11, 2),
    fetchNotificationsStatus = _useState12[0],
    setFetchNotificationsStatus = _useState12[1];
  var _useState13 = (0, _react.useState)(initialNotifications),
    _useState14 = _slicedToArray(_useState13, 2),
    notifications = _useState14[0],
    setNotifications = _useState14[1];

  // Handle a successful response from the notifications endpoint
  var handleFetchNotificationsSuccess = function handleFetchNotificationsSuccess(response) {
    setFetchNotificationsStatus('success');
    if (!Array.isArray(response.notifications)) {
      return;
    }
    setNotifications(response.notifications.map(function (message) {
      var id = (0, _liferayNotificationsUtil.generateNotificationId)(message);
      var dismissed = notificationDismissals.includes(id);
      return {
        id: id,
        message: message,
        dismissed: dismissed
      };
    }));
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  var handleFetchNotificationsError = function handleFetchNotificationsError() {
    setFetchNotificationsStatus('error');
    setNotifications([]);
  };
  var handleHideNotifications = function handleHideNotifications() {
    var updatedDismissals = notifications.map(function (n) {
      return n.id;
    });
    cookies.set('dismissed-notifications', updatedDismissals, {
      path: '/',
      maxAge: 86400
    });
    setNotifications(notifications.map(function (n) {
      return _extends({}, n, {
        dismissed: true
      });
    }));
  };
  var handleShowNotifications = function handleShowNotifications() {
    cookies.remove('dismissed-notifications');
    setNotifications(notifications.map(function (n) {
      return _extends({}, n, {
        dismissed: false
      });
    }));
  };

  /**
     Effect - Fetch notifications
  */
  (0, _react.useEffect)(function () {
    if (fetchNotificationsStatus !== null) {
      return;
    }
    setFetchNotificationsStatus('fetching');
    (0, _rxUtil.getJson)((0, _liferayNotificationsUtil.getLiferayNotificationsApiPath)(), handleFetchNotificationsSuccess, handleFetchNotificationsError, cancellationSubject$, undefined, true);
  }, [fetchNotificationsStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
     Render functions
   */
  var renderTitle = function renderTitle() {
    if ((loading || error) && !title) {
      return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        width: "45%",
        height: 24,
        style: {
          margin: _Theme.default.spacing(2, 0, 4, 0)
        }
      });
    }
    if ((!title || !title.length) && !sidebarLinksAsStandaloneChildren) {
      return null;
    }
    var titleString = title || '';
    if (sidebarLinksAsStandaloneChildren) {
      var sidebarLink = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0];
      titleString = sidebarLink.pageTitle || sidebarLink.name;
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      "data-selenium": "neon-page.title",
      variant: "h3",
      component: "h1",
      className: classes.pageTitle
    }, titleString), subtitle ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      "data-selenium": "neon-page.subtitle",
      variant: "subtitle1",
      component: "p",
      className: classes.pageSubtitle
    }, subtitle) : null);
  };
  var renderBreadcrumbs = function renderBreadcrumbs() {
    return !breadcrumbs.length ? null : /*#__PURE__*/_react.default.createElement(_Breadcrumbs.default, {
      "aria-label": "Breadcrumbs",
      "data-selenium": "neon-page.breadcrumbs",
      className: classes.breadcrumbs
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      key: (0, _uniqueId.default)(),
      href: breadcrumbHomeHref
    }, /*#__PURE__*/_react.default.createElement(_Home.default, {
      title: "Home",
      fontSize: "small",
      style: {
        marginBottom: '-4px'
      }
    })), breadcrumbs.map(function (breadcrumb, idx) {
      return idx !== breadcrumbs.length - 1 ? /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: (0, _uniqueId.default)(),
        href: breadcrumb.href
      }, breadcrumb.name) : /*#__PURE__*/_react.default.createElement(_Typography.default, {
        key: "{idx}",
        color: "textPrimary"
      }, breadcrumb.name);
    }));
  };
  var renderOverlay = function renderOverlay(overlayChildren) {
    return /*#__PURE__*/_react.default.createElement(_Backdrop.default, {
      open: !overlayDismissed
    }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
      className: classes.backdropPaper
    }, overlayChildren, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.dismissOverlay
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      size: "small",
      startIcon: /*#__PURE__*/_react.default.createElement(_Clear.default, null),
      variant: "outlined",
      onClick: function onClick() {
        setOverlayDismissed(true);
      }
    }, "Dismiss"))));
  };
  var renderLoading = function renderLoading() {
    return !loading || error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5",
      component: "h3",
      gutterBottom: true
    }, loading), progress === null ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null) : /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
      variant: "determinate",
      value: progress
    })));
  };
  var renderError = function renderError() {
    return !error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      fontSize: "large",
      color: "error"
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5",
      component: "h3",
      style: {
        marginTop: _Theme.default.spacing(1)
      }
    }, error)));
  };
  var renderSidebar = function renderSidebar() {
    if (!hasSidebar) {
      return null;
    }
    var sidebarContainerStyle = belowMd ? {} : {
      width: "".concat(sidebarWidth, "px")
    };
    var dividerStyle = !belowMd ? {
      width: "".concat(sidebarWidth - _Theme.default.spacing(8), "px")
    } : {};
    var sidebarClassName = sidebarContainerClassNameProp ? "".concat(classes.sidebarContainer, " ").concat(sidebarContainerClassNameProp) : classes.sidebarContainer;
    // Arbitrary Content Sidebar (no automatic skeleton)
    if (hasSidebarContent) {
      return /*#__PURE__*/_react.default.createElement("div", {
        ref: sidebarRef,
        className: sidebarClassName,
        style: sidebarContainerStyle
      }, sidebarContent);
    }
    // Render Sidebar Title
    var renderSidebarTitle = function renderSidebarTitle() {
      if (!sidebarTitle && !title) {
        return null;
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.sidebarTitlesContainer
      }, loading || error ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        width: 200,
        height: 22,
        style: {
          marginBottom: _Theme.default.spacing(1)
        }
      }), !sidebarSubtitle ? null : /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        width: 120,
        height: 16,
        style: {
          marginBottom: _Theme.default.spacing(1)
        }
      })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h5",
        component: "h3",
        className: classes.sidebarTitle
      }, sidebarTitle || title), !sidebarSubtitle ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        component: "h4",
        className: classes.sidebarSubtitle
      }, sidebarSubtitle)));
    };
    // Render Single Sidebar Link
    var renderLink = function renderLink(link) {
      var standalone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!link) {
        return null;
      }
      var name = link.name,
        _link$hash = link.hash,
        hash = _link$hash === void 0 ? '#' : _link$hash,
        IconComponent = link.icon;
      if (loading || error) {
        return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
          key: name,
          width: "".concat(Math.floor(50 + Math.random() * 50), "%"),
          height: 16,
          style: {
            marginBottom: '16px'
          }
        });
      }
      var icon = IconComponent ? /*#__PURE__*/_react.default.createElement(IconComponent, {
        className: classes.sidebarLinkIcon
      }) : null;
      return /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: name,
        href: hash,
        onClick: sidebarLinksAsStandaloneChildren ? function () {
          setCurrentSidebarHash(hash);
          if (sidebarExpanded) {
            setSidebarExpanded(false);
          }
        } : null,
        className: currentSidebarHash === hash ? "".concat(classes.sidebarLink, " ").concat(classes.sidebarLinkCurrent) : classes.sidebarLink,
        style: standalone ? {
          marginBottom: '0px'
        } : {}
      }, icon, name);
    };
    var fullLinks = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      ref: sidebarLinksContainerRef,
      className: classes.sidebarLinksContainer
    }, sidebarLinks.map(function (link) {
      return renderLink(link);
    })), belowMd ? null : /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({
        marginBottom: '0px'
      }, dividerStyle)
    }));
    var currentLinkOnly = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarLinksContainer
    }, renderLink(sidebarLinks[sidebarHashMap[currentSidebarHash]], true));
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: sidebarRef,
      className: sidebarClassName,
      style: sidebarContainerStyle
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: !sidebarUnsticky && !belowMd ? "".concat(classes.sidebarInnerStickyContainer, " neon__sidebar-sticky") : null
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarTitleContainer
    }, renderSidebarTitle(), !belowMd ? null : /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      size: "small",
      onClick: function onClick() {
        return setSidebarExpanded(!sidebarExpanded);
      }
    }, sidebarExpanded ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, {
      fontSize: "large"
    }) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, {
      fontSize: "large"
    }))), /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({}, dividerStyle)
    }), sidebarLinksAdditionalContent && (!belowMd || sidebarExpanded) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, sidebarLinksAdditionalContent, /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({}, dividerStyle)
    })) : null, belowMd && !sidebarExpanded ? currentLinkOnly : fullLinks));
  };
  var renderNeonPage = function renderNeonPage() {
    var outerPageContainerStyles = {};
    if (outerPageContainerMaxWidth) {
      outerPageContainerStyles.maxWidth = !hasSidebar || belowMd ? outerPageContainerMaxWidth : "calc(".concat(outerPageContainerMaxWidth, " - ").concat(sidebarWidth + 48, "px)");
    }
    var content = children;
    if (hasSidebarLinks && sidebarLinksAsStandaloneChildren) {
      var CurrentComponent = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0].component;
      content = /*#__PURE__*/_react.default.createElement(CurrentComponent, null);
    }
    return /*#__PURE__*/_react.default.createElement(_styles2.ThemeProvider, {
      theme: _Theme.default
    }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(GlobalCss, null), customHeader ? /*#__PURE__*/_react.default.createElement("header", {
      ref: headerRef
    }, customHeader) : /*#__PURE__*/_react.default.createElement(_NeonHeader.default, {
      ref: headerRef,
      unstickyDrupalHeader: unstickyDrupalHeader,
      notifications: notifications,
      onShowNotifications: handleShowNotifications,
      drupalCssLoaded: drupalCssStatus === _NeonContext.FETCH_STATUS.SUCCESS
    }), /*#__PURE__*/_react.default.createElement(_Container.default, {
      className: classes.outerPageContainer,
      style: outerPageContainerStyles
    }, renderSidebar(), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.pageContent,
      style: {
        top: hasSidebar && !breadcrumbs.length ? '12px' : '0px'
      },
      "data-selenium": "neon-page.content",
      ref: contentRef
    }, renderBreadcrumbs(), renderTitle(), content)), /*#__PURE__*/_react.default.createElement(_LiferayNotifications.default, {
      notifications: notifications,
      onHideNotifications: handleHideNotifications
    }), /*#__PURE__*/_react.default.createElement(_BrowserWarning.default, null), customFooter ? /*#__PURE__*/_react.default.createElement("footer", null, customFooter) : /*#__PURE__*/_react.default.createElement(_NeonFooter.default, {
      drupalCssLoaded: drupalCssStatus === _NeonContext.FETCH_STATUS.SUCCESS
    }), renderLoading(), renderError());
  };
  var renderedPage = neonContextIsActive ? renderNeonPage() : /*#__PURE__*/_react.default.createElement(_NeonContext.default.Provider, _extends({
    useCoreAuth: true,
    fetchPartials: useSomeDrupalAssets
  }, NeonContextProviderProps), renderNeonPage());
  return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
    FallbackComponent: NeonErrorPage,
    onReset: resetStateAfterRuntimeError
  }, renderedPage);
};
var children = _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]);
NeonPage.propTypes = {
  breadcrumbHomeHref: _propTypes.default.string,
  breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    href: _propTypes.default.string
  })),
  customHeader: _propTypes.default.node,
  customFooter: _propTypes.default.node,
  error: _propTypes.default.string,
  loading: _propTypes.default.string,
  notification: _propTypes.default.string,
  outerPageContainerMaxWidth: _propTypes.default.string,
  progress: _propTypes.default.number,
  resetStateAfterRuntimeError: _propTypes.default.func,
  sidebarContent: children,
  sidebarContainerClassName: _propTypes.default.string,
  sidebarLinks: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    pageTitle: _propTypes.default.string,
    hash: _propTypes.default.string,
    icon: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),
    component: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object])
  })),
  sidebarLinksAdditionalContent: children,
  sidebarLinksAsStandaloneChildren: _propTypes.default.bool,
  sidebarSubtitle: _propTypes.default.string,
  sidebarTitle: _propTypes.default.string,
  sidebarWidth: _propTypes.default.number,
  sidebarUnsticky: _propTypes.default.bool,
  subtitle: _propTypes.default.oneOfType([_propTypes.default.string, children]),
  title: _propTypes.default.oneOfType([_propTypes.default.string, children]),
  unstickyDrupalHeader: _propTypes.default.bool,
  NeonContextProviderProps: _propTypes.default.shape(_NeonContext.default.ProviderPropTypes),
  children: children.isRequired
};
NeonPage.defaultProps = {
  breadcrumbHomeHref: '/',
  breadcrumbs: [],
  customHeader: null,
  customFooter: null,
  error: null,
  loading: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  progress: null,
  resetStateAfterRuntimeError: function resetStateAfterRuntimeError() {},
  sidebarContent: null,
  sidebarContainerClassName: null,
  sidebarLinks: null,
  sidebarLinksAdditionalContent: null,
  sidebarLinksAsStandaloneChildren: false,
  sidebarSubtitle: null,
  sidebarTitle: null,
  sidebarWidth: 300,
  sidebarUnsticky: false,
  subtitle: null,
  title: null,
  unstickyDrupalHeader: true,
  NeonContextProviderProps: {}
};
var _default = NeonPage;
exports.default = _default;