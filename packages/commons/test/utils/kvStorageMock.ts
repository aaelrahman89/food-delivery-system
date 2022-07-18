import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';

const { count, getItem, setItem, removeItem, clear } = kvStorage;

const memoryStorage = new Map();

export const kvStorageMock = {
  replace(): void {
    kvStorage.count = async (): Promise<number> => {
      return memoryStorage.size;
    };
    kvStorage.getItem = async (key): Promise<unknown> => {
      return memoryStorage.get(key);
    };
    kvStorage.setItem = async (key, value): Promise<void> => {
      memoryStorage.set(key, value);
    };
    kvStorage.removeItem = async (key): Promise<void> => {
      memoryStorage.delete(key);
    };
    kvStorage.clear = async (): Promise<void> => {
      memoryStorage.clear();
    };
  },
  restore(): void {
    kvStorage.count = count;
    kvStorage.getItem = getItem;
    kvStorage.setItem = setItem;
    kvStorage.removeItem = removeItem;
    kvStorage.clear = clear;
  },
};
