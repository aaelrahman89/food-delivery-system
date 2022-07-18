import { HashTagResponse } from './hash-tags';
import {
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
  OrderingHours,
  VendorPosIntegrationType,
  VendorType,
} from './common';
import { TagResponse, TagType } from './tags';
import { UserRole } from './users';

export type VendorsUntaxedCatalogueListRequest = void;
export interface VendorsUntaxedCatalogueListResponse {
  catalogues: Array<{
    id: number;
    displayName: MultilingualString;
  }>;
}

export type VendorsListRequest = void;
export interface VendorsListResponse {
  metadata: ListingMetadata;
  vendors: Array<{
    id: number;
    branchCount: number;
    transactionCount: number;
    label: string;
    active: boolean;
    type: VendorType;
    prepaid: boolean;
    trackingSMS: boolean;
    hasPendingReceipts: boolean;
    subscriptionStatus: string;
    creationDate: string;
    tags: Array<{
      id: number;
      title: MultilingualString;
      vendorType: VendorType;
      type: TagType;
      status: string;
      creationDate: string;
    }>;
    dispatchPriority: DispatchPriority;
    activeOverdraft: boolean;
    hasProfile: boolean;
    displayName: MultilingualString;
    legalInfo: {
      companyName: string;
      companyAddress: string;
    };
  }>;
}

export type ConsumerVendorProfileRequest = void;

export interface ConsumerVendorProfileResponse {
  id: number;
  displayName: MultilingualString;
  branchCount: number;
  activeBranchesCount: number;
  averagePrepTime: number;
  transactionCount: number;
  legalInfo: { companyName: string; companyAddress: string };
  label: string;
  type: VendorType;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  creationDate: string;
  active: boolean;
  fake: boolean;
  vendorUsers: VendorUserResponse[];
  hashTags: HashTagResponse[];
  tags: TagResponse[];
  taxStatus: VendorTaxStatus;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  rating: number;
  orderingSystem: OrderingSystem;
  deliverBy: DeliveryFleet;
  dispatchingModel: DispatchingModel;
  estimatedDeliveryTimeInMinutes: number;
  deliveryFees: MoneyWithCurrency;
  description: MultilingualString;
  ledgerId: number;
  stacking: boolean;
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
  posIntegrated: boolean;
  posIntegrationType: VendorPosIntegrationType;
}

export interface VendorProfileResponse {
  id: number;
  label: string;
  displayName: MultilingualString;
  description: MultilingualString;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  tax: number;
  taxStatus: VendorTaxStatus;
  minimumOrderValue: MoneyWithCurrency;
  averagePrepTime: number;
  orderingHours: OrderingHours;
  hasProfile: boolean;
  hashTags: HashTagResponse[];
  tags: TagResponse[];
}

export type VendorProfileRequest = void;

export interface VendorProfileCreationRequest {
  displayName: MultilingualString;
  description: MultilingualString;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  tax: number;
  taxStatus: VendorTaxStatus;
  minimumOrderValue: MoneyWithCurrency;
  averagePrepTime: number;
  orderingHours: OrderingHours;
  hashTagIds: number[];
  tagIds: number[];
}

export type VendorProfileCreationResponse = void;

export interface VendorBranchProfileListItemResponse {
  id: number;
  label: string;
  displayName: MultilingualString;
  vendorId: number;
  active: boolean;
  hasProfile: boolean;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  avgBasketSize: MoneyWithCurrency;
}

export interface VendorBranchProfileListResponse {
  metadata: ListingMetadata;
  branches: VendorBranchProfileListItemResponse[];
  missingODProfileBranchesCount: number;
}

export interface ConsumerVendorBranchProfileListItemResponse {
  id: number;
  label: string;
  displayName: MultilingualString;
  vendorId: number;
  active: boolean;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  avgBasketSize: MoneyWithCurrency;
}

export interface ConsumerVendorBranchProfileListResponse {
  metadata: ListingMetadata;
  branches: ConsumerVendorBranchProfileListItemResponse[];
}

export interface VendorProfileUpdateRequest {
  displayName: MultilingualString;
  description: MultilingualString;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  tax: number;
  taxStatus: VendorTaxStatus;
  minimumOrderValue: MoneyWithCurrency;
  averagePrepTime: number;
  orderingHours: {
    from: string;
    to: string;
  };
  hashTagIds: number[];
  tagIds: number[];
}

export interface SetOpeningBalanceRequest {
  amount: number;
}

export type SetOpeningBalanceResponse = void;

export interface AddCreditNoteRequest {
  description: string;
  amount: number;
}

export type AddDebitNoteResponse = void;

export interface AddDebitNoteRequest {
  description: string;
  amount: number;
}

export type AddCreditNoteResponse = void;

type DispatchPriority = string & ('NORMAL' | 'HIGH' | 'NONE');

export type VendorProfileUpdateResponse = void;

interface AccountStatementResponseTransaction {
  transactionId: number;
  referenceId: number;
  referenceType: string;
  type: TransactionType;
  amount: MoneyWithCurrency;
  balanceAfter: MoneyWithCurrency;
  creationDate: string;
  effectiveDate: string;
  details: Record<string, unknown>;
}

export type TransactionType = string & ('CREDIT' | 'DEBIT');

export type AccountStatementRequest = void;

export interface AccountStatementResponse {
  metadata: ListingMetadata;
  transactions: AccountStatementResponseTransaction[];
  openingBalance: MoneyWithCurrency;
  monthOpeningBalance: MoneyWithCurrency;
}

export type TiersRequest = void;

export interface TiersResponse {
  currentMultipleFees: boolean;
  futureMultipleFees: boolean;
  currentTiers: CurrentTiersResponseTier[];
  futureTiers: FutureTiersResponseTier[];
}

export interface CurrentTiersResponseTier {
  name: string;
  singleTransactionFees: MoneyWithCurrency;
  multipleTransactionsFees: MoneyWithCurrency;
  active: boolean;
  remainingTransactions: number;
  transactionsRange: {
    min: number;
    max: number;
  };
}

export interface FutureTiersResponseTier {
  name: string;
  singleTransactionFees: MoneyWithCurrency;
  multipleTransactionsFees: MoneyWithCurrency;
  transactionsRange: {
    min: number;
    max: number;
  };
}

export type PromotionsRequest = void;

export interface PromotionsResponse {
  metadata: {
    skipped: number;
    limit: number;
    totalCount: number;
    totalReturned: number;
  };
  promotions: [
    {
      id: number;
      percentage: number;
      creationDate: string;
      effectiveDate: string;
      expiryDate: string;
      title: string;
      type: PromotionType;
      lastUpdatedBy: {
        userId: number;
        userEmail: string;
      };
    }
  ];
}

export interface ConsumerVendorCreationRequest {
  label: string;
  active: boolean;
  fake: boolean;
  legalInfo: { companyName: string; companyAddress: string };
  type: VendorType;
  vendorUsers: VendorUser[];
  orderingSystem: OrderingSystem;
  deliverBy: DeliveryFleet;
  dispatchingModel: DispatchingModel;
  estimatedDeliveryTimeInMinutes: number;
  deliveryFees: number;
  displayName: MultilingualString;
  description: MultilingualString;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  taxStatus: VendorTaxStatus;
  averagePrepTime: number;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: OrderingHours;
  hashTagIds: number[];
  tagIds: number[];
  posIntegrated: boolean;
  posIntegrationType: string;
}

export interface ConsumerVendorCreationResponse {
  id: number;
  label: string;
  creationDate: string;
  vendorUsers: VendorUserResponse[];
}

export interface ConsumerVendorUpdateRequest {
  label: string;
  legalInfo: { companyName: string; companyAddress: string };
  active: boolean;
  fake: boolean;
  type: VendorType;
  orderingSystem: OrderingSystem;
  deliverBy: DeliveryFleet;
  dispatchingModel: DispatchingModel;
  estimatedDeliveryTimeInMinutes: number;
  deliveryFees: number;
  displayName: MultilingualString;
  description: MultilingualString;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  taxStatus: VendorTaxStatus;
  minimumOrderValue: MoneyWithCurrency;
  averagePrepTime: number;
  orderingHours: {
    from: string;
    to: string;
  };
  hashTagIds: number[];
  tagIds: number[];
  posIntegrated: boolean;
  posIntegrationType: string;
}

export type ConsumerVendorUpdateResponse = void;

export interface VendorUserCreationRequest {
  title: string;
  name: string;
  mobileNo: string;
  email: string;
  vendorId: number;
  roles?: CallCenterUserRole[];
}

export type CallCenterUserRole = string &
  (
    | 'VendorCallCenterAgent'
    | 'VendorCallCenterSupervisor'
    | 'VendorCallCenterSuperAdmin'
    | 'NONE'
  );

export interface VendorUserCreationResponse {
  vendorUserId: number;
  creationDate: string;
}

export type DeleteVendorUserRequest = void;
export type DeleteVendorUserResponse = void;

export interface SetVendorStackingRequest {
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
}
export type SetVendorStackingResponse = void;

export type DisableVendorStackingRequest = void;
export type DisableVendorStackingResponse = void;

export type PromotionType = string & ('DISCOUNT' | 'FREE_TRANSACTIONS');
export type PaymentRiskStatus = string &
  ('_03_NONE' | '_02_NORMAL' | '_01_AT_RISK');
export type SubscriptionStatus = string &
  (
    | '_01_AT_RISK'
    | '_02_DEBITED'
    | '_03_CONSUMED'
    | '_04_VALID'
    | '_05_UNSUBSCRIBED'
    | '_06_EXPIRED'
    | '_07_NONE'
  );
export type VendorUserStatus = string & ('Registered' | 'Unregistered');

export type VendorDetailsRequest = void;
export interface VendorDetailsResponse {
  id: number;
  paymentRiskStatus: PaymentRiskStatus;
  displayName: MultilingualString;
  ledgerId: number;
  branchCount: number;
  activeBranchesCount: number;
  averagePrepTime: number;
  transactionCount: number;
  legalInfo: {
    companyName: string;
    companyAddress: string;
  };
  label: string;
  type: VendorType;
  prepaid: boolean;
  trackingSMS: boolean;
  subscriptionStatus: SubscriptionStatus;
  languageSupport: {
    en: boolean;
    ar: boolean;
  };
  creationDate: string;
  active: boolean;
  vendorUsers: Array<{
    vendorUserId: number;
    fullName: string;
    mobileNo: string;
    email: string;
    title: string;
    status: VendorUserStatus;
    creationDate: string;
  }>;
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  tax: number;
  taxStatus: VendorTaxStatus;
  hasProfile: boolean;
  minimumOrderValue: MoneyWithCurrency;
  orderingHours: {
    from: string;
    to: string;
  };
  dispatchPriority: DispatchPriority;
  rating: number;
  fake: boolean;
  stacking: boolean;
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
}
export type VendorDebitCreditNotesListRequest = void;
export interface VendorDebitCreditNotesListResponse {
  metadata: ListingMetadata;
  notes: VendorDebitCreditNotesListResponseItem[];
}

export interface VendorDebitCreditNotesListResponseItem {
  id: number;
  accountId: number;
  serialNumber: string;
  description: string;
  amount: MoneyWithCurrency;
  creationDate: string;
  type: VendorDebitCreditNoteType;
  pdfStatus: DebitCreditPdfStatus;
  createdBy: {
    id: number;
    email: string;
  };
}

export type GetDebitCreditPDFDownloadUrlRequest = void;
export interface GetDebitCreditPDFDownloadUrlResponse {
  url: string;
}

export interface SetStackingConfigurationsRequest {
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
}
export type SetStackingConfigurationsResponse = void;

export type EnableStackingConfigurationsRequest = void;
export type EnableStackingConfigurationsResponse = void;

export type DisableStackingConfigurationsRequest = void;
export type DisableStackingConfigurationsResponse = void;

export type DebitCreditPdfStatus = string &
  ('PENDING' | 'GENERATED' | 'NOT_APPLICABLE');

export type VendorDebitCreditNoteType = string &
  ('DEBIT_BALANCE' | 'CREDIT_BALANCE');

export type VendorTaxStatus = string &
  ('NOT_APPLICABLE' | 'INCLUDED' | 'EXCLUDED');

export interface VendorUser {
  fullName: string;
  mobileNo: string;
  email: string;
  title: string;
}

export interface VendorUserResponse {
  vendorUserId: number;
  fullName: string;
  mobileNo: string;
  email: string;
  title: string;
  creationDate: string;
}
export type DispatchingModel = string &
  ('PICK_AND_GO' | 'ORDER_AND_PICKUP' | 'NONE');
export type OrderingSystem = string &
  ('CALL_CENTER_DASHBOARD' | 'BRANCHES_DASHBOARD' | 'FAKE_VENDOR');
export type DeliveryFleet = string & ('SURVV_FLEET' | 'VENDOR_FLEET' | 'NONE');

export interface BranchSignInRequest {
  code: string;
  notificationToken?: string;
}
export interface BranchSignInResponse {
  id: number;
  label: string;
  code: string;
  vendorId: number;
  token: string;
}

export type ListVendorUsersRequest = void;
export interface ListVendorUsersResponse {
  metadata: ListingMetadata;
  vendorUsers: {
    id: number;
    vendorId: number;
    active: boolean;
    name: string;
    mobileNo: string;
    email: string;
    title: string;
    roles: Array<UserRole>;
    lastUpdateDate: string;
    creationDate: string;
  }[];
}

export interface CreateVendorUserRequest {
  title?: string;
  name: string;
  mobileNo: string;
  email: string;
  vendorId: number;
  roles: string[];
}
export interface CreateVendorUserResponse {
  vendorUserId: number;
  creationDate: string;
}

export interface UpdateVendorUserRequest {
  title?: string;
  name: string;
  mobileNo: string;
  vendorId: number;
  roles: string[];
}
export type UpdateVendorUserResponse = void;
