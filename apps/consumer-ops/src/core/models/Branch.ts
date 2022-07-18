import { Address } from '@survv/commons/core/models/Address';
import { Area } from './Area';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { City } from './City';
import { ContactPerson } from './ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId, Translatable } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { HashTag } from './HashTag';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Tag } from './Tag';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTag } from './UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { isEmpty } from '@survv/commons/core/utils/checks';

export class BranchServiceType extends EnumClass {
  _prefix: string;

  static B2B = new BranchServiceType('B2B');
  static B2C = new BranchServiceType('B2C');

  constructor(value: string) {
    super(value);
    this._prefix = 'BRANCH_SERVICE_TYPE';
  }
}

export class Branch implements BranchOptions {
  id = 0;
  hubId = 0;
  vendorId = 0;
  label = '';
  vendorLabel = '';
  vendorName = '';
  notificationToken = '';
  notificationSubscription = {
    auth: '',
    key: '',
    endpoint: '',
  };

  displayName = new MultilingualString();
  address = new Address();
  minimumOrderValue = 0;
  avgTransactionPerMonth = 0;
  avgTransactionPerDay = 0;
  avgTransactionPerHour = 0;
  avgBasketSize = 0;
  stacking = false;
  active = false;
  maxStackedOrders = 0;
  stackingWindowInMinutes = 0;
  deliveryFees = new Money();

  tags: Tag[] = [];
  hashTags: HashTag[] = [];
  contactPersons: ContactPerson[] = [];
  serviceTypes: BranchServiceType[] = [];
  b2cStatus = new BranchB2CStatus('');
  rushHours = [] as HoursRange[];
  orderingHours = new HoursRange();
  vendorType = new VendorType('');
  creationDate = new Datetime(0);

  city = new City();
  area = new Area();
  posIntegrated = false;
  posIntegrationType = 'NONE';

  constructor(options?: BranchOptions) {
    Object.assign(this, options);
  }
}

export class CampaignBranch implements CampaignBranchOptions {
  id = 0;
  label = '';

  constructor(options?: CampaignBranchOptions) {
    Object.assign(this, options);
  }
}

export class BranchProfileListItem {
  id: EntityId;
  label: string;
  displayName: MultilingualString;
  vendorId: EntityId;
  active: boolean;
  hasCompleteProfile: boolean;
  minimumOrderValue: Money;
  orderingHours: HoursRange;
  avgBasketSize: Money;
  posIntegrated?: boolean;
  posIntegrationType?: string;

  constructor(item: BranchProfileListItemOptions) {
    this.id = item.id;
    this.label = item.label;
    this.displayName = item.displayName;
    this.vendorId = item.vendorId;
    this.active = item.active;
    this.hasCompleteProfile = item.hasCompleteProfile;
    this.minimumOrderValue = item.minimumOrderValue;
    this.orderingHours = item.orderingHours;
    this.avgBasketSize = item.avgBasketSize;
    this.posIntegrated = item.posIntegrated;
    this.posIntegrationType = item.posIntegrationType;
  }

  get hasMissingName(): boolean {
    return isEmpty(this.displayName.en) && isEmpty(this.displayName.ar);
  }

  get name(): Translatable {
    return this.hasMissingName ? this.label : this.displayName;
  }
}

interface CampaignBranchOptions {
  id: EntityId;
  label: string;
}

interface BranchOptions {
  id: EntityId;
  hubId?: EntityId;
  vendorId: EntityId;
  label: string;
  vendorLabel?: string;
  vendorName?: string;
  notificationToken?: string;
  notificationSubscription?: {
    auth: string;
    key: string;
    endpoint: string;
  };
  displayName?: MultilingualString;
  address?: Address;
  minimumOrderValue?: number;
  avgTransactionPerMonth?: number;
  avgTransactionPerDay?: number;
  avgTransactionPerHour?: number;
  avgBasketSize?: number;
  stacking?: boolean;
  active?: boolean;
  maxStackedOrders?: number;
  stackingWindowInMinutes?: number;
  deliveryFees?: Money;

  tags?: Tag[];
  hashTags?: HashTag[];
  contactPersons?: ContactPerson[];
  serviceTypes?: BranchServiceType[];
  b2cStatus?: BranchB2CStatus;
  rushHours?: HoursRange[];
  orderingHours?: HoursRange;
  vendorType?: VendorType;
  creationDate?: Datetime;
  city?: City;
  area?: Area;
  posIntegrated?: boolean;
  posIntegrationType?: string;
}

export interface BranchProfileForm {
  displayName: { en: string; ar: string };
  minimumOrderValue: number;
  orderingHours: { from: Time; to: Time };
  tags: UnifiedTag[];
  avgBasketSize: number;
  posIntegrated: boolean;
  posIntegrationType: string;
}

interface BranchProfileListItemOptions {
  id: EntityId;
  label: string;
  displayName: MultilingualString;
  vendorId: EntityId;
  active: boolean;
  hasCompleteProfile: boolean;
  minimumOrderValue: Money;
  orderingHours: HoursRange;
  avgBasketSize: Money;
  posIntegrated?: boolean;
  posIntegrationType?: string;
}
