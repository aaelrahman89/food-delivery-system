import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { EntityId } from '@survv/commons/core/types';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { VendorType } from '@survv/commons/core/models/VendorType';

export class BranchDetails implements VendorDetailsProps {
  id = 0;
  label = '';
  vendorId = 0;
  vendorType = VendorType.FOOD;
  b2cStatus = new BranchB2CStatus('');
  logo = '';

  constructor(props?: VendorDetailsProps) {
    Object.assign(this, props);
  }
}

interface VendorDetailsProps {
  id: EntityId;
  vendorId: EntityId;
  vendorType: VendorType;
  label: string;
  b2cStatus: BranchB2CStatus;
  logo: ImageUrlString;
}
