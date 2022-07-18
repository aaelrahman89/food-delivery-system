import {
  CancellationReasonCategory,
  CancellationReasonsListV2Response,
} from '../definitions/cancellation-reasons';
import {
  ConsumerOrderResponse,
  OrderCalculationResponse,
  OrderJourneyResponse,
  OrderRejectionReasonsResponse,
  OrderResponse,
  OrdersListResponse,
  OrdersListV2Response,
  QueuedOrdersCountsResponse,
  UpdateOrderStatusResponse,
} from '../definitions/orders';

export function ordersListResponseStub(): OrdersListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    orders: [
      {
        orderId: 2165529378315486700,
        tripId: 2165529378315486700,
        items: [
          {
            itemId: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
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
        lastStatusUpdateDate: '2018-09-05T19:04:53.178Z',
        lastStatusUpdateDuration: 10,
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        customerId: 2165529378315486700,
        branchId: 2165529378315486700,
        hubId: 2165529378315486700,
        branchLabel: 'KFC',
        vendorId: 2165529378315486700,
        vendorDisplayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        fakeVendor: false,
        addressId: 2165529378315486700,
        paymentMethod: 'Cash',
        change: {
          amount: 31.01,
          currency: 'EGP',
        },
        notes: 'add Ketchup',
        subTotal: 75.5,
        tax: 10,
        taxWithoutDeliveryFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        subTotalWithTax: {
          amount: 31.01,
          currency: 'EGP',
        },
        deliveryFees: 10,
        total: 10,
        totalWithoutDeliveryFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        totalDueAmount: {
          amount: 31.01,
          currency: 'EGP',
        },
        consumedBalance: {
          amount: 31.01,
          currency: 'EGP',
        },
        balanceImpact: {
          amount: 31.01,
          currency: 'EGP',
        },
        customerMobileNo: '01234567890',
        requestedPaidCash: {
          amount: 31.01,
          currency: 'EGP',
        },
        totalPaidCash: {
          amount: 31.01,
          currency: 'EGP',
        },
        vendorTaskId: '123',
        status: 'REQUESTED',
        type: 'C2C',
        chargingStatus: 'NOT_APPLICABLE',
        refundStatus: 'NOT_APPLICABLE',
        refundReason: 'NONE',
        promoCode: {
          definition: {
            id: 2165529378315486700,
            name: 'srv20',
            usage: 'DISCOUNT',
            type: 'FIXED_VALUE',
            minSpending: {
              amount: 31.01,
              currency: 'EGP',
            },
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
            percentage: 14,
          },
          impact: {
            promotionUsageId: 2165529378315486700,
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
        },
        referralCode: {
          definition: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            refereePercentage: 14,
            refereeCap: {
              amount: 31.01,
              currency: 'EGP',
            },
            referrerAmount: {
              amount: 31.01,
              currency: 'EGP',
            },
            refereeDiscountType: 'FIXED_VALUE',
            refereeFixedValue: {
              amount: 0,
              currency: 'EGP',
            },
            refereeMinSpending: {
              amount: 0,
              currency: 'EGP',
            },
          },
          impact: {
            referralUsageId: 2165529378315486700,
            referrerId: 2165529378315486700,
            refereeImpact: {
              amount: 31.01,
              currency: 'EGP',
            },
            referrerImpact: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          valid: true,
        },
      },
    ],
  };
}

export function oldOrderDetailsResponseStub(): OrderResponse {
  return {
    serviceFeeWithTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    orderId: 2165529378315486700,
    taskId: 2165529378315486700,
    rated: true,
    vendorId: 2165529378315486700,
    customerOrderId: 'AX7F8W',
    vendorDisplayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    vendorRating: 0,
    serviceType: 'FOOD',
    vendorTaskId: '123',
    creationDate: '2018-09-05T19:04:53.178Z',
    lastUpdateDate: '2018-09-05T19:04:53.178Z',
    status: 'REQUESTED',
    type: 'C2C',
    notes: 'add Ketchup',
    scheduled: false,
    scheduledTo: { from: '', to: '' },
    items: [
      {
        itemId: 2165529378315486700,
        orderItemId: 2165529378315486700,
        audioId: 2165529378315486700,
        orderItemPhotoIds: [2165529378315486700],
        title: {
          en: 'Main Menu',
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
            optionId: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            selections: [
              {
                selectionId: 2165529378315486700,
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                quantity: 3,
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
    ],
    vendorTaxStatus: 'EXCLUDED',
    subTotalTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    subTotal: {
      amount: 31.01,
      currency: 'EGP',
    },
    deliveryFeesTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    tax: {
      amount: 31.01,
      currency: 'EGP',
    },
    promoCode: {
      definition: {
        id: 2165529378315486700,
        name: 'srv20',
        usage: 'DISCOUNT',
        type: 'FIXED_VALUE',
        minSpending: {
          amount: 31.01,
          currency: 'EGP',
        },
        value: {
          amount: 31.01,
          currency: 'EGP',
        },
        percentage: 14,
      },
      impact: {
        promotionUsageId: 2165529378315486700,
        value: {
          amount: 31.01,
          currency: 'EGP',
        },
      },
    },
    taxWithoutDeliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    credit: {
      amount: 31.01,
      currency: 'EGP',
    },
    totalWithoutDeliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    total: {
      amount: 31.01,
      currency: 'EGP',
    },
    totalDueAmount: {
      amount: 31.01,
      currency: 'EGP',
    },
    consumedBalance: {
      amount: 31.01,
      currency: 'EGP',
    },
    balanceImpact: {
      amount: 31.01,
      currency: 'EGP',
    },
    change: {
      amount: 31.01,
      currency: 'EGP',
    },
    requestedPaidCash: {
      amount: 31.01,
      currency: 'EGP',
    },
    deliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    returnedChange: {
      amount: 31.01,
      currency: 'EGP',
    },
    paymentMethod: 'Cash',
    branchId: 2165529378315486700,
    customerId: 2165529378315486700,
    addressId: 2165529378315486700,
    customerMobileNo: '01234567890',
    customerName: 'customer name',
    coverPhotosIds: [2165529378315486700],
    branchLabel: 'Manial Branch',
    assignedPilot: {
      pilotId: 2165529378315486700,
      fullName: 'Hassaballah',
      mobileNo: '01001644120',
      rating: 0,
    },
    address: {
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
    },
    refundStatus: 'NOT_APPLICABLE',
    referralCode: {
      definition: {
        id: 2165529378315486700,
        name: 'AHMED-R7N3',
        refereePercentage: 14,
        refereeCap: {
          amount: 31.01,
          currency: 'EGP',
        },
        referrerAmount: {
          amount: 31.01,
          currency: 'EGP',
        },
        refereeDiscountType: 'FIXED_VALUE',
        refereeFixedValue: {
          amount: 0,
          currency: 'EGP',
        },
        refereeMinSpending: {
          amount: 0,
          currency: 'EGP',
        },
      },
      impact: {
        referralUsageId: 2165529378315486700,
        referrerId: 2165529378315486700,
        refereeImpact: {
          amount: 31.01,
          currency: 'EGP',
        },
        referrerImpact: {
          amount: 31.01,
          currency: 'EGP',
        },
      },
      valid: true,
    },
    fakeVendor: false,
    assignedAgent: {
      id: 2165529378315486700,
      email: 'example@example.com',
    },
    branchAreaName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    deliverBy: 'SURVV_FLEET',
  };
}

export function orderDetailsResponseStub(): ConsumerOrderResponse {
  return {
    serviceFeeWithTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    orderId: 2165529378315486700,
    taskId: 2165529378315486700,
    rated: true,
    vendorId: 2165529378315486700,
    customerOrderId: 'AX7F8W',
    vendorDisplayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    vendorRating: 0,
    serviceType: 'FOOD',
    vendorTaskId: '123',
    creationDate: '2018-09-05T19:04:53.178Z',
    lastUpdateDate: '2018-09-05T19:04:53.178Z',
    status: 'REQUESTED',
    type: 'C2C',
    notes: 'add Ketchup',
    scheduled: false,
    scheduledTo: { from: '', to: '' },
    items: [
      {
        itemId: 2165529378315486700,
        orderItemId: 2165529378315486700,
        audioId: 2165529378315486700,
        orderItemPhotoIds: [2165529378315486700],
        title: {
          en: 'Main Menu',
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
            optionId: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            selections: [
              {
                selectionId: 2165529378315486700,
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                quantity: 3,
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
    ],
    vendorTaxStatus: 'EXCLUDED',
    subTotalTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    subTotal: {
      amount: 31.01,
      currency: 'EGP',
    },
    deliveryFeesTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    tax: {
      amount: 31.01,
      currency: 'EGP',
    },
    promoCode: {
      definition: {
        id: 2165529378315486700,
        name: 'srv20',
        usage: 'DISCOUNT',
        type: 'FIXED_VALUE',
        minSpending: {
          amount: 31.01,
          currency: 'EGP',
        },
        value: {
          amount: 31.01,
          currency: 'EGP',
        },
        percentage: 14,
      },
      impact: {
        promotionUsageId: 2165529378315486700,
        value: {
          amount: 31.01,
          currency: 'EGP',
        },
      },
    },
    taxWithoutDeliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    credit: {
      amount: 31.01,
      currency: 'EGP',
    },
    totalWithoutDeliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    total: {
      amount: 31.01,
      currency: 'EGP',
    },
    totalDueAmount: {
      amount: 31.01,
      currency: 'EGP',
    },
    consumedBalance: {
      amount: 31.01,
      currency: 'EGP',
    },
    balanceImpact: {
      amount: 31.01,
      currency: 'EGP',
    },
    change: {
      amount: 31.01,
      currency: 'EGP',
    },
    requestedPaidCash: {
      amount: 31.01,
      currency: 'EGP',
    },
    deliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    returnedChange: {
      amount: 31.01,
      currency: 'EGP',
    },
    paymentMethod: 'Cash',
    branchId: 2165529378315486700,
    customerId: 2165529378315486700,
    addressId: 2165529378315486700,
    customerMobileNo: '01234567890',
    customerName: 'customer name',
    coverPhotosIds: [2165529378315486700],
    branchLabel: 'Manial Branch',
    assignedPilot: {
      pilotId: 2165529378315486700,
      fullName: 'Hassaballah',
      mobileNo: '01001644120',
      rating: 0,
    },
    address: {
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
    },
    refundStatus: 'NOT_APPLICABLE',
    referralCode: {
      definition: {
        id: 2165529378315486700,
        name: 'AHMED-R7N3',
        refereePercentage: 14,
        refereeCap: {
          amount: 31.01,
          currency: 'EGP',
        },
        referrerAmount: {
          amount: 31.01,
          currency: 'EGP',
        },
        refereeDiscountType: 'FIXED_VALUE',
        refereeFixedValue: {
          amount: 0,
          currency: 'EGP',
        },
        refereeMinSpending: {
          amount: 0,
          currency: 'EGP',
        },
      },
      impact: {
        referralUsageId: 2165529378315486700,
        referrerId: 2165529378315486700,
        refereeImpact: {
          amount: 31.01,
          currency: 'EGP',
        },
        referrerImpact: {
          amount: 31.01,
          currency: 'EGP',
        },
      },
      valid: true,
    },
    fakeVendor: false,
    assignedAgent: {
      id: 2165529378315486700,
      email: 'example@example.com',
    },
    branchAreaName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    deliverBy: 'SURVV_FLEET',
    actionDisplay: true,
  };
}

export function orderCalculationResponseStub(): OrderCalculationResponse {
  return {
    orderId: 2165529378315486700,
    serviceFeeWithTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    total: {
      amount: 31.01,
      currency: 'EGP',
    },
    subTotal: {
      amount: 31.01,
      currency: 'EGP',
    },
    subTotalTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    vendorTaxStatus: 'EXCLUDED',
    tax: {
      amount: 31.01,
      currency: 'EGP',
    },
    deliveryFeesTax: {
      amount: 31.01,
      currency: 'EGP',
    },
    deliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    totalDueAmount: {
      amount: 31.01,
      currency: 'EGP',
    },
    promoCodeImpact: {
      amount: 31.01,
      currency: 'EGP',
    },
    refereeImpact: { amount: 31.01, currency: 'EGP' },
    promoCodeMinSpendingShortage: {
      amount: 0,
      currency: 'EGP',
    },
    referralCodeMinSpendingShortage: {
      amount: 0,
      currency: 'EGP',
    },
    promoCodeStillValid: true,
    referralCodeStillValid: true,
    items: [
      {
        itemId: 2165529378315486700,
        quantity: 5,
        price: {
          amount: 31.01,
          currency: 'EGP',
        },
        totalPrice: {
          amount: 31.01,
          currency: 'EGP',
        },
      },
    ],
  };
}

export function orderCancellationReasonsResponseStub(): CancellationReasonsListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    cancellationReasons: [
      {
        id: 2165529378315486700,
        category: 'VENDOR_FAULT' as CancellationReasonCategory,
        label: 'Vendor closed',
        orderTypes: ['B2C', 'ERRANDS'],
      },
      {
        id: 2165529378315486702,
        category: 'SURVV_FAULT' as CancellationReasonCategory,
        label: 'Service is down',
        orderTypes: ['B2C', 'ERRANDS'],
      },
    ],
  };
}

export function errandsOrderRejectionReasonsResponseStub(): OrderRejectionReasonsResponse {
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

export function orderRejectionReasonsResponseStub(): OrderRejectionReasonsResponse {
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

export function queuedOrdersCountsResponseStub(): QueuedOrdersCountsResponse {
  return {
    b2cOrdersCount: 100,
    c2cOrdersCount: 100,
  };
}

export function updateOrderStatusResponseStub(): UpdateOrderStatusResponse {
  return {
    orderStatus: 'REQUESTED',
  };
}

export function orderJourneyResponseStub(): OrderJourneyResponse {
  return {
    orderId: 1234,
    timelineJourney: [
      {
        journeyStopStatus: 'REQUESTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'ORDER',
        },
        data: { platform: 'IOS' },
      },
      {
        journeyStopStatus: 'CONFIRMED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {
          id: 2165529378315480,
          email: 'example@example.com',
        },
        linkedEntity: {},
        data: {},
      },
      {
        journeyStopStatus: 'REJECTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {
          id: 2165529378315480,
          email: 'example@example.com',
        },
        linkedEntity: {},
        data: {
          rejectionReason: 'Illegal Items',
          notes: 'Rejection Notes',
          busyFor: 'BUSY_ONE_HOUR',
        },
      },
      {
        journeyStopStatus: 'CANCELLED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {
          id: 2165529378315480,
          email: 'example@example.com',
        },
        linkedEntity: {},
        data: {
          cancellationReason: 'Sample Reason',
          cancellationReasonCategory: 'Sample Reason Category',
          refunded: 'true',
        },
      },
      {
        journeyStopStatus: 'PILOT_REQUESTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'TRIP',
        },
        data: {},
      },
      {
        journeyStopStatus: 'PILOT_ASSIGNED',
        durationInSeconds: 600,
        actionBy: {},
        stopDateTime: '2018-09-05T19:04:53.178Z',
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'PILOT',
        },
        data: {},
      },
      {
        journeyStopStatus: 'PICKUP',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'PICKUP',
        },
        data: {
          name: '',
        },
      },
      {
        journeyStopStatus: 'COLLECTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {},
        data: {},
      },
      {
        journeyStopStatus: 'DELIVERED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {},
        data: {},
      },
    ],
  };
}

export function ordersListV2ResponseStub(): OrdersListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    orders: [
      {
        orderId: 2165529378315486700,
        taskId: 2165529378315486700,
        tripId: 2165529378315486700,
        pickupCount: 4,
        items: [
          {
            itemId: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
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
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        lastStatusUpdateDate: '2018-09-05T19:04:53.178Z',
        lastStatusUpdateDuration: 10,
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        customerId: 2165529378315486700,
        branchId: 2165529378315486700,
        hubId: 2165529378315486700,
        branchLabel: 'KFC',
        vendorId: 2165529378315486700,
        vendorDisplayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        fakeVendor: false,
        addressId: 2165529378315486700,
        paymentMethod: 'Cash',
        change: {
          amount: 31.01,
          currency: 'EGP',
        },
        notes: 'add Ketchup',
        subTotal: 75.5,
        tax: 10,
        taxWithoutDeliveryFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        deliveryFees: 10,
        total: 10,
        totalWithoutDeliveryFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        subTotalWithTax: {
          amount: 31.01,
          currency: 'EGP',
        },
        totalDueAmount: {
          amount: 31.01,
          currency: 'EGP',
        },
        consumedBalance: {
          amount: 31.01,
          currency: 'EGP',
        },
        balanceImpact: {
          amount: 31.01,
          currency: 'EGP',
        },
        customerMobileNo: '01234567890',
        requestedPaidCash: {
          amount: 31.01,
          currency: 'EGP',
        },
        totalPaidCash: {
          amount: 31.01,
          currency: 'EGP',
        },
        vendorTaskId: '123',
        status: 'REQUESTED',
        type: 'C2C',
        chargingStatus: 'NOT_APPLICABLE',
        refundStatus: 'NOT_APPLICABLE',
        refundReason: 'NONE',
        promoCode: {
          definition: {
            id: 2165529378315486700,
            name: 'srv20',
            usage: 'DISCOUNT',
            type: 'FIXED_VALUE',
            minSpending: {
              amount: 31.01,
              currency: 'EGP',
            },
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
            percentage: 14,
            ordersCount: 3,
            ordersCountOperator: 'LESS_THAN',
          },
          impact: {
            promotionUsageId: 2165529378315486700,
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
        },
        referralCode: {
          definition: {
            id: 2165529378315486700,
            name: 'AHMED-R7N3',
            refereeDiscountType: 'PERCENTAGE',
            refereeFixedValue: {
              amount: 31.01,
              currency: 'EGP',
            },
            refereeMinSpending: {
              amount: 31.01,
              currency: 'EGP',
            },
            refereePercentage: 14,
            refereeCap: {
              amount: 31.01,
              currency: 'EGP',
            },
            referrerAmount: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          impact: {
            referralUsageId: 2165529378315486700,
            referrerId: 2165529378315486700,
            refereeImpact: {
              amount: 31.01,
              currency: 'EGP',
            },
            referrerImpact: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          valid: true,
        },
        cancellationFee: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingSystem: 'FAKE_VENDOR',
        scheduled: false,
        scheduledTo: {
          from: '19:04:53',
          to: '19:04:53',
        },
        assignedAgent: {
          id: 123,
          email: 'example@example.com',
        },
        averagePrepTime: 30,
        estimatedDeliveryTimeInMinutes: 30,
      },
    ],
  };
}
