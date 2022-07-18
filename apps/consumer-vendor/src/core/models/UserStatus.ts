import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class UserStatus extends EnumClass {
  protected readonly _prefix: string;
  static ACTIVE = new UserStatus('ACTIVE');
  static INACTIVE = new UserStatus('INACTIVE');

  constructor(value: string) {
    super(value);
    this._prefix = 'USER_STATUS';
  }
}
