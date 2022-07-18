import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { LocalizationServiceImpl } from '../../services/LocalizationServiceImpl';
import { MultilingualString } from '../../../core/models/MultilingualString';
import { isObject } from '../../../core/utils/checks';
import { userPreferenceRepo } from '../../repositories/UserPreferenceRepoImpl';

export function create({
  rtl,
  currentLocale,
  fallbackLocale,
  appLocales,
  messages,
}) {
  Vue.use(VueI18n);

  const vueI18n = new VueI18n({
    fallbackLocale,
    locale: currentLocale,
    silentTranslationWarn: false,
    messages,
  });

  LocalizationServiceImpl.getInstance().configure(vueI18n);

  Vue.use({
    install(instance) {
      const vueInstance = instance;
      vueInstance.prototype.$currentLocale = currentLocale;
      vueInstance.prototype.$rtl = rtl;
      vueInstance.prototype.$availableLocales = appLocales;
      vueInstance.prototype.$changeLocale = async function changeLocale(
        locale
      ) {
        await userPreferenceRepo.setLanguage(locale);
        window.location.reload();
      };
    },
  });

  function handleTranslation(value, ...translationOptions) {
    if (MultilingualString.isMultilingualString(value)) {
      if (currentLocale === 'en') {
        return value.en || value.ar;
      }
      return value.ar || value.en;
    }

    if (isObject(value)) {
      return vueI18n.t(value.toString(), ...translationOptions);
    }

    return vueI18n.t(value, ...translationOptions);
  }

  Vue.use({
    install(instance) {
      instance.prototype.$t = function translate(value, ...translationOptions) {
        return handleTranslation(value, ...translationOptions);
      };
    },
  });

  const [htmlElement] = document.getElementsByTagName('html');
  htmlElement.setAttribute('lang', currentLocale);

  if (rtl) {
    htmlElement.setAttribute('dir', 'rtl');
  } else {
    htmlElement.setAttribute('dir', 'ltr');
  }

  return vueI18n;
}

export const vueI18n = { create };
