/**
 * Alter the current state for valid JSON serialization.
 * @param currentState The current state
 */
declare const convertStateForStorage: (state: any) => any;
/**
 * Restore the state from JSON serialization.
 * @param storedState The state read from storage.
 */
declare const convertStateFromStorage: (state: any) => any;
export { convertStateForStorage, convertStateFromStorage };
