import { Area } from '../../../../core/models/Area';
import { AreasListV2Response } from '@survv/api/definitions/areas';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export function mapAreasListV2ResponseToAreas(
  response: AreasListV2Response
): Area[] {
  return response.areas.map(
    (area) =>
      new Area({
        id: area.areaId,
        cityId: area.cityId,
        name: new MultilingualString(area.name),
      })
  );
}

export function mapAreasListV2ResponseToAreasBottomSheetGroup(
  response: AreasListV2Response
): BottomSheetListGroup<Area>[] {
  return [
    {
      items: response.areas.map((area) => ({
        id: area.areaId,
        label: area.name,
        value: new Area({
          id: area.areaId,
          name: new MultilingualString(area.name),
          cityId: area.cityId,
        }),
      })),
    },
  ];
}
