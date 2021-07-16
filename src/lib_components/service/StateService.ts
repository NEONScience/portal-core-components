/**
 * Interface to define a service for persisting state.
 */
export interface IStateService {
  /**
   * Adds the item to persistent storage.
   * @param key The item key.
   * @param value The item value.
   * @returns void.
  */
  setItem: (key: string, value: string) => void;
  /**
   * Gets the item's value from persistent storage.
   * @param key The item key.
   * @returns The item's value as a string or null if it does not exist in storage.
   */
  getItem: (key: string) => string | null;
  /**
   * Adds the object to persistent storage.
   * @param key The object key.
   * @param value The object value.
   * @returns void.
  */
  setObject: (key: string, value: object) => void;
  /**
   * Gets the item's value from persistent storage.
   * @param key The item key.
   * @returns The item's value as a string or null if it does not exist in storage.
  */
  getObject: (key: string) => object | null;
  /**
   * Gets the key at the given index.
   * @param index The index of the item in storage.
   * @returns The item's key.
   */
  key: (index: number) => string | null;
  /**
   * Removes the item with the given key.
   * @param key The item's key.
   * @returns void.
   */
  removeItem: (key: string) => void;
  /**
   * Clears storage of all items.
   */
  clear: () => void;
  /**
   * Returns the number of items in storage.
   */
  length: (key: string) => number;
}

const StateService: IStateService = {
  setItem: (key: string, value: string): void => sessionStorage.setItem(key, value),
  getItem: (key: string): string | null => sessionStorage.getItem(key),
  setObject: (key: string, object: object): void => (
    sessionStorage.setItem(key, JSON.stringify(object))
  ),
  getObject: (key: string): object | null => {
    const value = sessionStorage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  },
  key: (index: number): string | null => sessionStorage.key(index),
  removeItem: (key: string): void => sessionStorage.removeItem(key),
  clear: (): void => sessionStorage.clear(),
  length: (): number => sessionStorage.length,
};

Object.freeze(StateService);

export default StateService;
