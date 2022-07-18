import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Money } from '@survv/commons/core/models/money';
import { OrderStatus } from '../../../../../src/core/models/Order';
import {
  RefereeReport,
  ReferrerSummary,
} from '../../../../../src/core/models/RefereeReport';
import { RefereeReportPM } from '../../../../../src/core/presentation-models/referral/RefereeReportPM';
import {
  RefereeReportRequest,
  RefereeReportResponse,
  ReferralReportListRequest,
  ReferralReportListResponse,
} from '@survv/api/definitions/referral';
import { ReferralDiscountType } from '../../../../../src/core/models/Referral';
import { ReferralRepoImpl } from '../../../../../src/shell/repositories/referral/ReferralRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('RefereeReportPM', function () {
  let pm: RefereeReportPM;
  const dummyReferrerCodeId = 12345;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const referralRepo = new ReferralRepoImpl();

  async function setup() {
    await wiremock
      .stub<RefereeReportRequest, RefereeReportResponse>()
      .request({
        requestLine:
          'get /api/v1/referrer-codes/:referrerCodeId/referee-report',
        params: {
          referrerCodeId: dummyReferrerCodeId,
        },
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
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
          referees: [
            {
              refereeId: 123,
              refereeName: 'John Doe',
              refereeMobileNumber: '+201011575788',
              orderId: 456,
              customerOrderId: 'QRWNU',
              orderStatus: 'REQUESTED',
              discountType: 'PERCENTAGE',
              discountPercentage: 14,
              discountAmount: {
                amount: 31.01,
                currency: 'EGP',
              },
              registrationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
      });

    await wiremock
      .stub<ReferralReportListRequest, ReferralReportListResponse>()
      .request({
        requestLine: 'get /api/v1/referrer-codes/report',
        query: {
          query: queryMapper({
            filter: {
              referrerCodeId: dummyReferrerCodeId,
            },
            filterMap: {
              referrerCodeId: {
                fieldName: '_id',
                operator: filterOperators.EQUAL,
              },
            },
          }),
        },
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

    pm = new RefereeReportPM({
      referrerCodeId: dummyReferrerCodeId,
      referralRepo,
      notificationService,
    });
  }

  beforeEach(function () {
    pm = new RefereeReportPM({
      referrerCodeId: dummyReferrerCodeId,
      referralRepo,
      notificationService,
    });
  });

  it('hydrates the list and referrer summary successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.list.items, [
      new RefereeReport({
        refereeId: 123,
        refereeName: 'John Doe',
        refereeMobileNumber: '+201011575788',
        orderId: 456,
        customerOrderId: 'QRWNU',
        discountAmount: new Money({
          amount: 31.01,
          currency: 'EGP',
        }),
        discountType: new ReferralDiscountType('PERCENTAGE'),
        discountPercentage: 14,
        orderStatus: new OrderStatus('REQUESTED'),
        registrationDate: new Datetime('2018-09-05T19:04:53.178Z'),
      }),
    ]);
    assert.deepEqual(
      pm.referrerSummary,
      new ReferrerSummary({
        code: 'EGX50',
        referrerName: 'Max',
        cashback: new Money({
          amount: 31.01,
          currency: 'EGP',
        }),
        refereesWithOrders: 3,
        quota: new Money({
          amount: 31.01,
          currency: 'EGP',
        }),
        remainingQuota: 14,
      })
    );
  });
  it('notifies initialization error if referee report hydration fails', async function () {
    await setup();

    $sb.stub(ReferralRepoImpl.prototype, 'getRefereeReport').rejects(error);
    $sb.stub(ReferralRepoImpl.prototype, 'getReferrerSummary').resolves();

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('notifies initialization error if referrer summary hydration fails', async function () {
    await setup();

    $sb.stub(ReferralRepoImpl.prototype, 'getRefereeReport').resolves();
    $sb.stub(ReferralRepoImpl.prototype, 'getReferrerSummary').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('notifies refresh errors', async function () {
    await setup();

    $sb.stub(ReferralRepoImpl.prototype, 'getRefereeReport').rejects(error);
    $sb.stub(ReferralRepoImpl.prototype, 'getReferrerSummary').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
