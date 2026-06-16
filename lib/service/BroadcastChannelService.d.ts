export type MessageEventListener = (event: MessageEvent<any>) => void;
export interface LoginMessage {
    event: string;
}
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
declare const BroadcastChannelService: IBroadcastChannelService;
export default BroadcastChannelService;
