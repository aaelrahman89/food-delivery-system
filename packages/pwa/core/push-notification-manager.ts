export interface PushNotificationManager {
  isSupported: boolean;
  isAllowed: boolean;
  isDenied: boolean;
  isPermissionUnknown: boolean;
  init(options: PushNotificationManagerInitOptions): Promise<void>;
  requestPermission(): Promise<void>;
  stopNotifications(): Promise<void>;
  destroy(): Promise<void>;
}

export interface PushNotificationManagerInitOptions {
  pushNotificationRepo: PushNotificationRepo;
}

export interface PushNotificationRepo {
  subscribe(subscription: Subscription): Promise<void>;
  getPublicKey(): Promise<string>;
  refreshSubscription(
    oldSubscription: Subscription,
    newSubscription: Subscription
  ): Promise<void>;
}

export interface Subscription {
  auth: string;
  key: string;
  endpoint: string;
}
