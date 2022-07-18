import { $sb } from '@survv/commons/test/utils/sandbox';
import { Notification } from '@survv/commons/core/notification/notification';
import { Observable } from 'rxjs';
import {
  PushNotificationCreationAction,
  PushNotificationCreationMessage,
} from '../../../../../src/core/blocs/push-notifications/PushNotificationCreationMessage';
import { PushNotificationCreationBloc } from '../../../../../src/core/blocs/push-notifications/PushNotificationCreationBloc';
import {
  PushNotificationCreationRequest,
  PushNotificationCreationResponse,
} from '@survv/api/definitions/push-notifications';
import { PushNotificationsRepoImpl } from '../../../../../src/shell/repositories/push-notifications/PushNotificationsRepoImpl';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('PushNotificationCreationBloc Unit', function () {
  it('updates form on UPDATE_FORM and sets the form status VALID if the form was valid', function () {
    const bloc = new PushNotificationCreationBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService: RouterServiceImpl.getInstance(),
    });

    const messages: PushNotificationCreationMessage[] = [];

    (bloc.outbox() as Observable<PushNotificationCreationMessage>)
      .pipe(take(2))
      .subscribe({
        next: (message: PushNotificationCreationMessage) => {
          messages.push(message);
        },
        complete: () => {
          // initial message
          assert.deepEqual(messages[0], new PushNotificationCreationMessage());

          const finalMessage = new PushNotificationCreationMessage();
          finalMessage.action = new PushNotificationCreationAction({
            type: 'UPDATE_FORM',
            payload: {
              form: {
                header: 'header',
                message: 'message',
                audience: ['+20101231421'],
              },
            },
          });
          finalMessage.state.form = {
            header: 'header',
            message: 'message',
            audience: ['+20101231421'],
          };
          finalMessage.formStatus = 'VALID';
          // final message
          assert.deepEqual(messages[1], finalMessage);
        },
      });

    bloc.inbox().next(
      new PushNotificationCreationAction({
        type: 'UPDATE_FORM',
        payload: {
          form: {
            header: 'header',
            message: 'message',
            audience: ['+20101231421'],
          },
        },
      })
    );
  });
  it('updates form on UPDATE_FORM and sets the form status INVALID if the form was not valid', function () {
    const bloc = new PushNotificationCreationBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService: RouterServiceImpl.getInstance(),
    });

    const messages: PushNotificationCreationMessage[] = [];

    (bloc.outbox() as Observable<PushNotificationCreationMessage>)
      .pipe(take(2))
      .subscribe({
        next: (message: PushNotificationCreationMessage) => {
          messages.push(message);
        },
        complete: () => {
          // initial message
          assert.deepEqual(messages[0], new PushNotificationCreationMessage());

          const finalMessage = new PushNotificationCreationMessage();
          finalMessage.action = new PushNotificationCreationAction({
            type: 'UPDATE_FORM',
            payload: {
              form: {
                header: 'header',
                message: 'message',
                audience: [],
              },
            },
          });
          finalMessage.state.form = {
            header: 'header',
            message: 'message',
            audience: [],
          };
          finalMessage.formStatus = 'INVALID';
          // final message
          assert.deepEqual(messages[1], finalMessage);
        },
      });

    bloc.inbox().next(
      new PushNotificationCreationAction({
        type: 'UPDATE_FORM',
        payload: {
          form: {
            header: 'header',
            message: 'message',
            audience: [],
          },
        },
      })
    );
  });
  it('creates push notification, navigates to push notifications list on successful CREATE_PUSH_NOTIFICATION action', function () {
    const bloc = new PushNotificationCreationBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService: RouterServiceImpl.getInstance(),
    });

    const pushNotificationRepoImplStub = $sb.stub(
      PushNotificationsRepoImpl.prototype,
      'createPushNotification'
    );
    pushNotificationRepoImplStub.resolves();

    const routerServiceStub = $sb.stub(RouterServiceImpl.prototype, 'redirect');
    routerServiceStub.resolves();

    const messages: PushNotificationCreationMessage[] = [];

    (bloc.outbox() as Observable<PushNotificationCreationMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: PushNotificationCreationMessage) => {
          messages.push(message);
        },
        complete: () => {
          // initial message
          assert.deepEqual(messages[0], new PushNotificationCreationMessage());
          // update form message
          const updateFormMessage = new PushNotificationCreationMessage();
          updateFormMessage.action = new PushNotificationCreationAction({
            type: 'UPDATE_FORM',
            payload: {
              form: {
                header: 'header',
                message: 'message',
                audience: ['+20101231421'],
              },
            },
          });
          updateFormMessage.state.form = {
            header: 'header',
            message: 'message',
            audience: ['+20101231421'],
          };
          updateFormMessage.formStatus = 'VALID';
          assert.deepEqual(messages[1], updateFormMessage);

          // create push notification loading message
          const loadingMessage = updateFormMessage.clone();
          loadingMessage.action = new PushNotificationCreationAction({
            type: 'CREATE_PUSH_NOTIFICATION',
            payload: {},
          });
          loadingMessage.status = 'LOADING';
          assert.deepEqual(messages[2], loadingMessage);
          // create push notification final message
          const finalMessage = loadingMessage.clone();
          finalMessage.status = 'IDLE';
          assert.deepEqual(messages[3], finalMessage);
          assert.deepEqual(
            notificationService.notification,
            Notification.successfulOperation()
          );
          assert.isTrue(
            pushNotificationRepoImplStub.calledWithExactly({
              header: 'header',
              message: 'message',
              audience: ['+20101231421'],
            })
          );
          assert.isTrue(
            routerServiceStub.calledWithExactly({
              name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
            })
          );
        },
      });

    bloc.inbox().next(
      new PushNotificationCreationAction({
        type: 'UPDATE_FORM',
        payload: {
          form: {
            header: 'header',
            message: 'message',
            audience: ['+20101231421'],
          },
        },
      })
    );

    bloc.inbox().next(
      new PushNotificationCreationAction({
        type: 'CREATE_PUSH_NOTIFICATION',
        payload: {},
      })
    );
  });
  it('stops loading and notifies error on failed CREATE_PUSH_NOTIFICATION action', function () {
    const bloc = new PushNotificationCreationBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService: RouterServiceImpl.getInstance(),
    });

    const pushNotificationRepoImplStub = $sb.stub(
      PushNotificationsRepoImpl.prototype,
      'createPushNotification'
    );
    pushNotificationRepoImplStub.rejects(new Error('an error'));

    const messages: PushNotificationCreationMessage[] = [];

    (bloc.outbox() as Observable<PushNotificationCreationMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: PushNotificationCreationMessage) => {
          messages.push(message);
        },
        complete: () => {
          // initial message
          assert.deepEqual(messages[0], new PushNotificationCreationMessage());
          // update form message
          const updateFormMessage = new PushNotificationCreationMessage();
          updateFormMessage.action = new PushNotificationCreationAction({
            type: 'UPDATE_FORM',
            payload: {
              form: {
                header: 'header',
                message: 'message',
                audience: ['+20101231421'],
              },
            },
          });
          updateFormMessage.state.form = {
            header: 'header',
            message: 'message',
            audience: ['+20101231421'],
          };
          updateFormMessage.formStatus = 'VALID';
          assert.deepEqual(messages[1], updateFormMessage);

          // create push notification loading message
          const loadingMessage = updateFormMessage.clone();
          loadingMessage.action = new PushNotificationCreationAction({
            type: 'CREATE_PUSH_NOTIFICATION',
            payload: {},
          });
          loadingMessage.status = 'LOADING';
          assert.deepEqual(messages[2], loadingMessage);
          // create push notification final message
          const finalMessage = loadingMessage.clone();
          finalMessage.status = 'IDLE';
          assert.deepEqual(messages[3], finalMessage);
          assert.deepEqual(
            notificationService.notification,
            createNotification(new Error('an error'))
          );
          assert.isTrue(
            pushNotificationRepoImplStub.calledWithExactly({
              header: 'header',
              message: 'message',
              audience: ['+20101231421'],
            })
          );
        },
      });

    bloc.inbox().next(
      new PushNotificationCreationAction({
        type: 'UPDATE_FORM',
        payload: {
          form: {
            header: 'header',
            message: 'message',
            audience: ['+20101231421'],
          },
        },
      })
    );

    bloc.inbox().next(
      new PushNotificationCreationAction({
        type: 'CREATE_PUSH_NOTIFICATION',
        payload: {},
      })
    );
  });
});

describe('PushNotificationCreationBloc Integration', function () {
  it('creates push notification, navigates to push notifications list on successful CREATE_PUSH_NOTIFICATION action', function (done) {
    const bloc = new PushNotificationCreationBloc({
      pushNotificationsRepo: new PushNotificationsRepoImpl(),
      notificationService,
      routerService: RouterServiceImpl.getInstance(),
    });

    const wiremockStub = wiremock
      .stub<PushNotificationCreationRequest, PushNotificationCreationResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/customers/notifications',
        body: {
          title: 'header',
          body: 'message',
          audience: ['+20101231421'],
        },
      })
      .response({ status: 200 });

    const routerServiceStub = $sb.stub(RouterServiceImpl.prototype, 'redirect');
    routerServiceStub.resolves();

    const messages: PushNotificationCreationMessage[] = [];

    wiremockStub
      .then(() => {
        (bloc.outbox() as Observable<PushNotificationCreationMessage>)
          .pipe(take(4))
          .subscribe({
            next: (message: PushNotificationCreationMessage) => {
              messages.push(message);
            },
            complete: () => {
              // initial message
              assert.deepEqual(
                messages[0],
                new PushNotificationCreationMessage()
              );
              // update form message
              const updateFormMessage = new PushNotificationCreationMessage();
              updateFormMessage.action = new PushNotificationCreationAction({
                type: 'UPDATE_FORM',
                payload: {
                  form: {
                    header: 'header',
                    message: 'message',
                    audience: ['+20101231421'],
                  },
                },
              });
              updateFormMessage.state.form = {
                header: 'header',
                message: 'message',
                audience: ['+20101231421'],
              };
              updateFormMessage.formStatus = 'VALID';
              assert.deepEqual(messages[1], updateFormMessage);

              // create push notification loading message
              const loadingMessage = updateFormMessage.clone();
              loadingMessage.action = new PushNotificationCreationAction({
                type: 'CREATE_PUSH_NOTIFICATION',
                payload: {},
              });
              loadingMessage.status = 'LOADING';
              assert.deepEqual(messages[2], loadingMessage);
              // create push notification final message
              const finalMessage = loadingMessage.clone();
              finalMessage.status = 'IDLE';
              assert.deepEqual(messages[3], finalMessage);
              assert.deepEqual(
                notificationService.notification,
                Notification.successfulOperation()
              );
              assert.isTrue(
                routerServiceStub.calledWithExactly({
                  name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
                })
              );
              done();
            },
          });

        bloc.inbox().next(
          new PushNotificationCreationAction({
            type: 'UPDATE_FORM',
            payload: {
              form: {
                header: 'header',
                message: 'message',
                audience: ['+20101231421'],
              },
            },
          })
        );

        bloc.inbox().next(
          new PushNotificationCreationAction({
            type: 'CREATE_PUSH_NOTIFICATION',
            payload: {},
          })
        );
      })
      .catch((err) => {
        throw err;
      });
  });
});
