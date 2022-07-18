import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
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
  status = CatalogueStatus.DRAFT;
  orderingHours = new HoursRange();

  constructor(options?: CatalogueOptions) {
    Object.assign(this, options);
  }
}

export class CatalogueSection implements CatalogueSectionOptions {
  id = 0;
  displayName = new MultilingualString();
  items = [
    {
      id: 0,
      displayName: new MultilingualString(),
      description: new MultilingualString(),
      calories: 0,
      prepTime: 0,
      price: new Money(),
      tags: [],
      popular: false,
      available: false,
      coverPhoto: '',
    },
  ];

  creationDate = new Datetime(0);

  constructor(options?: CatalogueSectionOptions) {
    Object.assign(this, options);
  }
}

export class CataloguesListItem implements CataloguesListItemOptions {
  id = 0;
  displayName = new MultilingualString();

  constructor(options?: CataloguesListItemOptions) {
    Object.assign(this, options);
  }
}

interface CatalogueOptions {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  catalogueSections: CatalogueSection[];
  status: CatalogueStatus;
  orderingHours: HoursRange;
}

interface CatalogueSectionOptions {
  id: EntityId;
  displayName: MultilingualString;
  items: CatalogueSectionItem[];
  creationDate: Datetime;
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
  available: boolean;
  coverPhoto: ImageUrlString;
}

export interface CataloguesListItemOptions {
  id: EntityId;
  displayName: MultilingualString;
}
