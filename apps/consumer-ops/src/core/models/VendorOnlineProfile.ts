/* eslint-disable max-classes-per-file */
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { BaseForm } from '@survv/commons/core/models/Forms';
import { CatalogueStatus } from './Catalogue';
import { ContactPerson } from './ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { DeliveryFleet } from './DeliveryFleet';
import { DispatchingModel } from './DispatchingModel';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormValidationResult,
  isValidMoney,
  requireAtLeastOne,
  required,
} from '@survv/commons/core/validations/form-validators/formValidators';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { OrderingSystem } from './OrderingSystem';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTag } from './UnifiedTag';
import { Validators } from '@survv/commons/core/base/BasePM';
import { VendorType } from '@survv/commons/core/models/VendorType';

export class VendorTaxStatusType extends EnumClass {
  protected readonly _prefix: string;
  static NOT_APPLICABLE = new VendorTaxStatusType('NOT_APPLICABLE');
  static INCLUDED = new VendorTaxStatusType('INCLUDED');
  static EXCLUDED = new VendorTaxStatusType('EXCLUDED');

  constructor(value: string) {
    super(value);
    this._prefix = 'VENDOR_TASK_STATUS_TYPE';
  }
}

export class VendorPosIntegrationType extends EnumClass {
  protected readonly _prefix: string;
  static LINETEN = new VendorPosIntegrationType('LINETEN');
  static NONE = new VendorPosIntegrationType('NONE');

  constructor(value: string) {
    super(value);
    this._prefix = 'VENDOR_POS_INTEGRATION_TYPE';
  }
}

export class VendorOnlineProfileForm
  extends BaseForm
  implements VendorOnlineProfileFormInputs
{
  protected _initialValues = {
    logo: '',
    languageSupport: { en: false, ar: false },
    name: { en: '', ar: '' },
    label: '',
    description: { en: '', ar: '' },
    taxStatus: '',
    minimumOrderValue: 0,
    orderingHours: { from: new Time('22:00:00'), to: new Time('22:00:00') },
    averagePreparationTime: 0,
    tags: [],
    gallery: [],
    coverPhoto: '',
    active: false,
    fakeVendor: false,
    legalInfo: {
      companyAddress: '',
      companyName: '',
    },
    orderingSystem: '',
    contactPeople: [],
    deliverBy: 'NONE',
    dispatchingModel: 'NONE',
    estimatedDeliveryTimeInMinutes: 0,
    deliveryFees: 0,
    vendorType: '',
  };

  logo: Base64EncodedFile | ImageUrlString = '';
  languageSupport = { en: false, ar: false };
  label = '';
  name = { en: '', ar: '' };
  description = { en: '', ar: '' };
  taxStatus = '';
  minimumOrderValue = 0;
  orderingHours = { from: new Time('22:00:00'), to: new Time('22:00:00') };
  averagePreparationTime = 0;
  tags: UnifiedTag[] = [];
  gallery: (Base64EncodedFile | ImageUrlString)[] = [];
  coverPhoto: Base64EncodedFile | ImageUrlString = '';
  fakeVendor = false;
  active = false;
  legalInfo = {
    companyAddress: '',
    companyName: '',
  };

  vendorType = '';
  orderingSystem = '';
  contactPeople = [] as ContactPerson[];
  deliverBy = 'NONE';
  dispatchingModel = 'NONE';
  estimatedDeliveryTimeInMinutes = 0;
  deliveryFees = 0;
  posIntegrated = false;
  posIntegrationType = 'NONE';

  static fromVendorOnlineProfile(
    profile: VendorOnlineProfile
  ): VendorOnlineProfileForm {
    const {
      logo,
      languageSupport,
      label,
      name,
      description,
      taxStatus,
      minimumOrderValue,
      orderingHours,
      averagePreparationTime,
      tags,
      gallery,
      cover,
      active,
      legalInfo,
      orderingSystem,
      vendorType,
      contactPeople,
      fake,
      dispatchingModel,
      deliverBy,
      estimatedDeliveryTimeInMinutes,
      deliveryFees,
      posIntegrated,
      posIntegrationType,
    } = profile;
    return new VendorOnlineProfileForm({
      formInputs: {
        logo,
        languageSupport,
        label,
        tags,
        active,
        legalInfo,
        contactPeople,
        estimatedDeliveryTimeInMinutes,
        deliveryFees: deliveryFees.valueOf(),
        gallery: [cover, ...gallery],
        coverPhoto: cover,
        fakeVendor: fake,
        orderingHours: { from: orderingHours.from, to: orderingHours.to },
        averagePreparationTime,
        name: { en: name.en, ar: name.ar },
        description: { en: description.en, ar: description.ar },
        minimumOrderValue: minimumOrderValue.valueOf(),
        taxStatus: taxStatus.valueOf(),
        vendorType: vendorType.valueOf(),
        orderingSystem: orderingSystem.valueOf(),
        dispatchingModel: dispatchingModel.valueOf(),
        deliverBy: deliverBy.valueOf(),
        posIntegrated,
        posIntegrationType: posIntegrationType.valueOf(),
      },
    });
  }

  constructor(options?: VendorOnlineProfileFormOptions) {
    super();
    this._init(options);
  }

  get validators(): Validators {
    return {
      'logo': (): FormValidationResult => {
        return required(this.logo);
      },
      'label': (): FormValidationResult => {
        return required(this.label);
      },
      'languageSupport': (): FormValidationResult => {
        return requireAtLeastOne([
          this.languageSupport.en,
          this.languageSupport.ar,
        ]);
      },
      'name.en': (): FormValidationResult => {
        if (this.languageSupport.en) return required(this.name.en);
        return true;
      },
      'name.ar': (): FormValidationResult => {
        if (this.languageSupport.ar) return required(this.name.ar);
        return true;
      },
      'legalInfo.companyName': (): FormValidationResult => {
        return required(this.legalInfo.companyName);
      },
      'legalInfo.companyAddress': (): FormValidationResult => {
        return required(this.legalInfo.companyAddress);
      },
      'orderingSystem': (): FormValidationResult => {
        return required(this.orderingSystem.valueOf());
      },
      'deliverBy': (): FormValidationResult => {
        if (
          (OrderingSystem.CALL_CENTER_DASHBOARD.equals(this.orderingSystem) ||
            OrderingSystem.BRANCHES_DASHBOARD.equals(this.orderingSystem)) &&
          !this.deliverBy
        )
          return required(this.deliverBy);
        return true;
      },
      'dispatchingModel': (): FormValidationResult => {
        if (
          OrderingSystem.FAKE_VENDOR.equals(this.orderingSystem) &&
          !this.dispatchingModel
        ) {
          return required(this.dispatchingModel);
        }
        return true;
      },
      'estimatedDeliveryTimeInMinutes': (): FormValidationResult => {
        if (
          DeliveryFleet.VENDOR_FLEET.equals(this.deliverBy) &&
          (this.estimatedDeliveryTimeInMinutes <= 0 ||
            !this.estimatedDeliveryTimeInMinutes)
        ) {
          return required(this.estimatedDeliveryTimeInMinutes);
        }
        return true;
      },
      'deliveryFees': (): FormValidationResult => {
        if (
          DeliveryFleet.VENDOR_FLEET.equals(this.deliverBy) &&
          (this.deliveryFees <= 0 || !this.deliveryFees)
        ) {
          return required(this.deliveryFees);
        }
        return true;
      },
      'orderingHours.from': (): FormValidationResult => {
        return required(this.orderingHours.from.valueOf());
      },
      'orderingHours.to': (): FormValidationResult => {
        return required(this.orderingHours.to.valueOf());
      },
      'minimumOrderValue': (): FormValidationResult => {
        return isValidMoney(this.minimumOrderValue);
      },
      'taxStatus': (): FormValidationResult => {
        return required(this.taxStatus);
      },
      'contactPeople': (): FormValidationResult => {
        return required(this.contactPeople);
      },
      'averagePreparationTime': (): FormValidationResult => {
        return required(this.averagePreparationTime);
      },
      'gallery': (): FormValidationResult => {
        return required(this.gallery);
      },
      'coverPhoto': (): FormValidationResult => {
        return required(this.coverPhoto);
      },
    };
  }
}

export class LanguageSupport {
  readonly en: boolean = true;
  readonly ar: boolean = false;

  constructor(options?: LanguageSupportOptions) {
    Object.assign(this, options);
  }
}

export class VendorOnlineProfile implements VendorOnlineProfileOptions {
  vendorId: EntityId = 0;
  ledgerId: EntityId = 0;
  name: MultilingualString = new MultilingualString();
  description: MultilingualString = new MultilingualString();
  languageSupport: LanguageSupport = new LanguageSupport();
  vendorType = new VendorType('');
  branchesCount = 0;
  activeBranchesCount = 0;
  transactionCount = 0;
  maxStackedOrders = 0;
  rating = 0;
  stacking = false;
  stackingWindowInMinutes = 0;
  fake = false;
  label = '';
  cover = '';
  logo = '';
  taxStatus = new VendorTaxStatusType('');
  minimumOrderValue: Money = new Money();
  orderingHours: HoursRange = new HoursRange();
  averagePreparationTime = 0;
  tags: UnifiedTag[] = [];
  gallery: ImageUrlString[] = [];
  catalogues: VendorOnlineProfileCatalogue[] = [];
  active = false;
  legalInfo = { companyAddress: '', companyName: '' };
  orderingSystem = new OrderingSystem('');
  contactPeople = [];
  creationDate = new Datetime('');
  deliverBy = new DeliveryFleet('NONE');
  dispatchingModel = new DispatchingModel('NONE');
  estimatedDeliveryTimeInMinutes = 0;
  deliveryFees = new Money();
  posIntegrated = false;
  posIntegrationType = VendorPosIntegrationType.NONE;

  constructor(options?: VendorOnlineProfileOptions) {
    Object.assign(this, options);
  }
}

export class VendorOnlineProfileListItem {
  vendorId = 0;
  name = new MultilingualString();
  cataloguesCount = 0;
  logo = '';
  active = false;
  branchesCount = 0;
  posIntegrated = false;
  posIntegrationType = VendorPosIntegrationType.NONE;

  constructor(options?: VendorOnlineProfileListItemOptions) {
    Object.assign(this, options);
  }
}

export class VendorOpsProfileListItem {
  vendorId: EntityId;
  name: string;
  logo: ImageUrlString;
  constructor(options: VendorOpsProfileListItemOptions) {
    const { vendorId, name, logo } = options;
    this.vendorId = vendorId;
    this.name = name;
    this.logo = logo;
  }
}

export class VendorOnlineProfileList
  implements ItemsList<VendorOnlineProfileListItem>
{
  totalItemsCount: number;
  items: VendorOnlineProfileListItem[];

  constructor(options: ItemsList<VendorOnlineProfileListItem>) {
    this.totalItemsCount = options.totalItemsCount;
    this.items = options.items;
  }
}

export class VendorOpsProfileList
  implements ItemsList<VendorOpsProfileListItem>
{
  totalItemsCount: number;
  items: VendorOpsProfileListItem[];

  constructor(options: ItemsList<VendorOpsProfileListItem>) {
    this.totalItemsCount = options.totalItemsCount;
    this.items = options.items;
  }
}

interface VendorOnlineProfileOptions {
  vendorId: EntityId;
  ledgerId: EntityId;
  label: string;
  cover: string;
  logo: string;
  name: MultilingualString;
  description: MultilingualString;
  languageSupport: LanguageSupport;
  taxStatus: VendorTaxStatusType;
  minimumOrderValue: Money;
  orderingHours: HoursRange;
  branchesCount: number;
  activeBranchesCount: number;
  averagePreparationTime: number;
  tags: UnifiedTag[];
  gallery: ImageUrlString[];
  catalogues: VendorOnlineProfileCatalogue[];
  fake: boolean;
  active: boolean;
  legalInfo: {
    companyAddress: string;
    companyName: string;
  };
  orderingSystem: OrderingSystem;
  contactPeople: ContactPerson[];
  deliverBy: DeliveryFleet;
  dispatchingModel: DispatchingModel;
  vendorType: VendorType;
  estimatedDeliveryTimeInMinutes: number;
  deliveryFees: Money;
  transactionCount: number;
  stacking: boolean;
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
  rating: number;
  creationDate: Datetime;
  posIntegrated: boolean;
  posIntegrationType: VendorPosIntegrationType;
}
interface VendorOnlineProfileCatalogue {
  id: EntityId;
  displayName: MultilingualString;
  status: CatalogueStatus;
}

interface VendorOnlineProfileListItemOptions {
  vendorId: EntityId;
  name: NonNullable<MultilingualString>;
  cataloguesCount: number;
  branchesCount: number;
  logo: ImageUrlString;
  active: boolean;
  posIntegrated: boolean;
  posIntegrationType: VendorPosIntegrationType;
}

interface VendorOpsProfileListItemOptions {
  vendorId: EntityId;
  name: string;
  logo: ImageUrlString;
}

interface LanguageSupportOptions {
  readonly en: boolean;
  readonly ar: boolean;
}

interface VendorOnlineProfileFormInputs {
  logo: Base64EncodedFile | ImageUrlString;
  languageSupport: { en: boolean; ar: boolean };
  label: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  taxStatus: string;
  minimumOrderValue: number;
  fakeVendor: boolean;
  orderingHours: { from: Time; to: Time };
  averagePreparationTime: number;
  tags: UnifiedTag[];
  gallery: (Base64EncodedFile | ImageUrlString)[];
  coverPhoto: Base64EncodedFile | ImageUrlString;
  active: boolean;
  vendorType: string;
  legalInfo: {
    companyAddress: string;
    companyName: string;
  };
  orderingSystem: string;
  contactPeople: ContactPerson[];
  deliverBy: string;
  dispatchingModel: string;
  estimatedDeliveryTimeInMinutes: number;
  deliveryFees: number;
  posIntegrated: boolean;
  posIntegrationType: string;
}

interface VendorOnlineProfileFormOptions {
  formInputs: VendorOnlineProfileFormInputs;
}
