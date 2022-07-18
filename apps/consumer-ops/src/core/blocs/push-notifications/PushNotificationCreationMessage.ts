import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import {
  FormValidationResult,
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '@survv/commons/core/base/BasePM';

export class PushNotificationCreationAction {
  type: Action = 'NONE';
  payload: PushNotificationCreationActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: Action;
    payload: PushNotificationCreationActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class PushNotificationCreationMessage extends BaseMessage {
  status: Status = 'IDLE';
  formStatus: FormStatus = 'INVALID';
  state: PushNotificationCreationState = {
    form: {
      header: '',
      message: '',
      audience: [],
    },
  };

  action: PushNotificationCreationAction = { type: 'NONE', payload: {} };

  validators(): PushNotificationCreationFormValidators {
    return {
      header: (): FormValidationResult => {
        return required(this.state.form.header);
      },
      message: (): FormValidationResult => {
        return required(this.state.form.message);
      },
      audience: (): FormValidationResult => {
        return required(this.state.form.audience);
      },
    };
  }
}

type Action = string &
  ('UPLOAD_CSV' | 'UPDATE_FORM' | 'CREATE_PUSH_NOTIFICATION' | 'NONE');

export type Status = string & ('LOADING' | 'IDLE');

type FormStatus = string & ('VALID' | 'INVALID');

interface PushNotificationCreationState {
  form: {
    header: string;
    message: string;
    audience: string[];
  };
}

interface PushNotificationCreationActionPayload {
  form?: {
    header: string;
    message: string;
    audience: string[];
  };
}

interface PushNotificationCreationFormValidators extends Validators {
  header: FormValidator;
  message: FormValidator;
  audience: FormValidator;
}
