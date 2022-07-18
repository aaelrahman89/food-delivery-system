import { EntityId } from '@survv/commons/core/types';
import { ErrandsOrderJourney } from '../models/ErrandsOrderJourney';

export interface ErrandsOrderJourneyRepo {
  getErrandsOrderJourney(orderId: EntityId): Promise<ErrandsOrderJourney>;
}
