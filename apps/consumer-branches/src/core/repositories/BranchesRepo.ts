import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { BranchDetails } from '../models/Branch';

export interface BranchesRepo {
  signOut(): Promise<void>;
  getBranchDetails(): Promise<BranchDetails>;
  setBranchB2CStatus(b2cStatus: BranchB2CStatus): Promise<void>;
}
