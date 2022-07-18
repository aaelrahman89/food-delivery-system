import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Observable } from 'rxjs';
import { PushNotification } from '../../../../../src/core/models/PushNotification';
import {
  PushNotificationsListAction,
  PushNotificationsListMessage,
} from '../../../../../src/core/blocs/push-notifications/PushNotificationsListMessage';
import { PushNotificationsListBloc } from '../../../../../src/core/blocs/push-notifications/PushNotificationsListBloc';
import {
  PushNotificationsListRequest,
  PushNotificationsListResponse,
} from '@survv/api/definitions/push-notifications';
import { PushNotificationsRepoImpl } from '../../../../../src/shell/repositories/push-notifications/PushNotificationsRepoImpl';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { expect } from 'chai';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('PushNotificationsListBloc Unit Tests', function () {
  let bloc: PushNotificationsListBloc;
  let listNotificationsStubResponse: ItemsList<PushNotification>;

  const routerService = new RouterServiceMockImpl();

  function stubListOrders(): void {
    listNotificationsStubResponse = {
      totalItemsCount: 3,
      items: [
        new PushNotification({
          id: 12345,
          header: 'pasta notification',
          message: 'Try our new Pasta',
          createdBy: 'admin',
          creationDate: new Datetime('2021-01-01'),
          audience: ['+20113556871 ', '+20124632668'],
        }),
      ],
    };
    $sb
      .stub(PushNotificationsRepoImpl.prototype, 'listPushNotifications')
      .resolves(listNotificationsStubResponse);
  }

  beforeEach(() => {
    bloc = new PushNotificationsListBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService,
    });
  });

  it('Should initialize with given (sort/skip/limit) successfully', function (done) {
    stubListOrders();

    const defaultMessage = new PushNotificationsListMessage();

    const initializeLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 0,
            limit: 25,
            sort: { creationDate: 'desc' },
          },
        });
        msg.state.tableData.skip = 0;
        msg.state.tableData.limit = 25;
        msg.state.sort = { creationDate: 'desc' };

        return msg;
      })();

    const initializeTableLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();

    const initializeTableDoneMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 3;
        msg.state.tableData.list = [
          {
            id: 12345,
            header: 'pasta notification',
            message: 'Try our new Pasta',
            createdBy: 'admin',
            creationDate: new Datetime('2021-01-01').toDatetimeString(),
          },
        ];
        return msg;
      })();

    const messages: PushNotificationsListMessage[] = [];
    (bloc.outbox() as Observable<PushNotificationsListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: PushNotificationsListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            initializeLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            initializeTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            initializeTableDoneMessage,
            'forth message'
          );
          done();
        },
      });

    bloc.inbox().next(
      new PushNotificationsListAction({
        type: 'INITIALIZE',
        payload: {
          skip: 0,
          limit: 25,
          sort: { creationDate: 'desc' },
        },
      })
    );
  });

  it('should load push notifications on sort successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new PushNotificationsListMessage();
    const loadPushNotificationsMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'LOAD_PUSH_NOTIFICATIONS',
          payload: {
            sort: {
              creationDate: 'asc',
            },
          },
        });
        msg.state.sort = {
          creationDate: 'asc',
        };
        return msg;
      })();
    const loadPushNotificationsTableLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadPushNotificationsTableDoneMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 3;
        msg.state.tableData.list = [
          {
            id: 12345,
            header: 'pasta notification',
            message: 'Try our new Pasta',
            createdBy: 'admin',
            creationDate: new Datetime('2021-01-01').toDatetimeString(),
          },
        ];
        return msg;
      })();

    const messages: PushNotificationsListMessage[] = [];
    (bloc.outbox() as Observable<PushNotificationsListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: PushNotificationsListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            loadPushNotificationsMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            loadPushNotificationsTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadPushNotificationsTableDoneMessage,
            'forth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 10,
                sort: { creationDate: 'asc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new PushNotificationsListAction({
        type: 'LOAD_PUSH_NOTIFICATIONS',
        payload: {
          sort: { creationDate: 'asc' },
        },
      })
    );
  });

  it('should load push notifications on pagination successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new PushNotificationsListMessage();
    const loadPushNotificationsMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'LOAD_PUSH_NOTIFICATIONS',
          payload: {
            skip: 1,
            limit: 15,
          },
        });
        msg.state.tableData.skip = 1;
        msg.state.tableData.limit = 15;
        return msg;
      })();
    const loadPushNotificationsTableLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadPushNotificationsTableDoneMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 3;
        msg.state.tableData.list = [
          {
            id: 12345,
            header: 'pasta notification',
            message: 'Try our new Pasta',
            createdBy: 'admin',
            creationDate: new Datetime('2021-01-01').toDatetimeString(),
          },
        ];
        return msg;
      })();

    const messages: PushNotificationsListMessage[] = [];
    (bloc.outbox() as Observable<PushNotificationsListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: PushNotificationsListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            loadPushNotificationsMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            loadPushNotificationsTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadPushNotificationsTableDoneMessage,
            'forth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
            query: {
              q: JSON.stringify({
                skip: 1,
                limit: 15,
                sort: { creationDate: 'desc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new PushNotificationsListAction({
        type: 'LOAD_PUSH_NOTIFICATIONS',
        payload: {
          skip: 1,
          limit: 15,
        },
      })
    );
  });

  it('should display errors successfully.', function (done) {
    $sb
      .stub(PushNotificationsRepoImpl.prototype, 'listPushNotifications')
      .rejects(new Error('anything'));

    const defaultMessage = new PushNotificationsListMessage();
    const loadPushNotificationsMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'LOAD_PUSH_NOTIFICATIONS',
          payload: {},
        });
        return msg;
      })();
    const loadPushNotificationsTableLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadPushNotificationsErrorMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsTableLoadingMessage.clone();
        msg.status = 'PROBLEMATIC';
        msg.tableStatus = 'PROBLEMATIC';
        return msg;
      })();

    const messages: PushNotificationsListMessage[] = [];
    (bloc.outbox() as Observable<PushNotificationsListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: PushNotificationsListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            loadPushNotificationsMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            loadPushNotificationsTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadPushNotificationsErrorMessage,
            'forth message'
          );

          const errModel = errorModel({
            code: 'any',
            message: 'example error',
          });
          expect(notificationService.notification).deep.equal(
            createNotification(errModel)
          );
          done();
        },
      });

    bloc.inbox().next(
      new PushNotificationsListAction({
        type: 'LOAD_PUSH_NOTIFICATIONS',
        payload: {},
      })
    );
  });

  it('should navigate to create push notification successfully.', function (done) {
    const defaultMessage = new PushNotificationsListMessage();
    const pushNotificationCreationMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'NAVIGATE_TO_PUSH_NOTIFICATION_CREATION',
          payload: {},
        });
        msg.status = 'LOADING';
        return msg;
      })();
    const pushNotificationsCreationIdleMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = pushNotificationCreationMessage.clone();
        msg.status = 'IDLE';
        return msg;
      })();

    const messages: PushNotificationsListMessage[] = [];
    (bloc.outbox() as Observable<PushNotificationsListMessage>)
      .pipe(take(3))
      .subscribe({
        next: (message: PushNotificationsListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            pushNotificationCreationMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            pushNotificationsCreationIdleMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.PUSH_NOTIFICATIONS_CREATION,
          });
          done();
        },
      });

    bloc.inbox().next(
      new PushNotificationsListAction({
        type: 'NAVIGATE_TO_PUSH_NOTIFICATION_CREATION',
        payload: {},
      })
    );
  });
});

describe('PushNotificationsListBloc Integration', function () {
  let bloc: PushNotificationsListBloc;
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new PushNotificationsListBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService,
    });
  });

  it('Should initialize with given (sort/skip/limit) successfully', function (done) {
    const defaultMessage = new PushNotificationsListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.tableData.skip = 100;
        msg.state.tableData.limit = 50;
        msg.state.sort = { creationDate: 'asc' };
        return msg;
      })();
    const initializeTableLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 0;
        msg.state.tableData.list = [
          {
            id: 12345,
            header: 'pasta notification',
            message: 'Try our new Pasta',
            createdBy: 'admin',
            creationDate: new Datetime('2021-01-01').toDatetimeString(),
          },
        ];
        return msg;
      })();

    const pushNotificationsListingMockPromise = wiremock
      .stub<PushNotificationsListRequest, PushNotificationsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/customers/notifications',
        query: {
          query: {
            vgql: 'v1',
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Asc',
                },
              ],
            },
            skip: 100,
            limit: 50,
          },
        },
      })
      .response({
        status: 200,
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          notifications: [
            {
              id: 12345,
              title: 'pasta notification',
              body: 'Try our new Pasta',
              createdBy: {
                id: 12345,
                email: 'admin',
              },
              creationDate: new Datetime('2021-01-01').toISOString(),
            },
          ],
        },
      });

    pushNotificationsListingMockPromise
      .then(() => {
        const messages: PushNotificationsListMessage[] = [];
        (bloc.outbox() as Observable<PushNotificationsListMessage>)
          .pipe(take(4))
          .subscribe({
            next: (message: PushNotificationsListMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                initializeLoadingMessage,
                'second message'
              );
              expect(messages[2]).deep.equal(
                initializeTableLoadingMessage,
                'third message'
              );

              expect(messages[3]).deep.equal(
                initializeTableDoneMessage,
                'Fourth message'
              );

              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
                query: {
                  q: JSON.stringify({
                    skip: 100,
                    limit: 50,
                    sort: { creationDate: 'asc' },
                  }),
                },
              });
              done();
            },
          });

        bloc.inbox().next(
          new PushNotificationsListAction({
            type: 'INITIALIZE',
            payload: {
              sort: {
                creationDate: 'asc',
              },
              skip: 100,
              limit: 50,
            },
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });

  it('Should load push notifications with given (sort/skip/limit) successfully', function (done) {
    const defaultMessage = new PushNotificationsListMessage();
    const loadPushNotificationsMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = defaultMessage.clone();
        msg.action = new PushNotificationsListAction({
          type: 'LOAD_PUSH_NOTIFICATIONS',
          payload: {
            skip: 100,
            limit: 50,
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.tableData.skip = 100;
        msg.state.tableData.limit = 50;
        msg.state.sort = { creationDate: 'asc' };
        return msg;
      })();
    const loadPushNotificationsLoadingMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadPushNotificationsTableDoneMessage =
      (function constructMessage(): PushNotificationsListMessage {
        const msg = loadPushNotificationsLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 0;
        msg.state.tableData.list = [
          {
            id: 12345,
            header: 'pasta notification',
            message: 'Try our new Pasta',
            createdBy: 'admin',
            creationDate: new Datetime('2021-01-01').toDatetimeString(),
          },
        ];
        return msg;
      })();

    const pushNotificationsListingPromise = wiremock
      .stub<PushNotificationsListRequest, PushNotificationsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/customers/notifications',
        query: {
          query: {
            vgql: 'v1',
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Asc',
                },
              ],
            },
            skip: 100,
            limit: 50,
          },
        },
      })
      .response({
        status: 200,
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          notifications: [
            {
              id: 12345,
              title: 'pasta notification',
              body: 'Try our new Pasta',
              createdBy: {
                id: 12345,
                email: 'admin',
              },
              creationDate: new Datetime('2021-01-01').toISOString(),
            },
          ],
        },
      });

    pushNotificationsListingPromise
      .then(() => {
        const messages: PushNotificationsListMessage[] = [];
        (bloc.outbox() as Observable<PushNotificationsListMessage>)
          .pipe(take(4))
          .subscribe({
            next: (message: PushNotificationsListMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                loadPushNotificationsMessage,
                'second message'
              );
              expect(messages[2]).deep.equal(
                loadPushNotificationsLoadingMessage,
                'third message'
              );
              expect(messages[3]).deep.equal(
                loadPushNotificationsTableDoneMessage,
                'forth message'
              );

              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
                query: {
                  q: JSON.stringify({
                    skip: 100,
                    limit: 50,
                    sort: { creationDate: 'asc' },
                  }),
                },
              });
              done();
            },
          });

        bloc.inbox().next(
          new PushNotificationsListAction({
            type: 'LOAD_PUSH_NOTIFICATIONS',
            payload: {
              sort: {
                creationDate: 'asc',
              },
              skip: 100,
              limit: 50,
            },
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
