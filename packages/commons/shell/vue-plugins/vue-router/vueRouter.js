import Router from 'vue-router';
import Vue from 'vue';

import { RouterServiceImpl } from '../../services/RouterServiceImpl';
import { createAuthGuard } from './authGuard';

function create({ routes, base = '/' }) {
  const authGuard = createAuthGuard();

  Vue.use(Router);
  Vue.use({
    install(instance) {
      const vueInstance = instance;
      vueInstance.prototype.$parseJSONQuery = function parseQueryString(json) {
        try {
          return JSON.parse(json);
        } catch (err) {
          return undefined;
        }
      };
    },
  });

  const routerInstance = new Router({
    routes,
    base,
    mode: 'history',
  });

  RouterServiceImpl.getInstance().configure(routerInstance);

  routerInstance.beforeEach(async function navGuards(to, from, next) {
    await authGuard(to, from, next);
  });

  return routerInstance;
}

export const vueRouter = { create };
