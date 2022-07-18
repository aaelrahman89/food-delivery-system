import { Notification } from '../../core/notification/notification';

export class NotificationServiceSingleton {
  notification: Notification | undefined;

  constructor() {
    this.notification = undefined;
  }

  notify(notification: Notification): void {
    this.notification = notification;
  }

  reset(): void {
    this.notification = undefined;
  }
}

export type NotificationService = NotificationServiceSingleton;
export const notificationService = new NotificationServiceSingleton();
