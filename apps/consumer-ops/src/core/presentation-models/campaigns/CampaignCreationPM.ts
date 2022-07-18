import { Area } from '../../models/Area';
import { AreasRepo } from '../../repositories/AreasRepo';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { Branch } from '../../models/Branch';
import { BranchesRepo } from '../../repositories/BranchesRepo';
import {
  CampaignForm,
  CampaignService,
  NumberOfOrdersOperator,
} from '../../models/Campaign';
import { CampaignsRepo } from '../../repositories/CampaignsRepo';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HashTag } from '../../models/HashTag';
import { HashTagsRepo } from '../../repositories/HashTagsRepo';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Notification,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import {
  PromoCodeType,
  PromoCodeUsageType,
  PromotionBranchesCriteria,
  PromotionCustomersCriteria,
  PromotionType,
} from '../../models/Promotion';
import { createNotification } from '../../notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export class CampaignCreationPM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _campaignsRepo: CampaignsRepo;
  private readonly _hashTagsRepo: HashTagsRepo;
  private readonly _branchesRepo: BranchesRepo;
  private readonly _areasRepo: AreasRepo;
  private _searchedByText: string;
  private _hashTags: BottomSheetListGroup<HashTag>[];
  private _areas: BottomSheetListGroup<Area>[];
  private _branches: BottomSheetListGroup<Branch>[];
  private _branchesIncluded: BottomSheetListGroup<Branch>[];
  campaignForm: CampaignForm;
  services: FormSelectionOption<string>[];
  promotionTypes: FormSelectionOption<string>[];
  promoCodeTypes: FormSelectionOption<string>[];
  promoCodeUsages: FormSelectionOption<string>[];
  numberOfOrdersOperators: FormSelectionOption<string>[];
  customersEligibilityCriterion: EligibleCustomersCriterion;
  branchesEligibilityCriterion: EligibleBranchesCriterion;
  shouldOpenHashtagBottomSheet: boolean;
  shouldOpenAreasBottomSheet: boolean;
  shouldOpenBranchesIncludedBottomSheet: boolean;
  shouldOpenBranchesBottomSheet: boolean;
  selectedHashTags: HashTag[];
  selectedAreas: Area[];
  selectedBranches: Branch[];
  CSVFileName: string;

  constructor({
    notificationService,
    campaignsRepo,
    hashTagsRepo,
    branchesRepo,
    areasRepo,
  }: AddPromotionPMOptions) {
    super();
    this._notificationService = notificationService;
    this._campaignsRepo = campaignsRepo;
    this._hashTagsRepo = hashTagsRepo;
    this._branchesRepo = branchesRepo;
    this._areasRepo = areasRepo;
    this.campaignForm = new CampaignForm();
    this.services = CampaignService.lookup().map(
      (service) => new FormSelectionOption(service.value, service.toString())
    );
    this.promotionTypes = PromotionType.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );
    this.promoCodeTypes = PromoCodeType.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );
    this.promoCodeUsages = PromoCodeUsageType.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );
    this.numberOfOrdersOperators = NumberOfOrdersOperator.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );

    this.customersEligibilityCriterion = {
      ALL_CUSTOMERS: PromotionCustomersCriteria.ALL_CUSTOMERS,
      NEW_CUSTOMERS: PromotionCustomersCriteria.NEW_CUSTOMERS,
      REGISTERED_CUSTOMERS: PromotionCustomersCriteria.REGISTERED_CUSTOMERS,
      SUBSET_OF_CUSTOMERS: PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS,
    };

    this.branchesEligibilityCriterion = {
      ALL_VENDORS: PromotionBranchesCriteria.ALL_VENDORS,
      BRANCHES_IN_AREAS: PromotionBranchesCriteria.BRANCHES_IN_AREAS,
      BRANCHES_WITH_TAGS: PromotionBranchesCriteria.BRANCHES_WITH_TAGS,
      SUBSET_OF_BRANCHES: PromotionBranchesCriteria.SUBSET_OF_BRANCHES,
    };

    this.shouldOpenHashtagBottomSheet = false;
    this.shouldOpenAreasBottomSheet = false;
    this.shouldOpenBranchesIncludedBottomSheet = false;
    this.shouldOpenBranchesBottomSheet = false;

    this._hashTags = [{ items: [] }];
    this._areas = [{ items: [] }];
    this._branches = [{ items: [] }];

    this.selectedHashTags = [];
    this.selectedAreas = [];
    this.selectedBranches = [];

    this._branchesIncluded = [{ items: [] }];
    this.CSVFileName = '';
    this._searchedByText = '';

    this._assignCampaignFormHandlers();
  }

  get shouldShowPromoCodePercentage(): boolean {
    return PromoCodeType.PERCENTAGE.equals(this.campaignForm.promoCode.type);
  }

  get shouldShowPromoCodeCap(): boolean {
    return PromoCodeType.PERCENTAGE.equals(this.campaignForm.promoCode.type);
  }

  get shouldShowPromoCodeValue(): boolean {
    return PromoCodeType.FIXED_VALUE.equals(this.campaignForm.promoCode.type);
  }

  get shouldShowPromoCodeType(): boolean {
    return (
      PromoCodeUsageType.FREE_DELIVERY.notEqual(
        this.campaignForm.promoCode.usage
      ) && isNotEmpty(this.campaignForm.promoCode.usage)
    );
  }

  get hashTags(): BottomSheetListGroup<HashTag>[] {
    return [
      {
        items: this._hashTags[0].items.filter(
          (hashTag) =>
            (hashTag.label as MultilingualString).en
              .toLowerCase()
              .includes(this._searchedByText.toLowerCase()) ||
            (hashTag.label as MultilingualString).ar
              .toLowerCase()
              .includes(this._searchedByText.toLowerCase())
        ),
      },
    ];
  }

  searchHashTags(searchText: string): void {
    this._searchedByText = searchText;
  }

  get branches(): BottomSheetListGroup<Branch>[] {
    return [
      {
        items: this._branches[0].items.filter((branch) =>
          (branch.label as string)
            .toLowerCase()
            .includes(this._searchedByText.toLowerCase())
        ),
      },
    ];
  }

  searchBranches(searchText: string): void {
    this._searchedByText = searchText;
  }

  get branchesIncluded(): BottomSheetListGroup<Branch>[] {
    return [
      {
        items: this._branchesIncluded[0].items.filter((branch) =>
          (branch.label as string)
            .toLowerCase()
            .includes(this._searchedByText.toLowerCase())
        ),
      },
    ];
  }

  searchBranchesIncluded(searchText: string): void {
    this._searchedByText = searchText;
  }

  get areas(): BottomSheetListGroup<Area>[] {
    return [
      {
        items: this._areas[0].items.filter(
          (area) =>
            (area.label as MultilingualString).en
              .toLowerCase()
              .includes(this._searchedByText.toLowerCase()) ||
            (area.label as MultilingualString).ar
              .toLowerCase()
              .includes(this._searchedByText.toLowerCase())
        ),
      },
    ];
  }

  searchAreas(searchText: string): void {
    this._searchedByText = searchText;
  }

  updateSubsetUsersPhoneNumbers({
    data,
    fileName,
  }: {
    data: Record<string, string>[];
    fileName: string;
  }): void {
    try {
      const phoneNumbers = data
        .map((CSVRow: Record<string, string>) => CSVRow['$properties.$phone'])
        .filter((phoneNumber: string | undefined) => phoneNumber);

      if (!phoneNumbers.length) {
        this._notificationService.notify(
          createNotification(
            errorModel({
              message: 'Invalid CSV File',
              code: 'InvalidCSVFIleException',
              args: {
                headerName: '$properties.$phone',
              },
            })
          )
        );
        this.campaignForm.subsetPhoneNumbers = [];
        this.CSVFileName = '';
        return;
      }
      this.campaignForm.subsetPhoneNumbers = phoneNumbers;
      this.CSVFileName = fileName;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  updatePromoCodeUsage(usage: string): void {
    this.campaignForm.promoCode.usage = usage;

    if (PromoCodeUsageType.FREE_DELIVERY.equals(usage)) {
      this.campaignForm.promoCode.type = '';
      this.campaignForm.promoCode.percentage = 0;
      this.campaignForm.promoCode.cap = 0;
      this.campaignForm.promoCode.value = 0;
    }
  }

  updatePromoCodeType(type: string): void {
    this.campaignForm.promoCode.type = type;
    this.campaignForm.promoCode.percentage = 0;
    this.campaignForm.promoCode.cap = 0;
    this.campaignForm.promoCode.value = 0;
  }

  updateEligibleBranchesCriteria(criteria: string): void {
    this.campaignForm.eligibleBranchesCriteria = criteria;

    this.selectedHashTags = [];
    this.selectedAreas = [];
    this.selectedBranches = [];

    this.campaignForm.referencesIds = [];
    this.campaignForm.selectedBranches = [];

    this._branchesIncluded = [{ items: [] }];
  }

  updateEligibleUsersCriteria(criteria: string): void {
    this.campaignForm.eligibleUsersCriteria = criteria;

    this.campaignForm.subsetPhoneNumbers = [];
    this.CSVFileName = '';
  }

  get submittable(): boolean {
    return this.campaignForm.submittable;
  }

  async submit(): Promise<boolean> {
    return this.campaignForm.submit();
  }

  isBranchSelected(branch: Branch): boolean {
    return (
      this.selectedBranches.filter(
        (selectedBranch) => selectedBranch.id === branch.id
      ).length > 0
    );
  }

  async selectAllBranchesFromVendor(branch: Branch): Promise<void> {
    await this._longProcess(async () => {
      try {
        let vendorBranches = await this._branchesRepo.listVendorBranches(
          branch.vendorId
        );
        vendorBranches = vendorBranches.filter((vendorBranch) =>
          this.selectedBranches.every(
            (selectedBranch) => selectedBranch.id !== vendorBranch.id
          )
        );

        this.selectedBranches.push(...vendorBranches);
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  viewBranchesIncluded(): void {
    this.shouldOpenBranchesIncludedBottomSheet = true;
  }

  closeBranchesIncludedBottomSheet(): void {
    this.shouldOpenBranchesIncludedBottomSheet = false;
    this._searchedByText = '';
  }

  get branchesIncludedCount(): number {
    return this._branchesIncluded[0].items.length;
  }

  async onHashTagsSelection(hashTags: HashTag[] = []): Promise<void> {
    this.selectedHashTags = hashTags;
    this.campaignForm.referencesIds = hashTags.map((hashTag) => hashTag.id);
    this.closeHashtagBottomSheet();
    await this._hydrateBranchesWithTags();
  }

  get selectedHashTagsCount(): number {
    return this.selectedHashTags.length;
  }

  async setUpdateHashTags(): Promise<void> {
    this.shouldOpenHashtagBottomSheet = true;
    await this._hydrateHashTags();
  }

  closeHashtagBottomSheet(): void {
    this.shouldOpenHashtagBottomSheet = false;
    this._searchedByText = '';
  }

  onBranchesSelection(branches: Branch[] = []): void {
    this.selectedBranches = branches;
    this.campaignForm.selectedBranches = branches.map((branch) => ({
      id: branch.id,
      vendorId: branch.vendorId,
    }));
    this.closeBranchesBottomSheet();
    this._hydrateSpecificBranches();
  }

  get selectedBranchesCount(): number {
    return this.selectedBranches.length;
  }

  async setUpdateBranches(): Promise<void> {
    this.shouldOpenBranchesBottomSheet = true;
    await this._hydrateBranches();
  }

  closeBranchesBottomSheet(): void {
    this.shouldOpenBranchesBottomSheet = false;
    this.selectedBranches = this.selectedBranches.filter((selectedBranch) =>
      this.campaignForm.selectedBranches.some(
        (formSelectedBranch) => selectedBranch.id === formSelectedBranch.id
      )
    );
    this._searchedByText = '';
  }

  async setUpdateAreas(): Promise<void> {
    this.shouldOpenAreasBottomSheet = true;
    await this._hydrateAreas();
  }

  closeAreasBottomSheet(): void {
    this.shouldOpenAreasBottomSheet = false;
    this._searchedByText = '';
  }

  async onAreasSelection(areas: Area[] = []): Promise<void> {
    this.selectedAreas = areas;
    this.campaignForm.referencesIds = areas.map((area) => area.id);
    this.closeAreasBottomSheet();
    await this._hydrateBranchesWithAreas();
  }

  get selectedAreasCount(): number {
    return this.selectedAreas.length;
  }

  async _hydrateHashTags(): Promise<void> {
    await this._longProcess(async () => {
      try {
        this._hashTags =
          await this._hashTagsRepo.listHashTagsBottomSheetListGroup();
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  async _hydrateAreas(): Promise<void> {
    await this._longProcess(async () => {
      try {
        this._areas = await this._areasRepo.listAreasBottomSheetListGroup();
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  async _hydrateBranches(): Promise<void> {
    await this._longProcess(async () => {
      try {
        this._branches =
          await this._branchesRepo.listBranchesBottomSheetListGroup();
        this.campaignForm.allBranches = this._branches[0].items.map(
          (branch) => ({
            id: branch.value.id,
            vendorId: branch.value.vendorId,
          })
        );
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  async _hydrateBranchesWithTags(): Promise<void> {
    await this._longProcess(async () => {
      try {
        this._branchesIncluded =
          await this._branchesRepo.listBranchesWithHashTags(
            this.campaignForm.referencesIds
          );
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  async _hydrateBranchesWithAreas(): Promise<void> {
    await this._longProcess(async () => {
      try {
        this._branchesIncluded = await this._branchesRepo.listBranchesWithAreas(
          this.campaignForm.referencesIds
        );
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  _hydrateSpecificBranches(): void {
    try {
      this._branchesIncluded = [
        {
          items: this.selectedBranches.map((branch) => ({
            id: branch.id,
            label: branch.label,
            value: branch,
          })),
        },
      ];
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  _assignCampaignFormHandlers(): void {
    this.campaignForm
      .assignSubmitHandler(() => {
        return this._longProcess(async () => {
          await this._campaignsRepo.addCampaign(this.campaignForm);
          this._notificationService.notify(Notification.successfulOperation());
          return true;
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((error) => {
        this._notificationService.notify(createNotification(error));
      });
  }
}

interface AddPromotionPMOptions {
  notificationService: NotificationService;
  campaignsRepo: CampaignsRepo;
  hashTagsRepo: HashTagsRepo;
  branchesRepo: BranchesRepo;
  areasRepo: AreasRepo;
}

interface EligibleCustomersCriterion {
  ALL_CUSTOMERS: PromotionCustomersCriteria;
  NEW_CUSTOMERS: PromotionCustomersCriteria;
  REGISTERED_CUSTOMERS: PromotionCustomersCriteria;
  SUBSET_OF_CUSTOMERS: PromotionCustomersCriteria;
}

interface EligibleBranchesCriterion {
  ALL_VENDORS: PromotionBranchesCriteria;
  BRANCHES_IN_AREAS: PromotionBranchesCriteria;
  BRANCHES_WITH_TAGS: PromotionBranchesCriteria;
  SUBSET_OF_BRANCHES: PromotionBranchesCriteria;
}
