import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { Money } from '@survv/commons/core/models/money';

export class PromoCodeType extends EnumClass {
  _prefix: string;
  static PERCENTAGE = new PromoCodeType('PERCENTAGE');
  static FIXED_VALUE = new PromoCodeType('FIXED_VALUE');
  static NONE = new PromoCodeType('NONE');

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMO_CODE_TYPE';
  }
}

export class PromoCodeUsageType extends EnumClass {
  _prefix: string;
  static DISCOUNT = new PromoCodeUsageType('DISCOUNT');
  static CASH_BACK = new PromoCodeUsageType('CASH_BACK');
  static FREE_DELIVERY = new PromoCodeUsageType('FREE_DELIVERY');

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMO_CODE_USAGE_TYPE';
  }
}

export class PromotionCustomersCriteria extends EnumClass {
  _prefix: string;
  static ALL_CUSTOMERS = new PromotionCustomersCriteria('ALL_CUSTOMERS');

  static NEW_CUSTOMERS = new PromotionCustomersCriteria('NEW_CUSTOMERS');

  static REGISTERED_CUSTOMERS = new PromotionCustomersCriteria(
    'REGISTERED_CUSTOMERS'
  );

  static SUBSET_OF_CUSTOMERS = new PromotionCustomersCriteria(
    'SUBSET_OF_CUSTOMERS'
  );

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMOTION_CUSTOMERS_CRITERIA';
  }
}

export class PromotionBranchesCriteria extends EnumClass {
  _prefix: string;
  static ALL_VENDORS = new PromotionBranchesCriteria('ALL_VENDORS');
  static BRANCHES_IN_AREAS = new PromotionBranchesCriteria('BRANCHES_IN_AREAS');

  static BRANCHES_WITH_TAGS = new PromotionBranchesCriteria(
    'BRANCHES_WITH_TAGS'
  );

  static SUBSET_OF_BRANCHES = new PromotionBranchesCriteria(
    'SUBSET_OF_BRANCHES'
  );

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMOTION_BRANCHES_CRITERIA';
  }
}

export class PromotionType extends EnumClass {
  _prefix: string;
  static PROMO_CODE = new PromotionType('PROMO_CODE');

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMOTION_TYPE';
  }
}

export class PromoCode implements PromoCodeArgs {
  id = 0;
  name = '';
  usage = new PromoCodeUsageType('');
  type = new PromoCodeType('');
  cap = new Money();
  value = new Money();
  percentage = 0;
  minSpending = new Money();
  valid = true;
  minSpendingShortage = new Money();

  constructor(args?: PromoCodeArgs) {
    Object.assign(this, args);
  }
}

interface PromoCodeArgs {
  id: EntityId;
  name: string;
  usage: PromoCodeUsageType;
  type: PromoCodeType;
  cap: Money;
  value: Money;
  percentage: number;
  minSpending: Money;
  valid: boolean;
  minSpendingShortage: Money;
}
