import {
  RouteLocation,
  RouterService,
} from '../../core/services/RouterService';

export class RouterServiceMockImpl implements RouterService {
  private _currentRoute: RouteLocation | undefined;
  async redirect(location: RouteLocation): Promise<void> {
    this._currentRoute = location;
  }

  async replace(location: RouteLocation): Promise<void> {
    this._currentRoute = location;
  }

  get route(): RouteLocation | undefined {
    return this._currentRoute;
  }
}
