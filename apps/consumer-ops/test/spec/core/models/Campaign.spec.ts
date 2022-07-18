import { CampaignForm } from '../../../../src/core/models/Campaign';
import {
  PromoCodeType,
  PromoCodeUsageType,
  PromotionBranchesCriteria,
  PromotionCustomersCriteria,
} from '../../../../src/core/models/Promotion';
import { assert } from 'chai';
import { required } from '@survv/commons/core/validations/form-validators';

describe('Campaign', function () {
  let campaignForm: CampaignForm;
  const emptyField = '';

  beforeEach('initializing campaignForm', function () {
    campaignForm = new CampaignForm();
  });
  describe('CampaignForm', function () {
    context('form validations', function () {
      describe('name()', function () {
        it('validates that name has a value', function () {
          assert.equal(campaignForm.validators.name(), required(emptyField));

          campaignForm.name = 'Campaign Name';
          assert.isTrue(campaignForm.validators.name());
        });
      });

      describe('startDate()', function () {
        it('validates that startDate has a value', function () {
          assert.equal(
            campaignForm.validators.startDate(),
            required(emptyField)
          );

          campaignForm.startDate = '2020-12-02T13:08:47.319Z';
          assert.isTrue(campaignForm.validators.startDate());
        });
      });

      describe('endDate()', function () {
        it('validates that endDate has a value', function () {
          assert.equal(campaignForm.validators.endDate(), required(emptyField));

          campaignForm.endDate = '2020-12-02T13:08:47.319Z';
          assert.isTrue(campaignForm.validators.endDate());
        });
      });

      describe('budget()', function () {
        it('validates that budget has a value', function () {
          assert.equal(campaignForm.validators.budget(), required(emptyField));

          campaignForm.budget = 10000;
          assert.isTrue(campaignForm.validators.budget());
        });
      });

      describe('maxActivations()', function () {
        it('validates that maxActivations has a value', function () {
          assert.equal(
            campaignForm.validators.maxActivations(),
            required(emptyField)
          );

          campaignForm.maxActivations = 1000;
          assert.isTrue(campaignForm.validators.maxActivations());
        });
      });

      describe('promoCodeName()', function () {
        it('validates that promo-code name has a value', function () {
          assert.equal(campaignForm.validators.name(), required(emptyField));

          campaignForm.promoCode.name = 'Promo Code Name';
          assert.isTrue(campaignForm.validators.promoCodeName());
        });
      });

      describe('promoCodeMaxNoOfUses()', function () {
        it('validates that promo-code maxNumberOfUses has a value', function () {
          assert.equal(
            campaignForm.validators.promoCodeMaxNoOfUses(),
            required(emptyField)
          );

          campaignForm.promoCode.maxNumberOfUses = 2;
          assert.isTrue(campaignForm.validators.promoCodeMaxNoOfUses());
        });
      });

      describe('promoCodeUsage()', function () {
        it('validates that promo-code usage has a value', function () {
          assert.equal(
            campaignForm.validators.promoCodeUsage(),
            required(emptyField)
          );

          campaignForm.promoCode.usage =
            PromoCodeUsageType.FREE_DELIVERY.valueOf();
          assert.isTrue(campaignForm.validators.promoCodeUsage());
        });
      });

      describe('promoCodeMinSpending()', function () {
        it('validates that promo-code minSpending has a value', function () {
          assert.equal(
            campaignForm.validators.promoCodeMinSpending(),
            required(emptyField)
          );

          campaignForm.promoCode.minSpending = 2;
          assert.isTrue(campaignForm.validators.promoCodeMinSpending());
        });
      });

      describe('customersEligibilityCriteria()', function () {
        it('validates that promo-code customer eligibleUsersCriteria criteria has a value', function () {
          assert.equal(
            campaignForm.validators.customersEligibilityCriteria(),
            required(emptyField)
          );

          campaignForm.eligibleUsersCriteria =
            PromotionCustomersCriteria.ALL_CUSTOMERS.valueOf();
          assert.isTrue(campaignForm.validators.customersEligibilityCriteria());
        });
      });

      describe('branchesEligibilityCriteria()', function () {
        it('validates that promo-code eligibleBranchesCriteria has a value', function () {
          assert.equal(
            campaignForm.validators.branchesEligibilityCriteria(),
            required(emptyField)
          );

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.ALL_VENDORS.valueOf();
          assert.isTrue(campaignForm.validators.branchesEligibilityCriteria());
        });
      });

      describe('promoCodeType()', function () {
        it('validates that promo-code type has a value only if usage type was not "Free delivery"', function () {
          campaignForm.promoCode.usage =
            PromoCodeUsageType.FREE_DELIVERY.valueOf();
          campaignForm.promoCode.type = '';

          assert.isTrue(campaignForm.validators.promoCodeType());

          campaignForm.promoCode.usage = PromoCodeUsageType.CASH_BACK.valueOf();
          campaignForm.promoCode.type = '';
          assert.equal(
            campaignForm.validators.promoCodeType(),
            required(emptyField)
          );

          campaignForm.promoCode.usage = PromoCodeUsageType.CASH_BACK.valueOf();
          campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
          assert.isTrue(campaignForm.validators.promoCodeType());
        });
      });

      describe('promoCodePercent()', function () {
        it('validates that promo-code pecentage has a value only if promo type was "Percentage"', function () {
          campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
          campaignForm.promoCode.percentage = 0;

          assert.isTrue(campaignForm.validators.promoCodePercent());

          campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
          campaignForm.promoCode.percentage = 0;
          assert.equal(
            campaignForm.validators.promoCodePercent(),
            required(emptyField)
          );

          campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
          campaignForm.promoCode.percentage = 100;
          assert.isTrue(campaignForm.validators.promoCodePercent());
        });
      });

      describe('promoCodeCap()', function () {
        it('validates that promo-code cap has a value only if promo type was "Cap"', function () {
          campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
          campaignForm.promoCode.cap = 0;

          assert.isTrue(campaignForm.validators.promoCodeCap());

          campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
          campaignForm.promoCode.cap = 0;
          assert.equal(
            campaignForm.validators.promoCodeCap(),
            required(emptyField)
          );

          campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
          campaignForm.promoCode.cap = 100;
          assert.isTrue(campaignForm.validators.promoCodeCap());
        });
      });

      describe('promoCodeValue()', function () {
        it('validates that promo-code value has a value only if promo type was "Fixed Value"', function () {
          campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
          campaignForm.promoCode.value = 0;

          assert.isTrue(campaignForm.validators.promoCodeValue());

          campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
          campaignForm.promoCode.value = 0;
          assert.equal(
            campaignForm.validators.promoCodeValue(),
            required(emptyField)
          );

          campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
          campaignForm.promoCode.value = 100;
          assert.isTrue(campaignForm.validators.promoCodeValue());
        });
      });

      describe('subsetPhoneNumbers()', function () {
        it('validates that subsetPhoneNumbers has a value only if eligibility users criteria was "SUBSET_OF_CUSTOMERS"', function () {
          campaignForm.eligibleUsersCriteria =
            PromotionCustomersCriteria.ALL_CUSTOMERS.valueOf();
          campaignForm.subsetPhoneNumbers = [];

          assert.isTrue(campaignForm.validators.subsetPhoneNumbers());

          campaignForm.eligibleUsersCriteria =
            PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.valueOf();
          campaignForm.subsetPhoneNumbers = [];
          assert.equal(
            campaignForm.validators.subsetPhoneNumbers(),
            required(emptyField)
          );

          campaignForm.eligibleUsersCriteria =
            PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.valueOf();
          campaignForm.subsetPhoneNumbers = ['0109991112', '0109991113'];
          assert.isTrue(campaignForm.validators.subsetPhoneNumbers());
        });
      });

      describe('selectedBranches()', function () {
        it('validates that subsetPhoneNumbers has a value only if eligibility branches criteria was "SUBSET_OF_CUSTOMERS"', function () {
          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.ALL_VENDORS.valueOf();
          campaignForm.selectedBranches = [];

          assert.isTrue(campaignForm.validators.selectedBranches());

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.SUBSET_OF_BRANCHES.valueOf();
          campaignForm.selectedBranches = [];
          assert.equal(
            campaignForm.validators.selectedBranches(),
            required(emptyField)
          );

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.SUBSET_OF_BRANCHES.valueOf();
          campaignForm.selectedBranches = [
            { id: 11, vendorId: 111 },
            { id: 22, vendorId: 222 },
          ];
          assert.isTrue(campaignForm.validators.selectedBranches());
        });
      });

      describe('referencesIds()', function () {
        it('validates that referencesIds has a value if eligibility branches criteria was "BRANCHES_IN_AREAS"', function () {
          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.ALL_VENDORS.valueOf();
          campaignForm.referencesIds = [];

          assert.isTrue(campaignForm.validators.referencesIds());

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.BRANCHES_IN_AREAS.valueOf();
          campaignForm.referencesIds = [];
          assert.equal(
            campaignForm.validators.referencesIds(),
            required(emptyField)
          );

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.BRANCHES_IN_AREAS.valueOf();
          campaignForm.referencesIds = [11, 22];
          assert.isTrue(campaignForm.validators.referencesIds());
        });
        it('validates that referencesIds has a value if eligibility branches criteria was "BRANCHES_WITH_TAGS"', function () {
          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.ALL_VENDORS.valueOf();
          campaignForm.referencesIds = [];

          assert.isTrue(campaignForm.validators.referencesIds());

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.BRANCHES_WITH_TAGS.valueOf();
          campaignForm.referencesIds = [];
          assert.equal(
            campaignForm.validators.referencesIds(),
            required(emptyField)
          );

          campaignForm.eligibleBranchesCriteria =
            PromotionBranchesCriteria.BRANCHES_WITH_TAGS.valueOf();
          campaignForm.referencesIds = [11, 22];
          assert.isTrue(campaignForm.validators.referencesIds());
        });
      });
    });
  });
});
