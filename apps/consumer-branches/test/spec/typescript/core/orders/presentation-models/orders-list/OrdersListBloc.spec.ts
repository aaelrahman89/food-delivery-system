import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  BranchDetailsRequest,
  BranchOrdersRequest,
  BranchOrdersResponse,
  ConsumerBranchDetailsResponse,
} from '@survv/api/definitions/branches';
import { BranchesRepoImpl } from '../../../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { Observable } from 'rxjs';
import { OrderStatus } from '../../../../../../../src/core/models/Order';
import {
  OrdersListAction,
  OrdersListMessage,
} from '../../../../../../../src/core/presentation-models/orders/orders-list/OrdersListMessage';
import { OrdersListBloc } from '../../../../../../../src/core/presentation-models/orders/orders-list/OrdersListBloc';
import { OrdersRepoImpl } from '../../../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  branchDetails,
  branchOrdersBackendResponseStub,
  initializeActionMessages,
  itemsListOrders,
  navigateToOrderDetailsMessages,
  updateFilterMessages,
  updatePaginationMessages,
  updateSortMessages,
} from './OrdersListBlocTestData';
import { consumerBranchDetailsResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../../../src/core/notification';
import { expect } from 'chai';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('OrdersListBloc Unit', function () {
  let bloc: OrdersListBloc;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new OrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      branchesRepo: new BranchesRepoImpl(),
      notificationService,
      localizationService,
      routerService,
    });
  });

  describe('on INITIALIZE', function () {
    it('initializes in case no (sort/filter/skip/limit) were given correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      } = initializeActionMessages(localizationService).inCaseNoQueryGiven();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .resolves(branchDetails());

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeDoneMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 25,
                filter: {},
                sort: { creationDate: 'desc' },
              }),
            },
          });
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
    it('initializes with given (sort/filter/skip/limit) correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      } = initializeActionMessages(localizationService).inCaseQueryGiven({
        filter: {
          statuses: [
            OrderStatus.REQUESTED.valueOf(),
            OrderStatus.DELIVERED.valueOf(),
          ],
        },
        sort: {
          total: 'desc',
        },
        skip: 100,
        limit: 50,
      });

      const ordersListMock = $sb.mock(OrdersRepoImpl.prototype);
      ordersListMock
        .expects('listOrders')
        .withExactArgs({
          filter: {
            statuses: [
              OrderStatus.REQUESTED.valueOf(),
              OrderStatus.DELIVERED.valueOf(),
            ],
          },
          sort: {
            total: 'desc',
          },
          skip: 100,
          limit: 50,
        })
        .resolves(itemsListOrders());

      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .resolves(branchDetails());

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeDoneMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 100,
                limit: 50,
                filter: {
                  statuses: [
                    OrderStatus.REQUESTED.valueOf(),
                    OrderStatus.DELIVERED.valueOf(),
                  ],
                },
                sort: { total: 'desc' },
              }),
            },
          });
          ordersListMock.verify();
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {
            filter: {
              statuses: [
                OrderStatus.REQUESTED.valueOf(),
                OrderStatus.DELIVERED.valueOf(),
              ],
            },
            sort: {
              total: 'desc',
            },
            skip: 100,
            limit: 50,
          },
        })
      );
    });
    it('initializes and handles fetching orders failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeProblematicMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseFetchingOrdersFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .rejects(new Error('an error'));

      const branchDetailsSpy = $sb.spy(
        BranchesRepoImpl.prototype,
        'getBranchDetails'
      );

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeProblematicMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 25,
                filter: {},
                sort: { creationDate: 'desc' },
              }),
            },
          });
          // eslint-disable-next-line no-unused-expressions
          expect(branchDetailsSpy.calledOnce).to.true;
          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
    it('initializes and handles fetching branch details failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeFetchingOrdersDoneMessage,
        initializeProblematicMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseFetchingBranchDetailsFailed();

      const ordersListMock = $sb.mock(OrdersRepoImpl.prototype);
      ordersListMock
        .expects('listOrders')
        .withExactArgs({
          filter: {},
          sort: {
            creationDate: 'desc',
          },
          skip: 0,
          limit: 25,
        })
        .resolves(itemsListOrders());

      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .rejects(new Error('an error'));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeFetchingOrdersDoneMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            initializeProblematicMessage,
            'fourth message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 25,
                filter: {},
                sort: { creationDate: 'desc' },
              }),
            },
          });
          ordersListMock.verify();
          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
  });
  describe('on UPDATE_PAGINATION', function () {
    it('updates pagination correctly', function (done) {
      const {
        defaultMessage,
        updatePaginationLoadingMessage,
        updatePaginationDoneMessage,
      } = updatePaginationMessages(
        localizationService
      ).inCaseSuccessfulPaginationUpdate(100, 50);

      const ordersListMock = $sb.mock(OrdersRepoImpl.prototype);
      ordersListMock
        .expects('listOrders')
        .withExactArgs({
          filter: {},
          sort: {},
          skip: 100,
          limit: 50,
        })
        .resolves(itemsListOrders());

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            updatePaginationLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            updatePaginationDoneMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 100,
                limit: 50,
                filter: {},
                sort: {},
              }),
            },
          });
          ordersListMock.verify();
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_PAGINATION',
          payload: {
            skip: 100,
            limit: 50,
          },
        })
      );
    });
    it('handles updating pagination failure successfully', function (done) {
      const {
        defaultMessage,
        updatePaginationLoadingMessage,
        updatePaginationProblematicMessage,
      } = updatePaginationMessages(
        localizationService
      ).inCaseFailedPaginationUpdate(25, 25);

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .rejects(new Error('an error'));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            updatePaginationLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            updatePaginationProblematicMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 25,
                limit: 25,
                filter: {},
                sort: {},
              }),
            },
          });
          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_PAGINATION',
          payload: { skip: 25, limit: 25 },
        })
      );
    });
  });
  describe('on UPDATE_FILTERS', function () {
    it('updates filter correctly', function (done) {
      const {
        defaultMessage,
        updateFilterLoadingMessage,
        updateFilterDoneMessage,
      } = updateFilterMessages(
        localizationService
      ).inCaseSuccessfulFilterUpdate({
        customerOrderId: 'EX4B8',
        statuses: [OrderStatus.REQUESTED.valueOf()],
        scheduled: [
          { from: '15:00:00', to: '16:00:00' },
          { from: '17:00:00', to: '18:00:00' },
        ],
        totalFrom: 100.0,
        totalTo: 200.0,
        creationDateFrom: '2021-1-1',
        creationDateTo: '2021-2-1',
      });

      const ordersListMock = $sb.mock(OrdersRepoImpl.prototype);
      ordersListMock
        .expects('listOrders')
        .withExactArgs({
          filter: {
            customerOrderId: 'EX4B8',
            statuses: [OrderStatus.REQUESTED.valueOf()],
            scheduled: [
              { from: '15:00:00', to: '16:00:00' },
              { from: '17:00:00', to: '18:00:00' },
            ],
            totalFrom: 100.0,
            totalTo: 200.0,
            creationDateFrom: '2021-1-1',
            creationDateTo: '2021-2-1',
          },
          sort: {},
          skip: 0,
          limit: 0,
        })
        .resolves(itemsListOrders());

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            updateFilterLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            updateFilterDoneMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 0,
                filter: {
                  customerOrderId: 'EX4B8',
                  statuses: [OrderStatus.REQUESTED.valueOf()],
                  scheduled: [
                    { from: '15:00:00', to: '16:00:00' },
                    { from: '17:00:00', to: '18:00:00' },
                  ],
                  totalFrom: 100.0,
                  totalTo: 200.0,
                  creationDateFrom: '2021-1-1',
                  creationDateTo: '2021-2-1',
                },
                sort: {},
              }),
            },
          });
          ordersListMock.verify();
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_FILTERS',
          payload: {
            filter: {
              customerOrderId: 'EX4B8',
              statuses: [OrderStatus.REQUESTED.valueOf()],
              scheduled: [
                { from: '15:00:00', to: '16:00:00' },
                { from: '17:00:00', to: '18:00:00' },
              ],
              totalFrom: 100.0,
              totalTo: 200.0,
              creationDateFrom: '2021-1-1',
              creationDateTo: '2021-2-1',
            },
          },
        })
      );
    });
    it('handles updating filter failure successfully', function (done) {
      const {
        defaultMessage,
        updateFilterLoadingMessage,
        updateFilterProblematicMessage,
      } = updateFilterMessages(localizationService).inCaseFailedFilterUpdate({
        customerOrderId: 'EX4B8',
        statuses: [OrderStatus.REQUESTED.valueOf()],
        scheduled: [
          { from: '15:00:00', to: '16:00:00' },
          { from: '17:00:00', to: '18:00:00' },
        ],
        totalFrom: 100.0,
        totalTo: 200.0,
        creationDateFrom: '2021-1-1',
        creationDateTo: '2021-2-1',
      });

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .rejects(new Error('an error'));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            updateFilterLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            updateFilterProblematicMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 0,
                filter: {
                  customerOrderId: 'EX4B8',
                  statuses: [OrderStatus.REQUESTED.valueOf()],
                  scheduled: [
                    { from: '15:00:00', to: '16:00:00' },
                    { from: '17:00:00', to: '18:00:00' },
                  ],
                  totalFrom: 100.0,
                  totalTo: 200.0,
                  creationDateFrom: '2021-1-1',
                  creationDateTo: '2021-2-1',
                },
                sort: {},
              }),
            },
          });
          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_FILTERS',
          payload: {
            filter: {
              customerOrderId: 'EX4B8',
              statuses: [OrderStatus.REQUESTED.valueOf()],
              scheduled: [
                { from: '15:00:00', to: '16:00:00' },
                { from: '17:00:00', to: '18:00:00' },
              ],
              totalFrom: 100.0,
              totalTo: 200.0,
              creationDateFrom: '2021-1-1',
              creationDateTo: '2021-2-1',
            },
          },
        })
      );
    });
  });
  describe('on UPDATE_SORT', function () {
    it('updates sort correctly', function (done) {
      const {
        defaultMessage,
        updateSortLoadingMessage,
        updateSortDoneMessage,
      } = updateSortMessages(localizationService).inCaseSuccessfulSortUpdate({
        total: 'asc',
      });

      const ordersListMock = $sb.mock(OrdersRepoImpl.prototype);
      ordersListMock
        .expects('listOrders')
        .withExactArgs({
          filter: {},
          sort: { total: 'asc' },
          skip: 0,
          limit: 0,
        })
        .resolves(itemsListOrders());

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            updateSortLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            updateSortDoneMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 0,
                filter: {},
                sort: { total: 'asc' },
              }),
            },
          });
          ordersListMock.verify();
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_SORT',
          payload: {
            sort: { total: 'asc' },
          },
        })
      );
    });
    it('handles updating sort failure successfully', function (done) {
      const {
        defaultMessage,
        updateSortLoadingMessage,
        updateSortProblematicMessage,
      } = updateSortMessages(localizationService).inCaseFailedSortUpdate({
        total: 'asc',
      });

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .rejects(new Error('an error'));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
        next: (message: OrdersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            updateSortLoadingMessage,
            'second message'
          );
          expect(messages[2]).deep.equal(
            updateSortProblematicMessage,
            'third message'
          );
          expect(routerService.route).deep.equal({
            name: 'routes.orders.list',
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 0,
                filter: {},
                sort: { total: 'asc' },
              }),
            },
          });
          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_SORT',
          payload: { sort: { total: 'asc' } },
        })
      );
    });
  });
  describe('on NAVIGATE_TO_ORDER_DETAILS', function () {
    it('navigates to survv shop order details if branch vendor type was SURVV_SHOP', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      } = initializeActionMessages(localizationService).inCaseNoQueryGiven();
      const { navigationMessage } =
        navigateToOrderDetailsMessages().navigateToOrderDetails(
          initializeDoneMessage,
          1111
        );

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .resolves(branchDetails(VendorType.SURVV_SHOP));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeDoneMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(navigationMessage, 'fourth message');
          expect(routerService.route).deep.equal({
            name: 'routes.orders.details.survv-shop',
            params: { orderId: '1111' },
          });
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
      flushPromises()
        .then(() => {
          bloc.inbox().next(
            new OrdersListAction({
              type: 'NAVIGATE_TO_ORDER_DETAILS',
              payload: {
                orderId: 1111,
              },
            })
          );
        })
        .catch((err) => {
          throw err;
        });
    });
    it('handles failed navigation to SURVV_SHOP successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      } = initializeActionMessages(localizationService).inCaseNoQueryGiven();
      const { navigationMessage } =
        navigateToOrderDetailsMessages().navigateToOrderDetails(
          initializeDoneMessage,
          1111
        );

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .resolves(branchDetails(VendorType.SURVV_SHOP));

      $sb
        .stub(RouterServiceMockImpl.prototype, 'redirect')
        .rejects(new Error('an error'));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeDoneMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(navigationMessage, 'fourth message');
          expect(notificationService.notification).to.be.undefined;
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );

      setTimeout(() => {
        bloc.inbox().next(
          new OrdersListAction({
            type: 'NAVIGATE_TO_ORDER_DETAILS',
            payload: {
              orderId: 1111,
            },
          })
        );
      }, 0);
    });
    it('navigates to survv shop order details if branch vendor type was not SURVV_SHOP', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      } = initializeActionMessages(localizationService).inCaseNoQueryGiven();
      const { navigationMessage } =
        navigateToOrderDetailsMessages().navigateToOrderDetails(
          initializeDoneMessage,
          1111
        );

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .resolves(branchDetails(VendorType.FOOD));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeDoneMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(navigationMessage, 'fourth message');
          expect(routerService.route).deep.equal({
            name: 'routes.orders.details',
            params: { orderId: '1111' },
          });
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
      flushPromises()
        .then(() => {
          bloc.inbox().next(
            new OrdersListAction({
              type: 'NAVIGATE_TO_ORDER_DETAILS',
              payload: {
                orderId: 1111,
              },
            })
          );
        })
        .catch((err) => {
          throw err;
        });
    });
    it('handles failed navigation to order details successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      } = initializeActionMessages(localizationService).inCaseNoQueryGiven();
      const { navigationMessage } =
        navigateToOrderDetailsMessages().navigateToOrderDetails(
          initializeDoneMessage,
          1111
        );

      $sb
        .stub(OrdersRepoImpl.prototype, 'listOrders')
        .resolves(itemsListOrders());
      $sb
        .stub(BranchesRepoImpl.prototype, 'getBranchDetails')
        .resolves(branchDetails(VendorType.FOOD));

      $sb
        .stub(RouterServiceMockImpl.prototype, 'redirect')
        .rejects(new Error('an error'));

      const messages: OrdersListMessage[] = [];
      (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
        next: (message: OrdersListMessage) => {
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
            initializeDoneMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(navigationMessage, 'fourth message');
          expect(notificationService.notification).to.be.undefined;
          done();
        },
      });

      bloc.inbox().next(
        new OrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );

      setTimeout(() => {
        bloc.inbox().next(
          new OrdersListAction({
            type: 'NAVIGATE_TO_ORDER_DETAILS',
            payload: {
              orderId: 1111,
            },
          })
        );
      }, 0);
    });
  });
});

describe('OrdersListBloc Integration', function () {
  let bloc: OrdersListBloc;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new OrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      branchesRepo: new BranchesRepoImpl(),
      notificationService,
      localizationService,
      routerService,
    });
  });

  it('initializes with given (sort/filter/skip/limit) correctly', function (done) {
    const { defaultMessage, initializeLoadingMessage, initializeDoneMessage } =
      initializeActionMessages(localizationService).inCaseQueryGiven({
        filter: {
          statuses: [
            OrderStatus.REQUESTED.valueOf(),
            OrderStatus.DELIVERED.valueOf(),
          ],
        },
        sort: {
          total: 'desc',
        },
        skip: 100,
        limit: 50,
      });

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    const fetchBranchOrdersMockPromise = wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId: 123 },
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'status',
                  operator: 'in',
                  value: ['REQUESTED', 'DELIVERED'],
                },
              ],
            },
            sort: {
              elements: [
                {
                  field: 'total.amount',
                  order: 'Desc',
                },
              ],
            },
            skip: 100,
            limit: 50,
          },
        },
      })
      .response({ status: 200, body: branchOrdersBackendResponseStub() });

    const fetchBranchDetailsPromise = wiremock
      .stub<BranchDetailsRequest, ConsumerBranchDetailsResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId',
        params: { branchId: 123 },
      })
      .response({ status: 200, body: consumerBranchDetailsResponseStub() });

    Promise.all([
      saveTokenPromise,
      fetchBranchOrdersMockPromise,
      fetchBranchDetailsPromise,
    ])
      .then(() => {
        const messages: OrdersListMessage[] = [];
        (bloc.outbox() as Observable<OrdersListMessage>)
          .pipe(take(3))
          .subscribe({
            next: (message: OrdersListMessage) => {
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
                initializeDoneMessage,
                'third message'
              );
              expect(routerService.route).deep.equal({
                name: 'routes.orders.list',
                query: {
                  q: JSON.stringify({
                    skip: 100,
                    limit: 50,
                    filter: {
                      statuses: [
                        OrderStatus.REQUESTED.valueOf(),
                        OrderStatus.DELIVERED.valueOf(),
                      ],
                    },
                    sort: { total: 'desc' },
                  }),
                },
              });
              done();
            },
          });

        bloc.inbox().next(
          new OrdersListAction({
            type: 'INITIALIZE',
            payload: {
              filter: {
                statuses: [
                  OrderStatus.REQUESTED.valueOf(),
                  OrderStatus.DELIVERED.valueOf(),
                ],
              },
              sort: {
                total: 'desc',
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
  it('updates pagination correctly', function (done) {
    const {
      defaultMessage,
      updatePaginationLoadingMessage,
      updatePaginationDoneMessage,
    } = updatePaginationMessages(
      localizationService
    ).inCaseSuccessfulPaginationUpdate(100, 50);

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    const fetchBranchOrdersMockPromise = wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId: 123 },
        query: {
          query: {
            vgql: 'v1',
            skip: 100,
            limit: 50,
          },
        },
      })
      .response({ status: 200, body: branchOrdersBackendResponseStub() });

    Promise.all([saveTokenPromise, fetchBranchOrdersMockPromise])
      .then(() => {
        const messages: OrdersListMessage[] = [];
        (bloc.outbox() as Observable<OrdersListMessage>)
          .pipe(take(3))
          .subscribe({
            next: (message: OrdersListMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                updatePaginationLoadingMessage,
                'second message'
              );
              expect(messages[2]).deep.equal(
                updatePaginationDoneMessage,
                'third message'
              );
              expect(routerService.route).deep.equal({
                name: 'routes.orders.list',
                query: {
                  q: JSON.stringify({
                    skip: 100,
                    limit: 50,
                    filter: {},
                    sort: {},
                  }),
                },
              });
              done();
            },
          });

        bloc.inbox().next(
          new OrdersListAction({
            type: 'UPDATE_PAGINATION',
            payload: {
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
  it('updates filter correctly', function (done) {
    const {
      defaultMessage,
      updateFilterLoadingMessage,
      updateFilterDoneMessage,
    } = updateFilterMessages(localizationService).inCaseSuccessfulFilterUpdate({
      customerOrderId: 'EX4B8',
      statuses: [OrderStatus.REQUESTED.valueOf()],
      scheduled: [
        { from: '15:00:00', to: '16:00:00' },
        { from: '17:00:00', to: '18:00:00' },
      ],
      totalFrom: 100.0,
      totalTo: 200.0,
      creationDateFrom: '2021-1-1T00:00:00Z',
      creationDateTo: '2021-2-1T00:00:00Z',
    });

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    const fetchBranchOrdersMockPromise = wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId: 123 },
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'customerOrderId',
                  operator: 'eq',
                  value: 'EX4B8',
                },
                {
                  field: 'status',
                  operator: 'in',
                  value: ['REQUESTED'],
                },
                {
                  field: 'scheduledTo.from',
                  operator: 'in',
                  value: [54000, 61200],
                },
                {
                  field: 'scheduledTo.to',
                  operator: 'in',
                  value: [57600, 64800],
                },
                {
                  field: 'total.amount',
                  operator: 'gte',
                  value: 100.0,
                },
                {
                  field: 'total.amount',
                  operator: 'lte',
                  value: 200.0,
                },
                {
                  field: 'creationDate',
                  operator: 'gte',
                  value: '2021-1-1T00:00:00Z',
                },
                {
                  field: 'creationDate',
                  operator: 'lte',
                  value: '2021-2-1T00:00:00Z',
                },
              ],
            },
            skip: 0,
          },
        },
      })
      .response({ status: 200, body: branchOrdersBackendResponseStub() });

    Promise.all([saveTokenPromise, fetchBranchOrdersMockPromise])
      .then(() => {
        const messages: OrdersListMessage[] = [];
        (bloc.outbox() as Observable<OrdersListMessage>)
          .pipe(take(3))
          .subscribe({
            next: (message: OrdersListMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                updateFilterLoadingMessage,
                'second message'
              );
              expect(messages[2]).deep.equal(
                updateFilterDoneMessage,
                'third message'
              );
              expect(routerService.route).deep.equal({
                name: 'routes.orders.list',
                query: {
                  q: JSON.stringify({
                    skip: 0,
                    limit: 0,
                    filter: {
                      customerOrderId: 'EX4B8',
                      statuses: [OrderStatus.REQUESTED.valueOf()],
                      scheduled: [
                        { from: '15:00:00', to: '16:00:00' },
                        { from: '17:00:00', to: '18:00:00' },
                      ],
                      totalFrom: 100.0,
                      totalTo: 200.0,
                      creationDateFrom: '2021-1-1T00:00:00Z',
                      creationDateTo: '2021-2-1T00:00:00Z',
                    },
                    sort: {},
                  }),
                },
              });
              done();
            },
          });

        bloc.inbox().next(
          new OrdersListAction({
            type: 'UPDATE_FILTERS',
            payload: {
              filter: {
                customerOrderId: 'EX4B8',
                statuses: [OrderStatus.REQUESTED.valueOf()],
                scheduled: [
                  { from: '15:00:00', to: '16:00:00' },
                  { from: '17:00:00', to: '18:00:00' },
                ],
                totalFrom: 100.0,
                totalTo: 200.0,
                creationDateFrom: '2021-1-1T00:00:00Z',
                creationDateTo: '2021-2-1T00:00:00Z',
              },
            },
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('updates sort correctly', function (done) {
    const { defaultMessage, updateSortLoadingMessage, updateSortDoneMessage } =
      updateSortMessages(localizationService).inCaseSuccessfulSortUpdate({
        total: 'asc',
      });

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    const fetchBranchOrdersMockPromise = wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId: 123 },
        query: {
          query: {
            vgql: 'v1',
            sort: {
              elements: [
                {
                  field: 'total.amount',
                  order: 'Asc',
                },
              ],
            },
            skip: 0,
          },
        },
      })
      .response({ status: 200, body: branchOrdersBackendResponseStub() });

    Promise.all([saveTokenPromise, fetchBranchOrdersMockPromise])
      .then(() => {
        const messages: OrdersListMessage[] = [];
        (bloc.outbox() as Observable<OrdersListMessage>)
          .pipe(take(3))
          .subscribe({
            next: (message: OrdersListMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                updateSortLoadingMessage,
                'second message'
              );
              expect(messages[2]).deep.equal(
                updateSortDoneMessage,
                'third message'
              );
              expect(routerService.route).deep.equal({
                name: 'routes.orders.list',
                query: {
                  q: JSON.stringify({
                    skip: 0,
                    limit: 0,
                    filter: {},
                    sort: { total: 'asc' },
                  }),
                },
              });
              done();
            },
          });

        bloc.inbox().next(
          new OrdersListAction({
            type: 'UPDATE_SORT',
            payload: {
              sort: { total: 'asc' },
            },
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
