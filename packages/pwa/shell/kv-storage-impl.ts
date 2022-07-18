import { KvStorage } from '../core/kv-storage';
import { Platform } from '../core/platform';
import { indexedDbAdapter } from './kv-storage-adapters/indexed-db-adapter';
import { localStorageAdapter } from './kv-storage-adapters/local-storage-adapter';
import { platform } from './platform-impl';

const defaultNamespace = '';

class KvStorageImpl implements KvStorage {
  private _namespace = defaultNamespace;
  private _platform: Platform;
  private _dbAdapter: KvStorage;

  constructor(options: KvStorageImplOptions) {
    this._platform = options.platform;
    if (!this._platform.isSafari() && this._platform.supportsIndexedDb()) {
      this._dbAdapter = indexedDbAdapter;
    } else {
      this._dbAdapter = localStorageAdapter;
    }
  }

  async count(): Promise<number> {
    return this._dbAdapter.count();
  }

  async getItem(key: string): Promise<unknown> {
    return this._dbAdapter.getItem(this._getScopedKey(key));
  }

  async setItem(key: string, value: unknown, scopes?: string[]): Promise<void> {
    if (scopes?.length) {
      const promises: Promise<void>[] = [];
      scopes.forEach((scope) => {
        promises.push(this._dbAdapter.setItem(`${scope}:${key}`, value));
      });
      await Promise.all(promises);
    } else {
      await this._dbAdapter.setItem(this._getScopedKey(key), value);
    }
  }

  async removeItem(key: string, scopes?: string[]): Promise<void> {
    if (scopes?.length) {
      const promises: Promise<void>[] = [];
      scopes.forEach((scope) => {
        promises.push(this._dbAdapter.removeItem(`${scope}:${key}`));
      });
      await Promise.all(promises);
    } else {
      await this._dbAdapter.removeItem(this._getScopedKey(key));
    }
  }

  async clear(): Promise<void> {
    return this._dbAdapter.clear();
  }

  configure(config: IdbKvStorageConfiguration): void {
    this._namespace = config.namespace ?? defaultNamespace;
  }

  private _getScopedKey = (key: string): string => {
    if (!this._namespace) {
      return key;
    }
    return `${this._namespace}:${key}`;
  };
}

interface IdbKvStorageConfiguration {
  namespace?: string;
}

interface KvStorageImplOptions {
  platform: Platform;
}

export const kvStorage = new KvStorageImpl({
  platform,
});
