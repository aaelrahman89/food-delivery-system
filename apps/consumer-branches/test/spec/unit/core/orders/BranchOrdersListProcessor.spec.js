import BranchOrdersListProcessor from '../../../../../src/core/deprecated/orders/BranchOrdersListProcessor';
import NetworkService from '../../../../../src/shell/services-deprecated/network/NetworkService';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { Time } from '@survv/commons/core/models/Time';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  createConsumerUrl,
  survvEndpoints,
} from '../../../../../src/core/deprecated/survv.nc';
import { filterOperators } from '@survv/commons/core/models/Query';
import { helpers } from '../../../../utils';

describe('BranchOrdersListProcessor Unit', function () {
  it('should call network service with correct params and return the result', async function () {
    await authTokenRepo.saveToken(helpers.fakeJwt({ sub: 7769 }));
    const currentUnixTime = Date.now();

    $sb.stub(Date, 'now').returns(currentUnixTime);

    const p = new BranchOrdersListProcessor({
      query: {
        filter: {
          statuses: ['REQUESTED'],
        },
        filterMap: {
          status: {
            fieldName: 'status',
            operator: filterOperators.EQUAL,
          },
        },
        sort: {
          orderId: 'Asc',
        },
      },
    });

    const networkServiceMock = $sb.mock(NetworkService);
    networkServiceMock
      .expects('get')
      .once()
      .withExactArgs(
        createConsumerUrl(
          survvEndpoints.BRANCH_ORDERS,
          { branchId: 7769 },
          {
            query: {
              vgql: 'v1',
              filter: {
                elements: [
                  {
                    field: 'status',
                    operator: 'in',
                    value: ['REQUESTED'],
                  },
                ],
              },
              sort: {
                elements: [
                  {
                    field: 'orderId',
                    order: 'Asc',
                  },
                ],
              },
            },
          }
        )
      )
      .resolves({
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 1,
          totalReturned: 0,
        },
        orders: [
          {
            orderId: 2165529378315486700,
            items: [
              {
                itemId: 2165529378315486700,
                price: 75.5,
                quantity: 5,
                notes: 'KFC',
                options: [
                  {
                    optionId: 2165529378315486700,
                    selections: [
                      {
                        selectionId: 2165529378315486700,
                        price: 75.5,
                      },
                    ],
                  },
                ],
              },
            ],
            customerOrderId: 'AX7F8W',
            creationDate: '2018-09-05T19:04:53.178Z',
            lastUpdateDate: '2018-09-05T19:04:53.178Z',
            customerId: 2165529378315486700,
            branchId: 2165529378315486700,
            vendorId: 2165529378315486700,
            addressId: 2165529378315486700,
            paymentMethod: 'Cash',
            notes: 'add Ketchup',
            subTotal: 75.5,
            tax: 10,
            deliveryFees: 10,
            totalWithoutDeliveryFees: { amount: 10, currency: 'EGP' },
            scheduled: false,
            scheduledTo: { from: '', to: '' },
            total: 10,
            vendorTaskId: '123',
            status: 'REQUESTED',
            type: 'B2C',
          },
        ],
      });

    const response = await p.execute();

    networkServiceMock.verify();

    assert.deepEqual(response, {
      totalCount: 1,
      orders: [
        {
          orderId: 2165529378315486700,
          items: [
            {
              itemId: 2165529378315486700,
              price: 75.5,
              quantity: 5,
              notes: 'KFC',
              options: [
                {
                  optionId: 2165529378315486700,
                  selections: [
                    {
                      selectionId: 2165529378315486700,
                      price: 75.5,
                    },
                  ],
                },
              ],
            },
          ],
          customerOrderId: new CustomerOrderId('AX7F8W'),
          lastUpdateDate: new Datetime('2018-09-05T19:04:53.178Z'),
          customerId: 2165529378315486700,
          branchId: 2165529378315486700,
          vendorId: 2165529378315486700,
          addressId: 2165529378315486700,
          paymentMethod: 'Cash',
          notes: 'add Ketchup',
          subTotal: 75.5,
          tax: 10,
          deliveryFees: new Money({ amount: 10, currency: 'EGP' }),
          totalWithoutDeliveryFees: new Money({ amount: 10, currency: 'EGP' }),
          total: new Money({ amount: 10, currency: 'EGP' }),
          vendorTaskId: '123',
          status: 'REQUESTED',
          scheduled: false,
          scheduledTo: new HoursRange({ from: new Time(''), to: new Time('') }),
          isB2C: true,
          isC2C: false,
          creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        },
      ],
    });
  });

  it('should not call network service with query if it was undefined', async function () {
    await authTokenRepo.saveToken(helpers.fakeJwt({ sub: 183471 }));

    const p = new BranchOrdersListProcessor({ query: {} });

    const networkServiceMock = $sb.mock(NetworkService);
    networkServiceMock
      .expects('get')
      .once()
      .withExactArgs(
        createConsumerUrl(survvEndpoints.BRANCH_ORDERS, { branchId: 183471 })
      )
      .resolves({
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 0,
          totalReturned: 0,
        },
        orders: [],
      });

    await p.execute();

    networkServiceMock.verify();
  });
});
