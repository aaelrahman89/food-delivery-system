import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BranchProfileListItem } from '../../models/Branch';
import { BranchRepo } from '../../repositories/branches/BranchRepo';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQuery,
  QueryFilter,
  filterOperators,
} from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';

export class BranchListingPM extends BaseListingPM {
  private _notificationService: NotificationService;
  private _branchRepo: BranchRepo;
  vendorId: EntityId;
  branches: ItemsList<BranchProfileListItem>;
  filter: QueryFilter;
  branchCode: string;
  shouldOpenBranchCodeDialog: boolean;

  constructor(options: BranchListingPMOptions) {
    super({
      defaultQuery: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      query: options.query,
      hardFilter: {
        vendorId: options.vendorId,
      },
      filterMap: {
        vendorId: {
          fieldName: 'vendorId',
          operator: filterOperators.EQUAL,
        },
        label: {
          fieldName: 'label',
          operator: filterOperators.EQUAL,
        },
      },
    });

    this._branchRepo = options.branchRepo;
    this._notificationService = options.notificationService;
    this.vendorId = options.vendorId;
    this.branches = {
      items: [] as BranchProfileListItem[],
      totalItemsCount: 0,
    };
    this.filter = {};
    this.branchCode = '';
    this.shouldOpenBranchCodeDialog = false;
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateBranches();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }

  private async _hydrateBranches(): Promise<void> {
    this.branches = await this._branchRepo.listBranches(this._listingQuery);
  }

  async showAccessCode(branchId: EntityId): Promise<void> {
    try {
      await this._longProcess(async () => {
        this.branchCode = await this._branchRepo.retrieveBranchCode(branchId);
        this.shouldOpenBranchCodeDialog = true;
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async onFilterUpdate(): Promise<void> {
    this.query = BaseListingPM.buildQuery({
      ...this.query,
      filter: this.filter,
    });

    await this.refresh();
  }
}

interface BranchListingPMOptions {
  vendorId: number;
  query: ListingQuery;
  branchRepo: BranchRepo;
  notificationService: NotificationService;
}
