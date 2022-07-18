import { Address } from '@survv/commons/core/models/Address';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  GeoJSONPoint,
  GeojsonFeature,
  GeojsonFeatureCollection,
} from '@survv/commons/core/models/GeoJSON';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

import { OrderPaymentMethod, OrderStatus } from './Order';
import { OrderType } from '@survv/commons/core/models/OrderType';

export class PickupStatus extends EnumClass {
  _prefix: string;

  static REQUESTED = new OrderStatus('REQUESTED');
  static COLLECTING = new OrderStatus('COLLECTING');
  static COLLECTED = new OrderStatus('COLLECTED');
  static DELIVERED = new OrderStatus('DELIVERED');
  static DELETED = new OrderStatus('DELETED');

  constructor(value: string) {
    super(value);
    this._prefix = 'ERRAND_ORDER_PICKUP_STATUS';
  }
}

export class ErrandOrder implements ErrandOrderOptions {
  id = 0;
  customerOrderId = new CustomerOrderId();
  customerAddress = new Address();
  creationDate = new Datetime();
  status = new OrderStatus('');
  type = new OrderType('');
  subTotal = new Money();
  tax = new Money();
  consumedBalance = new Money();
  totalDueAmount = new Money();
  total = new Money();
  estimatedDeliveryFees = new Money();
  deliveryFees = new Money();
  deliveryFeesTax = new Money();
  paymentMethod = new OrderPaymentMethod('');
  customerMobileNo = '';
  customerName = '';
  orderPickups: ErrandOrderPickup[] = [];
  maxErrandPoints = 0;
  customerLocationFeature: GeojsonFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [],
    },
    properties: {},
  };

  constructor(options?: ErrandOrderOptions) {
    Object.assign(this, options);
  }
}

export class ErrandOrderPickupItem implements ErrandOrderPickupItemOptions {
  name = '';
  brand = '';
  quantity = '';
  notes = '';

  constructor(options?: ErrandOrderPickupItemOptions) {
    Object.assign(this, options);
  }
}

export class ErrandOrderPickup implements ErrandOrderPickupOptions {
  categoryDisplayName = new MultilingualString();
  pickupStatus = new PickupStatus('');
  pickupId = 0;
  categoryId = 0;
  location = {
    locationDescription: '',
    pickupLocation: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: new GeoJSONPoint(),
          properties: {
            dataType: 'CUSTOMER_LOCATION',
          },
        },
      ],
    },
  };

  description = '';
  uploadedImages: ImageUrlString[] = [];
  voiceNote = '';
  includePictures = false;
  includeVoiceNote = false;
  deleted = false;
  items: ErrandOrderPickupItem[] = [];

  constructor(options?: ErrandOrderPickupOptions) {
    Object.assign(this, options);
  }
}

interface ErrandOrderOptions {
  id: EntityId;
  customerOrderId: CustomerOrderId;
  customerAddress: Address;
  creationDate: Datetime;
  status: OrderStatus;
  type: OrderType;
  subTotal: Money;
  tax: Money;
  consumedBalance: Money;
  totalDueAmount: Money;
  total: Money;
  estimatedDeliveryFees: Money;
  deliveryFees: Money;
  deliveryFeesTax: Money;
  paymentMethod: OrderPaymentMethod;
  customerMobileNo: string;
  customerName: string;
  orderPickups: ErrandOrderPickup[];
  customerLocationFeature: GeojsonFeature;
  maxErrandPoints: number;
}

interface ErrandOrderPickupOptions {
  categoryDisplayName: MultilingualString;
  pickupStatus: PickupStatus;
  categoryId: number;
  pickupId: number;
  location: {
    locationDescription: string;
    pickupLocation: GeojsonFeatureCollection;
  };
  description: string;
  uploadedImages: ImageUrlString[];
  voiceNote: string;
  includePictures: boolean;
  includeVoiceNote: boolean;
  deleted: boolean;
  items: ErrandOrderPickupItem[];
}

interface ErrandOrderPickupItemOptions {
  name: string;
  brand: string;
  quantity: string;
  notes: string;
}
