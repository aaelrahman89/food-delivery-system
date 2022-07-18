import { EnumClass } from './EnumClass';

export class VendorType extends EnumClass {
  _prefix: string;

  static FOOD = new VendorType('FOOD');
  static PHARMACY = new VendorType('PHARMACY');
  static PETS = new VendorType('PETS');
  static GROCERIES = new VendorType('GROCERIES');
  static C2C = new VendorType('C2C');
  static SURVV_SHOP = new VendorType('SURVV_SHOP');

  constructor(value: string) {
    super(value);
    this._prefix = 'VENDOR_TYPE';
  }
}
