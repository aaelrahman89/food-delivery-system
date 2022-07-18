import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class OrdersListAction {
  type: Action = 'NONE';
  payload: Payload = {};

  constructor(
    { type, payload }: { type: Action; payload: Payload } = {
      type: 'NONE',
      payload: {},
    }
  ) {
    this.type = type;
    this.payload = payload;
  }
}

export class OrdersListMessage extends BaseMessage {
  status: Status = 'IDLE';
  tableStatus: Status = 'IDLE';
  filtersStatus: Status = 'IDLE';
  state: OrdersListState = {
    orders: [],
    ordersStatusesList: [],
    scheduleSlotsList: [],
    skip: 0,
    limit: 0,
    totalOrdersCount: 0,
    sort: {},
    filter: {},
  };

  action: OrdersListAction = new OrdersListAction();
}

type Action = string &
  (
    | 'INITIALIZE'
    | 'UPDATE_PAGINATION'
    | 'UPDATE_FILTERS'
    | 'UPDATE_SORT'
    | 'NAVIGATE_TO_ORDER_DETAILS'
    | 'NONE'
  );

type Status = string & ('PROCESSING' | 'IDLE' | 'PROBLEMATIC' | 'DISCONNECTED');

interface OrdersListState {
  orders: {
    orderId: number;
    customerOrderId: string;
    status: string;
    scheduledTo: string;
    total: string;
    creationDate: string;
  }[];
  ordersStatusesList: { label: string; value: string }[];
  scheduleSlotsList: { label: string; value: { from: string; to: string } }[];
  skip: number;
  limit: number;
  totalOrdersCount: number;
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

interface Payload {
  orderId?: number;
  skip?: number;
  limit?: number;
  sort?: {
    creationDate?: 'asc' | 'desc';
    total?: 'asc' | 'desc';
    customerOrderId?: 'asc' | 'desc';
  };
  filter?: {
    customerOrderId?: string;
    statuses?: string[];
    scheduled?: { from: string; to: string }[];
    totalFrom?: number;
    totalTo?: number;
    creationDateFrom?: string;
    creationDateTo?: string;
  };
}
