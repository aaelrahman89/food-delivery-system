import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { Money } from '@survv/commons/core/models/money';

export class ReferralReportItem implements ReferralReportItemOptions {
  id = 0;
  referrerId = 0;
  referrerName = '';
  referrerMobileNumber = '';
  referrerCode = '';
  refereeOrdersCount = 0;
  refereeSuccessfulOrdersCount = 0;
  cashBack = new Money();
  remainingQuota = 0;
  quota = new Money();
  isReferred = true;
  referredById = 0;
  referredByName = '';
  referredByCodeId = 0;
  registrationDate = new Datetime();

  constructor(args?: ReferralReportItemOptions) {
    Object.assign(this, args);
  }
}

interface ReferralReportItemOptions {
  id: EntityId;
  referrerId: EntityId;
  referrerName: string;
  referrerMobileNumber: string;
  referrerCode: string;
  refereeOrdersCount: number;
  refereeSuccessfulOrdersCount: number;
  cashBack: Money;
  remainingQuota: number;
  quota: Money;
  isReferred: boolean;
  referredById: EntityId;
  referredByCodeId: EntityId;
  referredByName: string;
  registrationDate: Datetime;
}
