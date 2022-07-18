import { Platform } from '../core/platform';
import { globalObject } from './global-scope';

class PlatformImpl implements Platform {
  isSafari(): boolean {
    return navigator.vendor == 'Apple Computer, Inc.';
  }

  supportsServiceWorkers(): boolean {
    return 'serviceWorker' in navigator;
  }

  supportsPushNotifications(): boolean {
    return 'PushManager' in globalObject;
  }

  supportsIndexedDb(): boolean {
    return 'indexedDB' in globalObject;
  }
}

export const platform = new PlatformImpl();
