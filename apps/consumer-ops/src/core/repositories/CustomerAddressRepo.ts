import { CustomerAddress } from '../models/CustomerAddress';
import { EntityId } from '@survv/commons/core/types';

export interface CustomerAddressRepo {
  listAddresses(customerId: EntityId): Promise<CustomerAddress[]>;
}
