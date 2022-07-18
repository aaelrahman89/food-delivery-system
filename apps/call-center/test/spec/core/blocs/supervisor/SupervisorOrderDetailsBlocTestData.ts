import { Address } from '@survv/commons/core/models/Address';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import {
  ConsumerOrderResponse,
  OrderJourneyResponse,
  OrderRejectionReasonsResponse,
} from '@survv/api/definitions/orders';
import { Currency } from '@survv/commons/core/models/money';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Order,
  OrderPaymentMethod,
  OrderStatus,
} from '../../../../../src/core/models/Order';
import {
  OrderJourney,
  OrderJourneyStep,
  OrderJourneyStepStatus,
} from '../../../../../src/core/models/OrderJourney';
import { RejectionReason } from '../../../../../src/core/models/RejectionReason';
import {
  SupervisorOrderDetailsAction,
  SupervisorOrderDetailsMessage,
} from '../../../../../src/core/blocs/supervisor/order-details/SupervisorOrderDetailsMessage';
import { Time } from '@survv/commons/core/models/Time';
import {
  mapOrderJourneyResponseToOrderJourney,
  mapOrderRejectionReasonsResponseToRejectionReasons,
  mapOrderResponseToOrder,
} from '../../../../../src/shell/repositories/orders/mappers/responses';
import {
  orderDetailsResponseStub,
  orderJourneyResponseStub,
} from '@survv/api/stubs/orders';

export function backendOrderDetailsStub(): ConsumerOrderResponse {
  const orderDetailsStubbedResponse = orderDetailsResponseStub();
  orderDetailsStubbedResponse.orderId = 123;
  orderDetailsStubbedResponse.branchId = 123;
  orderDetailsStubbedResponse.branchLabel = 'Branch Label';
  orderDetailsStubbedResponse.branchAreaName = {
    en: 'Manial',
    ar: 'المنيل',
  };
  orderDetailsStubbedResponse.customerOrderId = 'GH65';
  orderDetailsStubbedResponse.customerName = 'Mohamed Omar';
  orderDetailsStubbedResponse.customerMobileNo = '01111111111';
  orderDetailsStubbedResponse.address = {
    ...orderDetailsStubbedResponse.address,
    building: '26',
    addressLine1: 'Grove Street',
    floor: 3,
    apartmentNo: '3A',
    companyName: '',
    landmark: '',
  };
  orderDetailsStubbedResponse.scheduled = true;
  orderDetailsStubbedResponse.scheduledTo = {
    from: '10:00:00',
    to: '11:00:00',
  };
  orderDetailsStubbedResponse.vendorTaskId = 'x32';
  orderDetailsStubbedResponse.status = 'REQUESTED';
  orderDetailsStubbedResponse.items = [
    {
      itemId: 123,
      orderItemId: 123,
      audioId: 123,
      orderItemPhotoIds: [123],
      title: {
        en: 'Main Menu 1',
        ar: 'القائمة الرئيسية',
      },
      price: {
        amount: 31.01,
        currency: 'EGP',
      },
      totalPrice: {
        amount: 31.01,
        currency: 'EGP',
      },
      quantity: 5,
      notes: 'KFC',
      options: [
        {
          optionId: 123,
          title: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          selections: [
            {
              selectionId: 123,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              quantity: 4,
              price: {
                amount: 31.01,
                currency: 'EGP',
              },
              available: true,
            },
          ],
        },
      ],
      available: true,
    },
  ];
  orderDetailsStubbedResponse.assignedAgent = {
    id: 12345,
    email: 'example@example.com',
  };
  orderDetailsStubbedResponse.paymentMethod = 'Cash';
  orderDetailsStubbedResponse.subTotal = {
    amount: 31.01,
    currency: 'EGP',
  };
  orderDetailsStubbedResponse.tax = {
    amount: 31.01,
    currency: 'EGP',
  };
  orderDetailsStubbedResponse.deliveryFees = {
    amount: 31.01,
    currency: 'EGP',
  };
  orderDetailsStubbedResponse.total = {
    amount: 31.01,
    currency: 'EGP',
  };
  orderDetailsStubbedResponse.creationDate = '2021-01-01T10:00:00.000Z';
  orderDetailsStubbedResponse.lastUpdateDate = '2021-01-01T10:00:00.000Z';

  return orderDetailsStubbedResponse;
}

export function backendOrderJourneyStub(): OrderJourneyResponse {
  const orderJourneyStubbedResponse = orderJourneyResponseStub();
  orderJourneyStubbedResponse.orderId = 123;
  orderJourneyStubbedResponse.timelineJourney = [
    {
      journeyStopStatus: 'REQUESTED',
      durationInSeconds: 100,
      stopDateTime: '2021-01-01T10:00:00.000Z',
      actionBy: {
        id: 123,
        email: 'example@example.com',
      },
      linkedEntity: {
        entityId: 123,
        entityName: 'PILOT',
      },
      data: {},
    },
    {
      journeyStopStatus: 'REJECTED',
      durationInSeconds: 100,
      stopDateTime: '2021-01-01T10:00:00.000Z',
      actionBy: {
        id: 123,
        email: 'example@example.com',
      },
      linkedEntity: {
        entityId: 123,
        entityName: 'PILOT',
      },
      data: { 'First Data Entry': 'First Data Value' },
    },
    {
      journeyStopStatus: 'REJECTED',
      durationInSeconds: 100,
      stopDateTime: '2021-01-01T10:00:00.000Z',
      actionBy: {
        id: 123,
        email: 'example@example.com',
      },
      linkedEntity: {
        entityId: 123,
        entityName: 'PILOT',
      },
      data: { notes: 'First Data Value', busyFor: '5h' },
    },
  ];

  return orderJourneyStubbedResponse;
}

export function backendRejectionReasonsStub(): OrderRejectionReasonsResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    rejectionReasons: [
      {
        id: 2165529378315486700,
        label: 'Vendor closed',
        orderTypes: ['B2C', 'ERRANDS'],
      },
      {
        id: 2165529378315486702,
        label: 'Service is down',
        orderTypes: ['B2C', 'ERRANDS'],
      },
    ],
  };
}

export function mappedOrderDetailsStub(): Order {
  return mapOrderResponseToOrder(backendOrderDetailsStub());
}

export function mappedOrderJourneyStub(): OrderJourney {
  return mapOrderJourneyResponseToOrderJourney(backendOrderJourneyStub());
}

export function mappedRejectionReasonsStub(): RejectionReason[] {
  return mapOrderRejectionReasonsResponseToRejectionReasons(
    backendRejectionReasonsStub()
  );
}

export function initializeActionMessages(
  localizationService: LocalizationService
): {
  inCaseInitializeSucceeded: () => InitializeActionSucceededMessages;
  inCaseInitializeFailed: () => InitializeActionFailedMessages;
} {
  return {
    inCaseInitializeSucceeded: (): InitializeActionSucceededMessages => {
      const defaultMessage = new SupervisorOrderDetailsMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): SupervisorOrderDetailsMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorOrderDetailsAction({
            type: 'INITIALIZE',
          });
          msg.state.b2cBranchStatusList = BranchB2CStatus.lookup().map(
            (status) => ({
              label: localizationService.localize(status.toString()),
              value: status.valueOf(),
            })
          );
          msg.orderStatus = 'LOADING';
          msg.journeyStatus = 'LOADING';
          return msg;
        })();
      const initializeOrderDetailsDoneMessage =
        (function constructInitializeDoneMessage(): SupervisorOrderDetailsMessage {
          const msg = initializeLoadingMessage.clone();
          msg.orderStatus = 'IDLE';
          msg.state.order = {
            id: 123,
            branchId: 123,
            branchLabel: 'Branch Label',
            branchArea: localizationService.localize(
              new MultilingualString({
                en: 'Manial',
                ar: 'المنيل',
              })
            ),
            customerOrderId: new CustomerOrderId('GH65').toString(),
            customerName: 'Mohamed Omar',
            customerMobileNo: '01111111111',
            customerAddress: new Address({
              building: '26',
              street: 'Grove Street',
              floor: 3,
              apartment: '3A',
              companyName: '',
              landmark: '',
            }).toString(),
            scheduled: true,
            scheduledTo: new HoursRange({
              from: new Time('10:00:00'),
              to: new Time('11:00:00'),
            }).toString(),
            von: 'x32',
            status: localizationService.localize(new OrderStatus('REQUESTED')),
            items: [
              {
                itemId: 123,
                title: localizationService.localize(
                  new MultilingualString({
                    en: 'Main Menu 1',
                    ar: 'القائمة الرئيسية',
                  })
                ),
                price: `31.01 ${localizationService.localize(
                  new Currency('EGP').toString()
                )}`,
                quantity: '5x',
                options: [
                  {
                    optionId: 123,
                    title: localizationService.localize(
                      new MultilingualString({
                        en: 'Main Menu',
                        ar: 'القائمة الرئيسية',
                      })
                    ),
                    selections: [
                      {
                        selectionId: 123,
                        title: localizationService.localize(
                          new MultilingualString({
                            en: 'Main Menu',
                            ar: 'القائمة الرئيسية',
                          })
                        ),
                        quantity: '4x',
                        price: `31.01 ${localizationService.localize(
                          new Currency('EGP').toString()
                        )}`,
                        isAvailable: true,
                      },
                    ],
                  },
                ],
                isAvailable: true,
              },
            ],
            assignedAgent: {
              id: 12345,
              email: 'example@example.com',
            },
            paymentMethod: localizationService.localize(
              new OrderPaymentMethod('Cash')
            ),
            subtotal: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            tax: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            deliveryFee: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            total: `31.01 ${localizationService.localize(
              new Currency('EGP').toString()
            )}`,
            creationDate: new Datetime(
              '2021-01-01T10:00:00.000Z'
            ).toDatetimeString(),
            lastUpdateDate: new Datetime(
              '2021-01-01T10:00:00.000Z'
            ).toDatetimeString(),
            deliverBy: localizationService.localize(
              'DELIVERY_FLEET_SURVV_FLEET'
            ),
            actionDisplay: true,
          };
          return msg;
        })();
      const initializeOrderJourneyDoneMessage =
        (function constructInitializeDoneMessage(): SupervisorOrderDetailsMessage {
          const msg = initializeLoadingMessage.clone();
          msg.journeyStatus = 'IDLE';
          msg.state.journey = new OrderJourney({
            orderId: 123,
            orderJourney: [
              {
                journeyStopStatus: 'REQUESTED',
                durationInSeconds: 100,
                stopDateTime: '2021-01-01T10:00:00.000Z',
                actionBy: {
                  id: 123,
                  email: 'example@example.com',
                },
                linkedEntity: {
                  entityId: 123,
                  entityName: 'PILOT',
                },
                data: {},
              },
              {
                journeyStopStatus: 'REJECTED',
                durationInSeconds: 100,
                stopDateTime: '2021-01-01T10:00:00.000Z',
                actionBy: {
                  id: 123,
                  email: 'example@example.com',
                },
                linkedEntity: {
                  entityId: 123,
                  entityName: 'PILOT',
                },
                data: { 'First Data Entry': 'First Data Value' },
              },
              {
                journeyStopStatus: 'REJECTED',
                durationInSeconds: 100,
                stopDateTime: '2021-01-01T10:00:00.000Z',
                actionBy: {
                  id: 123,
                  email: 'example@example.com',
                },
                linkedEntity: {
                  entityId: 123,
                  entityName: 'PILOT',
                },
                data: { notes: 'First Data Value', busyFor: '5h' },
              },
            ].map(
              (responseJourneyStep) =>
                ({
                  stepStatus: new OrderJourneyStepStatus(
                    responseJourneyStep.journeyStopStatus
                  ),
                  stepTimeStamp: new Datetime(responseJourneyStep.stopDateTime),
                  stepDuration: responseJourneyStep.durationInSeconds,
                  actionBy: responseJourneyStep.actionBy,
                  linkedEntity: responseJourneyStep.linkedEntity,
                  data: responseJourneyStep.data as unknown as Record<
                    string,
                    string
                  >,
                } as OrderJourneyStep)
            ),
          }).build();
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeOrderDetailsDoneMessage,
        initializeOrderJourneyDoneMessage,
      };
    },
    inCaseInitializeFailed: (): InitializeActionFailedMessages => {
      const defaultMessage = new SupervisorOrderDetailsMessage();
      const initializeLoadingMessage =
        (function constructSecondMessage(): SupervisorOrderDetailsMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorOrderDetailsAction({
            type: 'INITIALIZE',
          });
          msg.state.b2cBranchStatusList = BranchB2CStatus.lookup().map(
            (status) => ({
              label: localizationService.localize(status.toString()),
              value: status.valueOf(),
            })
          );
          msg.orderStatus = 'LOADING';
          msg.journeyStatus = 'LOADING';
          return msg;
        })();
      const initializeOrderDetailsProblematicMessage =
        (function constructThirdMessage(): SupervisorOrderDetailsMessage {
          const msg = initializeLoadingMessage.clone();
          msg.orderStatus = 'ERROR';
          return msg;
        })();
      const initializeOrderJourneyProblematicMessage =
        (function constructThirdMessage(): SupervisorOrderDetailsMessage {
          const msg = initializeLoadingMessage.clone();
          msg.journeyStatus = 'ERROR';
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeOrderDetailsProblematicMessage,
        initializeOrderJourneyProblematicMessage,
      };
    },
  };
}

interface InitializeActionSucceededMessages {
  defaultMessage: SupervisorOrderDetailsMessage;
  initializeLoadingMessage: SupervisorOrderDetailsMessage;
  initializeOrderDetailsDoneMessage: SupervisorOrderDetailsMessage;
  initializeOrderJourneyDoneMessage: SupervisorOrderDetailsMessage;
}
interface InitializeActionFailedMessages {
  defaultMessage: SupervisorOrderDetailsMessage;
  initializeLoadingMessage: SupervisorOrderDetailsMessage;
  initializeOrderDetailsProblematicMessage: SupervisorOrderDetailsMessage;
  initializeOrderJourneyProblematicMessage: SupervisorOrderDetailsMessage;
}
