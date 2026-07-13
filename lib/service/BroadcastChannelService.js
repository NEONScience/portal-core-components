import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { exists } from '../util/typeUtil';
let AUTH_BROADCAST_CHANNEL;
const getAuthBroadcastChannel = ()=>{
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
const BroadcastChannelService = {
    addAuthChannelMessageEventListener: (eventListener)=>{
        if (NeonEnvironment.authDisableBroadcastChannel) {
            return;
        }
        const undefBc = getAuthBroadcastChannel();
        if (!exists(undefBc)) {
            return;
        }
        const bc = undefBc;
        bc.addEventListener('message', eventListener);
    },
    removeAuthChannelMessageEventListener: (eventListener)=>{
        if (NeonEnvironment.authDisableBroadcastChannel) {
            return;
        }
        const undefBc = getAuthBroadcastChannel();
        if (!exists(undefBc)) {
            return;
        }
        const bc = undefBc;
        bc.removeEventListener('message', eventListener);
    },
    sendLoginMessage: ()=>{
        if (NeonEnvironment.authDisableBroadcastChannel) {
            return;
        }
        const undefBc = getAuthBroadcastChannel();
        if (!exists(undefBc)) {
            return;
        }
        const bc = undefBc;
        const message = {
            event: 'login'
        };
        bc.postMessage(message);
    },
    sendAccountDataChangedMessage: ()=>{
        if (NeonEnvironment.authDisableBroadcastChannel) {
            return;
        }
        const undefBc = getAuthBroadcastChannel();
        if (!exists(undefBc)) {
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
export default BroadcastChannelService;
