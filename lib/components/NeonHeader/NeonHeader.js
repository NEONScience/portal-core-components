"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _htmlReactParser = _interopRequireWildcard(require("html-react-parser"));
var _styles = require("@material-ui/core/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _camelCase = _interopRequireDefault(require("lodash/camelCase"));
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _drupalHeader = _interopRequireDefault(require("../../remoteAssets/drupal-header.html"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonAuth = _interopRequireWildcard(require("../NeonAuth/NeonAuth"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _ApplicationMenu = _interopRequireDefault(require("./ApplicationMenu"));
var _headerSearch = _interopRequireDefault(require("../../images/svg/header-search.svg"));
var _headerSearchHover = _interopRequireDefault(require("../../images/svg/header-search-hover.svg"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DRUPAL_HEADER_HTML = _remoteAssetsMap.default.DRUPAL_HEADER_HTML.KEY;
var AUTH_ELEMENT_ID = 'header__authentication-ui';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  var _coreAuthContainer, _headerContainer;
  return {
    skeletonHeader: {
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)'
    },
    // positioning of sign-in and sign-out buttons
    coreAuthContainer: (_coreAuthContainer = {
      // common styles
      textAlign: 'right',
      position: 'absolute',
      zIndex: 15
    }, _defineProperty(_coreAuthContainer, theme.breakpoints.up('lg'), {
      padding: '0px',
      top: '-1px',
      right: '0px',
      '& :last-child': {
        borderRight: 'none',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px'
      },
      '& :first-child': {
        borderRight: 'none',
        borderTopLeftRadius: '0px'
      }
    }), _defineProperty(_coreAuthContainer, theme.breakpoints.down('md'), {
      padding: theme.spacing(1, 2),
      top: theme.spacing(1),
      right: theme.spacing(9)
    }), _coreAuthContainer),
    // These styles are gross. We need to rework the header coming from the Drupal site to make this
    // less necessary.
    unstickyHeader: {
      paddingTop: 'unset !important',
      '& > header': _defineProperty({
        position: 'unset !important',
        '& label[for="nav-trigger"]': {
          zIndex: '9 !important'
        },
        '& div.header__site-navigation': {
          zIndex: '8 !important'
        }
      }, theme.breakpoints.down('sm'), {
        '& .header__site-navigation': {
          display: 'none'
        },
        '& .nav-trigger:checked ~ .header__site-navigation': {
          display: 'block'
        }
      })
    },
    headerContainerFallback: {
      '& li.siteSearch > a': {
        background: "url('".concat(_headerSearch.default, "') center center no-repeat !important")
      },
      '& li.siteSearch > a:hover': {
        background: "url('".concat(_headerSearchHover.default, "') center center no-repeat !important")
      }
    },
    // Injecting these styles as a means of fixing up the search display
    // Ideally, this CSS comes from Drupal and is removed from here...
    headerContainer: (_headerContainer = {
      // // Added menu__link to more closely mimic Drupal site links.
      // '& .menu__link': {
      //   fontSize: '1.1rem !important',
      //   fontWeight: '700 !important',
      // },
      '& .header__search': {
        background: '#f5f6f7',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.2s ease-in-out',
        opacity: 1,
        visibility: 'visible',
        fontSize: '1.1rem' // Added, font sizes look bigger on Drupal site.
      },

      '& .header__search.visually-hidden': {
        visibility: 'hidden',
        opacity: 0,
        transition: 'all 0.2s ease-in-out'
      },
      '& .header__search > .header__search--inner': {
        display: 'flex',
        maxWidth: '1620px',
        margin: '0 auto'
      },
      '& .header__inner.l--offset-wide': {
        paddingLeft: 'calc(2/27*100%)',
        paddingRight: 'calc(2/27*100%)'
      },
      // Purely a quick-fix workaround for Drupal header auth container...
      '& .header__inner.l--offset-wide > .authContainer': {
        display: 'none !important'
      },
      '& .header__search--inner': {
        display: 'flex',
        '-ms-flex-pack': 'start',
        justifyContent: 'flex-start',
        '-ms-flex-align': 'center',
        alignItems: 'center'
      },
      '& .header__search--inner > .header__search--title': {
        fontWeight: '600 !important',
        // Changed from 600 to match Drupal site.
        fontSize: '0.9rem !important',
        // Changed from 0.9 to match Drupal site.
        margin: '0 2.6rem 0 0 !important'
      }
    }, _defineProperty(_headerContainer, theme.breakpoints.up('lg'), {
      '& .header__search--inner > .header__search--title': {
        fontSize: '1.25rem !important' // Changed from 1.0 to match Drupal site.
      }
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form', {
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
      width: '100%'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item', {
      width: '100%',
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
      margin: '20px 0'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form', {
      width: '100%'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions.form-wrapper', {
      display: 'flex'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item > .form-search', {
      width: '100%',
      height: '48px',
      background: '#fff',
      border: '1px solid #d7d9d9',
      boxSizing: 'border-box',
      borderRadius: '3px 0 0 3px',
      padding: '12px 18px'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search', {
      borderRadius: '0px 3px 3px 0px',
      width: '48px',
      height: '48px',
      background: '#0073cf',
      border: '#0073cf 1px solid',
      color: 'transparent !important',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8%202a6%206%200%20100%2012A6%206%200%20008%202zM0%208a8%208%200%201114.32%204.906l5.387%205.387-1.414%201.414-5.387-5.387A8%208%200%20010%208z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E")',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      padding: '0.86rem 0',
      transition: 'all 0.2s ease-in-out'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search:hover', {
      transition: 'all 0.2s ease-in-out',
      backgroundColor: '#002c77',
      border: '#002c77 1px solid'
    }), _defineProperty(_headerContainer, '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item > label', {
      fontWeight: 600,
      fontSize: '20px',
      margin: 'auto 2.6rem'
    }), _defineProperty(_headerContainer, '& .header__search--inner > .header__search-close', {
      margin: 'auto 2.5rem'
    }), _defineProperty(_headerContainer, '& .header__search--inner > .header__search-close > button', {
      background: 'none',
      border: 'none',
      width: '50px'
    }), _defineProperty(_headerContainer, '& .header__search--inner > .header__search-close > button > svg', {
      verticalAlign: 'middle'
    }), _defineProperty(_headerContainer, '& .header__search--inner > .header__search-close > button > svg > path', {
      transition: 'all 0.2s ease-in-out'
    }), _defineProperty(_headerContainer, '& .header__search--inner > .header__search-close > button:hover > svg > path', {
      fill: '#002c77',
      transition: 'all 0.2s ease-in-out'
    }), _defineProperty(_headerContainer, theme.breakpoints.down('md'), {
      '& nav#block-neon-main-menu > ul.menu.menu--main > li.siteSearch': {
        padding: '0 1.875rem 0.625rem 1.875rem !important'
      },
      '& .search-form-mobile.isMobile': {
        display: 'flex',
        '-ms-flex-pack': 'start',
        justifyContent: 'flex-start',
        '-ms-flex-align': 'center',
        alignItems: 'center'
      },
      '& .search-form-mobile': {
        width: '100%'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form': {
        display: 'flex',
        '-ms-flex-pack': 'start',
        justifyContent: 'flex-start',
        '-ms-flex-align': 'center',
        alignItems: 'center',
        width: '100%'
      },
      '& .search-form-mobile > div.search-api-form': {
        width: '100%'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item': {
        width: '100%',
        margin: '20px 0'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item > .form-search': {
        width: '100%',
        height: '48px',
        background: '#fff',
        border: '1px solid #d7d9d9',
        boxSizing: 'border-box',
        borderRadius: '3px 0 0 3px',
        padding: '0.75rem 1.125rem'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions.form-wrapper': {
        display: 'flex'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search': {
        borderRadius: '0px 3px 3px 0px',
        width: '48px',
        height: '48px',
        background: '#0073cf',
        border: '#0073cf 1px solid',
        color: 'transparent !important',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8%202a6%206%200%20100%2012A6%206%200%20008%202zM0%208a8%208%200%201114.32%204.906l5.387%205.387-1.414%201.414-5.387-5.387A8%208%200%20010%208z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E")',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        padding: '14px 0',
        transition: 'all 0.2s ease-in-out'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search:hover': {
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#002c77',
        border: '#002c77 1px solid'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item > label': {
        display: 'none !important'
      }
    }), _headerContainer)
  };
});
var buildSearchAction = function buildSearchAction(action) {
  var root = _NeonEnvironment.default.getWebHost();
  if (!action) return "".concat(root, "/search/site");
  if (action.startsWith('/')) {
    return "".concat(root).concat(action);
  }
  return "".concat(root, "/").concat(action);
};
var applyAttribute = function applyAttribute(nextAttribs, attribs, attr) {
  switch (attr) {
    case 'class':
      // eslint-disable-next-line no-param-reassign
      nextAttribs.className = attribs[attr];
      break;
    default:
      if (attr.includes('-')) {
        // eslint-disable-next-line no-param-reassign
        nextAttribs[(0, _camelCase.default)(attr)] = attribs[attr];
      } else {
        // eslint-disable-next-line no-param-reassign
        nextAttribs[attr] = attribs[attr];
      }
      break;
  }
};
var NeonHeader = /*#__PURE__*/(0, _react.forwardRef)(function (props, headerRef) {
  var drupalCssLoaded = props.drupalCssLoaded,
    unstickyDrupalHeader = props.unstickyDrupalHeader,
    showSkeleton = props.showSkeleton;
  var classes = useStyles(_Theme.default);
  var belowLg = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));
  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
    _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
    _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
    neonContextIsActive = _NeonContext$useNeonC3.isActive,
    headerFetch = _NeonContext$useNeonC3.fetches[DRUPAL_HEADER_HTML],
    headerHTML = _NeonContext$useNeonC3.html[DRUPAL_HEADER_HTML],
    auth = _NeonContext$useNeonC3.auth;

  // Only do the delay effect if not in test
  var initialRenderDelay = process.env.NODE_ENV === 'test';
  var _useState = (0, _react.useState)(_NeonContext.FETCH_STATUS.AWAITING_CALL),
    _useState2 = _slicedToArray(_useState, 2),
    headerJsStatus = _useState2[0],
    setHeaderJsStatus = _useState2[1];
  var _useState3 = (0, _react.useState)(initialRenderDelay),
    _useState4 = _slicedToArray(_useState3, 2),
    headerRenderDelayed = _useState4[0],
    setHeaderRenderDelayed = _useState4[1];
  var renderMode = 'loading';
  if (neonContextIsActive) {
    switch (headerFetch.status) {
      case _NeonContext.FETCH_STATUS.SUCCESS:
        renderMode = headerHTML && drupalCssLoaded && headerRenderDelayed ? 'drupal' : 'loading';
        break;
      case _NeonContext.FETCH_STATUS.ERROR:
        renderMode = drupalCssLoaded ? 'drupal-fallback' : 'loading';
        break;
      default:
        if (!_NeonEnvironment.default.fetchDrupalAssets) {
          renderMode = 'drupal-fallback';
        } else {
          renderMode = 'loading';
        }
        break;
    }
  }

  // Load header.js only after initial delayed render of the drupal header is complete
  (0, _react.useLayoutEffect)(function () {
    if (!_NeonEnvironment.default.fetchDrupalAssets) {
      _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('../../remoteAssets/drupal-header.js'));
              });
            case 2:
              setHeaderJsStatus(_NeonContext.FETCH_STATUS.SUCCESS);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
      return;
    }
    if (!renderMode.includes('drupal') || headerJsStatus !== _NeonContext.FETCH_STATUS.AWAITING_CALL || !headerRenderDelayed || !drupalCssLoaded) {
      return;
    }
    setHeaderJsStatus(_NeonContext.FETCH_STATUS.FETCHING);
    var script = document.createElement('script');
    script.src = _remoteAssetsMap.default.DRUPAL_HEADER_JS.url;
    script.onload = function () {
      setHeaderJsStatus(_NeonContext.FETCH_STATUS.SUCCESS);
    };
    script.onerror = function () {
      _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              script.remove();
              // eslint-disable-next-line no-unused-expressions, import/extensions
              _context2.next = 3;
              return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('../../remoteAssets/drupal-header.js'));
              });
            case 3:
              setHeaderJsStatus(_NeonContext.FETCH_STATUS.SUCCESS);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    };
    document.body.appendChild(script);
  }, [headerJsStatus, drupalCssLoaded, headerRenderDelayed, setHeaderJsStatus, renderMode]);

  // Delay the rendering of the drupal header one render cycle to allow the CSS to propogate into
  // the environment. This prevents a "flash" of the unstyled menu in the drupal header on page load
  var appliedHtmlCheck = headerHTML;
  switch (renderMode) {
    case 'drupal':
      appliedHtmlCheck = headerHTML;
      break;
    case 'drupal-fallback':
      appliedHtmlCheck = _drupalHeader.default;
      break;
    case 'loading':
    default:
      break;
  }
  (0, _react.useLayoutEffect)(function () {
    if (neonContextIsActive && appliedHtmlCheck && drupalCssLoaded && !headerRenderDelayed) {
      var timeout = window.setTimeout(function () {
        return setHeaderRenderDelayed(true);
      }, 0);
      return function () {
        return window.clearTimeout(timeout);
      };
    }
    return function () {};
  }, [neonContextIsActive, appliedHtmlCheck, drupalCssLoaded, headerRenderDelayed]);

  // Render Loading
  if (renderMode === 'loading' && showSkeleton) {
    return /*#__PURE__*/_react.default.createElement("header", {
      ref: headerRef,
      id: "header",
      className: classes.skeletonHeader
    }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      height: "".concat(belowLg ? 60 : 120, "px"),
      width: "100%"
    }));
  }

  // Render Drupal header
  var injectAuth = !auth.useCore ? null : {
    // eslint-disable-next-line react/no-unstable-nested-components
    replace: function replace(domNode) {
      var _domNode$attribs = domNode.attribs,
        attribs = _domNode$attribs === void 0 ? {} : _domNode$attribs,
        name = domNode.name;
      if (name === 'form' && attribs.id === 'search-api-form') {
        var nextAttribs = {};
        Object.keys(attribs).forEach(function (attr) {
          applyAttribute(nextAttribs, attribs, attr);
        });
        return /*#__PURE__*/_react.default.createElement("form", _extends({}, nextAttribs, {
          action: buildSearchAction(attribs.action)
        }), (0, _htmlReactParser.domToReact)(domNode.children, injectAuth));
      }
      if (attribs.id !== AUTH_ELEMENT_ID) {
        return null;
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        id: AUTH_ELEMENT_ID,
        className: classes.coreAuthContainer
      }, /*#__PURE__*/_react.default.createElement(_NeonAuth.default, {
        loginPath: _NeonEnvironment.default.getFullAuthPath('login'),
        logoutPath: _NeonEnvironment.default.getFullAuthPath('logout'),
        accountPath: _NeonEnvironment.default.route.buildAccountRoute(),
        loginType: _NeonAuth.NeonAuthType.REDIRECT,
        logoutType: _NeonAuth.NeonAuthType.SILENT,
        displayType: _NeonAuth.NeonAuthDisplayType.MENU
      }));
    }
  };
  var appliedClassName = classes.headerContainer;
  if (unstickyDrupalHeader) {
    appliedClassName = "".concat(classes.unstickyHeader, " ").concat(classes.headerContainer);
  }
  if (renderMode === 'drupal-fallback' || renderMode === 'loading' && !showSkeleton) {
    appliedClassName = "".concat(appliedClassName, " ").concat(classes.headerContainerFallback);
  }
  var html = renderMode === 'drupal' ? headerHTML : _drupalHeader.default;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("header", {
    ref: headerRef,
    id: "header",
    className: appliedClassName
  }, (0, _htmlReactParser.default)(html, injectAuth)), /*#__PURE__*/_react.default.createElement(_ApplicationMenu.default, null));
});
NeonHeader.propTypes = {
  drupalCssLoaded: _propTypes.default.bool,
  unstickyDrupalHeader: _propTypes.default.bool,
  showSkeleton: _propTypes.default.bool
};
NeonHeader.defaultProps = {
  drupalCssLoaded: false,
  unstickyDrupalHeader: true,
  showSkeleton: false
};
var _default = NeonHeader;
exports.default = _default;