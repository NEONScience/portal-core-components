import StorageService from './StorageService';
/**
 * Function to create application state storage.
 * @param key The key to identify the entry in storage.
 * @returns A StateStorage object with functions to store and retrieve application state.
 */ const makeStateStorage = (key)=>({
        saveState: (state)=>StorageService.setObject(key, state),
        readState: ()=>StorageService.getObject(key),
        removeState: ()=>StorageService.remove(key)
    });
export default makeStateStorage;
