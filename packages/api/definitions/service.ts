import { ListingMetadata, MultilingualString } from './common';

export type ServiceType = string & 'ERRANDS';
export type ServiceCategory = string & ('B2C' | 'B2B' | 'C2C' | 'NONE');

export type ServiceListRequest = void;
export interface ServiceListResponse {
  metadata: ListingMetadata;
  serviceCatalogues: Array<Service>;
}

interface Service {
  id: number;
  name: MultilingualString;
  serviceCategory: ServiceCategory;
  serviceType: ServiceType;
  active: boolean;
}
