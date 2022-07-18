import { AuthTokenRepo } from '@survv/commons/core/repositories/AuthTokenRepo';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { BranchDetails } from '../../models/Branch';
import { BranchMenuSection } from '../../../menu';
import { BranchServedZones } from '../../models/Zone';
import { BranchesRepo } from '../../repositories/BranchesRepo';
import { ConfigurationRepoImpl } from '@survv/commons/shell/repositories/ConfigurationRepoImpl';
import { IntercomRepo } from '../../intercom/repositories/IntercomRepo';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order } from '../../models/Order';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { PilotRequest } from '../../models/PilotRequest';
import { PilotsRepo } from '../../repositories/PilotsRepo';
import {
  PushNotificationManager,
  PushNotificationRepo,
} from '@survv/pwa/core/push-notification-manager';
import { ServiceWorkerManager } from '@survv/pwa/core/service-worker-manager';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { VendorRepo } from '../../repositories/VendorRepo';
import { ZonesRepo } from '../../repositories/ZonesRepo';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class RootPM extends BasePM {
  private readonly _authTokenRepo: AuthTokenRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _branchRepo: BranchesRepo;
  private readonly _vendorRepo: VendorRepo;
  private readonly _pushNotificationManager: PushNotificationManager;
  private readonly _pushNotificationRepo: PushNotificationRepo;
  private readonly _notificationService: NotificationService;
  private readonly _serviceWorkerManager: ServiceWorkerManager;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _pilotsRepo: PilotsRepo;
  private readonly _zonesRepo: ZonesRepo;
  private readonly _intercomRepo: IntercomRepo;
  private readonly _branchesAppMenu: BranchMenuSection[];
  mapBoxAccessToken: string;
  DASHBOARD_BUSINESS_ENABLED: string;
  DASHBOARD_CONSUMER_ENABLED: string;
  logoRtl: string;
  logoLtr: string;
  favicon: string;

  appMenu: BranchMenuSection[];
  b2cStatusOptions: BranchB2CStatus[];
  balanceAtRisk = false;
  pendingOrders: Order[] = [];
  scheduledOrders: Order[] = [];
  workingOrders: Order[] = [];
  activePilotRequests: PilotRequest[] = [];
  servedZones = new BranchServedZones();
  branchProfile = new BranchDetails();
  intercomAppId = '';
  shouldRedirectToHome = false;

  constructor(args: RootPMArgs) {
    super();
    const {
      authTokenRepo,
      userPreferenceRepo,
      branchRepo,
      vendorRepo,
      pushNotificationManager,
      notificationService,
      pushNotificationRepo,
      serviceWorkerManager,
      ordersRepo,
      pilotsRepo,
      zonesRepo,
      intercomRepo,
      branchAppMenu,
    } = args;
    this._authTokenRepo = authTokenRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._branchRepo = branchRepo;
    this._vendorRepo = vendorRepo;
    this._pushNotificationManager = pushNotificationManager;
    this._notificationService = notificationService;
    this._pushNotificationRepo = pushNotificationRepo;
    this._serviceWorkerManager = serviceWorkerManager;
    this._ordersRepo = ordersRepo;
    this._pilotsRepo = pilotsRepo;
    this._zonesRepo = zonesRepo;
    this._intercomRepo = intercomRepo;
    this._branchesAppMenu = branchAppMenu;
    this.appMenu = [];
    this.b2cStatusOptions = BranchB2CStatus.lookup().filter(
      (status) => !BranchB2CStatus.OUT_OF_WORKING_HOURS.equals(status)
    ) as BranchB2CStatus[];
    this.mapBoxAccessToken = '';
    this.DASHBOARD_BUSINESS_ENABLED = '';
    this.DASHBOARD_CONSUMER_ENABLED = '';
    this.logoLtr = '';
    this.logoRtl = '';
    this.favicon = '';
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateBranchDetails();
      await this._hydrateIntercomConfiguration();
      this.appMenu = await this._hydrateAppMenu();
      ({
        logoLtr: this.logoLtr,
        logoRtl: this.logoRtl,
        favicon: this.favicon,
      } = await this._userPreferenceRepo.getAppCustomizations());
      await Promise.all([
        this._hydrateBalanceAtRisk(),
        this.hydratePendingOrders(),
        this.hydrateWorkingOrders(),
        this.hydrateActivePilotRequests(),
        this.hydrateServedZones(),
        this._initServiceWorkerManager(),
        this._initPushNotificationManager(),
      ]);

      ({
        [configurationItems.MapboxToken]: this.mapBoxAccessToken,
        [configurationItems.DASHBOARD_BUSINESS_ENABLED]:
          this.DASHBOARD_BUSINESS_ENABLED,
        [configurationItems.DASHBOARD_CONSUMER_ENABLED]:
          this.DASHBOARD_CONSUMER_ENABLED,
      } = await new ConfigurationRepoImpl().getConfigItem([
        configurationItems.MapboxToken,
        configurationItems.DASHBOARD_BUSINESS_ENABLED,
        configurationItems.DASHBOARD_CONSUMER_ENABLED,
      ]));

      this._repeatEvery(async () => {
        await this._hydrateBalanceAtRisk();
      }, 15 * 60 * 1000);

      this._repeatEvery(async () => {
        await this.hydrateActivePilotRequests();
      }, 10 * 1000);

      this._repeatEvery(async () => {
        const token = await this._authTokenRepo.getParsedToken();
        if (token?.isExpired()) {
          this.shouldRedirectToHome = true;
        }
      }, 30 * 1000);

      this._repeatEvery(async () => {
        await Promise.all([
          this.hydratePendingOrders(),
          this.hydrateScheduledOrders(),
          this.hydrateWorkingOrders(),
        ]);
      }, 4 * 1000);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async hydrateScheduledOrders(): Promise<void> {
    this.scheduledOrders = (await this._ordersRepo.getScheduledOrders()).items;
  }

  async hydratePendingOrders(): Promise<void> {
    this.pendingOrders = (await this._ordersRepo.getPendingOrders()).items;
  }

  async hydrateWorkingOrders(): Promise<void> {
    const { items } = await this._ordersRepo.getWorkingOrders();
    this.workingOrders = items;
  }

  async hydrateActivePilotRequests(): Promise<void> {
    this.activePilotRequests = await this._pilotsRepo.getActivePilotRequests();
  }

  async hydrateServedZones(): Promise<void> {
    this.servedZones = await this._zonesRepo.getServedZones();
  }

  async switchLanguage(): Promise<void> {
    try {
      await this._userPreferenceRepo.switchLanguage();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get shouldShowAppUpdateAlert(): boolean {
    return (
      this._serviceWorkerManager.isSupported &&
      this._serviceWorkerManager.hasUpdate
    );
  }

  async applyAppUpdates(): Promise<void> {
    await this._serviceWorkerManager.applyUpdate();
  }

  get shouldShowPermissionRequestAlert(): boolean {
    return (
      this._pushNotificationManager.isSupported &&
      this._pushNotificationManager.isPermissionUnknown
    );
  }

  private async _hydrateAppMenu(): Promise<BranchMenuSection[]> {
    return this._branchesAppMenu.filter(
      (section) => section.entries.length > 0
    );
  }

  async requestNotificationPermission(): Promise<void> {
    await this._pushNotificationManager.requestPermission();
  }

  async signOut(): Promise<void> {
    try {
      // sign-out must happen before clearing the token, otherwise it will fail
      await this._branchRepo.signOut();
      await this._pushNotificationManager.stopNotifications();
      await this._vendorRepo.clearVendorId();
      await this._authTokenRepo.clearToken();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async onViewDestroyed(): Promise<void> {
    await super.onViewDestroyed();
    return this._pushNotificationManager.destroy();
  }

  async updateB2CStatus(value: BranchB2CStatus): Promise<void> {
    this.branchProfile.b2cStatus = value;
    try {
      await this._branchRepo.setBranchB2CStatus(this.branchProfile.b2cStatus);
      this._notificationService.notify(successfulOperation());
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  private async _initServiceWorkerManager(): Promise<void> {
    if (this._serviceWorkerManager.isSupported) {
      await this._serviceWorkerManager.init('service-worker.js');
    }
  }

  private async _initPushNotificationManager(): Promise<void> {
    if (this._pushNotificationManager.isSupported) {
      await this._pushNotificationManager.init({
        pushNotificationRepo: this._pushNotificationRepo,
      });
    }
  }

  private async _hydrateBalanceAtRisk(): Promise<void> {
    const { balanceAtRisk } = await this._vendorRepo.getVendorDetails();
    this.balanceAtRisk = balanceAtRisk;
  }

  private async _hydrateBranchDetails(): Promise<void> {
    this.branchProfile = await this._branchRepo.getBranchDetails();
  }

  private async _hydrateIntercomConfiguration(): Promise<void> {
    this.intercomAppId = await this._intercomRepo.getAppId();
  }

  get shouldShowBusinessBranchButton(): boolean {
    return (
      Boolean(Number(this.DASHBOARD_BUSINESS_ENABLED)) &&
      Boolean(Number(this.DASHBOARD_CONSUMER_ENABLED))
    );
  }
}

interface RootPMArgs {
  authTokenRepo: AuthTokenRepo;
  userPreferenceRepo: UserPreferenceRepo;
  branchRepo: BranchesRepo;
  vendorRepo: VendorRepo;
  pushNotificationManager: PushNotificationManager;
  notificationService: NotificationService;
  pushNotificationRepo: PushNotificationRepo;
  serviceWorkerManager: ServiceWorkerManager;
  ordersRepo: OrdersRepo;
  pilotsRepo: PilotsRepo;
  zonesRepo: ZonesRepo;
  intercomRepo: IntercomRepo;
  allowNewPilotRequests: boolean;
  branchAppMenu: BranchMenuSection[];
}
