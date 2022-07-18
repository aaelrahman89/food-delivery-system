export interface Platform {
  isSafari(): boolean;
  supportsServiceWorkers(): boolean;
  supportsPushNotifications(): boolean;
  supportsIndexedDb(): boolean;
}
