import { EnumClass } from './EnumClass';

export class OrderingSystem extends EnumClass {
  protected readonly _prefix: string;
  static CALL_CENTER_DASHBOARD = new OrderingSystem('CALL_CENTER_DASHBOARD');
  static BRANCHES_DASHBOARD = new OrderingSystem('BRANCHES_DASHBOARD');
  static FAKE_VENDOR = new OrderingSystem('FAKE_VENDOR');

  constructor(value: string) {
    super(value);
    this._prefix = 'VENDOR_ORDERING_SYSTEM';
  }
}
