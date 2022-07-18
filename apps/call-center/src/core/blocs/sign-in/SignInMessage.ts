import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import {
  FormValidationResult,
  FormValidator,
  isValidEmail,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '../../models/Validators';

export class SignInAction {
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

export class SignInMessage extends BaseMessage {
  status: Status = 'IDLE';
  buttonStatus: ButtonStatus = 'DISABLED';
  state: SignInState = {
    logoLtr: '',
    logoRtl: '',
    favicon: '',
    BRAND_NAME: '',
    form: {
      email: '',
      password: '',
    },
  };

  action: SignInAction = new SignInAction();
  validators(): SignInFormValidators {
    return {
      email: (): FormValidationResult => {
        if (required(this.state.form.email) !== true) {
          return required(this.state.form.email);
        }
        if (isValidEmail(this.state.form.email) !== true) {
          return isValidEmail(this.state.form.email);
        }
        return true;
      },
      password: (): FormValidationResult => {
        return required(this.state.form.password);
      },
    };
  }
}

type Action = string &
  ('INITIALIZE' | 'VALIDATE' | 'SIGN_IN' | 'SWITCH_LANGUAGE' | 'NONE');

type Status = string & ('PROCESSING' | 'IDLE' | 'PROBLEMATIC' | 'DISCONNECTED');

type ButtonStatus = string & ('DISABLED' | 'PROCESSING' | 'ENABLED');

interface SignInState {
  logoLtr: string;
  logoRtl: string;
  favicon: string;
  BRAND_NAME: string;
  form: {
    email: string;
    password: string;
  };
}

interface Payload {
  form?: {
    email?: string;
    password?: string;
  };
}

interface SignInFormValidators extends Validators {
  email: FormValidator;
  password: FormValidator;
}
