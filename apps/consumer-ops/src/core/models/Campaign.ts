import { BaseForm } from '@survv/commons/core/models/Forms';
import { CreatedByUser } from '@survv/api/definitions/common';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormValidationResult,
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Money } from '@survv/commons/core/models/money';
import {
  PromoCodeType,
  PromoCodeUsageType,
  PromotionBranchesCriteria,
  PromotionCustomersCriteria,
  PromotionType,
} from './Promotion';
import { Validators } from '@survv/commons/core/base/BasePM';

export class NumberOfOrdersOperator extends EnumClass {
  _prefix: string;
  static EQUAL = new NumberOfOrdersOperator('EQUAL');
  static LESS_THAN = new NumberOfOrdersOperator('LESS_THAN');
  static GREATER_THAN = new NumberOfOrdersOperator('GREATER_THAN');

  constructor(value: string) {
    super(value);
    this._prefix = 'NUMBER_OF_ORDERS_OPERATOR';
  }
}

export class CampaignStatus extends EnumClass {
  _prefix: string;
  static ACTIVE = new CampaignStatus('ACTIVE');
  static INACTIVE = new CampaignStatus('INACTIVE');
  static ENDED = new CampaignStatus('ENDED');

  constructor(value: string) {
    super(value);
    this._prefix = 'CAMPAIGN_STATUS';
  }
}

export class CampaignService extends EnumClass {
  _prefix: string;
  static B2C_FOOD = new CampaignService('B2C_FOOD');

  constructor(value: string) {
    super(value);
    this._prefix = 'CAMPAIGN_SERVICE';
  }
}

export class CampaignForm extends BaseForm implements CampaignFormInputs {
  name = '';
  startDate = '';
  endDate = '';
  budget = 0;
  maxActivations = 0;
  service = CampaignService.B2C_FOOD.valueOf();
  promotionType = PromotionType.PROMO_CODE.valueOf();
  promoCode = {
    name: '',
    maxNumberOfUses: 0,
    type: '',
    usage: '',
    percentage: 0,
    cap: 0,
    minSpending: 0,
    value: 0,
    numberOfOrdersOperator: '',
    numberOfOrders: '',
  };

  eligibleUsersCriteria = '';
  subsetPhoneNumbers = [] as string[];
  eligibleBranchesCriteria = '';
  referencesIds = [] as number[];
  selectedBranches = [] as { id: number; vendorId: number }[];
  allBranches = [] as { id: number; vendorId: number }[];

  _initialValues = {
    name: '',
    startDate: '',
    endDate: '',
    budget: 0,
    maxActivations: 0,
    service: CampaignService.B2C_FOOD.valueOf(),
    promotionType: PromotionType.PROMO_CODE.valueOf(),
    promoCode: {
      name: '',
      maxNumberOfUses: 0,
      type: '',
      usage: '',
      percentage: 0,
      cap: 0,
      minSpending: 0,
      value: 0,
      numberOfOrdersOperator: '',
      numberOfOrders: '',
    },
    eligibleUsersCriteria: '',
    subsetPhoneNumbers: [],
    eligibleBranchesCriteria: '',
    referencesIds: [],
    selectedBranches: [],
  };

  constructor(options?: CampaignFormOptions) {
    super();
    this._init(options);
  }

  get validators(): CampaignFormFormValidators {
    return {
      name: (): FormValidationResult => {
        return required(this.name);
      },
      startDate: (): FormValidationResult => {
        return required(this.startDate);
      },
      endDate: (): FormValidationResult => {
        return required(this.endDate);
      },
      budget: (): FormValidationResult => {
        return required(this.budget);
      },
      maxActivations: (): FormValidationResult => {
        return required(this.maxActivations);
      },
      promoCodeName: (): FormValidationResult => {
        return required(this.promoCode.name);
      },
      promoCodeMaxNoOfUses: (): FormValidationResult => {
        return required(this.promoCode.maxNumberOfUses);
      },
      promoCodeType: (): FormValidationResult => {
        if (PromoCodeUsageType.FREE_DELIVERY.equals(this.promoCode.usage)) {
          return true;
        }
        return required(this.promoCode.type);
      },
      promoCodeUsage: (): FormValidationResult => {
        return required(this.promoCode.usage);
      },
      promoCodeMinSpending: (): FormValidationResult => {
        return required(this.promoCode.minSpending);
      },
      promoCodePercent: (): FormValidationResult => {
        if (PromoCodeType.PERCENTAGE.equals(this.promoCode.type)) {
          return required(this.promoCode.percentage);
        }
        return true;
      },
      promoCodeCap: (): FormValidationResult => {
        if (PromoCodeType.PERCENTAGE.equals(this.promoCode.type)) {
          return required(this.promoCode.cap);
        }
        return true;
      },
      promoCodeValue: (): FormValidationResult => {
        if (PromoCodeType.FIXED_VALUE.equals(this.promoCode.type)) {
          return required(this.promoCode.value);
        }
        return true;
      },
      branchesEligibilityCriteria: (): FormValidationResult => {
        return required(this.eligibleBranchesCriteria);
      },
      customersEligibilityCriteria: (): FormValidationResult => {
        return required(this.eligibleUsersCriteria);
      },
      referencesIds: (): FormValidationResult => {
        if (
          PromotionBranchesCriteria.BRANCHES_IN_AREAS.equals(
            this.eligibleBranchesCriteria
          ) ||
          PromotionBranchesCriteria.BRANCHES_WITH_TAGS.equals(
            this.eligibleBranchesCriteria
          )
        ) {
          return required(this.referencesIds);
        }
        return true;
      },
      selectedBranches: (): FormValidationResult => {
        if (
          PromotionBranchesCriteria.SUBSET_OF_BRANCHES.equals(
            this.eligibleBranchesCriteria
          )
        ) {
          return required(this.selectedBranches);
        }
        return true;
      },
      subsetPhoneNumbers: (): FormValidationResult => {
        if (
          PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.equals(
            this.eligibleUsersCriteria
          )
        ) {
          return required(this.subsetPhoneNumbers);
        }
        return true;
      },
    };
  }
}

export class CampaignsListPromotion implements CampaignsListPromotionOptions {
  id = 0;
  name = '';
  promoCodeUsage = new PromoCodeUsageType('');
  customersCriteria = new PromotionCustomersCriteria('');
  branchesCriteria = {
    criteria: new PromotionBranchesCriteria(''),
    referenceIds: [],
  };

  constructor(options?: CampaignsListPromotionOptions) {
    Object.assign(this, options);
  }
}

export class Campaign implements CampaignOptions {
  id = 0;
  name = '';
  budget = new Money();
  spentBudget = new Money();
  targetActivationsCount = 0;
  currentActivationsCount = 0;
  customerCancellationCount = 0;
  customerPromoCodeUsageCount = 0;
  promoCodeTotalUsageCount = 0;
  status = new CampaignStatus('');
  service = new CampaignService('');
  startDate = new Datetime();
  endDate = new Datetime();
  promotions: CampaignsListPromotion[] = [];
  createdBy = {
    id: 0 as EntityId,
    email: '',
  };

  constructor(options?: CampaignOptions) {
    Object.assign(this, options);
  }
}

interface CampaignFormOptions {
  formInputs: CampaignFormInputs;
}

interface CampaignFormInputs {
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  maxActivations: number;
  service: string;
  promotionType: string;
  promoCode: PromoCode;

  eligibleUsersCriteria: string;
  subsetPhoneNumbers?: string[];

  eligibleBranchesCriteria: string;
  referencesIds?: number[];
  selectedBranches?: { id: number; vendorId: number }[];
  allBranches?: { id: number; vendorId: number }[];
}

interface PromoCode {
  name: string;
  maxNumberOfUses: number;
  type: string;
  usage: string;
  percentage: number;
  cap: number;
  minSpending: number;
  value: number;
  numberOfOrdersOperator: string;
  numberOfOrders: string;
}

interface CampaignFormFormValidators extends Validators {
  name: FormValidator;
  startDate: FormValidator;
  endDate: FormValidator;
  budget: FormValidator;
  maxActivations: FormValidator;
  promoCodeName: FormValidator;
  promoCodeMaxNoOfUses: FormValidator;
  promoCodeType: FormValidator;
  promoCodeUsage: FormValidator;
  promoCodeMinSpending: FormValidator;
  promoCodePercent: FormValidator;
  promoCodeCap: FormValidator;
  promoCodeValue: FormValidator;
  branchesEligibilityCriteria: FormValidator;
  customersEligibilityCriteria: FormValidator;
  referencesIds: FormValidator;
  selectedBranches: FormValidator;
  subsetPhoneNumbers: FormValidator;
}

interface CampaignsListPromotionOptions {
  id: EntityId;
  name: string;
  promoCodeUsage: PromoCodeUsageType;
  customersCriteria: PromotionCustomersCriteria;
  branchesCriteria: {
    criteria: PromotionBranchesCriteria;
    referenceIds: EntityId[];
  };
}

interface CampaignOptions {
  id: EntityId;
  name: string;
  budget: Money;
  spentBudget: Money;
  targetActivationsCount: number;
  currentActivationsCount: number;
  customerCancellationCount: number;
  customerPromoCodeUsageCount: number;
  promoCodeTotalUsageCount: number;
  status: CampaignStatus;
  service: CampaignService;
  startDate: Datetime;
  endDate: Datetime;
  promotions: CampaignsListPromotion[];
  createdBy: CreatedByUser;
}
