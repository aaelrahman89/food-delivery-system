import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Notification } from '@survv/commons/core/notification/notification';
import { TaxTierCreationPM } from '../../../../../src/core/presentation-models/tax-tiers/TaxTierCreationPM';
import {
  TaxTierCreationRequest,
  TaxTierCreationResponse,
} from '@survv/api/definitions/tax-tiers';
import { TaxTierForm } from '../../../../../src/core/models/TaxTier';
import { TaxTiersRepoImpl } from '../../../../../src/shell/repositories/tax-tiers/TaxTiersRepoImpl';
import { assert } from 'chai';
import { mapTaxTierFormToTaxTierCreationRequest } from '../../../../../src/shell/repositories/tax-tiers/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { taxTierCreationResponseStub } from '@survv/api/stubs/tax-tiers';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('TaxTierCreationPM', function () {
  it('submits the form when the form is valid', async function () {
    const pm = new TaxTierCreationPM({
      taxTiersRepo: new TaxTiersRepoImpl(),
      notificationService,
    });

    assert.isFalse(pm.canSubmit);

    pm.form.displayName = { en: 'en', ar: 'ar' };
    pm.form.percentage = 30;

    const taxTierCreationStub = taxTierCreationResponseStub();
    taxTierCreationStub.tierId = 123;

    await wiremock
      .stub<TaxTierCreationRequest, TaxTierCreationResponse>()
      .request({
        requestLine: 'post /api/v1/vat-tiers',
        body: mapTaxTierFormToTaxTierCreationRequest(pm.form),
      })
      .response({ status: 200, body: taxTierCreationStub });

    assert.isTrue(pm.canSubmit);

    const submitted = await pm.submit();

    assert.isTrue(submitted);
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });
  it('notifies failed form submissions and returns false', async function () {
    const pm = new TaxTierCreationPM({
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
