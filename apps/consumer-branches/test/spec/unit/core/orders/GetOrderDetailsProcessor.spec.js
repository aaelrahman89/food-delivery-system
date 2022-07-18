import GetOrderDetailsProcessor from '../../../../../src/core/deprecated/orders/GetOrderDetailsProcessor';
import NetworkService from '../../../../../src/shell/services-deprecated/network/NetworkService';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Money } from '@survv/commons/core/models/money';
import { assert } from 'chai';
import { createUrl } from '../../../../utils';
import { survvEndpoints } from '../../../../../src/core/deprecated/survv.nc';

describe('GetOrderDetailsProcessor Unit', function () {
  it('should call network service correctly and return mapped result', async function () {
    const p = new GetOrderDetailsProcessor({ orderId: 123 });

    const networkServiceMock = $sb
      .mock(NetworkService)
      .expects('get')
      .once()
      .withExactArgs(createUrl(survvEndpoints.ORDER, { orderId: 123 }))
      .returns({
        customerOrderId: 'FG12X',
        status: 'REQUESTED',
        items: [
          {
            price: {
              amount: 75.5,
              currency: 'EGP',
            },
            totalPrice: {
              amount: 75.5,
              currency: 'EGP',
            },
            options: [
              {
                selections: [
                  {
                    price: {
                      amount: 75.5,
                      currency: 'EGP',
                    },
                  },
                ],
              },
              {
                selections: [
                  {
                    price: {
                      amount: 75.5,
                      currency: 'EGP',
                    },
                  },
                ],
              },
            ],
          },
          {
            price: {
              amount: 75.5,
              currency: 'EGP',
            },
            totalPrice: {
              amount: 75.5,
              currency: 'EGP',
            },
            options: [],
          },
        ],
        subTotal: {
          amount: 75.5,
          currency: 'EGP',
        },
        deliveryFees: {
          amount: 75.5,
          currency: 'EGP',
        },
        tax: {
          amount: 75.5,
          currency: 'EGP',
        },
        taxWithoutDeliveryFees: {
          amount: 75.5,
          currency: 'EGP',
        },
        totalWithoutDeliveryFees: {
          amount: 75.5,
          currency: 'EGP',
        },
        total: {
          amount: 75.5,
          currency: 'EGP',
        },
      });

    const result = await p.execute();

    networkServiceMock.verify();

    assert.deepEqual(result, {
      customerOrderId: new CustomerOrderId('FG12X'),
      status: 'REQUESTED',
      items: [
        {
          price: new Money({ amount: 75.5, currency: 'EGP' }),
          totalPrice: new Money({ amount: 75.5, currency: 'EGP' }),
          options: [
            {
              selections: [
                {
                  price: new Money({ amount: 75.5, currency: 'EGP' }),
                },
              ],
            },
            {
              selections: [
                {
                  price: new Money({ amount: 75.5, currency: 'EGP' }),
                },
              ],
            },
          ],
        },
        {
          price: new Money({ amount: 75.5, currency: 'EGP' }),
          totalPrice: new Money({ amount: 75.5, currency: 'EGP' }),
          options: [],
        },
      ],
      subTotal: new Money({ amount: 75.5, currency: 'EGP' }),
      deliveryFees: new Money({ amount: 75.5, currency: 'EGP' }),
      tax: new Money({ amount: 75.5, currency: 'EGP' }),
      taxWithoutDeliveryFees: new Money({ amount: 75.5, currency: 'EGP' }),
      totalWithoutDeliveryFees: new Money({ amount: 75.5, currency: 'EGP' }),
      total: new Money({ amount: 75.5, currency: 'EGP' }),
    });
  });
});
