import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class DeliveryFleet extends EnumClass {
  protected readonly _prefix: string;
  static SURVV_FLEET = new DeliveryFleet('SURVV_FLEET');
  static VENDOR_FLEET = new DeliveryFleet('VENDOR_FLEET');
  static NONE = new DeliveryFleet('NONE');

  constructor(value: string) {
    super(value);
    this._prefix = 'DELIVERY_FLEET';
  }
}
