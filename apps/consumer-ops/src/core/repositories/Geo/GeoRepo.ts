import { Area } from '../../models/Area';
import { City } from '../../models/City';
import { Country } from '../../models/Country';
import { QueryFilter } from '@survv/commons/core/models/Query';

export interface GeoRepo {
  getCountries(): Promise<Country[]>;
  getCities(filter: QueryFilter): Promise<City[]>;
  getAreas(filter: QueryFilter): Promise<Area[]>;
}
