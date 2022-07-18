import { EnumClass } from './EnumClass';

export class BranchServiceType extends EnumClass {
  protected readonly _prefix: string;
  static B2B = new BranchServiceType('B2B');
  static B2C = new BranchServiceType('B2C');

  constructor(value: string) {
    super(value);
    this._prefix = 'BRANCH_SERVICE_TYPE';
  }
}
