import { CancellationReason } from '../models/OrderCancellationReasons';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { Order, OrderStatus, QueuedOrdersCounts } from '../models/Order';
import { RejectionReason } from '../models/RejectionReason';
import { RejectionReasonForm } from '../models/RejectionReasonForm';

export interface OrdersRepo {
  listOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  listQueuedOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  listOngoingOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  getQueuedOrdersCounts(query?: ListingQuery): Promise<QueuedOrdersCounts>;
  listCancellationReasons(
    query?: ListingQuery
  ): Promise<Record<string, CancellationReason[]>>;
  cancelOrder(
    orderId: EntityId,
    cancellationReasonId: EntityId,
    requestRefund: boolean
  ): Promise<void>;
  getRejectionReasons(): Promise<RejectionReason[]>;
  updateOrder(order: Order): Promise<void>;
  updateOrderStatus({
    orderId,
    status,
    totalPaid,
    rejectionForm,
  }: UpdateOrderStatusParams): Promise<void>;
  getOrder(orderId: EntityId): Promise<Order>;
  calculateOrder(order: Order): Promise<Order>;
}

export interface UpdateOrderStatusParams {
  orderId: EntityId;
  status: OrderStatus;
  totalPaid: number;
  rejectionForm: RejectionReasonForm;
}
