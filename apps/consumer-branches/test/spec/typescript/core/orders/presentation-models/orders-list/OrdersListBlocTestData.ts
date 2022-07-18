import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { BranchDetails } from '../../../../../../../src/core/models/Branch';
import { BranchOrdersResponse } from '@survv/api/definitions/branches';
import { Currency, Money } from '@survv/commons/core/models/money';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import {
  Order,
  OrderPaymentMethod,
  OrderStatus,
} from '../../../../../../../src/core/models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import {
  OrdersListAction,
  OrdersListMessage,
} from '../../../../../../../src/core/presentation-models/orders/orders-list/OrdersListMessage';
import { Time } from '@survv/commons/core/models/Time';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { branchOrdersResponseStub } from '@survv/api/stubs/branches';

export function itemsListOrders(): ItemsList<Order> {
  return {
    totalItemsCount: 100,
    items: [
      new Order({
        type: OrderType.B2C,
        id: 1111,
        vendorTaskId: '9077',
        addressId: 2222,
        customerId: 3333,
        vendorId: 4444,
        status: OrderStatus.REQUESTED,
        scheduled: false,
        branchId: 5555,
        customerOrderId: new CustomerOrderId('E3XY4'),
        scheduledTo: new HoursRange(),
        totalWithoutDeliveryFees: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        deliveryFees: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        total: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        subTotal: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        tax: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        notes: '',
        paymentMethod: OrderPaymentMethod.CREDIT,
        isB2C: true,
        isC2C: false,
        creationDate: new Datetime('2021-1-1'),
        lastUpdateDate: new Datetime('2021-1-1'),
        items: [],
        actionDisplay: true,
      }),
      new Order({
        type: OrderType.B2C,
        id: 6666,
        vendorTaskId: '9077',
        addressId: 2222,
        customerId: 3333,
        vendorId: 4444,
        status: OrderStatus.DELIVERED,
        scheduled: true,
        branchId: 5555,
        customerOrderId: new CustomerOrderId('X77Y4'),
        scheduledTo: new HoursRange({
          from: new Time('10:00:00'),
          to: new Time('11:00:00'),
        }),
        totalWithoutDeliveryFees: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        deliveryFees: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        total: new Money({
          amount: 200,
          currency: 'EGP',
        }),
        subTotal: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        tax: new Money({
          amount: 100,
          currency: 'EGP',
        }),
        notes: '',
        paymentMethod: OrderPaymentMethod.CREDIT,
        isB2C: true,
        isC2C: false,
        creationDate: new Datetime('2021-2-2'),
        lastUpdateDate: new Datetime('2021-2-2'),
        items: [],
        actionDisplay: true,
      }),
    ],
  };
}

export function branchDetails(
  vendorType: VendorType = VendorType.FOOD
): BranchDetails {
  return new BranchDetails({
    vendorType,
    label: 'branch',
    vendorId: 222,
    id: 111,
    logo: '/image/123',
    b2cStatus: BranchB2CStatus.AVAILABLE,
  });
}

export function initializeActionMessages(
  localizationService: LocalizationService
): {
  inCaseNoQueryGiven: () => SuccessfulInitializeActionMessages;
  inCaseQueryGiven: (
    query: InitializeActionQuery
  ) => SuccessfulInitializeActionMessages;
  inCaseFetchingOrdersFailed: () => InitializeActionFailedFetchingOrderMessages;
  inCaseFetchingBranchDetailsFailed: () => InitializeActionFailedFetchBranchDetailsMessages;
} {
  return {
    inCaseNoQueryGiven: (): SuccessfulInitializeActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'INITIALIZE',
            payload: {},
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.skip = 0;
          msg.state.limit = 25;
          msg.state.sort = { creationDate: 'desc' };
          msg.state.ordersStatusesList = [
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
          msg.state.scheduleSlotsList = [
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
          return msg;
        })();
      const initializeDoneMessage =
        (function constructInitializeDoneMessage(): OrdersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.totalOrdersCount = 100;
          msg.state.orders = [
            {
              orderId: 1111,
              status: localizationService.localize(
                OrderStatus.REQUESTED.toString()
              ),
              creationDate: new Datetime('2021-1-1').toDatetimeString(),
              customerOrderId: '#E3XY4',
              scheduledTo: '....',
              total: `100.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
            {
              orderId: 6666,
              status: localizationService.localize(
                OrderStatus.DELIVERED.toString()
              ),
              creationDate: new Datetime('2021-2-2').toDatetimeString(),
              customerOrderId: '#X77Y4',
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
              total: `200.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      };
    },
    inCaseQueryGiven: (
      query: InitializeActionQuery
    ): SuccessfulInitializeActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'INITIALIZE',
            payload: {
              ...query,
            },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.skip = query.skip;
          msg.state.limit = query.limit;
          msg.state.sort = query.sort;
          msg.state.filter = query.filter;
          msg.state.ordersStatusesList = [
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
          msg.state.scheduleSlotsList = [
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
          return msg;
        })();
      const initializeDoneMessage =
        (function constructInitializeDoneMessage(): OrdersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.totalOrdersCount = 100;
          msg.state.orders = [
            {
              orderId: 1111,
              status: localizationService.localize(
                OrderStatus.REQUESTED.toString()
              ),
              creationDate: new Datetime('2021-1-1').toDatetimeString(),
              customerOrderId: '#E3XY4',
              scheduledTo: '....',
              total: `100.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
            {
              orderId: 6666,
              status: localizationService.localize(
                OrderStatus.DELIVERED.toString()
              ),
              creationDate: new Datetime('2021-2-2').toDatetimeString(),
              customerOrderId: '#X77Y4',
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
              total: `200.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeDoneMessage,
      };
    },
    inCaseFetchingOrdersFailed:
      (): InitializeActionFailedFetchingOrderMessages => {
        const defaultMessage = new OrdersListMessage();
        const initializeLoadingMessage =
          (function constructSecondMessage(): OrdersListMessage {
            const msg = defaultMessage.clone();
            msg.action = new OrdersListAction({
              type: 'INITIALIZE',
              payload: {},
            });
            msg.tableStatus = 'PROCESSING';
            msg.state.skip = 0;
            msg.state.limit = 25;
            msg.state.sort = { creationDate: 'desc' };
            msg.state.ordersStatusesList = [
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
            msg.state.scheduleSlotsList = [
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
            return msg;
          })();
        const initializeProblematicMessage =
          (function constructThirdMessage(): OrdersListMessage {
            const msg = initializeLoadingMessage.clone();
            msg.tableStatus = 'PROBLEMATIC';
            return msg;
          })();

        return {
          defaultMessage,
          initializeLoadingMessage,
          initializeProblematicMessage,
        };
      },
    inCaseFetchingBranchDetailsFailed:
      (): InitializeActionFailedFetchBranchDetailsMessages => {
        const defaultMessage = new OrdersListMessage();
        const initializeLoadingMessage =
          (function constructSecondMessage(): OrdersListMessage {
            const msg = defaultMessage.clone();
            msg.action = new OrdersListAction({
              type: 'INITIALIZE',
              payload: {},
            });
            msg.tableStatus = 'PROCESSING';
            msg.state.skip = 0;
            msg.state.limit = 25;
            msg.state.sort = { creationDate: 'desc' };
            msg.state.ordersStatusesList = [
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
            msg.state.scheduleSlotsList = [
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
            return msg;
          })();
        const initializeFetchingOrdersDoneMessage =
          (function constructThirdMessage(): OrdersListMessage {
            const msg = initializeLoadingMessage.clone();
            msg.tableStatus = 'IDLE';
            msg.state.totalOrdersCount = 100;
            msg.state.orders = [
              {
                orderId: 1111,
                status: localizationService.localize(
                  OrderStatus.REQUESTED.toString()
                ),
                creationDate: new Datetime('2021-1-1').toDatetimeString(),
                customerOrderId: '#E3XY4',
                scheduledTo: '....',
                total: `100.00 ${localizationService.localize(
                  new Currency('EGP').toString()
                )}`,
              },
              {
                orderId: 6666,
                status: localizationService.localize(
                  OrderStatus.DELIVERED.toString()
                ),
                creationDate: new Datetime('2021-2-2').toDatetimeString(),
                customerOrderId: '#X77Y4',
                scheduledTo: new HoursRange({
                  from: new Time('10:00:00'),
                  to: new Time('11:00:00'),
                }).toString(),
                total: `200.00 ${localizationService.localize(
                  new Currency('EGP').toString()
                )}`,
              },
            ];
            return msg;
          })();
        const initializeProblematicMessage =
          (function constructThirdMessage(): OrdersListMessage {
            const msg = initializeFetchingOrdersDoneMessage.clone();
            msg.tableStatus = 'PROBLEMATIC';
            return msg;
          })();

        return {
          defaultMessage,
          initializeLoadingMessage,
          initializeFetchingOrdersDoneMessage,
          initializeProblematicMessage,
        };
      },
  };
}

export function updatePaginationMessages(
  localizationService: LocalizationService
): {
  inCaseSuccessfulPaginationUpdate: (
    skip: number,
    limit: number
  ) => SuccessfulUpdatePaginationActionMessages;
  inCaseFailedPaginationUpdate: (
    skip: number,
    limit: number
  ) => FailedUpdatePaginationActionMessages;
} {
  return {
    inCaseSuccessfulPaginationUpdate: (
      skip: number,
      limit: number
    ): SuccessfulUpdatePaginationActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const updatePaginationLoadingMessage =
        (function constructSecondMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'UPDATE_PAGINATION',
            payload: {
              skip,
              limit,
            },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.skip = skip;
          msg.state.limit = limit;
          return msg;
        })();
      const updatePaginationDoneMessage =
        (function constructThirdMessage(): OrdersListMessage {
          const msg = updatePaginationLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.totalOrdersCount = 100;
          msg.state.orders = [
            {
              orderId: 1111,
              status: localizationService.localize(
                OrderStatus.REQUESTED.toString()
              ),
              creationDate: new Datetime('2021-1-1').toDatetimeString(),
              customerOrderId: '#E3XY4',
              scheduledTo: '....',
              total: `100.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
            {
              orderId: 6666,
              status: localizationService.localize(
                OrderStatus.DELIVERED.toString()
              ),
              creationDate: new Datetime('2021-2-2').toDatetimeString(),
              customerOrderId: '#X77Y4',
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
              total: `200.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        updatePaginationLoadingMessage,
        updatePaginationDoneMessage,
      };
    },
    inCaseFailedPaginationUpdate: (
      skip: number,
      limit: number
    ): FailedUpdatePaginationActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const updatePaginationLoadingMessage =
        (function constructSecondMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'UPDATE_PAGINATION',
            payload: { skip, limit },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.skip = skip;
          msg.state.limit = limit;
          return msg;
        })();
      const updatePaginationProblematicMessage =
        (function constructThirdMessage(): OrdersListMessage {
          const msg = updatePaginationLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        updatePaginationLoadingMessage,
        updatePaginationProblematicMessage,
      };
    },
  };
}

export function updateFilterMessages(
  localizationService: LocalizationService
): {
  inCaseSuccessfulFilterUpdate: (
    filter: UpdateFilterActionFilter
  ) => SuccessfulUpdateFilterActionMessages;
  inCaseFailedFilterUpdate: (
    filter: UpdateFilterActionFilter
  ) => FailedUpdateFilterActionMessages;
} {
  return {
    inCaseSuccessfulFilterUpdate: (
      filter: UpdateFilterActionFilter
    ): SuccessfulUpdateFilterActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const updateFilterLoadingMessage =
        (function constructSecondMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'UPDATE_FILTERS',
            payload: {
              filter,
            },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.filter = filter;
          return msg;
        })();
      const updateFilterDoneMessage =
        (function constructThirdMessage(): OrdersListMessage {
          const msg = updateFilterLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.totalOrdersCount = 100;
          msg.state.orders = [
            {
              orderId: 1111,
              status: localizationService.localize(
                OrderStatus.REQUESTED.toString()
              ),
              creationDate: new Datetime('2021-1-1').toDatetimeString(),
              customerOrderId: '#E3XY4',
              scheduledTo: '....',
              total: `100.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
            {
              orderId: 6666,
              status: localizationService.localize(
                OrderStatus.DELIVERED.toString()
              ),
              creationDate: new Datetime('2021-2-2').toDatetimeString(),
              customerOrderId: '#X77Y4',
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
              total: `200.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        updateFilterLoadingMessage,
        updateFilterDoneMessage,
      };
    },
    inCaseFailedFilterUpdate: (
      filter: UpdateFilterActionFilter
    ): FailedUpdateFilterActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const updateFilterLoadingMessage =
        (function constructSecondMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'UPDATE_FILTERS',
            payload: { filter },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.filter = filter;
          return msg;
        })();
      const updateFilterProblematicMessage =
        (function constructThirdMessage(): OrdersListMessage {
          const msg = updateFilterLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        updateFilterLoadingMessage,
        updateFilterProblematicMessage,
      };
    },
  };
}

export function updateSortMessages(localizationService: LocalizationService): {
  inCaseSuccessfulSortUpdate: (
    sort: UpdateSortActionSort
  ) => SuccessfulUpdateSortActionMessages;
  inCaseFailedSortUpdate: (
    sort: UpdateSortActionSort
  ) => FailedUpdateSortActionMessages;
} {
  return {
    inCaseSuccessfulSortUpdate: (
      sort: UpdateSortActionSort
    ): SuccessfulUpdateSortActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const updateSortLoadingMessage =
        (function constructSecondMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'UPDATE_SORT',
            payload: {
              sort,
            },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.sort = sort;
          return msg;
        })();
      const updateSortDoneMessage =
        (function constructThirdMessage(): OrdersListMessage {
          const msg = updateSortLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.totalOrdersCount = 100;
          msg.state.orders = [
            {
              orderId: 1111,
              status: localizationService.localize(
                OrderStatus.REQUESTED.toString()
              ),
              creationDate: new Datetime('2021-1-1').toDatetimeString(),
              customerOrderId: '#E3XY4',
              scheduledTo: '....',
              total: `100.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
            {
              orderId: 6666,
              status: localizationService.localize(
                OrderStatus.DELIVERED.toString()
              ),
              creationDate: new Datetime('2021-2-2').toDatetimeString(),
              customerOrderId: '#X77Y4',
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
              total: `200.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        updateSortLoadingMessage,
        updateSortDoneMessage,
      };
    },
    inCaseFailedSortUpdate: (
      sort: UpdateSortActionSort
    ): FailedUpdateSortActionMessages => {
      const defaultMessage = new OrdersListMessage();
      const updateSortLoadingMessage =
        (function constructSecondMessage(): OrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new OrdersListAction({
            type: 'UPDATE_SORT',
            payload: {
              sort,
            },
          });
          msg.tableStatus = 'PROCESSING';
          msg.state.sort = sort;
          return msg;
        })();
      const updateSortProblematicMessage =
        (function constructThirdMessage(): OrdersListMessage {
          const msg = updateSortLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        updateSortLoadingMessage,
        updateSortProblematicMessage,
      };
    },
  };
}

export function navigateToOrderDetailsMessages(): {
  navigateToOrderDetails: (
    initializedMessage: OrdersListMessage,
    orderId: number
  ) => {
    navigationMessage: OrdersListMessage;
  };
} {
  return {
    navigateToOrderDetails: (
      initializedMessage: OrdersListMessage,
      orderId: number
    ): { navigationMessage: OrdersListMessage } => {
      const navigationMessage =
        (function constructFourthMessage(): OrdersListMessage {
          const msg = initializedMessage.clone();
          msg.action = new OrdersListAction({
            type: 'NAVIGATE_TO_ORDER_DETAILS',
            payload: { orderId },
          });
          return msg;
        })();

      return {
        navigationMessage,
      };
    },
  };
}

export function branchOrdersBackendResponseStub(): BranchOrdersResponse {
  const branchOrdersStubbedResponse = branchOrdersResponseStub();
  branchOrdersStubbedResponse.metadata.totalCount = 100;
  branchOrdersStubbedResponse.orders[0] = {
    ...branchOrdersStubbedResponse.orders[0],
    orderId: 1111,
    status: 'REQUESTED',
    customerOrderId: 'E3XY4',
    creationDate: '2020-12-31T22:00:00Z',
    scheduled: false,
    scheduledTo: { from: '', to: '' },
    total: 100.0,
  };
  branchOrdersStubbedResponse.orders[1] = {
    ...branchOrdersStubbedResponse.orders[0],
    orderId: 6666,
    status: 'DELIVERED',
    customerOrderId: 'X77Y4',
    creationDate: '2021-02-01T22:00:00Z',
    scheduled: true,
    scheduledTo: { from: '10:00:00', to: '11:00:00' },
    total: 200.0,
  };
  return branchOrdersStubbedResponse;
}

interface SuccessfulInitializeActionMessages {
  defaultMessage: OrdersListMessage;
  initializeLoadingMessage: OrdersListMessage;
  initializeDoneMessage: OrdersListMessage;
}
interface InitializeActionQuery {
  skip: number;
  limit: number;
  sort: {
    creationDate?: 'asc' | 'desc';
    total?: 'asc' | 'desc';
    customerOrderId?: 'asc' | 'desc';
  };
  filter: {
    customerOrderId?: string;
    statuses?: string[];
    scheduled?: { from: string; to: string }[];
    totalFrom?: number;
    totalTo?: number;
    creationDateFrom?: string;
    creationDateTo?: string;
  };
}
interface InitializeActionFailedFetchingOrderMessages {
  defaultMessage: OrdersListMessage;
  initializeLoadingMessage: OrdersListMessage;
  initializeProblematicMessage: OrdersListMessage;
}
interface InitializeActionFailedFetchBranchDetailsMessages {
  defaultMessage: OrdersListMessage;
  initializeLoadingMessage: OrdersListMessage;
  initializeFetchingOrdersDoneMessage: OrdersListMessage;
  initializeProblematicMessage: OrdersListMessage;
}

interface SuccessfulUpdatePaginationActionMessages {
  defaultMessage: OrdersListMessage;
  updatePaginationLoadingMessage: OrdersListMessage;
  updatePaginationDoneMessage: OrdersListMessage;
}
interface FailedUpdatePaginationActionMessages {
  defaultMessage: OrdersListMessage;
  updatePaginationLoadingMessage: OrdersListMessage;
  updatePaginationProblematicMessage: OrdersListMessage;
}

interface SuccessfulUpdateFilterActionMessages {
  defaultMessage: OrdersListMessage;
  updateFilterLoadingMessage: OrdersListMessage;
  updateFilterDoneMessage: OrdersListMessage;
}
interface FailedUpdateFilterActionMessages {
  defaultMessage: OrdersListMessage;
  updateFilterLoadingMessage: OrdersListMessage;
  updateFilterProblematicMessage: OrdersListMessage;
}
interface UpdateFilterActionFilter {
  customerOrderId?: string;
  statuses?: string[];
  scheduled?: { from: string; to: string }[];
  totalFrom?: number;
  totalTo?: number;
  creationDateFrom?: string;
  creationDateTo?: string;
}

interface SuccessfulUpdateSortActionMessages {
  defaultMessage: OrdersListMessage;
  updateSortLoadingMessage: OrdersListMessage;
  updateSortDoneMessage: OrdersListMessage;
}
interface FailedUpdateSortActionMessages {
  defaultMessage: OrdersListMessage;
  updateSortLoadingMessage: OrdersListMessage;
  updateSortProblematicMessage: OrdersListMessage;
}
interface UpdateSortActionSort {
  creationDate?: 'asc' | 'desc';
  total?: 'asc' | 'desc';
  customerOrderId?: 'asc' | 'desc';
}
