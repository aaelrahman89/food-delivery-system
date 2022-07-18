import { Branch } from '../models/Branch';
import { ListingQuery } from '@survv/commons/core/models/Query';

export interface BranchesRepo {
  listBranches(query?: ListingQuery): Promise<Branch[]>;
  updateBranchStatus(branchId: number, status: string): Promise<void>;
}
