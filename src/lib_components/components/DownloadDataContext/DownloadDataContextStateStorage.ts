import StorageService from '../../service/StorageService';

const key = 'downloadDataContextState';

const StateStorage = {
  saveState: (state: object) => StorageService.setObject(key, state),
  readState: (): object | null => StorageService.getObject(key),
};

Object.freeze(StateStorage);
export default StateStorage;
