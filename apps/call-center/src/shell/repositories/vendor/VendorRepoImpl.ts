import {
  ConsumerVendorProfileRequest,
  ConsumerVendorProfileResponse,
} from '@survv/api/definitions/vendors';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { Vendor } from '../../../core/models/Vendor';
import { VendorRepo } from '../../../core/repositories/VendorRepo';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { networkService } from '@survv/commons/shell/backend/networkService';

export class VendorRepoImpl implements VendorRepo {
  private _networkService = networkService;

  async getVendorDetails(): Promise<Vendor> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const vendorDetailsResponse = await this._networkService.request<
      ConsumerVendorProfileRequest,
      ConsumerVendorProfileResponse
    >({
      requestLine: 'get /consumer/api/v1/vendors/:vendorId',
      params: { vendorId },
    });

    return new Vendor({
      label: vendorDetailsResponse.label,
      logo: createImageUrl({
        refId: vendorId,
        refType: ImageRefType.VENDOR_ONLINE_PROFILE_LOGO,
      }),
    });
  }
}
