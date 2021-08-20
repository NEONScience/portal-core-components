import StorageService from './StorageService';

/**
 * Interface for a simple application state storage service.
 */
export interface IStateStorageService {
  saveState: (state: object) => void;
  readState: () => object | null;
  removeState: () => void;
}

/**
 * Function to create application state storage.
 * @param key The key to identify the entry in storage.
 * @returns A StateStorage object with functions to store and retrieve application state.
 */
const makeStateStorage = (key: string): IStateStorageService => ({
  saveState: (state: object) => StorageService.setObject(key, state),
  readState: () => StorageService.getObject(key),
  removeState: () => StorageService.remove(key),
});

export default makeStateStorage;
