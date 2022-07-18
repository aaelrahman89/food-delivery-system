import { CatalogueStatus } from './catalogues';
import {
  EmptyRequestObject,
  GeojsonPoint,
  GeojsonPolygon,
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
  OrderingHours,
  VendorType,
} from './common';
import { HashTagResponse, HashTagStatus } from './hash-tags';
import { ItemCatalogueSection, ItemOption } from './items';
import { OrderPaymentMethod, OrderStatus, OrderType } from './orders';
import { TagResponse, TagStatus, TagType } from './tags';

export interface BranchProfileUpdateRequest {
  displayName: MultilingualString;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  tagIds: number[];
  hashTagIds: number[];
  avgBasketSize: number;
}

export interface BranchProfileResponse {
  id: number;
  label: string;
  displayName: MultilingualString;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  hasProfile: boolean;
  tags: {
    id: number;
    title: MultilingualString;
    vendorType: VendorType;
    type: TagType;
    status: TagStatus;
    creationDate: string;
  }[];
  hashTags: {
    id: number;
    title: MultilingualString;
    vendorType: VendorType;
    status: HashTagStatus;
    creationDate: string;
  }[];
  avgBasketSize: MoneyWithCurrency;
}

export type BranchRequest = void;

export interface BranchResponse {
  id: number;
  hubId: number;
  vendorId: number;
  notificationToken: string;
  label: string;
  active: boolean;
  vendorName: string;
  vendorType: VendorType;
  displayName: MultilingualString;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartment: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  avgTransactionPerMonth: number;
  avgTransactionPerDay: number;
  avgTransactionPerHour: number;
  code: string;
  creationDate: string;
  contactPersons: [
    {
      fullName: string;
      mobileNo: number;
      email: string;
      title: string;
      creationDate: string;
    }
  ];
  rushHour: [
    {
      from: string;
      to: string;
    }
  ];
  deliveryFees: number;
  minimumOrderValue: number;
  vendorTax: number;
  orderingHours: OrderingHours;
  tags: [
    {
      id: number;
      title: MultilingualString;
      vendorType: VendorType;
      type: TagType;
      status: string;
      creationDate: string;
    }
  ];
  hashTags: [
    {
      id: number;
      title: MultilingualString;
      vendorType: VendorType;
      status: string;
      creationDate: string;
    }
  ];
  deliverySMS: boolean;
  tabletRent: boolean;
}

export type BranchCataloguesListRequest = void;

export type BranchCataloguesListResponse = BranchCataloguesListResponseItem[];

export interface BranchCataloguesListResponseItem {
  catalogueId: number;
  title: MultilingualString;
  description: MultilingualString;
  vendor: {
    id: number;
    type: VendorType;
  };
  status: CatalogueStatus;
  publishedBranches: number[];
  orderingHours: OrderingHours;
}

export type BranchItemRequest = void;

export interface BranchItemResponse {
  itemId: number;
  catalogueId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  price: MoneyWithCurrency;
  calories: number;
  prepTime: number;
  tags: {
    id: number;
    imageId: number;
    title: MultilingualString;
    status: TagStatus;
    vendorType: VendorType;
    type: TagType;
    creationDate: string;
  }[];
  hashTags: HashTagResponse[];
  catalogueSections: ItemCatalogueSection[];
  options: ItemOption[];
  coverPhotosIds: number[];
  defaultCoverPhoto: number;
  archived: boolean;
  popular: boolean;
  available: boolean;
  branchB2CStatus: BranchB2CStatus;
  creationDate: string;
}

export interface ConsumerBranchItemResponse {
  itemId: number;
  catalogueId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  price: MoneyWithCurrency;
  calories: number;
  prepTime: number;
  tags: {
    id: number;
    title: MultilingualString;
    status: TagStatus;
    vendorType: VendorType;
    type: TagType;
    creationDate: string;
  }[];
  hashTags: HashTagResponse[];
  catalogueSections: ItemCatalogueSection[];
  options: ItemOption[];
  coverPhotosIds: number[];
  defaultCoverPhoto: number;
  archived: boolean;
  popular: boolean;
  available: boolean;
  branchB2CStatus: BranchB2CStatus;
  creationDate: string;
}

export type BranchItemsListRequest = void;
export interface BranchItemsListResponse {
  metadata: ListingMetadata;
  items: BranchItemsListItem[];
}

export interface BranchItemsListSelection {
  selectionId: number;
  title: MultilingualString;
  calories: number;
  price: MoneyWithCurrency;
}

export interface BranchItemsListOption {
  optionId: number;
  title: MultilingualString;
  description: MultilingualString;
  mandatory: boolean;
  multiSelection: boolean;
  minAllowed: number;
  maxAllowed: number;
  selections: BranchItemsListSelection[];
  creationDate: string;
}

export interface BranchItemsListSections {
  catalogueSectionId: number;
  displayName: MultilingualString;
  creationDate: string;
}

export interface BranchItemsListItem {
  itemId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  calories: number;
  prepTime: number;
  popular: boolean;
  available: boolean;
  price: MoneyWithCurrency;
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  options: BranchItemsListOption[];
  catalogueId: number;
  defaultCoverPhotoId: number;
  catalogueSectionIds: number[];
  coverPhotosIds: [number];
  creationDate: string;
}

export type BranchPilotRequestingRequest = void;

export interface BranchPilotRequestingResponse {
  tripId: number;
  taskId: number;
  maxAllowedTasksCount: number;
}

export interface BranchPilotRequestingV2Request {
  zoneName: MultilingualString;
}

export interface BranchPilotRequestingV2Response {
  tripId: number;
  taskId: number;
  maxAllowedTasksCount: number;
}

// GET /branches
export type BranchesListRequest = void;
export type BranchesListResponse = Array<{
  id: number;
  vendorId: number;
  avgTransactionPerHour: number;
  label: string;
  vendorLabel: string;
  creationDate: string;
  displayName: MultilingualString;
  active: boolean;
  deliverySMS: boolean;
  serviceTypes: string[];
  b2cStatus: BranchB2CStatus;
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
}>;

// POST /branches/{id}/code-reset
export type ResetBranchRequest = void;
export type ResetBranchResponse = void;

// POST /branches/{id}/disable-delivery-sms
export type DisableDeliverySMSRequest = void;
export type DisableDeliverySMSResponse = void;

// POST /branches/{id}/enable-delivery-sms
export type EnableDeliverySMSRequest = void;
export type EnableDeliverySMSResponse = void;

// POST /branches/{id}/add-data-bundle
export type AddDataBundleRequest = void;
export type AddDataBundleResponse = void;

// GET /branches/{id}/code
export type RetrieveBranchCodeRequest = void;
export interface RetrieveBranchCodeResponse {
  id: number;
  code: string;
}
export interface WebPushSubscription {
  auth: string;
  key: string;
  endpoint: string;
}
// POST /branches/{id}/notifications/subscribe
export type SubscriptionRequest = WebPushSubscription;

export type SubscriptionResponse = void;

// POST /branches/{id}/notifications/refresh
export interface SubscriptionRefreshRequest {
  oldSubscription: WebPushSubscription;
  newSubscription: WebPushSubscription;
}

export type SubscriptionRefreshResponse = void;

// GET /branches/{id}/served-zones
export type BranchServedZonesRequest = void;
export interface BranchServedZonesResponse {
  branchLocation: GeojsonPoint;
  hubLocation: GeojsonPoint;
  zones: {
    zoneId: number;
    zoneName: MultilingualString;
    rateName: string;
    rateValue: MoneyWithCurrency;
    polygon: GeojsonPolygon;
  }[];
}

export type BranchSignOutRequest = EmptyRequestObject;
export type BranchSignOutResponse = {
  id: number;
};
export type BranchOrdersRequest = void;
export interface BranchOrdersResponse {
  metadata: ListingMetadata;
  orders: BranchOrdersResponseItem[];
}
export interface BranchOrdersResponseItem {
  orderId: number;
  items: Array<{
    itemId: number;
    price: number;
    quantity: number;
    notes: string;
    options: Array<{
      optionId: number;
      selections: Array<{
        selectionId: number;
        price: number;
      }>;
    }>;
  }>;
  customerOrderId: string;
  creationDate: string;
  lastUpdateDate: string;
  customerId: number;
  branchId: number;
  vendorId: number;
  addressId: number;
  paymentMethod: OrderPaymentMethod;
  notes: string;
  subTotal: number;
  tax: number;
  taxWithoutDeliveryFees: MoneyWithCurrency;
  deliveryFees: number;
  totalWithoutDeliveryFees: MoneyWithCurrency;
  total: number;
  vendorOrderId: string;
  status: OrderStatus;
  type: OrderType;
  scheduled: boolean;
  scheduledTo: OrderingHours;
}

export type BranchDetailsRequest = void;
export interface BranchDetailsResponse {
  id: number;
  hubId: number;
  vendorId: number;
  notificationToken: string;
  label: string;
  active: boolean;
  vendorName: string;
  vendorType: string;
  displayName: MultilingualString;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartment: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  avgTransactionPerMonth: number;
  avgTransactionPerDay: number;
  avgTransactionPerHour: number;
  creationDate: string;
  contactPersons: [
    {
      fullName: string;
      mobileNo: string;
      email: string;
      title: string;
      creationDate: string;
    }
  ];
  rushHour: [
    {
      from: string;
      to: string;
    }
  ];
  minimumOrderValue: number;
  vendorTax: number;
  orderingHours: {
    from: string;
    to: string;
  };
  notificationSubscription: {
    auth: string;
    key: string;
    endpoint: string;
  };
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  deliverySMS: boolean;
  tabletRent: boolean;
  serviceTypes: string[];
  b2cStatus: BranchB2CStatus;
}
export interface ConsumerBranchDetailsResponse {
  id: number;
  hubId: number;
  vendorId: number;
  notificationToken: string;
  label: string;
  active: boolean;
  vendorName: string;
  vendorType: string;
  displayName: MultilingualString;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  avgTransactionPerMonth: number;
  avgTransactionPerDay: number;
  avgTransactionPerHour: number;
  creationDate: string;
  contactPersons: [
    {
      fullName: string;
      mobileNo: string;
      email: string;
      title: string;
      creationDate: string;
    }
  ];
  rushHour: [
    {
      from: string;
      to: string;
    }
  ];
  minimumOrderValue: number;
  orderingHours: {
    from: string;
    to: string;
  };
  notificationSubscription: {
    auth: string;
    key: string;
    endpoint: string;
  };
  tags: [
    {
      id: number;
      title: MultilingualString;
      vendorType: string;
      type: string;
      status: string;
      creationDate: string;
    }
  ];
  hashTags: [
    {
      id: number;
      title: MultilingualString;
      vendorType: string;
      status: string;
      creationDate: string;
    }
  ];
  b2cStatus: string;
  avgBasketSize: MoneyWithCurrency;
  stacking: boolean;
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
}
export interface BusinessBranchDetailsResponse {
  id: number;
  hubId: number;
  vendorId: number;
  notificationToken: string;
  label: string;
  active: boolean;
  vendorName: string;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  creationDate: string;
  contactPersons: [
    {
      fullName: string;
      mobileNo: string;
      email: string;
      title: string;
      creationDate: string;
    }
  ];
  notificationSubscription: {
    auth: string;
    key: string;
    endpoint: string;
  };
  deliverySMS: boolean;
  tabletRent: boolean;
}

export interface AddTaskRequest {
  zoneName: MultilingualString;
}

export type AddTaskResponse = void;

export type BranchB2CStatus = string &
  (
    | 'AVAILABLE'
    | 'BUSY_ONE_HOUR'
    | 'BUSY_TWO_HOUR'
    | 'BUSY_THREE_HOUR'
    | 'OUT_OF_SERVICE'
    | 'OUT_OF_WORKING_HOURS'
  );

export interface SetBranchB2CStatusRequest {
  b2cStatus: BranchB2CStatus;
}

export type SetBranchB2CStatusResponse = void;

export type B2CBranchesListRequest = void;

export interface B2CBranchesListResponse {
  metadata: ListingMetadata;
  branches: {
    id: number;
    vendorId: number;
    hubId: number;
    avgTransactionPerHour: number;
    label: string;
    vendorLabel: string;
    serviceTypes: string[];
    creationDate: string;
    displayName: MultilingualString;
    active: boolean;
    deliverySMS: boolean;
    b2cStatus: string;
  }[];
}

export type ConsumerB2CBranchesListRequest = void;

export interface ConsumerB2CBranchesListResponse {
  metadata: ListingMetadata;
  branches: {
    id: number;
    vendorId: number;
    hubId: number;
    avgTransactionPerHour: number;
    label: string;
    vendorLabel: string;
    creationDate: string;
    displayName: MultilingualString;
    active: boolean;
    b2cStatus: string;
  }[];
}

export type BranchesListV2Request = void;

export interface BranchesListV2Response {
  metadata: ListingMetadata;
  branches: {
    id: number;
    vendorId: number;
    hubId: number;
    avgTransactionPerHour: number;
    label: string;
    vendorLabel: string;
    serviceTypes: string[];
    creationDate: string;
    displayName: MultilingualString;
    active: boolean;
    deliverySMS: boolean;
    b2cStatus: string;
    maxStackedOrders: number;
    stackingWindowInMinutes: number;
    stacking: boolean;
  }[];
}

export type UnAssignBranchFromHubRequest = void;

export type UnAssignBranchFromHubResponse = void;

export type UnAssignExtendedBranchFromHubRequest = void;

export type UnAssignExtendedBranchFromHubResponse = void;

export interface BranchCreationRequest {
  label: string;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  contactPersons: {
    fullName: string;
    mobileNo: string;
    email: string;
    title: string;
  }[];
  avgTransactionPerHour?: number;
  avgTransactionPerDay?: number;
  avgTransactionPerMonth?: number;
  rushHours?: OrderingHours[];
  orderingHours: OrderingHours;
  active: boolean;
  displayName: MultilingualString;
  minimumOrderValue: MoneyWithCurrency;
  tagIds: number[];
  hashTagIds: number[];
  avgBasketSize: number;
  deliveryFees: number;
  posIntegrated: boolean;
  posIntegrationType: string;
}
export interface BranchCreationResponse {
  id: number;
  creationDate: string;
}

export interface BranchUpdateRequest {
  hubId?: number;
  vendorId: number;
  label: string;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  contactPersons: {
    fullName: string;
    mobileNo: string;
    email: string;
    title: string;
  }[];
  avgTransactionPerHour: number;
  avgTransactionPerDay: number;
  avgTransactionPerMonth: number;
  rushHours: OrderingHours[];
  active: boolean;
  displayName: MultilingualString;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  tagIds: number[];
  hashTagIds: number[];
  avgBasketSize: number;
  deliveryFees: number;
  posIntegrated: boolean;
  posIntegrationType: string;
}
export interface BranchUpdateResponse {
  id: number;
  creationDate: string;
}

export type VendorBranchesListingRequest = void;
export interface VendorBranchesListingResponse {
  metadata: ListingMetadata;
  branches: {
    id: number;
    vendorId: number;
    hubId: number;
    avgTransactionPerHour: number;
    label: string;
    vendorLabel: string;
    creationDate: string;
    displayName: MultilingualString;
    active: boolean;
    b2cStatus: BranchB2CStatus;
    orderingHours: {
      from: string;
      to: string;
    };
    stacking: boolean;
    maxStackedOrders: number;
    stackingWindowInMinutes: number;
    posIntegrated: boolean;
    posIntegrationType: string;
  }[];
}

export type VendorBranchProfileRequest = void;
export interface VendorBranchProfileResponse {
  id: number;
  vendorId: number;
  hubId: number;
  label: string;
  minimumOrderValue: number;
  active: boolean;
  vendorName: string;
  vendorType: VendorType;
  displayName: MultilingualString;
  avgTransactionPerMonth: number;
  avgTransactionPerDay: number;
  avgTransactionPerHour: number;
  deliveryFees: MoneyWithCurrency;
  creationDate: string;
  contactPersons: {
    fullName: string;
    mobileNo: string;
    email: string;
    title: string;
    creationDate: string;
  }[];
  rushHour: {
    from: string;
    to: string;
  }[];
  orderingHours: {
    from: string;
    to: string;
  };
  notificationToken: string;
  notificationSubscription: {
    auth: string;
    key: string;
    endpoint: string;
  };
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  b2cStatus: BranchB2CStatus;
  avgBasketSize: MoneyWithCurrency;
  stacking: boolean;
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  posIntegrated: boolean;
  posIntegrationType: string;
}
