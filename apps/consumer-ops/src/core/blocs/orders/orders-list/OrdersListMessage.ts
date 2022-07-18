import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class OrdersListAction {
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

export class OrdersListMessage extends BaseMessage {
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
      orderTypes: [],
      scheduledList: [],
    },
    filters: {},
  };

  action: OrdersListAction = { type: 'NONE', payload: {} };
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
      type: string;
      orderType: string;
      branchLabel: string;
      fakeVendor: string;
      status: string;
      orderingSystem: string;
      lastStatusUpdateDate: string;
      creationDate: string;
      lastStatusUpdateDuration: string;
      customerOrderId: string;
      pickupCount: number;
      scheduledTo: string;
      customerMobileNo: string;
      paymentMethod: string;
      change: string;
      total: string;
      consumedBalance: string;
    }[];
    skip: number;
    limit: number;
    totalItemsCount: number;
  };
  sort: {
    creationDate?: 'asc' | 'desc';
  };
  filtersData: {
    branches: { label: string; id: number }[];
    statusList: { label: string; value: string }[];
    orderTypes: { label: string; value: string }[];
    scheduledList: { label: string; value: { from: string; to: string } }[];
  };
  filters: {
    branchId?: number;
    customerOrderId?: string;
    customerMobileNo?: string;
    status?: string;
    scheduledTo?: { from: string; to: string }[];
    from?: string;
    to?: string;
    type?: string[];
  };
}

interface OrdersListActionPayload {
  order?: { type: string; id: number };
  skip?: number;
  limit?: number;
  sort?: {
    creationDate?: 'asc' | 'desc';
  };
  filters?: {
    branchId?: number;
    customerOrderId?: string;
    customerMobileNo?: string;
    status?: string;
    scheduledTo?: { from: string; to: string }[];
    from?: string;
    to?: string;
    type?: string[];
  };
}
