import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';
import { errorModel } from '@survv/commons/core/errors/errors';
import { wiremock } from '@survv/commons/test/utils/wiremock';

import { ReferralForm } from '../../../../../src/core/models/Referral';
import {
  ReferralListRequest,
  ReferralListResponse,
  ReferralSetupRequest,
  ReferralSetupResponse,
} from '@survv/api/definitions/referral';
import { ReferralRepoImpl } from '../../../../../src/shell/repositories/referral/ReferralRepoImpl';
import { SetReferralSetupPM } from '../../../../../src/core/presentation-models/referral/SetReferralSetupPM';
import { createNotification } from '../../../../../src/core/notification';
import { mapReferralFormToReferralSetupRequest } from '../../../../../src/shell/repositories/referral/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { validationMessages } from '@survv/commons/core/validations/form-validators';

describe('ReferralSetupPM', function () {
  let pm: SetReferralSetupPM;

  beforeEach('setup "pm"', function () {
    pm = new SetReferralSetupPM({
      referralRepo: new ReferralRepoImpl(),
      notificationService,
    });
  });
  context('submitting form', function () {
    describe('submit()', function () {
      it('submits referral setup successfully', async function () {
        await wiremock
          .stub<ReferralSetupRequest, ReferralSetupResponse>()
          .request({
            requestLine: 'post /api/v1/referrals',
            body: {
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              description: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              sharingMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithoutDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerAmount: 31.01,
              refereeDiscountType: 'FIXED_VALUE',
              refereeFixedValue: 31.01,
              refereeMinSpending: 31.01,
              refereePercentage: 14,
              refereeCap: 31.01,
              services: ['FOOD'],
              referrerMaxAmount: 31.01,
            },
          })
          .response({ status: 200 });

        await wiremock
          .stub<ReferralListRequest, ReferralListResponse>()
          .request({
            requestLine: 'get /api/v1/referrals',
          })
          .response({
            status: 200,
            body: {
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              description: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              sharingMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithoutDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerAmount: {
                amount: 31.01,
                currency: 'EGP',
              },
              refereeDiscountType: 'FIXED_VALUE',
              refereeFixedValue: {
                amount: 31.01,
                currency: 'EGP',
              },
              refereeMinSpending: {
                amount: 31.01,
                currency: 'EGP',
              },
              refereePercentage: 14,
              refereeCap: {
                amount: 31.01,
                currency: 'EGP',
              },
              services: ['FOOD'],
              referrerMaxAmount: {
                amount: 31.01,
                currency: 'EGP',
              },
              lastUpdateDate: '2018-09-01T18:04:53.178Z',
            },
          });

        await pm.init();

        const submitted = await pm.submit();
        assert.isTrue(submitted);
        assert.deepEqual(
          notificationService.notification,
          successfulOperation()
        );
      });
      it('notifies error in case of failure', async function () {
        $sb
          .stub(ReferralRepoImpl.prototype, 'setReferralSetup')
          .rejects(errorModel({ code: 'any', message: 'example error' }));
        await wiremock
          .stub<ReferralSetupRequest, ReferralSetupResponse>()
          .request({
            requestLine: 'post /api/v1/referrals',
            body: {
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              description: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              sharingMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithoutDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerAmount: 31.01,
              refereeDiscountType: 'FIXED_VALUE',
              refereeFixedValue: 31.01,
              refereeMinSpending: 31.01,
              refereePercentage: 14,
              refereeCap: 31.01,
              services: ['FOOD'],
              referrerMaxAmount: 31.01,
            },
          })
          .response({ status: 200 });

        await wiremock
          .stub<ReferralListRequest, ReferralListResponse>()
          .request({
            requestLine: 'get /api/v1/referrals',
          })
          .response({
            status: 200,
            body: {
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              description: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              sharingMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              refereeWithoutDeepLinkBannerMsg: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              referrerAmount: {
                amount: 31.01,
                currency: 'EGP',
              },
              refereeDiscountType: 'FIXED_VALUE',
              refereeFixedValue: {
                amount: 31.01,
                currency: 'EGP',
              },
              refereeMinSpending: {
                amount: 31.01,
                currency: 'EGP',
              },
              refereePercentage: 14,
              refereeCap: {
                amount: 31.01,
                currency: 'EGP',
              },
              services: ['FOOD'],
              referrerMaxAmount: {
                amount: 31.01,
                currency: 'EGP',
              },
              lastUpdateDate: '2018-09-01T18:04:53.178Z',
            },
          });

        await pm.init();
        pm.referralForm.title = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.description = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.sharingMessageText = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.referrerBannerText = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.refereeTextWithDeepLink = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.refereeTextWithoutDeepLink = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.referrerAmount = 31.01;
        pm.referralForm.refereePercentage = 14;
        pm.referralForm.refereeCap = 31.01;
        pm.referralForm.services = ['FOOD'];
        pm.referralForm.referrerMaxAmount = '31.01';

        const submitted = await pm.submit();

        assert.isFalse(submitted);
        assert.deepEqual(
          notificationService.notification,
          createNotification(
            errorModel({ code: 'any', message: 'example error' })
          )
        );
      });
    });
    describe('get submittable', function () {
      it('returns if the referral form is submittable or not', function () {
        pm.referralForm = new ReferralForm();
        assert.isFalse(pm.submittable);

        pm.referralForm.title = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.description = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.sharingMessageText = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.referrerBannerText = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.refereeTextWithDeepLink = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.refereeTextWithoutDeepLink = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.referrerAmount = 31.01;
        pm.referralForm.refereeDiscountType = 'FIXED_VALUE';
        pm.referralForm.refereeFixedValue = 31.01;
        pm.referralForm.refereeMinSpending = 31.01;
        pm.referralForm.refereePercentage = 14;
        pm.referralForm.refereeCap = 31.01;
        pm.referralForm.services = ['FOOD'];
        pm.referralForm.referrerMaxAmount = '31.01';

        assert.isTrue(pm.submittable);
      });
      it('validates if referral title is entered', function () {
        assert.equal(
          pm.referralForm.validators.titleEn(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        assert.equal(
          pm.referralForm.validators.titleAr(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        pm.referralForm.title = { en: 'Test Text', ar: 'اختبار' };

        assert.isTrue(pm.referralForm.validators.titleEn());
        assert.isTrue(pm.referralForm.validators.titleAr());
      });
      it('validates if referral description text is entered', function () {
        assert.equal(
          pm.referralForm.validators.descriptionEn(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        assert.equal(
          pm.referralForm.validators.descriptionAr(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        pm.referralForm.description = { en: 'Test Text', ar: 'اختبار' };

        assert.isTrue(pm.referralForm.validators.descriptionEn());
        assert.isTrue(pm.referralForm.validators.descriptionAr());
      });
      it('validates if referral sharing message text is entered', function () {
        assert.equal(
          pm.referralForm.validators.sharingMessageTextEn(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        assert.equal(
          pm.referralForm.validators.sharingMessageTextAr(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        pm.referralForm.sharingMessageText = { en: 'Test Text', ar: 'اختبار' };

        assert.isTrue(pm.referralForm.validators.sharingMessageTextEn());
        assert.isTrue(pm.referralForm.validators.sharingMessageTextAr());
      });
      it('validates if referral sharing message text has valid character count', function () {
        pm.referralForm.sharingMessageText = {
          en: 'OnIQu3XbphppQ4uKzMYNMcqUdyvDVp32IVoDTc0LaVzJ0hWVKiBPZRWFKCDLmPPXtkuEHOnwt6aLVtGxwOcwCgrr4zLi1Zz92Prbosqn38Ub75ZCUJYtagX6I726YhhYxYdWbjpL7yavyUz8ejrtfxL5WqDBrVOCiO6PbZJ5XJC2apRN3sPInHCRf4OJN5mZBKSsKLuQI',
          ar: 'اختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختباراختبار',
        };

        assert.equal(
          pm.referralForm.validators.sharingMessageTextEn(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        assert.equal(
          pm.referralForm.validators.sharingMessageTextAr(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        pm.referralForm.sharingMessageText = { en: 'Test Text', ar: 'اختبار' };

        assert.isTrue(pm.referralForm.validators.sharingMessageTextEn());
        assert.isTrue(pm.referralForm.validators.sharingMessageTextAr());
      });
      it('validates if referral banner text is entered', function () {
        assert.equal(
          pm.referralForm.validators.referrerBannerTextEn(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        assert.equal(
          pm.referralForm.validators.referrerBannerTextAr(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        pm.referralForm.referrerBannerText = { en: 'Test Text', ar: 'اختبار' };

        assert.isTrue(pm.referralForm.validators.referrerBannerTextEn());
        assert.isTrue(pm.referralForm.validators.referrerBannerTextAr());
      });
      it('validates if referral banner text has valid character count', function () {
        pm.referralForm.referrerBannerText = {
          en: 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTest',
          ar: 'اختباراختباراختباراختباراختباراختباراختباراختباراختباراختبار',
        };

        assert.equal(
          pm.referralForm.validators.referrerBannerTextEn(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        assert.equal(
          pm.referralForm.validators.referrerBannerTextAr(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        pm.referralForm.sharingMessageText = { en: 'Test Text', ar: 'اختبار' };

        assert.isTrue(pm.referralForm.validators.sharingMessageTextEn());
        assert.isTrue(pm.referralForm.validators.sharingMessageTextAr());
      });
      it('validates if referee banner text with Deep link is entered', function () {
        assert.equal(
          pm.referralForm.validators.refereeTextWithDeepLinkEn(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        assert.equal(
          pm.referralForm.validators.refereeTextWithDeepLinkAr(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        pm.referralForm.refereeTextWithDeepLink = {
          en: 'Test Text',
          ar: 'اختبار',
        };

        assert.isTrue(pm.referralForm.validators.refereeTextWithDeepLinkEn());
        assert.isTrue(pm.referralForm.validators.refereeTextWithDeepLinkAr());
      });
      it('validates if referee banner text with deep link has valid character count', function () {
        pm.referralForm.refereeTextWithDeepLink = {
          en: 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTest',
          ar: 'اختباراختباراختباراختباراختباراختباراختباراختباراختباراختبار',
        };

        assert.equal(
          pm.referralForm.validators.refereeTextWithDeepLinkEn(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        assert.equal(
          pm.referralForm.validators.refereeTextWithDeepLinkAr(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        pm.referralForm.refereeTextWithDeepLink = {
          en: 'Test Text',
          ar: 'اختبار',
        };

        assert.isTrue(pm.referralForm.validators.refereeTextWithDeepLinkEn());
        assert.isTrue(pm.referralForm.validators.refereeTextWithDeepLinkAr());
      });
      it('validates if referee banner text without Deep link is entered', function () {
        assert.equal(
          pm.referralForm.validators.refereeTextWithoutDeepLinkEn(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        assert.equal(
          pm.referralForm.validators.refereeTextWithoutDeepLinkAr(),
          validationMessages.FORM_REQUIRED_INPUT
        );
        pm.referralForm.refereeTextWithoutDeepLink = {
          en: 'Test Text',
          ar: 'اختبار',
        };

        assert.isTrue(
          pm.referralForm.validators.refereeTextWithoutDeepLinkEn()
        );
        assert.isTrue(
          pm.referralForm.validators.refereeTextWithoutDeepLinkAr()
        );
      });
      it('validates if referee banner text without deep link has valid character count', function () {
        pm.referralForm.refereeTextWithoutDeepLink = {
          en: 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTest',
          ar: 'اختباراختباراختباراختباراختباراختباراختباراختباراختباراختبار',
        };

        assert.equal(
          pm.referralForm.validators.refereeTextWithoutDeepLinkEn(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        assert.equal(
          pm.referralForm.validators.refereeTextWithoutDeepLinkAr(),
          validationMessages.FORM_INVALID_CHAR_COUNT
        );
        pm.referralForm.refereeTextWithoutDeepLink = {
          en: 'Test Text',
          ar: 'اختبار',
        };

        assert.isTrue(
          pm.referralForm.validators.refereeTextWithoutDeepLinkEn()
        );
        assert.isTrue(
          pm.referralForm.validators.refereeTextWithoutDeepLinkAr()
        );
      });
      it('validates if referrer amount is entered', function () {
        assert.equal(
          pm.referralForm.validators.referrerAmount(),
          validationMessages.FORM_REQUIRED_INPUT
        );

        pm.referralForm.referrerAmount = 31.01;

        assert.isTrue(pm.referralForm.validators.referrerAmount());
      });
      it('validates if referee percentage is set to zero if no value is entered', function () {
        assert.equal(pm.referralForm.refereePercentage, 0);
      });
      it('validates if referee percentage has a valid percentage value', function () {
        pm.referralForm.refereePercentage = 200;

        assert.equal(
          pm.referralForm.validators.refereePercentage(),
          validationMessages.FORM_INVALID_PERCENTAGE
        );

        pm.referralForm.refereePercentage = 15;

        assert.isTrue(pm.referralForm.validators.refereePercentage());
      });
      it('validates if referee cap is entered', function () {
        assert.equal(
          pm.referralForm.validators.refereeCap(),
          validationMessages.FORM_REQUIRED_INPUT
        );

        pm.referralForm.refereeCap = 500;

        assert.isTrue(pm.referralForm.validators.refereeCap());
      });
      it('validates if a service is selected ', function () {
        assert.equal(
          pm.referralForm.validators.services(),
          validationMessages.FORM_REQUIRED_INPUT
        );

        pm.referralForm.services = ['FOOD'];

        assert.isTrue(pm.referralForm.validators.services());
      });
      it('validates if a max amount to be earned per user is a valid money value ', function () {
        pm.referralForm.referrerMaxAmount = '-200';

        assert.equal(
          pm.referralForm.validators.referrerMaxAmount(),
          validationMessages.FORM_INVALID_MONEY
        );

        pm.referralForm.referrerMaxAmount = '500';

        assert.isTrue(pm.referralForm.validators.referrerMaxAmount());
      });
      it('validates if a max amount to be earned accepts and empty value and returns -1 on submit', function () {
        pm.referralForm.title = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.description = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.sharingMessageText = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.referrerBannerText = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.refereeTextWithDeepLink = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.refereeTextWithoutDeepLink = {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        };
        pm.referralForm.referrerAmount = 31.01;
        pm.referralForm.refereePercentage = 14;
        pm.referralForm.refereeCap = 31.01;
        pm.referralForm.services = ['FOOD'];
        pm.referralForm.referrerMaxAmount = '';

        const response = mapReferralFormToReferralSetupRequest(pm.referralForm);

        assert.equal(response.referrerMaxAmount, -1);
      });
    });
  });
});
