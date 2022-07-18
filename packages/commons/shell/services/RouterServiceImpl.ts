import VueRouter from 'vue-router';
import {
  RouteLocation,
  RouterService,
} from '../../core/services/RouterService';

export class RouterServiceImpl implements RouterService {
  private static _instance: RouterServiceImpl;
  private _routerInstance: VueRouter | undefined;
  private _configured: boolean;

  private constructor() {
    this._configured = false;
  }

  configure(vueRouter: VueRouter): void {
    this._routerInstance = vueRouter;
    this._configured = true;
  }

  static getInstance(): RouterServiceImpl {
    if (!RouterServiceImpl._instance) {
      RouterServiceImpl._instance = new RouterServiceImpl();
    }
    return RouterServiceImpl._instance;
  }

  async redirect(location: RouteLocation): Promise<void> {
    if (!this._configured) {
      throw new Error('RouterServiceImpl has not been configured');
    }

    await this._routerInstance?.push(location);
  }

  async replace(location: RouteLocation): Promise<void> {
    if (!this._configured) {
      throw new Error('RouterServiceImpl has not been configured');
    }

    await this._routerInstance?.replace(location);
  }
}
