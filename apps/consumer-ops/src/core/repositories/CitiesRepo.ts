import { City } from '../models/City';

export interface CitiesRepo {
  listCities(): Promise<City[]>;
}
