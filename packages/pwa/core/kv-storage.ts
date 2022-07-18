export interface KvStorage {
  /**
   * Returns a promise that resolves with the number of stored records
   */
  count(): Promise<number>;
  /**
   * Returns a promise that resolved with the value of the record identified by the "key" parameter if it exists or undefined if there is no record identified by the given key
   */
  getItem(key: string, scopes?: string[]): Promise<unknown>;
  /**
   * Save a record with a given key an value. Accepts any javascript value.
   */
  setItem(key: string, value: unknown, scopes?: string[]): Promise<void>;
  /**
   * Remove the record identified by the given key. The promise will resolve even if there are no records to delete given the key
   */
  removeItem(key: string, scopes?: string[]): Promise<void>;
  /**
   * Remove all the records.
   */
  clear(): Promise<void>;
}
