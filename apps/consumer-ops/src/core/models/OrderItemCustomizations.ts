import { EntityId } from '@survv/commons/core/types';

export interface OrderItemCustomization {
  selectionId: EntityId;
  optionId: EntityId;
  relatedOptions: { selectionId: EntityId; optionId: EntityId }[];
}
