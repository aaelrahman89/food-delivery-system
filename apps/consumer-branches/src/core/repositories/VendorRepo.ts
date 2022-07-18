import { EntityId } from '@survv/commons/core/types';
import { VendorDetails } from '../models/Vendor';

export interface VendorRepo {
  saveVendorId(vendorId: EntityId): Promise<void>;
  getVendorId(): Promise<EntityId>;
  clearVendorId(): Promise<void>;
  getVendorDetails(): Promise<VendorDetails>;
}
