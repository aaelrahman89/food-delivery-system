import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ReferralRepo } from '../../repositories/ReferralRepo';
import { ReferralReportItem } from '../../models/ReferralReport';
import { createNotification } from '../../notification';

export class ReferralReportPM extends BaseListingPM {
  private readonly _notificationService: NotificationService;
  private readonly _referralRepo: ReferralRepo;
  list: ItemsList<ReferralReportItem>;
  totalCount = 0;
  constructor({
    notificationService,
    referralRepo,
    query,
  }: ReferralReportPMOptions) {
    super({
      query,
      defaultQuery: {
        skip: 0,
        limit: 25,
        sort: {
          registrationDate: 'desc',
        },
      },
    });
    this._referralRepo = referralRepo;
    this._notificationService = notificationService;
    this.list = {
      totalItemsCount: 0,
      items: [],
    };
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateReferralReport();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }

  private async _hydrateReferralReport(): Promise<void> {
    this.list = await this._referralRepo.getReferralReport(this._listingQuery);
  }
}

export interface ReferralReportPMOptions {
  notificationService: NotificationService;
  referralRepo: ReferralRepo;
  query?: ListingQuery;
}
