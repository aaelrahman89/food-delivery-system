import { BranchServedZones } from '../../../../core/models/Zone';
import { BranchServedZonesResponse } from '@survv/api/definitions/branches';
import {
  GeoJSONPoint,
  GeoJSONPolygon,
} from '@survv/commons/core/models/GeoJSON';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export function mapBranchServedZonesResponseToBranchServedZones(
  response: BranchServedZonesResponse
): BranchServedZones {
  return new BranchServedZones({
    branchLocation: new GeoJSONPoint(response.branchLocation.coordinates),
    hubLocation: new GeoJSONPoint(response.branchLocation.coordinates),
    zones: response.zones.map((zone) => ({
      id: zone.zoneId,
      name: new MultilingualString(zone.zoneName),
      rateName: zone.rateName,
      rateValue: new Money(zone.rateValue),
      polygon: new GeoJSONPolygon(zone.polygon.coordinates),
    })),
  });
}
