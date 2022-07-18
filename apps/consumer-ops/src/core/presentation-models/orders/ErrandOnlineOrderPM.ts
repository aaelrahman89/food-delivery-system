import { BasePM } from '@survv/commons/core/base/BasePM';
import { CancelErrandOrderPM } from './CancelErrandOrderPM';
import { EntityId } from '@survv/commons/core/types';
import { ErrandCategoriesRepo } from '../../repositories/ErrandCategoriesRepo';
import { ErrandDetectedZone } from '../../models/ErrandDetectedZone';
import {
  ErrandItemForm,
  ErrandPickupForm,
  ErrandStructureForm,
  RejectionReasonForm,
} from '../../models/ErrandOrderForms';
import { ErrandOrder, ErrandOrderPickup } from '../../models/ErrandOrder';
import { ErrandOrdersRepo } from '../../repositories/ErrandOrdersRepo';
import {
  ErrandsOrderJourney,
  StructuredErrandsOrderStep,
} from '../../models/ErrandsOrderJourney';
import { ErrandsOrderJourneyRepo } from '../../repositories/ErrandsOrderJourneyRepo';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { OrderStatus } from '../../models/Order';
import { RejectionReason } from '../../models/RejectionReason';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class ErrandOnlineOrderPM extends BasePM {
  private readonly _orderId: EntityId;
  private readonly _errandOrdersRepo: ErrandOrdersRepo;
  private readonly _errandCategoriesRepo: ErrandCategoriesRepo;
  private readonly _errandsOrderJourneyRepo: ErrandsOrderJourneyRepo;
  private readonly _notificationService: NotificationService;
  orderJourney = new ErrandsOrderJourney();
  order = new ErrandOrder();
  userZone = new ErrandDetectedZone();
  errandCategoriesSelection: FormSelectionOption<number>[] = [];
  errandOrderForm = new ErrandStructureForm();
  editingPickupIndex = 0;
  itemForm = new ErrandItemForm();
  itemFormTitle = '';
  rejectionForm = new RejectionReasonForm();
  rejectionReasons: RejectionReason[] = [];
  clonedRejectionReasons: RejectionReason[] = [];
  shouldOpenRejectForm = false;
  shouldShowAddItemsForm = false;
  shouldShowMapModal = false;
  shouldShowRemovePickupDialog = false;
  pickupIndexToRemove = 0;
  pickupTitleToRemove = '';
  shouldShowEditForm = false;
  nonDeletedPickupPoints: ErrandOrderPickup[] = [];
  mapConfig = {
    point: [31.231727600097656, 30.036814151299254] as GeojsonCoordinates,
    supportedZones: [[[]]] as GeojsonCoordinates[][][],
    pickupPointIndex: 0,
  };

  children: Record<string, CancelErrandOrderPM>;
  constructor(options: ErrandOnlineOrderPMOptions) {
    super();

    const {
      orderId,
      errandOrdersRepo,
      errandCategoriesRepo,
      notificationService,
      errandsOrderJourneyRepo,
      children,
    } = options;
    this._orderId = orderId;
    this._errandOrdersRepo = errandOrdersRepo;
    this._errandsOrderJourneyRepo = errandsOrderJourneyRepo;
    this._errandCategoriesRepo = errandCategoriesRepo;
    this._notificationService = notificationService;
    this.children = children;
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateErrandOrder();
      await this._hydrateErrandsOrderJourney();
      await this._hydrateUserZone();
      await this._hydrateSupportedZones();
      await this._hydrateErrandCategories();
      await this._hydrateRejectionReasons();
      this._assignRejectionReasonsFormHandlers();
      this._createForm();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrateErrandOrder();
    await this._hydrateUserZone();
    await this._hydrateErrandCategories();
    await this._hydrateErrandsOrderJourney();
    this._createForm();
  }

  private _createForm(): void {
    this.errandOrderForm = ErrandStructureForm.from(
      this.order,
      this.userZone.name.en
    );
    this._assignFormHandlers();
  }

  private async _hydrateErrandOrder(): Promise<void> {
    this.order = await this._errandOrdersRepo.getOrder(this._orderId);
    this.nonDeletedPickupPoints = this.order.orderPickups.filter((pickup) => {
      return !pickup.deleted;
    });
  }

  private async _hydrateErrandsOrderJourney(): Promise<void> {
    try {
      this.orderJourney =
        await this._errandsOrderJourneyRepo.getErrandsOrderJourney(
          this._orderId
        );
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get structuredOrderJourney(): StructuredErrandsOrderStep[] {
    return this.orderJourney.build();
  }

  private async _hydrateUserZone(): Promise<void> {
    this.userZone = await this._errandOrdersRepo.detectZone(
      this.order.customerLocationFeature.geometry
        .coordinates as GeojsonCoordinates
    );
  }

  private async _hydrateSupportedZones(): Promise<void> {
    this.mapConfig.supportedZones =
      await this._errandOrdersRepo.getSupportedZones(this.userZone.name.en);
  }

  private async _hydrateErrandCategories(): Promise<void> {
    this.errandCategoriesSelection = (
      await this._errandCategoriesRepo.listCategories({
        filter: {
          archived: false,
        },
      })
    ).items.map((item) => new FormSelectionOption(item.id, item.displayName));
  }

  private async _hydrateRejectionReasons(): Promise<void> {
    this.rejectionReasons = await this._errandOrdersRepo.getRejectionReasons();
    this.clonedRejectionReasons = [...this.rejectionReasons];
  }

  protected _assignFormHandlers(): void {
    this.errandOrderForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          if (OrderStatus.REQUESTED.equals(this.order.status)) {
            await this._errandOrdersRepo.structureOrder(
              this._orderId,
              this.errandOrderForm
            );
          } else {
            await this._errandOrdersRepo.editOrder(
              this._orderId,
              this.errandOrderForm
            );
          }
        });
        this.closeEditForm();
        await this.refresh();
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  async calculateCharging(): Promise<void> {
    try {
      await this._longProcess(async () => {
        const { pickups } = this.errandOrderForm;
        const arePickupsValid = pickups.every((pickup) => {
          return pickup.categoryId !== 0 && pickup.coordinates.length !== 0;
        });
        if (arePickupsValid) {
          const calculationResponse =
            await this._errandOrdersRepo.calculateCharging(
              this._orderId,
              this.errandOrderForm
            );
          this.order.tax = calculationResponse.tax;
          this.order.estimatedDeliveryFees =
            calculationResponse.estimatedDeliveryFee;
        }
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private _assignRejectionReasonsFormHandlers(): void {
    this.rejectionForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._errandOrdersRepo.rejectOrder(
            this._orderId,
            this.rejectionForm.reasonId
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  get shouldShowStructureForm(): boolean {
    return (
      OrderStatus.REQUESTED.equals(this.order.status) || this.shouldShowEditForm
    );
  }

  get shouldShowEditButton(): boolean {
    return (
      ![
        OrderStatus.REQUESTED.valueOf(),
        OrderStatus.REJECTED.valueOf(),
        OrderStatus.CANCELLED.valueOf(),
        OrderStatus.DELIVERED.valueOf(),
        OrderStatus.COLLECTED.valueOf(),
      ].includes(this.order.status.valueOf()) && !this.shouldShowEditForm
    );
  }

  openEditForm(): void {
    this.shouldShowEditForm = true;
  }

  closeEditForm(): void {
    this.shouldShowEditForm = false;
    this.errandOrderForm.reset();
  }

  shouldShowPickupFormPicturesCheckbox = (
    pickupForm: ErrandPickupForm
  ): boolean => {
    return pickupForm.pickupId !== 0 && pickupForm.canIncludePictures;
  };

  shouldShowPickupFormVoiceNoteCheckbox = (
    pickupForm: ErrandPickupForm
  ): boolean => {
    return pickupForm.pickupId !== 0 && pickupForm.canIncludeVoiceNote;
  };

  submitItemForm(): void {
    const itemForm = new ErrandItemForm({
      formInputs: {
        name: this.itemForm.name,
        quantity: this.itemForm.quantity,
        brand: this.itemForm.brand,
        notes: this.itemForm.notes,
      },
    });
    if (this.errandOrderForm.pickups[this.editingPickupIndex]) {
      this.errandOrderForm.pickups[this.editingPickupIndex].items.push(
        itemForm
      );
    }

    this.closeItemForm();
  }

  deleteItem(pickupIndex: number, itemIndex: number): void {
    this.errandOrderForm.pickups[pickupIndex].items.splice(itemIndex, 1);
  }

  closeItemForm(): void {
    this.shouldShowAddItemsForm = false;
    this.itemFormTitle = '';
    this.itemForm = new ErrandItemForm();
  }

  openAddItemsForm(
    title: string,
    pickupIndex: number,
    itemForm?: ErrandItemForm
  ): void {
    this.editingPickupIndex = pickupIndex;
    this.itemForm = itemForm || new ErrandItemForm();
    this.itemFormTitle = title;
    this.shouldShowAddItemsForm = true;
  }

  async submitMapModal(
    pickupPointCoordinates: GeojsonCoordinates,
    locationName: string
  ): Promise<void> {
    this.errandOrderForm.pickups[this.mapConfig.pickupPointIndex].coordinates =
      pickupPointCoordinates;
    if (locationName) {
      this.errandOrderForm.pickups[
        this.mapConfig.pickupPointIndex
      ].locationName = locationName;
    }
    this.closeMapModal();
    await this.calculateCharging();
  }

  showMapModal(
    pickupPointCoordinates: GeojsonCoordinates,
    pickupIndex: number
  ): void {
    this.mapConfig.pickupPointIndex = pickupIndex;
    this.mapConfig.point =
      pickupPointCoordinates.length > 0
        ? pickupPointCoordinates
        : (this.order.customerLocationFeature.geometry
            .coordinates as GeojsonCoordinates);
    this.shouldShowMapModal = true;
  }

  closeMapModal(): void {
    this.shouldShowMapModal = false;
  }

  get shoulShowAddPickupButton(): boolean {
    return this.errandOrderForm.pickups.length < this.order.maxErrandPoints;
  }

  addPickupPoint(): void {
    if (this.errandOrderForm.pickups.length < this.order.maxErrandPoints) {
      const pickupForm = new ErrandPickupForm();
      this.errandOrderForm.pickups.push(pickupForm);
    }
  }

  async removePickupPoint(): Promise<void> {
    this.errandOrderForm.pickups.splice(this.pickupIndexToRemove, 1);
    await this.calculateCharging();
    this.shouldShowRemovePickupDialog = false;
  }

  openRemovePickupDialog(pickupIndex: number, pickupTitle: string): void {
    this.pickupIndexToRemove = pickupIndex;
    this.pickupTitleToRemove = pickupTitle;
    this.shouldShowRemovePickupDialog = true;
  }

  async submitRejectForm(): Promise<void> {
    await this.rejectionForm.submit();
    this.closeRejectForm();
    await this.refresh();
  }

  closeRejectForm(): void {
    this.shouldOpenRejectForm = false;
    this.rejectionForm.reset();
  }

  openRejectForm(): void {
    this.shouldOpenRejectForm = true;
  }

  searchRejectReasons(searchToken: string): void {
    this.clonedRejectionReasons = this.rejectionReasons.filter((reason) =>
      reason.label.toLowerCase().includes(searchToken.toLowerCase())
    );
  }

  async submitCancellationForm(): Promise<void> {
    try {
      await this.children.cancelErrandOrderPM.cancellationForm.submit();
      this.children.cancelErrandOrderPM.closeCancelForm();
      await this.refresh();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  get shouldShowCancelAction(): boolean {
    const result = [
      OrderStatus.REQUESTED.valueOf(),
      OrderStatus.REJECTED.valueOf(),
      OrderStatus.DELIVERED.valueOf(),
      OrderStatus.CANCELLED.valueOf(),
    ].includes(this.order?.status.valueOf());
    return !result;
  }
}

interface ErrandOnlineOrderPMOptions {
  orderId: EntityId;
  errandOrdersRepo: ErrandOrdersRepo;
  errandCategoriesRepo: ErrandCategoriesRepo;
  errandsOrderJourneyRepo: ErrandsOrderJourneyRepo;
  notificationService: NotificationService;
  children: Record<string, CancelErrandOrderPM>;
}
