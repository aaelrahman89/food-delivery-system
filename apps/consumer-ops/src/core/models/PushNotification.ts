import { Datetime } from '@survv/commons/core/utils/datetime';

export class PushNotification implements PushNotificationOptions {
  id = 0;
  header = '';
  message = '';
  createdBy = '';
  creationDate = new Datetime(0);
  audience = [];

  constructor(options?: PushNotificationOptions) {
    Object.assign(this, options);
  }
}

export interface PushNotificationOptions {
  id: number;
  header: string;
  message: string;
  createdBy: string;
  creationDate: Datetime;
  audience?: string[];
}
