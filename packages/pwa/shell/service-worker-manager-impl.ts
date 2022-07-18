import {
  ClientToSwMessage,
  ServiceWorkerManager,
} from '../core/service-worker-manager';
import { Platform } from '../core/platform';
import { Workbox, messageSW } from 'workbox-window';
import { WorkboxLifecycleEvent } from 'workbox-window/utils/WorkboxEvent';
import { platform } from './platform-impl';

class ServiceWorkerManagerImpl implements ServiceWorkerManager {
  private _platform: Platform;
  private _wb: Workbox | undefined;
  private _registration: ServiceWorkerRegistration | undefined;
  hasUpdate = false;

  constructor(options: ServiceWorkerManagerOptions) {
    this._platform = options.platform;
  }

  get isSupported(): boolean {
    return (
      this._platform.supportsServiceWorkers() && !this._platform.isSafari()
    );
  }

  init = async (
    scriptUrl: string,
    options?: RegistrationOptions
  ): Promise<void> => {
    if (this.isSupported) {
      this._wb = new Workbox(scriptUrl, options);
      this._wb.addEventListener('activated', this._handleSwUpdate);
      this._wb.addEventListener(
        'externalactivated',
        this._handleExternalActivation
      );
      this._wb.addEventListener('controlling', this._handleSwUpdate);
      this._wb.addEventListener('waiting', this._setUpdateAvailable);
      this._wb.addEventListener('externalwaiting', this._setUpdateAvailable);

      this._registration = await this._wb.register();
    }
  };

  applyUpdate = async (): Promise<void> => {
    if (this._registration && this._registration.waiting) {
      const message: ClientToSwMessage = {
        type: 'SKIP_WAITING',
      };
      await messageSW(this._registration.waiting, message);
    }

    this._setUpdateUnavailable();
  };

  dismissUpdate = async (): Promise<void> => {
    this._setUpdateUnavailable();
  };

  private _handleExternalActivation = (): void => {
    window.location.reload();
  };

  private _handleSwUpdate = async (
    event: WorkboxLifecycleEvent
  ): Promise<void> => {
    if (event.isUpdate) {
      window.location.reload();
    } else {
      const message: ClientToSwMessage = {
        type: 'CLIENT_CLAIM',
      };
      if (this._wb) {
        await this._wb.messageSW(message);
      }
    }
  };

  private _setUpdateAvailable = (): void => {
    this.hasUpdate = true;
  };

  private _setUpdateUnavailable = (): void => {
    this.hasUpdate = false;
  };
}

interface ServiceWorkerManagerOptions {
  platform: Platform;
}

export const serviceWorkerManager = new ServiceWorkerManagerImpl({ platform });
