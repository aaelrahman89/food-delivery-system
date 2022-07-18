import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { BranchDetails } from '../../../../core/models/Branch';
import { ConsumerBranchDetailsResponse } from '@survv/api/definitions/branches';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { VendorType } from '@survv/commons/core/models/VendorType';

export function mapBranchDetailsToBranchDetailsModel(
  branchDetails: ConsumerBranchDetailsResponse
): BranchDetails {
  return new BranchDetails({
    id: branchDetails.id,
    vendorId: branchDetails.vendorId,
    label: branchDetails.label,
    vendorType: new VendorType(branchDetails.vendorType),
    b2cStatus: new BranchB2CStatus(branchDetails.b2cStatus),
    logo: createImageUrl({
      refId: branchDetails.vendorId,
      refType: ImageRefType.VENDOR_OPS_LOGO,
    }),
  });
}
