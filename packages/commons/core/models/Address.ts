import { GeojsonCoordinates } from '../../../api/definitions/common';

export class Address implements AddressOptions {
  building = '';
  floor = 0;
  street = '';
  apartment = '';
  companyName = '';
  landmark = '';
  cityId = 0;
  areaId = 0;
  countryId = 0;
  coordinates: GeojsonCoordinates = [];

  constructor(options?: AddressOptions) {
    Object.assign(this, options);
  }

  toString(): string {
    let addressString = '';
    if (this.building) {
      addressString += `${this.building}, `;
    }
    if (this.street) {
      addressString += `${this.street}, `;
    }
    if (this.floor) {
      addressString += `Floor ${this.floor}, `;
    }
    if (this.apartment) {
      addressString += `Apartment ${this.apartment}, `;
    }
    if (this.companyName) {
      addressString += `Company ${this.companyName}, `;
    }
    if (this.landmark) {
      addressString += `Near ${this.landmark}, `;
    }

    return addressString.slice(0, addressString.length - 2);
  }
}

interface AddressOptions {
  building: string;
  floor: number;
  street: string;
  apartment: string;
  companyName?: string;
  landmark?: string;
  cityId?: number;
  areaId?: number;
  countryId?: number;
  coordinates?: GeojsonCoordinates;
}
