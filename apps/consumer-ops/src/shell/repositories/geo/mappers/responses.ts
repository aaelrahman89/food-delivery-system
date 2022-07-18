import { Area } from '../../../../core/models/Area';
import { AreaListResponse } from '@survv/api/definitions/areas';
import { City } from '../../../../core/models/City';
import { CityListResponse } from '@survv/api/definitions/cities';
import { Country } from '../../../../core/models/Country';
import { CountryListResponse } from '@survv/api/definitions/countries';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export function mapCountryListingResponseToCountries(
  response: CountryListResponse
): Country[] {
  return response.countries.map((country) => {
    return new Country({
      id: country.countryId,
      name: new MultilingualString(country.name),
    });
  });
}

export function mapCityListingResponseToCities(
  response: CityListResponse
): City[] {
  return response.cities.map((city) => {
    return new City({
      id: city.cityId,
      name: new MultilingualString(city.name),
      countryId: city.countryId,
    });
  });
}

export function mapAreaListingResponseToAreas(
  response: AreaListResponse
): Area[] {
  return response.areas.map((area) => {
    return new Area({
      id: area.areaId,
      name: new MultilingualString(area.name),
      cityId: area.cityId,
    });
  });
}
