import {
  ActionAuthToken,
  ActionAuthTokenProps,
} from '../../core/models/ActionAuthToken';
import { ActionAuthTokenRepo } from '../../core/repositories/ActionAuthTokenRepo';
import { Base64 } from 'js-base64';
import { KvStorage } from '@survv/pwa/core/kv-storage';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { storageKeys } from '../../core/models/Storage';

const defaultStorage: KvStorage = kvStorage;
const defaultStorageKey = storageKeys.actionAuthToken;

class ActionAuthTokenRepoImpl implements ActionAuthTokenRepo {
  private _storage: KvStorage = defaultStorage;
  private _storageKey = defaultStorageKey;

  getToken = async (): Promise<string | undefined> => {
    const token = (await this._storage.getItem(this._storageKey)) as string;

    if (!token) {
      return undefined;
    }

    return token;
  };

  getParsedToken = async (): Promise<ActionAuthToken> => {
    const token = await this.getToken();
    if (!token) {
      return new ActionAuthToken();
    }

    const [, payload] = token.split('.');
    const props = JSON.parse(Base64.decode(payload)) as ActionAuthTokenProps;

    return new ActionAuthToken(props);
  };

  saveToken = async (token: string): Promise<void> => {
    await this._storage.setItem(this._storageKey, token);
  };

  clearToken = async (): Promise<void> => {
    await this._storage.removeItem(this._storageKey);
  };
}

export const actionAuthTokenRepo = new ActionAuthTokenRepoImpl();
