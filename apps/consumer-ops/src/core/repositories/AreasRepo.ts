import { Area } from '../models/Area';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { EntityId } from '@survv/commons/core/types';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface AreasRepo {
  listAreas(query?: QuerySpec): Promise<Area[]>;
  listAreasBottomSheetListGroup(): Promise<BottomSheetListGroup<Area>[]>;
  listCampaignAreas(
    referenceIds: EntityId[]
  ): Promise<BottomSheetListGroup<Area>[]>;
}
