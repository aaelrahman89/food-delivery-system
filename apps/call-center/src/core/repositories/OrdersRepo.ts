import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { Order } from '../models/Order';
import { OrderJourney } from '../models/OrderJourney';
import { RejectOrderFormArgs } from '../blocs/agent/AgentOrderDetailsMessage';
import { RejectionReason } from '../models/RejectionReason';

export interface OrdersRepo {
  getOrder(orderId: EntityId): Promise<Order>;
  getOrderJourney(orderId: EntityId): Promise<OrderJourney>;
  listOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  listAgentQueuedOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  listSupervisorQueuedOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  listWorkingOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  listScheduledOrders(query?: ListingQuery): Promise<ItemsList<Order>>;
  acceptOrder(
    branchId: EntityId,
    orderId: EntityId,
    vendorOrderId: string
  ): Promise<void>;
  rejectOrder(
    orderId: EntityId,
    branchId: EntityId,
    rejectionForm: RejectOrderFormArgs
  ): Promise<void>;
  getRejectionReasons(): Promise<RejectionReason[]>;
  assignOrder(orderId: EntityId): Promise<void>;
}
