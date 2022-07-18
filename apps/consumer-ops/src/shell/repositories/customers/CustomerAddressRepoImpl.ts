import { CustomerAddress } from '../../../core/models/CustomerAddress';
import { CustomerAddressRepo } from '../../../core/repositories/CustomerAddressRepo';
import { EntityId } from '@survv/commons/core/types';
import {
  ListConsumerCustomerAddressesRequest,
  ListConsumerCustomerAddressesResponse,
} from '@survv/api/definitions/customers';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { mapListBusinessCustomerAddressesResponseToCustomerAddressList } from './mappers/responses';

export class CustomerAddressRepoImpl implements CustomerAddressRepo {
  private readonly _networkService: NetworkService = networkService;

  async listAddresses(customerId: EntityId): Promise<CustomerAddress[]> {
    return mapListBusinessCustomerAddressesResponseToCustomerAddressList(
      await this._networkService.request<
        ListConsumerCustomerAddressesRequest,
        ListConsumerCustomerAddressesResponse
      >({
        requestLine: 'get /consumer/api/v1/customers/:customerId/addresses',
        params: { customerId },
      })
    );
  }
}
