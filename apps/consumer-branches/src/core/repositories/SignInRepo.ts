import { BranchAuth } from '../models/BranchAuth';

export interface SignInRepo {
  signIn(branchCode: string): Promise<BranchAuth>;
}
