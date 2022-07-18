import {
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
} from './common';
import { OrderStatus } from './orders';

export type ReferralService = string & 'FOOD';

export type ReferralSetupResponse = void;
export type ReferralListRequest = void;

export interface ReferralSetupRequest {
  title: MultilingualString;
  description: MultilingualString;
  sharingMsg: MultilingualString;
  referrerBannerMsg: MultilingualString;
  refereeWithDeepLinkBannerMsg: MultilingualString;
  refereeWithoutDeepLinkBannerMsg: MultilingualString;
  referrerAmount: number;
  refereeDiscountType: ReferralDiscountType;
  refereeFixedValue: number;
  refereeMinSpending: number;
  refereePercentage: number;
  refereeCap: number;
  services: ReferralService[];
  referrerMaxAmount: number;
}
export interface ReferralListResponse {
  title: MultilingualString;
  description: MultilingualString;
  sharingMsg: MultilingualString;
  referrerBannerMsg: MultilingualString;
  refereeWithDeepLinkBannerMsg: MultilingualString;
  refereeWithoutDeepLinkBannerMsg: MultilingualString;
  referrerAmount: MoneyWithCurrency;
  refereeDiscountType: ReferralDiscountType;
  refereeFixedValue: MoneyWithCurrency;
  refereeMinSpending: MoneyWithCurrency;
  refereePercentage: number;
  refereeCap: MoneyWithCurrency;
  services: ReferralService[];
  referrerMaxAmount: MoneyWithCurrency;
  lastUpdateDate: string;
}

export type RefereeReportRequest = void;
export interface RefereeReportResponse {
  metadata: ListingMetadata;
  referees: RefereeReportReferee[];
}

interface RefereeReportReferee {
  refereeId: number;
  refereeName: string;
  refereeMobileNumber: string;
  orderId: number;
  customerOrderId: string;
  orderStatus: OrderStatus;
  discountType: ReferralDiscountType;
  discountPercentage: number;
  discountAmount: MoneyWithCurrency;
  registrationDate: string;
}

export type ReferralReportListRequest = void;
export interface ReferralReportListResponse {
  metadata: {
    skipped: number;
    limit: number;
    totalCount: number;
    totalReturned: number;
  };
  referrerCodes: ReferrerCodeReportResponse[];
}

export interface ReferrerCodeReportResponse {
  id: number;
  name: string;
  referrerId: number;
  referrerName: string;
  referrerMobileNo: string;
  refereeOrderCount: number;
  refereeSuccessfulOrderCount: number;
  referred: boolean;
  referredById: number;
  referredByName: string;
  referredByCodeId: number;
  totalCashBack: MoneyWithCurrency;
  referrerMaxAmount: MoneyWithCurrency;
  remainingCashBack: number;
  registrationDate: string;
}

type ReferralDiscountType = string & ('PERCENTAGE' | 'FIXED_VALUE' | 'NONE');
