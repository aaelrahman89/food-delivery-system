import { EnumClass } from './EnumClass';

export class BranchB2CStatus extends EnumClass {
  _prefix: string;

  static AVAILABLE = new BranchB2CStatus('AVAILABLE');
  static BUSY_ONE_HOUR = new BranchB2CStatus('BUSY_ONE_HOUR');
  static BUSY_TWO_HOUR = new BranchB2CStatus('BUSY_TWO_HOUR');
  static BUSY_THREE_HOUR = new BranchB2CStatus('BUSY_THREE_HOUR');
  static OUT_OF_SERVICE = new BranchB2CStatus('OUT_OF_SERVICE');
  static OUT_OF_WORKING_HOURS = new BranchB2CStatus('OUT_OF_WORKING_HOURS');

  constructor(value: string) {
    super(value);
    this._prefix = 'BRANCH_B2C_STATUS';
  }
}
