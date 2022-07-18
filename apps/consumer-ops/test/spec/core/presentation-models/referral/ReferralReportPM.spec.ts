import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';

import { Datetime } from '@survv/commons/core/utils/datetime';
import { Money } from '@survv/commons/core/models/money';
import { ReferralRepoImpl } from '../../../../../src/shell/repositories/referral/ReferralRepoImpl';
import { ReferralReportItem } from '../../../../../src/core/models/ReferralReport';
import {
  ReferralReportListRequest,
  ReferralReportListResponse,
} from '@survv/api/definitions/referral';
import { ReferralReportPM } from '../../../../../src/core/presentation-models/referral/ReferralReportPM';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { queryMapper } from '@survv/commons/core/models/Query';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('ReferralReportPM', function () {
  it('should hydrate referral report', async function () {
    const pm = new ReferralReportPM({
      notificationService,
      referralRepo: new ReferralRepoImpl(),
    });

    const beQuery = queryMapper({
      skip: 0,
      limit: 25,
      sort: {
        registrationDate: 'desc',
      },
    });

    await wiremock
      .stub<ReferralReportListRequest, ReferralReportListResponse>()
      .request({
        requestLine: 'get  /api/v1/referrer-codes/report',
        query: { query: beQuery },
      })
      .response({
        status: 200,
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          referrerCodes: [
            {
              id: 123456,
              name: 'EGX50',
              referrerId: 123456,
              referrerName: 'Max',
              referrerMobileNo: '01069262360',
              refereeOrderCount: 3,
              refereeSuccessfulOrderCount: 3,
              referred: false,
              referredById: 123456,
              referredByName: 'Alex',
              referredByCodeId: 123456,
              totalCashBack: {
                amount: 31.01,
                currency: 'EGP',
              },
              referrerMaxAmount: {
                amount: 31.01,
                currency: 'EGP',
              },
              remainingCashBack: 14,
              registrationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
      });

    await pm.init();
    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.list.items, [
      new ReferralReportItem({
        id: 123456,
        referrerId: 123456,
        referrerName: 'Max',
        referrerMobileNumber: '01069262360',
        referrerCode: 'EGX50',
        refereeOrdersCount: 3,
        refereeSuccessfulOrdersCount: 3,
        cashBack: new Money({
          amount: 31.01,
          currency: 'EGP',
        }),
        remainingQuota: 14,
        quota: new Money({
          amount: 31.01,
          currency: 'EGP',
        }),
        isReferred: false,
        referredById: 123456,
        referredByName: 'Alex',
        referredByCodeId: 123456,
        registrationDate: new Datetime('2018-09-05T19:04:53.178Z'),
      }),
    ]);
  });
  it('should notify error on hydration failure', async function () {
    const pm = new ReferralReportPM({
      notificationService,
      referralRepo: new ReferralRepoImpl(),
    });

    const error = new LocalError({
      message: 'error',
      code: 'HYDRATION_FAILED',
    });

    $sb.stub(ReferralRepoImpl.prototype, 'getReferralReport').rejects(error);

    await pm.init();
    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
