import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import {
  FormValidationResult,
  isValidEmail,
  required,
} from '@survv/commons/core/validations/form-validators';
import { FormValidator, Validators } from '../../models/Validators';

export class UsersListAction {
  type: UsersListActionType = 'NONE';
  payload?: UsersListActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: UsersListActionType;
    payload?: UsersListActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class UsersListMessage extends BaseMessage {
  tableStatus: UsersListStatus = 'IDLE';
  dialogStatus: UsersListVisibilityStatus = 'CLOSED';
  updateFormStatus: UsersListVisibilityStatus = 'CLOSED';
  creationFormStatus: UsersListVisibilityStatus = 'CLOSED';
  updateFormButtonStatus: UsersListButtonStatus = 'DISABLED';
  creationFormButtonStatus: UsersListButtonStatus = 'DISABLED';
  state: UsersListState = {
    list: [],
    selectedUser: {
      id: 0,
      name: '',
      email: '',
      mobileNo: '',
      role: '',
    },
    form: {
      id: 0,
      name: '',
      email: '',
      mobileNo: '',
      role: '',
    },
    skip: 0,
    limit: 25,
    totalItemsCount: 0,
    sort: {
      creationDate: 'desc',
    },
  };

  action: UsersListAction = { type: 'NONE', payload: {} };
  updateValidators(): UserFormValidators {
    return {
      id: (): FormValidationResult => {
        return required(this.state.form.id);
      },
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
      role: (): FormValidationResult => {
        return required(this.state.form.role);
      },
    };
  }

  creationValidators(): UserFormValidators {
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
      role: (): FormValidationResult => {
        return required(this.state.form.role);
      },
    };
  }
}

type UsersListActionType = string &
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

type UsersListVisibilityStatus = string & ('OPENED' | 'CLOSED');

type UsersListButtonStatus = string & ('ENABLED' | 'DISABLED');

export type UsersListStatus = string & ('LOADING' | 'IDLE' | 'PROBLEMATIC');

interface UserFormValidators extends Validators {
  name: FormValidator;
  email: FormValidator;
}

interface UsersListState {
  list: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    role: string;
    status: string;
    active: boolean;
    creationDate: string;
  }[];
  selectedUser: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    role: string;
  };
  form: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    role: string;
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

interface UsersListActionPayload {
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
    role: string;
  };
}
