import { $sb } from '@survv/commons/test/utils/sandbox';
import { CustomersListPM } from '../../../../../src/core/presentation-models/customers/CustomersListPM';
import {
  CustomersListRequest,
  CustomersListResponse,
} from '@survv/api/definitions/customers';
import { CustomersRepoImpl } from '../../../../../src/shell/repositories/customers/CustomersRepoImpl';
import { LocalError } from '@survv/commons/core/errors/errors';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { listCustomersResponseStub } from '@survv/api/stubs/customers';
import { mapCustomerListResponseToCustomers } from '../../../../../src/shell/repositories/customers/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { queryMapper } from '@survv/commons/core/models/Query';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CustomersListPM', function () {
  let pm: CustomersListPM;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });

  const customersRepo = new CustomersRepoImpl();

  async function setup() {
    await wiremock
      .stub<CustomersListRequest, CustomersListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/customers',
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
        body: listCustomersResponseStub(),
      });
  }

  beforeEach(function () {
    pm = new CustomersListPM({
      customersRepo,
      notificationService,
    });
  });

  it('hydrates the list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.list,
      mapCustomerListResponseToCustomers(listCustomersResponseStub())
    );
  });
  it('notifies initialization errors', async function () {
    await setup();

    $sb.stub(CustomersRepoImpl.prototype, 'listCustomers').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('notifies refresh errors', async function () {
    await setup();

    $sb.stub(CustomersRepoImpl.prototype, 'listCustomers').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
