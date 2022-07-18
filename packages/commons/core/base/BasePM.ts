import { FormValidator } from '../validations/form-validators/index';
import { Notification } from '../notification/notification';
import { errorCodes, errorModel } from '../errors/errors';

export interface Validators {
  [validator: string]: FormValidator;
}

type IntervalId = number;

export class BasePM {
  loading: boolean;
  initializing: boolean;
  initialized: boolean;
  _intervals: IntervalId[];
  notification?: Notification;

  constructor() {
    this.loading = false;
    this.initializing = false;
    this.initialized = false;
    this._intervals = [];
    this.notification = undefined;
  }

  async init(): Promise<void> {
    try {
      this.loading = true;
      this.initializing = true;
      return await this._hydrate();
    } finally {
      this.loading = false;
      this.initializing = false;
      this.initialized = true;
    }
  }

  async _longProcess<T>(fn: () => T): Promise<T> {
    try {
      this.loading = true;
      return await fn();
    } finally {
      this.loading = false;
    }
  }

  async refresh(): Promise<void> {
    throw errorModel({
      message: 'refresh is not implemented',
      code: errorCodes.APPLICATION_ERROR,
    });
  }

  protected async _hydrate(): Promise<void> {
    throw errorModel({
      message: 'hydration is not implemented',
      code: errorCodes.APPLICATION_ERROR,
    });
  }

  /** @Deprecated */
  _notify(notification: Notification): void {
    this.notification = notification;
  }

  _repeatEvery(fn: () => void, timeout: number): void {
    this._intervals.push(window.setInterval(fn, Number(timeout)));
  }

  async onViewDestroyed(): Promise<void> {
    this._intervals.forEach((item) => {
      window.clearInterval(item);
    });
  }

  validators(): Validators {
    throw errorModel({
      message: 'validators is not implemented',
      code: errorCodes.APPLICATION_ERROR,
    });
  }

  isValid(): boolean {
    return Object.entries(this.validators()).every(([, fn]) => fn() === true);
  }
}
