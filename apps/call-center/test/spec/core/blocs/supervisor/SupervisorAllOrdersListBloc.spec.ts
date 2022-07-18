import { $sb } from '@survv/commons/test/utils/sandbox';
import { Branch } from '../../../../../src/core/models/Branch';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import {
  ConsumerB2CBranchesListRequest,
  ConsumerB2CBranchesListResponse,
} from '@survv/api/definitions/branches';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Observable } from 'rxjs';
import {
  Order,
  OrderItem,
  OrderPaymentMethod,
  OrderStatus,
} from '../../../../../src/core/models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import {
  OrdersListV2Request,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import {
  SupervisorAllOrdersListAction,
  SupervisorAllOrdersListMessage,
} from '../../../../../src/core/blocs/supervisor/all-orders/SupervisorAllOrdersListMessage';
import { SupervisorAllOrdersListBloc } from '../../../../../src/core/blocs/supervisor/all-orders/SupervisorAllOrdersListBloc';
import { Time } from '@survv/commons/core/models/Time';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { consumerB2cBranchesListResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { ordersListV2ResponseStub } from '@survv/api/stubs/orders';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SupervisorAllOrdersListBloc Unit Tests', function () {
  let bloc: SupervisorAllOrdersListBloc;
  let listOrdersStubResponse: ItemsList<Order>;
  let listBranchesStubResponse: Branch[];
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  function stubListOrders(): void {
    listOrdersStubResponse = {
      totalItemsCount: 100,
      items: [
        new Order({
          id: 1234,
          customerMobileNo: '9999999999',
          customerOrderId: new CustomerOrderId('1234'),
          branchLabel: 'branchLabel',
          status: OrderStatus.REQUESTED,
          paymentMethod: OrderPaymentMethod.CREDIT,
          total: new Money({
            amount: 20,
            currency: 'EGP',
          }),
          items: [
            new OrderItem({
              orderItemId: 12,
              itemId: 13,
              title: new MultilingualString({
                en: 'title_en',
                ar: 'title_ar',
              }),
              quantity: 2,
              price: new Money({ amount: 10, currency: 'EGP' }),
              options: [],
              notes: '',
            }),
          ],
          scheduledTo: new HoursRange({
            from: new Time('00:00:00'),
            to: new Time('00:00:00'),
          }),
          type: OrderType.B2C,
          creationDate: new Datetime('2021-1-1'),
          tax: new Money({ amount: 10, currency: 'EGP' }),
          totalDueAmount: new Money({ amount: 10, currency: 'EGP' }),
          notes: '',
          branchId: 1,
          vendorId: 2,
          scheduled: false,
          vendorDisplayName: new MultilingualString({
            en: 'title_en',
            ar: 'title_ar',
          }),
          addressId: 123,
          customerId: 123,
          lastUpdateDate: new Datetime('2021-1-1'),
          totalWithoutDeliveryFees: new Money({ amount: 10, currency: 'EGP' }),
          subtotal: new Money({ amount: 10, currency: 'EGP' }),
          vendorTaskId: 'X123',
          deliveryFee: new Money({ amount: 10, currency: 'EGP' }),
          isB2C: true,
          isC2C: false,
          acceptanceDate: new Datetime('2021-2-1'),
          assignedAgent: {
            id: 123,
            email: 'example@example.com',
          },
        }),
        new Order({
          id: 1234,
          customerMobileNo: '9999999999',
          customerOrderId: new CustomerOrderId('1234'),
          branchLabel: 'branchLabel',
          status: OrderStatus.REQUESTED,
          paymentMethod: OrderPaymentMethod.CREDIT,
          total: new Money({
            amount: 20,
            currency: 'EGP',
          }),
          items: [
            new OrderItem({
              orderItemId: 12,
              itemId: 13,
              title: new MultilingualString({
                en: 'title_en',
                ar: 'title_ar',
              }),
              quantity: 2,
              price: new Money({ amount: 10, currency: 'EGP' }),
              options: [],
              notes: '',
            }),
          ],
          scheduledTo: new HoursRange({
            from: new Time('00:00:00'),
            to: new Time('00:00:00'),
          }),
          type: OrderType.B2C,
          creationDate: new Datetime('2021-1-1'),
          tax: new Money({ amount: 10, currency: 'EGP' }),
          totalDueAmount: new Money({ amount: 10, currency: 'EGP' }),
          notes: '',
          branchId: 1,
          vendorId: 2,
          scheduled: true,
          vendorDisplayName: new MultilingualString({
            en: 'title_en',
            ar: 'title_ar',
          }),
          addressId: 123,
          customerId: 123,
          lastUpdateDate: new Datetime('2021-1-1'),
          totalWithoutDeliveryFees: new Money({ amount: 10, currency: 'EGP' }),
          subtotal: new Money({ amount: 10, currency: 'EGP' }),
          vendorTaskId: 'X123',
          deliveryFee: new Money({ amount: 10, currency: 'EGP' }),
          isB2C: true,
          isC2C: false,
          acceptanceDate: new Datetime(0),
          assignedAgent: {
            id: 123,
            email: 'example@example.com',
          },
        }),
      ],
    };
    $sb
      .stub(OrdersRepoImpl.prototype, 'listOrders')
      .resolves(listOrdersStubResponse);
  }

  function stubListBranches(): void {
    listBranchesStubResponse = [
      new Branch({
        id: 1234,
        vendorId: 1,
        label: 'Label',
      }),
    ];
    $sb
      .stub(BranchesRepoImpl.prototype, 'listBranches')
      .resolves(listBranchesStubResponse);
  }

  beforeEach(() => {
    bloc = new SupervisorAllOrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      branchesRepo: new BranchesRepoImpl(),
      notificationService,
      localizationService,
      routerService,
    });
  });

  it('Should initialize with given (sort/filter/skip/limit) successfully.', function (done) {
    stubListOrders();
    stubListBranches();

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            filters: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.filters = {
          statuses: [OrderStatus.REQUESTED.valueOf()],
        };
        msg.state.tableData.skip = 100;
        msg.state.tableData.limit = 50;
        msg.state.sort = { creationDate: 'asc' };
        msg.state.filtersData.statusList = [
          {
            label: localizationService.localize(
              OrderStatus.REQUESTED.toString()
            ),
            value: OrderStatus.REQUESTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.CONFIRMED.toString()
            ),
            value: OrderStatus.CONFIRMED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.SCHEDULED.toString()
            ),
            value: OrderStatus.SCHEDULED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.REJECTED.toString()
            ),
            value: OrderStatus.REJECTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.PILOT_REQUESTED.toString()
            ),
            value: OrderStatus.PILOT_REQUESTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.PILOT_ASSIGNED.toString()
            ),
            value: OrderStatus.PILOT_ASSIGNED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.COLLECTED.toString()
            ),
            value: OrderStatus.COLLECTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.DELIVERED.toString()
            ),
            value: OrderStatus.DELIVERED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.CANCELLED.toString()
            ),
            value: OrderStatus.CANCELLED.valueOf(),
          },
        ];
        return msg;
      })();
    const initializeTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.filtersStatus = 'LOADING';
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeFilterLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: 'in about 1 month',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: new HoursRange({
              from: new Time('00:00:00'),
              to: new Time('00:00:00'),
            }).toString(),
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: '....',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
        ];
        return msg;
      })();
    const initializeFilterDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeTableDoneMessage.clone();
        msg.filtersStatus = 'IDLE';
        msg.state.filtersData.branches = [
          {
            value: 1234,
            label: 'Label',
          },
        ];
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(6))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
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
            initializeFilterLoadingMessage,
            'forth message'
          );
          expect(messages[4]).deep.equal(
            initializeTableDoneMessage,
            'fifth message'
          );
          expect(messages[5]).deep.equal(
            initializeFilterDoneMessage,
            'sixth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
            query: {
              q: JSON.stringify({
                skip: 100,
                limit: 50,
                filter: {
                  statuses: [OrderStatus.REQUESTED.valueOf()],
                },
                sort: { creationDate: 'asc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'INITIALIZE',
        payload: {
          skip: 100,
          limit: 50,
          filters: {
            statuses: [OrderStatus.REQUESTED.valueOf()],
          },
          sort: { creationDate: 'asc' },
        },
      })
    );
  });

  it('Should initialize with no (sort/filter/skip/limit) given successfully.', function (done) {
    stubListOrders();
    stubListBranches();

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'INITIALIZE',
          payload: {},
        });
        msg.state.filtersData.statusList = [
          {
            label: localizationService.localize(
              OrderStatus.REQUESTED.toString()
            ),
            value: OrderStatus.REQUESTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.CONFIRMED.toString()
            ),
            value: OrderStatus.CONFIRMED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.SCHEDULED.toString()
            ),
            value: OrderStatus.SCHEDULED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.REJECTED.toString()
            ),
            value: OrderStatus.REJECTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.PILOT_REQUESTED.toString()
            ),
            value: OrderStatus.PILOT_REQUESTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.PILOT_ASSIGNED.toString()
            ),
            value: OrderStatus.PILOT_ASSIGNED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.COLLECTED.toString()
            ),
            value: OrderStatus.COLLECTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.DELIVERED.toString()
            ),
            value: OrderStatus.DELIVERED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.CANCELLED.toString()
            ),
            value: OrderStatus.CANCELLED.valueOf(),
          },
        ];
        return msg;
      })();
    const initializeTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.filtersStatus = 'LOADING';
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeFilterLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: 'in about 1 month',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: new HoursRange({
              from: new Time('00:00:00'),
              to: new Time('00:00:00'),
            }).toString(),
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: '....',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
        ];
        return msg;
      })();
    const initializeFilterDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeTableDoneMessage.clone();
        msg.filtersStatus = 'IDLE';
        msg.state.filtersData.branches = [
          {
            value: 1234,
            label: 'Label',
          },
        ];
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(6))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
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
            initializeFilterLoadingMessage,
            'forth message'
          );
          expect(messages[4]).deep.equal(
            initializeTableDoneMessage,
            'fifth message'
          );
          expect(messages[5]).deep.equal(
            initializeFilterDoneMessage,
            'sixth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 10,
                filter: {},
                sort: { creationDate: 'desc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'INITIALIZE',
        payload: {},
      })
    );
  });

  it('should load orders on sort successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const loadOrdersMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
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
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: 'in about 1 month',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: new HoursRange({
              from: new Time('00:00:00'),
              to: new Time('00:00:00'),
            }).toString(),
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: '....',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
        ];
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(loadOrdersMessage, 'second message');
          expect(messages[2]).deep.equal(
            loadOrdersTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadOrdersTableDoneMessage,
            'forth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 10,
                filter: {},
                sort: { creationDate: 'asc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          sort: { creationDate: 'asc' },
        },
      })
    );
  });

  it('should load orders on pagination successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const loadOrdersMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {
            skip: 1,
            limit: 15,
          },
        });
        msg.state.tableData.skip = 1;
        msg.state.tableData.limit = 15;
        return msg;
      })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: 'in about 1 month',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: new HoursRange({
              from: new Time('00:00:00'),
              to: new Time('00:00:00'),
            }).toString(),
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: '....',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
        ];
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(loadOrdersMessage, 'second message');
          expect(messages[2]).deep.equal(
            loadOrdersTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadOrdersTableDoneMessage,
            'forth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
            query: {
              q: JSON.stringify({
                skip: 1,
                limit: 15,
                filter: {},
                sort: { creationDate: 'desc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          skip: 1,
          limit: 15,
        },
      })
    );
  });

  it('should load orders on filter update successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const loadOrdersMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {
            filters: {
              branchIds: [1],
              customerOrderId: '#1234',
              statuses: ['REQUESTED'],
              from: '2021-07-06T04:00:00.000Z',
              to: '2021-07-06T04:00:00.000Z',
            },
          },
        });
        msg.state.filters = {
          branchIds: [1],
          customerOrderId: '#1234',
          statuses: ['REQUESTED'],
          from: '2021-07-06T04:00:00.000Z',
          to: '2021-07-06T04:00:00.000Z',
        };
        return msg;
      })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: 'in about 1 month',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
          {
            id: 1234,
            branchLabel: localizationService.localize('branchLabel'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            customerOrderId: '#1234',
            scheduledTo: new HoursRange({
              from: new Time('00:00:00'),
              to: new Time('00:00:00'),
            }).toString(),
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            timeToAccept: '....',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: 'X123',
          },
        ];
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(loadOrdersMessage, 'second message');
          expect(messages[2]).deep.equal(
            loadOrdersTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadOrdersTableDoneMessage,
            'forth message'
          );
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
            query: {
              q: JSON.stringify({
                skip: 0,
                limit: 10,
                filter: {
                  branchIds: [1],
                  customerOrderId: '#1234',
                  statuses: ['REQUESTED'],
                  from: '2021-07-06T04:00:00.000Z',
                  to: '2021-07-06T04:00:00.000Z',
                },
                sort: { creationDate: 'desc' },
              }),
            },
          });
          done();
        },
      });

    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          filters: {
            branchIds: [1],
            customerOrderId: '#1234',
            statuses: ['REQUESTED'],
            from: '2021-07-06T04:00:00.000Z',
            to: '2021-07-06T04:00:00.000Z',
          },
        },
      })
    );
  });

  it('should display fetching orders errors successfully.', function (done) {
    $sb
      .stub(OrdersRepoImpl.prototype, 'listOrders')
      .rejects(new Error('anything'));

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const loadOrdersMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {},
        });
        return msg;
      })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersErrorMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.status = 'IDLE';
        msg.tableStatus = 'PROBLEMATIC';
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(loadOrdersMessage, 'second message');
          expect(messages[2]).deep.equal(
            loadOrdersTableLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadOrdersErrorMessage,
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
      new SupervisorAllOrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {},
      })
    );
  });

  it('should display fetching branches errors successfully.', function (done) {
    $sb
      .stub(BranchesRepoImpl.prototype, 'listBranches')
      .rejects(new Error('anything'));

    const defaultMessage = new SupervisorAllOrdersListMessage();
    const loadBranchesMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'LOAD_BRANCHES',
          payload: {},
        });
        return msg;
      })();
    const loadFiltersLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadBranchesMessage.clone();
        msg.filtersStatus = 'LOADING';
        return msg;
      })();
    const loadBranchesErrorMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadFiltersLoadingMessage.clone();
        msg.status = 'IDLE';
        msg.filtersStatus = 'PROBLEMATIC';
        return msg;
      })();

    const messages: SupervisorAllOrdersListMessage[] = [];
    (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
      .pipe(take(4))
      .subscribe({
        next: (message: SupervisorAllOrdersListMessage) => {
          messages.push(message);
        },
        error: (error: Error) => {
          throw error;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(loadBranchesMessage, 'second message');
          expect(messages[2]).deep.equal(
            loadFiltersLoadingMessage,
            'third message'
          );
          expect(messages[3]).deep.equal(
            loadBranchesErrorMessage,
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
      new SupervisorAllOrdersListAction({
        type: 'LOAD_BRANCHES',
        payload: {},
      })
    );
  });

  it('should navigate to order details successfully.', function () {
    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'NAVIGATE_TO_ORDER_DETAILS',
        payload: {
          order: {
            id: 1234,
          },
        },
      })
    );

    expect(routerService.route).deep.equal({
      name: ROUTE_NAMES.SUPERVISOR_ALL_ORDER_DETAILS,
      params: { orderId: '1234' },
    });
  });

  it('should handle failed navigation to order details successfully.', function () {
    $sb.stub(routerService, 'redirect').rejects();

    bloc.inbox().next(
      new SupervisorAllOrdersListAction({
        type: 'NAVIGATE_TO_ORDER_DETAILS',
        payload: {
          order: {
            id: 1234,
          },
        },
      })
    );

    expect(notificationService.notification).deep.equal(undefined);
  });
});

describe('SupervisorAllOrdersListBloc Integration', function () {
  let bloc: SupervisorAllOrdersListBloc;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new SupervisorAllOrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      branchesRepo: new BranchesRepoImpl(),
      notificationService,
      localizationService,
      routerService,
    });
  });

  it('Should initialize with given (sort/filter/skip/limit) successfully', function (done) {
    const defaultMessage = new SupervisorAllOrdersListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            filters: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.filters = {
          statuses: [OrderStatus.REQUESTED.valueOf()],
        };
        msg.state.tableData.skip = 100;
        msg.state.tableData.limit = 50;
        msg.state.sort = { creationDate: 'asc' };
        msg.state.filtersData.statusList = [
          {
            label: localizationService.localize(
              OrderStatus.REQUESTED.toString()
            ),
            value: OrderStatus.REQUESTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.CONFIRMED.toString()
            ),
            value: OrderStatus.CONFIRMED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.SCHEDULED.toString()
            ),
            value: OrderStatus.SCHEDULED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.REJECTED.toString()
            ),
            value: OrderStatus.REJECTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.PILOT_REQUESTED.toString()
            ),
            value: OrderStatus.PILOT_REQUESTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.PILOT_ASSIGNED.toString()
            ),
            value: OrderStatus.PILOT_ASSIGNED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.COLLECTED.toString()
            ),
            value: OrderStatus.COLLECTED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.DELIVERED.toString()
            ),
            value: OrderStatus.DELIVERED.valueOf(),
          },
          {
            label: localizationService.localize(
              OrderStatus.CANCELLED.toString()
            ),
            value: OrderStatus.CANCELLED.valueOf(),
          },
        ];
        return msg;
      })();
    const initializeTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.filtersStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeFilterLoadingMessage.clone();
        msg.filtersStatus = 'IDLE';
        msg.state.filtersData.branches = [
          {
            value: 2165529378315486700,
            label: 'McDonald Manial',
          },
        ];
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = initializeFilterDoneMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 0;
        msg.state.tableData.list = [
          {
            id: 2165529378315486700,
            branchLabel: localizationService.localize('KFC'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime(
              '2018-09-05 21:04:53'
            ).toDatetimeString(),
            customerOrderId: '#AX7F8W',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CASH.toString()
            ),
            timeToAccept: 'less than a minute ago',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: '123',
          },
        ];
        return msg;
      })();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const ordersListingMockPromise = wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'status',
                  operator: 'in',
                  value: ['REQUESTED'],
                },
                {
                  field: 'pickups.vendorId',
                  operator: 'eq',
                  value: 123,
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
            skip: 100,
            limit: 50,
          },
        },
      })
      .response({ status: 200, body: ordersListV2ResponseStub() });

    const branchesListingMockPromise = wiremock
      .stub<ConsumerB2CBranchesListRequest, ConsumerB2CBranchesListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'vendorId',
                  operator: 'eq',
                  value: 123,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: consumerB2cBranchesListResponseStub(),
      });

    saveTokenPromise
      .then(() => {
        Promise.all([ordersListingMockPromise, branchesListingMockPromise])
          .then(() => {
            const messages: SupervisorAllOrdersListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
              .pipe(take(6))
              .subscribe({
                next: (message: SupervisorAllOrdersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    defaultMessage,
                    'first message'
                  );
                  expect(messages[1]).deep.equal(
                    initializeLoadingMessage,
                    'second message'
                  );
                  expect(messages[2]).deep.equal(
                    initializeTableLoadingMessage,
                    'third message'
                  );
                  expect(messages[3]).deep.equal(
                    initializeFilterLoadingMessage,
                    'forth message'
                  );
                  expect(messages[4]).deep.equal(
                    initializeFilterDoneMessage,
                    'fifth message'
                  );
                  expect(messages[5]).deep.equal(
                    initializeTableDoneMessage,
                    'sixth message'
                  );

                  expect(routerService.route).deep.equal({
                    name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
                    query: {
                      q: JSON.stringify({
                        skip: 100,
                        limit: 50,
                        filter: {
                          statuses: [OrderStatus.REQUESTED.valueOf()],
                        },
                        sort: { creationDate: 'asc' },
                      }),
                    },
                  });
                  done();
                },
              });

            bloc.inbox().next(
              new SupervisorAllOrdersListAction({
                type: 'INITIALIZE',
                payload: {
                  filters: {
                    statuses: [OrderStatus.REQUESTED.valueOf()],
                  },
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
      })
      .catch((err: Error) => {
        throw err;
      });
  });

  it('Should load orders with given (sort/filter/skip/limit) successfully', function (done) {
    const defaultMessage = new SupervisorAllOrdersListMessage();
    const loadOrdersMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {
            skip: 100,
            limit: 50,
            filters: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.filters = {
          statuses: [OrderStatus.REQUESTED.valueOf()],
        };
        msg.state.tableData.skip = 100;
        msg.state.tableData.limit = 50;
        msg.state.sort = { creationDate: 'asc' };
        return msg;
      })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): SupervisorAllOrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 0;
        msg.state.tableData.list = [
          {
            id: 2165529378315486700,
            branchLabel: localizationService.localize('KFC'),
            status: localizationService.localize(OrderStatus.REQUESTED),
            creationDate: new Datetime(
              '2018-09-05 21:04:53'
            ).toDatetimeString(),
            customerOrderId: '#AX7F8W',
            scheduledTo: '....',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CASH.toString()
            ),
            timeToAccept: 'less than a minute ago',
            assignedAgent: 'example@example.com',
            numberOfItems: 1,
            vendorOrderId: '123',
          },
        ];
        return msg;
      })();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const ordersListingMockPromise = wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'status',
                  operator: 'in',
                  value: ['REQUESTED'],
                },
                {
                  field: 'pickups.vendorId',
                  operator: 'eq',
                  value: 123,
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
            skip: 100,
            limit: 50,
          },
        },
      })
      .response({ status: 200, body: ordersListV2ResponseStub() });

    saveTokenPromise
      .then(() => {
        Promise.all([ordersListingMockPromise])
          .then(() => {
            const messages: SupervisorAllOrdersListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAllOrdersListMessage>)
              .pipe(take(4))
              .subscribe({
                next: (message: SupervisorAllOrdersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    defaultMessage,
                    'first message'
                  );
                  expect(messages[1]).deep.equal(
                    loadOrdersMessage,
                    'second message'
                  );
                  expect(messages[2]).deep.equal(
                    loadOrdersTableLoadingMessage,
                    'third message'
                  );
                  expect(messages[3]).deep.equal(
                    loadOrdersTableDoneMessage,
                    'forth message'
                  );

                  expect(routerService.route).deep.equal({
                    name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
                    query: {
                      q: JSON.stringify({
                        skip: 100,
                        limit: 50,
                        filter: {
                          statuses: [OrderStatus.REQUESTED.valueOf()],
                        },
                        sort: { creationDate: 'asc' },
                      }),
                    },
                  });
                  done();
                },
              });

            bloc.inbox().next(
              new SupervisorAllOrdersListAction({
                type: 'LOAD_ORDERS',
                payload: {
                  filters: {
                    statuses: [OrderStatus.REQUESTED.valueOf()],
                  },
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
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
