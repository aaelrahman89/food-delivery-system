import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class RejectionReasonOrderType extends EnumClass {
  _prefix: string;

  static B2C = new RejectionReasonOrderType('B2C');
  static ERRANDS = new RejectionReasonOrderType('ERRANDS');

  constructor(value: string) {
    super(value);
    this._prefix = 'REJECTION_REASON_ORDER_TYPE';
  }
}

export class RejectionReason implements RejectionReasonOptions {
  id = 0;
  label = '';

  constructor(options?: RejectionReasonOptions) {
    Object.assign(this, options);
  }
}
export interface RejectionReasonOptions {
  id: EntityId;
  label: string;
}
