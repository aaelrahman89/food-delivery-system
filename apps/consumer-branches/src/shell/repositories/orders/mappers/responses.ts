import { Datetime } from '@survv/commons/core/utils/datetime';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  OrderCalculationResponse,
  OrderItemOption as OrderItemOptionResponse,
  OrderJourneyResponse,
  OrderRejectionReasonsResponse,
  OrderResponse,
} from '@survv/api/definitions/orders';

import {
  AudioRefType,
  createAudioUrl,
} from '@survv/commons/core/models/Audios';
import { BranchOrdersResponse } from '@survv/api/definitions/branches';
import { C2COrder, C2COrderItem } from '../../../../core/models/C2COrder';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { DeliveryFleet } from '../../../../core/models/DeliveryFleet';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemOptionSelection,
  OrderPaymentMethod,
  OrderStatus,
} from '../../../../core/models/Order';
import {
  OrderJourney,
  OrderJourneyStep,
  OrderJourneyStepStatus,
} from '../../../../core/models/OrderJourney';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { RejectionReason } from '../../../../core/models/RejectionReason';
import { Time } from '@survv/commons/core/models/Time';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';

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

export function mapOptionToOrderItemOption(
  itemOption: OrderItemOptionResponse
): OrderItemOption {
  return new OrderItemOption({
    optionId: itemOption.optionId,
    title: new MultilingualString(itemOption.title),
    selections: itemOption.selections.map((selection) => ({
      price: new Money(selection.price),
      quantity: selection.quantity,
      selectionId: selection.selectionId,
      title: new MultilingualString(selection.title),
      isAvailable: selection.available,
    })),
  });
}

export function mapOrderResponseToOrder(orderResponse: OrderResponse): Order {
  return new Order({
    id: orderResponse.orderId,
    vendorId: orderResponse.vendorId,
    branchId: orderResponse.branchId,
    customerOrderId: new CustomerOrderId(orderResponse.customerOrderId),
    vendorDisplayName: new MultilingualString(orderResponse.vendorDisplayName),
    creationDate: new Datetime(orderResponse.creationDate),
    lastUpdateDate: new Datetime(orderResponse.lastUpdateDate),
    scheduled: orderResponse.scheduled,
    scheduledTo: new HoursRange({
      from: new Time(orderResponse.scheduledTo.from),
      to: new Time(orderResponse.scheduledTo.to),
    }),
    totalWithoutDeliveryFees: new Money(orderResponse.totalWithoutDeliveryFees),
    customerId: orderResponse.customerId,
    addressId: orderResponse.addressId,
    vendorTaskId: orderResponse.vendorTaskId,
    isB2C: OrderType.B2C.equals(orderResponse.type),
    isC2C: OrderType.C2C.equals(orderResponse.type),
    status: new OrderStatus(orderResponse.status),
    type: new OrderType(orderResponse.type),
    notes: orderResponse.notes,
    items: orderResponse.items.map(
      (item) =>
        new OrderItem({
          orderItemId: item.orderItemId,
          itemId: item.itemId,
          title: new MultilingualString(item.title),
          quantity: item.quantity,
          options: item.options.map(mapOptionToOrderItemOption),
          notes: item.notes,
          price: new Money(item.price),
          isAvailable: item.available,
        })
    ),

    subTotal: new Money(orderResponse.subTotal),
    tax: new Money(orderResponse.tax),
    total: new Money(orderResponse.total),
    deliveryFees: new Money(orderResponse.deliveryFees),
    totalDueAmount: new Money(orderResponse.totalDueAmount),
    paymentMethod: new OrderPaymentMethod(orderResponse.paymentMethod),
    customerMobileNo: orderResponse.customerMobileNo,
    customerName: orderResponse.customerName,
    deliverBy: new DeliveryFleet(orderResponse.deliverBy),
    actionDisplay: orderResponse.actionDisplay,
    taxWithoutDeliveryFees: new Money(orderResponse.taxWithoutDeliveryFees),
  });
}

export function mapOrderCalculationResponseToOrder(
  order: Order,
  calculationResponse: OrderCalculationResponse
): Order {
  return Order.copyWith(order, {
    subTotal: new Money(calculationResponse.subTotal),
    tax: new Money(calculationResponse.tax),
    total: new Money(calculationResponse.total),
    deliveryFees: new Money(calculationResponse.deliveryFees),
    totalDueAmount: new Money(calculationResponse.totalDueAmount),
  });
}

export function mapC2COrderResponseToC2COrder(
  c2cOrderResponse: OrderResponse
): C2COrder {
  const {
    orderId,
    customerName,
    customerMobileNo,
    items,
    paymentMethod,
    customerOrderId,
    type,
    creationDate,
  } = c2cOrderResponse;

  return new C2COrder({
    id: orderId,
    customerName,
    customerPhoneNumber: customerMobileNo,
    customerOrderId: new CustomerOrderId(customerOrderId),
    items: items.map(
      ({ itemId, orderItemId, audioId, title, notes, orderItemPhotoIds }) =>
        new C2COrderItem({
          itemId,
          orderItemId,
          title,
          gallery: orderItemPhotoIds.map((imageId) =>
            createBackendUrl({
              url: '/api/v1/images/:imageId',
              params: { imageId },
            })
          ),
          voiceNoteUrl: audioId
            ? createAudioUrl({
                refType: AudioRefType.ERRAND_ITEM_VOICE,
                refId: orderItemId,
              })
            : '',
          notes,
          icon: createImageUrl({
            refId: itemId,
            refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
          }),
        })
    ),
    paymentMethod,
    type: new OrderType(type),
    creationTime: new Datetime(creationDate),
  });
}

export function mapBranchOrdersToOrdersList(
  ordersList: BranchOrdersResponse
): ItemsList<Order> {
  return {
    totalItemsCount: ordersList.metadata.totalCount,
    items: ordersList.orders.map((order) => {
      return new Order({
        id: order.orderId,
        addressId: order.addressId,
        branchId: order.branchId,
        scheduled: order.scheduled,
        scheduledTo: new HoursRange({
          from: new Time(order.scheduledTo.from),
          to: new Time(order.scheduledTo.to),
        }),
        creationDate: new Datetime(order.creationDate),
        customerId: order.customerId,
        customerOrderId: new CustomerOrderId(order.customerOrderId),
        deliveryFees: new Money({
          amount: order.deliveryFees,
          currency: 'EGP',
        }),
        isB2C: OrderType.B2C.equals(order.type),
        isC2C: OrderType.C2C.equals(order.type),
        items: order.items.map((item) => {
          return new OrderItem({
            itemId: item.itemId,
            notes: item.notes,
            options: item.options.map((option) => {
              return new OrderItemOption({
                optionId: option.optionId,
                selections: option.selections.map((selection) => {
                  return new OrderItemOptionSelection({
                    price: new Money({
                      amount: selection.price,
                      currency: 'EGP',
                    }),
                    selectionId: selection.selectionId,
                  });
                }),
              });
            }),
            price: new Money({ amount: item.price, currency: 'EGP' }),
            quantity: item.quantity,
          });
        }),
        type: new OrderType(order.type),
        lastUpdateDate: new Datetime(order.lastUpdateDate),
        notes: order.notes,
        paymentMethod: new OrderPaymentMethod(order.paymentMethod),
        status: new OrderStatus(order.status),
        subTotal: new Money({ amount: order.subTotal, currency: 'EGP' }),
        tax: new Money({ amount: order.tax, currency: 'EGP' }),
        total: new Money({ amount: order.total, currency: 'EGP' }),
        totalWithoutDeliveryFees: new Money(order.totalWithoutDeliveryFees),
        vendorId: order.vendorId,
        vendorTaskId: order.vendorOrderId,
      });
    }),
  };
}
