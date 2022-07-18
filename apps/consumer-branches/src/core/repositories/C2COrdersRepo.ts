import { C2COrder, C2CStructuredOrder } from '../models/C2COrder';
import { EntityId } from '@survv/commons/core/types';

export interface C2COrdersRepo {
  getOrder(orderId: EntityId): Promise<C2COrder>;
  acceptC2COrder(order: C2CStructuredOrder): Promise<void>;
  rejectC2COrder(orderId: EntityId): Promise<void>;
}
