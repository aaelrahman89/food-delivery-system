import {
  AgentOrdersListAction,
  AgentOrdersListMessage,
} from '../../../../../src/core/blocs/agent/AgentOrdersListMessage';
import { Currency, Money } from '@survv/commons/core/models/money';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { Order } from '../../../../../src/core/models/Order';
import { OrdersListV2Response } from '@survv/api/definitions/orders';
import { Time } from '@survv/commons/core/models/Time';
import { mapOrdersListV2ResponseToOrders } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { ordersListV2ResponseStub } from '@survv/api/stubs/orders';

export function itemsListOrders(): ItemsList<Order> {
  const ordersRepoResponse = mapOrdersListV2ResponseToOrders(
    ordersListV2ResponseStub()
  );
  ordersRepoResponse.items[0].id = 123;
  ordersRepoResponse.items[0].customerOrderId = new CustomerOrderId('GH65');
  ordersRepoResponse.items[0].branchLabel = 'KFC';
  ordersRepoResponse.items[0].total = new Money({
    amount: 10,
    currency: 'EGP',
  });
  ordersRepoResponse.items[0].scheduled = false;
  ordersRepoResponse.items[0].scheduledTo = new HoursRange({
    from: new Time('10:00:00'),
    to: new Time('11:00:00'),
  });
  ordersRepoResponse.items[0].creationDate = new Datetime(
    '2021-01-01T10:00:00.000Z'
  );
  ordersRepoResponse.items[1] = {
    ...ordersRepoResponse.items[0],
    id: 456,
    customerOrderId: new CustomerOrderId('JF12'),
    branchLabel: 'Pizza Hut',
    total: new Money({
      amount: 20,
      currency: 'EGP',
    }),
    scheduled: true,
    scheduledTo: new HoursRange({
      from: new Time('20:00:00'),
      to: new Time('21:00:00'),
    }),
    creationDate: new Datetime('2021-01-15T10:00:00.000Z'),
  };
  return ordersRepoResponse;
}

export function initializeActionMessages(
  localizationService: LocalizationService
): {
  inCaseFetchingOrdersSucceeded: () => SuccessfulInitializeActionMessages;
  inCaseFetchingOrdersFailed: () => InitializeActionFailedFetchingTasksMessages;
} {
  return {
    inCaseFetchingOrdersSucceeded: (): SuccessfulInitializeActionMessages => {
      const defaultMessage = new AgentOrdersListMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): AgentOrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new AgentOrdersListAction({
            type: 'INITIALIZE',
          });
          msg.queuedOrdersStatus = 'LOADING';
          msg.workingOrdersStatus = 'LOADING';
          msg.scheduledOrdersStatus = 'LOADING';
          return msg;
        })();
      const initializeQueuedOrdersDoneMessage =
        (function constructInitializeDoneMessage(): AgentOrdersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.queuedOrdersStatus = 'IDLE';
          msg.state.queuedOrders = [
            {
              id: 123,
              customerOrderId: new CustomerOrderId('GH65').toString(),
              requestedSince: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'KFC',
              itemsCount: 1,
              total: `10.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: false,
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
            },
            {
              id: 456,
              customerOrderId: new CustomerOrderId('JF12').toString(),
              requestedSince: new Datetime(
                '2021-01-15T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'Pizza Hut',
              itemsCount: 1,
              total: `20.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: true,
              scheduledTo: new HoursRange({
                from: new Time('20:00:00'),
                to: new Time('21:00:00'),
              }).toString(),
            },
          ];
          return msg;
        })();
      const initializeWorkingOrdersDoneMessage =
        (function constructInitializeDoneMessage(): AgentOrdersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.workingOrdersStatus = 'IDLE';
          msg.state.workingOrders = [
            {
              id: 123,
              customerOrderId: new CustomerOrderId('GH65').toString(),
              requestedSince: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'KFC',
              itemsCount: 1,
              total: `10.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: false,
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
            },
            {
              id: 456,
              customerOrderId: new CustomerOrderId('JF12').toString(),
              requestedSince: new Datetime(
                '2021-01-15T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'Pizza Hut',
              itemsCount: 1,
              total: `20.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: true,
              scheduledTo: new HoursRange({
                from: new Time('20:00:00'),
                to: new Time('21:00:00'),
              }).toString(),
            },
          ];
          return msg;
        })();
      const initializeScheduledOrdersDoneMessage =
        (function constructInitializeDoneMessage(): AgentOrdersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.scheduledOrdersStatus = 'IDLE';
          msg.state.scheduledOrders = [
            {
              id: 123,
              customerOrderId: new CustomerOrderId('GH65').toString(),
              requestedSince: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'KFC',
              itemsCount: 1,
              total: `10.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: false,
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
            },
            {
              id: 456,
              customerOrderId: new CustomerOrderId('JF12').toString(),
              requestedSince: new Datetime(
                '2021-01-15T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'Pizza Hut',
              itemsCount: 1,
              total: `20.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: true,
              scheduledTo: new HoursRange({
                from: new Time('20:00:00'),
                to: new Time('21:00:00'),
              }).toString(),
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeQueuedOrdersDoneMessage,
        initializeWorkingOrdersDoneMessage,
        initializeScheduledOrdersDoneMessage,
      };
    },
    inCaseFetchingOrdersFailed:
      (): InitializeActionFailedFetchingTasksMessages => {
        const defaultMessage = new AgentOrdersListMessage();
        const initializeLoadingMessage =
          (function constructSecondMessage(): AgentOrdersListMessage {
            const msg = defaultMessage.clone();
            msg.action = new AgentOrdersListAction({
              type: 'INITIALIZE',
            });
            msg.queuedOrdersStatus = 'LOADING';
            msg.workingOrdersStatus = 'LOADING';
            msg.scheduledOrdersStatus = 'LOADING';
            return msg;
          })();
        const initializeQueuedOrdersProblematicMessage =
          (function constructThirdMessage(): AgentOrdersListMessage {
            const msg = initializeLoadingMessage.clone();
            msg.queuedOrdersStatus = 'ERROR';
            return msg;
          })();
        const initializeWorkingOrdersProblematicMessage =
          (function constructThirdMessage(): AgentOrdersListMessage {
            const msg = initializeLoadingMessage.clone();
            msg.workingOrdersStatus = 'ERROR';
            return msg;
          })();
        const initializeScheduledOrdersProblematicMessage =
          (function constructThirdMessage(): AgentOrdersListMessage {
            const msg = initializeLoadingMessage.clone();
            msg.scheduledOrdersStatus = 'ERROR';
            return msg;
          })();

        return {
          defaultMessage,
          initializeLoadingMessage,
          initializeQueuedOrdersProblematicMessage,
          initializeWorkingOrdersProblematicMessage,
          initializeScheduledOrdersProblematicMessage,
        };
      },
  };
}

export function fetchOrdersActionMessages(
  localizationService: LocalizationService
): {
  inCaseFetchingOrdersSucceeded: () => SuccessfulFetchOrdersActionMessages;
  inCaseFetchingOrdersFailed: () => FetchOrdersActionFailedFetchingTasksMessages;
} {
  return {
    inCaseFetchingOrdersSucceeded: (): SuccessfulFetchOrdersActionMessages => {
      const defaultMessage = new AgentOrdersListMessage();
      const fetchOrdersLoadingMessage =
        (function constructInitializeLoadingMessage(): AgentOrdersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new AgentOrdersListAction({
            type: 'FETCH_ORDERS',
          });
          msg.queuedOrdersStatus = 'LOADING';
          msg.workingOrdersStatus = 'LOADING';
          msg.scheduledOrdersStatus = 'LOADING';
          return msg;
        })();
      const fetchOrdersQueuedOrdersDoneMessage =
        (function constructInitializeDoneMessage(): AgentOrdersListMessage {
          const msg = fetchOrdersLoadingMessage.clone();
          msg.queuedOrdersStatus = 'IDLE';
          msg.state.queuedOrders = [
            {
              id: 123,
              customerOrderId: new CustomerOrderId('GH65').toString(),
              requestedSince: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'KFC',
              itemsCount: 1,
              total: `10.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: false,
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
            },
            {
              id: 456,
              customerOrderId: new CustomerOrderId('JF12').toString(),
              requestedSince: new Datetime(
                '2021-01-15T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'Pizza Hut',
              itemsCount: 1,
              total: `20.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: true,
              scheduledTo: new HoursRange({
                from: new Time('20:00:00'),
                to: new Time('21:00:00'),
              }).toString(),
            },
          ];
          return msg;
        })();
      const fetchOrdersWorkingOrdersDoneMessage =
        (function constructInitializeDoneMessage(): AgentOrdersListMessage {
          const msg = fetchOrdersLoadingMessage.clone();
          msg.workingOrdersStatus = 'IDLE';
          msg.state.workingOrders = [
            {
              id: 123,
              customerOrderId: new CustomerOrderId('GH65').toString(),
              requestedSince: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'KFC',
              itemsCount: 1,
              total: `10.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: false,
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
            },
            {
              id: 456,
              customerOrderId: new CustomerOrderId('JF12').toString(),
              requestedSince: new Datetime(
                '2021-01-15T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'Pizza Hut',
              itemsCount: 1,
              total: `20.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: true,
              scheduledTo: new HoursRange({
                from: new Time('20:00:00'),
                to: new Time('21:00:00'),
              }).toString(),
            },
          ];
          return msg;
        })();
      const fetchOrdersScheduledOrdersDoneMessage =
        (function constructInitializeDoneMessage(): AgentOrdersListMessage {
          const msg = fetchOrdersLoadingMessage.clone();
          msg.scheduledOrdersStatus = 'IDLE';
          msg.state.scheduledOrders = [
            {
              id: 123,
              customerOrderId: new CustomerOrderId('GH65').toString(),
              requestedSince: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'KFC',
              itemsCount: 1,
              total: `10.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: false,
              scheduledTo: new HoursRange({
                from: new Time('10:00:00'),
                to: new Time('11:00:00'),
              }).toString(),
            },
            {
              id: 456,
              customerOrderId: new CustomerOrderId('JF12').toString(),
              requestedSince: new Datetime(
                '2021-01-15T10:00:00.000Z'
              ).humanizeElapsedTime(),
              branch: 'Pizza Hut',
              itemsCount: 1,
              total: `20.00 ${localizationService.localize(
                new Currency('EGP').toString()
              )}`,
              scheduled: true,
              scheduledTo: new HoursRange({
                from: new Time('20:00:00'),
                to: new Time('21:00:00'),
              }).toString(),
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        fetchOrdersLoadingMessage,
        fetchOrdersQueuedOrdersDoneMessage,
        fetchOrdersWorkingOrdersDoneMessage,
        fetchOrdersScheduledOrdersDoneMessage,
      };
    },
    inCaseFetchingOrdersFailed:
      (): FetchOrdersActionFailedFetchingTasksMessages => {
        const defaultMessage = new AgentOrdersListMessage();
        const fetchOrdersLoadingMessage =
          (function constructSecondMessage(): AgentOrdersListMessage {
            const msg = defaultMessage.clone();
            msg.action = new AgentOrdersListAction({
              type: 'FETCH_ORDERS',
            });
            msg.queuedOrdersStatus = 'LOADING';
            msg.workingOrdersStatus = 'LOADING';
            msg.scheduledOrdersStatus = 'LOADING';
            return msg;
          })();
        const fetchOrdersQueuedOrdersProblematicMessage =
          (function constructThirdMessage(): AgentOrdersListMessage {
            const msg = fetchOrdersLoadingMessage.clone();
            msg.queuedOrdersStatus = 'ERROR';
            return msg;
          })();
        const fetchOrdersWorkingOrdersProblematicMessage =
          (function constructThirdMessage(): AgentOrdersListMessage {
            const msg = fetchOrdersLoadingMessage.clone();
            msg.workingOrdersStatus = 'ERROR';
            return msg;
          })();
        const fetchOrdersScheduledOrdersProblematicMessage =
          (function constructThirdMessage(): AgentOrdersListMessage {
            const msg = fetchOrdersLoadingMessage.clone();
            msg.scheduledOrdersStatus = 'ERROR';
            return msg;
          })();

        return {
          defaultMessage,
          fetchOrdersLoadingMessage,
          fetchOrdersQueuedOrdersProblematicMessage,
          fetchOrdersWorkingOrdersProblematicMessage,
          fetchOrdersScheduledOrdersProblematicMessage,
        };
      },
  };
}

export function listOrdersBackendResponseStub(): OrdersListV2Response {
  const listOrdersStubbedResponse = ordersListV2ResponseStub();
  listOrdersStubbedResponse.metadata.totalCount = 2;
  listOrdersStubbedResponse.orders[0] = {
    ...listOrdersStubbedResponse.orders[0],
    orderId: 123,
    customerOrderId: 'GH65',
    branchLabel: 'KFC',
    items: [
      {
        itemId: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        price: 75.5,
        quantity: 5,
        notes: 'KFC',
        options: [
          {
            optionId: 2165529378315486700,
            selections: [
              {
                selectionId: 2165529378315486700,
                price: 75.5,
              },
            ],
          },
        ],
      },
    ],
    total: 10,
    scheduled: false,
    scheduledTo: {
      from: '10:00:00',
      to: '11:00:00',
    },
    creationDate: '2021-01-01T10:00:00.000Z',
  };
  listOrdersStubbedResponse.orders[1] = {
    ...listOrdersStubbedResponse.orders[0],
    orderId: 456,
    customerOrderId: 'JF12',
    branchLabel: 'Pizza Hut',
    items: [
      {
        itemId: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        price: 75.5,
        quantity: 5,
        notes: 'KFC',
        options: [
          {
            optionId: 2165529378315486700,
            selections: [
              {
                selectionId: 2165529378315486700,
                price: 75.5,
              },
            ],
          },
        ],
      },
    ],
    total: 20,
    scheduled: true,
    scheduledTo: {
      from: '20:00:00',
      to: '21:00:00',
    },
    creationDate: '2021-01-15T10:00:00.000Z',
  };
  return listOrdersStubbedResponse;
}

interface SuccessfulInitializeActionMessages {
  defaultMessage: AgentOrdersListMessage;
  initializeLoadingMessage: AgentOrdersListMessage;
  initializeQueuedOrdersDoneMessage: AgentOrdersListMessage;
  initializeWorkingOrdersDoneMessage: AgentOrdersListMessage;
  initializeScheduledOrdersDoneMessage: AgentOrdersListMessage;
}
interface InitializeActionFailedFetchingTasksMessages {
  defaultMessage: AgentOrdersListMessage;
  initializeLoadingMessage: AgentOrdersListMessage;
  initializeQueuedOrdersProblematicMessage: AgentOrdersListMessage;
  initializeWorkingOrdersProblematicMessage: AgentOrdersListMessage;
  initializeScheduledOrdersProblematicMessage: AgentOrdersListMessage;
}
interface SuccessfulFetchOrdersActionMessages {
  defaultMessage: AgentOrdersListMessage;
  fetchOrdersLoadingMessage: AgentOrdersListMessage;
  fetchOrdersQueuedOrdersDoneMessage: AgentOrdersListMessage;
  fetchOrdersWorkingOrdersDoneMessage: AgentOrdersListMessage;
  fetchOrdersScheduledOrdersDoneMessage: AgentOrdersListMessage;
}
interface FetchOrdersActionFailedFetchingTasksMessages {
  defaultMessage: AgentOrdersListMessage;
  fetchOrdersLoadingMessage: AgentOrdersListMessage;
  fetchOrdersQueuedOrdersProblematicMessage: AgentOrdersListMessage;
  fetchOrdersWorkingOrdersProblematicMessage: AgentOrdersListMessage;
  fetchOrdersScheduledOrdersProblematicMessage: AgentOrdersListMessage;
}
