import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class PushNotificationsListAction {
  type: Action = 'NONE';
  payload: PushNotificationsListActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: Action;
    payload: PushNotificationsListActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class PushNotificationsListMessage extends BaseMessage {
  status: Status = 'IDLE';
  tableStatus: Status = 'IDLE';
  state: PushNotificationsListState = {
    tableData: {
      list: [],
      skip: 0,
      limit: 10,
      totalItemsCount: 0,
    },
    sort: {
      creationDate: 'desc',
    },
  };

  action: PushNotificationsListAction = { type: 'NONE', payload: {} };
}

type Action = string &
  (
    | 'INITIALIZE'
    | 'SET_TABLE_LOADING'
    | 'LOAD_PUSH_NOTIFICATIONS'
    | 'NAVIGATE_TO_PUSH_NOTIFICATION_CREATION'
    | 'NONE'
  );

export type Status = string &
  ('LOADING' | 'IDLE' | 'PROBLEMATIC' | 'DISCONNECTED');

interface PushNotificationsListState {
  tableData: {
    list: {
      id: number;
      header: string;
      message: string;
      creationDate: string;
      createdBy: string;
    }[];
    skip: number;
    limit: number;
    totalItemsCount: number;
  };
  sort: {
    creationDate?: 'asc' | 'desc';
  };
}

interface PushNotificationsListActionPayload {
  order?: { type: string; id: number };
  skip?: number;
  limit?: number;
  sort?: {
    creationDate?: 'asc' | 'desc';
  };
}
