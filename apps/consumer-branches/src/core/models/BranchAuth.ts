import { EntityId } from '@survv/commons/core/types';

export class BranchAuth implements BranchAuthOptions {
  id = 0;
  label = '';
  code = '';
  vendorId = 0;
  token = '';
  constructor(args?: BranchAuthOptions) {
    Object.assign(this, args);
  }
}

interface BranchAuthOptions {
  id: EntityId;
  label: string;
  code: string;
  vendorId: EntityId;
  token: string;
}
