import BranchOrdersListProcessor from '../../../../src/core/deprecated/orders/BranchOrdersListProcessor';
import OrdersListPM from '../../../../src/core/deprecated/orders/OrdersListPM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchesRepoImpl } from '../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { LocalError } from '@survv/commons/core/errors/errors';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../../../src/core/notification';
import { helpers, wiremock } from '../../../utils';
import { mockConsumerUrl } from '../../../utils/mockUrl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { survvEndpoints } from '../../../../src/core/deprecated/survv.nc';

describe('OrdersListPM Integration', function () {
  it('hydrates orders successfully', async function () {
    await authTokenRepo.saveToken(helpers.fakeJwt({ sub: 7177 }));
    const pm = new OrdersListPM({ notificationService });

    await wiremock
      .stub()
      .request(
        'get',
        mockConsumerUrl(
          survvEndpoints.BRANCH_ORDERS,
          { branchId: 7177 },
          {
            query: {
              vgql: 'v1',
              sort: {
                elements: [
                  {
                    field: 'creationDate',
                    order: 'Desc',
                  },
                ],
              },
              skip: 0,
              limit: 25,
            },
          }
        )
      )
      .reply(200, {
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 0,
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
            branchId: 7177,
            vendorId: 2165529378315486700,
            addressId: 2165529378315486700,
            paymentMethod: 'Cash',
            notes: 'add Ketchup',
            subTotal: 75.5,
            tax: 10,
            taxWithoutDeliveryFees: {
              amount: 10,
              currency: 'EGP',
            },
            deliveryFees: 10,
            totalWithoutDeliveryFees: {
              amount: 10,
              currency: 'EGP',
            },
            scheduled: false,
            scheduledTo: {
              from: '',
              to: '',
            },
            total: 10,
            vendorOrderId: '123',
            status: 'REQUESTED',
            type: 'B2C',
          },
        ],
      });

    await wiremock
      .stub()
      .request(
        'get',
        mockConsumerUrl(survvEndpoints.BRANCH, { branchId: 7177 })
      )
      .reply(200, {
        id: 2165529378315486700,
        hubId: 2165529378315486700,
        vendorId: 2165529378315486700,
        notificationToken:
          'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
        label: 'McDonald',
        active: false,
        vendorName: 'McDonald',
        vendorType: 'FOOD',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        address: {
          countryId: 2165529378315486700,
          cityId: 2165529378315486700,
          areaId: 2165529378315486700,
          street: 'Abdulaziz Al Saud, Al Manial',
          building: '12/60',
          floor: 3,
          apartmentNo: '1A',
          companyName: 'VirginGates',
          landmark: 'string',
          geoLocation: {
            latitude: 31.01,
            longitude: 31.02,
          },
        },
        avgTransactionPerMonth: 50,
        avgTransactionPerDay: 50,
        avgTransactionPerHour: 50,
        creationDate: '2018-09-05T19:04:53.178Z',
        contactPersons: [
          {
            fullName: 'Bakaka Dassa',
            mobileNo: '1062131123123',
            email: 'example@domain.com',
            title: 'Dassa',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        rushHour: [
          {
            from: '19:04:53',
            to: '19:04:53',
          },
        ],
        minimumOrderValue: 10,
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        notificationSubscription: {
          auth: 'IOScBh9LW5mJ_K2JwXyNqQ==',
          key: 'ANlfcVVFB4JiMYcI74_h9h04QZ1Ks96AyEa1yrMgDwn3',
          endpoint:
            'https://fcm.googleapis.com/fcm/send/fH-M3xRoLms:APA91bGB0rkNdxTFsXaJGyyyY7LtEmtHJXy8EqW48zSssxDXXACWCvc9eXjBVU54nrBkARTj4Xvl303PoNc0_rwAMrY9dvkQzi9fkaKLP0vlwoB0uqKygPeL77Y19VYHbj_v_FolUlHa',
        },
        tags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            type: 'NONE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        hashTags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        b2cStatus: 'BUSY_TWO_HOUR',
        avgBasketSize: {
          amount: 31.01,
          currency: 'EGP',
        },
        stacking: true,
        maxStackedOrders: 10,
        stackingWindowInMinutes: 30,
      });

    await pm.init();

    assert.isDefined(pm.vendorType);
    assert.isUndefined(notificationService.notification);
  });
  it('notifies error on hydration failure', async function () {
    const pm = new OrdersListPM({ notificationService });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    $sb.stub(BranchOrdersListProcessor.prototype, 'execute').rejects(error);
    $sb.stub(BranchesRepoImpl.prototype, 'getBranchDetails').resolves();

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
