import {
  ClientToSwMessage,
  SwToClientMessage,
} from '@survv/pwa/core/service-worker-manager';
import { WebPushPayload } from '@survv/api/definitions/notifications';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { precacheAndRoute } from 'workbox-precaching';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

declare let self: SW.ServiceWorkerGlobalScope & {
  __WB_MANIFEST: string[];
};
precacheAndRoute(self.__WB_MANIFEST);

kvStorage.configure({
  namespace: 'branches',
});

const messages: Record<string, LocaleMessages> = {
  ar: {
    NEW_ORDER_TITLE: 'طلب جديد',
    NEW_ORDER_BODY: 'لديك طلب جديد فى انتظار المراجعة',
  },
  en: {
    NEW_ORDER_TITLE: 'New Order',
    NEW_ORDER_BODY: 'A new order is waiting for your review',
  },
};

async function getText(stringKey: string): Promise<string> {
  const language = await userPreferenceRepo.getLanguage();
  return messages[language][stringKey];
}

async function handleSwMessage(
  event: SW.ExtendableMessageEvent
): Promise<void> {
  const swAckMessage: SwToClientMessage = {
    type: 'SW_ACKNOWLEDGE',
  };
  event.ports[0].postMessage(swAckMessage);
  const clientMessage: ClientToSwMessage = event.data;

  switch (clientMessage.type) {
    case 'SKIP_WAITING':
      return self.skipWaiting();
    case 'CLIENT_CLAIM':
      return self.clients.claim();
    default:
      return undefined;
  }
}

async function handlePush(event: SW.PushEvent): Promise<void> {
  const payload: WebPushPayload = await event.data!.json();
  let title: string;
  let body: string;
  switch (payload.code) {
    case 'NEW_ORDER':
      title = await getText('NEW_ORDER_TITLE');
      body = await getText('NEW_ORDER_BODY');
      break;
    default:
      title = payload.code;
      body = 'UNKNOWN_CODE';
  }

  const options: NotificationOptions = {
    body,
    tag: payload.code,
    renotify: true,
    silent: false,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: payload,
  };

  return self.registration.showNotification(title, options);
}
async function handleNotificationClick(
  event: SW.NotificationEvent
): Promise<void> {
  const { notification } = event;
  const payload: WebPushPayload = notification.data;
  let windowClient!: SW.WindowClient;

  notification.close();

  switch (payload.code) {
    case 'NEW_ORDER':
      windowClient = (await self.clients.openWindow('./')) as SW.WindowClient;
      break;
    default:
      windowClient = (await self.clients.openWindow('./')) as SW.WindowClient;
      break;
  }

  await windowClient.focus();
}

self.addEventListener('message', function onMessage(event) {
  event.waitUntil(handleSwMessage(event));
});
// self.addEventListener('notificationclose', onNotificationClose);
self.addEventListener('notificationclick', function onNotificationClick(event) {
  event.waitUntil(handleNotificationClick(event));
});
self.addEventListener('push', function onPush(event) {
  event.waitUntil(handlePush(event));
});

type LocaleMessages = Record<string, string>;
