import { AuthToken, AuthTokenProps } from '../../core/models/AuthToken';
import { AuthTokenRepo } from '../../core/repositories/AuthTokenRepo';
import { Base64 } from 'js-base64';
import { EntityId } from '../../core/types';
import { KvStorage } from '@survv/pwa/core/kv-storage';
import { UserRole } from '../../core/models/UserRole';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { storageKeys } from '../../core/models/Storage';

const defaultStorage: KvStorage = kvStorage;
const defaultStorageKey = storageKeys.authToken;

class AuthTokenRepoImpl implements AuthTokenRepo {
  private _storage: KvStorage = defaultStorage;
  private _storageKey = defaultStorageKey;

  getToken = async (): Promise<string | undefined> => {
    const token = (await this._storage.getItem(this._storageKey)) as string;

    if (!token) {
      return undefined;
    }

    return token;
  };

  getParsedToken = async (): Promise<AuthToken> => {
    const token = await this.getToken();
    if (!token) {
      return new AuthToken();
    }

    const [, payload] = token.split('.');
    const props = JSON.parse(Base64.decode(payload)) as AuthTokenProps;

    return new AuthToken(props);
  };

  saveToken = async (token: string, scopes?: string[]): Promise<void> => {
    await this._storage.setItem(this._storageKey, token, scopes);
  };

  clearToken = async (scopes?: string[]): Promise<void> => {
    await this._storage.removeItem(this._storageKey, scopes);
  };

  getUserId = async (): Promise<EntityId> => {
    return Number((await this.getParsedToken()).sub);
  };

  getUserRoles = async (): Promise<UserRole[]> => {
    const userRoles = (await this.getParsedToken()).roles;

    return userRoles.map((userRole) => new UserRole(userRole));
  };
}

export const authTokenRepo = new AuthTokenRepoImpl();
