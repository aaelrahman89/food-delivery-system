import { CancellationReason } from '../models/OrderCancellationReasons';
import { EntityId } from '@survv/commons/core/types';
import { ListingQuery } from '@survv/commons/core/models/Query';

export interface CancelErrandOrderRepo {
  listCancellationReasons(query?: ListingQuery): Promise<CancellationReason[]>;
  cancelOrder(
    orderId: EntityId,
    cancellationReasonId: EntityId,
    requestRefund: boolean
  ): Promise<void>;
}
