import { Platform } from '../core/platform';
import {
  PushNotificationManager,
  PushNotificationManagerInitOptions,
  PushNotificationRepo,
  Subscription,
} from '../core/push-notification-manager';
import { platform } from './platform-impl';

function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function mapSubscriptionToNotificationSubscriptionModel(
  subscription: PushSubscription
): Subscription {
  const subscriptionObj =
    subscription.toJSON() as Required<PushSubscriptionJSON>;
  return {
    auth: subscriptionObj.keys.auth,
    key: subscriptionObj.keys.p256dh,
    endpoint: subscriptionObj.endpoint,
  };
}

class PushNotificationManagerImpl implements PushNotificationManager {
  private _platform: Platform;
  private _pushSubscriptionRepo!: PushNotificationRepo;
  private _nextSubscriptRefreshDate = Date.now() + 60 * 60 * 1000; // hour
  private _subscriptionRefreshIntervalId = 0;
  private _refreshInterval = 5 * 60 * 1000; // 5 minutes
  isAllowed = false;
  isDenied = false;
  isPermissionUnknown = true;

  constructor(options: PushNotificationManagerOptions) {
    this._platform = options.platform;
    this._updatePermission(Notification.permission);
  }

  get isSupported(): boolean {
    return (
      this._platform.supportsPushNotifications() && !this._platform.isSafari()
    );
  }

  async init(options: PushNotificationManagerInitOptions): Promise<void> {
    this._pushSubscriptionRepo = options.pushNotificationRepo;
    if (this.isSupported) {
      const permission = await navigator.permissions.query({
        name: 'notifications',
      });
      permission.addEventListener('change', () => {
        this._updatePermission(permission.state as NotificationPermission);
      });
      if (this.isAllowed) {
        await this._clearExistingSubscription();
        await this._subscribe();
        this._scheduleRefresh();
      }
    }
  }

  async destroy(): Promise<void> {
    clearInterval(this._subscriptionRefreshIntervalId);
  }

  async stopNotifications(): Promise<void> {
    await this._clearExistingSubscription();
  }

  async requestPermission(): Promise<void> {
    const result = await Notification.requestPermission();

    this._updatePermission(result);

    if (this.isAllowed) {
      await this._clearExistingSubscription();
      await this._subscribe();
      this._scheduleRefresh();
    }
  }

  private _scheduleRefresh(): void {
    this._subscriptionRefreshIntervalId = window.setInterval(async () => {
      const now = Date.now();
      if (now >= this._nextSubscriptRefreshDate) {
        const { pushManager } = await navigator.serviceWorker.ready;
        const publicKey = urlB64ToUint8Array(
          await this._pushSubscriptionRepo.getPublicKey()
        );
        const oldSubscription = await pushManager.getSubscription();
        await oldSubscription!.unsubscribe();

        const newSubscription = await pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey,
        });

        await this._pushSubscriptionRepo.refreshSubscription(
          mapSubscriptionToNotificationSubscriptionModel(oldSubscription!),
          mapSubscriptionToNotificationSubscriptionModel(newSubscription)
        );

        this._nextSubscriptRefreshDate = Date.now() + 60 * 60 * 1000; // hour
      }
    }, this._refreshInterval);
  }

  private async _clearExistingSubscription(): Promise<void> {
    if (await navigator.serviceWorker?.ready) {
      const { pushManager } = await navigator.serviceWorker.ready;
      const subscription = await pushManager.getSubscription();
      await subscription?.unsubscribe();
    }
  }

  private async _subscribe(): Promise<void> {
    const { pushManager } = await navigator.serviceWorker.ready;
    const publicKey = urlB64ToUint8Array(
      await this._pushSubscriptionRepo.getPublicKey()
    );

    const subscription = await pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });

    await this._pushSubscriptionRepo.subscribe(
      mapSubscriptionToNotificationSubscriptionModel(subscription)
    );
  }

  private _updatePermission(permission: NotificationPermission): void {
    if (permission === 'granted') {
      this.isAllowed = true;

      this.isDenied = false;
      this.isPermissionUnknown = false;
    }
    if (permission === 'denied') {
      this.isDenied = true;

      this.isAllowed = false;
      this.isPermissionUnknown = false;
    }
    if (permission === 'default') {
      this.isPermissionUnknown = true;

      this.isAllowed = false;
      this.isDenied = false;
    }
  }
}

interface PushNotificationManagerOptions {
  platform: Platform;
}

export const pushNotificationManager = new PushNotificationManagerImpl({
  platform,
});
