import { Area } from '../../models/Area';
import { AreasRepo } from '../../repositories/AreasRepo';
import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import {
  BottomSheetListGroup,
  ItemsList,
} from '@survv/commons/core/models/ItemsList';
import { BranchesRepo } from '../../repositories/BranchesRepo';
import {
  Campaign,
  CampaignService,
  CampaignStatus,
} from '../../models/Campaign';
import { CampaignBranch } from '../../models/Branch';
import { CampaignsRepo } from '../../repositories/CampaignsRepo';
import { EntityId } from '@survv/commons/core/types';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HashTag } from '../../models/HashTag';
import { HashTagsRepo } from '../../repositories/HashTagsRepo';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import {
  PromoCodeUsageType,
  PromotionBranchesCriteria,
} from '../../models/Promotion';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class CampaignsListPM extends BaseListingPM {
  private readonly _campaignsRepo: CampaignsRepo;
  private readonly _branchesRepo: BranchesRepo;
  private readonly _areasRepo: AreasRepo;
  private readonly _hashTagsRepo: HashTagsRepo;
  private readonly _notificationService: NotificationService;

  readonly statusListOptions: FormSelectionOption<string>[];
  readonly servicesListOptions: FormSelectionOption<string>[];
  readonly usageTypesOptions: FormSelectionOption<string>[];
  branchesListOptions: FormSelectionOption<number>[];
  areasListOptions: FormSelectionOption<number>[];
  hashTagsListOptions: FormSelectionOption<number>[];

  list: ItemsList<Campaign>;
  branches: BottomSheetListGroup<CampaignBranch>[];
  vendorsCriteriaItems: BottomSheetListGroup<Area | HashTag>[];

  shouldOpenVendorsCriteriaBottomSheet = false;
  shouldOpenBranchesBottomSheet = false;

  campaignsTableLoading = false;
  branchesListLoading = false;
  areasListLoading = false;
  hashTagsListLoading = false;
  vendorsCriteriaLoading = false;
  branchesCriteriaLoading = false;

  constructor(options: CampaignsListPMOptions) {
    super({
      query: options.query,
      defaultQuery: {
        sort: {
          creationDate: 'desc',
        },
        limit: 25,
        skip: 0,
      },
    });

    const {
      notificationService,
      campaignsRepo,
      branchesRepo,
      areasRepo,
      hashTagsRepo,
    } = options;
    this._notificationService = notificationService;
    this._campaignsRepo = campaignsRepo;
    this._branchesRepo = branchesRepo;
    this._areasRepo = areasRepo;
    this._hashTagsRepo = hashTagsRepo;

    this.list = {
      totalItemsCount: 0,
      items: [],
    };
    this.branches = [];
    this.vendorsCriteriaItems = [];

    this.branchesListOptions = [];
    this.areasListOptions = [];
    this.hashTagsListOptions = [];

    this.statusListOptions = CampaignStatus.lookup().map(
      (status) => new FormSelectionOption(status.value, status.toString())
    );
    this.servicesListOptions = CampaignService.lookup().map(
      (service) => new FormSelectionOption(service.value, service.toString())
    );
    this.usageTypesOptions = PromoCodeUsageType.lookup().map(
      (usageType) =>
        new FormSelectionOption(usageType.value, usageType.valueOf())
    );
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateCampaignsList();
      await this._hydrateBranchesList();
      await this._hydrateAreasList();
      await this._hydrateHashTagsList();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async enableCampaign(campaignId: EntityId): Promise<void> {
    try {
      await this._campaignsRepo.enableCampaign(campaignId);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async disableCampaign(campaignId: EntityId): Promise<void> {
    try {
      await this._campaignsRepo.disableCampaign(campaignId);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    try {
      await this._hydrateCampaignsList();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async setVendorsCriteriaBottomSheet(campaignId: EntityId): Promise<void> {
    this.shouldOpenVendorsCriteriaBottomSheet = true;
    await this._hydrateVendorsCriteriaItemsList(campaignId);
  }

  async setBranchesBottomSheet(campaignId: EntityId): Promise<void> {
    const selectedCampaign = this.list.items.find(
      (campaign) => campaign.id == campaignId
    );
    this.shouldOpenBranchesBottomSheet = true;
    await this._hydrateBranchesItemsList(
      campaignId,
      selectedCampaign?.promotions[0].id as EntityId
    );
  }

  closeVendorsCriteriaBottomSheet(): void {
    this.shouldOpenVendorsCriteriaBottomSheet = false;
    this.vendorsCriteriaItems = [];
  }

  closeBranchesBottomSheet(): void {
    this.shouldOpenBranchesBottomSheet = false;
    this.branches = [];
  }

  private async _hydrateCampaignsList(): Promise<void> {
    this.campaignsTableLoading = true;
    this.list = await this._campaignsRepo.listCampaigns(this._listingQuery);
    this.campaignsTableLoading = false;
  }

  private async _hydrateBranchesList(): Promise<void> {
    this.branchesListLoading = true;
    const simplifiedBranchesList = await this._branchesRepo.listBranches();
    this.branchesListOptions = simplifiedBranchesList.map(
      (simplifiedBranch) =>
        new FormSelectionOption(simplifiedBranch.id, simplifiedBranch.label)
    );
    this.branchesListLoading = false;
  }

  private async _hydrateAreasList(): Promise<void> {
    this.areasListLoading = true;
    const simplifiedAreasList = await this._areasRepo.listAreas();
    this.areasListOptions = simplifiedAreasList.map(
      (simplifiedArea) =>
        new FormSelectionOption(simplifiedArea.id, simplifiedArea.name)
    );
    this.areasListLoading = false;
  }

  private async _hydrateHashTagsList(): Promise<void> {
    this.hashTagsListLoading = true;
    const simplifiedHashTagsList = await this._hashTagsRepo.listHashTags();
    this.hashTagsListOptions = simplifiedHashTagsList.map(
      (simplifiedHashTag) =>
        new FormSelectionOption(simplifiedHashTag.id, simplifiedHashTag.name)
    );
    this.hashTagsListLoading = false;
  }

  private async _hydrateVendorsCriteriaItemsList(
    campaignId: EntityId
  ): Promise<void> {
    this.vendorsCriteriaLoading = true;

    const selectedCampaign = this.list.items.find(
      (campaign) => campaign.id == campaignId
    );

    if (
      selectedCampaign?.promotions[0].branchesCriteria.criteria.equals(
        PromotionBranchesCriteria.BRANCHES_IN_AREAS
      )
    ) {
      await this._longProcess(async () => {
        try {
          this.vendorsCriteriaItems = await this._areasRepo.listCampaignAreas(
            selectedCampaign?.promotions[0].branchesCriteria
              .referenceIds as EntityId[]
          );
        } catch (err) {
          this._notificationService.notify(createNotification(err));
        }
      });
    } else if (
      selectedCampaign?.promotions[0].branchesCriteria.criteria.equals(
        PromotionBranchesCriteria.BRANCHES_WITH_TAGS
      )
    ) {
      await this._longProcess(async () => {
        try {
          this.vendorsCriteriaItems =
            await this._hashTagsRepo.listCampaignHashTags(
              selectedCampaign?.promotions[0].branchesCriteria
                .referenceIds as EntityId[]
            );
        } catch (err) {
          this._notificationService.notify(createNotification(err));
        }
      });
    }

    this.vendorsCriteriaLoading = false;
  }

  private async _hydrateBranchesItemsList(
    campaignId: EntityId,
    promotionId: EntityId
  ): Promise<void> {
    this.branchesCriteriaLoading = true;
    await this._longProcess(async () => {
      try {
        this.branches = await this._branchesRepo.listCampaignBranches(
          campaignId,
          promotionId
        );
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
    this.branchesCriteriaLoading = false;
  }
}

interface CampaignsListPMOptions {
  campaignsRepo: CampaignsRepo;
  branchesRepo: BranchesRepo;
  areasRepo: AreasRepo;
  hashTagsRepo: HashTagsRepo;
  notificationService: NotificationService;
  query?: ListingQuery;
}
