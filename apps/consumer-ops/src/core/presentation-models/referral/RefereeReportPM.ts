import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery, QueryFilter } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { RefereeReport, ReferrerSummary } from '../../models/RefereeReport';
import { ReferralRepo } from '../../repositories/ReferralRepo';
import { createNotification } from '../../notification';

export class RefereeReportPM extends BaseListingPM {
  private readonly _referrerCodeId: EntityId;
  private readonly _referralRepo: ReferralRepo;
  private readonly _notificationService: NotificationService;

  list: ItemsList<RefereeReport>;
  referrerSummary: ReferrerSummary;

  constructor(options: ReferrerReportPMOptions) {
    super({
      query: options.query,
      hardFilter: options.hardFilter,
      defaultQuery: {
        sort: {
          creationDate: 'desc',
        },
        skip: 0,
        limit: 25,
      },
    });
    this._referrerCodeId = options.referrerCodeId;
    this._referralRepo = options.referralRepo;
    this._notificationService = options.notificationService;

    this.list = { totalItemsCount: 0, items: [] };
    this.referrerSummary = new ReferrerSummary();
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateRefereeReport();
      await this._hydrateReferrerSummary();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrateRefereeReport(): Promise<void> {
    this.list = await this._referralRepo.getRefereeReport(
      this._referrerCodeId,
      this._listingQuery
    );
  }

  async _hydrateReferrerSummary(): Promise<void> {
    this.referrerSummary = await this._referralRepo.getReferrerSummary(
      this._referrerCodeId
    );
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }
}

interface ReferrerReportPMOptions {
  referrerCodeId: EntityId;
  referralRepo: ReferralRepo;
  notificationService: NotificationService;
  query?: ListingQuery;
  hardFilter?: QueryFilter;
}
