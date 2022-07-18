import { BranchProfileListItem } from './Branch';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { TaxTier } from './TaxTier';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTag } from './UnifiedTag';

export class CatalogueStatus extends EnumClass {
  protected readonly _prefix: string;
  static DRAFT = new CatalogueStatus('DRAFT');
  static READY = new CatalogueStatus('READY');
  static PUBLISHED = new CatalogueStatus('PUBLISHED');

  constructor(value: string) {
    super(value);
    this._prefix = 'CATALOGUE_STATUS';
  }
}

export class Catalogue implements CatalogueOptions {
  id: EntityId = 0;
  displayName = new MultilingualString();
  description = new MultilingualString();
  catalogueSections: CatalogueSection[] = [];
  publishedBranches: CataloguePublishedBranch[] = [];
  status = CatalogueStatus.DRAFT;
  orderingHours = new HoursRange();

  constructor(options?: CatalogueOptions) {
    Object.assign(this, options);
  }
}

export class CatalogueSection implements CatalogueSectionOptions {
  id = 0;
  displayName = new MultilingualString();
  taxTier = new TaxTier();
  items = [
    {
      id: 0,
      displayName: new MultilingualString(),
      description: new MultilingualString(),
      calories: 0,
      prepTime: 0,
      price: new Money(),
      tags: [],
      icon: '',
      popular: false,
      archived: false,
    },
  ];

  creationDate = new Datetime(0);

  constructor(options?: CatalogueSectionOptions) {
    Object.assign(this, options);
  }
}

export class UntaxedCatalogue implements UntaxedCatalogueOptions {
  id = 0;
  displayName = new MultilingualString();

  constructor(options?: UntaxedCatalogueOptions) {
    Object.assign(this, options);
  }
}

export interface CatalogueForm {
  displayName: { en: string; ar: string };
  description: { en: string; ar: string };
  orderingHours: { from: Time; to: Time };
  branches: BranchProfileListItem[];
}

export interface CataloguePublishedBranch {
  id: EntityId;
  displayName: MultilingualString;
}

interface CatalogueOptions {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  catalogueSections: CatalogueSection[];
  publishedBranches: CataloguePublishedBranch[];
  status: CatalogueStatus;
  orderingHours: HoursRange;
}

export interface CatalogueSectionItem {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  calories: number;
  prepTime: number;
  price: Money;
  tags: UnifiedTag[];
  popular: boolean;
  archived: boolean;
}

interface CatalogueSectionOptions {
  id: EntityId;
  displayName: MultilingualString;
  taxTier: TaxTier;
  items: CatalogueSectionItem[];
  creationDate: Datetime;
}

export interface SimplifiedCatalogueSection {
  id: EntityId;
  displayName: MultilingualString;
  creationDate: Datetime;
}

export interface UntaxedCatalogueOptions {
  id: EntityId;
  displayName: MultilingualString;
}
