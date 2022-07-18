import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';
import { TaxTierCreationPM } from '../../../../../src/core/presentation-models/tax-tiers/TaxTierCreationPM';
import { TaxTierUpdatePM } from '../../../../../src/core/presentation-models/tax-tiers/TaxTierUpdatePM';
import { TaxTiersListPM } from '../../../../../src/core/presentation-models/tax-tiers/TaxTiersListPM';
import {
  TaxTiersListRequest,
  TaxTiersListResponse,
} from '@survv/api/definitions/tax-tiers';
import { TaxTiersRepoImpl } from '../../../../../src/shell/repositories/tax-tiers/TaxTiersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { mapTaxTiersListResponseToTaxTiersItemsList } from '../../../../../src/shell/repositories/tax-tiers/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { queryMapper } from '@survv/commons/core/models/Query';
import { taxTiersListResponseStub } from '@survv/api/stubs/tax-tiers';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('TaxTiersListPM', function () {
  let pm: TaxTiersListPM;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const taxTiersRepo = new TaxTiersRepoImpl();

  async function setup() {
    await wiremock
      .stub<TaxTiersListRequest, TaxTiersListResponse>()
      .request({
        requestLine: 'get /api/v1/vat-tiers',
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
        body: taxTiersListResponseStub(),
      });

    pm = new TaxTiersListPM({
      taxTiersRepo,
      notificationService,
    });
  }

  beforeEach(function () {
    pm = new TaxTiersListPM({
      taxTiersRepo,
      notificationService,
    });
  });

  it('hydrates the list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.list,
      mapTaxTiersListResponseToTaxTiersItemsList(taxTiersListResponseStub())
    );
  });
  it('notifies initialization errors', async function () {
    await setup();

    $sb.stub(TaxTiersRepoImpl.prototype, 'listTiers').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('notifies refresh errors', async function () {
    await setup();

    $sb.stub(TaxTiersRepoImpl.prototype, 'listTiers').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('opens tier creation form successfully', async function () {
    await setup();

    assert.isFalse(pm.shouldOpenTaxTierCreationForm);

    await pm.openTaxTierCreationForm();

    assert.isTrue(pm.shouldOpenTaxTierCreationForm);
  });
  it('opens tier update form and inits successfully', async function () {
    await setup();

    const updatePMStub = $sb.stub(TaxTierUpdatePM.prototype, 'init').resolves();

    assert.isFalse(pm.shouldOpenTaxTierUpdateForm);

    await pm.openTaxTierUpdateForm(123);

    assert.isTrue(pm.shouldOpenTaxTierUpdateForm);
    assert.isTrue(updatePMStub.calledOnce);
  });
  it('refreshes the tax tiers list and closes and resets the tax tier creation form on submit', async function () {
    $sb
      .stub(TaxTiersRepoImpl.prototype, 'listTiers')
      .resolves(
        mapTaxTiersListResponseToTaxTiersItemsList(taxTiersListResponseStub())
      );

    const resetFormStub = $sb
      .stub(TaxTierCreationPM.prototype, 'reset')
      .resolves();

    await pm.openTaxTierCreationForm();

    await pm.onTaxTierCreationFormSubmit();

    assert.deepEqual(
      pm.list,
      mapTaxTiersListResponseToTaxTiersItemsList(taxTiersListResponseStub())
    );
    assert.isTrue(resetFormStub.calledOnce);
  });
  it('refreshes the tax tiers list and closes and resets the tax tier update form on submit', async function () {
    $sb
      .stub(TaxTiersRepoImpl.prototype, 'listTiers')
      .resolves(
        mapTaxTiersListResponseToTaxTiersItemsList(taxTiersListResponseStub())
      );

    const resetFormStub = $sb
      .stub(TaxTierUpdatePM.prototype, 'reset')
      .resolves();

    await pm.openTaxTierUpdateForm(123);

    await pm.onTaxTierUpdateFormSubmit();

    assert.deepEqual(
      pm.list,
      mapTaxTiersListResponseToTaxTiersItemsList(taxTiersListResponseStub())
    );
    assert.isTrue(resetFormStub.calledOnce);
  });
});
