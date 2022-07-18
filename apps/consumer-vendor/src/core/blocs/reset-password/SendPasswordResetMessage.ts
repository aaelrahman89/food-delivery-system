import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import {
  FormValidationResult,
  FormValidator,
  isValidEmail,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '../../models/Validators';

export class SendPasswordResetAction {
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

export class SendPasswordResetMessage extends BaseMessage {
  status: Status = 'IDLE';
  buttonStatus: ButtonStatus = 'DISABLED';
  state: ResetPasswordState = {
    logoLtr: '',
    logoRtl: '',
    favicon: '',
    form: {
      email: '',
    },
  };

  action: SendPasswordResetAction = new SendPasswordResetAction();
  validators(): ResetPasswordFormValidators {
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
    };
  }
}

type Action = string &
  (
    | 'INITIALIZE'
    | 'VALIDATE'
    | 'SEND_RESET_PASSWORD'
    | 'RESEND_RESET_PASSWORD'
    | 'SWITCH_LANGUAGE'
    | 'NONE'
  );

type Status = string & ('PROCESSING' | 'IDLE' | 'PROBLEMATIC' | 'DISCONNECTED');
type ButtonStatus = string & ('DISABLED' | 'PROCESSING' | 'ENABLED');

interface ResetPasswordState {
  logoLtr: string;
  logoRtl: string;
  favicon: string;
  form: {
    email: string;
  };
}

interface Payload {
  form?: {
    email?: string;
  };
}

interface ResetPasswordFormValidators extends Validators {
  email: FormValidator;
}
