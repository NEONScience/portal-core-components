"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.generateNotificationId = exports.getLiferayNotificationsApiPath = void 0;

// NOTE: This is not defined in NeonEnvironment, where one would expect such
// things, because this whole component is temporary. When Liferay is dead and
// React pages can pull notifications from its replacement (Drupal), then this
// should be appropriately refactored and hardened.
var getLiferayNotificationsApiPath = function getLiferayNotificationsApiPath() {
  var base = window.location.origin; // Override localhost dev

  if (base.includes('localhost')) {
    base = 'https://local-data.neonscience.org';
  }

  return "".concat(base, "/auth0/liferaynotifications");
}; // Non-secure string hashing function found here: https://stackoverflow.com/a/8831937
// Use for unique id for notifications for keying nodes and tracking dismissal cookies

/* eslint-disable no-bitwise */


exports.getLiferayNotificationsApiPath = getLiferayNotificationsApiPath;

var generateNotificationId = function generateNotificationId(message) {
  var hash = 0;

  if (!message.length) {
    return hash;
  }

  var char;

  for (var i = 0; i < message.length; i += 1) {
    char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }

  return "notification-".concat(hash);
};
/* eslint-enable no-bitwise */


exports.generateNotificationId = generateNotificationId;
var _default = getLiferayNotificationsApiPath;
exports.default = _default;