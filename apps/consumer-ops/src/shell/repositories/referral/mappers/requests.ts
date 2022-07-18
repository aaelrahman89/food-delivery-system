import { ReferralForm } from '../../../../core/models/Referral';
import { ReferralSetupRequest } from '@survv/api/definitions/referral';

type ResponseReferralService = string & 'FOOD';
type ReferralDiscountType = string & ('PERCENTAGE' | 'FIXED_VALUE');

export function mapReferralFormToReferralSetupRequest(
  referralForm: ReferralForm
): ReferralSetupRequest {
  const maxAmountValue =
    referralForm.referrerMaxAmount === ''
      ? -1
      : Number(referralForm.referrerMaxAmount);
  return {
    title: referralForm.title,
    description: referralForm.description,
    sharingMsg: referralForm.sharingMessageText,
    referrerBannerMsg: referralForm.referrerBannerText,
    refereeWithDeepLinkBannerMsg: referralForm.refereeTextWithDeepLink,
    refereeWithoutDeepLinkBannerMsg: referralForm.refereeTextWithoutDeepLink,
    referrerAmount: referralForm.referrerAmount,
    refereeDiscountType:
      referralForm.refereeDiscountType as ReferralDiscountType,
    refereeFixedValue: referralForm.refereeFixedValue,
    refereeMinSpending: Number(referralForm.refereeMinSpending),
    refereePercentage: referralForm.refereePercentage,
    refereeCap: referralForm.refereeCap,
    services: referralForm.services as ResponseReferralService[],
    referrerMaxAmount: maxAmountValue,
  };
}
