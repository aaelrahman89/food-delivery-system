import { AuthTokenRepo } from '@survv/commons/core/repositories/AuthTokenRepo';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { ConsumerVendorMenuSection } from '../../../menu';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { VendorRepo } from '../../repositories/VendorRepo';
import { createNotification } from '../../notification';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';

export class RootPM extends BasePM {
  private readonly _authTokenRepo: AuthTokenRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _vendorRepo: VendorRepo;
  private readonly _notificationService: NotificationService;
  private readonly _consumerVendorAppMenu: ConsumerVendorMenuSection[];

  logoRtl: string;
  logoLtr: string;
  favicon: string;
  userName: string;
  vendorLogo: string;
  vendorLabel: string;

  appMenu: ConsumerVendorMenuSection[];

  constructor({
    authTokenRepo,
    userPreferenceRepo,
    vendorRepo,
    notificationService,
    consumerVendorAppMenu,
  }: {
    notificationService: NotificationService;
    userPreferenceRepo: UserPreferenceRepo;
    authTokenRepo: AuthTokenRepo;
    consumerVendorAppMenu: ConsumerVendorMenuSection[];
    vendorRepo: VendorRepo;
  }) {
    super();
    this._authTokenRepo = authTokenRepo;
    this._vendorRepo = vendorRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._notificationService = notificationService;
    this._consumerVendorAppMenu = consumerVendorAppMenu;
    this.appMenu = [];
    this.logoLtr = '';
    this.logoRtl = '';
    this.favicon = '';
    this.userName = '';
    this.vendorLogo = '';
    this.vendorLabel = '';
  }

  protected async _hydrate(): Promise<void> {
    try {
      this.appMenu = await this._hydrateAppMenu();

      ({
        logoLtr: this.logoLtr,
        logoRtl: this.logoRtl,
        favicon: this.favicon,
      } = await this._userPreferenceRepo.getAppCustomizations());
      this.userName = String(await kvStorage.getItem('user-name'));
      await this.hydrateVendorDetails();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateAppMenu(): Promise<ConsumerVendorMenuSection[]> {
    const userRoles = await this._authTokenRepo.getUserRoles();

    if (this._isSuperAdmin(userRoles)) {
      return this._consumerVendorAppMenu;
    }

    const menuSections: ConsumerVendorMenuSection[] = [];
    this._consumerVendorAppMenu.forEach((menuSection) => {
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

  private async hydrateVendorDetails(): Promise<void> {
    try {
      const { logo, label } = await this._vendorRepo.getVendorDetails();
      this.vendorLogo = logo;
      this.vendorLabel = label;
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

  async signOut(): Promise<void> {
    try {
      await this._authTokenRepo.clearToken(['consumer-vendor']);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private _isSuperAdmin(userRoles: UserRole[]): boolean {
    return userRoles.some((userRole) =>
      userRole.equals(UserRole.CALL_CENTER_SUPER_ADMIN)
    );
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
}
