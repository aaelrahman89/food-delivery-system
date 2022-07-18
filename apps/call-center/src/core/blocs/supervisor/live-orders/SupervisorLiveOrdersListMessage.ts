import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class SupervisorOrdersListAction {
  type: SupervisorOrdersListActionType = 'NONE';

  constructor({ type }: { type: SupervisorOrdersListActionType }) {
    this.type = type;
  }
}

export class SupervisorLiveOrdersListMessage extends BaseMessage {
  queuedOrdersStatus: SupervisorOrdersListTableStatus = 'IDLE';
  workingOrdersStatus: SupervisorOrdersListTableStatus = 'IDLE';
  scheduledOrdersStatus: SupervisorOrdersListTableStatus = 'IDLE';
  state: SupervisorOrdersListState = {
    queuedOrders: [],
    workingOrders: [],
    scheduledOrders: [],
  };

  action: SupervisorOrdersListAction = { type: 'NONE' };
}

type SupervisorOrdersListActionType = string &
  ('INITIALIZE' | 'FETCH_ORDERS' | 'NONE');

type SupervisorOrdersListTableStatus = string & ('IDLE' | 'LOADING' | 'ERROR');

interface SupervisorOrdersListState {
  queuedOrders: {
    id: number;
    customerOrderId: string;
    requestedSince: string;
    branch: string;
    itemsCount: number;
    total: string;
    scheduled: boolean;
    scheduledTo: string;
  }[];
  workingOrders: {
    id: number;
    customerOrderId: string;
    requestedSince: string;
    branch: string;
    itemsCount: number;
    total: string;
    scheduled: boolean;
    scheduledTo: string;
  }[];
  scheduledOrders: {
    id: number;
    customerOrderId: string;
    requestedSince: string;
    branch: string;
    itemsCount: number;
    total: string;
    scheduled: boolean;
    scheduledTo: string;
  }[];
}
