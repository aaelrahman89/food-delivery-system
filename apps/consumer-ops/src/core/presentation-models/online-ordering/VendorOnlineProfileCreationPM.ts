import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { ContactPerson, ContactPersonForm } from '../../models/ContactPerson';
import { DeliveryFleet } from '../../models/DeliveryFleet';
import { DispatchingModel } from '../../models/DispatchingModel';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormSelectionOption,
  mapEnumsToSelections,
} from '@survv/commons/core/forms/selection';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { OrderingSystem } from '../../models/OrderingSystem';
import { TagType } from '../../models/TagType';
import { TagsSelectionPM } from './TagsSelectionPM';
import { UnifiedTag } from '../../models/UnifiedTag';
import {
  VendorOnlineProfileForm,
  VendorPosIntegrationType,
} from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { VendorOpsProfileListPM } from './VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class VendorOnlineProfileCreationPM extends BasePM {
  private readonly _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _notificationService: NotificationService;
  private readonly _states: VendorOnlineProfileCreationPMStates;
  private _state: VendorOnlineProfileCreationPMState;
  private _children: VendorOnlineProfileCreationPMChildren;
  form: VendorOnlineProfileForm;
  contactPersonForm: ContactPersonForm;

  isOpenedAffectedTaxedCataloguesDialog = false;
  untaxedCatalogues = 0;
  mappedOrderingSystems: FormSelectionOption<EnumClass>[];
  posIntegrationTypes: { label: string; value: string }[];
  mappedDispatchingModels: { label: string; value: string }[];
  mappedDeliveryFleets: { label: string; value: string }[];

  constructor({
    vendorOnlineProfileRepo,
    notificationService,
    children,
    vendorType,
  }: VendorOnlineProfileCreationPMOptions) {
    super();
    this._vendorOnlineProfileRepo = vendorOnlineProfileRepo;
    this._notificationService = notificationService;

    this.form = new VendorOnlineProfileForm();

    this.form.vendorType = vendorType.valueOf();
    this.contactPersonForm = new ContactPersonForm();
    this.mappedOrderingSystems = mapEnumsToSelections(OrderingSystem.lookup());
    this.mappedDispatchingModels = DispatchingModel.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
    this.posIntegrationTypes = VendorPosIntegrationType.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
    this.mappedDeliveryFleets = DeliveryFleet.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
    this._states = {
      default: {
        shouldShowOpsVendors: false,
        shouldShowSelectionsList: false,
        shouldShowContactPersonBottomSheet: false,
      },
      tagsSelection: {
        shouldShowOpsVendors: false,
        shouldShowSelectionsList: true,
        shouldShowContactPersonBottomSheet: false,
      },
      opsVendorSelection: {
        shouldShowOpsVendors: true,
        shouldShowSelectionsList: false,
        shouldShowContactPersonBottomSheet: false,
      },
      addContactPerson: {
        shouldShowOpsVendors: false,
        shouldShowSelectionsList: false,
        shouldShowContactPersonBottomSheet: true,
      },
    };
    this._state = this._states.default;
    this._children = children;

    this._assignFormHandlers();
    this._assignContactPersonFormHandlers();
  }

  async submit(): Promise<boolean> {
    try {
      return await this.form.submit();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  onLogoLoadingFailure(errModel: LocalError): void {
    this._notificationService.notify(createNotification(errModel));
  }

  onGalleryImageLoadingFailure(errModel: LocalError): void {
    this._notificationService.notify(createNotification(errModel));
  }

  async openTagSelection(): Promise<void> {
    try {
      this._state = this._states.tagsSelection;
      await this._children.tagsSelectionPM.hydrateTags({
        types: [TagType.CUISINE, TagType.VENUE, TagType.HASH_TAG],
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  closeTagsSelection(): void {
    this._state = this._states.default;
  }

  get tagsSelectionsList(): BottomSheetListGroup<UnifiedTag>[] {
    return this._children.tagsSelectionPM.tagsSelectionsList;
  }

  get shouldShowSelectionsList(): boolean {
    return this._state.shouldShowSelectionsList;
  }

  get canSubmit(): boolean {
    return this.form.submittable;
  }

  async openAddContactPersonForm(): Promise<void> {
    this.contactPersonForm.reset();
    this._state = this._states.addContactPerson;
  }

  async closeAddContactPersonForm(): Promise<void> {
    this._state = this._states.default;
  }

  get shouldShowContactPersonBottomSheet(): boolean {
    return this._states.addContactPerson === this._state;
  }

  onOrderingSystemChanged(val: string): void {
    this.form.orderingSystem = new OrderingSystem(val).valueOf();
    this.form.deliverBy = new DeliveryFleet('NONE').valueOf();
    this.form.estimatedDeliveryTimeInMinutes = 0;
    this.form.dispatchingModel = new DispatchingModel('NONE').valueOf();

    this.form.fakeVendor =
      this.form.orderingSystem === OrderingSystem.FAKE_VENDOR.valueOf();
  }

  get shouldShowDeliverBy(): boolean {
    return (
      OrderingSystem.BRANCHES_DASHBOARD.equals(this.form.orderingSystem) ||
      OrderingSystem.CALL_CENTER_DASHBOARD.equals(this.form.orderingSystem)
    );
  }

  get shouldShowEstimatedDeliveryTime(): boolean {
    return DeliveryFleet.VENDOR_FLEET.equals(this.form.deliverBy);
  }

  get shouldShowDispatchingModel(): boolean {
    return OrderingSystem.FAKE_VENDOR.equals(this.form.orderingSystem);
  }

  get hasVendorUsers(): number {
    return this.form.contactPeople.length;
  }

  deleteContact(contactIndex: number): void {
    this.form.contactPeople.splice(contactIndex, 1);
  }

  // Function not needed in creation, should be removed after the separation
  async showAffectedUntaxedCataloguesDialog(): Promise<number> {
    await this._longProcess(async () => {
      return 0;
    });

    return 0;
  }

  // Function not needed in creation, should be removed after the separation
  hideAffectedUntaxedCataloguesDialog(): void {
    this.isOpenedAffectedTaxedCataloguesDialog = false;
  }

  private _assignFormHandlers(): void {
    this.form
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._vendorOnlineProfileRepo.createProfile(this.form);
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  private _assignContactPersonFormHandlers(): void {
    this.contactPersonForm.assignSubmitHandler(async () => {
      const contactPerson: ContactPerson = new ContactPerson({
        id: 0,
        fullName: this.contactPersonForm.name,
        mobileNo: this.contactPersonForm.mobileNumber,
        title: this.contactPersonForm.title,
        email: this.contactPersonForm.email,
      });
      this.form.contactPeople.push(contactPerson);
    });
  }
}
interface VendorOnlineProfileCreationPMOptions {
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
  vendorType: VendorType;
  children: VendorOnlineProfileCreationPMChildren;
}

interface VendorOnlineProfileCreationPMChildren {
  tagsSelectionPM: TagsSelectionPM;
  vendorOpsProfileListPM: VendorOpsProfileListPM;
}

interface VendorOnlineProfileCreationPMState {
  shouldShowOpsVendors: boolean;
  shouldShowSelectionsList: boolean;
  shouldShowContactPersonBottomSheet: boolean;
}

interface VendorOnlineProfileCreationPMStates {
  default: VendorOnlineProfileCreationPMState;
  tagsSelection: VendorOnlineProfileCreationPMState;
  opsVendorSelection: VendorOnlineProfileCreationPMState;
  addContactPerson: VendorOnlineProfileCreationPMState;
}
