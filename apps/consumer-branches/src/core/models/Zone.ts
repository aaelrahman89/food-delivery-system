import { EntityId } from '@survv/commons/core/types';
import {
  GeoJSONPoint,
  GeoJSONPolygon,
} from '@survv/commons/core/models/GeoJSON';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class BranchServedZones implements BranchServedZonesOptions {
  readonly branchLocation = new GeoJSONPoint();

  readonly hubLocation = new GeoJSONPoint();

  readonly zones: Array<Zone> = [];

  constructor(options?: BranchServedZonesOptions) {
    Object.assign(this, options);
  }
}

interface BranchServedZonesOptions {
  branchLocation: GeoJSONPoint;
  hubLocation: GeoJSONPoint;
  zones: Array<Zone>;
}

export interface Zone {
  id: EntityId;
  name: MultilingualString;
  rateName: string;
  rateValue: Money;
  polygon: GeoJSONPolygon;
}
