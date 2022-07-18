import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { RefereeReport, ReferrerSummary } from '../models/RefereeReport';
import { Referral, ReferralForm } from '../models/Referral';
import { ReferralReportItem } from '../models/ReferralReport';

export interface ReferralRepo {
  setReferralSetup(referralForm: ReferralForm): Promise<void>;
  getReferralSetup(): Promise<Referral>;
  getReferralReport(
    query: ListingQuery
  ): Promise<ItemsList<ReferralReportItem>>;
  getRefereeReport(
    referrerCodeId: EntityId,
    query?: ListingQuery
  ): Promise<ItemsList<RefereeReport>>;
  getReferrerSummary(referrerCodeId: EntityId): Promise<ReferrerSummary>;
}
