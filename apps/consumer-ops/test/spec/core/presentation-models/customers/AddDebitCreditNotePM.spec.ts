import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  AddCreditNoteRequest,
  AddCreditNoteResponse,
  AddDebitNoteRequest,
  AddDebitNoteResponse,
} from '@survv/api/definitions/customers';
import { AddDebitCreditNotePM } from '../../../../../src/core/presentation-models/customers/AddDebitCreditNotePM';
import { CustomersRepoImpl } from '../../../../../src/shell/repositories/customers/CustomersRepoImpl';
import { LocalError } from '@survv/commons/core/errors/errors';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import {
  customerAddCreditNoteRequestStub,
  customerAddDebitNoteRequestStub,
} from '@survv/api/stubs/customers';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('AddDebitCreditNotePM', function () {
  let pm: AddDebitCreditNotePM;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const customerId = 123;
  const customersRepo = new CustomersRepoImpl();

  async function setup() {
    await wiremock
      .stub<AddDebitNoteRequest, AddDebitNoteResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/customers/:customerId/debit',
        params: { customerId },
        body: customerAddDebitNoteRequestStub(),
      })
      .response({ status: 200 });

    await wiremock
      .stub<AddCreditNoteRequest, AddCreditNoteResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/customers/:customerId/credit',
        params: { customerId },
        body: customerAddCreditNoteRequestStub(),
      })
      .response({ status: 200 });

    pm = new AddDebitCreditNotePM({
      customerId,
      customersRepo,
      notificationService,
    });
  }
  beforeEach(function () {
    pm = new AddDebitCreditNotePM({
      customerId,
      customersRepo,
      notificationService,
    });
  });

  it('submits the debit note form when the form is valid', async function () {
    await setup();

    assert.isFalse(pm.debitForm.submittable);

    const customerAddDebitNoteStub = customerAddDebitNoteRequestStub();

    pm.debitForm.description = customerAddDebitNoteStub.description;
    pm.debitForm.amount = customerAddDebitNoteStub.amount;

    assert.isTrue(pm.debitForm.submittable);

    const submitted = await pm.debitForm.submit();

    assert.isTrue(submitted);
    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('resets the debit note form successfully', async function () {
    await setup();

    assert.isFalse(pm.debitForm.submittable);

    pm.debitForm.description = 'test';
    pm.debitForm.amount = 30;

    assert.isTrue(pm.debitForm.submittable);

    pm.reset();

    assert.isFalse(pm.debitForm.submittable);
  });
  it('notifies failure if add debit form action fails', async function () {
    $sb.stub(CustomersRepoImpl.prototype, 'addDebitNote').rejects(error);

    const customerAddDebitNoteStub = customerAddDebitNoteRequestStub();

    pm.debitForm.description = customerAddDebitNoteStub.description;
    pm.debitForm.amount = customerAddDebitNoteStub.amount;

    assert.isTrue(pm.debitForm.submittable);

    const submitted = await pm.debitForm.submit();

    assert.isFalse(submitted);
    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('submits the credit note form when the form is valid', async function () {
    await setup();

    assert.isFalse(pm.creditForm.submittable);

    const customerAddCreditNoteStub = customerAddCreditNoteRequestStub();

    pm.creditForm.description = customerAddCreditNoteStub.description;
    pm.creditForm.amount = customerAddCreditNoteStub.amount;

    assert.isTrue(pm.creditForm.submittable);

    const submitted = await pm.creditForm.submit();

    assert.isTrue(submitted);
    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('resets the credit note form successfully', async function () {
    await setup();

    assert.isFalse(pm.creditForm.submittable);

    pm.creditForm.description = 'test';
    pm.creditForm.amount = 30;

    assert.isTrue(pm.creditForm.submittable);

    pm.reset();

    assert.isFalse(pm.creditForm.submittable);
  });
  it('notifies failure if add credit form action fails', async function () {
    $sb.stub(CustomersRepoImpl.prototype, 'addCreditNote').rejects(error);

    const customerAddCreditNoteStub = customerAddCreditNoteRequestStub();

    pm.creditForm.description = customerAddCreditNoteStub.description;
    pm.creditForm.amount = customerAddCreditNoteStub.amount;

    assert.isTrue(pm.creditForm.submittable);

    const submitted = await pm.creditForm.submit();

    assert.isFalse(submitted);
    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
