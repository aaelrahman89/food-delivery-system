import { KvStorage } from '@survv/pwa/core/kv-storage';
import { UserPreferenceRepo } from '../../core/repositories/UserPreferenceRepo';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { storageKeys } from '../../core/models/Storage';

class UserPreferenceRepoImpl implements UserPreferenceRepo {
  private _storage: KvStorage = kvStorage;
  getLanguage = async (): Promise<'en' | 'ar'> => {
    const language = (await this._storage.getItem(storageKeys.language)) as
      | 'en'
      | 'ar';
    if (!language) {
      return 'en';
    }

    return language;
  };

  switchLanguage = async (): Promise<void> => {
    const language = await this.getLanguage();
    if (language == 'en') {
      await this._storage.setItem(storageKeys.language, 'ar');
    } else {
      await this._storage.setItem(storageKeys.language, 'en');
    }
  };

  /** @deprecated use switchLanguage instead */
  setLanguage = async (value: string): Promise<void> => {
    await this._storage.setItem(storageKeys.language, value);
  };

  async saveAppCustomizations(customizations: {
    [key: string]: string;
    logoLtr: string;
    logoRtl: string;
    favicon: string;
  }): Promise<void> {
    const promises: Promise<void>[] = [];
    Object.keys(customizations).forEach((key) => {
      promises.push(
        this._storage.setItem(storageKeys[key], customizations[key])
      );
    });
    await Promise.all(promises);
  }

  async getAppCustomizations(): Promise<{
    logoLtr: string;
    logoRtl: string;
    favicon: string;
    BRAND_NAME: string;
  }> {
    const logoLtr = (await this._storage.getItem(
      storageKeys.logoLtr
    )) as string;
    const logoRtl = (await this._storage.getItem(
      storageKeys.logoRtl
    )) as string;
    const favicon = (await this._storage.getItem(
      storageKeys.favicon
    )) as string;
    const BRAND_NAME = (await this._storage.getItem(
      storageKeys.BRAND_NAME
    )) as string;
    return {
      logoLtr,
      logoRtl,
      favicon,
      BRAND_NAME,
    };
  }
}

export const userPreferenceRepo = new UserPreferenceRepoImpl();
