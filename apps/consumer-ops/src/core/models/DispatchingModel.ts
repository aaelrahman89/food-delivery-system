import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class DispatchingModel extends EnumClass {
  protected readonly _prefix: string;
  static PICK_AND_GO = new DispatchingModel('PICK_AND_GO');
  static ORDER_AND_PICKUP = new DispatchingModel('ORDER_AND_PICKUP');
  static NONE = new DispatchingModel('NONE');
  constructor(value: string) {
    super(value);
    this._prefix = 'DISPATCHING_MODEL';
  }
}
