import VueI18n from 'vue-i18n';
import { LocalizationService } from '../../core/services/LocalizationService';
import { MultilingualString } from '../../core/models/MultilingualString';
import { Primitive, Translatable } from '../../core/types';
import { isObject } from '../../core/utils/checks';
import { userPreferenceRepo } from '../repositories/UserPreferenceRepoImpl';

export class LocalizationServiceImpl implements LocalizationService {
  private static _instance: LocalizationServiceImpl | undefined;
  private _currentLocale: 'en' | 'ar' | undefined;
  private _vuei18nInstance: VueI18n | undefined;
  private _configured: boolean;

  private constructor() {
    this._configured = false;
  }

  async configure(vuei18n: VueI18n): Promise<void> {
    this._currentLocale = await userPreferenceRepo.getLanguage();
    this._vuei18nInstance = vuei18n;
    this._configured = true;
  }

  static getInstance(): LocalizationServiceImpl {
    if (!LocalizationServiceImpl._instance) {
      LocalizationServiceImpl._instance = new LocalizationServiceImpl();
    }
    return LocalizationServiceImpl._instance;
  }

  localize(
    value: Translatable,
    templateParams?: Record<string, Primitive>
  ): string {
    if (!this._configured) {
      throw new Error('LocalizationServiceImpl has not been configured');
    }

    if (MultilingualString.isMultilingualString(value)) {
      if (this._currentLocale === 'en') {
        return value.en || value.ar;
      }
      return value.ar || value.en;
    }

    if (isObject(value)) {
      return this._vuei18nInstance!.t(
        value.toString(),
        templateParams
      ) as string;
    }
    return this._vuei18nInstance!.t(value, templateParams) as string;
  }
}
