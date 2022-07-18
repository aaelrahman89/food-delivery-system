import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import {
  FormValidationResult,
  isValidEmail,
  required,
} from '@survv/commons/core/validations/form-validators';
import { FormValidator, Validators } from '../../../models/Validators';

export class SupervisorAgentsListAction {
  type: SupervisorAgentsListActionType = 'NONE';
  payload?: SupervisorAgentsListActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: SupervisorAgentsListActionType;
    payload?: SupervisorAgentsListActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class SupervisorAgentsListMessage extends BaseMessage {
  tableStatus: SupervisorAgentsListStatus = 'IDLE';
  dialogStatus: SupervisorAgentsListVisibilityStatus = 'CLOSED';
  updateFormStatus: SupervisorAgentsListVisibilityStatus = 'CLOSED';
  creationFormStatus: SupervisorAgentsListVisibilityStatus = 'CLOSED';
  updateFormButtonStatus: SupervisorAgentsListButtonStatus = 'DISABLED';
  creationFormButtonStatus: SupervisorAgentsListButtonStatus = 'DISABLED';
  state: SupervisorAgentsListState = {
    list: [],
    selectedAgent: {
      id: 0,
      name: '',
      email: '',
      mobileNo: '',
    },
    form: {
      id: 0,
      name: '',
      email: '',
      mobileNo: '',
    },
    skip: 0,
    limit: 25,
    totalItemsCount: 0,
    sort: {
      creationDate: 'desc',
    },
  };

  action: SupervisorAgentsListAction = { type: 'NONE', payload: {} };
  updateValidators(): SupervisorAgentFormValidators {
    return {
      name: (): FormValidationResult => {
        return required(this.state.form.name);
      },
      email: (): FormValidationResult => {
        if (required(this.state.form.email) !== true) {
          return required(this.state.form.email);
        }
        if (isValidEmail(this.state.form.email) !== true) {
          return isValidEmail(this.state.form.email);
        }
        return true;
      },
    };
  }

  creationValidators(): SupervisorAgentFormValidators {
    return {
      name: (): FormValidationResult => {
        return required(this.state.form.name);
      },
      email: (): FormValidationResult => {
        if (required(this.state.form.email) !== true) {
          return required(this.state.form.email);
        }
        if (isValidEmail(this.state.form.email) !== true) {
          return isValidEmail(this.state.form.email);
        }
        return true;
      },
    };
  }
}

type SupervisorAgentsListActionType = string &
  (
    | 'INITIALIZE'
    | 'FETCH_USERS'
    | 'OPEN_DIALOG'
    | 'CLOSE_DIALOG'
    | 'OPEN_CREATION_FORM'
    | 'CLOSE_CREATION_FORM'
    | 'OPEN_UPDATE_FORM'
    | 'CLOSE_UPDATE_FORM'
    | 'VALIDATE_UPDATE_FORM'
    | 'VALIDATE_CREATION_FORM'
    | 'CREATE_USER'
    | 'UPDATE_USER'
    | 'ACTIVATE_USER'
    | 'DEACTIVATE_USER'
    | 'NONE'
  );

type SupervisorAgentsListVisibilityStatus = string & ('OPENED' | 'CLOSED');

type SupervisorAgentsListButtonStatus = string & ('ENABLED' | 'DISABLED');

export type SupervisorAgentsListStatus = string &
  ('LOADING' | 'IDLE' | 'PROBLEMATIC');

interface SupervisorAgentFormValidators extends Validators {
  name: FormValidator;
  email: FormValidator;
}

interface SupervisorAgentsListState {
  list: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    status: string;
    active: boolean;
    creationDate: string;
  }[];
  selectedAgent: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
  };
  form: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
  };
  skip: number;
  limit: number;
  totalItemsCount: number;
  sort: {
    name?: 'asc' | 'desc';
    email?: 'asc' | 'desc';
    mobileNo?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
    creationDate?: 'asc' | 'desc';
  };
}

interface SupervisorAgentsListActionPayload {
  userId?: number;
  userName?: string;
  skip?: number;
  limit?: number;
  sort?: {
    name?: 'asc' | 'desc';
    email?: 'asc' | 'desc';
    mobileNo?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
    creationDate?: 'asc' | 'desc';
  };
  form?: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
  };
}
