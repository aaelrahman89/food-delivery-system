import { EntityId } from '../../commons/core/types';
import { ListingMetadata } from './common';

export type CancellationReasonsListV2Request = void;

export interface CancellationReasonsListV2Response {
  metadata: ListingMetadata;
  cancellationReasons: CancellationReason[];
}

type CancellationReason = {
  id: EntityId;
  category: CancellationReasonCategory;
  label: string;
  orderTypes: OrderType[];
};

export type OrderType = string & ('B2C' | 'ERRANDS');

export type CancellationReasonCategory = string &
  (
    | 'VENDOR_FAULT'
    | 'SURVV_FAULT'
    | 'CUSTOMER_FAULT'
    | 'PILOT_FAULT'
    | 'QUICK_CANCELLATION'
  );
