import { BaseForm } from '@survv/commons/core/models/Forms';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '@survv/commons/core/base/BasePM';

export class ContactPerson implements ContactPersonOptions {
  id = 0;
  fullName = '';
  mobileNo = '';
  email = '';
  title = '';
  creationDate = new Datetime(0);

  constructor(options?: ContactPersonOptions) {
    Object.assign(this, options);
  }
}

export class ContactPersonForm
  extends BaseForm
  implements ContactPersonFormInputs
{
  protected _initialValues = {
    name: '',
    email: '',
    mobileNumber: '',
    title: '',
  };

  name = '';
  email = '';
  mobileNumber = '';
  title = '';

  constructor(options?: ContactPersonFormOptions) {
    super();
    this._init(options);
  }

  get validators(): Validators {
    return {
      name: (): FormValidationResult => {
        return required(this.name);
      },
      email: (): FormValidationResult => {
        return required(this.email);
      },
      mobileNumber: (): FormValidationResult => {
        return required(this.mobileNumber);
      },
      title: (): FormValidationResult => {
        return required(this.title);
      },
    };
  }
}

interface ContactPersonFormOptions {
  formInputs: ContactPersonFormInputs;
}
interface ContactPersonFormInputs {
  name: string;
  email: string;
  mobileNumber: string;
  title: string;
  callCenterUserRoles?: string;
}

interface ContactPersonOptions {
  id?: EntityId;
  fullName: string;
  mobileNo: string;
  email: string;
  title: string;
  creationDate?: Datetime;
  callCenterUserRoles?: string;
}
