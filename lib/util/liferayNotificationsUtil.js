"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLiferayNotificationsApiPath = exports.generateNotificationId = exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// NOTE: This is not defined in NeonEnvironment, where one would expect such
// things, because this whole component is temporary. When Liferay is dead and
// React pages can pull notifications from its replacement (Drupal), then this
// should be appropriately refactored and hardened.
const getLiferayNotificationsApiPath = () => _NeonEnvironment.default.getFullAuthPath('notifications');

// Non-secure string hashing function found here: https://stackoverflow.com/a/8831937
// Use for unique id for notifications for keying nodes and tracking dismissal cookies
/* eslint-disable no-bitwise */
exports.getLiferayNotificationsApiPath = getLiferayNotificationsApiPath;
const generateNotificationId = message => {
  let hash = 0;
  if (!message.length) {
    return hash;
  }
  let char;
  for (let i = 0; i < message.length; i += 1) {
    char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return "notification-".concat(hash);
};
/* eslint-enable no-bitwise */
exports.generateNotificationId = generateNotificationId;
var _default = exports.default = getLiferayNotificationsApiPath;