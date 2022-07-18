import { KvStorage } from '../../core/kv-storage';

class IndexedDbAdapter implements KvStorage {
  private _dbName = 'kv-storage';
  private _objectStoreName = 'kv-storage';
  private _db: IDBDatabase | undefined;

  count = async (): Promise<number> => {
    const db = await this._openDb();
    return new Promise<number>((resolve, reject) => {
      const transactionScope = this._objectStoreName;
      const transaction = db.transaction(transactionScope, 'readonly');

      const request = transaction.objectStore(this._objectStoreName).count();

      request.onerror = (): void => {
        reject(request.error);
      };
      request.onsuccess = (): void => {
        resolve(request.result);
      };
      transaction.onabort = (): void => {
        reject(transaction.error);
      };
      transaction.onerror = (): void => {
        reject(transaction.error);
      };
    });
  };

  getItem = async (key: string): Promise<unknown> => {
    const db = await this._openDb();
    return new Promise<number>((resolve, reject) => {
      const transactionScope = this._objectStoreName;
      const transaction = db.transaction(transactionScope, 'readonly');

      const request = transaction.objectStore(this._objectStoreName).get(key);

      request.onerror = (): void => {
        reject(request.error);
      };
      request.onsuccess = (): void => {
        resolve(request.result);
      };
      transaction.onabort = (): void => {
        reject(transaction.error);
      };
      transaction.onerror = (): void => {
        reject(transaction.error);
      };
    });
  };

  setItem = async (key: string, value: unknown): Promise<void> => {
    const db = await this._openDb();
    return new Promise<void>((resolve, reject) => {
      const transactionScope = this._objectStoreName;
      const transaction = db.transaction(transactionScope, 'readwrite');

      const request = transaction
        .objectStore(this._objectStoreName)
        .put(value, key);

      request.onerror = (): void => {
        reject(request.error);
      };
      request.onsuccess = (): void => {
        resolve(undefined);
      };
      transaction.onabort = (): void => {
        reject(transaction.error);
      };
      transaction.onerror = (): void => {
        reject(transaction.error);
      };
    });
  };

  removeItem = async (key: string): Promise<void> => {
    const db = await this._openDb();
    return new Promise<void>((resolve, reject) => {
      const transactionScope = this._objectStoreName;
      const transaction = db.transaction(transactionScope, 'readwrite');

      const request = transaction
        .objectStore(this._objectStoreName)
        .delete(key);

      request.onerror = (): void => {
        reject(request.error);
      };
      request.onsuccess = (): void => {
        resolve(request.result);
      };
      transaction.onabort = (): void => {
        reject(transaction.error);
      };
      transaction.onerror = (): void => {
        reject(transaction.error);
      };
    });
  };

  clear = async (): Promise<void> => {
    const db = await this._openDb();
    return new Promise<void>((resolve, reject) => {
      const transactionScope = this._objectStoreName;
      const transaction = db.transaction(transactionScope, 'readwrite');

      const request = transaction.objectStore(this._objectStoreName).clear();

      request.onerror = (): void => {
        reject(request.error);
      };
      request.onsuccess = (): void => {
        resolve(request.result);
      };
      transaction.onabort = (): void => {
        reject(transaction.error);
      };
      transaction.onerror = (): void => {
        reject(transaction.error);
      };
    });
  };

  private _openDb = async (): Promise<IDBDatabase> => {
    if (!this._db) {
      this._db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this._dbName);
        request.onupgradeneeded = (): void => {
          const db = request.result;
          db.createObjectStore(this._objectStoreName);
        };
        request.onerror = (): void => {
          reject(request.error);
        };
        request.onblocked = (): void => {
          const error = new Error('Database is blocked');
          error.name = 'IdbBlockedException';
          reject(error);
        };
        request.onsuccess = (): void => {
          resolve(request.result);
        };
      });
    }

    return this._db;
  };
}

export const indexedDbAdapter = new IndexedDbAdapter();
