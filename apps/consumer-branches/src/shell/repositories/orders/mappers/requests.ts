import { BranchB2CStatus } from '@survv/api/definitions/branches';
import { C2CStructuredOrder } from '../../../../core/models/C2COrder';
import { EntityId } from '@survv/commons/core/types';
import { Order } from '../../../../core/models/Order';
import {
  OrderCalculationRequest,
  OrderEnrichmentRequest,
  OrderUpdateRequest,
  RejectOrderRequest,
} from '@survv/api/definitions/orders';
import { RejectionReasonForm } from '../../../../core/models/RejectionReasonForm';

export function mapRejectionFormToRejectOrderRequest(
  orderId: EntityId,
  rejectionForm: RejectionReasonForm
): RejectOrderRequest {
  return {
    orderId,
    rejectionReasonId: rejectionForm.reasonId,
    unavailableItems: rejectionForm.unavailableItems.length
      ? rejectionForm.unavailableItems
      : undefined,
    unavailableSelections: rejectionForm.unavailableSelections.length
      ? rejectionForm.unavailableSelections
      : undefined,
    b2cBranchStatus:
      rejectionForm.b2cBranchStatus.valueOf() != ''
        ? (rejectionForm.b2cBranchStatus.valueOf() as BranchB2CStatus)
        : undefined,
    notes: rejectionForm.notes != '' ? rejectionForm.notes : undefined,
  };
}

export function mapC2CStructuredOrderToOrderEnrichmentRequest(
  structuredOrder: C2CStructuredOrder
): OrderEnrichmentRequest {
  return {
    items: structuredOrder.items.map(({ orderItemId, itemId, selections }) => ({
      orderItemId,
      itemId,
      selections,
    })),
  };
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
