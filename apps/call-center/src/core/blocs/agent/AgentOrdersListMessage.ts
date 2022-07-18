import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class AgentOrdersListAction {
  type: AgentOrdersListActionType = 'NONE';

  constructor({ type }: { type: AgentOrdersListActionType }) {
    this.type = type;
  }
}

export class AgentOrdersListMessage extends BaseMessage {
  queuedOrdersStatus: AgentOrdersListTableStatus = 'IDLE';
  workingOrdersStatus: AgentOrdersListTableStatus = 'IDLE';
  scheduledOrdersStatus: AgentOrdersListTableStatus = 'IDLE';
  state: AgentOrdersListState = {
    queuedOrders: [],
    workingOrders: [],
    scheduledOrders: [],
  };

  action: AgentOrdersListAction = { type: 'NONE' };
}

type AgentOrdersListActionType = string &
  ('INITIALIZE' | 'FETCH_ORDERS' | 'NONE');

type AgentOrdersListTableStatus = string & ('IDLE' | 'LOADING' | 'ERROR');

interface AgentOrdersListState {
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
