import { Address } from '@survv/commons/core/models/Address';
import {
  AudioRefType,
  createAudioUrl,
} from '@survv/commons/core/models/Audios';
import {
  CancellationReason,
  CancellationReasonCategory,
  CancellationReasonsOrderType,
} from '../../../../core/models/OrderCancellationReasons';
import { CancellationReasonsListV2Response } from '@survv/api/definitions/cancellation-reasons';
import {
  ConsumerOrderResponse,
  OrderCalculationRequest,
  OrderCalculationResponse,
  OrderItemOption as OrderItemOptionResponse,
  OrderJourneyResponse,
  OrderRejectionReasonsResponse,
  OrderUpdateRequest,
  OrdersListV2Response,
  QueuedOrdersCountsResponse,
} from '@survv/api/definitions/orders';
import {
  CoveredZonesResponse,
  DetectZoneResponse,
  ErrandCategoriesListResponse,
  ErrandOrderCalculateResponse,
  ErrandOrderResponse,
  ErrandsOrderJourneyResponse,
} from '@survv/api/definitions/errands';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { DeliveryFleet } from '../../../../core/models/DeliveryFleet';
import { Duration, TimeUnits } from '@survv/commons/core/models/Duration';
import {
  ErrandCategory,
  ErrandCategoryStatus,
} from '../../../../core/models/ErrandCategory';
import { ErrandCharging } from '../../../../core/models/ErrandCharging';
import { ErrandDetectedZone } from '../../../../core/models/ErrandDetectedZone';
import {
  ErrandOrder,
  ErrandOrderPickup,
  ErrandOrderPickupItem,
  PickupStatus,
} from '../../../../core/models/ErrandOrder';
import {
  ErrandsOrderJourney,
  ErrandsOrderJourneyStep,
  ErrandsOrderJourneyStepStatus,
} from '../../../../core/models/ErrandsOrderJourney';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemOptionSelection,
  OrderPaymentMethod,
  OrderStatus,
  QueuedOrdersCounts,
} from '../../../../core/models/Order';
import {
  OrderJourney,
  OrderJourneyStep,
  OrderJourneyStepStatus,
} from '../../../../core/models/OrderJourney';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrderingSystem } from '@survv/commons/core/models/OrderingSystem';
import {
  PromoCode,
  PromoCodeType,
  PromoCodeUsageType,
} from '../../../../core/models/Promotion';
import {
  ReferralCode,
  ReferralDiscountType,
} from '../../../../core/models/Referral';
import { RejectionReason } from '../../../../core/models/RejectionReason';
import { Time } from '@survv/commons/core/models/Time';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';

export function mapOptionToOrderItemOption(
  itemOption: OrderItemOptionResponse
): OrderItemOption {
  return new OrderItemOption({
    optionId: itemOption.optionId,
    title: new MultilingualString(itemOption.title),
    selections: itemOption.selections.map(
      (selection) =>
        new OrderItemOptionSelection({
          price: new Money(selection.price),
          quantity: selection.quantity,
          selectionId: selection.selectionId,
          title: new MultilingualString(selection.title),
          relatedOptions: [],
          isAvailable: selection.available,
        })
    ),
  });
}

export function mapOrdersListV2ResponseToOrders(
  response: OrdersListV2Response
): ItemsList<Order> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.orders.map(
      (order) =>
        new Order({
          id: order.orderId,
          customerMobileNo: order.customerMobileNo,
          customerOrderId: new CustomerOrderId(order.customerOrderId),
          branchLabel: order.branchLabel,
          status: new OrderStatus(order.status),
          paymentMethod: new OrderPaymentMethod(order.paymentMethod),
          total: new Money({
            amount: order.total,
            currency: 'EGP',
          }),
          items: order.items.map(
            (item) =>
              new OrderItem({
                orderItemId: item.itemId,
                itemId: item.itemId,
                title: new MultilingualString(item.title),
                quantity: item.quantity,
                price: new Money({ amount: item.price, currency: 'EGP' }),
                options: item.options.map(
                  (itemOption) =>
                    new OrderItemOption({
                      optionId: itemOption.optionId,
                      selections: itemOption.selections.map(
                        (selection) =>
                          new OrderItemOptionSelection({
                            price: new Money({
                              amount: selection.price,
                              currency: 'EGP',
                            }),
                            selectionId: selection.selectionId,
                          })
                      ),
                    })
                ),
                notes: item.notes,
              })
          ),
          change: new Money(order.change),
          consumedBalance: new Money(order.consumedBalance),
          lastStatusUpdateDate: new Datetime(order.lastStatusUpdateDate),
          lastStatusUpdateDuration: new Duration({
            value: order.lastStatusUpdateDuration,
            timeUnit: TimeUnits.SECONDS,
            compact: false,
          }),
          scheduledTo: new HoursRange({
            from: new Time(order.scheduledTo.from),
            to: new Time(order.scheduledTo.to),
          }),
          type: new OrderType(order.type),
          creationDate: new Datetime(order.creationDate),
          promoCode: new PromoCode({
            id: order.promoCode.definition.id,
            name: order.promoCode.definition.name,
            usage: new PromoCodeUsageType(order.promoCode.definition.usage),
            type: new PromoCodeType(order.promoCode.definition.type),
            percentage: order.promoCode.definition.percentage,
            minSpending: new Money(order.promoCode.definition.minSpending),
            value:
              order.promoCode.definition.type === 'FIXED_VALUE'
                ? new Money(order.promoCode.definition.value)
                : new Money(),
            cap:
              order.promoCode.definition.type === 'PERCENTAGE'
                ? new Money(order.promoCode.definition.value)
                : new Money(),
            valid: true,
            minSpendingShortage: new Money(),
          }),
          referralCode: new ReferralCode({
            id: order.referralCode.definition.id,
            name: order.referralCode.definition.name,
            refereeCap: new Money(order.referralCode.definition.refereeCap),
            refereePercentage: order.referralCode.definition.refereePercentage,
            refereeDiscountAmount: new Money(
              order.referralCode.impact.refereeImpact
            ),
            discountType: new ReferralDiscountType(
              order.referralCode.definition.refereeDiscountType
            ),
            minimumOrderAmount: new Money(
              order.referralCode.definition.refereeMinSpending
            ),
            fixedDiscountAmount: new Money(
              order.referralCode.definition.refereeFixedValue
            ),
            valid: true,
            minSpendingShortage: new Money(),
          }),
          orderingSystem: new OrderingSystem(order.orderingSystem),
          pickupCount: order.pickupCount,
          subTotal: new Money({ amount: order.subTotal, currency: 'EGP' }),
          tax: new Money({ amount: order.tax, currency: 'EGP' }),
          deliveryFees: new Money({
            amount: order.deliveryFees,
            currency: 'EGP',
          }),
          totalDueAmount: new Money(order.totalDueAmount),
          returnedChange: new Money(order.change),
          discountAmount:
            order.promoCode.definition.usage === 'DISCOUNT'
              ? new Money(order.promoCode.impact.value)
              : new Money(),
          cashbackAmount:
            order.promoCode.definition.usage === 'CASH_BACK'
              ? new Money(order.promoCode.impact.value)
              : new Money(),
          deliveryFeesDiscountAmount:
            order.promoCode.definition.usage === 'FREE_DELIVERY'
              ? new Money(order.promoCode.impact.value)
              : new Money(),
          notes: order.notes,
          fakeVendor: order.fakeVendor,
          branchId: order.branchId,
          vendorId: order.vendorId,
          scheduled: order.scheduled,
          vendorDisplayName: new MultilingualString(order.vendorDisplayName),
        })
    ),
  };
}

export function mapQueuedOrdersCountsResponseToQueuedOrdersCounts(
  response: QueuedOrdersCountsResponse
): QueuedOrdersCounts {
  return new QueuedOrdersCounts({
    b2cOrdersCount: response.b2cOrdersCount,
    c2cOrdersCount: response.c2cOrdersCount,
  });
}

export function mapCancellationReasonsListV2ResponseToCancellationReasons(
  response: CancellationReasonsListV2Response
): Record<string, CancellationReason[]> {
  const cancellationReasons = {} as Record<string, CancellationReason[]>;

  response.cancellationReasons.forEach((reason) => {
    const category = reason.category as string;
    const mappedReason = new CancellationReason({
      id: reason.id,
      type: new CancellationReasonCategory(reason.category),
      label: reason.label,
      orderTypes: reason.orderTypes.map(
        (orderType) => new CancellationReasonsOrderType(orderType)
      ),
    });

    if (cancellationReasons[category]) {
      cancellationReasons[category].push(mappedReason);
    } else {
      cancellationReasons[category] = [mappedReason];
    }
  });

  return cancellationReasons;
}

export function mapOrderRejectionReasonsResponseToRejectionReasons(
  response: OrderRejectionReasonsResponse
): RejectionReason[] {
  return response.rejectionReasons.map((reason) => {
    return new RejectionReason({
      id: reason.id,
      label: reason.label,
    });
  });
}

export function mapOrderToOrderUpdateRequest(order: Order): OrderUpdateRequest {
  return {
    items: order.items.map(
      ({ orderItemId, itemId, notes, quantity, options }) => ({
        orderItemId,
        itemId,
        quantity,
        notes,
        options: options.map((option) => ({
          optionId: option.optionId,
          selectionIds: option.selections.map(
            (selection) => selection.selectionId
          ),
        })),
      })
    ),
  };
}

export function mapOrderResponseToOrder(
  orderResponse: ConsumerOrderResponse
): Order {
  return new Order({
    id: orderResponse.orderId,
    vendorId: orderResponse.vendorId,
    branchId: orderResponse.branchId,
    customerOrderId: new CustomerOrderId(orderResponse.customerOrderId),
    vendorDisplayName: new MultilingualString(orderResponse.vendorDisplayName),
    branchLabel: orderResponse.branchLabel,
    fakeVendor: orderResponse.fakeVendor,
    creationDate: new Datetime(orderResponse.creationDate),
    status: new OrderStatus(orderResponse.status),
    type: new OrderType(orderResponse.type),
    notes: orderResponse.notes,
    scheduled: orderResponse.scheduled,
    scheduledTo: new HoursRange({
      from: new Time(orderResponse.scheduledTo.from),
      to: new Time(orderResponse.scheduledTo.to),
    }),
    items: orderResponse.items.map(
      (item) =>
        new OrderItem({
          orderItemId: item.orderItemId,
          itemId: item.itemId,
          title: new MultilingualString(item.title),
          quantity: item.quantity,
          price: new Money(item.price),
          options: item.options.map(mapOptionToOrderItemOption),
          notes: item.notes,
          gallery:
            orderResponse.type == 'C2C'
              ? item.orderItemPhotoIds.map((imageId) =>
                  createBackendUrl({
                    url: '/api/v1/images/:imageId',
                    params: { imageId },
                  })
                )
              : [],
          voiceNoteUrl:
            item.audioId && orderResponse.type == 'C2C'
              ? createAudioUrl({
                  refType: AudioRefType.ERRAND_ITEM_VOICE,
                  refId: item.orderItemId,
                })
              : '',
          icon:
            orderResponse.type == 'C2C'
              ? createImageUrl({
                  refId: item.itemId,
                  refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
                })
              : '',
          isAvailable: item.available,
        })
    ),
    customerAddress: new Address({
      apartment: orderResponse.address.apartmentNo,
      building: orderResponse.address.building,
      street: orderResponse.address.addressLine1,
      floor: orderResponse.address.floor,
      companyName: orderResponse.address.companyName,
      landmark: orderResponse.address.landmark,
    }),
    customerLocationFeature: {
      type: 'Feature',
      geometry: orderResponse.address.pinnedLocation,
      properties: {
        dataType: 'CUSTOMER_LOCATION',
      },
    },
    promoCode: new PromoCode({
      id: orderResponse.promoCode.definition.id,
      name: orderResponse.promoCode.definition.name,
      usage: new PromoCodeUsageType(orderResponse.promoCode.definition.usage),
      type: new PromoCodeType(orderResponse.promoCode.definition.type),
      percentage: orderResponse.promoCode.definition.percentage,
      minSpending: new Money(orderResponse.promoCode.definition.minSpending),
      value:
        orderResponse.promoCode.definition.type === 'FIXED_VALUE'
          ? new Money(orderResponse.promoCode.definition.value)
          : new Money(),
      cap:
        orderResponse.promoCode.definition.type === 'PERCENTAGE'
          ? new Money(orderResponse.promoCode.definition.value)
          : new Money(),
      valid: true,
      minSpendingShortage: new Money(),
    }),
    referralCode: new ReferralCode({
      id: orderResponse.referralCode.definition.id,
      name: orderResponse.referralCode.definition.name,
      refereeCap: new Money(orderResponse.referralCode.definition.refereeCap),
      refereePercentage:
        orderResponse.referralCode.definition.refereePercentage,
      refereeDiscountAmount: new Money(
        orderResponse.referralCode.impact.refereeImpact
      ),
      discountType: new ReferralDiscountType(
        orderResponse.referralCode.definition.refereeDiscountType
      ),
      minimumOrderAmount: new Money(
        orderResponse.referralCode.definition.refereeMinSpending
      ),
      fixedDiscountAmount: new Money(
        orderResponse.referralCode.definition.refereeFixedValue
      ),
      valid: true,
      minSpendingShortage: new Money(),
    }),
    consumedBalance: new Money(orderResponse.consumedBalance),
    subTotal: new Money(orderResponse.subTotal),
    subTotalTax: new Money(orderResponse.subTotalTax),
    tax: new Money(orderResponse.tax),
    total: new Money(orderResponse.total),
    deliveryFees: new Money(orderResponse.deliveryFees),
    serviceFeeWithTax: new Money(orderResponse.serviceFeeWithTax),
    totalDueAmount: new Money(orderResponse.totalDueAmount),
    returnedChange: new Money(orderResponse.change),
    paymentMethod: new OrderPaymentMethod(orderResponse.paymentMethod),
    customerMobileNo: orderResponse.customerMobileNo,
    customerName: orderResponse.customerName,
    vendorTaxNotApplicable:
      orderResponse.vendorTaxStatus == 'NOT_APPLICABLE' ||
      orderResponse.vendorTaxStatus == 'NONE',
    deliveryTax: new Money(orderResponse.deliveryFeesTax),
    discountAmount:
      orderResponse.promoCode.definition.usage === 'DISCOUNT'
        ? new Money(orderResponse.promoCode.impact.value)
        : new Money(),
    cashbackAmount:
      orderResponse.promoCode.definition.usage === 'CASH_BACK'
        ? new Money(orderResponse.promoCode.impact.value)
        : new Money(),
    deliveryFeesDiscountAmount:
      orderResponse.promoCode.definition.usage === 'FREE_DELIVERY'
        ? new Money(orderResponse.promoCode.impact.value)
        : new Money(),
    change: new Money(orderResponse.change),
    deliverBy: new DeliveryFleet(orderResponse.deliverBy),
    actionDisplay: orderResponse.actionDisplay,
  });
}

export function mapOrderCalculationResponseToOrder(
  order: Order,
  calculationResponse: OrderCalculationResponse
): Order {
  return Order.copyWith(order, {
    promoCode: {
      ...order.promoCode,
      valid: calculationResponse.promoCodeStillValid,
      minSpendingShortage: new Money(
        calculationResponse.promoCodeMinSpendingShortage
      ),
    },
    subTotal: new Money(calculationResponse.subTotal),
    subTotalTax: new Money(calculationResponse.subTotalTax),
    tax: new Money(calculationResponse.tax),
    total: new Money(calculationResponse.total),
    deliveryTax: new Money(calculationResponse.deliveryFeesTax),
    deliveryFees: new Money(calculationResponse.deliveryFees),
    serviceFeeWithTax: new Money(calculationResponse.serviceFeeWithTax),
    totalDueAmount: new Money(calculationResponse.totalDueAmount),
    referralCode: {
      ...order.referralCode,
      refereeDiscountAmount: new Money(calculationResponse.refereeImpact),
      minSpendingShortage: new Money(
        calculationResponse.referralCodeMinSpendingShortage
      ),
      valid: calculationResponse.referralCodeStillValid,
    },
    discountAmount:
      order.promoCode.usage.valueOf() === 'DISCOUNT'
        ? new Money(calculationResponse.promoCodeImpact)
        : new Money(),
    cashbackAmount:
      order.promoCode.usage.valueOf() === 'CASH_BACK'
        ? new Money(calculationResponse.promoCodeImpact)
        : new Money(),
    deliveryFeesDiscountAmount:
      order.promoCode.usage.valueOf() === 'FREE_DELIVERY'
        ? new Money(calculationResponse.promoCodeImpact)
        : new Money(),
  });
}

export function mapOrderToOrderCalculationRequest(
  order: Order
): OrderCalculationRequest {
  return {
    items: order.items.map(({ itemId, quantity, options }) => ({
      itemId,
      quantity,
      options: options.map((option) => ({
        optionId: option.optionId,
        selectionIds: option.selections.map(
          (selection) => selection.selectionId
        ),
      })),
    })),
  };
}

export function mapOrderJourneyResponseToOrderJourney(
  response: OrderJourneyResponse
): OrderJourney {
  return new OrderJourney({
    orderId: response.orderId,
    orderJourney: response.timelineJourney.map(
      (responseJourneyStep) =>
        ({
          stepStatus: new OrderJourneyStepStatus(
            responseJourneyStep.journeyStopStatus
          ),
          stepTimeStamp: new Datetime(responseJourneyStep.stopDateTime),
          stepDuration: responseJourneyStep.durationInSeconds,
          actionBy: responseJourneyStep.actionBy,
          linkedEntity: responseJourneyStep.linkedEntity,
          data: responseJourneyStep.data,
        } as OrderJourneyStep)
    ),
  });
}

export function mapErrandCategoriesListResponseToErrandCategories(
  response: ErrandCategoriesListResponse
): ItemsList<ErrandCategory> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.categories.map(
      (category) =>
        new ErrandCategory({
          id: category.id,
          displayName: new MultilingualString(category.displayName),
          avgPreparationTime: category.avgPreparationTime,
          createdBy: category.createdBy,
          icon: createImageUrl({
            refType: ImageRefType.ERRAND_CATEGORY_ICON,
            refId: category.id,
          }),
          status: new ErrandCategoryStatus(
            category.status === 'NONE' ? '' : category.status
          ),
          lastUpdateDate: new Datetime(category.lastUpdateDate),
        })
    ),
  };
}

export function mapErrandOrderResponseToErrandOrder(
  response: ErrandOrderResponse
): ErrandOrder {
  return new ErrandOrder({
    id: response.orderId,
    customerOrderId: new CustomerOrderId(response.customerOrderId),
    customerAddress: new Address({
      apartment: response.address.apartmentNo,
      building: response.address.building,
      street: response.address.addressLine1,
      floor: response.address.floor,
      companyName: response.address.companyName,
      landmark: response.address.landmark,
    }),
    creationDate: new Datetime(response.creationDate),
    status: new OrderStatus(response.status),
    type: new OrderType(response.type),
    subTotal: new Money(response.subTotal),
    tax: new Money(response.tax),
    consumedBalance: new Money(response.balanceImpact),
    total: new Money(response.total),
    totalDueAmount: new Money(response.totalDueAmount),
    estimatedDeliveryFees: new Money(response.estimatedDeliveryFees),
    deliveryFees: new Money(response.deliveryFees),
    deliveryFeesTax: new Money(response.deliveryFeesTax),
    paymentMethod: new OrderPaymentMethod(response.paymentMethod),
    customerMobileNo: response.customer.mobileNo,
    customerName: response.customer.name,
    maxErrandPoints: response.maxErrandPoints,
    orderPickups: response.orderPickups.map((pickup) => {
      return new ErrandOrderPickup({
        pickupStatus: new PickupStatus(pickup.pickupStatus),
        categoryDisplayName: new MultilingualString(pickup.categoryDisplayName),
        categoryId: pickup.categoryId,
        pickupId: pickup.pickupId,
        location: {
          locationDescription: pickup.location.description,
          pickupLocation: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: pickup.location.point,
                properties: {
                  dataType: 'CUSTOMER_LOCATION',
                },
              },
            ],
          },
        },
        description: pickup.description,
        uploadedImages: pickup.uploadedImages.map((image) => image.signedUrl),
        voiceNote: pickup.voiceNote.signedUrl,
        includePictures: pickup.includePictures,
        includeVoiceNote: pickup.includeVoiceNote,
        deleted: pickup.deleted,
        items: pickup.items.map((item) => {
          return new ErrandOrderPickupItem(item);
        }),
      });
    }),
    customerLocationFeature: {
      type: 'Feature',
      geometry: response.address.pinnedLocation,
      properties: {
        dataType: 'CUSTOMER_LOCATION',
      },
    },
  });
}

export function mapErrandCancellationReasonResponseToErrandCancellationReasons(
  response: CancellationReasonsListV2Response
): CancellationReason[] {
  return response.cancellationReasons.map((reason) => {
    return new CancellationReason({
      id: reason.id,
      label: reason.label,
      type: new CancellationReasonCategory(reason.category),
      orderTypes: reason.orderTypes.map(
        (orderType) => new CancellationReasonsOrderType(orderType)
      ),
    });
  });
}

export function mapDetectedZoneResponseToDetectedZone(
  response: DetectZoneResponse
): ErrandDetectedZone {
  return new ErrandDetectedZone({
    id: response.zoneId,
    name: new MultilingualString(response.name),
  });
}

export function mapErrandOrderCalculateResponseToErrandCharging(
  response: ErrandOrderCalculateResponse
): ErrandCharging {
  return new ErrandCharging({
    tax: new Money(response.tax),
    estimatedDeliveryFee: new Money(response.estimatedDeliveryFee),
  });
}

export function mapCoveredZonesResponseToGeojsonCoordinatesArrays(
  response: CoveredZonesResponse
): GeojsonCoordinates[][][] {
  const zonesCoordinates: GeojsonCoordinates[][][] = [];
  response.coveredZones.forEach((coveredZone) => {
    zonesCoordinates.push(coveredZone.polygon.coordinates);
  });
  return zonesCoordinates;
}

export function mapErrandsOrderJourneyResponseToErrandsOrderJourney(
  response: ErrandsOrderJourneyResponse
): ErrandsOrderJourney {
  return new ErrandsOrderJourney({
    orderId: response.orderId,
    orderJourney: response.timelineJourney.map(
      (responseJourneyStep) =>
        ({
          stepStatus: new ErrandsOrderJourneyStepStatus(
            responseJourneyStep.journeyStopStatus
          ),
          stepTimeStamp: new Datetime(responseJourneyStep.stopDateTime),
          actionBy: responseJourneyStep.actionBy,
          linkedEntity: responseJourneyStep.linkedEntity,
          data: responseJourneyStep.data,
        } as ErrandsOrderJourneyStep)
    ),
  });
}
