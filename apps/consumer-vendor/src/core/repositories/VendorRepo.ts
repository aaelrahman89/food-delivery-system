import { Vendor } from '../models/Vendor';

export interface VendorRepo {
  getVendorDetails(): Promise<Vendor>;
}
