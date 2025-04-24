"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _rxjs = require("rxjs");
/**
 * A function to use a distributed shared state for sharing state between components outside
 * of the component heirarchy. The subject would be defined in an
 * external module and then this function can be imported to incorporate the shared
 * state into a component.
 * @param subject A subject.
 * @returns The value and function to set the state.
 */
const useSharedState = subject => {
  const [value, setState] = (0, _react.useState)(subject.getValue());
  (0, _react.useEffect)(() => {
    const subscription = subject.pipe((0, _rxjs.skip)(1)).subscribe(s => setState(s));
    return () => subscription.unsubscribe();
  }, [subject]);
  const setDistributedState = state => subject.next(state);
  // @ts-ignore
  return [value, setDistributedState];
};
var _default = exports.default = useSharedState;