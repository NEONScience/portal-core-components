/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
declare const convertStateForStorage: (state: any) => any;
/**
 * Restore the state from JSON serialization. Array objects must be
 * converted back to the expected Set objects.
 * @param storedState The state read from storage.
 */
declare const convertStateFromStorage: (state: any, initialState: any) => any;
export { convertStateForStorage, convertStateFromStorage };
