import { EntityId } from '@survv/commons/core/types';
import { QuerySpec } from '@survv/commons/core/models/Query';

import { ContactPerson, ContactPersonForm } from '../models/ContactPerson';
import { UntaxedCatalogue } from '../models/Catalogue';
import {
  VendorOnlineProfile,
  VendorOnlineProfileForm,
  VendorOnlineProfileList,
  VendorOpsProfileList,
} from '../models/VendorOnlineProfile';
import { VendorStackingConfigurationForm } from '../models/VendorStackingConfiguration';

export interface VendorOnlineProfileRepo {
  getProfile(vendorOnlineProfileId: EntityId): Promise<VendorOnlineProfile>;
  listProfiles(query?: QuerySpec): Promise<VendorOnlineProfileList>;
  listOpsProfiles(query?: QuerySpec): Promise<VendorOpsProfileList>;
  createProfile(vendorOnlineProfile: VendorOnlineProfileForm): Promise<void>;
  updateProfile(
    vendorId: EntityId,
    vendorOnlineProfile: VendorOnlineProfileForm
  ): Promise<void>;
  checkUntaxedCatalogues(
    vendorId: EntityId,
    vendorTaxStatus: string
  ): Promise<UntaxedCatalogue[]>;

  addVendorUser(
    vendorId: EntityId,
    vendorUserForm: ContactPersonForm,
    isCallCenterVendor: boolean
  ): Promise<ContactPerson>;
  deleteVendorUser(vendorUserId: EntityId): Promise<void>;

  setVendorStacking(
    vendorId: EntityId,
    stackingConfigurationForm: VendorStackingConfigurationForm
  ): Promise<void>;

  disableVendorStacking(vendorId: EntityId): Promise<void>;
}
