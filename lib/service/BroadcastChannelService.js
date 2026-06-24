"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let AUTH_BROADCAST_CHANNEL;
const getAuthBroadcastChannel = () => {
  if (_NeonEnvironment.default.authDisableBroadcastChannel) {
    return undefined;
  }
  if (!(0, _typeUtil.exists)(AUTH_BROADCAST_CHANNEL)) {
    try {
      AUTH_BROADCAST_CHANNEL = new BroadcastChannel('neon-portal-auth-channel');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
  return AUTH_BROADCAST_CHANNEL;
};

/**
 * Service for broadcast channel interface
 */

const BroadcastChannelService = {
  addAuthChannelMessageEventListener: eventListener => {
    if (_NeonEnvironment.default.authDisableBroadcastChannel) {
      return;
    }
    const undefBc = getAuthBroadcastChannel();
    if (!(0, _typeUtil.exists)(undefBc)) {
      return;
    }
    const bc = undefBc;
    bc.addEventListener('message', eventListener);
  },
  removeAuthChannelMessageEventListener: eventListener => {
    if (_NeonEnvironment.default.authDisableBroadcastChannel) {
      return;
    }
    const undefBc = getAuthBroadcastChannel();
    if (!(0, _typeUtil.exists)(undefBc)) {
      return;
    }
    const bc = undefBc;
    bc.removeEventListener('message', eventListener);
  },
  sendLoginMessage: () => {
    if (_NeonEnvironment.default.authDisableBroadcastChannel) {
      return;
    }
    const undefBc = getAuthBroadcastChannel();
    if (!(0, _typeUtil.exists)(undefBc)) {
      return;
    }
    const bc = undefBc;
    const message = {
      event: 'login'
    };
    bc.postMessage(message);
  },
  sendAccountDataChangedMessage: () => {
    if (_NeonEnvironment.default.authDisableBroadcastChannel) {
      return;
    }
    const undefBc = getAuthBroadcastChannel();
    if (!(0, _typeUtil.exists)(undefBc)) {
      return;
    }
    const bc = undefBc;
    const message = {
      event: 'account-data-changed'
    };
    bc.postMessage(message);
  }
};
Object.freeze(BroadcastChannelService);
var _default = exports.default = BroadcastChannelService;