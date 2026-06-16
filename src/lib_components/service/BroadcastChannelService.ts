import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { Undef } from '../types/core';
import { exists } from '../util/typeUtil';

let AUTH_BROADCAST_CHANNEL: Undef<BroadcastChannel>;

export type MessageEventListener = (event: MessageEvent<any>) => void;

export interface LoginMessage {
  event: string;
}

const getAuthBroadcastChannel = (): Undef<BroadcastChannel> => {
  if (NeonEnvironment.authDisableBroadcastChannel) {
    return undefined;
  }
  if (!exists(AUTH_BROADCAST_CHANNEL)) {
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
export interface IBroadcastChannelService {
  /**
   * Adds a message event listener
   * @param {MessageEventListener} eventListener - The message event listener
   */
  addAuthChannelMessageEventListener: (eventListener: MessageEventListener) => void;
  /**
   * Removes a message event listener
   * @param {MessageEventListener} eventListener - The message event listener
   */
  removeAuthChannelMessageEventListener: (eventListener: MessageEventListener) => void;
  /**
   * Sends a login message to the broadcast channel
   */
  sendLoginMessage: () => void;
}

const BroadcastChannelService: IBroadcastChannelService = {
  addAuthChannelMessageEventListener: (eventListener: MessageEventListener): void => {
    if (NeonEnvironment.authDisableBroadcastChannel) {
      return;
    }
    const undefBc: Undef<BroadcastChannel> = getAuthBroadcastChannel();
    if (!exists(undefBc)) {
      return;
    }
    const bc = undefBc as BroadcastChannel;
    bc.addEventListener('message', eventListener);
  },
  removeAuthChannelMessageEventListener: (eventListener: MessageEventListener): void => {
    if (NeonEnvironment.authDisableBroadcastChannel) {
      return;
    }
    const undefBc: Undef<BroadcastChannel> = getAuthBroadcastChannel();
    if (!exists(undefBc)) {
      return;
    }
    const bc = undefBc as BroadcastChannel;
    bc.removeEventListener('message', eventListener);
  },
  sendLoginMessage: (): void => {
    if (NeonEnvironment.authDisableBroadcastChannel) {
      return;
    }
    const undefBc: Undef<BroadcastChannel> = getAuthBroadcastChannel();
    if (!exists(undefBc)) {
      return;
    }
    const bc = undefBc as BroadcastChannel;
    const message: LoginMessage = {
      event: 'login',
    };
    bc.postMessage(message);
  },
};

Object.freeze(BroadcastChannelService);

export default BroadcastChannelService;
