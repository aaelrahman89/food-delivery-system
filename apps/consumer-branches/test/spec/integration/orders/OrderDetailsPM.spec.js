import OrderDetailsPM from '../../../../src/core/deprecated/orders/OrderDetailsPM';
import { assert } from 'chai';
import { mockUrl, wiremock } from '../../../utils';
import { survvEndpoints } from '../../../../src/core/deprecated/survv.nc';

describe('OrderDetailsUnitPM Integration', function () {
  it('should hydrate correctly', async function () {
    const pm = new OrderDetailsPM({ orderId: 123 });

    await wiremock
      .stub()
      .request('get', mockUrl(survvEndpoints.ORDER_JOURNEY, { orderId: 1234 }))
      .reply(200, {
        orderId: 2165529378315486700,
        status: 'REQUESTED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 600,
        rejectionDate: '2018-09-05T19:04:53.178Z',
        tillRejectionDuration: 300,
        pilotRequestDate: '2018-09-05T19:04:53.178Z',
        tillRequestingPilotDuration: 100,
        collectionDate: '2018-09-05T19:04:53.178Z',
        tillCollectionDuration: 200,
        deliveryDate: '2018-09-05T19:04:53.178Z',
        tillDeliveryDuration: 300,
        cancellationDate: '2018-09-05T19:04:53.178Z',
      });

    await wiremock
      .stub()
      .request('get', mockUrl(survvEndpoints.ORDER, { orderId: 123 }))
      .reply(200, {
        orderId: 2165529378315486700,
        vendorId: 2165529378315486700,
        customerOrderId: 'AX7F8W',
        vendorTaskId: '123',
        creationDate: '2018-09-05T19:04:53.178Z',
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        status: 'REQUESTED',
        notes: 'add Ketchup',
        items: [
          {
            itemId: 2165529378315486700,
            title: {
              en: 'item title',
              ar: 'اسم العنصر',
            },
            price: 75.5,
            totalPrice: 75.5,
            quantity: 5,
            notes: 'KFC',
            options: [
              {
                optionId: 2165529378315486700,
                title: {
                  en: 'option title',
                  ar: 'اسم اختيار',
                },
                selections: [
                  {
                    selectionId: 2165529378315486700,
                    title: {
                      en: 'selection title',
                      ar: 'بند',
                    },
                    price: 75.5,
                  },
                ],
              },
            ],
          },
        ],
        subTotal: 75.5,
        deliveryFees: 10,
        tax: 10,
        total: 9999.99,
        branchId: 2165529378315486700,
        customerId: 2165529378315486700,
        addressId: 2165529378315486700,
        coverPhotosIds: [2165529378315486700],
        branchLabel: 'Manial Branch',
      });

    assert.isUndefined(pm.notification);
  });
});
