import { CitiesListV2Response } from '@survv/api/definitions/cities';
import { City } from '../../../../core/models/City';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export function mapCitiesListV2ResponseToCities(
  response: CitiesListV2Response
): City[] {
  return response.cities.map(
    (city) =>
      new City({
        id: city.cityId,
        countryId: city.countryId,
        name: new MultilingualString(city.name),
      })
  );
}
