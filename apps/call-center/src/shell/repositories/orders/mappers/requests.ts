import {
  BranchB2CRequestStatus,
  RejectOrderRequest,
} from '@survv/api/definitions/orders';
import { EntityId } from '@survv/commons/core/types';
import { RejectOrderFormArgs } from '../../../../core/blocs/agent/AgentOrderDetailsMessage';

export function mapRejectionFormToRejectOrderRequest(
  orderId: EntityId,
  rejectionForm: RejectOrderFormArgs
): RejectOrderRequest {
  return {
    orderId,
    rejectionReasonId: rejectionForm.reasonId,
    unavailableItems: rejectionForm.unavailableItems
      ? rejectionForm.unavailableItems
      : undefined,
    unavailableSelections: rejectionForm.unavailableSelections
      ? rejectionForm.unavailableSelections
      : undefined,
    b2cBranchStatus: rejectionForm.b2cBranchStatus
      ? (rejectionForm.b2cBranchStatus as BranchB2CRequestStatus)
      : undefined,
    notes: rejectionForm.notes ? rejectionForm.notes : undefined,
  };
}
