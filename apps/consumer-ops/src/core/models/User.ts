import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { BaseForm } from '@survv/commons/core/models/Forms';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { Validators } from '@survv/commons/core/base/BasePM';

export class UserForm extends BaseForm implements UserFormInputs {
  name = '';
  mobileNo = '';
  email = '';
  userRoles: Array<UserRole> = [];
  profileImage: Base64EncodedFile | ImageUrlString = '';

  protected _initialValues = {
    name: '',
    mobileNo: '',
    email: '',
    userRoles: [],
    profileImage: '',
  };

  constructor(formInputs?: UserFormInputs) {
    super();
    this._init({ formInputs });
  }

  static fromUser(user: User): UserForm {
    return new UserForm({
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      userRoles: user.userRoles,
      profileImage: user.profileImage,
    });
  }

  get validators(): Validators {
    return {
      name: (): FormValidationResult => {
        return required(this.name);
      },
      email: (): FormValidationResult => {
        return required(this.email);
      },
      mobileNo: (): FormValidationResult => {
        return required(this.mobileNo);
      },
      userRoles: (): FormValidationResult => {
        return required(this.userRoles);
      },
    };
  }
}

export const OpsUserRoles = [
  UserRole.OPS_MANAGER,
  UserRole.CATALOGUE_USER,
  UserRole.CATALOGUE_SUPERVISOR,
  UserRole.APP_DESIGNER,
  UserRole.OPS_USER,
  UserRole.MARKETING_USER,
  UserRole.MARKETING_MANAGER,
  UserRole.CS_USER,
  UserRole.AREA_MANAGER,
  UserRole.ACCOUNTANT,
  UserRole.FLEET_MANAGER,
  UserRole.FINANCIAL_MANAGER,
];

export class User implements UserOptions {
  readonly id: EntityId = 0;
  name = '';
  mobileNo = '';
  email = '';
  active = false;
  userRoles: Array<UserRole> = [];
  profileImage = '';
  lastUpdateDate = new Datetime(0);
  creationDate = new Datetime(0);

  constructor(options?: UserOptions) {
    Object.assign(this, options);
  }
}

interface UserOptions {
  id: EntityId;
  name: string;
  mobileNo: string;
  email: string;
  active: boolean;
  userRoles: Array<UserRole>;
  profileImage: Base64EncodedFile | ImageUrlString;
  lastUpdateDate: Datetime;
  creationDate: Datetime;
}

interface UserFormInputs {
  name: string;
  mobileNo: string;
  email: string;
  userRoles: Array<UserRole>;
  profileImage: Base64EncodedFile | ImageUrlString;
}
