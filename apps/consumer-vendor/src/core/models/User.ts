import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UserStatus } from './UserStatus';

export class User implements UserOptions {
  id = 0;
  vendorId = 0;
  name = '';
  email = '';
  mobileNo = '';
  status = new UserStatus('');
  roles: UserRole[] = [];
  token = '';
  creationDate = new Datetime(0);

  constructor(options?: UserOptions) {
    Object.assign(this, options);
  }
}

export interface UserOptions {
  id: EntityId;
  vendorId?: EntityId;
  name: string;
  email: string;
  mobileNo: string;
  status?: UserStatus;
  roles?: UserRole[];
  token?: string;
  creationDate?: Datetime;
}
