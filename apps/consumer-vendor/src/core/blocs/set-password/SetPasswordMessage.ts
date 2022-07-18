import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import {
  FormValidationResult,
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '../../models/Validators';

export class SetPasswordAction {
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

export class SetPasswordMessage extends BaseMessage {
  status: Status = 'IDLE';
  buttonStatus: ButtonStatus = 'DISABLED';
  state: SetPasswordState = {
    logoLtr: '',
    logoRtl: '',
    favicon: '',
    BRAND_NAME: '',
    form: {
      password: '',
      confirmationPassword: '',
    },
  };

  action: SetPasswordAction = new SetPasswordAction();
  validators(): SetPasswordFormValidators {
    return {
      password: (): FormValidationResult => {
        if (required(this.state.form.password) !== true) {
          return required(this.state.form.password);
        }
        if (
          this.state.form.password.length < 8 ||
          this.state.form.password.length > 20
        ) {
          return 'PASSWORD_LENGTH_ERROR';
        }
        return true;
      },
      confirmationPassword: (): FormValidationResult => {
        if (required(this.state.form.confirmationPassword) !== true) {
          return required(this.state.form.confirmationPassword);
        }
        if (this.state.form.password !== this.state.form.confirmationPassword) {
          return 'PASSWORDS_MISMATCH_ERROR';
        }
        return true;
      },
    };
  }
}

type Action = string &
  ('INITIALIZE' | 'VALIDATE' | 'SET_PASSWORD' | 'SWITCH_LANGUAGE' | 'NONE');

type Status = string & ('PROCESSING' | 'IDLE' | 'PROBLEMATIC' | 'DISCONNECTED');

type ButtonStatus = string & ('DISABLED' | 'PROCESSING' | 'ENABLED');

interface SetPasswordState {
  logoLtr: string;
  logoRtl: string;
  favicon: string;
  BRAND_NAME: string;
  form: {
    password: string;
    confirmationPassword: string;
  };
}

interface Payload {
  form?: {
    password?: string;
    confirmationPassword?: string;
  };
}

interface SetPasswordFormValidators extends Validators {
  password: FormValidator;
  confirmationPassword: FormValidator;
}
