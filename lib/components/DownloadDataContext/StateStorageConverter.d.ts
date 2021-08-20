/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
declare const convertStateForStorage: (state: any) => any;
declare const convertAOPInitialState: (state: any, propsState: any) => any;
export { convertStateForStorage, convertAOPInitialState };
