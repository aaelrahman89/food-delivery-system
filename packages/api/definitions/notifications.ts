// /notifications/web-push
export type WebPushPayload = NewOrderNotificationWeb;

interface NewOrderNotificationWeb {
  code: 'NEW_ORDER';
  data: {
    orderId: number;
  };
}
