import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { Order } from '../models/Order';
import { OrderJourney } from '../models/OrderJourney';
import { RejectionReason } from '../models/RejectionReason';
import { RejectionReasonForm } from '../models/RejectionReasonForm';

export interface OrdersRepo {
  acceptOrder(orderId: EntityId): Promise<void>;
  rejectOrder(
    orderId: EntityId,
    rejectionForm: RejectionReasonForm
  ): Promise<void>;
  getRejectionReasons(): Promise<RejectionReason[]>;
  getOrderJourney(orderId: EntityId): Promise<OrderJourney>;
  getOrder(orderId: EntityId): Promise<Order>;
  updateOrder(order: Order): Promise<void>;
  calculateOrder(order: Order): Promise<Order>;
  getPendingOrders(): Promise<ItemsList<Order>>;
  getScheduledOrders(): Promise<ItemsList<Order>>;
  getWorkingOrders(): Promise<ItemsList<Order>>;
  listOrders(args: ListingQuery): Promise<ItemsList<Order>>;
}
