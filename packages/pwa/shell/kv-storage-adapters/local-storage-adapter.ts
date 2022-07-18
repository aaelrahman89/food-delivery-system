import { KvStorage } from '../../core/kv-storage';
import { globalObject } from '../global-scope';

class LocalStorageAdapter implements KvStorage {
  private _db = globalObject.localStorage;

  async setItem(key: string, value: unknown): Promise<void> {
    const wrappedObject = this._wrapWithObject(value);
    return this._db.setItem(key, JSON.stringify(wrappedObject));
  }

  async removeItem(key: string): Promise<void> {
    this._db.removeItem(key);
  }

  async getItem(key: string): Promise<unknown> {
    const value = this._db.getItem(key);
    if (!value || value === 'null') {
      return undefined;
    }
    const wrappedObject = JSON.parse(value) as WrappedLocalStorageValue;
    return this._extractValue(wrappedObject);
  }

  async count(): Promise<number> {
    return this._db.length;
  }

  async clear(): Promise<void> {
    this._db.clear();
  }

  private _wrapWithObject(input: unknown): WrappedLocalStorageValue {
    return {
      $$value: input,
    };
  }

  private _extractValue(wrappedObject: WrappedLocalStorageValue): unknown {
    return wrappedObject.$$value;
  }
}

interface WrappedLocalStorageValue {
  $$value: unknown;
}

export const localStorageAdapter = new LocalStorageAdapter();
