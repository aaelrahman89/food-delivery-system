import {
  ConsumerOrderResponse,
  OrderItemOption as OrderItemOptionResponse,
  OrderJourneyResponse,
  OrderRejectionReasonsResponse,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

import { Address } from '@survv/commons/core/models/Address';
import { DeliveryFleet } from '../../../../core/models/DeliveryFleet';
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

export function mapOrderResponseToOrder(
  orderResponse: ConsumerOrderResponse
): Order {
  return new Order({
    id: orderResponse.orderId,
    vendorId: orderResponse.vendorId,
    branchId: orderResponse.branchId,
    branchLabel: orderResponse.branchLabel,
    branchArea: new MultilingualString(orderResponse.branchAreaName),
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

    subtotal: new Money(orderResponse.subTotal),
    tax: new Money(orderResponse.tax),
    total: new Money(orderResponse.total),
    deliveryFee: new Money(orderResponse.deliveryFees),
    totalDueAmount: new Money(orderResponse.totalDueAmount),
    paymentMethod: new OrderPaymentMethod(orderResponse.paymentMethod),
    customerMobileNo: orderResponse.customerMobileNo,
    customerName: orderResponse.customerName,
    customerAddress: new Address({
      apartment: orderResponse.address.apartmentNo,
      building: orderResponse.address.building,
      street: orderResponse.address.addressLine1,
      floor: orderResponse.address.floor,
      companyName: orderResponse.address.companyName,
      landmark: orderResponse.address.landmark,
    }),
    assignedAgent: {
      id: orderResponse.assignedAgent.id,
      email: orderResponse.assignedAgent.email,
    },
    deliverBy: new DeliveryFleet(orderResponse.deliverBy),
    actionDisplay: orderResponse.actionDisplay,
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

export function mapOrdersListV2ResponseToOrders(
  response: OrdersListV2Response
): ItemsList<Order> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.orders.map(
      (orderResponse) =>
        new Order({
          id: orderResponse.orderId,
          vendorId: orderResponse.vendorId,
          branchId: orderResponse.branchId,
          branchLabel: orderResponse.branchLabel,
          customerOrderId: new CustomerOrderId(orderResponse.customerOrderId),
          vendorDisplayName: new MultilingualString(
            orderResponse.vendorDisplayName
          ),
          creationDate: new Datetime(orderResponse.creationDate),
          acceptanceDate: new Datetime(orderResponse.acceptanceDate),
          lastUpdateDate: new Datetime(orderResponse.lastUpdateDate),
          scheduled: orderResponse.scheduled,
          scheduledTo: new HoursRange({
            from: new Time(orderResponse.scheduledTo.from),
            to: new Time(orderResponse.scheduledTo.to),
          }),
          totalWithoutDeliveryFees: new Money(
            orderResponse.totalWithoutDeliveryFees
          ),
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
                itemId: item.itemId,
                title: new MultilingualString(item.title),
                quantity: item.quantity,
                options: item.options.map(
                  (option) =>
                    new OrderItemOption({
                      optionId: option.optionId,
                      selections: option.selections.map(
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
                price: new Money({
                  amount: item.price,
                  currency: 'EGP',
                }),
              })
          ),
          subtotal: new Money({
            amount: orderResponse.subTotal,
            currency: 'EGP',
          }),
          tax: new Money({
            amount: orderResponse.tax,
            currency: 'EGP',
          }),
          total: new Money({
            amount: orderResponse.total,
            currency: 'EGP',
          }),
          deliveryFee: new Money({
            amount: orderResponse.deliveryFees,
            currency: 'EGP',
          }),
          totalDueAmount: new Money(orderResponse.totalDueAmount),
          paymentMethod: new OrderPaymentMethod(orderResponse.paymentMethod),
          customerMobileNo: orderResponse.customerMobileNo,
          assignedAgent: orderResponse.assignedAgent,
        })
    ),
  };
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
