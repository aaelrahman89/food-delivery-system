import { $sb } from '@survv/commons/test/utils/sandbox';
import { CustomersRepoImpl } from '../../../../../src/shell/repositories/customers/CustomersRepoImpl';
import {
  DebitCreditNotesListRequest,
  DebitCreditNotesListResponse,
} from '@survv/api/definitions/customers';
import { DebitCreditNotesPM } from '../../../../../src/core/presentation-models/customers/DebitCreditNotesPM';
import { LocalError } from '@survv/commons/core/errors/errors';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { customerDebitCreditNotesListResponseStub } from '@survv/api/stubs/customers';
import { mapDebitCreditNotesToList } from '../../../../../src/shell/repositories/customers/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { queryMapper } from '@survv/commons/core/models/Query';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('DebitCreditNotesPM', function () {
  let pm: DebitCreditNotesPM;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const customerId = 123415;
  const customersRepo = new CustomersRepoImpl();

  async function setup() {
    await wiremock
      .stub<DebitCreditNotesListRequest, DebitCreditNotesListResponse>()
      .request({
        requestLine:
          'get /consumer/api/v1/customers/:customerId/debit-credit-notes',
        params: { customerId },
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
        body: customerDebitCreditNotesListResponseStub(),
      });
    pm = new DebitCreditNotesPM({
      customerId,
      notificationService,
      customersRepo,
    });
  }
  beforeEach(function () {
    pm = new DebitCreditNotesPM({
      customerId,
      notificationService,
      customersRepo,
    });
  });

  it('hydrates the list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.list.items.length, 0);
  });
  it('notifies error on hydration failure', async function () {
    await setup();

    $sb.stub(customersRepo, 'getDebitCreditNotesList').rejects(error);
    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('opens & closes debit note form', function () {
    pm.openDebitNoteForm();
    assert.isTrue(pm.shouldOpenDebitNoteForm);

    pm.closeDebitNoteForm();
    assert.isFalse(pm.shouldOpenDebitNoteForm);
  });

  it('opens & closes credit note form', function () {
    pm.openCreditNoteForm();
    assert.isTrue(pm.shouldOpenCreditNoteForm);

    pm.closeCreditNoteForm();
    assert.isFalse(pm.shouldOpenCreditNoteForm);
  });

  it('refreshes the debit credit notes list and closes the debit note form on submit', async function () {
    $sb
      .stub(CustomersRepoImpl.prototype, 'getDebitCreditNotesList')
      .resolves(
        mapDebitCreditNotesToList(customerDebitCreditNotesListResponseStub())
      );

    await pm.onDebitNoteFormSubmitted();

    assert.isFalse(pm.shouldOpenDebitNoteForm);
    assert.deepEqual(
      pm.list,
      mapDebitCreditNotesToList(customerDebitCreditNotesListResponseStub())
    );
    assert.isUndefined(notificationService.notification);
  });
  it('refreshes the debit credit notes list and closes the credit note form on submit', async function () {
    $sb
      .stub(CustomersRepoImpl.prototype, 'getDebitCreditNotesList')
      .resolves(
        mapDebitCreditNotesToList(customerDebitCreditNotesListResponseStub())
      );

    await pm.openCreditNoteForm();

    assert.isTrue(pm.shouldOpenCreditNoteForm);

    await pm.onCreditNoteFormSubmitted();

    assert.isFalse(pm.shouldOpenCreditNoteForm);
    assert.deepEqual(
      pm.list,
      mapDebitCreditNotesToList(customerDebitCreditNotesListResponseStub())
    );
    assert.isUndefined(notificationService.notification);
  });
  it('refreshes successfully', async function () {
    await setup();
    const repoSpy = $sb.spy(customersRepo, 'getDebitCreditNotesList');
    await pm.init();
    await pm.onPaginationUpdate({
      skip: 0,
      limit: 25,
    });

    $sb.assert.calledTwice(repoSpy);
  });
  it('notifies error on refresh failure', async function () {
    await setup();

    await pm.init();

    $sb.stub(customersRepo, 'getDebitCreditNotesList').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
