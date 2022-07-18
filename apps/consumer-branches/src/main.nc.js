import '@survv/commons/scss/main.scss';
import App from './App.vue';
import Vue from 'vue';
import VueIntercom from 'vue-intercom';
import VueMeta from 'vue-meta';
import { Time } from '@survv/commons/core/models/Time';
import { ar } from './shell/locales/ar';
import { en } from './shell/locales/en';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { routes } from './routes.nc';
import { storageNamespaces } from '@survv/commons/core/models/Storage';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { vueI18n } from '@survv/commons/shell/vue-plugins/vue-i18n/vueI18n';
import { vueRouter } from '@survv/commons/shell/vue-plugins/vue-router/vueRouter';
import { vuetify } from '@survv/commons/shell/vue-plugins/vuetify/vuetify';
import * as datetimeModule from '@survv/commons/core/utils/datetime';
import * as rtlModule from '@survv/commons/core/utils/rtl';

async function main() {
  const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
  const pathName = window.location.pathname;

  if (!pathName.startsWith(baseUrl)) {
    window.location.pathname = baseUrl;
  }
  kvStorage.configure({
    namespace: storageNamespaces.branches,
  });

  const currentLanguage = await userPreferenceRepo.getLanguage();

  datetimeModule.configure({
    locale: currentLanguage,
  });

  Time.configure(currentLanguage);

  Vue.use(VueMeta);
  Vue.use(VueIntercom, {});

  // init vue instance
  return new Vue({
    el: '#app',
    name: 'Root',
    router: vueRouter.create({
      routes,
      base: baseUrl,
    }),
    i18n: vueI18n.create({
      rtl: rtlModule.isRtlLanguage(currentLanguage),
      currentLocale: currentLanguage,
      fallbackLocale: 'en',
      messages: {
        ar,
        en,
      },
      appLocales: [
        {
          code: 'AR_LOCALE',
          value: 'ar',
        },
        {
          code: 'EN_LOCALE',
          value: 'en',
        },
      ],
    }),
    vuetify: vuetify.create({
      rtl: rtlModule.isRtlLanguage(currentLanguage),
      currentLocale: currentLanguage,
    }),
    render: (createEl) => createEl(App),
  });
}

export default main();
