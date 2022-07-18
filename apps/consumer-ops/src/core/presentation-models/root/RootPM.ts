import { AuthTokenRepo } from '@survv/commons/core/repositories/AuthTokenRepo';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { ConfigurationRepoImpl } from '@survv/commons/shell/repositories/ConfigurationRepoImpl';
import { ConsumerOpsMenuSection } from '../../../menu';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';
import { createNotification } from '../../notification';

export class RootPM extends BasePM {
  private readonly _authTokenRepo: AuthTokenRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;
  private readonly _consumerOpsAppMenu: ConsumerOpsMenuSection[];
  mapBoxAccessToken: string;
  googleMapsAccessToken: string;
  DASHBOARD_BUSINESS_ENABLED: string;
  DASHBOARD_CONSUMER_ENABLED: string;
  logoRtl: string;
  logoLtr: string;
  favicon: string;

  appMenu: ConsumerOpsMenuSection[];

  constructor({
    authTokenRepo,
    userPreferenceRepo,
    notificationService,
    consumerOpsAppMenu,
  }: {
    notificationService: NotificationService;
    userPreferenceRepo: UserPreferenceRepo;
    authTokenRepo: AuthTokenRepo;
    consumerOpsAppMenu: ConsumerOpsMenuSection[];
  }) {
    super();
    this._authTokenRepo = authTokenRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._notificationService = notificationService;
    this._consumerOpsAppMenu = consumerOpsAppMenu;
    this.appMenu = [];
    this.mapBoxAccessToken = '';
    this.googleMapsAccessToken = '';
    this.DASHBOARD_BUSINESS_ENABLED = '';
    this.DASHBOARD_CONSUMER_ENABLED = '';
    this.logoLtr = '';
    this.logoRtl = '';
    this.favicon = '';
  }

  protected async _hydrate(): Promise<void> {
    try {
      this.appMenu = await this._hydrateAppMenu();

      ({
        [configurationItems.MapboxToken]: this.mapBoxAccessToken,
        [configurationItems.GoogleMapsToken]: this.googleMapsAccessToken,
        [configurationItems.DASHBOARD_BUSINESS_ENABLED]:
          this.DASHBOARD_BUSINESS_ENABLED,
        [configurationItems.DASHBOARD_CONSUMER_ENABLED]:
          this.DASHBOARD_CONSUMER_ENABLED,
      } = await new ConfigurationRepoImpl().getConfigItem([
        configurationItems.MapboxToken,
        configurationItems.GoogleMapsToken,
        configurationItems.DASHBOARD_BUSINESS_ENABLED,
        configurationItems.DASHBOARD_CONSUMER_ENABLED,
      ]));

      ({
        logoLtr: this.logoLtr,
        logoRtl: this.logoRtl,
        favicon: this.favicon,
      } = await this._userPreferenceRepo.getAppCustomizations());
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async switchLanguage(): Promise<void> {
    try {
      await this._userPreferenceRepo.switchLanguage();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateAppMenu(): Promise<ConsumerOpsMenuSection[]> {
    const userRoles = await this._authTokenRepo.getUserRoles();

    if (this._isSuperAdmin(userRoles)) {
      return this._consumerOpsAppMenu;
    }

    const menuSections: ConsumerOpsMenuSection[] = [];
    this._consumerOpsAppMenu.forEach((menuSection) => {
      const entries = menuSection.entries.filter((entry) => {
        if (entry.userRoles === 'admin-only') return false;
        if (entry.userRoles === 'all') return true;
        return this._isUserAllowed(userRoles, entry.userRoles);
      });
      if (entries.length > 0) {
        menuSections.push({ header: menuSection.header, entries });
      }
    });
    return menuSections;
  }

  async signOut(): Promise<void> {
    try {
      await this._authTokenRepo.clearToken(['business-ops', 'consumer-ops']);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private _isSuperAdmin(userRoles: UserRole[]): boolean {
    return userRoles.some((userRole) => userRole.equals(UserRole.SUPER_ADMIN));
  }

  private _isUserAllowed(
    userRoles: UserRole[],
    menuEntryAllowedUserRoles: UserRole[]
  ): boolean {
    return userRoles.some((userRole) => {
      return (
        menuEntryAllowedUserRoles.findIndex((menuEntryUserRole) =>
          menuEntryUserRole.equals(userRole)
        ) >= 0
      );
    });
  }

  get shouldShowAppTabs(): boolean {
    return (
      Boolean(Number(this.DASHBOARD_BUSINESS_ENABLED)) &&
      Boolean(Number(this.DASHBOARD_CONSUMER_ENABLED))
    );
  }
}
