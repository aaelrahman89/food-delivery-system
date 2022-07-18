import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class SupervisorAllOrdersListAction {
  type: Action = 'NONE';
  payload: OrdersListActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: Action;
    payload: OrdersListActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class SupervisorAllOrdersListMessage extends BaseMessage {
  status: Status = 'IDLE';
  tableStatus: Status = 'IDLE';
  filtersStatus: Status = 'IDLE';
  state: OrdersListState = {
    tableData: {
      list: [],
      skip: 0,
      limit: 10,
      totalItemsCount: 0,
    },
    sort: {
      creationDate: 'desc',
    },
    filtersData: {
      branches: [],
      statusList: [],
    },
    filters: {},
  };

  action: SupervisorAllOrdersListAction = { type: 'NONE', payload: {} };
}

type Action = string &
  (
    | 'INITIALIZE'
    | 'SET_TABLE_LOADING'
    | 'LOAD_ORDERS'
    | 'SET_BRANCH_SELECTOR_LOADING'
    | 'LOAD_BRANCHES'
    | 'NAVIGATE_TO_ORDER_DETAILS'
    | 'NONE'
  );

export type Status = string &
  ('LOADING' | 'IDLE' | 'PROBLEMATIC' | 'DISCONNECTED');

interface OrdersListState {
  tableData: {
    list: {
      id: number;
      customerOrderId: string;
      branchLabel: string;
      vendorOrderId: string;
      status: string;
      numberOfItems: number;
      scheduledTo: string;
      paymentMethod: string;
      assignedAgent: string;
      timeToAccept: string;
      creationDate: string;
    }[];
    skip: number;
    limit: number;
    totalItemsCount: number;
  };
  sort: {
    customerOrderId?: 'asc' | 'desc';
    branchLabel?: 'asc' | 'desc';
    vendorOrderId?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
    numberOfItems?: 'asc' | 'desc';
    paymentMethod?: 'asc' | 'desc';
    assignedAgent?: 'asc' | 'desc';
    timeToAccept?: 'asc' | 'desc';
    creationDate?: 'asc' | 'desc';
  };
  filtersData: {
    branches: { label: string; value: number }[];
    statusList: { label: string; value: string }[];
  };
  filters: {
    branchIds?: number[];
    customerOrderId?: string;
    vendorOrderId?: string;
    statuses?: string[];
    agent?: string;
    from?: string;
    to?: string;
  };
}

interface OrdersListActionPayload {
  order?: { id: number };
  skip?: number;
  limit?: number;
  sort?: {
    customerOrderId?: 'asc' | 'desc';
    branchLabel?: 'asc' | 'desc';
    vendorOrderId?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
    numberOfItems?: 'asc' | 'desc';
    paymentMethod?: 'asc' | 'desc';
    assignedAgent?: 'asc' | 'desc';
    timeToAccept?: 'asc' | 'desc';
    creationDate?: 'asc' | 'desc';
  };
  filters?: {
    branchIds?: number[];
    customerOrderId?: string;
    vendorOrderId?: string;
    statuses?: string[];
    agent?: string;
    from?: string;
    to?: string;
  };
}
