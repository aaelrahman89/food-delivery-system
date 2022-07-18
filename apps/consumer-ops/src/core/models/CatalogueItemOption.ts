import { EntityId } from '@survv/commons/core/types';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class CatalogueItemOption implements CatalogueItemOptionOptions {
  id = 0;
  displayName = new MultilingualString();
  description = new MultilingualString();
  mandatory = false;
  multiSelection = false;
  minAllowed = 0;
  maxAllowed = 0;
  selections: CatalogueItemOptionSelection[] = [];
  template = false;
  constructor(options?: CatalogueItemOptionOptions) {
    Object.assign(this, options);
  }
}

export class CatalogueItemOptionSelection
  implements CatalogueItemOptionSelectionOptions
{
  id = 0;
  displayName = new MultilingualString();
  calories = 0;
  price = new Money();
  relatedOptions = [] as RelatedOption[];
  constructor(options?: CatalogueItemOptionSelectionOptions) {
    Object.assign(this, options);
  }
}

interface CatalogueItemOptionOptions {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  mandatory: boolean;
  multiSelection: boolean;
  minAllowed: number;
  maxAllowed: number;
  selections: CatalogueItemOptionSelectionOptions[];
  template: boolean;
}

interface CatalogueItemOptionSelectionOptions {
  id: EntityId;
  displayName: MultilingualString;
  calories: number;
  price: Money;
  relatedOptions: RelatedOption[];
}

export interface RelatedOption {
  optionId: number;
  displayName: MultilingualString;
  selectionName: MultilingualString;
  selectionId: EntityId;
  selectionOptionName: MultilingualString;
  selectionOptionId: EntityId;
  mandatory: boolean;
  multiSelection: boolean;
  minAllowed: number;
  maxAllowed: number;
  selections: {
    id: EntityId;
    displayName: MultilingualString;
    calories: number;
    price: Money;
  }[];
}
