import '@fortawesome/fontawesome-free/css/all.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ar from 'vuetify/lib/locale/ar';
import en from 'vuetify/lib/locale/en';

// this assumes global css variables are loaded before bootstrapping the application
// the variables are in @survv/commons/scss/_variables.scss
function themeOverride() {
  function propValue(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  return {
    primary: propValue('--color-primary'),
  };
}

function create({ rtl, currentLocale }) {
  Vue.use(Vuetify);
  return new Vuetify({
    rtl,
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      themes: {
        light: themeOverride(),
        dark: themeOverride(),
      },
    },
    lang: {
      locales: { en, ar },
      current: currentLocale,
    },
  });
}

export const vuetify = { create };
