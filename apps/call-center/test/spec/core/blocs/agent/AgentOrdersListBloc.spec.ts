import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  AgentOrdersListAction,
  AgentOrdersListMessage,
} from '../../../../../src/core/blocs/agent/AgentOrdersListMessage';
import { AgentOrdersListBloc } from '../../../../../src/core/blocs/agent/AgentOrdersListBloc';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { Observable } from 'rxjs';
import {
  OrdersListV2Request,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { createNotification } from '../../../../../src/core/notification';
import { deepEqual } from '@survv/commons/core/utils/checks';
import { expect } from 'chai';
import {
  fetchOrdersActionMessages,
  initializeActionMessages,
  itemsListOrders,
  listOrdersBackendResponseStub,
} from './AgentOrdersListBlocTestData';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('AgentOrdersListBloc Unit', function () {
  let bloc: AgentOrdersListBloc;
  const localizationService = new LocalizationServiceMockImpl();

  beforeEach(function () {
    bloc = new AgentOrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
      localizationService,
    });
  });

  describe('on INITIALIZE', function () {
    it('initializes correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeQueuedOrdersDoneMessage,
        initializeWorkingOrdersDoneMessage,
        initializeScheduledOrdersDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseFetchingOrdersSucceeded();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .resolves(itemsListOrders());

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
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
            expect(
              messages.some((message) => {
                return (
                  message.queuedOrdersStatus === 'IDLE' &&
                  deepEqual(
                    message.state.queuedOrders,
                    initializeQueuedOrdersDoneMessage.state.queuedOrders
                  )
                );
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.workingOrdersStatus === 'IDLE' &&
                  deepEqual(
                    message.state.workingOrders,
                    initializeWorkingOrdersDoneMessage.state.queuedOrders
                  )
                );
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.scheduledOrdersStatus === 'IDLE' &&
                  deepEqual(
                    message.state.scheduledOrders,
                    initializeScheduledOrdersDoneMessage.state.queuedOrders
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles fetching queued orders failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeQueuedOrdersProblematicMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .rejects(new Error('an error'));
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .resolves(itemsListOrders());

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
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
            expect(
              messages.some((message) => {
                return (
                  message.queuedOrdersStatus ===
                  initializeQueuedOrdersProblematicMessage.queuedOrdersStatus
                );
              })
            ).to.be.true;

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles fetching working orders failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeWorkingOrdersProblematicMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .rejects(new Error('an error'));
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .resolves(itemsListOrders());

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
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
            expect(
              messages.some((message) => {
                return (
                  message.workingOrdersStatus ===
                  initializeWorkingOrdersProblematicMessage.workingOrdersStatus
                );
              })
            ).to.be.true;

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles fetching scheduled orders failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeScheduledOrdersProblematicMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .rejects(new Error('an error'));

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
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
            expect(
              messages.some((message) => {
                return (
                  message.scheduledOrdersStatus ===
                  initializeScheduledOrdersProblematicMessage.scheduledOrdersStatus
                );
              })
            ).to.be.true;

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'INITIALIZE',
        })
      );
    });
  });

  describe('on FETCH_ORDERS', function () {
    it('initializes correctly', function (done) {
      const {
        defaultMessage,
        fetchOrdersLoadingMessage,
        fetchOrdersQueuedOrdersDoneMessage,
        fetchOrdersWorkingOrdersDoneMessage,
        fetchOrdersScheduledOrdersDoneMessage,
      } =
        fetchOrdersActionMessages(
          localizationService
        ).inCaseFetchingOrdersSucceeded();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .resolves(itemsListOrders());

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchOrdersLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.queuedOrdersStatus === 'IDLE' &&
                  deepEqual(
                    message.state.queuedOrders,
                    fetchOrdersQueuedOrdersDoneMessage.state.queuedOrders
                  )
                );
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.workingOrdersStatus === 'IDLE' &&
                  deepEqual(
                    message.state.workingOrders,
                    fetchOrdersWorkingOrdersDoneMessage.state.workingOrders
                  )
                );
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.scheduledOrdersStatus === 'IDLE' &&
                  deepEqual(
                    message.state.scheduledOrders,
                    fetchOrdersScheduledOrdersDoneMessage.state.scheduledOrders
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'FETCH_ORDERS',
        })
      );
    });
    it('handles fetching queued orders failure successfully', function (done) {
      const {
        defaultMessage,
        fetchOrdersLoadingMessage,
        fetchOrdersQueuedOrdersProblematicMessage,
      } =
        fetchOrdersActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .rejects(new Error('an error'));
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .resolves(itemsListOrders());

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchOrdersLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.queuedOrdersStatus ===
                  fetchOrdersQueuedOrdersProblematicMessage.queuedOrdersStatus
                );
              })
            ).to.be.true;

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'FETCH_ORDERS',
        })
      );
    });
    it('handles fetching working orders failure successfully', function (done) {
      const {
        defaultMessage,
        fetchOrdersLoadingMessage,
        fetchOrdersWorkingOrdersProblematicMessage,
      } =
        fetchOrdersActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .rejects(new Error('an error'));
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .resolves(itemsListOrders());

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchOrdersLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.workingOrdersStatus ===
                  fetchOrdersWorkingOrdersProblematicMessage.workingOrdersStatus
                );
              })
            ).to.be.true;

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'FETCH_ORDERS',
        })
      );
    });
    it('handles fetching scheduled orders failure successfully', function (done) {
      const {
        defaultMessage,
        fetchOrdersLoadingMessage,
        fetchOrdersScheduledOrdersProblematicMessage,
      } =
        fetchOrdersActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listAgentQueuedOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listWorkingOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(OrdersRepoImpl.prototype, 'listScheduledOrders')
        .rejects(new Error('an error'));

      const messages: AgentOrdersListMessage[] = [];
      (bloc.outbox() as Observable<AgentOrdersListMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: AgentOrdersListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchOrdersLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.scheduledOrdersStatus ===
                  fetchOrdersScheduledOrdersProblematicMessage.scheduledOrdersStatus
                );
              })
            ).to.be.true;

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new AgentOrdersListAction({
          type: 'FETCH_ORDERS',
        })
      );
    });
  });
});

describe('AgentOrdersListBloc Integration', function () {
  let bloc: AgentOrdersListBloc;
  const localizationService = new LocalizationServiceMockImpl();

  beforeEach(function () {
    bloc = new AgentOrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
      localizationService,
    });
  });

  it('initializes correctly', function (done) {
    $sb.stub(Datetime.prototype, 'humanizeElapsedTime').returns('Now');
    $sb.stub(Date, 'now').returns(1625677046405);
    $sb
      .stub(kvStorage, 'getItem')
      .withArgs('user-id')
      .resolves(123)
      .withArgs('vendor-id')
      .resolves(123);

    const {
      defaultMessage,
      initializeLoadingMessage,
      initializeQueuedOrdersDoneMessage,
      initializeWorkingOrdersDoneMessage,
      initializeScheduledOrdersDoneMessage,
    } =
      initializeActionMessages(
        localizationService
      ).inCaseFetchingOrdersSucceeded();

    const fetchQueuedOrdersMockPromise = wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'pickups.vendorId',
                  operator: 'eq',
                  value: 123,
                },
                {
                  field: 'status',
                  operator: 'eq',
                  value: 'REQUESTED',
                },
                {
                  field: 'assignedAgent.id',
                  operator: 'in',
                  value: [0, 123],
                },
              ],
            },
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Asc',
                },
              ],
            },
          },
        },
      })
      .response({ status: 200, body: listOrdersBackendResponseStub() });

    const fetchWorkingOrdersMockPromise = wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'pickups.vendorId',
                  operator: 'eq',
                  value: 123,
                },
                {
                  field: 'status',
                  operator: 'in',
                  value: [
                    'CONFIRMED',
                    'PILOT_REQUESTED',
                    'PILOT_ASSIGNED',
                    'COLLECTED',
                  ],
                },
              ],
            },
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Asc',
                },
              ],
            },
          },
        },
      })
      .response({ status: 200, body: listOrdersBackendResponseStub() });

    const fetchScheduledOrdersMockPromise = wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: {
            filter: {
              elements: [
                { field: 'pickups.vendorId', operator: 'eq', value: 123 },
                {
                  field: 'notifyVendorAt',
                  operator: 'lte',
                  value: new Datetime(Date.now()).toISOString(),
                },
                { field: 'scheduled', operator: 'eq', value: true },
                {
                  field: 'status',
                  operator: 'in',
                  value: ['SCHEDULED', 'PILOT_REQUESTED', 'PILOT_ASSIGNED'],
                },
              ],
            },
            sort: { elements: [{ field: 'creationDate', order: 'Asc' }] },
            vgql: 'v1',
          },
        },
      })
      .response({ status: 200, body: listOrdersBackendResponseStub() });

    Promise.all([
      fetchQueuedOrdersMockPromise,
      fetchWorkingOrdersMockPromise,
      fetchScheduledOrdersMockPromise,
    ])
      .then(() => {
        const messages: AgentOrdersListMessage[] = [];
        (bloc.outbox() as Observable<AgentOrdersListMessage>)
          .pipe(take(5))
          .subscribe({
            next: (message: AgentOrdersListMessage) => {
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
              expect(
                messages.some((message) => {
                  return (
                    message.queuedOrdersStatus === 'IDLE' &&
                    deepEqual(
                      message.state.queuedOrders,
                      initializeQueuedOrdersDoneMessage.state.queuedOrders
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.workingOrdersStatus === 'IDLE' &&
                    deepEqual(
                      message.state.workingOrders,
                      initializeWorkingOrdersDoneMessage.state.workingOrders
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.scheduledOrdersStatus === 'IDLE' &&
                    deepEqual(
                      message.state.scheduledOrders,
                      initializeScheduledOrdersDoneMessage.state.scheduledOrders
                    )
                  );
                })
              ).to.be.true;
              done();
            },
          });

        bloc.inbox().next(
          new AgentOrdersListAction({
            type: 'INITIALIZE',
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
