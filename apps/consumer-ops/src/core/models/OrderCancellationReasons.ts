import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class CancellationReasonCategory extends EnumClass {
  protected readonly _prefix: string;
  static VENDOR_FAULT = new CancellationReasonCategory('VENDOR_FAULT');
  static SURVV_FAULT = new CancellationReasonCategory('SURVV_FAULT');
  static CUSTOMER_FAULT = new CancellationReasonCategory('CUSTOMER_FAULT');
  static PILOT_FAULT = new CancellationReasonCategory('PILOT_FAULT');
  static QUICK_CANCELLATION = new CancellationReasonCategory(
    'QUICK_CANCELLATION'
  );

  static OLD_CANCELLATION = new CancellationReasonCategory('OLD_CANCELLATION');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_CANCELLATION_REASON_CATEGORY';
  }
}

export class CancellationReasonsOrderType extends EnumClass {
  _prefix: string;
  static ERRANDS = new CancellationReasonsOrderType('ERRANDS');
  static B2C = new CancellationReasonsOrderType('B2C');

  constructor(value: string) {
    super(value);
    this._prefix = 'CANCELLATION_REASON_ORDER_TYPE';
  }
}

export class CancellationReason implements CancellationReasonOptions {
  id = 0;
  type = new CancellationReasonCategory('');
  label = '';
  orderTypes = [new CancellationReasonsOrderType('')];

  constructor(options?: CancellationReasonOptions) {
    Object.assign(this, options);
  }
}
interface CancellationReasonOptions {
  id: EntityId;
  type: CancellationReasonCategory;
  label: string;
  orderTypes: CancellationReasonsOrderType[];
}
