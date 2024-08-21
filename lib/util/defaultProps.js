"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withDefaultProps = exports.resolveProps = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Utility function for resolving default component props to specified props
 * @param defaultProps The default props to apply
 * @param props The current set of props
 * @returns The resolved set of props
 */
const resolveProps = (defaultProps, props) => {
  const resolved = {
    ...props
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in defaultProps) {
    if (Object.prototype.hasOwnProperty.call(defaultProps, key)) {
      const propName = key;
      if (resolved[propName] === undefined) {
        resolved[propName] = defaultProps[propName];
      }
    }
  }
  return resolved;
};

/**
 * Higher order component wrapper function to apply default props
 * to a component
 * @param WrappedComponent The component to apply default props to
 * @param defaultProps The set of default props to apply
 * @returns The component with default props applied
 */
exports.resolveProps = resolveProps;
const withDefaultProps = (WrappedComponent, defaultProps) => props => {
  const resolvedProps = resolveProps(defaultProps, props);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(WrappedComponent, {
    ...resolvedProps
  });
};
exports.withDefaultProps = withDefaultProps;
var _default = exports.default = {
  resolveProps,
  withDefaultProps
};