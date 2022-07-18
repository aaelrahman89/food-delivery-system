import { EntityId } from '@survv/commons/core/types';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class CatalogueItemOption implements CatalogueItemOptionArgs {
  id = 0;
  displayName = new MultilingualString();
  description = new MultilingualString();
  mandatory = false;
  multiSelection = false;
  minAllowed = 0;
  maxAllowed = 1;
  selections: CatalogueItemOptionSelection[] = [];

  constructor(options?: CatalogueItemOptionArgs) {
    Object.assign(this, options);
  }
}

export class CatalogueItemOptionSelection
  implements CatalogueItemOptionSelectionArgs
{
  displayName = new MultilingualString();
  price = new Money();
  id = 0;

  constructor(options?: CatalogueItemOptionSelectionArgs) {
    Object.assign(this, options);
  }
}

interface CatalogueItemOptionArgs {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  mandatory: boolean;
  multiSelection: boolean;
  minAllowed: number;
  maxAllowed: number;
  selections: CatalogueItemOptionSelectionArgs[];
}

interface CatalogueItemOptionSelectionArgs {
  id: EntityId;
  displayName: MultilingualString;
  price: Money;
}
