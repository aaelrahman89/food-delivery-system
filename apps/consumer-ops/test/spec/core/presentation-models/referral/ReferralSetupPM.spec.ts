import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';
import { assert } from 'chai';
import { wiremock } from '@survv/commons/test/utils/wiremock';

import {
  BottomSheetListGroup,
  BottomSheetListItem,
} from '@survv/commons/core/models/ItemsList';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  ReferralDiscountType,
  ReferralService,
} from '../../../../../src/core/models/Referral';
import {
  ReferralListRequest,
  ReferralListResponse,
} from '@survv/api/definitions/referral';
import { ReferralRepoImpl } from '../../../../../src/shell/repositories/referral/ReferralRepoImpl';
import { ReferralSetupPM } from '../../../../../src/core/presentation-models/referral/ReferralSetupPM';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { referralListResponseStub } from '@survv/api/stubs/referral';

describe('ReferralSetupPM', function () {
  let pm: ReferralSetupPM;

  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const referralRepo = new ReferralRepoImpl();

  async function setup() {
    await wiremock
      .stub<ReferralListRequest, ReferralListResponse>()
      .request({
        requestLine: 'get /api/v1/referrals',
      })
      .response({
        status: 200,
        body: referralListResponseStub(),
      });

    pm = new ReferralSetupPM({
      notificationService,
      referralRepo,
    });
  }
  beforeEach(function () {
    pm = new ReferralSetupPM({
      notificationService,
      referralRepo,
    });
  });
  it('hydrates the Referral Setup list successfully', async function () {
    await setup();
    await pm.init();
    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.referralSetup.title.en.trim().length, 0);
  });
  it('hydrates the Referral Setup view with the correct values', async function () {
    pm = new ReferralSetupPM({
      notificationService,
      referralRepo,
    });

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

    await pm._hydrate();

    const result = pm.referralSetup;

    assert.deepEqual(result, {
      title: new MultilingualString({
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      }),
      description: new MultilingualString({
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      }),
      sharingMessageText: new MultilingualString({
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      }),
      referrerBannerText: new MultilingualString({
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      }),
      refereeTextWithDeepLink: new MultilingualString({
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      }),
      refereeTextWithoutDeepLink: new MultilingualString({
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      }),
      referrerAmount: new Money({
        amount: 31.01,
        currency: 'EGP',
      }),
      refereeDiscountType: new ReferralDiscountType('FIXED_VALUE'),
      refereeFixedValue: new Money({
        amount: 31.01,
        currency: 'EGP',
      }),
      refereeMinSpending: new Money({
        amount: 31.01,
        currency: 'EGP',
      }),
      refereePercentage: 14,
      refereeCap: new Money({
        amount: 31.01,
        currency: 'EGP',
      }),
      services: [ReferralService.FOOD],
      referrerMaxAmount: '31.01',
      lastUpdatedDate: new Datetime('2018-09-01T18:04:53.178Z'),
    });
    assert.isUndefined(notificationService.notification);
  });
  it('notifies error on hydration failure', async function () {
    await setup();

    $sb.stub(referralRepo, 'getReferralSetup').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('opens and closes the Eligible Services list bottom sheet successfully', async function () {
    await setup();

    await pm.init();

    assert.isFalse(pm.shouldOpenServicesListBottomSheet);

    await pm.showServicesList();

    assert.isTrue(pm.shouldOpenServicesListBottomSheet);

    pm.hideServicesListBottomSheet();

    assert.isFalse(pm.shouldOpenServicesListBottomSheet);
  });
  it('retrieves services list in the correct form for the bottom sheet', async function () {
    pm.referralSetup.services = ReferralService.lookup().filter(
      (service) => service.valueOf() === 'FOOD'
    ) as ReferralService[];

    const bottomSheetList: BottomSheetListGroup<string>[] = [{ items: [] }];

    [
      {
        id: 0,
        label: 'FOOD',
        value: 'FOOD',
      } as BottomSheetListItem<string>,
    ].forEach((item) => {
      bottomSheetList[0].items.push(item);
    });

    assert.deepEqual(pm.servicesList, bottomSheetList);
  });
});
