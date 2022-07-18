import { BaseMessage } from '@survv/commons/core/base/BaseMessage';

export class SupervisorBranchesListAction {
  type: SupervisorBranchesListActionType = 'NONE';
  payload?: SupervisorBranchesListActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: SupervisorBranchesListActionType;
    payload?: SupervisorBranchesListActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class SupervisorBranchesListMessage extends BaseMessage {
  tableStatus: SupervisorBranchesListStatus = 'IDLE';
  formStatus: SupervisorBranchesListFormStatus = 'CLOSED';
  state: SupervisorBranchesListState = {
    list: [],
    form: {
      status: '',
    },
    currentBranch: {
      id: 0,
      label: '',
    },
    skip: 0,
    limit: 25,
    totalItemsCount: 0,
    sort: {
      branchLabel: 'desc',
    },
    filtersData: {
      statusList: [],
    },
    filter: {},
  };

  action: SupervisorBranchesListAction = { type: 'NONE', payload: {} };
}

type SupervisorBranchesListActionType = string &
  (
    | 'INITIALIZE'
    | 'FETCH_BRANCHES'
    | 'UPDATE_BRANCH_STATUS'
    | 'OPEN_FORM'
    | 'CLOSE_FORM'
    | 'NAVIGATE_TO_BRANCH_CATALOGUES'
    | 'NONE'
  );

export type SupervisorBranchesListStatus = string &
  ('LOADING' | 'IDLE' | 'PROBLEMATIC');

export type SupervisorBranchesListFormStatus = string & ('OPENED' | 'CLOSED');

interface SupervisorBranchesListState {
  list: {
    id: number;
    label: string;
    status: string;
  }[];
  form: {
    status: string;
  };
  currentBranch: {
    id: number;
    label: string;
  };
  skip: number;
  limit: number;
  totalItemsCount: number;
  sort: {
    branchLabel?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
  };
  filtersData: {
    statusList: { label: string; value: string }[];
  };
  filter: {
    branchLabel?: string[];
    statuses?: string[];
  };
}

interface SupervisorBranchesListActionPayload {
  branchId?: number;
  label?: string;
  form?: {
    status?: string;
  };
  skip?: number;
  limit?: number;
  sort?: {
    branchLabel?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
  };
  filter?: {
    branchLabel?: string[];
    statuses?: string[];
  };
}
