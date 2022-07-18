import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { Money } from '@survv/commons/core/models/money';
import { OrderStatus } from './Order';
import { ReferralDiscountType } from './Referral';

export class RefereeReport implements RefereeReportOptions {
  refereeId = 0;
  refereeName = '';
  refereeMobileNumber = '';
  orderId = 0;
  customerOrderId = '';
  orderStatus = new OrderStatus('');
  discountType = new ReferralDiscountType('');
  discountPercentage = 0;
  discountAmount = new Money();
  registrationDate = new Datetime(0);

  constructor(args?: RefereeReportOptions) {
    Object.assign(this, args);
  }
}

export class ReferrerSummary implements ReferrerSummaryOptions {
  code = '';
  referrerName = '';
  refereesWithOrders = 0;
  cashback = new Money();
  quota = new Money();
  remainingQuota = 0;

  constructor(args?: ReferrerSummaryOptions) {
    Object.assign(this, args);
  }
}

interface RefereeReportOptions {
  refereeId: EntityId;
  refereeName: string;
  refereeMobileNumber: string;
  orderId: EntityId;
  customerOrderId: string;
  orderStatus: OrderStatus;
  discountType: ReferralDiscountType;
  discountPercentage: number;
  discountAmount: Money;
  registrationDate: Datetime;
}

interface ReferrerSummaryOptions {
  code: string;
  referrerName: string;
  refereesWithOrders: number;
  cashback: Money;
  quota: Money;
  remainingQuota: number;
}
