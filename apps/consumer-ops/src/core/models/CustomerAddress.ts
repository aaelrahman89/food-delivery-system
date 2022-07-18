import { Area } from './Area';
import { City } from './City';
import { Country } from './Country';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { GeojsonFeature } from '@survv/commons/core/models/GeoJSON';

export class CustomerAddressStatus extends EnumClass {
  _prefix: string;

  static ACTIVE = new CustomerAddressStatus('ACTIVE');
  static INACTIVE = new CustomerAddressStatus('INACTIVE');

  constructor(value: string) {
    super(value);
    this._prefix = 'CUSTOMER_ADDRESS_STATUS';
  }
}

export class CustomerAddress implements CustomerAddressOptions {
  id = 0;
  title = '';
  country = new Country();
  city = new City();
  area = new Area();
  addressLine1 = '';
  building = '';
  floor = 0;
  apartmentNo = '';
  companyName = '';
  landmark = '';
  status = new CustomerAddressStatus('');
  pinnedLocation: GeojsonFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [],
    },
    properties: {},
  };

  constructor(options?: CustomerAddressOptions) {
    Object.assign(this, options);
  }
}

interface CustomerAddressOptions {
  id: EntityId;
  title: string;
  country: Country;
  city: City;
  area: Area;
  addressLine1: string;
  building: string;
  floor: number;
  apartmentNo: string;
  companyName: string;
  landmark: string;
  status: CustomerAddressStatus;
  pinnedLocation: GeojsonFeature;
}
