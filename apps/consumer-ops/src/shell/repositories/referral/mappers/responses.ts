import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { OrderStatus } from '../../../../core/models/Order';
import {
  RefereeReport,
  ReferrerSummary,
} from '../../../../core/models/RefereeReport';
import {
  RefereeReportResponse,
  ReferralListResponse,
  ReferralReportListResponse,
} from '@survv/api/definitions/referral';
import {
  Referral,
  ReferralDiscountType,
  ReferralService,
} from '../../../../core/models/Referral';
import { ReferralReportItem } from '../../../../core/models/ReferralReport';

export function mapReferralListResponseToReferral(
  response: ReferralListResponse
): Referral {
  const maxAmount =
    response.referrerMaxAmount.amount === -1
      ? ''
      : response.referrerMaxAmount.amount;
  return {
    title: new MultilingualString(response.title),
    description: new MultilingualString(response.description),
    sharingMessageText: new MultilingualString(response.sharingMsg),
    referrerBannerText: new MultilingualString(response.referrerBannerMsg),
    refereeTextWithDeepLink: new MultilingualString(
      response.refereeWithDeepLinkBannerMsg
    ),
    refereeTextWithoutDeepLink: new MultilingualString(
      response.refereeWithoutDeepLinkBannerMsg
    ),
    referrerAmount: new Money(response.referrerAmount),
    refereeDiscountType: new ReferralDiscountType(
      response.refereeDiscountType === 'NONE'
        ? ''
        : response.refereeDiscountType
    ),
    refereeFixedValue: new Money(response.refereeFixedValue),
    refereeMinSpending: new Money(response.refereeMinSpending),
    refereePercentage: response.refereePercentage,
    refereeCap: new Money(response.refereeCap),
    services: response.services.map((service) => new ReferralService(service)),
    referrerMaxAmount: maxAmount.toString(),
    lastUpdatedDate: new Datetime(response.lastUpdateDate),
  };
}

export function mapRefereeReportResponseToReferrerReport(
  response: RefereeReportResponse
): ItemsList<RefereeReport> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.referees.map(
      (referee) =>
        new RefereeReport({
          refereeId: referee.refereeId,
          refereeName: referee.refereeName,
          refereeMobileNumber: referee.refereeMobileNumber,
          orderId: referee.orderId,
          customerOrderId: referee.customerOrderId,
          discountAmount: new Money(referee.discountAmount),
          discountType: new ReferralDiscountType(referee.discountType),
          discountPercentage: referee.discountPercentage,
          orderStatus: new OrderStatus(referee.orderStatus),
          registrationDate: new Datetime(referee.registrationDate),
        })
    ),
  };
}

export function mapReferralReportListResponseToReferrerSummary(
  response: ReferralReportListResponse
): ReferrerSummary {
  return new ReferrerSummary({
    code: response.referrerCodes[0].name,
    referrerName: response.referrerCodes[0].referrerName,
    cashback: new Money(response.referrerCodes[0].totalCashBack),
    refereesWithOrders: response.referrerCodes[0].refereeOrderCount,
    quota: new Money(response.referrerCodes[0].referrerMaxAmount),
    remainingQuota: response.referrerCodes[0].remainingCashBack,
  });
}

export function mapReferralReportListResponseToReferralReport(
  response: ReferralReportListResponse
): ItemsList<ReferralReportItem> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.referrerCodes.map((responseItem) => {
      return new ReferralReportItem({
        id: responseItem.id,
        referrerId: responseItem.referrerId,
        referrerName: responseItem.referrerName,
        referrerMobileNumber: responseItem.referrerMobileNo,
        referrerCode: responseItem.name,
        refereeOrdersCount: responseItem.refereeOrderCount,
        refereeSuccessfulOrdersCount: responseItem.refereeSuccessfulOrderCount,
        cashBack: new Money(responseItem.totalCashBack),
        quota: new Money(responseItem.referrerMaxAmount),
        remainingQuota: responseItem.remainingCashBack,
        isReferred: responseItem.referred,
        referredById: responseItem.referredById,
        referredByCodeId: responseItem.referredByCodeId,
        referredByName: responseItem.referredByName,
        registrationDate: new Datetime(responseItem.registrationDate),
      });
    }),
  };
}
