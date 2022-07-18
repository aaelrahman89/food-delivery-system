import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Notification } from '@survv/commons/core/notification/notification';
import { TaxTier, TaxTierForm } from '../../../../../src/core/models/TaxTier';
import {
  TaxTierRequest,
  TaxTierResponse,
  TaxTierUpdateRequest,
  TaxTierUpdateResponse,
} from '@survv/api/definitions/tax-tiers';
import { TaxTierUpdatePM } from '../../../../../src/core/presentation-models/tax-tiers/TaxTierUpdatePM';
import { TaxTiersRepoImpl } from '../../../../../src/shell/repositories/tax-tiers/TaxTiersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { mapTaxTierFormToTaxTierUpdateRequest } from '../../../../../src/shell/repositories/tax-tiers/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { taxTierResponseStub } from '@survv/api/stubs/tax-tiers';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('TaxTierUpdatePM', function () {
  it('hydrates the tier and form successfully', async function () {
    const pm = new TaxTierUpdatePM({
      tierId: 123,
      taxTiersRepo: new TaxTiersRepoImpl(),
      notificationService,
    });

    const taxTierStub = taxTierResponseStub();
    taxTierStub.id = 123;
    taxTierStub.name = { en: 'EN', ar: 'AR' };
    taxTierStub.percentage = 15.5;

    await wiremock
      .stub<TaxTierRequest, TaxTierResponse>()
      .request({
        requestLine: 'get /api/v1/vat-tiers/:tierId',
        params: { tierId: 123 },
      })
      .response({ status: 200, body: taxTierStub });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.tier,
      new TaxTier({
        id: taxTierStub.id,
        displayName: new MultilingualString(taxTierStub.name),
        percentage: taxTierStub.percentage,
      })
    );
  });
  it('notifies initialization errors', async function () {
    const pm = new TaxTierUpdatePM({
      tierId: 123,
      taxTiersRepo: new TaxTiersRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      code: 'any',
      message: 'any',
    });

    $sb.stub(TaxTiersRepoImpl.prototype, 'getTier').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('submits the form when the form is valid', async function () {
    const pm = new TaxTierUpdatePM({
      tierId: 123,
      taxTiersRepo: new TaxTiersRepoImpl(),
      notificationService,
    });

    assert.isFalse(pm.canSubmit);

    pm.form.displayName = { en: 'en', ar: 'ar' };
    pm.form.percentage = 30;

    await wiremock
      .stub<TaxTierUpdateRequest, TaxTierUpdateResponse>()
      .request({
        requestLine: 'put /api/v1/vat-tiers/:tierId',
        params: { tierId: 123 },
        body: mapTaxTierFormToTaxTierUpdateRequest(pm.form),
      })
      .response({ status: 200 });

    assert.isTrue(pm.canSubmit);

    const submitted = await pm.submit();

    assert.isTrue(submitted);
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });
  it('notifies failed form submissions and returns false', async function () {
    const pm = new TaxTierUpdatePM({
      tierId: 123,
      taxTiersRepo: new TaxTiersRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      message: 'cannot submit invalid form',
      code: 'BAD_OPERATION',
    });

    $sb.stub(TaxTierForm.prototype, 'submit').rejects(error);

    const submitted = await pm.submit();

    assert.isFalse(submitted);
    assert.deepEqual(
      notificationService.notification,
      Notification.badOperation()
    );
  });
});
