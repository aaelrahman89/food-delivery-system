import { $sb } from '@survv/commons/test/utils/sandbox';
import { CustomerAddressRepoImpl } from '../../../../../src/shell/repositories/customers/CustomerAddressRepoImpl';
import { CustomerDetailsPM } from '../../../../../src/core/presentation-models/customers/CustomerDetailsPM';
import { CustomersRepoImpl } from '../../../../../src/shell/repositories/customers/CustomersRepoImpl';
import {
  GetConsumerCustomerByIdRequest,
  GetConsumerCustomerByIdResponse,
  ListConsumerCustomerAddressesRequest,
  ListConsumerCustomerAddressesResponse,
} from '@survv/api/definitions/customers';
import { LocalError } from '@survv/commons/core/errors/errors';
import {
  OrdersListV2Request,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import {
  SingleFileRequest,
  SingleFileResponse,
} from '@survv/api/definitions/files';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { listConsumerCustomerAddressesResponseStub } from '@survv/api/stubs/customers';
import {
  mapCustomerByIdResponseToCustomer,
  mapListBusinessCustomerAddressesResponseToCustomerAddressList,
} from '../../../../../src/shell/repositories/customers/mappers/responses';
import { mapOrdersListV2ResponseToOrders } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { ordersListV2ResponseStub } from '@survv/api/stubs/orders';
import { singleFileResponseStub } from '@survv/api/stubs/files';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CustomerDetailsPM', function () {
  let pm: CustomerDetailsPM;
  const dummyCustomer = {
    id: 12345,
    imageId: 12345,
    name: 'Ahmed Ibrahim',
    mobileNo: '01011535977',
  };
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });

  const customersRepo = new CustomersRepoImpl();
  const customerAddressRepo = new CustomerAddressRepoImpl();
  const ordersRepo = new OrdersRepoImpl();

  async function setup() {
    await wiremock
      .stub<GetConsumerCustomerByIdRequest, GetConsumerCustomerByIdResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/customers/:customerId',
        params: { customerId: dummyCustomer.id },
      })
      .response({
        status: 200,
        body: {
          id: dummyCustomer.id,
          ledgerId: 2165529378315486700,
          mobileNo: '01112345678',
          name: 'Test',
          firstName: 'Bakka',
          lastName: 'Dassa',
          imageId: dummyCustomer.imageId,
          email: 'test@virgingates.com',
          birthDate: '2018-09-05T19:04:53.178Z',
          gender: 'MALE',
          balance: {
            amount: 31.01,
            currency: 'EGP',
          },
          favoriteVendors: [123654789],
          deviceToken:
            'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
          addresses: [
            {
              id: 2165529378315486700,
              title: 'Address 1',
              countryId: 2165529378315486700,
              cityId: 2165529378315486700,
              areaId: 2165529378315486700,
              addressLine1: 'Abdulaziz Al Saud, Al Manial',
              building: '12/60',
              floor: 3,
              apartmentNo: '1A',
              companyName: 'VirginGates',
              landmark: 'string',
              pinnedLocation: {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
              status: 'ACTIVE',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
          referralCode: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            status: 'REFEREE',
          },
        },
      });

    await wiremock
      .stub<
        ListConsumerCustomerAddressesRequest,
        ListConsumerCustomerAddressesResponse
      >()
      .request({
        requestLine: 'get /consumer/api/v1/customers/:customerId/addresses',
        params: { customerId: dummyCustomer.id },
      })
      .response({
        status: 200,
        body: listConsumerCustomerAddressesResponseStub(),
      });

    await wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            filter: {
              customerId: dummyCustomer.id,
            },
            filterMap: {
              customerId: {
                fieldName: 'customerId',
                operator: filterOperators.EQUAL,
              },
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: ordersListV2ResponseStub(),
      });

    await wiremock
      .stub<SingleFileRequest, SingleFileResponse>()
      .request({
        requestLine: 'get /api/v1/files/:fileId',
        params: { fileId: dummyCustomer.imageId },
      })
      .response({
        status: 200,
        body: singleFileResponseStub(),
      });
  }

  beforeEach(function () {
    pm = new CustomerDetailsPM({
      customerId: dummyCustomer.id,
      customersRepo,
      customerAddressRepo,
      ordersRepo,
      notificationService,
    });
  });

  it('hydrates the customer successfully and fetches the image if imageId exists', async function () {
    await setup();

    await wiremock
      .stub<GetConsumerCustomerByIdRequest, GetConsumerCustomerByIdResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/customers/:customerId',
        params: { customerId: dummyCustomer.id },
      })
      .response({
        status: 200,
        body: {
          id: dummyCustomer.id,
          ledgerId: 2165529378315486700,
          mobileNo: '01112345678',
          name: 'Test',
          firstName: 'Bakka',
          lastName: 'Dassa',
          imageId: dummyCustomer.imageId,
          email: 'test@virgingates.com',
          birthDate: '2018-09-05T19:04:53.178Z',
          gender: 'MALE',
          balance: {
            amount: 31.01,
            currency: 'EGP',
          },
          favoriteVendors: [123654789],
          deviceToken:
            'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
          addresses: [
            {
              id: 2165529378315486700,
              title: 'Address 1',
              countryId: 2165529378315486700,
              cityId: 2165529378315486700,
              areaId: 2165529378315486700,
              addressLine1: 'Abdulaziz Al Saud, Al Manial',
              building: '12/60',
              floor: 3,
              apartmentNo: '1A',
              companyName: 'VirginGates',
              landmark: 'string',
              pinnedLocation: {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
              status: 'ACTIVE',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
          referralCode: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            status: 'REFEREE',
          },
        },
      });

    const handleImageSpy = $sb.spy(CustomersRepoImpl.prototype, '_handleImage');

    await pm.init();

    $sb.assert.called(handleImageSpy);
    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.customer,
      mapCustomerByIdResponseToCustomer(
        {
          id: dummyCustomer.id,
          ledgerId: 2165529378315486700,
          mobileNo: '01112345678',
          name: 'Test',
          firstName: 'Bakka',
          lastName: 'Dassa',
          imageId: dummyCustomer.imageId,
          email: 'test@virgingates.com',
          birthDate: '2018-09-05T19:04:53.178Z',
          gender: 'MALE',
          balance: {
            amount: 31.01,
            currency: 'EGP',
          },
          favoriteVendors: [123654789],
          deviceToken:
            'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
          addresses: [
            {
              id: 2165529378315486700,
              title: 'Address 1',
              countryId: 2165529378315486700,
              cityId: 2165529378315486700,
              areaId: 2165529378315486700,
              addressLine1: 'Abdulaziz Al Saud, Al Manial',
              building: '12/60',
              floor: 3,
              apartmentNo: '1A',
              companyName: 'VirginGates',
              landmark: 'string',
              pinnedLocation: {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
              status: 'ACTIVE',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
          referralCode: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            status: 'REFEREE',
          },
        },
        'string'
      )
    );
  });
  it('does not call the files endpoint if imageId exists', async function () {
    await setup();

    await wiremock
      .stub<GetConsumerCustomerByIdRequest, GetConsumerCustomerByIdResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/customers/:customerId',
        params: { customerId: dummyCustomer.id },
      })
      .response({
        status: 200,
        body: {
          id: dummyCustomer.id,
          ledgerId: 2165529378315486700,
          mobileNo: '01112345678',
          name: 'Test',
          firstName: 'Bakka',
          lastName: 'Dassa',
          imageId: 0,
          email: 'test@virgingates.com',
          birthDate: '2018-09-05T19:04:53.178Z',
          gender: 'MALE',
          balance: {
            amount: 31.01,
            currency: 'EGP',
          },
          favoriteVendors: [123654789],
          deviceToken:
            'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
          addresses: [
            {
              id: 2165529378315486700,
              title: 'Address 1',
              countryId: 2165529378315486700,
              cityId: 2165529378315486700,
              areaId: 2165529378315486700,
              addressLine1: 'Abdulaziz Al Saud, Al Manial',
              building: '12/60',
              floor: 3,
              apartmentNo: '1A',
              companyName: 'VirginGates',
              landmark: 'string',
              pinnedLocation: {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
              status: 'ACTIVE',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
          referralCode: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            status: 'REFEREE',
          },
        },
      });

    const handleImageSpy = $sb.spy(CustomersRepoImpl.prototype, '_handleImage');

    await pm.init();

    $sb.assert.notCalled(handleImageSpy);
    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.customer,
      mapCustomerByIdResponseToCustomer(
        {
          id: dummyCustomer.id,
          ledgerId: 2165529378315486700,
          mobileNo: '01112345678',
          name: 'Test',
          firstName: 'Bakka',
          lastName: 'Dassa',
          imageId: 0,
          email: 'test@virgingates.com',
          birthDate: '2018-09-05T19:04:53.178Z',
          gender: 'MALE',
          balance: {
            amount: 31.01,
            currency: 'EGP',
          },
          favoriteVendors: [123654789],
          deviceToken:
            'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
          addresses: [
            {
              id: 2165529378315486700,
              title: 'Address 1',
              countryId: 2165529378315486700,
              cityId: 2165529378315486700,
              areaId: 2165529378315486700,
              addressLine1: 'Abdulaziz Al Saud, Al Manial',
              building: '12/60',
              floor: 3,
              apartmentNo: '1A',
              companyName: 'VirginGates',
              landmark: 'string',
              pinnedLocation: {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
              status: 'ACTIVE',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
          referralCode: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            status: 'REFEREE',
          },
        },
        ''
      )
    );
  });
  it('hydrates the customer addresses successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.addresses,
      mapListBusinessCustomerAddressesResponseToCustomerAddressList(
        listConsumerCustomerAddressesResponseStub()
      )
    );
  });
  it('hydrates the customer tasks successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.orders,
      mapOrdersListV2ResponseToOrders(ordersListV2ResponseStub())
    );
  });
  it('notifies initialization errors', async function () {
    await setup();

    $sb.stub(CustomersRepoImpl.prototype, 'getCustomerById').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('notifies refresh errors', async function () {
    await setup();

    $sb.stub(CustomersRepoImpl.prototype, 'getCustomerById').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
