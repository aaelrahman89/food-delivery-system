import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { Gender } from './Gender';
import { Money } from '@survv/commons/core/models/money';

export class SimplifiedCustomer implements SimplifiedCustomerOptions {
  id = 0;
  mobileNo = '';
  name = '';
  creationDate = new Datetime();

  constructor(options?: SimplifiedCustomerOptions) {
    Object.assign(this, options);
  }
}

export class Customer implements CustomerOptions {
  id = 0;
  mobileNo = '';
  name = '';
  email = '';
  gender = new Gender('');
  balance = new Money();
  birthDate = new Datetime();
  imageUrl = '';

  creationDate = new Datetime();

  constructor(options?: CustomerOptions) {
    Object.assign(this, options);
  }
}

interface CustomerOptions {
  id: EntityId;
  mobileNo: string;
  name: string;
  email: string;
  gender: Gender;
  balance: Money;
  birthDate: Datetime;
  imageUrl: string;
  creationDate: Datetime;
}

interface SimplifiedCustomerOptions {
  id: EntityId;
  mobileNo: string;
  name: string;
  creationDate: Datetime;
}
