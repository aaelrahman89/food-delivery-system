import { EntityId } from '@survv/commons/core/types';
import { KvStorage } from '@survv/pwa/core/kv-storage';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { VendorDetails } from '../../../core/models/Vendor';
import {
  VendorDetailsRequest,
  VendorDetailsResponse,
} from '@survv/api/definitions/vendors';
import { VendorRepo } from '../../../core/repositories/VendorRepo';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { mapVendorDetailsResponseToVendorDetails } from './mappers/responses';
import { storageKeys } from '@survv/commons/core/models/Storage';

class VendorRepoImpl implements VendorRepo {
  private _storage: KvStorage = kvStorage;
  private _network: NetworkService = networkService;
  saveVendorId = async (vendorId: EntityId): Promise<void> => {
    await this._storage.setItem(storageKeys.vendorId, vendorId);
  };

  getVendorId = async (): Promise<EntityId> => {
    return (await this._storage.getItem(storageKeys.vendorId)) as EntityId;
  };

  clearVendorId = async (): Promise<void> => {
    return this._storage.removeItem(storageKeys.vendorId);
  };

  getVendorDetails = async (): Promise<VendorDetails> => {
    const vendorId = await this.getVendorId();
    return mapVendorDetailsResponseToVendorDetails(
      await this._network.request<VendorDetailsRequest, VendorDetailsResponse>({
        requestLine: 'get /api/v1.2/vendors/:vendorId',
        params: {
          vendorId,
        },
      })
    );
  };
}

export const vendorRepoImpl = new VendorRepoImpl();
