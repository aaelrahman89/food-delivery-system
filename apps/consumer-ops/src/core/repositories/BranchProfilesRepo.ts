import { BranchProfileListItem } from '../models/Branch';
import { EntityId } from '@survv/commons/core/types';

export interface BranchProfilesRepo {
  listCompletedProfiles(vendorId: EntityId): Promise<BranchProfileListItem[]>;
}
