import { $sb } from '@survv/commons/test/utils/sandbox';
import { Branch } from '../../../../../../src/core/models/Branch';
import {
  BranchesListV2Request,
  BranchesListV2Response,
} from '@survv/api/definitions/branches';
import { BranchesRepoImpl } from '../../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { Currency, Money } from '@survv/commons/core/models/money';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { Duration, TimeUnits } from '@survv/commons/core/models/Duration';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Observable } from 'rxjs';
import {
  Order,
  OrderItem,
  OrderPaymentMethod,
  OrderStatus,
} from '../../../../../../src/core/models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrderingSystem } from '@survv/commons/core/models/OrderingSystem';
import {
  OrdersListAction,
  OrdersListMessage,
} from '../../../../../../src/core/blocs/orders/orders-list/OrdersListMessage';
import { OrdersListBloc } from '../../../../../../src/core/blocs/orders/orders-list/OrdersListBloc';
import {
  OrdersListV2Request,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { OrdersRepoImpl } from '../../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { PromoCode } from '../../../../../../src/core/models/Promotion';
import { ROUTE_NAMES } from '../../../../../../src/core/routes/routeNames';
import { ReferralCode } from '../../../../../../src/core/models/Referral';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import { Time } from '@survv/commons/core/models/Time';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchesListV2ResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { expect } from 'chai';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { ordersListV2ResponseStub } from '@survv/api/stubs/orders';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrdersListBloc Unit Tests', function () {
  let bloc: OrdersListBloc;
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
          change: new Money({ amount: 10, currency: 'EGP' }),
          consumedBalance: new Money({ amount: 10, currency: 'EGP' }),
          lastStatusUpdateDate: new Datetime('2021-1-1'),
          lastStatusUpdateDuration: new Duration({
            value: 30000,
            timeUnit: TimeUnits.SECONDS,
            compact: false,
          }),
          orderingSystem: OrderingSystem.CALL_CENTER_DASHBOARD,
          pickupCount: 2,
          scheduledTo: new HoursRange({
            from: new Time('00:00:00'),
            to: new Time('00:00:00'),
          }),
          type: OrderType.C2C,
          creationDate: new Datetime('2021-1-1'),
          promoCode: new PromoCode(),
          referralCode: new ReferralCode(),
          subTotal: new Money({ amount: 10, currency: 'EGP' }),
          tax: new Money({ amount: 10, currency: 'EGP' }),
          deliveryFees: new Money({
            amount: 10,
            currency: 'EGP',
          }),
          totalDueAmount: new Money({ amount: 10, currency: 'EGP' }),
          returnedChange: new Money({ amount: 10, currency: 'EGP' }),
          discountAmount: new Money(),
          cashbackAmount: new Money(),
          deliveryFeesDiscountAmount: new Money(),
          notes: '',
          fakeVendor: false,
          branchId: 1,
          vendorId: 2,
          scheduled: false,
          vendorDisplayName: new MultilingualString({
            en: 'title_en',
            ar: 'title_ar',
          }),
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
        vendorLabel: 'Label',
        label: 'Label',
      }),
    ];
    $sb
      .stub(BranchesRepoImpl.prototype, 'listBranches')
      .resolves(listBranchesStubResponse);
  }

  beforeEach(() => {
    bloc = new OrdersListBloc({
      ordersRepo: new OrdersRepoImpl(),
      branchesRepo: new BranchesRepoImpl(),
      notificationService,
      localizationService,
      routerService,
    });
  });

  it('Should initialize with given (sort/filter/skip/limit) successfully', function (done) {
    stubListOrders();
    stubListBranches();

    const defaultMessage = new OrdersListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new OrdersListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            filters: {
              status: OrderStatus.REQUESTED.valueOf(),
            },
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.filters = {
          status: OrderStatus.REQUESTED.valueOf(),
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
              OrderStatus.ASSIGNED.toString()
            ),
            value: OrderStatus.ASSIGNED.valueOf(),
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
        msg.state.filtersData.scheduledList = [
          {
            label: '02:00 AM - 03:00 AM',
            value: {
              from: '00:00:00',
              to: '01:00:00',
            },
          },
          {
            label: '03:00 AM - 04:00 AM',
            value: {
              from: '01:00:00',
              to: '02:00:00',
            },
          },
          {
            label: '04:00 AM - 05:00 AM',
            value: {
              from: '02:00:00',
              to: '03:00:00',
            },
          },
          {
            label: '05:00 AM - 06:00 AM',
            value: {
              from: '03:00:00',
              to: '04:00:00',
            },
          },
          {
            label: '06:00 AM - 07:00 AM',
            value: {
              from: '04:00:00',
              to: '05:00:00',
            },
          },
          {
            label: '07:00 AM - 08:00 AM',
            value: {
              from: '05:00:00',
              to: '06:00:00',
            },
          },
          {
            label: '08:00 AM - 09:00 AM',
            value: {
              from: '06:00:00',
              to: '07:00:00',
            },
          },
          {
            label: '09:00 AM - 10:00 AM',
            value: {
              from: '07:00:00',
              to: '08:00:00',
            },
          },
          {
            label: '10:00 AM - 11:00 AM',
            value: {
              from: '08:00:00',
              to: '09:00:00',
            },
          },
          {
            label: '11:00 AM - 12:00 PM',
            value: {
              from: '09:00:00',
              to: '10:00:00',
            },
          },
          {
            label: '12:00 PM - 01:00 PM',
            value: {
              from: '10:00:00',
              to: '11:00:00',
            },
          },
          {
            label: '01:00 PM - 02:00 PM',
            value: {
              from: '11:00:00',
              to: '12:00:00',
            },
          },
          {
            label: '02:00 PM - 03:00 PM',
            value: {
              from: '12:00:00',
              to: '13:00:00',
            },
          },
          {
            label: '03:00 PM - 04:00 PM',
            value: {
              from: '13:00:00',
              to: '14:00:00',
            },
          },
          {
            label: '04:00 PM - 05:00 PM',
            value: {
              from: '14:00:00',
              to: '15:00:00',
            },
          },
          {
            label: '05:00 PM - 06:00 PM',
            value: {
              from: '15:00:00',
              to: '16:00:00',
            },
          },
          {
            label: '06:00 PM - 07:00 PM',
            value: {
              from: '16:00:00',
              to: '17:00:00',
            },
          },
          {
            label: '07:00 PM - 08:00 PM',
            value: {
              from: '17:00:00',
              to: '18:00:00',
            },
          },
          {
            label: '08:00 PM - 09:00 PM',
            value: {
              from: '18:00:00',
              to: '19:00:00',
            },
          },
          {
            label: '09:00 PM - 10:00 PM',
            value: {
              from: '19:00:00',
              to: '20:00:00',
            },
          },
          {
            label: '10:00 PM - 11:00 PM',
            value: {
              from: '20:00:00',
              to: '21:00:00',
            },
          },
          {
            label: '11:00 PM - 12:00 AM',
            value: {
              from: '21:00:00',
              to: '22:00:00',
            },
          },
          {
            label: '12:00 AM - 01:00 AM',
            value: {
              from: '22:00:00',
              to: '23:00:00',
            },
          },
          {
            label: '01:00 AM - 02:00 AM',
            value: {
              from: '23:00:00',
              to: '00:00:00',
            },
          },
        ];
        msg.state.filtersData.orderTypes = [
          {
            value: 'B2C',
            label: localizationService.localize(OrderType.B2C),
          },
          {
            value: 'ERRANDS',
            label: localizationService.localize(OrderType.ERRANDS),
          },
        ];
        return msg;
      })();
    const initializeTableLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.filtersStatus = 'LOADING';
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeFilterLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            type: 'C2C',
            id: 1234,
            orderType: localizationService.localize(OrderType.C2C),
            branchLabel: localizationService.localize('branchLabel'),
            fakeVendor: localizationService.localize('NO'),
            status: OrderStatus.REQUESTED.valueOf(),
            orderingSystem: localizationService.localize(
              OrderingSystem.CALL_CENTER_DASHBOARD.toString()
            ),
            lastStatusUpdateDate: new Datetime('2021-1-1').toDatetimeString(),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            lastStatusUpdateDuration: new Duration({
              value: 30000,
              timeUnit: TimeUnits.SECONDS,
              compact: false,
            }).humanize(),
            customerOrderId: '#1234',
            pickupCount: 2,
            scheduledTo: '....',
            customerMobileNo: '9999999999',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            change: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            consumedBalance: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `20.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
          },
        ];
        return msg;
      })();
    const initializeFilterDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeTableDoneMessage.clone();
        msg.filtersStatus = 'IDLE';
        msg.state.filtersData.branches = [
          {
            id: 1234,
            label: 'Label',
          },
        ];
        return msg;
      })();

    const messages: OrdersListMessage[] = [];
    (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(6)).subscribe({
      next: (message: OrdersListMessage) => {
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
          name: ROUTE_NAMES.ORDERS_LIST,
          query: {
            q: JSON.stringify({
              skip: 100,
              limit: 50,
              filter: {
                status: OrderStatus.REQUESTED.valueOf(),
              },
              sort: { creationDate: 'asc' },
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
          skip: 100,
          limit: 50,
          filters: {
            status: OrderStatus.REQUESTED.valueOf(),
          },
          sort: { creationDate: 'asc' },
        },
      })
    );
  });

  it('should load orders on sort successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new OrdersListMessage();
    const loadOrdersMessage = (function constructMessage(): OrdersListMessage {
      const msg = defaultMessage.clone();
      msg.action = new OrdersListAction({
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
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            type: 'C2C',
            id: 1234,
            orderType: localizationService.localize(OrderType.C2C),
            branchLabel: localizationService.localize('branchLabel'),
            fakeVendor: localizationService.localize('NO'),
            status: OrderStatus.REQUESTED.valueOf(),
            orderingSystem: localizationService.localize(
              OrderingSystem.CALL_CENTER_DASHBOARD.toString()
            ),
            lastStatusUpdateDate: new Datetime('2021-1-1').toDatetimeString(),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            lastStatusUpdateDuration: new Duration({
              value: 30000,
              timeUnit: TimeUnits.SECONDS,
              compact: false,
            }).humanize(),
            customerOrderId: '#1234',
            pickupCount: 2,
            scheduledTo: '....',
            customerMobileNo: '9999999999',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            change: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            consumedBalance: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `20.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
          },
        ];
        return msg;
      })();

    const messages: OrdersListMessage[] = [];
    (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
      next: (message: OrdersListMessage) => {
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
          name: ROUTE_NAMES.ORDERS_LIST,
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
      new OrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          sort: { creationDate: 'asc' },
        },
      })
    );
  });

  it('should load orders on pagination successfully.', function (done) {
    stubListOrders();

    const defaultMessage = new OrdersListMessage();
    const loadOrdersMessage = (function constructMessage(): OrdersListMessage {
      const msg = defaultMessage.clone();
      msg.action = new OrdersListAction({
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
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            type: 'C2C',
            id: 1234,
            orderType: localizationService.localize(OrderType.C2C),
            branchLabel: localizationService.localize('branchLabel'),
            fakeVendor: localizationService.localize('NO'),
            status: OrderStatus.REQUESTED.valueOf(),
            orderingSystem: localizationService.localize(
              OrderingSystem.CALL_CENTER_DASHBOARD.toString()
            ),
            lastStatusUpdateDate: new Datetime('2021-1-1').toDatetimeString(),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            lastStatusUpdateDuration: new Duration({
              value: 30000,
              timeUnit: TimeUnits.SECONDS,
              compact: false,
            }).humanize(),
            customerOrderId: '#1234',
            pickupCount: 2,
            scheduledTo: '....',
            customerMobileNo: '9999999999',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            change: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            consumedBalance: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `20.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
          },
        ];
        return msg;
      })();

    const messages: OrdersListMessage[] = [];
    (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
      next: (message: OrdersListMessage) => {
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
          name: ROUTE_NAMES.ORDERS_LIST,
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
      new OrdersListAction({
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

    const defaultMessage = new OrdersListMessage();
    const loadOrdersMessage = (function constructMessage(): OrdersListMessage {
      const msg = defaultMessage.clone();
      msg.action = new OrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          filters: {
            branchId: 1,
            customerOrderId: '#1234',
            customerMobileNo: '9999999999',
            status: 'REQUESTED',
            scheduledTo: [
              {
                from: '00:00:00',
                to: '01:00:00',
              },
            ],
            from: '2021-07-06T04:00:00.000Z',
            to: '2021-07-06T04:00:00.000Z',
            type: ['C2C'],
          },
        },
      });
      msg.state.filters = {
        branchId: 1,
        customerOrderId: '#1234',
        customerMobileNo: '9999999999',
        status: 'REQUESTED',
        scheduledTo: [
          {
            from: '00:00:00',
            to: '01:00:00',
          },
        ],
        from: '2021-07-06T04:00:00.000Z',
        to: '2021-07-06T04:00:00.000Z',
        type: ['C2C'],
      };
      return msg;
    })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 100;
        msg.state.tableData.list = [
          {
            type: 'C2C',
            id: 1234,
            orderType: localizationService.localize(OrderType.C2C),
            branchLabel: localizationService.localize('branchLabel'),
            fakeVendor: localizationService.localize('NO'),
            status: OrderStatus.REQUESTED.valueOf(),
            orderingSystem: localizationService.localize(
              OrderingSystem.CALL_CENTER_DASHBOARD.toString()
            ),
            lastStatusUpdateDate: new Datetime('2021-1-1').toDatetimeString(),
            creationDate: new Datetime('2021-1-1').toDatetimeString(),
            lastStatusUpdateDuration: new Duration({
              value: 30000,
              timeUnit: TimeUnits.SECONDS,
              compact: false,
            }).humanize(),
            customerOrderId: '#1234',
            pickupCount: 2,
            scheduledTo: '....',
            customerMobileNo: '9999999999',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CREDIT.toString()
            ),
            change: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            consumedBalance: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `20.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
          },
        ];
        return msg;
      })();

    const messages: OrdersListMessage[] = [];
    (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
      next: (message: OrdersListMessage) => {
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
          name: ROUTE_NAMES.ORDERS_LIST,
          query: {
            q: JSON.stringify({
              skip: 0,
              limit: 10,
              filter: {
                branchId: 1,
                customerOrderId: '#1234',
                customerMobileNo: '9999999999',
                status: 'REQUESTED',
                scheduledTo: [
                  {
                    from: '00:00:00',
                    to: '01:00:00',
                  },
                ],
                from: '2021-07-06T04:00:00.000Z',
                to: '2021-07-06T04:00:00.000Z',
                type: ['C2C'],
              },
              sort: { creationDate: 'desc' },
            }),
          },
        });
        done();
      },
    });

    bloc.inbox().next(
      new OrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          filters: {
            branchId: 1,
            customerOrderId: '#1234',
            customerMobileNo: '9999999999',
            status: 'REQUESTED',
            scheduledTo: [
              {
                from: '00:00:00',
                to: '01:00:00',
              },
            ],
            from: '2021-07-06T04:00:00.000Z',
            to: '2021-07-06T04:00:00.000Z',
            type: ['C2C'],
          },
        },
      })
    );
  });

  it('should display errors successfully.', function (done) {
    $sb
      .stub(OrdersRepoImpl.prototype, 'listOrders')
      .rejects(new Error('anything'));

    const defaultMessage = new OrdersListMessage();
    const loadOrdersMessage = (function constructMessage(): OrdersListMessage {
      const msg = defaultMessage.clone();
      msg.action = new OrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {},
      });
      return msg;
    })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersErrorMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.status = 'PROBLEMATIC';
        return msg;
      })();

    const messages: OrdersListMessage[] = [];
    (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(4)).subscribe({
      next: (message: OrdersListMessage) => {
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
        expect(messages[3]).deep.equal(loadOrdersErrorMessage, 'forth message');

        const errModel = errorModel({ code: 'any', message: 'example error' });
        expect(notificationService.notification).deep.equal(
          createNotification(errModel)
        );
        done();
      },
    });

    bloc.inbox().next(
      new OrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {},
      })
    );
  });

  it('should navigate to errand order details successfully.', function (done) {
    const defaultMessage = new OrdersListMessage();
    const orderDetailsMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new OrdersListAction({
          type: 'NAVIGATE_TO_ORDER_DETAILS',
          payload: {
            order: {
              type: 'ERRANDS',
              id: 1234,
            },
          },
        });
        msg.status = 'LOADING';
        return msg;
      })();
    const orderDetailsIdleMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = orderDetailsMessage.clone();
        msg.status = 'IDLE';
        return msg;
      })();

    const messages: OrdersListMessage[] = [];
    (bloc.outbox() as Observable<OrdersListMessage>).pipe(take(3)).subscribe({
      next: (message: OrdersListMessage) => {
        messages.push(message);
      },
      error: (error: Error) => {
        throw error;
      },
      complete: () => {
        expect(messages[0]).deep.equal(defaultMessage, 'first message');
        expect(messages[1]).deep.equal(orderDetailsMessage, 'second message');
        expect(messages[2]).deep.equal(
          orderDetailsIdleMessage,
          'third message'
        );
        expect(routerService.route).deep.equal({
          name: ROUTE_NAMES.ERRAND_ORDER_DETAILS,
          params: { orderId: '1234' },
        });
        done();
      },
    });

    bloc.inbox().next(
      new OrdersListAction({
        type: 'NAVIGATE_TO_ORDER_DETAILS',
        payload: {
          order: {
            type: 'ERRANDS',
            id: 1234,
          },
        },
      })
    );
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

  it('Should initialize with given (sort/filter/skip/limit) successfully', function (done) {
    const defaultMessage = new OrdersListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = defaultMessage.clone();
        msg.action = new OrdersListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            filters: {
              status: OrderStatus.REQUESTED.valueOf(),
            },
            sort: { creationDate: 'asc' },
          },
        });
        msg.state.filters = {
          status: OrderStatus.REQUESTED.valueOf(),
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
              OrderStatus.ASSIGNED.toString()
            ),
            value: OrderStatus.ASSIGNED.valueOf(),
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
        msg.state.filtersData.scheduledList = [
          {
            label: '02:00 AM - 03:00 AM',
            value: {
              from: '00:00:00',
              to: '01:00:00',
            },
          },
          {
            label: '03:00 AM - 04:00 AM',
            value: {
              from: '01:00:00',
              to: '02:00:00',
            },
          },
          {
            label: '04:00 AM - 05:00 AM',
            value: {
              from: '02:00:00',
              to: '03:00:00',
            },
          },
          {
            label: '05:00 AM - 06:00 AM',
            value: {
              from: '03:00:00',
              to: '04:00:00',
            },
          },
          {
            label: '06:00 AM - 07:00 AM',
            value: {
              from: '04:00:00',
              to: '05:00:00',
            },
          },
          {
            label: '07:00 AM - 08:00 AM',
            value: {
              from: '05:00:00',
              to: '06:00:00',
            },
          },
          {
            label: '08:00 AM - 09:00 AM',
            value: {
              from: '06:00:00',
              to: '07:00:00',
            },
          },
          {
            label: '09:00 AM - 10:00 AM',
            value: {
              from: '07:00:00',
              to: '08:00:00',
            },
          },
          {
            label: '10:00 AM - 11:00 AM',
            value: {
              from: '08:00:00',
              to: '09:00:00',
            },
          },
          {
            label: '11:00 AM - 12:00 PM',
            value: {
              from: '09:00:00',
              to: '10:00:00',
            },
          },
          {
            label: '12:00 PM - 01:00 PM',
            value: {
              from: '10:00:00',
              to: '11:00:00',
            },
          },
          {
            label: '01:00 PM - 02:00 PM',
            value: {
              from: '11:00:00',
              to: '12:00:00',
            },
          },
          {
            label: '02:00 PM - 03:00 PM',
            value: {
              from: '12:00:00',
              to: '13:00:00',
            },
          },
          {
            label: '03:00 PM - 04:00 PM',
            value: {
              from: '13:00:00',
              to: '14:00:00',
            },
          },
          {
            label: '04:00 PM - 05:00 PM',
            value: {
              from: '14:00:00',
              to: '15:00:00',
            },
          },
          {
            label: '05:00 PM - 06:00 PM',
            value: {
              from: '15:00:00',
              to: '16:00:00',
            },
          },
          {
            label: '06:00 PM - 07:00 PM',
            value: {
              from: '16:00:00',
              to: '17:00:00',
            },
          },
          {
            label: '07:00 PM - 08:00 PM',
            value: {
              from: '17:00:00',
              to: '18:00:00',
            },
          },
          {
            label: '08:00 PM - 09:00 PM',
            value: {
              from: '18:00:00',
              to: '19:00:00',
            },
          },
          {
            label: '09:00 PM - 10:00 PM',
            value: {
              from: '19:00:00',
              to: '20:00:00',
            },
          },
          {
            label: '10:00 PM - 11:00 PM',
            value: {
              from: '20:00:00',
              to: '21:00:00',
            },
          },
          {
            label: '11:00 PM - 12:00 AM',
            value: {
              from: '21:00:00',
              to: '22:00:00',
            },
          },
          {
            label: '12:00 AM - 01:00 AM',
            value: {
              from: '22:00:00',
              to: '23:00:00',
            },
          },
          {
            label: '01:00 AM - 02:00 AM',
            value: {
              from: '23:00:00',
              to: '00:00:00',
            },
          },
        ];
        msg.state.filtersData.orderTypes = [
          {
            value: 'B2C',
            label: localizationService.localize(OrderType.B2C),
          },
          {
            value: 'ERRANDS',
            label: localizationService.localize(OrderType.ERRANDS),
          },
        ];
        return msg;
      })();
    const initializeTableLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeTableLoadingMessage.clone();
        msg.filtersStatus = 'LOADING';
        return msg;
      })();
    const initializeFilterDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeFilterLoadingMessage.clone();
        msg.filtersStatus = 'IDLE';
        msg.state.filtersData.branches = [
          {
            id: 2165529378315486700,
            label: 'McDonald Manial',
          },
        ];
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = initializeFilterDoneMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 0;
        msg.state.tableData.list = [
          {
            type: 'C2C',
            id: 2165529378315486700,
            orderType: localizationService.localize(OrderType.C2C),
            branchLabel: localizationService.localize('KFC'),
            fakeVendor: localizationService.localize('NO'),
            status: OrderStatus.REQUESTED.valueOf(),
            orderingSystem: localizationService.localize(
              OrderingSystem.FAKE_VENDOR.toString()
            ),
            lastStatusUpdateDate: new Datetime(
              '2018-09-05 21:04:53'
            ).toDatetimeString(),
            creationDate: new Datetime(
              '2018-09-05 21:04:53'
            ).toDatetimeString(),
            lastStatusUpdateDuration: new Duration({
              value: 10,
              timeUnit: TimeUnits.SECONDS,
              compact: false,
            }).humanize(),
            customerOrderId: '#AX7F8W',
            pickupCount: 4,
            scheduledTo: '....',
            customerMobileNo: '01234567890',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CASH.toString()
            ),
            change: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            consumedBalance: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
          },
        ];
        return msg;
      })();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

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
                  operator: 'eq',
                  value: 'REQUESTED',
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
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
      })
      .response({
        status: 200,
        body: branchesListV2ResponseStub(),
      });

    saveTokenPromise
      .then(() => {
        Promise.all([ordersListingMockPromise, branchesListingMockPromise])
          .then(() => {
            const messages: OrdersListMessage[] = [];
            (bloc.outbox() as Observable<OrdersListMessage>)
              .pipe(take(6))
              .subscribe({
                next: (message: OrdersListMessage) => {
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
                    name: ROUTE_NAMES.ORDERS_LIST,
                    query: {
                      q: JSON.stringify({
                        skip: 100,
                        limit: 50,
                        filter: {
                          status: OrderStatus.REQUESTED.valueOf(),
                        },
                        sort: { creationDate: 'asc' },
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
                  filters: {
                    status: OrderStatus.REQUESTED.valueOf(),
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
    const defaultMessage = new OrdersListMessage();
    const loadOrdersMessage = (function constructMessage(): OrdersListMessage {
      const msg = defaultMessage.clone();
      msg.action = new OrdersListAction({
        type: 'LOAD_ORDERS',
        payload: {
          skip: 100,
          limit: 50,
          filters: {
            status: OrderStatus.REQUESTED.valueOf(),
          },
          sort: { creationDate: 'asc' },
        },
      });
      msg.state.filters = {
        status: OrderStatus.REQUESTED.valueOf(),
      };
      msg.state.tableData.skip = 100;
      msg.state.tableData.limit = 50;
      msg.state.sort = { creationDate: 'asc' };
      return msg;
    })();
    const loadOrdersTableLoadingMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersMessage.clone();
        msg.tableStatus = 'LOADING';
        return msg;
      })();
    const loadOrdersTableDoneMessage =
      (function constructMessage(): OrdersListMessage {
        const msg = loadOrdersTableLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.tableData.totalItemsCount = 0;
        msg.state.tableData.list = [
          {
            type: 'C2C',
            id: 2165529378315486700,
            orderType: localizationService.localize(OrderType.C2C),
            branchLabel: localizationService.localize('KFC'),
            fakeVendor: localizationService.localize('NO'),
            status: OrderStatus.REQUESTED.valueOf(),
            orderingSystem: localizationService.localize(
              OrderingSystem.FAKE_VENDOR.toString()
            ),
            lastStatusUpdateDate: new Datetime(
              '2018-09-05 21:04:53'
            ).toDatetimeString(),
            creationDate: new Datetime(
              '2018-09-05 21:04:53'
            ).toDatetimeString(),
            lastStatusUpdateDuration: new Duration({
              value: 10,
              timeUnit: TimeUnits.SECONDS,
              compact: false,
            }).humanize(),
            customerOrderId: '#AX7F8W',
            pickupCount: 4,
            scheduledTo: '....',
            customerMobileNo: '01234567890',
            paymentMethod: localizationService.localize(
              OrderPaymentMethod.CASH.toString()
            ),
            change: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            consumedBalance: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `10.00 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
          },
        ];
        return msg;
      })();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

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
                  operator: 'eq',
                  value: 'REQUESTED',
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
            const messages: OrdersListMessage[] = [];
            (bloc.outbox() as Observable<OrdersListMessage>)
              .pipe(take(4))
              .subscribe({
                next: (message: OrdersListMessage) => {
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
                    name: ROUTE_NAMES.ORDERS_LIST,
                    query: {
                      q: JSON.stringify({
                        skip: 100,
                        limit: 50,
                        filter: {
                          status: OrderStatus.REQUESTED.valueOf(),
                        },
                        sort: { creationDate: 'asc' },
                      }),
                    },
                  });
                  done();
                },
              });

            bloc.inbox().next(
              new OrdersListAction({
                type: 'LOAD_ORDERS',
                payload: {
                  filters: {
                    status: OrderStatus.REQUESTED.valueOf(),
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
